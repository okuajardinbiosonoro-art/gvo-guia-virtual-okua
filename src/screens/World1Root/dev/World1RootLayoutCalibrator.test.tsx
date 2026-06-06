import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { World1RootLayoutCalibrator } from "./World1RootLayoutCalibrator";

describe("World1RootLayoutCalibrator", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza la ruta dev con controles de planta, raiz y exportacion", () => {
    render(<World1RootLayoutCalibrator />);

    expect(
      screen.getByRole("heading", { name: "Calibración Mundo I" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("plantX")).toBeInTheDocument();
    expect(screen.getByLabelText("plantAnchorY")).toBeInTheDocument();
    expect(screen.getByLabelText("rootOriginX")).toBeInTheDocument();
    expect(screen.getByLabelText("rootsTop")).toBeInTheDocument();
    expect(screen.getByLabelText("nodeRelationTop")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
    expect(screen.getByText("JSON")).toBeInTheDocument();
    expect(
      screen.getByText(/--world1-root-origin-x: 50\.8%;/),
    ).toBeInTheDocument();
    expect(screen.getByText(/--world1-plant-x: 50\.5%;/)).toBeInTheDocument();
    expect(screen.getByText(/--world1-plant-y: 33\.5%;/)).toBeInTheDocument();
    expect(screen.getByText(/"plantAnchorY": "93.2%"/)).toBeInTheDocument();
  });

  it("permite ajustar valores sin aplicar cambios al runtime real", () => {
    render(<World1RootLayoutCalibrator />);

    fireEvent.change(screen.getByLabelText("plantY"), {
      target: { value: "34.7" },
    });

    expect(screen.getByText(/--world1-plant-y: 34\.7%;/)).toBeInTheDocument();
    expect(screen.getByText(/"plantY": "34.7%"/)).toBeInTheDocument();
  });
});
