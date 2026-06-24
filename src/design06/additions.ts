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
    "id": "mqs5g3181",
    "kind": "text",
    "x": 781.8360421584428,
    "y": 5719.922214250623,
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
  },
  {
    "id": "mqs63zuk0",
    "kind": "image",
    "x": 1331.7687243128116,
    "y": 6692.498776301284,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_2.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs6dl1h0",
    "kind": "text",
    "x": 228.23358079407114,
    "y": 5806.666626538235,
    "w": 411.1532783742331,
    "h": 66.78939800613496,
    "text": "Расположение",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 56,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs6dl1h1",
    "kind": "text",
    "x": 228.23358079407114,
    "y": 5879.094634448091,
    "w": 1312.4004984662577,
    "h": 300.79169861963186,
    "text": "Для вашего удобства для остановки выбирайте места проживания в центральном районе города Сочи. \nМы советуем остановиться неподалеку от ЖД вокзала, так вам будет комфортно во время поездки, и все будет в пешой доступности.",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 56,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "100"
  },
  {
    "id": "mqs6dl1h2",
    "kind": "text",
    "x": 228.23358079407114,
    "y": 6303.1738861645645,
    "w": 363.9953029141104,
    "h": 66.78939800613496,
    "text": "Как добраться",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 56,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs6dl1h3",
    "kind": "text",
    "x": 229.36592467138377,
    "y": 6386.461127345546,
    "w": 1312.4004984662577,
    "h": 378.7960122699386,
    "text": "Если вы никогда не были в Сочи, то спешим вас предупредить, аэропорт находится в отдалении от центрального района. Проще всего добраться до него будет на электричке прямо от Аэропорта, или на такси, однако в час пик могут быть большие пробки.",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 56,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200"
  },
  {
    "id": "mqs6euwl0",
    "kind": "text",
    "x": 732.5598782966476,
    "y": 7146.926500191718,
    "w": 318.88276606834734,
    "h": 66.78939800613496,
    "text": "ДРЕСС КОД",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 55,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "100"
  },
  {
    "id": "mqs6f3mh1",
    "kind": "image",
    "x": 683.118112388564,
    "y": 7289.056802386886,
    "w": 257.9005400300757,
    "h": 368.7940950920245,
    "src": "/design06-exact/_assets/blobs/PBL8ZPfjvBzXjMPd_0.svg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs6f3mi2",
    "kind": "image",
    "x": 941.0230581833541,
    "y": 7289.056802386886,
    "w": 151.85889570552146,
    "h": 217.27569018404907,
    "src": "/design06-exact/_assets/blobs/PBL8ZPfjvBzXjMPd_1.svg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs6gm0n2",
    "kind": "image",
    "x": 243.16113768033503,
    "y": 8229.55157208589,
    "w": 1353.8885041219323,
    "h": 1282.75228713334,
    "src": "/design06-exact/_assets/media/589e28d0c5849c11c2508c33b5eaf489.svg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "sx": 1.0142813932412342,
    "sy": 0.8976074366297726
  },
  {
    "id": "mqs6ku2q3",
    "kind": "text",
    "x": 574.631748690927,
    "y": 8326.303328999713,
    "w": 626.2221688112598,
    "h": 66.78939800613496,
    "text": "СВАДЕБНЫЙ ПОДАРОК",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 55,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200"
  },
  {
    "id": "mqs6ku2q4",
    "kind": "text",
    "x": 343.53924785216157,
    "y": 8898.80568652943,
    "w": 1151.742417786019,
    "h": 378.7960122699386,
    "text": "Ваше присутствие — для нас будет самым лучшим подарком. Мы любим цветы, но через несколько дней улетаем и не сможем забрать их ссобой. Если вы хотите сделать подарок, вместо букета можно выбрать что-то, что сохранится на память об этом дне.",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 56,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200"
  },
  {
    "id": "mqs6ku2q5",
    "kind": "image",
    "x": 677.9993057719032,
    "y": 8432.719739668208,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_2_3.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.0867121217498892
  },
  {
    "id": "mqs741qe0",
    "kind": "text",
    "x": 1005.1517686047,
    "y": 2265.4078405333976,
    "w": 400,
    "h": 60,
    "fontSize": 70,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "1.25",
    "text": "Наш праздник",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "font": "\"Nicoletta Script SHA\", cursive"
  },
  {
    "id": "mqs7729b0",
    "kind": "image",
    "x": 682.0003971398037,
    "y": 2799.632508475825,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-4.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.7975356521506485
  }
];
