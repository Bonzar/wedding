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
  // Кроп-маска (только kind:"image"): геометрия слоя ФОТО внутри рамки-обрезки (координаты
  // относительно рамки, px как у канвы). Двухслойная модель, как у Canva-фото: рамка (add/<id>,
  // overflow:hidden) = маска, фото (add/<id>/photo) пан/зумится внутри неё. Нет поля → фото
  // заполняет рамку (object-fit:cover) — идентично прежнему одно-слойному рендеру (0% цел).
  photo?: El;
};

// Слой фото внутри рамки картинки: сохранённый кроп либо дефолт «заполнить рамку». Один
// источник истины для рендера (Design07) и для BASE редактора (additionsStore) — чтобы синтез
// дефолта совпадал пиксель-в-пиксель с одно-слойным object-fit:cover.
export const photoOf = (a: Addition): El => a.photo ?? { x: 0, y: 0, w: a.w ?? 0, h: a.h ?? 0 };

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
    "x": 320.5805795624193,
    "y": 10589.85546446836,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_3-6.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "rot": -20
  },
  {
    "id": "mqs4mrdz2",
    "kind": "image",
    "x": 7.220434671387707,
    "y": 5407.785786138538,
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
    "scale": 1.4908613860052449
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
    "x": 226.2963031860535,
    "y": 8285.749682612894,
    "w": 1353.8885041219323,
    "h": 1282.75228713334,
    "src": "/design06-exact/_assets/media/589e28d0c5849c11c2508c33b5eaf489.svg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.0425898323152811
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
    "x": 324.3323398723786,
    "y": 8465.536486435036,
    "w": 1151.742417786019,
    "h": 245.42288674007614,
    "text": "Самый дорогой подарок для нас — это вы рядом в этот день. Ваше присутствие, объятия и улыбки — уже всё, о чём мы могли мечтать.",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 48,
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
    "x": 1289.332252346999,
    "y": 9292.57463135306,
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
  },
  {
    "id": "mqtviax01",
    "kind": "image",
    "x": 1244.1692103581324,
    "y": 4509.762889430427,
    "w": 420,
    "h": 421,
    "src": "/design06-exact/_assets/media/tile_1_1-13.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    }
  },
  {
    "id": "mqtwci8h1",
    "kind": "image",
    "x": 1306.0061190220865,
    "y": 838.250731818846,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-16.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.358070342519047
  },
  {
    "id": "mqumscp01",
    "kind": "image",
    "x": 1244.1690584235237,
    "y": 5171.015123279814,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-18.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.305701011715973
  },
  {
    "id": "mquo9tu80",
    "kind": "image",
    "x": 346.330905739321,
    "y": 11388.5386996488,
    "w": 433.435,
    "h": 433.435,
    "src": "/design06-exact/_assets/media/IMG_4073.jpg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.0469363841976749,
    "photo": {
      "x": -18.178990656324732,
      "y": -74.84434161406912,
      "w": 508.0731797161038,
      "h": 508.0731797161038
    }
  },
  {
    "id": "mquohyoy0",
    "kind": "text",
    "x": 320.33334667247925,
    "y": 8738.809581242234,
    "w": 1151.742417786019,
    "h": 387.83257710704856,
    "text": "Если вам хочется сделать нам что-то приятное сверх этого — мы будем рады денежному подарку. Каждый конверт станет маленьким кирпичиком в фундаменте нашей общей жизни — стартовым капиталом семьи, которая только начинает строить своё будущее.",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 48,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200"
  },
  {
    "id": "mquohyw11",
    "kind": "text",
    "x": 320.3333483523456,
    "y": 9169.714630697516,
    "w": 1151.742417786019,
    "h": 332.86164104053387,
    "text": "Вещественные подарки и цветы, к сожалению, не сможем забрать с собой — улетаем буквально через пару дней после свадьбы. Поэтому заранее благодарим за понимание и любовь ❤️",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 48,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200"
  }
];
