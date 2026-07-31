import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import transitionRootAssetManifestRaw from "../../assets/transition-world/root/asset-manifest.transition-root.json?raw";
import routerSourceRaw from "../../app/router.tsx?raw";
import { TransitionWorld } from "./TransitionWorld";
import {
  introToStationOneTransition,
  TRANSITION_WORLD_VERSION,
  worldFourToWorldFiveTransition,
  worldFiveToFinalTransition,
  worldOneToWorldTwoTransition,
  worldThreeToWorldFourTransition,
  worldTwoToWorldThreeTransition,
} from "./transitionWorld.config";

describe("TransitionWorld", () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    cleanup();
  });

  it("renderiza la base visual estatica para Mundo I", () => {
    const { container } = render(<TransitionWorld />);

    expect(
      screen.getByRole("heading", { name: "Abriendo Mundo I" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Preparando la raíz.")).toBeInTheDocument();
    expect(
      screen.getByTestId("transition-world-background-real"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("transition-world-sparkles")).toHaveAttribute(
      "data-sparkle-reference",
      "loading-initial-runtime-assets-and-css",
    );
    expect(screen.getByTestId("transition-world-sparkles")).toHaveAttribute(
      "data-sparkle-layer",
      "ambient-background",
    );
    expect(screen.getAllByTestId("transition-world-sparkle")).toHaveLength(8);
    expect(screen.getByTestId("transition-world-fade")).toHaveAttribute(
      "data-motion-layer",
      "final-fade",
    );
    expect(screen.getByTestId("transition-world-fade")).toHaveAttribute(
      "data-motion-effect",
      "portal-centered-flash",
    );
    expect(screen.getByTestId("transition-world-portal")).toBeInTheDocument();
    expect(screen.getByTestId("transition-world-portal")).toHaveAttribute(
      "data-motion-sequence",
      "inactive-activating-open",
    );
    expect(
      screen.getByTestId("transition-world-portal-inactive"),
    ).toHaveAttribute("data-asset-id", "portal_root_inactive");
    expect(
      screen.getByTestId("transition-world-portal-activating"),
    ).toHaveAttribute("data-asset-id", "portal_root_activating");
    expect(
      screen.getByTestId("transition-world-portal-real"),
    ).toHaveAttribute("data-asset-id", "portal_root_open");
    expect(
      screen.getByTestId("transition-world-lia-sprite"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("transition-world-lia-sprite")).toHaveAttribute(
      "data-lia-motion",
      "idle-guide-exit",
    );
    expect(screen.getByTestId("transition-world-lia-sprite")).toHaveAttribute(
      "data-lia-placement",
      "left-of-portal",
    );
    expect(screen.getByTestId("transition-world-lia-sprite")).toHaveAttribute(
      "data-lia-sprite-mode",
      "cropped-background",
    );
    expect(screen.getByTestId("transition-world-lia-real")).toHaveAttribute(
      "data-asset-id",
      "lia_transition_root_idle_4f",
    );
    expect(screen.getByTestId("transition-world-lia-real")).toHaveAttribute(
      "data-frame-count",
      "4",
    );
    expect(screen.getByTestId("transition-world-lia-real")).toHaveAttribute(
      "data-frame-size",
      "256x256",
    );
    expect(screen.getByTestId("transition-world-lia-guide")).toHaveAttribute(
      "data-asset-id",
      "lia_transition_root_guide_2f",
    );
    expect(screen.getByTestId("transition-world-lia-guide")).toHaveAttribute(
      "data-frame-count",
      "2",
    );
    expect(screen.getByTestId("transition-world-lia-exit")).toHaveAttribute(
      "data-asset-id",
      "lia_transition_root_exit_1f",
    );
    expect(screen.getByTestId("transition-world-lia-exit")).toHaveAttribute(
      "data-frame-count",
      "1",
    );
    expect(
      screen.getByTestId("transition-world-progress-real"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("transition-world-progress-track")).toHaveAttribute(
      "data-asset-id",
      "transition_root_progress_track_base",
    );
    expect(screen.getByTestId("transition-world-progress-fill")).toHaveAttribute(
      "data-asset-id",
      "transition_root_progress_fill_segment",
    );
    expect(screen.getByTestId("transition-world-progress-spark")).toHaveAttribute(
      "data-asset-id",
      "transition_root_progress_spark",
    );
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-gvo-progress-bar",
      "transition-world",
    );
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-progress-spark-alignment",
      "channel-centered",
    );
    expect(
      screen.getByRole("status", {
        name: "Abriendo Mundo I Preparando la raíz.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(container.querySelector("main")).toHaveAttribute(
      "data-transition-world-version",
      TRANSITION_WORLD_VERSION,
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-transition-world-id",
      "intro-to-station-1",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-motion-mode",
      "css-timeline",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-motion-state",
      "preview-sequence",
    );
  });

  it("expone configuracion tecnica de la ruta intro-to-station-1", () => {
    expect(introToStationOneTransition.id).toBe("intro-to-station-1");
    expect(introToStationOneTransition.durationMs).toBe(2300);
    expect(introToStationOneTransition.reducedMotionDurationMs).toBe(1000);
    expect(introToStationOneTransition.fromRoute).toBe("/portada");
    expect(introToStationOneTransition.toRoute).toBe("/estacion/1");
    expect(introToStationOneTransition.targetPreload).toBe("world1RootInitial");
    expect(introToStationOneTransition.titleSlotId).toBe(
      "TRANS_COVER_W1_TITLE_01",
    );
    expect(introToStationOneTransition.subtitleSlotId).toBe(
      "TRANS_COVER_W1_SUB_01",
    );
    expect(introToStationOneTransition.editorialCopyStatus).toBe("final");
  });

  it("expone configuracion final de la transicion Mundo I a Mundo II", () => {
    const { container } = render(
      <TransitionWorld config={worldOneToWorldTwoTransition} />,
    );

    expect(worldOneToWorldTwoTransition.id).toBe("world-1-to-world-2");
    expect(worldOneToWorldTwoTransition.fromRoute).toBe("/estacion/1");
    expect(worldOneToWorldTwoTransition.toRoute).toBe("/estacion/2");
    expect(worldOneToWorldTwoTransition.targetPreload).toBe("none");
    expect(worldOneToWorldTwoTransition.titleSlotId).toBe(
      "TRANS_W1_W2_TITLE_01",
    );
    expect(worldOneToWorldTwoTransition.subtitleSlotId).toBe(
      "TRANS_W1_W2_SUB_01",
    );
    expect(worldOneToWorldTwoTransition.editorialCopyStatus).toBe("final");
    expect(
      screen.getByRole("heading", { name: "Abriendo Mundo II" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Preparando el pulso invisible.")).toBeInTheDocument();
    expect(container.querySelector("[data-title-slot]")).toHaveAttribute(
      "data-title-slot",
      "TRANS_W1_W2_TITLE_01",
    );
    expect(container.querySelector("[data-subtitle-slot]")).toHaveAttribute(
      "data-subtitle-slot",
      "TRANS_W1_W2_SUB_01",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-transition-world-id",
      "world-1-to-world-2",
    );
  });

  it("R1 expone copy breve y arquitectura pasiva de Mundo II a Mundo III", () => {
    const { container } = render(
      <TransitionWorld config={worldTwoToWorldThreeTransition} />,
    );

    expect(worldTwoToWorldThreeTransition.id).toBe("world-2-to-world-3");
    expect(worldTwoToWorldThreeTransition.fromRoute).toBe("/estacion/2");
    expect(worldTwoToWorldThreeTransition.toRoute).toBe("/estacion/3");
    expect(worldTwoToWorldThreeTransition.targetPreload).toBe("none");
    expect(worldTwoToWorldThreeTransition.titleSlotId).toBe(
      "TRANS_W2_W3_TITLE_01",
    );
    expect(worldTwoToWorldThreeTransition.subtitleSlotId).toBe(
      "TRANS_W2_W3_SUB_01",
    );
    expect(worldTwoToWorldThreeTransition.editorialCopyStatus).toBe("final");
    expect(
      screen.getByRole("heading", { name: "Abriendo Mundo III" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Preparando el cuaderno de pruebas."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", {
        name: "Abriendo Mundo III Preparando el cuaderno de pruebas.",
      }),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-title-slot]")).toHaveAttribute(
      "data-title-slot",
      "TRANS_W2_W3_TITLE_01",
    );
    expect(container.querySelector("[data-subtitle-slot]")).toHaveAttribute(
      "data-subtitle-slot",
      "TRANS_W2_W3_SUB_01",
    );
    expect(container.querySelector("[data-editorial-copy]")).toHaveAttribute(
      "data-editorial-copy",
      "final",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-transition-world-id",
      "world-2-to-world-3",
    );
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-gvo-progress-bar",
      "transition-world",
    );
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-progress-motion",
      "fill-and-spark",
    );
    expect(
      screen.getByTestId("transition-world-progress").getAttribute("style"),
    ).toContain("--transition-progress-duration: 2300ms");
    expect(container.querySelector("button")).not.toBeInTheDocument();
    expect(container.querySelector("a")).not.toBeInTheDocument();
    expect(container.querySelector('[role="button"]')).not.toBeInTheDocument();
    expect(container.querySelector('[role="link"]')).not.toBeInTheDocument();
    expect(container.querySelector("[data-hotspot]")).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-transition-cta]"),
    ).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/TEMP/i);
    expect(container).not.toHaveTextContent("La señal deja una huella");
    expect(container).not.toHaveTextContent(
      "Ya descubrimos cómo el pulso puede ser leído y mediado.",
    );
    expect(container).not.toHaveTextContent("Entrar al Mundo III");
    expect(routerSourceRaw).toMatch(
      /navigate\(config\.toRoute,\s*\{\s*replace:\s*true\s*\}\)/,
    );
  });

  it("expone configuracion final de la transicion Mundo III a Mundo IV", () => {
    const { container } = render(
      <TransitionWorld config={worldThreeToWorldFourTransition} />,
    );

    expect(worldThreeToWorldFourTransition.id).toBe("world-3-to-world-4");
    expect(worldThreeToWorldFourTransition.fromRoute).toBe("/estacion/3");
    expect(worldThreeToWorldFourTransition.toRoute).toBe("/estacion/4");
    expect(worldThreeToWorldFourTransition.targetPreload).toBe("none");
    expect(worldThreeToWorldFourTransition.titleSlotId).toBe(
      "TRANS_W3_W4_TITLE_01",
    );
    expect(worldThreeToWorldFourTransition.subtitleSlotId).toBe(
      "TRANS_W3_W4_SUB_01",
    );
    expect(worldThreeToWorldFourTransition.editorialCopyStatus).toBe("final");
    expect(
      screen.getByRole("heading", {
        name: "Abriendo Mundo IV",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Preparando la mesa de sistema."),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-title-slot]")).toHaveAttribute(
      "data-title-slot",
      "TRANS_W3_W4_TITLE_01",
    );
    expect(container.querySelector("[data-subtitle-slot]")).toHaveAttribute(
      "data-subtitle-slot",
      "TRANS_W3_W4_SUB_01",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-transition-world-id",
      "world-3-to-world-4",
    );
  });

  it("expone configuracion final de la transicion Mundo IV a Mundo V", () => {
    const { container } = render(
      <TransitionWorld config={worldFourToWorldFiveTransition} />,
    );

    expect(worldFourToWorldFiveTransition.id).toBe("world-4-to-world-5");
    expect(worldFourToWorldFiveTransition.fromRoute).toBe("/estacion/4");
    expect(worldFourToWorldFiveTransition.toRoute).toBe("/estacion/5");
    expect(worldFourToWorldFiveTransition.targetPreload).toBe("none");
    expect(worldFourToWorldFiveTransition.titleSlotId).toBe(
      "TRANS_W4_W5_TITLE_01",
    );
    expect(worldFourToWorldFiveTransition.subtitleSlotId).toBe(
      "TRANS_W4_W5_SUB_01",
    );
    expect(worldFourToWorldFiveTransition.editorialCopyStatus).toBe("final");
    expect(
      screen.getByRole("heading", {
        name: "Abriendo Mundo V",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Preparando el mapa del presente."),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-title-slot]")).toHaveAttribute(
      "data-title-slot",
      "TRANS_W4_W5_TITLE_01",
    );
    expect(container.querySelector("[data-subtitle-slot]")).toHaveAttribute(
      "data-subtitle-slot",
      "TRANS_W4_W5_SUB_01",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-transition-world-id",
      "world-4-to-world-5",
    );
  });

  it("expone configuracion final de la transicion Mundo V a Pantalla Final", () => {
    const { container } = render(
      <TransitionWorld config={worldFiveToFinalTransition} />,
    );

    expect(worldFiveToFinalTransition.id).toBe("world-5-to-final");
    expect(worldFiveToFinalTransition.fromRoute).toBe("/estacion/5");
    expect(worldFiveToFinalTransition.toRoute).toBe("/final");
    expect(worldFiveToFinalTransition.targetPreload).toBe("none");
    expect(worldFiveToFinalTransition.titleSlotId).toBe(
      "TRANS_W5_FINAL_TITLE_01",
    );
    expect(worldFiveToFinalTransition.subtitleSlotId).toBe(
      "TRANS_W5_FINAL_SUB_01",
    );
    expect(worldFiveToFinalTransition.editorialCopyStatus).toBe("final");
    expect(
      screen.getByRole("heading", {
        name: "Abriendo el Mirador",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Preparando el cierre del recorrido."),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-title-slot]")).toHaveAttribute(
      "data-title-slot",
      "TRANS_W5_FINAL_TITLE_01",
    );
    expect(container.querySelector("[data-subtitle-slot]")).toHaveAttribute(
      "data-subtitle-slot",
      "TRANS_W5_FINAL_SUB_01",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-transition-world-id",
      "world-5-to-final",
    );
  });

  it("preview no ejecuta onComplete aunque termine la duracion", () => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();

    render(<TransitionWorld onComplete={handleComplete} />);

    act(() => {
      vi.advanceTimersByTime(2400);
    });

    expect(handleComplete).not.toHaveBeenCalled();
  });

  it("runtime ejecuta onComplete una sola vez al terminar", () => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();
    const { container } = render(
      <TransitionWorld variant="runtime" onComplete={handleComplete} />,
    );

    expect(container.querySelector("main")).toHaveAttribute(
      "data-motion-state",
      "runtime-sequence",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-navigation-locked",
      "true",
    );

    act(() => {
      vi.advanceTimersByTime(2300);
      vi.advanceTimersByTime(2300);
    });

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it("R1 autoavanza Mundo II a Mundo III al tiempo exacto sin interaccion", () => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();
    const { container } = render(
      <TransitionWorld
        config={worldTwoToWorldThreeTransition}
        variant="runtime"
        onComplete={handleComplete}
      />,
    );

    expect(container.querySelector("main")).toHaveAttribute(
      "data-navigation-locked",
      "true",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-target-preload",
      "none",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-target-assets-ready",
      "true",
    );
    expect(container.querySelector("button")).not.toBeInTheDocument();
    expect(screen.getByTestId("transition-world-progress")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(worldTwoToWorldThreeTransition.durationMs - 1);
    });
    expect(handleComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(handleComplete).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(worldTwoToWorldThreeTransition.durationMs);
    });
    expect(handleComplete).toHaveBeenCalledTimes(1);
    expect(worldTwoToWorldThreeTransition.toRoute).toBe("/estacion/3");
  });

  it("R1 limpia el temporizador automatico al desmontar", () => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();
    const { unmount } = render(
      <TransitionWorld
        config={worldTwoToWorldThreeTransition}
        variant="runtime"
        onComplete={handleComplete}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(worldTwoToWorldThreeTransition.durationMs - 1);
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(worldTwoToWorldThreeTransition.durationMs * 2);
    });

    expect(handleComplete).not.toHaveBeenCalled();
  });

  it.each([
    ["Portada a Mundo I", introToStationOneTransition],
    ["Mundo I a Mundo II", worldOneToWorldTwoTransition],
    ["Mundo II a Mundo III", worldTwoToWorldThreeTransition],
    ["Mundo III a Mundo IV", worldThreeToWorldFourTransition],
    ["Mundo IV a Mundo V", worldFourToWorldFiveTransition],
    ["Mundo V a final", worldFiveToFinalTransition],
  ])("%s conserva pasividad, progreso y autoavance", (_label, config) => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();
    const { container } = render(
      <TransitionWorld
        config={config}
        variant="runtime"
        onComplete={handleComplete}
      />,
    );

    expect(container.querySelector("button")).not.toBeInTheDocument();
    expect(container.querySelector("a")).not.toBeInTheDocument();
    expect(screen.getByTestId("transition-world-progress")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(config.durationMs - 1);
    });
    expect(handleComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1 + config.durationMs);
    });
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["Portada a Mundo I", introToStationOneTransition],
    ["Mundo I a Mundo II", worldOneToWorldTwoTransition],
    ["Mundo II a Mundo III", worldTwoToWorldThreeTransition],
    ["Mundo III a Mundo IV", worldThreeToWorldFourTransition],
    ["Mundo IV a Mundo V", worldFourToWorldFiveTransition],
    ["Mundo V a final", worldFiveToFinalTransition],
  ])("%s conserva autoavance con reduced motion", (_label, config) => {
    vi.useFakeTimers();
    const handleComplete = vi.fn();

    render(
      <TransitionWorld
        config={config}
        variant="runtime"
        isReducedMotion
        onComplete={handleComplete}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(handleComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(handleComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(
      screen.getByTestId("transition-world-progress").getAttribute("style"),
    ).toContain("--transition-progress-duration: 1000ms");

    act(() => {
      vi.advanceTimersByTime(config.reducedMotionDurationMs);
    });
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it("no renderiza botones, enlaces, copy tecnico, audio ni video", () => {
    const { container } = render(<TransitionWorld />);

    expect(container.querySelector("button")).not.toBeInTheDocument();
    expect(container.querySelector("a")).not.toBeInTheDocument();
    expect(screen.queryByText(/Cargando assets/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Inicializando/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sincronizando/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Fetching/i)).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/\d/);
    expect(container).not.toHaveTextContent(/%/);
    expect(container.querySelector("audio")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
  });

  it("mantiene los sparkles ambientales decorativos y deterministas", () => {
    render(<TransitionWorld />);

    const sparkleLayer = screen.getByTestId("transition-world-sparkles");
    const sparkleSlots = screen.getAllByTestId("transition-world-sparkle");

    expect(sparkleLayer).toHaveAttribute("aria-hidden", "true");
    expect(sparkleLayer).toHaveAttribute("data-sparkle-count", "8");
    expect(sparkleSlots.map((slot) => slot.getAttribute("data-transition-sparkle-slot"))).toEqual([
      "sparkle-lilac-upper-left",
      "sparkle-amber-upper-right",
      "sparkle-white-upper-air",
      "sparkle-white-middle-left",
      "sparkle-amber-middle-right",
      "sparkle-lilac-lower-left",
      "sparkle-lilac-lower-right",
      "sparkle-lilac-bottom-right",
    ]);
    expect(sparkleSlots.map((slot) => slot.getAttribute("data-asset-id"))).toEqual([
      "sparkle_01_lilac_small",
      "sparkle_02_amber_small",
      "sparkle_04_micro_white",
      "sparkle_04_micro_white",
      "sparkle_02_amber_small",
      "sparkle_03_lilac_medium",
      "sparkle_01_lilac_small",
      "sparkle_03_lilac_medium",
    ]);
    for (const slot of sparkleSlots) {
      expect(slot.tagName).toBe("IMG");
      expect(slot).toHaveAttribute("alt", "");
      expect(slot.getAttribute("data-runtime-asset")).toContain(
        "/assets/runtime/loading-initial/sparkles/",
      );
      expect(slot.getAttribute("data-loading-sparkle-class")).toContain(
        "loading-initial__sparkle--",
      );
    }
  });

  it("usa imagenes reales aprobadas sin incrustar texto en imagen", () => {
    const { container } = render(<TransitionWorld />);

    const backgroundImage = container.querySelector(
      '[data-testid="transition-world-background-real"] img',
    );
    const portalImage = container.querySelector(
      '[data-testid="transition-world-portal-real"] img',
    );
    const liaFrame = container.querySelector(
      '[data-testid="transition-world-lia-real"]',
    );
    const progressImage = container.querySelector(
      '[data-testid="transition-world-progress-track"] img',
    );

    expect(backgroundImage?.getAttribute("src")).toContain(
      "transition_root_background_v1",
    );
    expect(portalImage?.getAttribute("src")).toContain("portal_root_open_v1");
    expect(liaFrame?.getAttribute("style")).toContain(
      "lia_transition_root_idle_4f_v1",
    );
    expect(progressImage?.getAttribute("src")).toContain(
      "transition_root_progress_track_base_v1",
    );
    expect(
      screen.getByRole("heading", { name: "Abriendo Mundo I" }),
    ).toBeInTheDocument();
  });

  it("mantiene reduced motion simple y con duracion de 1000ms", () => {
    const { container } = render(<TransitionWorld isReducedMotion />);

    expect(container.querySelector("main")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(container.querySelector("main")).toHaveAttribute(
      "data-reduced-motion-duration-ms",
      "1000",
    );
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-progress-motion",
      "fill-and-spark",
    );
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-progress-spark-alignment",
      "channel-centered",
    );
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-progress-preview",
      "motion",
    );
    expect(screen.getByTestId("transition-world-progress")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(screen.getByTestId("transition-world-sparkles")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("mantiene manifest de assets aprobados de transicion raiz", () => {
    const manifest = JSON.parse(transitionRootAssetManifestRaw) as {
      assets: Array<{
        id: string;
        status: string;
        runtimeReady: boolean;
        png: string;
        webp: string;
      }>;
      allowedStatuses: string[];
      transition: { id: string; durationMs: number; reducedMotionDurationMs: number };
    };
    const assetIds = manifest.assets.map((asset) => asset.id);

    expect(manifest.transition.id).toBe("intro-to-station-1");
    expect(manifest.transition.durationMs).toBe(2300);
    expect(manifest.transition.reducedMotionDurationMs).toBe(1000);
    expect(assetIds).toEqual(
      expect.arrayContaining([
        "lia_transition_root_idle_4f",
        "lia_transition_root_guide_2f",
        "lia_transition_root_exit_1f",
        "portal_root_base",
        "portal_root_states_3f",
        "portal_root_inactive",
        "portal_root_activating",
        "portal_root_open",
        "symbol_root",
        "transition_root_background",
        "transition_root_progress_track_base",
        "transition_root_progress_fill_segment",
      ]),
    );
    for (const asset of manifest.assets) {
      expect(manifest.allowedStatuses).toContain(asset.status);
      expect(asset.status).toBe("approved");
      expect(asset.runtimeReady).toBe(true);
      expect(asset.png).toMatch(/^runtime\//);
      expect(asset.webp).toMatch(/^runtime\//);
    }
  });
});
