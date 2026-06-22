#!/usr/bin/env node
/** Вырезать одну горизонтальную область из PNG.
 *   node tools/region.mjs <input.png> <y0> <y1> <out.png>
 */
import { PNG } from "pngjs";
import { readFileSync, writeFileSync } from "node:fs";
const [input, y0s, y1s, out] = process.argv.slice(2);
const y0 = Number(y0s), y1 = Number(y1s);
const s = PNG.sync.read(readFileSync(input));
const W = s.width, h = Math.min(y1, s.height) - y0;
const o = new PNG({ width: W, height: h });
for (let y = 0; y < h; y++) s.data.copy(o.data, (y * W) << 2, (((y0 + y) * W) << 2), ((((y0 + y) * W) + W) << 2));
writeFileSync(out, PNG.sync.write(o));
console.log(`${out}: ${W}x${h}  (y ${y0}..${y0 + h} из ${input})`);
