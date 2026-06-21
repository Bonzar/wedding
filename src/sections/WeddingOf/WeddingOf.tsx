import { Section, PhotoFrame } from "@/design-system";
import { COUPLE } from "@/content/wedding";
import styles from "./WeddingOf.module.css";

/** WeddingOf: фото в рамке, надзаголовок «Свадьба», короткие имена пары. */
export function WeddingOf() {
  return (
    <Section className={styles.weddingOf}>
      <div className={styles.photoWrap}>
        <PhotoFrame ratio="181 / 194" widthPct={100} label="" />
      </div>

      <div className={`eyebrow ${styles.eyebrow}`}>Свадьба</div>

      <h2 className={`script ${styles.names}`}>
        {COUPLE.groomShort}
        <span className="amp">&amp;</span>
        {COUPLE.brideShort}
      </h2>
    </Section>
  );
}
