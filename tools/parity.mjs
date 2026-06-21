#!/usr/bin/env node
/**
 * Парити-инструмент (визуальная сверка с рефом).
 *
 * Рендерит КАЖДУЮ секцию двумя способами при ОДНОЙ ширине листа 440px:
 *   ref   — эталон refs/sections/<name>.html  (доведённый агентом «к рефам» дамп)
 *   react — наша React-секция (живой dev-сервер)
 * Пиксельно сравнивает (pixelmatch), пишет diff-картинки и HTML-отчёт
 * refs/ref-render/parity/report.html + JSON со счётом расхождений по секциям.
 *
 * Это переосмысление прежнего итеративного сравнения рендеров. Запуск:
 *   npm run parity
 * (сам поднимает временный vite на :5183, потом гасит).
 */
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "refs/ref-render/parity");
const PORT = Number(process.env.PARITY_PORT || 5183);
const WIDTH = 440;

const SECTIONS = [
  "hero", "wedding-of", "countdown", "calendar", "location", "timeline",
  "details", "attire", "gift", "journey", "rsvp", "survey", "closing",
];
// секции с динамическим контентом (список/таймер) — расхождение ожидаемо, не баг
const DYNAMIC = new Set(["countdown", "survey"]);

for (const d of ["ref", "react", "diff"]) mkdirSync(resolve(OUT, d), { recursive: true });

async function waitForServer(url, tries = 100) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* ещё не поднялся */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`dev server ${url} не поднялся`);
}

function cropTo(png, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = ((png.width * y + x) << 2);
      const j = ((w * y + x) << 2);
      out.data[j] = png.data[i];
      out.data[j + 1] = png.data[i + 1];
      out.data[j + 2] = png.data[i + 2];
      out.data[j + 3] = png.data[i + 3];
    }
  }
  return out;
}

function diffPair(aBuf, bBuf) {
  const a = PNG.sync.read(aBuf);
  const b = PNG.sync.read(bBuf);
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  const ca = cropTo(a, w, h);
  const cb = cropTo(b, w, h);
  const diff = new PNG({ width: w, height: h });
  const n = pixelmatch(ca.data, cb.data, diff.data, w, h, { threshold: 0.1 });
  return { n, w, h, ratio: n / (w * h), diffPng: PNG.sync.write(diff), dimA: [a.width, a.height], dimB: [b.width, b.height] };
}

async function main() {
  console.log("parity: поднимаю vite на :" + PORT + " …");
  const server = spawn("node", ["node_modules/vite/bin/vite.js", "--port", String(PORT), "--strictPort"], {
    cwd: ROOT,
    stdio: "ignore",
  });
  try {
    await waitForServer(`http://localhost:${PORT}/`);
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();

    // 1) React-рендер: грузим SPA один раз, снимаем каждую секцию по индексу
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "#theme-bar{display:none!important}" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const reactBufs = {};
    for (let i = 0; i < SECTIONS.length; i++) {
      const sec = page.locator("main.sheet > section").nth(i);
      await sec.scrollIntoViewIfNeeded();
      reactBufs[SECTIONS[i]] = await sec.screenshot();
      writeFileSync(resolve(OUT, "react", SECTIONS[i] + ".png"), reactBufs[SECTIONS[i]]);
    }

    // 2) Ref-рендер: открываем каждый refs/sections/<name>.html отдельно
    const refBufs = {};
    for (const name of SECTIONS) {
      const fileUrl = "file://" + resolve(ROOT, "refs/sections", name + ".html");
      await page.goto(fileUrl, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      const sheet = page.locator("main.sheet");
      refBufs[name] = await sheet.screenshot();
      writeFileSync(resolve(OUT, "ref", name + ".png"), refBufs[name]);
    }

    await browser.close();

    // 3) diff + отчёт
    const rows = [];
    for (const name of SECTIONS) {
      const { n, w, h, ratio, diffPng, dimA, dimB } = diffPair(refBufs[name], reactBufs[name]);
      writeFileSync(resolve(OUT, "diff", name + ".png"), diffPng);
      rows.push({ name, mismatch: ratio, pixels: n, size: `${w}x${h}`, ref: dimA.join("x"), react: dimB.join("x"), dynamic: DYNAMIC.has(name) });
    }
    writeFileSync(resolve(OUT, "parity.json"), JSON.stringify(rows, null, 2));
    writeFileSync(resolve(OUT, "report.html"), renderReport(rows));

    console.log("\nparity (ширина 440px): расхождение ref↔react по секциям\n");
    for (const r of rows) {
      const pct = (r.mismatch * 100).toFixed(2) + "%";
      const flag = r.dynamic ? " (динамическая — ожидаемо)" : r.mismatch > 0.02 ? "  <-- ПРОВЕРИТЬ" : "";
      console.log(`  ${r.name.padEnd(12)} ${pct.padStart(7)}  ref=${r.ref} react=${r.react}${flag}`);
    }
    console.log("\nотчёт: refs/ref-render/parity/report.html\n");
  } finally {
    server.kill("SIGTERM");
  }
}

function renderReport(rows) {
  const cells = rows
    .map((r) => {
      const pct = (r.mismatch * 100).toFixed(2) + "%";
      const bad = !r.dynamic && r.mismatch > 0.02;
      return `<tr class="${bad ? "bad" : ""}">
        <td>${r.name}${r.dynamic ? " <em>(динамич.)</em>" : ""}<br><b>${pct}</b><br><small>ref ${r.ref} · react ${r.react}</small></td>
        <td><img src="ref/${r.name}.png"></td>
        <td><img src="react/${r.name}.png"></td>
        <td><img src="diff/${r.name}.png"></td>
      </tr>`;
    })
    .join("\n");
  return `<!doctype html><meta charset="utf-8"><title>Parity report</title>
<style>
  body{font:14px system-ui;margin:24px;background:#f6f1e8}
  h1{font-weight:600}
  table{border-collapse:collapse;width:100%}
  th{position:sticky;top:0;background:#344f73;color:#fff;padding:8px;text-align:left}
  td{vertical-align:top;border-bottom:1px solid #ccc;padding:8px}
  td img{width:300px;display:block;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)}
  tr.bad td:first-child{color:#b03b3b;font-weight:700}
  small{color:#666}
</style>
<h1>Сверка секций: эталон (refs/sections) ↔ React, ширина 440px</h1>
<table><thead><tr><th>Секция / расхождение</th><th>Эталон (ref)</th><th>React</th><th>Diff</th></tr></thead>
<tbody>${cells}</tbody></table>`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
