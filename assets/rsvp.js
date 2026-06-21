/**
 * RSVP-фронт для свадебного лендинга.
 * Читает ?inv=TOKEN, тянет гостей из функции-прокси, рисует анкеты-модалки,
 * сохраняет ответы. Вся «рискованная» логика — чистые функции (тестируются
 * без DOM в assets/rsvp.test.mjs). DOM-обвязка — тонкая (init).
 */

export const RSVP_API = "https://functions.yandexcloud.net/d4ej3htfmmdbnvbfsvkq";

export const DRINKS = [
  "Игристое вино", "Водка", "Красное вино", "Белое вино", "Коньяк",
  "Виски", "Ликёр", "Настойки", "Ром", "Текила",
];

const ATT_YES = "Да, я буду присутствовать.";
const ATT_NO = "Нет, к сожалению, не смогу прийти.";

// ---- чистая логика ----------------------------------------------------------
export function getInviteToken(search) {
  const m = /[?&]inv=([^&]+)/.exec(search || "");
  return m ? decodeURIComponent(m[1]).trim() : "";
}

export function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function validateAnswers(a) {
  if (a.attending !== "Да" && a.attending !== "Нет") return "Выберите, придёте ли вы";
  if (a.attending === "Да" && a.drinks && a.drinks !== "Да" && a.drinks !== "Нет") return "Ответьте про напитки";
  return null;
}

// нормализует ответ так же, как это сделает сервер (на случай рассинхрона UI)
export function buildPayload(token, guestId, a) {
  const attending = a.attending;
  const drinks = attending === "Да" ? (a.drinks || "") : "";
  const drinkList = (attending === "Да" && drinks === "Да")
    ? [...new Set((a.drinkList || []).filter((d) => DRINKS.includes(d)))]
    : [];
  return { inv: token, guestId, answers: { attending, drinks, drinkList, comment: String(a.comment || "").trim() } };
}

// ---- сеть -------------------------------------------------------------------
export async function fetchInvite(token, fetchImpl = fetch) {
  const res = await fetchImpl(`${RSVP_API}?inv=${encodeURIComponent(token)}`);
  if (res.status === 404) return { notFound: true };
  if (!res.ok) throw new Error(`http ${res.status}`);
  return await res.json();
}

export async function saveAnswer(token, guestId, a, fetchImpl = fetch) {
  const res = await fetchImpl(RSVP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildPayload(token, guestId, a)),
  });
  if (!res.ok) throw new Error(`save ${res.status}`);
  return await res.json();
}

// ---- рендер (чистые функции -> HTML-строки) ---------------------------------
const SPRIG = '<svg class="rsvp-sprig" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M12 21V7"/><path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 10c3 0 5-2 5-5-3 0-5 2-5 5z"/><path d="M12 16c-2.4 0-4-1.6-4-4 2.4 0 4 1.6 4 4z"/></svg>';

export function renderGuestList(guests) {
  return guests.map((g) => `
    <button type="button" class="rsvp-guest" data-guest-id="${esc(g.guestId)}" data-answered="${g.answered ? "1" : "0"}">
      ${SPRIG}
      <span class="rsvp-guest-ttl">Опрос для гостя: <b>${esc(g.name)}</b></span>
      <span class="rsvp-guest-state">${g.answered ? "(отвечено)" : "(ответить)"}</span>
    </button>`).join("");
}

export function renderModal(guest) {
  const att = guest.attending;
  const drinks = guest.drinks;
  const chosen = new Set(guest.drinkList || []);
  const radio = (name, val, label, checked) =>
    `<label class="rsvp-opt"><input type="radio" name="${name}" value="${esc(val)}"${checked ? " checked" : ""}><span>${esc(label)}</span></label>`;
  const check = (val) =>
    `<label class="rsvp-opt"><input type="checkbox" name="drinkList" value="${esc(val)}"${chosen.has(val) ? " checked" : ""}><span>${esc(val)}</span></label>`;

  return `
    <button type="button" class="rsvp-close" aria-label="Закрыть">×</button>
    <h3 class="rsvp-m-ttl">Опрос для гостя: ${esc(guest.name)}</h3>
    <div class="rsvp-q">
      <p class="rsvp-q-ttl">Придёте ли вы на мероприятие?</p>
      ${radio("attending", "Да", ATT_YES, att === "Да")}
      ${radio("attending", "Нет", ATT_NO, att === "Нет")}
    </div>
    <div class="rsvp-q" data-when="attending=Да">
      <p class="rsvp-q-ttl">Будете ли вы пить алкогольные напитки на свадьбе?</p>
      ${radio("drinks", "Да", "Да", drinks === "Да")}
      ${radio("drinks", "Нет", "Нет", drinks === "Нет")}
    </div>
    <div class="rsvp-q" data-when="drinks=Да">
      <p class="rsvp-q-ttl">Какие алкогольные напитки вы предпочитаете?</p>
      <div class="rsvp-checks">${DRINKS.map(check).join("")}</div>
    </div>
    <div class="rsvp-q">
      <p class="rsvp-q-ttl">Пожелания / аллергии <span class="rsvp-opt-hint">(необязательно)</span></p>
      <textarea name="comment" class="rsvp-textarea" rows="2" maxlength="1000">${esc(guest.comment || "")}</textarea>
    </div>
    <button type="button" class="rsvp-save">Сохранить</button>
    <p class="rsvp-msg" hidden></p>`;
}

