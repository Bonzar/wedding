/**
 * RSVP — чистая логика и сеть (перенос из assets/rsvp.js, TypeScript).
 * Вся «рискованная» логика — чистые функции, тестируются без DOM и без сети
 * (мок fetch). Секрет Craft живёт в функции-прокси, фронт ходит только сюда.
 */
import type { Answers, FetchLike, InviteResponse, SavePayload, YesNo } from "./types";

// В dev фронт ходит на /rsvp-api — Vite проксирует его в функцию server-side (без
// браузерного CORS, см. vite.config.ts), поэтому localhost НЕ нужно добавлять в
// ALLOWED_ORIGINS функции. В проде — прямой публичный URL (CORS залочен на github.io).
export const RSVP_API = import.meta.env.DEV
  ? "/rsvp-api"
  : "https://functions.yandexcloud.net/d4ej3htfmmdbnvbfsvkq";

// Порядок важен для вёрстки: сначала 6 вин (левая колонка), затем крепкие
// (правая колонка). Раскладку по колонкам см. RsvpModal.module.css (.checks).
export const DRINKS = [
  "Игристое вино (полуслад)",
  "Игристое вино (полусух)",
  "Красное вино (полуслад)",
  "Красное вино (полусух)",
  "Белое вино (полуслад)",
  "Белое вино (полусух)",
  "Водка",
  "Коньяк",
  "Виски",
  "Настойки",
] as const;

export type Drink = (typeof DRINKS)[number];

export type DrinkItem = { value: Drink; label: string };

/**
 * Раскладка чекбоксов напитков в модалке — ТОЛЬКО представление.
 * `value` — каноничное значение из DRINKS (его храним, валидируем и пишем в Craft);
 * `label` — короткая подпись для UI.
 * Структура: колонки → группы → пункты. Между группами больше воздуха, внутри
 * группы (пары вин, крепкое) пункты прижаты — расстояния задают .col/.group gap
 * в RsvpModal.module.css. Винные пары — отдельные группы из двух пунктов.
 */
export const DRINK_COLUMNS: ReadonlyArray<ReadonlyArray<ReadonlyArray<DrinkItem>>> = [
  [
    [
      { value: "Игристое вино (полуслад)", label: "Игристое вино (п/сл)" },
      { value: "Игристое вино (полусух)", label: "Игристое вино (п/сух)" },
    ],
    [
      { value: "Красное вино (полуслад)", label: "Красное вино (п/сл)" },
      { value: "Красное вино (полусух)", label: "Красное вино (п/сух)" },
    ],
    [{ value: "Настойки", label: "Настойки" }],
  ],
  [
    [
      { value: "Белое вино (полуслад)", label: "Белое вино (п/сл)" },
      { value: "Белое вино (полусух)", label: "Белое вино (п/сух)" },
    ],
    [
      { value: "Коньяк", label: "Коньяк" },
      { value: "Виски", label: "Виски" },
    ],
    [{ value: "Водка", label: "Водка" }],
  ],
];

export const ATT_YES = "Да, я буду присутствовать.";
export const ATT_NO = "Нет, к сожалению, не смогу прийти.";

/** Достаёт токен приглашения из query-строки (?inv=…). */
export function getInviteToken(search: string): string {
  const m = /[?&]inv=([^&]+)/.exec(search || "");
  return m ? decodeURIComponent(m[1]).trim() : "";
}

/** Экранирование для безопасной вставки в разметку (на случай ручного HTML). */
export function esc(s: unknown): string {
  return String(s == null ? "" : s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

/** Валидация ответов перед отправкой. Возвращает текст ошибки или null. */
export function validateAnswers(a: Partial<Answers>): string | null {
  if (a.attending !== "Да" && a.attending !== "Нет") return "Выберите, придёте ли вы";
  if (a.attending === "Да" && a.drinks && a.drinks !== "Да" && a.drinks !== "Нет") return "Ответьте про напитки";
  return null;
}

/**
 * Перечисление имён гостей для обращения (русская пунктуация):
 *   1 → «Имя»
 *   2 → «Имя и Имя»
 *   3 → «Имя, Имя и Имя»
 *   n → «Имя, …, Имя и Имя»
 * Пустые/пробельные имена отбрасываются. Порядок — как пришёл с бэка.
 */
export function joinGuestNames(names: ReadonlyArray<string>): string {
  const clean = names.map((n) => String(n ?? "").trim()).filter(Boolean);
  if (clean.length <= 1) return clean[0] ?? "";
  return `${clean.slice(0, -1).join(", ")} и ${clean[clean.length - 1]}`;
}

/**
 * Обращение в начале приглашения (Hero):
 * - кастомный «Приглашения».Congratulation → ДОСЛОВНО, как сохранено (без запятой, без
 *   нормализации; точные переносы строк/пустые строки автора сохраняются);
 * - иначе перечисление имён → «Имя, Имя и Имя,» (с запятой-обращением);
 * - нет ни того, ни другого → "" (фолбэк решает UI).
 * Отступ до текста-приглашения добавляет prependGreeting (см. правила там).
 */
export function buildGreeting(
  congratulation: string | undefined,
  guests: ReadonlyArray<{ name: string }>,
): string {
  const custom = String(congratulation ?? "");
  if (custom.trim()) return custom;
  const names = joinGuestNames(guests.map((g) => g.name));
  return names ? `${names},` : "";
}

/**
 * Склейка обращения и текста-приглашения для Hero. Пустое обращение → только текст.
 * Если обращение уже заканчивается переносом(ами) строки (кастомное — автор сам задаёт
 * их количество) — склеиваем КАК ЕСТЬ, сохраняя точное число пустых строк. Если переноса
 * нет (имена с запятой, либо кастом без хвостового переноса) — добавляем РОВНО один, чтобы
 * текст-приглашение начался со следующей строки.
 */
export function prependGreeting(greeting: string, body: string): string {
  if (!greeting.trim()) return body;
  return greeting.endsWith("\n") ? greeting + body : `${greeting}\n${body}`;
}

/** Нормализует ответ так же, как это сделает сервер (на случай рассинхрона UI). */
export function buildPayload(token: string, guestId: string, a: Partial<Answers>): SavePayload {
  const attending = (a.attending as YesNo | "" | undefined) ?? "";
  const drinks = attending === "Да" ? a.drinks || "" : "";
  const drinkList =
    attending === "Да" && drinks === "Да"
      ? [...new Set((a.drinkList || []).filter((d) => (DRINKS as readonly string[]).includes(d)))]
      : [];
  return {
    inv: token,
    guestId,
    answers: { attending: attending as YesNo | "", drinks: drinks as YesNo | "", drinkList, comment: String(a.comment || "").trim() },
  };
}

/** GET ?inv=TOKEN -> гости приглашения и их текущие ответы. */
export async function fetchInvite(token: string, fetchImpl: FetchLike = fetch): Promise<InviteResponse> {
  const res = await fetchImpl(`${RSVP_API}?inv=${encodeURIComponent(token)}`);
  if (res.status === 404) return { notFound: true };
  if (!res.ok) throw new Error(`http ${res.status}`);
  return (await res.json()) as InviteResponse;
}

/** POST {inv, guestId, answers} -> сохранить ответ одного гостя. */
export async function saveAnswer(
  token: string,
  guestId: string,
  a: Partial<Answers>,
  fetchImpl: FetchLike = fetch,
): Promise<{ ok?: boolean }> {
  const res = await fetchImpl(RSVP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildPayload(token, guestId, a)),
  });
  if (!res.ok) throw new Error(`save ${res.status}`);
  return (await res.json()) as { ok?: boolean };
}
