import { Section } from "@/design-system";
import { DETAILS } from "@/content/wedding";
import styles from "./Details.module.css";

/** Details: надзаголовок и левовыровненные блоки (заголовок + текст). В эталоне нижней гравюры нет. */
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
    </Section>
  );
}
