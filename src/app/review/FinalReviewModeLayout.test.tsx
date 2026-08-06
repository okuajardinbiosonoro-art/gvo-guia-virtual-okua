import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

function seedGlobalProgress(completedStations = [1, 2, 3, 4, 5]) {
  const raw = JSON.stringify({
    schemaVersion: 1,
    completedStations,
    updatedAt: "2026-08-05T12:00:00.000Z",
  });
  window.localStorage.setItem(GVO_PROGRESS_STORAGE_KEY, raw);
  return raw;
}

type Listener = EventListenerOrEventListenerObject;

let resizeObserverCallback: ResizeObserverCallback | null = null;
let resizeObserverDisconnect: () => void;

function installResizeObserver() {
  resizeObserverDisconnect = vi.fn();
  class ResizeObserverMock implements ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resizeObserverCallback = callback;
    }

    disconnect(): void {
      resizeObserverDisconnect();
    }

    observe(): void {}

    unobserve(): void {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
}

function installViewport(width = 390, height = 844) {
  const listeners = new Map<string, Set<Listener>>();
  const viewport = {
    addEventListener: vi.fn((type: string, listener: Listener) => {
      const registered = listeners.get(type) ?? new Set<Listener>();
      registered.add(listener);
      listeners.set(type, registered);
    }),
    dispatch(type: string) {
      for (const listener of listeners.get(type) ?? []) {
        if (typeof listener === "function") {
          listener(new Event(type));
        } else {
          listener.handleEvent(new Event(type));
        }
      }
    },
    height,
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    removeEventListener: vi.fn((type: string, listener: Listener) => {
      listeners.get(type)?.delete(listener);
    }),
    scale: 1,
    width,
  };
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: height,
  });
  Object.defineProperty(window, "visualViewport", {
    configurable: true,
    value: viewport,
  });
  return viewport;
}

