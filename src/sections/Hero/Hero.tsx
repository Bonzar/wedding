import { Section, Engraving, Button, Meta, PhotoFrame } from "@/design-system";
import { COUPLE, EVENT } from "@/content/wedding";
import styles from "./Hero.module.css";

/** Hero: надзаголовок, гравюра-беседка, имена, дата, CTA, фото, скролл-хинт. */
export function Hero() {
  return (
    <Section className={styles.hero}>
      <div className="eyebrow">Мы женимся</div>

      <div className={styles.gazebo}>
        <Engraving name="gazebo" height={263} />
      </div>

      <h1 className={`script ${styles.names}`}>
        {COUPLE.groomFull}
        <span className={styles.amp}>&amp;</span>
        {COUPLE.brideFull}
      </h1>

      <Meta className={styles.meta}>{EVENT.dateCity}</Meta>

      <Button href="#rsvp" className={styles.cta}>
        Открыть приглашение
      </Button>

      <PhotoFrame ratio="3 / 4" widthPct={72} />

      <div className={styles.scrollhint}>листайте вниз ⌄</div>
    </Section>
  );
}
