import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Из дизайн-системы остаются только глобальные стили, которые нужны выжившему коду:
//  · tokens.css — CSS-переменные (--ink/--paper/--f-body…), их читают раздел Survey и анкета RSVP;
//  · fonts.css  — @font-face шрифтов анкеты (PT Serif=--f-body, Jost=--f-label);
//  · base.css   — глобальный ресет; d06 точечно изолируется от его `section{}` (см. Design06.tsx).
// JS-примитивы дизайн-системы (Engraving/PhotoFrame/…) и старые секции удалены вместе со старым дизайном.
import "@/design-system/tokens.css";
import "@/design-system/fonts.css";
import "@/design-system/base.css";
import { RootStore } from "@/stores/RootStore";
import { StoreProvider } from "@/stores/context";
import { App } from "./App";

const store = new RootStore();
store.rsvp.load();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </StrictMode>,
);