function renderWorld(path: string, world: 1 | 2 | 3 | 4 | 5, state?: unknown) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: path, state }]}>
      <Routes>
        <Route
          path="/estacion/:stationId"
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
    installResizeObserver();
    installViewport();
    window.localStorage.clear();
    window.sessionStorage.clear();
    seedGlobalProgress();
  });

  afterEach(() => {
    cleanup();
    resizeObserverCallback = null;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("muestra el control sólo con context de revisita y vuelve una vez a Final", () => {
    const state = beginFinalReview(1);
    const progressBefore = seedGlobalProgress();
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
      progressBefore,
    );
  });

  it("sobrevive refresh y cubre todas las subrutas reales de Mundo V", () => {
    for (const route of [
      "/estacion/5",
      "/estacion/5/plantas",
      "/estacion/5/sistema",
      "/estacion/5/espacio",
      "/estacion/5/visitante",
    ]) {
      beginFinalReview(5);
      const rendered = renderWorld(route, 5);
      expect(
        screen.getByText(
          finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text,
        ),
      ).toBeInTheDocument();
      rendered.unmount();
    }
  });

  it("no aparece en entrada directa sin contexto", () => {
    renderWorld("/estacion/1", 1);

    expect(
      screen.queryByText(
        finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text,
      ),
    ).not.toBeInTheDocument();
  });

  it("invalida revisita sintácticamente válida si el progreso global no autoriza Final", () => {
    const state = beginFinalReview(1);
    seedGlobalProgress([1]);
    renderWorld("/estacion/1", 1, state);

    expect(
      screen.queryByText(
        finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text,
      ),
    ).not.toBeInTheDocument();
    expect(
      window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY),
    ).toBeNull();
  });

  it("no vuelve a Final si el progreso se vuelve incoherente durante la revisita", () => {
    const state = beginFinalReview(1);
    renderWorld("/estacion/1", 1, state);
    seedGlobalProgress([1]);

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01.text,
      }),
    );

    expect(screen.getByTestId("location")).toHaveTextContent("/estacion/2");
    expect(
      window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY),
    ).toBeNull();
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

  it("publica clearance cero y no añade dock sin revisita", () => {
    const { container } = renderWorld("/estacion/1", 1);
    const layout = container.querySelector<HTMLElement>(
      ".final-review-mode-layout",
    );

    expect(layout).toHaveAttribute("data-final-review-active", "false");
    expect(
      layout?.style.getPropertyValue("--gvo-final-review-dock-block-size"),
    ).toBe("0px");
    expect(
      layout?.style.getPropertyValue("--gvo-final-review-dock-inline-size"),
    ).toBe("0px");
    expect(container.querySelector("[data-final-review-dock]")).toBeNull();
  });

  it("crea el dock shared compacto en top-end y conserva slots", () => {
    const state = beginFinalReview(1);
    const { container } = renderWorld("/estacion/1", 1, state);
    const dock = container.querySelector("[data-final-review-dock='active']");
    const control = screen.getByRole("button", {
      name: finalEditorialSlots.FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01.text,
    });

    expect(dock).toHaveAttribute("data-final-review-dock-placement", "top-end");
    expect(
      container.querySelector(".final-review-mode-layout"),
    ).toHaveAttribute("data-final-review-clearance-mode", "floating");
    expect(control).toHaveAttribute(
      "data-final-accessible-slot-id",
      "FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01",
    );
    expect(control).toHaveAttribute(
      "data-final-slot-id",
      "FINAL_RETURN_TO_MIRADOR_BTN_01",
    );
  });

  it("reserva clearance para Mundo V en landscape", () => {
    installViewport(844, 390);
    const state = beginFinalReview(5);
    const { container } = renderWorld("/estacion/5", 5, state);
    const layout = container.querySelector(".final-review-mode-layout");
    const dock = container.querySelector("[data-final-review-dock='active']");

    expect(layout).toHaveAttribute(
      "data-final-review-clearance-mode",
      "reserved",
    );
    expect(layout).toHaveAttribute("data-final-review-placement", "top-start");
    expect(dock).toHaveAttribute(
      "data-final-review-dock-placement",
      "top-start",
    );
  });

  it("desplaza el dock bajo el título de Mundo II en portrait", () => {
    const state = beginFinalReview(2);
    const { container } = renderWorld("/estacion/2", 2, state);

    expect(
      container.querySelector("[data-final-review-dock='active']"),
    ).toHaveAttribute("data-final-review-dock-placement", "below-end");
    expect(
      container.querySelector(".final-review-mode-layout"),
    ).toHaveAttribute("data-final-review-clearance-mode", "floating");
  });

  it("activa clearance dinámico al aparecer Captura de Mundo II", () => {
    const state = beginFinalReview(2);
    const { container } = renderWorld("/estacion/2", 2, state);
    const layout = container.querySelector<HTMLElement>(
      ".final-review-mode-layout",
    );
    const capture = document.createElement("div");
    capture.dataset.world2CaptureTimeline = "016R";
    vi.spyOn(capture, "getBoundingClientRect").mockReturnValue({
      bottom: 400,
      height: 300,
      left: 20,
      right: 370,
      top: 100,
      width: 350,
      x: 20,
      y: 100,
      toJSON: () => ({}),
    });
    layout?.append(capture);

    act(() => {
      resizeObserverCallback?.([], {} as ResizeObserver);
    });

    expect(layout).toHaveAttribute(
      "data-final-review-clearance-mode",
      "reserved",
    );
    expect(layout).toHaveAttribute("data-final-review-placement", "top-end");
  });

  it("ResizeObserver actualiza dimensiones reales sin reducir el target", () => {
    const state = beginFinalReview(1);
    const { container } = renderWorld("/estacion/1", 1, state);
    const layout = container.querySelector<HTMLElement>(
      ".final-review-mode-layout",
    );
    const dock = container.querySelector<HTMLElement>(
      "[data-final-review-dock='active']",
    );
    vi.spyOn(dock!, "getBoundingClientRect").mockReturnValue({
      bottom: 70,
      height: 58,
      left: 150,
      right: 360,
      top: 12,
      width: 210,
      x: 150,
      y: 12,
      toJSON: () => ({}),
    });

    act(() => {
      resizeObserverCallback?.([], {} as ResizeObserver);
    });

    expect(
      layout?.style.getPropertyValue("--gvo-final-review-dock-block-size"),
    ).toBe("58px");
    expect(
      layout?.style.getPropertyValue("--gvo-final-review-dock-inline-size"),
    ).toBe("210px");
    expect(dock).toHaveAttribute("data-final-review-clearance", "58x210");
  });

  it("visualViewport cambia offsets y conserva placement compacto", () => {
    const viewport = installViewport(390, 844);
    const state = beginFinalReview(1);
    const { container } = renderWorld("/estacion/1", 1, state);
    const layout = container.querySelector<HTMLElement>(
      ".final-review-mode-layout",
    );

    Object.assign(viewport, {
      offsetLeft: 7,
      offsetTop: 9,
      width: 320,
    });
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 844,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 390,
    });
    act(() => viewport.dispatch("resize"));

    expect(
      layout?.style.getPropertyValue("--gvo-final-review-visual-offset-top"),
    ).toBe("9px");
    expect(
      layout?.style.getPropertyValue("--gvo-final-review-visual-offset-left"),
    ).toBe("7px");
    expect(
      container.querySelector("[data-final-review-dock='active']"),
    ).toHaveAttribute("data-final-review-dock-placement", "top-start");
  });

  it("limpia ResizeObserver y listeners al desmontar", () => {
    const viewport = installViewport();
    const state = beginFinalReview(1);
    const rendered = renderWorld("/estacion/1", 1, state);

    rendered.unmount();

    expect(resizeObserverDisconnect).toHaveBeenCalled();
    expect(viewport.removeEventListener).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    expect(viewport.removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  it("el dock no reemplaza el click único ni captura pointer fuera del botón", () => {
    const state = beginFinalReview(1);
    const { container } = renderWorld("/estacion/1", 1, state);
    const dock = container.querySelector<HTMLElement>(
      "[data-final-review-dock='active']",
    );
    const control = screen.getByRole("button", {
      name: finalEditorialSlots.FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01.text,
    });

    expect(dock).toHaveClass("final-review-return-dock");
    expect(control).toHaveClass("final-review-return-control");
    fireEvent.click(control);
    expect(screen.getByTestId("location")).toHaveTextContent("/final");
  });
});
