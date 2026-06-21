import { Section, Engraving, Button } from "@/design-system";
import { VENUE } from "@/content/wedding";
import styles from "./Location.module.css";

/** Location: надзаголовок, гравюра-здание, название площадки, CTA на карту. */
export function Location() {
  return (
    <Section id="location">
      <div className="eyebrow">Место</div>

      <div className={styles.ill}>
        <Engraving name="building" height={150} />
      </div>

      <p className={`meta ${styles.text}`}>{VENUE.name}</p>

      <Button href={VENUE.mapUrl} target="_blank" rel="noopener" className={styles.cta}>
        Открыть на карте
      </Button>
    </Section>
  );
}
