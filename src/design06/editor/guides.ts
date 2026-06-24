// Ручные направляющие редактора (вертикальные/горизонтальные линии в координатах канвы).
// Живут ТОЛЬКО в редакторе (localStorage), на прод-рендер не попадают. К ним привязываются
// объекты при перемещении (вместе со smart-guides по краям/центрам других объектов).
export type Guide = { id: string; axis: "x" | "y"; pos: number };

const KEY = "d06-guides";

export function loadGuides(): Guide[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function saveGuides(g: Guide[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(g));
  } catch {
    /* приватный режим — просто без персистентности */
  }
}
