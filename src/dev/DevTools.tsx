import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useTheme } from "@/stores/context";
import { PALETTES, PALETTE_SWATCH } from "@/stores/ThemeStore";
import { editor } from "./editorStore";
import { SelectionOverlay } from "./SelectionOverlay";
import { TypographyPanel } from "./TypographyPanel";
import styles from "./DevTools.module.css";

const SAVE_LABEL: Record<string, string> = { saving: "…", ok: "✓ сохранено", error: "ошибка" };

/**
 * DEV-ONLY расширяемое меню инструментов (палитра + live-редактор макета).
 * Грузится динамически только в dev (см. App.tsx), в прод-бандл не попадает.
 * default-экспорт — для React.lazy.
 */
const DevTools = observer(function DevTools() {
  const theme = useTheme();

  // Подтянуть сохранённые правки из tools/layout-edits/ и применить к DOM (переживает reload).
  useEffect(() => {
    void editor.hydrate();
  }, []);

  async function onSave() {
    await editor.save();
    window.setTimeout(() => editor.resetSaveState(), 2500);
  }

  return (
    <>
      <div className={styles.bar} data-layout-editor aria-label="Dev-инструменты">
        {/* группа: палитра */}
        <div className={styles.group}>
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

        <div className={styles.sep} />

        {/* группа: редактор макета */}
        <div className={styles.group}>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={editor.editMode}
            onClick={() => editor.toggleEditMode()}
            title="Режим правки: клик — выбрать, Alt/Shift-клик — глубже/за элемент (как Figma); тяни за ручки/внутрь"
          >
            ✎ Правка
          </button>

          {editor.editMode && (
            <>
              <span className={styles.count} title="правок накоплено">
                {editor.editCount}
                {editor.isDirty && (
                  <em
                    title="есть несохранённые правки (черновик)"
                    style={{ color: "#e2b33a", marginLeft: 4, fontStyle: "normal" }}
                  >
                    ●
                  </em>
                )}
              </span>
              <button
                type="button"
                className={styles.icon}
                onClick={onSave}
                title="Сохранить в tools/layout-edits/ (и очистить черновик в localStorage)"
              >
                💾
              </button>
              <button
                type="button"
                className={styles.icon}
                onClick={() => editor.revert()}
                title="Отменить несохранённые — вернуть к сохранённому в tools/layout-edits/ (файлы там не меняются)"
              >
                ↺
              </button>
              {editor.saveState !== "idle" && (
                <span className={`${styles.status} ${editor.saveState === "error" ? styles.err : ""}`}>
                  {SAVE_LABEL[editor.saveState]}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {editor.editMode && <SelectionOverlay />}
      {editor.editMode && editor.isTextSelected && <TypographyPanel />}
    </>
  );
});

export default DevTools;
