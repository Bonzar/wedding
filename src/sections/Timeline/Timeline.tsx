import { Section, Engraving } from "@/design-system";
import { TIMELINE } from "@/content/wedding";
import styles from "./Timeline.module.css";

/** Timeline: программа дня — чередующиеся карточки время/заголовок по центральной линии. */
export function Timeline() {
  return (
    <Section id="timeline" className={styles.timeline}>
      <div className={styles.decoLeft}>
        <Engraving name="bd32a24ce8c9e350adc04acd7823e3f2" height={141} flip />
      </div>
      <div className={styles.decoRight}>
        <Engraving name="bd32a24ce8c9e350adc04acd7823e3f2" height={203} />
      </div>

      <div className="eyebrow">Программа дня</div>

      <div className={styles.tl}>
        {TIMELINE.map((it, i) => (
          <div
            key={it.time}
            className={styles.item + " " + (i % 2 === 0 ? styles.itemR : styles.itemL)}
          >
            <div className={styles.time}>{it.time}</div>
            <div className={styles.title}>{it.title}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
