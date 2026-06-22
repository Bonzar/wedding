#!/usr/bin/env node
/**
 * Измеряет bounding-box «не-бумажного» содержимого в горизонтальной полосе PNG.
 * Для точного замера РАЗМЕРА и ПОЛОЖЕНИЯ элемента (фото/гравюра/рамка/кнопка).
 *   node tools/bbox.mjs <img.png> <y0> <y1> [minRun]
 * y0/y1 — полоса в px изображения. minRun (default 1) — мин. число не-бумажных
 * пикселей в строке/столбце, чтобы считать её содержащей элемент (отсекает крапины).
 * Печатает x0..x1 (ширина) и y0..y1 (высота) в px и в лог.px (/2).
 */
import { PNG } from "pngjs";
import { readFileSync } from "node:fs";

const [img, y0s, y1s, minRunS] = process.argv.slice(2);
const Y0 = Number(y0s), Y1 = Number(y1s), MIN = Number(minRunS || 1);
const s = PNG.sync.read(readFileSync(img));
const W = s.width;
const nonPaper = (i) => {
  const r = s.data[i], g = s.data[i + 1], b = s.data[i + 2];
  return r < 200 || (Math.max(r, g, b) - Math.min(r, g, b)) > 30;
};
const colCount = new Int32Array(W);
let minY = -1, maxY = -1;
for (let y = Y0; y < Math.min(Y1, s.height); y++) {
  let row = 0;
  for (let x = 0; x < W; x++) if (nonPaper((y * W + x) << 2)) { row++; colCount[x]++; }
  if (row >= MIN) { if (minY < 0) minY = y; maxY = y; }
}
let minX = -1, maxX = -1;
for (let x = 0; x < W; x++) if (colCount[x] >= MIN) { if (minX < 0) minX = x; maxX = x; }
const f = (n) => `${n}px (${(n / 2).toFixed(0)}лог)`;
console.log(`bbox в ${img} y[${Y0}..${Y1}] minRun=${MIN}:`);
console.log(`  X: ${minX}..${maxX}  ширина=${f(maxX - minX)}  центр=${((minX + maxX) / 2).toFixed(0)}px`);
console.log(`  Y: ${minY}..${maxY}  высота=${f(maxY - minY)}`);
