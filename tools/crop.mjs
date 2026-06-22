#!/usr/bin/env node
/**
 * Нарезка PNG на горизонтальные полосы для просмотра/замеров.
 *   node tools/crop.mjs <input.png> <bandHeight> <outDir> <prefix>
 * Полосы кладёт <outDir>/<prefix>_NN_<y0>-<y1>.png (y в пикселях исходника).
 */
import { PNG } from "pngjs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const [input, bandStr, outDir, prefix = "band"] = process.argv.slice(2);
const band = Number(bandStr);
mkdirSync(outDir, { recursive: true });
const src = PNG.sync.read(readFileSync(input));
const W = src.width, H = src.height;
let idx = 0;
for (let y0 = 0; y0 < H; y0 += band) {
  const h = Math.min(band, H - y0);
  const out = new PNG({ width: W, height: h });
  for (let y = 0; y < h; y++) {
    const sy = y0 + y;
    src.data.copy(out.data, (y * W) << 2, ((sy * W) << 2), (((sy * W) + W) << 2));
  }
  const name = `${prefix}_${String(idx).padStart(2,"0")}_${y0}-${y0+h}.png`;
  writeFileSync(resolve(outDir, name), PNG.sync.write(out));
  idx++;
}
console.log(`нарезано ${idx} полос из ${input} (${W}x${H}) по ${band}px → ${outDir}`);
