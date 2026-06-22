import { makeAutoObservable, observable } from "mobx";
import { computeLabel, computeSelector, computeSource, hasText, isTextLeaf } from "./selector";
import { clearDraft, loadDraft, loadSaved, persistDraft, postEdits } from "./persistence";

/** Правка одного элемента. Сериализуется как есть в tools/layout-edits/edits.json. */
export interface ElementEdit {
  selector: string;
  label: string;
  /** позиция элемента в коде ("src/.../File.tsx:line") — куда вкладывать правку */
  source?: string;
  /** ближайший предок из файла секции, если элемент отрендерен внутри общего компонента */
  sourceSection?: string;
  /** компонент-владелец + проп + место вызова (для безымянных svg/path) */
  owner?: string;
  tag?: string;
  classes?: string[];
  // геометрия (transform)
  tx: number;
  ty: number;
  scale: number;
  rotate: number;
  // типографика (опционально, для текстовых элементов)
  text?: string;
  fontFamily?: string;
  fontSizePx?: number;
  lineHeight?: number;
  letterSpacingPx?: number;
  wordSpacingPx?: number;
}

export type SaveState = "idle" | "saving" | "ok" | "error";

const IDENTITY = { tx: 0, ty: 0, scale: 1, rotate: 0 } as const;

/**
 * Стор live-редактора макета. DEV-ONLY: инстанцируется только когда грузится чанк
 * src/dev (динамический импорт под import.meta.env.DEV), в прод-бандл не попадает.
 * НЕ входит в RootStore (тот общий с продом).
 *
 * Два уровня хранения:
 *  - ЧЕРНОВИК (localStorage) — несохранённые правки, пишется на каждую правку;
 *  - СОХРАНЁННЫЕ (tools/layout-edits/) — источник истины, пишется по 💾, читается на старте.
 * 💾 пишет в tools/ и чистит черновик; ↺ откатывает к сохранённым (черновик долой, tools/ не трогаем).
 */
export class EditorStore {
  editMode = false;
  selectedEl: HTMLElement | null = null;
  selectedSelector: string | null = null;
  selectedSource: string | null = null;
  selectedSourceSection: string | null = null;
  selectedOwner: string | null = null;
  edits = new Map<string, ElementEdit>();
  /** снимок последнего сохранённого состояния (tools/) — база для ↺ и индикатора dirty */
  savedSnapshot: ElementEdit[] = [];
  saveState: SaveState = "idle";
  saveError = "";

  constructor() {
    makeAutoObservable(this, { selectedEl: observable.ref }, { autoBind: true });
    this.edits = loadDraft(); // черновик (если остался от прошлой сессии) — сразу
  }

  /** Подтянуть сохранённые из tools/layout-edits/ (async, на монтировании DevTools). */
  async hydrate(): Promise<void> {
    const saved = await loadSaved();
    this.savedSnapshot = saved;
    // нет черновика → текущим становится сохранённое
    if (this.edits.size === 0 && saved.length) {
      this.edits = new Map(saved.map((e) => [e.selector, { ...e }]));
    }
    this.reapplyAll();
  }

  // — режим —

  toggleEditMode(): void {
    this.setEditMode(!this.editMode);
  }

  setEditMode(on: boolean): void {
    this.editMode = on;
    if (!on) this.clearSelection();
  }

  // — выделение —

  select(el: HTMLElement): void {
    this.selectedEl = el;
    this.selectedSelector = computeSelector(el);
    const { source, sourceSection, owner } = computeSource(el);
    this.selectedSource = source ?? null;
    this.selectedSourceSection = sourceSection ?? null;
    this.selectedOwner = owner ?? null;
    // подтянуть человеко-данные/источник в существующую правку (если была раньше)
    const existing = this.edits.get(this.selectedSelector);
    if (existing) {
      if (!existing.label) existing.label = computeLabel(el);
      if (!existing.source && source) existing.source = source;
      if (!existing.sourceSection && sourceSection) existing.sourceSection = sourceSection;
      if (!existing.owner && owner) existing.owner = owner;
    }
  }

  clearSelection(): void {
    this.selectedEl = null;
    this.selectedSelector = null;
    this.selectedSource = null;
    this.selectedSourceSection = null;
    this.selectedOwner = null;
  }

  // — текущая правка выделенного элемента —

  get current(): ElementEdit | null {
    if (!this.selectedSelector || !this.selectedEl) return null;
    return this.edits.get(this.selectedSelector) ?? { ...this.defaultEdit() };
  }

  get isTextSelected(): boolean {
    return !!this.selectedEl && hasText(this.selectedEl);
  }

  get canEditText(): boolean {
    return !!this.selectedEl && isTextLeaf(this.selectedEl);
  }

  get editCount(): number {
    return this.edits.size;
  }

