import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LoadingInitialScreen } from "./LoadingInitialScreen";
import { loadingInitialAssets } from "./loadingInitialAssets";
import { loadingInitialCopy } from "./loadingInitialCopy";
import {
  loadingInitialSparkleSlots,
  loadingInitialWaterStreams,
} from "./loadingInitialScene";
import {
  REDUCED_MOTION_DURATION_MS,
  TOTAL_DURATION_MS,
  loadingInitialTimeline,
} from "./loadingInitialTimeline";

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

  it("expone duraciones V12 de animacion normal y reduced motion", () => {
    render(<LoadingInitialScreen />);

    const stage = screen.getByTestId(
      "loading-initial-animated-scene",
    ).parentElement;

    expect(TOTAL_DURATION_MS).toBeGreaterThanOrEqual(12000);
    expect(REDUCED_MOTION_DURATION_MS).toBeGreaterThanOrEqual(1000);
    expect(REDUCED_MOTION_DURATION_MS).toBeLessThanOrEqual(1500);
    expect(loadingInitialTimeline.durationMs).toBe(12000);
    expect(stage).toHaveAttribute("data-loading-layout-version", "v12");
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
