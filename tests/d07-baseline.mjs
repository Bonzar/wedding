// Freeze d07 reference baselines from PRISTINE d07 (= exact HEAD snapshot of d06, BEFORE
// the cqw rewrite). Run ONCE, before touching elStyle. Frozen PNGs = 0%-gate target for
// tests/d07-verify.mjs. Посекционно (см. d07-shot.mjs): tests/d07-baseline/<shot>/<id>.png.
//
// Почему pristine d07, а не живой деплой: деплой — более старый снапшот, разошёлся по
// геометрии с текущим d06. Эталон и d07 — из ОДНОГО снапшота (HEAD), иначе натив-гейт ловит
// дрейф коммитов, а не cqw. Pristine d07 рендерит ровно HEAD d06 → эталон == «d07 до cqw».
//
// Запуск (dev-сервер на :5173):  node tests/d07-baseline.mjs
import { chromium } from "@playwright/test";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SHOTS, shootSections } from "./d07-shot.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "tests", "d07-baseline");

const b = await chromium.launch();

for (const s of SHOTS) {
  const dir = join(OUT, s.name);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const { shots, meta } = await shootSections(b, s);
  for (const sh of shots) await writeFile(join(dir, `${sh.idx}-${sh.id}.png`), sh.buf);
  console.log(`[${s.name}] ${s.query}  docW=${meta.docW}  sections=${shots.length}/${meta.sections}`);
  for (const sh of shots) console.log(`  ${sh.idx}-${sh.id}  ${sh.w}x${sh.h}`);
}

await b.close();
console.log("done.");
