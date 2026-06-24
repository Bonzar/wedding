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
 *  его values под текущий цвет. Деф висит в `document.body` (НЕ в `.d06-page`): React при
 *  ре-рендере канвы не удалит его, и цвет иллюстраций не рассинхронится с текстом. */
function ensureFilter(color: string): void {
  let mat = document.getElementById(`${FILTER_ID}-mat`) as Element | null;
  if (!mat) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("id", `${FILTER_ID}-svg`);
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
    document.body.appendChild(svg);
  }
  (mat as Element).setAttribute("values", inkMatrix(color));
}

// ── Динамический favicon «BO!» ──────────────────────────────────────────────
// Тот же каллиграфический контур, что в public/favicon.svg, но цвет подставляется
// из активной палитры. color управляет и обводкой букв (currentColor), и точкой «!».
const FAVICON_VIEWBOX = "0 0 64 64";

/** SVG favicon «BO!» как строка с заменяемым цветом (контур — path, не <text>). */
function faviconSvg(color: string): string {
  return `<svg xmlns="${SVG_NS}" viewBox="${FAVICON_VIEWBOX}" width="32" height="32" color="${color}">` +
    `<g fill="none" stroke="currentColor" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="M16 11 C 14.5 25 13.5 39 11 53"/>` +
    `<path d="M16 11 C 28 8 33 18.5 25 24.5 C 22 26.8 18 26 13.6 30.5"/>` +
    `<path d="M14.4 30 C 30 26 37 36 28.5 45 C 24.5 50 16 51 11 53"/>` +
    `<path d="M46 16.5 C 34.5 14.5 31.5 31 36.5 43.5 C 41 54 51.5 51.5 52.5 39 C 53.4 28 51 16.8 43.5 18"/>` +
    `<path d="M58.5 14 C 58.2 25 57.2 33 56 41"/>` +
    `</g>` +
    `<circle cx="55" cy="49.5" r="3" fill="currentColor"/>` +
    `</svg>`;
}

/** Обновить favicon в DOM blob-URL'ом с заданным цветом. Создаёт <link rel="icon">,
 *  если его нет (паттерн ensureFilter). Предыдущий blob-URL освобождаем. */
function updateFavicon(color: string): void {
  if (typeof document === "undefined") return;
  const svg = faviconSvg(color);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    document.head.appendChild(link);
  }

  if (link.href.startsWith("blob:")) URL.revokeObjectURL(link.href);
  link.href = url;
}

const setFilter = (img: HTMLImageElement, on: boolean): void => {
  const f = on ? `url(#${FILTER_ID})` : "";
  if (img.style.filter !== f) img.style.filter = f;
};

// Для ДОБАВЛЕННЫХ через редактор картинок «иллюстрация или фото» решаем по прозрачности
// (контур/гравюра = есть alpha-«дырки»; фото = непрозрачное). Решение кешируем на элементе
// (детект асинхронный — грузим картинку в canvas и считаем долю прозрачных пикселей).
const decided = new WeakMap<HTMLImageElement, boolean>();

function detectTransparency(src: string): Promise<boolean> {
  return new Promise((res) => {
    if (!src) return res(false);
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => {
      try {
        const W = 48, H = Math.max(1, Math.round((48 * im.naturalHeight) / (im.naturalWidth || 1)));
        const c = document.createElement("canvas");
        c.width = W; c.height = H;
        const ctx = c.getContext("2d");
        if (!ctx) return res(false);
        ctx.drawImage(im, 0, 0, W, H);
        const d = ctx.getImageData(0, 0, W, H).data;
        let tr = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] < 200) tr++;
        res(tr / (W * H) > 0.05); // >5% прозрачных → контур/гравюра (красим); иначе фото
      } catch {
        res(false); // canvas «запачкан» cross-origin → считаем фото (не красим)
      }
    };
    im.onerror = () => res(false);
    im.src = src;
  });
}

function sweep(r: HTMLElement, on: boolean): void {
  for (const img of Array.from(r.querySelectorAll("img"))) {
    if (img.classList.contains(ILL_CLASS)) {
      setFilter(img, on); // существующая контурная иллюстрация (svg/растровый блоб) — всегда
    } else if (img.closest(".d06-add-img")) {
      // добавленная картинка: фото НЕ красим, контур/гравюру — красим (по прозрачности)
      if (decided.has(img)) setFilter(img, on && decided.get(img)!);
      else {
        setFilter(img, false); // пока не выяснили — не красим (фото не мигает цветом)
        detectTransparency(img.currentSrc || img.getAttribute("src") || "").then((isIll) => {
          decided.set(img, isIll);
          if (current) setFilter(img, isIll);
        });
      }
    }
    // иначе — фото секций (нет .dMHlHA, не добавление): не трогаем
  }
}

function connectObserver(r: HTMLElement): void {
  if (!observer) {
    observer = new MutationObserver((muts) => {
      // замена файла у добавленной картинки → переоценить прозрачность (сброс кеша)
      for (const m of muts) if (m.type === "attributes" && m.target instanceof HTMLImageElement) decided.delete(m.target);
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
  // Переменные ставим на :root (как делает [data-theme] дизайн-системы): тогда ПРОИЗВОДНЫЕ
  // токены --ink-strong/-muted/-faint/--text/--line (объявлены на :root через color-mix(var(--ink)))
  // пересчитываются под новый --ink. Если ставить на .d06-page — они резолвятся на :root и не
  // меняются (Countdown/список гостей оставались бы синими). --d06-ink — для elStyle-фолбэка.
  const de = document.documentElement;
  observer?.disconnect();
  if (color) {
    ensureFilter(color);
    de.style.setProperty("--d06-ink", color); // Canva-текст/векторы (через elStyle-фолбэк)
    de.style.setProperty("--ink", color); // дизайн-система: Countdown/Survey/листики/пунктиры + производные
  } else {
    de.style.removeProperty("--d06-ink");
    de.style.removeProperty("--ink");
  }
  updateFavicon(color ?? INK); // favicon в цвет палитры (или базовые чернила при сбросе)
  sweep(r, color != null);
  if (color != null) connectObserver(r);
}

/** Текущий применённый цвет (или null). */
export const currentPalette = (): string | null => current;

/** Снять наблюдатель и убрать :root-переменные (Design06 размонтирован — иначе палитра
 *  «протекла» бы на обычные страницы приложения при SPA-навигации с ?d06). */
export function teardownPalette(): void {
  observer?.disconnect();
  observer = null;
  const de = document.documentElement;
  de.style.removeProperty("--d06-ink");
  de.style.removeProperty("--ink");
  document.getElementById(`${FILTER_ID}-svg`)?.remove(); // деф-фильтр из body
  updateFavicon(INK); // вернуть favicon к базовым чернилам
}
