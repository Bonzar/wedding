import type { CSSProperties, ReactNode } from "react";
import { Engraving } from "./Engraving";

export interface SectionProps {
  /** id для якорной навигации (#rsvp, #survey) */
  id?: string;
  /** доп. класс секции (CSS-модуль конкретной секции) */
  className?: string;
  /** тёмный фон (чернила) с инверсией текста */
  ink?: boolean;
  /** внешние padding'и секции (по умолчанию стандартные) */
  pad?: boolean;
  /** содержимое уже обёрнуто в .wrap? если false — обернём сами */
  bare?: boolean;
  style?: CSSProperties;
  wrapStyle?: CSSProperties;
  children?: ReactNode;
}

/**
 * Секция листа: позиционируется, скрывает overflow, центрирует контент в .wrap
 * с максимальной шириной. ink=true даёт тёмную секцию (см. исходный Layout).
 */
export function Section({ id, className, ink = false, pad = true, bare = false, style, wrapStyle, children }: SectionProps) {
  const inkStyle: CSSProperties = ink
    ? { background: "var(--ink)", color: "var(--on-ink)" }
    : {};
  const padStyle: CSSProperties = pad ? {} : { padding: 0 };
  const content = bare ? children : <div className="wrap" style={wrapStyle}>{children}</div>;
  return (
    <section id={id} className={className} style={{ ...inkStyle, ...padStyle, ...style }}>
      {content}
    </section>
  );
}

export interface GhostProps {
  /** имя гравюры-фона */
  name: string;
  side?: "left" | "right";
  /** размер в пикселях макета */
  size?: number;
  top?: string;
  flip?: boolean;
  opacity?: number;
}

/**
 * Крупная бледная гравюра позади текста секции (декор). Высокие ботанические
 * (flower, tree, forest, peony) масштабируются по высоте, остальные — по ширине.
 */
export function Ghost({ name, side = "right", size = 280, top = "50%", flip = false, opacity = 0.09 }: GhostProps) {
  const tall = /^(flower|tree|forest|peony|wildflowers)/.test(name);
  const pos = side === "right" ? { right: "-50px" } : { left: "-50px" };
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top,
        transform: "translateY(-50%)",
        opacity,
        color: "var(--ink)",
        pointerEvents: "none",
        ...pos,
      }}
    >
      <Engraving name={name} {...(tall ? { height: size } : { width: size })} flip={flip} />
    </div>
  );
}
