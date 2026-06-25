// design06 section Timeline (Canva id PBGrcDNxzKvrxrJt). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Timeline.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Timeline.layout";
import { assetUrl } from "../assetUrl";

// Полноэкранное повёрнутое фоновое фото (гравюра) за всем контентом.
function BackgroundPhoto() {
  return (
    <div className={styles.Izwocg} data-eid="timeline/background-photo" style={elStyle(layout["timeline/background-photo"])}>
      <img loading="lazy" decoding="async" className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg")} />
    </div>
  );
}

// Верхняя декоративная фотография-вырезка (повёрнута), слева сверху.
function PhotoTop() {
  return (
    <div data-eid="timeline/box-1" style={elStyle(layout["timeline/box-1"])}>
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="timeline/block-1" style={elStyle(layout["timeline/block-1"])}>
        <div className={styles.DF_utQ} data-eid="timeline/block-2" style={elStyle(layout["timeline/block-2"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="timeline/photo-top-img" style={elStyle(layout["timeline/photo-top-img"])}>
                    <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBGrcDNxzKvrxrJt_0.png")} />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="timeline/box-2" style={elStyle(layout["timeline/box-2"])} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Тонкая разделительная линия (SVG path). Один корень на каждую линию таймлайна.
function Divider({ eid, dInner, dOuter }: { eid: string; dInner: string; dOuter: string }) {
  // SVG масштабируется через elStyle (calc·--d06u), но координаты path — в нативном user-space.
  // Без viewBox путь не масштабируется вместе с элементом → viewBox = нативные w×h из layout +
  // preserveAspectRatio="none", тогда путь тянется в масштабированный бокс.
  const svgEl = layout[`${eid}-svg`];
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw)} data-eid={eid} style={elStyle(layout[eid])}>
      <div className={styles.V7MmMA} data-eid={`${eid}-box`} style={elStyle(layout[`${eid}-box`])}>
        <svg
          className={styles.Fe_H_Q}
          data-eid={`${eid}-svg`}
          viewBox={`0 0 ${svgEl?.w ?? 0} ${svgEl?.h ?? 0}`}
          preserveAspectRatio="none"
          style={elStyle(layout[`${eid}-svg`])}
        >
          <path className={styles._682gpw} d={dInner} strokeLinecap="butt" strokeWidth="2" fill="none" pointerEvents="auto" opacity="0" data-eid={`${eid}-path`} style={elStyle(layout[`${eid}-path`])} />
          <g>
            <path d={dOuter} strokeLinecap="round" strokeWidth="2" fill="none" pointerEvents="none" />
          </g>
        </svg>
      </div>
    </div>
  );
}

// Текстовый блок «время / подпись» таймлайна: один корень-обёртка + параграф со span.
function TimelineText({
  rootEid,
  boxEid,
  innerEid,
  paraEid,
  spanEid,
  paraClass,
  children,
}: {
  rootEid: string;
  boxEid: string;
  innerEid: string;
  paraEid: string;
  spanEid: string;
  paraClass: string;
  children: string;
}) {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid={rootEid} style={elStyle(layout[rootEid])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid={boxEid} style={elStyle(layout[boxEid])}>
        <div data-eid={innerEid} style={elStyle(layout[innerEid])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={paraClass} data-eid={paraEid} style={elStyle(layout[paraEid])}>
                  <span className={styles.a_GcMg} data-eid={spanEid} style={elStyle(layout[spanEid])}>
                    {children}
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

// Нижняя декоративная фотография-вырезка (повёрнута, отзеркалена), справа снизу.
function PhotoBottom() {
  return (
    <div data-eid="timeline/box-3" style={elStyle(layout["timeline/box-3"])}>
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="timeline/block-3" style={elStyle(layout["timeline/block-3"])}>
        <div className={styles.DF_utQ} data-eid="timeline/block-4" style={elStyle(layout["timeline/block-4"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)} data-eid="timeline/imgbox" style={elStyle(layout["timeline/imgbox"])}>
                  <div className={styles.Izwocg} data-eid="timeline/photo-bottom-img" style={elStyle(layout["timeline/photo-bottom-img"])}>
                    <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBGrcDNxzKvrxrJt_1.png")} />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="timeline/box-4" style={elStyle(layout["timeline/box-4"])} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Заголовок секции «WEDDING TIMELINE».
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="timeline/title" style={elStyle(layout["timeline/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="timeline/text" style={elStyle(layout["timeline/text"])}>
        <div data-eid="timeline/box-5" style={elStyle(layout["timeline/box-5"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="timeline/title-text" style={elStyle(layout["timeline/title-text"])}>
                  <span className={styles.a_GcMg} data-eid="timeline/span" style={elStyle(layout["timeline/span"])}>
                    {"Как все будет"}
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

// Полупрозрачная рамка-оверлей поверх всей секции.
function Overlay() {
  return (
    <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="timeline/overlay" style={elStyle(layout["timeline/overlay"])} />
  );
}

export default function Timeline() {
  return (
      <section className={"rGeu6w"} id="PBGrcDNxzKvrxrJt" data-scroll-ready="true" data-eid="timeline/section" style={elStyle(layout["timeline/section"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="timeline/frame" style={elStyle(layout["timeline/frame"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="timeline/canvas" style={elStyle(layout["timeline/canvas"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="timeline/content" style={elStyle(layout["timeline/content"])}>
                    <div className={styles._6t4CHA}>
                      <div className={styles.a26Xuw}>
                        <div className={styles.fbzKiw} data-eid="timeline/fill" style={elStyle(layout["timeline/fill"])} />
                        <div className={styles.PcHy7w}>
                          <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                            <BackgroundPhoto />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-eid="timeline/box-6" style={elStyle(layout["timeline/box-6"])} />
                    <PhotoTop />
                    <Divider eid="timeline/divider-1" dInner="M1,1L1033.402995342007,1" dOuter="M1,1L1033.402995342007,1" />
                    <TimelineText
                      rootEid="timeline/time-5pm"
                      boxEid="timeline/box-1--2"
                      innerEid="timeline/inner-1"
                      paraEid="timeline/para-1"
                      spanEid="timeline/span-1"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"17:00"}
                    </TimelineText>
                    <Divider eid="timeline/divider-2" dInner="M1,1L417.9205199940998,1" dOuter="M1,1L417.9205199940998,1" />
                    <Divider eid="timeline/divider-3" dInner="M1,1L417.9205199940998,1" dOuter="M1,1L417.9205199940998,1" />
                    <Divider eid="timeline/divider-4" dInner="M0.9999999999998863,1L417.9205199940999,1" dOuter="M0.9999999999998863,1L417.9205199940999,1" />
                    <Divider eid="timeline/divider-5" dInner="M0.9999999999999432,1L417.92051999409983,1" dOuter="M0.9999999999999432,1L417.92051999409983,1" />
                    <Divider eid="timeline/divider-6" dInner="M0.9999999999998863,1L417.9205199940999,1" dOuter="M0.9999999999998863,1L417.9205199940999,1" />
                    <TimelineText
                      rootEid="timeline/time-10pm"
                      boxEid="timeline/box-2--2"
                      innerEid="timeline/inner-2"
                      paraEid="timeline/para-2"
                      spanEid="timeline/span-2"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"21:00"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/label-dance-party"
                      boxEid="timeline/box-3--2"
                      innerEid="timeline/inner-3"
                      paraEid="timeline/para-3"
                      spanEid="timeline/span-3"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Дискотека на танцполе"}
                    </TimelineText>
                    <PhotoBottom />
                    <Title />
                    <TimelineText
                      rootEid="timeline/label-wedding-ceremony"
                      boxEid="timeline/box-4--2"
                      innerEid="timeline/inner-4"
                      paraEid="timeline/para-4"
                      spanEid="timeline/span-4"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Сбор гостей"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/time-7pm"
                      boxEid="timeline/box-5--2"
                      innerEid="timeline/inner-5"
                      paraEid="timeline/para-5"
                      spanEid="timeline/span-5"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"19:00"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/label-dinner-reception"
                      boxEid="timeline/box-6--2"
                      innerEid="timeline/inner-6"
                      paraEid="timeline/para-6"
                      spanEid="timeline/span-6"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Ужин в ресторане"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/time-6pm"
                      boxEid="timeline/box-7"
                      innerEid="timeline/inner-7"
                      paraEid="timeline/para-7"
                      spanEid="timeline/span-7"
                      paraClass={cx(styles._28USrA, styles.TV9a8Q, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"18:00"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/label-photo-session"
                      boxEid="timeline/box-8"
                      innerEid="timeline/inner-8"
                      paraEid="timeline/para-8"
                      spanEid="timeline/span-8"
                      paraClass={cx(styles._28USrA, styles.TV9a8Q, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Начало программы"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/label-toast-speeches"
                      boxEid="timeline/box-9"
                      innerEid="timeline/inner-9"
                      paraEid="timeline/para-9"
                      spanEid="timeline/span-9"
                      paraClass={cx(styles._28USrA, styles.TV9a8Q, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Развлечения и поздравления"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/time-8pm"
                      boxEid="timeline/box-10"
                      innerEid="timeline/inner-10"
                      paraEid="timeline/para-10"
                      spanEid="timeline/span-10"
                      paraClass={cx(styles._28USrA, styles.TV9a8Q, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"20:00"}
                    </TimelineText>
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
