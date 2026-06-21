import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  /** растянуть на ширину родителя */
  block?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Кнопка-пилюля дизайн-системы (.btn). Рендерит <a>, если задан href, иначе <button>.
 */
export function Button({ children, href, onClick, target, rel, type = "button", disabled, block, className, style }: ButtonProps) {
  const cls = ["btn", className].filter(Boolean).join(" ");
  const blockStyle: CSSProperties = block ? { display: "block", width: "100%" } : {};
  if (href) {
    return (
      <a className={cls} href={href} target={target} rel={rel} onClick={onClick} style={{ ...blockStyle, ...style }}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} disabled={disabled} style={{ ...blockStyle, ...style }}>
      {children}
    </button>
  );
}
