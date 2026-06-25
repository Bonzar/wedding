// design06 section Calendar (Canva id PBtLyKJDZDgGk7P1). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Calendar.layout.ts и применяются по data-eid (Approach A2).
import type { CSSProperties } from "react";
import { cx } from "../cx";
import { elStyle, u } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Calendar.layout";
import { useEffect, useState } from "react";
import { assetUrl } from "../assetUrl";
import { useCountdown } from "@/hooks/useCountdown";
import { WEDDING_DATE_ISO } from "@/content/wedding";

// Свадьба — суббота 26 сентября 2026. Показываем одну неделю (ПН-старт), 26 в сердце.
const WEEK_DAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const WEEK_DATES = [21, 22, 23, 24, 25, 26, 27];
const WEDDING_DAY = 26;

export default function Calendar() {
  return (
    <section
      className={"rGeu6w"}
      id="PBtLyKJDZDgGk7P1"
      data-scroll-ready="true"
      data-eid="calendar/section"
      style={elStyle(layout["calendar/section"])}
    >
      <div>
        <div
          className={styles.onhyOQ}
          data-eid="calendar/frame"
          style={elStyle(layout["calendar/frame"])}
        >
          <div className={styles.twbtjQ}>
            <div
              className={styles.GDnEHQ}
              data-eid="calendar/canvas"
              style={elStyle(layout["calendar/canvas"])}
            >
              <div className={styles.o2Yl2g}>
                <div
                  className={styles._mXnjA}
                  lang="en"
                  data-eid="calendar/content"
                  style={elStyle(layout["calendar/content"])}
                >
                  <Backdrop />
                  <div
                    data-eid="calendar/box-1"
                    style={elStyle(layout["calendar/box-1"])}
                  />
                  <EngravingTop />
                  <Pretitle />
                  <EngravingMid />
                  <CalendarGrid />
                  <EngravingLeaf2 />
                  <Map />
                  <MapsButton />
                  <MonthHeading />
                  <LocationHeading />
                  <LocationAddress />
                  <MapsLink />
                  <Countdown />
                </div>
              </div>
            </div>
            <div
              className={cx(styles.QhExXw, styles.pKfnlA)}
              data-eid="calendar/overlay"
              style={elStyle(layout["calendar/overlay"])}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Backdrop() {
  return (
    <div className={styles._6t4CHA}>
      <div className={styles.a26Xuw}>
        <div
          className={styles.fbzKiw}
          data-eid="calendar/backdrop"
          style={elStyle(layout["calendar/backdrop"])}
        />
        <div className={styles.PcHy7w}>
          <div className={cx(styles.uk_25A, styles.Ty61NA)}>
            <div
              className={styles.Izwocg}
              data-eid="calendar/backdrop-photo"
              style={elStyle(layout["calendar/backdrop-photo"])}
            >
              <img loading="lazy" decoding="async"
                className={styles._7_i_XA}
                crossOrigin="anonymous"
                draggable={false}
                src={assetUrl("/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngravingTop() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/engraving-top"
      style={elStyle(layout["calendar/engraving-top"])}
    >
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div
                className={styles.Izwocg}
                data-eid="calendar/engraving-top-img"
                style={elStyle(layout["calendar/engraving-top-img"])}
              >
                <img loading="lazy" decoding="async"
                  className={styles.dMHlHA}
                  crossOrigin="anonymous"
                  draggable={false}
                  src={assetUrl("/design06-exact/_assets/blobs/PBtLyKJDZDgGk7P1_0.png")}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          data-eid="calendar/box-2"
          style={elStyle(layout["calendar/box-2"])}
        />
      </div>
    </div>
  );
}

function Pretitle() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/pretitle"
      style={elStyle(layout["calendar/pretitle"])}
    >
      <div
        className={cx(styles.aF9o6Q, styles._0yZ6Qg)}
        data-eid="calendar/text-1"
        style={elStyle(layout["calendar/text-1"])}
      >
        <div
          data-eid="calendar/box-3"
          style={elStyle(layout["calendar/box-3"])}
        >
          <div className={styles.E8yZTA}>
            <div>
              <div
                className={cx(
                  styles._2UyCZQ,
                  styles.vkN2Cw,
                  styles.Mb8E_A,
                  styles.e1_zQg,
                )}
                lang="en" 
              >
                <p
                  className={cx(
                    styles._28USrA,
                    styles.AfeL7g,
                    styles.XN6uKA,
                    styles._4N4NA,
                  )}
                  data-eid="calendar/pretitle-text"
                  style={elStyle(layout["calendar/pretitle-text"])}
                >
                  <span
                    className={styles.a_GcMg}
                    data-eid="calendar/span-1"
                    style={elStyle(layout["calendar/span-1"])}
                  >
                    {""}
                  </span>
                  <span
                    className={styles.a_GcMg}
                    data-eid="calendar/span-2"
                    style={elStyle(layout["calendar/span-2"])}
                  >
                    {"До начала счастливой жизни"}
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

function EngravingMid() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/engraving-mid"
      style={elStyle(layout["calendar/engraving-mid"])}
    >
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div
                className={styles.Izwocg}
                data-eid="calendar/engraving-mid-img"
                style={elStyle(layout["calendar/engraving-mid-img"])}
              >
                <img loading="lazy" decoding="async"
                  className={styles.dMHlHA}
                  crossOrigin="anonymous"
                  draggable={false}
                  src={assetUrl("/design06-exact/_assets/blobs/PBtLyKJDZDgGk7P1_1.png")}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          data-eid="calendar/box-4"
          style={elStyle(layout["calendar/box-4"])}
        />
      </div>
    </div>
  );
}

function CalendarGrid() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/grid"
      style={elStyle(layout["calendar/grid"])}
    >
      <div
        className={styles.hbcXuA}
        data-eid="calendar/tablewrap"
        style={elStyle(layout["calendar/tablewrap"])}
      >
        <svg
          className={styles.aXBSSA}
          role="presentation"
          viewBox="0 0 913 775"
          data-eid="calendar/tablesvg"
          style={elStyle(layout["calendar/tablesvg"])}
        >
          <defs />
        </svg>
        <table
          className={cx(styles.csGvXg, styles._DyBwg)}
          data-eid="calendar/grid-table"
          style={elStyle(layout["calendar/grid-table"])}
        >
          <tbody>
            <tr>
              {WEEK_DAYS.map((day, i) => (
                <td key={`h${i}`} colSpan={1} rowSpan={1}>
                  <div
                    className={styles._5RL20Q}
                    data-eid={`calendar/cell-${1 + i}`}
                    style={elStyle(layout[`calendar/cell-${1 + i}`])}
                  >
                    <div
                      className={styles.xam_ew}
                      data-eid={`calendar/cellpad-${1 + i}`}
                      style={elStyle(layout[`calendar/cellpad-${1 + i}`])}
                    >
                      <div
                        className={styles.iRGCPA}
                        data-eid={`calendar/cellalign-${1 + i}`}
                        style={elStyle(layout[`calendar/cellalign-${1 + i}`])}
                      >
                        <div className={styles._0yZ6Qg}>
                          <div
                            data-eid={`calendar/box-${5 + i}`}
                            style={elStyle(layout[`calendar/box-${5 + i}`])}
                          >
                            <div className={styles.E8yZTA}>
                              <div>
                                <div
                                  className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)}
                                  lang="en"
                                >
                                  <p
                                    className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)}
                                    data-eid={`calendar/para-${1 + i}`}
                                    style={elStyle(layout[`calendar/para-${1 + i}`])}
                                  >
                                    <span
                                      className={styles.a_GcMg}
                                      data-eid={`calendar/span-${3 + i}`}
                                      style={elStyle(layout[`calendar/span-${3 + i}`])}
                                    >
                                      {day}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              {WEEK_DATES.map((date, i) => (
                <td key={`d${i}`} colSpan={1} rowSpan={1}>
                  <div
                    className={styles._5RL20Q}
                    data-eid={`calendar/cell-${8 + i}`}
                    style={elStyle(layout[`calendar/cell-${8 + i}`])}
                  >
                    {date === WEDDING_DAY && (
                      <div
                        data-eid="calendar/heart"
                        style={elStyle(layout["calendar/heart"])}
                      >
                        <svg
                          viewBox="0 0 150 136"
                          width="100%"
                          height="100%"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M75 128C75 128 10 88 10 44C10 22 25 10 43 10C57 10 68 19 75 32C82 19 93 10 107 10C125 10 140 22 140 44C140 88 75 128 75 128Z"
                            style={{ stroke: "var(--d06-ink, rgb(53, 80, 116))" }}
                            strokeWidth="4"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <div
                      className={styles.xam_ew}
                      data-eid={`calendar/cellpad-${8 + i}`}
                      style={elStyle(layout[`calendar/cellpad-${8 + i}`])}
                    >
                      <div
                        className={styles.iRGCPA}
                        data-eid={`calendar/cellalign-${8 + i}`}
                        style={elStyle(layout[`calendar/cellalign-${8 + i}`])}
                      >
                        <div className={styles._0yZ6Qg}>
                          <div
                            data-eid="calendar/week-box"
                            style={elStyle(layout["calendar/week-box"])}
                          >
                            <div className={styles.E8yZTA}>
                              <div>
                                <div
                                  className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)}
                                  lang="en"
                                >
                                  <p
                                    className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)}
                                    data-eid="calendar/week-num"
                                    style={elStyle(layout["calendar/week-num"])}
                                  >
                                    <span
                                      className={styles.a_GcMg}
                                      data-eid="calendar/week-span"
                                      style={elStyle(layout["calendar/week-span"])}
                                    >
                                      {String(date)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div
          data-eid="calendar/heart-line"
          style={elStyle(layout["calendar/heart-line"])}
        />
        <svg
          className={styles.nrDMmw}
          role="presentation"
          viewBox="0 0 913 775"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          data-eid="calendar/lineoverlay"
          style={elStyle(layout["calendar/lineoverlay"])}
        />
      </div>
    </div>
  );
}

function EngravingLeaf2() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/engraving-leaf2"
      style={elStyle(layout["calendar/engraving-leaf2"])}
    >
      <div className={styles.Zp7NQw}>
        <div className={styles.a26Xuw}>
          <div className={styles.PcHy7w}>
            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
              <div
                className={styles.Izwocg}
                data-eid="calendar/engraving-leaf2-img"
                style={elStyle(layout["calendar/engraving-leaf2-img"])}
              >
                <img loading="lazy" decoding="async"
                  className={styles.dMHlHA}
                  crossOrigin="anonymous"
                  draggable={false}
                  src={assetUrl("/design06-exact/_assets/blobs/PBtLyKJDZDgGk7P1_3.png")}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          data-eid="calendar/box-41"
          style={elStyle(layout["calendar/box-41"])}
        />
      </div>
    </div>
  );
}

