import type { CSSProperties, ElementType, ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

function make(baseClass: string, defaultTag: ElementType) {
  return function TextComponent({ children, as, className, style }: TextProps) {
    const Tag = as ?? defaultTag;
    const cls = [baseClass, className].filter(Boolean).join(" ");
    return (
      <Tag className={cls} style={style}>
        {children}
      </Tag>
    );
  };
}

/** Надзаголовок: Jost uppercase, широкий трекинг. */
export const Eyebrow = make("eyebrow", "div");
/** Каллиграфия (имена), Great Vibes. */
export const Script = make("script", "h2");
/** Мета-строка (дата/место), Jost light. */
export const Meta = make("meta", "p");
/** Основной текст, Arimo. */
export const Body = make("body", "p");
/** Подзаголовок-капс, Jost. */
export const Sub = make("sub", "div");
/** Амперсанд между именами. */
export const Amp = make("amp", "span");
