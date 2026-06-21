"use strict";
/**
 * Герметичные тесты RSVP-функции: fetch замокан, живой Craft НЕ дёргается,
 * боевые данные не трогаются. Запуск: `npm test` (или `node --test`).
 */
const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

// окружение должно стоять ДО require(index.js) не обязательно (читается в рантайме),
// но выставим до запуска тестов для чистоты.
process.env.CRAFT_API = "https://craft.example/api/v1";
process.env.ALLOWED_ORIGINS = "https://bonzarr.github.io";

const { handler } = require("./index.js");

const GUESTS_COLLECTION = "2fd42736-e580-ff98-a421-e5ba577ad706";
// карта ключей полей (должна совпадать с index.js; сверена с боевой схемой 2026-06-21)
const TITLE = "_7";
const F = { token: "", attending: "_2", drinks: "_3", drinkList: "_4", answered: "_", date: "__2", comment: "_5", isPlus: "_6" };

// --- фикстуры: несколько приглашений, чтобы проверять скоупинг и +1 ------------
function fixtureGuests() {
  return [
    { id: "g1", name: "Ольга",     token: "AAA" },
    { id: "g2", name: "Владислав", token: "AAA" },
    { id: "g3", name: "Иван",      token: "BBB" },
    { id: "gc", name: "Аня",       token: "CCC" },                 // основной гость
    { id: "gp", name: "+1",        token: "CCC", isPlus: true },   // слот спутника
  ];
}
function toItem(g) {
  return {
    id: g.id, type: "collectionItem", title: g.name,
    properties: {
      [F.token]: g.token,
      [F.attending]: g.attending || "",
      [F.drinks]: g.drinks || "",
      [F.drinkList]: g.drinkList || [],
      [F.answered]: !!g.answered,
      [F.comment]: g.comment || "",
      [F.isPlus]: !!g.isPlus,
    },
  };
}

// --- мок fetch: записывает вызовы, отдаёт канонические ответы Craft -----------
let calls;
let originalFetch;
function installMock(guests = fixtureGuests()) {
  calls = [];
  global.fetch = async (url, opts = {}) => {
    const method = (opts.method || "GET").toUpperCase();
    calls.push({ url, method, headers: opts.headers, body: opts.body ? JSON.parse(opts.body) : undefined });
    if (method === "GET" && url.includes("/blocks?id=")) {
      return mockRes(200, { type: "collection", items: guests.map(toItem) });
    }
    if (method === "PUT" && /\/collections\/.+\/items$/.test(url)) {
      return mockRes(200, { items: [] });
    }
    return mockRes(404, { error: "unmocked", url });
  };
}
function mockRes(status, obj) {
  return { ok: status >= 200 && status < 300, status, json: async () => obj };
}

beforeEach(() => { originalFetch = global.fetch; installMock(); });
afterEach(() => { global.fetch = originalFetch; });

// --- helpers -----------------------------------------------------------------
function ev(method, { q = {}, body, origin = "https://bonzarr.github.io", base64 = false } = {}) {
  let rawBody = "";
  if (body !== undefined) rawBody = base64 ? Buffer.from(JSON.stringify(body)).toString("base64") : JSON.stringify(body);
  return { httpMethod: method, headers: { Origin: origin }, queryStringParameters: q, body: rawBody, isBase64Encoded: base64 };
}
const parse = (r) => JSON.parse(r.body);
const putCall = () => calls.find((c) => c.method === "PUT");

// ============================ CORS / роутинг =================================
test("OPTIONS -> 204 + CORS отражает разрешённый origin", async () => {
  const r = await handler(ev("OPTIONS"));
  assert.equal(r.statusCode, 204);
  assert.equal(r.headers["Access-Control-Allow-Origin"], "https://bonzarr.github.io");
});

test("CORS: чужой origin не отражается (null)", async () => {
  const r = await handler(ev("GET", { q: { inv: "AAA" }, origin: "https://evil.example" }));
  assert.equal(r.headers["Access-Control-Allow-Origin"], "null");
});

test("GET без inv -> health ok", async () => {
  const r = await handler(ev("GET"));
  assert.equal(r.statusCode, 200);
  assert.deepEqual(parse(r), { ok: true });
});

