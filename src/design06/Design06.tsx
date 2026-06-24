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
import { elStyle } from "./layout";
import type { Addition } from "./additions";
import { useAdditions } from "./editor/additionsStore"; // слой добавленных в редакторе элементов

// Визуальный редактор — только dev и только по ?d06&edit. Отдельный чанк (lazy), в прод
// не грузится. Когда не смонтирован — рендер = база 0% (правок DOM нет). См. editor/.
const Editor = lazy(() => import("./editor/Editor"));

// Из Canva-стайлшитов линком оставляем ТОЛЬКО шрифты (design-fonts.css). Утилиты-классы —
// в canva.module.css, переменные/keyframes — в canva-base.css. Остальные Canva-<link> убраны.
const cssHrefs: string[] = (JSON.parse(headLinksRaw) as string[]).filter((h) => h.includes("design-fonts"));

// Макет снят на нативной ширине 1776px. Поведение под ширину окна:
//   viewport <= 880  → масштабируем под ширину (карточка во весь экран);
//   viewport >  880  → ширина фиксируется на 880px, карточка по центру.
// ?d06&noscale отключает скейлер (масштаб 1:1) — для пиксельного сравнения с эталоном.
const REF_WIDTH = 1776;
const MAX_WIDTH = 880;
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
      {a.src && <img src={a.src} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
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
  const adds = useAdditions();

  useEffect(() => {
    if (noScale) return;
    // В режиме редактора — подгоняем под всю ширину окна (макс. место под правку),
    // иначе обычная логика: ≤880 под ширину, >880 фикс 880.
    const calc = () => {
      const w = document.documentElement.clientWidth;
      setScale((editMode ? w - EDIT_PANEL : Math.min(w, MAX_WIDTH)) / REF_WIDTH);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [noScale, editMode]);

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
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: overrideCss }} />
      {/* Точечная изоляция от глобального CSS приложения: единственная протечка на
          Canva-вёрстку — правило `section { padding/position/overflow }` из base.css.
          box-sizing/font-smoothing Canva задаёт сам, поэтому больше сбрасывать нечего. */}
      {/* Поля по краям (вне листа ≤880px) — основным цветом, а не белым. Перебивает
          `html,body{background:#fff}` из сгенерированного override.css по порядку правил. */}
      <style>{`html,body{background:${PAGE_BG}}.yIDCqA section.rGeu6w{padding:0;position:static;overflow:visible}`}</style>
      {noScale ? (
        page
      ) : editMode ? (
        // Левое выравнивание + отступы под тулбар и панель, чтобы инспектор не перекрывал лист.
        <div style={{ paddingTop: EDIT_BAR, boxSizing: "border-box" }}>
          <div style={{ width: REF_WIDTH, zoom: scale }}>{page}</div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", width: "100%", overflow: "hidden" }}>
          <div style={{ width: REF_WIDTH, zoom: scale }}>{page}</div>
        </div>
      )}
      {editMode && (
        <Suspense fallback={null}>
          <Editor scale={scale} />
        </Suspense>
      )}
      {/* Анкета-модалка раздела Survey. Под ?baseline не монтируется (раздел скрыт). */}
      {!baseline && <RsvpModal />}
    </>
  );
}
