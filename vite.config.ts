import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { layoutEditorPlugin } from "./vite-plugins/layout-editor";

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
  // layoutEditorPlugin — dev-only (apply:"serve"): принимает правки live-редактора макета
  // и пишет их в tools/layout-edits/. В прод-сборку не входит.
  plugins: [react(), layoutEditorPlugin()],
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
