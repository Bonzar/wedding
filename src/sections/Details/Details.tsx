import { Section, Engraving } from "@/design-system";
import { DETAILS } from "@/content/wedding";
import styles from "./Details.module.css";

/** Details: надзаголовок, левовыровненные блоки (заголовок + текст), гравюра-здание. */
export function Details() {
  return (
    <Section wrapStyle={{ textAlign: "left" }}>
      <div style={{ textAlign: "center" }}>
        <div className="eyebrow">Детали торжества</div>
      </div>

      {DETAILS.map((d) => (
        <div key={d.title} className={styles.blk}>
          <div className="sub">{d.title}</div>
          <p className={`body ${styles.text}`}>{d.text}</p>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "calc(26*var(--u))" }}>
        <Engraving name="building" height={123} />
      </div>
    </Section>
  );
}
