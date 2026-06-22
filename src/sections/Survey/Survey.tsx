import { Section, Engraving } from "@/design-system";
import { SURVEY_INTRO } from "@/content/wedding";
import { GuestList } from "@/rsvp/components/GuestList";
import styles from "./Survey.module.css";

/** Секция-опрос: вступление + список гостей (RSVP).
 *  Эталона у секции нет — держим её в ритме соседей (RsvpIntro/Closing):
 *  эйброу + скрипт + тело-сериф, плюс тонкая горизонтальная веточка-гравюра
 *  (точный хэш ref/13b45d…) как декоративный разделитель между заголовком и
 *  текстом, чтобы секция не выглядела «голой». */
export function Survey() {
  return (
    <Section id="survey" className={`survey ${styles.section}`}>
      <div className="eyebrow">{SURVEY_INTRO.eyebrow}</div>
      <h2 className={`script gap-s ${styles.title}`}>{SURVEY_INTRO.title}</h2>
      <Engraving
        name="13b45d4485f6e81e28fd0ad0adbd3d36"
        width={120}
        className={styles.sprigMark}
      />
      <p className={`body ${styles.text}`}>{SURVEY_INTRO.text}</p>
      <GuestList />
    </Section>
  );
}
