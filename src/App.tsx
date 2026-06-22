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

/**
 * Корневой компонент: плавающий переключатель темы + лист-приглашение.
 * Порядок секций соответствует исходному лендингу (build_index.py ORDER).
 */
export function App() {
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
