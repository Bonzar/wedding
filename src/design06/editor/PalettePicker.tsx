// Палитра редактора (dev-only): кнопка в тулбаре с превью текущего цвета + поповер из 20
// свотчей. Выбор мгновенно перекрашивает текст и контурные иллюстрации (см. palette.ts),
// сохранение цвета — общей кнопкой «Сохранить» (Editor пишет paletteState.ts). На проде
// пикер не монтируется (редактор грузится только на ?d06&edit), но выбранный цвет виден.
import { useState } from "react";
import { INK, PALETTE_COLORS } from "../palette";

type Props = {
  value: string | null; // текущий цвет (null = базовые чернила)
  dirty: boolean; // есть несохранённое изменение палитры
  onPick: (color: string | null) => void;
};

const nameOf = (value: string | null) =>
  value == null ? "Чернила (база)" : PALETTE_COLORS.find((c) => c.value === value)?.name ?? value;

export function PalettePicker({ value, dirty, onPick }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="d06e-pal">
      <button className="d06e-pal-btn" onClick={() => setOpen((o) => !o)} title="Палитра — цвет текста и иллюстраций">
        <span className="d06e-pal-dot" style={{ background: value ?? INK }} />
        Палитра
        {dirty && <em className="d06e-pal-mark">●</em>}
        <span className="d06e-pal-caret">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="d06e-pal-pop">
          <div className="d06e-pal-grid">
            <button
              className={`d06e-sw d06e-sw-none${value == null ? " d06e-sw-on" : ""}`}
              title="Чернила (по умолчанию)"
              onClick={() => onPick(null)}
            />
            {PALETTE_COLORS.map((c) => (
              <button
                key={c.value}
                className={`d06e-sw${value === c.value ? " d06e-sw-on" : ""}`}
                style={{ background: c.value }}
                title={c.name}
                onClick={() => onPick(c.value)}
              />
            ))}
          </div>
          <div className="d06e-pal-cur">{nameOf(value)}</div>
        </div>
      )}
    </div>
  );
}
