// Consolidate the 9 per-section CSS modules into ONE shared module
// (src/design06/canva.module.css) so every section/template references the same
// utility classes — uniform for copy/create across sections, deduped, single source.
// Re-derives the union of used classes from the Canva CSS (source order preserved),
// rewrites section imports to the shared module, and deletes the per-section modules.
// Pure relocation of identical rules → 0%.
//
// Usage:  node tools/design06-shared-css.mjs

import { readFile, writeFile, readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GEN = join(ROOT, "src", "design06", "_generated", "sections");
const SECT = join(ROOT, "src", "design06", "sections");
const ASSETS = join(ROOT, "public", "design06-exact", "_assets");
const HEAD_LINKS = join(ROOT, "src", "design06", "_generated", "head-links.json");
const SHARED = join(ROOT, "src", "design06", "canva.module.css");

const GLOBAL = new Set(["theme", "light", "dark", "classic", "adaptive", "EHoceA", "yIDCqA", "_8OlyIw", "_4KoDHA", "ZRRuDw", "KYQZFA", "r6_0Ig", "rGeu6w"]);

function parseRules(css, rules, order) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  while (i < css.length) {
    let sel = "";
    while (i < css.length && css[i] !== "{" && css[i] !== "}") sel += css[i++];
    if (css[i] !== "{") { i++; continue; }
    i++;
    let body = "", depth = 1;
    while (i < css.length && depth > 0) { const c = css[i++]; if (c === "{") depth++; else if (c === "}") { depth--; if (depth === 0) break; } body += c; }
    sel = sel.trim();
    if (sel && !sel.startsWith("@") && body.trim()) rules.push({ sel, body: body.trim(), order: order.n++ }); else order.n++;
  }
}
const classesOf = (sel) => [...sel.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
const isSingleClass = (sel) => /^\.[A-Za-z0-9_-]+$/.test(sel.trim());
const parseDecls = (b) => { const o = []; for (const d of b.split(";")) { const i = d.indexOf(":"); if (i === -1) continue; const p = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (p && v) o.push([p, v]); } return o; };
const moduleSelector = (sel) => sel.replace(/\.([A-Za-z0-9_-]+)/g, (m, c) => (GLOBAL.has(c) ? `:global(.${c})` : m));

const run = async () => {
  // union of classes used across ALL sections
  const used = new Set();
  for (const f of (await readdir(GEN)).filter((f) => f.endsWith(".html"))) {
    const html = await readFile(join(GEN, f), "utf8");
    for (const m of html.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).filter(Boolean).forEach((c) => used.add(c));
  }

  const links = JSON.parse(await readFile(HEAD_LINKS, "utf8"));
  const rules = [], order = { n: 0 };
  for (const href of links) parseRules(await readFile(join(ASSETS, href.split("/_assets/")[1]), "utf8"), rules, order);

  const simple = new Map(), ruleBlocks = [];
  for (const r of rules) {
    const cs = classesOf(r.sel);
    if (!cs.some((c) => used.has(c))) continue;
    if (isSingleClass(r.sel)) { const c = cs[0]; if (!used.has(c)) continue; const m = simple.get(c) || new Map(); for (const [p, v] of parseDecls(r.body)) m.set(p, v); simple.set(c, m); }
    else ruleBlocks.push({ sel: moduleSelector(r.sel), body: r.body });
  }

  const cssLines = [];
  for (const [c, m] of simple) {
    const block = [...m].map(([p, v]) => `  ${p}: ${v};`).join("\n");
    cssLines.push(GLOBAL.has(c) ? `:global(.${c}) {\n${block}\n}` : `.${c} {\n${block}\n}`);
  }
  for (const rb of ruleBlocks) cssLines.push(`${rb.sel} {\n${parseDecls(rb.body).map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`);

  await writeFile(SHARED, `/* design06 — общий модуль утилит Canva (union по всем секциям). Единый источник\n   для всех секций и шаблонов редактора. Генерится tools/design06-shared-css.mjs. */\n` + cssLines.join("\n\n") + "\n");

  // переключить импорты секций на общий модуль и удалить per-section модули
  let switched = 0;
  for (const f of (await readdir(SECT)).filter((f) => f.endsWith(".tsx"))) {
    const p = join(SECT, f);
    let src = await readFile(p, "utf8");
    const name = f.replace(/\.tsx$/, "");
    if (src.includes(`./${name}.module.css`)) {
      src = src.replace(`import styles from "./${name}.module.css";`, `import styles from "../canva.module.css";`);
      await writeFile(p, src);
      switched++;
    }
  }
  for (const f of (await readdir(SECT)).filter((f) => f.endsWith(".module.css"))) await rm(join(SECT, f));

  console.log(`✓ canva.module.css: ${simple.size} class rules + ${ruleBlocks.length} contextual; imports switched: ${switched}; per-section modules removed`);
};

run().catch((e) => { console.error(e); process.exit(1); });
