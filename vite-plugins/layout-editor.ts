import type { Plugin } from "vite";
import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Правка одного элемента из live-редактора макета. Должна совпадать по форме с
 * ElementEdit из src/dev/editorStore.ts (фронт сериализует именно это).
 */
export interface ElementEditPayload {
  selector: string;
  label: string;
  tag?: string;
  classes?: string[];
  // геометрия
  tx: number;
  ty: number;
  scale: number;
  rotate: number;
  // типографика (опционально)
  text?: string;
  fontFamily?: string;
  fontSizePx?: number;
  lineHeight?: number;
  letterSpacingPx?: number;
  wordSpacingPx?: number;
}

const ENDPOINT = "/__layout-edit/save";
const OUT_REL = "tools/layout-edits";

/**
 * Dev-only Vite-плагин: принимает правки из live-редактора макета (POST /__layout-edit/save)
 * и пишет их файлом ПРЯМО В РЕПОЗИТОРИЙ — tools/layout-edits/edits.json (машинно) и
 * edits.css (готовые CSS-правила + читаемые лейблы), чтобы агент мог вложить изменения в
 * реальные CSS-модули. В прод-сборку не входит (apply: "serve" + это build-time конфиг).
 */
export function layoutEditorPlugin(): Plugin {
  return {
    name: "wedding-layout-editor",
    apply: "serve",
    configureServer(server) {
      const outDir = resolve(server.config.root, OUT_REL);
      server.middlewares.use(ENDPOINT, (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }
        const chunks: Buffer[] = [];
        req.on("data", (c: Buffer) => chunks.push(c));
        req.on("end", () => {
          void (async () => {
            try {
              const edits: ElementEditPayload[] = JSON.parse(Buffer.concat(chunks).toString("utf8"));
              await mkdir(outDir, { recursive: true });
              await writeFile(resolve(outDir, "edits.json"), JSON.stringify(edits, null, 2), "utf8");
              await writeFile(resolve(outDir, "edits.css"), renderCss(edits), "utf8");
              server.config.logger.info(
                `\x1b[36m[layout-editor]\x1b[0m сохранено правок: ${edits.length} → ${OUT_REL}/`,
              );
              res.statusCode = 200;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ ok: true, count: edits.length }));
            } catch (err) {
              res.statusCode = 400;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ ok: false, error: String(err) }));
            }
          })();
        });
      });
    },
  };
}

/** Округление для читаемого CSS (без 0.30000000000004). */
function r(n: number, digits = 2): number {
  return Number(n.toFixed(digits));
}

/** Рендер правок в человекочитаемый CSS, готовый к вкладыванию в модули. */
function renderCss(edits: ElementEditPayload[]): string {
  const header =
    "/* Сгенерировано live-редактором макета (dev-only). Вложи правки в реальные CSS-модули\n" +
    "   (по лейблу ищи styles.<класс> в *.module.css секции) и удали этот файл.\n" +
    "   font-size в px: исходник секций во флюид-cqw — переведи N px в calc(N' * var(--u)),\n" +
    "   где N' = N / (ширина_листа / 440). */\n\n";

  const blocks = edits.map((e) => {
    const decls: string[] = [];
    const hasTransform = e.tx !== 0 || e.ty !== 0 || e.scale !== 1 || e.rotate !== 0;
    if (hasTransform) {
      decls.push(
        `  transform: translate(${r(e.tx)}px, ${r(e.ty)}px) rotate(${r(e.rotate)}deg) scale(${r(e.scale, 4)});`,
        `  transform-origin: center;`,
      );
    }
    if (e.fontFamily) decls.push(`  font-family: ${e.fontFamily};`);
    if (e.fontSizePx != null) decls.push(`  font-size: ${r(e.fontSizePx)}px;`);
    if (e.lineHeight != null) decls.push(`  line-height: ${r(e.lineHeight, 3)};`);
    if (e.letterSpacingPx != null) decls.push(`  letter-spacing: ${r(e.letterSpacingPx)}px;`);
    if (e.wordSpacingPx != null) decls.push(`  word-spacing: ${r(e.wordSpacingPx)}px;`);

    const textNote =
      e.text != null
        ? `\n   ТЕКСТ → ${JSON.stringify(e.text)} (правится в src/content/wedding.ts, не в CSS)`
        : "";
    const body = decls.length ? decls.join("\n") : "  /* только текст, CSS-правок нет */";
    return `/* ${e.label}${textNote} */\n${e.selector} {\n${body}\n}`;
  });

  return header + (blocks.join("\n\n") || "/* правок нет */") + "\n";
}
