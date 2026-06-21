import { Section, Engraving, Button } from "@/design-system";
import { GIFT } from "@/content/wedding";
import styles from "./Gift.module.css";

/** Gift: карточка по центру — надзаголовок, гравюра, текст и CTA «Подарить». */
export function Gift() {
  return (
    <Section id="gift">
      <div className={styles.card}>
        <div className="eyebrow">Свадебный подарок</div>

        <div className={styles.ill}>
          <Engraving name="gift-money" height={70} />
        </div>

        <p className={`body ${styles.text}`}>{GIFT.text}</p>

        <Button href="#" className={styles.cta}>
          Подарить
        </Button>
      </div>
    </Section>
  );
}