// Карта места («Три кедра»). Занимает пустое поле между адресом и кнопкой «Яндекс Карты».
// Позиция/размер — в Calendar.layout.ts (data-eid="calendar/map").
//
// ВАЖНО: живой WebGL-виджет Яндекс-карты роняет вкладку на iOS (краш рендер-процесса →
// «A problem repeatedly occurred» при появлении карты в скролле). Ни вынос iframe из
// transform-канвы, ни сжатие картинок страницы не помогли — поэтому отказались от живого
// виджета в пользу СТАТИЧНОЙ КАРТИНКИ: обычный <img> (никакого WebGL/iframe), который
// гарантированно не падает. Тап по карте открывает полные интерактивные Яндекс-карты.
// Статика — локальный PNG (скачан с Яндекс Static Maps по координатам места), лежит в
// ассетах: никакой внешней зависимости/referer/устаревания, ~0.8 МБ в памяти.
const MAP_IMG_SRC = assetUrl("/design06-exact/_assets/media/map-tri-kedra.png");
const MAP_LINK = "https://yandex.ru/maps/-/CTQNvQK3";

const FRAME_BORDER = "2px solid var(--d06-ink, rgb(53, 80, 116))";
const FRAME_RADIUS = 16;

// Размер задаётся в редакторе под десктоп (calendar/map). Но на узких экранах весь лист
// 1776px ужимается под ширину экрана, поэтому крупная карта забирает почти всю ширину и
// «доминирует». На мобиле уменьшаем карту на MAP_MOBILE_SCALE от заданного, держа центр.
// Порог = 880 (как MAX_WIDTH в Design06: ≤880 лист = весь экран, >880 — поля по бокам).
const MAP_MOBILE_BP = 880;
const MAP_MOBILE_SCALE = 0.6;

