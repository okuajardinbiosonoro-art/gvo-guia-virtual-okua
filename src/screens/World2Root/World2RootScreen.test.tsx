import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { worldTwoToWorldThreeTransitionRoute } from "../../app/routes";
import {
  WORLD2_REQUIRED_SLOT_COUNT,
  world2EditorialSlots,
  world2LayerDefinitions,
  type World2LayerId,
} from "../../content/world2EditorialSlots";
import { WORLD2_CHECKPOINT_STORAGE_KEY } from "../../domain/checkpoints/world2Checkpoint";
import { GVO_PROGRESS_STORAGE_KEY } from "../../domain/progress/progress.storage";
import { World2RootScreen } from "./World2RootScreen";
import { world2RuntimeAssets } from "./world2RuntimeAssets";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderWorld2RootScreen() {
  return render(
    <MemoryRouter initialEntries={["/estacion/2"]}>
      <World2RootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function getWorld2Root(container: HTMLElement) {
  const root = container.querySelector<HTMLElement>("[data-world2-state]");

  expect(root).toBeInTheDocument();
  return root;
}

function getLayerButton(container: HTMLElement, layerId: World2LayerId) {
  const button = container.querySelector<HTMLButtonElement>(
    `[data-world2-layer="${layerId}"]`,
  );

  if (!button) {
    throw new Error(`World II layer button not found: ${layerId}`);
  }

  return button;
}

function expectLayerState(
  container: HTMLElement,
  layerId: World2LayerId,
  state: "active" | "completed" | "locked" | "next" | "next-but-gated",
) {
  const button = getLayerButton(container, layerId);

  expect(button).toHaveAttribute("data-layer-state", state);
  expect(button).toHaveAttribute(
    "aria-disabled",
    state === "locked" || state === "next-but-gated" ? "true" : "false",
  );

  return button;
}

function clickLayer(container: HTMLElement, layerId: World2LayerId) {
  fireEvent.click(getLayerButton(container, layerId));
}

function completePlantContactIfVisible(container: HTMLElement) {
  const hotspot = container.querySelector<HTMLButtonElement>(
    '[data-plant-contact-hotspot="016J"]',
  );

  if (hotspot && hotspot.getAttribute("aria-expanded") !== "true") {
    fireEvent.click(hotspot);
  }
}

function completeSignalWaveIfVisible(container: HTMLElement) {
  const signalRevealControl = container.querySelector<HTMLElement>(
    '[data-world2-signal-reveal-control="onda-medida"]',
  );

  if (signalRevealControl) {
    fireEvent.click(signalRevealControl);
  }
}

function completeCaptureDataIfVisible(container: HTMLElement) {
  const captureTimeline = container.querySelector<HTMLElement>(
    '[data-world2-capture-timeline="016R"]',
  );

  if (
    captureTimeline &&
    captureTimeline.getAttribute("data-world2-capture-complete") !== "true"
  ) {
    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar paso 2: Señal tomada",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar paso 3: Datos al sistema",
      }),
    );
  }
}

function swipeCaptureZone(zone: HTMLElement, fromX: number, toX: number) {
  fireEvent.pointerDown(zone, {
    button: 0,
    clientX: fromX,
    clientY: 120,
    isPrimary: true,
    pointerId: 1,
  });
  fireEvent.pointerUp(zone, {
    button: 0,
    clientX: toX,
    clientY: 122,
    isPrimary: true,
    pointerId: 1,
  });
}

function expectLiaProfile(
  container: HTMLElement,
  layerProfile: string,
  attentionTarget: string,
) {
  const liaActor = container.querySelector<HTMLElement>(
    `[data-lia-layer-profile="${layerProfile}"]`,
  );

  expect(liaActor).toBeInTheDocument();
  expect(liaActor).toHaveAttribute("data-world2-lia-actor", "015V");
  expect(liaActor).toHaveAttribute(
    "data-lia-attention-target",
    attentionTarget,
  );
  expect(liaActor).toHaveAttribute("data-lia-placement");
  expect(liaActor).toHaveAttribute("data-lia-motion-profile");
}

function progressToLayer(container: HTMLElement, targetLayerId: World2LayerId) {
  const order: World2LayerId[] = [
    "senal",
    "captura",
    "acondicionamiento",
    "mapeo",
    "resultado_mediado",
  ];

  for (const layerId of order) {
    if (layerId === "senal") {
      completePlantContactIfVisible(container);
    }

    if (layerId === "captura") {
      completeSignalWaveIfVisible(container);
    }

    if (layerId === "acondicionamiento") {
      completeCaptureDataIfVisible(container);
    }

    clickLayer(container, layerId);

    if (layerId === targetLayerId) {
      return;
    }
  }
}

