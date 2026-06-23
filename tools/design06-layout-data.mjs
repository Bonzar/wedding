// Approach A prototype: move each element's EDITABLE per-element style out of the
// CSS module into a structured data record (the single source of truth an editor
// reads/writes), keyed by a stable data-eid. Shared Canva utility classes stay in
// the module (unchanged behaviour). The component applies the record as inline style.
// Render = base structure + utilities (0%) + data-driven editable layer.
//
// Output: src/design06/sections/<Name>.tsx (uses data-eid + style={layout[eid]})
//         src/design06/sections/<Name>.layout.ts (the editable records)
//         src/design06/sections/<Name>.module.css (utilities only — no per-element pos classes)
//
// Usage:  node tools/design06-layout-data.mjs <sectionId> <ComponentName>

import { Window } from "happy-dom";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GEN = join(ROOT, "src", "design06", "_generated", "sections");
const OUT = join(ROOT, "src", "design06", "sections");
const ASSETS = join(ROOT, "public", "design06-exact", "_assets");
const HEAD_LINKS = join(ROOT, "src", "design06", "_generated", "head-links.json");

const GLOBAL = new Set(["theme", "light", "dark", "classic", "adaptive", "EHoceA", "yIDCqA", "_8OlyIw", "_4KoDHA", "ZRRuDw", "KYQZFA", "r6_0Ig", "rGeu6w"]);
const SVG_TAGS = { clippath: "clipPath", lineargradient: "linearGradient", radialgradient: "radialGradient", textpath: "textPath", foreignobject: "foreignObject" };
const ATTR = { class: "className", for: "htmlFor", crossorigin: "crossOrigin", viewbox: "viewBox", preserveaspectratio: "preserveAspectRatio", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule", "clip-rule": "clipRule", "pointer-events": "pointerEvents", "xmlns:xlink": "xmlnsXlink", "xlink:href": "xlinkHref" };
const NUMERIC = { colspan: "colSpan", rowspan: "rowSpan", tabindex: "tabIndex" };
const BOOLEAN = { allowfullscreen: "allowFullScreen", autofocus: "autoFocus" };
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
    while (i < css.length && depth > 0) { const c = css[i++]; if (c === "{") depth++; else if (c === "}") { depth--; if (depth === 0) break; } body += c; }
    sel = sel.trim();
    if (sel && !sel.startsWith("@") && body.trim()) rules.push({ sel, body: body.trim(), order: order.n++ }); else order.n++;
  }
}
const classesOf = (sel) => [...sel.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
const isSingleClass = (sel) => /^\.[A-Za-z0-9_-]+$/.test(sel.trim());
const parseDecls = (body) => { const o = []; for (const d of body.split(";")) { const i = d.indexOf(":"); if (i === -1) continue; const p = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (p && v) o.push([p, v]); } return o; };
const moduleSelector = (sel) => sel.replace(/\.([A-Za-z0-9_-]+)/g, (m, c) => (GLOBAL.has(c) ? `:global(.${c})` : m));
const camel = (p) => (p.startsWith("--") ? p : p.replace(/^-(ms|webkit|moz|o)-/, (m) => m.slice(1)).replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
const pxNum = (v) => (/^-?[\d.eE+-]+px$/.test(v.trim()) ? parseFloat(v) : null);

// transform string -> {x,y,rot,scale} (clean translate/rotate/scale) или {raw:true} (сложный)
function decomposeTransform(t) {
  const fns = [...t.matchAll(/([a-zA-Z]+)\(([^)]*)\)/g)].map((m) => [m[1], m[2].trim()]);
  const out = {};
  let i = 0;
  if (fns[i] && fns[i][0] === "translate") {
    const a = fns[i][1].split(",").map((s) => s.trim());
    if (!a.every((x) => /^-?[\d.eE+-]+px$/.test(x))) return { raw: true };
    out.x = parseFloat(a[0]);
    out.y = a[1] != null ? parseFloat(a[1]) : 0;
    i++;
  }
  for (; i < fns.length; i++) {
    const [fn, arg] = fns[i];
    if (fn === "rotate" && out.rot === undefined && /^-?[\d.eE+-]+deg$/.test(arg)) out.rot = parseFloat(arg);
    else if (fn === "scale" && out.scale === undefined) {
      const p = arg.split(",").map((s) => parseFloat(s.trim()));
      if (p.length === 1 || p[0] === p[1]) out.scale = p[0];
      else return { raw: true };
    } else return { raw: true };
  }
  return Object.keys(out).length ? out : { raw: true };
}

const NUM_FIELDS = new Set(["x", "y", "w", "h", "rot", "scale", "fontSize"]);
// inline style string -> El record literal (A2: разложенная геометрия+текст, прочее в raw)
function recordLiteral(inline) {
  const rec = {};
  const raw = [];
  for (const [p, v] of parseDecls(inline)) {
    if (p === "transform") { const d = decomposeTransform(v); if (d.raw) raw.push(["transform", v]); else Object.assign(rec, d); }
    else if (p === "width" && pxNum(v) != null) rec.w = pxNum(v);
    else if (p === "height" && pxNum(v) != null) rec.h = pxNum(v);
    else if (p === "font-family") rec.font = v;
    else if (p === "--H97cbQ" && pxNum(v) != null) rec.fontSize = pxNum(v);
    else if (p === "letter-spacing") rec.letterSpacing = v;
    else if (p === "line-height") rec.lineHeight = v;
    else if (p === "text-align") rec.textAlign = v;
    else if (p === "text-transform") rec.textTransform = v;
    else if (p === "color") rec.color = v;
    else raw.push([camel(p), v]);
  }
  const parts = Object.entries(rec).map(([k, val]) => `${k}: ${NUM_FIELDS.has(k) ? val : JSON.stringify(val)}`);
  if (raw.length) parts.push(`raw: { ${raw.map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ")} }`);
  return `{ ${parts.join(", ")} }`;
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

  const used = new Set();
  (function walk(n) { if (n.nodeType === 1) { (n.getAttribute("class") || "").split(/\s+/).filter(Boolean).forEach((c) => used.add(c)); [...n.childNodes].forEach(walk); } })(div);

  // module.css: utility classes only (same as css-modules approach, минус per-element pos)
  const simple = new Map(), ruleBlocks = [], localized = new Set();
  for (const r of rules) {
    const cs = classesOf(r.sel);
    if (!cs.some((c) => used.has(c))) continue;
    if (isSingleClass(r.sel)) { const c = cs[0]; if (!used.has(c)) continue; const m = simple.get(c) || new Map(); for (const [p, v] of parseDecls(r.body)) m.set(p, v); simple.set(c, m); if (!GLOBAL.has(c)) localized.add(c); }
    else { ruleBlocks.push({ sel: moduleSelector(r.sel), body: r.body }); for (const c of cs) if (!GLOBAL.has(c)) localized.add(c); }
  }
  const cssLines = [];
  for (const [c, m] of simple) {
    const block = [...m].map(([p, v]) => `  ${p}: ${v};`).join("\n");
    cssLines.push(GLOBAL.has(c) ? `:global(.${c}) {\n${block}\n}` : (localized.add(c), `.${c} {\n${block}\n}`));
  }
  for (const rb of ruleBlocks) cssLines.push(`${rb.sel} {\n${parseDecls(rb.body).map(([p, v]) => `  ${p}: ${v};`).join("\n")}\n}`);

  // component + layout records
  const prefix = name.toLowerCase();
  let eidN = 0;
  const records = []; // [eid, styleObjectLiteral]
  const styleKey = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? `styles.${k}` : `styles[${JSON.stringify(k)}]`);
  const attrJsx = (nm, val) => {
    const lower = nm.toLowerCase();
    if (lower === "style" || lower === "class") return null;
    if (NUMERIC[lower]) return `${NUMERIC[lower]}={${Number(val) || 0}}`;
    if (BOOLEAN[lower]) return BOOLEAN[lower];
    const jsx = ATTR[lower] || nm;
    if (lower === "draggable") return `draggable={${val === "true"}}`;
    return val.includes('"') ? `${jsx}={${JSON.stringify(val)}}` : `${jsx}="${val}"`;
  };

  function emit(node, depth, lines) {
    const pad = "  ".repeat(depth);
    if (node.nodeType === 3) { if (node.data.length) lines.push(pad + `{${JSON.stringify(node.data)}}`); return; }
    if (node.nodeType !== 1) return;
    const tag = SVG_TAGS[node.localName.toLowerCase()] || node.localName.toLowerCase();

    const parts = [];
    for (const c of (node.getAttribute("class") || "").split(/\s+/).filter(Boolean)) {
      if (localized.has(c)) parts.push(styleKey(c));
      else if (GLOBAL.has(c)) parts.push(JSON.stringify(c));
    }
    const extra = [];
    const inline = node.getAttribute("style");
    if (inline) {
      const eid = `${prefix}/${eidN++}`;
      records.push([eid, recordLiteral(inline)]);
      extra.push(`data-eid="${eid}"`, `style={elStyle(layout[${JSON.stringify(eid)}])}`);
    }
    let classExpr = null;
    if (parts.length === 1) classExpr = `className={${parts[0]}}`;
    else if (parts.length > 1) classExpr = `className={cx(${parts.join(", ")})}`;

    const attrs = [...node.attributes].map((a) => attrJsx(a.name, a.value)).filter(Boolean);
    const open = [tag, classExpr, ...attrs, ...extra].filter(Boolean).join(" ");
    const kids = [...node.childNodes];
    if (!kids.length || VOID.has(tag)) { lines.push(pad + `<${open} />`); return; }
    lines.push(pad + `<${open}>`);
    for (const k of kids) emit(k, depth + 1, lines);
    lines.push(pad + `</${tag}>`);
  }
  const jsx = [];
  for (const n of [...div.childNodes]) emit(n, 3, jsx);

  await writeFile(join(OUT, `${name}.module.css`), cssLines.join("\n\n") + "\n");
  await writeFile(
    join(OUT, `${name}.layout.ts`),
    `// design06 ${name} — редактируемый слой (Approach A2): на элемент одна запись, ключ = data-eid.\n` +
      `// Единственный источник правды для позиции/размера/поворота/типографики; редактор патчит поля и пишет сюда.\n` +
      `import type { El } from "../layout";\n\nexport const layout: Record<string, El> = {\n` +
      records.map(([eid, obj]) => `  ${JSON.stringify(eid)}: ${obj},`).join("\n") +
      `\n};\n`,
  );
  const tsx = `// design06 section ${name} (Canva id ${id}). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в ${name}.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "./${name}.module.css";
import { layout } from "./${name}.layout";

export default function ${name}() {
  return (
${jsx.join("\n")}
  );
}
`;
  await writeFile(join(OUT, `${name}.tsx`), tsx);
  console.log(`✓ ${name}: ${records.length} editable records, ${simple.size} utility classes`);
};

run().catch((e) => { console.error(e); process.exit(1); });
