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

export const DRINKS = [
  "Игристое вино",
  "Водка",
  "Красное вино",
  "Белое вино",
  "Коньяк",
  "Виски",
  "Ликёр",
  "Настойки",
  "Ром",
  "Текила",
] as const;

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
