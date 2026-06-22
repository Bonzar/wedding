#!/usr/bin/env node
/**
 * Уточняет границы секций ЭТАЛОНА (page0_tall.png body): берёт приблизительные
 * границы и «прилипает» к ближайшей самой светлой (бумажной) строке в окне ±win.
 * Печатает точные границы и высоты секций эталона. Затем сверяет с высотами
 * приложения (app-sections.json) — РАЗНИЦА ВЫСОТ считается явно.
 */
import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ref = PNG.sync.read(readFileSync(resolve(ROOT, "refs/ref-render/page0_tall.png")));
const W = ref.width, H = ref.height;

// плотность чернил по строкам
const dens = new Float32Array(H);
for (let y = 0; y < H; y++) {
  let d = 0;
  for (let x = 0; x < W; x++) {
    const i = ((y * W + x) << 2);
    const r = ref.data[i], g = ref.data[i + 1], b = ref.data[i + 2];
    if (r < 210 || (Math.max(r, g, b) - Math.min(r, g, b)) > 28) d++;
  }
  dens[y] = d / W;
}
const snap = (y0, win = 90) => {
  let best = y0, bestD = Infinity;
  for (let y = Math.max(0, y0 - win); y < Math.min(H, y0 + win); y++) {
    if (dens[y] < bestD) { bestD = dens[y]; best = y; }
  }
  return best;
};

// приблизительные границы тела (wedding-of..closing): старт каждой секции
const approx = [0, 1080, 1620, 2300, 2860, 4480, 5340, 6090, 7510, 9430, 10520, 11600, H];
const NAMES = ["wedding-of","countdown","calendar","location","timeline","details","attire","gift","journey","collage","rsvp","closing"];
const bounds = approx.map((y, i) => (i === 0 || i === approx.length - 1) ? y : snap(y));

console.log("ЭТАЛОН (page0_tall body), уточнённые границы и высоты секций (image-px; /2 = лог.px @440):");
const refH = {};
for (let i = 0; i < NAMES.length; i++) {
  const h = bounds[i + 1] - bounds[i];
  refH[NAMES[i]] = h;
  console.log(`  ${NAMES[i].padEnd(12)} y ${String(bounds[i]).padStart(5)}..${String(bounds[i + 1]).padStart(5)}  h=${String(h).padStart(4)}px (${(h/2).toFixed(0)} лог)`);
}

// сверка с приложением
try {
  const app = JSON.parse(readFileSync(resolve(ROOT, "refs/ref-render/app-sections.json"), "utf8"));
  const appH = {};
  for (const s of app) appH[s.name] = s.hCss * 2;
  console.log("\nСВЕРКА ВЫСОТ (px@DPR2): эталон vs приложение, Δ:");
  let totalAbs = 0;
  for (const n of NAMES) {
    if (appH[n] == null) continue;
    const d = appH[n] - refH[n];
    totalAbs += Math.abs(d);
    const flag = Math.abs(d) > 60 ? "  <-- ПРОВЕРИТЬ" : Math.abs(d) > 30 ? "  ~" : "  ok";
    console.log(`  ${n.padEnd(12)} ref=${String(refH[n]).padStart(4)} app=${String(appH[n]).padStart(4)} Δ=${(d>=0?"+":"")}${d}${flag}`);
  }
  console.log(`\n  survey (нет в эталоне): app=${appH["survey"]||0}px — осознанно лишняя секция`);
  console.log(`  СУММА |Δ| по ref-секциям = ${totalAbs}px (${(totalAbs/2).toFixed(0)} лог)`);
} catch (e) { console.log("нет app-sections.json — запусти app-capture сначала"); }
