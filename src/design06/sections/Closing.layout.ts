// design06 Closing — редактируемый слой (Approach A2): на элемент одна запись, ключ = data-eid.
// Единственный источник правды для позиции/размера/поворота/типографики; редактор патчит поля и пишет сюда.
import type { El } from "../layout";

export const layout: Record<string, El> = {
  "closing/root": { raw: { "backgroundColor": "rgb(255, 255, 255)" } },
  "closing/frame": { w: 1776, h: 1131, raw: { "alignItems": "center" } },
  "closing/canvas": { w: 1776, h: 1131, raw: { "backgroundColor": "rgb(255, 255, 255)" } },
  "closing/content": { w: 1776, h: 1131 },
  "closing/backdrop": { raw: { "background": "rgb(255, 255, 255)" } },
  "closing/backdropImage": { w: 5227.9, h: 3829.43, x: -1725.95, y: -218.665, rot: 90 },
  "closing/box-5": { w: 1549.8, h: 904.8, raw: { "position": "absolute", "top": "113.1px", "left": "113.1px" } },
  "closing/box-1": { raw: { "clipPath": "polygon(1035.43px 651.373px, 1571px 651.373px, 1571px 1090.39px, 1035.43px 1090.39px)" } },
  "closing/engraving": { w: 634.018, h: 439.019, x: 1035.43, y: 651.373, raw: { "touchAction": "pan-x pan-y pinch-zoom" } },
  "closing/block": { w: 634.018, h: 439.019 },
  "closing/engravingImage": { w: 634.018, h: 439.019, x: 0, y: -2.84217e-14, rot: 0 },
  "closing/box-2": { h: 439.019, w: 634.018, scale: 1, raw: { "position": "absolute", "top": "0px", "left": "0px", "transformOrigin": "0px 0px", "pointerEvents": "none" } },
  "closing/bodyText": { w: 1232.4, h: 378.8, x: 271.799, y: 125.7, raw: { "touchAction": "pan-x pan-y pinch-zoom" } },
  "closing/text-1": { w: 1232.4, h: 378.8, raw: { "writingMode": "horizontal-tb" } },
  "closing/box-3": { x: 0, y: -5.6 },
  "closing/bodyTextParagraph": { font: "YAFcfgcNhWk_3, auto", fontSize: 56, color: "rgb(53, 80, 116)", lineHeight: "78px", letterSpacing: "0em", textTransform: "none", raw: { "--gixK-A": "0", "--kJ5CrQ": "0", "--zPlnxA": "none", "listStyleType": "none" } },
  "closing/bodyTextSpan": { color: "rgb(53, 80, 116)", raw: { "fontSize": "1em", "fontWeight": "300", "fontStyle": "normal", "fontKerning": "normal", "textDecorationLine": "none", "textDecorationThickness": "initial", "textDecorationStyle": "initial" } },
  "closing/title": { w: 872.538, h: 281.38, x: 233.933, y: 651.373, rot: 8.88178e-16, raw: { "touchAction": "pan-x pan-y pinch-zoom" } },
  "closing/text-2": { w: 596.618, h: 192.4, scale: 1.46247, raw: { "writingMode": "horizontal-tb", "transformOrigin": "0px 0px" } },
  "closing/box-4": { x: 0, y: 51.2 },
  "closing/titleParagraph": { font: "YAD86m_J1ck_0, auto", fontSize: 160, color: "rgb(53, 80, 116)", lineHeight: "89px", letterSpacing: "0em", textTransform: "none", raw: { "--gixK-A": "0", "--kJ5CrQ": "0", "--zPlnxA": "none", "listStyleType": "none" } },
  "closing/titleSpan": { color: "rgb(53, 80, 116)", raw: { "fontSize": "1em", "fontWeight": "700", "fontStyle": "normal", "fontKerning": "none", "textDecorationLine": "none", "textDecorationThickness": "initial", "textDecorationStyle": "initial" } },
  "closing/overlay": { w: 1776, h: 1131, raw: { "margin": "0px" } },
};
