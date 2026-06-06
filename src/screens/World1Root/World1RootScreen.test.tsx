import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { World1RootScreen } from "./World1RootScreen";
import { world1RootAssets } from "./world1RootAssets";

describe("World1RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza la base estatica de Mundo I con textos DOM y assets reales", () => {
    const { container } = render(<World1RootScreen />);

    expect(
      screen.getByRole("heading", {
        name: "Antes de escuchar, necesitamos aprender a mirar.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("RELACIÓN")).toBeInTheDocument();
    expect(screen.getByText("PERCEPCIÓN")).toBeInTheDocument();
    expect(screen.getByText("MEDIACIÓN")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continuar" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("img", { name: "Lía, guía visual de OKÚA" }),
    ).toHaveAttribute("src", world1RootAssets.liaIdle);

    for (const asset of Object.values(world1RootAssets)) {
      expect(asset).toMatch(/^\/assets\/gvo\/stations\/world-1-root\//);
      expect(asset).not.toMatch(/^https?:\/\//);
    }

    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.background}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.ambientLight}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.plant}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.rootsBase}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(
        `[data-runtime-asset="${world1RootAssets.nodeKit}"]`,
      ),
    ).toHaveLength(3);
  });

  it("no renderiza assets fuera de fase, controles interactivos ni medios runtime", () => {
    const { container } = render(<World1RootScreen />);

    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeMediation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.exitPath}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaGuideMediation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaReadyContinue}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaTeleportOut}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
  });

  it("mantiene el boton Continuar sin navegacion ni handler", () => {
    render(<World1RootScreen />);

    const button = screen.getByRole("button", { name: "Continuar" });

    expect(button).toBeDisabled();
    expect((button as HTMLButtonElement).onclick).toBeNull();
  });

  it("activa RELACIÓN y deja PERCEPCIÓN disponible sin habilitar MEDIACIÓN", () => {
    const { container } = render(<World1RootScreen />);

    const relation = screen.getByRole("button", {
      name: "Explorar RELACIÓN",
    });
    const perception = screen.getByRole("button", {
      name: "PERCEPCIÓN bloqueada en esta fase",
    });
    const mediation = screen.getByRole("button", {
      name: "MEDIACIÓN bloqueada en esta fase",
    });

    expect(relation).toHaveAttribute("data-node-state", "available");
    expect(relation).toHaveAttribute("aria-pressed", "false");
    expect(perception).toBeDisabled();
    expect(mediation).toBeDisabled();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(relation);

    expect(relation).toHaveAttribute("data-node-state", "active");
    expect(relation).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("data-node-state", "available");
    expect(mediation).toBeDisabled();
    expect(mediation).toHaveAttribute("data-node-state", "locked");
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-world1-active-roots-calibration="manual-calibration"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaPointRelation}"]`,
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("RELACIÓN").length).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByText(
        "La planta no está aislada: vive en relación con la tierra, la luz, el agua y quienes se acercan a cuidarla.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continuar" }),
    ).toBeDisabled();
  });

  it("activa PERCEPCIÓN despues de RELACIÓN y deja MEDIACIÓN disponible", () => {
    const { container } = render(<World1RootScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }));

    expect(screen.getByTestId("world1-root-stage")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explorar RELACIÓN" })).toHaveAttribute(
      "data-node-state",
      "completed",
    );
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("data-node-state", "active");
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).toHaveAttribute("data-node-state", "available");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).not.toBeDisabled();

    expect(
      screen.getByText(
        "Una planta puede parecer quieta, pero eso no significa que esté inactiva.",
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-root-active="perception"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeMediation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaLookPerception}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="look_perception"]'),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  it("activa MEDIACIÓN solo después de PERCEPCIÓN con raíz, Lía y copy propios", () => {
    const { container } = render(<World1RootScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }));
    fireEvent.click(screen.getByRole("button", { name: "Explorar MEDIACIÓN" }));

    expect(screen.getByRole("button", { name: "Explorar RELACIÓN" })).toHaveAttribute(
      "data-node-state",
      "completed",
    );
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).toHaveAttribute("data-node-state", "active");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(
        "Mediar no es inventar: es construir una forma cuidadosa de acercarnos a una señal viva.",
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeMediation}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-root-active="mediation"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaGuideMediation}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="guide_mediation"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.exitPath}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaTeleportOut}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  it("cierra MEDIACIÓN en ready_to_continue sin navegar", () => {
    const { container } = render(<World1RootScreen />);
    const initialLocation = window.location.href;

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }));
    fireEvent.click(screen.getByRole("button", { name: "Explorar MEDIACIÓN" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar raíz" }));

    expect(screen.getByTestId("world1-root-stage")).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-root-state="ready_to_continue"]'),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explorar RELACIÓN" })).toHaveAttribute(
      "data-node-state",
      "completed",
    );
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(screen.getByText("LISTO PARA CONTINUAR")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ya recorriste las tres raíces de esta pregunta: relación, percepción y mediación.",
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.exitPath}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-exit-path="ready_to_continue"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaReadyContinue}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="ready_continue"]'),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-world1-root-active]")).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaExit}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaTeleportOut}"]`,
      ),
    ).not.toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: "Continuar" });
    expect(continueButton).not.toBeDisabled();
    expect(continueButton).toHaveAttribute("aria-disabled", "false");

    fireEvent.click(continueButton);

    expect(window.location.href).toBe(initialLocation);
    expect(
      screen.getByText("La salida se activará en una fase posterior."),
    ).toBeInTheDocument();
  });

  it("PERCEPCIÓN no se activa desde intro y MEDIACIÓN no se activa antes de PERCEPCIÓN", () => {
    const { container } = render(<World1RootScreen />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "PERCEPCIÓN bloqueada en esta fase",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "MEDIACIÓN bloqueada en esta fase",
      }),
    );

    expect(
      screen.getByText("Antes de escuchar, necesitamos aprender a mirar."),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-world1-root-active]")).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="point_relation"]'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: "MEDIACIÓN bloqueada en esta fase",
      }),
    );

    expect(screen.getAllByText("RELACIÓN").length).toBeGreaterThanOrEqual(2);
    expect(
      container.querySelector('[data-world1-root-active="mediation"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="guide_mediation"]'),
    ).not.toBeInTheDocument();
  });

  it("no muestra controles ni guias de calibracion en runtime", () => {
    render(<World1RootScreen />);

    expect(screen.queryByText("Calibración Mundo I")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Calibrador Mundo I — solo desarrollo"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("plantX")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("rootOriginX")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("activeRelationX")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("liaPointRelationX")).not.toBeInTheDocument();
    expect(screen.queryByText(/--world1-root-origin-x/)).not.toBeInTheDocument();
  });
});
