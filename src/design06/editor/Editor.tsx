// design06 visual editor (dev-only, mounts on ?d06&edit). Overlay selection + inspector
// panel over the pixel-exact baseline. Edits are drafts on top of the committed base
// records; Save persists them back into the matching <Section>.layout.ts via a dev
// endpoint (vite-plugins/d06-save.ts). With the editor unmounted, render is the 0% base.
//
// Selection targets Canva *objects* (the top-level crop frame / line / text block — marked
// by touch-action; see registry.isObject), never the inner image layer. The selection box
// is oriented to the object's rotation, so resize handles act in the object's local axes:
// edges resize the crop frame, corners also scale the inner image.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { El } from "../layout";
import { applyEl, nodeFor, resetEl } from "./apply";
import { BASE, hasGeometry, hasTypography, isField, isObject, isSection } from "./registry";
import { Panel, type FieldKey } from "./Panel";
import "./editor.css";

type OBox = { cx: number; cy: number; vw: number; vh: number; rot: number } | null;
type Drag =
  | { kind: "move"; eid: string; cx: number; cy: number; start: El; moved: boolean }
  | {
      kind: "resize"; eid: string; dir: string;
      rot: number; w0: number; h0: number;
      cParent: { x: number; y: number }; cScreen: { x: number; y: number };
      start: El; innerImg: string | null; innerBase: El | null;
    }
  | { kind: "field"; eid: string; dir: string; w0: number; h0: number; k: number; cx: number; cy: number; start: El }
  | null;

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
const RAD = Math.PI / 180;

export default function Editor({ scale }: { scale: number }) {
  const [drafts, setDrafts] = useState<Record<string, El>>({});
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

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
      if (drag?.kind === "resize") {
        // screen pointer -> parent(canvas) coords via the start-time center mapping
        const px = drag.cParent.x + (e.clientX - drag.cScreen.x) / scale;
        const py = drag.cParent.y + (e.clientY - drag.cScreen.y) / scale;
        const ux = { x: Math.cos(drag.rot), y: Math.sin(drag.rot) };
        const uy = { x: -Math.sin(drag.rot), y: Math.cos(drag.rot) };
        const horiz = drag.dir.includes("e") ? 1 : drag.dir.includes("w") ? -1 : 0;
        const vert = drag.dir.includes("s") ? 1 : drag.dir.includes("n") ? -1 : 0;
        // fixed anchor = opposite edge/corner (keeps it pinned while dragging)
        const ax = -horiz, ay = -vert;
        const anchor = {
          x: drag.cParent.x + ax * (drag.w0 / 2) * ux.x + ay * (drag.h0 / 2) * uy.x,
          y: drag.cParent.y + ax * (drag.w0 / 2) * ux.y + ay * (drag.h0 / 2) * uy.y,
        };
        const relx = (px - anchor.x) * ux.x + (py - anchor.y) * ux.y;
        const rely = (px - anchor.x) * uy.x + (py - anchor.y) * uy.y;
        const newW = horiz ? Math.max(1, horiz * relx) : drag.w0;
        const newH = vert ? Math.max(1, vert * rely) : drag.h0;
        const cx = anchor.x + horiz * (newW / 2) * ux.x + vert * (newH / 2) * uy.x;
        const cy = anchor.y + horiz * (newW / 2) * ux.y + vert * (newH / 2) * uy.y;
        writeDraft(drag.eid, { ...drag.start, w: newW, h: newH, x: cx - newW / 2, y: cy - newH / 2 });
        // corner drag also scales the inner image layer (crop + photo together)
        if (drag.innerImg && drag.innerBase && horiz && vert) {
          const ib = drag.innerBase;
          writeDraft(drag.innerImg, { ...ib, w: (ib.w ?? 0) * (newW / drag.w0), h: (ib.h ?? 0) * (newH / drag.h0) });
        }
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
      // нажатие внутри уже выбранного (в т.ч. вложенной картинки) — двигаем именно его
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

  // ---- oriented selection / hover boxes ----------------------------------------------
  const orientedFor = useCallback((eid: string | null): OBox => {
    if (!eid) return null;
    const node = nodeFor(eid);
    const rec = draftsRef.current[eid] ?? BASE[eid];
    if (!node || !rec) return null;
    const r = node.getBoundingClientRect();
    const el = rec.scale ?? 1; // элемент со своим scale (поле текста) — учитываем в габаритах рамки
    return {
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      vw: (rec.w != null ? rec.w * el : r.width / scale) * scale,
      vh: (rec.h != null ? rec.h * el : r.height / scale) * scale,
      rot: rec.rot ?? 0,
    };
  }, [scale]);

  const [selBox, setSelBox] = useState<OBox>(null);
  const [hovBox, setHovBox] = useState<OBox>(null);
  useLayoutEffect(() => { setSelBox(orientedFor(selected)); }, [selected, tick, orientedFor]);
  useLayoutEffect(() => { setHovBox(orientedFor(hover)); }, [hover, tick, orientedFor]);

  const startResize = (e: React.PointerEvent, dir: string) => {
    if (!selected) return;
    e.stopPropagation();
    const rec = merged(selected);
    if (isField(BASE[selected])) {
      // px-per-local-unit = zoom × элементный scale; ресайз только w/h, без поворота/x-y
      dragRef.current = { kind: "field", eid: selected, dir, w0: rec.w ?? 0, h0: rec.h ?? 0, k: (rec.scale ?? 1) * scale, cx: e.clientX, cy: e.clientY, start: rec };
      return;
    }
    const node = nodeFor(selected);
    if (!node) return;
    const r = node.getBoundingClientRect();
    const innerImg = innerImgEidOf(selected);
    dragRef.current = {
      kind: "resize", eid: selected, dir,
      rot: (rec.rot ?? 0) * RAD, w0: rec.w ?? 0, h0: rec.h ?? 0,
      cParent: { x: (rec.x ?? 0) + (rec.w ?? 0) / 2, y: (rec.y ?? 0) + (rec.h ?? 0) / 2 },
      cScreen: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
      start: rec, innerImg, innerBase: innerImg ? merged(innerImg) : null,
    };
  };

  // ---- save / reset ------------------------------------------------------------------
  const dirty = Object.keys(drafts);
  const onReset = () => {
    for (const eid of dirty) resetEl(eid, BASE[eid] ?? {});
    setDrafts({});
    setTick((t) => t + 1);
  };
  const onSave = async () => {
    if (!dirty.length) return;
    setSaving(true);
    try {
      const changes = dirty.map((eid) => ({ eid, record: drafts[eid] }));
      const res = await fetch("/__d06/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ changes }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || res.statusText);
      setDrafts({});
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Не удалось сохранить: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const textEid = selected ? textEidOf(selected) : null;
  const fieldEid = selected ? fieldEidOf(selected) : null;

  return (
    <div className="d06e-chrome">
      <div className="d06e-bar">
        <strong>design06 · редактор</strong>
        <span className="d06e-hint">клик — объект · 2× клик — фото/поле текста · тащить — двигать · грани/углы — размер</span>
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
          dirtyCount={dirty.length}
          saving={saving}
          onSelect={setSelected}
          onField={onField}
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
