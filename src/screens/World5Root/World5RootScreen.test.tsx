import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  WORLD5_BASE_SLOT_COUNT,
  world5ConceptAreas,
  world5EditorialSlots,
} from "../../content/world5EditorialSlots";
import { World5RootScreen } from "./World5RootScreen";

describe("World5RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza la entrada base de Mundo V con tres slots temporales", () => {
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
      WORLD5_BASE_SLOT_COUNT,
    );
    expect(
      Object.values(world5EditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-world5-experience]")).toHaveAttribute(
      "data-world5-experience",
      "base_entry",
    );
    expect(container.querySelector("[data-world5-state]")).toHaveAttribute(
      "data-world5-state",
      "entry_preliminary",
    );
    expect(container.querySelector("[data-world5-slot-count]")).toHaveAttribute(
      "data-world5-slot-count",
      String(WORLD5_BASE_SLOT_COUNT),
    );
    expect(container.querySelector("[data-world5-full-experience]"))
      .toHaveAttribute("data-world5-full-experience", "not_implemented");
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

  it("no implementa experiencia completa, medios, QR, contador ni acciones finales", () => {
    const { container } = render(<World5RootScreen />);

    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container.querySelectorAll("button")).toHaveLength(0);
    expect(container).not.toHaveTextContent(/QR/i);
    expect(container).not.toHaveTextContent(/contador diario/i);
    expect(container).not.toHaveTextContent(/pantalla final/i);
  });
});
