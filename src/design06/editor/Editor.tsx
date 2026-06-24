// design06 visual editor (dev-only, mounts on ?d06&edit). Overlay selection + inspector
// panel over the pixel-exact baseline. Edits are drafts on top of the committed base
// records; Save persists them back into the matching <Section>.layout.ts via a dev
// endpoint (vite-plugins/d06-save.ts). With the editor unmounted, render is the 0% base.
//
// Resize is TYPE-AWARE, because a Canva object's own w/h box is usually inert — the visible
// thing is a nested element (text → writing-mode field; image → inner photo; button → a
// scaled+clipped pill fill). editTargetOf() routes each object to what actually changes:
//   image  → proportional scale of frame+photo (hold Option/Alt for free aspect = crop)
//   text   → the field's w/h (text reflow); глифы/шрифт — в сайдбаре
//   button → uniform scale of the object
//   line/generic → rotation-aware w/h
//   drilled photo → proportional zoom of the photo inside its crop
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { El } from "../layout";
import { applyEl, imgUnder, nodeFor, resetEl, setImgSrc, setText, textOf } from "./apply";
import { BASE, hasGeometry, hasTypography, isField, isObject, isSection } from "./registry";
import { addStore } from "./additionsStore";
import { Panel, type FieldKey } from "./Panel";
import { PalettePicker } from "./PalettePicker";
import { activePalette, applyPalette } from "../palette";
import "./editor.css";

const isAdd = (eid: string | null | undefined) => addStore.isAdd(eid);
const idOf = (eid: string) => addStore.idOf(eid);
const addKindOf = (eid: string | null) => (eid && isAdd(eid) ? addStore.get(idOf(eid))?.kind ?? null : null);

type OBox = { cx: number; cy: number; vw: number; vh: number; rot: number } | null;
type Mode = "image" | "text" | "scale" | "wh" | "photo";
type RotBox = { rot: number; w0: number; h0: number; cParent: { x: number; y: number }; cScreen: { x: number; y: number } };
type Drag =
  | { kind: "move"; eid: string; cx: number; cy: number; start: El; moved: boolean; clipBox: string | null; clipDone: boolean }
  | { kind: "field"; eid: string; dir: string; w0: number; h0: number; k: number; cx: number; cy: number; start: El; scale0: number; handle0: { x: number; y: number }; cScreen: { x: number; y: number }; pEid: string | null; wrapDone: boolean }
  | ({ kind: "wh"; eid: string; dir: string; start: El } & RotBox)
  | ({
      kind: "prop"; eid: string; dir: string; target: "image" | "scale" | "photo";
      scale0: number; sx0: number; sy0: number; handle0: { x: number; y: number }; start: El;
    } & RotBox)
  | null;

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
const RAD = Math.PI / 180;
const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by);

// Probe whether the browser can actually decode+load a URL as an image.
const probeImage = (url: string): Promise<boolean> =>
  new Promise((res) => {
    const im = new Image();
    im.onload = () => res(true);
    im.onerror = () => res(false);
    im.src = url;
  });

// A freshly uploaded file isn't served instantly (Vite briefly returns the SPA HTML
// fallback). Poll with cache-busting until it decodes — also catches undecodable
// formats (HEIC) which simply never succeed.
async function waitImageServable(path: string, tries = 14): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    if (await probeImage(`${path}?v=${Date.now()}_${i}`)) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

