import { Section, Engraving } from "@/design-system";
import { CLOSING, COUPLE } from "@/content/wedding";
import styles from "./Closing.module.css";

/** Closing: благодарственный текст, имена пары и пара птиц с веточкой. */
export function Closing() {
  return (
    <Section className="closing">
      <p className={`body ${styles.text}`}>{CLOSING.text}</p>

      <div className={styles.names}>
        {COUPLE.groomShort}
        <span
          className="amp"
          style={{ fontFamily: "var(--f-body)", color: "var(--ink-muted)" }}
        >
          &amp;
        </span>
        {COUPLE.brideShort}
      </div>

      <div className={styles.birds}>
        <Engraving name="bird" height={64} />
        <Engraving name="sprig" height={34} />
        <Engraving name="bird" height={64} flip />
      </div>
    </Section>
  );
}
