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

function seedProgress(completedAreas: string[]) {
  window.localStorage.setItem(
    WORLD5_PROGRESS_STORAGE_KEY,
    JSON.stringify({ schemaVersion: 1, completedAreas, updatedAt: "2026-07-30T12:00:00.000Z" }),
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

function enterArea(container: HTMLElement, id: "plantas" | "sistema", reduced = false) {
  fireEvent.click(area(container, id));
  expect(state(container)).toBe(`camera_entering_${id}`);
  expect(screen.getByTestId("current-location")).toHaveTextContent(`/estacion/5/${id}`);
  advance(reduced ? 150 : 1070);
  advance(reduced ? 150 : 190);
  expect(state(container)).toBe(`substation_${id}_interactive`);
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

describe("World5RootScreen — ST5-020A + ST5-020B", () => {
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

  it("renderiza cuatro wrappers, Lía explicativa no interactiva y ninguna tecnología prohibida", () => {
    const { container } = renderStation5();
    expect(state(container)).toBe("map_stable");
    expect(container.querySelectorAll("[data-station5-area]")).toHaveLength(4);
    expect(container.querySelector(`[data-runtime-asset="${world5RuntimeAssets.mapSectorPlants}"]`)).toBeInTheDocument();
    expect(container.querySelector('[data-station5-lia="explain"]')).toBeInTheDocument();
    expect(container.querySelector(".s5-lia")).toHaveStyle({ pointerEvents: "none" });
    expect(container.querySelectorAll("audio,video,canvas,iframe")).toHaveLength(0);
  });

  it("habilita únicamente Plantas sin progreso", () => {
    const { container } = renderStation5();
    expect(area(container, "plantas")).toBeEnabled();
    expect(area(container, "sistema")).toBeDisabled();
    expect(area(container, "espacio")).toBeDisabled();
    expect(area(container, "visitante")).toBeDisabled();
  });

  it("con Plantas completada habilita Sistema y conserva Espacio protegido", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5();
    expect(state(container)).toBe("map_plantas_completed");
    expect(area(container, "sistema")).toBeEnabled();
    expect(area(container, "espacio")).toBeDisabled();
    expect(area(container, "espacio")).toHaveAttribute("data-protected", "true");
  });

  it("bloquea y reemplaza la ruta directa Sistema sin Plantas", () => {
    const { container } = renderStation5("/estacion/5/sistema");
    expect(screen.getByTestId("current-location")).toHaveTextContent("/estacion/5");
    expect(state(container)).toBe("map_stable");
    expect(screen.getByRole("status")).toHaveTextContent("Completa Plantas");
  });

  it("bloquea rutas futuras sin montar su contenido", () => {
    const { container } = renderStation5("/estacion/5/espacio");
    expect(screen.getByTestId("current-location")).toHaveTextContent("/estacion/5");
    expect(state(container)).toBe("map_stable");
    expect(container.querySelector('[data-station5-scene="espacio"]')).not.toBeInTheDocument();
  });

  it("abre Sistema por ruta directa válida y enfoca el heading estable", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5("/estacion/5/sistema");
    expect(state(container)).toBe("substation_sistema_intro");
    expect(screen.getByRole("heading", { name: "Sistema" })).toHaveFocus();
    advance(190);
    expect(state(container)).toBe("substation_sistema_interactive");
  });

  it("usa el focus de Sistema como único control y resuelve con una conexión general", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5();
    enterArea(container, "sistema");
    const connector = screen.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." });
    expect(container.querySelectorAll(".s5-system-focus")).toHaveLength(1);
    expect(connector.querySelector(`[data-runtime-asset="${world5RuntimeAssets.systemFocus}"]`)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Revelar mediación/i })).not.toBeInTheDocument();
    fireEvent.click(connector);
    expect(state(container)).toBe("substation_sistema_resolved");
    expect(screen.getByRole("status")).toHaveTextContent("Mediación visible.");
    expect(container.querySelectorAll('[data-world5-connection="general"]')).toHaveLength(1);
    expect(JSON.parse(window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY) ?? "{}").completedAreas).toEqual(["plantas", "sistema"]);
    expect(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("ignora acción prematura, tap exterior y repetición después de resolver", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5();
    fireEvent.click(area(container, "sistema"));
    const connector = screen.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." });
    fireEvent.click(connector);
    fireEvent.click(container.querySelector(".s5-system-scene")!);
    expect(state(container)).toBe("camera_entering_sistema");
    advance(1070);
    advance(190);
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    fireEvent.click(connector);
    fireEvent.click(connector);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(state(container)).toBe("substation_sistema_resolved");
  });

  it("impide retorno falso cuando falla storage en Sistema", () => {
    seedProgress(["plantas"]);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    const { container } = renderStation5();
    enterArea(container, "sistema");
    fireEvent.click(screen.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." }));
    expect(state(container)).toBe("substation_sistema_storage_error");
    expect(screen.getByRole("button", { name: "Volver al mapa" })).toBeDisabled();
    expect(JSON.parse(window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY) ?? "{}").completedAreas).toEqual(["plantas"]);
  });

  it("retorna, restaura foco a Sistema y deja Espacio disponible pero protegido", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5();
    enterArea(container, "sistema");
    fireEvent.click(screen.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." }));
    fireEvent.click(screen.getByRole("button", { name: "Volver al mapa" }));
    advance(830);
    advance(20);
    expect(state(container)).toBe("map_sistema_completed");
    expect(area(container, "sistema")).toHaveFocus();
    expect(area(container, "espacio")).toHaveAttribute("data-area-state", "available");
    expect(area(container, "espacio")).toBeDisabled();
    expect(container.querySelector("[data-station-complete]" )).toHaveAttribute("data-station-complete", "false");
  });

  it("Back durante entrada cancela el epoch sin completar Sistema", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5();
    fireEvent.click(area(container, "sistema"));
    fireEvent.click(screen.getByRole("button", { name: "← Mapa" }));
    advance(1200);
    expect(state(container)).toBe("map_plantas_completed");
    expect(JSON.parse(window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY) ?? "{}").completedAreas).toEqual(["plantas"]);
  });

  it("asigna a Lía lead, attend y greeting por fase sin convertirla en target", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5();
    expect(container.querySelector('[data-station5-lia="attend"]')).toBeInTheDocument();
    fireEvent.click(area(container, "sistema"));
    expect(container.querySelector('[data-station5-lia="lead"]')).toBeInTheDocument();
    advance(1070);
    advance(190);
    expect(container.querySelector('[data-station5-lia="attend"]')).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." }));
    expect(container.querySelector('[data-station5-lia="greeting"]')).toBeInTheDocument();
    expect(container.querySelector(".s5-lia button")).not.toBeInTheDocument();
  });

  it("reduced motion conserva entrada, persistencia y comprensión", () => {
    seedProgress(["plantas"]);
    stubReducedMotion(true);
    const { container } = renderStation5();
    enterArea(container, "sistema", true);
    fireEvent.click(screen.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." }));
    expect(state(container)).toBe("substation_sistema_resolved");
    expect(container.querySelector("[data-station5-reduced-motion]" )).toHaveAttribute("data-station5-reduced-motion", "true");
  });
});
