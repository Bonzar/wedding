import { Section, Engraving, Button, Meta } from "@/design-system";
import { COUPLE, EVENT } from "@/content/wedding";
import styles from "./Hero.module.css";

/** Точная гравюра-ротонда из рефа (refs/assets/design06/media). */
const GAZEBO = "e6dcd431d44fdffa1fa2bbee3ff06093";

/**
 * Обложка (страница-0 рефа design06): «Мы женимся» → гравюра-ротонда → полные
 * имена-скрипт в две строки с амперсандом → дата → пилюля «Открыть приглашение».
 */
export function Hero() {
  return (
    <Section className={styles.hero}>
      <div className={`eyebrow ${styles.eyebrow}`}>Мы женимся</div>

      <div className={styles.gazebo}>
        <Engraving name={GAZEBO} width={308} decorative />
      </div>

      <h1 className={`script ${styles.names}`}>
        <span className={styles.line}>{COUPLE.groomFull}</span>
        <span className={styles.amp}>&amp;</span>
        <span className={styles.line}>{COUPLE.brideFull}</span>
      </h1>

      <Meta className={styles.date}>{EVENT.coverDate}</Meta>

      <Button href="#invite" className={styles.cta}>
        Открыть приглашение
      </Button>
    </Section>
  );
}
