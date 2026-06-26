// Temp-probe фичи «новый элемент крепится к секции под курсором» (edit-режим). Прокручиваем
// секцию в центр вьюпорта, жмём «+ Текст», проверяем что новый элемент попал в обёртку
// [data-add-section] именно этой секции. Запуск: node tests/d07-attach-probe.mjs
import { chromium } from "@playwright/test";
const SLUGS = ["hero", "calendar", "timeline", "details", "attire", "gift", "journey", "survey", "closing"];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date("2026-06-25T12:00:00Z"));
await page.goto("http://localhost:5173/?d07&edit", { waitUntil: "load", timeout: 60000 });
await page.waitForSelector("section.rGeu6w", { timeout: 30000 });
await page.waitForSelector("button.d06e-tool", { timeout: 30000 });
await page.evaluate(() => (document.fonts?.ready ? document.fonts.ready : Promise.resolve()));
await page.waitForTimeout(1000);

let allOk = true;
for (const targetIdx of [3, 8]) { // details, closing
  await page.evaluate((idx) => {
    const sec = document.querySelectorAll("section.rGeu6w")[idx];
    const r = sec.getBoundingClientRect();
    window.scrollBy(0, r.top + r.height / 2 - window.innerHeight / 2);
  }, targetIdx);
  await page.waitForTimeout(400);

  const centerSlug = await page.evaluate((slugs) => {
    const cy = window.innerHeight / 2;
    const secs = [...document.querySelectorAll("section.rGeu6w")];
    for (let i = 0; i < secs.length; i++) { const r = secs[i].getBoundingClientRect(); if (cy >= r.top && cy <= r.bottom) return slugs[i]; }
    return null;
  }, SLUGS);

  await page.getByRole("button", { name: "+ Текст" }).click();
  await page.waitForTimeout(400);

  const res = await page.evaluate(() => {
    const els = [...document.querySelectorAll(".d06-add-text")].filter((e) => e.textContent === "Новый текст");
    const el = els[els.length - 1];
    const wrap = el?.closest("[data-add-section]");
    return { found: !!el, attachedTo: wrap?.getAttribute("data-add-section") ?? null };
  });
  const ok = centerSlug && res.found && res.attachedTo === centerSlug;
  if (!ok) allOk = false;
  console.log(`idx=${targetIdx}: центр=${centerSlug}  привязан=${res.attachedTo}  ${ok ? "✅" : "❌"}`);
}
await b.close();
console.log(allOk ? "\nATTACH OK — новый элемент крепится к секции под центром" : "\nATTACH FAILED");
process.exit(allOk ? 0 : 1);
