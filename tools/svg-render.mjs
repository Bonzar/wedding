#!/usr/bin/env node
/** Растеризовать SVG в PNG через playwright (read-only превью гравюр).
 *   node tools/svg-render.mjs <in.svg> <out.png> [width=400]
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const [input, out, ws] = process.argv.slice(2);
const W = Number(ws || 400);
let svg = readFileSync(input, "utf8");
const i = svg.indexOf("<svg");
if (i > 0) svg = svg.slice(i);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(
  `<body style="margin:0;background:#efe9dd">
   <div style="width:${W}px;color:#2b3a5a">${svg.replace(/<svg /, '<svg style="width:100%;height:auto;display:block" ')}</div>
   </body>`,
);
const el = await page.$("div");
await el.screenshot({ path: out });
await browser.close();
console.log("wrote", out);
