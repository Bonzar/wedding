// Поведенческий пробник фичи «секционные additions»: элемент с section:"closing" должен
// (1) сидеть на верхе секции closing и (2) при росте Survey уехать вниз РОВНО на столько же,
// на сколько уедет closing (= трекает секцию, а не висит в координатах страницы — фикс пальмы).
// Требует temp-элемент PROBE_closing в additions.ts. Запуск: node tests/d07-section-track.mjs
import { chromium } from "@playwright/test";

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1776, height: 1200 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date("2026-06-25T12:00:00Z"));
await page.goto("http://localhost:5173/?d07&noscale", { waitUntil: "load", timeout: 60000 });
await page.waitForSelector("section.rGeu6w", { timeout: 30000 });
await page.evaluate(() => (document.fonts?.ready ? document.fonts.ready : Promise.resolve()));
await page.evaluate(() => { for (const i of document.querySelectorAll("img")) if (i.loading === "lazy") i.loading = "eager"; });
await page.waitForTimeout(1200);
// Пробнику нужна временная фикстура: элемент с section:"closing" в src/design07/additions.ts.
// Без неё — корректно пропускаем (а не висим): добавь temp-запись и перезапусти.
const hasProbe = await page.evaluate(() => document.querySelector('[data-add-section="closing"]') != null);
if (!hasProbe) {
  console.log('SKIP: нет фикстуры — добавь в additions.ts temp-элемент { id:"PROBE_closing", kind:"text", section:"closing", x:120, y:120, w:600, h:80, fontSize:60, text:"PROBE-CLOSING" } и перезапусти.');
  await b.close();
  process.exit(0);
}

const measure = () =>
  page.evaluate(() => {
    const wrap = document.querySelector('[data-add-section="closing"]');
    const probe = document.querySelector('[data-eid="add/PROBE_closing"]');
    const secs = [...document.querySelectorAll("section.rGeu6w")];
    const closing = secs[secs.length - 1];
    const docTop = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);
    return {
      wrapTop: wrap ? docTop(wrap) : null,
      probeTop: probe ? docTop(probe) : null,
      closingTop: docTop(closing),
    };
  });

const before = await measure();
// Растим Survey на +800px (имитация добавленных анкет) → ResizeObserver пересчитает верхи.
await page.evaluate(() => {
  const survey = document.querySelector("section#survey") || [...document.querySelectorAll("section.rGeu6w")].at(-2);
  survey.style.minHeight = survey.getBoundingClientRect().height + 800 + "px";
});
await page.waitForTimeout(900);
const after = await measure();

const dClosing = after.closingTop - before.closingTop;
const dWrap = (after.wrapTop ?? 0) - (before.wrapTop ?? 0);
const sitsOnSection = before.wrapTop != null && Math.abs(before.wrapTop - before.closingTop) < 2;
const tracks = Math.abs(dWrap - dClosing) < 3 && dClosing > 500;

console.log("before:", before);
console.log("after :", after);
console.log(`closingΔ=${dClosing}px  wrapΔ=${dWrap}px`);
console.log(`(1) обёртка на верхе closing: ${sitsOnSection ? "✅" : "❌"} (|wrapTop-closingTop|=${Math.abs((before.wrapTop ?? 0) - before.closingTop)})`);
console.log(`(2) трекает рост Survey:      ${tracks ? "✅" : "❌"} (wrapΔ≈closingΔ, оба > 500)`);
console.log(sitsOnSection && tracks ? "\nPROBE OK — элемент привязан к секции и едет вместе с ней" : "\nPROBE FAILED");
await b.close();
process.exit(sitsOnSection && tracks ? 0 : 1);
