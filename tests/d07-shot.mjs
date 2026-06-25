// Shared capture helpers for d07 baseline/verify. ПОСЕКЦИОННЫЙ захват: полностраничный
// скрин нативного листа (16490px, ~86МБ декода) упирается в память и флакает по загрузке
// картинок. Скриним каждую section.rGeu6w отдельно (element.screenshot):
//   · ограниченная память на кадр (одна секция за раз);
//   · lazy-картинки секции грузятся при scrollIntoView, ждём именно их (строго);
//   · обрез по border-box убирает horizontal bleed → стабильная ширина (без 2219-вариаций);
//   · diff по секциям сразу показывает, КАКАЯ секция поехала.
export const BASE = process.env.D07_BASE || "http://localhost:5173";

// Натив 1:1 (строгий 0%) и десктоп (лист 880 по центру в 1024 → desktop-путь d06,
// без overscan-обреза мобилы; совпадает с d07-cqw container=min(100vw,880) на 1024).
export const SHOTS = [
  { name: "native", width: 1776, query: "?d07&noscale&baseline" },
  { name: "desktop880", width: 1024, query: "?d07&baseline" },
];

// Снять все секции одного SHOT. Возвращает [{id, idx, buf, w, h}] + page-инфо.
export async function shootSections(browser, shot) {
  const ctx = await browser.newContext({ viewport: { width: shot.width, height: 1400 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  // setFixedTime (НЕ install): фиксируем только Date.now()/new Date() → стабильные цифры
  // обратного отсчёта (Calendar), но РЕАЛЬНЫЕ таймеры/rAF работают, поэтому lazy-load фото
  // (IntersectionObserver) грузит детерминированно. install() фейкает таймеры и ломал lazy.
  await page.clock.setFixedTime(new Date("2026-06-25T12:00:00Z"));
  await page.goto(BASE + "/" + shot.query, { waitUntil: "load", timeout: 60000 });
  // d07 грузится лениво (Suspense) — дождаться монтирования секций перед запросом хэндлов.
  await page.waitForSelector("section.rGeu6w", { timeout: 30000 });
  await page.evaluate(() => (document.fonts?.ready ? document.fonts.ready : Promise.resolve()));

  const handles = await page.$$("section.rGeu6w");
  const meta = await page.evaluate(() => ({
    docW: document.documentElement.clientWidth,
    sections: document.querySelectorAll("section.rGeu6w").length,
    imgs: document.images.length,
  }));

  const shots = [];
  for (let idx = 0; idx < handles.length; idx++) {
    const sec = handles[idx];
    await sec.scrollIntoViewIfNeeded();
    // lazy→eager для картинок ИМЕННО этой секции (их немного) — фото ниже сгиба внутри
    // высокой секции (Journey 4488px) фетчатся, даже если element-scroll их не задел.
    await sec.evaluate((el) => {
      for (const i of el.querySelectorAll("img")) if (i.loading === "lazy") i.loading = "eager";
    });
    await page.waitForTimeout(150);
    // СТРОГО: все видимые картинки ЭТОЙ секции загружены (display:none-гравюры отсеяны).
    await page.waitForFunction(
      (el) => {
        const imgs = [...el.querySelectorAll("img")].filter((i) => (i.checkVisibility ? i.checkVisibility() : true));
        return imgs.every((i) => i.complete && i.naturalWidth > 0);
      },
      sec,
      { timeout: 30000 },
    );
    const id = (await sec.getAttribute("id")) || `sec${idx}`;
    const box = await sec.boundingBox();
    // animations:disabled — canva-пульсы прозрачности/вращения гравюр иначе дают
    // недетерминированный кадр (diff pristine-vs-pristine). Фиксируем в конечный кадр.
    const buf = await sec.screenshot({ animations: "disabled" });
    shots.push({ id, idx, buf, w: Math.round(box?.width || 0), h: Math.round(box?.height || 0) });
  }
  await ctx.close();
  return { shots, meta };
}
