#!/usr/bin/env node
/** Полностраничное сравнение: эталон | приложение (даунскейл + склейка по горизонтали).
 *   node tools/sidebyside.mjs <ref.png> <app.png> <outWidthPerSide> <out.png>
 */
import { PNG } from "pngjs";
import { readFileSync, writeFileSync } from "node:fs";

const [refP, appP, wStr, out] = process.argv.slice(2);
const TW = Number(wStr);
const GAP = 12;

function scale(src, tw) {
  const th = Math.round(src.height * (tw / src.width));
  const o = new PNG({ width: tw, height: th });
  for (let y = 0; y < th; y++) {
    const sy = Math.min(src.height - 1, Math.floor(y * src.height / th));
    for (let x = 0; x < tw; x++) {
      const sx = Math.min(src.width - 1, Math.floor(x * src.width / tw));
      const i = ((src.width * sy + sx) << 2), j = ((tw * y + x) << 2);
      o.data[j] = src.data[i]; o.data[j+1] = src.data[i+1]; o.data[j+2] = src.data[i+2]; o.data[j+3] = 255;
    }
  }
  return o;
}

const a = scale(PNG.sync.read(readFileSync(refP)), TW);
const b = scale(PNG.sync.read(readFileSync(appP)), TW);
const H = Math.max(a.height, b.height);
const W = TW * 2 + GAP;
const o = new PNG({ width: W, height: H });
o.data.fill(255);
function blit(src, ox) {
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) {
    const i = ((src.width * y + x) << 2), j = ((W * y + (x + ox)) << 2);
    o.data[j] = src.data[i]; o.data[j+1] = src.data[i+1]; o.data[j+2] = src.data[i+2]; o.data[j+3] = 255;
  }
}
blit(a, 0); blit(b, TW + GAP);
writeFileSync(out, PNG.sync.write(o));
console.log(`${out}: ${W}x${H}  (эталон ${a.width}x${a.height} | приложение ${b.width}x${b.height})`);
