import { test, expect } from "@playwright/test";
import { setupDeterministic, settle, freezeNow } from "./screenshot/fixtures";

/** Поведенческий e2e RSVP: открыть анкету, ответить, сохранить — сеть мокается. */
test("гость отвечает и видит подтверждение", async ({ page }) => {
  const posted: unknown[] = [];
  await freezeNow(page);
  await page.route(/functions\.yandexcloud\.net|\/rsvp-api/, async (route) => {
    const req = route.request();
    if (req.method() === "GET") {
      await route.fulfill({
        json: {
          token: "TEST",
          guests: [{ guestId: "g1", name: "Ольга", answered: false, isPlus: false, attending: "", drinks: "", drinkList: [], comment: "" }],
        },
      });
    } else {
      posted.push(JSON.parse(req.postData() || "{}"));
      await route.fulfill({ json: { ok: true } });
    }
  });

  await page.goto("/?inv=TEST");
  await settle(page);

  // открыть анкету Ольги
  await page.getByRole("button", { name: /Опрос для гостя: Ольга/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // придёт -> появляется вопрос про напитки
  await dialog.getByText("Да, я буду присутствовать.").click();
  await expect(dialog.getByText("Будете ли вы пить")).toBeVisible();
  await dialog.getByText("Да", { exact: true }).click();
  await expect(dialog.getByText("Какие алкогольные напитки")).toBeVisible();
  await dialog.getByText("Водка").click();

  await dialog.getByRole("button", { name: "Сохранить" }).click();
  await expect(dialog.getByText("Спасибо! Ответ сохранён.")).toBeVisible();

  // улетело корректное нормализованное тело
  expect(posted).toHaveLength(1);
  expect(posted[0]).toMatchObject({
    inv: "TEST",
    guestId: "g1",
    answers: { attending: "Да", drinks: "Да", drinkList: ["Водка"] },
  });

  // строка гостя помечена «отвечено»
  await expect(page.getByText("(отвечено)")).toBeVisible();
});

test("без токена — приглашение не открыть", async ({ page }) => {
  await setupDeterministic(page);
  await page.goto("/");
  await settle(page);
  await expect(page.getByText(/откройте персональную ссылку-приглашение/)).toBeVisible();
});
