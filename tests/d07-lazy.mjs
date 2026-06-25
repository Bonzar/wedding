// Проверка, что d07 ВЕРНУЛ lazy-load (ключевой механизм фикса iOS-краша): на полной высоте
// листа браузер откладывает оффскрин-картинки и грузит их по мере скролла, а НЕ пачкой при
// открытии (как было у d06, где transform:scale схлопывал страницу до ~4.5 вьюпортов и
// lazy-load переставал работать → весь декод-набор ~86МБ держался разом → jetsam-kill).
//
// Сравниваем число сетевых ответов-картинок ДО скролла и ПОСЛЕ полного скролла, на webkit/iPhone.
// (Playwright webkit НЕ воспроизводит сам per-tab memory-cap iOS — финальное «нет краша» нужно
//  подтвердить на живом iPhone; здесь проверяем именно восстановление поэтапной загрузки.)
//
// Запуск (dev на :5173):  node tests/d07-lazy.mjs
import { webkit, devices } from "@playwright/test";

const BASE = process.env.D07_BASE || "http://localhost:5173";

async function probe(query) {
  const b = await webkit.launch();
  const ctx = await b.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  let imgResponses = 0;
  page.on("response", (r) => {
    if (r.request().resourceType() === "image") imgResponses++;
  });
  await page.goto(BASE + "/" + query, { waitUntil: "load", timeout: 60000 });
  await page.waitForSelector("section.rGeu6w", { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const atLoad = imgResponses;
  const info = await page.evaluate(() => ({
    bodyH: document.body.scrollHeight,
    vh: window.innerHeight,
    imgs: document.images.length,
    lazy: [...document.images].filter((i) => i.loading === "lazy").length,
    transform: getComputedStyle(document.querySelector('[style*="scale"]') || document.body).transform,
  }));
  // медленный полный скролл — даём lazy-load отрабатывать поэтапно
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.floor(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await sleep(150);
    }
  });
  await page.waitForTimeout(2000);
  const afterScroll = imgResponses;
  await b.close();
  return { atLoad, afterScroll, ...info, viewports: +(info.bodyH / info.vh).toFixed(1) };
}

const d07 = await probe("?d07");
console.log("d07 (cqw):", JSON.stringify(d07, null, 2));
console.log(
  `\nИтог: при открытии загрузилось ${d07.atLoad} картинок, после полного скролла — ${d07.afterScroll} ` +
    `(дозагрузка по скроллу: +${d07.afterScroll - d07.atLoad}). Высота листа = ${d07.viewports} вьюпортов, transform=${d07.transform}.`,
);
console.log(
  d07.afterScroll - d07.atLoad > 3 && /none|matrix\(1,/.test(d07.transform)
    ? "✅ lazy-load РАБОТАЕТ (поэтапная дозагрузка, нет глобального transform-слоя) — механизм iOS-краша устранён."
    : "⚠ проверь вручную: дозагрузка по скроллу слабая или есть transform-слой.",
);
