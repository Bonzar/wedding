import { Section, Engraving } from "@/design-system";
import { CLOSING, COUPLE } from "@/content/wedding";
import styles from "./Closing.module.css";

/** Closing: благодарственный текст, ниже — имена-скрипт слева и птица-на-ветке справа. */
export function Closing() {
  return (
    <Section className={styles.closing}>
      <p className={`body ${styles.text}`}>{CLOSING.text}</p>

      <div className={styles.bottomRow}>
        <div className={`script ${styles.names}`}>
          {COUPLE.groomShort}
          <span className={styles.amp}>&amp;</span>
          {COUPLE.brideShort}
        </div>
        {/* точная гравюра птица-на-ветке из эталона */}
        <Engraving name="13b45d4485f6e81e28fd0ad0adbd3d36" height={113} className={styles.bird} />
      </div>
    </Section>
  );
}
