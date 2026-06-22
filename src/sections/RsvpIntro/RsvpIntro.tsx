import { Section, Engraving, Button } from "@/design-system";
import { RSVP_INTRO } from "@/content/wedding";
import styles from "./RsvpIntro.module.css";

/** RsvpIntro: вступление к RSVP — гравюра-дерево, заголовок, текст, CTA к опросу. */
export function RsvpIntro() {
  return (
    <Section id="rsvp" bare className={styles.rsvp}>
      <div className={styles.tree}>
        <Engraving name="tree-large" height={331} />
      </div>

      <div className={styles.rwrap}>
        <div className={styles.rttl}>{RSVP_INTRO.title}</div>
        <p className={`body ${styles.text}`}>{RSVP_INTRO.text}</p>
        <Button href="#survey" className={styles.cta}>
          Ответить
        </Button>
      </div>
    </Section>
  );
}
