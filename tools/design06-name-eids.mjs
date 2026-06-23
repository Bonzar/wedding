// Renames remaining NUMERIC data-eids (e.g. "details/4") to role-based semantic ones
// (e.g. "details/fill", "calendar/cell-15"), consistently across <Section>.tsx and
// <Section>.layout.ts. Role derived from the element's primary Canva utility class.
// Already-semantic eids (agent-named) are left untouched. Pure key rename → 0%.
//
// Usage:  node tools/design06-name-eids.mjs <ComponentName>

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src", "design06", "sections");

// Canva utility class -> человекочитаемая роль элемента
const ROLE = {
  DF_utQ: "block", _682gpw: "block", _0xkaeQ: "block",
  onhyOQ: "frame", twbtjQ: "stack", GDnEHQ: "canvas", o2Yl2g: "scaler", _mXnjA: "content",
  _6t4CHA: "backdrop", a26Xuw: "media", fbzKiw: "fill", PcHy7w: "imglayer",
  uk_25A: "imgbox", Ty61NA: "imgbox", Izwocg: "imgwrap", Zp7NQw: "framewrap",
  aF9o6Q: "text", _0yZ6Qg: "text", E8yZTA: "textbox", _2UyCZQ: "textrun",
  _28USrA: "para", a_GcMg: "span",
  hWv4NA: "mask", bFnJ2A: "clip", _4c2rDg: "cliptf", qhHTGg: "clipimg", Pr6LEA: "clipover",
  QhExXw: "overlay", V7MmMA: "line", Fe_H_Q: "linesvg", nrDMmw: "lineoverlay",
  hbcXuA: "tablewrap", aXBSSA: "tablesvg", csGvXg: "table", _5RL20Q: "cell", xam_ew: "cellpad", iRGCPA: "cellalign",
  _7KaXww: "defs", rGeu6w: "sectionbox", m1aeoQ: "scalewrap", GxUsfw: "cliptf", _DyBwg: "table",
};

const firstClass = (line) => {
  const m = line.match(/className=\{(?:cx\()?styles\.([A-Za-z0-9_]+)/) || line.match(/className=\{"([A-Za-z0-9_]+)"/);
  return m ? m[1] : null;
};

const run = async () => {
  const [name] = process.argv.slice(2);
  if (!name) throw new Error("usage: <ComponentName>");
  const prefix = name.toLowerCase();
  const tsxPath = join(OUT, `${name}.tsx`);
  const layoutPath = join(OUT, `${name}.layout.ts`);
  let tsx = await readFile(tsxPath, "utf8");
  let layout = await readFile(layoutPath, "utf8");

  // существующие НЕчисловые eid (заняты, чтобы не словить коллизию)
  const taken = new Set([...tsx.matchAll(/data-eid="([^"]+)"/g)].map((m) => m[1]).filter((e) => !/\/\d+$/.test(e)));

  // собрать ВСЕ числовые eid (и литеральные data-eid="...", и переданные пропами
  // вида boxEid="..."/eid="..." в параметризованные под-компоненты) + роль каждого.
  const attrRe = new RegExp(`([\\w-]+)="(${prefix}/\\d+)"`, "g");
  const numeric = [];
  const seen = new Set();
  for (const line of tsx.split("\n")) {
    for (const m of line.matchAll(attrRe)) {
      const attr = m[1], eid = m[2];
      if (seen.has(eid)) continue;
      seen.add(eid);
      let role;
      if (attr === "data-eid") role = ROLE[firstClass(line)] || "box";
      else { const base = attr.replace(/[Ee]id$/, ""); role = base ? base.toLowerCase() : "item"; } // boxEid->box, eid->item
      numeric.push({ old: eid, role });
    }
  }

  // pass1: частоты ролей -> решить, нужен ли индекс
  const freq = {};
  for (const e of numeric) freq[e.role] = (freq[e.role] || 0) + 1;
  // pass2: назначить уникальные имена
  const counter = {};
  const map = {};
  for (const e of numeric) {
    let base = `${prefix}/${e.role}`;
    if (freq[e.role] > 1) { counter[e.role] = (counter[e.role] || 0) + 1; base = `${prefix}/${e.role}-${counter[e.role]}`; }
    let cand = base, n = 1;
    while (taken.has(cand)) cand = `${base}--${++n}`;
    taken.add(cand);
    map[e.old] = cand;
  }

  // применить: точная замена закавыченного ключа в обоих файлах
  for (const [oldEid, newEid] of Object.entries(map)) {
    tsx = tsx.split(`"${oldEid}"`).join(`"${newEid}"`);
    layout = layout.split(`"${oldEid}"`).join(`"${newEid}"`);
  }

  await writeFile(tsxPath, tsx);
  await writeFile(layoutPath, layout);
  const left = [...tsx.matchAll(new RegExp(`data-eid="${prefix}/\\d+"`, "g"))].length;
  console.log(`✓ ${name}: renamed ${Object.keys(map).length} numeric eids; numeric left: ${left}`);
};

run().catch((e) => { console.error(e); process.exit(1); });
