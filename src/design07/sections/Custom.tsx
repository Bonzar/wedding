// Кастомная (не-Canva) секция d07 — раздел БЕЗ пиксель-эталона (как Survey, см. EDITOR.md §9).
// Под ?baseline → null, чтобы не ломать полностраничный 0%-дифф. Рендерит пустой section.rGeu6w
// с бумажным фоном и высотой из манифеста (minHeight) — в неё кладут секционные additions
// (фича 1, элемент с section:<slug>) и/или ВРУЧНУЮ дописывают интерактив прямо здесь (как
// GuestList в Survey.tsx). Подпись-заглушка видна только в ?edit.
import { cqw } from "../layout";
import { assetUrl } from "../assetUrl";
import type { SectionEntry } from "../sectionManifest";

const PAPER = "/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg";

export default function Custom({ entry }: { entry: SectionEntry }) {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  if (params.has("baseline")) return null; // нет эталона → вне пиксель-диффа
  const editMode = params.has("edit");
  return (
    <section
      className="rGeu6w"
      id={entry.slug}
      data-eid={`${entry.slug}/section`}
      style={{
        minHeight: cqw(entry.minHeight ?? 800),
        backgroundColor: "var(--paper)",
        backgroundImage: `url(${assetUrl(PAPER)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Ручной интерактив пиши здесь (по примеру Survey). Заглушка — только в редакторе. */}
      {editMode && (
        <div style={{ padding: cqw(48), fontFamily: '"Jost", system-ui, sans-serif', fontSize: cqw(40), color: "var(--ink-muted)" }}>
          {entry.title ?? "Кастомная секция"} — добавляй элементы (они привяжутся сюда) или впиши интерактив в Custom.tsx
        </div>
      )}
    </section>
  );
}
