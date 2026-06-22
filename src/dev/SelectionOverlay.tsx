import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { observer } from "mobx-react-lite";
import { editor } from "./editorStore";
import styles from "./SelectionOverlay.module.css";

interface LayoutBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Layout-бокс элемента в координатах документа (без учёта transform). */
function measureLayoutBox(el: HTMLElement): LayoutBox {
  const prev = el.style.transform;
  el.style.transform = "none";
  const r = el.getBoundingClientRect();
  el.style.transform = prev; // мгновенно возвращаем — кадр не успевает отрисоваться
  return { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
}

const CORNERS = [
  { key: "nw", cls: "nw" },
  { key: "ne", cls: "ne" },
  { key: "sw", cls: "sw" },
  { key: "se", cls: "se" },
] as const;

/** Площадь bounding-бокса (для сортировки кандидатов deep-select). */
function rectArea(el: Element): number {
  const r = el.getBoundingClientRect();
  return r.width * r.height;
}

/** Слишком крупный/служебный контейнер — не цель для deep-select. */
function isTooBroad(el: Element): boolean {
  return el.tagName === "MAIN" || el.tagName === "BODY" || el.tagName === "HTML" || el.id === "root";
}

/**
 * Стопка элементов под точкой для deep-select (Alt/Shift-клик «вглубь», как в Figma):
 * сперва реально кликаемое (paint-порядок elementsFromPoint), затем геометрически попавшие
 * pointer-events:none декорации (фоновые гравюры) — крупные раньше мелких. elementsFromPoint
 * их пропускает (pe:none), поэтому ловим перебором main * по getBoundingClientRect.
 */
function stackAt(x: number, y: number): HTMLElement[] {
  const paint = (document.elementsFromPoint(x, y) as HTMLElement[]).filter(
    (el) => el.closest("main") && !el.closest("[data-layout-editor]") && !isTooBroad(el),
  );
  const seen = new Set<Element>(paint);
  const geom = [...document.querySelectorAll<HTMLElement>("main *")]
    .filter((el) => {
      if (seen.has(el) || el.closest("[data-layout-editor]") || isTooBroad(el)) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    })
    .sort((a, b) => rectArea(b) - rectArea(a));
  return [...paint, ...geom];
}

/**
 * Оверлей выделенного элемента: рамка + 4 угловые ручки (масштаб, аспект залочен) +
 * ручка поворота, перетаскивание за внутреннюю часть (translate), и readout с цифрами
 * смещения/поворота/масштаба прямо под рамкой. Рендерится порталом в <body>.
 *
 * Активен только пока включён режим редактирования (монтируется из DevTools под editMode).
 */
export const SelectionOverlay = observer(function SelectionOverlay() {
  const selectedEl = editor.selectedEl;
  const [box, setBox] = useState<LayoutBox | null>(null);
  const drill = useRef({ x: -1, y: -1, idx: -1 });

  // Клик по элементу → выделение (capture, чтобы перехватить раньше обработчиков приложения).
  useEffect(() => {
    function onClick(ev: MouseEvent) {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      const drillMod = ev.altKey || ev.shiftKey;
      const chrome = target.closest("[data-le-chrome]"); // рамка/ручки/readout выделения
      const editorUi = target.closest("[data-layout-editor]");
      if (editorUi && !chrome) return; // верхняя dev-панель — всегда мимо
      if (chrome && !drillMod) return; // клик по рамке без модификатора — мимо (ручки ловят pointerdown сами)
      ev.preventDefault();
      ev.stopPropagation();
      // Alt/Shift-клик — «провалиться» глубже/за элемент (deep-select как в Figma): следующий элемент
      // из стопки под точкой; повтор в той же точке идёт ещё глубже. Работает и сквозь рамку выделения.
      if (drillMod) {
        const stack = stackAt(ev.clientX, ev.clientY);
        if (stack.length) {
          const d = drill.current;
          const same = Math.abs(ev.clientX - d.x) < 6 && Math.abs(ev.clientY - d.y) < 6;
          const from = same ? d.idx : editor.selectedEl ? stack.indexOf(editor.selectedEl) : -1;
          const idx = (from + 1) % stack.length;
          drill.current = { x: ev.clientX, y: ev.clientY, idx };
          editor.select(stack[idx]);
          return;
        }
      }
      drill.current = { x: -1, y: -1, idx: -1 };
      editor.select(target);
    }
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") editor.clearSelection();
    }
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    document.body.style.cursor = "crosshair";
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
      document.body.style.cursor = "";
    };
  }, []);

  // Замер layout-бокса: при смене элемента и на resize (cqw-лейаут переедет).
  useEffect(() => {
    if (!selectedEl) {
      setBox(null);
      return;
    }
    const measure = () => setBox(measureLayoutBox(selectedEl));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [selectedEl]);

  const e = editor.current;
  if (!selectedEl || !box || !e) return null;

  const center = { x: box.left + box.width / 2 + e.tx, y: box.top + box.height / 2 + e.ty };
  const transform = `translate(${e.tx}px, ${e.ty}px) rotate(${e.rotate}deg) scale(${e.scale})`;

  // — drag-хелперы —

  function drag(onMove: (m: PointerEvent) => void) {
    function move(m: PointerEvent) {
      m.preventDefault();
      onMove(m);
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startMove(ev: React.PointerEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    const startTx = e!.tx;
    const startTy = e!.ty;
    const startX = ev.pageX;
    const startY = ev.pageY;
    drag((m) => editor.patch({ tx: startTx + (m.pageX - startX), ty: startTy + (m.pageY - startY) }));
  }

  function startResize(ev: React.PointerEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    const startScale = e!.scale;
    const startDist = Math.hypot(ev.pageX - center.x, ev.pageY - center.y) || 1;
    drag((m) => {
      const d = Math.hypot(m.pageX - center.x, m.pageY - center.y);
      const s = Math.min(10, Math.max(0.1, startScale * (d / startDist)));
      editor.patch({ scale: s });
    });
  }

  function startRotate(ev: React.PointerEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    const startRot = e!.rotate;
    const startAngle = Math.atan2(ev.pageY - center.y, ev.pageX - center.x);
    drag((m) => {
      const ang = Math.atan2(m.pageY - center.y, m.pageX - center.x);
      let deg = startRot + ((ang - startAngle) * 180) / Math.PI;
      if (m.shiftKey) deg = Math.round(deg / 15) * 15;
      editor.patch({ rotate: deg });
    });
  }

  // readout — под текущим (трансформированным) bounding-боксом, сам НЕ трансформируется
  const vr = selectedEl.getBoundingClientRect();
  const readout = {
    left: vr.left + window.scrollX,
    top: vr.bottom + window.scrollY + 6,
  };

  return createPortal(
    <>
      <div
        className={styles.frame}
        data-layout-editor
        data-le-chrome
        style={{ left: box.left, top: box.top, width: box.width, height: box.height, transform }}
      >
        <div className={styles.move} onPointerDown={startMove} title="Тянуть — переместить" />
        {CORNERS.map((c) => (
          <span
            key={c.key}
            className={`${styles.handle} ${styles[c.cls]}`}
            onPointerDown={startResize}
            title="Тянуть — масштаб (аспект сохраняется)"
          />
        ))}
        <span className={styles.rotateLine} />
        <span className={styles.rotate} onPointerDown={startRotate} title="Тянуть — поворот (Shift = шаг 15°)" />
      </div>

      <div className={styles.readout} data-layout-editor data-le-chrome style={{ left: readout.left, top: readout.top }}>
        <span title="смещение">Δ {Math.round(e.tx)}, {Math.round(e.ty)} px</span>
        <span title="поворот">⟳ {e.rotate.toFixed(1)}°</span>
        <span title="масштаб">⤢ {e.scale.toFixed(2)}×</span>
        {editor.selectedOwner && (
          <span className={styles.info} title="компонент-владелец: имя + опознавательный проп + место вызова">
            🧩 {editor.selectedOwner}
          </span>
        )}
        {editor.selectedSource && (
          <span className={styles.info} title="источник самого элемента в коде">📄 {editor.selectedSource}</span>
        )}
        {editor.selectedSourceSection && (
          <span className={styles.info} title="ближайшая секция">§ {editor.selectedSourceSection}</span>
        )}
      </div>
    </>,
    document.body,
  );
});
