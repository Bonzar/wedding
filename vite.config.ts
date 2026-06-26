import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import autoprefixer from "autoprefixer";
import { fileURLToPath, URL } from "node:url";
import { d06Save } from "./vite-plugins/d06-save";

// Боевая функция-прокси (читает/пишет Craft). В dev фронт ходит на /rsvp-api
// (см. src/rsvp/api.ts), а ЭТОТ прокси форвардит запрос server-side — поэтому
// браузерного CORS нет (same-origin), и localhost НЕ нужно добавлять в
// ALLOWED_ORIGINS функции (прод остаётся залочен на bonzar.github.io).
const RSVP_FN = "https://functions.yandexcloud.net/d4ej3htfmmdbnvbfsvkq";

// Relative base → работает и на user-pages (bonzar.github.io), и на project-pages
// (.../wedding/), и при локальном preview. Сайт одностраничный (хэш-якоря + ?inv=),
// path-роутинга нет, поэтому относительные пути безопасны.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    // Поддержка старых браузеров (цель: ~2016+, Chrome 49+/FF 52+, БЕЗ IE; iOS/Safari тех же
    // годов — best-effort, см. ниже). Babel + core-js транспилируют синтаксис до ES5 и полифилят ECMAScript-встроенные
    // (Promise/Map/Set/spread/async, Array.flat, Object.fromEntries…). Собирает ДВА бандла:
    //   · modern (ESM, грузится `type=module`) — для браузеров с нативными модулями (≈Chrome 64+);
    //   · legacy (SystemJS, грузится `nomodule`) — для всего ниже (Chrome 49–63 и т.п.).
    // Современные браузеры (cqw-способные, Chrome 105+) берут modern-бандл → рендер не меняется.
    // Web API (ResizeObserver) core-js НЕ полифилит — это делает src/main.tsx по факту отсутствия.
    // CSS-фолбэк масштаба (cqw→zoom/transform, --d07-u) живёт в Design07.tsx и работает на var(),
    // который есть с Chrome 49 — отдельной правки CSS под legacy не требуется.
    // modernPolyfills: modern-бандл синтаксически уже es2015 (esbuild снёс ?./??), но core-js в нём
    // по умолчанию НЕ инлайнит → es2017+ ВСТРОЕННЫЕ отвалились бы на «module-capable, но старых»
    // (Chrome 61–75/FF 60–70). `true` тянет ~84КБ (32КБ gz) на КАЖДОГО современного гостя — перебор.
    // Проверкой бандла нашли ровно ДВА реальных пробела (оба в рантайме Vite-preload, выполняются
    // всегда): Promise.allSettled (Chrome <76) и globalThis (Chrome <71). Полифилим ТОЧЕЧНО → чанк
    // в разы меньше. Добавишь код с новыми встроенными (.flat/.at/fromEntries) — дополни список.
    // targets продублированы в package.json browserslist (его читает autoprefixer) — держать в синхроне.
    // iOS/Safari ≥10 — best-effort: старый iOS Safari (без cqw, <16) и так попадёт в фолбэк, причём
    // по zoom-ветке (Safari умеет zoom) — а zoom рефлоуит без гигантского композит-слоя, т.е. та
    // самая причина jetsam-краша слабее, чем в d06-transform. Гарантий нет (слабая память + длинная
    // страница + тяжёлый декод PNG), но префиксы/полифилы под него аддитивны и другим не вредят.
    legacy({
      targets: ["chrome >= 49", "firefox >= 52", "edge >= 79", "and_chr >= 49", "android >= 5", "ios_saf >= 10", "safari >= 10"],
      modernPolyfills: ["es.promise.all-settled", "es.global-this"],
    }),
    d06Save(),
  ],
  // autoprefixer: вендор-префиксы по package.json browserslist. CSS-файлы Canva уже частично
  // префиксованы экспортом; покрывает design-system и всё, что Canva упустила. ВНИМАНИЕ: инлайновые
  // стили (в т.ч. 117 clip-path в *.layout.ts/*.tsx) postcss НЕ трогает — там префиксов не будет
  // (Chrome 49–54 без -webkit-clip-path → маски-круги/пилюли не клипнутся; Chrome 55+ ок).
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // dev: /rsvp-api/* -> функция (server-side, без CORS). Origin подменяем на
    // разрешённый, чтобы функция отвечала как «своему».
    proxy: {
      "/rsvp-api": {
        target: RSVP_FN,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/rsvp-api/, ""),
        headers: { origin: "https://bonzar.github.io" },
      },
    },
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0, // шрифты/svg отдельными файлами с хэшами (кэш), не data-URI
  },
  // Не сканировать сторонние .html (theme-demo.html, refs/**) как точки входа —
  // только реальный entry приложения.
  optimizeDeps: {
    entries: ["index.html"],
  },
});
