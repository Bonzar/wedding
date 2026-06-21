import type { CSSProperties } from "react";
import { Engraving } from "./Engraving";

export interface DividerProps {
  /** гравюра-завитушка */
  name?: string;
  /** высота в пикселях макета */
  height?: number;
  style?: CSSProperties;
}

/** Тонкий орнаментальный разделитель (по умолчанию flourish-thin). */
export function Divider({ name = "flourish-thin", height = 12, style }: DividerProps) {
  return (
    <div className="divider" style={style}>
      <Engraving name={name} height={height} />
    </div>
  );
}
