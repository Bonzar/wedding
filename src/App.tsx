import { lazy, Suspense } from "react";
import { ThemeBar } from "@/components/ThemeBar";
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

// Пиксельный baseline эталона design06 (этап выноса в компоненты). Открывается по ?d06,
// грузится лениво — чанк baseline не попадает в бандл обычного лендинга. Глобальный CSS
// приложения при этом изолируется внутри Design06 точечным CSS-сбросом (не лениво-грузом).
const Design06 = lazy(() => import("@/design06/Design06"));

/**
 * Корневой компонент: плавающий переключатель темы + лист-приглашение.
 * Порядок секций соответствует исходному лендингу (build_index.py ORDER).
 */
export function App() {
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("d06")) {
    return (
      <Suspense fallback={null}>
        <Design06 />
      </Suspense>
    );
  }
  return (
    <>
      <ThemeBar />
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
