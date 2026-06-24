// Live preview without re-rendering sections: compute elStyle(merged) and write the
// resulting properties straight onto the rendered [data-eid] node. Sections never change
// state during editing, so React won't clobber these imperative writes; on Save the edits
// are persisted to layout.ts and HMR re-renders the same values canonically.
import { elStyle, type El } from "../layout";

const KNOWN_KEYS = [
  "width", "height", "transform", "fontFamily", "letterSpacing", "lineHeight",
  "textAlign", "textTransform", "color",
] as const;

export function nodeFor(eid: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-eid="${CSS.escape(eid)}"]`);
}

/** Apply a merged record's style to its DOM node (live preview). */
export function applyEl(eid: string, rec: El): void {
  const node = nodeFor(eid);
  if (!node) return;
  const s = elStyle(rec) as Record<string, string>;
  for (const k of KNOWN_KEYS) {
    if (s[k] != null) node.style.setProperty(camelToKebab(k), String(s[k]));
  }
  // Canva maps font-size to a custom property.
  if (s["--H97cbQ"] != null) node.style.setProperty("--H97cbQ", String(s["--H97cbQ"]));
}

/** Restore a node to its committed base by re-applying the base record. */
export function resetEl(eid: string, base: El): void {
  applyEl(eid, base);
}

function camelToKebab(k: string): string {
  return k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
