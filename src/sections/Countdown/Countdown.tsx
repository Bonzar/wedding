import { Section, Engraving } from "@/design-system";
import { WEDDING_DATE_ISO } from "@/content/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import styles from "./Countdown.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Обратный отсчёт до дня свадьбы. */
export function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE_ISO);
  return (
    <Section className="countdown">
      <div className={styles.corner}>
        {/* Точная эталонная гравюра 282cc879 (птица-на-ветке, смотрит вправо). */}
        <Engraving name="282cc87943f727e5b2862c120f6538e8" height={74} />
      </div>
      <div className={`eyebrow ${styles.eyebrow}`}>Скоро наш день</div>
      <div className={styles.cd}>
        <Cell value={String(days)} label="Дни" />
        <span className={styles.sep}>:</span>
        <Cell value={pad(hours)} label="Часы" />
        <span className={styles.sep}>:</span>
        <Cell value={pad(minutes)} label="Минуты" />
        <span className={styles.sep}>:</span>
        <Cell value={pad(seconds)} label="Секунды" />
      </div>
    </Section>
  );
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.cell}>
      <div className={styles.num}>{value}</div>
      <div className={styles.lab}>{label}</div>
    </div>
  );
}
