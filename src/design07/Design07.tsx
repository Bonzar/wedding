// design07 — адаптивная вёрстка листа-приглашения через контейнерные единицы cqw.
//
// Отличие от d06: НЕТ глобального масштабирования (никаких transform: scale / zoom /
// динамического meta viewport). Лист рендерится на width=device-width, initial-scale=1,
// а «резиновость» даёт перевод ВСЕХ координат в cqw (см. elStyle в ./layout.ts) — масштаб
// происходит НА УРОВНЕ ЛАЙАУТА. Контейнер .d07-root задаёт container-type:inline-size и
// ширину (натив 1776 / иначе min(100%,880)); 1cqw = 1% этой ширины → весь лист
// пропорционально вписывается. Браузер тайлит длинную страницу как обычную → нет гигантского
// GPU-слоя (iOS jetsam-краш) и lazy-load снова работает (фото грузятся по мере скролла).
//
// Живёт за ?d07 (см. App.tsx), грузится лениво. Флаги: ?noscale (контейнер ровно 1776 — для
// 0%-гейта/пиксельного сравнения), ?baseline (скрыть Survey), dev-only ?edit, debug ?nomedia/?only=N.

import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react";
import "./canva-base.css"; // Canva :root/тема-переменные + @keyframes (грузится только на ?d07)
import "./custom-fonts.css"; // доп. (не-Canva) шрифты из assets/fonts (грузится только на ?d07)
import overrideCss from "./_generated/override.css?raw";
import headLinksRaw from "./_generated/head-links.json?raw";
import { DESIGN06_SECTIONS } from "./sections";
import { RsvpModal } from "@/rsvp/components/RsvpModal"; // анкета гостя для раздела Survey (портал в body, rem)
import { cqw, elStyle } from "./layout";
import { assetUrl } from "./assetUrl";
import { photoOf, type Addition } from "./additions";
import { useAdditions } from "./editor/additionsStore"; // слой добавленных в редакторе элементов
import { activePalette, applyPalette, currentPalette, teardownPalette } from "./palette"; // акцентный цвет

// Визуальный редактор — только dev и только по ?edit (как в d06). В прод-сборке DEV=false →
// тернарник сворачивается, Rollup не эмитит чанк редактора. См. editor/.
const Editor = import.meta.env.DEV ? lazy(() => import("./editor/Editor")) : null;

// Из Canva-стайлшитов линком оставляем ТОЛЬКО шрифты (design-fonts.css).
const cssHrefs: string[] = (JSON.parse(headLinksRaw) as string[]).filter((h) => h.includes("design-fonts"));

const REF_WIDTH = 1776; // нативная ширина листа = база координат (1 канва-юнит = 1 px на 1776)
const MAX_WIDTH = 880; // макс. ширина листа на десктопе (центрируется)
// Оверскан мобилы (как в d06): на узких экранах cqw-контейнер делаем ШИРЕ экрана → 1cqw больше →
// контент крупнее, а поля-подложка по краям уходят под обрез (внешняя обёртка центрирует и режет
// overflow-x:clip). Оверскан ПЛАВНО спадает 1.25→1.0 между OVERSCAN_FULL_AT и MAX_WIDTH (без
// media-query — через min() линейных кусков по vw):
//   ≤OVERSCAN_FULL_AT → ×MOBILE_OVERSCAN ; OVERSCAN_FULL_AT→MAX_WIDTH линейно к full ; ≥MAX_WIDTH → лист целиком.
const MOBILE_OVERSCAN = 1.25;
const OVERSCAN_FULL_AT = 440; // ширина (px), при которой оверскан = максимум
// Линейный кусок, соединяющий (OVERSCAN_FULL_AT, MOBILE_OVERSCAN*OVERSCAN_FULL_AT) и (MAX_WIDTH, MAX_WIDTH).
const OS_SLOPE = (MAX_WIDTH - MOBILE_OVERSCAN * OVERSCAN_FULL_AT) / (MAX_WIDTH - OVERSCAN_FULL_AT);
const OS_INTERCEPT = MOBILE_OVERSCAN * OVERSCAN_FULL_AT - OS_SLOPE * OVERSCAN_FULL_AT;
// Фактор оверскана = width/vw = 0.75 + OS_INTERCEPT/vw → гладко спадает к 1.0 на MAX_WIDTH.
const OVERSCAN_WIDTH = `min(${MOBILE_OVERSCAN * 100}vw, calc(${OS_SLOPE * 100}vw + ${OS_INTERCEPT}px), ${MAX_WIDTH}px)`;
const PAGE_BG = "#faf7f0"; // кремовый тон полей по краям листа (вместо белого)
const EDIT_BAR = 36; // высота тулбара редактора
const EDIT_PANEL = 300; // зарезервировано справа под инспектор (панель 280 + зазор)

