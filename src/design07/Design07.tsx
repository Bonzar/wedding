// design07 — адаптивная вёрстка листа-приглашения через контейнерные единицы cqw.
//
// Отличие от d06: на современных браузерах НЕТ глобального масштабирования (никаких transform:
// scale / zoom / динамического meta viewport). Лист рендерится на width=device-width,
// initial-scale=1, а «резиновость» даёт перевод ВСЕХ координат в cqw (см. elStyle в ./layout.ts)
// — масштаб происходит НА УРОВНЕ ЛАЙАУТА. Контейнер .d07-root задаёт container-type:inline-size и
// ширину (натив 1776 / иначе min(100%,880)); 1cqw = 1% этой ширины → весь лист
// пропорционально вписывается. Браузер тайлит длинную страницу как обычную → нет гигантского
// GPU-слоя (iOS jetsam-краш) и lazy-load снова работает (фото грузятся по мере скролла).
//
// FALLBACK для браузеров БЕЗ контейнерных единиц (старые Chromium <105 / Firefox <110 / старый
// Android WebView; старые iOS НЕ покрываем): cqw-единица вынесена в CSS-переменную --d07-u (см.
// layout.ts U). Там она подменяется на фикс. px (REF_WIDTH/100), контейнер фиксируется на 1776, и
// весь лист масштабируется целиком — zoom (рефлоу, дёшево по памяти; есть в старых Chromium/IE)
// либо transform: scale (старый Firefox без zoom). Детект через CSS.supports, см. ниже.
//
// Живёт за ?d07 (см. App.tsx), грузится лениво. Флаги: ?noscale (контейнер ровно 1776 — для
// 0%-гейта/пиксельного сравнения), ?baseline (скрыть Survey), dev-only ?edit, debug ?nomedia/?only=N,
// ?nofallback (форс fallback-ветки для проверки на современном браузере).

import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { observer } from "mobx-react-lite";
import { useRsvp } from "@/stores/context"; // RSVP-стор: обращение (greeting) для bind:"greeting"
import { prependGreeting } from "@/rsvp/api"; // склейка обращения с текстом-приглашением
import "./canva-base.css"; // Canva :root/тема-переменные + @keyframes (грузится только на ?d07)
import "./custom-fonts.css"; // доп. (не-Canva) шрифты из assets/fonts (грузится только на ?d07)
import overrideCss from "./_generated/override.css?raw";
import headLinksRaw from "./_generated/head-links.json?raw";
import { SECTION_COMPONENTS } from "./sections";
import CustomSection from "./sections/Custom"; // кастомная (не-Canva) секция из манифеста
import { RsvpModal } from "@/rsvp/components/RsvpModal"; // анкета гостя для раздела Survey (портал в body, rem)
import { cqw, elStyle, U } from "./layout";
import { assetUrl } from "./assetUrl";
import { photoOf, type Addition } from "./additions";
import { useAdditions } from "./editor/additionsStore"; // слой добавленных в редакторе элементов
import { useManifest } from "./editor/manifestStore"; // манифест секций (порядок + мета: высота/скрытие)
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
// Бумажная текстура секций (та же, что у Survey/Closing/Custom). Ей заливаем секцию при minHeight,
// чтобы выросший бокс не зиял дыркой под внутренним backdrop'ом фиксированной высоты.
const PAPER = "/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg";
const EDIT_BAR = 36; // высота тулбара редактора
const EDIT_PANEL = 300; // зарезервировано справа под инспектор (панель 280 + зазор)

