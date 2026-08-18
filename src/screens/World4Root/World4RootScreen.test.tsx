// @ts-expect-error Vitest ejecuta este archivo en Node; producción excluye sus tipos.
import { createHash } from "node:crypto";
// @ts-expect-error Vitest ejecuta este archivo en Node; producción excluye sus tipos.
import { readFile, readdir } from "node:fs/promises";
// @ts-expect-error Vitest ejecuta este archivo en Node; producción excluye sus tipos.
import { resolve } from "node:path";

import { createRef } from "react";

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
import { WORLD4_CHECKPOINT_STORAGE_KEY } from "../../domain/checkpoints/world4Checkpoint";
import { station4Lia, station4Nodes } from "./station4Content";
import {
  WORLD4_APPROVED_ASSET_HASHES,
  WORLD4_BACKPLATE_SLICES,
  WORLD4_REJECTED_ASSET_FILENAME,
  WORLD4_RUNTIME_LAYER_DECISIONS,
  world4NodeAssetManifest,
} from "./world4AssetManifest";
import {
  WORLD4_ARTBOARD,
  WORLD4_NODE_ANCHORS,
  WORLD4_NODE_STACK,
  WORLD4_Z_ORDER,
} from "./world4Geometry";
import { World4RootScreen } from "./World4RootScreen";

vi.mock("../../app/qr/InterstationQrGate", () => ({
  InterstationQrGate: ({
    onCompleted,
    originWorld,
    persistCompletion,
    ready,
  }: {
    onCompleted: () => void;
    originWorld: number;
    persistCompletion: () => boolean;
    ready: boolean;
  }) =>
    ready ? (
      <button
        data-interstation-qr-action="open"
        onClick={() => {
          if (persistCompletion()) onCompleted();
        }}
        type="button"
      >
        Escanea el QR para abrir Mundo {originWorld + 1}
      </button>
    ) : null,
}));
import {
  world4RuntimeAssetPaths,
  world4RuntimeAssets,
} from "./world4RuntimeAssets";
import {
  WORLD4_NODE_FX_CONFIG,
  WORLD4_NODE_FX_ORDER,
} from "./world4NodeFxConfig";
import { WORLD4_LIA_GUIDE_POSITIONS } from "./World4LiaGuide";
import { WORLD4_ROUTE_SEGMENTS } from "./World4RoutePulse";
import {
  WORLD4_TAP_HINT_DELAY_MS,
  WORLD4_TAP_HINT_VISIBLE_MS,
  World4TapHint,
} from "./World4TapHint";

declare const process: { cwd: () => string };

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
  advance(1500);
  expect(getState(container)).toBe("station4_node_1_available");
}

function advanceToNode(container: HTMLElement, nodeId: string) {
  expect(nodeButton(container, nodeId)).toHaveAttribute(
    "data-node-state",
    "available",
  );
  fireEvent.click(nodeButton(container, nodeId));
  advance(1200);
  expect(nodeButton(container, nodeId)).toHaveAttribute(
    "data-node-state",
    "active",
  );
}