// читает текущие ответы из формы модалки
export function readForm(root) {
  const val = (sel) => { const el = root.querySelector(sel); return el ? el.value : ""; };
  return {
    attending: (root.querySelector('input[name="attending"]:checked') || {}).value || "",
    drinks: (root.querySelector('input[name="drinks"]:checked') || {}).value || "",
    drinkList: [...root.querySelectorAll('input[name="drinkList"]:checked')].map((el) => el.value),
    comment: val('textarea[name="comment"]'),
  };
}

// ---- DOM-обвязка ------------------------------------------------------------
export function init(doc = document, win = window) {
  const list = doc.getElementById("rsvp-list");
  if (!list) return;
  const token = getInviteToken(win.location.search);

  if (!token) {
    list.innerHTML = `<p class="rsvp-note">Чтобы ответить, откройте персональную ссылку-приглашение, которую мы вам отправили.</p>`;
    return;
  }
  list.innerHTML = `<p class="rsvp-note">Загружаем…</p>`;

  fetchInvite(token).then((data) => {
    if (data.notFound || !data.guests || !data.guests.length) {
      list.innerHTML = `<p class="rsvp-note">Приглашение не найдено. Проверьте ссылку или напишите нам.</p>`;
      return;
    }
    const guests = data.guests;
    list.innerHTML = renderGuestList(guests);
    wire(doc, token, guests, list);
  }).catch(() => {
    list.innerHTML = `<p class="rsvp-note">Не удалось загрузить. Обновите страницу или попробуйте позже.</p>`;
  });
}

function wire(doc, token, guests, list) {
  const overlay = ensureOverlay(doc);
  const modal = overlay.querySelector(".rsvp-modal");

  const close = () => { overlay.hidden = true; };
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  doc.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  list.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-guest-id]");
    if (!btn) return;
    const guest = guests.find((g) => g.guestId === btn.dataset.guestId);
    if (guest) openModal(doc, overlay, modal, token, guest, btn);
  });
}

function openModal(doc, overlay, modal, token, guest, rowBtn) {
  modal.innerHTML = renderModal(guest);
  overlay.hidden = false;
  modal.querySelector(".rsvp-close").onclick = () => { overlay.hidden = true; };
  const sync = () => applyConditional(modal);
  modal.querySelectorAll('input[name="attending"],input[name="drinks"]').forEach((el) => { el.onchange = sync; });
  sync();

  modal.querySelector(".rsvp-save").onclick = async () => {
    const answers = readForm(modal);
    const err = validateAnswers(answers);
    const msg = modal.querySelector(".rsvp-msg");
    if (err) { showMsg(msg, err, true); return; }
    const save = modal.querySelector(".rsvp-save");
    save.disabled = true; showMsg(msg, "Сохраняем…", false);
    try {
      await saveAnswer(token, guest.guestId, answers);
      guest.answered = true; guest.attending = answers.attending;
      guest.drinks = answers.drinks; guest.drinkList = answers.drinkList; guest.comment = answers.comment;
      rowBtn.dataset.answered = "1";
      const st = rowBtn.querySelector(".rsvp-guest-state");
      if (st) st.textContent = "(отвечено)";
      showMsg(msg, "Спасибо! Ответ сохранён.", false);
      setTimeout(() => { overlay.hidden = true; }, 900);
    } catch {
      showMsg(msg, "Не удалось сохранить. Попробуйте ещё раз.", true);
      save.disabled = false;
    }
  };
}

// показывает/прячет вопросы про напитки в зависимости от ответов
function applyConditional(modal) {
  const att = (modal.querySelector('input[name="attending"]:checked') || {}).value;
  const drinks = (modal.querySelector('input[name="drinks"]:checked') || {}).value;
  modal.querySelectorAll("[data-when]").forEach((el) => {
    const [k, v] = el.dataset.when.split("=");
    const cond = k === "attending" ? att === v : (att === "Да" && drinks === v);
    el.hidden = !cond;
  });
}

function showMsg(el, text, isErr) {
  if (!el) return;
  el.textContent = text; el.hidden = false;
  el.classList.toggle("err", !!isErr);
}

function ensureOverlay(doc) {
  let overlay = doc.getElementById("rsvp-overlay");
  if (overlay) return overlay;
  overlay = doc.createElement("div");
  overlay.id = "rsvp-overlay";
  overlay.className = "rsvp-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `<div class="rsvp-modal" role="dialog" aria-modal="true"></div>`;
  doc.body.appendChild(overlay);
  return overlay;
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
  else init();
}