// Один добавленный элемент (текст/картинка). elStyle(a) теперь выдаёт cqw, как у всей вёрстки.
// observer: bind:"greeting" читает rsvp.greeting (mobx) — перерисовка при загрузке гостей.
const AddedEl = observer(function AddedEl({ a }: { a: Addition }) {
  const rsvp = useRsvp();
  const base = elStyle(a) as CSSProperties;
  const style: CSSProperties = { ...base, position: "absolute", pointerEvents: "auto" };
  if (a.kind === "text") {
    const bound = a.bind === "greeting";
    const text = bound ? prependGreeting(rsvp.greeting, a.text ?? "") : a.text;
    // Пока обращение грузится из Craft (cold start функции — секунды), НЕ показываем блок:
    // иначе текст-приглашение появляется без имён и «прыгает» при их подстановке. Держим
    // прозрачным до резолва (ready/empty/error/no-token) и плавно проявляем — без скачка.
    const pending = bound && rsvp.listState === "loading";
    return (
      <div
        data-eid={`add/${a.id}`}
        className="d06-add d06-add-text"
        style={{
          ...style,
          fontSize: a.fontSize ? cqw(a.fontSize) : undefined,
          ...(bound ? { opacity: pending ? 0 : 1, transition: "opacity .4s ease" } : null),
        }}
      >
        {text}
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
});

export default function Design07() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const noScale = params.has("noscale"); // контейнер ровно 1776 → cqw == исходные px (0%-гейт)
  const baseline = params.has("baseline"); // скрыть Survey (нет Canva-эталона) для пиксель-диффа
  const editMode = import.meta.env.DEV && params.has("edit");
  const noMedia = params.has("nomedia"); // debug: не рисовать картинки
  const onlyN = parseInt(params.get("only") || "0", 10) || 0; // debug: только первые N секций

  // Поддержка контейнерных единиц (cqw). Их нет у старых браузеров (Chromium <105 / Firefox <110 /
  // старый Android WebView / старый desktop Safari <16). Там cqw-значения просто не резолвятся →
  // лайаут рассыпается. Для таких — FALLBACK: фикс. контейнер 1776px + глобальный масштаб (см. ниже).
  // CSS.supports нет у совсем древних (IE) → тоже уводим в fallback. ?nofallback — форс-проверка ветки.
  const cqwSupported = useMemo(
    () => !params.has("nofallback") && typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("width", "1cqw"),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // Чем масштабировать в fallback: zoom РЕФЛОУит страницу (нет гигантского композит-слоя → меньше
  // памяти, важно для старых Android) и есть во всех старых Chromium/IE. Старый Firefox (<126) zoom
  // НЕ умеет → для него transform: scale. Приоритет: zoom, иначе transform. ?fbtransform — форс
  // transform-ветки для проверки на современном браузере. См. ветку sheet ниже.
  const useZoom = useMemo(
    () => !params.has("fbtransform") && typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("zoom", "1"),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Шрифты грузятся с font-display:swap — до готовности фолбэк с другими метриками «прыгает».
  // Держим лист скрытым (opacity 0) до fonts.ready и плавно проявляем. noScale рендерит сразу.
  const [fontsReady, setFontsReady] = useState(noScale);
  const adds = useAdditions();
  const manifest = useManifest();
  // Секции к рендеру = манифест без скрытых (enabled:false). onlyN — debug-обрезка (?only=N).
  // i-я отрисованная section.rGeu6w == renderedSlugs[i] (этим маппим узлы на slug в замере/высоте).
  const renderedEntries = (onlyN > 0 ? manifest.slice(0, onlyN) : manifest).filter((e) => e.enabled !== false);
  const renderedSlugs = renderedEntries.map((e) => e.slug);

  // Верх каждой секции в cqw. Секционный элемент (a.section) рендерится в оффсет-обёртке
  // top:<cqw>, поэтому едет ВМЕСТЕ с секцией в потоке (рост Survey толкает её элементы, а не
  // оставляет их «висеть» в координатах страницы — это и есть фикс пальмы). Слой additions —
  // сиблинг секций, сам по потоку не двигается, поэтому верхи меряем рантайм-наблюдателем.
  const pageRef = useRef<HTMLDivElement>(null);
  const [sectionTops, setSectionTops] = useState<Record<string, number>>({});

  // Геометрия fallback-масштаба (только когда !cqwSupported). scale — множитель листа 1776→экран;
  // offsetX/nativeH нужны лишь ветке transform (zoom рефлоуит сам). Пересчёт на resize и на рост
  // контента (ResizeObserver: Survey/догрузка фото). null до первого замера.
  const [fb, setFb] = useState<{ scale: number; offsetX: number; nativeH: number } | null>(null);

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

  // Замер верхов секций → cqw (1cqw = ширина .d06-page / 100). ResizeObserver на странице и на
  // каждой секции ловит рост Survey / догрузку картинок и пересчитывает оффсеты секционных additions.
  useEffect(() => {
    const pageEl = pageRef.current;
    if (!pageEl) return;
    const measure = () => {
      const pr = pageEl.getBoundingClientRect();
      if (!pr.width) return;
      const secs = pageEl.querySelectorAll<HTMLElement>("section.rGeu6w");
      const tops: Record<string, number> = {};
      secs.forEach((sec, i) => {
        const slug = renderedSlugs[i];
        if (slug) tops[slug] = ((sec.getBoundingClientRect().top - pr.top) / pr.width) * 100;
      });
      setSectionTops((prev) => {
        const k = Object.keys(tops);
        if (k.length === Object.keys(prev).length && k.every((s) => Math.abs((prev[s] ?? -1) - tops[s]) < 1e-3)) return prev;
        return tops;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pageEl);
    pageEl.querySelectorAll("section.rGeu6w").forEach((s) => ro.observe(s));
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [adds, manifest]);

  // Высота секций: ставим minHeight из манифеста прямо на узлы section.rGeu6w по порядку рендера.
  // Эффект перезапускается на смену манифеста и переписывает стиль (React при ре-рендере секции
  // его не несёт — как draft-превью в editor/apply.ts). Нет minHeight → "" (натуральная высота, 0%).
  useEffect(() => {
    const pageEl = pageRef.current;
    if (!pageEl) return;
    pageEl.querySelectorAll<HTMLElement>("section.rGeu6w").forEach((sec, i) => {
      const e = renderedEntries[i];
      if (e?.custom) return; // кастомная секция держит свою высоту инлайном (CustomSection)
      const grow = !!e?.minHeight;
      sec.style.minHeight = grow ? cqw(e!.minHeight!) : "";
      // Внутренний backdrop секции фиксированной высоты → при росте бокса снизу дырка. Заливаем
      // сам <section> бумагой (backdrop сверху перекрывает свою зону). Без minHeight — снимаем (0%).
      sec.style.background = grow ? `var(--paper) url(${assetUrl(PAPER)}) center / cover no-repeat` : "";
    });
  }, [manifest]);

  // FALLBACK-масштаб (только !cqwSupported, обычный overscan-режим): коэффициент считаем в JS,
  // повторяя ту же оверскан-математику, что и OVERSCAN_WIDTH (целевая ширина листа = min()
  // кусочно-линейная по vw). scale = target/REF_WIDTH. offsetX центрирует лист (может быть <0 при
  // оверскане — края уходят под обрез, как overflow-clip у cqw-ветки). height = нативная высота ×
  // scale — нужна transform-ветке, чтобы поток под трансформированным (нескейленным по лайауту)
  // листом не распирало. zoom рефлоуит сам, ему хватает scale. noScale/editMode — dev/test, не трогаем.
  useEffect(() => {
    if (cqwSupported || noScale || editMode) return;
    const pageEl = pageRef.current;
    const calc = () => {
      const vw = document.documentElement.clientWidth;
      const target = Math.min(MOBILE_OVERSCAN * vw, OS_SLOPE * vw + OS_INTERCEPT, MAX_WIDTH);
      const scale = target / REF_WIDTH;
      const scaledW = REF_WIDTH * scale;
      const nativeH = pageEl ? pageEl.scrollHeight : 0;
      setFb({ scale, offsetX: (vw - scaledW) / 2, nativeH });
    };
    calc();
    const ro = pageEl ? new ResizeObserver(calc) : null;
    if (pageEl && ro) ro.observe(pageEl);
    window.addEventListener("resize", calc);
    return () => { ro?.disconnect(); window.removeEventListener("resize", calc); };
  }, [cqwSupported, noScale, editMode, adds, manifest]);

  // Слой добавленных — сиблинг Canva-вёрстки (см. d06): position:relative на внешней .d06-page.
  const page = (
    <div className="d06-page" ref={pageRef} style={{ position: "relative" }}>
      <div className="yIDCqA">
        <main className="_8OlyIw">
          <div className="_4KoDHA">
            <div className="ZRRuDw">
              <div style={{ height: "100%", width: "100%" }}>
                <div className="KYQZFA">
                  {renderedEntries.map((e) => {
                    if (e.custom) return <CustomSection key={e.slug} entry={e} />;
                    const C = SECTION_COMPONENTS[e.slug];
                    return C ? <C key={e.slug} /> : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {(editMode || adds.length > 0) && (
        <div className="d06-add-layer" style={{ position: "absolute", top: 0, left: 0, width: `calc(100 * ${U})`, height: "100%", pointerEvents: "none" }}>
          {/* page-absolute элементы (без секции) — от верха страницы, как раньше (back-compat). */}
          {adds.filter((a) => !a.section).map((a) => (
            <AddedEl key={a.id} a={a} />
          ))}
          {/* секционные элементы — по слагу в оффсет-обёртке top:<верх секции, cqw>; внутри неё
              elStyle(a) даёт translate от её начала → итог = верх секции + (a.x, a.y). */}
          {renderedSlugs.map((slug) => {
            const group = adds.filter((a) => a.section === slug);
            if (!group.length) return null;
            return (
              <div key={slug} data-add-section={slug} style={{ position: "absolute", top: `calc(${sectionTops[slug] ?? 0} * ${U})`, left: 0, width: `calc(100 * ${U})` }}>
                {group.map((a) => (
                  <AddedEl key={a.id} a={a} />
                ))}
              </div>
            );
          })}
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
  // без оверскана. Иначе — оверскан-режим: ширина OVERSCAN_WIDTH (десктоп 880; ≤880 → до
  // MOBILE_OVERSCAN*100 vw), внешняя flex-обёртка центрирует широкий лист и режет края
  // (overflow-x:clip) — контент крупнее на мобиле, как в d06. Если cqw НЕ поддержан — ветка
  // fallback (zoom|transform, фикс. контейнер 1776 + глобальный масштаб); см. ниже.
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
  } else if (cqwSupported) {
    sheet = (
      <div style={{ display: "flex", justifyContent: "center", width: "100%", overflowX: "clip" }}>
        <div className="d07-root" style={{ ...baseRoot, width: OVERSCAN_WIDTH }}>
          {page}
        </div>
      </div>
    );
  } else {
    // FALLBACK (браузер без cqw): контейнер фикс. 1776px, --d07-u подменяем на REF_WIDTH/100 px
    // (cqw-единица → нативные px), весь лист масштабируем целиком JS-коэффициентом fb.scale.
    const scale = fb ? fb.scale : MAX_WIDTH / REF_WIDTH; // до первого замера — десктопный кап
    const rootBase = { ...baseRoot, width: `${REF_WIDTH}px`, "--d07-u": `${REF_WIDTH / 100}px` } as CSSProperties;
    if (useZoom) {
      // zoom рефлоуит лайаут → лист реально занимает scaledW; flex центрирует, overflow-x:clip режет
      // края при оверскане (как cqw-ветка). Нет гигантского композит-слоя → дёшево по памяти.
      sheet = (
        <div style={{ display: "flex", justifyContent: "center", width: "100%", overflowX: "clip" }}>
          <div className="d07-root" style={{ ...rootBase, zoom: scale } as CSSProperties}>
            {page}
          </div>
        </div>
      );
    } else {
      // transform: scale (старый Firefox без zoom). Лайаут-бокс остаётся 1776×нативная-высота:
      // центрируем вручную (translateX offsetX, <0 при оверскане), а обёртке ЗАДАЁМ явную высоту
      // scaledH = nativeH×scale + overflow:clip. Без явной высоты обёртка тянулась бы на всю
      // нескейленную высоту (~16000px) → пустой скролл документа (отрицательный margin не помогает:
      // он коллапсит сквозь обёртку без BFC). fb из замера; ResizeObserver досчитывает при росте.
      const scaledH = fb ? fb.nativeH * scale : undefined;
      sheet = (
        <div style={{ width: "100%", overflow: "clip", height: scaledH != null ? `${scaledH}px` : undefined }}>
          <div
            className="d07-root"
            style={{ ...rootBase, transformOrigin: "top left", transform: `translateX(${fb ? fb.offsetX : 0}px) scale(${scale})` }}
          >
            {page}
          </div>
        </div>
      );
    }
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
