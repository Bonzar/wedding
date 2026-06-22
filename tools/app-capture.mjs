#!/usr/bin/env node
/**
 * Свежий захват ТЕКУЩЕГО приложения при ширине листа 440 (DPR 2 → 880px как эталон).
 * Пишет:
 *   refs/ref-render/app_full.png            — весь лист одним изображением
 *   refs/ref-render/app/<NN>_<name>.png     — каждая секция отдельно
 *   refs/ref-render/app-sections.json       — [{name, yCss, hCss}] (CSS-px @440)
 * Ничему сохранённому не доверяем — это пересъёмка истины из живого кода.
 */
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "refs/ref-render");
const APPDIR = resolve(OUT, "app");
const PORT = Number(process.env.APP_PORT || 5184);
const WIDTH = 440;
const NAMES = ["hero","wedding-of","countdown","calendar","location","timeline","details","attire","gift","journey","collage","rsvp","closing"];

mkdirSync(APPDIR, { recursive: true });

async function waitForServer(url, tries = 150) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("vite не поднялся: " + url);
}

const VITE = resolve(ROOT, "node_modules/vite/bin/vite.js");
const server = spawn(process.execPath, [VITE, "--port", String(PORT), "--strictPort"], { cwd: ROOT, stdio: "ignore" });
try {
  await waitForServer(`http://localhost:${PORT}/`);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 1000 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "#theme-bar{display:none!important}" });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(400);

  const meta = [];
  const sections = page.locator("main.sheet > section");
  const count = await sections.count();
  for (let i = 0; i < count; i++) {
    const sec = sections.nth(i);
    await sec.scrollIntoViewIfNeeded();
    const box = await sec.boundingBox();
    const name = NAMES[i] || `sec${i}`;
    await sec.screenshot({ path: resolve(APPDIR, String(i).padStart(2, "0") + "_" + name + ".png") });
    meta.push({ name, yCss: Math.round(box.y), hCss: Math.round(box.height) });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.screenshot({ path: resolve(OUT, "app_full.png"), fullPage: true });
  writeFileSync(resolve(OUT, "app-sections.json"), JSON.stringify(meta, null, 2));

  let total = 0;
  console.log("секции приложения (CSS-px @440):");
  for (const m of meta) { console.log(`  ${m.name.padEnd(12)} y=${String(m.yCss).padStart(5)}  h=${String(m.hCss).padStart(4)}`); total = m.yCss + m.hCss; }
  console.log("итоговая высота листа ≈", total, "CSS-px  (=", total*2, "px @DPR2)");
  await browser.close();
} finally {
  server.kill("SIGTERM");
}
