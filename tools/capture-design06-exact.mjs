// Capture the LIVE Canva render of design06 into a self-contained static folder.
//
// The published player virtualizes: only on-screen sections are mounted, and
// decorative engravings are runtime `blob:` images that vanish when a section
// unmounts. So we scroll the whole page and, the instant a section reports
// data-scroll-ready, we harvest its outerHTML and inline its blob images (as
// tokens we later write to real files). Other https `_assets/...` resources are
// mirrored into a local tree so the saved page is fully offline and pixel-true.
//
// Output: public/design06-exact/{index.html,_assets/**}
// Run with node 22:  node tools/capture-design06-exact.mjs

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadBootstrapFromRaw, generateFonts } from "./design06-fonts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "design06-exact");
const LIVE = "https://lysfilter.my.canva.site/design06/";
const VIEWPORT = { width: 1776, height: 1400 };

// The 9 content sections, in the exact order of the reference DOM (cover excluded).
const CONTENT_ORDER = [
  "PBbM6hRVrsx6MjPz",
  "PBtLyKJDZDgGk7P1",
  "PBGrcDNxzKvrxrJt",
  "PBsHbr4J9zLLY08q",
  "PBL8ZPfjvBzXjMPd",
  "PB09PH75zdFrcMmz",
  "PBYbv3X7MfRLX7B4",
  "PBJyC0fbP0ThXKGC",
  "PB9GyzXqcqH056Yr",
];

