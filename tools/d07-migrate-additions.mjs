// Миграция: привязать КАЖДЫЙ page-absolute addition к секции, НАД которой он реально находится
// в отрендеренном доке, и пересчитать x/y в координаты ОТ СЕКЦИИ — точно, по измерению, не на глаз.
//
// Как (и почему точно): грузим ?d07&noscale (контейнер ровно 1776 → 1cqw=17.76px → отрисованные px
// == канва-координаты, а слой additions начинается в (0,0) страницы). Меряем у каждой секции её
// верх/низ/лево в канва-координатах и у каждого addition — центр. Секция-владелец = та, в чей
// вертикальный диапазон попал ЦЕНТР элемента. Затем РЕБЕЙЗ ХРАНИМЫХ x/y: newX=x−sec.left,
// newY=y−sec.top. Рендер НЕ меняется: обёртка секции стоит на sec.top, внутри translate(newX,newY)
// → итог = sec.top+newY = старый y. Поэтому на дефолтном манифесте дифф = 0%; при смене высоты
// секции элемент теперь едет вместе с ней.
//
// ВАЖНО: запускать на ДЕФОЛТНОМ манифесте (без minHeight-оверрайдов), иначе верхи секций уже
// сдвинуты и ребейз вмонтирует сдвиг. Запуск (dev :5173):  node tools/d07-migrate-additions.mjs [--dry]
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(ROOT, "src", "design07", "additions.ts");
const DRY = process.argv.includes("--dry");
const SLUGS = ["hero", "calendar", "timeline", "details", "attire", "gift", "journey", "survey", "closing"];

// 1) измеряем секции + центры additions в канва-координатах
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1776, height: 1400 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date("2026-06-25T12:00:00Z"));
await page.goto("http://localhost:5173/?d07&noscale", { waitUntil: "load", timeout: 60000 });
await page.waitForSelector("section.rGeu6w", { timeout: 30000 });
await page.evaluate(() => (document.fonts?.ready ? document.fonts.ready : Promise.resolve()));
await page.evaluate(() => { for (const i of document.querySelectorAll("img")) if (i.loading === "lazy") i.loading = "eager"; });
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 1000) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
await page.waitForTimeout(1000);

const measured = await page.evaluate((slugs) => {
  const pageEl = document.querySelector(".d06-page");
  const pr = pageEl.getBoundingClientRect();
  const top0 = pr.top + window.scrollY, left0 = pr.left + window.scrollX;
  const secs = [...document.querySelectorAll("section.rGeu6w")].map((s, i) => {
    const r = s.getBoundingClientRect();
    return { slug: slugs[i] ?? `idx${i}`, top: r.top + window.scrollY - top0, bottom: r.bottom + window.scrollY - top0, left: r.left + window.scrollX - left0 };
  });
  const adds = {};
  for (const el of document.querySelectorAll('.d06-add[data-eid^="add/"]')) {
    const id = el.getAttribute("data-eid").slice(4);
    const r = el.getBoundingClientRect();
    adds[id] = { centerY: r.top + r.height / 2 + window.scrollY - top0 };
  }
  return { secs, adds };
}, SLUGS);
await b.close();

console.log("секции (канва-координаты):");
for (const s of measured.secs) console.log(`  ${s.slug.padEnd(9)} top=${Math.round(s.top)} bottom=${Math.round(s.bottom)} left=${Math.round(s.left)}`);

// 2) читаем additions.ts и парсим массив (он валидный JSON — пишется JSON.stringify в save)
const src = readFileSync(FILE, "utf8");
const marker = "export const additions: Addition[] =";
const mi = src.indexOf(marker);
if (mi < 0) throw new Error("маркер массива additions не найден");
const eq = src.indexOf("=", mi);
const arrStart = src.indexOf("[", eq);
const arrEnd = src.lastIndexOf("]");
const arr = JSON.parse(src.slice(arrStart, arrEnd + 1));

// 3) секция по центру; ребейз хранимых x/y
const pickSection = (y) => {
  for (const s of measured.secs) if (y >= s.top && y < s.bottom) return s;
  let best = measured.secs[0];
  for (const s of measured.secs) if (s.top <= y) best = s; // ниже всех — ближайшая сверху
  return best;
};

let migrated = 0, skipped = 0;
for (const a of arr) {
  if (a.section) { skipped++; continue; } // уже привязан — идемпотентно
  const c = measured.adds[a.id];
  if (!c) { console.log(`  ⚠ ${a.id}: нет в DOM (скрыт/не отрисован) — пропуск`); skipped++; continue; }
  const s = pickSection(c.centerY);
  const tag = a.text ? `«${a.text.slice(0, 18)}»` : (a.src || "").split("/").pop();
  console.log(`  ${a.id} ${String(tag).padEnd(24)} center=${Math.round(c.centerY)} → ${s.slug}  x:${Math.round(a.x)}→${Math.round(a.x - s.left)}  y:${Math.round(a.y)}→${Math.round(a.y - s.top)}`);
  a.section = s.slug;
  a.x = a.x - s.left;
  a.y = a.y - s.top;
  migrated++;
}
console.log(`\nитог: мигрировано ${migrated}, пропущено ${skipped}, всего ${arr.length}`);
if (DRY) { console.log("DRY — файл не тронут (убери --dry чтобы записать)"); process.exit(0); }

const head = src.slice(0, mi);
writeFileSync(FILE, `${head}${marker} ${JSON.stringify(arr, null, 2)};\n`);
console.log("записано →", FILE);
