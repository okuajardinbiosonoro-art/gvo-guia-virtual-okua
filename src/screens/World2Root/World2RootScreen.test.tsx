import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { World2RootScreen } from "./World2RootScreen";

function renderWorld2RootScreen() {
  return render(
    <MemoryRouter initialEntries={["/estacion/2"]}>
      <World2RootScreen />
    </MemoryRouter>,
  );
}

describe("World2RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza una entrada preliminar de Mundo II sin assets ni permisos sensibles", () => {
    const { container } = renderWorld2RootScreen();

    expect(
      screen.getByRole("heading", {
        name: "Mundo II: Lía y el pulso invisible",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Estación II en preparación")).toBeInTheDocument();
    expect(
      screen.getByText(
        "La ruta desde Mundo I ya está conectada. La experiencia completa de este mundo se construirá en una fase posterior.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("QR y cámara")).toBeInTheDocument();
    expect(screen.getByText("Bloqueados en esta fase.")).toBeInTheDocument();
    expect(container.querySelector("[data-world2-entry]")).toHaveAttribute(
      "data-world2-entry",
      "prepared",
    );
    expect(container.querySelector("[data-sensitive-permissions]"))
      .toHaveAttribute("data-sensitive-permissions", "blocked");
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
  });
});
