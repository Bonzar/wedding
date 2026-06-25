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
    "x": 186.85922630302377,
    "y": 12370.345818790722,
    "w": 2008.617684082028,
    "h": 182.86680192100755,
    "fontSize": 360,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "0.5",
    "text": "История любви",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "font": "\"Nicoletta Script SHA\", cursive",
    "rot": -8
  },
  {
    "id": "mqs33llv1",
    "kind": "text",
    "x": 119.43093331259718,
    "y": 12078.340773491977,
    "w": 2037.081364652494,
    "h": 182.86680192100755,
    "fontSize": 360,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "0.5",
    "text": "История любви",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "font": "\"Nicoletta Script SHA\", cursive",
    "rot": -8
  },
  {
    "id": "mqs35vkd6",
    "kind": "text",
    "x": 266.87706653200075,
    "y": 12684.490444184603,
    "w": 1667.096080960325,
    "h": 182.86680192100755,
    "fontSize": 360,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "0.5",
    "text": "История любви",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "font": "\"Nicoletta Script SHA\", cursive",
    "rot": -8
  },
  {
    "id": "mqs355jc5",
    "kind": "image",
    "x": 299.3192244794043,
    "y": 12583.245757787607,
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
    "x": 17.99998683157054,
    "y": 753.7867103645727,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_3-7.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.3572498072132004
  },
  {
    "id": "mqs3bhms9",
    "kind": "image",
    "x": 1290.53273729609,
    "y": 927.3243896462083,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-12.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.3117494653445567
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
    "x": 1318.3320638179628,
    "y": 4542.648737834189,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_3-6.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqs4mrdz2",
    "kind": "image",
    "x": 134.95076940535648,
    "y": 4995.766529640068,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_2_2.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqsehxhu0",
    "kind": "image",
    "x": 34.56219276777838,
    "y": 4375.05283440027,
    "w": 420,
    "h": 392,
    "src": "/design06-exact/_assets/media/tile_1_1-11.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "rot": 82,
    "scale": 1.8117436629909436
  },
  {
    "id": "mqs5g3181",
    "kind": "text",
    "x": 793.2521360927,
    "y": 5635.989683927173,
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
    "x": 1382.6816578379471,
    "y": 6208.442093508566,
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
    "x": 241.999994973706,
    "y": 5794.376405850903,
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
    "x": 245.21698268639133,
    "y": 5879.094634448091,
    "w": 1312.4004984662577,
    "h": 300.79169861963186,
    "text": "Для вашего удобства для остановки выбирайте места проживания в центральном районе города Сочи. \nМы советуем остановиться неподалеку от ЖД вокзала или Морского порта. Так вам будет комфортно во время поездки, и все будет в пешой доступности.",
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
    "x": 245.21697679104574,
    "y": 6418.441788501184,
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
    "x": 242.00000314340474,
    "y": 6512.6261405312225,
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
    "x": 740.5625398242967,
    "y": 7146.636658547513,
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
    "x": 222.92901489405227,
    "y": 8195.546602409338,
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
    "x": 586.8905828306044,
    "y": 8326.277909420029,
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
    "x": 324.1288649001526,
    "y": 8896.449554453957,
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
    "x": 1329.9999814360185,
    "y": 9145.301265527372,
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
    "x": 1006.5452436668207,
    "y": 2259.8272201661457,
    "w": 309.0881262108321,
    "h": 73.22022471466471,
    "fontSize": 78,
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
    "x": 690.0000411288115,
    "y": 2692.643542842402,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-4.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.5754043259508603
  },
  {
    "id": "mqsdx3pf0",
    "kind": "image",
    "x": 1269.3898083463187,
    "y": 4132.459739829011,
    "w": 420,
    "h": 403,
    "src": "/design06-exact/_assets/media/tile_1_1-10.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.8971021587961385
  },
  {
    "id": "mqseijsu1",
    "kind": "image",
    "x": 905.5409797606765,
    "y": 13569.101773079517,
    "w": 596.335815758718,
    "h": 386.3133317890836,
    "src": "/design06-exact/_assets/media/photo_2026-06-24_12.30.56.jpeg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqseo28c0",
    "kind": "image",
    "x": 133.68206704851747,
    "y": 15945.206420569406,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-7.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.591892096285356
  },
  {
    "id": "mqtatlul0",
    "kind": "image",
    "x": 905.5322143883716,
    "y": 13172.78832020721,
    "w": 596.335815758718,
    "h": 386.3121630727763,
    "src": "/design06-exact/_assets/media/photo_2026-06-24_12.30.53.jpeg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqtattri1",
    "kind": "image",
    "x": 299.31924841538915,
    "y": 13172.785398416443,
    "w": 596.3359253258718,
    "h": 782.6250315869272,
    "src": "/design06-exact/_assets/media/photo_2026-06-24_12.30.50.jpeg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  }
];
