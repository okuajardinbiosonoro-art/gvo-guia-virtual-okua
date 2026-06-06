import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { World1RootLayoutCalibrator } from "./World1RootLayoutCalibrator";

describe("World1RootLayoutCalibrator", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("renderiza la ruta dev con estados visuales y secciones avanzadas", () => {
    render(<World1RootLayoutCalibrator />);

    expect(
      screen.getByRole("heading", {
        name: "Calibrador Mundo I — solo desarrollo",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Estos valores no se aplican automaticamente al runtime. Copia el bloque CSS/JSON y usalo en un ticket posterior.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Estados visuales" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Raices activas" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Nodos" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Lia" })).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Guardar / cargar / exportar" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("activeRelationX")).toBeInTheDocument();
    expect(screen.getByLabelText("liaPointRelationX")).toBeInTheDocument();
    expect(screen.getByLabelText("relation node state")).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
    expect(screen.getByText("JSON")).toBeInTheDocument();
    expect(screen.getByText(/--world1-active-relation-x:/)).toBeInTheDocument();
    expect(screen.getByText(/"screen": "world1-root"/)).toBeInTheDocument();
  });

  it("permite cambiar a relation_active sin aplicar valores al runtime real", () => {
    render(<World1RootLayoutCalibrator />);

    fireEvent.click(screen.getByRole("button", { name: /relation_active/i }));

    expect(screen.getByTestId("world1-layout-calibrator")).toHaveAttribute(
      "data-calibrator-visual-state",
      "relation_active",
    );
    expect(screen.getByLabelText("relation node state")).toHaveValue("active");
    expect(screen.getByText(/"state": "relation_active"/)).toBeInTheDocument();
  });

  it("guarda, carga e importa presets locales solo para la ruta dev", () => {
    render(<World1RootLayoutCalibrator />);

    fireEvent.change(screen.getByLabelText("presetDraftName"), {
      target: { value: "calibracion-local" },
    });
    fireEvent.change(screen.getByLabelText("plantY"), {
      target: { value: "34.7" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar preset actual" }));

    expect(window.localStorage.getItem("gvo-dev-world1-layout-calibrator-v2")).toContain(
      "calibracion-local",
    );

    fireEvent.change(screen.getByLabelText("plantY"), {
      target: { value: "33.1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cargar preset guardado" }));

    expect(screen.getByText(/--world1-plant-y: 34\.7%;/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("importJson"), {
      target: {
        value: JSON.stringify({
          visualState: "relation_active",
          values: { plantY: 35.2 },
        }),
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Importar JSON" }));

    expect(screen.getByText(/--world1-plant-y: 35\.2%;/)).toBeInTheDocument();
    expect(screen.getByText("JSON importado en el calibrador dev.")).toBeInTheDocument();
  });
});
