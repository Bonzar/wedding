import { Section } from "@/design-system";
import { SURVEY_INTRO } from "@/content/wedding";
import { GuestList } from "@/rsvp/components/GuestList";
import styles from "./Survey.module.css";

/** Секция-опрос: вступление + список гостей (RSVP). */
export function Survey() {
  return (
    <Section id="survey" className="survey">
      <div className="eyebrow">{SURVEY_INTRO.eyebrow}</div>
      <h2 className={`script gap-s ${styles.title}`}>{SURVEY_INTRO.title}</h2>
      <p className={`body gap-m ${styles.text}`}>{SURVEY_INTRO.text}</p>
      <GuestList />
    </Section>
  );
}
