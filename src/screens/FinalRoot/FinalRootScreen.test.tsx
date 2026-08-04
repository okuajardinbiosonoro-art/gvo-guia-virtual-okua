import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import {
  FINAL_REQUIRED_SLOT_COUNT,
  finalEditorialSlots,
} from "../../content/finalEditorialSlots";
import { FinalRootScreen } from "./FinalRootScreen";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderFinalRootScreen() {
  return render(
    <MemoryRouter initialEntries={["/final"]}>
      <FinalRootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe("FinalRootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza Mirador Final con 35 slots editoriales aprobados y sin permisos sensibles", () => {
    const { container } = renderFinalRootScreen();

    expect(
      screen.getByRole("heading", { name: "Pantalla Final — Mirador" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: finalEditorialSlots.FINAL_TITLE_01.text,
      }),
    ).toBeInTheDocument();
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
    expect(Object.keys(finalEditorialSlots)).toHaveLength(
      FINAL_REQUIRED_SLOT_COUNT,
    );
    expect(Object.keys(finalEditorialSlots)).toHaveLength(35);
    expect(
      Object.values(finalEditorialSlots).every(
        (slot) => slot.status === "FINAL",
      ),
    ).toBe(true);
    expect(
      Object.values(finalEditorialSlots).every(
        (slot) => slot.source === "human_approved" && slot.locale === "es",
      ),
    ).toBe(true);
    expect(
      Object.values(finalEditorialSlots).every(
        (slot) => !slot.text.startsWith("TEMP"),
      ),
    ).toBe(true);
    expect(
      container.querySelectorAll('[data-editorial-status="TEMP"]'),
    ).toHaveLength(0);
    expect(container.querySelector("[data-final-screen]")).toHaveAttribute(
      "data-final-screen",
      "editorial_final_complete_experience",
    );
    expect(
      container.querySelector("[data-final-complete-experience]"),
    ).toHaveAttribute("data-final-complete-experience", "editorial_final");
    expect(
      container.querySelector("[data-final-editorial-source]"),
    ).toHaveAttribute("data-final-editorial-source", "human_approved");
    expect(
      container.querySelector("[data-final-operational-slots]"),
    ).toHaveAttribute(
      "data-final-operational-slots",
      "registered_not_consumed",
    );
    const credits = container.querySelector(
      '[data-final-slot-id="FINAL_CREDITS_01"]',
    );
    expect(credits).toHaveTextContent("Desarrollado por Momotto S.A.S.");
    expect(credits).toHaveTextContent(
      "A cargo del Ing. José David Pérez Zapata.",
    );
    expect(credits?.querySelector("br")).toBeInTheDocument();
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_RESTART_BUSY_01.text,
    );
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_RESTART_ERROR_01.text,
    );
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_RESTART_RETRY_BTN_01.text,
    );
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text,
    );
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01.text,
    );
    expect(container.querySelector("[data-review-mode]")).toHaveAttribute(
      "data-review-mode",
      "direct_route_review",
    );
    expect(container.querySelector("[data-restart-mode]")).toHaveAttribute(
      "data-restart-mode",
      "navigation_only_no_global_cleanup",
    );
    expect(container.querySelector("[data-daily-counter]")).toHaveAttribute(
      "data-daily-counter",
      "not_implemented",
    );
    expect(container.querySelector("[data-qr-camera]")).toHaveAttribute(
      "data-qr-camera",
      "blocked",
    );
    expect(
      container.querySelector("[data-sensitive-permissions]"),
    ).toHaveAttribute("data-sensitive-permissions", "blocked");
    expect(container.querySelector("[data-final-world-six]")).toHaveAttribute(
      "data-final-world-six",
      "blocked",
    );
  });

  it("permite seleccionar los cinco accesos de revision y abrir rutas existentes", () => {
    const { container } = renderFinalRootScreen();
    const accessExpectations = [
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_I_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_I_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_I_LABEL_01.text,
        route: "/estacion/1",
        state: "final_access_i_selected",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_II_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_II_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_II_LABEL_01.text,
        route: "/estacion/2",
        state: "final_access_ii_selected",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_III_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_III_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_III_LABEL_01.text,
        route: "/estacion/3",
        state: "final_access_iii_selected",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_IV_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_IV_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_IV_LABEL_01.text,
        route: "/estacion/4",
        state: "final_access_iv_selected",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_V_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_V_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_V_LABEL_01.text,
        route: "/estacion/5",
        state: "final_access_v_selected",
      },
    ];

    for (const access of accessExpectations) {
      fireEvent.click(screen.getByRole("button", { name: access.accessible }));
      expect(container.querySelector("[data-final-state]")).toHaveAttribute(
        "data-final-state",
        access.state,
      );
      expect(screen.getByText(access.confirm)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: access.label })).toHaveAttribute(
        "href",
        access.route,
      );
    }

    fireEvent.click(
      screen.getByRole("link", {
        name: finalEditorialSlots.FINAL_ACCESS_V_LABEL_01.text,
      }),
    );
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/estacion/5",
    );
  });

  it("permite volver al inicio y reiniciar solo por navegacion con confirmacion", () => {
    const { container, rerender } = renderFinalRootScreen();

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    expect(container.querySelector("[data-final-state]")).toHaveAttribute(
      "data-final-state",
      "final_restart_confirm",
    );
    expect(
      screen.getByText(finalEditorialSlots.FINAL_RESTART_CONFIRM_01.text),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_RESTART_CANCEL_BTN_01.text,
      }),
    );
    expect(container.querySelector("[data-final-state]")).toHaveAttribute(
      "data-final-state",
      "final_restart",
    );
    expect(
      screen.queryByText(finalEditorialSlots.FINAL_RESTART_CONFIRM_01.text),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text,
      }),
    );
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/portada",
    );

    rerender(
      <MemoryRouter initialEntries={["/final"]}>
        <FinalRootScreen />
        <LocationProbe />
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_BACK_HOME_01.text,
      }),
    );
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/portada",
    );
  });

  it("no crea sexta estacion, medios, QR, contador ni promesas prohibidas", () => {
    const { container } = renderFinalRootScreen();

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
