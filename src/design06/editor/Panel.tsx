// Inspector panel for the selected block. Two groups, per EDITOR.md decision B:
//   «Поле»  — geometry of the selected block (x, y, w, h, rot, scale);
//   «Текст» — typography of the block's nested text record (font, size, spacing, color).
// The block is the click target; its text record is found and edited from here.
import type { CSSProperties } from "react";
import type { El } from "../layout";

export type FieldKey = keyof El;

type Props = {
  eid: string;
  draft: El;
  geometry: boolean;
  crumbs: string[]; // ancestor block eids, outermost→nearest (excluding selected)
  textEid: string | null;
  textDraft: El | null;
  dirtyCount: number;
  saving: boolean;
  onSelect: (eid: string) => void;
  onField: (eid: string, key: FieldKey, value: string | number | undefined) => void;
  onSave: () => void;
  onReset: () => void;
};

const num = (v: unknown) => (v == null || v === "" ? "" : String(v));

export function Panel(p: Props) {
  const numField = (key: FieldKey, label: string, target: string, rec: El) => (
    <label className="d06e-f" key={key}>
      <span>{label}</span>
      <input
        type="number"
        step="any"
        value={num(rec[key])}
        onChange={(e) => p.onField(target, key, e.target.value === "" ? undefined : Number(e.target.value))}
      />
    </label>
  );
  const textField = (key: FieldKey, label: string, target: string, rec: El, ph = "") => (
    <label className="d06e-f" key={key}>
      <span>{label}</span>
      <input
        type="text"
        placeholder={ph}
        value={num(rec[key])}
        onChange={(e) => p.onField(target, key, e.target.value === "" ? undefined : e.target.value)}
      />
    </label>
  );

  return (
    <aside className="d06e-panel" onPointerDown={(e) => e.stopPropagation()}>
      <div className="d06e-head">
        <div className="d06e-crumbs">
          {p.crumbs.map((c) => (
            <button key={c} className="d06e-crumb" title={c} onClick={() => p.onSelect(c)}>
              {c.split("/")[1] ?? c}
            </button>
          ))}
          <span className="d06e-crumb d06e-cur">{p.eid.split("/")[1] ?? p.eid}</span>
        </div>
        <div className="d06e-eid">{p.eid}</div>
      </div>

      <div className="d06e-body">
        <section className="d06e-grp">
          <h4>Поле {!p.geometry && <em>— нет геометрии</em>}</h4>
          {p.geometry ? (
            <div className="d06e-grid">
              {numField("x", "X", p.eid, p.draft)}
              {numField("y", "Y", p.eid, p.draft)}
              {numField("w", "W", p.eid, p.draft)}
              {numField("h", "H", p.eid, p.draft)}
              {numField("rot", "↻ °", p.eid, p.draft)}
              {numField("scale", "scale", p.eid, p.draft)}
            </div>
          ) : (
            <p className="d06e-note">Этот элемент позиционируется маской/трансформом — двигать через родителя.</p>
          )}
        </section>

        {p.textEid && p.textDraft && (
          <section className="d06e-grp">
            <h4>Текст <em>{p.textEid.split("/")[1]}</em></h4>
            <div className="d06e-grid d06e-grid1">
              {textField("font", "Шрифт", p.textEid, p.textDraft, "Family_0, auto")}
              {numField("fontSize", "Кегль px", p.textEid, p.textDraft)}
              {textField("letterSpacing", "Трекинг", p.textEid, p.textDraft, "0em")}
              {textField("lineHeight", "Интерлиньяж", p.textEid, p.textDraft, "89px")}
              <label className="d06e-f d06e-color">
                <span>Цвет</span>
                <span className="d06e-colorrow">
                  <input
                    type="color"
                    value={toHex(p.textDraft.color)}
                    onChange={(e) => p.onField(p.textEid!, "color", e.target.value)}
                  />
                  <input
                    type="text"
                    value={num(p.textDraft.color)}
                    placeholder="rgb(…)"
                    onChange={(e) => p.onField(p.textEid!, "color", e.target.value === "" ? undefined : e.target.value)}
                  />
                </span>
              </label>
            </div>
          </section>
        )}
      </div>

      <div className="d06e-foot">
        <span className="d06e-dirty">{p.dirtyCount > 0 ? `● ${p.dirtyCount} изм.` : "нет изменений"}</span>
        <button className="d06e-btn" disabled={p.dirtyCount === 0} onClick={p.onReset}>
          Сбросить
        </button>
        <button className="d06e-btn d06e-primary" disabled={p.dirtyCount === 0 || p.saving} onClick={p.onSave}>
          {p.saving ? "Сохраняю…" : "Сохранить"}
        </button>
      </div>
    </aside>
  );
}

// Best-effort rgb()/hex → #rrggbb for the color swatch (text input keeps the source value).
function toHex(color?: CSSProperties["color"]): string {
  if (typeof color !== "string") return "#000000";
  const m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (m) return "#" + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  return "#000000";
}
