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

/**
 * Позиция элемента в исходниках по React-fiber `_debugSource` (dev-рантайм Vite).
 * Возвращает `src/.../File.tsx:line` самого элемента и, если он отрендерен внутри
 * переиспользуемого компонента (напр. <Section>), ближайшего предка из файла секции —
 * чтобы агент прыгал ровно в нужную JSX-строку, а не гадал по позиционному селектору.
 */
interface Fiber {
  type?: unknown;
  memoizedProps?: Record<string, unknown> | null;
  _debugSource?: { fileName?: string; lineNumber?: number };
  _debugOwner?: Fiber | null;
  return?: Fiber | null;
}

export interface SourceInfo {
  /** позиция самого элемента в коде ("src/.../File.tsx:line") */
  source?: string;
  /** ближайший предок из файла секции (если элемент внутри общего компонента) */
  sourceSection?: string;
  /** компонент-владелец + опознавательный проп + место вызова, напр.
   *  `Engraving(name="e6dcd…") @ src/sections/Hero/Hero.tsx:37`. Спасает безымянные svg/path,
   *  у которых нет ни класса, ни своего fiber (Engraving вставляет SVG через innerHTML). */
  owner?: string;
}

export function computeSource(el: HTMLElement): SourceInfo {
  try {
    // у потомков «сырого» SVG fiber'а нет — поднимаемся по DOM до ближайшего узла с fiber.
    let host: HTMLElement | null = el;
    let fiber = reactFiber(host);
    let climbed = false;
    while (!fiber && host?.parentElement) {
      host = host.parentElement;
      fiber = reactFiber(host);
      climbed = true;
    }
    if (!fiber) return {};

    const chain: { file: string; line: number }[] = [];
    let node: Fiber | null = fiber;
    let hops = 0;
    while (node && hops < 40) {
      const s = node._debugSource;
      if (s?.fileName && s.lineNumber != null) chain.push({ file: relSrc(s.fileName), line: s.lineNumber });
      node = node.return ?? null;
      hops++;
    }
    const own = chain[0];
    const section = chain.find((c) => c.file.includes("/sections/"));
    return {
      source: own ? `${own.file}:${own.line}${climbed ? " (внутри SVG)" : ""}` : undefined,
      sourceSection:
        section && own && (section.file !== own.file || section.line !== own.line)
          ? `${section.file}:${section.line}`
          : undefined,
      owner: describeOwner(fiber),
    };
  } catch {
    return {};
  }
}

/** Ближайший компонент-владелец (через `_debugOwner`): имя + опознавательный проп + место вызова. */
function describeOwner(fiber: Fiber | null): string | undefined {
  let owner = fiber?._debugOwner ?? null;
  let hops = 0;
  while (owner && hops < 12) {
    const t = owner.type as { displayName?: string; name?: string } | undefined;
    const name = typeof owner.type === "function" ? t?.displayName || t?.name : undefined;
    if (name) {
      const src = owner._debugSource
        ? ` @ ${relSrc(owner._debugSource.fileName ?? "")}:${owner._debugSource.lineNumber}`
        : "";
      return `${name}${identifyingProp(owner.memoizedProps)}${src}`;
    }
    owner = owner._debugOwner ?? null;
    hops++;
  }
  return undefined;
}

/** Короткий опознавательный проп компонента (name/href/id/текст). */
function identifyingProp(props: Record<string, unknown> | null | undefined): string {
  if (!props) return "";
  if (typeof props.name === "string") return `(name="${props.name}")`;
  if (typeof props.href === "string") return `(href="${props.href}")`;
  if (typeof props.id === "string") return `(#${props.id})`;
  if (typeof props.children === "string") return `("${props.children.slice(0, 24)}")`;
  return "";
}

/** React-fiber DOM-узла (ключ `__reactFiber$…` / старый `__reactInternalInstance$…`). */
function reactFiber(el: HTMLElement): Fiber | null {
  const key = Object.keys(el).find(
    (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"),
  );
  return key ? ((el as unknown as Record<string, Fiber>)[key] ?? null) : null;
}

/** Абсолютный путь fiber → путь от корня репо («src/…»). */
function relSrc(abs: string): string {
  const i = abs.lastIndexOf("/src/");
  return i >= 0 ? abs.slice(i + 1) : abs;
}
