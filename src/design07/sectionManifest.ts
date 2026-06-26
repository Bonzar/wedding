// Манифест секций d07: ПОРЯДОК + мета. Источник истины для РЕНДЕРА (Design07 рендерит по нему,
// а не по статичному DESIGN06_SECTIONS) и для редактора (reorder / скрыть / высота / добавить).
// Дефолт == текущие 9 секций в исходном порядке без оверрайдов → рендер пиксель-в-пиксель
// прежний (0% цел). Пишется dev-эндпоинтом (как additions.ts) — TODO: d07-save (см. EDITOR).
export type SectionEntry = {
  slug: string; // ключ в SECTION_COMPONENTS (sections/index.ts) и префикс data-eid секции
  enabled?: boolean; // false → секция не рендерится (мягкое удаление; запись цела для возврата). По умолчанию true.
  minHeight?: number; // px канвы (база 1776): min-height секции в потоке (фича «высота секции»). Нет → натуральная высота.
  custom?: boolean; // true → НЕ-Canva секция (рендерит CustomSection): пустой холст под ручной интерактив + секционные additions. Под ?baseline → null.
  title?: string; // подпись кастомной секции в панели редактора.
};

export const sectionManifest: SectionEntry[] = [
  {
    "slug": "hero",
    "minHeight": 1800
  },
  {
    "slug": "calendar"
  },
  {
    "slug": "timeline"
  },
  {
    "slug": "details"
  },
  {
    "slug": "attire",
    "minHeight": 1200
  },
  {
    "slug": "gift",
    "minHeight": 1300
  },
  {
    "slug": "journey"
  },
  {
    "slug": "survey"
  },
  {
    "slug": "closing"
  }
];
