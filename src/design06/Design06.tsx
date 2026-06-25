// Pixel-exact baseline of the design06 reference, rendered inside the React app.
//
// Stage 1 of componentization: the whole captured layout is rendered as one block
// via the generated body HTML (guaranteed 1:1 with public/design06-exact/). The same
// Canva stylesheets + bundled fonts are loaded by URL from the committed static copy,
// so nothing is re-derived. Later stages split _generated/sections/* into real
// per-section components, diffing each crop against this baseline.
//
// Mounted behind ?d06 (see App.tsx) so the Canva global CSS never touches the app.

import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import "./canva-base.css"; // Canva :root/тема-переменные + @keyframes (грузится только на ?d06)
import "./custom-fonts.css"; // доп. (не-Canva) шрифты из assets/fonts (грузится только на ?d06)
import overrideCss from "./_generated/override.css?raw";
import headLinksRaw from "./_generated/head-links.json?raw";
import { DESIGN06_SECTIONS } from "./sections";
import { RsvpModal } from "@/rsvp/components/RsvpModal"; // анкета гостя для раздела Survey (портал в body, rem)
import { elStyle } from "./layout";
import { assetUrl } from "./assetUrl";
import type { Addition } from "./additions";
import { useAdditions } from "./editor/additionsStore"; // слой добавленных в редакторе элементов
import { activePalette, applyPalette, currentPalette, teardownPalette } from "./palette"; // акцентный цвет (перекраска текста+иллюстраций)

// Визуальный редактор — только dev и только по ?edit. В прод-сборке import.meta.env.DEV
// статически false → тернарник сворачивается, и Rollup вообще не эмитит чанк редактора
// (его JS+CSS не попадают в deploy). Когда не смонтирован — рендер = база 0%. См. editor/.
const Editor = import.meta.env.DEV ? lazy(() => import("./editor/Editor")) : null;

// Из Canva-стайлшитов линком оставляем ТОЛЬКО шрифты (design-fonts.css). Утилиты-классы —
// в canva.module.css, переменные/keyframes — в canva-base.css. Остальные Canva-<link> убраны.
const cssHrefs: string[] = (JSON.parse(headLinksRaw) as string[]).filter((h) => h.includes("design-fonts"));

// Макет снят на нативной ширине 1776px. Поведение под ширину окна:
//   viewport <= 880  → масштабируем под ширину (карточка во весь экран);
//   viewport >  880  → ширина фиксируется на 880px, карточка по центру.
// ?d06&noscale отключает скейлер (масштаб 1:1) — для пиксельного сравнения с эталоном.
const REF_WIDTH = 1776;
const MAX_WIDTH = 880;
// Оверскан для мобилы: лист, вписанный в экран ровно по ширине, выглядит мелко.
// Масштабируем чуть сильнее (1.0 = как раньше, целиком; 1.12 = крупнее на 12%), а поля
// по краям уходят под обрез — обёртка центрирует и режет симметрично (overflow:hidden).
// 1.12 → срезается ~5.4% ширины с каждой стороны (только поля-подложка, не контент).
const MOBILE_OVERSCAN = 1.25;
// Основной (кремовый) тон бумаги-подложки — средний цвет текстуры hero-backdrop.
// Им заливаются поля по краям экрана за пределами листа (контент остаётся ≤ MAX_WIDTH),
// чтобы вместо белых полос фон всегда был основным цветом. См. inline-<style> ниже.
const PAGE_BG = "#faf7f0";
const EDIT_BAR = 36; // высота тулбара редактора
const EDIT_PANEL = 300; // зарезервировано справа под инспектор (панель 280 + зазор)

// content-visibility: auto на секциях — браузер пропускает рендер/растеризацию/декод
// картинок офф-скрин секций. Критично для мобилы: весь лист 1776×~15000 живёт в одном
// scaled-слое; без этого все ~9 секций декодируются и держатся в памяти разом, и быстрый
// скролл переращивает гигантский слой → краш рендера на iOS. contain-intrinsic-size = РЕАЛЬНАЯ
// высота секции (canvas px), поэтому offsetHeight/замер высоты листа не меняется (без прыжков
// скролла). [id, высота frame] из *.layout.ts. Survey пропущен (живой RSVP, переменная высота).
const SECTION_HEIGHTS: [string, number][] = [
  ["PBbM6hRVrsx6MjPz", 1412], // Hero
  ["PBtLyKJDZDgGk7P1", 2699], // Calendar
  ["PBGrcDNxzKvrxrJt", 1840], // Timeline
  ["PBsHbr4J9zLLY08q", 1554], // Details
  ["PBL8ZPfjvBzXjMPd", 969], // Attire
  ["PB09PH75zdFrcMmz", 1172], // Gift
  ["PBYbv3X7MfRLX7B4", 4488], // Journey
  ["PB9GyzXqcqH056Yr", 1131], // Closing
];
const CV_CSS = SECTION_HEIGHTS.map(
  ([id, h]) => `#${id}{content-visibility:auto;contain-intrinsic-size:${REF_WIDTH}px ${h}px}`,
).join("");

