import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import transitionRootAssetManifestRaw from "../../assets/transition-world/root/asset-manifest.transition-root.json?raw";
import { TransitionWorld } from "./TransitionWorld";
import {
  introToStationOneTransition,
  TRANSITION_WORLD_VERSION,
} from "./transitionWorld.config";

describe("TransitionWorld", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza la base visual estatica para Mundo I", () => {
    const { container } = render(<TransitionWorld />);

    expect(
      screen.getByRole("heading", { name: "Abriendo Mundo I: Raíz..." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Preparando recorrido...")).toBeInTheDocument();
    expect(screen.getByTestId("transition-world-portal")).toBeInTheDocument();
    expect(
      screen.getByTestId("transition-world-lia-fallback"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", {
        name: "Abriendo Mundo I: Raíz. Preparando recorrido.",
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
  });

  it("expone configuracion tecnica T003D sin rutas funcionales nuevas", () => {
    expect(introToStationOneTransition.id).toBe("intro-to-station-1");
    expect(introToStationOneTransition.durationMs).toBe(2300);
    expect(introToStationOneTransition.reducedMotionDurationMs).toBe(1000);
    expect(introToStationOneTransition.fromRoute).toBe("/portada");
    expect(introToStationOneTransition.toRoute).toBe("/mundo-i-raiz");
  });

  it("no renderiza botones, enlaces, copy tecnico, audio ni video", () => {
    const { container } = render(<TransitionWorld />);

    expect(container.querySelector("button")).not.toBeInTheDocument();
    expect(container.querySelector("a")).not.toBeInTheDocument();
    expect(screen.queryByText(/Cargando assets/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Inicializando/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sincronizando/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Fetching/i)).not.toBeInTheDocument();
    expect(container.querySelector("audio")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
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
      "data-reduced-motion",
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
