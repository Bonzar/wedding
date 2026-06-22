import { observer } from "mobx-react-lite";
import { editor, type ElementEdit } from "./editorStore";
import styles from "./TypographyPanel.module.css";

/** Шрифт-токены дизайн-системы (см. tokens.css). */
const FONTS = [
  { label: "— по умолчанию —", value: "" },
  { label: "Script · Great Vibes", value: "var(--f-script)" },
  { label: "Label · Jost", value: "var(--f-label)" },
  { label: "Body · Arimo", value: "var(--f-body)" },
  { label: "Num · Special Elite", value: "var(--f-num)" },
];

/**
 * Контекстная панель типографики: видна, когда выделен текстовый элемент.
 * Текст / шрифт / размер / поворот / интервалы — пишутся в ElementEdit и
 * применяются инлайн в реальном времени.
 */
export const TypographyPanel = observer(function TypographyPanel() {
  const el = editor.selectedEl;
  const e = editor.current;
  if (!el || !e) return null;

  const computed = getComputedStyle(el);

  // числовое типографское поле (пусто → undefined = сброс к исходному)
  const numField = (field: keyof ElementEdit, step: number, placeholder: string) => ({
    type: "number" as const,
    step,
    placeholder,
    value: (e[field] as number | undefined) ?? "",
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => {
      const raw = ev.target.value;
      if (raw === "") return editor.patch({ [field]: undefined } as Partial<ElementEdit>);
      const n = parseFloat(raw);
      if (!Number.isNaN(n)) editor.patch({ [field]: n } as Partial<ElementEdit>);
    },
  });

  return (
    <div className={styles.panel} data-layout-editor aria-label="Типографика">
      <div className={styles.head}>Типографика · {e.label}</div>

      {editor.canEditText && (
        <label className={styles.row}>
          <span>Текст</span>
          <textarea
            className={styles.textarea}
            rows={2}
            value={e.text ?? el.textContent ?? ""}
            onChange={(ev) => editor.patch({ text: ev.target.value })}
          />
        </label>
      )}

      <label className={styles.row}>
        <span>Шрифт</span>
        <select
          className={styles.input}
          value={e.fontFamily ?? ""}
          onChange={(ev) => editor.patch({ fontFamily: ev.target.value || undefined })}
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.row}>
        <span>Размер, px</span>
        <input className={styles.input} {...numField("fontSizePx", 1, round(computed.fontSize))} />
      </label>

      <label className={styles.row}>
        <span>Поворот, °</span>
        <input
          className={styles.input}
          type="number"
          step={1}
          value={e.rotate}
          onChange={(ev) => {
            const n = parseFloat(ev.target.value);
            editor.patch({ rotate: Number.isNaN(n) ? 0 : n });
          }}
        />
      </label>

      <label className={styles.row}>
        <span>Межстрочный</span>
        <input className={styles.input} {...numField("lineHeight", 0.05, round(computed.lineHeight, "")) } />
      </label>

      <label className={styles.row}>
        <span>Межбукв., px</span>
        <input className={styles.input} {...numField("letterSpacingPx", 0.1, round(computed.letterSpacing))} />
      </label>

      <label className={styles.row}>
        <span>Межслов., px</span>
        <input className={styles.input} {...numField("wordSpacingPx", 0.5, round(computed.wordSpacing))} />
      </label>
    </div>
  );
});

/** Компактный плейсхолдер из computed-значения ("28.4px" → "28"). */
function round(v: string, suffix = "px"): string {
  const n = parseFloat(v);
  if (Number.isNaN(n)) return v || "—";
  return `${Math.round(n)}${suffix}`;
}
