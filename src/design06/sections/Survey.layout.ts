// design06 Survey — редактируемый слой (Approach A2): на элемент одна запись, ключ = data-eid.
// Раздел БЕЗ Canva-эталона (см. EDITOR.md §9). Редактируемы ТОЛЬКО базовые интро-объекты
// (надпись/заголовок/абзац) — структура повторяет Closing (объект DF_utQ + поле aF9o6Q +
// <p>/<span>), но шрифты кириллические (Canva-шрифты латинские). Интерактив (список гостей,
// модалка) data-eid НЕ несёт и сюда не входит. Геометрия — в «px макета» (страница в zoom 1776).
import type { El } from "../layout";

const INK = "rgb(53, 80, 116)"; // = d06-синий (≈ var(--ink))

export const layout: Record<string, El> = {
  // — надпись-эйброу «RSVP» —
  "survey/eyebrow": { x: 589.7928968558282, y: -124.49367331288343, w: 600, h: 64, raw: { "position": "absolute", "top": "0px", "left": "0px", "touchAction": "pan-x pan-y pinch-zoom" } },
  "survey/eyebrow-field": { w: 600, h: 64, raw: { writingMode: "horizontal-tb", transformOrigin: "0px 0px" } },
  "survey/eyebrow-box": { x: 0, y: 0 },
  "survey/eyebrow-p": { font: '"Jost", system-ui, sans-serif', fontSize: 28, color: INK, lineHeight: "40px", letterSpacing: "0.42em", textTransform: "uppercase", textAlign: "center", raw: { listStyleType: "none" } },
  "survey/eyebrow-span": { color: INK, raw: { fontSize: "1em", fontWeight: "400" } },

  // — заголовок «Для нас важно знать» —
  "survey/title": { x: 299.19632048491195, y: 207.72418295148248, w: 1200, h: 130, raw: { "position": "absolute", "top": "0px", "left": "0px", "touchAction": "pan-x pan-y pinch-zoom" } },
  "survey/title-field": { w: 1200, h: 130, raw: { writingMode: "horizontal-tb", transformOrigin: "0px 0px" } },
  "survey/title-box": { x: 0, y: 0 },
  "survey/title-p": { font: "\"Jost\", system-ui, sans-serif", fontSize: 92, letterSpacing: "0em", lineHeight: "104px", textAlign: "center", textTransform: "none", color: "rgb(53, 80, 116)", raw: { "listStyleType": "none" } },
  "survey/title-span": { color: INK, raw: { fontSize: "1em", fontWeight: "400" } },

  // — поясняющий абзац —
  "survey/body": { x: 299.19632048491184, y: 433.03782008086256, w: 1200, h: 220, raw: { "position": "absolute", "top": "0px", "left": "0px", "touchAction": "pan-x pan-y pinch-zoom" } },
  "survey/body-field": { w: 1200.015960506135, h: 220, raw: { "writingMode": "horizontal-tb", "transformOrigin": "0px 0px" } },
  "survey/body-box": { x: 0, y: 0 },
  "survey/body-p": { font: "\"Jost\", system-ui, sans-serif", fontSize: 42, letterSpacing: "0em", lineHeight: "58px", textAlign: "center", textTransform: "none", color: "rgb(53, 80, 116)", raw: { "listStyleType": "none", "whiteSpace": "normal" } },
  "survey/body-span": { color: INK, raw: { fontSize: "1em", fontWeight: "400" } },
};
