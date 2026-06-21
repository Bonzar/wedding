import { defineConfig, devices } from "@playwright/test";

/**
 * Скриншот-тесты (визуальная регрессия). Герметичны: сеть RSVP мокается в тестах,
 * живой Craft не дёргается; время замораживается (page.clock) -> детерминированный
 * обратный отсчёт. Сервер — vite dev на отдельном порту 5180 (не конфликтует с preview).
 */
export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: "tests/screenshot/__screenshots__/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  expect: {
    // лёгкий допуск на сглаживание шрифтов между машинами
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide" },
  },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:5180",
    // лист нарисован при 440px — снимаем секции в этой же ширине (как parity)
    viewport: { width: 440, height: 900 },
    deviceScaleFactor: 2,
  },
  projects: [{ name: "chromium" }],
  webServer: {
    command: "node node_modules/vite/bin/vite.js --port 5180 --strictPort",
    url: "http://localhost:5180",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
