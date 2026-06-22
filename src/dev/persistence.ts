import type { ElementEdit } from "./editorStore";

const KEY = "wedding-layout-edits";
const SAVE_ENDPOINT = "/__layout-edit/save";
const LOAD_ENDPOINT = "/__layout-edit/load";

// — ЧЕРНОВИК (localStorage): несохранённые правки. Пишется на ходу, чистится при 💾, откат при ↺. —

/** Загрузить черновик правок из localStorage. */
export function loadDraft(): Map<string, ElementEdit> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Map();
    const arr: ElementEdit[] = JSON.parse(raw);
    return new Map(arr.map((e) => [e.selector, e]));
  } catch {
    return new Map();
  }
}

/** Записать черновик в localStorage (на каждую правку). */
export function persistDraft(edits: Map<string, ElementEdit>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify([...edits.values()]));
  } catch {
    /* приватный режим / переполнение — игнорируем */
  }
}

/** Стереть черновик (после 💾 или при ↺). */
export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* игнорируем */
  }
}

// — СОХРАНЁННЫЕ (tools/layout-edits/ через dev-плагин): источник истины, переживает reload. —

/** Подтянуть сохранённые правки из tools/layout-edits/edits.json (dev-эндпоинт). */
export async function loadSaved(): Promise<ElementEdit[]> {
  try {
    const res = await fetch(LOAD_ENDPOINT);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as ElementEdit[]) : [];
  } catch {
    return [];
  }
}

export interface SaveResponse {
  ok: boolean;
  count?: number;
  error?: string;
}

/** Выгрузить правки в репозиторий (tools/layout-edits/) через dev-эндпоинт Vite-плагина. */
export async function postEdits(list: ElementEdit[]): Promise<SaveResponse> {
  const res = await fetch(SAVE_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(list),
  });
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
  return (await res.json()) as SaveResponse;
}
