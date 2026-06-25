// Dev-only endpoints for the design06 editor (run only in `vite serve`):
//   POST /__d06/save   — persist edits. STYLE (`changes`) → patched into the El record by
//                        key in <Section>.layout.ts; CONTENT (`content`) → text string and
//                        <img> src patched by data-eid in <Section>.tsx. Style lives in
//                        layout.ts, content lives in the .tsx — git is the revert path.
//   POST /__d06/upload — save an uploaded image into public assets, return its served path.
// Untouched code stays byte-identical; the committed files are the 0% base, not a master.
import type { Plugin } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA = join(ROOT, "public", "design06-exact", "_assets", "media");

const FIELD_ORDER = [
  "x", "y", "w", "h", "rot", "scale", "sx", "sy",
  "font", "fontSize", "letterSpacing", "lineHeight", "textAlign", "textTransform", "color",
];

const lit = (v: unknown) => (typeof v === "number" ? String(v) : JSON.stringify(v));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function serialize(rec: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const k of FIELD_ORDER) if (rec[k] !== undefined && rec[k] !== null) parts.push(`${k}: ${lit(rec[k])}`);
  if (rec.raw && typeof rec.raw === "object") {
    const rk = Object.entries(rec.raw as Record<string, unknown>).map(([k, v]) => `${JSON.stringify(k)}: ${lit(v)}`);
    parts.push(`raw: { ${rk.join(", ")} }`);
  }
  return `{ ${parts.join(", ")} }`;
}

// Locate the `{ … }` object literal that follows `"<eid>":`, respecting string literals.
function findRecord(src: string, eid: string): { start: number; end: number } | null {
  const key = `"${eid}":`;
  const ki = src.indexOf(key);
  if (ki === -1) return null;
  const start = src.indexOf("{", ki + key.length);
  if (start === -1) return null;
  let depth = 0, inStr = false, q = "", esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === q) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; q = c; continue; }
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return { start, end: i + 1 };
  }
  return null;
}

// Index just past the `>` that ends the opening tag containing `from` (brace/quote-aware).
function tagEnd(src: string, from: number): number {
  let inStr = false, q = "", depth = 0;
  for (let i = from; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (c === q) inStr = false; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = true; q = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth === 0) return i + 1;
  }
  return -1;
}

// Replace the single `{…}` text-expression child of the element carrying data-eid=<eid>.
function patchText(src: string, eid: string, text: string): string | null {
  const ki = src.indexOf(`data-eid="${eid}"`);
  if (ki === -1) return null;
  const te = tagEnd(src, ki);
  if (te === -1) return null;
  let i = te;
  while (i < src.length && /\s/.test(src[i])) i++;
  if (src[i] !== "{") return null;
  let depth = 0, inStr = false, q = "", j = i;
  for (; j < src.length; j++) {
    const c = src[j];
    if (inStr) { if (c === "\\") { j++; continue; } if (c === q) inStr = false; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = true; q = c; continue; }
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) { j++; break; }
  }
  return src.slice(0, i) + `{${JSON.stringify(text)}}` + src.slice(j);
}

// Replace the first `src="…"` after data-eid=<eid> (the <img> nested in that wrapper).
function patchSrc(src: string, eid: string, value: string): string | null {
  const ki = src.indexOf(`data-eid="${eid}"`);
  if (ki === -1) return null;
  const m = /src="([^"]*)"/.exec(src.slice(ki));
  if (!m) return null;
  const at = ki + m.index;
  return src.slice(0, at) + `src=${JSON.stringify(value)}` + src.slice(at + m[0].length);
}

// Ensure the <img> (first after data-eid=<eid>) renders a replaced photo without distortion:
// originals use object-fit:fill (pre-cropped), an arbitrary-aspect upload would stretch.
function patchImgFit(src: string, eid: string): string {
  const ki = src.indexOf(`data-eid="${eid}"`);
  if (ki === -1) return src;
  const imgIdx = src.indexOf("<img", ki);
  if (imgIdx === -1) return src;
  const end = tagEnd(src, imgIdx);
  if (end === -1 || src.slice(imgIdx, end).includes("style=")) return src; // не трогаем уже стилизованный
  return src.slice(0, imgIdx + 4) + ` style={{ objectFit: "cover" }}` + src.slice(imgIdx + 4);
}

type StyleChange = { eid: string; record: Record<string, unknown> };
type ContentChange = { eid: string; text?: string; src?: string };

const readBody = (req: import("node:http").IncomingMessage): Promise<string> =>
  new Promise((resolve) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => resolve(b)); });

