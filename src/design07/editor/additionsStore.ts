// Runtime store for editor-added elements. Single source of truth while editing:
//   • Design06 subscribes (useAdditions) and renders the overlay layer;
//   • the editor mutates it (add/patch/remove) — the same move/resize/edit machinery
//     works because each addition's geometry record is mirrored into BASE under `add/<id>`
//     (with the Canva top-level-object marker, so isObject/resolveObject treat it as one).
// Save persists the list to additions.ts; reset reverts to the last-saved snapshot.
import { useSyncExternalStore } from "react";
import type { El } from "../layout";
import { additions as seed, photoOf, type Addition } from "../additions";
import { BASE } from "./registry";

const MARKER = { touchAction: "pan-x pan-y pinch-zoom" }; // маркер top-level объекта (isObject)

// Addition → редактируемая запись El в BASE (без id/kind/content, с маркером объекта).
// `photo` (слой фото внутри рамки) — отдельная запись BASE[`add/<id>/photo`], не часть рамки.
function toRecord(a: Addition): El {
  const { id: _id, kind: _kind, text: _text, src: _src, photo: _photo, raw, ...el } = a;
  void _id; void _kind; void _text; void _src; void _photo;
  return { ...el, raw: { ...MARKER, ...(raw ?? {}) } };
}

let state: Addition[] = seed.map((a) => ({ ...a }));
let saved: Addition[] = seed.map((a) => ({ ...a }));
const subs = new Set<() => void>();

// Зеркалим каждый Addition в BASE: рамку (add/<id>, объект) и — у картинок — слой фото
// (add/<id>/photo, БЕЗ маркера → isObject=false, поэтому innerImgEidOf/drill его находят как
// внутренний кроп-слой, как у Canva-фото). Удалённые id чистятся в remove()/reset().
function syncBase() {
  for (const a of state) {
    BASE[`add/${a.id}`] = toRecord(a);
    if (a.kind === "image") BASE[`add/${a.id}/photo`] = photoOf(a);
    else delete BASE[`add/${a.id}/photo`];
  }
}
syncBase();

export const addStore = {
  list: (): Addition[] => state,
  get: (id: string) => state.find((a) => a.id === id),
  isAdd: (eid: string | null | undefined) => !!eid && eid.startsWith("add/"),
  isAddPhoto: (eid: string | null | undefined) => !!eid && eid.startsWith("add/") && eid.endsWith("/photo"),
  // eid → id Addition: и для рамки (add/<id>), и для слоя фото (add/<id>/photo).
  idOf: (eid: string) => eid.slice(4).replace(/\/photo$/, ""),
  notify() { subs.forEach((f) => f()); },
  set(next: Addition[]) { state = next; syncBase(); this.notify(); },
  add(a: Addition) { this.set([...state, a]); },
  patch(id: string, el: Partial<Addition>) { this.set(state.map((a) => (a.id === id ? { ...a, ...el } : a))); },
  // Правка слоя фото (пан/зум внутри маски) — пишет El целиком в a.photo.
  patchPhoto(id: string, photo: El) { this.patch(id, { photo }); },
  remove(id: string) { delete BASE[`add/${id}`]; delete BASE[`add/${id}/photo`]; this.set(state.filter((a) => a.id !== id)); },
  dirty: () => JSON.stringify(state) !== JSON.stringify(saved),
  markSaved() { saved = state.map((a) => ({ ...a })); this.notify(); },
  reset() {
    for (const a of state) { delete BASE[`add/${a.id}`]; delete BASE[`add/${a.id}/photo`]; }
    this.set(saved.map((a) => ({ ...a })));
  },
  subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; },
};

export function useAdditions(): Addition[] {
  return useSyncExternalStore(addStore.subscribe, addStore.list, addStore.list);
}
