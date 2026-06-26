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
  // Привязка к секции-владельцу (slug == префикс data-eid секции). Задан → x/y отсчитываются
  // от ВЕРХА этой секции, и элемент едет вместе с ней в потоке (рост Survey толкает её
  // additions). Не задан → page-absolute от верха страницы (как было; back-compat старых записей).
  section?: string;
  // Динамическое содержимое (только kind:"text"). "greeting" → перед text подставляется
  // обращение из RSVP-стора (кастомное «Приглашения».Congratulation или перечисление имён
  // гостей; см. RsvpStore.greeting). text при этом = фикс. текст-приглашение. Рендер — в
  // Design07/AddedEl. Поле геометрии не несёт, в BASE редактора не зеркалится (см. toRecord).
  bind?: "greeting";
};

// Слой фото внутри рамки картинки: сохранённый кроп либо дефолт «заполнить рамку». Один
// источник истины для рендера (Design07) и для BASE редактора (additionsStore) — чтобы синтез
// дефолта совпадал пиксель-в-пиксель с одно-слойным object-fit:cover.
export const photoOf = (a: Addition): El =>
  a.photo ?? { x: 0, y: 0, w: a.w ?? 0, h: a.h ?? 0 };

export const additions: Addition[] = [
  {
    "id": "mqv0atr52",
    "kind": "image",
    "x": 222.0661247974765,
    "y": -177.64783876719315,
    "w": 1353.8885041219323,
    "h": 1282.75228713334,
    "src": "/design06-exact/_assets/media/589e28d0c5849c11c2508c33b5eaf489.svg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.0425898323152811,
    "section": "gift"
  },
  {
    "id": "mqs351n64",
    "kind": "text",
    "x": 186.85922630302377,
    "y": 2730.3458187907218,
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
    "rot": -8,
    "section": "journey"
  },
  {
    "id": "mqs33llv1",
    "kind": "text",
    "x": 119.43093331259718,
    "y": 2438.3407734919765,
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
    "rot": -8,
    "section": "journey"
  },
  {
    "id": "mqs35vkd6",
    "kind": "text",
    "x": 266.87706653200075,
    "y": 3044.490444184603,
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
    "rot": -8,
    "section": "journey"
  },
  {
    "id": "mqs355jc5",
    "kind": "image",
    "x": 299.3192244794043,
    "y": 2943.2457577876066,
    "w": 1199.9734022892803,
    "h": 579.165739386205,
    "src": "/design06-exact/_assets/media/photo_2026-06-24_12.30.54.jpeg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "section": "journey"
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
    "scale": 1.3572498072132004,
    "section": "hero"
  },
  {
    "id": "mqs3ob4y0",
    "kind": "image",
    "x": 167.38285987145738,
    "y": 626.7613997464655,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_3_1.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 0.4956996550435194,
    "rot": -9,
    "section": "calendar"
  },
  {
    "id": "mqs4hj8i0",
    "kind": "image",
    "x": 1159.539103935101,
    "y": 280.84884025714155,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_3_1-3.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "rot": 37,
    "scale": 0.47447987006315756,
    "section": "calendar"
  },
  {
    "id": "mqs4jg7j0",
    "kind": "image",
    "x": 324.5087731825272,
    "y": 1002.2959711905235,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_3-6.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "rot": -20,
    "section": "journey",
    "scale": 0.625557322951442
  },
  {
    "id": "mqsehxhu0",
    "kind": "image",
    "x": 116.60557361619063,
    "y": 320.6473215627408,
    "w": 420,
    "h": 392,
    "src": "/design06-exact/_assets/media/tile_1_1-11.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "rot": 82,
    "scale": 1.1857500498534295,
    "section": "timeline"
  },
  {
    "id": "mqs5g3181",
    "kind": "text",
    "x": 794.2345627082946,
    "y": 1537.6990285873676,
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
    "font": "\"Jost\", system-ui, sans-serif",
    "section": "timeline"
  },
  {
    "id": "mqs6dl1h0",
    "kind": "text",
    "x": 241.999994973706,
    "y": 1685.3764058509032,
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
    },
    "section": "timeline"
  },
  {
    "id": "mqs6dl1h1",
    "kind": "text",
    "x": 245.21698268639133,
    "y": -68.9053655519092,
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
    "fontWeight": "100",
    "section": "details"
  },
  {
    "id": "mqs6dl1h2",
    "kind": "text",
    "x": 245.21697679104574,
    "y": 470.4417885011844,
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
    },
    "section": "details"
  },
  {
    "id": "mqs6dl1h3",
    "kind": "text",
    "x": 242.00000314340474,
    "y": 564.6261405312225,
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
    "fontWeight": "200",
    "section": "details"
  },
  {
    "id": "mqs6euwl0",
    "kind": "text",
    "x": 744.2372361141852,
    "y": 1207.796812492451,
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
    "fontWeight": "100",
    "section": "details"
  },
  {
    "id": "mqs6f3mh1",
    "kind": "image",
    "x": 687.3852947174015,
    "y": 1371.7063326591933,
    "w": 257.9005400300757,
    "h": 368.7940950920245,
    "src": "/design06-exact/_assets/blobs/PBL8ZPfjvBzXjMPd_0.svg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "section": "details"
  },
  {
    "id": "mqs6f3mi2",
    "kind": "image",
    "x": 945.2902405121916,
    "y": 1371.7063326591933,
    "w": 151.85889570552146,
    "h": 217.27569018404907,
    "src": "/design06-exact/_assets/blobs/PBL8ZPfjvBzXjMPd_1.svg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "section": "details"
  },
  {
    "id": "mqs6ku2q3",
    "kind": "text",
    "x": 585.8920115273197,
    "y": 1078.7545003635955,
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
    "fontWeight": "200",
    "section": "attire"
  },
  {
    "id": "mqs6ku2q5",
    "kind": "image",
    "x": 1320.7474952333237,
    "y": 860.568664466593,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_2_3.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.0867121217498892,
    "section": "gift"
  },
  {
    "id": "mqs741qe0",
    "kind": "text",
    "x": 1006.5452436668207,
    "y": 848.8272201661457,
    "w": 309.0881262108321,
    "h": 73.22022471466471,
    "fontSize": 78,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "1.25",
    "text": "Наш праздник",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "font": "\"Nicoletta Script SHA\", cursive",
    "section": "calendar"
  },
  {
    "id": "mqs7729b0",
    "kind": "image",
    "x": 690.0000411288115,
    "y": 1281.643542842402,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-4.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.5754043259508603,
    "section": "calendar"
  },
  {
    "id": "mqseo28c0",
    "kind": "image",
    "x": 124.29716098340066,
    "y": 584.537100749924,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-7.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.591892096285356,
    "section": "closing"
  },
  {
    "id": "mqtattri1",
    "kind": "image",
    "x": 299.31924841538915,
    "y": 3532.785398416443,
    "w": 596.3359253258718,
    "h": 782.6250315869272,
    "src": "/design06-exact/_assets/media/photo_2026-06-24_12.31.05.jpeg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "photo": {
      "x": -43.673810972877334,
      "y": -57.31705275594726,
      "w": 683.6835472716265,
      "h": 897.2591370988217
    },
    "section": "journey"
  },
  {
    "id": "mqtwci8h1",
    "kind": "image",
    "x": 1299.0808239929177,
    "y": 1068.0397803797573,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-27.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.067818954692477,
    "section": "hero"
  },
  {
    "id": "mqumscp01",
    "kind": "image",
    "x": 126.01382115762694,
    "y": 760.2106325144913,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-18.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.305701011715973,
    "section": "timeline"
  },
  {
    "id": "mquo9tu80",
    "kind": "image",
    "x": 346.330905739321,
    "y": 1748.5386996487996,
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
    },
    "section": "journey"
  },
  {
    "id": "mquohyoy0",
    "kind": "text",
    "x": 320.33334667247925,
    "y": 269.80958124223434,
    "w": 1151.742417786019,
    "h": 387.83257710704856,
    "text": "Если вам хочется сделать нам что-то приятное сверх этого — мы будем рады денежному подарку. Каждый конверт станет кирпичиком в фундаменте нашей жизни — стартовым капиталом семьи, которая только начинает строить своё будущее",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 48,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200",
    "section": "gift"
  },
  {
    "id": "mquohyw11",
    "kind": "text",
    "x": 320.3333483523456,
    "y": 700.7146306975155,
    "w": 1151.742417786019,
    "h": 332.86164104053387,
    "text": "Подарки и цветы, к сожалению, не сможем забрать с собой — потому что улетаем буквально через пару дней после свадьбы. Поэтому заранее благодарим за понимание и любовь",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 48,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200",
    "section": "gift"
  },
  {
    "id": "mqupp07c0",
    "kind": "image",
    "w": 420,
    "h": 421,
    "src": "/design06-exact/_assets/media/tile_1_1-26.png",
    "x": 1246.2166768596705,
    "y": 477.986440572774,
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "section": "timeline"
  },
  {
    "id": "mquprh5x1",
    "kind": "image",
    "w": 420,
    "h": 403,
    "src": "/design06-exact/_assets/media/tile_1_1-25.png",
    "x": 1245.1794713897716,
    "y": 120.91559729470207,
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.8168282315251059,
    "section": "timeline"
  },
  {
    "id": "mqupx3q20",
    "kind": "image",
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_2_2_2.png",
    "x": 1344.4001909328865,
    "y": 787.8984371575053,
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "section": "details"
  },
  {
    "id": "mquqabz20",
    "kind": "text",
    "x": 220.3437677717936,
    "y": 571.4366466929555,
    "w": 1366.6752140150156,
    "h": 222.7849770642202,
    "text": "Просим девушек воздержаться от выбора белого цвета",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 56,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom",
      "fontStyle": "italic",
      "textAlign": "center"
    },
    "fontWeight": "100",
    "section": "attire"
  },
  {
    "id": "mquzml3k0",
    "kind": "image",
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_1-30.png",
    "section": "timeline",
    "x": 1265.6236886330018,
    "y": 989.9100140321549,
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1.4351776590635228
  },
  {
    "id": "mquzy10a0",
    "kind": "text",
    "w": 1213.8463792523135,
    "h": 437.525272998995,
    "fontSize": 56,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "1.25",
    "text": "С огромной радостью делимся с вами новостью о нашей свадьбе и приглашаем вас разделить этот важный момент с нами!",
    "bind": "greeting",
    "section": "hero",
    "x": 295.24262185698643,
    "y": 1408.8606442942205,
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom",
      "whiteSpaceCollapse": "preserve-breaks"
    },
    "font": "\"Jost\", system-ui, sans-serif",
    "fontWeight": "100"
  },
  {
    "id": "mqs63zuk0",
    "kind": "image",
    "x": 56.761131069592075,
    "y": 784.0342104606873,
    "w": 420,
    "h": 420,
    "src": "/design06-exact/_assets/media/tile_1_2.png",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "section": "attire"
  },
  {
    "id": "mqv0aq571",
    "kind": "text",
    "x": 323.1313475474017,
    "y": 5.036211480542313,
    "w": 1151.742417786019,
    "h": 245.42288674007614,
    "text": "Самый дорогой подарок для нас — это вы рядом в этот день. Ваше присутствие, объятия и улыбки — всё, о чём мы могли мечтать.",
    "font": "\"Jost\", system-ui, sans-serif",
    "fontSize": 48,
    "color": "rgb(53, 80, 116)",
    "lineHeight": "78px",
    "letterSpacing": "0em",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "fontWeight": "200",
    "section": "gift"
  },
  {
    "id": "mqv1j4zl0",
    "kind": "image",
    "x": 905.520371699294,
    "y": 3532.8023318205696,
    "w": 596.3359253258718,
    "h": 782.6250315869272,
    "src": "/design06-exact/_assets/media/photo_2026-06-24_12.30.41.jpeg",
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "photo": {
      "x": -0.01420522925822354,
      "y": -208.66891078737103,
      "w": 791.198073648466,
      "h": 1038.3600770694377
    },
    "section": "journey"
  },
  {
    "id": "mqv2zpsl0",
    "kind": "image",
    "w": 433.4346330275229,
    "h": 433.4346330275229,
    "src": "/design06-exact/_assets/media/photo_2026-06-24_12.30.46__1_.jpeg",
    "section": "journey",
    "x": 359.1746085453959,
    "y": 252.528547861044,
    "raw": {
      "touchAction": "pan-x pan-y pinch-zoom"
    },
    "scale": 1
  }
];
