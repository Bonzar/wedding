// design06 section Hero (Canva id PBbM6hRVrsx6MjPz). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Hero.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "./Hero.module.css";
import { layout } from "./Hero.layout";

// Textured backdrop: full-bleed photo rotated behind the cover content.
function Backdrop() {
  return (
    <div className={styles.Izwocg} data-eid="hero/backdrop-photo" style={elStyle(layout["hero/backdrop-photo"])}>
      <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
    </div>
  );
}

// Floral engraving band on the right side of the cover.
function EngravingFloralRight() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="hero/engraving-floral-right" style={elStyle(layout["hero/engraving-floral-right"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="hero/8" style={elStyle(layout["hero/8"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBbM6hRVrsx6MjPz_0.svg" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="hero/9" style={elStyle(layout["hero/9"])} />
      </div>
    </div>
  );
}

// Bird engraving: clipped photo framed in the corner.
function BirdEngraving() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="hero/bird" style={elStyle(layout["hero/bird"])}>
      <div data-eid="hero/11" style={elStyle(layout["hero/11"])}>
        <div className={styles.hWv4NA} data-eid="hero/12" style={elStyle(layout["hero/12"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id7">
                <path d="M0,0L256,0L256,298.9063036801406L0,298.9063036801406Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid="hero/13" style={elStyle(layout["hero/13"])}>
            <div className={cx(styles._4c2rDg, styles.GxUsfw)} data-eid="hero/14" style={elStyle(layout["hero/14"])}>
              <div className={styles.qhHTGg} data-eid="hero/bird-photo" style={elStyle(layout["hero/bird-photo"])}>
                <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/a971da4c4fe6f53b59f2d6f85b0b7c7d.jpg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.Pr6LEA} />
      </div>
    </div>
  );
}

// Floral engraving band clipped to the bottom-left corner.
function EngravingFloralBottomLeft() {
  return (
    <div data-eid="hero/16" style={elStyle(layout["hero/16"])}>
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="hero/engraving-floral-bottom-left" style={elStyle(layout["hero/engraving-floral-bottom-left"])}>
        <div className={styles.DF_utQ} data-eid="hero/18" style={elStyle(layout["hero/18"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="hero/19" style={elStyle(layout["hero/19"])}>
                    <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBbM6hRVrsx6MjPz_1.png" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="hero/20" style={elStyle(layout["hero/20"])} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 'THE WEDDING OF' pretitle above the script title.
function Pretitle() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="hero/pretitle" style={elStyle(layout["hero/pretitle"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="hero/22" style={elStyle(layout["hero/22"])}>
        <div data-eid="hero/23" style={elStyle(layout["hero/23"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="hero/pretitle-text" style={elStyle(layout["hero/pretitle-text"])}>
                  <span className={styles.a_GcMg} data-eid="hero/25" style={elStyle(layout["hero/25"])}>
                    {"The wedding of"}
                  </span>
                  <span className={cx(styles.a_GcMg, styles.zYq_BQ)} data-eid="hero/26" style={elStyle(layout["hero/26"])}>
                    {" "}
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

// 'Felix & Angel' script title.
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="hero/title" style={elStyle(layout["hero/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="hero/28" style={elStyle(layout["hero/28"])}>
        <div data-eid="hero/29" style={elStyle(layout["hero/29"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="hero/title-text" style={elStyle(layout["hero/title-text"])}>
                  <span className={styles.a_GcMg} data-eid="hero/31" style={elStyle(layout["hero/31"])}>
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

// Floral engraving band clipped to the bottom-right corner.
function EngravingFloralBottomRight() {
  return (
    <div data-eid="hero/32" style={elStyle(layout["hero/32"])}>
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="hero/engraving-floral-bottom-right" style={elStyle(layout["hero/engraving-floral-bottom-right"])}>
        <div className={styles.DF_utQ} data-eid="hero/34" style={elStyle(layout["hero/34"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="hero/35" style={elStyle(layout["hero/35"])}>
                    <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBbM6hRVrsx6MjPz_2.png" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="hero/36" style={elStyle(layout["hero/36"])} />
          </div>
        </div>
      </div>
    </div>
  );
}

// PhotoFrame: corner-framed cover composition — backdrop, engravings, bird, titles.
function PhotoFrame() {
  return (
    <div className={styles._mXnjA} lang="en" data-eid="hero/3" style={elStyle(layout["hero/3"])}>
      <div className={styles._6t4CHA}>
        <div className={styles.a26Xuw}>
          <div className={styles.fbzKiw} data-eid="hero/4" style={elStyle(layout["hero/4"])} />
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <Backdrop />
            </div>
          </div>
        </div>
      </div>
      <div data-eid="hero/6" style={elStyle(layout["hero/6"])} />
      <EngravingFloralRight />
      <BirdEngraving />
      <EngravingFloralBottomLeft />
      <Pretitle />
      <Title />
      <EngravingFloralBottomRight />
    </div>
  );
}

export default function Hero() {
  return (
      <section className={"rGeu6w"} id="PBbM6hRVrsx6MjPz" data-scroll-ready="true" data-eid="hero/section" style={elStyle(layout["hero/section"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="hero/1" style={elStyle(layout["hero/1"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="hero/2" style={elStyle(layout["hero/2"])}>
                <div className={styles.o2Yl2g}>
                  <PhotoFrame />
                </div>
              </div>
              <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="hero/overlay" style={elStyle(layout["hero/overlay"])} />
            </div>
          </div>
        </div>
      </section>
  );
}
