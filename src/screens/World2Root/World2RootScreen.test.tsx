import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import {
  WORLD2_REQUIRED_SLOT_COUNT,
  world2EditorialSlots,
  world2LayerDefinitions,
} from "../../content/world2EditorialSlots";
import { World2RootScreen } from "./World2RootScreen";

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

  it("renderiza Mundo II temporal con los 32 slots editoriales y sin permisos sensibles", () => {
    const { container } = renderWorld2RootScreen();

    expect(
      screen.getByRole("heading", {
        name: "Mundo II: Lía y el pulso invisible",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("TEMP — Entremos al pulso invisible de la planta."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "TEMP — Aquí la señal aún no es sonido: primero debe ser cuidada.",
      ),
    ).toBeInTheDocument();
    expect(Object.keys(world2EditorialSlots)).toHaveLength(
      WORLD2_REQUIRED_SLOT_COUNT,
    );
    expect(
      Object.values(world2EditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-world2-experience]")).toHaveAttribute(
      "data-world2-experience",
      "temporary",
    );
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "intro",
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
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
  });

  it("avanza por las capas en orden, permite relectura y llega a ready_to_continue", () => {
    const { container } = renderWorld2RootScreen();
    const getState = () =>
      container
        .querySelector("[data-world2-state]")
        ?.getAttribute("data-world2-state");

    fireEvent.click(screen.getByRole("button", { name: "Iniciar lectura temporal" }));
    expect(getState()).toBe("planta_viva");
    expect(
      container.querySelector('[data-world2-layer="senal"]'),
    ).toHaveAttribute("data-layer-state", "locked");

    for (const [index, layer] of world2LayerDefinitions.entries()) {
      expect(getState()).toBe(layer.id);
      expect(
        screen.getByText(world2EditorialSlots[layer.hintSlot].text),
      ).toBeInTheDocument();
      expect(
        screen.getByText(world2EditorialSlots[layer.ambientSlot].text),
      ).toBeInTheDocument();

      if (index === 1) {
        fireEvent.click(
          container.querySelector(
            '[data-world2-layer="planta_viva"]',
          ) as HTMLButtonElement,
        );
        expect(
          screen.getByText(world2EditorialSlots.W2_LAYER_REPEAT_01.text),
        ).toBeInTheDocument();
        expect(getState()).toBe("senal");
        fireEvent.click(
          container.querySelector(
            '[data-world2-layer="senal"]',
          ) as HTMLButtonElement,
        );
      }

      fireEvent.click(screen.getByText(world2EditorialSlots[layer.confirmSlot].text));
    }

    expect(getState()).toBe("ready_to_continue");
    expect(
      screen.getByText(world2EditorialSlots.W2_COMPLETE_LIA_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: world2EditorialSlots.W2_CONTINUE_BTN_01.text,
      }),
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
