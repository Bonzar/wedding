import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

// Юнит-тесты герметичные: без сети, без живого Craft. Сеть всегда мокается.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // playwright-скриншоты — отдельный раннер, не через vitest
    exclude: ["tests/**", "node_modules/**", "rsvp-function/**"],
  },
});