function completeChain(container: HTMLElement) {
  enterStation(container);
  for (const node of station4Nodes.slice(0, -1)) {
    advanceToNode(container, node.id);
  }
  const finalNode = station4Nodes.at(-1)!;
  fireEvent.click(nodeButton(container, finalNode.id));
  advance(1200);
  expect(getState(container)).toBe("station4_chain_completed");
  advance(1300);
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
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
    Reflect.deleteProperty(window, "matchMedia");
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
  });

  it("renderiza la mesa con título, Lía oficial única y tarjeta del nodo 1", () => {
    const { container } = renderStation4();

    expect(getState(container)).toBe("station4_entering");
    expect(
      container.querySelector("[data-station4-entry-mode='full']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-entry-invitation='true']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-station4-lia-duration-ms='720']"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Estación IV" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Operación técnica")).toBeInTheDocument();
    expect(screen.getByText("Mesa de sistema")).toBeInTheDocument();

    enterStation(container);

    expect(screen.getByText("Paso 1 de 8")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Planta" })).toBeInTheDocument();
    expect(screen.getByText(station4Lia.intro)).toBeInTheDocument();

    expect(container.querySelectorAll("[data-station4-lia]")).toHaveLength(1);
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(20);
    for (const image of images) {
      expect(image.getAttribute("data-runtime-asset")).toMatch(
        /^\/assets\/gvo\//,
      );
    }
    const liaImages = container.querySelectorAll("[data-station4-lia] img");
    expect(liaImages).toHaveLength(1);
    expect(liaImages[0].getAttribute("data-runtime-asset")).toContain("/lia_");
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

  it("deja solo el nodo 1 disponible al terminar la entrada y mantiene 2 a 8 bloqueados", () => {
    const { container } = renderStation4();
    enterStation(container);

    expect(nodeButton(container, "planta")).toHaveAttribute(
      "data-node-state",
      "available",
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

  it("devuelve el control antes de 1450 ms y deja disponible solo el siguiente nodo", () => {
    const { container } = renderStation4();
    enterStation(container);

    advanceToNode(container, "planta");

    expect(getState(container)).toBe("station4_node_1_active");
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

    expect(getState(container)).toBe("station4_node_1_available");
    expect(nodeButton(container, "wifi_udp")).toHaveAttribute(
      "data-node-state",
      "locked",
    );
    expect(screen.getByText(station4Lia.locked)).toBeInTheDocument();
  });

  it("avanza tocando el nodo iluminado, mueve la tarjeta y completa el anterior", () => {
    const { container } = renderStation4();
    enterStation(container);

    advanceToNode(container, "planta");
    fireEvent.click(nodeButton(container, "bionosificador"));

    expect(getState(container)).toBe("station4_node_2_activating");

    advance(1200);

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

    fireEvent.click(nodeButton(container, "planta"));
    fireEvent.click(nodeButton(container, "bionosificador"));
    fireEvent.click(nodeButton(container, "esp32"));

    advance(1200);

    expect(getState(container)).toBe("station4_node_1_active");
    expect(nodeButton(container, "esp32")).toHaveAttribute(
      "data-node-state",
      "locked",
    );
  });

  it("el desbloqueo secuencial funciona hasta el nodo 8 con un solo nodo activo", () => {
    const { container } = renderStation4();
    enterStation(container);

    for (const node of station4Nodes.slice(0, -1)) {
      advanceToNode(container, node.id);
      expect(
        container.querySelectorAll('[data-node-state="active"]'),
      ).toHaveLength(1);
    }

    fireEvent.click(nodeButton(container, "sonido"));
    advance(1200);
    expect(getState(container)).toBe("station4_chain_completed");
    expect(screen.getByRole("heading", { name: "Sonido" })).toBeInTheDocument();
  });

  it("la acción final hacia Mundo V no existe antes del nodo 8", () => {
    const { container } = renderStation4();
    enterStation(container);

    expect(
      container.querySelector('[data-interstation-qr-action="open"]'),
    ).not.toBeInTheDocument();

    advanceToNode(container, "planta");
    advanceToNode(container, "bionosificador");

    expect(
      container.querySelector('[data-interstation-qr-action="open"]'),
    ).not.toBeInTheDocument();
  });

  it("no permite abrir revisita ni CTA tocando un completed antes de cerrar 1 a 8", () => {
    const { container } = renderStation4();
    enterStation(container);
    advanceToNode(container, "planta");
    advanceToNode(container, "bionosificador");

    const plant = nodeButton(container, "planta");
    expect(plant).toHaveAttribute("data-node-state", "completed");
    expect(plant).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(plant);
    advance(1200);

    expect(getState(container)).toBe("station4_node_2_active");
    expect(nodeButton(container, "esp32")).toHaveAttribute(
      "data-node-state",
      "available",
    );
    expect(
      container.querySelector('[data-interstation-qr-action="open"]'),
    ).not.toBeInTheDocument();
  });

  it("tras el nodo 8 la cadena queda completa y aparece el extremo hacia Mundo V", () => {
    const { container } = renderStation4();
    completeChain(container);

    expect(screen.getByText(station4Lia.revisit)).toBeInTheDocument();

    const exit = screen.getByRole("button", {
      name: "Escanea el QR para abrir Mundo 5",
    });
    expect(exit).toBeInTheDocument();

    fireEvent.click(exit);
    expect(getState(container)).toBe("station4_exiting");
    expect(exit).not.toBeInTheDocument();
    advance(700);

    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-4-to-world-5",
    );
  });

  it("revela la CTA al final del sweep y la habilita solo al estabilizar la cadena", () => {
    const { container } = renderStation4();
    enterStation(container);
    for (const node of station4Nodes) {
      fireEvent.click(nodeButton(container, node.id));
      advance(1200);
    }

    expect(getState(container)).toBe("station4_chain_completed");
    advance(1039);
    expect(
      container.querySelector('[data-interstation-qr-action="open"]'),
    ).not.toBeInTheDocument();
    advance(1);
    expect(
      container.querySelector('[data-interstation-qr-action="open"]'),
    ).not.toBeInTheDocument();
    advance(240);
    expect(
      container.querySelector('[data-interstation-qr-action="open"]'),
    ).toBeEnabled();
  });

  it("en revisión libre los nodos se reabren en cualquier orden sin perder la salida", () => {
    const { container } = renderStation4();
    completeChain(container);

    fireEvent.click(nodeButton(container, "planta"));
    advance(1200);

    expect(getState(container)).toBe("station4_ready_to_exit");
    expect(nodeButton(container, "planta")).toHaveAttribute(
      "data-node-state",
      "active",
    );
    expect(screen.getByRole("heading", { name: "Planta" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Escanea el QR para abrir Mundo 5",
      }),
    ).toBeInTheDocument();

    fireEvent.click(nodeButton(container, "router"));
    advance(300);
    expect(
      container.querySelectorAll('[data-node-state="active"]'),
    ).toHaveLength(1);
    expect(nodeButton(container, "router")).toHaveAttribute(
      "data-node-state",
      "active",
    );
    expect(
      container.querySelector("[data-station4-lia-node='router']"),
    ).toHaveAttribute("data-lia-pose", "explain_calm");
    advance(900);

    expect(screen.getByRole("heading", { name: "Router" })).toBeInTheDocument();
  });

  it("con reduced motion la secuencia se conserva con tiempos mínimos", () => {
    stubReducedMotion(true);
    const { container } = renderStation4();

    advance(180);
    expect(getState(container)).toBe("station4_node_1_available");
    expect(
      container.querySelector("[data-station4-reduced-motion='true']"),
    ).toBeInTheDocument();

    fireEvent.click(nodeButton(container, "planta"));
    advance(200);
    expect(getState(container)).toBe("station4_node_1_active");

    fireEvent.click(nodeButton(container, "bionosificador"));
    advance(200);

    expect(getState(container)).toBe("station4_node_2_active");
    expect(
      screen.getByRole("heading", { name: "Bionosificador" }),
    ).toBeInTheDocument();
  });

  it("registra los 20 assets aprobados con hash canónico y espejo byte-idéntico", async () => {
    expect(world4RuntimeAssetPaths).toHaveLength(20);
    expect(new Set(world4RuntimeAssetPaths).size).toBe(20);
    expect(Object.keys(WORLD4_APPROVED_ASSET_HASHES)).toHaveLength(20);

    await Promise.all(
      world4RuntimeAssetPaths.map(async (assetPath) => {
        const relativePath = assetPath.split("/runtime/")[1];
        const filename = assetPath.split("/").at(-1);
        if (!relativePath || !filename) {
          throw new Error(`Invalid Station IV runtime path: ${assetPath}`);
        }

        const [runtimeBytes, mirrorBytes] = await Promise.all([
          readFile(resolve(process.cwd(), `public${assetPath}`)),
          readFile(
            resolve(
              process.cwd(),
              "public/assets/gvo/current-used/world-4-root",
              relativePath,
            ),
          ),
        ]);
        const expectedHash =
          WORLD4_APPROVED_ASSET_HASHES[
            filename as keyof typeof WORLD4_APPROVED_ASSET_HASHES
          ];

        expect(createHash("sha256").update(runtimeBytes).digest("hex")).toBe(
          expectedHash.toLowerCase(),
        );
        expect(createHash("sha256").update(mirrorBytes).digest("hex")).toBe(
          expectedHash.toLowerCase(),
        );
        expect(runtimeBytes.equals(mirrorBytes)).toBe(true);
      }),
    );
  });

  it("mantiene artboard, anchors normalizados y orden contractual 1 a 8", () => {
    const { container } = renderStation4();
    const stage = container.querySelector("[data-artboard-width]");
    expect(stage).toHaveAttribute(
      "data-artboard-width",
      String(WORLD4_ARTBOARD.width),
    );
    expect(stage).toHaveAttribute(
      "data-artboard-height",
      String(WORLD4_ARTBOARD.height),
    );
    expect(stage).toHaveAttribute("data-stage-aspect-ratio", "3/2");

    const stacks = Array.from(
      container.querySelectorAll<HTMLElement>("[data-station4-stack]"),
    );
    expect(stacks).toHaveLength(8);
    expect(stacks.map((stack) => stack.dataset.station4Stack)).toEqual(
      station4Nodes.map((node) => node.id),
    );
    expect(stacks.map((stack) => Number(stack.dataset.anchorX))).toEqual(
      WORLD4_NODE_ANCHORS.map((anchor) => anchor.x),
    );
    expect(stacks.map((stack) => Number(stack.dataset.anchorY))).toEqual(
      WORLD4_NODE_ANCHORS.map((anchor) => anchor.y),
    );

    for (const anchor of WORLD4_NODE_ANCHORS) {
      expect(anchor.xPercent).toBeCloseTo(
        (anchor.x / WORLD4_ARTBOARD.width) * 100,
        8,
      );
      expect(anchor.yPercent).toBeCloseTo(
        (anchor.y / WORLD4_ARTBOARD.height) * 100,
        8,
      );
    }
  });

  it("renderiza botones nativos ordenados con labels y target mínimo de 44 px", () => {
    const { container } = renderStation4();
    const buttons = Array.from(
      container.querySelectorAll<HTMLButtonElement>("[data-station4-node]"),
    );

    expect(buttons).toHaveLength(8);
    expect(buttons.map((button) => button.tagName)).toEqual(
      Array(8).fill("BUTTON"),
    );
    expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual(
      station4Nodes.map((node) => node.accessibleLabel),
    );
    expect(
      buttons.map((button) => button.getAttribute("data-hit-target-min")),
    ).toEqual(Array(8).fill(String(WORLD4_NODE_STACK.minimumHitTargetCssPx)));
  });

  it("activa el siguiente botón nativo con Enter y Space", () => {
    const { container } = renderStation4();
    enterStation(container);

    fireEvent.keyDown(nodeButton(container, "planta"), {
      key: "Enter",
    });
    advance(1200);
    expect(nodeButton(container, "planta")).toHaveAttribute(
      "data-node-state",
      "active",
    );

    fireEvent.keyDown(nodeButton(container, "bionosificador"), { key: " " });
    advance(1200);
    expect(nodeButton(container, "bionosificador")).toHaveAttribute(
      "data-node-state",
      "active",
    );
  });

  it("recorta el halo aprobado por estado sin mostrar el sprite completo", () => {
    const { container } = renderStation4();
    enterStation(container);

    expect(
      container.querySelector(
        '[data-station4-stack="planta"] [data-halo-cell="0"]',
      ),
    ).toBeInTheDocument();

    fireEvent.click(nodeButton(container, "planta"));
    advance(300);
    expect(
      container.querySelector(
        '[data-station4-stack="planta"] [data-halo-cell="1"]',
      ),
    ).toBeInTheDocument();

    advance(900);
    expect(
      container.querySelector(
        '[data-station4-stack="bionosificador"] [data-halo-cell="0"]',
      ),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-halo-cell]")).toHaveLength(2);
  });

  it("usa anclaje alpha-aware y los ocho tamaños baseline aprobados", () => {
    const { container } = renderStation4();
    const stacks = Array.from(
      container.querySelectorAll<HTMLElement>("[data-station4-stack]"),
    );
    const expectedWidths = station4Nodes.map(
      (node) => world4NodeAssetManifest[node.id].fullCanvasWidth,
    );

    expect(
      stacks.map((stack) => Number(stack.dataset.objectFullCanvasWidth)),
    ).toEqual(expectedWidths);
    expect(expectedWidths).toEqual([112, 96, 98, 88, 84, 84, 92, 102]);
    expect(
      container.querySelectorAll('[data-alpha-aware="visible-bottom-center"]'),
    ).toHaveLength(8);
  });

  it("aplica backplate 9-slice a la tarjeta y conserva todo el copy en DOM", () => {
    const { container } = renderStation4();
    const card = container.querySelector("[data-station4-card]");

    expect(card).toHaveAttribute(
      "data-backplate",
      WORLD4_BACKPLATE_SLICES.textCard.asset,
    );
    expect(card).toHaveAttribute("data-border-image-slice", "128 192 fill");
    expect(card).toHaveTextContent("Paso 1 de 8");
    expect(card).toHaveTextContent(station4Nodes[0].text);
    expect(card?.querySelector("img")).not.toBeInTheDocument();
  });

  it("sustituye el backplate CTA por el gate QR sin alterar la ruta", () => {
    const { container } = renderStation4();
    expect(
      container.querySelector('[data-interstation-qr-action="open"]'),
    ).not.toBeInTheDocument();

    completeChain(container);
    const exit = container.querySelector(
      '[data-interstation-qr-action="open"]',
    );
    expect(exit).toHaveAttribute("data-interstation-qr-action", "open");
    expect(exit).not.toHaveAttribute("data-backplate");

    fireEvent.click(exit as HTMLButtonElement);
    advance(700);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-4-to-world-5",
    );
  });

  it("declara el z-order global y local exactamente como el contrato", () => {
    const { container } = renderStation4();
    enterStation(container);

    expect(Object.values(WORLD4_Z_ORDER)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    for (const layer of [0, 1, 2, 3, 4, 6, 7, 11, 12]) {
      expect(
        container.querySelector(`[data-stage-layer="z${layer}"]`),
      ).toBeInTheDocument();
    }
    expect(container.querySelector('[data-stage-layer="z5"]')).toBeNull();
    const stage = container.querySelector("[data-disabled-stage-layer]");
    expect(stage).toHaveAttribute("data-disabled-stage-layer", "z5");
    expect(stage).toHaveAttribute(
      "data-disabled-runtime-asset",
      world4RuntimeAssets.table.frontEdge,
    );
    expect(stage).toHaveAttribute(
      "data-front-edge-decision",
      WORLD4_RUNTIME_LAYER_DECISIONS.tableFrontEdge,
    );
    expect(stage).toHaveAttribute(
      "data-rear-plane-decision",
      WORLD4_RUNTIME_LAYER_DECISIONS.rearDepthPlane,
    );
    expect(
      container.querySelector(
        `[data-runtime-asset="${world4RuntimeAssets.table.frontEdge}"]`,
      ),
    ).toBeNull();
    expect(container.querySelectorAll('[data-stage-layer="z9"]')).toHaveLength(
      8,
    );
    expect(container.querySelectorAll('[data-stage-layer="z10"]')).toHaveLength(
      8,
    );
    const plantStack = container.querySelector(
      '[data-station4-stack="planta"]',
    );
    expect(
      Array.from(
        plantStack?.querySelectorAll<HTMLElement>("[data-local-layer]") ?? [],
      ).map((element) => element.dataset.localLayer),
    ).toEqual(["z0", "z1", "z2", "z3"]);
  });

  it("declara el contrato responsive sin convertir el espacio libre en gap", async () => {
    const { container } = renderStation4();
    const screenRoot = container.querySelector("[data-layout-contract]");
    const world4RootCss = await readFile(
      resolve(process.cwd(), "src/screens/World4Root/World4RootScreen.css"),
      "utf8",
    );

    expect(screenRoot).toHaveAttribute(
      "data-layout-contract",
      "controls-stage-gap-then-trailing-space",
    );
    expect(screenRoot).toHaveAttribute("data-display-mode", "browser");
    expect(screenRoot).toHaveAttribute("data-visual-viewport-height");
    expect(screenRoot).toHaveAttribute("data-visual-viewport-width");
    expect(screenRoot).toHaveStyle({
      "--s4-visual-viewport-height": `${window.innerHeight}px`,
      "--s4-visual-viewport-width": `${window.innerWidth}px`,
    });
    expect(
      container.querySelector('[data-station4-trailing-space="true"]'),
    ).toBeInTheDocument();

    expect(world4RootCss).toContain(
      "--world4-controls-stage-gap: clamp(10px, 2dvh, 24px)",
    );
    expect(world4RootCss).toContain(
      "grid-template-rows: auto auto auto auto minmax(0, 1fr)",
    );
    expect(world4RootCss).toContain(
      "grid-template-columns: minmax(230px, 0.82fr) minmax(0, 1.18fr)",
    );
    expect(world4RootCss).toContain("@media (display-mode: standalone)");
    expect(world4RootCss).not.toContain("margin-top: auto");
  });

  it("no integra placeholders procedurales ni el master rechazado", async () => {
    const { container } = renderStation4();
    expect(
      container.querySelector("[data-visual-slot]"),
    ).not.toBeInTheDocument();
    expect(container.innerHTML).not.toContain(WORLD4_REJECTED_ASSET_FILENAME);

    const runtimeFiles = await readdir(
      resolve(
        process.cwd(),
        "public/assets/gvo/stations/world-4/system-table/runtime",
      ),
      { recursive: true },
    );
    const mirrorFiles = await readdir(
      resolve(process.cwd(), "public/assets/gvo/current-used/world-4-root"),
      { recursive: true },
    );
    expect(
      runtimeFiles.some((file: string) =>
        String(file).endsWith(WORLD4_REJECTED_ASSET_FILENAME),
      ),
    ).toBe(false);
    expect(
      mirrorFiles.some((file: string) =>
        String(file).endsWith(WORLD4_REJECTED_ASSET_FILENAME),
      ),
    ).toBe(false);
  });

  it("expone la entrada completa, la fase visual y el lock hasta estabilizar nodo 1 disponible", () => {
    const { container } = renderStation4();
    const root = container.querySelector("[data-station4-motion-phase]");

    expect(root).toHaveAttribute("data-station4-motion-phase", "station_enter");
    expect(root).toHaveAttribute("data-station4-input-locked", "true");
    advance(1399);
    expect(getState(container)).toBe("station4_entering");
    advance(1);
    expect(getState(container)).toBe("station4_node_1_available");
    expect(root).toHaveAttribute("data-station4-motion-phase", "idle");
    expect(root).toHaveAttribute("data-station4-input-locked", "false");
  });

  it("renderiza siete tramos, pulso local de nodo 1 y un único FX activo", () => {
    const { container } = renderStation4();
    enterStation(container);

    expect(WORLD4_ROUTE_SEGMENTS).toHaveLength(7);
    expect(
      container.querySelector("[data-world4-route-overlay='018d']"),
    ).toHaveAttribute("data-world4-route-segment-count", "7");

    fireEvent.click(nodeButton(container, "planta"));
    advance(150);
    expect(
      container.querySelector("[data-world4-route-local-pulse='true']"),
    ).toBeInTheDocument();
    advance(150);
    expect(
      container.querySelectorAll("[data-world4-node-fx-active='true']"),
    ).toHaveLength(1);
    expect(
      container.querySelector("[data-world4-fx-node='planta']"),
    ).toHaveAttribute(
      "data-world4-fx-coordinate-space",
      "alpha_bbox_normalized",
    );
    expect(
      container.querySelector("[data-world4-fx-alpha-mask='planta']"),
    ).toHaveAttribute(
      "data-world4-fx-alpha-mask-source",
      "approved-node-raster",
    );
  });

  it("transfiere el tramo anterior y lo deja completed al estabilizar el nodo siguiente", () => {
    const { container } = renderStation4();
    enterStation(container);
    advanceToNode(container, "planta");

    fireEvent.click(nodeButton(container, "bionosificador"));
    advance(150);
    expect(
      container.querySelector("[data-world4-route-active-segment='1']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-world4-route-traveler='1']"),
    ).toBeInTheDocument();

    advance(1050);
    expect(
      container.querySelector("[data-world4-route-completed-count='1']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-world4-route-segment='1']"),
    ).toHaveAttribute("data-world4-route-segment-state", "completed");
  });

  it("mapea los ocho FX semánticos con coordenadas normalizadas y contratos únicos", () => {
    expect(WORLD4_NODE_FX_ORDER).toEqual(station4Nodes.map((node) => node.id));
    expect(Object.values(WORLD4_NODE_FX_CONFIG)).toHaveLength(8);
    expect(
      Object.values(WORLD4_NODE_FX_CONFIG).reduce(
        (sum, config) => sum + config.primitives.length,
        0,
      ),
    ).toBe(48);
    expect(
      WORLD4_NODE_FX_CONFIG.esp32.primitives.find(
        (primitive) => primitive.id === "status-led",
      ),
    ).toMatchObject({ cycles: 2, motion: "blink" });
    expect(
      WORLD4_NODE_FX_CONFIG.midi.primitives.filter((primitive) =>
        primitive.id.startsWith("event-cell-"),
      ),
    ).toHaveLength(6);
    expect(
      WORLD4_NODE_FX_CONFIG.wifi_udp.primitives.filter((primitive) =>
        primitive.id.startsWith("network-arc-"),
      ),
    ).toHaveLength(3);
  });

  it("ejecuta exactamente un FX por paso durante toda la cadena 1 a 8", () => {
    const { container } = renderStation4();
    enterStation(container);

    for (const node of station4Nodes) {
      fireEvent.click(nodeButton(container, node.id));
      advance(300);
      const activeFx = container.querySelectorAll(
        "[data-world4-node-fx-active='true']",
      );
      expect(activeFx).toHaveLength(1);
      expect(activeFx[0]).toHaveAttribute("data-world4-fx-node", node.id);
      advance(900);
    }

    expect(getState(container)).toBe("station4_chain_completed");
    expect(
      container.querySelectorAll("[data-world4-node-fx-active='true']"),
    ).toHaveLength(0);
  });

  it("define ocho posiciones de Lía, espejo sólo en nodos 5 a 8 y una sola guía", () => {
    const { container } = renderStation4();
    enterStation(container);

    expect(Object.keys(WORLD4_LIA_GUIDE_POSITIONS)).toHaveLength(8);
    expect(
      station4Nodes.map((node) => WORLD4_LIA_GUIDE_POSITIONS[node.id].mirror),
    ).toEqual([false, false, false, false, true, true, true, true]);
    expect(container.querySelectorAll("[data-station4-lia]")).toHaveLength(1);
    expect(
      container.querySelector("[data-station4-lia-node='planta']"),
    ).toHaveAttribute("data-station4-lia-motion", "three-keyframe-travel");
  });

  it("mantiene una sola transición ante double tap, triple tap y teclado combinado", () => {
    const { container } = renderStation4();
    enterStation(container);
    const plant = nodeButton(container, "planta");

    fireEvent.click(plant);
    fireEvent.click(plant);
    fireEvent.click(plant);
    fireEvent.keyDown(plant, { key: "Enter" });

    expect(getState(container)).toBe("station4_node_1_activating");
    expect(
      container.querySelector("[data-station4-motion-epoch]"),
    ).toHaveAttribute("data-station4-motion-epoch", "2");
    advance(1200);
    expect(getState(container)).toBe("station4_node_1_active");
    expect(container.querySelector("[data-station4-progress]")).toHaveAttribute(
      "data-station4-progress",
      "1",
    );
  });

  it("intercambia la tarjeta en un live region estable y anuncia un solo DOM final", () => {
    const { container } = renderStation4();
    enterStation(container);
    advanceToNode(container, "planta");
    const card = container.querySelector("[data-station4-card]");

    fireEvent.click(nodeButton(container, "bionosificador"));
    expect(card).toHaveAttribute("data-station4-card-motion", "out");
    advance(180);

    expect(card).toHaveAttribute("data-station4-card", "planta");
    expect(card).toHaveAttribute("data-station4-card-motion", "out");
    advance(200);

    expect(container.querySelector("[data-station4-card]")).toBe(card);
    expect(card).toHaveAttribute("aria-live", "polite");
    expect(card).toHaveAttribute("aria-atomic", "true");
    expect(card).toHaveAttribute("data-station4-card", "bionosificador");
    expect(card).toHaveAttribute("data-station4-card-motion", "in");
    expect(container.querySelectorAll("[data-station4-card]")).toHaveLength(1);
  });

  it("persiste estación 4 una sola vez, completa la ruta y protege doble navegación", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({ completedStations: [1, 2, 3], updatedAt: null }),
    );
    const { container } = renderStation4();
    completeChain(container);

    const storedBeforeQr = JSON.parse(
      window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "{}",
    ) as { completedStations?: number[] };
    expect(storedBeforeQr).toMatchObject({ completedStations: [1, 2, 3] });
    expect(
      container.querySelector("[data-world4-route-completed-count='7']"),
    ).toBeInTheDocument();

    const exit = screen.getByRole("button", {
      name: "Escanea el QR para abrir Mundo 5",
    });
    fireEvent.click(exit);
    fireEvent.click(exit);
    expect(
      JSON.parse(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "{}")
        .completedStations,
    ).toEqual([1, 2, 3, 4]);
    advance(700);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-4-to-world-5",
    );
  });

  it("conserva la cadena completa y permite retry si falla completion global", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({ completedStations: [1, 2, 3], updatedAt: null }),
    );
    const nativeSetItem = Storage.prototype.setItem;
    let storageFails = true;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === GVO_PROGRESS_STORAGE_KEY && storageFails) {
        throw new Error("quota");
      }
      nativeSetItem.call(this, key, value);
    });
    const { container } = renderStation4();

    completeChain(container);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Escanea el QR para abrir Mundo 5",
      }),
    );

    expect(getState(container)).toBe("station4_ready_to_exit");
    expect(
      screen.getByText(
        "No fue posible guardar tu progreso. Intenta nuevamente.",
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-world4-route-completed-count='7']"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/estacion/4",
    );

    storageFails = false;
    fireEvent.click(
      screen.getByRole("button", {
        name: "Escanea el QR para abrir Mundo 5",
      }),
    );
    advance(700);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-4-to-world-5",
    );
  });

  it("persiste un nodo asentado antes de desbloquear el siguiente", () => {
    const { container } = renderStation4();
    enterStation(container);
    advanceToNode(container, "planta");

    expect(
      JSON.parse(
        window.localStorage.getItem(WORLD4_CHECKPOINT_STORAGE_KEY) ?? "null",
      ),
    ).toMatchObject({
      highestSettledIndex: 0,
      resumeMode: "reading",
      schemaVersion: 1,
    });
    expect(nodeButton(container, "bionosificador")).toHaveAttribute(
      "data-node-state",
      "available",
    );
  });

  it.each([
    [-1, "planta"],
    [0, "planta"],
    [3, "midi"],
    [6, "sistema_central"],
  ] as const)(
    "restaura reading index %s con entrada abreviada sin reanudar moving",
    (highestSettledIndex, activeNodeId) => {
      stubReducedMotion(true);
      window.localStorage.setItem(
        WORLD4_CHECKPOINT_STORAGE_KEY,
        JSON.stringify({
          highestSettledIndex,
          resumeMode: "reading",
          schemaVersion: 1,
          updatedAt: "2026-08-05T12:00:00.000Z",
        }),
      );
      const { container } = renderStation4();
      const root = container.querySelector("[data-station4-state]");

      expect(root).toHaveAttribute("data-station4-entry-mode", "abbreviated");
      advance(180);
      expect(root).toHaveAttribute("data-station4-motion-kind", "none");
      expect(root).toHaveAttribute(
        "data-station4-progress",
        String(highestSettledIndex + 1),
      );
      expect(root).toHaveAttribute("data-station4-active-node", activeNodeId);
      expect(getState(container)).not.toContain("activating");
    },
  );

  it("fallo al guardar nodo conserva visual, bloquea input y retry no repite motion", () => {
    const { container } = renderStation4();
    enterStation(container);
    const nativeSetItem = Storage.prototype.setItem;
    let stationWriteFails = true;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === WORLD4_CHECKPOINT_STORAGE_KEY && stationWriteFails) {
        throw new Error("checkpoint quota");
      }
      nativeSetItem.call(this, key, value);
    });

    fireEvent.click(nodeButton(container, "planta"));
    advance(1200);
    const root = container.querySelector("[data-station4-state]");
    expect(root).toHaveAttribute("data-station4-checkpoint-blocked", "true");
    expect(root).toHaveAttribute("data-station4-progress", "0");
    expect(nodeButton(container, "planta")).toHaveAttribute(
      "data-node-state",
      "active",
    );
    expect(nodeButton(container, "bionosificador")).toHaveAttribute(
      "data-node-state",
      "locked",
    );
    expect(screen.getByRole("button", { name: "Reintentar" })).toHaveFocus();
    const epoch = root?.getAttribute("data-station4-motion-epoch");

    stationWriteFails = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(root).toHaveAttribute("data-station4-checkpoint-blocked", "false");
    expect(root).toHaveAttribute("data-station4-progress", "1");
    expect(root).toHaveAttribute("data-station4-motion-epoch", epoch);
    expect(nodeButton(container, "bionosificador")).toHaveAttribute(
      "data-node-state",
      "available",
    );
  });

  it("restaura chain_pending y ejecuta la cadena completa una sola vez", () => {
    stubReducedMotion(true);
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3],
        updatedAt: "2026-08-05T12:00:00.000Z",
      }),
    );
    window.localStorage.setItem(
      WORLD4_CHECKPOINT_STORAGE_KEY,
      JSON.stringify({
        highestSettledIndex: 7,
        resumeMode: "chain_pending",
        schemaVersion: 1,
        updatedAt: "2026-08-05T12:01:00.000Z",
      }),
    );
    const { container } = renderStation4();
    const root = container.querySelector("[data-station4-state]");

    advance(180);
    expect(root).toHaveAttribute("data-station4-motion-kind", "chain");
    const epoch = root?.getAttribute("data-station4-motion-epoch");
    advance(300);
    expect(getState(container)).toBe("station4_ready_to_exit");
    expect(root).toHaveAttribute("data-station4-motion-epoch", epoch);
    expect(
      window.localStorage.getItem(WORLD4_CHECKPOINT_STORAGE_KEY),
    ).not.toBeNull();
    expect(
      JSON.parse(
        window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "null",
      ).completedStations,
    ).toEqual([1, 2, 3]);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Escanea el QR para abrir Mundo 5",
      }),
    );
    expect(
      window.localStorage.getItem(WORLD4_CHECKPOINT_STORAGE_KEY),
    ).toBeNull();
    expect(
      JSON.parse(
        window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "null",
      ).completedStations,
    ).toEqual([1, 2, 3, 4]);
  });

  it("restaura completion_retry sin cadena y retry sólo verifica completion", () => {
    stubReducedMotion(true);
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3],
        updatedAt: "2026-08-05T12:00:00.000Z",
      }),
    );
    window.localStorage.setItem(
      WORLD4_CHECKPOINT_STORAGE_KEY,
      JSON.stringify({
        highestSettledIndex: 7,
        resumeMode: "completion_retry",
        schemaVersion: 1,
        updatedAt: "2026-08-05T12:01:00.000Z",
      }),
    );
    const { container } = renderStation4();
    const root = container.querySelector("[data-station4-state]");

    advance(180);
    expect(getState(container)).toBe("station4_ready_to_exit");
    expect(root).toHaveAttribute("data-station4-motion-kind", "none");
    fireEvent.click(
      screen.getByRole("button", {
        name: "Escanea el QR para abrir Mundo 5",
      }),
    );
    expect(
      window.localStorage.getItem(WORLD4_CHECKPOINT_STORAGE_KEY),
    ).toBeNull();
    expect(
      JSON.parse(
        window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "null",
      ).completedStations,
    ).toEqual([1, 2, 3, 4]);

    advance(180);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-4-to-world-5",
    );
  });

  it("completion global prevalece sobre checkpoint parcial y conserva revisita", () => {
    stubReducedMotion(true);
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3, 4],
        updatedAt: "2026-08-05T12:00:00.000Z",
      }),
    );
    window.localStorage.setItem(
      WORLD4_CHECKPOINT_STORAGE_KEY,
      JSON.stringify({
        highestSettledIndex: 2,
        resumeMode: "reading",
        schemaVersion: 1,
        updatedAt: "2026-08-05T12:01:00.000Z",
      }),
    );
    const { container } = renderStation4();
    advance(180);
    expect(getState(container)).toBe("station4_ready_to_exit");
    expect(container.querySelector("[data-station4-state]")).toHaveAttribute(
      "data-station4-progress",
      "8",
    );
    expect(nodeButton(container, "planta")).toBeEnabled();
  });

  it("recovery explícito preserva global y station1 al eliminar sólo station4", () => {
    const corruptRaw = "{world-four-corrupt::raw";
    window.localStorage.setItem(WORLD4_CHECKPOINT_STORAGE_KEY, corruptRaw);
    window.localStorage.setItem("gvo.station1.v1", "world-one-preserved");
    window.localStorage.setItem(GVO_PROGRESS_STORAGE_KEY, "global-preserved");
    const { container } = renderStation4();

    expect(screen.getByRole("status")).toHaveTextContent(
      "No fue posible recuperar el avance de este mundo.",
    );
    expect(window.localStorage.getItem(WORLD4_CHECKPOINT_STORAGE_KEY)).toBe(
      corruptRaw,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Restablecer avance de este mundo" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Restablecer" }));
    expect(
      window.localStorage.getItem(WORLD4_CHECKPOINT_STORAGE_KEY),
    ).toBeNull();
    expect(window.localStorage.getItem("gvo.station1.v1")).toBe(
      "world-one-preserved",
    );
    expect(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(
      "global-preserved",
    );
    expect(container.querySelector("[data-station4-state]")).toHaveAttribute(
      "data-station4-entry-mode",
      "full",
    );
  });

  it("usa entrada abreviada y revisión completa cuando gvo.progress.v1 ya contiene estación 4", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        completedStations: [4],
        updatedAt: "2026-07-22T00:00:00Z",
      }),
    );
    const { container } = renderStation4();

    expect(
      container.querySelector("[data-station4-entry-mode='abbreviated']"),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-node-state="completed"]'),
    ).toHaveLength(8);
    expect(screen.getByText(station4Lia.revisit)).toBeInTheDocument();
    expect(
      container.querySelector("[data-station4-table-sweep='idle']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-station4-lia-duration-ms='180']"),
    ).toBeInTheDocument();

    advance(300);
    expect(getState(container)).toBe("station4_ready_to_exit");
    expect(
      container.querySelectorAll('[data-node-state="completed"]'),
    ).toHaveLength(8);
    expect(
      container.querySelectorAll('[data-node-state="active"]'),
    ).toHaveLength(0);
    expect(
      screen.getByRole("button", {
        name: "Escanea el QR para abrir Mundo 5",
      }),
    ).toBeInTheDocument();
  });

  it("muestra la mano una vez por sesión tras 1800 ms y la descarta por pointer", () => {
    const anchorRef = createRef<HTMLButtonElement>();
    const storageKey = "gvo:world4:test-tap-hint:018d";
    const { container, rerender } = render(
      <>
        <button ref={anchorRef} type="button">
          Nodo 1
        </button>
        <World4TapHint
          active
          anchorRef={anchorRef}
          reducedMotion={false}
          storageKey={storageKey}
          targetLabel="Paso 1 de 8. Planta."
        />
      </>,
    );

    expect(
      container.querySelector("[data-station4-tap-hint-state='waiting']"),
    ).toHaveAttribute(
      "data-station4-tap-hint-delay-ms",
      String(WORLD4_TAP_HINT_DELAY_MS),
    );
    advance(WORLD4_TAP_HINT_DELAY_MS + 1);
    expect(
      document.body.querySelector("[data-station4-tap-hint-state='visible']"),
    ).toHaveAttribute(
      "data-station4-tap-hint-visible-ms",
      String(WORLD4_TAP_HINT_VISIBLE_MS),
    );
    fireEvent.pointerDown(anchorRef.current!);
    expect(
      document.body.querySelector("[data-station4-tap-hint-state='visible']"),
    ).not.toBeInTheDocument();

    rerender(
      <>
        <button ref={anchorRef} type="button">
          Nodo 1
        </button>
        <World4TapHint
          active
          anchorRef={anchorRef}
          reducedMotion={false}
          storageKey={storageKey}
          targetLabel="Paso 1 de 8. Planta."
        />
      </>,
    );
    advance(WORLD4_TAP_HINT_DELAY_MS + WORLD4_TAP_HINT_VISIBLE_MS + 10);
    expect(
      document.body.querySelector("[data-gvo-gesture-hint='tap']"),
    ).not.toBeInTheDocument();
  });

  it("consume la ayuda si hubo interacción antes de que el nodo 1 estuviera disponible", () => {
    const anchorRef = createRef<HTMLButtonElement>();
    const storageKey = "gvo:world4:test-tap-hint:early-input:018d";
    const hint = (active: boolean) => (
      <>
        <button ref={anchorRef} type="button">
          Nodo 1
        </button>
        <World4TapHint
          active={active}
          anchorRef={anchorRef}
          reducedMotion={false}
          storageKey={storageKey}
          targetLabel="Paso 1 de 8. Planta."
        />
      </>
    );
    const { rerender } = render(hint(false));

    fireEvent.pointerDown(document.body);
    expect(window.sessionStorage.getItem(storageKey)).toBe("1");
    rerender(hint(true));
    advance(WORLD4_TAP_HINT_DELAY_MS + WORLD4_TAP_HINT_VISIBLE_MS + 10);

    expect(
      document.body.querySelector("[data-gvo-gesture-hint='tap']"),
    ).not.toBeInTheDocument();
  });

  it("no muestra la mano mientras la ayuda de orientación está visible", () => {
    const orientationHint = document.createElement("aside");
    orientationHint.dataset.gvoOrientationHint = "compact-portrait";
    document.body.appendChild(orientationHint);
    const anchorRef = createRef<HTMLButtonElement>();
    const storageKey = "gvo:world4:test-tap-hint:orientation:018d";

    const { unmount } = render(
      <>
        <button ref={anchorRef} type="button">
          Nodo 1
        </button>
        <World4TapHint
          active
          anchorRef={anchorRef}
          reducedMotion={false}
          storageKey={storageKey}
          targetLabel="Paso 1 de 8. Planta."
        />
      </>,
    );

    advance(WORLD4_TAP_HINT_DELAY_MS + WORLD4_TAP_HINT_VISIBLE_MS + 10);
    expect(
      document.body.querySelector("[data-gvo-gesture-hint='tap']"),
    ).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(storageKey)).toBeNull();
    unmount();
    orientationHint.remove();
  });

  it("conserva progreso y tarjeta al redimensionar y disparar fullscreen durante motion", () => {
    const { container } = renderStation4();
    enterStation(container);
    fireEvent.click(nodeButton(container, "planta"));
    advance(300);

    act(() => {
      window.dispatchEvent(new Event("resize"));
      window.visualViewport?.dispatchEvent(new Event("resize"));
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    advance(900);

    expect(getState(container)).toBe("station4_node_1_active");
    expect(screen.getByRole("heading", { name: "Planta" })).toBeInTheDocument();
    expect(container.querySelector("[data-station4-progress]")).toHaveAttribute(
      "data-station4-progress",
      "1",
    );
  });

  it("difiere la entrada y sus timers si el documento ya carga oculto", () => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    const { container } = renderStation4();
    const root = container.querySelector("[data-station4-state]");

    expect(root).toHaveAttribute("data-station4-state", "station4_entering");
    expect(root).toHaveAttribute("data-station4-input-locked", "false");
    expect(root).toHaveAttribute("data-station4-document-visibility", "hidden");
    advance(0);
    expect(vi.getTimerCount()).toBe(0);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    act(() => document.dispatchEvent(new Event("visibilitychange")));

    expect(root).toHaveAttribute("data-station4-input-locked", "true");
    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });

  it("limpia timers al desmontar y normaliza la transición si document queda hidden", () => {
    const first = renderStation4();
    enterStation(first.container);
    fireEvent.click(nodeButton(first.container, "planta"));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    first.unmount();
    // jsdom encola a 0 ms el StorageEvent de sessionStorage; no pertenece al
    // controlador y debe drenarse antes de auditar timers de la pantalla.
    advance(0);
    expect(vi.getTimerCount()).toBe(0);

    const second = renderStation4();
    enterStation(second.container);
    fireEvent.click(nodeButton(second.container, "planta"));
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(getState(second.container)).toBe("station4_node_1_active");
    // La escritura verificada del checkpoint encola el StorageEvent de jsdom.
    advance(0);
    expect(vi.getTimerCount()).toBe(0);
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
  });

  it("en reduced motion elimina traveler y movimiento específico sin perder estados", () => {
    stubReducedMotion(true);
    const { container } = renderStation4();
    advance(180);
    fireEvent.click(nodeButton(container, "planta"));
    advance(70);
    expect(
      container.querySelector("[data-world4-route-traveler]"),
    ).not.toBeInTheDocument();
    advance(50);
    const fx = container.querySelector("[data-world4-fx-node='planta']");
    expect(fx).toHaveAttribute("data-world4-fx-reduced-motion", "true");
    expect(fx).toHaveAttribute(
      "data-world4-fx-root-motion",
      "static-highlight",
    );
    advance(80);
    expect(getState(container)).toBe("station4_node_1_active");
  });
});
