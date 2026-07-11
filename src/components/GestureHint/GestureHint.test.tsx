import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GestureHint } from "./GestureHint";
import { gestureHintAssets } from "./gestureHintAssets";

describe("GestureHint", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("espera el delay y se oculta al completar la interacción", () => {
    const { container, rerender } = render(
      <GestureHint active variant="tap" targetLabel="Punto de lectura" />,
    );
    const hint = container.querySelector("[data-gvo-gesture-hint='tap']");

    expect(hint).toHaveAttribute("data-gvo-gesture-system", "016S5");
    expect(hint).toHaveAttribute("data-gvo-gesture-scale", "85-percent");
    expect(hint).toHaveAttribute(
      "data-gvo-gesture-animation",
      "tap-guidance-r2",
    );
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "waiting");
    act(() => vi.advanceTimersByTime(2799));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "waiting");
    act(() => vi.advanceTimersByTime(1));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "visible");

    rerender(
      <GestureHint
        active={false}
        completed
        variant="tap"
        targetLabel="Punto de lectura"
      />,
    );
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");
    act(() => vi.advanceTimersByTime(5000));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");
  });

  it("ancla la yema al centro real del target y sincroniza su atención", () => {
    const target = document.createElement("button");
    target.getBoundingClientRect = () =>
      ({
        bottom: 120,
        height: 40,
        left: 100,
        right: 180,
        top: 80,
        width: 80,
        x: 100,
        y: 80,
        toJSON: () => ({}),
      }) as DOMRect;
    document.body.append(target);
    const anchorRef = { current: target };
    const { rerender, unmount } = render(
      <GestureHint
        active
        anchorRef={anchorRef}
        variant="tap"
        targetLabel="Target real"
      />,
    );
    const hint = document.querySelector(
      "[data-gvo-gesture-anchor='target-ref']",
    );

    expect(hint).toHaveAttribute("data-gvo-gesture-anchor-state", "ready");
    expect(hint).toHaveStyle({ left: "140px", top: "100px" });
    expect(
      hint?.querySelector("[data-gvo-gesture-fingertip='calibrated']"),
    ).toBeInTheDocument();
    expect(target).toHaveAttribute("data-gvo-gesture-target", "tap");
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "waiting");

    act(() => vi.advanceTimersByTime(2800));
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "visible");

    rerender(
      <GestureHint
        active={false}
        anchorRef={anchorRef}
        completed
        variant="tap"
        targetLabel="Target real"
      />,
    );
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "completed");
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");

    unmount();
    target.remove();
  });

  it.each([
    ["swipe-vertical", "up", "44.7%", "6.8%"],
    ["swipe-vertical", "down", "55.3%", "93.2%"],
    ["swipe-horizontal", "left", "11.1%", "40.5%"],
    ["swipe-horizontal", "right", "88.9%", "59.5%"],
  ] as const)(
    "resuelve %s %s con el registry compartido",
    (variant, direction, expectedX, expectedY) => {
      const { container } = render(
        <GestureHint
          active
          delayMs={0}
          variant={variant}
          direction={direction}
          targetLabel={`${variant} ${direction}`}
        />,
      );
      act(() => vi.runOnlyPendingTimers());

      const hint = container.querySelector(
        `[data-gvo-gesture-hint='${variant}']`,
      );
      expect(hint).toHaveAttribute("data-gvo-gesture-direction", direction);
      expect((hint as HTMLElement).style.getPropertyValue(
        "--gvo-gesture-fingertip-x",
      )).toBe(expectedX);
      expect((hint as HTMLElement).style.getPropertyValue(
        "--gvo-gesture-fingertip-y",
      )).toBe(expectedY);
      expect((hint as HTMLElement).style.getPropertyValue(
        "--gvo-gesture-trail-origin-x",
      )).toBe(expectedX);
      expect((hint as HTMLElement).style.getPropertyValue(
        "--gvo-gesture-trail-origin-y",
      )).toBe(expectedY);
      expect(
        hint?.querySelector(".gvo-gesture-hint__direction"),
      ).toBeInTheDocument();
      expect(hint).toHaveAttribute(
        "data-gvo-gesture-animation",
        "unidirectional-trail-r7",
      );
      expect(hint).toHaveAttribute(
        "data-gvo-gesture-cycle",
        "unidirectional-reset",
      );
      expect(hint).toHaveAttribute(
        "data-gvo-gesture-trail-alignment",
        "fingertip-calibrated",
      );
      expect(hint).toHaveAttribute(
        "data-gvo-gesture-trail-visibility",
        "extended",
      );
      expect(hint).toHaveAttribute(
        "data-gvo-gesture-trail-length",
        "194-percent",
      );
      expect(hint).toHaveAttribute(
        "data-gvo-gesture-cycle-duration",
        "1680ms",
      );
      expect(hint).toHaveAttribute(
        "data-gvo-gesture-calibration-profile",
        variant === "swipe-horizontal"
          ? "horizontal-index-alpha-v1"
          : "vertical-index-alpha-v1",
      );
      expect(
        hint?.querySelector(
          `[data-gvo-gesture-fingertip-trail='${direction}']`,
        ),
      ).toBeInTheDocument();
      expect(
        hint?.querySelector(".gvo-gesture-hint__fingertip-trail-glow"),
      ).toBeInTheDocument();
      expect(
        hint?.querySelector(".gvo-gesture-hint__fingertip-trail-tail"),
      ).toBeInTheDocument();
      expect(
        hint?.querySelector(".gvo-gesture-hint__fingertip-trail-shimmer"),
      ).toBeInTheDocument();
      expect(
        hint?.querySelector("[data-gvo-gesture-trail-origin='calibrated']"),
      ).toBeInTheDocument();
      expect(hint?.querySelector(".gvo-gesture-hint__trail")).not.toBeInTheDocument();
      expect(hint?.querySelector("[data-gvo-gesture-fingertip-cue]"))
        .not.toBeInTheDocument();
      expect(hint?.querySelector("img")).toHaveAttribute(
        "src",
        gestureHintAssets[variant],
      );
    },
  );

  it("mantiene el contenido accesible en reduced motion mediante CSS estático", () => {
    const { container } = render(
      <GestureHint active delayMs={0} variant="tap" targetLabel="Objetivo" />,
    );
    act(() => vi.runOnlyPendingTimers());

    expect(
      container.querySelector("[data-gvo-gesture-state='visible'] img"),
    ).toHaveAttribute("src", gestureHintAssets.tap);
    expect(
      container.querySelector("[data-gvo-gesture-animation='tap-guidance-r2']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-gvo-gesture-fingertip-trail]"),
    ).not.toBeInTheDocument();
  });
});
