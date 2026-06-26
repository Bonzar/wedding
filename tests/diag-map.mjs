// Диагностика краша карты на мобиле. Гоняем WebKit (движок iOS Safari) и Chromium
// с эмуляцией мобильных устройств против задеплоенного ?d06. Ловим: краш рендера,
// перезагрузки (навигации main-фрейма), JS-ошибки, что за карта в DOM (iframe/img).
// ВНИМАНИЕ: десктопный WebKit НЕ имеет iOS-лимита памяти/GPU на вкладку, поэтому
// чисто-памятный OOM тут может не повториться. Поведенческие баги (reload/навигация) — повторятся.
import { webkit, chromium, devices } from "@playwright/test";

const URL = process.argv[2] || "https://bonzar.github.io/wedding/?d06";

const runs = [
  { engine: webkit, name: "WebKit", device: devices["iPhone 13"] },
  { engine: webkit, name: "WebKit", device: devices["iPhone SE"] },
  { engine: chromium, name: "Chromium", device: devices["Pixel 7"] },
];

async function run({ engine, name, device }) {
  const label = `${name} / ${device?.viewport?.width}x${device?.viewport?.height}`;
  const browser = await engine.launch();
  const context = await browser.newContext({ ...device });
  const page = await context.newPage();

  const ev = { crashes: 0, navigations: 0, pageErrors: [], consoleErrors: [] };
  page.on("crash", () => ev.crashes++);
  page.on("pageerror", (e) => ev.pageErrors.push(String(e).slice(0, 200)));
  page.on("console", (m) => {
    if (m.type() === "error") ev.consoleErrors.push(m.text().slice(0, 200));
  });
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) ev.navigations++; // 1 = первый заход; >1 = перезагрузка
  });

  let mapKind = "none";
  try {
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForTimeout(1500);

    // что за карта в вёрстке?
    mapKind = await page.evaluate(() => {
      const ifr = document.querySelector('iframe[src*="yandex"], iframe[title*="кедр" i]');
      const img = document.querySelector('[data-eid="calendar/map"] img, img[alt*="карт" i]');
      return ifr ? "iframe(live)" : img ? "img(static)" : "none";
    });

    // имитируем поведение юзера: несколько раз проматываем к карте и обратно
    const H = await page.evaluate(() => document.body.scrollHeight);
    for (let pass = 0; pass < 4; pass++) {
      for (let y = 0; y <= H; y += 300) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(120);
        if (ev.crashes) break;
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      if (ev.crashes) break;
    }
    await page.waitForTimeout(1000);
  } catch (e) {
    ev.pageErrors.push("THROW: " + String(e).slice(0, 200));
  }

  await browser.close();
  return { label, mapKind, ...ev };
}

const results = [];
for (const r of runs) {
  try {
    results.push(await run(r));
  } catch (e) {
    results.push({ label: r.name, error: String(e).slice(0, 200) });
  }
}

console.log("\n================ РЕЗУЛЬТАТ ================");
console.log("URL:", URL, "\n");
for (const r of results) {
  console.log(`• ${r.label}`);
  if (r.error) {
    console.log(`   launch error: ${r.error}`);
    continue;
  }
  console.log(`   карта в DOM: ${r.mapKind}`);
  console.log(`   крашей рендера: ${r.crashes}`);
  console.log(`   навигаций main-фрейма: ${r.navigations}  (1 = норм; >1 = перезагрузка!)`);
  console.log(`   pageerror: ${r.pageErrors.length}${r.pageErrors.length ? " -> " + JSON.stringify(r.pageErrors.slice(0, 3)) : ""}`);
  console.log(`   console.error: ${r.consoleErrors.length}${r.consoleErrors.length ? " -> " + JSON.stringify(r.consoleErrors.slice(0, 3)) : ""}`);
  console.log("");
}
