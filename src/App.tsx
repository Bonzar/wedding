import { lazy, Suspense } from "react";
import Design06 from "@/design06/Design06";

// d07 — экспериментальная адаптивная вёрстка (cqw вместо глобального transform/scale).
// Живёт за ?d07 и грузится ЛЕНИВО: её глобальный Canva-CSS (canva-base/custom-fonts)
// и module-CSS подтягиваются только на ?d07, прод-рендер d06 остаётся нетронутым.
const Design07 = lazy(() => import("@/design07/Design07"));

/**
 * Корневой компонент приложения. По умолчанию — design06 (пиксель-точный лист со своим
 * скейлером, палитрой и анкетой RSVP). За `?d07` — экспериментальный design07.
 * Поведенческие флаги (`?noscale`, `?baseline`, dev-only `?edit`) читаются внутри дизайна.
 */
export function App() {
  const isD07 = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("d07");
  if (isD07) {
    return (
      <Suspense fallback={null}>
        <Design07 />
      </Suspense>
    );
  }
  return <Design06 />;
}
