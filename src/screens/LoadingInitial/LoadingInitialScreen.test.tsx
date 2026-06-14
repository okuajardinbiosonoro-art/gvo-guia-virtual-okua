import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LoadingInitialScreen } from "./LoadingInitialScreen";
import { loadingInitialAssets } from "./loadingInitialAssets";
import { loadingInitialCopy } from "./loadingInitialCopy";
import {
  loadingInitialSparkleSlots,
  loadingInitialWaterStreams,
} from "./loadingInitialScene";
import { loadingInitialMotionTimeline } from "./loadingInitialMotionTimeline";
import {
  REDUCED_MOTION_DURATION_MS,
  TOTAL_DURATION_MS,
  loadingInitialTimeline,
} from "./loadingInitialTimeline";
import {
  LIA_FRAME_REGISTRATION,
  LIA_FRAME_REGISTRATION_ANCHOR,
  LIA_FRAME_REGISTRATION_VERSION,
} from "./liaFrameRegistration";

describe("LoadingInitialScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza texto principal, subtitulo y barra de carga", () => {
    render(<LoadingInitialScreen />);

    expect(
      screen.getByRole("heading", { name: loadingInitialCopy.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(loadingInitialCopy.subtitle)).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", {
        name: loadingInitialCopy.title,
      }),
    ).toBeInTheDocument();
  });

  it("renderiza escena animada con assets runtime locales", () => {
    const { container } = render(<LoadingInitialScreen />);
    const scene = screen.getByTestId("loading-initial-animated-scene");

    expect(scene).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${loadingInitialAssets.lia.src}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${loadingInitialAssets.plant.src}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${loadingInitialAssets.water.src}"]`,
      ),
    ).toBeInTheDocument();

    for (const asset of [
      loadingInitialAssets.lia.src,
      loadingInitialAssets.plant.src,
      loadingInitialAssets.water.src,
      ...loadingInitialAssets.sparkles.map((sparkle) => sparkle.src),
      loadingInitialAssets.ground.src,
    ]) {
      expect(asset).toMatch(/^\/assets\/runtime\/loading-initial\//);
      expect(asset).not.toMatch(/^https?:\/\//);
    }
  });

  it("expone duraciones V13 de animacion normal y reduced motion", () => {
    render(<LoadingInitialScreen />);

    const stage = screen.getByTestId(
      "loading-initial-animated-scene",
    ).parentElement;

    expect(TOTAL_DURATION_MS).toBeGreaterThanOrEqual(12000);
    expect(REDUCED_MOTION_DURATION_MS).toBeGreaterThanOrEqual(1000);
    expect(REDUCED_MOTION_DURATION_MS).toBeLessThanOrEqual(1500);
    expect(loadingInitialTimeline.durationMs).toBe(12000);
    expect(stage).toHaveAttribute("data-loading-layout-version", "v13");
    expect(stage).toHaveAttribute("data-motion-timeline-version", "v13");
    expect(stage).toHaveAttribute("data-duration-ms", "12000");
    expect(stage).toHaveAttribute("data-reduced-motion-duration-ms", "1300");
  });

  it("renderiza entrada lateral, streams de agua y sparkles determinísticos", () => {
    const { container } = render(<LoadingInitialScreen />);

    expect(screen.getByTestId("loading-initial-lia-track")).toHaveAttribute(
      "data-entry-state",
      "lateral-offscreen-to-plant",
    );
    expect(
      container.querySelector(".loading-initial__lia-pose"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".loading-initial__lia-registration"),
    ).toHaveAttribute(
      "data-lia-frame-registration",
      LIA_FRAME_REGISTRATION_VERSION,
    );
    expect(
      container.querySelector(".loading-initial__lia-registration"),
    ).toHaveAttribute(
      "data-lia-frame-registration-anchor",
      LIA_FRAME_REGISTRATION_ANCHOR,
    );
    expect(
      container.querySelector(".loading-initial__lia-registration"),
    ).toHaveAttribute(
      "data-lia-frame-count",
      LIA_FRAME_REGISTRATION.length.toString(),
    );
    expect(screen.getByTestId("loading-initial-water-field")).toHaveAttribute(
      "data-water-anchor",
      "lia-nozzle",
    );
    expect(screen.getByTestId("loading-initial-water-field")).toHaveAttribute(
      "data-water-target",
      "plant",
    );
    expect(container.querySelectorAll("[data-water-stream]")).toHaveLength(
      loadingInitialWaterStreams.length,
    );
    expect(loadingInitialWaterStreams).toHaveLength(3);
    for (const stream of loadingInitialWaterStreams) {
      expect(stream.offsetX).toMatch(/px$/);
      expect(stream.offsetY).toMatch(/px$/);
      expect(stream.cycleDurationMs).toBeGreaterThanOrEqual(1200);
    }
    expect(container.querySelectorAll("[data-sparkle-slot]")).toHaveLength(
      loadingInitialSparkleSlots.length,
    );
    expect(loadingInitialSparkleSlots).toHaveLength(10);
    expect(
      new Set(loadingInitialSparkleSlots.map((slot) => slot.assetIndex)).size,
    ).toBe(4);
  });

  it("no renderiza texto largo rechazado ni controles fuera de alcance", () => {
    const { container } = render(<LoadingInitialScreen />);
    const rejectedCopyParts = ["Lía cuida", "planta joven", "mientras se"];

    expect(
      screen.queryByText((content) =>
        rejectedCopyParts.every((part) => content.includes(part)),
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      loadingInitialCopy.title,
    );
    expect(screen.getByRole("progressbar").textContent).toBe("");
    expect(container.querySelector("button")).not.toBeInTheDocument();
    expect(container.querySelector("audio")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
  });

  it("renderiza barra pixelart separada en track, fill y marker sin texto numerico", () => {
    const { container } = render(<LoadingInitialScreen />);
    const progress = screen.getByRole("progressbar");

    expect(progress).toHaveAttribute("data-gvo-progress-bar", "loading-initial");
    expect(
      container.querySelector(".loading-initial__progress-track"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".loading-initial__progress-fill"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".loading-initial__progress-marker"),
    ).toBeInTheDocument();
    expect(progress).not.toHaveTextContent(/[\d%]/);
    expect(progress.textContent).toBe("");
  });

  it("expone metadata V13 de frame registration y timeline dirigido", () => {
    expect(LIA_FRAME_REGISTRATION).toHaveLength(16);
    expect(LIA_FRAME_REGISTRATION[0]).toMatchObject({
      frame: 1,
      phase: "idle",
    });
    expect(LIA_FRAME_REGISTRATION[15]).toMatchObject({
      frame: 16,
      phase: "observe",
    });
    for (const frame of LIA_FRAME_REGISTRATION) {
      expect(Math.abs(frame.xPx)).toBeLessThanOrEqual(2);
      expect(Math.abs(frame.yPx)).toBeLessThanOrEqual(1);
      expect(frame.scale).toBeGreaterThanOrEqual(0.998);
      expect(frame.scale).toBeLessThanOrEqual(1.002);
      expect(Math.abs(frame.rotateDeg)).toBeLessThanOrEqual(0.28);
    }
    expect(loadingInitialMotionTimeline.version).toBe("v13");
    expect(loadingInitialMotionTimeline.totalDurationMs).toBe(12000);
    expect(loadingInitialMotionTimeline.reducedMotionDurationMs).toBe(1300);
    expect(
      loadingInitialMotionTimeline.phases.map((phase) => phase.id),
    ).toEqual([
      "initial_enter",
      "lia_entry_idle",
      "lia_settle_hold",
      "lia_prepare_watering",
      "lia_watering",
      "observe_settle",
      "final_hold",
    ]);
    for (const pulse of loadingInitialMotionTimeline.waterPulses) {
      expect(pulse.waterStartMs).toBeGreaterThan(pulse.gestureStartMs);
      expect(pulse.plantSettlesAfterMs).toBeGreaterThan(pulse.waterEndMs);
    }
  });

  it("conecta aria-labelledby y aria-describedby a los textos aprobados", () => {
    render(<LoadingInitialScreen />);

    const main = screen.getByRole("main");
    const title = screen.getByRole("heading", {
      name: loadingInitialCopy.title,
    });
    const subtitle = screen.getByText(loadingInitialCopy.subtitle);

    expect(main).toHaveAttribute("aria-labelledby", title.id);
    expect(main).toHaveAttribute("aria-describedby", subtitle.id);
    expect(subtitle).toHaveAttribute("id", "loading-initial-description");
  });
});
