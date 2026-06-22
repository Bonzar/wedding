import { Section, Engraving, Button, getSvg } from "@/design-system";
import { GIFT } from "@/content/wedding";
import styles from "./Gift.module.css";

/**
 * ТОЧНАЯ эталонная рамка-гравюра (хэш 589e28d0…): тонкий замкнутый рисованный
 * прямоугольник по всему периметру с лёгким дрожанием руки (как в эталоне Gift —
 * сплошная линия по контуру, БЕЗ грубых угловых скобок). Тянем её по всей
 * карточке через preserveAspectRatio="none" (нативное соотношение 287.7×273.3 ≈
 * 1.053, цель ~327×306 ≈ 1.07 — растяжение ~1.5%, штрих почти не искажается).
 * Перекрашиваем сплошную заливку гравюры #202020 → currentColor, чтобы рамка
 * шла цветом --ink, как в эталоне.
 */
const FRAME_HASH = "589e28d0c5849c11c2508c33b5eaf489";
const FRAME_SVG = getSvg(FRAME_HASH)
  .replace(/<svg\b/, '<svg preserveAspectRatio="none"')
  .replace(/\swidth="[^"]*"/, "")
  .replace(/\sheight="[^"]*"/, "")
  .replace(/#202020/gi, "currentColor");

/**
 * ТОЧНАЯ эталонная гравюра-связка (хэш 7735695f…): две перевязанные шнуром
 * пачки, шнур завязан бантом сверху — ровно как в эталоне Gift (ref_money_*.png).
 * Геометрия идентична байт-в-байт алиасу `gift-money` (тот же путь, добавлен лишь
 * fill="currentColor" для темизации). Рендерим через <Engraving name="gift-money">,
 * чтобы наследовать --ink и масштабироваться по высоте.
 */
const MONEY_NAME = "gift-money"; // = ref-хэш 7735695fff1109d7693486ab3e4925a1

/**
 * Gift: карточка по центру в рисованной рамке — надзаголовок, гравюра-стопка,
 * текст и CTA «Подарить».
 */
export function Gift() {
  return (
    <Section id="gift">
      <div className={styles.card}>
        <div
          className={styles.frame}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: FRAME_SVG }}
        />

        <div className="eyebrow">Свадебный подарок</div>

        <div className={styles.ill}>
          {/* стопка по эталону: ширина ~113 лог.px, высота ~70 лог.px (a/r ~1.61) */}
          <Engraving name={MONEY_NAME} height={70} />
        </div>

        <p className={`body ${styles.text}`}>{GIFT.text}</p>

        <Button href="#" className={styles.cta}>
          Подарить
        </Button>
      </div>
    </Section>
  );
}
