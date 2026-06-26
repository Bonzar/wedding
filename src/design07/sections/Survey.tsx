// design06 section Survey — РАЗДЕЛ БЕЗ ЭТАЛОНА (в Canva-рефе его нет). См. EDITOR.md §9.
//
// Живой опрос RSVP внутри d06: интро + список гостей приглашения (бэкенд Craft по ?inv=<токен>).
//
// Редактор: РЕДАКТИРУЕМЫ только базовые интро-объекты (надпись/заголовок/абзац) — они построены
// как Canva-объекты (DF_utQ + поле aF9o6Q + <p>/<span>), несут литеральные data-eid и записи в
// Survey.layout.ts (зарегистрированы в editor/registry.ts; кегль идёт через --H97cbQ, поэтому те
// же классы текста, что и у соседей). Интерактив — список гостей (useRsvp) и анкета RsvpModal —
// data-eid НЕ несёт и редактору не виден. Шрифты — дизайн-системы (Canva-шрифты латинские,
// контент русский). Геометрия — в «px макета» (страница в zoom-скейле от 1776).
//
// 0%-инвариант: под ?baseline весь раздел возвращает null (его нет в статическом эталоне) —
// иначе он добавил бы высоту и сломал полностраничный пиксель-дифф (tools/_verify_d06.mjs).
import { observer } from "mobx-react-lite";
import { cx } from "../cx";
import { elStyle, cqw } from "../layout";
import styles from "../canva.module.css";
import { layout } from "./Survey.layout";
import { assetUrl } from "../assetUrl";
import { useRsvp } from "@/stores/context";
import { SURVEY_INTRO } from "@/content/wedding";

// Чернила Survey-интерактива (листики/ссылки) — через палитру-переменную: следует выбранному
// цвету, фолбэк = базовый ink → 0% при невыбранной палитре. См. palette.ts.
const INK = "var(--d06-ink, rgb(53, 80, 116))";

