// design06 section Journey (Canva id PBYbv3X7MfRLX7B4). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Journey.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Journey.layout";
import { assetUrl } from "../assetUrl";

// Полноэкранное фоновое фото (повёрнуто на 90°), лежит под всем коллажем.
function BackdropPhoto() {
  return (
    <div className={styles.fbzKiw} data-eid="journey/fill" style={elStyle(layout["journey/fill"])} />
  );
}

function BackdropPhotoImage() {
  return (
    <div className={styles.PcHy7w}>
      <div className={cx(styles.uk_25A, styles.Ty61NA)}>
        <div className={styles.Izwocg} data-eid="journey/backdrop-photo" style={elStyle(layout["journey/backdrop-photo"])}>
          <img loading="lazy" decoding="async" className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg")} />
        </div>
      </div>
    </div>
  );
}

// Сетка-коллаж из пяти фотографий (одна большая сверху + 2×2 снизу).
function PhotoCollage() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/collage" style={elStyle(layout["journey/collage"])}>
      <div data-eid="journey/box-1" style={elStyle(layout["journey/box-1"])}>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/block-1" style={elStyle(layout["journey/block-1"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="journey/imgwrap-1" style={elStyle(layout["journey/imgwrap-1"])}>
                    <img loading="lazy" decoding="async" style={{ objectFit: "cover" }} className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/photo_2026-06-24_12.30.54.jpeg")} />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="journey/box-2" style={elStyle(layout["journey/box-2"])} />
          </div>
        </div>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/block-2" style={elStyle(layout["journey/block-2"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="journey/imgwrap-2" style={elStyle(layout["journey/imgwrap-2"])}>
                    <img loading="lazy" decoding="async" style={{ objectFit: "cover" }} className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/photo_2026-06-24_12.30.50.jpeg")} />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="journey/box-3" style={elStyle(layout["journey/box-3"])} />
          </div>
        </div>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/block-3" style={elStyle(layout["journey/block-3"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="journey/imgwrap-3" style={elStyle(layout["journey/imgwrap-3"])}>
                    <img loading="lazy" decoding="async" style={{ objectFit: "cover" }} className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/photo_2026-06-24_12.30.53.jpeg")} />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="journey/box-4" style={elStyle(layout["journey/box-4"])} />
          </div>
        </div>
        <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/block-4" style={elStyle(layout["journey/block-4"])}>
          <div className={styles.Zp7NQw}>
            <div className={styles.a26Xuw}>
              <div className={styles.PcHy7w}>
                <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                  <div className={styles.Izwocg} data-eid="journey/imgwrap-4" style={elStyle(layout["journey/imgwrap-4"])}>
                    <img loading="lazy" decoding="async" style={{ objectFit: "cover" }} className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/photo_2026-06-24_12.30.56.jpeg")} />
                  </div>
                </div>
              </div>
            </div>
            <div data-eid="journey/box-5" style={elStyle(layout["journey/box-5"])} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Рукописная надпись «История любви» в три строки вместо моста — заезжает под верх коллажа
// (рендерится ДО коллажа, поэтому фото перекрывают её нижние строки).
function LoveStory() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/lovestory" style={elStyle(layout["journey/lovestory"])}>
      <div data-eid="journey/lovestory-text" style={elStyle(layout["journey/lovestory-text"])}>
        <div style={{ marginLeft: "0px" }}>{"История любви"}</div>
        <div style={{ marginLeft: "90px" }}>{"История любви"}</div>
        <div style={{ marginLeft: "180px" }}>{"История любви"}</div>
      </div>
    </div>
  );
}

// Декоративные гравюры/монограммы (PNG-блобы), разбросанные по фону коллажа.