export function d06Save(): Plugin {
  return {
    name: "d06-save",
    apply: "serve",
    configureServer(server) {
      const json = (res: import("node:http").ServerResponse, code: number, obj: unknown) => {
        res.statusCode = code;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(obj));
      };

      server.middlewares.use("/__d06/save", async (req, res) => {
        if (req.method !== "POST") return json(res, 405, { ok: false, error: "POST only" });
        try {
          const { changes = [], content = [], additions = null, palette, design } = JSON.parse(await readBody(req)) as {
            changes?: StyleChange[]; content?: ContentChange[]; additions?: unknown[] | null; palette?: string | null; design?: string;
          };
          if (!changes.length && !content.length && !additions && palette === undefined)
            return json(res, 400, { ok: false, error: "nothing to save" });

          // Целевой дизайн: редактор шлёт design ("design06"|"design07"). Дефолт design06 (совместимость).
          const dRoot = join(ROOT, "src", design === "design07" ? "design07" : "design06");
          const dSect = join(dRoot, "sections");

          // STYLE → <Section>.layout.ts (record patched by key)
          const byLayout = new Map<string, StyleChange[]>();
          for (const ch of changes) {
            const file = join(dSect, `${cap(ch.eid.split("/")[0])}.layout.ts`);
            (byLayout.get(file) ?? byLayout.set(file, []).get(file)!).push(ch);
          }
          for (const [file, list] of byLayout) {
            let src = await readFile(file, "utf8");
            for (const { eid, record } of list) {
              const span = findRecord(src, eid);
              if (!span) return json(res, 422, { ok: false, error: `record not found: ${eid}` });
              src = src.slice(0, span.start) + serialize(record) + src.slice(span.end);
            }
            await writeFile(file, src);
          }

          // CONTENT → <Section>.tsx (text expression / img src patched by data-eid)
          for (const c of content) {
            const file = join(dSect, `${cap(c.eid.split("/")[0])}.tsx`);
            let src = await readFile(file, "utf8");
            if (c.text != null) {
              const n = patchText(src, c.eid, c.text);
              if (n == null) return json(res, 422, { ok: false, error: `text not found: ${c.eid}` });
              src = n;
            }
            if (c.src != null) {
              const n = patchSrc(src, c.eid, c.src);
              if (n == null) return json(res, 422, { ok: false, error: `img not found: ${c.eid}` });
              src = patchImgFit(n, c.eid); // заполнять рамку без искажения
            }
            await writeFile(file, src);
          }

          // ADDED elements → src/<design>/additions.ts (заменяем массив, шапку/тип сохраняем)
          if (Array.isArray(additions)) {
            const file = join(dRoot, "additions.ts");
            const src = await readFile(file, "utf8");
            const marker = "export const additions: Addition[] =";
            const head = src.includes(marker) ? src.slice(0, src.indexOf(marker)) : src + "\n";
            await writeFile(file, `${head}${marker} ${JSON.stringify(additions, null, 2)};\n`);
          }

          // PALETTE → src/<design>/paletteState.ts (один экспорт; шапку-комментарий сохраняем).
          // null = вернуть базовые «чернила». На проде применяется, пикер — только dev.
          if (palette !== undefined) {
            const file = join(dRoot, "paletteState.ts");
            const src = await readFile(file, "utf8");
            const marker = "export const activePalette: string | null =";
            const head = src.includes(marker) ? src.slice(0, src.indexOf(marker)) : src + "\n";
            await writeFile(file, `${head}${marker} ${palette === null ? "null" : JSON.stringify(palette)};\n`);
          }

          json(res, 200, { ok: true, style: changes.length, content: content.length, additions: Array.isArray(additions) ? additions.length : 0, palette: palette !== undefined });
        } catch (e) {
          json(res, 500, { ok: false, error: (e as Error).message });
        }
      });

      server.middlewares.use("/__d06/upload", async (req, res) => {
        if (req.method !== "POST") return json(res, 405, { ok: false, error: "POST only" });
        try {
          const { name, data } = JSON.parse(await readBody(req)) as { name: string; data: string };
          if (!name || !data) return json(res, 400, { ok: false, error: "name and data required" });
          const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_");
          await writeFile(join(MEDIA, safe), Buffer.from(data, "base64"));
          json(res, 200, { ok: true, path: `/design06-exact/_assets/media/${safe}` });
        } catch (e) {
          json(res, 500, { ok: false, error: (e as Error).message });
        }
      });
    },
  };
}