function Map() {
  const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1280));
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Геометрия: на мобиле уменьшаем от заданного в редакторе, держим центр.
  const base = layout["calendar/map"];
  const f = vw <= MAP_MOBILE_BP ? MAP_MOBILE_SCALE : 1;
  const bw = (base.w ?? 0) * f;
  const bh = (base.h ?? 0) * f;
  const holderEl =
    f === 1
      ? base
      : { ...base, w: bw, h: bh, x: (base.x ?? 0) + ((base.w ?? 0) - bw) / 2, y: (base.y ?? 0) + ((base.h ?? 0) - bh) / 2 };

  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/map"
      style={{
        ...elStyle(holderEl),
        border: FRAME_BORDER,
        borderRadius: FRAME_RADIUS,
        overflow: "hidden",
        background: "color-mix(in srgb, var(--d06-ink, rgb(53, 80, 116)) 6%, transparent)",
      }}
    >
      <a
        href={MAP_LINK}
        target="_blank"
        rel="noopener nofollow"
        draggable={false}
        aria-label="Открыть карту — Сочи, Три кедра"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <img
          src={MAP_IMG_SRC}
          alt="Карта — Сочи, Центральный район, Три кедра"
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </a>
    </div>
  );
}

function MapsButton() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/maps-button"
      style={elStyle(layout["calendar/maps-button"])}
    >
      <div
        data-eid="calendar/box-42"
        style={elStyle(layout["calendar/box-42"])}
      >
        <div
          className={styles.hWv4NA}
          data-eid="calendar/mask"
          style={elStyle(layout["calendar/mask"])}
        >
          <svg className={styles._7KaXww}>
            <defs>
              {/* objectBoundingBox: координаты нормированы в доли (÷1161.7486 по x, ÷256 по y).
                  userSpaceOnUse-пилюля 1161×256 не масштабировалась → на 880 fill кнопки ~80px
                  показывал лишь кусок → кривая форма. Равномерный масштаб бокса сохраняет пилюлю. */}
              <clipPath id="__id27" clipPathUnits="objectBoundingBox">
                <path d="M0.110179,0L0.889808,0C0.950662,0 1,0.223857 1,0.5C1,0.776142 0.950662,1 0.889808,1L0.110179,1C0.049330,1 0,0.776142 0,0.5C0,0.223857 0.049330,0 0.110179,0Z" />
              </clipPath>
            </defs>
          </svg>
          <div
            className={styles.bFnJ2A}
            data-eid="calendar/maps-button-pill"
            style={elStyle(layout["calendar/maps-button-pill"])}
          />
        </div>
      </div>
    </div>
  );
}

