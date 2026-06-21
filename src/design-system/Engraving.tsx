import type { CSSProperties } from "react";
import { getSvg } from "./illustrations";
import { u } from "./unit";
import styles from "./Engraving.module.css";

export interface EngravingProps {
  /** имя файла из assets/illustrations без расширения, напр. "gazebo" */
  name: string;
  /** высота в пикселях макета (база 440). Иллюстрация масштабируется по высоте. */
  height?: number;
  /** ширина в пикселях макета — если задана, имеет приоритет над height. */
  width?: number;
  /** зеркалить по горизонтали */
  flip?: boolean;
  /** цвет (по умолчанию наследует currentColor = --ink) */
  color?: string;
  className?: string;
  style?: CSSProperties;
  /** скрыть от скринридеров (декоративная гравюра) */
  decorative?: boolean;
}

/**
 * Инлайновая SVG-гравюра дизайн-системы. Наследует currentColor, поэтому
 * перекрашивается вместе с темой. Размер — в «пикселях макета» (флюид через --u).
 */
export function Engraving({
  name,
  height,
  width,
  flip = false,
  color,
  className,
  style,
  decorative = true,
}: EngravingProps) {
  const byWidth = width != null;
  const size = byWidth ? u(width as number) : u(height ?? 100);
  const cls = [styles.ill, byWidth ? styles.byWidth : styles.byHeight, flip ? styles.flip : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <span
      className={cls}
      aria-hidden={decorative ? true : undefined}
      style={{ ["--size" as string]: size, ...(color ? { color } : null), ...style }}
      dangerouslySetInnerHTML={{ __html: getSvg(name) }}
    />
  );
}
