// Lossy in-place recompression of the d06 images that are actually rendered.
// Only touches files referenced by an <img src> in d06 source (.tsx/.ts) — orphans and
// the user's staged photos are left untouched. Same path + same format ⇒ zero code changes
// and zero structural/layout diff; only pixel bytes shrink.
//   · JPEG → mozjpeg q80 (visually lossless for photos)
//   · PNG  → palette-quantized (≤256 colours) — engraving line-art compresses hugely, no visible loss
// Each file is kept only if the re-encode is at least 3% smaller. Run with Node 22 + sharp.
import sharp from "sharp";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const ASSETS = join(ROOT, "public/design06-exact/_assets");
const SRC = join(ROOT, "src/design06");
const DRY = process.argv.includes("--dry");
// --all also recompresses orphan media (user-staged photos not yet placed) — they ship in the
// public deploy regardless, so optimizing them shrinks the artifact and pre-optimizes staging.
const ALL = process.argv.includes("--all");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? out.push(...walk(p)) : out.push(p);
  }
  return out;
}

// referenced set: every _assets/<path> mentioned in d06 source
const srcText = walk(SRC).filter((f) => /\.(tsx?|json)$/.test(f)).map((f) => readFileSync(f, "utf8")).join("\n");
const referenced = new Set([...srcText.matchAll(/_assets\/([A-Za-z0-9_./-]+\.[A-Za-z0-9]+)/g)].map((m) => m[1]));

// target list: referenced-only by default; with --all, every jpeg/png under _assets
const targets = ALL
  ? walk(ASSETS).map((p) => relative(ASSETS, p)).filter((r) => /\.(jpe?g|png)$/i.test(r))
  : [...referenced];

const kb = (b) => (b / 1024).toFixed(0).padStart(6) + " KB";
let before = 0, after = 0, changed = 0;
const rows = [];

for (const rel of targets.sort()) {
  const ext = extname(rel).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
  const abs = join(ASSETS, rel);
  let orig;
  try { orig = readFileSync(abs); } catch { continue; }
  const img = sharp(orig, { failOn: "none" });
  const out =
    ext === ".png"
      ? await img.png({ palette: true, quality: 80, effort: 10, compressionLevel: 9 }).toBuffer()
      : await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  before += orig.length;
  const win = orig.length - out.length;
  const keep = out.length < orig.length * 0.97;
  if (keep) {
    if (!DRY) writeFileSync(abs, out);
    after += out.length;
    changed++;
    rows.push(`  ${keep ? "✓" : " "} ${kb(orig.length)} → ${kb(out.length)}  (-${((win / orig.length) * 100).toFixed(0)}%)  ${rel}`);
  } else {
    after += orig.length;
    rows.push(`  · ${kb(orig.length)} (kept original, re-encode not smaller)  ${rel}`);
  }
}

console.log(rows.join("\n"));
console.log(`\n${DRY ? "[DRY] " : ""}recompressed ${changed} files`);
console.log(`total: ${(before / 1048576).toFixed(2)} MB → ${(after / 1048576).toFixed(2)} MB  (saved ${((before - after) / 1048576).toFixed(2)} MB, -${(((before - after) / before) * 100).toFixed(0)}%)`);
