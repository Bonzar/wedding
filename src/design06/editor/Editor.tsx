// design06 visual editor (dev-only, mounts on ?d06&edit). Overlay selection + inspector
// panel over the pixel-exact baseline. Edits are drafts on top of the committed base
// records; Save persists them back into the matching <Section>.layout.ts via a dev
// endpoint (vite-plugins/d06-save.ts). With the editor unmounted, render is the 0% base.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { El } from "../layout";
import { applyEl, nodeFor, resetEl } from "./apply";
import { BASE, hasGeometry, hasTypography } from "./registry";
import { Panel, type FieldKey } from "./Panel";
import "./editor.css";

type Box = { x: number; y: number; w: number; h: number } | null;
type Drag =
  | { kind: "move"; eid: string; cx: number; cy: number; start: El }
  | { kind: "resize"; eid: string; dir: string; cx: number; cy: number; start: El }
  | null;

const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;

export default function Editor({ scale }: { scale: number }) {
  const [drafts, setDrafts] = useState<Record<string, El>>({});
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);
  const dragRef = useRef<Drag>(null);

  const merged = useCallback((eid: string): El => draftsRef.current[eid] ?? BASE[eid] ?? {}, []);

  // ---- selection helpers (resolve clicks/hover to a geometry block) ------------------
  const resolveBlock = useCallback((from: Element | null): string | null => {
    for (let el: Element | null = from; el; el = el.parentElement) {
      const eid = el.getAttribute?.("data-eid");
      if (eid && hasGeometry(BASE[eid])) return eid;
    }
    // fall back to the innermost data-eid even if it lacks geometry (text/span)
    const any = from?.closest?.("[data-eid]");
    return any?.getAttribute("data-eid") ?? null;
  }, []);

  const crumbsOf = useCallback((eid: string): string[] => {
    const node = nodeFor(eid);
    const out: string[] = [];
    for (let el = node?.parentElement ?? null; el; el = el.parentElement) {
      const id = el.getAttribute("data-eid");
      if (id && hasGeometry(BASE[id])) out.push(id);
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
      if (drag) {
        const dx = (e.clientX - drag.cx) / scale;
        const dy = (e.clientY - drag.cy) / scale;
        const s = drag.start;
        if (drag.kind === "move") {
          writeDraft(drag.eid, { ...s, x: (s.x ?? 0) + dx, y: (s.y ?? 0) + dy });
        } else {
          const r: El = { ...s };
          const x0 = s.x ?? 0, y0 = s.y ?? 0, w0 = s.w ?? 0, h0 = s.h ?? 0;
          if (drag.dir.includes("e")) r.w = Math.max(1, w0 + dx);
          if (drag.dir.includes("s")) r.h = Math.max(1, h0 + dy);
          if (drag.dir.includes("w")) { r.w = Math.max(1, w0 - dx); r.x = x0 + dx; }
          if (drag.dir.includes("n")) { r.h = Math.max(1, h0 - dy); r.y = y0 + dy; }
          writeDraft(drag.eid, r);
        }
        return;
      }
      if (inChrome(e.target)) return;
      setHover(resolveBlock(e.target as Element));
    };

    const onDown = (e: PointerEvent) => {
      if (inChrome(e.target)) return; // panel / handles handle themselves
      const eid = resolveBlock(e.target as Element);
      setSelected(eid);
      setHover(null);
    };

    const onUp = () => { dragRef.current = null; };

    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerup", onUp, true);
    return () => {
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
    };
  }, [scale, resolveBlock, writeDraft]);

  // reposition boxes on scroll/resize
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("scroll", bump, true);
    window.addEventListener("resize", bump);
    return () => {
      window.removeEventListener("scroll", bump, true);
      window.removeEventListener("resize", bump);
    };
  }, []);

  // ---- screen-space boxes ------------------------------------------------------------
  const [selBox, setSelBox] = useState<Box>(null);
  const [hovBox, setHovBox] = useState<Box>(null);
  const rectOf = (eid: string | null): Box => {
    const n = eid ? nodeFor(eid) : null;
    if (!n) return null;
    const r = n.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  };
  useLayoutEffect(() => { setSelBox(rectOf(selected)); }, [selected, tick]);
  useLayoutEffect(() => { setHovBox(rectOf(hover)); }, [hover, tick]);

  const startMove = (e: React.PointerEvent) => {
    if (!selected || !hasGeometry(BASE[selected])) return;
    e.stopPropagation();
    dragRef.current = { kind: "move", eid: selected, cx: e.clientX, cy: e.clientY, start: merged(selected) };
  };
  const startResize = (e: React.PointerEvent, dir: string) => {
    if (!selected) return;
    e.stopPropagation();
    dragRef.current = { kind: "resize", eid: selected, dir, cx: e.clientX, cy: e.clientY, start: merged(selected) };
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
      // Persisted into layout.ts → HMR re-renders the same values from the new base.
      setDrafts({});
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Не удалось сохранить: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const textEid = selected ? textEidOf(selected) : null;

  return (
    <div className="d06e-chrome">
      <div className="d06e-bar">
        <strong>design06 · редактор</strong>
        <span className="d06e-hint">клик — выбрать · тащить — двигать · уголки — размер</span>
        <a className="d06e-exit" href={withoutEdit()}>Выйти</a>
      </div>

      {hovBox && hover !== selected && (
        <div className="d06e-hov" style={boxStyle(hovBox)} />
      )}

      {selBox && selected && (
        <div className="d06e-sel" style={boxStyle(selBox)} onPointerDown={startMove}>
          {hasGeometry(BASE[selected]) &&
            HANDLES.map((dir) => (
              <span
                key={dir}
                className={`d06e-h d06e-h-${dir}`}
                onPointerDown={(e) => startResize(e, dir)}
              />
            ))}
        </div>
      )}

      {selected && (
        <Panel
          eid={selected}
          draft={merged(selected)}
          geometry={hasGeometry(BASE[selected])}
          crumbs={crumbsOf(selected)}
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

const boxStyle = (b: NonNullable<Box>) => ({ left: b.x, top: b.y, width: b.w, height: b.h });

function withoutEdit(): string {
  const u = new URL(window.location.href);
  u.searchParams.delete("edit");
  return u.pathname + u.search + u.hash;
}