test("неизвестный метод -> 405", async () => {
  const r = await handler(ev("DELETE"));
  assert.equal(r.statusCode, 405);
});

// ============================ GET чтение =====================================
test("GET valid token -> только гости этой группы (скоупинг)", async () => {
  const r = await handler(ev("GET", { q: { inv: "AAA" } }));
  assert.equal(r.statusCode, 200);
  const data = parse(r);
  assert.equal(data.token, "AAA");
  assert.deepEqual(data.guests.map((g) => g.name).sort(), ["Владислав", "Ольга"]);
  // чужой гость не утёк
  assert.ok(!data.guests.some((g) => g.name === "Иван"));
  // отдаём guestId (нужен для POST) и имя
  assert.ok(data.guests.every((g) => g.guestId && g.name));
});

test("GET читает именно гостевую коллекцию через /blocks", async () => {
  await handler(ev("GET", { q: { inv: "AAA" } }));
  const get = calls.find((c) => c.method === "GET");
  assert.ok(get.url.includes(`/blocks?id=${GUESTS_COLLECTION}`));
});

test("GET неизвестный токен -> 404", async () => {
  const r = await handler(ev("GET", { q: { inv: "ZZZ" } }));
  assert.equal(r.statusCode, 404);
});

// ============================ POST security ==================================
test("POST: guestId не из этого приглашения -> 403", async () => {
  const r = await handler(ev("POST", { body: { inv: "AAA", guestId: "g3", answers: { attending: "Да" } } }));
  assert.equal(r.statusCode, 403);
  assert.equal(putCall(), undefined); // запись не произошла
});

test("POST: несуществующий guestId -> 403", async () => {
  const r = await handler(ev("POST", { body: { inv: "AAA", guestId: "nope", answers: { attending: "Да" } } }));
  assert.equal(r.statusCode, 403);
});

test("POST: без обязательных полей -> 400", async () => {
  const r = await handler(ev("POST", { body: { inv: "AAA" } }));
  assert.equal(r.statusCode, 400);
});

test("POST: битый JSON -> 400", async () => {
  const r = await handler({ httpMethod: "POST", headers: {}, body: "{не json", isBase64Encoded: false });
  assert.equal(r.statusCode, 400);
});

// ============================ POST валидация =================================
test("POST: невалидный attending -> 400", async () => {
  const r = await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", answers: { attending: "Возможно" } } }));
  assert.equal(r.statusCode, 400);
  assert.equal(parse(r).error, "invalid_attending");
});

test("POST: невалидный drinks -> 400", async () => {
  const r = await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", answers: { attending: "Да", drinks: "Иногда" } } }));
  assert.equal(r.statusCode, 400);
  assert.equal(parse(r).error, "invalid_drinks");
});

// ============================ POST запись ====================================
test("POST valid -> 200 и корректный PUT в Craft (точный whitelist полей)", async () => {
  const r = await handler(ev("POST", {
    body: { inv: "AAA", guestId: "g1", answers: { attending: "Да", drinks: "Да", drinkList: ["Игристое вино", "Красное вино"], comment: "Без лактозы" } },
  }));
  assert.equal(r.statusCode, 200);

  const put = putCall();
  assert.ok(put, "должен быть PUT");
  assert.match(put.url, new RegExp(`/collections/${GUESTS_COLLECTION}/items$`));
  assert.equal(put.body.itemsToUpdate[0].id, "g1");
  assert.ok(!("allowNewSelectOptions" in put.body), "не должно создавать опции из ввода");

  const props = put.body.itemsToUpdate[0].properties;
  assert.equal(props[F.attending], "Да");
  assert.equal(props[F.drinks], "Да");
  assert.deepEqual(props[F.drinkList], ["Игристое вино", "Красное вино"]);
  assert.equal(props[F.answered], true);            // сервер ставит сам
  assert.match(props[F.date], /^\d{4}-\d{2}-\d{2}$/); // сервер ставит сам
  assert.equal(props[F.comment], "Без лактозы");
  // ровно ожидаемый набор ключей — клиент не может протащить лишнее
  assert.deepEqual(Object.keys(props).sort(), [F.attending, F.drinks, F.drinkList, F.comment, F.answered, F.date].sort());
});

