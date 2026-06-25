// design06 section Gift (Canva id PB09PH75zdFrcMmz). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Gift.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Gift.layout";
import { assetUrl } from "../assetUrl";

// Фоновая иллюстрация-гравюра (повёрнутое фото на всю секцию).
function Backdrop() {
  return (
    <div className={styles.GDnEHQ} data-eid="gift/backdrop" style={elStyle(layout["gift/backdrop"])}>
      <div className={styles.o2Yl2g}>
        <div className={styles._mXnjA} lang="en" data-eid="gift/content" style={elStyle(layout["gift/content"])}>
          <div className={styles._6t4CHA}>
            <div className={styles.a26Xuw}>
              <div className={styles.fbzKiw} data-eid="gift/fill" style={elStyle(layout["gift/fill"])} />
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="gift/backdrop-image" style={elStyle(layout["gift/backdrop-image"])}>
                    <img loading="lazy" decoding="async" className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-eid="gift/box-1" style={elStyle(layout["gift/box-1"])} />
          <Illustration />
          <Sparkle />
          <ButtonPill />
          <Title />
          <Paragraph />
          <ButtonLabel />
        </div>
      </div>
    </div>
  );
}

// Крупная иллюстрация подарка (основной блоб).
function Illustration() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="gift/illustration" style={elStyle(layout["gift/illustration"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="gift/illustration-image" style={elStyle(layout["gift/illustration-image"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PB09PH75zdFrcMmz_0.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="gift/box-2" style={elStyle(layout["gift/box-2"])} />
      </div>
    </div>
  );
}

// Декоративный блик-блёстка (вторичный блоб).
function Sparkle() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="gift/sparkle" style={elStyle(layout["gift/sparkle"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="gift/sparkle-image" style={elStyle(layout["gift/sparkle-image"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PB09PH75zdFrcMmz_1.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="gift/box-3" style={elStyle(layout["gift/box-3"])} />
      </div>
    </div>
  );
}

// Pill-подложка кнопки «Send Gift» (синяя плашка с clip-path).
function ButtonPill() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="gift/button-pill" style={elStyle(layout["gift/button-pill"])}>
      <div data-eid="gift/box-4" style={elStyle(layout["gift/box-4"])}>
        <div className={styles.hWv4NA} data-eid="gift/mask" style={elStyle(layout["gift/mask"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id75">
                <path d="M128.0000000300142,0L1033.7485942066182,0C1104.4410421613297,0 1161.7485942366325,57.3075520753027 1161.7485942366325,128.0000000300142C1161.7485942366325,198.69244798472567 1104.4410421613297,255.99999994281853 1033.7485942066182,255.99999994281853L128.0000000300142,255.99999994281853C57.3075520753027,255.99999994281853 0,198.69244798472567 0,128.0000000300142C0,57.3075520753027 57.3075520753027,0 128.0000000300142,0Z" />
              </clipPath>
            </defs>
          </svg>
          {/* d07: SVG-клип-пилюля → CSS inset(round 9999px) (масштабируется; натив идентичен). */}
          <div className={styles.bFnJ2A} data-eid="gift/button-pill-fill" style={{ ...elStyle(layout["gift/button-pill-fill"]), clipPath: "inset(0 round 9999px)" }} />
        </div>
      </div>
    </div>
  );
}

// Заголовок «Wedding Gift».
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="gift/title" style={elStyle(layout["gift/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="gift/title-box" style={elStyle(layout["gift/title-box"])}>
        <div data-eid="gift/box-5" style={elStyle(layout["gift/box-5"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="gift/title-text" style={elStyle(layout["gift/title-text"])}>
                  <span className={styles.a_GcMg} data-eid="gift/span-1" style={elStyle(layout["gift/span-1"])}>
                    {"СВАДЕБНЫЙ ПОДАРОК"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Абзац-приглашение к подарку.
function Paragraph() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="gift/paragraph" style={elStyle(layout["gift/paragraph"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="gift/paragraph-box" style={elStyle(layout["gift/paragraph-box"])}>
        <div data-eid="gift/box-6" style={elStyle(layout["gift/box-6"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="gift/paragraph-text" style={elStyle(layout["gift/paragraph-text"])}>
                  <span className={styles.a_GcMg} data-eid="gift/span-2" style={elStyle(layout["gift/span-2"])}>
                    {"Ваше присутствие — для нас будет самым лучшим подарком. Мы любим цветы, но через несколько дней улетаем и не сможем забрать их ссобой. Если вы хотите сделать подарок, вместо букета можно выбрать что-то, что сохранится на память об этом дне."}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Подпись кнопки «Send Gift».
function ButtonLabel() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="gift/button" style={elStyle(layout["gift/button"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="gift/button-box" style={elStyle(layout["gift/button-box"])}>
        <div data-eid="gift/box-7" style={elStyle(layout["gift/box-7"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="gift/button-text" style={elStyle(layout["gift/button-text"])}>
                  <span className={styles.a_GcMg} data-eid="gift/span-3" style={elStyle(layout["gift/span-3"])}>
                    {""}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Gift() {
  return (
      <section className={"rGeu6w"} id="PB09PH75zdFrcMmz" data-scroll-ready="true" data-eid="gift/sectionbox" style={elStyle(layout["gift/sectionbox"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="gift/frame" style={elStyle(layout["gift/frame"])}>
            <div className={styles.twbtjQ}>
              <Backdrop />
              <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="gift/overlay" style={elStyle(layout["gift/overlay"])} />
            </div>
          </div>
        </div>
      </section>
  );
}
