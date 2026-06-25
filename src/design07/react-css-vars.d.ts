// Canva-вёрстка использует CSS-переменные в инлайновых стилях (--H97cbQ и т.п.).
import "react";
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
