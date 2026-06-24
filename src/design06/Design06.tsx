// Pixel-exact baseline of the design06 reference, rendered inside the React app.
//
// Stage 1 of componentization: the whole captured layout is rendered as one block
// via the generated body HTML (guaranteed 1:1 with public/design06-exact/). The same
// Canva stylesheets + bundled fonts are loaded by URL from the committed static copy,
// so nothing is re-derived. Later stages split _generated/sections/* into real
// per-section components, diffing each crop against this baseline.
//
// Mounted behind ?d06 (see App.tsx) so the Canva global CSS never touches the app.

import { useEffect, useState } from "react";
import "./canva-base.css"; // Canva :root/тема-переменные + @keyframes (грузится только на ?d06)
import overrideCss from "./_generated/override.css?raw";
import headLinksRaw from "./_generated/head-links.json?raw";
import { DESIGN06_SECTIONS } from "./sections";

// Из Canva-стайлшитов линком оставляем ТОЛЬКО шрифты (design-fonts.css). Утилиты-классы —
// в canva.module.css, переменные/keyframes — в canva-base.css. Остальные Canva-<link> убраны.
const cssHrefs: string[] = (JSON.parse(headLinksRaw) as string[]).filter((h) => h.includes("design-fonts"));

// Макет снят на нативной ширине 1776px. Поведение под ширину окна:
//   viewport <= 880  → масштабируем под ширину (карточка во весь экран);
//   viewport >  880  → ширина фиксируется на 880px, карточка по центру.
// ?d06&noscale отключает скейлер (масштаб 1:1) — для пиксельного сравнения с эталоном.
const REF_WIDTH = 1776;
const MAX_WIDTH = 880;

export default function Design06() {
  const noScale = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("noscale");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (noScale) return;
    const calc = () => setScale(Math.min(document.documentElement.clientWidth, MAX_WIDTH) / REF_WIDTH);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [noScale]);

  const page = (
    <div className="yIDCqA">
      <main className="_8OlyIw">
        <div className="_4KoDHA">
          <div className="ZRRuDw">
            <div style={{ height: "100%", width: "100%" }}>
              <div className="KYQZFA">
                {DESIGN06_SECTIONS.map((Section, i) => (
                  <Section key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <>
      {cssHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: overrideCss }} />
      {/* Точечная изоляция от глобального CSS приложения: единственная протечка на
          Canva-вёрстку — правило `section { padding/position/overflow }` из base.css.
          box-sizing/font-smoothing Canva задаёт сам, поэтому больше сбрасывать нечего. */}
      <style>{`.yIDCqA section.rGeu6w{padding:0;position:static;overflow:visible}`}</style>
      {noScale ? (
        page
      ) : (
        <div style={{ display: "flex", justifyContent: "center", width: "100%", overflow: "hidden" }}>
          <div style={{ width: REF_WIDTH, zoom: scale }}>{page}</div>
        </div>
      )}
    </>
  );
}
