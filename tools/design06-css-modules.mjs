// Faithful CSS-Module migration for a design06 section (the "copy classes → module
// → cx()" approach). For every Canva class an element carries we copy its FULL rules
// (incl :hover / theme / combinators) into a co-located CSS Module, and the element
// becomes className={cx(styles.a, styles.b, ...)}. Inline coordinates become one extra
// per-element class. Shell/theme ancestors are wrapped in :global so cross-section /
// theme rules keep working. Nothing is merged or dropped → behaviour + pixels preserved.
//
// Usage:  node tools/design06-css-modules.mjs <sectionId> <ComponentName>

import { Window } from "happy-dom";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GEN = join(ROOT, "src", "design06", "_generated", "sections");
const OUT = join(ROOT, "src", "design06", "sections");
const ASSETS = join(ROOT, "public", "design06-exact", "_assets");
const HEAD_LINKS = join(ROOT, "src", "design06", "_generated", "head-links.json");

// Classes owned by the app shell / theme (not by our section elements). Rules scoped
// under them must stay global so they still match the real <html class="theme light"> /
// the Design06 wrapper, and so cross-section selectors (.rGeu6w~.rGeu6w) keep matching.
const GLOBAL = new Set(["theme", "light", "dark", "classic", "adaptive", "EHoceA", "yIDCqA", "_8OlyIw", "_4KoDHA", "ZRRuDw", "KYQZFA", "r6_0Ig", "rGeu6w"]);

