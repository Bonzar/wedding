// d07 fallback-единица — герметичный 0%-инвариант (без dev-сервера/сети/git, через setContent).
// Доказывает два свойства подмены `<n>cqw` → `calc(<n> * var(--d07-u, 1cqw))` (см. layout.ts U):
//   1) на современном браузере (var()→1cqw) результат пиксель-в-пиксель равен прежнему литералу
//      `<n>cqw` → рефактор единицы НЕ двигает рендер (0%-гейт цел);
//   2) в fallback-режиме (--d07-u = REF_WIDTH/100 = 17.76px) `calc(n*--d07-u)` разрешается ровно
//      в исходные нативные px → масштаб zoom/transform поверх даёт корректную геометрию.
// Рендерим оба варианта в реальном контейнере container-type:inline-size=1776 и сверяем left.
// Запуск (node 22):  node tests/d07-fallback-unit.mjs
import { chromium } from "@playwright/test";

// несколько реальных значений из вёрстки (px → cqw-счёт = px*100/1776)
const CASES = [16, 58, 138, 1, 880, 1776, 1412.5, -47].map((px) => ({ px, n: (px * 100) / 1776 }));

const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 1 })).newPage();

// меряем через left у absolutely-позиционированных боксов (валидно и для отрицательных значений —
// в вёрстке это translate/top/margin). base left=200 чтобы отрицательные кейсы не уходили в обрез.
const box = (cls, val) => `<div class="${cls}" style="position:absolute;top:0;width:1px;height:1px;left:calc(200px + ${val})"></div>`;
const litBoxes = CASES.map((c) => box("lit", `${c.n}cqw`)).join("");
const calcBoxes = CASES.map((c) => box("calc", `calc(${c.n} * var(--d07-u, 1cqw))`)).join("");
const fbBoxes = CASES.map((c) => box("fb", `calc(${c.n} * var(--d07-u, 1cqw))`)).join("");

await p.setContent(`<!doctype html><meta charset=utf-8>
  <div id="modern" style="container-type:inline-size;width:1776px;position:absolute;left:0;top:0">
    ${litBoxes}${calcBoxes}
  </div>
  <div id="fallback" style="width:1776px;--d07-u:17.76px;position:absolute;left:0;top:2000px">
    ${fbBoxes}
  </div>`);

const res = await p.evaluate(() => {
  // вычитаем base(200) обратно → чистое разрешённое значение единицы
  const L = (sel) => [...document.querySelectorAll(sel)].map((el) => Math.round((el.getBoundingClientRect().left - 200) * 1e6) / 1e6);
  return { lit: L(".lit"), calc: L(".calc"), fb: L(".fb") };
});

let fails = 0;
for (let i = 0; i < CASES.length; i++) {
  const { px } = CASES[i];
  const lit = res.lit[i], calc = res.calc[i], fb = res.fb[i];
  // modern: literal cqw vs calc(n*var(1cqw)) — должны совпасть БИТ-В-БИТ
  if (lit !== calc) { console.log(`MODERN DIFF px=${px}: lit=${lit} calc=${calc}`); fails++; }
  // fallback: calc(n*17.76px) должен дать ровно исходные px (±<0.01 на double-арифметику CSS)
  if (Math.abs(fb - px) > 0.01) { console.log(`FALLBACK DRIFT px=${px}: got=${fb} expected≈${px}`); fails++; }
}
console.log(`\ncases: ${CASES.length}  modern lit==calc: ${res.lit.every((v, i) => v === res.calc[i])}  fallback≈native: ${CASES.every((c, i) => Math.abs(res.fb[i] - c.px) <= 0.01)}`);
console.log(`sample px=138 → modern lit=${res.lit[2]} calc=${res.calc[2]} | fallback=${res.fb[2]}`);
console.log(fails === 0 ? "UNIT-EQUIVALENCE OK: calc(n*var)==n cqw (0%), и fallback→нативные px" : `FAILED: ${fails}`);
await b.close();
