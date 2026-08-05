import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { finalEditorialSlots } from "../../content/finalEditorialSlots";
import { GVO_PROGRESS_STORAGE_KEY } from "../../domain/progress/progress.storage";
import {
  FinalReviewContextInvalidator,
  FinalReviewModeLayout,
} from "./FinalReviewModeLayout";
import {
  beginFinalReview,
  FINAL_REVIEW_CONTEXT_STORAGE_KEY,
} from "./finalReviewContext";

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}</span>;
}

function renderWorld(path: string, world: 1 | 2 | 3 | 4 | 5, state?: unknown) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: path, state }]}>
      <Routes>
        <Route
          path="/estacion/1"
          element={
            <FinalReviewModeLayout world={world}>
              <div>Mundo</div>
            </FinalReviewModeLayout>
          }
        />
        <Route
          path="/estacion/5/*"
          element={
            <FinalReviewModeLayout world={world}>
              <div>Mundo</div>
            </FinalReviewModeLayout>
          }
        />
        <Route path="/final" element={<div>Mirador</div>} />
      </Routes>
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe("FinalReviewModeLayout", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(cleanup);

  it("muestra el control sólo con context de revisita y vuelve una vez a Final", () => {
    const state = beginFinalReview(1);
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      "progreso-byte-exacto",
    );
    renderWorld("/estacion/1", 1, state);

    const control = screen.getByRole("button", {
      name: finalEditorialSlots.FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01.text,
    });
    expect(control).toHaveTextContent(
      finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text,
    );
    expect(control).toHaveAttribute(
      "data-final-slot-id",
      "FINAL_RETURN_TO_MIRADOR_BTN_01",
    );
    control.focus();
    expect(control).toHaveFocus();
    fireEvent.click(control);

    expect(screen.getByTestId("location")).toHaveTextContent("/final");
    expect(
      window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY),
    ).toBeNull();
    expect(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(
      "progreso-byte-exacto",
    );
  });

  it("sobrevive refresh y cubre todas las subrutas reales de Mundo V", () => {
    beginFinalReview(5);
    const first = renderWorld("/estacion/5/plantas", 5);
    expect(
      screen.getByText(finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text),
    ).toBeInTheDocument();
    first.unmount();

    renderWorld("/estacion/5/visitante", 5);
    expect(
      screen.getByText(finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text),
    ).toBeInTheDocument();
  });

  it("no aparece en entrada directa sin contexto", () => {
    renderWorld("/estacion/1", 1);

    expect(
      screen.queryByText(
        finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text,
      ),
    ).not.toBeInTheDocument();
  });

  it("invalida el contexto al entrar a Portada o a flujo normal", () => {
    beginFinalReview(2);
    render(
      <FinalReviewContextInvalidator>
        <div>Portada</div>
      </FinalReviewContextInvalidator>,
    );

    expect(
      window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY),
    ).toBeNull();
  });

  it("mantiene control nativo enfocable para teclado y touch", () => {
    const state = beginFinalReview(1);
    renderWorld("/estacion/1", 1, state);
    const control = screen.getByRole("button", {
      name: finalEditorialSlots.FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01.text,
    });

    expect(control.tagName).toBe("BUTTON");
    expect(control).toHaveClass("final-review-return-control");
    control.focus();
    expect(control).toHaveFocus();
  });
});
