/** Герметичные тесты RsvpStore: мок fetch, инжект query-строки. Живой Craft не дёргается. */
import { test, expect } from "vitest";
import { RsvpStore } from "./RsvpStore";
import type { FetchLike, Guest } from "./types";

const res = (status: number, obj: unknown) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => obj }) as unknown as Response;

function guest(partial: Partial<Guest> = {}): Guest {
  return { guestId: "g1", name: "Оля", answered: false, isPlus: false, attending: "", drinks: "", drinkList: [], comment: "", ...partial };
}

interface MockOpts {
  guests?: Guest[];
  notFound?: boolean;
  getFail?: boolean;
  saveFail?: boolean;
  onPost?: (body: unknown) => void;
}
function mockFetch(opts: MockOpts = {}): FetchLike {
  return (async (_url: string, init?: RequestInit) => {
    const method = (init?.method || "GET").toUpperCase();
    if (method === "GET") {
      if (opts.notFound) return res(404, { error: "invitation_not_found" });
      if (opts.getFail) return res(500, {});
      return res(200, { token: "T", guests: opts.guests ?? [guest()] });
    }
    if (opts.onPost) opts.onPost(JSON.parse(init?.body as string));
    if (opts.saveFail) return res(502, {});
    return res(200, { ok: true });
  }) as unknown as FetchLike;
}

test("нет токена -> listState no-token", async () => {
  const s = new RsvpStore({ search: "", fetchImpl: mockFetch() });
  await s.load();
  expect(s.listState).toBe("no-token");
  expect(s.hasToken).toBe(false);
});

test("load с токеном -> ready и гости загружены", async () => {
  const s = new RsvpStore({ search: "?inv=T", fetchImpl: mockFetch({ guests: [guest(), guest({ guestId: "g2", name: "Влад" })] }) });
  await s.load();
  expect(s.listState).toBe("ready");
  expect(s.guests.map((g) => g.name)).toEqual(["Оля", "Влад"]);
});

test("404 -> empty", async () => {
  const s = new RsvpStore({ search: "?inv=T", fetchImpl: mockFetch({ notFound: true }) });
  await s.load();
  expect(s.listState).toBe("empty");
});

test("ошибка сети -> error", async () => {
  const s = new RsvpStore({ search: "?inv=T", fetchImpl: mockFetch({ getFail: true }) });
  await s.load();
  expect(s.listState).toBe("error");
});

test("openGuest заполняет draft, условные вопросы деривируются", async () => {
  const s = new RsvpStore({ search: "?inv=T", fetchImpl: mockFetch({ guests: [guest({ attending: "Да", drinks: "Да", drinkList: ["Водка"] })] }) });
  await s.load();
  s.openGuest("g1");
  expect(s.activeGuest?.guestId).toBe("g1");
  expect(s.draft.attending).toBe("Да");
  expect(s.showDrinksQuestion).toBe(true);
  expect(s.showDrinkList).toBe(true);
  s.setAttending("Нет");
  expect(s.showDrinksQuestion).toBe(false);
  expect(s.showDrinkList).toBe(false);
});

test("toggleDrink добавляет и убирает", async () => {
  const s = new RsvpStore({ search: "?inv=T", fetchImpl: mockFetch() });
  await s.load();
  s.openGuest("g1");
  s.setAttending("Да");
  s.setDrinks("Да");
  s.toggleDrink("Водка");
  expect(s.draft.drinkList).toEqual(["Водка"]);
  s.toggleDrink("Водка");
  expect(s.draft.drinkList).toEqual([]);
});

test("save без attending -> ошибка-сообщение, POST не уходит", async () => {
  let posted = false;
  const s = new RsvpStore({ search: "?inv=T", fetchImpl: mockFetch({ onPost: () => (posted = true) }) });
  await s.load();
  s.openGuest("g1");
  await s.save();
  expect(s.message?.error).toBe(true);
  expect(posted).toBe(false);
});

test("save валидный -> POST с нормализованным телом, гость отмечен отвеченным", async () => {
  let body: unknown;
  const s = new RsvpStore({ search: "?inv=T", fetchImpl: mockFetch({ onPost: (b) => (body = b) }) });
  await s.load();
  s.openGuest("g1");
  s.setAttending("Да");
  s.setDrinks("Да");
  s.toggleDrink("Водка");
  s.setComment("без лактозы");
  await s.save();
  expect(body).toEqual({ inv: "T", guestId: "g1", answers: { attending: "Да", drinks: "Да", drinkList: ["Водка"], comment: "без лактозы" } });
  expect(s.activeGuest?.answered).toBe(true);
  expect(s.message?.error).toBe(false);
});

test("save при сбое сервера -> ошибка-сообщение", async () => {
  const s = new RsvpStore({ search: "?inv=T", fetchImpl: mockFetch({ saveFail: true }) });
  await s.load();
  s.openGuest("g1");
  s.setAttending("Да");
  await s.save();
  expect(s.message?.error).toBe(true);
  expect(s.saving).toBe(false);
});
