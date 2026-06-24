// Палитра design06: один акцентный цвет («чернила») перекрашивает ВЕСЬ монохромный
// макет — текст, векторные разделители/заливки/кнопки и контурные иллюстрации (svg +
// растровые), НЕ трогая фото и фиксированные образцы цвета (кружки дресс-кода).
//
// Три канала перекраски:
//   • Текст и Canva-векторы (color/background/fill/stroke) — `elStyle()` (layout.ts)
//     подменяет литерал чернил на `var(--d06-ink, <ink>)`. Нет переменной → фолбэк =
//     исходный цвет → 0% сохраняется.
//   • Дизайн-система (Countdown, список гостей Survey, листики, пунктиры) красится своим
//     токеном `var(--ink)` и производными `--ink-strong/-muted`. Палитра переопределяет
//     `--ink` на `.d06-page` — производные (lazy `color-mix`) подхватывают её каскадно.
//   • Контурные <img> (класс .dMHlHA в /blobs + добавленные картинки) — растр/SVG. Красим
//     SVG-фильтром `feColorMatrix`, который РЕМАППИТ яркостный градиент [чернила→белый] в
//     [палитра→белый], СОХРАНЯЯ тональность (гравюры платья/костюма с белыми и бумажными
//     заливками не схлопываются в силуэт). Прозрачность сохраняется (alpha-строка = id).
//     Фото (.dMHlHA нет) фильтр не получают.
//
// applyPalette(color) зовут и Design06 (на маунте, цвет из paletteState — работает на
// проде), и редактор (live при выборе свотча). MutationObserver докрашивает картинки,
// появившиеся после HMR / добавления / замены файла.
import styles from "./canva.module.css";

export { activePalette } from "./paletteState";

/** Базовый цвет «чернил» макета (Canva-реф). Совпадает с литералом в layout.ts/elStyle. */
export const INK = "rgb(53, 80, 116)";

/** 20 оттенков для пикета — сдержанные «свадебные» тона по кругу: сине-зелёные → тёплые →
 *  винные → нейтраль. value = любой валидный CSS-цвет (его пишем в `--d06-ink`/`--ink`). */
export const PALETTE_COLORS: { name: string; value: string }[] = [
  { name: "Сапфир", value: "#1f3a5f" },
  { name: "Стальной", value: "#3d5a80" },
  { name: "Лазурь", value: "#2d6a8f" },
  { name: "Бирюза", value: "#2a7d77" },
  { name: "Малахит", value: "#2f6b4f" },
  { name: "Хвоя", value: "#355e3b" },
  { name: "Шалфей", value: "#6b8e6a" },
  { name: "Олива", value: "#6f6a37" },
  { name: "Латунь", value: "#8a6d3b" },
  { name: "Охра", value: "#b5832f" },
  { name: "Терракота", value: "#b15a3c" },
  { name: "Кирпич", value: "#9c4430" },
  { name: "Сангина", value: "#8c3b2e" },
  { name: "Бордо", value: "#7c2f3e" },
  { name: "Вино", value: "#5e2a44" },
  { name: "Слива", value: "#4a2c4e" },
  { name: "Индиго", value: "#3b3b6b" },
  { name: "Лаванда", value: "#6a5a8c" },
  { name: "Пыльная роза", value: "#a45d6e" },
  { name: "Графит", value: "#36404a" },
];

const ROOT_SEL = ".d06-page"; // обёртка design06: внутри и Canva-вёрстка, и слой добавлений
                              // (на ней живут --d06-ink/--ink → наследуются всем). См. Design06.tsx
const ILL_CLASS = styles.dMHlHA; // хешированный класс контурного <img> (тот же, что в секциях)
const FILTER_ID = "d06-ink-recolor";
const OBS_OPTS: MutationObserverInit = { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] };
const SVG_NS = "http://www.w3.org/2000/svg";
// Яркость чернил (Rec.601, 0..1) — нижняя точка ремаппинга. white = верхняя (1).
const L = [0.299, 0.587, 0.114] as const;
const INK_LUM = (L[0] * 53 + L[1] * 80 + L[2] * 116) / 255;