describe("World2RootScreen", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    cleanup();
  });

  it("016P ancla el hint de Punto de lectura y no lo repite al completar", () => {
    vi.useFakeTimers();
    const { container } = renderWorld2RootScreen();
    const hint = document.querySelector(".world2-gesture-hint--plant-contact");
    const target = screen.getByRole("button", {
      name: "Abrir Punto de lectura",
    });

    expect(hint).toHaveAttribute("data-gvo-gesture-state", "waiting");
    expect(hint).toHaveAttribute("data-gvo-gesture-anchor", "target-ref");
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "waiting");
    act(() => vi.advanceTimersByTime(2800));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "visible");
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "visible");

    fireEvent.click(target);
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "completed");
    act(() => vi.advanceTimersByTime(5000));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");

    clickLayer(container, "senal");
    clickLayer(container, "planta_viva");
    expect(
      document.querySelector(".world2-gesture-hint--plant-contact"),
    ).toHaveAttribute("data-gvo-gesture-state", "completed");
  });

  it("016P ancla Onda medida y preserva su ciclo idle/completed y gate", () => {
    vi.useFakeTimers();
    const { container } = renderWorld2RootScreen();
    completePlantContactIfVisible(container);
    clickLayer(container, "senal");

    const hint = document.querySelector(".world2-gesture-hint--signal-wave");
    const target = container.querySelector(
      '[data-world2-signal-reveal-control="onda-medida"]',
    );
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "waiting");
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "waiting");
    act(() => vi.advanceTimersByTime(2800));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "visible");
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "visible");

    fireEvent.click(target as HTMLElement);
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");
    expect(target).toHaveAttribute("data-gvo-gesture-attention", "completed");
    expectLayerState(container, "captura", "next");
  });

  it("016R avanza y retrocede por swipe, completa el gate y no repite el hint", () => {
    vi.useFakeTimers();
    const { container } = renderWorld2RootScreen();

    progressToLayer(container, "captura");

    const timeline = container.querySelector<HTMLElement>(
      '[data-world2-capture-timeline="016R"]',
    );
    const swipeZone = container.querySelector<HTMLElement>(
      '[data-world2-capture-interaction="swipe-timeline"]',
    );
    const hint = document.querySelector(".world2-gesture-hint--capture-swipe");

    expect(timeline).toHaveAttribute("data-world2-capture-step", "contact");
    expect(timeline).toHaveAttribute("data-world2-capture-visited", "contact");
    expect(swipeZone).toHaveAttribute("data-gvo-gesture-attention", "waiting");
    expect(hint).toHaveAttribute("data-gvo-gesture-hint", "swipe-horizontal");
    expect(hint).toHaveAttribute("data-gvo-gesture-direction", "left");
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "waiting");
    expectLayerState(container, "acondicionamiento", "next-but-gated");

    act(() => vi.advanceTimersByTime(2800));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "visible");

    swipeCaptureZone(swipeZone as HTMLElement, 260, 150);
    expect(timeline).toHaveAttribute("data-world2-capture-step", "signal");
    expect(timeline).toHaveAttribute(
      "data-world2-capture-visited",
      "contact,signal",
    );
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");
    expectLayerState(container, "acondicionamiento", "next-but-gated");

    swipeCaptureZone(swipeZone as HTMLElement, 260, 140);
    expect(timeline).toHaveAttribute("data-world2-capture-step", "system");
    expect(timeline).toHaveAttribute(
      "data-world2-capture-visited",
      "contact,signal,system",
    );
    expect(timeline).toHaveAttribute("data-world2-capture-complete", "true");
    expectLayerState(container, "acondicionamiento", "next");

    swipeCaptureZone(swipeZone as HTMLElement, 120, 240);
    expect(timeline).toHaveAttribute("data-world2-capture-step", "signal");
    expect(timeline).toHaveAttribute("data-world2-capture-complete", "true");
    expectLayerState(container, "acondicionamiento", "next");

    clickLayer(container, "acondicionamiento");
    clickLayer(container, "captura");
    const revisitedHint = document.querySelector(
      ".world2-gesture-hint--capture-swipe",
    );
    expect(revisitedHint).toHaveAttribute(
      "data-gvo-gesture-state",
      "completed",
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(revisitedHint).toHaveAttribute(
      "data-gvo-gesture-state",
      "completed",
    );
  });

  it("016R ofrece controles 1/2/3 sin desbloquear antes de visitar todos", () => {
    const { container } = renderWorld2RootScreen();

    progressToLayer(container, "captura");

    const timeline = container.querySelector<HTMLElement>(
      '[data-world2-capture-timeline="016R"]',
    );
    const contactControl = screen.getByRole("button", {
      name: "Mostrar paso 1: Contacto",
    });
    const signalControl = screen.getByRole("button", {
      name: "Mostrar paso 2: Señal tomada",
    });
    const systemControl = screen.getByRole("button", {
      name: "Mostrar paso 3: Datos al sistema",
    });

    expect(contactControl).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(systemControl);
    expect(timeline).toHaveAttribute("data-world2-capture-step", "contact");
    expectLayerState(container, "acondicionamiento", "next-but-gated");
    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar paso 2: Señal tomada",
      }),
    );
    fireEvent.click(systemControl);
    expect(timeline).toHaveAttribute("data-world2-capture-step", "system");
    expect(timeline).toHaveAttribute(
      "data-world2-capture-visited",
      "contact,signal,system",
    );
    expectLayerState(container, "acondicionamiento", "next");

    fireEvent.click(contactControl);
    expect(timeline).toHaveAttribute("data-world2-capture-step", "contact");
    fireEvent.click(signalControl);
    expect(timeline).toHaveAttribute("data-world2-capture-step", "signal");
    expect(timeline).toHaveAttribute("data-world2-capture-complete", "true");
    expectLayerState(container, "acondicionamiento", "next");
  });

  it("renderiza una estación inmersiva sin plantilla beige ni texto TEMP visible", () => {
    const { container } = renderWorld2RootScreen();

    expect(
      screen.getByRole("heading", {
        name: "Lía y el pulso invisible",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("ESTACIÓN II")).toBeInTheDocument();
    expect(screen.getByText("MUNDO II")).toBeInTheDocument();
    expect(
      screen.queryByText("Sin audio · Sin Internet · Mobile-first"),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".mobile-shell")).not.toBeInTheDocument();
    expect(container.querySelector(".base-panel")).not.toBeInTheDocument();
    expect(container.textContent).not.toContain("TEMP");
    expect(Object.keys(world2EditorialSlots)).toHaveLength(
      WORLD2_REQUIRED_SLOT_COUNT,
    );
    expect(
      Object.values(world2EditorialSlots).every(
        (slot) => slot.status === "TEMP",
      ),
    ).toBe(true);
    expect(container.querySelector("[data-world2-experience]")).toHaveAttribute(
      "data-world2-experience",
      "option6-closure-centering-post-completion-revisit-fix-r2",
    );
    expect(
      container.querySelector("[data-world2-runtime-version]"),
    ).toHaveAttribute("data-world2-runtime-version", "016V-R2");
    expect(
      container.querySelector("[data-world2-option12-visual-polish]"),
    ).toHaveAttribute("data-world2-option12-visual-polish", "016K");
    expect(
      container.querySelector("[data-world2-option3-capture-final-polish]"),
    ).toHaveAttribute("data-world2-option3-capture-final-polish", "016L");
    expect(
      container.querySelector("[data-world2-option3-capture-swipe-timeline]"),
    ).toHaveAttribute("data-world2-option3-capture-swipe-timeline", "016R");
    expect(
      container.querySelector("[data-world2-responsive-parity]"),
    ).toHaveAttribute("data-world2-responsive-parity", "016M");
    expect(container.querySelector("[data-world2-legibility]")).toHaveAttribute(
      "data-world2-legibility",
      "debt-008-responsive",
    );
    expect(
      container.querySelector("[data-world2-required-interactions]"),
    ).toHaveAttribute("data-world2-required-interactions", "016R");
    expect(container.querySelector("[data-capture-cinema]")).toHaveAttribute(
      "data-capture-cinema",
      "016R",
    );
    expect(
      container.querySelector("[data-world2-completed-required-interactions]"),
    ).toHaveAttribute("data-world2-completed-required-interactions", "none");
    expect(container.querySelector("[data-world2-layout]")).toHaveAttribute(
      "data-world2-layout",
      "adaptive-zones",
    );
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "planta_viva",
    );
    expect(
      container.querySelector("[data-world2-current-layer]"),
    ).toHaveAttribute("data-world2-current-layer", "1");
    expect(
      container.querySelector("[data-world2-highest-unlocked-layer]"),
    ).toHaveAttribute("data-world2-highest-unlocked-layer", "2");
    expect(
      container.querySelector("[data-world2-visited-layers]"),
    ).toHaveAttribute("data-world2-visited-layers", "1");
    expect(container.querySelector("[data-world2-slot-count]")).toHaveAttribute(
      "data-world2-slot-count",
      "32",
    );
    expect(
      container.querySelector("[data-sensitive-permissions]"),
    ).toHaveAttribute("data-sensitive-permissions", "blocked");
    expect(container.querySelector("[data-qr-camera]")).toHaveAttribute(
      "data-qr-camera",
      "blocked",
    );
    expect(
      container.querySelector("[data-world2-zone='scene']"),
    ).toHaveAttribute("data-active-layer", "1");
    expect(
      container.querySelector("[data-world2-zone='scene']"),
    ).toHaveAttribute("data-world2-focus-profile", "planta_viva");
    expect(
      container.querySelector("[data-world2-zone='scene']"),
    ).toHaveAttribute("data-world2-focus-target", "plant-contact");
    expect(
      container.querySelector("[data-world2-zone='scene']"),
    ).toHaveAttribute("data-world2-cinematic-layer-focus", "015V");
    expect(
      container.querySelector("[data-world2-semantic-focus='planta_viva']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-text-sweep='planta_viva']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-critical-assets-ready]"),
    ).toHaveAttribute("data-critical-assets-ready", "true");
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelector("[data-lia-source]")).toHaveAttribute(
      "data-lia-source",
      "repo-existing-2-5d",
    );
    expect(container.querySelector("[data-world2-lia-actor]")).toHaveAttribute(
      "data-world2-lia-actor",
      "015V",
    );
    expect(container.querySelector("[data-lia-layer-profile]")).toHaveAttribute(
      "data-lia-layer-profile",
      "plant-observer",
    );
    expect(container.querySelector("[data-lia-layer-id]")).toHaveAttribute(
      "data-lia-layer-id",
      "planta_viva",
    );
    expect(
      container.querySelector("[data-lia-attention-target]"),
    ).toHaveAttribute("data-lia-attention-target", "plant-contact");
    expect(
      container.querySelector("[data-lia-motion-profile]"),
    ).toHaveAttribute("data-lia-motion-profile", "plant-observer");
    expect(
      container.querySelector("[data-world2-lia-shimmer='015V']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-label-system]"),
    ).toHaveAttribute("data-world2-label-system", "015V");
    expect(container.querySelector("[data-world2-nav-mode]")).toHaveAttribute(
      "data-world2-nav-mode",
      "stable-visible-row",
    );
    expect(
      container.querySelector("[data-world2-nav-state]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-nav-toggle]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(".world2-layer-nav [aria-expanded]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-label-anchor='plant-contact']"),
    ).toBeInTheDocument();
    expect(screen.getByText("punto de lectura")).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.background}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plant}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plantStageAnchor}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plantAura}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plantBioelectricContactNode}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.liaHalo}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.dialogueCard}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".world2-dialogue__safe"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".world2-dialogue__copy-block"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.layerNavTokenBase}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.layerNavFrame}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.routeBase}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.liaActivate}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Siguiente" }),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(".world2-micro-scene"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalOriginContact}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.liaGestureSpark}"]`,
      ),
    ).not.toBeInTheDocument();
  });

  it("inicia con solo capa 1 activa y muestra mensaje suave al tocar una capa bloqueada", () => {
    const { container } = renderWorld2RootScreen();

    expectLayerState(container, "planta_viva", "active");
    expectLayerState(container, "senal", "next-but-gated");
    expectLayerState(container, "captura", "locked");
    expect(
      screen.getByRole("button", {
        name: "Capa 2 de 6. Señal bioeléctrica. Primero toca Punto de lectura.",
      }),
    ).toHaveAttribute("data-layer-locked", "true");
    expect(
      screen.getByRole("button", {
        name: "Capa 3 de 6. Captura. bloqueado.",
      }),
    ).toHaveAttribute("data-layer-locked", "true");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Capa 2 de 6. Señal bioeléctrica. Primero toca Punto de lectura.",
      }),
    );

    expect(
      screen.getByText("Primero toca Punto de lectura."),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "planta_viva",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Capa 3 de 6. Captura. bloqueado.",
      }),
    );

    expect(
      screen.getByText("Primero necesitamos entender la capa anterior."),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "planta_viva",
    );
  });

  it("016R conserva los gates 016J y completa Captura al visitar tres pasos", () => {
    const { container } = renderWorld2RootScreen();
    const root = () => getWorld2Root(container);
    const scene = () =>
      container.querySelector<HTMLElement>("[data-world2-zone='scene']");

    expect(root()).toHaveAttribute("data-world2-required-interactions", "016R");
    expect(root()).toHaveAttribute(
      "data-world2-completed-required-interactions",
      "none",
    );
    expectLayerState(container, "senal", "next-but-gated");

    clickLayer(container, "senal");

    expect(
      screen.getByText("Primero toca Punto de lectura."),
    ).toBeInTheDocument();
    expect(root()).toHaveAttribute("data-world2-state", "planta_viva");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Abrir Punto de lectura",
      }),
    );

    expect(screen.getByText("Punto de lectura")).toBeInTheDocument();
    expect(scene()).toHaveAttribute(
      "data-plant-contact-readout-state",
      "expanded",
    );
    expect(
      screen.getByText(
        "Este punto marca el primer contacto entre la planta y el sistema. Aquí todavía no hay música: solo se prepara la lectura de una pequeña variación bioeléctrica que después será interpretada.",
      ),
    ).toBeInTheDocument();
    expectLayerState(container, "senal", "next");

    clickLayer(container, "senal");

    expect(root()).toHaveAttribute("data-world2-state", "senal");
    expectLayerState(container, "captura", "next-but-gated");

    clickLayer(container, "captura");

    expect(screen.getByText("Primero toca Onda medida.")).toBeInTheDocument();
    expect(root()).toHaveAttribute("data-world2-state", "senal");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Expandir señal medida",
      }),
    );

    expect(
      container.querySelector('[data-world2-signal-readout="expanded"]'),
    ).toHaveTextContent(
      "Desde el contacto con la planta emergen variaciones eléctricas sutiles. Aunque no se ven ni se escuchan directamente, ya contienen información viva: pequeños cambios y pausas que el sistema empieza a reconocer antes de transformarlos en datos y, más adelante, en sonido.",
    );
    expect(root()).toHaveAttribute(
      "data-world2-completed-required-interactions",
      "plant_contact_readout_seen,signal_measured_wave_seen",
    );
    expectLayerState(container, "captura", "next");

    clickLayer(container, "captura");

    expectLayerState(container, "acondicionamiento", "next-but-gated");
    clickLayer(container, "acondicionamiento");
    expect(
      screen.getByText("Primero recorre los tres pasos de Captura."),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar paso 2: Señal tomada",
      }),
    );
    expectLayerState(container, "acondicionamiento", "next-but-gated");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar paso 3: Datos al sistema",
      }),
    );

    expect(root()).toHaveAttribute(
      "data-world2-completed-required-interactions",
      "plant_contact_readout_seen,signal_measured_wave_seen,capture_data_readout_seen",
    );
    expectLayerState(container, "acondicionamiento", "next");

    clickLayer(container, "planta_viva");

    expectLayerState(container, "senal", "completed");

    clickLayer(container, "senal");

    expectLayerState(container, "captura", "completed");
    expect(getLayerButton(container, "captura")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
  });

  it("avanza por tokens inferiores, permite revisión libre y llega a ready_to_continue", () => {
    vi.useFakeTimers();
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({ completedStations: [1], updatedAt: null }),
    );
    const { container } = renderWorld2RootScreen();
    const getState = () =>
      container
        .querySelector("[data-world2-state]")
        ?.getAttribute("data-world2-state");

    const expectedDialogueByLayer = [
      "La planta está viva antes de cualquier dato. Su pulso aún no es música: es presencia, variación y cuidado.",
      "La variación aparece como una señal pequeña. Todavía no canta: primero debe ser leída.",
      "El sistema recibe el pulso sin convertirlo aún. Capturar es sostener la señal para poder comprenderla.",
      "El pulso se limpia y se ordena. No cambia su origen: gana una forma que puede viajar.",
      "La señal encuentra correspondencias. Algunos cambios se vuelven altura, ritmo, brillo o silencio.",
      "Lo que escuchamos no sale directo de la planta. Es una traducción sensible entre vida, datos y escucha.",
    ];

    for (const [index, layer] of world2LayerDefinitions.entries()) {
      expect(getState()).toBe(layer.id);
      if (layer.id === "resultado_mediado") {
        expect(
          container.querySelector(
            '[data-world2-dialogue-suppressed="option6-sequence"]',
          ),
        ).toBeInTheDocument();
      } else {
        expect(
          screen.getByText(expectedDialogueByLayer[index]),
        ).toBeInTheDocument();
      }

      if (index < world2LayerDefinitions.length - 1) {
        const nextLayer = world2LayerDefinitions[index + 1];

        if (layer.id === "planta_viva") {
          completePlantContactIfVisible(container);
        }

        if (layer.id === "senal") {
          completeSignalWaveIfVisible(container);
        }

        if (layer.id === "captura") {
          completeCaptureDataIfVisible(container);
        }

        if (layer.id === "mapeo") {
          act(() => vi.advanceTimersByTime(9600));
        }

        fireEvent.click(
          screen.getByRole("button", {
            name: `Siguiente capa. Capa ${nextLayer.order} de 6. ${layerCopyLabelForTest(
              nextLayer.id,
            )} disponible.`,
          }),
        );

        expect(
          container.querySelector(`[data-world2-layer="${layer.id}"]`),
        ).toHaveAttribute("data-layer-state", "completed");
        expect(
          container.querySelector(`[data-world2-layer="${nextLayer.id}"]`),
        ).toHaveAttribute("data-layer-state", "active");
      } else {
        expect(getState()).toBe("resultado_mediado");
        act(() => vi.advanceTimersByTime(8999));
        expect(getState()).toBe("resultado_mediado");
        act(() => vi.advanceTimersByTime(1));
      }
    }

    expect(getState()).toBe("ready_to_continue");
    expect(
      screen.getByText(
        "El pulso invisible ya está mediado. Podemos continuar con el recorrido.",
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.liaActivate}"]`,
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Capa 2 de 6. Señal bioeléctrica. completado.",
      }),
    );
    expect(
      screen.getByText(
        "Puedes revisar cualquier capa ya abierta sin perder el recorrido.",
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-world2-option6-mode="final-sonic-convergence"]',
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-world2-closure-layout="centered-balanced"]',
      ),
    ).not.toBeInTheDocument();
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-active-layer-content",
      "signal",
    );
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-option6-overlay-visible",
      "false",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Capa 6 de 6. Resultado mediado. completado.",
      }),
    );
    expect(
      container.querySelector(
        '[data-world2-closure-layout="centered-balanced"]',
      ),
    ).toBeInTheDocument();

    const continueButton = screen.getByRole("button", {
      name: "Continuar",
    });

    expect(continueButton).toHaveAttribute(
      "data-world2-exit-action",
      "navigate_to_transition",
    );
    fireEvent.click(continueButton);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-2-to-world-3",
    );
    expect(
      JSON.parse(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "{}"),
    ).toMatchObject({ schemaVersion: 1, completedStations: [1, 2] });
  });

  it("no marca por capas parciales y reintenta sólo la escritura del cierre", () => {
    vi.useFakeTimers();
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({ completedStations: [1], updatedAt: null }),
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
    const { container } = renderWorld2RootScreen();

    progressToLayer(container, "mapeo");
    expect(
      JSON.parse(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "{}")
        .completedStations,
    ).toEqual([1]);
    act(() => vi.advanceTimersByTime(9600));
    clickLayer(container, "resultado_mediado");
    act(() => vi.advanceTimersByTime(9000));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(
      screen.getByText(
        "No fue posible guardar tu progreso. Intenta nuevamente.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toHaveFocus();
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/estacion/2",
    );

    storageFails = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      worldTwoToWorldThreeTransitionRoute,
    );
  });

  it("016V-R2 permite revisar capas 1 a 5 y volver al cierre sin repetir la secuencia", () => {
    vi.useFakeTimers();
    const { container } = renderWorld2RootScreen();
    progressToLayer(container, "mapeo");
    act(() => vi.advanceTimersByTime(9600));
    clickLayer(container, "resultado_mediado");

    act(() => vi.advanceTimersByTime(9000));
    const root = () => getWorld2Root(container);
    expect(root()).toHaveAttribute("data-world2-state", "ready_to_continue");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "6");

    const expectedContent: Record<World2LayerId, string> = {
      acondicionamiento: "conditioning",
      captura: "capture",
      mapeo: "mapping",
      planta_viva: "plant",
      resultado_mediado: "result",
      senal: "signal",
    };
    const componentSelectors: Partial<Record<World2LayerId, string>> = {
      acondicionamiento: '[data-conditioning-cinema="016T-R2"]',
      captura: '[data-world2-capture-timeline="016R"]',
      mapeo: '[data-mapping-pedagogy="016U-R5"]',
      planta_viva: '[data-plant-contact-hotspot="016J"]',
      senal: '[data-signal-cinema="016J"]',
    };

    for (const layerId of [
      "planta_viva",
      "senal",
      "captura",
      "acondicionamiento",
      "mapeo",
    ] as World2LayerId[]) {
      clickLayer(container, layerId);
      expect(root()).toHaveAttribute(
        "data-world2-active-layer-content",
        expectedContent[layerId],
      );
      expect(root()).toHaveAttribute(
        "data-world2-option6-overlay-visible",
        "false",
      );
      expect(
        container.querySelector(
          '[data-world2-option6-mode="final-sonic-convergence"]',
        ),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-world2-closure-layout="centered-balanced"]',
        ),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(componentSelectors[layerId] ?? "never"),
      ).toBeInTheDocument();
      expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "6");
    }

    clickLayer(container, "resultado_mediado");
    expect(root()).toHaveAttribute("data-world2-state", "ready_to_continue");
    expect(root()).toHaveAttribute(
      "data-world2-active-layer-content",
      "closure",
    );
    expect(root()).toHaveAttribute(
      "data-world2-option6-overlay-visible",
      "true",
    );
    expect(
      container.querySelector('[data-world2-option6-complete="true"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-world2-closure-layout="centered-balanced"]',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });

  it("016K preserva base 016H, safe-area 016I y desbloquea Captura con Onda medida", () => {
    vi.useFakeTimers();
    const { container } = renderWorld2RootScreen();
    const scene = () =>
      container.querySelector<HTMLElement>("[data-world2-zone='scene']");

    expectLiaProfile(container, "plant-observer", "plant-contact");
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalOriginContact}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.liaGestureSpark}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-signal-cinema]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-signal-cable]"),
    ).not.toBeInTheDocument();
    const plantHotspot = screen.getByRole("button", {
      name: "Abrir Punto de lectura",
    });
    expect(plantHotspot).toHaveAttribute("data-plant-contact-hotspot", "016J");
    expect(plantHotspot).toHaveAttribute(
      "data-plant-contact-readout-state",
      "idle",
    );
    expect(plantHotspot).toHaveAttribute("aria-expanded", "false");
    expectLayerState(container, "senal", "next-but-gated");

    fireEvent.click(plantHotspot);

    expect(plantHotspot).toHaveAttribute(
      "data-plant-contact-readout-state",
      "expanded",
    );
    expect(plantHotspot).toHaveAttribute("aria-expanded", "true");
    expect(
      container.querySelector(
        '[data-world2-required-interaction="plant_contact_readout_seen"]',
      ),
    ).toHaveTextContent("Punto de lectura");
    expect(
      container.querySelector("[data-world2-completed-required-interactions]"),
    ).toHaveAttribute(
      "data-world2-completed-required-interactions",
      "plant_contact_readout_seen",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Siguiente capa. Capa 2 de 6. Señal bioeléctrica disponible.",
      }),
    );

    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "senal",
    );
    expectLiaProfile(
      container,
      "signal-witness-r2",
      "clean-technical-waveform",
    );
    const signalLiaActor = container.querySelector<HTMLElement>(
      '[data-lia-layer-profile="signal-witness-r2"]',
    );
    expect(signalLiaActor).toHaveAttribute(
      "data-lia-motion-profile",
      "signal-witness",
    );
    expect(signalLiaActor).toHaveAttribute(
      "data-lia-layer-profile",
      "signal-witness-r2",
    );
    expect(
      container.querySelector('[data-world2-lia-microanimation="015Y"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-lia-motion-profile="signal-attentive-microblink"]',
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-lia-microblink]"),
    ).not.toBeInTheDocument();
    expect(scene()).toHaveAttribute("data-active-layer", "2");
    expect(scene()).toHaveAttribute("data-world2-focus-profile", "senal");
    expect(scene()).toHaveAttribute(
      "data-world2-focus-target",
      "clean-technical-waveform",
    );
    expect(
      container.querySelector("[data-world2-semantic-focus='senal']"),
    ).toBeInTheDocument();
    const signalCinema = container.querySelector<HTMLElement>(
      '[data-signal-cinema="016J"]',
    );
    expect(signalCinema).toBeInTheDocument();
    expect(
      container.querySelectorAll("[data-signal-cinema='016J']"),
    ).toHaveLength(1);
    expect(signalCinema).not.toHaveAttribute("data-world2-signal-cable");
    expect(signalCinema).toHaveAttribute("data-signal-reveal-state", "idle");
    expect(signalCinema).toHaveAttribute(
      "data-world2-signal-base-mode",
      "static-unified-probe-leaf-attached",
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-signal-contact-alignment",
      "probe-to-plant",
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-signal-expanded-mode",
      "scene-focus-large-projected-waveform-moving-alpha-mask",
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-signal-contact-source",
      "unified-image-asset",
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-primary-signal-asset",
      world2RuntimeAssets.signalProbeCableWaveformUnified,
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-signal-read-style",
      "scene-focus-large-projected-waveform-moving-alpha-mask",
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-signal-readout-safe-area",
      "016I",
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-expanded-signal-asset",
      world2RuntimeAssets.signalWaveformCleanTechnical,
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-signal-scan",
      "moving-alpha-mask",
    );
    expect(signalCinema).toHaveAttribute(
      "data-world2-reduced-motion-safe",
      "visible-content",
    );
    expect(
      signalCinema?.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalProbeCableWaveformUnified}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        '.world2-signal-cinema__static-base[data-world2-signal-base="static-unified-probe-leaf-attached"]',
      ),
    ).toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        '[data-world2-signal-projection="expanded-clean-waveform"]',
      ),
    ).toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        ".world2-signal-cinema__projected-wave--base[data-runtime-asset]",
      ),
    ).toHaveAttribute(
      "data-runtime-asset",
      world2RuntimeAssets.signalWaveformCleanTechnical,
    );
    expect(
      signalCinema?.querySelector(
        '.world2-signal-cinema__projected-wave--scan[data-world2-signal-scan="moving-alpha-mask"]',
      ),
    ).toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        '[data-world2-signal-reveal="projected-clean-waveform"]',
      ),
    ).toBeInTheDocument();
    expect(
      signalCinema?.querySelector("[data-world2-signal-focus]"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector("[data-world2-signal-tracer]"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(".world2-signal-cinema__tracer"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(".world2-signal-cinema__focus-band"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(".world2-signal-probe-assembly"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector("[data-world2-signal-probe-assembly]"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector("[data-world2-cable-stroke]"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector("[data-signal-cable-start-anchor]"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(".world2-signal-cable"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(".world2-signal-reference-cable"),
    ).not.toBeInTheDocument();
    expect(signalCinema?.querySelector("svg")).not.toBeInTheDocument();
    const unifiedAsset = signalCinema?.querySelector(
      '.world2-signal-cinema__static-base[data-world2-visual-role="unified-probe-cable-waveform"]',
    );
    expect(unifiedAsset).toBeInTheDocument();
    expect(
      signalCinema?.querySelectorAll(".world2-signal-cinema__static-base"),
    ).toHaveLength(1);
    expect(
      signalCinema?.querySelectorAll(".world2-signal-cinema__projected-wave"),
    ).toHaveLength(2);
    expect(
      signalCinema?.querySelector(".world2-signal-cinema__unified"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-world2-signal-cable="016B-reference-s-curve"]',
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-world2-signal-cable="015Y"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-world2-signal-cable="015Z"]'),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector("[data-world2-signal-cable-bead]"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        '[data-world2-signal-origin="unified-probe-cable"]',
      ),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        '[data-world2-visual-role="signal-electrode"]',
      ),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plantBioelectricContactNode}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalOriginContact}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(".world2-micro-label"),
    ).toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        '[data-world2-label-anchor="signal-waveform"]',
      ),
    ).toBeInTheDocument();
    const revealControl = signalCinema?.querySelector<HTMLElement>(
      '[data-world2-signal-reveal-control="onda-medida"]',
    );
    expect(revealControl).toBeInTheDocument();
    expect(
      signalCinema?.querySelector('[data-world2-signal-cue="onda-medida"]'),
    ).toBeInTheDocument();
    expect(
      signalCinema?.querySelector("[data-world2-signal-readout]"),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        '[class*="lens"], [class*="magnifier"], [class*="callout-arrow"]',
      ),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.pulseCore}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plantBioelectricContactNode}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalOriginContact}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalProbeCableWaveformUnified}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      signalCinema?.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalWaveformCleanTechnical}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.rawWaveform}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.liaGestureSpark}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.captureAcquisitionChain}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-nav-state]"),
    ).not.toBeInTheDocument();

    fireEvent.click(revealControl as HTMLElement);

    expect(signalCinema).toHaveAttribute(
      "data-signal-reveal-state",
      "expanded",
    );
    expect(
      signalCinema?.querySelector('[data-world2-signal-readout="expanded"]'),
    ).toHaveTextContent("Onda medida");
    expect(
      signalCinema?.querySelector('[data-world2-signal-readout="expanded"]'),
    ).toHaveTextContent(
      "Desde el contacto con la planta emergen variaciones eléctricas sutiles. Aunque no se ven ni se escuchan directamente, ya contienen información viva: pequeños cambios y pausas que el sistema empieza a reconocer antes de transformarlos en datos y, más adelante, en sonido.",
    );
    expect(
      signalCinema?.querySelector('[data-world2-signal-readout="expanded"]'),
    ).toHaveAttribute("data-world2-signal-readout-style", "local-lia-note");
    expect(
      signalCinema?.querySelector('[data-world2-signal-readout="expanded"]'),
    ).toHaveAttribute("data-world2-signal-readout-safe-area", "016I");
    expect(
      container.querySelector("[data-world2-completed-required-interactions]"),
    ).toHaveAttribute(
      "data-world2-completed-required-interactions",
      "plant_contact_readout_seen,signal_measured_wave_seen",
    );
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "senal",
    );
    expect(scene()).toHaveAttribute("data-active-layer", "2");
    expect(
      container.querySelector("[data-world2-nav-mode='stable-visible-row']"),
    ).not.toHaveAttribute("data-world2-nav-state");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Siguiente capa. Capa 3 de 6. Captura disponible.",
      }),
    );

    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "captura",
    );
    expectLiaProfile(container, "acquisition-guide", "acquisition-module");
    expect(scene()).toHaveAttribute("data-active-layer", "3");
    expect(scene()).toHaveAttribute(
      "data-world2-focus-target",
      "acquisition-chain",
    );
    const captureTimeline = container.querySelector<HTMLElement>(
      '[data-world2-capture-timeline="016R"]',
    );
    expect(captureTimeline).toBeInTheDocument();
    expect(captureTimeline).toHaveAttribute(
      "data-world2-capture-gesture",
      "swipe-horizontal",
    );
    expect(captureTimeline).toHaveAttribute(
      "data-world2-capture-step",
      "contact",
    );
    expect(captureTimeline).toHaveAttribute(
      "data-world2-capture-visited",
      "contact",
    );
    expect(captureTimeline).toHaveAttribute(
      "data-world2-capture-complete",
      "false",
    );
    expect(
      container.querySelector("[data-signal-cinema]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-signal-cable]"),
    ).not.toBeInTheDocument();
    expect(
      captureTimeline?.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.captureAcquisitionChain}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      captureTimeline?.querySelectorAll(
        `[data-runtime-asset="${world2RuntimeAssets.captureAcquisitionChain}"]`,
      ),
    ).toHaveLength(1);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(
      captureTimeline?.querySelector('[data-world2-capture-label="contact"]'),
    ).toHaveTextContent("Contacto");
    expect(
      screen.getByText(
        "Aquí comienza la lectura. El electrodo entra en contacto con la planta sin producir música todavía: solo permite percibir una variación bioeléctrica muy pequeña.",
      ),
    ).toBeInTheDocument();
    expect(
      captureTimeline?.querySelectorAll("[data-world2-capture-label]"),
    ).toHaveLength(1);
    expect(
      captureTimeline?.querySelectorAll("[data-world2-capture-control]"),
    ).toHaveLength(3);
    expect(
      captureTimeline?.querySelector('[class*="lens"], [class*="magnifier"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-callout='contact']"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-callout='input']"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-callout='data']"),
    ).not.toBeInTheDocument();

    expectLayerState(container, "acondicionamiento", "next-but-gated");
    clickLayer(container, "acondicionamiento");
    expect(
      screen.getByText("Primero recorre los tres pasos de Captura."),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "captura",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar paso 2: Señal tomada",
      }),
    );
    expect(captureTimeline).toHaveAttribute(
      "data-world2-capture-step",
      "signal",
    );
    expect(
      captureTimeline?.querySelector('[data-world2-capture-readout="signal"]'),
    ).toHaveTextContent(
      "La variación viaja por el sensor como una señal medible. En este punto aún conserva su forma original y todavía no ha sido limpiada ni transformada.",
    );

    const systemControl = screen.getByRole("button", {
      name: "Mostrar paso 3: Datos al sistema",
    });
    expect(systemControl).toHaveAttribute(
      "data-world2-capture-interaction",
      "datos-al-sistema",
    );
    expect(systemControl).toHaveAttribute(
      "data-world2-required-interaction",
      "capture_data_readout_seen",
    );
    fireEvent.click(systemControl);

    expect(captureTimeline).toHaveAttribute(
      "data-world2-capture-step",
      "system",
    );
    expect(captureTimeline).toHaveAttribute(
      "data-world2-capture-visited",
      "contact,signal,system",
    );
    expect(captureTimeline).toHaveAttribute(
      "data-world2-capture-complete",
      "true",
    );
    expect(
      captureTimeline?.querySelector('[data-world2-capture-readout="system"]'),
    ).toHaveTextContent(
      "El sistema recibe y registra la señal. Ahora puede conservarla como datos para ordenarla, analizarla y prepararla en la siguiente etapa.",
    );
    expect(
      container.querySelector("[data-world2-completed-required-interactions]"),
    ).toHaveAttribute(
      "data-world2-completed-required-interactions",
      "plant_contact_readout_seen,signal_measured_wave_seen,capture_data_readout_seen",
    );
    expectLayerState(container, "acondicionamiento", "next");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Siguiente capa. Capa 4 de 6. Acondicionamiento disponible.",
      }),
    );

    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "acondicionamiento",
    );
    expectLiaProfile(container, "conditioning-guide", "conditioning-filter");
    expect(scene()).toHaveAttribute("data-active-layer", "4");
    expect(scene()).toHaveAttribute(
      "data-world2-focus-target",
      "noise-filter-stable-signal",
    );
    const conditioningCinema = container.querySelector<HTMLElement>(
      '[data-conditioning-cinema="016T-R2"]',
    );
    expect(conditioningCinema).toBeInTheDocument();
    expect(conditioningCinema).toHaveAttribute(
      "data-world2-conditioning-animation",
      "moving-alpha-mask-transformation",
    );
    expect(conditioningCinema).toHaveAttribute(
      "data-world2-conditioning-sequence",
      "integrated-noise-filter-stable",
    );
    expect(conditioningCinema).toHaveAttribute(
      "data-world2-conditioning-interactions",
      "none",
    );
    expect(conditioningCinema).toHaveAttribute(
      "data-world2-conditioning-pulse-count",
      "1",
    );
    expect(conditioningCinema).toHaveAttribute(
      "data-world2-conditioning-source-copies",
      "2",
    );
    expect(conditioningCinema).toHaveAttribute(
      "data-world2-primary-conditioning-asset",
      world2RuntimeAssets.conditioningNoisyToClean,
    );
    expect(
      conditioningCinema?.querySelectorAll(
        `[data-runtime-asset="${world2RuntimeAssets.conditioningNoisyToClean}"]`,
      ),
    ).toHaveLength(2);
    expect(
      conditioningCinema?.querySelector(
        '[data-world2-conditioning-stage="asset-moving-mask-flow"]',
      ),
    ).toBeInTheDocument();
    expect(
      conditioningCinema?.querySelector(
        '[data-world2-visual-role="conditioning-asset-base"]',
      ),
    ).toBeInTheDocument();
    expect(
      conditioningCinema?.querySelector(
        '[data-world2-visual-role="conditioning-asset-intense-scan"][data-world2-conditioning-mask="soft-vertical-window"]',
      ),
    ).toBeInTheDocument();
    expect(
      conditioningCinema?.querySelector(
        '[data-world2-conditioning-flow="single-moving-alpha-mask"]',
      ),
    ).toBeInTheDocument();
    expect(
      conditioningCinema?.querySelectorAll("[data-world2-conditioning-flow]"),
    ).toHaveLength(1);
    expect(
      conditioningCinema?.querySelector(".world2-conditioning-cinema__signal"),
    ).not.toBeInTheDocument();
    expect(
      conditioningCinema?.querySelectorAll(
        "[data-world2-conditioning-focus], [data-world2-conditioning-moment]",
      ),
    ).toHaveLength(0);
    expect(screen.getByText("RUIDO")).toBeInTheDocument();
    expect(screen.getByText("FILTRO")).toBeInTheDocument();
    expect(screen.getByText("SEÑAL ESTABLE")).toBeInTheDocument();
    expect(
      conditioningCinema?.querySelectorAll(
        ".world2-conditioning-cinema__label",
      ),
    ).toHaveLength(3);
    expect(
      conditioningCinema?.querySelector(
        '[data-world2-label-anchor="conditioning-filter"]',
      ),
    ).toHaveAttribute("data-world2-label-legibility", "uppercase-explicit");
    expect(
      conditioningCinema?.querySelector(
        '[data-world2-label-anchor="conditioning-noise"]',
      ),
    ).toBeInTheDocument();
    expect(
      conditioningCinema?.querySelector(
        '[data-world2-label-anchor="conditioning-filter"]',
      ),
    ).toBeInTheDocument();
    expect(
      conditioningCinema?.querySelector(
        '[data-world2-label-anchor="conditioning-stable"]',
      ),
    ).toBeInTheDocument();
    expect(
      conditioningCinema?.querySelector(
        '[class*="lens"], [class*="magnifier"], [class*="callout-arrow"]',
      ),
    ).not.toBeInTheDocument();
    expect(conditioningCinema?.textContent).not.toContain("lupa");
    expect(
      conditioningCinema?.querySelector(
        "button, [role='button'], [data-world2-conditioning-readout], [data-world2-conditioning-hotspot]",
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-callout='noise']"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-callout='filter']"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-callout='stable']"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalWaveformNoisyRaw}"]`,
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Siguiente capa. Capa 5 de 6. Mapeo disponible.",
      }),
    );

    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "mapeo",
    );
    expectLiaProfile(container, "mapping-guide", "mapping-module");
    expect(scene()).toHaveAttribute("data-active-layer", "5");
    expect(scene()).toHaveAttribute(
      "data-world2-focus-target",
      "mapping-module",
    );
    expect(
      screen.getByRole("group", {
        name: "Mapeo secuencial: un rasgo de la señal se interpreta como un parámetro sonoro",
      }),
    ).toBeInTheDocument();
    const mappingPanel = screen.getByRole("group", {
      name: "Mapeo secuencial: un rasgo de la señal se interpreta como un parámetro sonoro",
    });

    expect(mappingPanel).toHaveAttribute("data-mapping-pedagogy", "016U-R5");
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-layout",
      "full-width-horizontal",
    );
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-support-copy-animation",
      "consistent-restarting-double-pulse-glow",
    );
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-mode",
      "sequential-pedagogic-r2",
    );
    expect(mappingPanel).toHaveAttribute("data-world2-mapping-step", "1");
    expect(mappingPanel).toHaveAttribute("data-world2-mapping-step-count", "3");
    expect(mappingPanel).toHaveAttribute("data-mapping-autoplay", "9600ms");
    expect(mappingPanel).toHaveAttribute(
      "data-mapping-step-duration",
      "3200ms",
    );
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-lia-role",
      "guide",
    );
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-relation",
      "amplitude-intensity",
    );
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-simultaneous-relations",
      "1",
    );
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-first-run",
      "active",
    );
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-review-enabled",
      "false",
    );
    expect(mappingPanel).toHaveAttribute(
      "data-world2-mapping-controls",
      "locked",
    );
    expect(
      container.querySelector(
        '[data-world2-mapping-component="sequential-react-dom"]',
      ),
    ).toBeInTheDocument();
    expect(
      mappingPanel.querySelectorAll("[data-mapping-active-relation]"),
    ).toHaveLength(1);
    expect(mappingPanel.querySelectorAll("[data-mapping-zone]")).toHaveLength(
      3,
    );
    expect(mappingPanel.querySelectorAll("[data-mapping-flow]")).toHaveLength(
      2,
    );
    const mappingReviewButtons = mappingPanel.querySelectorAll("button");
    expect(mappingReviewButtons).toHaveLength(3);
    expect([...mappingReviewButtons].every((button) => button.disabled)).toBe(
      true,
    );
    expect(
      mappingPanel.querySelector(".world2-mapping-sequence__feature-scan"),
    ).not.toBeInTheDocument();
    expect(
      mappingPanel.querySelectorAll("[data-world2-feature-accent]"),
    ).toHaveLength(1);
    expect(screen.getByText("AMPLITUD")).toBeInTheDocument();
    expect(screen.getByText("INTENSIDAD")).toBeInTheDocument();
    expect(screen.queryByText("VARIACIÓN")).not.toBeInTheDocument();
    expect(screen.queryByText("RITMO")).not.toBeInTheDocument();
    expect(screen.queryByText("RANGO")).not.toBeInTheDocument();
    expect(screen.queryByText("ALTURA")).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.mappingConstellation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-callout]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plantBioelectricContactNode}"]`,
      ),
    ).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(9600));
    fireEvent.click(
      screen.getByRole("button", {
        name: "Siguiente capa. Capa 6 de 6. Resultado mediado disponible.",
      }),
    );

    expect(container.querySelector("[data-world2-state]")).toHaveAttribute(
      "data-world2-state",
      "resultado_mediado",
    );
    expectLiaProfile(container, "result-guide", "mediated-result");
    expect(scene()).toHaveAttribute("data-active-layer", "6");
    expect(scene()).toHaveAttribute(
      "data-world2-focus-target",
      "mediated-microstory",
    );
    expect(
      screen.getByRole("group", {
        name: "Convergencia sonora final de intensidad, ritmo y altura",
      }),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-world2-option6-mode="final-sonic-convergence"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-world2-option6-simultaneous-primary-scenes="1"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world2-option6-stage="intensity"]'),
    ).toBeInTheDocument();
    expect(screen.getByText("INTENSIDAD")).toBeInTheDocument();
    expect(
      container.querySelector(".world2-mediated-panel"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.mediatedResult}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.readyPath}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-world2-callout]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plantBioelectricContactNode}"]`,
      ),
    ).not.toBeInTheDocument();
  });

  it("015O desbloquea capas secuencialmente sin permitir saltos", () => {
    const { container } = renderWorld2RootScreen();
    const root = () => getWorld2Root(container);

    expectLayerState(container, "planta_viva", "active");
    expectLayerState(container, "senal", "next-but-gated");
    expectLayerState(container, "captura", "locked");
    expectLayerState(container, "acondicionamiento", "locked");
    expectLayerState(container, "mapeo", "locked");
    expectLayerState(container, "resultado_mediado", "locked");
    expect(root()).toHaveAttribute("data-world2-current-layer", "1");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "2");
    expect(root()).toHaveAttribute("data-world2-visited-layers", "1");

    completePlantContactIfVisible(container);
    expectLayerState(container, "senal", "next");

    clickLayer(container, "senal");

    expectLayerState(container, "planta_viva", "completed");
    expectLayerState(container, "senal", "active");
    expectLayerState(container, "captura", "next-but-gated");
    expectLayerState(container, "acondicionamiento", "locked");
    expect(root()).toHaveAttribute("data-world2-current-layer", "2");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "3");
    expect(root()).toHaveAttribute("data-world2-visited-layers", "1,2");

    completeSignalWaveIfVisible(container);
    expectLayerState(container, "captura", "next");

    clickLayer(container, "captura");

    expectLayerState(container, "planta_viva", "completed");
    expectLayerState(container, "senal", "completed");
    expectLayerState(container, "captura", "active");
    expectLayerState(container, "acondicionamiento", "next-but-gated");
    expectLayerState(container, "mapeo", "locked");
    expect(root()).toHaveAttribute("data-world2-current-layer", "3");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "4");
    expect(root()).toHaveAttribute("data-world2-visited-layers", "1,2,3");

    clickLayer(container, "acondicionamiento");
    expect(
      screen.getByText("Primero recorre los tres pasos de Captura."),
    ).toBeInTheDocument();

    completeCaptureDataIfVisible(container);

    expect(root()).toHaveAttribute(
      "data-world2-completed-required-interactions",
      "plant_contact_readout_seen,signal_measured_wave_seen,capture_data_readout_seen",
    );
    expectLayerState(container, "acondicionamiento", "next");
  });

  it("015O volver a una capa anterior no reduce lo desbloqueado", () => {
    const { container } = renderWorld2RootScreen();
    const root = () => getWorld2Root(container);

    progressToLayer(container, "mapeo");

    expect(root()).toHaveAttribute("data-world2-current-layer", "5");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "6");
    expect(root()).toHaveAttribute("data-world2-visited-layers", "1,2,3,4,5");
    expectLayerState(container, "resultado_mediado", "next-but-gated");

    clickLayer(container, "planta_viva");

    expect(root()).toHaveAttribute("data-world2-current-layer", "1");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "6");
    expect(root()).toHaveAttribute("data-world2-visited-layers", "1,2,3,4,5");
    expectLayerState(container, "planta_viva", "active");
    expectLayerState(container, "senal", "completed");
    expectLayerState(container, "captura", "completed");
    expectLayerState(container, "acondicionamiento", "completed");
    expectLayerState(container, "mapeo", "completed");
    expectLayerState(container, "resultado_mediado", "next-but-gated");

    for (const layerId of [
      "senal",
      "captura",
      "acondicionamiento",
      "mapeo",
    ] as World2LayerId[]) {
      clickLayer(container, layerId);
      expectLayerState(container, layerId, "active");
      expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "6");
      expectLayerState(container, "resultado_mediado", "next-but-gated");
    }
  });

  it("015O no permite saltar a una capa futura bloqueada", () => {
    const { container } = renderWorld2RootScreen();
    const root = () => getWorld2Root(container);

    clickLayer(container, "mapeo");

    expect(root()).toHaveAttribute("data-world2-current-layer", "1");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "2");
    expect(root()).toHaveAttribute("data-world2-visited-layers", "1");
    expectLayerState(container, "planta_viva", "active");
    expectLayerState(container, "mapeo", "locked");
    expect(
      screen.getByText("Primero necesitamos entender la capa anterior."),
    ).toBeInTheDocument();
  });

  it("015W preserva la navegación como fila estable siempre visible", () => {
    const { container } = renderWorld2RootScreen();
    const root = () => getWorld2Root(container);
    const nav = () =>
      container.querySelector<HTMLElement>(
        "[data-world2-nav-mode='stable-visible-row']",
      );

    progressToLayer(container, "mapeo");

    expect(root()).toHaveAttribute("data-world2-current-layer", "5");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "6");
    expect(nav()).toBeInTheDocument();
    expect(nav()).toHaveAttribute("data-world2-nav-mode", "stable-visible-row");
    expect(nav()).not.toHaveAttribute("data-world2-nav-state");
    expect(
      container.querySelector("[data-world2-nav-toggle]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(".world2-layer-nav [aria-expanded]"),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-world2-layer]")).toHaveLength(6);

    clickLayer(container, "planta_viva");

    expect(root()).toHaveAttribute("data-world2-current-layer", "1");
    expect(root()).toHaveAttribute("data-world2-highest-unlocked-layer", "6");
    expectLayerState(container, "senal", "completed");
    expectLayerState(container, "captura", "completed");
    expectLayerState(container, "acondicionamiento", "completed");
    expectLayerState(container, "mapeo", "completed");
    expectLayerState(container, "resultado_mediado", "next-but-gated");
  });

  it("015W mantiene capa 6 bloqueada hasta desbloquearla secuencialmente", () => {
    const { container } = renderWorld2RootScreen();

    progressToLayer(container, "acondicionamiento");

    expectLayerState(container, "mapeo", "next");
    expectLayerState(container, "resultado_mediado", "locked");

    clickLayer(container, "mapeo");

    expectLayerState(container, "mapeo", "active");
    expectLayerState(container, "resultado_mediado", "next-but-gated");
  });

  it("015O mantiene las estructuras semánticas al volver y revisitar capas 1 a 5", () => {
    const { container } = renderWorld2RootScreen();

    progressToLayer(container, "mapeo");
    clickLayer(container, "planta_viva");

    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.plantBioelectricContactNode}"]`,
      ),
    ).toBeInTheDocument();

    clickLayer(container, "senal");
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalProbeCableWaveformUnified}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.signalWaveformCleanTechnical}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.rawWaveform}"]`,
      ),
    ).not.toBeInTheDocument();

    clickLayer(container, "captura");
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.captureAcquisitionChain}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.captureContact}"]`,
      ),
    ).not.toBeInTheDocument();

    clickLayer(container, "acondicionamiento");
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.conditioningNoisyToClean}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.conditioningField}"]`,
      ),
    ).not.toBeInTheDocument();

    clickLayer(container, "mapeo");
    expect(
      container.querySelector(
        '[data-world2-mapping-component="sequential-react-dom"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-mapping-pedagogy="016U-R5"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll("[data-mapping-active-relation]"),
    ).toHaveLength(1);
    expect(
      container.querySelector(
        `[data-runtime-asset="${world2RuntimeAssets.mappingConstellation}"]`,
      ),
    ).not.toBeInTheDocument();
    expectLayerState(container, "resultado_mediado", "next-but-gated");
  });

  it("016U-R5 conserva la revisión habilitada al salir y volver a Mapeo", () => {
    vi.useFakeTimers();
    const { container } = renderWorld2RootScreen();

    progressToLayer(container, "mapeo");
    const firstPanel = container.querySelector<HTMLElement>(
      '[data-world2-mapping-mode="sequential-pedagogic-r2"]',
    );
    expect(firstPanel).toHaveAttribute(
      "data-world2-mapping-first-run",
      "active",
    );

    act(() => vi.advanceTimersByTime(9600));
    expect(firstPanel).toHaveAttribute(
      "data-world2-mapping-review-enabled",
      "true",
    );
    expect(firstPanel).toHaveAttribute(
      "data-world2-mapping-controls",
      "review",
    );

    clickLayer(container, "acondicionamiento");
    clickLayer(container, "mapeo");
    const revisitedPanel = container.querySelector<HTMLElement>(
      '[data-world2-mapping-mode="sequential-pedagogic-r2"]',
    );
    expect(revisitedPanel).toHaveAttribute(
      "data-world2-mapping-first-run",
      "complete",
    );
    expect(revisitedPanel).toHaveAttribute(
      "data-world2-mapping-review-enabled",
      "true",
    );
    expect(revisitedPanel).toHaveAttribute("data-world2-mapping-step", "3");
    expect(
      [...(revisitedPanel?.querySelectorAll("button") ?? [])].every(
        (button) => !button.disabled,
      ),
    ).toBe(true);
  });

  it("DEBT_005 fresh no escribe al montar y restaura Planta, Señal y Captura", () => {
    const nativeSetItem = Storage.prototype.setItem;
    const writes: string[] = [];
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === WORLD2_CHECKPOINT_STORAGE_KEY) writes.push(value);
      nativeSetItem.call(this, key, value);
    });

    let rendered = renderWorld2RootScreen();
    expect(writes).toEqual([]);
    expect(getWorld2Root(rendered.container)).toHaveAttribute(
      "data-world2-active-layer",
      "planta_viva",
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Abrir Punto de lectura" }),
    );
    expect(writes).toHaveLength(1);
    cleanup();
    rendered = renderWorld2RootScreen();
    expect(
      screen.getByRole("button", { name: "Abrir Punto de lectura" }),
    ).toHaveAttribute("aria-expanded", "true");
    expectLayerState(rendered.container, "senal", "next");

    clickLayer(rendered.container, "senal");
    fireEvent.click(
      rendered.container.querySelector(
        '[data-world2-signal-reveal-control="onda-medida"]',
      ) as HTMLElement,
    );
    cleanup();
    rendered = renderWorld2RootScreen();
    expect(getWorld2Root(rendered.container)).toHaveAttribute(
      "data-world2-active-layer",
      "senal",
    );
    expect(
      rendered.container.querySelector('[data-signal-reveal-state="expanded"]'),
    ).toBeInTheDocument();

    clickLayer(rendered.container, "captura");
    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar paso 2: Señal tomada" }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar paso 3: Datos al sistema",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar paso 1: Contacto" }),
    );
    cleanup();
    rendered = renderWorld2RootScreen();
    const timeline = rendered.container.querySelector(
      '[data-world2-capture-timeline="016R"]',
    );
    expect(timeline).toHaveAttribute("data-world2-capture-step", "contact");
    expect(timeline).toHaveAttribute(
      "data-world2-capture-visited",
      "contact,signal,system",
    );
    expectLayerState(rendered.container, "acondicionamiento", "next");
  });

  it("DEBT_005 Mapeo incompleto reinicia y Mapeo completo restaura review", () => {
    vi.useFakeTimers();
    let rendered = renderWorld2RootScreen();
    progressToLayer(rendered.container, "mapeo");
    let panel = rendered.container.querySelector(
      '[data-world2-mapping-mode="sequential-pedagogic-r2"]',
    );
    act(() => vi.advanceTimersByTime(3200));
    expect(panel).toHaveAttribute("data-world2-mapping-step", "2");

    cleanup();
    rendered = renderWorld2RootScreen();
    panel = rendered.container.querySelector(
      '[data-world2-mapping-mode="sequential-pedagogic-r2"]',
    );
    expect(panel).toHaveAttribute("data-world2-mapping-step", "1");
    expect(panel).toHaveAttribute("data-world2-mapping-controls", "locked");

    act(() => vi.advanceTimersByTime(9600));
    expect(panel).toHaveAttribute("data-world2-mapping-controls", "review");
    expectLayerState(rendered.container, "resultado_mediado", "next");
    cleanup();
    rendered = renderWorld2RootScreen();
    panel = rendered.container.querySelector(
      '[data-world2-mapping-mode="sequential-pedagogic-r2"]',
    );
    expect(panel).toHaveAttribute("data-world2-mapping-step", "3");
    expect(panel).toHaveAttribute("data-world2-mapping-controls", "review");
  });

  it("DEBT_005 fallo y retry de Mapeo no repite autoplay", () => {
    vi.useFakeTimers();
    const { container } = renderWorld2RootScreen();
    progressToLayer(container, "mapeo");
    const nativeSetItem = Storage.prototype.setItem;
    let fail = true;
    let attempts = 0;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === WORLD2_CHECKPOINT_STORAGE_KEY) {
        attempts += 1;
        if (fail) throw new Error("mapping checkpoint failure");
      }
      nativeSetItem.call(this, key, value);
    });

    act(() => vi.advanceTimersByTime(9600));
    const panel = container.querySelector(
      '[data-world2-mapping-mode="sequential-pedagogic-r2"]',
    );
    expect(panel).toHaveAttribute("data-world2-mapping-step", "3");
    expect(panel).toHaveAttribute("data-world2-mapping-controls", "locked");
    expect(screen.getByRole("button", { name: "Reintentar" })).toHaveFocus();
    expect(attempts).toBe(1);

    fail = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(panel).toHaveAttribute("data-world2-mapping-controls", "review");
    act(() => vi.advanceTimersByTime(20_000));
    expect(attempts).toBe(2);
  });

  it("DEBT_005 Resultado pending reinicia y ready no repite convergencia", () => {
    vi.useFakeTimers();
    let rendered = renderWorld2RootScreen();
    progressToLayer(rendered.container, "mapeo");
    act(() => vi.advanceTimersByTime(9600));
    clickLayer(rendered.container, "resultado_mediado");
    expect(getWorld2Root(rendered.container)).toHaveAttribute(
      "data-world2-result-state",
      "convergence_pending",
    );
    act(() => vi.advanceTimersByTime(4200));
    expect(
      rendered.container.querySelector(
        '[data-world2-option6-stage="pitch"]',
      ),
    ).toBeInTheDocument();

    cleanup();
    rendered = renderWorld2RootScreen();
    expect(
      rendered.container.querySelector(
        '[data-world2-option6-stage="intensity"]',
      ),
    ).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(9000));
    expect(getWorld2Root(rendered.container)).toHaveAttribute(
      "data-world2-result-state",
      "ready_to_continue",
    );
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();

    cleanup();
    rendered = renderWorld2RootScreen();
    expect(
      rendered.container.querySelector('[data-world2-option6-complete="true"]'),
    ).toHaveAttribute("data-world2-option6-stage", "resolved");
    act(() => vi.advanceTimersByTime(12_000));
    expect(getWorld2Root(rendered.container)).toHaveAttribute(
      "data-world2-result-state",
      "ready_to_continue",
    );
  });

  it("DEBT_005 fallo y retry de Resultado bloquea CTA sin repetir secuencia", () => {
    vi.useFakeTimers();
    const { container } = renderWorld2RootScreen();
    progressToLayer(container, "mapeo");
    act(() => vi.advanceTimersByTime(9600));
    clickLayer(container, "resultado_mediado");
    const nativeSetItem = Storage.prototype.setItem;
    let fail = true;
    let attempts = 0;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === WORLD2_CHECKPOINT_STORAGE_KEY) {
        attempts += 1;
        if (fail) throw new Error("result checkpoint failure");
      }
      nativeSetItem.call(this, key, value);
    });

    act(() => vi.advanceTimersByTime(9000));
    expect(
      container.querySelector('[data-world2-option6-stage="resolved"]'),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continuar" })).toBeNull();
    expect(screen.getByRole("button", { name: "Reintentar" })).toHaveFocus();
    expect(attempts).toBe(1);

    fail = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
    act(() => vi.advanceTimersByTime(12_000));
    expect(attempts).toBe(2);
  });

  it("DEBT_005 completion global prevalece y conserva active layer válida", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2],
        updatedAt: "2026-08-05T18:00:00.000Z",
      }),
    );
    let rendered = renderWorld2RootScreen();
    expect(getWorld2Root(rendered.container)).toHaveAttribute(
      "data-world2-state",
      "ready_to_continue",
    );
    expect(
      window.localStorage.getItem(WORLD2_CHECKPOINT_STORAGE_KEY),
    ).toBeNull();

    cleanup();
    window.localStorage.setItem(
      WORLD2_CHECKPOINT_STORAGE_KEY,
      JSON.stringify({
        activeLayerId: "senal",
        visitedLayerIds: ["planta_viva", "senal"],
        highestUnlockedLayerOrder: 3,
        completedRequiredInteractions: ["plant_contact_readout_seen"],
        capture: { currentStepId: "contact", visitedStepIds: ["contact"] },
        mappingFirstRunComplete: false,
        resultState: "not_started",
        schemaVersion: 1,
        updatedAt: "2026-08-05T18:01:00.000Z",
      }),
    );
    rendered = renderWorld2RootScreen();
    const root = getWorld2Root(rendered.container);
    expect(root).toHaveAttribute("data-world2-active-layer", "senal");
    expect(root).toHaveAttribute("data-world2-result-state", "ready_to_continue");
    expect(root).toHaveAttribute("data-world2-visited-layers", "1,2,3,4,5,6");
    expect(
      rendered.container.querySelector('[data-signal-reveal-state="expanded"]'),
    ).toBeInTheDocument();
  });

  it("DEBT_005 corrupción exige recovery explícito y preserva familias ajenas", () => {
    const corruptRaw = "{world-two-corrupt::raw";
    window.localStorage.setItem(WORLD2_CHECKPOINT_STORAGE_KEY, corruptRaw);
    window.localStorage.setItem("gvo.station1.v1", "world-one-preserved");
    window.localStorage.setItem("gvo.station4.v1", "world-four-preserved");
    window.localStorage.setItem("gvo.station5.v1", "world-five-preserved");
    const { container } = renderWorld2RootScreen();

    expect(
      screen.getByText("No fue posible recuperar el avance de este mundo."),
    ).toBeVisible();
    expect(window.localStorage.getItem(WORLD2_CHECKPOINT_STORAGE_KEY)).toBe(
      corruptRaw,
    );
    clickLayer(container, "senal");
    expect(getWorld2Root(container)).toHaveAttribute(
      "data-world2-active-layer",
      "planta_viva",
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Restablecer avance de este mundo" }),
    );
    expect(
      screen.getByText("¿Restablecer el avance guardado de este mundo?"),
    ).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Restablecer" }));
    expect(
      window.localStorage.getItem(WORLD2_CHECKPOINT_STORAGE_KEY),
    ).toBeNull();
    expect(window.localStorage.getItem("gvo.station1.v1")).toBe(
      "world-one-preserved",
    );
    expect(window.localStorage.getItem("gvo.station4.v1")).toBe(
      "world-four-preserved",
    );
    expect(window.localStorage.getItem("gvo.station5.v1")).toBe(
      "world-five-preserved",
    );
  });

  it("DEBT_005 storage unavailable ofrece Reintentar, no reset", () => {
    const nativeGetItem = Storage.prototype.getItem;
    let unavailable = true;
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(function (
      this: Storage,
      key,
    ) {
      if (key === WORLD2_CHECKPOINT_STORAGE_KEY && unavailable) {
        throw new Error("checkpoint storage unavailable");
      }
      return nativeGetItem.call(this, key);
    });
    const { container } = renderWorld2RootScreen();

    expect(getWorld2Root(container)).toHaveAttribute(
      "data-world2-checkpoint-recovery",
      "storage_unavailable",
    );
    expect(
      screen.queryByRole("button", {
        name: "Restablecer avance de este mundo",
      }),
    ).toBeNull();
    unavailable = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(getWorld2Root(container)).toHaveAttribute(
      "data-world2-checkpoint-recovery",
      "none",
    );
  });

  it("DEBT_005 write failure conserva UI, enfoca retry y double click es idempotente", () => {
    const nativeSetItem = Storage.prototype.setItem;
    let fail = true;
    let attempts = 0;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === WORLD2_CHECKPOINT_STORAGE_KEY) {
        attempts += 1;
        if (fail) throw new Error("stable transition failure");
      }
      nativeSetItem.call(this, key, value);
    });
    const { container } = renderWorld2RootScreen();
    const contact = screen.getByRole("button", {
      name: "Abrir Punto de lectura",
    });
    fireEvent.click(contact);
    fireEvent.click(contact);
    expect(contact).toHaveAttribute("aria-expanded", "false");
    expectLayerState(container, "senal", "next-but-gated");
    expect(attempts).toBe(1);
    expect(screen.getByRole("button", { name: "Reintentar" })).toHaveFocus();

    fail = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(contact).toHaveAttribute("aria-expanded", "true");
    expectLayerState(container, "senal", "next");
    expect(attempts).toBe(2);
  });

  it("DEBT_005 retry de layer y Captura aplica sólo la transición pendiente", () => {
    const { container } = renderWorld2RootScreen();
    completePlantContactIfVisible(container);
    const nativeSetItem = Storage.prototype.setItem;
    let fail = true;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      if (key === WORLD2_CHECKPOINT_STORAGE_KEY && fail) {
        throw new Error("pending transition failure");
      }
      nativeSetItem.call(this, key, value);
    });

    clickLayer(container, "senal");
    expect(getWorld2Root(container)).toHaveAttribute(
      "data-world2-active-layer",
      "planta_viva",
    );
    fail = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(getWorld2Root(container)).toHaveAttribute(
      "data-world2-active-layer",
      "senal",
    );

    completeSignalWaveIfVisible(container);
    clickLayer(container, "captura");
    fail = true;
    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar paso 2: Señal tomada" }),
    );
    expect(
      container.querySelector('[data-world2-capture-timeline="016R"]'),
    ).toHaveAttribute("data-world2-capture-step", "contact");
    fail = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(
      container.querySelector('[data-world2-capture-timeline="016R"]'),
    ).toHaveAttribute("data-world2-capture-step", "signal");
  });
});

function layerCopyLabelForTest(layerId: World2LayerId) {
  const labels: Record<World2LayerId, string> = {
    acondicionamiento: "Acondicionamiento",
    captura: "Captura",
    mapeo: "Mapeo",
    planta_viva: "Planta viva",
    resultado_mediado: "Resultado mediado",
    senal: "Señal bioeléctrica",
  };

  return labels[layerId];
}
