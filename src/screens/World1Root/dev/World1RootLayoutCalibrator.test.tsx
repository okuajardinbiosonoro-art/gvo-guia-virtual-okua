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
    expect(
      screen.getByRole("group", { name: "Que quieres ajustar ahora" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Modo Raices activas" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Raices activas" })).toBeInTheDocument();
    expect(
      screen.getByText(/Rango ampliado: X de -40% a 140%, Y de -40% a 160%/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("activeRelationY")).toHaveAttribute("max", "160");
    expect(screen.queryByRole("group", { name: "Nodos" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Modo Nodos" }));
    expect(screen.getByRole("group", { name: "Nodos" })).toBeInTheDocument();
    expect(screen.getByLabelText("nodeRelationY")).toHaveAttribute("max", "125");

    fireEvent.click(screen.getByRole("button", { name: "Modo Lia" }));
    expect(screen.getByRole("group", { name: "Lia" })).toBeInTheDocument();
    expect(screen.getByLabelText("liaIdleY")).toHaveAttribute("max", "125");

    fireEvent.click(screen.getByRole("button", { name: "Modo Guardar" }));
    expect(
      screen.getByRole("group", { name: "Guardar / cargar / exportar" }),
    ).toBeInTheDocument();
    expect(screen.getByText("CSS")).toBeInTheDocument();
    expect(screen.getByText("JSON")).toBeInTheDocument();
    expect(screen.getByText(/--world1-active-relation-x:/)).toBeInTheDocument();
    expect(screen.getByText(/"screen": "world1-root"/)).toBeInTheDocument();
  });

  it("permite cambiar a relation_active sin aplicar valores al runtime real", () => {
    render(<World1RootLayoutCalibrator />);

    fireEvent.click(screen.getByRole("button", { name: "Modo Estado" }));
    fireEvent.click(screen.getByRole("button", { name: /relation_active/i }));

    expect(screen.getByTestId("world1-layout-calibrator")).toHaveAttribute(
      "data-calibrator-visual-state",
      "relation_active",
    );
    fireEvent.click(screen.getByRole("button", { name: "Modo Nodos" }));
    expect(screen.getByLabelText("relation node state")).toHaveValue("active");
    fireEvent.click(screen.getByRole("button", { name: "Modo Guardar" }));
    expect(screen.getByText(/"state": "relation_active"/)).toBeInTheDocument();
  });

  it("guarda, carga e importa presets locales solo para la ruta dev", () => {
    render(<World1RootLayoutCalibrator />);

    fireEvent.click(screen.getByRole("button", { name: "Modo Guardar" }));
    fireEvent.change(screen.getByLabelText("presetDraftName"), {
      target: { value: "calibracion-local" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Modo Base" }));
    fireEvent.change(screen.getByLabelText("plantY"), {
      target: { value: "34.7" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Modo Guardar" }));
    fireEvent.click(screen.getByRole("button", { name: "Guardar preset local" }));

    expect(window.localStorage.getItem("gvo-dev-world1-layout-calibrator-v2")).toContain(
      "calibracion-local",
    );

    fireEvent.click(screen.getByRole("button", { name: "Modo Base" }));
    fireEvent.change(screen.getByLabelText("plantY"), {
      target: { value: "33.1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Modo Guardar" }));
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
