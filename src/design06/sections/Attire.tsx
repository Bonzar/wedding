// design06 section Attire (Canva id PBL8ZPfjvBzXjMPd). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Attire.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "./Attire.module.css";
import { layout } from "./Attire.layout";

// Сплошная белая подложка секции.
function Backdrop() {
  return <div className={styles.fbzKiw} data-eid="attire/backdrop" style={elStyle(layout["attire/backdrop"])} />;
}

// Фоновое фото (повёрнуто на 90°).
function Photo() {
  return (
    <div className={styles.Izwocg} data-eid="attire/photo" style={elStyle(layout["attire/photo"])}>
      <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
    </div>
  );
}

// Крупная иллюстрация наряда (SVG-blob слева).
function AttireIconLarge() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="attire/icon-large" style={elStyle(layout["attire/icon-large"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="attire/8" style={elStyle(layout["attire/8"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBL8ZPfjvBzXjMPd_0.svg" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="attire/9" style={elStyle(layout["attire/9"])} />
      </div>
    </div>
  );
}

// Малая иллюстрация наряда (SVG-blob справа).
function AttireIconSmall() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="attire/icon-small" style={elStyle(layout["attire/icon-small"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="attire/11" style={elStyle(layout["attire/11"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBL8ZPfjvBzXjMPd_1.svg" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="attire/12" style={elStyle(layout["attire/12"])} />
      </div>
    </div>
  );
}

// Заголовок «Attire Guide».
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="attire/title" style={elStyle(layout["attire/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="attire/14" style={elStyle(layout["attire/14"])}>
        <div data-eid="attire/15" style={elStyle(layout["attire/15"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="attire/title-text" style={elStyle(layout["attire/title-text"])}>
                  <span className={styles.a_GcMg} data-eid="attire/17" style={elStyle(layout["attire/17"])}>
                    {"Attire Guide"}
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

// Абзац с рекомендациями по дресс-коду.
function Paragraph() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="attire/paragraph" style={elStyle(layout["attire/paragraph"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="attire/19" style={elStyle(layout["attire/19"])}>
        <div data-eid="attire/20" style={elStyle(layout["attire/20"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="attire/paragraph-text" style={elStyle(layout["attire/paragraph-text"])}>
                  <span className={styles.a_GcMg} data-eid="attire/22" style={elStyle(layout["attire/22"])}>
                    {"We invite our guests to dress in semi-formal attire—"}
                    <br />
                    {"cocktail dresses or elegant outfits for ladies, and a shirt"}
                    <br />
                    {"with dress pants for gentlemen."}
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

// Один цветовой кружок-сэмпл палитры.
function ColorSwatch({ eid, innerEid, frameEid, fillEid, clipId }: { eid: string; innerEid: string; frameEid: string; fillEid: string; clipId: string }) {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid={eid} style={elStyle(layout[eid])}>
      <div data-eid={innerEid} style={elStyle(layout[innerEid])}>
        <div className={styles.hWv4NA} data-eid={frameEid} style={elStyle(layout[frameEid])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id={clipId}>
                <path d="M128,0C57.30755202165845,0 0,57.30755202165844 0,128C0,198.69244797834153 57.307552021658424,256 128,256C198.69244797834153,256 256,198.6924479783416 256,128C256,57.30755202165848 198.6924479783416,0 128,0Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid={fillEid} style={elStyle(layout[fillEid])} />
        </div>
      </div>
    </div>
  );
}

// Ряд из пяти цветовых кружков (палитра дресс-кода).
function ColorSwatches() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="attire/swatches" style={elStyle(layout["attire/swatches"])}>
      <div data-eid="attire/24" style={elStyle(layout["attire/24"])}>
        <ColorSwatch eid="attire/25" innerEid="attire/26" frameEid="attire/27" fillEid="attire/28" clipId="__id64" />
        <ColorSwatch eid="attire/29" innerEid="attire/30" frameEid="attire/31" fillEid="attire/32" clipId="__id65" />
        <ColorSwatch eid="attire/33" innerEid="attire/34" frameEid="attire/35" fillEid="attire/36" clipId="__id66" />
        <ColorSwatch eid="attire/37" innerEid="attire/38" frameEid="attire/39" fillEid="attire/40" clipId="__id67" />
        <ColorSwatch eid="attire/41" innerEid="attire/42" frameEid="attire/43" fillEid="attire/44" clipId="__id68" />
      </div>
    </div>
  );
}

// Полупрозрачная рамка-оверлей поверх секции.
function Overlay() {
  return <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="attire/overlay" style={elStyle(layout["attire/overlay"])} />;
}

export default function Attire() {
  return (
      <section className={"rGeu6w"} id="PBL8ZPfjvBzXjMPd" data-scroll-ready="true" data-eid="attire/0" style={elStyle(layout["attire/0"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="attire/1" style={elStyle(layout["attire/1"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="attire/2" style={elStyle(layout["attire/2"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="attire/3" style={elStyle(layout["attire/3"])}>
                    <div className={styles._6t4CHA}>
                      <div className={styles.a26Xuw}>
                        <Backdrop />
                        <div className={styles.PcHy7w}>
                          <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                            <Photo />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-eid="attire/6" style={elStyle(layout["attire/6"])} />
                    <AttireIconLarge />
                    <AttireIconSmall />
                    <Title />
                    <Paragraph />
                    <ColorSwatches />
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
