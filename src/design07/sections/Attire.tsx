// design06 section Attire (Canva id PBL8ZPfjvBzXjMPd). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Attire.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Attire.layout";
import { assetUrl } from "../assetUrl";

// Сплошная белая подложка секции.
function Backdrop() {
  return <div className={styles.fbzKiw} data-eid="attire/backdrop" style={elStyle(layout["attire/backdrop"])} />;
}

// Фоновое фото (повёрнуто на 90°).
function Photo() {
  return (
    <div className={styles.Izwocg} data-eid="attire/photo" style={elStyle(layout["attire/photo"])}>
      <img loading="lazy" decoding="async" className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg")} />
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
              <div className={styles.Izwocg} data-eid="attire/imgwrap-1" style={elStyle(layout["attire/imgwrap-1"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBL8ZPfjvBzXjMPd_0.svg")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="attire/box-1" style={elStyle(layout["attire/box-1"])} />
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
              <div className={styles.Izwocg} data-eid="attire/imgwrap-2" style={elStyle(layout["attire/imgwrap-2"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBL8ZPfjvBzXjMPd_1.svg")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="attire/box-2" style={elStyle(layout["attire/box-2"])} />
      </div>
    </div>
  );
}

// Заголовок «Attire Guide».
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="attire/title" style={elStyle(layout["attire/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="attire/text-1" style={elStyle(layout["attire/text-1"])}>
        <div data-eid="attire/box-3" style={elStyle(layout["attire/box-3"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="attire/title-text" style={elStyle(layout["attire/title-text"])}>
                  <span className={styles.a_GcMg} data-eid="attire/span-1" style={elStyle(layout["attire/span-1"])}>
                    {"ДРЕСС КОД"}
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
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="attire/text-2" style={elStyle(layout["attire/text-2"])}>
        <div data-eid="attire/box-4" style={elStyle(layout["attire/box-4"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="attire/paragraph-text" style={elStyle(layout["attire/paragraph-text"])}>
                  <span className={styles.a_GcMg} data-eid="attire/span-2" style={elStyle(layout["attire/span-2"])}>
                    {"Мы просим наших гостей прийти в полуформальной одежде: коктейльные платья или элегантные наряды для дам и рубашки с брюками для джентльменов."}
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
          <div className={styles.bFnJ2A} data-eid={fillEid} style={elStyle(layout[fillEid], { keepInk: true })} />
        </div>
      </div>
    </div>
  );
}

// Ряд из пяти цветовых кружков (палитра дресс-кода).
function ColorSwatches() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="attire/swatches" style={elStyle(layout["attire/swatches"])}>
      <div data-eid="attire/box-5" style={elStyle(layout["attire/box-5"])}>
        <ColorSwatch eid="attire/item-1" innerEid="attire/inner-1" frameEid="attire/frame-1" fillEid="attire/fill-1" clipId="__id64" />
        <ColorSwatch eid="attire/item-2" innerEid="attire/inner-2" frameEid="attire/frame-2" fillEid="attire/fill-2" clipId="__id65" />
        <ColorSwatch eid="attire/item-3" innerEid="attire/inner-3" frameEid="attire/frame-3" fillEid="attire/fill-3" clipId="__id66" />
        <ColorSwatch eid="attire/item-4" innerEid="attire/inner-4" frameEid="attire/frame-4" fillEid="attire/fill-4" clipId="__id67" />
        <ColorSwatch eid="attire/item-5" innerEid="attire/inner-5" frameEid="attire/frame-5" fillEid="attire/fill-5" clipId="__id68" />
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
      <section className={"rGeu6w"} id="PBL8ZPfjvBzXjMPd" data-scroll-ready="true" data-eid="attire/sectionbox" style={elStyle(layout["attire/sectionbox"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="attire/frame" style={elStyle(layout["attire/frame"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="attire/canvas" style={elStyle(layout["attire/canvas"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="attire/content" style={elStyle(layout["attire/content"])}>
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
                    <div data-eid="attire/box-6" style={elStyle(layout["attire/box-6"])} />
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
