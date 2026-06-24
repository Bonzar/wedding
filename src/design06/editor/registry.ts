// Editor registry: merges every section's base layout into one eid→record map and
// records which section file each eid belongs to (for save). The base records are the
// committed 0% baseline; the editor edits drafts on top and persists back to these files.
import type { El } from "../layout";

import { layout as hero } from "../sections/Hero.layout";
import { layout as calendar } from "../sections/Calendar.layout";
import { layout as timeline } from "../sections/Timeline.layout";
import { layout as details } from "../sections/Details.layout";
import { layout as attire } from "../sections/Attire.layout";
import { layout as gift } from "../sections/Gift.layout";
import { layout as journey } from "../sections/Journey.layout";
import { layout as rsvp } from "../sections/Rsvp.layout";
import { layout as closing } from "../sections/Closing.layout";

// slug (eid prefix) → layout object. Slug capitalized = file name (Hero.layout.ts …).
const SECTIONS: Record<string, Record<string, El>> = {
  hero, calendar, timeline, details, attire, gift, journey, rsvp, closing,
};

/** Base (committed 0%) record for an eid, or undefined if unknown. */
export const BASE: Record<string, El> = Object.assign({}, ...Object.values(SECTIONS));

/** Section slug that owns an eid (the part before the first slash). */
export function sectionOf(eid: string): string {
  return eid.split("/")[0];
}

/** All eids known to the editor. */
export const ALL_EIDS: string[] = Object.keys(BASE);

/** Шрифты, добавленные вручную (не из Canva-бандла) и подключённые через custom-fonts.css.
 *  Значение = готовая font-family-строка (имя в кавычках — есть пробелы/цифры; generic-фолбэк). */
export const CUSTOM_FONTS: string[] = [
  '"English 111 Vivace BT", cursive',
  '"Nicoletta Script SHA", cursive',
];

/** Distinct font stacks actually used in the design + добавленные вручную — offered as a
 *  picker so the font field isn't a free-text typo trap (e.g. "Ariel" silently falling back). */
export const FONTS: string[] = [
  ...new Set([
    ...Object.values(BASE).map((r) => r.font).filter((f): f is string => !!f),
    ...CUSTOM_FONTS,
  ]),
];

/** A record is geometry-editable only if it positions itself via top-level El fields
 *  (not a hand-rolled raw.transform — clobbering those would break masks/clips). */
export function hasGeometry(r: El | undefined): boolean {
  return !!r && (r.x != null || r.y != null || r.w != null || r.h != null || r.rot != null || r.scale != null);
}

/** A record carries text styling if any typography field is set. */
export function hasTypography(r: El | undefined): boolean {
  return !!r && (r.font != null || r.fontSize != null || r.letterSpacing != null || r.lineHeight != null || r.color != null);
}

/** Canva marks every top-level, user-movable object with this touch-action. Inner image
 *  layers have geometry but no marker; inner SVG paths have the marker but no geometry —
 *  so `marker && geometry` uniquely picks the selectable object (crop frame, line, text). */
export function isObject(r: El | undefined): boolean {
  const ta = r?.raw?.touchAction;
  return hasGeometry(r) && typeof ta === "string" && ta.includes("pinch-zoom");
}

/** Section root (`<slug>/section`) — the coarsest selectable. */
export function isSection(eid: string): boolean {
  return eid.endsWith("/section");
}

/** The text-field wrapper (Canva marks it with writing-mode). Its width controls line
 *  wrapping / the text area; it is flow-positioned + scaled, so it resizes by w/h only
 *  (no x/y translate), unlike a normal object. */
export function isField(r: El | undefined): boolean {
  return !!r && !!r.raw && (r.raw as Record<string, unknown>).writingMode != null;
}
