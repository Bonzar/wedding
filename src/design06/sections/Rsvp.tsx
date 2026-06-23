// design06 section Rsvp (Canva id PBJyC0fbP0ThXKGC). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Rsvp.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Rsvp.layout";

// Фоновое фото секции (большой повёрнутый jpg).
function Photo() {
  return (
      <div className={styles.Izwocg} data-eid="rsvp/photo" style={elStyle(layout["rsvp/photo"])}>
        <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
      </div>
  );
}

// Декоративная гравюра (png-blob) в рамке поверх фото.
function PhotoFrame() {
  return (
      <div data-eid="rsvp/box-1" style={elStyle(layout["rsvp/box-1"])}>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="rsvp/block-1" style={elStyle(layout["rsvp/block-1"])}>
          <div className={styles.DF_utQ} data-eid="rsvp/block-2" style={elStyle(layout["rsvp/block-2"])}>
            <div className={styles.Zp7NQw}>
              <div className={styles.a26Xuw}>
                <div className={styles.PcHy7w}>
                  <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                    <div className={styles.Izwocg} data-eid="rsvp/imgwrap" style={elStyle(layout["rsvp/imgwrap"])}>
                      <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBJyC0fbP0ThXKGC_0.png" />
                    </div>
                  </div>
                </div>
              </div>
              <div data-eid="rsvp/box-2" style={elStyle(layout["rsvp/box-2"])} />
            </div>
          </div>
        </div>
      </div>
  );
}

// Заголовок «rsvp».
function Title() {
  return (
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="rsvp/block-3" style={elStyle(layout["rsvp/block-3"])}>
        <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="rsvp/text-1" style={elStyle(layout["rsvp/text-1"])}>
          <div data-eid="rsvp/box-3" style={elStyle(layout["rsvp/box-3"])}>
            <div className={styles.E8yZTA}>
              <div>
                <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                  <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="rsvp/para-1" style={elStyle(layout["rsvp/para-1"])}>
                    <span className={styles.a_GcMg} data-eid="rsvp/title" style={elStyle(layout["rsvp/title"])}>
                      {"rsvp"}
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

// Поясняющий абзац.
function BodyText() {
  return (
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="rsvp/block-4" style={elStyle(layout["rsvp/block-4"])}>
        <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="rsvp/text-2" style={elStyle(layout["rsvp/text-2"])}>
          <div data-eid="rsvp/box-4" style={elStyle(layout["rsvp/box-4"])}>
            <div className={styles.E8yZTA}>
              <div>
                <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                  <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="rsvp/para-2" style={elStyle(layout["rsvp/para-2"])}>
                    <span className={styles.a_GcMg} data-eid="rsvp/body" style={elStyle(layout["rsvp/body"])}>
                      {"Kindly RSVP by January"}
                      <br />
                      {"15th, 2026, to help us with"}
                      <br />
                      {"the final arrangements for our"}
                      <br />
                      {"special day."}
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

// Пилюля-подложка под кнопкой RSVP.
function ButtonPill() {
  return (
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="rsvp/block-5" style={elStyle(layout["rsvp/block-5"])}>
        <div data-eid="rsvp/box-5" style={elStyle(layout["rsvp/box-5"])}>
          <div className={styles.hWv4NA} data-eid="rsvp/mask" style={elStyle(layout["rsvp/mask"])}>
            <svg className={styles._7KaXww}>
              <defs>
                <clipPath id="__id121">
                  <path d="M128.0000000300142,0L1033.7485942066182,0C1104.4410421613297,0 1161.7485942366325,57.3075520753027 1161.7485942366325,128.0000000300142C1161.7485942366325,198.69244798472567 1104.4410421613297,255.99999994281853 1033.7485942066182,255.99999994281853L128.0000000300142,255.99999994281853C57.3075520753027,255.99999994281853 0,198.69244798472567 0,128.0000000300142C0,57.3075520753027 57.3075520753027,0 128.0000000300142,0Z" />
                </clipPath>
              </defs>
            </svg>
            <div className={styles.bFnJ2A} data-eid="rsvp/clip" style={elStyle(layout["rsvp/clip"])} />
          </div>
        </div>
      </div>
  );
}

// Кнопка-ссылка «RSVP» (ведёт на форму).
function ButtonLink() {
  return (
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="rsvp/block-6" style={elStyle(layout["rsvp/block-6"])}>
        <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="rsvp/text-3" style={elStyle(layout["rsvp/text-3"])}>
          <div data-eid="rsvp/box-6" style={elStyle(layout["rsvp/box-6"])}>
            <div className={styles.E8yZTA}>
              <div>
                <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                  <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="rsvp/para-3" style={elStyle(layout["rsvp/para-3"])}>
                    <a className={styles.a_GcMg} href="https://docs.google.com/forms/d/1nguxSx8mXfAUPV0A2yfRu8PKYfPIKBAUfrQsxKOTs0g/viewform?edit_requested=true" target="_blank" draggable={false} rel="noopener nofollow" data-eid="rsvp/link" style={elStyle(layout["rsvp/link"])}>
                      {"RSVP"}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

// Рамка-оверлей поверх всей секции.
function Frame() {
  return (
      <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="rsvp/overlay" style={elStyle(layout["rsvp/overlay"])} />
  );
}

export default function Rsvp() {
  return (
      <section className={"rGeu6w"} id="PBJyC0fbP0ThXKGC" data-scroll-ready="true" data-eid="rsvp/sectionbox" style={elStyle(layout["rsvp/sectionbox"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="rsvp/frame" style={elStyle(layout["rsvp/frame"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="rsvp/canvas" style={elStyle(layout["rsvp/canvas"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="rsvp/content" style={elStyle(layout["rsvp/content"])}>
                    <div className={styles._6t4CHA}>
                      <div className={styles.a26Xuw}>
                        <div className={styles.fbzKiw} data-eid="rsvp/fill" style={elStyle(layout["rsvp/fill"])} />
                        <div className={styles.PcHy7w}>
                          <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                            <Photo />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-eid="rsvp/box-7" style={elStyle(layout["rsvp/box-7"])} />
                    <PhotoFrame />
                    <Title />
                    <BodyText />
                    <ButtonPill />
                    <ButtonLink />
                  </div>
                </div>
              </div>
              <Frame />
            </div>
          </div>
        </div>
      </section>
  );
}
