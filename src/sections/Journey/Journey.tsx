import { Section, Engraving, PhotoFrame } from "@/design-system";
import { JOURNEY } from "@/content/wedding";
import styles from "./Journey.module.css";

/** Высоты деко-гравюр по шагам: peony, butterfly, floral-spray. */
const DECO_HEIGHTS = [144, 120, 144];

/** Journey: «История любви» — три шага с фото и подписями, разделённые стрелками. */
export function Journey() {
  return (
    <Section id="journey">
      <div className="eyebrow">История любви</div>

      {JOURNEY.map((step, i) => (
        <div key={i}>
          <div className={`${styles.step}${step.reverse ? ` ${styles.rev}` : ""}`}>
            <div className={styles.phWrap}>
              <PhotoFrame ratio="4 / 5" widthPct={100} />
              <p className={styles.cap}>{step.caption}</p>
            </div>
            <div className={styles.deco}>
              <Engraving name={step.illustration} height={DECO_HEIGHTS[i]} />
            </div>
          </div>

          {i < 2 && (
            <div className={styles.arrow}>
              <Engraving name="arrow-dashed-curved" height={56} flip={i === 1} />
            </div>
          )}
        </div>
      ))}

      <div className={styles.foot}>
        <Engraving name="building" height={96} />
      </div>
    </Section>
  );
}
