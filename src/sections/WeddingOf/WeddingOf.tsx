import { Section, Engraving } from "@/design-system";
import { COUPLE } from "@/content/wedding";
import openingPortrait from "@/assets/photos/opening-portrait.jpg";
import styles from "./WeddingOf.module.css";

/**
 * Открытие (как в рефе): фото в тонкой рамке-уголках (двойные прямые штрихи,
 * пересекающиеся в углах) → эйброу «Свадьба» → имена-скрипт. По нижним бокам —
 * две гравюры-леса (forest = c4d62702), левая обычная + правая зеркальная,
 * прижатые к краям листа; имена лежат поверх (z-index).
 *
 * Рамка нарисована тонкими прямыми линиями (геометрия), т.к. среди ref-гравюр
 * нет тонкой прямой рамки-уголков с пересечением (см. отчёт): 735e702c
 * (= shared frame-corners) — кистевая/жирная и рефу не соответствует.
 */
export function WeddingOf() {
  return (
    <Section id="invite" className={styles.weddingOf}>
      {/* фото в рамке: viewBox рамки = фото 181×204 + поля 12 по краям (для засечек) */}
      <div className={styles.photoWrap}>
        <img className={styles.photo} src={openingPortrait} alt="Владислав и Ольга" />
        <svg
          className={styles.frame}
          viewBox="0 0 193 218"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Слой = фото 181×206 + 6 поля по краям. Фото-бокс: x6..187, y6..212.
             Штрихи внешнего контура идут по краю фото и чуть перехлёстывают углы. */}
          <line x1="2" y1="6" x2="191" y2="6" />
          <line x1="2" y1="212" x2="191" y2="212" />
          <line x1="6" y1="2" x2="6" y2="216" />
          <line x1="187" y1="2" x2="187" y2="216" />
          {/* внутренний контур, отступ ~9 внутрь */}
          <line x1="9" y1="15" x2="184" y2="15" />
          <line x1="9" y1="203" x2="184" y2="203" />
          <line x1="15" y1="9" x2="15" y2="209" />
          <line x1="178" y1="9" x2="178" y2="209" />
        </svg>
      </div>

      <div className={`eyebrow ${styles.eyebrow}`}>Свадьба</div>

      <h2 className={`script ${styles.names}`}>
        {COUPLE.groomShort}
        <span className="amp">&amp;</span>
        {COUPLE.brideShort}
      </h2>

      {/* лес по нижним углам: левый куст + зеркальный правый, прижаты к краям листа */}
      <div className={`${styles.forest} ${styles.forestLeft}`} aria-hidden="true">
        <Engraving name="forest" height={260} decorative />
      </div>
      <div className={`${styles.forest} ${styles.forestRight}`} aria-hidden="true">
        <Engraving name="forest" height={260} flip decorative />
      </div>
    </Section>
  );
}
