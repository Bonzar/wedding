"use strict";
/** Герметичные тесты RSVP-фронта: без сети и без браузера (мок fetch, проверка строк). */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getInviteToken, esc, validateAnswers, buildPayload,
  fetchInvite, saveAnswer, renderGuestList, renderModal, DRINKS,
} from "./rsvp.js";

// ---- getInviteToken ----
test("getInviteToken достаёт токен из query", () => {
  assert.equal(getInviteToken("?inv=abc123"), "abc123");
  assert.equal(getInviteToken("?foo=1&inv=xy"), "xy");
  assert.equal(getInviteToken("?inv=%20zz%20").trim(), "zz");
  assert.equal(getInviteToken(""), "");
  assert.equal(getInviteToken("?other=1"), "");
});

// ---- esc ----
test("esc экранирует html", () => {
  assert.equal(esc('<b>"&\'</b>'), "&lt;b&gt;&quot;&amp;&#39;&lt;/b&gt;");
});

// ---- validateAnswers ----
test("validateAnswers: attending обязателен", () => {
  assert.match(validateAnswers({}), /Выберите/);
  assert.equal(validateAnswers({ attending: "Да" }), null);
  assert.equal(validateAnswers({ attending: "Нет" }), null);
});

// ---- buildPayload (нормализация как на сервере) ----
test("buildPayload: придёт+пьёт -> напитки сохраняются, мусор отфильтрован", () => {
  const p = buildPayload("T", "g1", { attending: "Да", drinks: "Да", drinkList: ["Водка", "ВЗЛОМ", "Ром"], comment: "  hi " });
  assert.deepEqual(p, { inv: "T", guestId: "g1", answers: { attending: "Да", drinks: "Да", drinkList: ["Водка", "Ром"], comment: "hi" } });
});
test("buildPayload: не придёт -> напитки/алкоголь очищаются", () => {
  const p = buildPayload("T", "g1", { attending: "Нет", drinks: "Да", drinkList: ["Водка"] });
  assert.equal(p.answers.drinks, "");
  assert.deepEqual(p.answers.drinkList, []);
});
test("buildPayload: не пьёт -> напитки очищаются", () => {
  const p = buildPayload("T", "g1", { attending: "Да", drinks: "Нет", drinkList: ["Водка"] });
  assert.deepEqual(p.answers.drinkList, []);
});
test("buildPayload: дубли напитков схлопываются", () => {
  const p = buildPayload("T", "g1", { attending: "Да", drinks: "Да", drinkList: ["Ром", "Ром", "Водка"] });
  assert.deepEqual(p.answers.drinkList, ["Ром", "Водка"]);
});

// ---- fetchInvite (мок) ----
function mockFetch(map) {
  return async (url, opts = {}) => {
    const key = (opts.method || "GET") + " " + (url.includes("?") ? "GET?" : url).slice(0, 4);
    const r = map(url, opts);
    return r;
  };
}
const res = (status, obj) => ({ ok: status >= 200 && status < 300, status, json: async () => obj });

test("fetchInvite: 200 -> данные, 404 -> notFound, 500 -> throw", async () => {
  const ok = await fetchInvite("T", async () => res(200, { token: "T", guests: [{ guestId: "g1", name: "Аня" }] }));
  assert.equal(ok.guests[0].name, "Аня");
  const nf = await fetchInvite("T", async () => res(404, { error: "x" }));
  assert.equal(nf.notFound, true);
  await assert.rejects(() => fetchInvite("T", async () => res(500, {})));
});

// ---- saveAnswer (мок ловит payload) ----
test("saveAnswer: POST с корректным телом", async () => {
  let captured;
  const r = await saveAnswer("T", "g1", { attending: "Да", drinks: "Да", drinkList: ["Ром"] }, async (url, opts) => {
    captured = { url, method: opts.method, body: JSON.parse(opts.body) };
    return res(200, { ok: true });
  });
  assert.equal(r.ok, true);
  assert.equal(captured.method, "POST");
  assert.deepEqual(captured.body, { inv: "T", guestId: "g1", answers: { attending: "Да", drinks: "Да", drinkList: ["Ром"], comment: "" } });
});
test("saveAnswer: не-ok -> throw", async () => {
  await assert.rejects(() => saveAnswer("T", "g1", { attending: "Да" }, async () => res(502, {})));
});

// ---- renderGuestList ----
test("renderGuestList: имена, статус, data-атрибуты, экранирование", () => {
  const html = renderGuestList([
    { guestId: "g1", name: "Ольга", answered: true },
    { guestId: "g2", name: "<x>", answered: false },
  ]);
  assert.match(html, /data-guest-id="g1"/);
  assert.match(html, /Ольга/);
  assert.match(html, /\(отвечено\)/);
  assert.match(html, /\(ответить\)/);
  assert.match(html, /&lt;x&gt;/);            // имя экранировано
  assert.doesNotMatch(html, /<x>/);
});

// ---- renderModal ----
test("renderModal: 3 вопроса, все напитки, коммент, предзаполнение", () => {
  const html = renderModal({ name: "Аня", attending: "Да", drinks: "Да", drinkList: ["Ром"], comment: "тест" });
  assert.match(html, /Опрос для гостя: Аня/);
  assert.match(html, /Придёте ли вы/);
  assert.match(html, /пить алкогольные напитки/);
  assert.match(html, /предпочитаете/);
  for (const d of DRINKS) assert.ok(html.includes(d), `нет напитка ${d}`);
  assert.match(html, /value="Ром"[^>]*checked/);                 // выбранный напиток отмечен
  assert.match(html, /name="attending" value="Да"[^>]*checked/); // придёт отмечен
  assert.match(html, /тест<\/textarea>/);                        // коммент предзаполнен
});
