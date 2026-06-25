// Uniform-scaling gate for d07: проверяет, что ВСЯ вёрстка масштабируется РОВНО на
// containerWidth/1776 при сужении (нет «утечек» фиксированных px, обходящих cqw).
//
// Натив-пиксельный гейт (d07-verify) ловит регрессии на 1:1, но НЕ видит px, которые
// равны на 1776 и расходятся только при сужении (Journey marginLeft, SVG width=150,
// border 2px, fontSize добавленных элементов и т.п.). Этот гейт берёт КАЖДЫЙ элемент под
// .KYQZFA, меряет его бокс+font-size на нативе (1776) и на 880, и требует
// box_880 ≈ box_native × (880/1776). Любое отклонение = px-утечка (её и печатает).
//
// Self-consistency: эталон не нужен, сравниваем d07 сам с собой на двух ширинах.
// Запуск (dev на :5173):  node tests/d07-scale.mjs
import { chromium } from "@playwright/test";
import { BASE } from "./d07-shot.mjs";

const CLOCK = process.env.D07_CLOCK || "2026-06-25T12:00:00Z";

async function metrics(browser, width, query) {
  const ctx = await browser.newContext({ viewport: { width, height: 1400 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date(CLOCK));
  await page.goto(BASE + "/" + query, { waitUntil: "load", timeout: 60000 });
  await page.waitForSelector("section.rGeu6w", { timeout: 30000 });
  await page.evaluate(() => (document.fonts?.ready ? document.fonts.ready : Promise.resolve()));
  await page.waitForTimeout(400);
  const data = await page.evaluate(() => {
    const root = document.querySelector(".KYQZFA");
    const k = root.getBoundingClientRect();
    const els = [...root.querySelectorAll("*")];
    return {
      base: k.width,
      rects: els.map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          x: r.left - k.left,
          y: r.top - k.top,
          w: r.width,
          h: r.height,
          fs: parseFloat(cs.fontSize) || 0,
          tag: el.tagName.toLowerCase(),
          eid: el.getAttribute("data-eid") || "",
          cls: (el.getAttribute("class") || "").slice(0, 24),
        };
      }),
    };
  });
  await ctx.close();
  return data;
}

const b = await chromium.launch();
const N = await metrics(b, 1776, "?d07&noscale&baseline"); // натив 1:1
const D = await metrics(b, 1024, "?d07&baseline"); // лист 880 в окне 1024
await b.close();

const scale = D.base / N.base; // ≈ 880/1776
console.log(`base native=${N.base} 880=${D.base} scale=${scale.toFixed(5)}  elements: ${N.rects.length} vs ${D.rects.length}`);

if (N.rects.length !== D.rects.length) {
  console.log("⚠ разное число элементов — структура отличается между ширинами, сверка по индексу ненадёжна");
}

// допуск: бокс — max(1.5px, 2%); font-size — max(0.4px, 1.5%). Утечка фикс-px на 880 даёт
// отклонение в РАЗЫ больше (напр. 90px вместо 45px), так что порог уверенно их отделяет.
const tol = (exp, absPx, relPct) => Math.max(absPx, Math.abs(exp) * relPct);
const n = Math.min(N.rects.length, D.rects.length);
const leaks = [];
for (let i = 0; i < n; i++) {
  const a = N.rects[i], c = D.rects[i];
  // только РАЗМЕРЫ (w/h/fs) — они frame-independent. x/y давали ложный −72 от центрирования
  // листа (880 в окне 1024); сдвиги позиций лучше ловить визуально + натив-пиксель-гейтом.
  for (const m of ["w", "h", "fs"]) {
    const exp = a[m] * scale;
    const dev = Math.abs(c[m] - exp);
    const limit = m === "fs" ? tol(exp, 0.4, 0.015) : tol(exp, 1.5, 0.02);
    if (dev > limit) {
      leaks.push({ i, m, native: +a[m].toFixed(1), exp: +exp.toFixed(1), got: +c[m].toFixed(1), dev: +dev.toFixed(1), tag: a.tag, eid: a.eid, cls: a.cls });
      break; // одного нарушенного метрика на элемент достаточно для репорта
    }
  }
}

leaks.sort((p, q) => q.dev - p.dev);
console.log(`\nутечки (элементы, что НЕ масштабируются на ${scale.toFixed(3)}): ${leaks.length}`);
for (const l of leaks.slice(0, 40)) {
  console.log(`  #${l.i} <${l.tag}${l.eid ? ` eid=${l.eid}` : ""}${l.cls ? ` .${l.cls}` : ""}>  ${l.m}: native=${l.native} ожид=${l.exp} получено=${l.got} (откл ${l.dev}px)`);
}
console.log(leaks.length ? "\nSCALE GATE: НАЙДЕНЫ УТЕЧКИ" : "\nSCALE GATE OK");
process.exit(leaks.length ? 1 : 0);
