export type YesNo = "Да" | "Нет";

/** Ответы гостя в анкете. */
export interface Answers {
  attending: YesNo | "";
  drinks: YesNo | "";
  drinkList: string[];
  comment: string;
}

/** Публичные данные гостя (как отдаёт функция-прокси). */
export interface Guest {
  guestId: string;
  name: string;
  answered: boolean;
  isPlus: boolean;
  attending: string;
  drinks: string;
  drinkList: string[];
  comment: string;
}

/** Тело POST в функцию-прокси. */
export interface SavePayload {
  inv: string;
  guestId: string;
  answers: Answers;
}

/** Ответ GET ?inv=TOKEN. */
export interface InviteResponse {
  token?: string;
  inv?: string;
  /** Кастомное обращение из «Приглашения».Congratulation; "" если не задано. */
  congratulation?: string;
  guests?: Guest[];
  notFound?: boolean;
}

export type FetchLike = typeof fetch;
