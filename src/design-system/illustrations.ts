/**
 * Реестр гравюр-иллюстраций. Все SVG из assets/illustrations подхватываются
 * автоматически (?raw) и инлайнятся как строки — чтобы сохранить currentColor
 * (перекрашивание под --ink) и не плодить <img>. Добавил svg в папку — он сразу
 * доступен в <Engraving name="…">.
 */
const modules = import.meta.glob("../../assets/illustrations/**/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function basename(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.svg$/, "");
}

// Срезаем XML-преамбулу/DOCTYPE до первого <svg, оставляя чистый <svg>…</svg>.
function clean(raw: string): string {
  const i = raw.indexOf("<svg");
  return i >= 0 ? raw.slice(i) : raw;
}

export const ILLUSTRATIONS: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, raw]) => [basename(path), clean(raw)]),
);

export type IllustrationName = keyof typeof ILLUSTRATIONS & string;

export const ILLUSTRATION_NAMES: string[] = Object.keys(ILLUSTRATIONS).sort();

export function getSvg(name: string): string {
  const svg = ILLUSTRATIONS[name];
  if (!svg && import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[Engraving] нет иллюстрации "${name}". Есть: ${ILLUSTRATION_NAMES.join(", ")}`);
  }
  return svg ?? "";
}
