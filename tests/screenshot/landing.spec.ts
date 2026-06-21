import { test, expect } from "@playwright/test";
import { setupDeterministic, settle } from "./fixtures";

/** Порядок секций на листе (как в App). Снимаем каждую отдельно — точечная регрессия. */
const SECTION_NAMES = [
  "hero",
  "wedding-of",
  "countdown",
  "calendar",
  "location",
  "timeline",
  "details",
  "attire",
  "gift",
  "journey",
  "rsvp",
  "survey",
  "closing",
];

test.describe("секции лендинга (golden)", () => {
  for (let i = 0; i < SECTION_NAMES.length; i++) {
    test(`секция ${SECTION_NAMES[i]}`, async ({ page }) => {
      await setupDeterministic(page);
      await page.goto("/");
      await settle(page);
      const section = page.locator("main.sheet > section").nth(i);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toHaveScreenshot(`${SECTION_NAMES[i]}.png`);
    });
  }
});

test("вся страница целиком", async ({ page }) => {
  await setupDeterministic(page);
  await page.goto("/");
  await settle(page);
  await expect(page.locator("main.sheet")).toHaveScreenshot("sheet-full.png");
});

test("тема bordo перекрашивает страницу", async ({ page }) => {
  await setupDeterministic(page);
  await page.goto("/");
  await settle(page);
  await page.locator('button[title="Бордо"]').click();
  await page.waitForTimeout(100);
  await expect(page.locator("main.sheet > section").first()).toHaveScreenshot("hero-bordo.png");
});

test("survey: список гостей по ссылке-приглашению", async ({ page }) => {
  await setupDeterministic(page);
  await page.goto("/?inv=TEST");
  await settle(page);
  const survey = page.locator("#survey");
  await survey.scrollIntoViewIfNeeded();
  await expect(survey).toHaveScreenshot("survey-guests.png");
});

test("RSVP модалка-анкета открывается и снимается", async ({ page }) => {
  await setupDeterministic(page);
  await page.goto("/?inv=TEST");
  await settle(page);
  await page.locator("#survey").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Опрос для гостя/ }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveScreenshot("rsvp-modal.png");
});
