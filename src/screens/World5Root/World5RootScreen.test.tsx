import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  WORLD5_REQUIRED_SLOT_COUNT,
  world5AreaDefinitions,
  world5ConceptAreas,
  world5EditorialSlots,
} from "../../content/world5EditorialSlots";
import { World5RootScreen } from "./World5RootScreen";

describe("World5RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza Mundo V temporal con 24 slots editoriales y sin permisos sensibles", () => {
    const { container } = render(<World5RootScreen />);

    expect(
      screen.getByRole("heading", { name: "Mundo V: Mapa del Presente" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Estación V en preparación")).toBeInTheDocument();
    expect(screen.getByText("Mapa del presente")).toBeInTheDocument();
    expect(
      screen.getByText(world5EditorialSlots.W5_INTRO_LIA_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(world5EditorialSlots.W5_INTRO_AMB_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(world5EditorialSlots.W5_ACCESSIBLE_SCENE_01.text),
    ).toBeInTheDocument();
    expect(Object.keys(world5EditorialSlots)).toHaveLength(
      WORLD5_REQUIRED_SLOT_COUNT,
    );
    expect(
      Object.values(world5EditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-world5-experience]")).toHaveAttribute(
      "data-world5-experience",
      "temporary",
    );
    expect(container.querySelector("[data-world5-state]")).toHaveAttribute(
      "data-world5-state",
      "intro",
    );
    expect(container.querySelector("[data-world5-slot-count]")).toHaveAttribute(
      "data-world5-slot-count",
      String(WORLD5_REQUIRED_SLOT_COUNT),
    );
    expect(container.querySelector("[data-world5-full-experience]"))
      .toHaveAttribute("data-world5-full-experience", "temporary_complete");
    expect(container.querySelector("[data-sensitive-permissions]"))
      .toHaveAttribute("data-sensitive-permissions", "blocked");
    expect(container.querySelector("[data-qr-camera]")).toHaveAttribute(
      "data-qr-camera",
      "blocked",
    );
    expect(container.querySelector("[data-daily-counter]")).toHaveAttribute(
      "data-daily-counter",
      "not_implemented",
    );
    expect(container.querySelector("[data-final-screen]")).toHaveAttribute(
      "data-final-screen",
      "not_implemented",
    );
    expect(container.querySelector("[data-review-free-mode]")).toHaveAttribute(
      "data-review-free-mode",
      "not_implemented",
    );
  });

  it("preserva las cuatro areas protegidas sin repetir la cadena tecnica de Mundo IV", () => {
    const { container } = render(<World5RootScreen />);

    expect(
      Array.from(container.querySelectorAll("[data-world5-protected-area]")).map(
        (area) => area.getAttribute("data-world5-protected-area"),
      ),
    ).toEqual([...world5ConceptAreas]);
    expect(container).not.toHaveTextContent(/BIONOSIFICADOR/);
    expect(container).not.toHaveTextContent(/ESP32/);
    expect(container).not.toHaveTextContent(/MIDI/);
    expect(container).not.toHaveTextContent(/WI-FI\/UDP/);
    expect(container).not.toHaveTextContent(/ROUTER/);
    expect(container).not.toHaveTextContent(/SISTEMA CENTRAL/);
    expect(container).not.toHaveTextContent(/SONIDO/);
  });

  it("avanza por las areas en orden, permite relectura y llega a ready_to_continue", () => {
    const { container } = render(<World5RootScreen />);
    const getState = () =>
      container
        .querySelector("[data-world5-state]")
        ?.getAttribute("data-world5-state");

    fireEvent.click(screen.getByRole("button", { name: "Iniciar mapa temporal" }));
    expect(getState()).toBe("plantas");
    expect(
      container.querySelector('[data-world5-area-id="sistema"]'),
    ).toHaveAttribute("data-area-state", "locked");

    for (const [index, area] of world5AreaDefinitions.entries()) {
      expect(getState()).toBe(area.id);
      expect(
        screen.getByText(world5EditorialSlots[area.hintSlot].text),
      ).toBeInTheDocument();
      expect(
        screen.getByText(world5EditorialSlots[area.ambientSlot].text),
      ).toBeInTheDocument();

      if (index === 1) {
        fireEvent.click(
          container.querySelector(
            '[data-world5-area-id="plantas"]',
          ) as HTMLButtonElement,
        );
        expect(
          screen.getByText(world5EditorialSlots.W5_AREA_REPEAT_01.text),
        ).toBeInTheDocument();
        expect(getState()).toBe("sistema");
        fireEvent.click(
          container.querySelector(
            '[data-world5-area-id="sistema"]',
          ) as HTMLButtonElement,
        );
      }

      fireEvent.click(screen.getByText(world5EditorialSlots[area.confirmSlot].text));
    }

    expect(getState()).toBe("ready_to_continue");
    expect(
      screen.getByText(world5EditorialSlots.W5_COMPLETE_LIA_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(world5EditorialSlots.W5_COMPLETE_AMB_01.text),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-world5-exit-target]")).toHaveAttribute(
      "data-world5-exit-target",
      "/transition/world-5-to-final",
    );
    expect(container.querySelector("[data-world5-exit-mode]")).toHaveAttribute(
      "data-world5-exit-mode",
      "prepared_no_navigation",
    );

    const finalButton = screen.getByRole("button", {
      name: world5EditorialSlots.W5_FINAL_BTN_01.text,
    });

    expect(finalButton).toHaveAttribute(
      "data-world5-exit-action",
      "prepared_for_012b",
    );
    fireEvent.click(finalButton);
    expect(
      screen.getByText(
        "Continuidad registrada: falta ticket específico para la transición posterior.",
      ),
    ).toBeInTheDocument();
  });

  it("no implementa medios, QR, contador, revision libre ni salida final real", () => {
    const { container } = render(<World5RootScreen />);

    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container.querySelector("[data-qr-camera]")).toHaveAttribute(
      "data-qr-camera",
      "blocked",
    );
    expect(container.querySelector("[data-daily-counter]")).toHaveAttribute(
      "data-daily-counter",
      "not_implemented",
    );
    expect(container.querySelector("[data-final-screen]")).toHaveAttribute(
      "data-final-screen",
      "not_implemented",
    );
    expect(container.querySelector("[data-review-free-mode]")).toHaveAttribute(
      "data-review-free-mode",
      "not_implemented",
    );
    expect(container).not.toHaveTextContent(/QR/i);
    expect(container).not.toHaveTextContent(/contador diario/i);
    expect(container).not.toHaveTextContent(/pantalla final/i);
  });
});
