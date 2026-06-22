import { Section } from "@/design-system";
import hands from "@/assets/photos/collage-hands.jpg";
import steps from "@/assets/photos/collage-steps.jpg";
import mist from "@/assets/photos/collage-mist.jpg";
import platform from "@/assets/photos/collage-platform.jpg";
import styles from "./Collage.module.css";

/**
 * Фото-коллаж после «Истории любви» (как в рефе): широкое фото рук сверху,
 * под ним сетка — слева высокий портрет, справа два кадра в столбик.
 * Боковой инсет 26px (как --gutter) задаём на внутреннем .inset, т.к. Section
 * с pad={false} проставляет инлайновый padding:0 и перебивает класс секции.
 */
export function Collage() {
  return (
    <Section className={styles.collage} pad={false} bare>
      <div className={styles.inset}>
        <img className={styles.hands} src={hands} alt="" />
        <div className={styles.grid}>
          <img className={styles.tall} src={steps} alt="" />
          <img className={styles.cell} src={mist} alt="" />
          <img className={styles.cell} src={platform} alt="" />
        </div>
      </div>
    </Section>
  );
}
