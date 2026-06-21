import { RsvpStore, type RsvpDeps } from "@/rsvp/RsvpStore";
import { ThemeStore, type PaletteName } from "./ThemeStore";

export interface RootStoreDeps {
  rsvp?: RsvpDeps;
  theme?: PaletteName;
}

/** Корневой стор: агрегирует доменные сторы приложения. */
export class RootStore {
  readonly rsvp: RsvpStore;
  readonly theme: ThemeStore;

  constructor(deps: RootStoreDeps = {}) {
    this.rsvp = new RsvpStore(deps.rsvp);
    this.theme = new ThemeStore(deps.theme);
  }
}
