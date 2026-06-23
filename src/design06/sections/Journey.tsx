// design06 section Journey (Canva id PBYbv3X7MfRLX7B4). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Journey.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "./Journey.module.css";
import { layout } from "./Journey.layout";

// Полноэкранное фоновое фото (повёрнуто на 90°), лежит под всем коллажем.
function BackdropPhoto() {
  return (
    <div className={styles.fbzKiw} data-eid="journey/4" style={elStyle(layout["journey/4"])} />
  );
}

function BackdropPhotoImage() {
  return (
    <div className={styles.PcHy7w}>
      <div className={cx(styles.uk_25A, styles.Ty61NA)}>
        <div className={styles.Izwocg} data-eid="journey/backdrop-photo" style={elStyle(layout["journey/backdrop-photo"])}>
          <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
        </div>
      </div>
    </div>
  );
}

// Сетка-коллаж из пяти фотографий (одна большая сверху + 2×2 снизу).
function PhotoCollage() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/collage" style={elStyle(layout["journey/collage"])}>
      <div data-eid="journey/8" style={elStyle(layout["journey/8"])}>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/9" style={elStyle(layout["journey/9"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="journey/10" style={elStyle(layout["journey/10"])}>
                    <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/8f94b2f41e88f4e3d559602828209c41.jpg" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="journey/11" style={elStyle(layout["journey/11"])} />
          </div>
        </div>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/12" style={elStyle(layout["journey/12"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="journey/13" style={elStyle(layout["journey/13"])}>
                    <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/66f9b7c653e52ed2f5be1385fc549f24.jpg" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="journey/14" style={elStyle(layout["journey/14"])} />
          </div>
        </div>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/15" style={elStyle(layout["journey/15"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="journey/16" style={elStyle(layout["journey/16"])}>
                    <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/97e2b95c785edc865b0d971d64e4c6af.jpg" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="journey/17" style={elStyle(layout["journey/17"])} />
          </div>
        </div>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/18" style={elStyle(layout["journey/18"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="journey/19" style={elStyle(layout["journey/19"])}>
                    <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/dbc843d96c23400e5f29e7db7208f29f.jpg" />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="journey/20" style={elStyle(layout["journey/20"])} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Декоративные гравюры/монограммы (PNG-блобы), разбросанные по фону коллажа.
