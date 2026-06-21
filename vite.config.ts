import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Relative base → работает и на user-pages (bonzar.github.io), и на project-pages
// (.../wedding/), и при локальном preview. Сайт одностраничный (хэш-якоря + ?inv=),
// path-роутинга нет, поэтому относительные пути безопасны.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
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
