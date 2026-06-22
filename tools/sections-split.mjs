#!/usr/bin/env node
/**
 * Делит ЭТАЛОН (page0_tall.png) и наш app_full.png на секции и пишет пары кропов
 * для посекционной сверки. Границы эталона ищем по «бумажным» промежуткам
 * (строки с минимальной плотностью чернил = разрывы секций), границы приложения
 * берём из app-sections.json (точные высоты секций из capture).
 *
 * Выход:
 *   refs/ref-render/cmp/ref/<NN>_<name>.png
 *   refs/ref-render/cmp/app/<NN>_<name>.png
 *   refs/ref-render/cmp/boundaries.json
 */
import { PNG } from "pngjs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "refs/ref-render/cmp");
for (const d of ["ref", "app"]) mkdirSync(resolve(OUT, d), { recursive: true });

// Порядок секций приложения (как на странице). Эталон НЕ содержит survey — он
// делится на 12 секций; survey приложения сверять не с чем (оставлен осознанно).
const REF_NAMES = ["wedding-of","countdown","calendar","location","timeline","details","attire","gift","journey","collage","rsvp","closing"];

function cut(src, y0, y1) {
  const h = y1 - y0, W = src.width;
  const o = new PNG({ width: W, height: h });
  for (let y = 0; y < h; y++) src.data.copy(o.data, (y * W) << 2, (((y0 + y) * W) << 2), ((((y0 + y) * W) + W) << 2));
  return o;
}

// ——— плотность чернил по строкам эталона ———
const ref = PNG.sync.read(readFileSync(resolve(ROOT, "refs/ref-render/page0_tall.png")));
const W = ref.width, H = ref.height;
// «бумага» ≈ светлый кремовый (R>225). ink-строка = доля тёмных пикселей.
const dens = new Float32Array(H);
for (let y = 0; y < H; y++) {
  let dark = 0;
  for (let x = 0; x < W; x++) {
    const i = ((y * W + x) << 2);
    const r = ref.data[i], g = ref.data[i + 1], b = ref.data[i + 2];
    // не-бумага: заметно темнее или насыщеннее кремового фона
    if (r < 210 || (Math.max(r, g, b) - Math.min(r, g, b)) > 28) dark++;
  }
  dens[y] = dark / W;
}
// «пустые» строки — где плотность ниже порога; группируем в промежутки
const TH = 0.02;
const gaps = [];
let s = -1;
for (let y = 0; y < H; y++) {
  if (dens[y] < TH) { if (s < 0) s = y; }
  else { if (s >= 0) { gaps.push([s, y, y - s]); s = -1; } }
}
if (s >= 0) gaps.push([s, H, H - s]);
// крупные промежутки (>=24px) — кандидаты в границы секций
const bigGaps = gaps.filter((g) => g[2] >= 24).map((g) => ({ mid: Math.round((g[0] + g[1]) / 2), len: g[2], from: g[0], to: g[1] }));
console.log("крупные бумажные промежутки эталона (mid px, длина):");
for (const g of bigGaps) console.log(`  y≈${String(g.mid).padStart(5)}  len=${g.len}  [${g.from}..${g.to}]`);
writeFileSync(resolve(OUT, "ref-gaps.json"), JSON.stringify(bigGaps, null, 2));
console.log(`\nвсего крупных промежутков: ${bigGaps.length} (нужно 11 границ между 12 секциями + верх/низ)`);
