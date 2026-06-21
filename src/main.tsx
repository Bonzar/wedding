import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/design-system"; // глобальные стили (токены/шрифты/база) — один раз
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
