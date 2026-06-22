#!/usr/bin/env node
/**
 * Объективная проверка ТОЧНОЙ верстки: red/cyan-наложение эталон↔приложение.
 *   node tools/overlay.mjs <ref.png> <app.png> <out.png>
 * Эталон → красный канал, приложение → cyan (G+B). Тогда:
 *   • элемент совпал по размеру/положению/повороту → чёрный (без каймы)
 *   • сдвиг/масштаб/поворот → красно-голубое «двоение»
 *   • текст (разный язык) → цветной (ожидаемо, игнор)
 * Печатает долю «несовпавших» пикселей среди НЕ-фоновых (грубый числовой сигнал).
 */
import { PNG } from "pngjs";
import { readFileSync, writeFileSync } from "node:fs";

const [refP, appP, out] = process.argv.slice(2);
const a = PNG.sync.read(readFileSync(refP));
const b = PNG.sync.read(readFileSync(appP));
const W = Math.max(a.width, b.width);
const H = Math.max(a.height, b.height);
const o = new PNG({ width: W, height: H });
const gray = (img, x, y) => {
  if (x >= img.width || y >= img.height) return 255;
  const i = ((img.width * y + x) << 2);
  return (img.data[i] * 0.299 + img.data[i + 1] * 0.587 + img.data[i + 2] * 0.114);
};
let inkRef = 0, inkApp = 0, mis = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const gr = gray(a, x, y), ga = gray(b, x, y);
    const j = ((W * y + x) << 2);
    o.data[j] = ga;          // R = приложение? нет: см. ниже
    o.data[j + 1] = gr;      // ставим эталон в G,B и приложение в R → ref-only=cyan, app-only=red
    o.data[j + 2] = gr;
    o.data[j + 3] = 255;
    const rDark = gr < 170, aDark = ga < 170;
    if (rDark) inkRef++;
    if (aDark) inkApp++;
    if (rDark !== aDark) mis++;
  }
}
writeFileSync(out, PNG.sync.write(o));
const inkUnion = Math.max(1, inkRef + inkApp - Math.min(inkRef, inkApp));
console.log(`${out}: ${W}x${H}  ink_ref=${inkRef} ink_app=${inkApp}  misregistration≈${(100 * mis / inkUnion).toFixed(1)}% (вкл. текст)`);