  /** Есть несохранённые отличия от снимка tools/? */
  get isDirty(): boolean {
    return JSON.stringify([...this.edits.values()]) !== JSON.stringify(this.savedSnapshot);
  }

  private defaultEdit(): ElementEdit {
    const el = this.selectedEl!;
    return {
      selector: this.selectedSelector!,
      label: computeLabel(el),
      source: this.selectedSource ?? undefined,
      sourceSection: this.selectedSourceSection ?? undefined,
      owner: this.selectedOwner ?? undefined,
      tag: el.tagName.toLowerCase(),
      classes: Array.from(el.classList),
      ...IDENTITY,
    };
  }

  /** Гарантирует наличие правки в Map и возвращает ИМЕННО хранимый в observable-map
   *  объект (deep-observable клонирует значение при set — мутировать надо его, иначе
   *  инлайн-стиль, current и черновик разъедутся). */
  private ensureEdit(): ElementEdit {
    const sel = this.selectedSelector!;
    if (!this.edits.has(sel)) this.edits.set(sel, this.defaultEdit());
    return this.edits.get(sel)!;
  }

  /** Патч выделенного + живое применение + запись ЧЕРНОВИКА (localStorage). */
  patch(partial: Partial<ElementEdit>): void {
    if (!this.selectedEl || !this.selectedSelector) return;
    const e = this.ensureEdit();
    Object.assign(e, partial);
    // правка, вернувшаяся к идентичности и без типографики — выкидываем из Map
    if (isNoop(e)) {
      this.clearElementStyles(this.selectedEl);
      this.edits.delete(this.selectedSelector);
    } else {
      applyEdit(this.selectedEl, e);
    }
    persistDraft(this.edits); // только черновик; в tools/ — по кнопке 💾
  }

  // — массовые операции —

  /** Ре-применить все текущие правки к DOM (после загрузки/HMR). */
  reapplyAll(): void {
    for (const [selector, e] of this.edits) {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) applyEdit(el, e);
    }
  }

  /** ↺ Отмена: вернуть к СОХРАНЁННОМУ (tools/), удалив черновик. Файлы в tools/ НЕ трогаем. */
  revert(): void {
    for (const [selector] of this.edits) {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) this.clearElementStyles(el);
    }
    this.edits = new Map(this.savedSnapshot.map((e) => [e.selector, { ...e }]));
    clearDraft();
    this.clearSelection();
    this.reapplyAll();
  }

  private clearElementStyles(el: HTMLElement): void {
    el.style.transform = "";
    el.style.transformOrigin = "";
    el.style.fontFamily = "";
    el.style.fontSize = "";
    el.style.lineHeight = "";
    el.style.letterSpacing = "";
    el.style.wordSpacing = "";
  }

  // — 💾 сохранение в tools/layout-edits/ + очистка черновика —

  async save(): Promise<void> {
    this.saveState = "saving";
    this.saveError = "";
    try {
      const list = [...this.edits.values()];
      const res = await postEdits(list);
      if (res.ok) {
        this.savedSnapshot = list.map((e) => ({ ...e })); // зафиксировали как сохранённое
        clearDraft(); // черновик долой — правки теперь в tools/
        this.saveState = "ok";
      } else {
        this.saveState = "error";
        this.saveError = res.error ?? "unknown";
      }
    } catch (err) {
      this.saveState = "error";
      this.saveError = String(err);
    }
  }

  resetSaveState(): void {
    this.saveState = "idle";
    this.saveError = "";
  }
}

/** Применить правку инлайн-стилями. Неопределённые типографские поля сбрасываются (""). */
export function applyEdit(el: HTMLElement, e: ElementEdit): void {
  el.style.transform = `translate(${e.tx}px, ${e.ty}px) rotate(${e.rotate}deg) scale(${e.scale})`;
  el.style.transformOrigin = "center";
  el.style.fontFamily = e.fontFamily ?? "";
  el.style.fontSize = e.fontSizePx != null ? `${e.fontSizePx}px` : "";
  el.style.lineHeight = e.lineHeight != null ? String(e.lineHeight) : "";
  el.style.letterSpacing = e.letterSpacingPx != null ? `${e.letterSpacingPx}px` : "";
  el.style.wordSpacing = e.wordSpacingPx != null ? `${e.wordSpacingPx}px` : "";
  if (e.text != null && el.childElementCount === 0) el.textContent = e.text;
}

/** Правка ничего не меняет? (идентичный transform и нет типографики/текста). */
function isNoop(e: ElementEdit): boolean {
  return (
    e.tx === 0 &&
    e.ty === 0 &&
    e.scale === 1 &&
    e.rotate === 0 &&
    e.text == null &&
    e.fontFamily == null &&
    e.fontSizePx == null &&
    e.lineHeight == null &&
    e.letterSpacingPx == null &&
    e.wordSpacingPx == null
  );
}

/** Singleton (dev-only). */
export const editor = new EditorStore();
