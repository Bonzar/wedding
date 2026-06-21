import { makeAutoObservable } from "mobx";

export const PALETTES = ["indigo", "bordo", "graphite", "forest", "sepia"] as const;
export type PaletteName = (typeof PALETTES)[number];

export const PALETTE_SWATCH: Record<PaletteName, { label: string; ink: string }> = {
  indigo: { label: "Индиго", ink: "#344f73" },
  bordo: { label: "Бордо", ink: "#7a1f2b" },
  graphite: { label: "Графит", ink: "#2f3338" },
  forest: { label: "Тёмно-зелёный", ink: "#244231" },
  sepia: { label: "Сепия", ink: "#5b3a24" },
};

const STORAGE_KEY = "wedding-theme";

/** Конфигурируемая палитра: выставляет data-theme на <html>, вся страница перекрашивается. */
export class ThemeStore {
  theme: PaletteName = "indigo";

  constructor(initial?: PaletteName) {
    if (initial) this.theme = initial;
    else this.theme = readStored() ?? "indigo";
    makeAutoObservable(this, {}, { autoBind: true });
    this.apply();
  }

  setTheme(t: PaletteName): void {
    this.theme = t;
    this.apply();
    writeStored(t);
  }

  private apply(): void {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = this.theme;
    }
  }
}

function readStored(): PaletteName | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && (PALETTES as readonly string[]).includes(v) ? (v as PaletteName) : null;
  } catch {
    return null;
  }
}
function writeStored(t: PaletteName): void {
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* приватный режим — игнорируем */
  }
}
