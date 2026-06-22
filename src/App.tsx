import { lazy, Suspense } from "react";
import {
  Hero,
  WeddingOf,
  Countdown,
  Calendar,
  Location,
  Timeline,
  Details,
  Attire,
  Gift,
  Journey,
  Collage,
  RsvpIntro,
  Survey,
  Closing,
} from "@/sections";
import { RsvpModal } from "@/rsvp/components/RsvpModal";

// DEV-ONLY: расширяемое меню (палитра + live-редактор макета). Динамический импорт под
// import.meta.env.DEV — в прод-сборке ветка сворачивается, чанк не эмитится (см. план).
const DevTools = import.meta.env.DEV ? lazy(() => import("@/dev/DevTools")) : null;

/**
 * Корневой компонент: лист-приглашение (+ dev-меню только в разработке).
 * Порядок секций соответствует исходному лендингу (build_index.py ORDER).
 */
export function App() {
  return (
    <>
      {DevTools && (
        <Suspense fallback={null}>
          <DevTools />
        </Suspense>
      )}
      <main className="sheet">
        <Hero />
        <WeddingOf />
        <Countdown />
        <Calendar />
        <Location />
        <Timeline />
        <Details />
        <Attire />
        <Gift />
        <Journey />
        <Collage />
        <RsvpIntro />
        <Survey />
        <Closing />
      </main>
      <RsvpModal />
    </>
  );
}
