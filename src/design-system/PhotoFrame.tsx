import type { CSSProperties, ReactNode } from "react";
import { getSvg } from "./illustrations";

export interface PhotoFrameProps {
  /** соотношение сторон, напр. "3 / 4" */
  ratio?: string;
  /** ширина рамки в % от родителя */
  widthPct?: number;
  /** подпись плейсхолдера (показывается, если нет children) */
  label?: string;
  /** реальное содержимое (img) — если есть, плейсхолдер скрыт */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Фото в рисованной рамке-уголках. Пока фото нет — показывает плейсхолдер.
 * Классы .photo/.frame/.ph живут в base.css (общая утилита дизайн-системы).
 */
export function PhotoFrame({ ratio = "3 / 4", widthPct, label = "ваше фото", children, className, style }: PhotoFrameProps) {
  const cls = ["photo", className].filter(Boolean).join(" ");
  return (
    <div className={cls} style={{ width: widthPct != null ? `${widthPct}%` : undefined, aspectRatio: ratio, ...style }}>
      {children ?? <div className="ph">{label}</div>}
      <div className="frame" dangerouslySetInnerHTML={{ __html: getSvg("frame-corners") }} />
    </div>
  );
}
