import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { station4Lia, station4Nodes } from "./station4Content";
import { World4RootScreen } from "./World4RootScreen";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderStation4() {
  return render(
    <MemoryRouter initialEntries={["/estacion/4"]}>
      <World4RootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function getState(container: HTMLElement) {
  return container
    .querySelector("[data-station4-state]")
    ?.getAttribute("data-station4-state");
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function nodeButton(container: HTMLElement, nodeId: string) {
  const button = container.querySelector<HTMLButtonElement>(
    `[data-station4-node="${nodeId}"]`,
  );
  if (!button) {
    throw new Error(`Node button not found: ${nodeId}`);
  }
  return button;
}

function enterStation(container: HTMLElement) {
  advance(1000);
  expect(getState(container)).toBe("station4_node_1_active");
}

/** Espera el hint del siguiente nodo y lo toca (avance sin botón genérico). */
function advanceToNode(container: HTMLElement, nodeId: string) {
  advance(1700);
  expect(nodeButton(container, nodeId)).toHaveAttribute(
    "data-node-state",
    "available",
  );
  fireEvent.click(nodeButton(container, nodeId));
  advance(750);
  expect(nodeButton(container, nodeId)).toHaveAttribute(
    "data-node-state",
    "active",
  );
}

function completeChain(container: HTMLElement) {
  enterStation(container);
  for (const node of station4Nodes.slice(1)) {
    advanceToNode(container, node.id);
  }
  advance(1700);
  expect(getState(container)).toBe("station4_chain_completed");
  advance(1600);
  expect(getState(container)).toBe("station4_ready_to_exit");
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

describe("World4RootScreen — Mesa de sistema", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    Reflect.deleteProperty(window, "matchMedia");
  });

  it("renderiza la mesa con título, Lía oficial única y tarjeta del nodo 1", () => {
    const { container } = renderStation4();

    expect(getState(container)).toBe("station4_entering");
    expect(
      screen.getByRole("heading", { name: "Estación IV" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Operación técnica")).toBeInTheDocument();
    expect(screen.getByText("Mesa de sistema")).toBeInTheDocument();

    enterStation(container);

    expect(screen.getByText("Paso 1 de 8")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Planta" }),
    ).toBeInTheDocument();
    expect(screen.getByText(station4Lia.intro)).toBeInTheDocument();

    expect(container.querySelectorAll("[data-station4-lia]")).toHaveLength(1);
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      expect(image.getAttribute("data-runtime-asset")).toContain("/lia_");
    }
    expect(container.querySelector("[data-station4-lia]")).toHaveAttribute(
      "data-lia-source",
      "repo-existing-2-5d",
    );
    expect(container.querySelector(".mobile-shell")).not.toBeInTheDocument();
  });

  it("no usa audio, video, canvas ni iframes", () => {
    const { container } = renderStation4();

    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
  });

  it("solo el nodo 1 está activo al inicio; 2 a 8 bloqueados antes del hint", () => {
    const { container } = renderStation4();
    enterStation(container);

    expect(nodeButton(container, "planta")).toHaveAttribute(
      "data-node-state",
      "active",
    );
    for (const node of station4Nodes.slice(1)) {
      expect(nodeButton(container, node.id)).toHaveAttribute(
        "data-node-state",
        "locked",
      );
      expect(nodeButton(container, node.id)).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    }
    expect(
      screen.getByRole("button", { name: "Paso 1 de 8. Planta." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Paso 2 de 8. Bionosificador." }),
    ).toBeInTheDocument();
  });

  it("tras el retardo de lectura solo el siguiente nodo pasa a disponible", () => {
    const { container } = renderStation4();
    enterStation(container);

    advance(1700);

    expect(getState(container)).toBe("station4_node_2_ready_hint");
    expect(nodeButton(container, "bionosificador")).toHaveAttribute(
      "data-node-state",
      "available",
    );
    for (const node of station4Nodes.slice(2)) {
      expect(nodeButton(container, node.id)).toHaveAttribute(
        "data-node-state",
        "locked",
      );
    }
    expect(screen.getByText(station4Lia.nextHint)).toBeInTheDocument();
  });

  it("tocar un nodo futuro bloqueado no lo activa y Lía responde con calma", () => {
    const { container } = renderStation4();
    enterStation(container);

    fireEvent.click(nodeButton(container, "wifi_udp"));

    expect(getState(container)).toBe("station4_node_1_active");
    expect(nodeButton(container, "wifi_udp")).toHaveAttribute(
      "data-node-state",
      "locked",
    );
    expect(screen.getByText(station4Lia.locked)).toBeInTheDocument();
  });

  it("avanza tocando el nodo iluminado, mueve la tarjeta y completa el anterior", () => {
    const { container } = renderStation4();
    enterStation(container);

    advance(1700);
    fireEvent.click(nodeButton(container, "bionosificador"));

    expect(getState(container)).toBe("station4_node_2_activating");

    advance(750);

    expect(getState(container)).toBe("station4_node_2_active");
    expect(nodeButton(container, "planta")).toHaveAttribute(
      "data-node-state",
      "completed",
    );
    expect(
      screen.getByRole("heading", { name: "Bionosificador" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Paso 2 de 8")).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-node-state="active"]'),
    ).toHaveLength(1);
  });

  it("bloquea taps durante el desplazamiento de Lía", () => {
    const { container } = renderStation4();
    enterStation(container);

    advance(1700);
    fireEvent.click(nodeButton(container, "bionosificador"));
    fireEvent.click(nodeButton(container, "esp32"));

    advance(750);

    expect(getState(container)).toBe("station4_node_2_active");
    expect(nodeButton(container, "esp32")).toHaveAttribute(
      "data-node-state",
      "locked",
    );
  });

  it("el desbloqueo secuencial funciona hasta el nodo 8 con un solo nodo activo", () => {
    const { container } = renderStation4();
    enterStation(container);

    for (const node of station4Nodes.slice(1)) {
      advanceToNode(container, node.id);
      expect(
        container.querySelectorAll('[data-node-state="active"]'),
      ).toHaveLength(1);
    }

    expect(getState(container)).toBe("station4_node_8_active");
    expect(
      screen.getByRole("heading", { name: "Sonido" }),
    ).toBeInTheDocument();
  });

  it("la acción final hacia Mundo V no existe antes del nodo 8", () => {
    const { container } = renderStation4();
    enterStation(container);

    expect(
      container.querySelector('[data-station4-action="open-world5"]'),
    ).not.toBeInTheDocument();

    advanceToNode(container, "bionosificador");
    advanceToNode(container, "esp32");

    expect(
      container.querySelector('[data-station4-action="open-world5"]'),
    ).not.toBeInTheDocument();
  });

  it("tras el nodo 8 la cadena queda completa y aparece el extremo hacia Mundo V", () => {
    const { container } = renderStation4();
    completeChain(container);

    expect(screen.getByText(station4Lia.revisit)).toBeInTheDocument();

    const exit = screen.getByRole("button", {
      name: "Abrir Mundo V. Ir al Mapa del presente.",
    });
    expect(exit).toBeInTheDocument();

    fireEvent.click(exit);
    expect(getState(container)).toBe("station4_exiting");
    advance(400);

    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-4-to-world-5",
    );
  });

  it("en revisión libre los nodos se reabren en cualquier orden sin perder la salida", () => {
    const { container } = renderStation4();
    completeChain(container);

    fireEvent.click(nodeButton(container, "planta"));
    advance(750);

    expect(getState(container)).toBe("station4_ready_to_exit");
    expect(nodeButton(container, "planta")).toHaveAttribute(
      "data-node-state",
      "active",
    );
    expect(
      screen.getByRole("heading", { name: "Planta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Abrir Mundo V. Ir al Mapa del presente.",
      }),
    ).toBeInTheDocument();

    fireEvent.click(nodeButton(container, "router"));
    advance(750);

    expect(
      screen.getByRole("heading", { name: "Router" }),
    ).toBeInTheDocument();
  });

  it("con reduced motion la secuencia se conserva con tiempos mínimos", () => {
    stubReducedMotion(true);
    const { container } = renderStation4();

    advance(100);
    expect(getState(container)).toBe("station4_node_1_active");
    expect(
      container.querySelector("[data-station4-reduced-motion='true']"),
    ).toBeInTheDocument();

    advance(300);
    expect(getState(container)).toBe("station4_node_2_ready_hint");

    fireEvent.click(nodeButton(container, "bionosificador"));
    advance(150);

    expect(getState(container)).toBe("station4_node_2_active");
    expect(
      screen.getByRole("heading", { name: "Bionosificador" }),
    ).toBeInTheDocument();
  });
});
