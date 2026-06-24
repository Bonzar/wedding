// Generate @font-face CSS for design06's bundled Canva fonts and wire it into the
// static reproduction. The live player injects these fonts at runtime (we strip its
// JS), so the inline `font-family: YAD86m_J1ck_0` references resolve to nothing and
// fall back to a serif — which is why the cursive "Felix & Angel" rendered wrong.
//
// Source of truth: window.bootstrap on the live page (already-parsed font table).
// Font files themselves already exist locally in refs/assets/design06/fonts/.
//
// Usable two ways:
//   import { generateFonts } from "./design06-fonts.mjs"; await generateFonts(page, OUT);
//   node tools/design06-fonts.mjs            (standalone: fetches fonts live, patches OUT)

import { mkdir, copyFile, writeFile, readFile, access } from "node:fs/promises";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "design06-exact");
const FONT_SRC_DIR = join(ROOT, "refs", "assets", "design06", "fonts");

const STYLE = {
  REGULAR: { weight: 400, style: "normal" },
  BOLD: { weight: 700, style: "normal" },
  LIGHT: { weight: 300, style: "normal" },
  MEDIUM: { weight: 500, style: "normal" },
  SEMIBOLD: { weight: 600, style: "normal" },
  ITALICS: { weight: 400, style: "italic" },
  BOLD_ITALICS: { weight: 700, style: "italic" },
  LIGHT_ITALICS: { weight: 300, style: "italic" },
};
const FORMAT = { WOFF2: "woff2", WOFF: "woff", OTF: "opentype", OTF_CFF: "opentype", TTF: "truetype" };
const RANK = { WOFF2: 0, WOFF: 1, OTF: 2, OTF_CFF: 2, TTF: 3 }; // load order preference

// Recursively find Canva font entries: { A:id, B:variant, C:name, D:[{style,files:[{url,format}]}] }
function findFonts(node, acc = new Map()) {
  if (Array.isArray(node)) {
    for (const x of node) findFonts(x, acc);
  } else if (node && typeof node === "object") {
    if (typeof node.A === "string" && typeof node.C === "string" && Array.isArray(node.D) && node.D[0]?.files) {
      const key = `${node.A}_${node.B ?? 0}`;
      if (!acc.has(key)) acc.set(key, node);
    }
    for (const k of Object.keys(node)) findFonts(node[k], acc);
  }
  return acc;
}

// Parse the bootstrap object from the raw Canva export (the runtime clears
// window.bootstrap after init, so the live page can't be read back reliably).
export async function loadBootstrapFromRaw() {
  const raw = await readFile(join(ROOT, "refs", "raw", "design06.html"), "utf8");
  const start = raw.indexOf("window['bootstrap'] = JSON.parse('");
  if (start === -1) throw new Error("bootstrap marker not found");
  const from = start + "window['bootstrap'] = JSON.parse('".length;
  const end = raw.indexOf("'); window['flags']", from);
  const inner = raw.slice(from, end); // body of a JS single-quoted string literal
  // Let the JS engine decode the literal's escapes (\x3c, \\, \', \uXXXX, ...) into
  // the JSON text, then parse. Input is our own local export file (trusted).
  const jsonText = (0, eval)("'" + inner + "'");
  return JSON.parse(jsonText);
}

export async function generateFonts(bootstrap, out = OUT) {
  const fonts = findFonts(bootstrap);

  const fontsOut = join(out, "_assets", "fonts");
  await mkdir(fontsOut, { recursive: true });

  const faces = [];
  let copied = 0;
  for (const [family, font] of fonts) {
    for (const styleDef of font.D) {
      const map = STYLE[styleDef.style] || STYLE.REGULAR;
      const files = [...styleDef.files].sort((a, b) => (RANK[a.format] ?? 9) - (RANK[b.format] ?? 9));
      const srcs = [];
      for (const f of files) {
        const fname = basename(f.url);
        const fmt = FORMAT[f.format];
        if (!fmt) continue;
        const src = join(FONT_SRC_DIR, fname);
        try {
          await access(src);
          await copyFile(src, join(fontsOut, fname));
          copied++;
          // url() is relative to this CSS file, which lives in _assets/ → use sibling path
          srcs.push(`url(fonts/${fname}) format("${fmt}")`);
        } catch {
          /* file not local — skip this format */
        }
      }
      if (!srcs.length) continue;
      faces.push(
        `@font-face{font-family:"${family}";font-style:${map.style};font-weight:${map.weight};font-display:swap;src:${srcs.join(",")};}`,
      );
    }
  }

  const css = `/* design06 bundled fonts (extracted from window.bootstrap) */\n${faces.join("\n")}\n`;
  await writeFile(join(out, "_assets", "design-fonts.css"), css);

  // wire the stylesheet into index.html (right after <base>, so it precedes usage)
  const indexPath = join(out, "index.html");
  let html = await readFile(indexPath, "utf8");
  if (!html.includes("design-fonts.css")) {
    const link = '<link rel="stylesheet" href="_assets/design-fonts.css">';
    html = html.includes("</base>")
      ? html
      : html.replace(/(<base[^>]*>)/i, `$1${link}`);
    if (!html.includes("design-fonts.css")) html = html.replace("</head>", `${link}</head>`);
    await writeFile(indexPath, html);
  }
  console.log(`✓ fonts: ${fonts.size} families, ${faces.length} @font-face, ${copied} files copied`);
  return { families: fonts.size, faces: faces.length };
}

// standalone
if (import.meta.url === `file://${process.argv[1]}`) {
  const bootstrap = await loadBootstrapFromRaw();
  await generateFonts(bootstrap, OUT);
}