export default function Editor({ scale }: { scale: number }) {
  const [drafts, setDrafts] = useState<Record<string, El>>({});
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

  // content edits (text strings / image src) live separately from style drafts — they
  // patch the .tsx, not layout.ts. origContent keeps pre-edit values for reset.
  const [content, setContent] = useState<Record<string, { text?: string; src?: string }>>({});
  const origContentRef = useRef<Record<string, { text?: string; src?: string }>>({});

  const [selected, setSelected] = useState<string | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const [hover, setHover] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);
  const dragRef = useRef<Drag>(null);

  // Палитра (акцентный цвет всего макета). Стартуем с сохранённого (paletteState.ts);
  // выбор свотча применяется мгновенно, сохраняется общей кнопкой «Сохранить».
  const [palette, setPalette] = useState<string | null>(activePalette);
  const paletteSaved = useRef<string | null>(activePalette);
  const onPickPalette = useCallback((color: string | null) => {
    setPalette(color);
    applyPalette(color);
  }, []);

  const merged = useCallback((eid: string): El => draftsRef.current[eid] ?? BASE[eid] ?? {}, []);

  // ---- selection helpers: clicks/hover resolve to the nearest Canva object -----------
  const resolveObject = useCallback((from: Element | null): string | null => {
    for (let el: Element | null = from; el; el = el.parentElement) {
      const eid = el.getAttribute?.("data-eid");
      if (eid && (isObject(BASE[eid]) || isSection(eid))) return eid;
    }
    return null;
  }, []);

  const crumbsOf = useCallback((eid: string): string[] => {
    const out: string[] = [];
    for (let el = nodeFor(eid)?.parentElement ?? null; el; el = el.parentElement) {
      const id = el.getAttribute("data-eid");
      if (id && (isObject(BASE[id]) || isSection(id))) out.push(id);
    }
    return out.reverse();
  }, []);

  const textEidOf = useCallback((eid: string): string | null => {
    const node = nodeFor(eid);
    if (!node) return null;
    for (const d of Array.from(node.querySelectorAll<HTMLElement>("[data-eid]"))) {
      const id = d.getAttribute("data-eid")!;
      if (hasTypography(BASE[id])) return id;
    }
    return null;
  }, []);

  // inner image layer of an object (the geometry-bearing, non-object wrapper around <img>)
  const innerImgEidOf = useCallback((eid: string): string | null => {
    const node = nodeFor(eid);
    const img = node?.querySelector("img");
    if (!img || !node) return null;
    for (let el = img.parentElement; el && el !== node.parentElement; el = el.parentElement) {
      const id = el.getAttribute("data-eid");
      if (id && hasGeometry(BASE[id]) && !isObject(BASE[id])) return id;
    }
    return null;
  }, []);

  // text-field wrapper inside a text object (controls the wrapping width / text area)
  const fieldEidOf = useCallback((eid: string): string | null => {
    const node = nodeFor(eid);
    if (!node || isField(BASE[eid])) return null;
    for (const d of Array.from(node.querySelectorAll<HTMLElement>("[data-eid]"))) {
      const id = d.getAttribute("data-eid")!;
      if (isField(BASE[id])) return id;
    }
    return null;
  }, []);

  // nearest ancestor whose record clips its children to a fixed polygon (Canva corner clip);
  // moving an object out of that region would clip it, so we neutralize the clip on move.
  const clipAncestorOf = useCallback((eid: string): string | null => {
    for (let el = nodeFor(eid)?.parentElement ?? null; el; el = el.parentElement) {
      const id = el.getAttribute("data-eid");
      const cp = id && (BASE[id]?.raw as Record<string, unknown> | undefined)?.clipPath;
      if (id && typeof cp === "string" && cp.startsWith("polygon")) return id;
    }
    return null;
  }, []);

  // a button-like object: its visible shape is a scaled+clipped fill child (pill), so the
  // object's own w/h is inert — resize must scale the whole object instead.
  const hasClippedFill = useCallback((eid: string): boolean => {
    const node = nodeFor(eid);
    if (!node) return false;
    for (const d of Array.from(node.querySelectorAll<HTMLElement>("[data-eid]"))) {
      const r = BASE[d.getAttribute("data-eid")!];
      if (r?.raw && (r.raw as Record<string, unknown>).clipPath != null && r.scale != null) return true;
    }
    return false;
  }, []);

  // What a selection's handles actually resize, and which element the box wraps.
  const editTargetOf = useCallback((eid: string): { mode: Mode; boxEid: string; resizeEid: string; photoEid: string | null } => {
    if (!isObject(BASE[eid]) && !isSection(eid)) {
      // drilled inner layer
      if (isField(BASE[eid])) return { mode: "text", boxEid: eid, resizeEid: eid, photoEid: null };
      return { mode: "photo", boxEid: eid, resizeEid: eid, photoEid: null };
    }
    if (nodeFor(eid)?.querySelector("img")) return { mode: "image", boxEid: eid, resizeEid: eid, photoEid: innerImgEidOf(eid) };
    const field = fieldEidOf(eid);
    if (field) return { mode: "text", boxEid: field, resizeEid: field, photoEid: null };
    if (hasClippedFill(eid)) return { mode: "scale", boxEid: eid, resizeEid: eid, photoEid: null };
    return { mode: "wh", boxEid: eid, resizeEid: eid, photoEid: null };
  }, [innerImgEidOf, fieldEidOf, hasClippedFill]);

  // primary text span inside a text object (the one carrying the actual words)
  const contentSpanOf = useCallback((eid: string): string | null => {
    const node = nodeFor(eid);
    if (!node) return null;
    let best: string | null = null, bestLen = 0;
    for (const s of Array.from(node.querySelectorAll<HTMLElement>("span[data-eid]"))) {
      const len = (s.textContent ?? "").trim().length;
      if (len > bestLen) { bestLen = len; best = s.getAttribute("data-eid"); }
    }
    return best;
  }, []);

  // data-eid wrapper that directly holds the <img> (key for src patch / live preview)
  const imgWrapOf = useCallback((eid: string): string | null => {
    const img = nodeFor(eid)?.querySelector("img");
    return img?.closest("[data-eid]")?.getAttribute("data-eid") ?? null;
  }, []);

  const onText = useCallback((spanEid: string, text: string) => {
    if (isAdd(spanEid)) { addStore.patch(idOf(spanEid), { text }); setTick((t) => t + 1); return; }
    if (origContentRef.current[spanEid]?.text == null)
      origContentRef.current[spanEid] = { ...origContentRef.current[spanEid], text: textOf(spanEid) };
    setContent((c) => ({ ...c, [spanEid]: { ...c[spanEid], text } }));
    setText(spanEid, text);
    setTick((t) => t + 1);
  }, []);

  // Загрузить файл в public/.../media и вернуть отдаваемый путь (или null + alert).
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const dataUrl: string = await new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.readAsDataURL(file);
    });
    try {
      const up = await fetch("/__d06/upload", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: file.name, data: dataUrl.split(",")[1] }),
      });
      const uj = await up.json();
      if (!up.ok || !uj.ok) throw new Error(uj.error || up.statusText);
      if (!(await waitImageServable(uj.path))) {
        // eslint-disable-next-line no-alert
        alert("Файл загрузился, но не отображается — браузер не смог его декодировать (часто это HEIC/HEIF с iPhone/Mac). Сконвертируй в JPG, PNG, WebP, GIF или SVG.");
        return null;
      }
      return uj.path;
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Загрузка не удалась: " + (err as Error).message);
      return null;
    }
  }, []);

  const onReplaceImage = useCallback(async (wrapEid: string, file: File) => {
    const path = await uploadFile(file);
    if (!path) return;
    if (isAdd(wrapEid)) { addStore.patch(idOf(wrapEid), { src: path }); setTick((t) => t + 1); return; }
    if (origContentRef.current[wrapEid]?.src == null)
      origContentRef.current[wrapEid] = { ...origContentRef.current[wrapEid], src: imgUnder(wrapEid)?.getAttribute("src") ?? "" };
    setContent((c) => ({ ...c, [wrapEid]: { ...c[wrapEid], src: path } })); // чистый путь — для Save/.tsx
    setImgSrc(wrapEid, `${path}?v=${Date.now()}`); // превью — cache-bust
    // оригиналы с object-fit:fill (обрезаны под рамку) → новое фото другого аспекта «плющило».
    const img = imgUnder(wrapEid);
    if (img) img.style.objectFit = "cover";
    setTick((t) => t + 1);
  }, [uploadFile]);

  // ---- live edit -> draft + DOM ------------------------------------------------------
  const writeDraft = useCallback((eid: string, rec: El) => {
    if (isAdd(eid)) { addStore.patch(idOf(eid), rec); setTick((t) => t + 1); return; } // добавленный → стор (Design06 ре-рендерит)
    setDrafts((d) => ({ ...d, [eid]: rec }));
    applyEl(eid, rec);
    setTick((t) => t + 1);
  }, []);

  const onField = useCallback(
    (eid: string, key: FieldKey, value: string | number | undefined) => {
      const cur = draftsRef.current[eid] ?? BASE[eid] ?? {};
      const next: El = { ...cur };
      if (value === undefined) delete (next as Record<string, unknown>)[key];
      else (next as Record<string, unknown>)[key] = value;
      writeDraft(eid, next);
    },
    [writeDraft],
  );

  // ---- add / copy / delete / layers --------------------------------------------------
  const idCounter = useRef(0);
  const newId = () => `${Date.now().toString(36)}${(idCounter.current++).toString(36)}`;
  // центр текущего вьюпорта в координатах канвы (слой добавлений лежит в 0,0 канвы)
  const canvasPoint = useCallback(() => {
    const el = document.querySelector(".d06-add-layer") ?? document.querySelector(".KYQZFA");
    const r = el?.getBoundingClientRect();
    const left = r?.left ?? 0, top = r?.top ?? 0;
    return { x: (window.innerWidth / 2 - left) / scale, y: (window.innerHeight / 2 - top) / scale };
  }, [scale]);

  const addText = useCallback(() => {
    const { x, y } = canvasPoint();
    const id = newId();
    addStore.add({ id, kind: "text", x: x - 200, y: y - 30, w: 400, h: 60, fontSize: 40, color: "rgb(53, 80, 116)", lineHeight: "1.25", text: "Новый текст" });
    setSelected(`add/${id}`); setTick((t) => t + 1);
  }, [canvasPoint]);

  const fileRef = useRef<HTMLInputElement>(null);
  const addImageFile = useCallback(async (file: File) => {
    const path = await uploadFile(file);
    if (!path) return;
    const dims: { w: number; h: number } = await new Promise((res) => {
      const im = new Image(); im.onload = () => res({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => res({ w: 1, h: 1 }); im.src = path;
    });
    const w = 420, h = Math.max(1, Math.round(w * dims.h / dims.w));
    const { x, y } = canvasPoint();
    const id = newId();
    addStore.add({ id, kind: "image", x: x - w / 2, y: y - h / 2, w, h, src: path });
    setSelected(`add/${id}`); setTick((t) => t + 1);
  }, [uploadFile, canvasPoint]);

  const copySelected = useCallback(() => {
    const sel = selectedRef.current; if (!sel) return;
    if (isAdd(sel)) {
      const a = addStore.get(idOf(sel)); if (!a) return;
      const id = newId(); addStore.add({ ...a, id, x: (a.x ?? 0) + 24, y: (a.y ?? 0) + 24 });
      setSelected(`add/${id}`); setTick((t) => t + 1); return;
    }
    if (isSection(sel)) return;
    // Canva-объект → копия как свободный addition в тех же экранных координатах
    const node = nodeFor(sel); const layer = document.querySelector(".d06-add-layer"); if (!node || !layer) return;
    const lr = layer.getBoundingClientRect(), r = node.getBoundingClientRect();
    const x = (r.left - lr.left) / scale + 24, y = (r.top - lr.top) / scale + 24, w = r.width / scale, h = r.height / scale;
    const id = newId(); const img = node.querySelector("img");
    // src без cache-bust ?v=… (живёт в DOM у только что заменённого, ещё не сохранённого фото) —
    // иначе копия грузит «битый» URL и выходит пустой
    if (img) addStore.add({ id, kind: "image", x, y, w, h, src: (img.getAttribute("src") ?? "").split("?")[0] || undefined });
    else {
      const pe = node.querySelector("p")?.getAttribute("data-eid"); const pr = pe ? merged(pe) : {};
      addStore.add({ id, kind: "text", x, y, w, h, text: (node.textContent ?? "").trim() || "Текст", font: pr.font, fontSize: pr.fontSize, color: pr.color, lineHeight: pr.lineHeight, letterSpacing: pr.letterSpacing });
    }
    setSelected(`add/${id}`); setTick((t) => t + 1);
  }, [scale, merged]);

  const deleteSelected = useCallback(() => {
    const sel = selectedRef.current; if (!sel || isSection(sel)) return;
    if (isAdd(sel)) { addStore.remove(idOf(sel)); setSelected(null); setTick((t) => t + 1); return; }
    const rec = merged(sel); // Canva-объект не вырезать из .tsx → прячем (display:none)
    writeDraft(sel, { ...rec, raw: { ...(rec.raw ?? {}), display: "none" } });
    setSelected(null);
  }, [merged, writeDraft]);

  const reorder = useCallback((where: "front" | "back" | "fwd" | "bwd") => {
    const sel = selectedRef.current; if (!sel || isSection(sel)) return;
    if (isAdd(sel)) {
      const list = addStore.list(); const i = list.findIndex((a) => `add/${a.id}` === sel); if (i < 0) return;
      const copy = [...list]; const [it] = copy.splice(i, 1);
      const j = where === "front" ? copy.length : where === "back" ? 0 : where === "fwd" ? Math.min(copy.length, i + 1) : Math.max(0, i - 1);
      copy.splice(j, 0, it); addStore.set(copy); setTick((t) => t + 1); return;
    }
    const rec = merged(sel); const cur = Number((rec.raw as Record<string, unknown> | undefined)?.zIndex ?? 0);
    const z = where === "front" ? 9999 : where === "back" ? -1 : where === "fwd" ? cur + 1 : cur - 1;
    writeDraft(sel, { ...rec, raw: { ...(rec.raw ?? {}), zIndex: z } });
  }, [merged, writeDraft]);

  // клавиши: Delete — удалить/скрыть, Cmd/Ctrl+D — дублировать
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest(".d06e-panel") || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") { e.preventDefault(); copySelected(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [deleteSelected, copySelected]);

  // ---- global pointer wiring: hover, select, drag ------------------------------------
  useEffect(() => {
    const inChrome = (t: EventTarget | null) => t instanceof Element && t.closest(".d06e-chrome");

    // rotation-aware resize keeping the opposite edge/corner pinned (parent coords).
    const whCompute = (d: RotBox & { dir: string }, e: PointerEvent) => {
      const px = d.cParent.x + (e.clientX - d.cScreen.x) / scale;
      const py = d.cParent.y + (e.clientY - d.cScreen.y) / scale;
      const ux = { x: Math.cos(d.rot), y: Math.sin(d.rot) };
      const uy = { x: -Math.sin(d.rot), y: Math.cos(d.rot) };
      const horiz = d.dir.includes("e") ? 1 : d.dir.includes("w") ? -1 : 0;
      const vert = d.dir.includes("s") ? 1 : d.dir.includes("n") ? -1 : 0;
      const anchor = {
        x: d.cParent.x - horiz * (d.w0 / 2) * ux.x - vert * (d.h0 / 2) * uy.x,
        y: d.cParent.y - horiz * (d.w0 / 2) * ux.y - vert * (d.h0 / 2) * uy.y,
      };
      const relx = (px - anchor.x) * ux.x + (py - anchor.y) * ux.y;
      const rely = (px - anchor.x) * uy.x + (py - anchor.y) * uy.y;
      const w = horiz ? Math.max(1, horiz * relx) : d.w0;
      const h = vert ? Math.max(1, vert * rely) : d.h0;
      const cx = anchor.x + horiz * (w / 2) * ux.x + vert * (h / 2) * uy.x;
      const cy = anchor.y + horiz * (w / 2) * ux.y + vert * (h / 2) * uy.y;
      return { w, h, x: cx - w / 2, y: cy - h / 2 };
    };

    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (drag?.kind === "move") {
        const sdx = e.clientX - drag.cx, sdy = e.clientY - drag.cy;
        if (!drag.moved && Math.hypot(sdx, sdy) < 3) return; // порог: клик ≠ перетаскивание
        drag.moved = true;
        // освобождаем от обрезки родителя-клиппера, чтобы объект можно было двигать свободно
        if (drag.clipBox && !drag.clipDone) {
          drag.clipDone = true;
          const cb = merged(drag.clipBox);
          writeDraft(drag.clipBox, { ...cb, raw: { ...(cb.raw ?? {}), clipPath: "none" } });
        }
        const s = drag.start;
        writeDraft(drag.eid, { ...s, x: (s.x ?? 0) + sdx / scale, y: (s.y ?? 0) + sdy / scale });
        return;
      }
      if (drag?.kind === "field") {
        const horiz = drag.dir.includes("e") || drag.dir.includes("w");
        const vert = drag.dir.includes("s") || drag.dir.includes("n");
        if (horiz && vert) {
          // corner → scale the text itself (кегль), как в Canva (многие заголовки nowrap — ширина их не переносит)
          const d0 = dist(drag.handle0.x, drag.handle0.y, drag.cScreen.x, drag.cScreen.y) || 1;
          const k = Math.max(0.05, dist(e.clientX, e.clientY, drag.cScreen.x, drag.cScreen.y) / d0);
          writeDraft(drag.eid, { ...drag.start, scale: drag.scale0 * k });
          return;
        }
        // edge → field w/h (область переноса строк). Заголовки часто white-space:nowrap →
        // включаем перенос на самом <p>, иначе ширина поля ни на что не влияет.
        if (drag.pEid && !drag.wrapDone) {
          drag.wrapDone = true;
          const pr = merged(drag.pEid);
          writeDraft(drag.pEid, { ...pr, raw: { ...(pr.raw ?? {}), whiteSpace: "normal" } });
        }
        const dw = drag.dir.includes("e") ? (e.clientX - drag.cx) / drag.k : drag.dir.includes("w") ? -(e.clientX - drag.cx) / drag.k : 0;
        const dh = drag.dir.includes("s") ? (e.clientY - drag.cy) / drag.k : drag.dir.includes("n") ? -(e.clientY - drag.cy) / drag.k : 0;
        writeDraft(drag.eid, { ...drag.start, w: Math.max(1, drag.w0 + dw), h: Math.max(1, drag.h0 + dh) });
        return;
      }
      if (drag?.kind === "wh") {
        writeDraft(drag.eid, { ...drag.start, ...whCompute(drag, e) });
        return;
      }
      if (drag?.kind === "prop") {
        // Option/Alt → свободные пропорции: неравномерный масштаб (растяжение по перетаскиваемой
        // оси). Истинный «кроп-кадр» — внутренняя обёртка без записи (overflow:hidden), её отдельно
        // не адресовать, поэтому даём видимое растяжение через scale(sx, sy) всего объекта.
        if (drag.target !== "photo" && e.altKey) {
          const ux = { x: Math.cos(drag.rot), y: Math.sin(drag.rot) }, uy = { x: -Math.sin(drag.rot), y: Math.cos(drag.rot) };
          const h0x = (drag.handle0.x - drag.cScreen.x) * ux.x + (drag.handle0.y - drag.cScreen.y) * ux.y;
          const h0y = (drag.handle0.x - drag.cScreen.x) * uy.x + (drag.handle0.y - drag.cScreen.y) * uy.y;
          const p1x = (e.clientX - drag.cScreen.x) * ux.x + (e.clientY - drag.cScreen.y) * ux.y;
          const p1y = (e.clientX - drag.cScreen.x) * uy.x + (e.clientY - drag.cScreen.y) * uy.y;
          const kx = Math.abs(h0x) > 5 ? p1x / h0x : 1, ky = Math.abs(h0y) > 5 ? p1y / h0y : 1;
          writeDraft(drag.eid, { ...drag.start, scale: undefined, sx: Math.max(0.05, drag.sx0 * kx), sy: Math.max(0.05, drag.sy0 * ky) });
          return;
        }
        const d0 = dist(drag.handle0.x, drag.handle0.y, drag.cScreen.x, drag.cScreen.y) || 1;
        const k = Math.max(0.05, dist(e.clientX, e.clientY, drag.cScreen.x, drag.cScreen.y) / d0);
        if (drag.target === "photo") {
          if (e.altKey) { writeDraft(drag.eid, { ...drag.start, ...whCompute(drag, e) }); return; } // свободно — растянуть кадр по оси
          const nw = drag.w0 * k, nh = drag.h0 * k;
          writeDraft(drag.eid, { ...drag.start, w: nw, h: nh, x: (drag.start.x ?? 0) + (drag.w0 - nw) / 2, y: (drag.start.y ?? 0) + (drag.h0 - nh) / 2 });
          return;
        }
        // image (default) и кнопка → равномерный scale всего объекта about centre: весь
        // подмост (рамка + клипнутое фото + узор) масштабируется разом, пропорции целы
        writeDraft(drag.eid, { ...drag.start, sx: undefined, sy: undefined, scale: drag.scale0 * k });
        return;
      }
      if (inChrome(e.target)) return;
      setHover(resolveObject(e.target as Element));
    };

    const armMove = (eid: string, e: PointerEvent) => {
      // fields don't move (no x/y translate) — reposition via the parent object instead
      if (!hasGeometry(BASE[eid]) || isField(BASE[eid])) return;
      // проваленный слой (фото) панится ВНУТРИ обрезки → клип-предка НЕ снимаем (это и есть кадр)
      const inner = !isObject(BASE[eid]) && !isSection(eid);
      dragRef.current = { kind: "move", eid, cx: e.clientX, cy: e.clientY, start: merged(eid), moved: false, clipBox: inner ? null : clipAncestorOf(eid), clipDone: false };
    };

    const onDown = (e: PointerEvent) => {
      if (inChrome(e.target)) return; // панель/ручки обрабатывают себя сами
      const cur = selectedRef.current;
      const curNode = cur ? nodeFor(cur) : null;
      if (cur && curNode) {
        const inDom = e.target instanceof Node && curNode.contains(e.target);
        // для проваленного слоя (фото/поле) хит-тест ГЕОМЕТРИЧЕСКИЙ: перекрывающие сверху
        // соседи (текст/гравюра) не должны перехватывать перетаскивание внутри обрезки
        let inBox = false;
        if (!inDom && !isObject(BASE[cur]) && !isSection(cur)) {
          const r = curNode.getBoundingClientRect();
          inBox = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        }
        if (inDom || inBox) { armMove(cur, e); return; }
      }
      const obj = resolveObject(e.target as Element);
      setSelected(obj);
      setHover(null);
      if (obj) armMove(obj, e);
    };

    // двойной клик — провалиться внутрь объекта: к самому фото (пан/зум в обрезке)
    // или к полю текста (обёртка, регулирующая область переноса).
    const onDbl = (e: MouseEvent) => {
      if (inChrome(e.target)) return;
      const obj = resolveObject(e.target as Element);
      const inner = obj ? (innerImgEidOf(obj) ?? fieldEidOf(obj)) : null;
      if (inner) { setSelected(inner); dragRef.current = null; }
    };

    const onUp = () => { dragRef.current = null; };

    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    document.addEventListener("dblclick", onDbl, true);
    return () => {
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("dblclick", onDbl, true);
    };
  }, [scale, resolveObject, writeDraft, merged, innerImgEidOf, fieldEidOf, clipAncestorOf]);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("scroll", bump, true);
    window.addEventListener("resize", bump);
    return () => {
      window.removeEventListener("scroll", bump, true);
      window.removeEventListener("resize", bump);
    };
  }, []);

  // ---- selection / hover boxes -------------------------------------------------------
  // objects → oriented by their own rotation; inner layers (photo/field) → AABB, which
  // matches their on-screen extent even when a parent rotates/scales them.
  const orientedFor = useCallback((eid: string | null): OBox => {
    if (!eid) return null;
    const node = nodeFor(eid);
    const rec = draftsRef.current[eid] ?? BASE[eid];
    if (!node || !rec) return null;
    const r = node.getBoundingClientRect();
    const center = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    if (!isObject(rec)) return { ...center, vw: r.width, vh: r.height, rot: 0 };
    const elx = rec.sx ?? rec.scale ?? 1, ely = rec.sy ?? rec.scale ?? 1;
    return {
      ...center,
      vw: (rec.w != null ? rec.w * elx : r.width / scale) * scale,
      vh: (rec.h != null ? rec.h * ely : r.height / scale) * scale,
      rot: rec.rot ?? 0,
    };
  }, [scale]);

  const [selBox, setSelBox] = useState<OBox>(null);
  const [hovBox, setHovBox] = useState<OBox>(null);
  useLayoutEffect(() => {
    setSelBox(orientedFor(selected ? editTargetOf(selected).boxEid : null));
  }, [selected, tick, orientedFor, editTargetOf]);
  useLayoutEffect(() => { setHovBox(orientedFor(hover)); }, [hover, tick, orientedFor]);

  const startResize = (e: React.PointerEvent, dir: string) => {
    if (!selected) return;
    e.stopPropagation();
    const t = editTargetOf(selected);
    const rec = merged(t.resizeEid);
    const node = nodeFor(t.resizeEid);
    const r = node?.getBoundingClientRect();
    const hr = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const handle0 = { x: hr.left + hr.width / 2, y: hr.top + hr.height / 2 };
    const cScreen = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : handle0;
    const rotBox: RotBox = {
      rot: (rec.rot ?? 0) * RAD, w0: rec.w ?? 0, h0: rec.h ?? 0,
      cParent: { x: (rec.x ?? 0) + (rec.w ?? 0) / 2, y: (rec.y ?? 0) + (rec.h ?? 0) / 2 }, cScreen,
    };
    if (t.mode === "text") {
      const pEid = nodeFor(t.resizeEid)?.querySelector("p")?.getAttribute("data-eid") ?? null;
      dragRef.current = { kind: "field", eid: t.resizeEid, dir, w0: rec.w ?? 0, h0: rec.h ?? 0, k: (rec.scale ?? 1) * scale, cx: e.clientX, cy: e.clientY, start: rec, scale0: rec.scale ?? 1, handle0, cScreen, pEid, wrapDone: false };
    } else if (t.mode === "wh") {
      dragRef.current = { kind: "wh", eid: t.resizeEid, dir, start: rec, ...rotBox };
    } else {
      dragRef.current = {
        kind: "prop", eid: t.resizeEid, dir,
        target: t.mode === "image" ? "image" : t.mode === "scale" ? "scale" : "photo",
        scale0: rec.scale ?? 1, sx0: rec.sx ?? rec.scale ?? 1, sy0: rec.sy ?? rec.scale ?? 1, handle0, start: rec, ...rotBox,
      };
    }
  };

  // ---- save / reset ------------------------------------------------------------------
  const dirty = Object.keys(drafts);
  const dirtyContent = Object.keys(content);
  const paletteDirty = palette !== paletteSaved.current;
  const totalDirty = dirty.length + dirtyContent.length + (addStore.dirty() ? 1 : 0) + (paletteDirty ? 1 : 0);
  const onReset = () => {
    for (const eid of dirty) resetEl(eid, BASE[eid] ?? {});
    for (const eid of dirtyContent) {
      const o = origContentRef.current[eid] ?? {};
      if (o.text != null) setText(eid, o.text);
      if (o.src != null) { setImgSrc(eid, o.src); const img = imgUnder(eid); if (img) img.style.objectFit = ""; } // вернуть class-овый fill
    }
    addStore.reset();
    applyPalette(paletteSaved.current); // вернуть сохранённый цвет палитры
    setPalette(paletteSaved.current);
    setSelected(null);
    setDrafts({});
    setContent({});
    origContentRef.current = {};
    setTick((t) => t + 1);
  };
  const onSave = async () => {
    if (!totalDirty) return;
    setSaving(true);
    try {
      const res = await fetch("/__d06/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          changes: dirty.map((eid) => ({ eid, record: drafts[eid] })),
          content: dirtyContent.map((eid) => ({ eid, ...content[eid] })),
          additions: addStore.list(),
          ...(paletteDirty ? { palette } : {}), // null = вернуть базовые чернила
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || res.statusText);
      addStore.markSaved();
      paletteSaved.current = palette;
      setDrafts({});
      setContent({});
      origContentRef.current = {};
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Не удалось сохранить: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // добавленный текст/картинка — простой элемент: типографика/контент/картинка на нём самом
  const selKind = addKindOf(selected);
  const textEid = !selected ? null : selKind === "text" ? selected : isAdd(selected) ? null : textEidOf(selected);
  const fieldEid = selected && !isAdd(selected) ? fieldEidOf(selected) : null;
  const textSpanEid = !selected ? null : selKind === "text" ? selected : isAdd(selected) ? null : contentSpanOf(selected);
  const imgWrapEid = !selected ? null : selKind === "image" ? selected : isAdd(selected) ? null : imgWrapOf(selected);
  const textValue = !textSpanEid ? "" : isAdd(textSpanEid) ? (addStore.get(idOf(textSpanEid))?.text ?? "") : (content[textSpanEid]?.text ?? textOf(textSpanEid));

  return (
    <div className="d06e-chrome">
      <div className="d06e-bar">
        <strong>design06 · редактор</strong>
        <button className="d06e-tool" onClick={addText}>+ Текст</button>
        <button className="d06e-tool" onClick={() => fileRef.current?.click()}>+ Картинка</button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) addImageFile(f); e.target.value = ""; }} />
        <PalettePicker value={palette} dirty={paletteDirty} onPick={onPickPalette} />
        <span className="d06e-hint">тащить — двигать · углы — размер · Option — растянуть · ⌘D — копия · Del — удалить</span>
        <span className="d06e-bardirty" style={{ marginLeft: "auto" }}>{totalDirty > 0 ? `● ${totalDirty}` : ""}</span>
        <button className="d06e-tool" disabled={totalDirty === 0} onClick={onReset}>Сбросить</button>
        <button className="d06e-tool d06e-toolsave" disabled={totalDirty === 0 || saving} onClick={onSave}>{saving ? "Сохраняю…" : "Сохранить"}</button>
        <a className="d06e-exit" href={withoutEdit()}>Выйти</a>
      </div>

      {hovBox && hover !== selected && (
        <div className="d06e-hov" style={obStyle(hovBox)} />
      )}

      {selBox && selected && (
        <div className={`d06e-sel${isObject(BASE[selected]) || isSection(selected) ? "" : " d06e-inner"}`} style={obStyle(selBox)}>
          {hasGeometry(BASE[selected]) &&
            HANDLES.map((dir) => (
              <span key={dir} className={`d06e-h d06e-h-${dir}`} onPointerDown={(e) => startResize(e, dir)} />
            ))}
        </div>
      )}

      {selected && (
        <Panel
          eid={selected}
          draft={merged(selected)}
          geometry={hasGeometry(BASE[selected])}
          crumbs={crumbsOf(selected)}
          fieldEid={fieldEid}
          fieldDraft={fieldEid ? merged(fieldEid) : null}
          textEid={textEid}
          textDraft={textEid ? merged(textEid) : null}
          textSpanEid={textSpanEid}
          textValue={textValue}
          imgWrapEid={imgWrapEid}
          added={isAdd(selected)}
          dirtyCount={totalDirty}
          saving={saving}
          onSelect={setSelected}
          onField={onField}
          onText={onText}
          onReplaceImage={onReplaceImage}
          onCopy={copySelected}
          onDelete={deleteSelected}
          onLayer={reorder}
          onSave={onSave}
          onReset={onReset}
        />
      )}
    </div>
  );
}

const obStyle = (b: NonNullable<OBox>) => ({
  left: b.cx - b.vw / 2,
  top: b.cy - b.vh / 2,
  width: b.vw,
  height: b.vh,
  transform: `rotate(${b.rot}deg)`,
});

function withoutEdit(): string {
  const u = new URL(window.location.href);
  u.searchParams.delete("edit");
  return u.pathname + u.search + u.hash;
}
