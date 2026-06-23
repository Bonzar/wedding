// design06 section Closing (Canva id PB9GyzXqcqH056Yr). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Closing.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "./Closing.module.css";
import { layout } from "./Closing.layout";

// Однотонная белая подложка под текстурой.
function Backdrop() {
  return <div className={styles.fbzKiw} data-eid="closing/backdrop" style={elStyle(layout["closing/backdrop"])} />;
}

// Повёрнутая текстурная картинка-фон секции.
function BackdropImage() {
  return (
    <div className={styles.Izwocg} data-eid="closing/backdropImage" style={elStyle(layout["closing/backdropImage"])}>
      <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
    </div>
  );
}

// Гравюрный blob-орнамент.
function Engraving() {
  return (
    <div data-eid="closing/7" style={elStyle(layout["closing/7"])}>
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="closing/engraving" style={elStyle(layout["closing/engraving"])}>
        <div className={styles.DF_utQ} data-eid="closing/9" style={elStyle(layout["closing/9"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="closing/engravingImage" style={elStyle(layout["closing/engravingImage"])}>
                    <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PB9GyzXqcqH056Yr_0.png" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="closing/11" style={elStyle(layout["closing/11"])} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Благодарственный абзац.
function BodyText() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="closing/bodyText" style={elStyle(layout["closing/bodyText"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="closing/13" style={elStyle(layout["closing/13"])}>
        <div data-eid="closing/14" style={elStyle(layout["closing/14"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="closing/bodyTextParagraph" style={elStyle(layout["closing/bodyTextParagraph"])}>
                  <span className={styles.a_GcMg} data-eid="closing/bodyTextSpan" style={elStyle(layout["closing/bodyTextSpan"])}>
                    {"We are grateful for the love and support of our"}
                    <br />
                    {"family and friends. Your presence will make our day"}
                    <br />
                    {"more special, and we look forward to celebrating"}
                    <br />
                    {"with joy and creating unforgettable memories"}
                    <br />
                    {"together."}
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

// Скрипт-заголовок «Felix & Angel».
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="closing/title" style={elStyle(layout["closing/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="closing/18" style={elStyle(layout["closing/18"])}>
        <div data-eid="closing/19" style={elStyle(layout["closing/19"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="closing/titleParagraph" style={elStyle(layout["closing/titleParagraph"])}>
                  <span className={styles.a_GcMg} data-eid="closing/titleSpan" style={elStyle(layout["closing/titleSpan"])}>
                    {"Felix & Angel"}
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

// Полупрозрачное перекрытие поверх секции.
function Overlay() {
  return <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="closing/overlay" style={elStyle(layout["closing/overlay"])} />;
}

export default function Closing() {
  return (
      <section className={"rGeu6w"} id="PB9GyzXqcqH056Yr" data-scroll-ready="true" data-eid="closing/root" style={elStyle(layout["closing/root"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="closing/1" style={elStyle(layout["closing/1"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="closing/2" style={elStyle(layout["closing/2"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="closing/3" style={elStyle(layout["closing/3"])}>
                    <div className={styles._6t4CHA}>
                      <div className={styles.a26Xuw}>
                        <Backdrop />
                        <div className={styles.PcHy7w}>
                          <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                            <BackdropImage />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-eid="closing/6" style={elStyle(layout["closing/6"])} />
                    <Engraving />
                    <BodyText />
                    <Title />
                  </div>
                </div>
              </div>
              <Overlay />
            </div>
          </div>
        </div>
      </section>
  );
}
