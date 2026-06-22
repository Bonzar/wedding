import { Section, Engraving, Button } from "@/design-system";
import { VENUE } from "@/content/wedding";
import styles from "./Location.module.css";

/** Location: надзаголовок, гравюра-здание, название площадки, CTA на карту. */
export function Location() {
  return (
    <Section id="location" className={styles.section}>
      <div className="eyebrow">Место</div>

      <div className={styles.ill}>
        <Engraving name="107d3604e653414d09eb3db40f5a7a8c" height={152} />
      </div>

      <p className={`meta ${styles.text}`}>Курорт «Три кедра», Сочи</p>

      <Button href={VENUE.mapUrl} target="_blank" rel="noopener" className={styles.cta}>
        Открыть на карте
      </Button>
    </Section>
  );
}
