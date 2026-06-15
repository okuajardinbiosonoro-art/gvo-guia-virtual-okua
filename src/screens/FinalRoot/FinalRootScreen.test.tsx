import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  FINAL_BASE_SLOT_COUNT,
  finalEditorialSlots,
} from "../../content/finalEditorialSlots";
import { FinalRootScreen } from "./FinalRootScreen";

describe("FinalRootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza la entrada base del Mirador con slots TEMP y sin permisos sensibles", () => {
    const { container } = render(<FinalRootScreen />);

    expect(
      screen.getByRole("heading", { name: "Pantalla Final — Mirador" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: finalEditorialSlots.FINAL_TITLE_01.text,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Pantalla final en preparación")).toBeInTheDocument();
    expect(
      screen.getByText(finalEditorialSlots.FINAL_SUBTITLE_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(finalEditorialSlots.FINAL_LIA_MESSAGE_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(finalEditorialSlots.FINAL_AMB_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(finalEditorialSlots.FINAL_ACCESSIBLE_SCENE_01.text),
    ).toBeInTheDocument();
    expect(Object.keys(finalEditorialSlots)).toHaveLength(FINAL_BASE_SLOT_COUNT);
    expect(
      Object.values(finalEditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-final-screen]")).toHaveAttribute(
      "data-final-screen",
      "base_entry_prepared",
    );
    expect(container.querySelector("[data-final-complete-experience]"))
      .toHaveAttribute("data-final-complete-experience", "not_implemented");
    expect(container.querySelector("[data-review-free-mode]")).toHaveAttribute(
      "data-review-free-mode",
      "not_implemented",
    );
    expect(container.querySelector("[data-restart-mode]")).toHaveAttribute(
      "data-restart-mode",
      "prepared_no_global_cleanup",
    );
    expect(container.querySelector("[data-daily-counter]")).toHaveAttribute(
      "data-daily-counter",
      "not_implemented",
    );
    expect(container.querySelector("[data-qr-camera]")).toHaveAttribute(
      "data-qr-camera",
      "blocked",
    );
    expect(container.querySelector("[data-sensitive-permissions]"))
      .toHaveAttribute("data-sensitive-permissions", "blocked");
  });

  it("mantiene acciones preparadas sin revision libre ni reinicio completo", () => {
    render(<FinalRootScreen />);

    fireEvent.click(screen.getByRole("button", { name: "Revisar mundos — preparado" }));
    expect(
      screen.getByText(
        "Revisión preparada: falta ticket específico para abrir el modo libre.",
      ),
    ).toBeInTheDocument();

    const homeLink = screen.getByRole("link", {
      name: "Volver al inicio — preparado",
    });
    expect(homeLink).toHaveAttribute("href", "/portada");
    expect(homeLink).toHaveAttribute(
      "data-final-action",
      "safe_navigation_portada",
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Reiniciar recorrido — preparado" }),
    );
    expect(
      screen.getByText(
        "Reinicio preparado: falta ticket específico para limpiar estado global.",
      ),
    ).toBeInTheDocument();
  });

  it("no crea una sexta estacion, medios, QR, contador ni promesas de audio", () => {
    const { container } = render(<FinalRootScreen />);

    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container).not.toHaveTextContent(/Mundo VI/i);
    expect(container).not.toHaveTextContent(/sexta estación/i);
    expect(container).not.toHaveTextContent(/planta canta/i);
    expect(container).not.toHaveTextContent(/música directa/i);
    expect(container).not.toHaveTextContent(/audio real/i);
    expect(container).not.toHaveTextContent(/magia literal/i);
    expect(container).not.toHaveTextContent(/QR/i);
    expect(container).not.toHaveTextContent(/contador diario/i);
  });
});
