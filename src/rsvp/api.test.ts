/** Герметичные тесты RSVP-логики: без сети, без браузера (мок fetch). Порт rsvp.test.mjs. */
import { test, expect } from "vitest";
import {
  getInviteToken,
  esc,
  validateAnswers,
  buildPayload,
  fetchInvite,
  saveAnswer,
  DRINKS,
} from "./api";
import type { FetchLike } from "./types";

const res = (status: number, obj: unknown) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => obj }) as unknown as Response;

test("getInviteToken достаёт токен из query", () => {
  expect(getInviteToken("?inv=abc123")).toBe("abc123");
  expect(getInviteToken("?foo=1&inv=xy")).toBe("xy");
  expect(getInviteToken("?inv=%20zz%20").trim()).toBe("zz");
  expect(getInviteToken("")).toBe("");
  expect(getInviteToken("?other=1")).toBe("");
});

test("esc экранирует html", () => {
  expect(esc('<b>"&\'</b>')).toBe("&lt;b&gt;&quot;&amp;&#39;&lt;/b&gt;");
});

test("validateAnswers: attending обязателен", () => {
  expect(validateAnswers({})).toMatch(/Выберите/);
  expect(validateAnswers({ attending: "Да" })).toBeNull();
  expect(validateAnswers({ attending: "Нет" })).toBeNull();
});

test("buildPayload: придёт+пьёт -> напитки сохраняются, мусор отфильтрован", () => {
  const p = buildPayload("T", "g1", { attending: "Да", drinks: "Да", drinkList: ["Водка", "ВЗЛОМ", "Ром"] as string[], comment: "  hi " });
  expect(p).toEqual({ inv: "T", guestId: "g1", answers: { attending: "Да", drinks: "Да", drinkList: ["Водка", "Ром"], comment: "hi" } });
});

test("buildPayload: не придёт -> напитки/алкоголь очищаются", () => {
  const p = buildPayload("T", "g1", { attending: "Нет", drinks: "Да", drinkList: ["Водка"] });
  expect(p.answers.drinks).toBe("");
  expect(p.answers.drinkList).toEqual([]);
});

test("buildPayload: не пьёт -> напитки очищаются", () => {
  const p = buildPayload("T", "g1", { attending: "Да", drinks: "Нет", drinkList: ["Водка"] });
  expect(p.answers.drinkList).toEqual([]);
});

test("buildPayload: дубли напитков схлопываются", () => {
  const p = buildPayload("T", "g1", { attending: "Да", drinks: "Да", drinkList: ["Ром", "Ром", "Водка"] });
  expect(p.answers.drinkList).toEqual(["Ром", "Водка"]);
});

test("fetchInvite: 200 -> данные, 404 -> notFound, 500 -> throw", async () => {
  const ok = await fetchInvite("T", (async () => res(200, { token: "T", guests: [{ guestId: "g1", name: "Аня" }] })) as FetchLike);
  expect(ok.guests?.[0].name).toBe("Аня");
  const nf = await fetchInvite("T", (async () => res(404, { error: "x" })) as FetchLike);
  expect(nf.notFound).toBe(true);
  await expect(fetchInvite("T", (async () => res(500, {})) as FetchLike)).rejects.toThrow();
});

test("saveAnswer: POST с корректным телом", async () => {
  let captured: { url: string; method?: string; body: unknown } | undefined;
  const r = await saveAnswer("T", "g1", { attending: "Да", drinks: "Да", drinkList: ["Ром"] }, (async (url: string, opts: RequestInit) => {
    captured = { url, method: opts.method, body: JSON.parse(opts.body as string) };
    return res(200, { ok: true });
  }) as unknown as FetchLike);
  expect(r.ok).toBe(true);
  expect(captured?.method).toBe("POST");
  expect(captured?.body).toEqual({ inv: "T", guestId: "g1", answers: { attending: "Да", drinks: "Да", drinkList: ["Ром"], comment: "" } });
});

test("saveAnswer: не-ok -> throw", async () => {
  await expect(saveAnswer("T", "g1", { attending: "Да" }, (async () => res(502, {})) as FetchLike)).rejects.toThrow();
});

test("DRINKS содержит ожидаемый набор", () => {
  expect(DRINKS).toContain("Игристое вино");
  expect(DRINKS.length).toBe(10);
});
