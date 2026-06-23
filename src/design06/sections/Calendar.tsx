// design06 section Calendar (Canva id PBtLyKJDZDgGk7P1). Структура + утилиты-классы — база (0%).
// Редактируемые стили вынесены в Calendar.layout.ts и применяются по data-eid (Approach A2).
import { cx } from "../cx";
import { elStyle } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Calendar.layout";

export default function Calendar() {
  return (
      <section className={"rGeu6w"} id="PBtLyKJDZDgGk7P1" data-scroll-ready="true" data-eid="calendar/section" style={elStyle(layout["calendar/section"])}>
        <div>
          <div className={styles.onhyOQ} data-eid="calendar/frame" style={elStyle(layout["calendar/frame"])}>
            <div className={styles.twbtjQ}>
              <div className={styles.GDnEHQ} data-eid="calendar/canvas" style={elStyle(layout["calendar/canvas"])}>
                <div className={styles.o2Yl2g}>
                  <div className={styles._mXnjA} lang="en" data-eid="calendar/content" style={elStyle(layout["calendar/content"])}>
                    <Backdrop />
                    <div data-eid="calendar/box-1" style={elStyle(layout["calendar/box-1"])} />
                    <EngravingTop />
                    <Pretitle />
                    <EngravingMid />
                    <CalendarGrid />
                    <EngravingLeaf1 />
                    <EngravingLeaf2 />
                    <MapsButton />
                    <Divider />
                    <MonthHeading />
                    <DayCaption />
                    <LocationHeading />
                    <LocationAddress />
                    <MapsLink />
                    <Countdown />
                  </div>
                </div>
              </div>
              <div className={cx(styles.QhExXw, styles.pKfnlA)} data-eid="calendar/overlay" style={elStyle(layout["calendar/overlay"])} />
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
                        <div className={styles.fbzKiw} data-eid="calendar/backdrop" style={elStyle(layout["calendar/backdrop"])} />
                        <div className={styles.PcHy7w}>
                          <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                            <div className={styles.Izwocg} data-eid="calendar/backdrop-photo" style={elStyle(layout["calendar/backdrop-photo"])}>
                              <img className={styles._7_i_XA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
  );
}

function EngravingTop() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/engraving-top" style={elStyle(layout["calendar/engraving-top"])}>
                      <div className={styles.Zp7NQw}>
                        <div className={styles.a26Xuw}>
                          <div className={styles.PcHy7w}>
                            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                              <div className={styles.Izwocg} data-eid="calendar/engraving-top-img" style={elStyle(layout["calendar/engraving-top-img"])}>
                                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBtLyKJDZDgGk7P1_0.png" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-eid="calendar/box-2" style={elStyle(layout["calendar/box-2"])} />
                      </div>
                    </div>
  );
}

function Pretitle() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/pretitle" style={elStyle(layout["calendar/pretitle"])}>
                      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="calendar/text-1" style={elStyle(layout["calendar/text-1"])}>
                        <div data-eid="calendar/box-3" style={elStyle(layout["calendar/box-3"])}>
                          <div className={styles.E8yZTA}>
                            <div>
                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/pretitle-text" style={elStyle(layout["calendar/pretitle-text"])}>
                                  <span className={styles.a_GcMg} data-eid="calendar/span-1" style={elStyle(layout["calendar/span-1"])}>
                                    {"Happily Ev"}
                                  </span>
                                  <span className={styles.a_GcMg} data-eid="calendar/span-2" style={elStyle(layout["calendar/span-2"])}>
                                    {"er After Begins In"}
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
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/engraving-mid" style={elStyle(layout["calendar/engraving-mid"])}>
                      <div className={styles.Zp7NQw}>
                        <div className={styles.a26Xuw}>
                          <div className={styles.PcHy7w}>
                            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                              <div className={styles.Izwocg} data-eid="calendar/engraving-mid-img" style={elStyle(layout["calendar/engraving-mid-img"])}>
                                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBtLyKJDZDgGk7P1_1.png" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-eid="calendar/box-4" style={elStyle(layout["calendar/box-4"])} />
                      </div>
                    </div>
  );
}

