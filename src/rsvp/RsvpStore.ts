import { makeAutoObservable, runInAction } from "mobx";
import type { Answers, FetchLike, Guest, YesNo } from "./types";
import { DRINKS, buildGreeting, fetchInvite, saveAnswer, validateAnswers } from "./api";

export type ListState = "no-token" | "loading" | "ready" | "empty" | "error";

export interface RsvpDeps {
  /** query-строка (по умолчанию window.location.search) */
  search?: string;
  /** реализация fetch (мокается в тестах) */
  fetchImpl?: FetchLike;
}

// Обёртка вокруг глобального fetch: нельзя хранить native fetch как поле и звать
// this.fetchImpl(url) — у fetch теряется привязка к window («Illegal invocation»),
// особенно после оборачивания MobX. Замыкание зовёт fetch корректно.
const defaultFetch: FetchLike = (input, init) => fetch(input, init);

function emptyAnswers(): Answers {
  return { attending: "", drinks: "", drinkList: [], comment: "" };
}

function answersFromGuest(g: Guest): Answers {
  return {
    attending: (g.attending as YesNo | "") || "",
    drinks: (g.drinks as YesNo | "") || "",
    drinkList: [...(g.drinkList || [])],
    comment: g.comment || "",
  };
}

/**
 * Стор RSVP: загрузка гостей по токену из ссылки, состояние списка, модалка-анкета
 * и сохранение ответа. Сеть инжектится (герметичные тесты). Никаких прямых
 * обращений к Craft — только через функцию-прокси (см. api.ts).
 */
export class RsvpStore {
  token = "";
  listState: ListState = "loading";
  guests: Guest[] = [];
  /** Кастомное обращение приглашения (если задано в Craft); иначе "". */
  congratulation = "";

  activeGuestId: string | null = null;
  draft: Answers = emptyAnswers();
  saving = false;
  message: { text: string; error: boolean } | null = null;

  // public, чтобы ключ попал в AnnotationsMap MobX (исключаем из наблюдаемых ниже)
  readonly fetchImpl: FetchLike;
  readonly drinks = DRINKS;

  constructor(deps: RsvpDeps = {}) {
    const search = deps.search ?? (typeof window !== "undefined" ? window.location.search : "");
    this.fetchImpl = deps.fetchImpl ?? defaultFetch;
    this.token = parseToken(search);
    makeAutoObservable(this, { fetchImpl: false, drinks: false }, { autoBind: true });
  }

  get hasToken(): boolean {
    return this.token.length > 0;
  }

  /**
   * Обращение для Hero: кастомный текст из Craft или перечисление имён гостей.
   * "" — нет ни того, ни другого (UI решает фолбэк). См. buildGreeting в api.ts.
   */
  get greeting(): string {
    return buildGreeting(this.congratulation, this.guests);
  }

  get activeGuest(): Guest | null {
    return this.guests.find((g) => g.guestId === this.activeGuestId) ?? null;
  }

  /** Показывать ли вопрос «будете ли пить» (придёт = Да). */
  get showDrinksQuestion(): boolean {
    return this.draft.attending === "Да";
  }

  /** Показывать ли список напитков (придёт = Да и пьёт = Да). */
  get showDrinkList(): boolean {
    return this.draft.attending === "Да" && this.draft.drinks === "Да";
  }

  async load(): Promise<void> {
    if (!this.hasToken) {
      runInAction(() => {
        this.listState = "no-token";
      });
      return;
    }
    runInAction(() => {
      this.listState = "loading";
    });
    try {
      const data = await fetchInvite(this.token, this.fetchImpl);
      runInAction(() => {
        this.congratulation = data.congratulation || "";
        if (data.notFound || !data.guests || !data.guests.length) {
          this.guests = [];
          this.listState = "empty";
        } else {
          this.guests = data.guests;
          this.listState = "ready";
        }
      });
    } catch (e) {
      if (import.meta.env?.DEV) console.error("[rsvp] load failed:", e);
      runInAction(() => {
        this.listState = "error";
      });
    }
  }

  openGuest(guestId: string): void {
    const guest = this.guests.find((g) => g.guestId === guestId);
    if (!guest) return;
    this.activeGuestId = guestId;
    this.draft = answersFromGuest(guest);
    this.message = null;
  }

  closeModal(): void {
    this.activeGuestId = null;
    this.message = null;
  }

  setAttending(v: YesNo): void {
    this.draft.attending = v;
  }

  setDrinks(v: YesNo): void {
    this.draft.drinks = v;
  }

  toggleDrink(d: string): void {
    const i = this.draft.drinkList.indexOf(d);
    if (i >= 0) this.draft.drinkList.splice(i, 1);
    else this.draft.drinkList.push(d);
  }

  setComment(c: string): void {
    this.draft.comment = c;
  }

  async save(): Promise<void> {
    const err = validateAnswers(this.draft);
    if (err) {
      this.message = { text: err, error: true };
      return;
    }
    const guest = this.activeGuest;
    if (!guest) return;
    this.saving = true;
    this.message = { text: "Сохраняем…", error: false };
    try {
      await saveAnswer(this.token, guest.guestId, this.draft, this.fetchImpl);
      runInAction(() => {
        guest.answered = true;
        guest.attending = this.draft.attending;
        guest.drinks = this.draft.drinks;
        guest.drinkList = [...this.draft.drinkList];
        guest.comment = this.draft.comment;
        this.saving = false;
        this.message = { text: "Спасибо! Ответ сохранён.", error: false };
      });
    } catch {
      runInAction(() => {
        this.saving = false;
        this.message = { text: "Не удалось сохранить. Попробуйте ещё раз.", error: true };
      });
    }
  }
}

function parseToken(search: string): string {
  const m = /[?&]inv=([^&]+)/.exec(search || "");
  return m ? decodeURIComponent(m[1]).trim() : "";
}
