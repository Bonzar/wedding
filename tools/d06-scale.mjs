// Находит элементы design06, которые НЕ масштабируются через --d06u (хардкод-px вне elStyle).
// Грузит React дважды: натив (?noscale, --d06u=1px) и десктоп 880 (--d06u≈0.4955).
// Для КАЖДОГО элемента (по индексу — DOM идентичен) считает ratio = w880 / wNative.
// Ожидаем ratio ≈ 0.4955 у всех. Кто ≈1.0 — баг (не масштабируется). Запуск: node tools/d06-scale.mjs
import { chromium } from "@playwright/test";

const PORT = Number(process.env.PORT || 5173);
const REF = 1776, MAXW = 880;
const EXPECT = MAXW / REF; // 0.4955

async function widths(page) {
  return page.evaluate(() => {
    const root = document.querySelector(".d06-page") || document.body;
    const els = [...root.querySelectorAll("*")];
    return els.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        w: r.width,
        h: r.height,
        tag: el.tagName,
        eid: el.getAttribute("data-eid") || "",
        cls: (typeof el.className === "string" ? el.className : "").slice(0, 24),
      };
    });
  });
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

// натив: vw=1800 (>1776), чтобы резиновые wrapper'ы (width:100%) мерились в 1776, а не давали
// ложный ratio. noscale → --d06u не задан → дизайн-элементы в нативных px.
await page.setViewportSize({ width: 1800, height: 1000 });
await page.goto(`http://localhost:${PORT}/?d06&noscale&baseline`, { waitUntil: "load", timeout: 60000 });
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(1200);
const nat = await widths(page);

// 880: vw=1200 → .d06-fit капается на 880 → --d06u≈0.4955.
await page.setViewportSize({ width: 1200, height: 1000 });
await page.goto(`http://localhost:${PORT}/?d06&baseline`, { waitUntil: "load", timeout: 60000 });
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(1200);
const desk = await widths(page);

await b.close();

console.log(`\nЭлементов: натив=${nat.length}, 880=${desk.length}  (ожидаемый ratio=${EXPECT.toFixed(4)})`);
if (nat.length !== desk.length) console.log("⚠️ разное число элементов — DOM разъехался, сверка по индексу неточна");

const bad = [];
const n = Math.min(nat.length, desk.length);
for (let i = 0; i < n; i++) {
  const a = nat[i], c = desk[i];
  if (a.w < 8) continue; // мелочь/нулевые игнор
  const ratio = c.w / a.w;
  if (Math.abs(ratio - EXPECT) > 0.03) bad.push({ i, ratio: +ratio.toFixed(3), natW: Math.round(a.w), deskW: Math.round(c.w), tag: a.tag, eid: a.eid, cls: a.cls });
}
bad.sort((x, y) => Math.abs(y.ratio - EXPECT) - Math.abs(x.ratio - EXPECT));
console.log(`\nНЕ масштабируются корректно (|ratio-${EXPECT.toFixed(3)}|>0.03): ${bad.length}\n`);
for (const x of bad.slice(0, 30)) {
  console.log(`  ratio=${String(x.ratio).padStart(5)}  natW=${String(x.natW).padStart(5)} →880W=${String(x.deskW).padStart(5)}  <${x.tag}> eid="${x.eid}" .${x.cls}`);
}
console.log("");
