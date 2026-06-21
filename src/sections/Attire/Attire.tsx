import { Section, Engraving } from "@/design-system";
import { ATTIRE } from "@/content/wedding";
import styles from "./Attire.module.css";

/** Attire: дресс-код — гравюра-пара, текст-просьба и палитра из пяти тонов. */
export function Attire() {
  return (
    <Section id="attire">
      <div className="eyebrow">Дресс-код</div>

      <div className={styles.ill}>
        <Engraving name="attire-pair" height={118} />
      </div>

      <p className={`body ${styles.text}`}>{ATTIRE.text}</p>

      <div className={styles.palette}>
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </Section>
  );
}
