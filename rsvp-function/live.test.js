"use strict";
/**
 * Канарейка контракта Craft — read-only, против ЖИВОГО Craft.
 * По умолчанию пропускается (чтобы основной набор был герметичным и стабильным).
 * Запуск:  RSVP_LIVE=1 CRAFT_API="https://connect.craft.do/links/XXXX/api/v1" RSVP_TEST_TOKEN=<токен> npm test
 * Ничего не пишет и не удаляет — только GET по тестовому приглашению.
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");

const TOKEN = process.env.RSVP_TEST_TOKEN || ""; // токен тестового инвайта — только из env
const LIVE = process.env.RSVP_LIVE === "1" && !!process.env.CRAFT_API && !!TOKEN;

test("контракт чтения Craft не сломан (read-only)", { skip: LIVE ? false : "нужны RSVP_LIVE=1, CRAFT_API и RSVP_TEST_TOKEN" }, async () => {
  process.env.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "https://bonzar.github.io";
  const { handler } = require("./index.js");
  const r = await handler({
    httpMethod: "GET", headers: { Origin: "https://bonzar.github.io" },
    queryStringParameters: { inv: TOKEN }, body: "", isBase64Encoded: false,
  });
  assert.equal(r.statusCode, 200);
  const data = JSON.parse(r.body);
  assert.ok(Array.isArray(data.guests) && data.guests.length > 0, "должны вернуться гости");
  for (const g of data.guests) {
    assert.ok(g.guestId, "guestId присутствует");
    assert.ok(typeof g.name === "string" && g.name.length > 0, "имя читается (не null из list-эндпоинта)");
    assert.ok(Array.isArray(g.drinkList), "drinkList — массив");
  }
});
