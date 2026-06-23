// design06 section Gift (Canva id PB09PH75zdFrcMmz). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Gift.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "./Gift.module.css";
import { layout } from "./Gift.layout";

// Фоновая иллюстрация-гравюра (повёрнутое фото на всю секцию).
function Backdrop() {
  return (
    <div className={styles.GDnEHQ} data-eid="gift/backdrop" style={elStyle(layout["gift/backdrop"])}>
      <div className={styles.o2Yl2g}>
        <div className={styles._mXnjA} lang="en" data-eid="gift/3" style={elStyle(layout["gift/3"])}>
          <div className={styles._6t4CHA}>
            <div className={styles.a26Xuw}>
              <div className={styles.fbzKiw} data-eid="gift/4" style={elStyle(layout["gift/4"])} />
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="gift/backdrop-image" style={elStyle(layout["gift/backdrop-image"])}>
                    <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-eid="gift/6" style={elStyle(layout["gift/6"])} />
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
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PB09PH75zdFrcMmz_0.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="gift/9" style={elStyle(layout["gift/9"])} />
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
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PB09PH75zdFrcMmz_1.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="gift/12" style={elStyle(layout["gift/12"])} />
      </div>
    </div>
  );
}

// Pill-подложка кнопки «Send Gift» (синяя плашка с clip-path).
function ButtonPill() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="gift/button-pill" style={elStyle(layout["gift/button-pill"])}>
      <div data-eid="gift/14" style={elStyle(layout["gift/14"])}>
        <div className={styles.hWv4NA} data-eid="gift/15" style={elStyle(layout["gift/15"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id75">
                <path d="M128.0000000300142,0L1033.7485942066182,0C1104.4410421613297,0 1161.7485942366325,57.3075520753027 1161.7485942366325,128.0000000300142C1161.7485942366325,198.69244798472567 1104.4410421613297,255.99999994281853 1033.7485942066182,255.99999994281853L128.0000000300142,255.99999994281853C57.3075520753027,255.99999994281853 0,198.69244798472567 0,128.0000000300142C0,57.3075520753027 57.3075520753027,0 128.0000000300142,0Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid="gift/button-pill-fill" style={elStyle(layout["gift/button-pill-fill"])} />
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
        <div data-eid="gift/19" style={elStyle(layout["gift/19"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="gift/title-text" style={elStyle(layout["gift/title-text"])}>
                  <span className={styles.a_GcMg} data-eid="gift/21" style={elStyle(layout["gift/21"])}>
                    {"Wedding Gift"}
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
        <div data-eid="gift/24" style={elStyle(layout["gift/24"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="gift/paragraph-text" style={elStyle(layout["gift/paragraph-text"])}>
                  <span className={styles.a_GcMg} data-eid="gift/26" style={elStyle(layout["gift/26"])}>
                    {"Your presence is the greatest gift of all,"}
                    <br />
                    {"and it is something we truly look forward"}
                    <br />
                    {"to. If you would like to bless us further, a"}
                    <br />
                    {"contribution would mean so much as we"}
                    <br />
                    {"begin this new chapter together."}
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
        <div data-eid="gift/29" style={elStyle(layout["gift/29"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="gift/button-text" style={elStyle(layout["gift/button-text"])}>
                  <span className={styles.a_GcMg} data-eid="gift/31" style={elStyle(layout["gift/31"])}>
                    {"Send Gift"}
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
      <section className={"rGeu6w"} id="PB09PH75zdFrcMmz" data-scroll-ready="true" data-eid="gift/0" style={elStyle(layout["gift/0"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="gift/1" style={elStyle(layout["gift/1"])}>
            <div className={styles.twbtjQ}>
              <Backdrop />
              <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="gift/32" style={elStyle(layout["gift/32"])} />
            </div>
          </div>
        </div>
      </section>
  );
}