// Декоративная веточка-разделитель (НЕ редактируемая — без data-eid).
const Sprig = ({ size }: { size: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    aria-hidden="true"
    style={{ flex: "0 0 auto", width: cqw(size), height: cqw(size) }}
  >
    <path d="M12 21V7" />
    <path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5z" />
    <path d="M12 10c3 0 5-2 5-5-3 0-5 2-5 5z" />
    <path d="M12 16c-2.4 0-4-1.6-4-4 2.4 0 4 1.6 4 4z" />
  </svg>
);

// — Редактируемый интро-объект: надпись-эйброу «RSVP». —
function Eyebrow() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="survey/eyebrow" style={elStyle(layout["survey/eyebrow"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="survey/eyebrow-field" style={elStyle(layout["survey/eyebrow-field"])}>
        <div data-eid="survey/eyebrow-box" style={elStyle(layout["survey/eyebrow-box"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="ru">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="survey/eyebrow-p" style={elStyle(layout["survey/eyebrow-p"])}>
                  <span className={styles.a_GcMg} data-eid="survey/eyebrow-span" style={elStyle(layout["survey/eyebrow-span"])}>
                    {""}
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

// — Редактируемый интро-объект: заголовок «Для нас важно знать». —
function Title() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="survey/title" style={elStyle(layout["survey/title"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="survey/title-field" style={elStyle(layout["survey/title-field"])}>
        <div data-eid="survey/title-box" style={elStyle(layout["survey/title-box"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="ru">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="survey/title-p" style={elStyle(layout["survey/title-p"])}>
                  <span className={styles.a_GcMg} data-eid="survey/title-span" style={elStyle(layout["survey/title-span"])}>
                    {SURVEY_INTRO.title}
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

// — Редактируемый интро-объект: поясняющий абзац. —
function BodyText() {
  return (
    <div className={cx(styles.DF_utQ, styles._682gpw, styles._0xkaeQ)} data-eid="survey/body" style={elStyle(layout["survey/body"])}>
      <div className={cx(styles.aF9o6Q, styles._0yZ6Qg)} data-eid="survey/body-field" style={elStyle(layout["survey/body-field"])}>
        <div data-eid="survey/body-box" style={elStyle(layout["survey/body-box"])}>
          <div className={styles.E8yZTA}>
            <div>
              <div className={cx(styles._2UyCZQ, styles.vkN2Cw, styles.Mb8E_A, styles.e1_zQg)} lang="ru">
                <p className={cx(styles._28USrA, styles.AfeL7g, styles.XN6uKA, styles._4N4NA)} data-eid="survey/body-p" style={elStyle(layout["survey/body-p"])}>
                  <span className={styles.a_GcMg} data-eid="survey/body-span" style={elStyle(layout["survey/body-span"])}>
                    {"Пожалуйста, ответьте на несколько вопросов, чтобы подтвердить своё присутствие, до 26 августа 2026. Ваш ответ очень поможет нам в подготовке к свадьбе."}
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

// Подсказки списка для не-ready состояний (как в @/rsvp/components/GuestList).
const NOTE: Record<string, string> = {
  "no-token": "Чтобы ответить, откройте персональную ссылку-приглашение, которую мы вам отправили.",
  loading: "Загружаем…",
  empty: "Приглашение не найдено. Проверьте ссылку или напишите нам.",
  error: "Не удалось загрузить. Обновите страницу или попробуйте позже.",
};

// Список гостей — ИНТЕРАКТИВ (НЕ редактируется, без data-eid). observer: listState/guests
// живут в mobx-сторе. Переиспользуем только логику useRsvp; разметка d06-нативная (CSS
// GuestList завязан на --u/cqw к .sheet, которого под ?d06 нет).
const GuestList = observer(function GuestList() {
  const rsvp = useRsvp();

  if (rsvp.listState !== "ready") {
    return (
      <p style={{ fontFamily: '"PT Serif", Georgia, serif', fontSize: cqw(34), lineHeight: 1.6, color: "var(--ink-muted)", maxWidth: cqw(1100), margin: "0 auto" }}>
        {NOTE[rsvp.listState]}
      </p>
    );
  }

  return (
    <div aria-live="polite" style={{ display: "flex", flexDirection: "column", maxWidth: cqw(1040), margin: "0 auto", textAlign: "left" }}>
      {rsvp.guests.map((g) => (
        <button
          key={g.guestId}
          type="button"
          data-answered={g.answered ? "1" : "0"}
          onClick={() => rsvp.openGuest(g.guestId)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: cqw(28),
            width: "100%",
            background: "none",
            border: "none",
            borderBottom: `${cqw(1)} solid var(--line)`,
            padding: `${cqw(32)} ${cqw(8)}`,
            cursor: "pointer",
            textAlign: "left",
            color: INK,
          }}
        >
          <Sprig size={44} />
          <span style={{ flex: 1, fontFamily: '"Jost", system-ui, sans-serif', fontWeight: 300, fontSize: cqw(34), letterSpacing: "0.02em", color: "var(--ink-strong)" }}>
            Опрос для гостя: <b style={{ fontWeight: 500 }}>{g.name}</b>
          </span>
          <span style={{ fontFamily: '"Jost", system-ui, sans-serif', fontSize: cqw(28), color: g.answered ? INK : "var(--ink-muted)", textDecoration: "underline", textUnderlineOffset: 4 }}>
            {g.answered ? "(отвечено)" : "(ответить)"}
          </span>
        </button>
      ))}
    </div>
  );
});

/** Раздел-опрос d06 (без Canva-эталона). Под ?baseline — не рендерится (0%-проверка цела). */
export default function Survey() {
  const baseline = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("baseline");
  if (baseline) return null;

  // Фон — та же кремовая бумажная текстура, что у соседних Canva-секций (Rsvp/Closing).
  return (
    <section
      className="rGeu6w"
      id="survey"
      style={{
        backgroundColor: "var(--paper)",
        backgroundImage: `url(${assetUrl("/design06-exact/_assets/media/2a2388e813cb85fb095b9a0c836a0688.jpg")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Канва интро: relative-контейнер, внутри — абсолютные редактируемые объекты. */}
      <div style={{ position: "relative", width: cqw(1776), height: cqw(700), margin: "0 auto" }}>
        <Eyebrow />
        <Title />
        <div style={{ position: "absolute", left: "50%", top: cqw(352), transform: "translateX(-50%)", color: INK }}>
          <Sprig size={56} />
        </div>
        <BodyText />
      </div>
      {/* Список гостей — интерактив, вне редактируемого слоя. */}
      <div style={{ width: cqw(1776), boxSizing: "border-box", padding: `0 ${cqw(138)} ${cqw(168)}`, margin: "0 auto", textAlign: "center" }}>
        <GuestList />
      </div>
    </section>
  );
}