const EXT_BY_MIME = {
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function ensureDir(file) {
  await mkdir(dirname(file), { recursive: true });
}
async function downloadTo(url, relPath) {
  const dest = join(OUT, relPath);
  await ensureDir(dest);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}
function assetRel(url) {
  const i = url.indexOf("/_assets/");
  return i === -1 ? null : url.slice(i + 1);
}

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });

  console.log("→ loading", LIVE);
  await page.goto(LIVE, { waitUntil: "networkidle", timeout: 120_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);

  // Inject a harvester that, for any not-yet-captured ready section, inlines its
  // blob images (→ tokens) and stashes its outerHTML on window.__captured.
  const installHarvester = () =>
    page.evaluate(() => {
      window.__captured = window.__captured || {};
      window.__harvest = async () => {
        for (const sec of document.querySelectorAll('section[data-scroll-ready="true"][id]')) {
          if (window.__captured[sec.id]) continue;
          let n = 0;
          for (const img of sec.querySelectorAll("img")) {
            const src = img.currentSrc || img.src;
            if (src && src.startsWith("blob:")) {
              try {
                const blob = await (await fetch(src)).blob();
                const bytes = new Uint8Array(await blob.arrayBuffer());
                let bin = "";
                for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
                const token = "__BLOB__" + sec.id + "_" + n++ + "__";
                img.setAttribute("src", token);
                img.setAttribute("data-blobtype", blob.type || "image/png");
                img.setAttribute("data-blobb64", btoa(bin));
              } catch (e) {
                /* ignore */
              }
            }
          }
          window.__captured[sec.id] = sec.outerHTML;
        }
        return Object.keys(window.__captured);
      };
    });
  await installHarvester();

  // The cover is a separate page; clicking "Open Invitation" (#page-0) mounts the
  // whole content scroll group (all 9 sections) into `.ZRRuDw` and keeps it mounted.
  const opened = await page.evaluate(() => {
    const a = document.querySelector('a[href="#page-0"]');
    if (a) {
      a.click();
      return a.textContent.trim();
    }
    return null;
  });
  console.log("→ opened via:", opened);
  await page.waitForFunction(
    () => document.querySelectorAll('section[id][data-scroll-ready="true"]').length >= 9,
    null,
    { timeout: 30_000 },
  );
  await page.waitForTimeout(2000);

  // Scroll the content scroller fully so every image/recolor-blob renders, then top.
  await page.evaluate(async () => {
    const el = document.querySelector(".ZRRuDw");
    if (!el) return;
    for (let y = 0; y <= el.scrollHeight; y += 700) {
      el.scrollTop = y;
      await new Promise((r) => setTimeout(r, 200));
    }
    el.scrollTop = 0;
  });
  await page.waitForTimeout(3000);

  // Single harvest now that all sections are mounted and rendered.
  const capturedIds = await page.evaluate(() => window.__harvest());
  console.log("→ captured sections:", capturedIds.length, capturedIds.join(","));

  // Pull head (stylesheet links + base/meta) and each section's HTML.
  const bundle = await page.evaluate(() => {
    const head = document.head.cloneNode(true);
    // keep only base, meta charset/viewport, stylesheet links, inline styles
    for (const el of [...head.children]) {
      const tag = el.tagName.toLowerCase();
      const keep =
        tag === "base" ||
        tag === "style" ||
        (tag === "meta" && (el.charset || /viewport/i.test(el.name || ""))) ||
        (tag === "link" && el.rel === "stylesheet");
      if (!keep) el.remove();
    }
    return {
      htmlClass: document.documentElement.className,
      htmlLang: document.documentElement.lang,
      htmlDir: document.documentElement.dir,
      headHTML: head.innerHTML,
      sections: window.__captured,
      httpsUrls: [
        ...new Set(
          [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href).filter((u) => u.includes("/_assets/")),
        ),
      ],
    };
  });

  await browser.close();

  // ---- download stylesheet assets + the fonts they reference ----
  for (const u of bundle.httpsUrls) {
    const rel = assetRel(u);
    if (!rel) continue;
    try {
      await downloadTo(u, rel);
      const baseDir = rel.slice(0, rel.lastIndexOf("/"));
      const cssText = await (await fetch(u)).text();
      const refs = [...cssText.matchAll(/url\((?!["']?data:)["']?([^"')]+)["']?\)/g)].map((m) => m[1]);
      for (const r of new Set(refs)) {
        try {
          await downloadTo(new URL(r, u).href, join(baseDir, r).replace(/\\/g, "/"));
        } catch (e) {
          console.warn("  ! font", r, e.message);
        }
      }
    } catch (e) {
      console.warn("  ! css", u, e.message);
    }
  }

  // ---- stitch sections in order, extract + write blob files, mirror media ----
  const mediaToFetch = new Set();
  const blobFiles = []; // {token, b64, type}
  let body = "";
  for (const id of CONTENT_ORDER) {
    let secHTML = bundle.sections[id];
    if (!secHTML) {
      console.warn("  ! missing section", id);
      continue;
    }
    // pull blob payloads out of attributes -> token map; clean attrs
    secHTML = secHTML.replace(
      /<img\b[^>]*\bsrc="(__BLOB__[^"]+)"[^>]*>/g,
      (m, token) => {
        const type = (m.match(/data-blobtype="([^"]+)"/) || [])[1] || "image/png";
        const b64 = (m.match(/data-blobb64="([^"]+)"/) || [])[1] || "";
        blobFiles.push({ token, b64, type });
        // strip data-blob* attrs, keep the token src (rewritten below)
        return m.replace(/\sdata-blobb64="[^"]*"/, "").replace(/\sdata-blobtype="[^"]*"/, "");
      },
    );
    // collect media urls to mirror locally, then make them relative
    secHTML = secHTML.replace(/https:\/\/lysfilter\.my\.canva\.site\/design06\//g, (m) => {
      return "";
    });
    body += secHTML;
  }
  // find media refs now-relative (_assets/media/...) to download
  for (const m of body.matchAll(/(_assets\/media\/[^"')]+)/g)) mediaToFetch.add(m[1]);
  for (const rel of mediaToFetch) {
    try {
      await downloadTo("https://lysfilter.my.canva.site/design06/" + rel, rel);
    } catch (e) {
      console.warn("  ! media", rel, e.message);
    }
  }
  // write blob files + rewrite tokens
  let bi = 0;
  for (const b of blobFiles) {
    const ext = EXT_BY_MIME[b.type] || "bin";
    const rel = `_assets/blobs/${b.token.replace(/__BLOB__|__/g, "")}.${ext}`;
    const dest = join(OUT, rel);
    await ensureDir(dest);
    await writeFile(dest, Buffer.from(b.b64, "base64"));
    body = body.split(b.token).join(rel);
    bi++;
  }
  console.log(`→ wrote ${bi} blob files, mirrored ${mediaToFetch.size} media files`);

  // rewrite any remaining absolute urls in head
  let headHTML = bundle.headHTML
    .split("https://lysfilter.my.canva.site/design06/")
    .join("")
    .replace(/<base[^>]*>/i, '<base href="/design06-exact/">');

  // Canva's player scrolls inside .ZRRuDw (fixed height + overflow). For a static
  // baseline we want all 9 sections to stack into one naturally-tall document.
  const flowOverride = `<style id="exact-flow-override">
html,body{height:auto!important;overflow:visible!important;margin:0;background:#fff;}
.yIDCqA,._8OlyIw,._4KoDHA,.ZRRuDw,.KYQZFA{height:auto!important;min-height:0!important;overflow:visible!important;}
.ZRRuDw>div,._4KoDHA>div,.ZRRuDw>div>div{height:auto!important;overflow:visible!important;}
</style>`;

  const doc = `<!DOCTYPE html>
<html dir="${bundle.htmlDir || "ltr"}" lang="${bundle.htmlLang || "en"}" class="${bundle.htmlClass}">
<head>${headHTML}${flowOverride}</head>
<body><div id="root"><div class="yIDCqA"><main class="_8OlyIw"><div class="_4KoDHA"><div class="ZRRuDw"><div style="height: 100%; width: 100%;"><div class="KYQZFA">${body}</div></div></div></div></main></div></div></body>
</html>`;

  const indexPath = join(OUT, "index.html");
  await ensureDir(indexPath);
  await writeFile(indexPath, doc);
  console.log("✓ wrote", indexPath, `(${(doc.length / 1024).toFixed(0)} KB)`);

  // Wire up the design's bundled fonts (the stripped runtime would otherwise leave
  // inline `font-family: YAD86m_J1ck_0` unresolved → wrong fallback for the script).
  const bootstrap = await loadBootstrapFromRaw();
  await generateFonts(bootstrap, OUT);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
