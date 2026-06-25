// Сборка нескольких CSS-Module классов в один className. Пустые/undefined отбрасываем.
export const cx = (...parts: Array<string | false | null | undefined>): string => parts.filter(Boolean).join(" ");