function Engraving2() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/engraving-2" style={elStyle(layout["journey/engraving-2"])}>
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div className={styles.Izwocg} data-eid="journey/imgwrap-6" style={elStyle(layout["journey/imgwrap-6"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_1.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/box-7" style={elStyle(layout["journey/box-7"])} />
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
              <div className={styles.Izwocg} data-eid="journey/imgwrap-7" style={elStyle(layout["journey/imgwrap-7"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_2.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/box-8" style={elStyle(layout["journey/box-8"])} />
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
              <div className={styles.Izwocg} data-eid="journey/imgwrap-8" style={elStyle(layout["journey/imgwrap-8"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_3.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/box-9" style={elStyle(layout["journey/box-9"])} />
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
              <div className={styles.Izwocg} data-eid="journey/imgwrap-9" style={elStyle(layout["journey/imgwrap-9"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_4.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/box-10" style={elStyle(layout["journey/box-10"])} />
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
            <div className={cx(styles.uk_25A, styles.Ty61NA)} data-eid="journey/imgbox" style={elStyle(layout["journey/imgbox"])}>
              <div className={styles.Izwocg} data-eid="journey/imgwrap-10" style={elStyle(layout["journey/imgwrap-10"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_5.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/box-11" style={elStyle(layout["journey/box-11"])} />
      </div>
    </div>
  );
}

// Круглые фото в круговой маске (clipPath) — три портрета.
function CirclePhoto1() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/circle-photo-1" style={elStyle(layout["journey/circle-photo-1"])}>
      <div data-eid="journey/box-12" style={elStyle(layout["journey/box-12"])}>
        <div className={styles.hWv4NA} data-eid="journey/mask-1" style={elStyle(layout["journey/mask-1"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id106">
                <path d="M0,0L256,0L256,256L0,256Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid="journey/clip-1" style={elStyle(layout["journey/clip-1"])}>
            <div className={cx(styles._4c2rDg, styles.GxUsfw)} data-eid="journey/cliptf-1" style={elStyle(layout["journey/cliptf-1"])}>
              <div className={styles.qhHTGg} data-eid="journey/circle-photo-1-img" style={elStyle(layout["journey/circle-photo-1-img"])}>
                <img loading="lazy" decoding="async" style={{ objectFit: "cover" }} className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/photo_2026-06-24_12.31.09.jpeg")} />
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
      <div data-eid="journey/box-13" style={elStyle(layout["journey/box-13"])}>
        <div className={styles.hWv4NA} data-eid="journey/mask-2" style={elStyle(layout["journey/mask-2"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id107">
                <path d="M0,0L256,0L256,256L0,256Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid="journey/clip-2" style={elStyle(layout["journey/clip-2"])}>
            <div className={cx(styles._4c2rDg, styles.GxUsfw)} data-eid="journey/cliptf-2" style={elStyle(layout["journey/cliptf-2"])}>
              <div className={styles.qhHTGg} data-eid="journey/circle-photo-2-img" style={elStyle(layout["journey/circle-photo-2-img"])}>
                <img loading="lazy" decoding="async" style={{ objectFit: "cover" }} className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/photo_2026-06-24_12.30.50.jpeg")} />
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
      <div data-eid="journey/box-14" style={elStyle(layout["journey/box-14"])}>
        <div className={styles.hWv4NA} data-eid="journey/mask-3" style={elStyle(layout["journey/mask-3"])}>
          <svg className={styles._7KaXww}>
            <defs>
              <clipPath id="__id108">
                <path d="M0,0L256,0L256,256L0,256Z" />
              </clipPath>
            </defs>
          </svg>
          <div className={styles.bFnJ2A} data-eid="journey/clip-3" style={elStyle(layout["journey/clip-3"])}>
            <div className={cx(styles._4c2rDg, styles.GxUsfw)} data-eid="journey/cliptf-3" style={elStyle(layout["journey/cliptf-3"])}>
              <div className={styles.qhHTGg} data-eid="journey/circle-photo-3-img" style={elStyle(layout["journey/circle-photo-3-img"])}>
                <img loading="lazy" decoding="async" style={{ objectFit: "cover" }} className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/media/photo_2026-06-24_12.31.05.jpeg")} />
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
              <div className={styles.Izwocg} data-eid="journey/imgwrap-11" style={elStyle(layout["journey/imgwrap-11"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_6.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/box-15" style={elStyle(layout["journey/box-15"])} />
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
              <div className={styles.Izwocg} data-eid="journey/imgwrap-12" style={elStyle(layout["journey/imgwrap-12"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_7.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/box-16" style={elStyle(layout["journey/box-16"])} />
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
              <div className={styles.Izwocg} data-eid="journey/imgwrap-13" style={elStyle(layout["journey/imgwrap-13"])}>
                <img loading="lazy" decoding="async" className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src={assetUrl("/design06-exact/_assets/blobs/PBYbv3X7MfRLX7B4_8.png")} />
              </div>
            </div>
          </div>
        </div>
        <div data-eid="journey/box-17" style={elStyle(layout["journey/box-17"])} />
      </div>
    </div>
  );
}

// Заголовок секции «A journey of love».
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="journey/title" style={elStyle(layout["journey/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="journey/text-1" style={elStyle(layout["journey/text-1"])}>
        <div data-eid="journey/box-18" style={elStyle(layout["journey/box-18"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="journey/para-1" style={elStyle(layout["journey/para-1"])}>
                  <span className={styles.a_GcMg} data-eid="journey/title-text" style={elStyle(layout["journey/title-text"])}>
                    {"Наша история"}
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
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="journey/text-2" style={elStyle(layout["journey/text-2"])}>
        <div data-eid="journey/box-19" style={elStyle(layout["journey/box-19"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="journey/para-2" style={elStyle(layout["journey/para-2"])}>
                  <span className={styles.a_GcMg} data-eid="journey/caption-1-text" style={elStyle(layout["journey/caption-1-text"])}>
                    {"чтобы познакомиться Влад  догонял Олю бегом, настолько она была красивая"}
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
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="journey/text-3" style={elStyle(layout["journey/text-3"])}>
        <div data-eid="journey/box-20" style={elStyle(layout["journey/box-20"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="journey/para-3" style={elStyle(layout["journey/para-3"])}>
                  <span className={styles.a_GcMg} data-eid="journey/caption-2-text" style={elStyle(layout["journey/caption-2-text"])}>
                    {"мы вместе много путешествовали, пережили, работали, отдыхали и много-много всего обсуждали"}
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
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="journey/text-4" style={elStyle(layout["journey/text-4"])}>
        <div data-eid="journey/box-21" style={elStyle(layout["journey/box-21"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="journey/para-4" style={elStyle(layout["journey/para-4"])}>
                  <span className={styles.a_GcMg} data-eid="journey/caption-3-text" style={elStyle(layout["journey/caption-3-text"])}>
                    {"и теперь мы хотим сохранить эту связь навсегда "}
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
      <section className={"rGeu6w"} id="PBYbv3X7MfRLX7B4" data-scroll-ready="true" data-eid="journey/sectionbox" style={elStyle(layout["journey/sectionbox"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="journey/frame" style={elStyle(layout["journey/frame"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="journey/canvas" style={elStyle(layout["journey/canvas"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="journey/content" style={elStyle(layout["journey/content"])}>
                    <div className={styles._6t4CHA}>
                      <div className={styles.a26Xuw}>
                        <BackdropPhoto />
                        <BackdropPhotoImage />
                      </div>
                    </div>
                    <div data-eid="journey/box-22" style={elStyle(layout["journey/box-22"])} />
                    <LoveStory />
                    <PhotoCollage />
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
