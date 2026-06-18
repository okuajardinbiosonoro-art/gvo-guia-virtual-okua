import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import {
  WORLD2_REQUIRED_SLOT_COUNT,
  world2EditorialSlots,
  world2LayerDefinitions,
} from "../../content/world2EditorialSlots";
import { World2RootScreen } from "./World2RootScreen";
import { world2RuntimeAssets } from "./world2RuntimeAssets";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderWorld2RootScreen() {
  return render(
    <MemoryRouter initialEntries={["/estacion/2"]}>
      <World2RootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe("World2RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza Mundo II runtime con assets locales, Lía existente y sin permisos sensibles", () => {
    const { container } = renderWorld2RootScreen();

    expect(
      screen.getByRole("heading", {
        name: "Mundo II: Lía y el pulso invisible",
      }),
    ).toBeInTheDocument();
    expect(Object.keys(world2EditorialSlots)).toHaveLength(
      WORLD2_REQUIRED_SLOT_COUNT,
    );
    expect(
      Object.values(world2EditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-world2-experience]")).toHaveAttribute(
      "data-world2-experience",
      "runtime-base",
    );
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "planta_viva",
    );
    expect(container.querySelector("[data-world2-slot-count]")).toHaveAttribute(
      "data-world2-slot-count",
      "32",
    );
    expect(container.querySelector("[data-sensitive-permissions]"))
      .toHaveAttribute("data-sensitive-permissions", "blocked");
    expect(container.querySelector("[data-qr-camera]")).toHaveAttribute(
      "data-qr-camera",
      "blocked",
    );
    expect(container.querySelector("[data-critical-assets-ready]"))
      .toHaveAttribute("data-critical-assets-ready", "true");
    expect(container.querySelectorAll("img").length).toBeGreaterThan(20);
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelector("[data-lia-source]")).toHaveAttribute(
      "data-lia-source",
      "repo-existing-2-5d",
    );
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.background}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plant}"]`,
      ),
    ).toBeInTheDocument();
  });

  it("inicia con solo capa 1 activa y muestra mensaje suave al tocar una capa bloqueada", () => {
    const { container } = renderWorld2RootScreen();

    expect(container.querySelector('[data-world2-layer="planta_viva"]'))
      .toHaveAttribute("data-layer-state", "active");
    expect(container.querySelector('[data-world2-layer="senal"]'))
      .toHaveAttribute("data-layer-state", "locked");
    expect(
      screen.getByRole("button", {
        name: "Capa 2 de 6. SEÑAL. bloqueado.",
      }),
    ).toHaveAttribute("data-layer-locked", "true");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Capa 3 de 6. CAPTURA. bloqueado.",
      }),
    );

    expect(
      screen.getByText(world2EditorialSlots.W2_LAYER_LOCKED_01.text),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "planta_viva",
    );
  });

  it("avanza por las capas en orden, permite revisión libre y llega a ready_to_continue", () => {
    const { container } = renderWorld2RootScreen();
    const getState = () =>
      container
        .querySelector("[data-world2-state]")
        ?.getAttribute("data-world2-state");

    for (const [index, layer] of world2LayerDefinitions.entries()) {
      expect(getState()).toBe(layer.id);
      expect(
        screen.getByText(world2EditorialSlots[layer.hintSlot].text),
      ).toBeInTheDocument();
      expect(
        screen.getByText(world2EditorialSlots[layer.ambientSlot].text),
      ).toBeInTheDocument();

      fireEvent.click(screen.getByText(world2EditorialSlots[layer.confirmSlot].text));

      if (index < world2LayerDefinitions.length - 1) {
        const nextLayer = world2LayerDefinitions[index + 1];
        expect(
          container.querySelector(`[data-world2-layer="${layer.id}"]`),
        ).toHaveAttribute("data-layer-state", "completed");
        expect(
          container.querySelector(`[data-world2-layer="${nextLayer.id}"]`),
        ).toHaveAttribute("data-layer-state", "active");
      }
    }

    expect(getState()).toBe("ready_to_continue");
    expect(
      screen.getByText(world2EditorialSlots.W2_COMPLETE_LIA_01.text),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Capa 2 de 6. SEÑAL. completado.",
      }),
    );
    expect(
      screen.getByText("TEMP — Puedes revisar cualquier capa del pulso invisible."),
    ).toBeInTheDocument();

    const continueButton = screen.getByRole("button", {
      name: world2EditorialSlots.W2_CONTINUE_BTN_01.text,
    });

    expect(continueButton).toHaveAttribute(
      "data-world2-exit-action",
      "navigate_to_transition",
    );
    fireEvent.click(continueButton);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-2-to-world-3",
    );
  });
});
