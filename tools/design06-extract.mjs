// Extract the static design06 reproduction into importable pieces for the React
// componentization: ordered CSS hrefs, the flow override, and per-section HTML
// (+ a concatenated body). Asset paths are rewritten relative→absolute since the
// React page has no <base href>. Output: src/design06/_generated/**
//
// Run with node 22:  node tools/design06-extract.mjs

import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "design06-exact", "index.html");
const GEN = join(ROOT, "src", "design06", "_generated");

// relative `_assets/...` → absolute (served from public/design06-exact/)
const abs = (s) => s.replaceAll("_assets/", "/design06-exact/_assets/");

const run = async () => {
  const html = await readFile(SRC, "utf8");
  const headEnd = html.indexOf("</head>");
  const head = html.slice(0, headEnd);

  // ordered <link ... .css> hrefs (any attribute order), de-duped, rewritten
  const hrefs = [];
  for (const m of head.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)) {
    const href = abs(m[1]);
    if (!hrefs.includes(href)) hrefs.push(href);
  }

  // flow override <style>
  const ov = head.match(/<style id="exact-flow-override">([\s\S]*?)<\/style>/);
  const override = ov ? ov[1] : "";

  // the 9 sections (no nested <section>, so non-greedy is safe)
  const sections = [...html.matchAll(/<section\b[\s\S]*?<\/section>/g)].map((m) => m[0]);
  if (sections.length !== 9) throw new Error(`expected 9 sections, got ${sections.length}`);

  await rm(GEN, { recursive: true, force: true });
  await mkdir(join(GEN, "sections"), { recursive: true });

  const ids = [];
  let body = "";
  for (const sec of sections) {
    const id = sec.match(/id="(PB[A-Za-z0-9]+)"/)[1];
    ids.push(id);
    const out = abs(sec);
    await writeFile(join(GEN, "sections", `${id}.html`), out);
    body += out;
  }

  await writeFile(join(GEN, "body.html"), body);
  await writeFile(join(GEN, "head-links.json"), JSON.stringify(hrefs, null, 2));
  await writeFile(join(GEN, "override.css"), override.trim() + "\n");
  await writeFile(join(GEN, "sections.json"), JSON.stringify(ids, null, 2));

  console.log(`✓ ${hrefs.length} css links, ${sections.length} sections`);
  console.log("  ids:", ids.join(", "));
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
