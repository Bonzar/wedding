// Элементы, добавленные в визуальном редакторе (поверх Canva-секций, в координатах канвы
// 1776×…). Это НЕ часть исходного эталона — отдельный слой. Пишется dev-эндпоинтом
// /__d06/additions (см. vite-plugins/d06-save.ts). Пусто по умолчанию → на чистой базе
// слой ничего не рендерит и 0% сохраняется.
import type { El } from "./layout";

export type Addition = El & {
  id: string; // стабильный ключ; data-eid = `add/<id>`
  kind: "text" | "image";
  text?: string; // для kind:"text"
  src?: string; // для kind:"image"
};

export const additions: Addition[] = [];
