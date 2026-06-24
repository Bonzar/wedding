// Strips data-eid from NON-selectable elements so the editor's [data-eid] query only
// returns real "blocks". The element's style record (layout[key]) is untouched, so
// rendering stays pixel-identical (0%) — we only remove the selection marker.
//
// Selectable (keep data-eid): DF_utQ blocks, image crop-wraps (Izwocg), paragraphs (<p>),
// the section root (rGeu6w). Everything else (wrapper chains, empty spacer/overlay boxes,
// scale wraps, spans, table cells) loses its data-eid.
//
// Usage:  node tools/design06-mark-selectable.mjs <ComponentName>

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src", "design06", "sections");

const KEEP_CLASS = ["DF_utQ", "Izwocg", "rGeu6w"]; // block / image / section-root
const isSelectable = (line) => {
  if (KEEP_CLASS.some((c) => line.includes(`styles.${c}`))) return true;
  if (/^\s*<p[\s>]/.test(line)) return true; // paragraph (text/typography)
  return false;
};

const run = async () => {
  const [name] = process.argv.slice(2);
  if (!name) throw new Error("usage: <ComponentName>");
  const path = join(OUT, `${name}.tsx`);
  const src = await readFile(path, "utf8");
  let kept = 0,
    stripped = 0;
  const out = src
    .split("\n")
    .map((line) => {
      if (!/\bdata-eid=/.test(line)) return line;
      if (isSelectable(line)) { kept++; return line; }
      stripped++;
      // remove the data-eid attribute (both literal "..." and dynamic {...}); keep style
      return line.replace(/\s+data-eid=(?:"[^"]*"|\{[^}]*\})/, "");
    })
    .join("\n");
  await writeFile(path, out);
  console.log(`✓ ${name}: selectable kept ${kept}, internal stripped ${stripped}`);
};

run().catch((e) => { console.error(e); process.exit(1); });
