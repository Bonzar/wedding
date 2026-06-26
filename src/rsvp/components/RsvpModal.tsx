import { useEffect } from "react";
import { createPortal } from "react-dom";
import { observer } from "mobx-react-lite";
import { useRsvp } from "@/stores/context";
import { ATT_YES, ATT_NO, DRINK_COLUMNS } from "@/rsvp/api";
import type { YesNo } from "@/rsvp/types";
import styles from "./RsvpModal.module.css";

/** Модалка-анкета одного гостя. Управляется RsvpStore. */
export const RsvpModal = observer(function RsvpModal() {
  const rsvp = useRsvp();
  const guest = rsvp.activeGuest;

  // Esc закрывает; авто-закрытие после успешного сохранения (как в исходнике).
  useEffect(() => {
    if (!guest) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") rsvp.closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [guest, rsvp]);

  useEffect(() => {
    if (rsvp.message && !rsvp.message.error && rsvp.message.text.startsWith("Спасибо")) {
      const id = setTimeout(() => rsvp.closeModal(), 900);
      return () => clearTimeout(id);
    }
  }, [rsvp.message, rsvp]);

  if (!guest) return null;

  const { draft } = rsvp;
  const radio = (name: "attending" | "drinks", value: YesNo, label: string) => (
    <label className={styles.opt}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={draft[name] === value}
        onChange={() => (name === "attending" ? rsvp.setAttending(value) : rsvp.setDrinks(value))}
      />
      <span>{label}</span>
    </label>
  );

  const overlay = (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) rsvp.closeModal();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button type="button" className={styles.close} aria-label="Закрыть" onClick={() => rsvp.closeModal()}>
          ×
        </button>
        <h3 className={styles.mTtl}>Опрос для гостя: {guest.name}</h3>

        <div className={styles.q}>
          <p className={styles.qTtl}>Придёте ли вы на мероприятие?</p>
          {radio("attending", "Да", ATT_YES)}
          {radio("attending", "Нет", ATT_NO)}
        </div>

        {rsvp.showDrinksQuestion && (
          <div className={styles.q}>
            <p className={styles.qTtl}>Будете ли вы пить алкогольные напитки на свадьбе?</p>
            {radio("drinks", "Да", "Да")}
            {radio("drinks", "Нет", "Нет")}
          </div>
        )}

        {rsvp.showDrinkList && (
          <div className={styles.q}>
            <p className={styles.qTtl}>Какие алкогольные напитки вы предпочитаете?</p>
            <div className={styles.checks}>
              {DRINK_COLUMNS.map((col, ci) => (
                <div key={ci} className={styles.col}>
                  {col.map((group, gi) => (
                    <div key={gi} className={styles.group}>
                      {group.map((item) => (
                        <label key={item.value} className={styles.opt}>
                          <input
                            type="checkbox"
                            checked={draft.drinkList.includes(item.value)}
                            onChange={() => rsvp.toggleDrink(item.value)}
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.q}>
          <p className={styles.qTtl}>
            Пожелания / комментарии / аллергии <span className={styles.hint}>(необязательно)</span>
          </p>
          <textarea
            className={styles.textarea}
            rows={2}
            maxLength={1000}
            value={draft.comment}
            onChange={(e) => rsvp.setComment(e.target.value)}
          />
        </div>

        <button type="button" className={styles.save} disabled={rsvp.saving} onClick={() => rsvp.save()}>
          Сохранить
        </button>
        {rsvp.message && (
          <p className={`${styles.msg} ${rsvp.message.error ? styles.err : ""}`}>{rsvp.message.text}</p>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
});
