// 0%-gate for d07: capture current d07 the SAME (per-section) way as the frozen baselines,
// then pixelmatch each section against tests/d07-baseline/<shot>/<idx>-<id>.png.
//
//   native     — строгий 0%: ожидаем суммарно diffPixels == 0 (cqw на 1:1 == исходные px).
//   desktop880 — порог: per-section diffRatio < 0.002 (≈ только сглаживание текста).
//
// Несовпавшие секции пишут diff в tests/d07-baseline/<shot>/diff-<idx>-<id>.png.
// Запуск (dev-сервер на :5173):  node tests/d07-verify.mjs
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SHOTS, shootSections } from "./d07-shot.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "tests", "d07-baseline");
const GATE = { native: 0, desktop880: 0.002 }; // допустимый per-section diffRatio

const b = await chromium.launch();
let failed = false;

for (const s of SHOTS) {
  const dir = join(OUT, s.name);
  const { shots } = await shootSections(b, s);
  const gate = GATE[s.name] ?? 0;
  let shotFail = false;
  console.log(`\n[${s.name}] gate per-section ratio <= ${gate}`);
  for (const sh of shots) {
    const basePath = join(dir, `${sh.idx}-${sh.id}.png`);
    if (!existsSync(basePath)) {
      console.log(`  ${sh.idx}-${sh.id}  ⚠ нет эталона (новая секция?)`);
      shotFail = true;
      continue;
    }
    const cur = PNG.sync.read(sh.buf);
    const base = PNG.sync.read(readFileSync(basePath));
    if (cur.width !== base.width || cur.height !== base.height) {
      console.log(`  ${sh.idx}-${sh.id}  ❌ размер ${cur.width}x${cur.height} vs эталон ${base.width}x${base.height}`);
      shotFail = true;
      continue;
    }
    const diff = new PNG({ width: cur.width, height: cur.height });
    const px = pixelmatch(cur.data, base.data, diff.data, cur.width, cur.height, { threshold: 0.1 });
    const ratio = px / (cur.width * cur.height);
    const ok = ratio <= gate;
    if (!ok) {
      shotFail = true;
      writeFileSync(join(dir, `diff-${sh.idx}-${sh.id}.png`), PNG.sync.write(diff));
    }
    console.log(`  ${sh.idx}-${sh.id}  ${ok ? "✅" : "❌"} diff=${px} ratio=${ratio.toExponential(2)} (${cur.width}x${cur.height})`);
  }
  if (shotFail) failed = true;
}

await b.close();
console.log("\n" + (failed ? "GATE FAILED" : "GATE OK"));
process.exit(failed ? 1 : 0);
