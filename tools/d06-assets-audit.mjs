// Audit public/design06-exact/_assets: classify every file as
//   · referenced — appears as an <img src> / url in d06 .tsx/.ts source
//   · font-served — woff2 referenced by the ONE linked стайлшит (design-fonts.css)
//   · font-fallback — woff/otf in design-fonts.css (legacy <src> entries; never fetched by modern browsers)
//   · orphan — nothing in the live render references it (dead Canva export leftovers)
// Read-only: prints a size breakdown so deletions/recompression are precise.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const ASSETS = join(ROOT, "public/design06-exact/_assets");
const SRC = join(ROOT, "src/design06");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else out.push({ path: p, size: s.size });
  }
  return out;
}

// 1. all source text (tsx/ts) — collect every _assets reference
const srcFiles = walk(SRC).filter((f) => /\.(tsx?|json)$/.test(f.path));
const srcText = srcFiles.map((f) => readFileSync(f.path, "utf8")).join("\n");
const referenced = new Set();
for (const m of srcText.matchAll(/_assets\/([A-Za-z0-9_./-]+\.[A-Za-z0-9]+)/g)) referenced.add(m[1]);

// 2. the only linked stylesheet (Design06 keeps just design-fonts.css)
const fontsCss = readFileSync(join(ASSETS, "design-fonts.css"), "utf8");
const woff2Served = new Set();
const fontFallback = new Set();
for (const m of fontsCss.matchAll(/url\((fonts\/[^)]+)\)/g)) {
  const rel = m[1];
  if (rel.endsWith(".woff2")) woff2Served.add(rel);
  else fontFallback.add(rel); // .woff / .otf
}

const cats = { referenced: [], "font-served": [], "font-fallback": [], orphan: [] };
for (const f of walk(ASSETS)) {
  const rel = relative(ASSETS, f.path);
  if (rel.endsWith(".DS_Store")) { cats.orphan.push({ rel, size: f.size }); continue; }
  if (referenced.has(rel)) cats.referenced.push({ rel, size: f.size });
  else if (woff2Served.has(rel)) cats["font-served"].push({ rel, size: f.size });
  else if (fontFallback.has(rel)) cats["font-fallback"].push({ rel, size: f.size });
  else cats.orphan.push({ rel, size: f.size });
}

const mb = (b) => (b / 1048576).toFixed(2) + " MB";
for (const [k, arr] of Object.entries(cats)) {
  const total = arr.reduce((a, b) => a + b.size, 0);
  console.log(`\n## ${k}: ${arr.length} files, ${mb(total)}`);
  const byExt = {};
  for (const f of arr) { const e = extname(f.rel) || "(none)"; byExt[e] = (byExt[e] || 0) + f.size; }
  for (const [e, s] of Object.entries(byExt).sort((a, b) => b[1] - a[1])) console.log(`   ${e.padEnd(8)} ${mb(s)}`);
}
// orphan detail (so we can eyeball before deleting)
console.log("\n## orphan files:");
for (const f of cats.orphan.sort((a, b) => b.size - a.size)) console.log(`   ${mb(f.size).padStart(9)}  ${f.rel}`);
