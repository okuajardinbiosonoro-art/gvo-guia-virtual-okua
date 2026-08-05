import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { worldOneToWorldTwoTransitionRoute } from "../../app/routes";
import {
  WORLD1_REQUIRED_SLOT_COUNT,
  world1ConceptCopy,
  world1EditorialSlots,
} from "../../content/world1EditorialSlots";
import { GVO_PROGRESS_STORAGE_KEY } from "../../domain/progress/progress.storage";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { World1RootLayoutCalibrator } from "./dev";
import { WORLD1_ROOT_COORDINATE_SYSTEM_ID } from "./layout";
import { World1RootScreen } from "./World1RootScreen";
import { world1RootAssets } from "./world1RootAssets";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-route">{location.pathname}</span>;
}

function renderWorld1RootScreen() {
  return render(
    <MemoryRouter initialEntries={["/estacion/1"]}>
      <World1RootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function configureSmallViewport(width: number, height: number) {
  vi.stubGlobal("innerWidth", width);
  vi.stubGlobal("innerHeight", height);
  vi.stubGlobal("visualViewport", {
    addEventListener: vi.fn(),
    height,
    removeEventListener: vi.fn(),
    scrollTop: 0,
    width,
  });
}

function configureNarrativeOverflow(
  viewport: HTMLElement,
  scrollHeight = 244,
  clientHeight = 163,
) {
  Object.defineProperty(viewport, "scrollHeight", {
    configurable: true,
    get: () => scrollHeight,
  });
  Object.defineProperty(viewport, "clientHeight", {
    configurable: true,
    get: () => clientHeight,
  });
}

describe("World1RootScreen", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    cleanup();
  });

  it("016S5 muestra swipe vertical solo con overflow móvil y lo descarta por estado", () => {
    vi.useFakeTimers();
    configureSmallViewport(360, 560);
    const { container } = renderWorld1RootScreen();
    const root = container.querySelector(".world1-root-screen");
    const viewport = container.querySelector<HTMLElement>(
      '[data-world1-scroll-viewport="manual"]',
    );

    configureNarrativeOverflow(viewport as HTMLElement);
    act(() => {
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(20);
    });

    let hint = document.querySelector(
      '[data-gvo-gesture-hint="swipe-vertical"]',
    );
    expect(root).toHaveAttribute("data-world1-swipe-hint-system", "016S5");
    expect(root).toHaveAttribute("data-world1-swipe-hint-state", "pending");
    expect(
      container.querySelector('[data-world1-swipe-hint-anchor="intro"]'),
    ).toBeInTheDocument();
    expect(hint).toHaveAttribute("data-gvo-gesture-direction", "up");
    expect(hint).toHaveAttribute(
      "data-gvo-gesture-animation",
      "unidirectional-trail-r7",
    );
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "waiting");

    act(() => vi.advanceTimersByTime(2800));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "visible");

    (viewport as HTMLElement).scrollTop = 12;
    fireEvent.scroll(viewport as HTMLElement);
    expect(root).toHaveAttribute("data-world1-swipe-hint-state", "completed");
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");

    const conceptLabels = {
      mediation: "MEDIACIÓN",
      perception: "PERCEPCIÓN",
      relation: "RELACIÓN",
    } as const;
    for (const concept of ["relation", "perception", "mediation"] as const) {
      fireEvent.click(
        screen.getByRole("button", {
          name: `Explorar ${conceptLabels[concept]}`,
        }),
      );
      act(() => {
        window.dispatchEvent(new Event("resize"));
        vi.advanceTimersByTime(20);
      });

      hint = document.querySelector('[data-gvo-gesture-hint="swipe-vertical"]');
      expect(root).toHaveAttribute("data-world1-swipe-hint-state", "pending");
      expect(
        container.querySelector(`[data-world1-swipe-hint-anchor="${concept}"]`),
      ).toBeInTheDocument();
      expect(hint).toHaveAttribute("data-gvo-gesture-state", "waiting");

      (viewport as HTMLElement).scrollTop = 12;
      fireEvent.scroll(viewport as HTMLElement);
      expect(root).toHaveAttribute("data-world1-swipe-hint-state", "completed");
    }
  });

  it("016S5 no fuerza el hint en una altura móvil cómoda", () => {
    vi.useFakeTimers();
    configureSmallViewport(430, 932);
    const { container } = renderWorld1RootScreen();
    const viewport = container.querySelector<HTMLElement>(
      '[data-world1-scroll-viewport="manual"]',
    );

    configureNarrativeOverflow(viewport as HTMLElement, 237, 224);
    act(() => {
      window.dispatchEvent(new Event("resize"));
      vi.advanceTimersByTime(20);
    });

    expect(container.querySelector(".world1-root-screen")).toHaveAttribute(
      "data-world1-swipe-hint-state",
      "inactive",
    );
    expect(
      document.querySelector('[data-gvo-gesture-hint="swipe-vertical"]'),
    ).not.toBeInTheDocument();
  });

  it("renderiza la base estatica de Mundo I con textos DOM y assets reales", () => {
    const { container } = renderWorld1RootScreen();

    expect(
      screen.getByRole("heading", {
        name: world1ConceptCopy.intro.title.text,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(world1ConceptCopy.intro.body.text),
    ).toBeInTheDocument();
    expect(screen.getByText("RELACIÓN")).toBeInTheDocument();
    expect(screen.getByText("PERCEPCIÓN")).toBeInTheDocument();
    expect(screen.getByText("MEDIACIÓN")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Continuar" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Lía, guía visual de OKÚA" }),
    ).toHaveAttribute("src", world1RootAssets.liaIdle);

    for (const asset of Object.values(world1RootAssets)) {
      expect(asset).toMatch(/^\/assets\/gvo\/stations\/world-1-root\//);
      expect(asset).not.toMatch(/^https?:\/\//);
    }

    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.background}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.ambientLight}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.plant}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.rootsBase}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(
        `[data-runtime-asset="${world1RootAssets.nodeKit}"]`,
      ),
    ).toHaveLength(3);
    expect(container.querySelector(".world1-root-screen")).toHaveAttribute(
      "data-world1-mobile-stabilization",
      "004F-1C",
    );
    expect(container.querySelector(".world1-root-screen")).toHaveAttribute(
      "data-world1-layout-mode",
      "full-bleed-prudent",
    );
    expect(container.querySelector(".world1-root-screen")).toHaveAttribute(
      "data-world1-narrative-motion",
      "manual-scroll",
    );
    expect(container.querySelector(".world1-root-screen")).toHaveAttribute(
      "data-world1-narrative-control",
      "vertical-manual",
    );
    expect(container.querySelector(".world1-root-screen")).toHaveAttribute(
      "data-world1-motion-driver",
      "js-raf-css-vars",
    );
    expect(container.querySelector(".world1-root-screen")).toHaveAttribute(
      "data-world1-motion-layer",
      "css-js-procedural",
    );
    expect(container.querySelector(".world1-root-screen")).toHaveAttribute(
      "data-world1-slot-count",
      String(WORLD1_REQUIRED_SLOT_COUNT),
    );
    expect(screen.getByTestId("world1-root-stage")).toHaveAttribute(
      "data-world1-coordinate-system",
      WORLD1_ROOT_COORDINATE_SYSTEM_ID,
    );
    expect(screen.getByTestId("world1-root-stage")).toHaveAttribute(
      "aria-label",
      world1EditorialSlots.W1_ACCESSIBLE_SCENE_01.text,
    );
    expect(screen.getByTestId("world1-root-stage")).toHaveAttribute(
      "data-world1-slot-id",
      "W1_ACCESSIBLE_SCENE_01",
    );
    expect(screen.getByTestId("world1-root-stage")).toHaveAttribute(
      "data-editorial-status",
      "TEMP",
    );
    expect(
      container.querySelector(".world1-root-copy"),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".world1-root-narrative")).toHaveAttribute(
      "data-world1-narrative-duration-ms",
      String(world1ConceptCopy.intro.durationMs),
    );
    expect(
      container.querySelector('[data-world1-slot-id="W1_INTRO_TITLE_01"]'),
    ).toHaveAttribute("data-editorial-status", "TEMP");
    expect(
      container.querySelectorAll("[data-world1-motion-element]"),
    ).toHaveLength(16);
    expect(
      container.querySelectorAll(
        '[data-world1-motion-element="plant-leaf-light"]',
      ),
    ).toHaveLength(2);
    expect(
      container.querySelector('[data-world1-motion-element="lia-presence"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-motion-element="lia-expression"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-scroll-viewport="manual"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(".world1-root-node__orb-shell"),
    ).toHaveLength(3);
    expect(
      container.querySelectorAll(".world1-root-node__particle"),
    ).toHaveLength(9);
    expect(
      container.querySelectorAll(".world1-root-energy-field__spark"),
    ).toHaveLength(6);
  });

  it("no renderiza assets fuera de fase, controles interactivos ni medios runtime", () => {
    const { container } = renderWorld1RootScreen();

    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeMediation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.exitPath}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaGuideMediation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaReadyContinue}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaTeleportOut}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
  });

  it("mantiene el boton Continuar fuera del DOM hasta que pueda usarse", () => {
    renderWorld1RootScreen();

    expect(
      screen.queryByRole("button", { name: "Continuar" }),
    ).not.toBeInTheDocument();
  });

  it("activa RELACIÓN y deja PERCEPCIÓN disponible sin habilitar MEDIACIÓN", () => {
    const { container } = renderWorld1RootScreen();

    const relation = screen.getByRole("button", {
      name: "Explorar RELACIÓN",
    });
    const perception = screen.getByRole("button", {
      name: "PERCEPCIÓN bloqueada en esta fase",
    });
    const mediation = screen.getByRole("button", {
      name: "MEDIACIÓN bloqueada en esta fase",
    });

    expect(relation).toHaveAttribute("data-node-state", "available");
    expect(relation).toHaveAttribute("aria-pressed", "false");
    expect(perception).toBeDisabled();
    expect(mediation).toBeDisabled();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(relation);

    expect(relation).toHaveAttribute("data-node-state", "active");
    expect(relation).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("data-node-state", "available");
    expect(mediation).toBeDisabled();
    expect(mediation).toHaveAttribute("data-node-state", "locked");
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-world1-active-roots-calibration="manual-calibration"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaPointRelation}"]`,
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("RELACIÓN").length).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByText(world1ConceptCopy.relation.title.text),
    ).toBeInTheDocument();
    expect(container.querySelector(".world1-root-narrative")).toHaveAttribute(
      "data-world1-narrative-duration-ms",
      String(world1ConceptCopy.relation.durationMs),
    );
    expect(
      screen.queryByRole("button", { name: "Continuar" }),
    ).not.toBeInTheDocument();
  });

  it("activa PERCEPCIÓN despues de RELACIÓN y deja MEDIACIÓN disponible", () => {
    const { container } = renderWorld1RootScreen();

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    );

    expect(screen.getByTestId("world1-root-stage")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Explorar RELACIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("data-node-state", "active");
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).toHaveAttribute("data-node-state", "available");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).not.toBeDisabled();

    expect(
      screen.getByText(world1ConceptCopy.perception.title.text),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-root-active="perception"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeMediation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaLookPerception}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="look_perception"]'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Continuar" }),
    ).not.toBeInTheDocument();
  });

  it("activa MEDIACIÓN solo después de PERCEPCIÓN con raíz, Lía y copy propios", () => {
    const { container } = renderWorld1RootScreen();

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Explorar MEDIACIÓN" }));

    expect(
      screen.getByRole("button", { name: "Explorar RELACIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).toHaveAttribute("data-node-state", "active");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText(world1ConceptCopy.mediation.title.text),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeMediation}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-root-active="mediation"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaGuideMediation}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="guide_mediation"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.exitPath}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaTeleportOut}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Continuar" }),
    ).not.toBeInTheDocument();
  });

  it("cierra MEDIACIÓN en ready_to_continue y navega a la salida controlada", () => {
    const { container } = renderWorld1RootScreen();

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Explorar MEDIACIÓN" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar raíz" }));

    expect(screen.getByTestId("world1-root-stage")).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-root-state="ready_to_continue"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Explorar RELACIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(
      screen.getByRole("button", { name: "Explorar MEDIACIÓN" }),
    ).toHaveAttribute("data-node-state", "completed");
    expect(screen.getByText("LISTO PARA CONTINUAR")).toBeInTheDocument();
    expect(
      screen.getByText(world1ConceptCopy.ready_to_continue.title.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(world1ConceptCopy.ready_to_continue.body.text),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.exitPath}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-exit-path="ready_to_continue"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaReadyContinue}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="ready_continue"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-world1-root-active]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaExit}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.liaTeleportOut}"]`,
      ),
    ).not.toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: "Continuar" });
    expect(continueButton).not.toBeDisabled();
    expect(continueButton).toHaveAttribute("aria-disabled", "false");
    expect(continueButton).toHaveAttribute(
      "data-world1-slot-id",
      "W1_CONTINUE_BTN_01",
    );
    expect(continueButton).toHaveAttribute("data-editorial-status", "TEMP");
    expect(continueButton).toHaveAttribute(
      "data-world1-exit-target",
      worldOneToWorldTwoTransitionRoute,
    );

    fireEvent.click(continueButton);

    expect(screen.getByTestId("current-route")).toHaveTextContent(
      worldOneToWorldTwoTransitionRoute,
    );
    expect(
      JSON.parse(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "{}"),
    ).toMatchObject({ schemaVersion: 1, completedStations: [1] });
  });

  it("falla cerrado y reintenta completion sin repetir la narrativa", () => {
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
    const { container } = renderWorld1RootScreen();

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Explorar PERCEPCIÓN" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Explorar MEDIACIÓN" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar raíz" }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(
      screen.getByText(
        "No fue posible guardar tu progreso. Intenta nuevamente.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reintentar" })).toHaveFocus();
    expect(screen.getByTestId("current-route")).toHaveTextContent(
      "/estacion/1",
    );
    expect(container).toHaveTextContent("LISTO PARA CONTINUAR");

    storageFails = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(screen.getByTestId("current-route")).toHaveTextContent(
      worldOneToWorldTwoTransitionRoute,
    );
  });

  it("mantiene el asset de salida fuera del preload critico ready", () => {
    expect(world1RootAssets.exitPath).toBe(
      "/assets/gvo/stations/world-1-root/exit-path/world1_root_exit_path_approved_v1.png",
    );
    expect(screenAssetBundles.world1RootReady.assets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: world1RootAssets.liaReadyContinue }),
      ]),
    );
    expect(screenAssetBundles.world1RootReady.assets).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: world1RootAssets.exitPath }),
      ]),
    );
  });

  it("PERCEPCIÓN no se activa desde intro y MEDIACIÓN no se activa antes de PERCEPCIÓN", () => {
    const { container } = renderWorld1RootScreen();

    fireEvent.click(
      screen.getByRole("button", {
        name: "PERCEPCIÓN bloqueada en esta fase",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "MEDIACIÓN bloqueada en esta fase",
      }),
    );

    expect(
      screen.getByText(world1ConceptCopy.intro.title.text),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-world1-root-active]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="point_relation"]'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Explorar RELACIÓN" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: "MEDIACIÓN bloqueada en esta fase",
      }),
    );

    expect(screen.getAllByText("RELACIÓN").length).toBeGreaterThanOrEqual(2);
    expect(
      container.querySelector('[data-world1-root-active="mediation"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-world1-lia-pose="guide_mediation"]'),
    ).not.toBeInTheDocument();
  });

  it("no muestra controles ni guias de calibracion en runtime", () => {
    renderWorld1RootScreen();

    expect(screen.queryByText("Calibración Mundo I")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Calibrador Mundo I — solo desarrollo"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("plantX")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("rootOriginX")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("activeRelationX")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("liaPointRelationX"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/--world1-root-origin-x/),
    ).not.toBeInTheDocument();
  });

  it("renderiza el calibrador dev con la misma base geometrica del runtime", () => {
    render(<World1RootLayoutCalibrator />);

    expect(screen.getByTestId("world1-layout-calibrator")).toBeInTheDocument();
    expect(screen.getByTestId("world1-calibrator-stage")).toHaveAttribute(
      "data-world1-coordinate-system",
      WORLD1_ROOT_COORDINATE_SYSTEM_ID,
    );
    expect(
      screen.getAllByText("Calibrador Mundo I — solo desarrollo").length,
    ).toBeGreaterThanOrEqual(1);
  });
});
