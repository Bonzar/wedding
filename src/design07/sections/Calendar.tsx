// design06 section Calendar (Canva id PBtLyKJDZDgGk7P1). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Calendar.layout.ts и применяются по data-eid (Approach A2).
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "../cx";
import { elStyle, cqw } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Calendar.layout";
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
                          style={{ width: cqw(150), height: cqw(136) }}
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

// Карта места («Три кедра»). Интерактивный виджет Яндекс-карт (constructor, растровые тайлы).
// Позиция/размер — в Calendar.layout.ts (data-eid="calendar/map"); масштаб через cqw, как у всей
// вёрстки (без JS-ресайза по ширине окна — он давал «media-query»-прыжок).
//
// Ранее виджет заменяли статичной картинкой из-за iOS-краша «A problem repeatedly occurred»,
// но реальной причиной оказалась ПАМЯТЬ от глобального transform-слоя (d06), а НЕ сам виджет.
// В d07 (cqw, без transform) краша нет → возвращаем живой интерактивный виджет.
const FRAME_BORDER = `${cqw(2)} solid var(--d06-ink, rgb(53, 80, 116))`; // d07: рамка в cqw (масштабируется)
const FRAME_RADIUS = cqw(16);

function Map() {
  const boxRef = useRef<HTMLDivElement>(null);
  const base = layout["calendar/map"];
  // Референс рендера iframe = ширина карты на ДЕСКТОП-листе (880/1776 от нативной): на десктопе
  // box≈этому → scale 1 → контролы нативного размера (как нужно). На более узком — box меньше →
  // scale<1 → пропорционально меньше. (Брали натив 1776 → на десктопе было ×0.5, слишком мелко.)
  const NW = (base.w ?? 1369.63) * (880 / 1776);
  const NH = (base.h ?? 584.11) * (880 / 1776);
  // Контролы Яндекс-виджета — фикс-px ВНУТРИ iframe и сами не масштабируются с маленьким iframe
  // (оттого на узком экране кнопки огромные). Рендерим iframe в референс-размере и плавно сжимаем
  // под cqw-бокс через transform: scale (ResizeObserver — непрерывно, без media-query-прыжка).
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const apply = () => setScale(box.clientWidth / NW);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(box);
    return () => ro.disconnect();
  }, [NW]);
  return (
    <div
      ref={boxRef}
      className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)}
      data-eid="calendar/map"
      style={{
        ...elStyle(base),
        border: FRAME_BORDER,
        borderRadius: FRAME_RADIUS,
        overflow: "hidden",
        background: "color-mix(in srgb, var(--d06-ink, rgb(53, 80, 116)) 6%, transparent)",
      }}
    >
      <iframe
        title="Карта — Сочи, Три кедра"
        src="https://yandex.ru/map-widget/v1/?um=constructor%3Acac75de5edf5273bae52f678d421076b55368f6fadced06b0eb9da0f89586e99&source=constructor"
        loading="lazy"
        style={{ display: "block", width: `${NW}px`, height: `${NH}px`, border: "none", transform: `scale(${scale})`, transformOrigin: "top left" }}
      />
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
              <clipPath id="__id27">
                <path d="M128.0000000300142,0L1033.7485942066182,0C1104.4410421613297,0 1161.7485942366325,57.3075520753027 1161.7485942366325,128.0000000300142C1161.7485942366325,198.69244798472567 1104.4410421613297,255.99999994281853 1033.7485942066182,255.99999994281853L128.0000000300142,255.99999994281853C57.3075520753027,255.99999994281853 0,198.69244798472567 0,128.0000000300142C0,57.3075520753027 57.3075520753027,0 128.0000000300142,0Z" />
              </clipPath>
            </defs>
          </svg>
          <div
            className={styles.bFnJ2A}
            data-eid="calendar/maps-button-pill"
            /* d07: SVG-клип-пилюля (userSpaceOnUse px) → CSS inset(round 9999px): пилюля при
               любом размере; на нативе радиус=½ высоты = идентичен исходному → 0% цел. */
            style={{ ...elStyle(layout["calendar/maps-button-pill"]), clipPath: "inset(0 round 9999px)" }}
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
  // d07: размеры в cqw (масштаб на уровне лайаута), иначе на узкой ширине отсчёт не уменьшается.
  const num: CSSProperties = {
    fontFamily: '"Jost", system-ui, sans-serif',
    fontWeight: 300,
    fontSize: cqw(58),
    lineHeight: 1,
    color: "var(--d06-ink, rgb(53, 80, 116))",
    fontVariantNumeric: "tabular-nums",
  };
  const label: CSSProperties = {
    marginTop: cqw(12),
    fontFamily: '"Jost", system-ui, sans-serif',
    fontWeight: 400,
    fontSize: cqw(26),
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "color-mix(in srgb, var(--d06-ink, rgb(53, 80, 116)) 78%, transparent)",
  };
  const cell: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: cqw(120),
  };
  const sep: CSSProperties = { ...num, color: "color-mix(in srgb, var(--d06-ink, rgb(53, 80, 116)) 32%, transparent)", padding: `0 ${cqw(1)}` };
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