test("POST: неизвестные напитки отфильтровываются", async () => {
  await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", answers: { attending: "Да", drinks: "Да", drinkList: ["Игристое вино", "ВЗЛОМ", "Текила"] } } }));
  assert.deepEqual(putCall().body.itemsToUpdate[0].properties[F.drinkList], ["Игристое вино", "Текила"]);
});

test("POST: дубли напитков схлопываются", async () => {
  await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", answers: { attending: "Да", drinks: "Да", drinkList: ["Водка", "Водка", "Ром"] } } }));
  assert.deepEqual(putCall().body.itemsToUpdate[0].properties[F.drinkList], ["Водка", "Ром"]);
});

test("POST attending=Нет -> напитки очищаются", async () => {
  await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", answers: { attending: "Нет", drinks: "Да", drinkList: ["Водка"] } } }));
  assert.deepEqual(putCall().body.itemsToUpdate[0].properties[F.drinkList], []);
});

test("POST drinks=Нет -> напитки очищаются", async () => {
  await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", answers: { attending: "Да", drinks: "Нет", drinkList: ["Водка"] } } }));
  assert.deepEqual(putCall().body.itemsToUpdate[0].properties[F.drinkList], []);
});

test("POST: комментарий обрезается до 1000 символов", async () => {
  const long = "я".repeat(5000);
  await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", answers: { attending: "Да", comment: long } } }));
  assert.equal(putCall().body.itemsToUpdate[0].properties[F.comment].length, 1000);
});

test("POST: тело в base64 (как шлёт Yandex) парсится", async () => {
  const r = await handler(ev("POST", { base64: true, body: { inv: "AAA", guestId: "g1", answers: { attending: "Да" } } }));
  assert.equal(r.statusCode, 200);
});

// ============================ +1 (спутник) ===================================
test("GET отдаёт флаг isPlus для слота спутника", async () => {
  const data = parse(await handler(ev("GET", { q: { inv: "CCC" } })));
  const anya = data.guests.find((g) => g.name === "Аня");
  const plus = data.guests.find((g) => g.guestId === "gp");
  assert.equal(anya.isPlus, false);
  assert.equal(plus.isPlus, true);
});

test("+1: можно задать имя спутника -> уходит в title (_7)", async () => {
  const r = await handler(ev("POST", { body: { inv: "CCC", guestId: "gp", name: "Пётр", answers: { attending: "Да" } } }));
  assert.equal(r.statusCode, 200);
  const upd = putCall().body.itemsToUpdate[0];
  assert.equal(upd[TITLE], "Пётр");
  assert.equal(parse(r).saved.name, "Пётр");
});

test("+1: «приду без спутника» = attending Нет, без имени", async () => {
  const r = await handler(ev("POST", { body: { inv: "CCC", guestId: "gp", answers: { attending: "Нет" } } }));
  assert.equal(r.statusCode, 200);
  const upd = putCall().body.itemsToUpdate[0];
  assert.equal(upd.properties[F.attending], "Нет");
  assert.equal(upd.properties[F.drinkList].length, 0);
  assert.ok(!(TITLE in upd), "имя не трогаем, если не прислано");
});

test("обычный гость НЕ может себя переименовать (name игнорируется)", async () => {
  await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", name: "Хакер", answers: { attending: "Да" } } }));
  const upd = putCall().body.itemsToUpdate[0];
  assert.ok(!(TITLE in upd), "title обычного гостя не меняется");
});

// ============================ устойчивость к сбоям Craft ======================
test("Craft вернул ошибку на чтении -> 500, не падаем", async () => {
  global.fetch = async () => mockRes(500, { error: "craft down" });
  const r = await handler(ev("GET", { q: { inv: "AAA" } }));
  assert.equal(r.statusCode, 500);
});

test("Craft вернул ошибку на записи -> 502", async () => {
  global.fetch = async (url, opts = {}) => {
    const method = (opts.method || "GET").toUpperCase();
    if (method === "GET") return mockRes(200, { type: "collection", items: fixtureGuests().map(toItem) });
    return mockRes(503, { error: "craft write down" });
  };
  const r = await handler(ev("POST", { body: { inv: "AAA", guestId: "g1", answers: { attending: "Да" } } }));
  assert.equal(r.statusCode, 502);
});
