#!/usr/bin/env node
/** Найти колонки/строки с «чернилами» (тёмно-синий) — для замера рамки/сетки.
 *   node tools/inkscan.mjs <in.png> col <y0> <y1>   → список x, где есть ink
 *   node tools/inkscan.mjs <in.png> row <x0> <x1>   → список y, где есть ink
 */
import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
const [input, mode, a0s, a1s] = process.argv.slice(2);
const a0 = Number(a0s), a1 = Number(a1s);
const s = PNG.sync.read(readFileSync(input));
const W = s.width, H = s.height;
const isInk = (x, y) => {
  const i = ((y * W) + x) << 2;
  const r = s.data[i], g = s.data[i + 1], b = s.data[i + 2];
  // тёмно-синие чернила: тёмные и b>r
  return r < 150 && g < 150 && b < 170 && b >= r - 10 && r + g + b < 380;
};
if (mode === "col") {
  const cols = [];
  for (let x = 0; x < W; x++) {
    let c = 0;
    for (let y = a0; y < a1; y++) if (isInk(x, y)) c++;
    if (c > 0) cols.push([x, c]);
  }
  console.log("ink cols (x:count):", cols.map(([x, c]) => `${x}:${c}`).join(" "));
} else {
  const rows = [];
  for (let y = 0; y < H; y++) {
    let c = 0;
    for (let x = a0; x < a1; x++) if (isInk(x, y)) c++;
    if (c > 0) rows.push([y, c]);
  }
  console.log("ink rows (y:count):", rows.map(([y, c]) => `${y}:${c}`).join(" "));
}
