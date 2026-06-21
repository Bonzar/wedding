# Гайд по переносу секций в React (дизайн-система)

Каждая секция лендинга переносится из исходного `build_index.py` (источник правды
по разметке и пиксельным значениям; он же = `refs/sections/<name>.html`) в
React-компонент на нашей дизайн-системе. Эталон — уже готовый
`src/sections/Hero/Hero.tsx` + `Hero.module.css`. Делай так же.

## Железные правила

1. **Файлы:** `src/sections/<Name>/<Name>.tsx` и `src/sections/<Name>/<Name>.module.css`.
   Имя компонента — PascalCase (`WeddingOf`, `Location`, …).
2. **Флюид-единицы:** любое значение «в пикселях макета» (база ширины листа 440px)
   пишется в CSS как `calc(N * var(--u))`. Это ТОЧНАЯ замена прежнему px→cqw.
   Пример: `font-size: calc(42 * var(--u));` `margin-top: calc(30 * var(--u));`
   `padding: calc(20 * var(--u)) calc(18 * var(--u));`. Проценты, доли (`4/5`),
   `1px` бордеры и `rem` — оставляй как есть (их прежний билдер тоже не трогал).
3. **Цвета/шрифты — только токены:** `var(--ink)`, `--ink-strong`, `--ink-muted`,
   `--text`, `--line`, `--on-ink`, `--paper`, `--paper-bright`; шрифты `--f-script`,
   `--f-label`, `--f-body`, `--f-num`. Никаких хардкод-цветов (кроме тех, что уже
   были в исходнике, напр. `#0f1620` в color-mix).
4. **Иллюстрации** — через `<Engraving name="building" height={150} />` (размер в
   px макета). Для ширины: `width={…}`. Зеркало: `flip`. Имена = файлы из
   `assets/illustrations/*.svg` без расширения.
5. **CSS-модули, без глобальных селекторов.** Исходник использует вложенные
   селекторы (`.journey .step`, `.tl-item.l`) — переноси их в módule-классы и вешай
   классы прямо на элементы (`styles.step`, `styles.itemL`). Псевдоэлементы
   (`.tl::before`), `:nth-child`, медиазапросы — пиши в модуле как обычно.
6. **Текст — из контента, не хардкодь.** `import { ... } from "@/content/wedding"`.

## API дизайн-системы (`@/design-system`)

```tsx
import { Section, Engraving, Button, PhotoFrame, Divider, u } from "@/design-system";
```

- `<Section id? className? ink? bare? wrapStyle? style?>` — секция. По умолчанию
  оборачивает детей в центрированный `.wrap` с макс-шириной. Передай
  `wrapStyle={{ textAlign: "left" }}` чтобы изменить выравнивание (нужно для
  `details`). Если у секции своя нестандартная обёртка (как у `rsvp` — `.rwrap`),
  ставь `bare` и верстай обёртку сам.
- `<Engraving name height|width flip />` — инлайновый SVG, наследует цвет.
- `<Button href? onClick? target? rel? block? className? style?>` — пилюля `.btn`
  (рендерит `<a>` при href, иначе `<button>`).
- `<PhotoFrame ratio="4 / 5" widthPct={100} label="ваше фото" />` — фото-плейсхолдер
  в рамке. `label=""` -> пустой плейсхолдер.
- `<Divider name? height? />` — орнамент (по умолч. flourish-thin, h=12).
- Глобальные утилиты-классы (можно использовать в `className`): `eyebrow`, `script`,
  `meta`, `body`, `sub`, `amp`, `btn`, `divider`, `gap-s/-m/-l`. Они уже стилизованы
  в `base.css`. Комбинируй: `className={`script ${styles.title}`}`.
- `u(n)` -> строка `calc(n * var(--u))` для инлайновых размеров в TSX.

## Эталон (Hero)

```tsx
import { Section, Engraving, Button, Meta, PhotoFrame } from "@/design-system";
import { COUPLE, EVENT } from "@/content/wedding";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <Section className={styles.hero}>
      <div className="eyebrow">Мы женимся</div>
      <div className={styles.gazebo}><Engraving name="gazebo" height={263} /></div>
      <h1 className={`script ${styles.names}`}>
        {COUPLE.groomFull}<span className={styles.amp}>&amp;</span>{COUPLE.brideFull}
      </h1>
      <Meta className={styles.meta}>{EVENT.dateCity}</Meta>
      <Button href="#rsvp" className={styles.cta}>Открыть приглашение</Button>
      <PhotoFrame ratio="3 / 4" widthPct={72} />
      <div className={styles.scrollhint}>листайте вниз ⌄</div>
    </Section>
  );
}
```

`Hero.module.css` — все размеры через `calc(N * var(--u))`. Смотри файл целиком как образец.

## Проверка

После переноса секция должна и собираться (`tsc --noEmit`), и визуально совпадать
с исходным рендером (скриншот-тесты сверят с эталоном и с макетом design06).
Не добавляй контент, которого нет в исходнике; не меняй порядок элементов.