// Один добавленный элемент (текст/картинка). elStyle(a) теперь выдаёт cqw, как у всей вёрстки.
function AddedEl({ a }: { a: Addition }) {
  const base = elStyle(a) as CSSProperties;
  const style: CSSProperties = { ...base, position: "absolute", pointerEvents: "auto" };
  if (a.kind === "text") {
    return (
      <div data-eid={`add/${a.id}`} className="d06-add d06-add-text" style={{ ...style, fontSize: a.fontSize ? `${(a.fontSize * 100) / REF_WIDTH}cqw` : undefined }}>
        {a.text}
      </div>
    );
  }
  // Двухслойно (как Canva-фото): рамка add/<id> = маска (overflow:hidden), вложенный слой
  // add/<id>/photo = само фото, пан/зумится внутри маски (редактор: 2× клик → пан/зум, ресайз →
  // зум). photoOf даёт сохранённый кроп или дефолт «заполнить рамку» (== прежний object-fit:cover).
  //
  // ВАЖНО (резкость): позиционируем слой через left/top/width/height, а НЕ через transform:
  // translate. transform на потомке промотирует его в отдельный композит-слой, и тогда scale()
  // рамки (у тайлов почти всегда есть) апскейлит готовый битмап → фото мылит. left/top такого
  // слоя не создаёт → браузер растрит <img> сразу в финальном масштабе (резко). Кроп-слой несёт
  // только x/y/w/h (редактор пишет лишь их), поэтому transform тут и не нужен.
  const p = photoOf(a);
  return (
    <div data-eid={`add/${a.id}`} className="d06-add d06-add-img" style={{ ...style, overflow: "hidden" }}>
      {a.src && (
        <div data-eid={`add/${a.id}/photo`} style={{ position: "absolute", left: cqw(p.x ?? 0), top: cqw(p.y ?? 0), width: cqw(p.w ?? 0), height: cqw(p.h ?? 0) }}>
          <img src={assetUrl(a.src)} draggable={false} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
    </div>
  );
}

export default function Design07() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const noScale = params.has("noscale"); // контейнер ровно 1776 → cqw == исходные px (0%-гейт)
  const baseline = params.has("baseline"); // скрыть Survey (нет Canva-эталона) для пиксель-диффа
  const editMode = import.meta.env.DEV && params.has("edit");
  const noMedia = params.has("nomedia"); // debug: не рисовать картинки
  const onlyN = parseInt(params.get("only") || "0", 10) || 0; // debug: только первые N секций

  // Шрифты грузятся с font-display:swap — до готовности фолбэк с другими метриками «прыгает».
  // Держим лист скрытым (opacity 0) до fonts.ready и плавно проявляем. noScale рендерит сразу.
  const [fontsReady, setFontsReady] = useState(noScale);
  const adds = useAdditions();

  // Масштаб ТОЛЬКО для редактора: линейный коэффициент «рендер-px на канва-юнит» =
  // ширина_листа / REF_WIDTH. cqw — равномерный линейный масштаб, поэтому editScale = это же
  // отношение; редактор маппит экран↔канву (делит дельты на scale) корректно. В edit-режиме
  // лист занимает (ширина окна − панель), чтобы инспектор не перекрывал. См. editor/Editor.tsx.
  const [editScale, setEditScale] = useState(1);
  useEffect(() => {
    if (!editMode) return;
    const calc = () => setEditScale((document.documentElement.clientWidth - EDIT_PANEL) / REF_WIDTH);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [editMode]);

  // Проявляем лист, когда шрифты догрузились. noScale — сразу.
  useEffect(() => {
    if (noScale) return;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setFontsReady(true);
    };
    if (typeof document !== "undefined" && document.fonts?.ready) void document.fonts.ready.then(reveal);
    else reveal();
    const t = window.setTimeout(reveal, 3000); // safety — лист не должен остаться скрытым
    return () => window.clearTimeout(t);
  }, [noScale]);

  // Палитра (акцентный цвет): на маунте применяем сохранённую, teardown на unmount.
  useEffect(() => {
    applyPalette(activePalette);
    return () => teardownPalette();
  }, []);
  useEffect(() => {
    applyPalette(currentPalette()); // перекрасить только что добавленные элементы
  }, [adds]);

  // Слой добавленных — сиблинг Canva-вёрстки (см. d06): position:relative на внешней .d06-page.
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
        <div className="d06-add-layer" style={{ position: "absolute", top: 0, left: 0, width: "100cqw", height: "100%", pointerEvents: "none" }}>
          {adds.map((a) => (
            <AddedEl key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );

  // Контейнер-лист: container-type:inline-size → 1cqw = 1% его ширины (вся cqw-вёрстка резолвится
  // относительно него). Базовые поля общие; ширина/обёртка зависят от режима (ниже).
  const baseRoot: CSSProperties = {
    containerType: "inline-size",
    boxSizing: "border-box",
    flexShrink: 0, // в оверскан-режиме лист шире flex-обёртки — не давать ему сжаться (иначе оверскан гаснет)
    opacity: fontsReady ? 1 : 0,
    transition: "opacity .2s ease",
  };

  // noScale — контейнер ровно 1776 (cqw==px, 0%-гейт). editMode — (100% − панель), лист слева,
  // без оверскана. Иначе — оверскан-режим: класс .d07-overscan (ширина задаётся media-query в
  // <style> ниже: десктоп 880; ≤880 → MOBILE_OVERSCAN*100 vw), а внешняя flex-обёртка центрирует
  // широкий лист и режет края (overflow-x:clip) — так контент крупнее на мобиле, как в d06.
  let sheet: JSX.Element;
  if (noScale) {
    sheet = (
      <div className="d07-root" style={{ ...baseRoot, width: `${REF_WIDTH}px` }}>
        {page}
      </div>
    );
  } else if (editMode) {
    sheet = (
      <div className="d07-root" style={{ ...baseRoot, width: `calc(100% - ${EDIT_PANEL}px)`, margin: `${EDIT_BAR}px 0 0 0`, overflowX: "visible" }}>
        {page}
      </div>
    );
  } else {
    sheet = (
      <div style={{ display: "flex", justifyContent: "center", width: "100%", overflowX: "clip" }}>
        <div className="d07-root" style={{ ...baseRoot, width: OVERSCAN_WIDTH }}>
          {page}
        </div>
      </div>
    );
  }

  return (
    <>
      {cssHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={assetUrl(href)} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: overrideCss }} />
      {/* Поля по краям — основным (кремовым) цветом, а не белым; точечный сброс протечки
          `section{}` из base.css приложения. Перебивает html,body{background:#fff} из override.css. */}
      {/* overflow-x:clip на html,body — иначе iOS Safari делает «shrink-to-fit»: видит оверскан-лист
          (шире вьюпорта, хоть и обрезанный) и зумит страницу, гася оверскан. На ?noscale/edit не клипаем. */}
      <style>{`html,body{background:${PAGE_BG}${!noScale && !editMode ? ";overflow-x:clip;max-width:100%" : ""}}.yIDCqA section.rGeu6w{padding:0;position:static;overflow:visible}${noMedia ? ".yIDCqA img{display:none!important}" : ""}`}</style>
      {sheet}
      {editMode && Editor && (
        <Suspense fallback={null}>
          <Editor scale={editScale} />
        </Suspense>
      )}
      {/* Анкета-модалка раздела Survey. Под ?baseline не монтируется (раздел скрыт). */}
      {!baseline && <RsvpModal />}
    </>
  );
}
