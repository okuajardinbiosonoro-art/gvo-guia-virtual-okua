import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import {
  WORLD3_REQUIRED_SLOT_COUNT,
  world3BlockDefinitions,
  world3EditorialSlots,
} from "../../content/world3EditorialSlots";
import { World3RootScreen } from "./World3RootScreen";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderWorld3RootScreen() {
  return render(
    <MemoryRouter initialEntries={["/estacion/3"]}>
      <World3RootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe("World3RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza Mundo III temporal con 23 slots editoriales y sin permisos sensibles", () => {
    const { container } = renderWorld3RootScreen();

    expect(
      screen.getByRole("heading", { name: "Mundo III: Cuaderno Pixel" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Estación III temporal")).toBeInTheDocument();
    expect(screen.getByText("Cuaderno de pruebas y ajustes")).toBeInTheDocument();
    expect(
      screen.getByText(world3EditorialSlots.W3_INTRO_LIA_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(world3EditorialSlots.W3_INTRO_AMB_01.text),
    ).toBeInTheDocument();
    expect(Object.keys(world3EditorialSlots)).toHaveLength(
      WORLD3_REQUIRED_SLOT_COUNT,
    );
    expect(
      Object.values(world3EditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-world3-experience]")).toHaveAttribute(
      "data-world3-experience",
      "temporary",
    );
    expect(container.querySelector("[data-world3-state]")).toHaveAttribute(
      "data-world3-state",
      "intro",
    );
    expect(container.querySelector("[data-world3-slot-count]")).toHaveAttribute(
      "data-world3-slot-count",
      "23",
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

  it("avanza por los bloques en orden, permite relectura y llega a ready_to_continue", () => {
    const { container } = renderWorld3RootScreen();
    const getState = () =>
      container
        .querySelector("[data-world3-state]")
        ?.getAttribute("data-world3-state");

    fireEvent.click(screen.getByRole("button", { name: "Abrir cuaderno temporal" }));
    expect(getState()).toBe("planta");
    expect(
      container.querySelector('[data-world3-block="prototipo"]'),
    ).toHaveAttribute("data-block-state", "locked");

    for (const [index, block] of world3BlockDefinitions.entries()) {
      expect(getState()).toBe(block.id);
      expect(
        screen.getByText(world3EditorialSlots[block.hintSlot].text),
      ).toBeInTheDocument();
      expect(
        screen.getByText(world3EditorialSlots[block.noteSlot].text),
      ).toBeInTheDocument();

      if (index === 1) {
        fireEvent.click(
          container.querySelector(
            '[data-world3-block="planta"]',
          ) as HTMLButtonElement,
        );
        expect(
          screen.getByText(world3EditorialSlots.W3_BLOCK_REPEAT_01.text),
        ).toBeInTheDocument();
        expect(getState()).toBe("prototipo");
        fireEvent.click(
          container.querySelector(
            '[data-world3-block="prototipo"]',
          ) as HTMLButtonElement,
        );
      }

      fireEvent.click(screen.getByText(world3EditorialSlots[block.confirmSlot].text));
    }

    expect(getState()).toBe("ready_to_continue");
    expect(
      screen.getByText(world3EditorialSlots.W3_COMPLETE_LIA_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Salida preparada hacia transición temporal; Mundo IV abre una entrada base.",
      ),
    ).toBeInTheDocument();

    const continueButton = screen.getByRole("button", {
      name: world3EditorialSlots.W3_CONTINUE_BTN_01.text,
    });

    expect(continueButton).toHaveAttribute(
      "data-world3-exit-action",
      "navigate_to_world4_transition",
    );
    fireEvent.click(continueButton);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-3-to-world-4",
    );
  });

  it("expone los cuatro conceptos como bloques temporales", () => {
    renderWorld3RootScreen();

    for (const block of world3BlockDefinitions) {
      expect(
        screen.getByRole("button", { name: new RegExp(block.label) }),
      ).toBeInTheDocument();
    }
  });
});
