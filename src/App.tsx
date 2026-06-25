import { lazy, Suspense } from "react";
import Design07 from "@/design07/Design07";

// d06 — прежний дизайн (пиксель-снимок со скейлером на transform). Теперь это fallback за
// ?d06 и грузится ЛЕНИВО: его глобальный Canva-CSS и module-CSS подтягиваются только на ?d06,
// прод-рендер d07 (дефолт) остаётся нетронутым.
const Design06 = lazy(() => import("@/design06/Design06"));

/**
 * Корневой компонент приложения. По умолчанию — design07 (адаптивная cqw-вёрстка: масштаб на
 * уровне лайаута, без transform/zoom/meta). За `?d06` — прежний design06 (fallback).
 * Поведенческие флаги (`?noscale`, `?baseline`, dev-only `?edit`) читаются внутри дизайна.
 */
export function App() {
  const isD06 = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("d06");
  if (isD06) {
    return (
      <Suspense fallback={null}>
        <Design06 />
      </Suspense>
    );
  }
  return <Design07 />;
}