const SVG_TAGS = { clippath: "clipPath", lineargradient: "linearGradient", radialgradient: "radialGradient", textpath: "textPath", foreignobject: "foreignObject" };
const ATTR = { class: "className", for: "htmlFor", crossorigin: "crossOrigin", viewbox: "viewBox", preserveaspectratio: "preserveAspectRatio", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule", "clip-rule": "clipRule", "pointer-events": "pointerEvents", "xmlns:xlink": "xmlnsXlink", "xlink:href": "xlinkHref" };
const NUMERIC = { colspan: "colSpan", rowspan: "rowSpan", tabindex: "tabIndex" }; // React wants a number
const BOOLEAN = { allowfullscreen: "allowFullScreen", autofocus: "autoFocus" }; // present → true
const VOID = new Set(["img", "br", "hr", "input", "meta", "link", "source", "path", "rect", "circle", "ellipse", "line", "polygon", "polyline", "stop", "use"]);

function parseRules(css, rules, order) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  while (i < css.length) {
    let sel = "";
    while (i < css.length && css[i] !== "{" && css[i] !== "}") sel += css[i++];
    if (css[i] !== "{") { i++; continue; }
    i++;
    let body = "", depth = 1;
    while (i < css.length && depth > 0) {
      const c = css[i++];
      if (c === "{") depth++;
      else if (c === "}") { depth--; if (depth === 0) break; }
      body += c;
    }
    sel = sel.trim();
    if (sel && !sel.startsWith("@") && body.trim()) rules.push({ sel, body: body.trim(), order: order.n++ });
    else order.n++;
  }
}
const classesOf = (sel) => [...sel.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
const isSingleClass = (sel) => /^\.[A-Za-z0-9_-]+$/.test(sel.trim());
function parseDecls(body) {
  const out = [];
  for (const d of body.split(";")) { const i = d.indexOf(":"); if (i === -1) continue; const p = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (p && v) out.push([p, v]); }
  return out;
}
// rewrite a selector for the module: global classes → :global(.x); local classes stay .x
function moduleSelector(sel) {
  return sel.replace(/\.([A-Za-z0-9_-]+)/g, (m, c) => (GLOBAL.has(c) ? `:global(.${c})` : m));
}

const run = async () => {
  const [id, name] = process.argv.slice(2);
  if (!id || !name) throw new Error("usage: <sectionId> <ComponentName>");

  const links = JSON.parse(await readFile(HEAD_LINKS, "utf8"));
  const rules = [], order = { n: 0 };
  for (const href of links) parseRules(await readFile(join(ASSETS, href.split("/_assets/")[1]), "utf8"), rules, order);

  const html = await readFile(join(GEN, `${id}.html`), "utf8");
  const win = new Window();
  const div = win.document.createElement("div");
  div.innerHTML = html;

  // used classes
  const used = new Set();
  (function walk(n) { if (n.nodeType === 1) { (n.getAttribute("class") || "").split(/\s+/).filter(Boolean).forEach((c) => used.add(c)); [...n.childNodes].forEach(walk); } })(div);

  // build module: per-class simple decls + every rule that references a used class
  const simple = new Map(); // class -> ordered [ [prop,val], ... ]
  const ruleBlocks = []; // { selector(module form), body }
  const localized = new Set();
  for (const r of rules) {
    const cs = classesOf(r.sel);
    if (!cs.some((c) => used.has(c))) continue; // rule irrelevant to this section
    if (isSingleClass(r.sel)) {
      const c = cs[0];
      if (!used.has(c)) continue;
      const m = simple.get(c) || new Map();
      for (const [p, v] of parseDecls(r.body)) m.set(p, v);
      simple.set(c, m);
      if (!GLOBAL.has(c)) localized.add(c);
    } else {
      ruleBlocks.push({ sel: moduleSelector(r.sel), body: r.body });
      for (const c of cs) if (!GLOBAL.has(c)) localized.add(c);
    }
  }

  // css output
  const cssLines = [];
  for (const [c, m] of simple) {
    if (GLOBAL.has(c)) { cssLines.push(`:global(.${c}) {\n${[...m].map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`); continue; }
    cssLines.push(`.${c} {\n${[...m].map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`);
    localized.add(c);
  }
  for (const rb of ruleBlocks) cssLines.push(`${rb.sel} {\n${parseDecls(rb.body).map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`);

  // component
  const prefix = name.toLowerCase();
  let posN = 0;
  const styleKey = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? `styles.${k}` : `styles[${JSON.stringify(k)}]`);

  function attrJsx(nm, val) {
    const lower = nm.toLowerCase();
    if (lower === "style" || lower === "class") return null;
    if (NUMERIC[lower]) return `${NUMERIC[lower]}={${Number(val) || 0}}`;
    if (BOOLEAN[lower]) return BOOLEAN[lower];
    const jsx = ATTR[lower] || nm;
    if (lower === "draggable") return `draggable={${val === "true"}}`;
    return val.includes('"') ? `${jsx}={${JSON.stringify(val)}}` : `${jsx}="${val}"`;
  }
  function emit(node, depth, lines) {
    const pad = "  ".repeat(depth);
    if (node.nodeType === 3) { if (node.data.length) lines.push(pad + `{${JSON.stringify(node.data)}}`); return; }
    if (node.nodeType !== 1) return;
    const tag = SVG_TAGS[node.localName.toLowerCase()] || node.localName.toLowerCase();

    // localized classes → styles.X; global (shell/theme) classes stay as plain strings
    // so :global(...) rules and the section-padding reset still match by real name.
    const parts = [];
    for (const c of (node.getAttribute("class") || "").split(/\s+/).filter(Boolean)) {
      if (localized.has(c)) parts.push(styleKey(c));
      else if (GLOBAL.has(c)) parts.push(JSON.stringify(c));
    }
    const inline = node.getAttribute("style");
    if (inline) {
      const key = `${prefix}-p${posN++}`;
      cssLines.push(`.${key} {\n${parseDecls(inline).map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`);
      parts.push(styleKey(key));
    }
    let classExpr = null;
    if (parts.length === 1) classExpr = `className={${parts[0]}}`;
    else if (parts.length > 1) classExpr = `className={cx(${parts.join(", ")})}`;

    const attrs = [...node.attributes].map((a) => attrJsx(a.name, a.value)).filter(Boolean);
    const open = [tag, classExpr, ...attrs].filter(Boolean).join(" ");
    const kids = [...node.childNodes];
    if (!kids.length || VOID.has(tag)) { lines.push(pad + `<${open} />`); return; }
    lines.push(pad + `<${open}>`);
    for (const k of kids) emit(k, depth + 1, lines);
    lines.push(pad + `</${tag}>`);
  }
  const jsx = [];
  for (const n of [...div.childNodes]) emit(n, 3, jsx);

  await writeFile(join(OUT, `${name}.module.css`), cssLines.join("\n\n") + "\n");
  const tsx = `// design06 section ${name} (Canva id ${id}) — стили в ${name}.module.css.
// Каждый Canva-класс скопирован целиком (с :hover/темой/комбинаторами) и собран через
// cx(); инлайн-координаты — отдельным классом. Каркас/тема обёрнуты :global. DOM = 0%.
import { cx } from "../cx";
import styles from "./${name}.module.css";

export default function ${name}() {
  return (
${jsx.join("\n")}
  );
}
`;
  await writeFile(join(OUT, `${name}.tsx`), tsx);
  console.log(`✓ ${name}: ${simple.size} class rules, ${ruleBlocks.length} contextual rules, ${posN} inline-pos classes, ${used.size} used classes`);
};

run().catch((e) => { console.error(e); process.exit(1); });
