/**
 * Идентификация выделенного DOM-элемента для live-редактора макета:
 *  - computeSelector — точный nth-of-type путь (надёжно ре-применяется через querySelector);
 *  - computeLabel    — читаемый лейбл (секция + тег + базовые имена CSS-модульных классов),
 *                      чтобы агент грепнул styles.<класс> в *.module.css секции.
 */

/** Уникальный CSS-путь от <main> (или ближайшего id) до элемента. */
export function computeSelector(el: HTMLElement): string {
  const parts: string[] = [];
  let node: HTMLElement | null = el;
  while (node && node !== document.body && node !== document.documentElement) {
    const tag = node.tagName.toLowerCase();
    if (node.id) {
      parts.unshift(`#${cssEscape(node.id)}`);
      break; // id уникален — выше можно не подниматься
    }
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) {
      parts.unshift(tag);
      break;
    }
    const sameTag = Array.from(parent.children).filter((c) => c.tagName === node!.tagName);
    if (sameTag.length > 1) {
      parts.unshift(`${tag}:nth-of-type(${sameTag.indexOf(node) + 1})`);
    } else {
      parts.unshift(tag);
    }
    node = parent;
  }
  return parts.join(" > ");
}

/** Читаемый лейбл: «hero / h1.names». */
export function computeLabel(el: HTMLElement): string {
  const section = el.closest("section");
  const sectionName = section ? section.id || sectionIndexName(section) : "—";
  const locals = moduleLocals(el);
  const cls = locals.length ? `.${locals.join(".")}` : "";
  return `${sectionName} / ${el.tagName.toLowerCase()}${cls}`;
}

/** Базовые («человеческие») имена классов: из dev-имени CSS-модуля достаём local. */
export function moduleLocals(el: HTMLElement): string[] {
  return Array.from(el.classList).map(cleanLocal).filter(Boolean);
}

/**
 * Очистка dev-имени CSS-модуля до читаемого local.
 * Vite/esbuild в dev генерит вида `_local_HASH` или `File_local__HASH`.
 * Глобальные классы (eyebrow, script, wrap) оставляем как есть.
 */
function cleanLocal(cls: string): string {
  // "_local_ab12c" | "_local_ab12c3" → local
  const lead = /^_([A-Za-z][\w-]*?)_[A-Za-z0-9]{4,8}$/.exec(cls);
  if (lead) return lead[1];
  // "File_local__ab12c" → local
  const file = /^[A-Za-z][\w-]*_([A-Za-z][\w-]*?)__[A-Za-z0-9]{4,8}$/.exec(cls);
  if (file) return file[1];
  return cls;
}

/** Имя секции по её позиции среди main.sheet > section (когда нет id). */
function sectionIndexName(section: Element): string {
  const sections = Array.from(document.querySelectorAll("main.sheet > section"));
  const i = sections.indexOf(section);
  return i >= 0 ? `section#${i + 1}` : "section";
}

/** CSS.escape с фолбэком (старые окружения/тесты). */
function cssEscape(s: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(s);
  return s.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
}

/** Элемент несёт текст? (для показа панели типографики). */
export function hasText(el: HTMLElement): boolean {
  return (el.textContent ?? "").trim().length > 0;
}

/** Текст-лист: только текст, без дочерних элементов (безопасно менять textContent). */
export function isTextLeaf(el: HTMLElement): boolean {
  return el.childElementCount === 0 && hasText(el);
}
