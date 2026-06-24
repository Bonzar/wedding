// Runtime store for editor-added elements. Single source of truth while editing:
//   • Design06 subscribes (useAdditions) and renders the overlay layer;
//   • the editor mutates it (add/patch/remove) — the same move/resize/edit machinery
//     works because each addition's geometry record is mirrored into BASE under `add/<id>`
//     (with the Canva top-level-object marker, so isObject/resolveObject treat it as one).
// Save persists the list to additions.ts; reset reverts to the last-saved snapshot.
import { useSyncExternalStore } from "react";
import type { El } from "../layout";
import { additions as seed, type Addition } from "../additions";
import { BASE } from "./registry";

const MARKER = { touchAction: "pan-x pan-y pinch-zoom" }; // маркер top-level объекта (isObject)

// Addition → редактируемая запись El в BASE (без id/kind/content, с маркером объекта).
function toRecord(a: Addition): El {
  const { id: _id, kind: _kind, text: _text, src: _src, raw, ...el } = a;
  void _id; void _kind; void _text; void _src;
  return { ...el, raw: { ...MARKER, ...(raw ?? {}) } };
}

let state: Addition[] = seed.map((a) => ({ ...a }));
let saved: Addition[] = seed.map((a) => ({ ...a }));
const subs = new Set<() => void>();

function syncBase() {
  for (const a of state) BASE[`add/${a.id}`] = toRecord(a);
}
syncBase();

export const addStore = {
  list: (): Addition[] => state,
  get: (id: string) => state.find((a) => a.id === id),
  isAdd: (eid: string | null | undefined) => !!eid && eid.startsWith("add/"),
  idOf: (eid: string) => eid.slice(4),
  notify() { subs.forEach((f) => f()); },
  set(next: Addition[]) { state = next; syncBase(); this.notify(); },
  add(a: Addition) { this.set([...state, a]); },
  patch(id: string, el: Partial<Addition>) { this.set(state.map((a) => (a.id === id ? { ...a, ...el } : a))); },
  remove(id: string) { delete BASE[`add/${id}`]; this.set(state.filter((a) => a.id !== id)); },
  dirty: () => JSON.stringify(state) !== JSON.stringify(saved),
  markSaved() { saved = state.map((a) => ({ ...a })); this.notify(); },
  reset() {
    for (const a of state) delete BASE[`add/${a.id}`];
    this.set(saved.map((a) => ({ ...a })));
  },
  subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; },
};

export function useAdditions(): Addition[] {
  return useSyncExternalStore(addStore.subscribe, addStore.list, addStore.list);
}
