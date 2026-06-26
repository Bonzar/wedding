// Панель управления секциями (фичи 2–3): порядок ↑/↓, скрыть/показать, высота (minHeight),
// добавить кастомную секцию. Источник правды — manifestStore; Design07 ре-рендерит по нему.
import { useManifest, manifestStore } from "./manifestStore";

export function SectionsPanel({ onClose, onAddCustom }: { onClose: () => void; onAddCustom: (slug: string) => void }) {
  const manifest = useManifest();
  return (
    <div className="d06e-sections" onPointerDown={(e) => e.stopPropagation()}>
      <div className="d06e-sections-hd">
        <span>Секции</span>
        <button className="d06e-x" onClick={onClose} title="Закрыть">✕</button>
      </div>
      <div className="d06e-sections-body">
        {manifest.map((e, i) => {
          const hidden = e.enabled === false;
          return (
            <div key={e.slug} className="d06e-sec-row" data-hidden={hidden}>
              <span className="d06e-sec-name" title={e.slug}>{e.title ?? e.slug}{e.custom ? " ✎" : ""}</span>
              <button className="d06e-sec-btn" disabled={i === 0} title="Выше" onClick={() => manifestStore.move(e.slug, -1)}>↑</button>
              <button className="d06e-sec-btn" disabled={i === manifest.length - 1} title="Ниже" onClick={() => manifestStore.move(e.slug, 1)}>↓</button>
              <button className="d06e-sec-btn" title={hidden ? "Показать" : "Скрыть"} onClick={() => (hidden ? manifestStore.restore(e.slug) : manifestStore.remove(e.slug))}>{hidden ? "🚫" : "👁"}</button>
              <label className="d06e-sec-h" title="Высота секции, px канвы (пусто = натуральная)">
                h<input
                  type="number"
                  min={0}
                  value={e.minHeight ?? ""}
                  placeholder="auto"
                  onChange={(ev) => {
                    const v = ev.target.value.trim();
                    manifestStore.patch(e.slug, { minHeight: v === "" ? undefined : Math.max(0, Math.round(Number(v) || 0)) });
                  }}
                />
              </label>
            </div>
          );
        })}
      </div>
      <button className="d06e-tool d06e-sec-add" onClick={() => onAddCustom(manifestStore.addCustom())}>+ Кастомная секция</button>
    </div>
  );
}