function MonthHeading() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/month-heading"
      style={elStyle(layout["calendar/month-heading"])}
    >
      <div
        className={cx(styles.aF9o6Q, styles._0yZ6Qg)}
        data-eid="calendar/text-2"
        style={elStyle(layout["calendar/text-2"])}
      >
        <div
          data-eid="calendar/box-43"
          style={elStyle(layout["calendar/box-43"])}
        >
          <div className={styles.E8yZTA}>
            <div>
              <div
                className={cx(
                  styles._2UyCZQ,
                  styles.vkN2Cw,
                  styles.Mb8E_A,
                  styles.e1_zQg,
                )}
                lang="en"
              >
                <p
                  className={cx(
                    styles._28USrA,
                    styles.AfeL7g,
                    styles.XN6uKA,
                    styles._4N4NA,
                  )}
                  data-eid="calendar/month-heading-text"
                  style={elStyle(layout["calendar/month-heading-text"])}
                >
                  <span
                    className={styles.a_GcMg}
                    data-eid="calendar/span-38"
                    style={elStyle(layout["calendar/span-38"])}
                  >
                    {"Сентябрь, 2026"}
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

function LocationHeading() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/location-heading"
      style={elStyle(layout["calendar/location-heading"])}
    >
      <div
        className={cx(styles.aF9o6Q, styles._0yZ6Qg)}
        data-eid="calendar/text-4"
        style={elStyle(layout["calendar/text-4"])}
      >
        <div
          data-eid="calendar/box-45"
          style={elStyle(layout["calendar/box-45"])}
        >
          <div className={styles.E8yZTA}>
            <div>
              <div
                className={cx(
                  styles._2UyCZQ,
                  styles.vkN2Cw,
                  styles.Mb8E_A,
                  styles.e1_zQg,
                )}
                lang="en"
              >
                <p
                  className={cx(
                    styles._28USrA,
                    styles.AfeL7g,
                    styles.XN6uKA,
                    styles._4N4NA,
                  )}
                  data-eid="calendar/location-heading-text"
                  style={elStyle(layout["calendar/location-heading-text"])}
                >
                  <span
                    className={styles.a_GcMg}
                    data-eid="calendar/span-40"
                    style={elStyle(layout["calendar/span-40"])}
                  >
                    {"Место"}
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

