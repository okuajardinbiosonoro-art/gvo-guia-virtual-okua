import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  WORLD3_BASE_SLOT_COUNT,
  world3ConceptSequence,
  world3EditorialSlots,
} from "../../content/world3EditorialSlots";
import { World3RootScreen } from "./World3RootScreen";

describe("World3RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza la entrada base de Mundo III con slots temporales y sin permisos sensibles", () => {
    const { container } = render(<World3RootScreen />);

    expect(
      screen.getByRole("heading", { name: "Mundo III: Cuaderno Pixel" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Estación III en preparación")).toBeInTheDocument();
    expect(screen.getByText("Cuaderno de pruebas y ajustes")).toBeInTheDocument();
    expect(
      screen.getByText(world3EditorialSlots.W3_INTRO_LIA_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(world3EditorialSlots.W3_INTRO_AMB_01.text),
    ).toBeInTheDocument();
    expect(Object.keys(world3EditorialSlots)).toHaveLength(
      WORLD3_BASE_SLOT_COUNT,
    );
    expect(
      Object.values(world3EditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-world3-entry]")).toHaveAttribute(
      "data-world3-entry",
      "preliminary",
    );
    expect(container.querySelector("[data-world3-slot-count]")).toHaveAttribute(
      "data-world3-slot-count",
      "3",
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

  it("muestra la secuencia conceptual sin construir la experiencia completa", () => {
    render(<World3RootScreen />);

    for (const concept of world3ConceptSequence) {
      expect(screen.getByText(concept)).toBeInTheDocument();
    }
    expect(
      screen.getByText(
        "Entrada preliminar: la experiencia completa de Mundo III no se construye en 009D.",
      ),
    ).toBeInTheDocument();
  });
});
