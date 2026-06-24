/**
 * Prepends Vite's base URL to an absolute asset path.
 * Works both in dev (base = "/") and on GitHub Pages (base = "/wedding/").
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL; // always ends with "/"
  const clean = path.replace(/^\//, ""); // strip leading slash
  return `${base}${clean}`;
}
