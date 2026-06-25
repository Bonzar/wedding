import type { CSSProperties } from "react";

// Approach A2 — редактируемая запись элемента. Геометрия и типографика разложены в
// числовые/строковые поля (прямо под контролы редактора), всё прочее — в raw.
// elStyle(record) собирает финальный inline-style; при пустых правках идентичен
// исходной Canva-вёрстке → пиксель-в-пиксель (0%).
export type El = {
  // геометрия
  x?: number; // translate X, px
  y?: number; // translate Y, px
  w?: number; // width, px
  h?: number; // height, px
  rot?: number; // rotate, deg
  scale?: number; // uniform scale
  sx?: number; // неравномерный масштаб по X (Option-растяжение); если задан sx/sy — имеет приоритет над scale
  sy?: number; // неравномерный масштаб по Y
  // текст
  font?: string; // font-family
  fontSize?: number; // px — в Canva это CSS-переменная --H97cbQ
  fontWeight?: CSSProperties["fontWeight"]; // 100–900 или "normal"/"bold"
  letterSpacing?: string; // напр. "0em"
  lineHeight?: string; // напр. "119px"
  textAlign?: CSSProperties["textAlign"];
  textTransform?: CSSProperties["textTransform"];
  color?: string;
  // всё не разложенное (вторичные custom-props, font-weight/kerning, сложные transform…)
  raw?: CSSProperties;
};

// Базовый цвет «чернил» макета. Любое его вхождение (текст/вектор) проводим через
// CSS-переменную палитры: `var(--d06-ink, <ink>)`. Когда переменная не задана — фолбэк =
// исходный цвет, т.е. рендер идентичен рефу (0%). Переменную ставит палитра (см. palette.ts).
const INK = "rgb(53, 80, 116)";
const isInk = (v: unknown): v is string => typeof v === "string" && v.replace(/\s+/g, "") === "rgb(53,80,116)";
const inkVar = (v: unknown): unknown => (isInk(v) ? `var(--d06-ink, ${INK})` : v);
// цветовые свойства, которые в этом макете несут «чернила» (текст + svg-разделители/заливки)
const INK_KEYS = ["color", "background", "backgroundColor", "fill", "stroke", "borderColor"] as const;

// --- d07: масштаб НА УРОВНЕ ЛАЙАУТА через контейнерные единицы cqw (вместо глобального
// transform/zoom/meta-хака d06). Лист снят на нативной ширине 1776px; каждый px переводим в
// cqw = 1% ширины контейнера-листа (.d07-root, container-type:inline-size). При контейнере
// ровно 1776px → 1cqw = 17.76px → cqw разрешается обратно в исходные px (натив 0%). При 880px
// → ×880/1776, как scale(880/1776) у d06. Браузер тайлит длинную страницу как обычно → нет
// гигантского GPU-слоя (iOS jetsam) и lazy-load снова работает. См. Design07.tsx / EDITOR.
const REF_WIDTH = 1776;
const K = 100 / REF_WIDTH; // px → cqw
// Конвертирует все вхождения `<число>px` (вкл. дроби/экспоненту/знак) в `<число>cqw`.
// Прочее (deg, unitless scale, em, url, цвета) не трогает. ПОЛНАЯ точность (без округления):
// px*K*(1776/100) === px в double-арифметике, поэтому на контейнере 1776 cqw разрешается ровно
// в исходные px (натив 0%). Округление (toFixed) копило −0.008px на секцию и давало +1px в
// растеризации скриншота из-за дробного верха следующей секции.
const PX_RE = /(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)px/gi;
const px2cqw = (v: string): string => v.replace(PX_RE, (_, n) => `${parseFloat(n) * K}cqw`);

// Публичный хелпер для КОМПОНЕНТОВ, которые рисуют кастомный контент НЕ через elStyle
// (Calendar-отсчёт, SVG-иконки, рамка карты, поля Journey/Survey…). В d06 их хардкод-px
// масштабировал глобальный transform; в d07 transform'а нет, поэтому такие px ОБЯЗАНЫ быть в
// cqw, иначе не масштабируются при сужении. cqw(58) → "3.26…cqw" (на 1776 = 58px).
export const cqw = (px: number): string => `${px * K}cqw`;

// keepInk=true — НЕ проводить чернила через палитру (для фиксированных образцов цвета:
// кружки-сэмплы дресс-кода Attire должны показывать СВОИ цвета, а не цвет палитры).
export function elStyle(r: El, opts?: { keepInk?: boolean }): CSSProperties {
  const s: CSSProperties = { ...(r.raw ?? {}) };
  const ink = opts?.keepInk ? (v: unknown) => v : inkVar;
  // raw-вхождения чернил (fill/stroke/background векторных фигур) — на палитру-переменную
  const sr = s as Record<string, unknown>;
  for (const k of INK_KEYS) if (sr[k] != null) sr[k] = ink(sr[k]);
  if (r.w != null) s.width = `${r.w}px`;
  if (r.h != null) s.height = `${r.h}px`;
  const tf: string[] = [];
  if (r.x != null || r.y != null) tf.push(`translate(${r.x ?? 0}px, ${r.y ?? 0}px)`);
  if (r.rot != null) tf.push(`rotate(${r.rot}deg)`);
  if (r.sx != null || r.sy != null) tf.push(`scale(${r.sx ?? 1}, ${r.sy ?? 1})`); // неравномерный приоритетнее
  else if (r.scale != null) tf.push(`scale(${r.scale})`);
  if (tf.length) s.transform = tf.join(" ");
  if (r.font != null) s.fontFamily = r.font;
  if (r.fontSize != null) s["--H97cbQ"] = `${r.fontSize}px`; // Canva-конвенция размера текста
  if (r.fontWeight != null) s.fontWeight = r.fontWeight;
  if (r.letterSpacing != null) s.letterSpacing = r.letterSpacing;
  if (r.lineHeight != null) s.lineHeight = r.lineHeight;
  if (r.textAlign != null) s.textAlign = r.textAlign;
  if (r.textTransform != null) s.textTransform = r.textTransform;
  if (r.color != null) s.color = ink(r.color) as CSSProperties["color"];
  // d07: единым проходом переводим ВСЕ px-значения стиля (width/height/transform/--H97cbQ/
  // lineHeight + любые px в raw: top/left/margin/padding/transformOrigin/translate...) в cqw.
  // Цвета/ink-var/deg/scale/em — без px-токенов, остаются как есть.
  const out = s as Record<string, unknown>;
  for (const k in out) if (typeof out[k] === "string") out[k] = px2cqw(out[k] as string);
  return s;
}
