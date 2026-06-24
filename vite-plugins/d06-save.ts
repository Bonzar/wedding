// Dev-only endpoint for the design06 editor: POST /__d06/save patches edited El records
// back into src/design06/sections/<Section>.layout.ts. The editor sends full merged
// records (base + edits) keyed by data-eid; we replace each record literal in place by
// key, so untouched records stay byte-identical and git is the revert mechanism (the
// committed layout.ts is the 0% base, not an enforced golden master). Runs only in dev.
import type { Plugin } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SECT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "design06", "sections");

const FIELD_ORDER = [
  "x", "y", "w", "h", "rot", "scale",
  "font", "fontSize", "letterSpacing", "lineHeight", "textAlign", "textTransform", "color",
];

const lit = (v: unknown) => (typeof v === "number" ? String(v) : JSON.stringify(v));

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

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function d06Save(): Plugin {
  return {
    name: "d06-save",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__d06/save", (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; res.end("POST only"); return; }
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", async () => {
          const send = (code: number, obj: unknown) => {
            res.statusCode = code;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(obj));
          };
          try {
            const { changes } = JSON.parse(body) as { changes: { eid: string; record: Record<string, unknown> }[] };
            if (!Array.isArray(changes) || !changes.length) return send(400, { ok: false, error: "no changes" });

            // group eids by owning section file
            const byFile = new Map<string, { eid: string; record: Record<string, unknown> }[]>();
            for (const ch of changes) {
              const slug = ch.eid.split("/")[0];
              const file = join(SECT, `${cap(slug)}.layout.ts`);
              (byFile.get(file) ?? byFile.set(file, []).get(file)!).push(ch);
            }

            const written: string[] = [];
            for (const [file, list] of byFile) {
              let src = await readFile(file, "utf8");
              for (const { eid, record } of list) {
                const span = findRecord(src, eid);
                if (!span) return send(422, { ok: false, error: `record not found: ${eid}` });
                src = src.slice(0, span.start) + serialize(record) + src.slice(span.end);
              }
              await writeFile(file, src);
              written.push(file);
            }
            send(200, { ok: true, written: written.length, eids: changes.map((c) => c.eid) });
          } catch (e) {
            send(500, { ok: false, error: (e as Error).message });
          }
        });
      });
    },
  };
}
