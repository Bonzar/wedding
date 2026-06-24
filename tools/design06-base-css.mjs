// Extracts the global pieces the section CSS modules rely on from the Canva
// stylesheets — :root custom-property definitions and @keyframes — into a single
// plain (non-module) global stylesheet src/design06/canva-base.css. This lets us
// drop the bulky Canva <link>s from Design06 while keeping var()/animation resolving.
// (design-fonts.css with @font-face stays separately.)
//
// Usage:  node tools/design06-base-css.mjs

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(ROOT, "public", "design06-exact", "_assets");
const HEAD_LINKS = join(ROOT, "src", "design06", "_generated", "head-links.json");
const OUT = join(ROOT, "src", "design06", "canva-base.css");

// pull balanced `prefix … { … }` blocks (handles nested braces in @keyframes)
function extractBlocks(css, test) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    let sel = "";
    while (i < css.length && css[i] !== "{" && css[i] !== "}") sel += css[i++];
    if (css[i] !== "{") { i++; continue; }
    const start = i;
    let depth = 0;
    do { if (css[i] === "{") depth++; else if (css[i] === "}") depth--; i++; } while (i < css.length && depth > 0);
    const body = css.slice(start, i); // includes the outer { ... }
    if (test(sel.trim())) out.push(`${sel.trim()} ${body}`);
  }
  return out;
}

const run = async () => {
  const links = JSON.parse(await readFile(HEAD_LINKS, "utf8"));
  const mod = await readFile(join(ROOT, "src", "design06", "canva.module.css"), "utf8");

  // все custom-props, используемые модулем (incl внутри keyframes добавим ниже)
  const usedVars = new Set([...mod.matchAll(/var\(--([A-Za-z0-9_-]+)/g)].map((m) => m[1]));

  // первый проход — собрать keyframes (и вытащить var() из их тел в usedVars)
  const keyframes = new Set();
  const cssAll = [];
  for (const href of links) {
    if (href.includes("design-fonts")) continue;
    const css = (await readFile(join(ASSETS, href.split("/_assets/")[1]), "utf8")).replace(/\/\*[\s\S]*?\*\//g, "");
    cssAll.push(css);
    for (const b of extractBlocks(css, (s) => s.startsWith("@keyframes") || s.startsWith("@-webkit-keyframes"))) {
      keyframes.add(b);
      for (const m of b.matchAll(/var\(--([A-Za-z0-9_-]+)/g)) usedVars.add(m[1]);
    }
  }

  // правила, ОПРЕДЕЛЯЮЩИЕ любую использованную переменную (на любом селекторе: .light/.dark/.hhtymQ и т.п.)
  const defRules = new Map(); // sel -> block (dedupe)
  for (const css of cssAll) {
    for (const r of extractBlocks(css, () => true)) {
      const m = r.match(/^([\s\S]*?)\s*\{/);
      const sel = m ? m[1].trim() : "";
      if (sel.startsWith("@")) continue;
      if ([...usedVars].some((v) => new RegExp(`--${v}:`).test(r))) defRules.set(sel, r);
    }
  }

  const body =
    `/* design06 — глобальная база Canva: правила, определяющие custom-props (.light/.dark/\n` +
    `   .hhtymQ…), и @keyframes, на которые опираются классы в canva.module.css. Plain global\n` +
    `   CSS (имена НЕ хешируются). Генерится tools/design06-base-css.mjs. Шрифты — design-fonts.css. */\n\n` +
    [...defRules.values()].join("\n\n") + "\n\n" + [...keyframes].join("\n\n") + "\n";
  await writeFile(OUT, body);
  console.log(`✓ canva-base.css: ${defRules.size} var-defining rules, ${keyframes.size} @keyframes`);
};

run().catch((e) => { console.error(e); process.exit(1); });
