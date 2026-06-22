#!/usr/bin/env node
/** Контактный лист всех ref-SVG (refs/assets/design06/media/*.svg) с подписями-хэшами,
 * чтобы сопоставить точные эталонные гравюры с секциями. → /tmp/refsvg/contact.png */
import { chromium } from "playwright-core";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = resolve(ROOT, "refs/assets/design06/media");
mkdirSync("/tmp/refsvg", { recursive: true });
const files = readdirSync(DIR).filter((f) => f.endsWith(".svg")).sort();
const cells = files.map((f) => {
  const svg = readFileSync(resolve(DIR, f), "utf8").replace(/<\?xml[^>]*\?>/, "");
  return `<div class="cell"><div class="box">${svg}</div><div class="lbl">${f.replace(".svg","")}</div></div>`;
}).join("\n");
const html = `<!doctype html><meta charset=utf-8><style>
  body{margin:0;background:#f6f1e8;font:11px monospace;color:#234}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px}
  .cell{border:1px solid #ccc;background:#fbf8f2;display:flex;flex-direction:column;align-items:center;padding:6px}
  .box{width:180px;height:180px;display:flex;align-items:center;justify-content:center;color:#34507a}
  .box svg{max-width:170px;max-height:170px;width:auto;height:auto;color:#34507a;fill:currentColor}
  .lbl{margin-top:4px;font-size:9px;word-break:break-all;text-align:center}
</style><div class=grid>${cells}</div>`;
writeFileSync("/tmp/refsvg/contact.html", html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: 1 });
await page.goto("file:///tmp/refsvg/contact.html", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/refsvg/contact.png", fullPage: true });
await browser.close();
console.log(`${files.length} ref-SVG → /tmp/refsvg/contact.png`);
console.log(files.join("\n"));
