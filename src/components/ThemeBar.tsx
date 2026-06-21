import { observer } from "mobx-react-lite";
import { useTheme } from "@/stores/context";
import { PALETTES, PALETTE_SWATCH } from "@/stores/ThemeStore";
import styles from "./ThemeBar.module.css";

/** Плавающий переключатель палитры (как в исходной дизайн-системе). */
export const ThemeBar = observer(function ThemeBar() {
  const theme = useTheme();
  return (
    <div id="theme-bar" className={styles.bar} aria-label="Тема">
      {PALETTES.map((p) => (
        <button
          key={p}
          type="button"
          className={styles.swatch}
          style={{ background: PALETTE_SWATCH[p].ink }}
          title={PALETTE_SWATCH[p].label}
          aria-pressed={theme.theme === p}
          onClick={() => theme.setTheme(p)}
        />
      ))}
    </div>
  );
});
