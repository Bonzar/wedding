// Снимает регион Closing (вьюпорт-кадр, НЕ fullPage → без 86МБ-зависания), ВКЛЮЧАЯ слой
// декора (.d06-add-layer, где пальма), на нативе и на 880. Цель: объективно увидеть, одинаково
// ли пальма наложена на текст при разных ширинах (если рефактор равномерный — одинаково).
// Запуск: node tests/d06-palm-check.mjs  (dev :5173)
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "tests", "d06-palm-check");
const PORT = 5173;
const SHOTS = [
  { name: "native", width: 1776, query: "?d06&noscale" },
  { name: "desktop880", width: 1024, query: "?d06" },
];

mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const s of SHOTS) {
  const ctx = await b.newContext({ viewport: { width: s.width, height: 1300 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date("2026-06-25T12:00:00Z"));
  await page.goto(`http://localhost:${PORT}/${s.query}`, { waitUntil: "load", timeout: 60000 });
  await page.waitForSelector("section.rGeu6w", { timeout: 30000 });
  await page.evaluate(() => (document.fonts?.ready ? document.fonts.ready : Promise.resolve()));
  // eager все картинки (включая декор), чтобы пальма точно отрисовалась в кадре
  await page.evaluate(() => { for (const i of document.querySelectorAll("img")) if (i.loading === "lazy") i.loading = "eager"; });
  // к последней секции (Closing) — её верх + наложенный декор попадут в кадр
  const last = page.locator("section.rGeu6w").last();
  await last.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  // подвинем так, чтобы верх Closing (где текст+пальма) был у верха вьюпорта
  await page.evaluate(() => {
    const secs = document.querySelectorAll("section.rGeu6w");
    const closing = secs[secs.length - 1];
    const r = closing.getBoundingClientRect();
    window.scrollBy(0, r.top - 20);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(OUT, `${s.name}.png`) }); // ВЬЮПОРТ, не fullPage
  const info = await page.evaluate(() => {
    const adds = [...document.querySelectorAll(".d06-add")].map((el) => {
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), kind: el.className.includes("img") ? "img" : "text" };
    }).filter((a) => a.top > -500 && a.top < 1500 && a.w > 40);
    return { scrollY: Math.round(window.scrollY), addsInView: adds };
  });
  console.log(`[${s.name}] vw=${s.width} scrollY=${info.scrollY}  декор в кадре:`, JSON.stringify(info.addsInView));
  await ctx.close();
}
await b.close();
console.log("\nкадры: tests/d06-palm-check/{native,desktop880}.png");
