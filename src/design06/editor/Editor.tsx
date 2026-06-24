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
import { Panel, type FieldKey } from "./Panel";
import "./editor.css";

type OBox = { cx: number; cy: number; vw: number; vh: number; rot: number } | null;
type Mode = "image" | "text" | "scale" | "wh" | "photo";
type RotBox = { rot: number; w0: number; h0: number; cParent: { x: number; y: number }; cScreen: { x: number; y: number } };
type Drag =
  | { kind: "move"; eid: string; cx: number; cy: number; start: El; moved: boolean }
  | { kind: "field"; eid: string; dir: string; w0: number; h0: number; k: number; cx: number; cy: number; start: El }
  | ({ kind: "wh"; eid: string; dir: string; start: El } & RotBox)
  | ({
      kind: "prop"; eid: string; dir: string; target: "framePhoto" | "scale" | "photo";
      scale0: number; pw0: number; ph0: number; photoEid: string | null; photoStart: El | null;
      handle0: { x: number; y: number }; start: El;
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
    if (origContentRef.current[spanEid]?.text == null)
      origContentRef.current[spanEid] = { ...origContentRef.current[spanEid], text: textOf(spanEid) };
    setContent((c) => ({ ...c, [spanEid]: { ...c[spanEid], text } }));
    setText(spanEid, text);
    setTick((t) => t + 1);
  }, []);

  const onReplaceImage = useCallback(async (wrapEid: string, file: File) => {
    const dataUrl: string = await new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.readAsDataURL(file);
    });
    const base64 = dataUrl.split(",")[1];
    try {
      const up = await fetch("/__d06/upload", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: file.name, data: base64 }),
      });
      const uj = await up.json();
      if (!up.ok || !uj.ok) throw new Error(uj.error || up.statusText);
      // ждём, пока dev-сервер начнёт реально отдавать файл (гонка записи/раздачи),
      // заодно ловим форматы, которые браузер не декодирует (HEIC/HEIF и т.п.)
      if (!(await waitImageServable(uj.path))) {
        // eslint-disable-next-line no-alert
        alert("Файл загрузился, но не отображается — браузер не смог его декодировать (часто это HEIC/HEIF с iPhone/Mac). Сконвертируй в JPG, PNG, WebP, GIF или SVG.");
        return;
      }
      if (origContentRef.current[wrapEid]?.src == null)
        origContentRef.current[wrapEid] = { ...origContentRef.current[wrapEid], src: imgUnder(wrapEid)?.getAttribute("src") ?? "" };
      setContent((c) => ({ ...c, [wrapEid]: { ...c[wrapEid], src: uj.path } })); // чистый путь — для Save/.tsx
      setImgSrc(wrapEid, `${uj.path}?v=${Date.now()}`); // превью — cache-bust
      setTick((t) => t + 1);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Загрузка не удалась: " + (err as Error).message);
    }
  }, []);

  // ---- live edit -> draft + DOM ------------------------------------------------------
  const writeDraft = useCallback((eid: string, rec: El) => {
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
        const s = drag.start;
        writeDraft(drag.eid, { ...s, x: (s.x ?? 0) + sdx / scale, y: (s.y ?? 0) + sdy / scale });
        return;
      }
      if (drag?.kind === "field") {
        // text-field: flow-positioned + scaled, no rotation → just w/h, top-left anchored.
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
        // free aspect (Option/Alt) on an image → resize the crop frame only (no photo)
        if (drag.target === "framePhoto" && e.altKey) {
          writeDraft(drag.eid, { ...drag.start, ...whCompute(drag, e) });
          return;
        }
        const d0 = dist(drag.handle0.x, drag.handle0.y, drag.cScreen.x, drag.cScreen.y) || 1;
        const k = Math.max(0.05, dist(e.clientX, e.clientY, drag.cScreen.x, drag.cScreen.y) / d0);
        if (drag.target === "scale") {
          writeDraft(drag.eid, { ...drag.start, scale: drag.scale0 * k }); // uniform, about center
          return;
        }
        const nw = drag.w0 * k, nh = drag.h0 * k;
        if (drag.target === "photo") {
          // zoom the photo about its own centre inside the fixed crop
          writeDraft(drag.eid, { ...drag.start, w: nw, h: nh, x: (drag.start.x ?? 0) + (drag.w0 - nw) / 2, y: (drag.start.y ?? 0) + (drag.h0 - nh) / 2 });
          return;
        }
        // framePhoto: scale frame + photo together about centre (proportional)
        writeDraft(drag.eid, { ...drag.start, w: nw, h: nh, x: drag.cParent.x - nw / 2, y: drag.cParent.y - nh / 2 });
        if (drag.photoEid && drag.photoStart) writeDraft(drag.photoEid, { ...drag.photoStart, w: drag.pw0 * k, h: drag.ph0 * k });
        return;
      }
      if (inChrome(e.target)) return;
      setHover(resolveObject(e.target as Element));
    };

    const armMove = (eid: string, e: PointerEvent) => {
      // fields don't move (no x/y translate) — reposition via the parent object instead
      if (hasGeometry(BASE[eid]) && !isField(BASE[eid])) dragRef.current = { kind: "move", eid, cx: e.clientX, cy: e.clientY, start: merged(eid), moved: false };
    };

    const onDown = (e: PointerEvent) => {
      if (inChrome(e.target)) return; // панель/ручки обрабатывают себя сами
      const cur = selectedRef.current;
      const curNode = cur ? nodeFor(cur) : null;
      if (cur && curNode && e.target instanceof Node && curNode.contains(e.target)) {
        armMove(cur, e);
        return;
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
  }, [scale, resolveObject, writeDraft, merged, innerImgEidOf, fieldEidOf]);

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
    const el = rec.scale ?? 1;
    return {
      ...center,
      vw: (rec.w != null ? rec.w * el : r.width / scale) * scale,
      vh: (rec.h != null ? rec.h * el : r.height / scale) * scale,
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
      dragRef.current = { kind: "field", eid: t.resizeEid, dir, w0: rec.w ?? 0, h0: rec.h ?? 0, k: (rec.scale ?? 1) * scale, cx: e.clientX, cy: e.clientY, start: rec };
    } else if (t.mode === "wh") {
      dragRef.current = { kind: "wh", eid: t.resizeEid, dir, start: rec, ...rotBox };
    } else {
      const photoStart = t.photoEid ? merged(t.photoEid) : null;
      dragRef.current = {
        kind: "prop", eid: t.resizeEid, dir,
        target: t.mode === "image" ? "framePhoto" : t.mode === "scale" ? "scale" : "photo",
        scale0: rec.scale ?? 1, pw0: photoStart?.w ?? 0, ph0: photoStart?.h ?? 0,
        photoEid: t.photoEid, photoStart, handle0, start: rec, ...rotBox,
      };
    }
  };

  // ---- save / reset ------------------------------------------------------------------
  const dirty = Object.keys(drafts);
  const dirtyContent = Object.keys(content);
  const totalDirty = dirty.length + dirtyContent.length;
  const onReset = () => {
    for (const eid of dirty) resetEl(eid, BASE[eid] ?? {});
    for (const eid of dirtyContent) {
      const o = origContentRef.current[eid] ?? {};
      if (o.text != null) setText(eid, o.text);
      if (o.src != null) setImgSrc(eid, o.src);
    }
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
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || res.statusText);
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

  const textEid = selected ? textEidOf(selected) : null;
  const fieldEid = selected ? fieldEidOf(selected) : null;
  const textSpanEid = selected ? contentSpanOf(selected) : null;
  const imgWrapEid = selected ? imgWrapOf(selected) : null;

  return (
    <div className="d06e-chrome">
      <div className="d06e-bar">
        <strong>design06 · редактор</strong>
        <span className="d06e-hint">клик — объект · 2× — внутрь (фото/поле) · тащить — двигать · углы — размер · Option — свободные пропорции</span>
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
          textValue={textSpanEid ? (content[textSpanEid]?.text ?? textOf(textSpanEid)) : ""}
          imgWrapEid={imgWrapEid}
          dirtyCount={totalDirty}
          saving={saving}
          onSelect={setSelected}
          onField={onField}
          onText={onText}
          onReplaceImage={onReplaceImage}
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
