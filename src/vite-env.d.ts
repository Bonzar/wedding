/// <reference types="vite/client" />

// SVG-гравюры импортируются как сырые строки (?raw) — чтобы сохранить
// currentColor-темизацию и инлайнить их в <Engraving>.
declare module "*.svg?raw" {
  const content: string;
  export default content;
}