function Engraving1() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-1" style={elStyle(layout["journey/engraving-1"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/22" style={elStyle(layout["journey/22"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_0.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/23" style={elStyle(layout["journey/23"])} />
      </div>
    </div>
  );
}

function Engraving2() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-2" style={elStyle(layout["journey/engraving-2"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/25" style={elStyle(layout["journey/25"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_1.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/26" style={elStyle(layout["journey/26"])} />
      </div>
    </div>
  );
}

function Engraving3() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-3" style={elStyle(layout["journey/engraving-3"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/28" style={elStyle(layout["journey/28"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_2.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/29" style={elStyle(layout["journey/29"])} />
      </div>
    </div>
  );
}

function Engraving4() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-4" style={elStyle(layout["journey/engraving-4"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/31" style={elStyle(layout["journey/31"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_3.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/32" style={elStyle(layout["journey/32"])} />
      </div>
    </div>
  );
}

function Engraving5() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-5" style={elStyle(layout["journey/engraving-5"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/34" style={elStyle(layout["journey/34"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_4.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/35" style={elStyle(layout["journey/35"])} />
      </div>
    </div>
  );
}

function Engraving6() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-6" style={elStyle(layout["journey/engraving-6"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)} data-eid="journey/37" style={elStyle(layout["journey/37"])}>
              <div className={styles.Izwocg} data-eid="journey/38" style={elStyle(layout["journey/38"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_5.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/39" style={elStyle(layout["journey/39"])} />
      </div>
    </div>
  );
}

// Круглые фото в круговой маске (clipPath) — три портрета.
function CirclePhoto1() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/circle-photo-1" style={elStyle(layout["journey/circle-photo-1"])}>
      <div data-eid="journey/41" style={elStyle(layout["journey/41"])}>
        <div className={styles.hWv4NA} data-eid="journey/42" style={elStyle(layout["journey/42"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id106">
                <path d="M0,0L256,0L256,256L0,256Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid="journey/43" style={elStyle(layout["journey/43"])}>
            <div className={cx(styles._4c2rDg, styles.GxUsfw)} data-eid="journey/44" style={elStyle(layout["journey/44"])}>
              <div className={styles.qhHTGg} data-eid="journey/circle-photo-1-img" style={elStyle(layout["journey/circle-photo-1-img"])}>
                <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/ab56760e8e783687bdda2bcbc1ffd2d9.jpg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.Pr6LEA} />
      </div>
    </div>
  );
}

function CirclePhoto2() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/circle-photo-2" style={elStyle(layout["journey/circle-photo-2"])}>
      <div data-eid="journey/47" style={elStyle(layout["journey/47"])}>
        <div className={styles.hWv4NA} data-eid="journey/48" style={elStyle(layout["journey/48"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id107">
                <path d="M0,0L256,0L256,256L0,256Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid="journey/49" style={elStyle(layout["journey/49"])}>
            <div className={cx(styles._4c2rDg, styles.GxUsfw)} data-eid="journey/50" style={elStyle(layout["journey/50"])}>
              <div className={styles.qhHTGg} data-eid="journey/circle-photo-2-img" style={elStyle(layout["journey/circle-photo-2-img"])}>
                <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/c710cbd2553d9c393b8b202ef062eef1.jpg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.Pr6LEA} />
      </div>
    </div>
  );
}

function CirclePhoto3() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/circle-photo-3" style={elStyle(layout["journey/circle-photo-3"])}>
      <div data-eid="journey/53" style={elStyle(layout["journey/53"])}>
        <div className={styles.hWv4NA} data-eid="journey/54" style={elStyle(layout["journey/54"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id108">
                <path d="M0,0L256,0L256,256L0,256Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid="journey/55" style={elStyle(layout["journey/55"])}>
            <div className={cx(styles._4c2rDg, styles.GxUsfw)} data-eid="journey/56" style={elStyle(layout["journey/56"])}>
              <div className={styles.qhHTGg} data-eid="journey/circle-photo-3-img" style={elStyle(layout["journey/circle-photo-3-img"])}>
                <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/c38a1de946f746cf2b687741bcbe0585.jpg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.Pr6LEA} />
      </div>
    </div>
  );
}

// Ещё гравюры/монограммы поверх круглых фото.
function Engraving7() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-7" style={elStyle(layout["journey/engraving-7"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/59" style={elStyle(layout["journey/59"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_6.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/60" style={elStyle(layout["journey/60"])} />
      </div>
    </div>
  );
}

function Engraving8() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-8" style={elStyle(layout["journey/engraving-8"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/62" style={elStyle(layout["journey/62"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_7.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/63" style={elStyle(layout["journey/63"])} />
      </div>
    </div>
  );
}

function Engraving9() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-9" style={elStyle(layout["journey/engraving-9"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/65" style={elStyle(layout["journey/65"])}>
                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_8.png" />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/66" style={elStyle(layout["journey/66"])} />
      </div>
    </div>
  );
}

// Заголовок секции «A journey of love».
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/title" style={elStyle(layout["journey/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="journey/68" style={elStyle(layout["journey/68"])}>
        <div data-eid="journey/69" style={elStyle(layout["journey/69"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="journey/70" style={elStyle(layout["journey/70"])}>
                  <span className={styles.a_GcMg} data-eid="journey/title-text" style={elStyle(layout["journey/title-text"])}>
                    {"A journey of love"}
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

// Подпись 1: «we first met…».
function Caption1() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/caption-1" style={elStyle(layout["journey/caption-1"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="journey/73" style={elStyle(layout["journey/73"])}>
        <div data-eid="journey/74" style={elStyle(layout["journey/74"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="journey/75" style={elStyle(layout["journey/75"])}>
                  <span className={styles.a_GcMg} data-eid="journey/caption-1-text" style={elStyle(layout["journey/caption-1-text"])}>
                    {"we first met and little did we"}
                    <br />
                    {"know it was the beginning of"}
                    <br />
                    {"something beautiful."}
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

// Подпись 2: «we started our journey together…».
function Caption2() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/caption-2" style={elStyle(layout["journey/caption-2"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="journey/78" style={elStyle(layout["journey/78"])}>
        <div data-eid="journey/79" style={elStyle(layout["journey/79"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="journey/80" style={elStyle(layout["journey/80"])}>
                  <span className={styles.a_GcMg} data-eid="journey/caption-2-text" style={elStyle(layout["journey/caption-2-text"])}>
                    {"we started our journey together,"}
                    <br />
                    {"sharing laughter, dreams, and"}
                    <br />
                    {"countless memories."}
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

// Подпись 3: «a heartfelt proposal…».
function Caption3() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/caption-3" style={elStyle(layout["journey/caption-3"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="journey/83" style={elStyle(layout["journey/83"])}>
        <div data-eid="journey/84" style={elStyle(layout["journey/84"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="journey/85" style={elStyle(layout["journey/85"])}>
                  <span className={styles.a_GcMg} data-eid="journey/caption-3-text" style={elStyle(layout["journey/caption-3-text"])}>
                    {"a heartfelt proposal sealed our"}
                    <br />
                    {"promise to walk hand in hand"}
                    <br />
                    {"for a lifetime."}
                  </span>
                  <span className={cx(styles.a_GcMg, styles.zYq_BQ)} data-eid="journey/87" style={elStyle(layout["journey/87"])}>
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

// Прозрачный оверлей-слой поверх всей секции.
function Overlay() {
  return (
    <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="journey/overlay" style={elStyle(layout["journey/overlay"])} />
  );
}

export default function Journey() {
  return (
      <section className={"rGeu6w"} id="PBYbv3X7MfRLX7B4" data-scroll-ready="true" data-eid="journey/0" style={elStyle(layout["journey/0"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="journey/1" style={elStyle(layout["journey/1"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="journey/2" style={elStyle(layout["journey/2"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="journey/3" style={elStyle(layout["journey/3"])}>
                    <div className={styles._6t4CHA}>
                      <div className={styles.a26Xuw}>
                        <BackdropPhoto />
                        <BackdropPhotoImage />
                      </div>
                    </div>
                    <div data-eid="journey/6" style={elStyle(layout["journey/6"])} />
                    <PhotoCollage />
                    <Engraving1 />
                    <Engraving2 />
                    <Engraving3 />
                    <Engraving4 />
                    <Engraving5 />
                    <Engraving6 />
                    <CirclePhoto1 />
                    <CirclePhoto2 />
                    <CirclePhoto3 />
                    <Engraving7 />
                    <Engraving8 />
                    <Engraving9 />
                    <Title />
                    <Caption1 />
                    <Caption2 />
                    <Caption3 />
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
