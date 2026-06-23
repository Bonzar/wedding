// design06 section Timeline (Canva id PBGrcDNxzKvrxrJt). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Timeline.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "./Timeline.module.css";
import { layout } from "./Timeline.layout";

// Полноэкранное повёрнутое фоновое фото (гравюра) за всем контентом.
function BackgroundPhoto() {
  return (
    <div className={styles.Izwocg} data-eid="timeline/background-photo" style={elStyle(layout["timeline/background-photo"])}>
      <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
    </div>
  );
}

// Верхняя декоративная фотография-вырезка (повёрнута), слева сверху.
function PhotoTop() {
  return (
    <div data-eid="timeline/7" style={elStyle(layout["timeline/7"])}>
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="timeline/8" style={elStyle(layout["timeline/8"])}>
        <div className={styles.DF_utQ} data-eid="timeline/9" style={elStyle(layout["timeline/9"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="timeline/photo-top-img" style={elStyle(layout["timeline/photo-top-img"])}>
                    <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBGrcDNxzKvrxrJt_0.png" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="timeline/11" style={elStyle(layout["timeline/11"])} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Тонкая разделительная линия (SVG path). Один корень на каждую линию таймлайна.
function Divider({ eid, dInner, dOuter }: { eid: string; dInner: string; dOuter: string }) {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw)} data-eid={eid} style={elStyle(layout[eid])}>
      <div className={styles.V7MmMA} data-eid={`${eid}-box`} style={elStyle(layout[`${eid}-box`])}>
        <svg className={styles.Fe_H_Q} data-eid={`${eid}-svg`} style={elStyle(layout[`${eid}-svg`])}>
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
    <div data-eid="timeline/51" style={elStyle(layout["timeline/51"])}>
      <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="timeline/52" style={elStyle(layout["timeline/52"])}>
        <div className={styles.DF_utQ} data-eid="timeline/53" style={elStyle(layout["timeline/53"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)} data-eid="timeline/54" style={elStyle(layout["timeline/54"])}>
                  <div className={styles.Izwocg} data-eid="timeline/photo-bottom-img" style={elStyle(layout["timeline/photo-bottom-img"])}>
                    <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBGrcDNxzKvrxrJt_1.png" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="timeline/56" style={elStyle(layout["timeline/56"])} />
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
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="timeline/58" style={elStyle(layout["timeline/58"])}>
        <div data-eid="timeline/59" style={elStyle(layout["timeline/59"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="timeline/title-text" style={elStyle(layout["timeline/title-text"])}>
                  <span className={styles.a_GcMg} data-eid="timeline/61" style={elStyle(layout["timeline/61"])}>
                    {"wedding timeline"}
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
          <div className={styles.onhyOQ} data-eid="timeline/1" style={elStyle(layout["timeline/1"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="timeline/2" style={elStyle(layout["timeline/2"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="timeline/3" style={elStyle(layout["timeline/3"])}>
                    <div className={styles._6t4CHA}>
                      <div className={styles.a26Xuw}>
                        <div className={styles.fbzKiw} data-eid="timeline/4" style={elStyle(layout["timeline/4"])} />
                        <div className={styles.PcHy7w}>
                          <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                            <BackgroundPhoto />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-eid="timeline/6" style={elStyle(layout["timeline/6"])} />
                    <PhotoTop />
                    <Divider eid="timeline/divider-1" dInner="M1,1L1033.402995342007,1" dOuter="M1,1L1033.402995342007,1" />
                    <TimelineText
                      rootEid="timeline/time-5pm"
                      boxEid="timeline/17"
                      innerEid="timeline/18"
                      paraEid="timeline/19"
                      spanEid="timeline/20"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"5.00 PM"}
                    </TimelineText>
                    <Divider eid="timeline/divider-2" dInner="M1,1L417.9205199940998,1" dOuter="M1,1L417.9205199940998,1" />
                    <Divider eid="timeline/divider-3" dInner="M1,1L417.9205199940998,1" dOuter="M1,1L417.9205199940998,1" />
                    <Divider eid="timeline/divider-4" dInner="M0.9999999999998863,1L417.9205199940999,1" dOuter="M0.9999999999998863,1L417.9205199940999,1" />
                    <Divider eid="timeline/divider-5" dInner="M0.9999999999999432,1L417.92051999409983,1" dOuter="M0.9999999999999432,1L417.92051999409983,1" />
                    <Divider eid="timeline/divider-6" dInner="M0.9999999999998863,1L417.9205199940999,1" dOuter="M0.9999999999998863,1L417.9205199940999,1" />
                    <TimelineText
                      rootEid="timeline/time-10pm"
                      boxEid="timeline/42"
                      innerEid="timeline/43"
                      paraEid="timeline/44"
                      spanEid="timeline/45"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"10.00 PM"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/label-dance-party"
                      boxEid="timeline/47"
                      innerEid="timeline/48"
                      paraEid="timeline/49"
                      spanEid="timeline/50"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Dance Party"}
                    </TimelineText>
                    <PhotoBottom />
                    <Title />
                    <TimelineText
                      rootEid="timeline/label-wedding-ceremony"
                      boxEid="timeline/63"
                      innerEid="timeline/64"
                      paraEid="timeline/65"
                      spanEid="timeline/66"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Wedding Ceremony"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/time-7pm"
                      boxEid="timeline/68"
                      innerEid="timeline/69"
                      paraEid="timeline/70"
                      spanEid="timeline/71"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"7.00 PM"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/label-dinner-reception"
                      boxEid="timeline/73"
                      innerEid="timeline/74"
                      paraEid="timeline/75"
                      spanEid="timeline/76"
                      paraClass={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Dinner Reception"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/time-6pm"
                      boxEid="timeline/78"
                      innerEid="timeline/79"
                      paraEid="timeline/80"
                      spanEid="timeline/81"
                      paraClass={cx(styles._28USrA, styles.TV9a8Q, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"6.00 PM"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/label-photo-session"
                      boxEid="timeline/83"
                      innerEid="timeline/84"
                      paraEid="timeline/85"
                      spanEid="timeline/86"
                      paraClass={cx(styles._28USrA, styles.TV9a8Q, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Photo Session"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/label-toast-speeches"
                      boxEid="timeline/88"
                      innerEid="timeline/89"
                      paraEid="timeline/90"
                      spanEid="timeline/91"
                      paraClass={cx(styles._28USrA, styles.TV9a8Q, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"Toast & Speeches"}
                    </TimelineText>
                    <TimelineText
                      rootEid="timeline/time-8pm"
                      boxEid="timeline/93"
                      innerEid="timeline/94"
                      paraEid="timeline/95"
                      spanEid="timeline/96"
                      paraClass={cx(styles._28USrA, styles.TV9a8Q, styles.XN6uKA, styles._4N4NA)}
                    >
                      {"8.00 PM"}
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
