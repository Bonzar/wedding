/**
 * Канонический контент приглашения — единственный источник правды по тексту и
 * датам. Перенесён дословно из прежнего build_index.py. Меняешь свадебные детали
 * (дата, место, программа) — здесь, а не в разметке секций.
 */

export const COUPLE = {
  groomFull: "Владислав Навоян",
  brideFull: "Ольга Финикова",
  groomShort: "Владислав",
  brideShort: "Ольга",
} as const;

/** Целевой момент свадьбы (МСК, UTC+3) — для обратного отсчёта. */
export const WEDDING_DATE_ISO = "2026-09-26T16:00:00+03:00";

export const EVENT = {
  dateHuman: "26 сентября 2026",
  city: "Сочи",
  /** «26 сентября 2026 · Сочи» — мета-строка hero */
  dateCity: "26 сентября 2026 · Сочи",
  rsvpDeadlineHuman: "1 сентября 2026",
} as const;

export const VENUE = {
  name: "Загородный комплекс «Три кедра», Сочи",
  noteName: "«Три кедра»",
  mapUrl: "https://yandex.ru/maps/239/sochi/?text=Три+кедра+Сочи",
} as const;

/** Сентябрь 2026: 1 сентября — вторник (одна пустая ячейка в начале), 30 дней, выделяем 26. */
export const CALENDAR = {
  monthLabel: "Сентябрь 2026",
  weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  leadEmpty: 1,
  days: 30,
  highlight: 26,
  note: "26 сентября 2026 · день нашей свадьбы",
} as const;

export interface TimelineItem {
  time: string;
  title: string;
}
export const TIMELINE: TimelineItem[] = [
  { time: "17:00", title: "Церемония" },
  { time: "18:00", title: "Фотосессия" },
  { time: "19:00", title: "Праздничный ужин" },
  { time: "20:00", title: "Тосты и поздравления" },
  { time: "22:00", title: "Танцы" },
];

export interface DetailBlock {
  title: string;
  text: string;
}
export const DETAILS: DetailBlock[] = [
  {
    title: "Размещение",
    text: "Для гостей предусмотрено проживание в загородном комплексе «Три кедра» по специальному тарифу. При бронировании укажите, что вы с нашей свадьбы.",
  },
  {
    title: "Трансфер",
    text: "Площадка примерно в 30 минутах от аэропорта и вокзала. Для гостей будет организован трансфер, на территории есть парковка.",
  },
];

export const ATTIRE = {
  text: "Будем благодарны, если вы поддержите атмосферу праздника нарядами в мягких, приглушённых тонах — без ярких и кричащих цветов.",
} as const;

export const GIFT = {
  text: "Ваше присутствие — самый ценный подарок для нас. Если захотите порадовать нас, будем благодарны вкладу в наше общее будущее.",
} as const;

export interface JourneyStep {
  caption: string;
  illustration: string;
  reverse: boolean;
}
export const JOURNEY: JourneyStep[] = [
  { caption: "Так мы впервые встретились — и тогда ещё не знали, что это начало чего-то большого.", illustration: "peony", reverse: false },
  { caption: "Мы пошли по жизни вдвоём — деля смех, мечты и тёплые воспоминания.", illustration: "butterfly", reverse: true },
  { caption: "И однажды искреннее «да» скрепило наше обещание быть вместе.", illustration: "floral-spray", reverse: false },
];

export const RSVP_INTRO = {
  title: "RSVP",
  text: `Пожалуйста, подтвердите своё присутствие до ${EVENT.rsvpDeadlineHuman} года — это поможет нам всё подготовить.`,
} as const;

export const SURVEY_INTRO = {
  eyebrow: "RSVP",
  title: "Для нас важно знать",
  text: "Пожалуйста, ответьте на несколько вопросов, чтобы подтвердить своё присутствие. Ваш ответ очень поможет нам в подготовке к свадьбе.",
} as const;

export const CLOSING = {
  text: "Мы благодарны за вашу любовь и поддержку. Ваше присутствие сделает этот день по-настоящему особенным — и мы с радостью разделим его с вами.",
} as const;
