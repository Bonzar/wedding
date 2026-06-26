// ПОЛНО-ПОКРЫВАЮЩИЙ diff d07: рабочее дерево против последнего коммита (HEAD), ПОЛНОСТРАНИЧНО
// и БЕЗ ?baseline — в кадр попадают ВСЕ секции + слой элементов .d06-add-layer (пальма) + Survey.
// Это и есть «0%-гейт, который видит изменения в секциях и элементах»: правка-механизм без
// визуального эффекта → diff ≈ 0 (доказываем, что ничего не сломали); осознанная правка дизайна
// (привязал элемент к секции / поменял высоту / переставил секции) → diff падает и показывает
// y-полосы, где сдвинулось → смотрим картинку → коммитим как новую базу (HEAD сдвигается).
//
//   native (?d07&noscale): cqw==px (1:1) → строгий ~0 ожидаем для не-визуальных правок.
//   desktop880 (?d07):     лист 880 → растеризация шумит на тексте; смотрим diff-картинку/полосы.
//
// before = git stash моих d07-файлов → HEAD; after = текущее дерево. setFixedTime (не install —
// install ломает lazy-load фото). Запуск (dev :5173 на node22):  node tests/d07-refactor-diff.mjs
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "tests", "d07-refactor-diff");
// Файлы фичи «секция как единица владения». before = их HEAD-версия (чистый d07).
const FILES = [
  "src/design07/additions.ts",
  "src/design07/sections/index.ts",
  "src/design07/Design07.tsx",
  "src/design07/editor/additionsStore.ts",
  "src/design07/editor/Editor.tsx",
];
const SHOTS = [
  { name: "native", width: 1776, query: "?d07&noscale", strict: true },
  { name: "desktop880", width: 1024, query: "?d07", strict: false },
];
const sh = (c) => execSync(c, { cwd: ROOT, stdio: "pipe" }).toString().trim();

async function shoot(browser, shot) {
  const ctx = await browser.newContext({ viewport: { width: shot.width, height: 1200 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date("2026-06-25T12:00:00Z"));
  await page.goto(`http://localhost:5173/${shot.query}`, { waitUntil: "load", timeout: 60000 });
  await page.waitForSelector("section.rGeu6w", { timeout: 30000 });
  await page.evaluate(() => (document.fonts?.ready ? document.fonts.ready : Promise.resolve()));
  await page.evaluate(() => { for (const i of document.querySelectorAll("img")) if (i.loading === "lazy") i.loading = "eager"; });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 1000) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1200);
  const buf = await page.screenshot({ fullPage: true, animations: "disabled" });
  await ctx.close();
  return buf;
}

mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
let stashed = false;
const after = {}, before = {};
try {
  for (const s of SHOTS) after[s.name] = await shoot(b, s);
  sh(`git stash push -- ${FILES.join(" ")}`);
  stashed = true;
  await new Promise((r) => setTimeout(r, 4000));
  for (const s of SHOTS) before[s.name] = await shoot(b, s);
} finally {
  if (stashed) sh("git stash pop");
  await b.close();
}

let failed = false;
for (const s of SHOTS) {
  const A = PNG.sync.read(after[s.name]), B = PNG.sync.read(before[s.name]);
  writeFileSync(join(OUT, `${s.name}-AFTER.png`), after[s.name]);
  writeFileSync(join(OUT, `${s.name}-BEFORE.png`), before[s.name]);
  const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
  const crop = (p) => { const o = new PNG({ width: w, height: h }); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = ((p.width * y + x) << 2), j = ((w * y + x) << 2); o.data[j] = p.data[i]; o.data[j + 1] = p.data[i + 1]; o.data[j + 2] = p.data[i + 2]; o.data[j + 3] = p.data[i + 3]; } return o; };
  const diff = new PNG({ width: w, height: h });
  const n = pixelmatch(crop(A).data, crop(B).data, diff.data, w, h, { threshold: 0.1 });
  writeFileSync(join(OUT, `${s.name}-DIFF.png`), PNG.sync.write(diff));
  const bands = [];
  for (let by = 0; by < h; by += 1000) { let c = 0; for (let y = by; y < Math.min(by + 1000, h); y++) for (let x = 0; x < w; x++) { const k = (w * y + x) << 2; if (diff.data[k] === 255 && diff.data[k + 1] === 0) c++; } if (c > 80) bands.push(`${by}-${Math.min(by + 1000, h)}:${c}`); }
  const sizeMismatch = A.width !== B.width || A.height !== B.height;
  const pct = (n / (w * h)) * 100;
  // native — 1:1 без AA-масштаба, поэтому реальный сдвиг даёт пиксели сразу; порог жёсткий
  // (5e-4% ≈ единичные кромки) отделяет «ничего не двигалось» от осознанной правки дизайна.
  if (s.strict && (sizeMismatch || pct > 5e-4)) failed = true;
  console.log(`\n[${s.name}] ${A.width}x${A.height} vs ${B.width}x${B.height}  mismatch=${n}px (${pct.toFixed(4)}%)${s.strict ? "  [строгий ~0%]" : "  [инфо]"}${sizeMismatch ? "  ⚠ РАЗНАЯ ВЫСОТА (что-то изменило высоту страницы)" : ""}`);
  console.log(`  полосы с расхождением (y:px): ${bands.length ? bands.join("  ") : "нет"}`);
}
console.log(`\nкартинки: tests/d07-refactor-diff/{native,desktop880}-{AFTER,BEFORE,DIFF}.png`);
console.log(failed ? "\nDIFF: есть расхождения (если правка визуальная — это норма, пере-фризь HEAD коммитом)" : "\nDIFF: 0% (правка не сдвинула рендер)");
