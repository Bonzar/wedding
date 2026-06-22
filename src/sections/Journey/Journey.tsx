import { Section, Engraving, PhotoFrame } from "@/design-system";
import { JOURNEY } from "@/content/wedding";
import journey1 from "@/assets/photos/journey-1-terrace.jpg";
import journey2 from "@/assets/photos/journey-2-pier.jpg";
import journey3 from "@/assets/photos/journey-3-proposal.jpg";
import styles from "./Journey.module.css";

/** Реальные фото шагов истории (как в рефе). */
const PHOTOS = [journey1, journey2, journey3];
/**
 * Точные эталонные гравюры по шагам (имена = хэш-SVG из эталона):
 *  - peony       = 99b8b4eb (слоистый пион, шаг 1)
 *  - butterfly   = 9da97d0c (монарх, шаг 2)
 *  - wildflowers = 9b278d0f (шиповник на ветке, шаг 3)
 * Перекрывают step.illustration из content, т.к. в рефе шаг 3 — именно шиповник,
 * а не букет (floral-spray=bd32a24c).
 */
const DECO = ["peony", "butterfly", "wildflowers"];
/** Высоты деко-гравюр по шагам (px макета, база 440), замерены по эталону. */
const DECO_HEIGHTS = [146, 150, 150];

/** Journey: «История любви» — три шага с фото и подписями, разделённые стрелками. */
export function Journey() {
  return (
    <Section id="journey" className={styles.section}>
      <div className="eyebrow">История любви</div>

      {JOURNEY.map((step, i) => (
        <div key={i}>
          <div className={`${styles.step}${step.reverse ? ` ${styles.rev}` : ""}`}>
            <div className={styles.phWrap}>
              <PhotoFrame ratio="5 / 4" widthPct={100} label="">
                <img className={styles.photo} src={PHOTOS[i]} alt="" />
              </PhotoFrame>
              <p className={styles.cap}>{step.caption}</p>
            </div>
            <div className={styles.deco}>
              <Engraving name={DECO[i]} height={DECO_HEIGHTS[i]} />
            </div>
          </div>

          {/* Пунктирная стрелка (точная f2e5186f), повёрнута; после шага 1 справа,
              после шага 2 — слева, головкой вниз. */}
          {i < 2 && (
            <div className={styles.arrow}>
              <Engraving
                name="f2e5186f2bd31557a5e340945dbcfbb7"
                height={84}
                className={i === 0 ? styles.arrowSvg1 : styles.arrowSvg2}
              />
            </div>
          )}
        </div>
      ))}

      {/* Каменный мост (точная гравюра 788f0425) — низ секции. */}
      <div className={styles.foot}>
        <Engraving name="788f042581b30bb1e7f1d54621a13d07" height={98} />
      </div>
    </Section>
  );
}
