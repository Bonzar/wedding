// Pixel-exact baseline of the design06 reference, rendered inside the React app.
//
// Stage 1 of componentization: the whole captured layout is rendered as one block
// via the generated body HTML (guaranteed 1:1 with public/design06-exact/). The same
// Canva stylesheets + bundled fonts are loaded by URL from the committed static copy,
// so nothing is re-derived. Later stages split _generated/sections/* into real
// per-section components, diffing each crop against this baseline.
//
// Mounted behind ?d06 (see App.tsx) so the Canva global CSS never touches the app.

import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react";
import "./canva-base.css"; // Canva :root/тема-переменные + @keyframes (грузится только на ?d06)
import "./custom-fonts.css"; // доп. (не-Canva) шрифты из assets/fonts (грузится только на ?d06)
import overrideCss from "./_generated/override.css?raw";
import headLinksRaw from "./_generated/head-links.json?raw";
import { DESIGN06_SECTIONS } from "./sections";
import { RsvpModal } from "@/rsvp/components/RsvpModal"; // анкета гостя для раздела Survey (портал в body, rem)
import { elStyle, u } from "./layout";
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
      <div data-eid={`add/${a.id}`} className="d06-add d06-add-text" style={{ ...style, fontSize: a.fontSize ? u(a.fontSize) : undefined }}>
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
  const [scale, setScale] = useState(1);
  // Шрифты (Canva + кастомные скрипты) грузятся с font-display:swap: пока их нет,
  // текст рисуется фолбэком с другими метриками глифов → при подмене высота листа
  // меняется и весь макет «прыгает». Поэтому держим лист скрытым до готовности
  // шрифтов и проявляем плавно — первый видимый кадр уже с финальным начертанием.
  // Safety-таймаут (3с) гарантирует, что лист не останется скрытым, если шрифт упал.
  const [fontsReady, setFontsReady] = useState(noScale);
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
        <div className="d06-add-layer" style={{ position: "absolute", top: 0, left: 0, width: u(REF_WIDTH), height: "100%", pointerEvents: "none" }}>
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
        // Редактор — на том же --d06u, что и прод (transform убран → нет гигантского слоя).
        // Отличие от прод-пути: ширина не капается на 880, а равна доступному месту
        // (окно − панель инспектора) = REF_WIDTH*scale, поэтому 100cqw=REF_WIDTH*scale и
        // --d06u=scale. На экране геометрия идентична прежнему transform-режиму (тот же
        // getBoundingClientRect), поэтому математика drag/resize/snap в Editor.tsx не меняется.
        <div style={{ paddingTop: EDIT_BAR, boxSizing: "border-box", opacity: fontsReady ? 1 : 0, transition: "opacity .2s ease" }}>
          <div
            className="d06-fit"
            style={
              {
                containerType: "inline-size",
                "--d06u": `calc(100cqw / ${REF_WIDTH})`,
                width: REF_WIDTH * scale,
                overflowX: "clip",
              } as CSSProperties
            }
          >
            {page}
          </div>
        </div>
      ) : (
        // АВТО-МАСШТАБ без transform/zoom/viewport-меты. Контейнер задаёт --d06u = «1 дизайн-
        // пиксель под текущую ширину» (calc(100cqw / 1776)); elStyle уже выражает все px как
        // calc(N*var(--d06u)), поэтому лист САМ раскладывается в нужном размере — нет гигантского
        // GPU-слоя (нет iOS-краша), нет zoom-бага, высоту мерить не нужно (поток сам).
        // container-type — чтобы cqw считался от ширины .d06-fit. Десктоп: max 880 по центру;
        // мобила: на всю ширину. overflow-x:clip срезает bleed фонов за край листа.
        <div
          className="d06-fit"
          style={
            {
              containerType: "inline-size",
              "--d06u": `calc(100cqw / ${REF_WIDTH})`,
              width: `min(100%, ${MAX_WIDTH}px)`,
              margin: "0 auto",
              overflowX: "clip",
              opacity: fontsReady ? 1 : 0,
              transition: "opacity .2s ease",
            } as CSSProperties
          }
        >
          {page}
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