let current: string | null = null;
let observer: MutationObserver | null = null;

const root = (): HTMLElement | null =>
  typeof document === "undefined" ? null : document.querySelector<HTMLElement>(ROOT_SEL);

/** "#rgb"/"#rrggbb"/"rgb(r,g,b)" → [r,g,b] 0..255. */
function parseColor(c: string): [number, number, number] {
  const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) return [+m[1], +m[2], +m[3]];
  let h = c.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** feColorMatrix, ремаппящий яркостный градиент [чернила→белый] в [палитра→белый].
 *  out_c = lerp(P_c, 1, ratio), ratio = (lum − INK_LUM)/(1 − INK_LUM); линейно по R,G,B —
 *  выражается матрицей. alpha-строка = identity (прозрачность не трогаем). */
function inkMatrix(color: string): string {
  const P = parseColor(color).map((v) => v / 255);
  const rowFor = (p: number): string => {
    const m = (1 - p) / (1 - INK_LUM);
    return `${m * L[0]} ${m * L[1]} ${m * L[2]} 0 ${p - m * INK_LUM}`;
  };
  return `${rowFor(P[0])} ${rowFor(P[1])} ${rowFor(P[2])} 0 0 0 1 0`;
}

/** Гарантировать <svg><filter id=FILTER_ID><feColorMatrix></filter></svg> в DOM и обновить
 *  его values под текущий цвет. Возвращает feColorMatrix (или null). */
function ensureFilter(host: HTMLElement, color: string): void {
  let mat = document.getElementById(`${FILTER_ID}-mat`) as Element | null;
  if (!mat) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", FILTER_ID);
    filter.setAttribute("color-interpolation-filters", "sRGB"); // считать в sRGB, как наша математика
    mat = document.createElementNS(SVG_NS, "feColorMatrix");
    (mat as Element).setAttribute("id", `${FILTER_ID}-mat`);
    (mat as Element).setAttribute("type", "matrix");
    filter.appendChild(mat);
    svg.appendChild(filter);
    host.appendChild(svg);
  }
  (mat as Element).setAttribute("values", inkMatrix(color));
}

/** Контурная иллюстрация (красим), а не фото: класс .dMHlHA или добавленная картинка. */
function isIllustration(img: HTMLImageElement): boolean {
  return img.classList.contains(ILL_CLASS) || !!img.closest(".d06-add-img");
}

function sweep(r: HTMLElement, on: boolean): void {
  const f = on ? `url(#${FILTER_ID})` : "";
  for (const img of Array.from(r.querySelectorAll("img"))) {
    if (isIllustration(img) && img.style.filter !== f) img.style.filter = f;
  }
}

function connectObserver(r: HTMLElement): void {
  if (!observer) {
    observer = new MutationObserver(() => {
      observer!.disconnect(); // правки filter сами мутируют DOM — не зацикливаемся
      sweep(r, true);
      observer!.observe(r, OBS_OPTS);
    });
  }
  observer.observe(r, OBS_OPTS);
}

/** Применить палитру ко всему макету. color=null → снять (вернуться к базовым чернилам). */
export function applyPalette(color: string | null): void {
  current = color;
  const r = root();
  if (!r) return;
  observer?.disconnect();
  if (color) {
    ensureFilter(r, color);
    r.style.setProperty("--d06-ink", color); // Canva-текст/векторы (через elStyle-фолбэк)
    r.style.setProperty("--ink", color); // дизайн-система (Countdown/Survey/листики/пунктиры)
  } else {
    r.style.removeProperty("--d06-ink");
    r.style.removeProperty("--ink");
  }
  sweep(r, color != null);
  if (color != null) connectObserver(r);
}

/** Текущий применённый цвет (или null). */
export const currentPalette = (): string | null => current;

/** Снять наблюдатель (Design06 размонтирован). Фильтр/переменные уйдут с узлами. */
export function teardownPalette(): void {
  observer?.disconnect();
  observer = null;
}
