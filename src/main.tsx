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

// Полифил Web API для старых браузеров (цель Chrome 49+/FF 52+, без IE; см. vite.config legacy).
// Babel/core-js (plugin-legacy) чинят синтаксис и ECMAScript-встроенные, но НЕ Web API. Из того,
// что мы используем, на нижней границе цели отсутствует только ResizeObserver (нативно с Chrome 64/
// FF 69; ядро d07-замеров и cqw-фолбэка). fetch есть нативно с Chrome 42/FF 39, IntersectionObserver
// мы не используем (lazy-фото деградируют в eager). Грузим полифил ТОЛЬКО если RO нет → на
// современных браузерах это 0 байт (динамический чанк просто не фетчится).
async function ensurePolyfills(): Promise<void> {
  if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
    const { default: ResizeObserverPolyfill } = await import("resize-observer-polyfill");
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverPolyfill;
  }
}

void ensurePolyfills().then(() => {
  const store = new RootStore();
  if (import.meta.env.DEV) (window as unknown as { __rootStore: RootStore }).__rootStore = store;
  store.rsvp.load();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </StrictMode>,
  );
});
