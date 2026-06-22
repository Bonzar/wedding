#!/usr/bin/env node
/**
 * Захват ЭТАЛОНА с ЖИВОГО canva-сайта (design06) — переустановление истины.
 * НИЧЕМУ сохранённому не доверяем: рендерим публикацию заново при ширине 440 (DPR 2),
 * как лист приложения. Пишем refs/ref-render/truth_live.png и сверяем с page0_tall.png.
 *
 *   node tools/ref-capture.mjs
 */
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "refs/ref-render");
const URL = process.env.REF_URL || "https://lysfilter.my.canva.site/design06/";
const WIDTH = Number(process.env.REF_WIDTH || 440);

function diff(aBuf, bBuf) {
  const a = PNG.sync.read(aBuf);
  const b = PNG.sync.read(bBuf);
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  const da = new PNG({ width: w, height: h });
  const db = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = ((a.width * y + x) << 2), j = ((b.width * y + x) << 2), k = ((w * y + x) << 2);
    da.data[k] = a.data[i]; da.data[k+1] = a.data[i+1]; da.data[k+2] = a.data[i+2]; da.data[k+3] = a.data[i+3];
    db.data[k] = b.data[j]; db.data[k+1] = b.data[j+1]; db.data[k+2] = b.data[j+2]; db.data[k+3] = b.data[j+3];
  }
  const out = new PNG({ width: w, height: h });
  const n = pixelmatch(da.data, db.data, out.data, w, h, { threshold: 0.1 });
  return { n, ratio: n / (w * h), w, h, dimA: [a.width, a.height], dimB: [b.width, b.height] };
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
console.log("навигация:", URL, "@", WIDTH);
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(() => document.fonts && document.fonts.ready);
// прокрутка до конца — ленивые блоки/шрифты
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0; const step = () => { window.scrollTo(0, y); y += 800;
      if (y < document.body.scrollHeight) setTimeout(step, 60); else { window.scrollTo(0, 0); setTimeout(res, 400); } };
    step();
  });
});
await page.waitForTimeout(1200);
const full = await page.screenshot({ fullPage: true });
writeFileSync(resolve(OUT, "truth_live.png"), full);
const meta = PNG.sync.read(full);
console.log("truth_live.png:", meta.width, "x", meta.height);

for (const name of ["page0_tall.png", "design06_full.png"]) {
  const p = resolve(OUT, name);
  if (!existsSync(p)) { console.log(name, "— нет файла"); continue; }
  const r = diff(full, readFileSync(p));
  console.log(`vs ${name}: mismatch=${(r.ratio*100).toFixed(2)}%  pix=${r.n}  cmp=${r.w}x${r.h}  live=${r.dimA.join("x")} saved=${r.dimB.join("x")}`);
}
await browser.close();