function CalendarGrid() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/grid" style={elStyle(layout["calendar/grid"])}>
                      <div className={styles.hbcXuA} data-eid="calendar/tablewrap" style={elStyle(layout["calendar/tablewrap"])}>
                        <svg className={styles.aXBSSA} role="presentation" viewBox="0 0 913 775" data-eid="calendar/tablesvg" style={elStyle(layout["calendar/tablesvg"])}>
                          <defs />
                        </svg>
                        <table className={cx(styles.csGvXg, styles._DyBwg)} data-eid="calendar/grid-table" style={elStyle(layout["calendar/grid-table"])}>
                          <tbody>
                            <tr>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-1" style={elStyle(layout["calendar/cell-1"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-1" style={elStyle(layout["calendar/cellpad-1"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-1" style={elStyle(layout["calendar/cellalign-1"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-5" style={elStyle(layout["calendar/box-5"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-1" style={elStyle(layout["calendar/para-1"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-3" style={elStyle(layout["calendar/span-3"])}>
                                                    {"m"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-2" style={elStyle(layout["calendar/cell-2"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-2" style={elStyle(layout["calendar/cellpad-2"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-2" style={elStyle(layout["calendar/cellalign-2"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-6" style={elStyle(layout["calendar/box-6"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-2" style={elStyle(layout["calendar/para-2"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-4" style={elStyle(layout["calendar/span-4"])}>
                                                    {"t"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-3" style={elStyle(layout["calendar/cell-3"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-3" style={elStyle(layout["calendar/cellpad-3"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-3" style={elStyle(layout["calendar/cellalign-3"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-7" style={elStyle(layout["calendar/box-7"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-3" style={elStyle(layout["calendar/para-3"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-5" style={elStyle(layout["calendar/span-5"])}>
                                                    {"w"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-4" style={elStyle(layout["calendar/cell-4"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-4" style={elStyle(layout["calendar/cellpad-4"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-4" style={elStyle(layout["calendar/cellalign-4"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-8" style={elStyle(layout["calendar/box-8"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-4" style={elStyle(layout["calendar/para-4"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-6" style={elStyle(layout["calendar/span-6"])}>
                                                    {"T"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-5" style={elStyle(layout["calendar/cell-5"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-5" style={elStyle(layout["calendar/cellpad-5"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-5" style={elStyle(layout["calendar/cellalign-5"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-9" style={elStyle(layout["calendar/box-9"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-5" style={elStyle(layout["calendar/para-5"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-7" style={elStyle(layout["calendar/span-7"])}>
                                                    {"f"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-6" style={elStyle(layout["calendar/cell-6"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-6" style={elStyle(layout["calendar/cellpad-6"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-6" style={elStyle(layout["calendar/cellalign-6"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-10" style={elStyle(layout["calendar/box-10"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-6" style={elStyle(layout["calendar/para-6"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-8" style={elStyle(layout["calendar/span-8"])}>
                                                    {"s"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-7" style={elStyle(layout["calendar/cell-7"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-7" style={elStyle(layout["calendar/cellpad-7"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-7" style={elStyle(layout["calendar/cellalign-7"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-11" style={elStyle(layout["calendar/box-11"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-7" style={elStyle(layout["calendar/para-7"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-9" style={elStyle(layout["calendar/span-9"])}>
                                                    {"S"}
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
                            </tr>
                            <tr>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-8" style={elStyle(layout["calendar/cell-8"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-8" style={elStyle(layout["calendar/cellpad-8"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-8" style={elStyle(layout["calendar/cellalign-8"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-9" style={elStyle(layout["calendar/cell-9"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-9" style={elStyle(layout["calendar/cellpad-9"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-9" style={elStyle(layout["calendar/cellalign-9"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-10" style={elStyle(layout["calendar/cell-10"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-10" style={elStyle(layout["calendar/cellpad-10"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-10" style={elStyle(layout["calendar/cellalign-10"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-11" style={elStyle(layout["calendar/cell-11"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-11" style={elStyle(layout["calendar/cellpad-11"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-11" style={elStyle(layout["calendar/cellalign-11"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-12" style={elStyle(layout["calendar/cell-12"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-12" style={elStyle(layout["calendar/cellpad-12"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-12" style={elStyle(layout["calendar/cellalign-12"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-13" style={elStyle(layout["calendar/cell-13"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-13" style={elStyle(layout["calendar/cellpad-13"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-13" style={elStyle(layout["calendar/cellalign-13"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-14" style={elStyle(layout["calendar/cell-14"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-14" style={elStyle(layout["calendar/cellpad-14"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-14" style={elStyle(layout["calendar/cellalign-14"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-12" style={elStyle(layout["calendar/box-12"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-8" style={elStyle(layout["calendar/para-8"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-10" style={elStyle(layout["calendar/span-10"])}>
                                                    {"1"}
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
                            </tr>
                            <tr>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-15" style={elStyle(layout["calendar/cell-15"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-15" style={elStyle(layout["calendar/cellpad-15"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-15" style={elStyle(layout["calendar/cellalign-15"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-13" style={elStyle(layout["calendar/box-13"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-9" style={elStyle(layout["calendar/para-9"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-11" style={elStyle(layout["calendar/span-11"])}>
                                                    {"2"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-16" style={elStyle(layout["calendar/cell-16"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-16" style={elStyle(layout["calendar/cellpad-16"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-16" style={elStyle(layout["calendar/cellalign-16"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-14" style={elStyle(layout["calendar/box-14"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-10" style={elStyle(layout["calendar/para-10"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-12" style={elStyle(layout["calendar/span-12"])}>
                                                    {"3"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-17" style={elStyle(layout["calendar/cell-17"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-17" style={elStyle(layout["calendar/cellpad-17"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-17" style={elStyle(layout["calendar/cellalign-17"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-15" style={elStyle(layout["calendar/box-15"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-11" style={elStyle(layout["calendar/para-11"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-13" style={elStyle(layout["calendar/span-13"])}>
                                                    {"4"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-18" style={elStyle(layout["calendar/cell-18"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-18" style={elStyle(layout["calendar/cellpad-18"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-18" style={elStyle(layout["calendar/cellalign-18"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-16" style={elStyle(layout["calendar/box-16"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-12" style={elStyle(layout["calendar/para-12"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-14" style={elStyle(layout["calendar/span-14"])}>
                                                    {"5"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-19" style={elStyle(layout["calendar/cell-19"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-19" style={elStyle(layout["calendar/cellpad-19"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-19" style={elStyle(layout["calendar/cellalign-19"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-17" style={elStyle(layout["calendar/box-17"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-13" style={elStyle(layout["calendar/para-13"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-15" style={elStyle(layout["calendar/span-15"])}>
                                                    {"6"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-20" style={elStyle(layout["calendar/cell-20"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-20" style={elStyle(layout["calendar/cellpad-20"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-20" style={elStyle(layout["calendar/cellalign-20"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-18" style={elStyle(layout["calendar/box-18"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-14" style={elStyle(layout["calendar/para-14"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-16" style={elStyle(layout["calendar/span-16"])}>
                                                    {"7"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-21" style={elStyle(layout["calendar/cell-21"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-21" style={elStyle(layout["calendar/cellpad-21"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-21" style={elStyle(layout["calendar/cellalign-21"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-19" style={elStyle(layout["calendar/box-19"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-15" style={elStyle(layout["calendar/para-15"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-17" style={elStyle(layout["calendar/span-17"])}>
                                                    {"8"}
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
                            </tr>
                            <tr>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-22" style={elStyle(layout["calendar/cell-22"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-22" style={elStyle(layout["calendar/cellpad-22"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-22" style={elStyle(layout["calendar/cellalign-22"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-20" style={elStyle(layout["calendar/box-20"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-16" style={elStyle(layout["calendar/para-16"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-18" style={elStyle(layout["calendar/span-18"])}>
                                                    {"9"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-23" style={elStyle(layout["calendar/cell-23"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-23" style={elStyle(layout["calendar/cellpad-23"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-23" style={elStyle(layout["calendar/cellalign-23"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-21" style={elStyle(layout["calendar/box-21"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-17" style={elStyle(layout["calendar/para-17"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-19" style={elStyle(layout["calendar/span-19"])}>
                                                    {"10"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-24" style={elStyle(layout["calendar/cell-24"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-24" style={elStyle(layout["calendar/cellpad-24"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-24" style={elStyle(layout["calendar/cellalign-24"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-22" style={elStyle(layout["calendar/box-22"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-18" style={elStyle(layout["calendar/para-18"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-20" style={elStyle(layout["calendar/span-20"])}>
                                                    {"11"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-25" style={elStyle(layout["calendar/cell-25"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-25" style={elStyle(layout["calendar/cellpad-25"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-25" style={elStyle(layout["calendar/cellalign-25"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-23" style={elStyle(layout["calendar/box-23"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-19" style={elStyle(layout["calendar/para-19"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-21" style={elStyle(layout["calendar/span-21"])}>
                                                    {"12"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-26" style={elStyle(layout["calendar/cell-26"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-26" style={elStyle(layout["calendar/cellpad-26"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-26" style={elStyle(layout["calendar/cellalign-26"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-24" style={elStyle(layout["calendar/box-24"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-20" style={elStyle(layout["calendar/para-20"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-22" style={elStyle(layout["calendar/span-22"])}>
                                                    {"13"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-27" style={elStyle(layout["calendar/cell-27"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-27" style={elStyle(layout["calendar/cellpad-27"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-27" style={elStyle(layout["calendar/cellalign-27"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-25" style={elStyle(layout["calendar/box-25"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-21" style={elStyle(layout["calendar/para-21"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-23" style={elStyle(layout["calendar/span-23"])}>
                                                    {"14"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-28" style={elStyle(layout["calendar/cell-28"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-28" style={elStyle(layout["calendar/cellpad-28"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-28" style={elStyle(layout["calendar/cellalign-28"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-26" style={elStyle(layout["calendar/box-26"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-22" style={elStyle(layout["calendar/para-22"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-24" style={elStyle(layout["calendar/span-24"])}>
                                                    {"15"}
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
                            </tr>
                            <tr>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-29" style={elStyle(layout["calendar/cell-29"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-29" style={elStyle(layout["calendar/cellpad-29"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-29" style={elStyle(layout["calendar/cellalign-29"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-27" style={elStyle(layout["calendar/box-27"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-23" style={elStyle(layout["calendar/para-23"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-25" style={elStyle(layout["calendar/span-25"])}>
                                                    {"16"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-30" style={elStyle(layout["calendar/cell-30"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-30" style={elStyle(layout["calendar/cellpad-30"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-30" style={elStyle(layout["calendar/cellalign-30"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-28" style={elStyle(layout["calendar/box-28"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-24" style={elStyle(layout["calendar/para-24"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-26" style={elStyle(layout["calendar/span-26"])}>
                                                    {"17"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-31" style={elStyle(layout["calendar/cell-31"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-31" style={elStyle(layout["calendar/cellpad-31"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-31" style={elStyle(layout["calendar/cellalign-31"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-29" style={elStyle(layout["calendar/box-29"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-25" style={elStyle(layout["calendar/para-25"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-27" style={elStyle(layout["calendar/span-27"])}>
                                                    {"18"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-32" style={elStyle(layout["calendar/cell-32"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-32" style={elStyle(layout["calendar/cellpad-32"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-32" style={elStyle(layout["calendar/cellalign-32"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-30" style={elStyle(layout["calendar/box-30"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-26" style={elStyle(layout["calendar/para-26"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-28" style={elStyle(layout["calendar/span-28"])}>
                                                    {"19"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-33" style={elStyle(layout["calendar/cell-33"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-33" style={elStyle(layout["calendar/cellpad-33"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-33" style={elStyle(layout["calendar/cellalign-33"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-31" style={elStyle(layout["calendar/box-31"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-27" style={elStyle(layout["calendar/para-27"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-29" style={elStyle(layout["calendar/span-29"])}>
                                                    {"20"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-34" style={elStyle(layout["calendar/cell-34"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-34" style={elStyle(layout["calendar/cellpad-34"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-34" style={elStyle(layout["calendar/cellalign-34"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-32" style={elStyle(layout["calendar/box-32"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-28" style={elStyle(layout["calendar/para-28"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-30" style={elStyle(layout["calendar/span-30"])}>
                                                    {"21"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-35" style={elStyle(layout["calendar/cell-35"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-35" style={elStyle(layout["calendar/cellpad-35"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-35" style={elStyle(layout["calendar/cellalign-35"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-33" style={elStyle(layout["calendar/box-33"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-29" style={elStyle(layout["calendar/para-29"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-31" style={elStyle(layout["calendar/span-31"])}>
                                                    {"22"}
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
                            </tr>
                            <tr>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-36" style={elStyle(layout["calendar/cell-36"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-36" style={elStyle(layout["calendar/cellpad-36"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-36" style={elStyle(layout["calendar/cellalign-36"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-34" style={elStyle(layout["calendar/box-34"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-30" style={elStyle(layout["calendar/para-30"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-32" style={elStyle(layout["calendar/span-32"])}>
                                                    {"23"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-37" style={elStyle(layout["calendar/cell-37"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-37" style={elStyle(layout["calendar/cellpad-37"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-37" style={elStyle(layout["calendar/cellalign-37"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-35" style={elStyle(layout["calendar/box-35"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-31" style={elStyle(layout["calendar/para-31"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-33" style={elStyle(layout["calendar/span-33"])}>
                                                    {"24"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-38" style={elStyle(layout["calendar/cell-38"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-38" style={elStyle(layout["calendar/cellpad-38"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-38" style={elStyle(layout["calendar/cellalign-38"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-36" style={elStyle(layout["calendar/box-36"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-32" style={elStyle(layout["calendar/para-32"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-34" style={elStyle(layout["calendar/span-34"])}>
                                                    {"25"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-39" style={elStyle(layout["calendar/cell-39"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-39" style={elStyle(layout["calendar/cellpad-39"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-39" style={elStyle(layout["calendar/cellalign-39"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-37" style={elStyle(layout["calendar/box-37"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-33" style={elStyle(layout["calendar/para-33"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-35" style={elStyle(layout["calendar/span-35"])}>
                                                    {"26"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-40" style={elStyle(layout["calendar/cell-40"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-40" style={elStyle(layout["calendar/cellpad-40"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-40" style={elStyle(layout["calendar/cellalign-40"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-38" style={elStyle(layout["calendar/box-38"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-34" style={elStyle(layout["calendar/para-34"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-36" style={elStyle(layout["calendar/span-36"])}>
                                                    {"27"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-41" style={elStyle(layout["calendar/cell-41"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-41" style={elStyle(layout["calendar/cellpad-41"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-41" style={elStyle(layout["calendar/cellalign-41"])}>
                                      <div className={styles._0yZ6Qg}>
                                        <div data-eid="calendar/box-39" style={elStyle(layout["calendar/box-39"])}>
                                          <div className={styles.E8yZTA}>
                                            <div>
                                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/para-35" style={elStyle(layout["calendar/para-35"])}>
                                                  <span className={styles.a_GcMg} data-eid="calendar/span-37" style={elStyle(layout["calendar/span-37"])}>
                                                    {"28"}
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
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-42" style={elStyle(layout["calendar/cell-42"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-42" style={elStyle(layout["calendar/cellpad-42"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-42" style={elStyle(layout["calendar/cellalign-42"])} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-43" style={elStyle(layout["calendar/cell-43"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-43" style={elStyle(layout["calendar/cellpad-43"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-43" style={elStyle(layout["calendar/cellalign-43"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-44" style={elStyle(layout["calendar/cell-44"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-44" style={elStyle(layout["calendar/cellpad-44"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-44" style={elStyle(layout["calendar/cellalign-44"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-45" style={elStyle(layout["calendar/cell-45"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-45" style={elStyle(layout["calendar/cellpad-45"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-45" style={elStyle(layout["calendar/cellalign-45"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-46" style={elStyle(layout["calendar/cell-46"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-46" style={elStyle(layout["calendar/cellpad-46"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-46" style={elStyle(layout["calendar/cellalign-46"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-47" style={elStyle(layout["calendar/cell-47"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-47" style={elStyle(layout["calendar/cellpad-47"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-47" style={elStyle(layout["calendar/cellalign-47"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-48" style={elStyle(layout["calendar/cell-48"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-48" style={elStyle(layout["calendar/cellpad-48"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-48" style={elStyle(layout["calendar/cellalign-48"])} />
                                  </div>
                                </div>
                              </td>
                              <td colSpan={1} rowSpan={1}>
                                <div className={styles._5RL20Q} data-eid="calendar/cell-49" style={elStyle(layout["calendar/cell-49"])}>
                                  <div className={styles.xam_ew} data-eid="calendar/cellpad-49" style={elStyle(layout["calendar/cellpad-49"])}>
                                    <div className={styles.iRGCPA} data-eid="calendar/cellalign-49" style={elStyle(layout["calendar/cellalign-49"])} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <svg className={styles.nrDMmw} role="presentation" viewBox="0 0 913 775" strokeLinecap="butt" strokeLinejoin="miter" data-eid="calendar/lineoverlay" style={elStyle(layout["calendar/lineoverlay"])} />
                      </div>
                    </div>
  );
}

function EngravingLeaf1() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/engraving-leaf1" style={elStyle(layout["calendar/engraving-leaf1"])}>
                      <div className={styles.Zp7NQw}>
                        <div className={styles.a26Xuw}>
                          <div className={styles.PcHy7w}>
                            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                              <div className={styles.Izwocg} data-eid="calendar/engraving-leaf1-img" style={elStyle(layout["calendar/engraving-leaf1-img"])}>
                                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBtLyKJDZDgGk7P1_2.png" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-eid="calendar/box-40" style={elStyle(layout["calendar/box-40"])} />
                      </div>
                    </div>
  );
}

function EngravingLeaf2() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/engraving-leaf2" style={elStyle(layout["calendar/engraving-leaf2"])}>
                      <div className={styles.Zp7NQw}>
                        <div className={styles.a26Xuw}>
                          <div className={styles.PcHy7w}>
                            <div className={cx(styles.uk_25A, styles.Ty61NA)}>
                              <div className={styles.Izwocg} data-eid="calendar/engraving-leaf2-img" style={elStyle(layout["calendar/engraving-leaf2-img"])}>
                                <img className={styles.dMHlHA} crossOrigin="anonymous" draggable={false} src="/design06-exact/_assets/blobs/PBtLyKJDZDgGk7P1_3.png" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div data-eid="calendar/box-41" style={elStyle(layout["calendar/box-41"])} />
                      </div>
                    </div>
  );
}

function MapsButton() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/maps-button" style={elStyle(layout["calendar/maps-button"])}>
                      <div data-eid="calendar/box-42" style={elStyle(layout["calendar/box-42"])}>
                        <div className={styles.hWv4NA} data-eid="calendar/mask" style={elStyle(layout["calendar/mask"])}>
                          <svg className={styles._7KaXww}>
                            <defs>
                              <clipPath id="__id27">
                                <path d="M128.0000000300142,0L1033.7485942066182,0C1104.4410421613297,0 1161.7485942366325,57.3075520753027 1161.7485942366325,128.0000000300142C1161.7485942366325,198.69244798472567 1104.4410421613297,255.99999994281853 1033.7485942066182,255.99999994281853L128.0000000300142,255.99999994281853C57.3075520753027,255.99999994281853 0,198.69244798472567 0,128.0000000300142C0,57.3075520753027 57.3075520753027,0 128.0000000300142,0Z" />
                              </clipPath>
                            </defs>
                          </svg>
                          <div className={styles.bFnJ2A} data-eid="calendar/maps-button-pill" style={elStyle(layout["calendar/maps-button-pill"])} />
                        </div>
                      </div>
                    </div>
  );
}

function Divider() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw)} data-eid="calendar/divider" style={elStyle(layout["calendar/divider"])}>
                      <div className={styles.V7MmMA} data-eid="calendar/line" style={elStyle(layout["calendar/line"])}>
                        <svg className={styles.Fe_H_Q} data-eid="calendar/linesvg" style={elStyle(layout["calendar/linesvg"])}>
                          <path className={styles._682gpw} d="M1,1L926.0097496448416,1" strokeLinecap="butt" strokeWidth="2" fill="none" pointerEvents="auto" opacity="0" data-eid="calendar/block" style={elStyle(layout["calendar/block"])} />
                          <g>
                            <path d="M1,1L926.0097496448416,1" strokeLinecap="round" strokeWidth="2" fill="none" pointerEvents="none" />
                          </g>
                        </svg>
                      </div>
                    </div>
  );
}

function MonthHeading() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/month-heading" style={elStyle(layout["calendar/month-heading"])}>
                      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="calendar/text-2" style={elStyle(layout["calendar/text-2"])}>
                        <div data-eid="calendar/box-43" style={elStyle(layout["calendar/box-43"])}>
                          <div className={styles.E8yZTA}>
                            <div>
                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/month-heading-text" style={elStyle(layout["calendar/month-heading-text"])}>
                                  <span className={styles.a_GcMg} data-eid="calendar/span-38" style={elStyle(layout["calendar/span-38"])}>
                                    {"February, 2026"}
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

function DayCaption() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/day-caption" style={elStyle(layout["calendar/day-caption"])}>
                      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="calendar/text-3" style={elStyle(layout["calendar/text-3"])}>
                        <div data-eid="calendar/box-44" style={elStyle(layout["calendar/box-44"])}>
                          <div className={styles.E8yZTA}>
                            <div>
                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                <p className={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/day-caption-text" style={elStyle(layout["calendar/day-caption-text"])}>
                                  <span className={styles.a_GcMg} data-eid="calendar/span-39" style={elStyle(layout["calendar/span-39"])}>
                                    {"February 1, 2026 · Our Wedding Day · 5:00 PM"}
                                  </span>
                                </p>
                                <div className={cx(styles._28USrA, styles.GEC0sA, styles.XN6uKA)} data-eid="calendar/para-36" style={elStyle(layout["calendar/para-36"])}>
                                  <br />
                                </div>
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
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/location-heading" style={elStyle(layout["calendar/location-heading"])}>
                      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="calendar/text-4" style={elStyle(layout["calendar/text-4"])}>
                        <div data-eid="calendar/box-45" style={elStyle(layout["calendar/box-45"])}>
                          <div className={styles.E8yZTA}>
                            <div>
                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/location-heading-text" style={elStyle(layout["calendar/location-heading-text"])}>
                                  <span className={styles.a_GcMg} data-eid="calendar/span-40" style={elStyle(layout["calendar/span-40"])}>
                                    {"Location"}
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
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/location-address" style={elStyle(layout["calendar/location-address"])}>
                      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="calendar/text-5" style={elStyle(layout["calendar/text-5"])}>
                        <div data-eid="calendar/box-46" style={elStyle(layout["calendar/box-46"])}>
                          <div className={styles.E8yZTA}>
                            <div>
                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/location-address-text" style={elStyle(layout["calendar/location-address-text"])}>
                                  <span className={styles.a_GcMg} data-eid="calendar/span-41" style={elStyle(layout["calendar/span-41"])}>
                                    {"Bali Resort, Sunset Road, Bali"}
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
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/maps-link" style={elStyle(layout["calendar/maps-link"])}>
                      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="calendar/text-6" style={elStyle(layout["calendar/text-6"])}>
                        <div data-eid="calendar/box-47" style={elStyle(layout["calendar/box-47"])}>
                          <div className={styles.E8yZTA}>
                            <div>
                              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="en">
                                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="calendar/maps-link-anchor" style={elStyle(layout["calendar/maps-link-anchor"])}>
                                  <a className={styles.a_GcMg} href="https://maps.app.goo.gl/x1GwghLytRLPDMrC6?g_st=com.google.maps.preview.copy" target="_blank" draggable={false} rel="noopener nofollow" data-eid="calendar/span-42" style={elStyle(layout["calendar/span-42"])}>
                                    {"Google Maps"}
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

function Countdown() {
  return (
                    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="calendar/countdown" style={elStyle(layout["calendar/countdown"])}>
                      <div data-eid="calendar/box-48" style={elStyle(layout["calendar/box-48"])}>
                        <div className={cx(styles.hVT_uA, styles.PgAXEw)}>
                          <div className={styles.Rt1H_w}>
                            <div className={cx(styles.IwXXkw, styles._qImYg, styles.JbJFjg, styles._CObZw)} />
                            <div className={styles._5sVuA}>
                              <span className={cx(styles.NA_Img, styles.dkWypw, styles._6ti9_A)} aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                                  <defs>
                                    <path id="_265464792__a" d="M4 21A9 9 0 0 0 4 3a1 1 0 1 0 0 2 7 7 0 1 1 0 14 1 1 0 0 0 0 2z" />
                                  </defs>
                                  <use fill="currentColor" fillRule="nonzero" transform="matrix(-1 0 0 1 16 0)" xlinkHref="#_265464792__a" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={cx(styles.S3wQqg, styles.lKZixA, styles._8YzbFQ)}>
                          <div className={styles.uqhtBg}>
                            <iframe src="https://canva-embed.com/api/iframe?url=https%3A%2F%2Fwww.tickcounter.com%2Fcountdown%2F8190116%2Fmy-countdown&key=462812a26b593f2dbfbfcbb14f6d699a" allowFullScreen sandbox="allow-same-origin allow-scripts allow-popups allow-forms" data-eid="calendar/countdown-iframe" style={elStyle(layout["calendar/countdown-iframe"])} />
                          </div>
                        </div>
                      </div>
                    </div>
  );
}
