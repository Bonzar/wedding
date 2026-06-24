import type { CSSProperties } from "react";

// Approach A2 — редактируемая запись элемента. Геометрия и типографика разложены в
// числовые/строковые поля (прямо под контролы редактора), всё прочее — в raw.
// elStyle(record) собирает финальный inline-style; при пустых правках идентичен
// исходной Canva-вёрстке → пиксель-в-пиксель (0%).
export type El = {
  // геометрия
  x?: number; // translate X, px
  y?: number; // translate Y, px
  w?: number; // width, px
  h?: number; // height, px
  rot?: number; // rotate, deg
  scale?: number; // uniform scale
  sx?: number; // неравномерный масштаб по X (Option-растяжение); если задан sx/sy — имеет приоритет над scale
  sy?: number; // неравномерный масштаб по Y
  // текст
  font?: string; // font-family
  fontSize?: number; // px — в Canva это CSS-переменная --H97cbQ
  letterSpacing?: string; // напр. "0em"
  lineHeight?: string; // напр. "119px"
  textAlign?: CSSProperties["textAlign"];
  textTransform?: CSSProperties["textTransform"];
  color?: string;
  // всё не разложенное (вторичные custom-props, font-weight/kerning, сложные transform…)
  raw?: CSSProperties;
};

export function elStyle(r: El): CSSProperties {
  const s: CSSProperties = { ...(r.raw ?? {}) };
  if (r.w != null) s.width = `${r.w}px`;
  if (r.h != null) s.height = `${r.h}px`;
  const tf: string[] = [];
  if (r.x != null || r.y != null) tf.push(`translate(${r.x ?? 0}px, ${r.y ?? 0}px)`);
  if (r.rot != null) tf.push(`rotate(${r.rot}deg)`);
  if (r.sx != null || r.sy != null) tf.push(`scale(${r.sx ?? 1}, ${r.sy ?? 1})`); // неравномерный приоритетнее
  else if (r.scale != null) tf.push(`scale(${r.scale})`);
  if (tf.length) s.transform = tf.join(" ");
  if (r.font != null) s.fontFamily = r.font;
  if (r.fontSize != null) s["--H97cbQ"] = `${r.fontSize}px`; // Canva-конвенция размера текста
  if (r.letterSpacing != null) s.letterSpacing = r.letterSpacing;
  if (r.lineHeight != null) s.lineHeight = r.lineHeight;
  if (r.textAlign != null) s.textAlign = r.textAlign;
  if (r.textTransform != null) s.textTransform = r.textTransform;
  if (r.color != null) s.color = r.color;
  return s;
}
