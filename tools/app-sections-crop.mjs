#!/usr/bin/env node
/** Нарезает app_full.png на секции по свежим высотам из app-sections.json →
 * /tmp/parity/app_<name>.png. Запускать ПОСЛЕ tools/app-capture.mjs. */
import { PNG } from "pngjs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync("/tmp/parity", { recursive: true });
const meta = JSON.parse(readFileSync(resolve(ROOT, "refs/ref-render/app-sections.json"), "utf8"));
const src = PNG.sync.read(readFileSync(resolve(ROOT, "refs/ref-render/app_full.png")));
const W = src.width;
let y = 0;
for (const s of meta) {
  const h = s.hCss * 2;
  const o = new PNG({ width: W, height: h });
  for (let r = 0; r < h && y + r < src.height; r++) src.data.copy(o.data, (r * W) << 2, (((y + r) * W) << 2), ((((y + r) * W) + W) << 2));
  writeFileSync(`/tmp/parity/app_${s.name}.png`, PNG.sync.write(o));
  console.log(`app_${s.name}: ${W}x${h} (y ${y}..${y + h})`);
  y += h;
}
