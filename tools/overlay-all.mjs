#!/usr/bin/env node
/**
 * Генерирует red/cyan-наложения ЭТАЛОН↔ПРИЛОЖЕНИЕ для всех секций и печатает
 * misregistration. Эталон → красный, приложение → cyan. Совпавший элемент = ЧЁРНЫЙ.
 *   node tools/overlay-all.mjs
 * Берёт пары /tmp/parity/ref_<name>.png и /tmp/parity/app_<name>.png.
 */
import { PNG } from "pngjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const SECTIONS = ["hero","wedding-of","countdown","calendar","location","timeline","details","attire","gift","journey","collage","rsvp","closing"];

function overlay(refP, appP, outP) {
  const a = PNG.sync.read(readFileSync(refP));
  const b = PNG.sync.read(readFileSync(appP));
  const W = Math.max(a.width, b.width), H = Math.max(a.height, b.height);
  const o = new PNG({ width: W, height: H });
  const gray = (img, x, y) => { if (x >= img.width || y >= img.height) return 255; const i = ((img.width * y + x) << 2); return img.data[i] * 0.299 + img.data[i + 1] * 0.587 + img.data[i + 2] * 0.114; };
  let inkRef = 0, inkApp = 0, mis = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const gr = gray(a, x, y), ga = gray(b, x, y), j = ((W * y + x) << 2);
    o.data[j] = ga; o.data[j + 1] = gr; o.data[j + 2] = gr; o.data[j + 3] = 255;
    const rD = gr < 170, aD = ga < 170;
    if (rD) inkRef++; if (aD) inkApp++; if (rD !== aD) mis++;
  }
  writeFileSync(outP, PNG.sync.write(o));
  const u = Math.max(1, inkRef + inkApp - Math.min(inkRef, inkApp));
  return { mis, ratio: 100 * mis / u, dims: [a.width, a.height, b.width, b.height] };
}

console.log("Наложения ЭТАЛОН(red)↔ПРИЛОЖЕНИЕ(cyan); совпало=чёрный. misreg вкл. текст:");
for (const n of SECTIONS) {
  const ref = `/tmp/parity/ref_${n}.png`, app = `/tmp/parity/app_${n}.png`;
  if (!existsSync(ref) || !existsSync(app)) { console.log(`  ${n.padEnd(12)} — нет кропа`); continue; }
  const r = overlay(ref, app, `/tmp/parity/ov_${n}.png`);
  console.log(`  ${n.padEnd(12)} misreg≈${r.ratio.toFixed(0)}%  ref=${r.dims[0]}x${r.dims[1]} app=${r.dims[2]}x${r.dims[3]}`);
}
