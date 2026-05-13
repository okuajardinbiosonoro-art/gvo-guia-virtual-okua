import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LoadingInitialScreen } from "./LoadingInitialScreen";

describe("LoadingInitialScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza texto principal, subtitulo y barra de carga", () => {
    render(<LoadingInitialScreen />);

    expect(
      screen.getByRole("heading", { name: "Preparando el recorrido" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cuidando el inicio...")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", {
        name: "Progreso de preparación del recorrido",
      }),
    ).toBeInTheDocument();
  });

  it("mantiene una referencia semantica a Lia sin alterar su identidad", () => {
    render(<LoadingInitialScreen />);

    const liaReference = screen.getByAltText(
      /Lía, guía floral con exactamente cinco pétalos/i,
    );

    expect(liaReference).toBeInTheDocument();
    expect(liaReference).toHaveAttribute(
      "src",
      "/assets/runtime/loading-initial-pre-portada.png",
    );
  });
});
