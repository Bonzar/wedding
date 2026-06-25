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
  // --- Отладочные флаги для бисекта краша на iOS (включаются ?d06&<flag>) ---
  const noMedia = params.has("nomedia"); // не рисовать картинки → тест: декод/память картинок виноваты?
  const onlyN = parseInt(params.get("only") || "0", 10) || 0; // рендерить только первые N секций (?only=2)
  const useZoom = params.has("zoom"); // масштаб через zoom вместо transform: scale() (тест GPU-слоя)
  const forceVp = params.has("fvp"); // форсировать vp-режим независимо от UA (тест в desktop-превью)
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
  // Мобила? Детект по userAgent (мобильная ОС), а НЕ по ширине. Почему: vp-режим ставит
  // <meta viewport width=1776>, который «shrink-to-fit» (ужимает лист под экран) РАБОТАЕТ
  // ТОЛЬКО на мобильной ОС. В обычном узком окне десктопа эта мета не ужимает → лист 1776px →
  // горизонтальный скролл. Детект по clientWidth ловил и узкое окно десктопа = поломка.
  // UA-детект включает vp-режим только там, где он корректен: real iOS/Android, а также Safari
  // responsive mode и Chrome device mode (они подменяют UA на мобильный). Десктоп (любая ширина,
  // включая узкое окно) → transform, который масштабирует верно. UA не меняется → флипа нет.
  const [isMobile] = useState(() => typeof navigator !== "undefined" && /iphone|ipad|ipod|android/i.test(navigator.userAgent));
  // На мобиле масштабируем НЕ через transform: scale() — он держит весь лист 1776×~15000 в
  // одном гигантском GPU-слое, и iOS убивает GPU-процесс по памяти (jetsam highwater;
  // подтверждено: ?noscale краша нет). Вместо этого масштабируем ВЬЮПОРТОМ: рендерим лист
  // нативно и сжимаем под экран через <meta viewport width=1776>. Браузерный зум тайлится как
  // обычная страница (без огромного слоя), текст в нативных координатах (нет CSS-zoom-бага iOS).
  // Десктоп оставляем на transform — там памяти хватает.
  const mobileVp = !noScale && !editMode && (isMobile || forceVp);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;
    if (mobileVp) {
      // ВАЖНО: одной width=1776 мало — современные браузеры БОЛЬШЕ НЕ делают авто-shrink-to-fit,
      // лист 1776 показывается в натуре → горизонтальный скролл. Поэтому initial-scale задаём
      // ЯВНО = ширина_устройства / 1776 (лист точно вписывается по ширине). Ширину устройства
      // читаем сейчас — мета ещё дефолтная (device-width), значит clientWidth = реальная ширина.
      const dw = document.documentElement.clientWidth;
      const s = dw > 0 ? dw / REF_WIDTH : 1;
      meta.setAttribute("content", `width=${REF_WIDTH}, initial-scale=${s.toFixed(4)}`);
    } else {
      meta.setAttribute("content", "width=device-width, initial-scale=1");
    }
    return () => meta.setAttribute("content", "width=device-width, initial-scale=1");
  }, [mobileVp]);

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
                  {(onlyN > 0 ? DESIGN06_SECTIONS.slice(0, onlyN) : DESIGN06_SECTIONS).map((Section, i) => (
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
      <style>{`html,body{background:${PAGE_BG}}.yIDCqA section.rGeu6w{padding:0;position:static;overflow:visible}${noMedia ? ".yIDCqA img{display:none!important}" : ""}`}</style>
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
      ) : mobileVp ? (
        // Мобила: нативный рендер, масштаб — браузерным вьюпортом (см. mobileVp выше). Без
        // transform/zoom → нет гигантского GPU-слоя и нет iOS-zoom-бага. width=REF_WIDTH +
        // overflow-x:clip обрезают bleed фоновых фото за край листа (раньше это делала
        // масштаб-обёртка), чтобы не было горизонтального скролла. fontsReady — без мигания шрифта.
        <div style={{ width: REF_WIDTH, overflowX: "clip", opacity: fontsReady ? 1 : 0, transition: "opacity .2s ease" }}>{page}</div>
      ) : useZoom ? (
        // ЭКСПЕРИМЕНТ (?d06&zoom): масштаб через zoom, а НЕ transform: scale().
        // zoom масштабирует саму раскладку и НЕ создаёт один гигантский композитный слой
        // (виновник jetsam-kill GPU-процесса), поэтому не должен ронять вкладку. Бокс
        // натуральной высоты не нужен — zoom уже сжимает поток. Риск: старый iOS-баг с
        // наездом абсолютного текста — это и проверяем на устройстве.
        <div style={{ display: "flex", justifyContent: "center", width: "100%", overflow: "hidden", opacity: fontsReady ? 1 : 0, transition: "opacity .2s ease" }}>
          <div style={{ width: REF_WIDTH, zoom: scale }}>{page}</div>
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
