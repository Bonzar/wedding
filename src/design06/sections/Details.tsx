// design06 section Details (Canva id PBsHbr4J9zLLY08q). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Details.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "./Details.module.css";
import { layout } from "./Details.layout";

function BackgroundPhoto() {
  return (
    <div className={styles.a26Xuw}>
      <div className={styles.fbzKiw} data-eid="details/fill" style={elStyle(layout["details/fill"])} />
      <div className={styles.PcHy7w}>
        <div className={cx(styles.uk_25A, styles.Ty61NA)}>
          <div className={styles.Izwocg} data-eid="details/bg-photo" style={elStyle(layout["details/bg-photo"])}>
            <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="details/title" style={elStyle(layout["details/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="details/text-1" style={elStyle(layout["details/text-1"])}>
        <div data-eid="details/box-1" style={elStyle(layout["details/box-1"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="details/title-text" style={elStyle(layout["details/title-text"])}>
                  <span className={styles.a_GcMg} data-eid="details/span-1" style={elStyle(layout["details/span-1"])}>
                    {"Wedding Details"}
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

function AccommodationHeading() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="details/accommodation-heading" style={elStyle(layout["details/accommodation-heading"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="details/text-2" style={elStyle(layout["details/text-2"])}>
        <div data-eid="details/box-2" style={elStyle(layout["details/box-2"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles._2ENCSQ, styles.XN6uKA, styles._4N4NA)} data-eid="details/accommodation-heading-text" style={elStyle(layout["details/accommodation-heading-text"])}>
                  <span className={styles.a_GcMg} data-eid="details/span-2" style={elStyle(layout["details/span-2"])}>
                    {"Accommodation"}
                  </span>
                  <span className={cx(styles.a_GcMg, styles.zYq_BQ)} data-eid="details/span-3" style={elStyle(layout["details/span-3"])}>
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

function AccommodationParagraph() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="details/accommodation-paragraph" style={elStyle(layout["details/accommodation-paragraph"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="details/text-3" style={elStyle(layout["details/text-3"])}>
        <div data-eid="details/box-3" style={elStyle(layout["details/box-3"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles._2ENCSQ, styles.XN6uKA, styles._4N4NA)} data-eid="details/accommodation-paragraph-text" style={elStyle(layout["details/accommodation-paragraph-text"])}>
                  <span className={styles.a_GcMg} data-eid="details/span-4" style={elStyle(layout["details/span-4"])}>
                    {"For your convenience, rooms have been reserved at Bali Resort with special wedding rates. Please mention “Felix & Angel Wedding” when booking to receive the discounted rate."}
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

function TransportationHeading() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="details/transportation-heading" style={elStyle(layout["details/transportation-heading"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="details/text-4" style={elStyle(layout["details/text-4"])}>
        <div data-eid="details/box-4" style={elStyle(layout["details/box-4"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles._2ENCSQ, styles.XN6uKA, styles._4N4NA)} data-eid="details/transportation-heading-text" style={elStyle(layout["details/transportation-heading-text"])}>
                  <span className={styles.a_GcMg} data-eid="details/span-5" style={elStyle(layout["details/span-5"])}>
                    {"Transportation"}
                  </span>
                  <span className={cx(styles.a_GcMg, styles.zYq_BQ)} data-eid="details/span-6" style={elStyle(layout["details/span-6"])}>
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

function TransportationParagraph() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="details/transportation-paragraph" style={elStyle(layout["details/transportation-paragraph"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="details/text-5" style={elStyle(layout["details/text-5"])}>
        <div data-eid="details/box-5" style={elStyle(layout["details/box-5"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles._2ENCSQ, styles.XN6uKA, styles._4N4NA)} data-eid="details/transportation-paragraph-text" style={elStyle(layout["details/transportation-paragraph-text"])}>
                  <span className={styles.a_GcMg} data-eid="details/span-7" style={elStyle(layout["details/span-7"])}>
                    {"For your convenience, the venue is about 30 minutes from the airport or train station by taxi or rideshare. A complimentary shuttle service will be available for guests staying at Bali Resort, and ample on-site parking is provided for those who prefer to drive."}
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

function EngravingPhoto() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="details/engraving" style={elStyle(layout["details/engraving"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="details/engraving-photo" style={elStyle(layout["details/engraving-photo"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBsHbr4J9zLLY08q_0.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="details/box-6" style={elStyle(layout["details/box-6"])} />
      </div>
    </div>
  );
}

function Canvas() {
  return (
    <div className={styles._mXnjA} lang="en" data-eid="details/content" style={elStyle(layout["details/content"])}>
      <div className={styles._6t4CHA}>
        <BackgroundPhoto />
      </div>
      <div data-eid="details/box-7" style={elStyle(layout["details/box-7"])} />
      <Title />
      <AccommodationHeading />
      <AccommodationParagraph />
      <TransportationHeading />
      <TransportationParagraph />
      <EngravingPhoto />
    </div>
  );
}

export default function Details() {
  return (
      <section className={"rGeu6w"} id="PBsHbr4J9zLLY08q" data-scroll-ready="true" data-eid="details/sectionbox" style={elStyle(layout["details/sectionbox"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="details/frame" style={elStyle(layout["details/frame"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="details/canvas" style={elStyle(layout["details/canvas"])}>
                <div className={styles.o2Yl2g}>
                  <Canvas />
                </div>
              </div>
              <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="details/overlay" style={elStyle(layout["details/overlay"])} />
            </div>
          </div>
        </div>
      </section>
  );
}
