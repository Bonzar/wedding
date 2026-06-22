import { Section, Engraving } from "@/design-system";
import { ATTIRE } from "@/content/wedding";
import styles from "./Attire.module.css";

/** Attire: дресс-код — верхняя гравюра-дерево, эйброу, пара платье+костюм и текст-просьба. */
export function Attire() {
  return (
    <Section id="attire" className={styles.section}>
      {/* Верхняя гравюра — линия деревьев/кустов с забором, прижата влево (как в эталоне). */}
      <Engraving
        name="64f71e99826763bc98d6c82a343e6570"
        width={182}
        className={styles.tree}
      />

      <div className="eyebrow">Дресс-код</div>

      <div className={styles.ill}>
        {/* Эталонная пара: платье слева + костюм справа — две отдельные точные
            гравюры (ee7d5923 платье, ea566c5e костюм), выровнены по верху.
            Размеры заданы по поэлементному замеру эталона (ref_attire):
            платье 63×74 лог, костюм 48×69 лог — точные W×H через CSS на svg,
            т.к. внутренний aspect SVG отличается от эталонного. */}
        <Engraving name="ee7d592379c09854120b6773451c3039" height={74} className={styles.dress} />
        <Engraving name="ea566c5e9283157e06f40d116980b292" height={69} className={styles.suit} />
      </div>

      <p className={`body ${styles.text}`}>{ATTIRE.text}</p>
    </Section>
  );
}
