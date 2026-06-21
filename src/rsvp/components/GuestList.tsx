import { observer } from "mobx-react-lite";
import { useRsvp } from "@/stores/context";
import styles from "@/sections/Survey/Survey.module.css";

const SPRIG = (
  <svg className={styles.sprig} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
    <path d="M12 21V7" />
    <path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5z" />
    <path d="M12 10c3 0 5-2 5-5-3 0-5 2-5 5z" />
    <path d="M12 16c-2.4 0-4-1.6-4-4 2.4 0 4 1.6 4 4z" />
  </svg>
);

const NOTE: Record<string, string> = {
  "no-token": "Чтобы ответить, откройте персональную ссылку-приглашение, которую мы вам отправили.",
  loading: "Загружаем…",
  empty: "Приглашение не найдено. Проверьте ссылку или напишите нам.",
  error: "Не удалось загрузить. Обновите страницу или попробуйте позже.",
};

/** Список гостей приглашения. Клик по гостю открывает анкету-модалку. */
export const GuestList = observer(function GuestList() {
  const rsvp = useRsvp();

  if (rsvp.listState !== "ready") {
    return <p className={styles.note}>{NOTE[rsvp.listState]}</p>;
  }

  return (
    <div className={styles.list} aria-live="polite">
      {rsvp.guests.map((g) => (
        <button
          key={g.guestId}
          type="button"
          className={styles.guest}
          data-answered={g.answered ? "1" : "0"}
          onClick={() => rsvp.openGuest(g.guestId)}
        >
          {SPRIG}
          <span className={styles.guestTtl}>
            Опрос для гостя: <b>{g.name}</b>
          </span>
          <span className={styles.guestState}>{g.answered ? "(отвечено)" : "(ответить)"}</span>
        </button>
      ))}
    </div>
  );
});
