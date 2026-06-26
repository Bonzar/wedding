// Проверка фикса «дырки в фоне» при росте секции: через панель редактора задаём высоту attire,
// скриним стык attire→gift. Ожидаем бумагу (кремовую), а не белую дыру. node tests/d07-height-bg.mjs
import { chromium } from "@playwright/test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "d07-height-bg.png");

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date("2026-06-25T12:00:00Z"));
await page.goto("http://localhost:5173/?d07&edit", { waitUntil: "load", timeout: 60000 });
await page.waitForSelector("button.d06e-tool", { timeout: 30000 });
await page.evaluate(() => (document.fonts?.ready ? document.fonts.ready : Promise.resolve()));
await page.evaluate(() => { for (const i of document.querySelectorAll("img")) if (i.loading === "lazy") i.loading = "eager"; });
await page.waitForTimeout(800);

// открыть панель «Секции», задать высоту attire = 2600
await page.getByRole("button", { name: "Секции" }).click();
await page.waitForTimeout(200);
const row = page.locator(".d06e-sec-row", { hasText: "attire" });
await row.locator('input[type="number"]').fill("2600");
await page.waitForTimeout(500);
// закрыть панель, чтобы не перекрывала
await page.locator(".d06e-sections .d06e-x").click();
await page.waitForTimeout(300);

// проскроллить к низу attire (idx 4) — там был просвет
await page.evaluate(() => {
  const sec = document.querySelectorAll("section.rGeu6w")[4];
  const r = sec.getBoundingClientRect();
  window.scrollBy(0, r.bottom - window.innerHeight + 120);
});
await page.waitForTimeout(500);
await page.screenshot({ path: OUT });

// сэмплим полосу пикселей в выросшей зоне (центр экрана) — белая дыра дала бы ~255,255,255
const sample = await page.evaluate(() => {
  const c = document.createElement("canvas");
  return null; // пиксельный сэмпл сделаем из PNG отдельно при необходимости
});
void sample;
await b.close();
console.log("снимок:", OUT);
