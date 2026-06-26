/**
 * RSVP-прокси для свадебного лендинга — Yandex Cloud Function.
 *
 * Runtime: nodejs22 (есть глобальный fetch).  Entrypoint: index.handler
 *
 * Зачем: статический сайт на GitHub Pages не может безопасно держать секрет.
 * Craft connect-линк — это мастер-ключ ко ВСЕЙ базе (read/write/delete, без пароля,
 * CORS открыт на весь мир). Поэтому он живёт здесь, в переменной окружения
 * CRAFT_API, и наружу никогда не уходит. Браузер общается только с этой функцией.
 *
 * Наружу — ровно две операции, только над гостевой коллекцией (роутинг по методу,
 * т.к. у публичного URL функции нет путей):
 *   GET  ?inv=<id приглашения>       -> гости этого приглашения + их ответы
 *   POST {inv, guestId, answers}     -> сохранить ответ одного гостя
 * `inv` — это id записи в коллекции «Приглашения». Связь гость->приглашение хранится
 * relation-полем прямо в строке гостя, поэтому функция читает ОДНУ коллекцию («Гости»)
 * и фильтрует по этому id. Никаких DELETE, никакого доступа к другим коллекциям.
 *
 * Переменные окружения функции:
 *   CRAFT_API        — полный базовый URL с линком:
 *                      https://connect.craft.do/links/XXXXXXXX/api/v1
 *                      (лучше через Lockbox; см. README)
 *   ALLOWED_ORIGINS  — origin'ы лендинга через запятую, напр. https://bonzarr.github.io
 */

// Гостевая коллекция — захардкожена. Клиент НИКОГДА не передаёт id коллекции.
const GUESTS_COLLECTION = "2fd42736-e580-ff98-a421-e5ba577ad706"; // «Гости (RSVP)»

// СТАБИЛЬНЫЕ ключи колонок. В Craft ключ деривируется из ЛАТИНСКОГО имени колонки
// ("Attending" -> "attending", "Guests group" -> "guests_group") и НЕ сдвигается при
// reorder/add/remove — в отличие от позиционных ключей кириллических имён (_2, _3, …).
// Поэтому колонки «Гости» названы латиницей. ⚠️ НЕ переименовывать колонки: ключ
// следует за именем (переименовал — ключ сменился, функцию надо обновить).
const TITLE = "name"; // «Name» — заголовок item'а (читается как it.title)
const F = {
  invitation: "guests_group", // relation -> «Приглашения»; blockId = id приглашения = inv
  attending:  "attending",    // singleSelect — придёт: Да / Нет
  drinks:     "alcohol",      // singleSelect — будет пить алкоголь: Да / Нет
  drinkList:  "drinks",       // multiSelect  — какие напитки
  answered:   "answered",     // boolean      — ответ получен
  date:       "answeredat",   // date         — дата ответа (YYYY-MM-DD)
  comment:    "comment",      // text         — комментарий
};

const YES_NO = ["Да", "Нет"];
// Whitelist напитков — должен совпадать с src/rsvp/api.ts И с опциями multiSelect
// колонки «drinks» в Craft (функция намеренно НЕ создаёт опции из ввода, см. ниже).
const DRINKS = [
  "Игристое вино (полуслад)", "Игристое вино (полусух)",
  "Красное вино (полуслад)", "Красное вино (полусух)",
  "Белое вино (полуслад)", "Белое вино (полусух)",
  "Водка", "Коньяк", "Виски", "Настойки",
];
const MAX_COMMENT = 1000;

// Cloudflare (перед Craft) режет дефолтные UA — этот проверен как рабочий.
const UA = "curl/8.4.0";

exports.handler = async function (event) {
  const method = (event.httpMethod || "GET").toUpperCase();
  const cors = corsHeaders(headerOf(event, "origin"));

  if (method === "OPTIONS") return resp(204, cors, "");

  try {
    if (method === "GET") {
      const inv = ((event.queryStringParameters || {}).inv || "").trim();
      if (!inv) return jsonResp(200, cors, { ok: true }); // health-check
      return await handleGet(inv, cors);
    }
    if (method === "POST") {
      return await handlePost(parseBody(event), cors);
    }
    return jsonResp(405, cors, { error: "method_not_allowed" });
  } catch (err) {
    return jsonResp(500, cors, { error: "internal", message: String((err && err.message) || err) });
  }
};

// ---- GET ?inv=<id приглашения> ----------------------------------------------
async function handleGet(inv, cors) {
  const guests = (await readGuests()).filter((g) => g.invitationIds.includes(inv));
  if (guests.length === 0) return jsonResp(404, cors, { error: "invitation_not_found" });
  return jsonResp(200, cors, { inv, guests: guests.map(publicGuest) });
}

