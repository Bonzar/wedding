/**
 * Дизайн-система свадебного приглашения — единая точка входа.
 * Импортирует глобальные стили (токены/шрифты/база) ОДИН раз и реэкспортирует
 * все примитивы. Секции и приложение тянут всё отсюда: `import { Section, Engraving } from "@/design-system"`.
 */
import "./tokens.css";
import "./fonts.css";
import "./base.css";

export { u } from "./unit";
export { Engraving } from "./Engraving";
export type { EngravingProps } from "./Engraving";
export { PhotoFrame } from "./PhotoFrame";
export type { PhotoFrameProps } from "./PhotoFrame";
export { Section, Ghost } from "./Section";
export type { SectionProps, GhostProps } from "./Section";
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
export { Divider } from "./Divider";
export type { DividerProps } from "./Divider";
export { Eyebrow, Script, Meta, Body, Sub, Amp } from "./Text";
export { ILLUSTRATION_NAMES, ILLUSTRATIONS, getSvg } from "./illustrations";
export type { IllustrationName } from "./illustrations";
