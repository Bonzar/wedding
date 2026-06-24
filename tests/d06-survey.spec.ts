import { test, expect } from "@playwright/test";
import { setupDeterministic, settle } from "./screenshot/fixtures";

/**
 * Раздел Survey в d06 — секция БЕЗ Canva-эталона. Тестируем гейт видимости (от него
 * зависит 0%-инвариант) и интерактив. Герметично: RSVP-сеть мокается, живой Craft не
 * дёргается (setupDeterministic). #survey под ?d06 — это именно d06-раздел (исходный
 * <Survey/> приложения на ?d06 не рендерится: App уходит в ветку Design06).
 */
test.describe("d06: раздел Survey", () => {
  test("присутствует на ?d06", async ({ page }) => {
    await setupDeterministic(page);
    await page.goto("/?d06");
    await settle(page);
    await expect(page.locator("#survey")).toBeVisible();
  });

  test("скрыт под ?d06&noscale&baseline (0%-инвариант цел)", async ({ page }) => {
    await setupDeterministic(page);
    await page.goto("/?d06&noscale&baseline");
    await settle(page);
    await expect(page.locator("#survey")).toHaveCount(0);
  });

  test("список гостей по ?inv открывает анкету-модалку", async ({ page }) => {
    await setupDeterministic(page);
    await page.goto("/?d06&inv=TEST");
    await settle(page);
    const survey = page.locator("#survey");
    await expect(survey).toBeVisible();
    // мок отдаёт двух гостей (Ольга/Владислав)
    const guests = survey.getByRole("button", { name: /Опрос для гостя/ });
    await expect(guests).toHaveCount(2);
    await guests.first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
