import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
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
    JSON.stringify({
      schemaVersion: 1,
      completedAreas,
      updatedAt: "2026-07-30T12:00:00.000Z",
    }),
  );
}

function state(container: HTMLElement) {
  return container
    .querySelector("[data-station5-state]")
    ?.getAttribute("data-station5-state");
}

function advance(ms: number) {
  act(() => vi.advanceTimersByTime(ms));
}

function area(container: HTMLElement, id: string) {
  const button = container.querySelector<HTMLButtonElement>(
    `[data-station5-area="${id}"]`,
  );
  if (!button) throw new Error(`Missing area ${id}`);
  return button;
}

function enterArea(
  container: HTMLElement,
  id: "plantas" | "sistema",
  reduced = false,
) {
  fireEvent.click(area(container, id));
  expect(state(container)).toBe("transitioning");
  expect(screen.getByTestId("current-location")).toHaveTextContent(
    `/estacion/5/${id}`,
  );
  advance(reduced ? 90 : 770);
  expect(state(container)).toBe(
    id === "plantas" ? "plants_intro" : "system_intro",
  );
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

describe("World5RootScreen — ST5-020D", () => {
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

  it("abre siempre en overview aunque Plantas y Sistema estén persistidas", () => {
    seedProgress(["plantas", "sistema"]);
    const { container } = renderStation5();
    expect(state(container)).toBe("map_overview");
    expect(
      screen.getByRole("heading", { level: 1, name: "MUNDO PRESENTE" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Espacio" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Espacio sigue protegido/i)).toBeInTheDocument();
  });

  it("no sustituye el overview por fichas automáticas al restaurar progreso parcial", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5();
    expect(state(container)).toBe("map_overview");
    expect(
      screen.getByRole("heading", { name: "MUNDO PRESENTE" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Sistema" }),
    ).not.toBeInTheDocument();
    expect(area(container, "sistema")).not.toHaveAttribute("aria-disabled");
  });

  it("muestra feedback protegido solo tras un intento explícito y no cambia ruta ni progreso", () => {
    seedProgress(["plantas", "sistema"]);
    const { container } = renderStation5();
    expect(
      screen.queryByRole("heading", { name: "Área protegida" }),
    ).not.toBeInTheDocument();
    fireEvent.click(area(container, "espacio"));
    expect(state(container)).toBe("map_blocked_feedback");
    expect(
      screen.getByRole("heading", { name: "Área protegida" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/estacion/5",
    );
    expect(
      JSON.parse(
        window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY) ?? "{}",
      ).completedAreas,
    ).toEqual(["plantas", "sistema"]);
    fireEvent.click(
      screen.getByRole("button", { name: "Volver al mapa general" }),
    );
    expect(state(container)).toBe("map_overview");
  });

  it("un intento temprano sobre Sistema explica el bloqueo sin usar disabled nativo", () => {
    const { container } = renderStation5();
    expect(area(container, "sistema")).toBeEnabled();
    expect(area(container, "sistema")).not.toHaveAttribute("aria-disabled");
    fireEvent.click(area(container, "sistema"));
    expect(state(container)).toBe("map_blocked_feedback");
    expect(
      screen.getAllByText(/Completa Plantas para habilitar Sistema/i),
    ).toHaveLength(2);
  });

  it("la navegación sola no completa Plantas y Back cancela la transición", () => {
    const { container } = renderStation5();
    fireEvent.click(area(container, "plantas"));
    expect(state(container)).toBe("transitioning");
    expect(window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "← Mapa" }));
    advance(900);
    expect(state(container)).toBe("map_overview");
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/estacion/5",
    );
    expect(window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("solo el target real completa Plantas y el retorno conserva overview", () => {
    const { container } = renderStation5();
    enterArea(container, "plantas");
    expect(window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: station5LeafLabel }));
    expect(state(container)).toBe("plants_resolved");
    expect(
      JSON.parse(
        window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY) ?? "{}",
      ).completedAreas,
    ).toEqual(["plantas"]);
    fireEvent.click(screen.getByRole("button", { name: "Volver al mapa" }));
    advance(630);
    advance(20);
    expect(state(container)).toBe("map_overview");
    expect(
      screen.getByRole("heading", { name: "MUNDO PRESENTE" }),
    ).toBeInTheDocument();
    expect(area(container, "plantas")).toHaveFocus();
  });

  it("completa Sistema desde su foco raster y no avanza la estación", () => {
    seedProgress(["plantas"]);
    const { container } = renderStation5();
    enterArea(container, "sistema");
    const connector = screen.getByRole("button", {
      name: "Hacer visible la mediación desde el conector del sistema.",
    });
    expect(
      connector.querySelector(
        `[data-runtime-asset="${world5RuntimeAssets.systemFocus}"]`,
      ),
    ).toBeInTheDocument();
    fireEvent.click(connector);
    expect(state(container)).toBe("system_resolved");
    expect(
      JSON.parse(
        window.localStorage.getItem(WORLD5_PROGRESS_STORAGE_KEY) ?? "{}",
      ).completedAreas,
    ).toEqual(["plantas", "sistema"]);
    expect(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBeNull();
    expect(container.querySelector("[data-station-complete]")).toHaveAttribute(
      "data-station-complete",
      "false",
    );
  });

  it("un refresh directo de subestación restaura su estado resuelto y el mapa vuelve a overview", () => {
    seedProgress(["plantas", "sistema"]);
    const first = renderStation5("/estacion/5/sistema");
    expect(state(first.container)).toBe("system_resolved");
    first.unmount();
    const second = renderStation5("/estacion/5");
    expect(state(second.container)).toBe("map_overview");
  });

  it("falla cerrado ante storage y permite reintentar sin retorno falso", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const { container } = renderStation5();
    enterArea(container, "plantas");
    fireEvent.click(screen.getByRole("button", { name: station5LeafLabel }));
    expect(state(container)).toBe("storage_error");
    expect(
      screen.getByRole("button", { name: "Volver al mapa" }),
    ).toBeDisabled();
    fireEvent.click(
      screen.getByRole("button", { name: "Reintentar guardado" }),
    );
    expect(state(container)).toBe("plants_intro");
  });

  it("usa artboards proyectados, Lía contextual y ningún visual procedimental", () => {
    const { container } = renderStation5();
    expect(
      container.querySelector('[data-projected-stage="map"]'),
    ).toHaveAttribute("data-projection-fit", "contain");
    expect(
      container.querySelector('[data-media-canvas="map"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-station5-lia="attend"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll("audio,video,canvas,iframe,svg"),
    ).toHaveLength(0);
    expect(
      container.querySelectorAll(
        ".s5-map__nexus,.s5-map__links,.s5-sector__status,.s5-vital-pulse,.s5-resolved-check,.s5-system-connection,.s5-system-indicator",
      ),
    ).toHaveLength(0);
    enterArea(container, "plantas");
    expect(
      container.querySelector('[data-projected-stage="plants"]'),
    ).toHaveAttribute("data-projection-fit", "cover");
    expect(
      container.querySelector('[data-station5-lia="explain"]'),
    ).toBeInTheDocument();
  });

  it("reduced motion conserva navegación, acción y persistencia", () => {
    stubReducedMotion(true);
    const { container } = renderStation5();
    enterArea(container, "plantas", true);
    fireEvent.click(screen.getByRole("button", { name: station5LeafLabel }));
    expect(state(container)).toBe("plants_resolved");
    expect(
      container.querySelector("[data-station5-reduced-motion]"),
    ).toHaveAttribute("data-station5-reduced-motion", "true");
  });
});

const station5LeafLabel = "Reconocer la vitalidad desde la hoja.";
