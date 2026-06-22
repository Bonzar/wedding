import type { ElementEdit } from "./editorStore";

const KEY = "wedding-layout-edits";
const SAVE_ENDPOINT = "/__layout-edit/save";

/** Загрузить правки из localStorage (WIP переживает reload/HMR). */
export function loadEdits(): Map<string, ElementEdit> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Map();
    const arr: ElementEdit[] = JSON.parse(raw);
    return new Map(arr.map((e) => [e.selector, e]));
  } catch {
    return new Map();
  }
}

/** Сохранить правки в localStorage. */
export function persistEdits(edits: Map<string, ElementEdit>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify([...edits.values()]));
  } catch {
    /* приватный режим / переполнение — игнорируем */
  }
}

export interface SaveResponse {
  ok: boolean;
  count?: number;
  error?: string;
}

/** Выгрузить правки в репозиторий через dev-эндпоинт Vite-плагина. */
export async function postEdits(list: ElementEdit[]): Promise<SaveResponse> {
  const res = await fetch(SAVE_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(list),
  });
  if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
  return (await res.json()) as SaveResponse;
}
