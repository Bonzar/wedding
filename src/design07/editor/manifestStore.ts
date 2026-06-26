// Рантайм-стор манифеста секций (порядок + мета) — единый источник правды на время правки:
//   • Design07 подписан (useManifest) и рендерит секции по нему (порядок, скрытие, minHeight);
//   • редактор мутирует (move/patch/remove/restore).
// По образцу additionsStore: seed из sectionManifest.ts, reset возвращает к последнему saved.
import { useSyncExternalStore } from "react";
import { sectionManifest as seed, type SectionEntry } from "../sectionManifest";

let state: SectionEntry[] = seed.map((e) => ({ ...e }));
let saved: SectionEntry[] = seed.map((e) => ({ ...e }));
const subs = new Set<() => void>();

export const manifestStore = {
  list: (): SectionEntry[] => state,
  get: (slug: string) => state.find((e) => e.slug === slug),
  notify() { subs.forEach((f) => f()); },
  set(next: SectionEntry[]) { state = next; this.notify(); },
  patch(slug: string, e: Partial<SectionEntry>) { this.set(state.map((x) => (x.slug === slug ? { ...x, ...e } : x))); },
  // Переставить секцию на одну позицию (-1 вверх / +1 вниз) среди ВСЕХ записей (вкл. скрытые).
  move(slug: string, dir: -1 | 1) {
    const i = state.findIndex((e) => e.slug === slug);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= state.length) return;
    const next = state.slice();
    [next[i], next[j]] = [next[j], next[i]];
    this.set(next);
  },
  remove(slug: string) { this.patch(slug, { enabled: false }); }, // мягко: скрыть (запись цела)
  restore(slug: string) { this.patch(slug, { enabled: true }); },
  // Добавить кастомную (не-Canva) секцию после afterSlug (или в конец). Рендерит CustomSection:
  // пустой холст под ручной интерактив + секционные additions. Возвращает её slug.
  addCustom(afterSlug?: string): string {
    const slug = `custom-${Date.now().toString(36)}`;
    const entry: SectionEntry = { slug, custom: true, title: "Новая секция", minHeight: 800 };
    const i = afterSlug ? state.findIndex((e) => e.slug === afterSlug) : state.length - 1;
    const next = state.slice();
    next.splice((i < 0 ? state.length - 1 : i) + 1, 0, entry);
    this.set(next);
    return slug;
  },
  dirty: () => JSON.stringify(state) !== JSON.stringify(saved),
  markSaved() { saved = state.map((e) => ({ ...e })); this.notify(); },
  reset() { this.set(saved.map((e) => ({ ...e }))); },
  subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; },
};

export function useManifest(): SectionEntry[] {
  return useSyncExternalStore(manifestStore.subscribe, manifestStore.list, manifestStore.list);
}