// ---- POST {inv, guestId, answers} -------------------------------------------
async function handlePost(body, cors) {
  if (!body) return jsonResp(400, cors, { error: "bad_json" });

  const inv = String(body.inv || "").trim();
  const guestId = String(body.guestId || "").trim();
  const a = body.answers || {};
  if (!inv || !guestId) return jsonResp(400, cors, { error: "missing_fields" });

  // авторизация: гость должен реально принадлежать этому приглашению
  const guest = (await readGuests()).find((g) => g.id === guestId && g.invitationIds.includes(inv));
  if (!guest) return jsonResp(403, cors, { error: "forbidden" });

  // строгая валидация входа (whitelist значений)
  const attending = normEnum(a.attending, YES_NO);
  if (attending === null) return jsonResp(400, cors, { error: "invalid_attending" });

  const drinks = a.drinks == null || a.drinks === "" ? "" : normEnum(a.drinks, YES_NO);
  if (drinks === null) return jsonResp(400, cors, { error: "invalid_drinks" });

  let drinkList = Array.isArray(a.drinkList) ? a.drinkList.filter((d) => DRINKS.includes(d)) : [];
  drinkList = [...new Set(drinkList)];
  if (attending === "Нет" || drinks === "Нет") drinkList = []; // не придёт / не пьёт

  const comment = String(a.comment || "").slice(0, MAX_COMMENT);

  const properties = {
    [F.attending]: attending,
    [F.drinks]:    drinks,
    [F.drinkList]: drinkList,
    [F.comment]:   comment,
    [F.answered]:  true,
    [F.date]:      todayISO(),
  };

  const item = { id: guestId, properties };

  const res = await craft("PUT", `/collections/${GUESTS_COLLECTION}/items`, { itemsToUpdate: [item] });
  if (!res.ok) return jsonResp(502, cors, { error: "craft_write_failed", status: res.status });

  return jsonResp(200, cors, { ok: true, guestId, saved: { attending, drinks, drinkList, comment } });
}

// ---- Craft helpers ----------------------------------------------------------
async function craft(method, path, body) {
  return fetch(process.env.CRAFT_API + path, {
    method,
    headers: { "Content-Type": "application/json", "Accept": "application/json", "User-Agent": UA },
    body: body == null ? undefined : JSON.stringify(body),
  });
}

// id приглашений, к которым привязан гость (из relation guests_group).
function relIds(rel) {
  const arr = rel && Array.isArray(rel.relations) ? rel.relations : [];
  return arr.map((r) => r && r.blockId).filter(Boolean);
}

// Один вызов отдаёт все item'ы коллекции с именами И свойствами.
async function readGuests() {
  const res = await craft("GET", `/blocks?id=${GUESTS_COLLECTION}`);
  if (!res.ok) throw new Error(`craft read ${res.status}`);
  const data = await res.json();
  const items = data.items || data.content || [];
  return items.map((it) => {
    const p = it.properties || {};
    return {
      id: it.id,
      name: it.title || "",
      invitationIds: relIds(p[F.invitation]),
      attending: p[F.attending] || "",
      drinks: p[F.drinks] || "",
      drinkList: Array.isArray(p[F.drinkList]) ? p[F.drinkList] : [],
      answered: !!p[F.answered],
      comment: p[F.comment] || "",
    };
  });
}

function publicGuest(g) {
  return {
    guestId: g.id, name: g.name, answered: g.answered,
    attending: g.attending, drinks: g.drinks, drinkList: g.drinkList, comment: g.comment,
  };
}

// ---- I/O & utils ------------------------------------------------------------
function headerOf(event, name) {
  const h = event.headers || {};
  const key = Object.keys(h).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? h[key] : "";
}

function parseBody(event) {
  try {
    let raw = event.body || "";
    if (event.isBase64Encoded) raw = Buffer.from(raw, "base64").toString("utf8");
    return raw ? JSON.parse(raw) : {};
  } catch { return null; }
}

function normEnum(v, allowed) {
  const s = String(v == null ? "" : v).trim();
  return allowed.includes(s) ? s : null;
}

function todayISO() {
  // дата по Москве (UTC+3); в РФ нет перехода на летнее время
  return new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);
}

function corsHeaders(origin) {
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const allow = allowed.length === 0 || allowed.includes(origin) ? (origin || "*") : "null";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function resp(statusCode, headers, body) {
  return { statusCode, headers, body, isBase64Encoded: false };
}

function jsonResp(statusCode, cors, obj) {
  return resp(statusCode, { "Content-Type": "application/json; charset=utf-8", ...cors }, JSON.stringify(obj));
}
