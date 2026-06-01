import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

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

  it("expone configuracion tecnica T003B sin rutas funcionales nuevas", () => {
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
});
