import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { finalRootAssets } from "../../shared/assets/finalRootAssets";
import {
  FINAL_LIA_GREETING_TOTAL_MS,
  FINAL_LIA_IDLE_CYCLE_MS,
  FinalLiaMotion,
} from "./FinalLiaMotion";

type ReducedMotionController = {
  listenerCount: () => number;
  set: (matches: boolean) => void;
};

function installReducedMotion(matches: boolean): ReducedMotionController {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQuery = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn(
      (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
    ),
    removeEventListener: vi.fn(
      (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
    ),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => mediaQuery),
    writable: true,
  });

  return {
    listenerCount: () => listeners.size,
    set(nextMatches) {
      mediaQuery.matches = nextMatches;
      act(() => {
        for (const listener of listeners) {
          listener({ matches: nextMatches } as MediaQueryListEvent);
        }
      });
    },
  };
}

function setDocumentHidden(hidden: boolean) {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: hidden,
  });
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: hidden ? "hidden" : "visible",
  });
  act(() => document.dispatchEvent(new Event("visibilitychange")));
}

function advance(ms: number) {
  act(() => vi.advanceTimersByTime(ms));
}

function completeGreeting() {
  for (let frame = 0; frame < 4; frame += 1) advance(160);
}

function motionRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-lia-motion-phase]")!;
}

describe("FinalLiaMotion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setDocumentHidden(false);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    Reflect.deleteProperty(window, "matchMedia");
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });

  it("reproduce greeting F1–F4 a 160 ms y entra a idle F1 a 640 ms", () => {
    installReducedMotion(false);
    const { container } = render(<FinalLiaMotion />);
    const root = motionRoot(container);

    expect(root).toHaveAttribute("data-lia-motion-phase", "greeting");
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
    expect(root).toHaveAttribute("data-lia-frame-duration-ms", "160");
    expect(root).toHaveAttribute("data-lia-greeting-play-count", "1");
    expect(vi.getTimerCount()).toBe(1);

    for (const frame of [2, 3, 4]) {
      advance(159);
      expect(root).toHaveAttribute("data-lia-motion-frame", String(frame - 1));
      advance(1);
      expect(root).toHaveAttribute("data-lia-motion-frame", String(frame));
    }

    advance(159);
    expect(root).toHaveAttribute("data-lia-motion-phase", "greeting");
    advance(1);
    expect(root).toHaveAttribute("data-lia-motion-phase", "idle");
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
    expect(root).toHaveAttribute("data-lia-frame-duration-ms", "4200");
    expect(FINAL_LIA_GREETING_TOTAL_MS).toBe(640);
  });

  it("respeta el ciclo idle 4200/180/160/160/180/320 y F6 vuelve a F1", () => {
    installReducedMotion(false);
    const { container } = render(<FinalLiaMotion />);
    const root = motionRoot(container);
    completeGreeting();

    const durations = [4200, 180, 160, 160, 180, 320];
    for (let frame = 1; frame <= durations.length; frame += 1) {
      expect(root).toHaveAttribute("data-lia-motion-phase", "idle");
      expect(root).toHaveAttribute("data-lia-motion-frame", String(frame));
      expect(root).toHaveAttribute(
        "data-lia-frame-duration-ms",
        String(durations[frame - 1]),
      );
      advance(durations[frame - 1] - 1);
      expect(root).toHaveAttribute("data-lia-motion-frame", String(frame));
      advance(1);
    }

    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
    expect(FINAL_LIA_IDLE_CYCLE_MS).toBe(5200);
    expect(vi.getTimerCount()).toBe(1);
  });

  it("omite greeting e idle cuando reduce está activo desde el montaje", () => {
    installReducedMotion(true);
    const { container } = render(<FinalLiaMotion />);
    const root = motionRoot(container);

    expect(root).toHaveAttribute("data-lia-motion-phase", "reduced_static");
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
    expect(root).toHaveAttribute("data-lia-reduced-motion", "true");
    expect(root).toHaveAttribute("data-lia-active-timers", "0");
    expect(root).toHaveAttribute("data-lia-greeting-play-count", "0");
    expect(root).toHaveAttribute(
      "data-lia-motion-source",
      finalRootAssets.lia.idleContemplative6f,
    );
    expect(vi.getTimerCount()).toBe(0);
    advance(20_000);
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
  });

  it("cancela timers al cambiar a reduce y vuelve a idle F1 sin repetir greeting", () => {
    const reducedMotion = installReducedMotion(false);
    const { container } = render(<FinalLiaMotion />);
    const root = motionRoot(container);
    advance(160);
    expect(root).toHaveAttribute("data-lia-motion-frame", "2");

    reducedMotion.set(true);
    expect(root).toHaveAttribute("data-lia-motion-phase", "reduced_static");
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
    expect(vi.getTimerCount()).toBe(0);

    reducedMotion.set(false);
    expect(root).toHaveAttribute("data-lia-motion-phase", "idle");
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
    expect(root).toHaveAttribute("data-lia-greeting-play-count", "1");
    expect(vi.getTimerCount()).toBe(1);
  });

  it("pausa hidden, vuelve a idle F1 sin catch-up y limpia timers/listeners", () => {
    const reducedMotion = installReducedMotion(false);
    const rendered = render(<FinalLiaMotion />);
    const root = motionRoot(rendered.container);
    completeGreeting();
    advance(4200);
    advance(180);
    expect(root).toHaveAttribute("data-lia-motion-frame", "3");

    setDocumentHidden(true);
    expect(root).toHaveAttribute("data-lia-motion-phase", "hidden_paused");
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
    expect(vi.getTimerCount()).toBe(0);
    advance(20_000);
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");

    setDocumentHidden(false);
    expect(root).toHaveAttribute("data-lia-motion-phase", "idle");
    expect(root).toHaveAttribute("data-lia-motion-frame", "1");
    expect(root).toHaveAttribute("data-lia-greeting-play-count", "1");
    expect(vi.getTimerCount()).toBe(1);
    expect(reducedMotion.listenerCount()).toBe(1);

    rendered.unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(reducedMotion.listenerCount()).toBe(0);
  });

  it("consume greeting, idle y glow canónicos sin canvas ni control interactivo", () => {
    installReducedMotion(false);
    const { container } = render(<FinalLiaMotion />);
    const root = motionRoot(container);
    const runtimeAssets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-runtime-asset]"),
      (element) => element.dataset.runtimeAsset,
    );

    expect(runtimeAssets).toEqual([
      finalRootAssets.lia.glowShadow,
      finalRootAssets.lia.greeting4f,
      finalRootAssets.lia.idleContemplative6f,
    ]);
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveAttribute(
      "data-lia-layout-contract",
      "static_021l_locked",
    );
    expect(container.querySelectorAll("canvas,video,audio")).toHaveLength(0);
    expect(container.querySelectorAll("button,a")).toHaveLength(0);
    expect(container.querySelector("[data-lia-glow-behavior]")).toHaveAttribute(
      "data-lia-glow-behavior",
      "static",
    );
  });
});