// Один добавленный элемент (текст или картинка). Простой absolute-бокс в координатах канвы,
// data-eid `add/<id>` → редактор адресует его как обычный объект. pointer-events:auto, чтобы
// его можно было выбрать (слой-контейнер сам pointer-events:none и не мешает странице).
function AddedEl({ a }: { a: Addition }) {
  const base = elStyle(a) as CSSProperties;
  const style: CSSProperties = { ...base, position: "absolute", pointerEvents: "auto" };
  if (a.kind === "text") {
    return (
      <div data-eid={`add/${a.id}`} className="d06-add d06-add-text" style={{ ...style, fontSize: a.fontSize ? `${a.fontSize}px` : undefined }}>
        {a.text}
      </div>
    );
  }
  return (
    <div data-eid={`add/${a.id}`} className="d06-add d06-add-img" style={{ ...style, overflow: "hidden" }}>
      {a.src && <img src={assetUrl(a.src)} draggable={false} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
    </div>
  );
}

export default function Design06() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const noScale = params.has("noscale");
  // ?baseline — рендер для 0%-проверки против статического эталона: раздел Survey
  // (его в Canva-рефе нет) скрывается, чтобы не ломать полностраничный пиксель-дифф.
  const baseline = params.has("baseline");
  const editMode = import.meta.env.DEV && params.has("edit");
  const [scale, setScale] = useState(1);
  // Шрифты (Canva + кастомные скрипты) грузятся с font-display:swap: пока их нет,
  // текст рисуется фолбэком с другими метриками глифов → при подмене высота листа
  // меняется и весь макет «прыгает». Поэтому держим лист скрытым до готовности
  // шрифтов и проявляем плавно — первый видимый кадр уже с финальным начертанием.
  // Safety-таймаут (3с) гарантирует, что лист не останется скрытым, если шрифт упал.
  const [fontsReady, setFontsReady] = useState(noScale);
  // Натуральная (немасштабированная) высота листа — нужна, т.к. лист масштабируется через
  // transform: scale() (а не zoom), а transform не влияет на поток: без явной высоты обёртки
  // под листом осталась бы пустота на полную высоту 1:1. См. рендер ниже.
  const [natHeight, setNatHeight] = useState(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const adds = useAdditions();

  useEffect(() => {
    if (noScale) return;
    // В режиме редактора — подгоняем под всю ширину окна (макс. место под правку),
    // иначе обычная логика: ≤880 под ширину, >880 фикс 880.
    const calc = () => {
      const w = document.documentElement.clientWidth;
      if (editMode) {
        setScale((w - EDIT_PANEL) / REF_WIDTH);
      } else if (w <= MAX_WIDTH) {
        // Мобила: вписываем по ширине и добавляем оверскан — края срезаются обрезом обёртки.
        setScale((w / REF_WIDTH) * MOBILE_OVERSCAN);
      } else {
        // Десктоп: фикс 880, лист целиком по центру (без обреза).
        setScale(MAX_WIDTH / REF_WIDTH);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [noScale, editMode]);

  // Измеряем немасштабированную высоту контента (offsetHeight не учитывает transform → отдаёт
  // высоту листа в координатах 1776px). Высоту видимого бокса считаем как natHeight*scale.
  // ResizeObserver ловит догрузку картинок/шрифтов, меняющую высоту листа.
  useEffect(() => {
    if (noScale) return;
    const inner = innerRef.current;
    if (!inner) return;
    const measure = () => setNatHeight(inner.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [noScale]);

  // Проявляем лист, когда шрифты догрузились (см. fontsReady выше). noScale рендерит сразу.
  useEffect(() => {
    if (noScale) return;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setFontsReady(true);
    };
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(reveal);
    } else {
      reveal();
    }
    const t = window.setTimeout(reveal, 3000);
    return () => window.clearTimeout(t);
  }, [noScale]);

  // Палитра. На маунте применяем сохранённый цвет (paletteState.ts) — работает и на проде.
  // Дальше источник правды — currentPalette(): редактор (dev) меняет его при выборе свотча,
  // а MutationObserver внутри applyPalette докрашивает картинки после HMR. teardown на unmount.
  useEffect(() => {
    applyPalette(activePalette);
    return () => teardownPalette();
  }, []);
  // Перекрасить только что добавленные элементы текущим цветом (null — если палитра снята).
  useEffect(() => {
    applyPalette(currentPalette());
  }, [adds]);

  // Слой добавленных элементов — СИБЛИНГ Canva-вёрстки (а не предок!): position:relative
  // ставим на внешнюю обёртку d06-page, а не на .KYQZFA — иначе глубокие absolute-элементы
  // Canva перепривязываются к новому контейнеру и вёрстка едет. Слой не рендерится, если
  // нет добавлений и не режим редактора → база не меняется (0%).
  const page = (
    <div className="d06-page" style={{ position: "relative" }}>
      <div className="yIDCqA">
        <main className="_8OlyIw">
          <div className="_4KoDHA">
            <div className="ZRRuDw">
              <div style={{ height: "100%", width: "100%" }}>
                <div className="KYQZFA">
                  {DESIGN06_SECTIONS.map((Section, i) => (
                    <Section key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {(editMode || adds.length > 0) && (
        <div className="d06-add-layer" style={{ position: "absolute", top: 0, left: 0, width: REF_WIDTH, height: "100%", pointerEvents: "none" }}>
          {adds.map((a) => (
            <AddedEl key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {cssHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={assetUrl(href)} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: overrideCss }} />
      {/* Точечная изоляция от глобального CSS приложения: единственная протечка на
          Canva-вёрстку — правило `section { padding/position/overflow }` из base.css.
          box-sizing/font-smoothing Canva задаёт сам, поэтому больше сбрасывать нечего. */}
      {/* Поля по краям (вне листа ≤880px) — основным цветом, а не белым. Перебивает
          `html,body{background:#fff}` из сгенерированного override.css по порядку правил. */}
      <style>{`html,body{background:${PAGE_BG}}.yIDCqA section.rGeu6w{padding:0;position:static;overflow:visible}${CV_CSS}`}</style>
      {noScale ? (
        page
      ) : editMode ? (
        // Левое выравнивание + отступы под тулбар и панель, чтобы инспектор не перекрывал лист.
        // Масштабируем через transform: scale() (не zoom — iOS Safari ломает раскладку текста
        // при zoom, см. WebKit bug). transform-origin: top left + бокс с уже масштабированными
        // размерами (REF_WIDTH*scale × natHeight*scale), чтобы поток занимал ровно видимый лист.
        <div style={{ paddingTop: EDIT_BAR, boxSizing: "border-box", opacity: fontsReady ? 1 : 0, transition: "opacity .2s ease" }}>
          <div style={{ width: REF_WIDTH * scale, height: natHeight * scale }}>
            <div ref={innerRef} style={{ width: REF_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              {page}
            </div>
          </div>
        </div>
      ) : (
        // Масштабируем через transform: scale() вместо zoom: iOS Safari при zoom неверно
        // пересчитывает позиции absolute-текста (наезжает друг на друга), хотя Chrome/DevTools
        // рендерит верно. transform-origin: top left, а внешний бокс зажат под видимый размер
        // листа (REF_WIDTH*scale × natHeight*scale) — иначе под листом пустота на высоту 1:1.
        <div style={{ display: "flex", justifyContent: "center", width: "100%", overflow: "hidden", opacity: fontsReady ? 1 : 0, transition: "opacity .2s ease" }}>
          <div style={{ width: REF_WIDTH * scale, height: natHeight * scale }}>
            <div ref={innerRef} style={{ width: REF_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              {page}
            </div>
          </div>
        </div>
      )}
      {editMode && Editor && (
        <Suspense fallback={null}>
          <Editor scale={scale} />
        </Suspense>
      )}
      {/* Анкета-модалка раздела Survey. Под ?baseline не монтируется (раздел скрыт). */}
      {!baseline && <RsvpModal />}
    </>
  );
}
