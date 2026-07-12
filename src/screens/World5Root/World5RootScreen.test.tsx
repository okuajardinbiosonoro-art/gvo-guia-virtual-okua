import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { station5Areas, station5Cta, station5Lia } from "./station5Content";
import { World5RootScreen } from "./World5RootScreen";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderStation5() {
  return render(
    <MemoryRouter initialEntries={["/estacion/5"]}>
      <World5RootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function getState(container: HTMLElement) {
  return container
    .querySelector("[data-station5-state]")
    ?.getAttribute("data-station5-state");
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function areaButton(container: HTMLElement, areaId: string) {
  const button = container.querySelector<HTMLButtonElement>(
    `[data-station5-area="${areaId}"]`,
  );
  if (!button) {
    throw new Error(`Area button not found: ${areaId}`);
  }
  return button;
}

function litConnections(container: HTMLElement) {
  return container.querySelectorAll('[data-connection-state="lit"]').length;
}

/** Entrada suave: tras el enter, Plantas queda sugerida y el resto bloqueado. */
function enterStation(container: HTMLElement) {
  advance(1000);
  expect(getState(container)).toBe("station5_plants_suggested");
}

/** Espera el hint de la siguiente área y la toca (avance sin botón genérico). */
function advanceToArea(container: HTMLElement, areaId: string) {
  advance(1900);
  expect(areaButton(container, areaId)).toHaveAttribute(
    "data-area-state",
    "suggested",
  );
  fireEvent.click(areaButton(container, areaId));
  expect(areaButton(container, areaId)).toHaveAttribute(
    "data-area-state",
    "active",
  );
}

/** Primera pasada completa: Plantas → Sistema → Espacio → Visitante. */
function completeMap(container: HTMLElement) {
  enterStation(container);
  fireEvent.click(areaButton(container, "plantas"));
  expect(getState(container)).toBe("station5_plantas_active");
  advanceToArea(container, "sistema");
  advanceToArea(container, "espacio");
  advanceToArea(container, "visitante");
  advance(1900);
  expect(getState(container)).toBe("station5_map_integrated");
  advance(1600);
  expect(getState(container)).toBe("station5_ready_to_close");
}

function stubReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("World5RootScreen — Mapa del presente", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    Reflect.deleteProperty(window, "matchMedia");
  });

  it("renderiza la maqueta con título, Lía oficial única y mensaje inicial", () => {
    const { container } = renderStation5();

    expect(getState(container)).toBe("station5_entering");
    expect(
      screen.getByRole("heading", { name: "Mundo V: Mapa del presente" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Estación V")).toBeInTheDocument();
    expect(screen.getByText("Qué significa este montaje hoy")).toBeInTheDocument();
    expect(screen.getByText(station5Lia.intro)).toBeInTheDocument();

    enterStation(container);

    expect(container.querySelectorAll("[data-station5-lia]")).toHaveLength(1);
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(image.getAttribute("data-runtime-asset")).toContain("/lia_");
    }
    expect(
      container.querySelector("[data-station5-scene='present-map']"),
    ).toBeInTheDocument();
    expect(container.querySelector(".mobile-shell")).not.toBeInTheDocument();
  });

  it("no usa audio, video, canvas ni iframes", () => {
    const { container } = renderStation5();

    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
  });

  it("tiene exactamente cuatro áreas principales en el orden correcto", () => {
    const { container } = renderStation5();

    const areas = Array.from(
      container.querySelectorAll("[data-station5-area]"),
    ).map((area) => area.getAttribute("data-station5-area"));

    expect(areas).toEqual(["plantas", "sistema", "espacio", "visitante"]);
    expect(
      screen.getByRole("button", { name: "Área 1 de 4. Plantas." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Área 2 de 4. Sistema." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Área 3 de 4. Espacio." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Área 4 de 4. Visitante." }),
    ).toBeInTheDocument();
  });

  it("no repite la cadena técnica de ocho nodos de Estación IV", () => {
    const { container } = renderStation5();

    expect(container).not.toHaveTextContent(/bionosificador/i);
    expect(container).not.toHaveTextContent(/esp32/i);
    expect(container).not.toHaveTextContent(/midi/i);
    expect(container).not.toHaveTextContent(/wi-?fi/i);
    expect(container).not.toHaveTextContent(/router/i);
    expect(container).not.toHaveTextContent(/sistema central/i);
    expect(container).not.toHaveTextContent(/[♪♫♩♬]/);
    expect(container.querySelectorAll("[data-station5-area]")).toHaveLength(4);
  });

  it("al inicio solo Plantas está sugerida; el resto queda bloqueado", () => {
    const { container } = renderStation5();
    enterStation(container);

    expect(areaButton(container, "plantas")).toHaveAttribute(
      "data-area-state",
      "suggested",
    );
    for (const area of station5Areas.slice(1)) {
      expect(areaButton(container, area.id)).toHaveAttribute(
        "data-area-state",
        "locked",
      );
      expect(areaButton(container, area.id)).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }
    expect(litConnections(container)).toBe(0);
  });

  it("tocar un área futura bloqueada no avanza y Lía responde con calma", () => {
    const { container } = renderStation5();
    enterStation(container);

    fireEvent.click(areaButton(container, "espacio"));

    expect(getState(container)).toBe("station5_plants_suggested");
    expect(areaButton(container, "espacio")).toHaveAttribute(
      "data-area-state",
      "locked",
    );
    expect(screen.getByText(station5Lia.locked)).toBeInTheDocument();

    fireEvent.click(areaButton(container, "visitante"));
    expect(screen.getByText(station5Lia.lockedAlt)).toBeInTheDocument();
    expect(getState(container)).toBe("station5_plants_suggested");
  });

  it("activa Plantas con su explicación y enciende su conexión al nexo", () => {
    const { container } = renderStation5();
    enterStation(container);

    fireEvent.click(areaButton(container, "plantas"));

    expect(getState(container)).toBe("station5_plantas_active");
    expect(screen.getByText(station5Areas[0].text)).toBeInTheDocument();
    expect(screen.getByText(station5Areas[0].keyLine)).toBeInTheDocument();
    expect(
      container.querySelector('[data-station5-connection="plantas"]'),
    ).toHaveAttribute("data-connection-state", "lit");
    expect(litConnections(container)).toBe(1);
  });

  it("completar cada área habilita solo la siguiente, en orden secuencial", () => {
    const { container } = renderStation5();
    enterStation(container);
    fireEvent.click(areaButton(container, "plantas"));

    // Plantas → Sistema
    advance(1900);
    expect(areaButton(container, "sistema")).toHaveAttribute(
      "data-area-state",
      "suggested",
    );
    expect(areaButton(container, "espacio")).toHaveAttribute(
      "data-area-state",
      "locked",
    );
    expect(screen.getByText(station5Areas[1].hint)).toBeInTheDocument();
    fireEvent.click(areaButton(container, "sistema"));
    expect(getState(container)).toBe("station5_sistema_active");
    expect(areaButton(container, "plantas")).toHaveAttribute(
      "data-area-state",
      "completed",
    );
    expect(screen.getByText(station5Areas[1].text)).toBeInTheDocument();
    expect(litConnections(container)).toBe(2);

    // Sistema → Espacio
    advanceToArea(container, "espacio");
    expect(getState(container)).toBe("station5_espacio_active");
    expect(screen.getByText(station5Areas[2].text)).toBeInTheDocument();
    expect(litConnections(container)).toBe(3);

    // Espacio → Visitante
    advanceToArea(container, "visitante");
    expect(getState(container)).toBe("station5_visitante_active");
    expect(screen.getByText(station5Areas[3].text)).toBeInTheDocument();
    expect(litConnections(container)).toBe(4);
    expect(
      container.querySelectorAll('[data-area-state="active"]'),
    ).toHaveLength(1);
  });

  it("durante la primera pasada un área completada no reabre la explicación", () => {
    const { container } = renderStation5();
    enterStation(container);
    fireEvent.click(areaButton(container, "plantas"));
    advanceToArea(container, "sistema");

    fireEvent.click(areaButton(container, "plantas"));

    expect(getState(container)).toBe("station5_sistema_active");
    expect(screen.getByText(station5Lia.revisitLater)).toBeInTheDocument();
  });

  it("al completar Visitante el nexo central se ilumina y llega la síntesis", () => {
    const { container } = renderStation5();
    completeMap(container);

    expect(
      container.querySelector("[data-station5-nexus-state]"),
    ).toHaveAttribute("data-station5-nexus-state", "full");
    expect(litConnections(container)).toBe(4);
    expect(screen.getByText(station5Lia.synthesis)).toBeInTheDocument();
    expect(screen.getByText(station5Lia.revisit)).toBeInTheDocument();
    for (const area of station5Areas) {
      expect(areaButton(container, area.id)).toHaveAttribute(
        "data-area-state",
        "completed",
      );
    }
  });

  it("la acción final está deshabilitada antes de completar las cuatro áreas", () => {
    const { container } = renderStation5();
    enterStation(container);

    const cta = screen.getByRole("button", {
      name: station5Cta.accessibleLabelDisabled,
    });
    expect(cta).toHaveAttribute("aria-disabled", "true");
    expect(cta).toHaveAttribute("data-cta-state", "waiting");

    fireEvent.click(cta);

    expect(screen.getByText(station5Lia.ctaBlocked)).toBeInTheDocument();
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/estacion/5",
    );
    expect(getState(container)).toBe("station5_plants_suggested");
  });

  it("la acción final se habilita tras completar y navega a la transición final", () => {
    const { container } = renderStation5();
    completeMap(container);

    const cta = screen.getByRole("button", {
      name: station5Cta.accessibleLabel,
    });
    expect(cta).toHaveAttribute("aria-disabled", "false");
    expect(cta).toHaveAttribute("data-cta-state", "ready");

    fireEvent.click(cta);
    expect(getState(container)).toBe("station5_exiting");
    advance(400);

    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-5-to-final",
    );
  });

  it("en revisita libre las áreas se reabren en cualquier orden sin perder el nexo", () => {
    const { container } = renderStation5();
    completeMap(container);

    fireEvent.click(areaButton(container, "espacio"));

    expect(getState(container)).toBe("station5_revisit_mode");
    expect(areaButton(container, "espacio")).toHaveAttribute(
      "data-area-state",
      "active",
    );
    expect(screen.getByText(station5Areas[2].text)).toBeInTheDocument();

    fireEvent.click(areaButton(container, "plantas"));

    expect(screen.getByText(station5Areas[0].text)).toBeInTheDocument();
    expect(litConnections(container)).toBe(4);
    expect(
      container.querySelector("[data-station5-nexus-state]"),
    ).toHaveAttribute("data-station5-nexus-state", "full");
    expect(
      screen.getByRole("button", { name: station5Cta.accessibleLabel }),
    ).toBeInTheDocument();
  });

  it("con reduced motion la secuencia y las explicaciones se conservan", () => {
    stubReducedMotion(true);
    const { container } = renderStation5();

    expect(
      container.querySelector("[data-station5-reduced-motion='true']"),
    ).toBeInTheDocument();

    advance(100);
    expect(getState(container)).toBe("station5_plants_suggested");

    fireEvent.click(areaButton(container, "plantas"));
    expect(screen.getByText(station5Areas[0].text)).toBeInTheDocument();

    advance(300);
    fireEvent.click(areaButton(container, "sistema"));
    expect(screen.getByText(station5Areas[1].text)).toBeInTheDocument();

    advance(300);
    fireEvent.click(areaButton(container, "espacio"));
    advance(300);
    fireEvent.click(areaButton(container, "visitante"));
    expect(screen.getByText(station5Areas[3].text)).toBeInTheDocument();

    advance(300);
    expect(getState(container)).toBe("station5_map_integrated");
    advance(300);
    expect(getState(container)).toBe("station5_ready_to_close");
    expect(screen.getByText(station5Lia.synthesis)).toBeInTheDocument();
  });
});
