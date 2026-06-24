// Элементы, добавленные в визуальном редакторе (поверх Canva-секций, в координатах канвы
// 1776×…). Это НЕ часть исходного эталона — отдельный слой. Пишется dev-эндпоинтом
// /__d06/additions (см. vite-plugins/d06-save.ts). Пусто по умолчанию → на чистой базе
// слой ничего не рендерит и 0% сохраняется.
import type { El } from "./layout";

export type Addition = El & {
  id: string; // стабильный ключ; data-eid = `add/<id>`
  kind: "text" | "image";
  text?: string; // для kind:"text"
  src?: string; // для kind:"image"
};

export const additions: Addition[] = [
  {
    "id": "mqs351n64",
    "kind": "text",
    "x": 110.54013169879534,
    "y": 12336.647685670145,
    "w": 1667.096080960325,
    "h": 182.86680192100755,
    "fontSize": 240,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "1.25",
    "text": "История любви",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "font": "\"Jellyka Love and Passion\", cursive",
    "rot": -8
  },
  {
    "id": "mqs28ojc0",
    "kind": "image",
    "x": -58.89284211141202,
    "y": 15923.377230217118,
    "w": 490.3999761101658,
    "h": 547.4447785359949,
    "src": "/design06-exact/_assets/blobs/PBJyC0fbP0ThXKGC_0.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs33llv1",
    "kind": "text",
    "x": -16.713914615945733,
    "y": 12038.457508877316,
    "w": 1667.096080960325,
    "h": 182.86680192100755,
    "fontSize": 240,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "1.25",
    "text": "История любви",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "font": "\"Jellyka Love and Passion\", cursive",
    "rot": -8
  },
  {
    "id": "mqs35vkd6",
    "kind": "text",
    "x": 252.04922034421367,
    "y": 12634.623656785681,
    "w": 1667.096080960325,
    "h": 182.86680192100755,
    "fontSize": 240,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "1.25",
    "text": "История любви",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "font": "\"Jellyka Love and Passion\", cursive",
    "rot": -8
  },
  {
    "id": "mqs355jc5",
    "kind": "image",
    "x": 286.785910800159,
    "y": 12582.6987985558,
    "w": 1199.9734022892803,
    "h": 579.165739386205,
    "src": "/design06-exact/_assets/media/photo_2026-06-24_12.30.54.jpeg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs3bemw8",
    "kind": "image",
    "x": -141.11560009960158,
    "y": 749.0610059760957,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_3-3.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.3572498072132004
  },
  {
    "id": "mqs3bhms9",
    "kind": "image",
    "x": 1434.721212542468,
    "y": 915.6557069000409,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-3.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.750432710384121
  },
  {
    "id": "mqs3ludf4",
    "kind": "image",
    "x": 688.6516683555552,
    "y": 2785.201362614152,
    "w": 420,
    "h": 433,
    "src": "/design06-exact/_assets/media/_________1_0.5x.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 2.2691934278780206
  },
  {
    "id": "mqs3ob4y0",
    "kind": "image",
    "x": 167.38285987145738,
    "y": 2037.7613997464655,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_3_1.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 0.4956996550435194,
    "rot": -9
  },
  {
    "id": "mqs49sy90",
    "kind": "image",
    "x": 1350.2064755679635,
    "y": 3870.1881681102914,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-7.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.322328336145525
  },
  {
    "id": "mqs4hj8i0",
    "kind": "image",
    "x": 1159.539103935101,
    "y": 1691.8488402571415,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_3_1-3.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "rot": 37,
    "scale": 0.47447987006315756
  },
  {
    "id": "mqs4jg7j0",
    "kind": "image",
    "x": 1352.8604084787194,
    "y": 4543.086276001725,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_3-6.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs4ltue1",
    "kind": "image",
    "x": 100.85495879752496,
    "y": 4366.091287250168,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_2_2-4.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs4mrdz2",
    "kind": "image",
    "x": 100.85496399300222,
    "y": 5117.556264678394,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_2_2.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs56lah0",
    "kind": "image",
    "x": 677.8714846745587,
    "y": 8617.703281894052,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_2_3.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.0867121217498892
  },
  {
    "id": "mqs5g3181",
    "kind": "text",
    "x": 776.8360811011191,
    "y": 5953.887273683138,
    "w": 212.33107041435005,
    "h": 60,
    "fontSize": 55,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "1.25",
    "text": "ДЕТАЛИ",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200",
    "font": "\"Jost\", system-ui, sans-serif"
  }
];
