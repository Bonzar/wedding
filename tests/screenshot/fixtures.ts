import type { Page } from "@playwright/test";

/** Фиксированное «сейчас» — чтобы обратный отсчёт был детерминированным в скринах. */
export const FIXED_NOW = new Date("2026-06-21T12:00:00Z");

/** Гости тестового приглашения (мок ответа функции-прокси). */
export const FIXTURE_GUESTS = [
  { guestId: "g1", name: "Ольга", answered: false, isPlus: false, attending: "", drinks: "", drinkList: [] as string[], comment: "" },
  { guestId: "g2", name: "Владислав", answered: true, isPlus: false, attending: "Да", drinks: "Да", drinkList: ["Игристое вино (полуслад)", "Красное вино (полусух)"], comment: "" },
];

/**
 * Готовит детерминированную страницу: замораживает время и мокает RSVP-функцию
 * (НИКАКого живого Craft). Вызывать ДО page.goto.
 */
export async function setupDeterministic(page: Page) {
  await freezeNow(page);
  await page.route(/functions\.yandexcloud\.net|\/rsvp-api/, async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({ json: { token: "TEST", guests: FIXTURE_GUESTS } });
    } else {
      await route.fulfill({ json: { ok: true } });
    }
  });
}

/**
 * Замораживает Date.now() на фиксированном моменте (детерминированный отсчёт),
 * НЕ трогая setTimeout/setInterval — иначе планировщик React 18 встанет и
 * пост-fetch обновления списка не закоммитятся. Ставить ДО goto.
 */
export async function freezeNow(page: Page, iso = "2026-06-21T12:00:00Z") {
  await page.addInitScript((ts: number) => {
    Date.now = () => ts;
  }, new Date(iso).getTime());
}

/** Ждёт загрузки шрифтов и оседания лейаута перед снимком. */
export async function settle(page: Page) {
  await page.evaluate(() => (document as Document).fonts.ready);
  await page.waitForTimeout(150);
}
