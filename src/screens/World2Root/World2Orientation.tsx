import { useLayoutEffect, useState, type RefObject } from "react";

export function revealRoomTarget(target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  const viewport = window.visualViewport;
  const top = viewport?.offsetTop ?? 0;
  const bottom = top + (viewport?.height ?? window.innerHeight);
  if (rect.top < top || rect.bottom > bottom) {
    target.scrollIntoView?.({ behavior: "instant", block: rect.height > (bottom - top) / 2 ? "start" : "nearest", inline: "nearest" });
  }
  target.focus({ preventScroll: true });
}

type Props = {
  root: RefObject<HTMLElement | null>;
  target: string;
  label: string;
  active: boolean;
};

/** Offers a local shortcut when the next destination is outside the viewport. */
export function World2Orientation({ root, target, label, active }: Props) {
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  useLayoutEffect(() => {
    const scene = root.current;
    if (!active || !scene) { setDirection(null); return; }
    let frame = 0;
    const measure = () => {
      const element = scene.querySelector<HTMLElement>(target);
      const r = element?.getBoundingClientRect();
      const viewport = window.visualViewport;
      const top = viewport?.offsetTop ?? 0;
      const bottom = top + (viewport?.height ?? window.innerHeight);
      if (!element || !r?.width || !r.height) { setDirection(null); return; }
      // Seeing a single line at the bottom does not reveal a whole reading.
      // For very long text, aim for its opening lines, then leave the reader
      // in control. Short controls must fit entirely.
      if (element.tagName === "BUTTON") {
        setDirection(r.top < top ? "up" : r.bottom > bottom ? "down" : null);
        return;
      }
      if (r.bottom < top + 6) { setDirection("up"); return; }
      const readableHeight = Math.min(r.height, (bottom - top) / 3);
      setDirection(r.top + readableHeight > bottom - 6 ? "down" : null);
    };
    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(scene);
    const destination = scene.querySelector<HTMLElement>(target);
    if (destination) observer?.observe(destination);
    window.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [root, target, active]);
  if (!active) return null;
  return (
    <div className="world2-orientation-line">
      {direction && <button type="button" data-world2-orientation={direction}
        onClick={() => {
          const destination = root.current?.querySelector<HTMLElement>(target);
          if (destination) revealRoomTarget(destination);
        }}>
        {direction === "up" && <span aria-hidden="true">↑ </span>}{label}
      </button>}
    </div>
  );
}
