import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GVO_PROGRESS_STORAGE_KEY } from "../../domain/progress/progress.storage";
import { World5RootScreen } from "./World5RootScreen";
import { WORLD5_PROGRESS_STORAGE_KEY } from "./world5Progress";
import { world5RuntimeAssets } from "./world5RuntimeAssets";

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderStation5(path = "/estacion/5") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <World5RootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function state(container: HTMLElement) {
  return container.querySelector("[data-station5-state]")?.getAttribute("data-station5-state");
}

function advance(ms: number) {
  act(() => vi.advanceTimersByTime(ms));
}

function area(container: HTMLElement, id: string) {
  const button = container.querySelector<HTMLButtonElement>(`[data-station5-area="${id}"]`);
  if (!button) throw new Error(`Missing area ${id}`);
  return button;
}

function enterPlants(container: HTMLElement, reduced = false) {
  fireEvent.click(area(container, "plantas"));
  expect(state(container)).toBe("camera_entering_plantas");
  expect(screen.getByTestId("current-location")).toHaveTextContent("/estacion/5/plantas");
  advance(reduced ? 150 : 1070);
  advance(reduced ? 150 : 190);
  expect(state(container)).toBe("substation_plantas_interactive");
}

function stubReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

describe("World5RootScreen — ST5-020A", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    stubReducedMotion(false);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renderiza el mapa real con cuatro wrappers y sin bitmap de Lía", () => {
    const { container } = renderStation5();
    expect(state(container)).toBe("map_stable");
    expect(screen.getByRole("heading", { name: "MUNDO V: MAPA DEL PRESENTE" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-station5-area]")).toHaveLength(4);
    expect(container.querySelector(`[data-runtime-asset="${world5RuntimeAssets.mapSectorPlants}"]`)).toBeInTheDocument();
    expect(container.querySelector("[data-station5-lia]")).not.toBeInTheDocument();
    expect(container.querySelectorAll("audio,video,canvas,iframe")).toHaveLength(0);
  });

  it("hace de Plantas el único sector recorrible y mantiene los demás bloqueados", () => {
    const { container } = renderStation5();
    expect(area(container, "plantas")).toBeEnabled();
    expect(area(container, "sistema")).toBeDisabled();
    expect(area(container, "espacio")).toBeDisabled();
    expect(area(container, "visitante")).toBeDisabled();
  });

  it("entra por la ruta Plantas y mantiene un solo árbol accesible", () => {
    const { container } = renderStation5();
    enterPlants(container);
    expect(container.querySelector('[data-station5-scene="map"]')).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector('[data-station5-scene="plantas"]')).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByRole("button", { name: "Activar el pulso visual desde la hoja." })).toBeEnabled();
  });

  it("persiste solo Plantas antes de habilitar retorno y no completa Estación V", () => {
    const { container } = renderStation5();
    enterPlants(container);
    fireEvent.click(screen.getByRole("button", { name: "Activar el pulso visual desde la hoja." }));
    expect(state(container)).toBe("substation_plantas_resolved");
    expect(screen.getByRole("button", { name: "Volver al mapa" })).toBeEnabled();
    expect(JSON.parse(window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY) ?? "{}").completedAreas).toEqual(["plantas"]);
    expect(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("retorna al mapa, restaura foco e identifica Sistema sin abrirlo", () => {
    const { container } = renderStation5();
    enterPlants(container);
    fireEvent.click(screen.getByRole("button", { name: "Activar el pulso visual desde la hoja." }));
    fireEvent.click(screen.getByRole("button", { name: "Volver al mapa" }));
    expect(state(container)).toBe("camera_returning_to_map");
    advance(830);
    advance(20);
    expect(state(container)).toBe("map_plantas_completed");
    expect(area(container, "plantas")).toHaveFocus();
    expect(area(container, "sistema")).toHaveAttribute("data-area-state", "available");
    expect(area(container, "sistema")).toBeDisabled();
  });

  it("Back durante la entrada cancela sin completar Plantas", () => {
    const { container } = renderStation5();
    fireEvent.click(area(container, "plantas"));
    fireEvent.click(screen.getByRole("button", { name: "← Mapa" }));
    advance(1200);
    expect(state(container)).toBe("map_stable");
    expect(window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("bloquea un retorno falso cuando falla storage", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const { container } = renderStation5();
    enterPlants(container);
    fireEvent.click(screen.getByRole("button", { name: "Activar el pulso visual desde la hoja." }));
    expect(state(container)).toBe("substation_plantas_storage_error");
    expect(screen.getByRole("button", { name: "Volver al mapa" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reintentar guardado" })).toBeEnabled();
  });

  it("refresh directo en Plantas no restaura un frame intermedio", () => {
    const { container } = renderStation5("/estacion/5/plantas");
    expect(state(container)).toBe("substation_plantas_intro");
    advance(190);
    expect(state(container)).toBe("substation_plantas_interactive");
  });

  it("reduced motion conserva ruta, persistencia y comprensión sin travel", () => {
    stubReducedMotion(true);
    const { container } = renderStation5();
    enterPlants(container, true);
    fireEvent.click(screen.getByRole("button", { name: "Activar el pulso visual desde la hoja." }));
    expect(state(container)).toBe("substation_plantas_resolved");
    expect(container.querySelector("[data-station5-reduced-motion]" )).toHaveAttribute("data-station5-reduced-motion", "true");
  });
});