function LocationAddress() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/location-address"
      style={elStyle(layout["calendar/location-address"])}
    >
      <div
        className={cx(styles.aF9o6Q, styles._0yZ6Qg)}
        data-eid="calendar/text-5"
        style={elStyle(layout["calendar/text-5"])}
      >
        <div
          data-eid="calendar/box-46"
          style={elStyle(layout["calendar/box-46"])}
        >
          <div className={styles.E8yZTA}>
            <div>
              <div
                className={cx(
                  styles._2UyCZQ,
                  styles.vkN2Cw,
                  styles.Mb8E_A,
                  styles.e1_zQg,
                )}
                lang="en"
              >
                <p
                  className={cx(
                    styles._28USrA,
                    styles.AfeL7g,
                    styles.XN6uKA,
                    styles._4N4NA,
                  )}
                  data-eid="calendar/location-address-text"
                  style={elStyle(layout["calendar/location-address-text"])}
                >
                  <span
                    className={styles.a_GcMg}
                    data-eid="calendar/span-41"
                    style={elStyle(layout["calendar/span-41"])}
                  >
                    {"Сочи, Центральный район, Три кедра"}
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

function MapsLink() {
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/maps-link"
      style={elStyle(layout["calendar/maps-link"])}
    >
      <div
        className={cx(styles.aF9o6Q, styles._0yZ6Qg)}
        data-eid="calendar/text-6"
        style={elStyle(layout["calendar/text-6"])}
      >
        <div
          data-eid="calendar/box-47"
          style={elStyle(layout["calendar/box-47"])}
        >
          <div className={styles.E8yZTA}>
            <div>
              <div
                className={cx(
                  styles._2UyCZQ,
                  styles.vkN2Cw,
                  styles.Mb8E_A,
                  styles.e1_zQg,
                )}
                lang="en"
              >
                <p
                  className={cx(
                    styles._28USrA,
                    styles.AfeL7g,
                    styles.XN6uKA,
                    styles._4N4NA,
                  )}
                  data-eid="calendar/maps-link-anchor"
                  style={elStyle(layout["calendar/maps-link-anchor"])}
                >
                  <a
                    className={styles.a_GcMg}
                    href="https://yandex.ru/maps/-/CTQNvQK3"
                    target="_blank"
                    draggable={false}
                    rel="noopener nofollow"
                    data-eid="calendar/span-42"
                    style={elStyle(layout["calendar/span-42"])}
                  >
                    {"Яндекс Карты"}
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

const pad2 = (n: number) => String(n).padStart(2, "0");

// Обратный отсчёт до WEDDING_DATE_ISO. Нативный (вместо Canva-эмбеда tickcounter) —
// в стилистике секции: Jost, чернильный rgb(53,80,116), формат ДД : ЧЧ : ММ : СС.
function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE_ISO);
  const num: CSSProperties = {
    fontFamily: '"Jost", system-ui, sans-serif',
    fontWeight: 300,
    fontSize: u(58), // через --d06u (хардкод-px мимо elStyle → масштабируется как всё)
    lineHeight: 1,
    color: "var(--d06-ink, rgb(53, 80, 116))",
    fontVariantNumeric: "tabular-nums",
  };
  const label: CSSProperties = {
    marginTop: u(12),
    fontFamily: '"Jost", system-ui, sans-serif',
    fontWeight: 400,
    fontSize: u(26),
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "color-mix(in srgb, var(--d06-ink, rgb(53, 80, 116)) 78%, transparent)",
  };
  const cell: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: u(120),
  };
  const sep: CSSProperties = { ...num, color: "color-mix(in srgb, var(--d06-ink, rgb(53, 80, 116)) 32%, transparent)", padding: `0 ${u(1)}` };
  return (
    <div
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/countdown"
      style={elStyle(layout["calendar/countdown"])}
    >
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={cell}>
            <span style={num}>{days}</span>
            <span style={label}>Дни</span>
          </div>
          <span style={sep}>:</span>
          <div style={cell}>
            <span style={num}>{pad2(hours)}</span>
            <span style={label}>Часы</span>
          </div>
          <span style={sep}>:</span>
          <div style={cell}>
            <span style={num}>{pad2(minutes)}</span>
            <span style={label}>Минуты</span>
          </div>
          <span style={sep}>:</span>
          <div style={cell}>
            <span style={num}>{pad2(seconds)}</span>
            <span style={label}>Секунды</span>
          </div>
        </div>
      </div>
    </div>
  );
}
