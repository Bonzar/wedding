import { Section, Divider } from "@/design-system";
import { CALENDAR } from "@/content/wedding";
import styles from "./Calendar.module.css";

/** Calendar: разделитель, карточка месяца с сеткой дней (выделен день свадьбы), примечание, разделитель. */
export function Calendar() {
  return (
    <Section id="calendar">
      <Divider style={{ margin: "0 0 calc(6 * var(--u))" }} />

      <div className={styles.cal}>
        <div className={styles.mon}>{CALENDAR.monthLabel}</div>

        <div className={styles.grid}>
          {CALENDAR.weekdays.map((w) => (
            <span key={w}>{w}</span>
          ))}
          {Array.from({ length: CALENDAR.leadEmpty }, (_, i) => (
            <i key={`empty-${i}`} />
          ))}
          {Array.from({ length: CALENDAR.days }, (_, i) => {
            const d = i + 1;
            return d === CALENDAR.highlight ? (
              <b key={d} className={styles.hi}>
                {d}
              </b>
            ) : (
              <b key={d}>{d}</b>
            );
          })}
        </div>

        <div className={styles.note}>{CALENDAR.note}</div>
      </div>

      <Divider style={{ marginTop: "calc(24 * var(--u))" }} />
    </Section>
  );
}
