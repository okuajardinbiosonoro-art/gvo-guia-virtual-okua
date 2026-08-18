// @ts-expect-error Vitest ejecuta este archivo en Node; el tsconfig de producción excluye sus tipos.
import { createHash } from "node:crypto";
// @ts-expect-error Vitest ejecuta este archivo en Node; el tsconfig de producción excluye sus tipos.
import { existsSync, readFileSync } from "node:fs";
// @ts-expect-error Vitest ejecuta este archivo en Node; el tsconfig de producción excluye sus tipos.
import { resolve } from "node:path";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { gestureHintAssets } from "../../components/GestureHint/gestureHintAssets";
import { WORLD3_CHECKPOINT_STORAGE_KEY } from "../../domain/checkpoints/world3Checkpoint";
import { GVO_PROGRESS_STORAGE_KEY } from "../../domain/progress/progress.storage";
import { station3Lia, station3Records } from "./station3Content";
import {
  PLANT_NARRATIVE_EXIT_MS,
  PLANT_NARRATIVE_TYPEWRITER_SPEED_MS,
} from "./PlantNarrativeSequence";
import {
  PROTOTYPE_NARRATIVE_EXIT_MS,
  PROTOTYPE_NARRATIVE_READY_DELAY_MS,
  PROTOTYPE_NARRATIVE_TYPEWRITER_SPEED_MS,
  PrototypeNarrativeSequence,
} from "./PrototypeNarrativeSequence";
import {
  SIGNAL_NARRATIVE_EXIT_MS,
  SIGNAL_NARRATIVE_READY_DELAY_MS,
  SIGNAL_NARRATIVE_TYPEWRITER_SPEED_MS,
  SignalNarrativeSequence,
} from "./SignalNarrativeSequence";
import {
  SIGNAL_CAPTURE_TRACE_POINTS,
  SIGNAL_EVIDENCE_TRACE_POINTS,
  SIGNAL_INSPECTION_TRACE_POINTS,
  SIGNAL_TRACE_REVEAL_MS,
  SignalTraceDisplay,
} from "./SignalTraceDisplay";
import { World3LiaActor, type World3LiaPose } from "./World3LiaActor";
import { world3IndexMotifsByProgress } from "./World3IndexNotebookMarks";
import {
  world3PageTurnGeometryContract,
  world3TurnPageAlphaBounds,
  world3TurnPageTextureNormalization,
} from "./World3PageTurnLayer";
import { World3RootScreen } from "./World3RootScreen";

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
import { world3RuntimeAssets } from "./world3RuntimeAssets";
import { world3SemanticAssetManifest } from "./world3SemanticAssetManifest";

declare const process: { cwd: () => string };

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderStation3() {
  return render(
    <MemoryRouter initialEntries={["/estacion/3"]}>
      <World3RootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function getState(container: HTMLElement) {
  return container
    .querySelector("[data-station3-state]")
    ?.getAttribute("data-station3-state");
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function enterStation(container: HTMLElement) {
  advance(1000);
  expect(getState(container)).toBe("station3_index");
}

function recordButton(container: HTMLElement, recordId: string) {
  const button = container.querySelector<HTMLButtonElement>(
    `.s3-page--base [data-station3-record="${recordId}"]`,
  );
  if (!button) {
    throw new Error(`Record button not found: ${recordId}`);
  }
  return button;
}

function openRecord(container: HTMLElement, recordId: string) {
  fireEvent.click(recordButton(container, recordId));
  advance(700);
  if (recordId === "planta") {
    advance(150);
  }
  if (recordId === "prototipo") {
    advance(150);
  }
  if (recordId === "senal") {
    advance(150);
  }
}

function finishPlantNarrative(container: HTMLElement) {
  const steps = station3Records[0].plantPage!.narrativeSteps;
  for (const step of steps) {
    advance(step.text.length * PLANT_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(step.holdMs);
    advance(PLANT_NARRATIVE_EXIT_MS);
  }
  expect(
    container.querySelector('[data-station3-plant-sequence-state="summary"]'),
  ).toBeInTheDocument();
}

function advancePrototypeNarrativeToSummary(container: HTMLElement) {
  const steps = station3Records[1].prototypePage!.narrativeSteps;
  for (const step of steps) {
    advance(step.text.length * PROTOTYPE_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(step.holdMs);
    advance(PROTOTYPE_NARRATIVE_EXIT_MS);
  }
  expect(
    container.querySelector('[data-station3-prototype-phase="summary"]'),
  ).toBeInTheDocument();
  expect(
    container.querySelector(
      '[data-station3-prototype-sequence-state="summary"]',
    ),
  ).toBeInTheDocument();
}

function finishPrototypeNarrative(container: HTMLElement) {
  advancePrototypeNarrativeToSummary(container);
  advance(PROTOTYPE_NARRATIVE_READY_DELAY_MS);
  expect(
    container.querySelector('[data-station3-prototype-phase="ready"]'),
  ).toBeInTheDocument();
}

function advanceSignalNarrativeToSummary(container: HTMLElement) {
  const steps = station3Records[2].signalPage!.narrativeSteps;
  for (const step of steps) {
    advance(step.text.length * SIGNAL_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(step.holdMs);
    advance(SIGNAL_NARRATIVE_EXIT_MS);
  }
  expect(
    container.querySelector('[data-station3-signal-phase="summary"]'),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-station3-signal-sequence-state="summary"]'),
  ).toBeInTheDocument();
}

function finishSignalNarrative(container: HTMLElement) {
  advanceSignalNarrativeToSummary(container);
  advance(SIGNAL_NARRATIVE_READY_DELAY_MS);
  expect(
    container.querySelector('[data-station3-signal-phase="ready"]'),
  ).toBeInTheDocument();
}

function completeRecord(container: HTMLElement, recordId: string) {
  openRecord(container, recordId);
  if (recordId === "planta") {
    finishPlantNarrative(container);
  }
  if (recordId === "prototipo") {
    finishPrototypeNarrative(container);
  }
  if (recordId === "senal") {
    finishSignalNarrative(container);
  }
  const confirm = container.querySelector<HTMLButtonElement>(
    `[data-station3-record-confirm="${recordId}"]`,
  );
  if (!confirm) {
    throw new Error(`Confirm button not found: ${recordId}`);
  }
  fireEvent.click(confirm);
  if (recordId === "planta") {
    advance(700);
    advance(700);
    advance(0);
  } else if (recordId === "prototipo") {
    advance(800);
    advance(700);
  } else {
    advance(800);
    advance(700);
  }
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

function stubViewport(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    writable: true,
    value: height,
  });
  act(() => window.dispatchEvent(new Event("resize")));
}

function seedWorld3Checkpoint(completedRecordIds: readonly string[]) {
  window.localStorage.setItem(
    WORLD3_CHECKPOINT_STORAGE_KEY,
    JSON.stringify({
      completedRecordIds,
      schemaVersion: 1,
      updatedAt: "2026-08-05T16:00:00.000Z",
    }),
  );
}

function readWorld3PrefixForTest() {
  const raw = window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY);
  return raw ? JSON.parse(raw).completedRecordIds : [];
}

describe("World3RootScreen — Cuaderno Pixel de Pruebas", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("MutationObserver", undefined);
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, "matchMedia");
    window.history.replaceState({}, "", "/");
    stubViewport(1024, 768);
  });

  it.each([
    [360, 560, "compact-scroll"],
    [390, 844, "portrait-balanced"],
    [768, 1024, "tablet-portrait"],
    [1024, 768, "tablet-landscape"],
  ])("marca el modo responsive %ix%i como %s", (width, height, layout) => {
    stubViewport(width, height);
    const { container } = renderStation3();

    expect(
      container.querySelector("[data-world3-index-layout]"),
    ).toHaveAttribute("data-world3-index-layout", layout);
  });

  it("renderiza la estación pixel con título, Lía única y mensaje inicial", () => {
    const { container } = renderStation3();

    expect(getState(container)).toBe("station3_entering");
    expect(
      screen.getByRole("heading", { name: /Cuaderno Pixel de Pruebas/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ESTACIÓN III/)).toBeInTheDocument();

    enterStation(container);

    expect(screen.getByText(station3Lia.intro)).toBeInTheDocument();
    expect(container.querySelectorAll("[data-station3-lia]")).toHaveLength(1);
    expect(container.querySelector("[data-station3-lia]")).toHaveAttribute(
      "data-lia-source",
      "world3-approved-runtime-asset",
    );
    expect(container.querySelector(".mobile-shell")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Sin audio · Sin Internet · Mobile-first"),
    ).not.toBeInTheDocument();
  });

  it("no escribe al montar una sesión fresh", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const { container } = renderStation3();

    enterStation(container);
    expect(setItem).not.toHaveBeenCalled();
    expect(
      window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY),
    ).toBeNull();
  });

  it("restaura un prefijo parcial sin escribir ni repetir PLANTA o PROTOTIPO", () => {
    seedWorld3Checkpoint(["planta", "prototipo"]);
    const rawBefore = window.localStorage.getItem(
      WORLD3_CHECKPOINT_STORAGE_KEY,
    );
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const { container } = renderStation3();

    advance(1000);
    expect(getState(container)).toBe("station3_signal_unlocked");
    expect(recordButton(container, "planta")).toHaveAttribute(
      "data-record-state",
      "completed",
    );
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-state",
      "completed",
    );
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "available",
    );
    expect(container.querySelector(".s3-stamp")).not.toBeInTheDocument();
    expect(setItem).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY)).toBe(
      rawBefore,
    );
  });

  it("restaura checkpoint completo con sello listo sin repetir unlocking", () => {
    seedWorld3Checkpoint(["planta", "prototipo", "senal"]);
    const { container } = renderStation3();

    advance(1000);
    expect(getState(container)).toBe("station3_ready_to_continue");
    expect(container.querySelector(".s3-stamp")).toHaveAttribute(
      "data-stamp-stage",
      "ready",
    );
    expect(
      screen.getByRole("button", { name: "Escanea el QR para abrir Mundo 4" }),
    ).toBeVisible();
    advance(30_000);
    expect(container.querySelector(".s3-stamp")).toHaveAttribute(
      "data-stamp-stage",
      "ready",
    );
  });

  it.each([
    ["planta", [], "station3_index", "observing"],
    ["prototipo", ["planta"], "station3_prototype_unlocked", "assembly"],
    ["senal", ["planta", "prototipo"], "station3_signal_unlocked", "capturing"],
  ] as const)(
    "reinicia %s no guardado desde su primera etapa tras remontar",
    (recordId, prefix, restoredState, firstPhase) => {
      if (prefix.length > 0) seedWorld3Checkpoint(prefix);
      const first = renderStation3();
      advance(1000);
      openRecord(first.container, recordId);
      expect(
        first.container.querySelector(
          `[data-station3-${recordId === "planta" ? "plant" : recordId === "prototipo" ? "prototype" : "signal"}-phase="${firstPhase}"]`,
        ),
      ).toBeInTheDocument();
      first.unmount();

      const second = renderStation3();
      advance(1000);
      expect(getState(second.container)).toBe(restoredState);
      openRecord(second.container, recordId);
      expect(
        second.container.querySelector(
          `[data-station3-${recordId === "planta" ? "plant" : recordId === "prototipo" ? "prototype" : "signal"}-phase="${firstPhase}"]`,
        ),
      ).toBeInTheDocument();
      expect(readWorld3PrefixForTest()).toEqual(prefix);
    },
  );

  it("prioriza completion global sobre un checkpoint W3 inválido y preserva su raw", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        completedStations: [1, 2, 3],
        schemaVersion: 1,
        updatedAt: "2026-08-05T16:00:00.000Z",
      }),
    );
    const invalidRaw = "{world-three-corrupt::raw";
    window.localStorage.setItem(WORLD3_CHECKPOINT_STORAGE_KEY, invalidRaw);
    const { container } = renderStation3();

    advance(1000);
    expect(getState(container)).toBe("station3_ready_to_continue");
    expect(container.querySelector("[data-station3-state]")).toHaveAttribute(
      "data-station3-checkpoint-recovery",
      "none",
    );
    expect(window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY)).toBe(
      invalidRaw,
    );
  });

  it("preserva raw corrupto, bloquea entradas y descarta sólo W3 tras confirmación", () => {
    const invalidRaw = "{world-three-corrupt::raw";
    window.localStorage.setItem(WORLD3_CHECKPOINT_STORAGE_KEY, invalidRaw);
    window.localStorage.setItem("unrelated.token", "preserved");
    const { container } = renderStation3();

    enterStation(container);
    expect(container.querySelector("[data-station3-state]")).toHaveAttribute(
      "data-station3-checkpoint-recovery",
      "corrupt",
    );
    expect(recordButton(container, "planta")).toBeDisabled();
    fireEvent.click(recordButton(container, "planta"));
    expect(getState(container)).toBe("station3_index");
    expect(window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY)).toBe(
      invalidRaw,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Descartar guardado inválido" }),
    );
    expect(window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY)).toBe(
      invalidRaw,
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirmar descarte" }));
    expect(
      window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY),
    ).toBeNull();
    expect(window.localStorage.getItem("unrelated.token")).toBe("preserved");
    expect(recordButton(container, "planta")).not.toBeDisabled();
  });

  it("ante storage_unavailable exige reintentar lectura antes de habilitar entradas", () => {
    const nativeGetItem = Storage.prototype.getItem;
    let unavailable = true;
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(function (
      this: Storage,
      key,
    ) {
      if (unavailable && key === WORLD3_CHECKPOINT_STORAGE_KEY) {
        throw new Error("storage unavailable");
      }
      return nativeGetItem.call(this, key);
    });
    const { container } = renderStation3();

    enterStation(container);
    expect(container.querySelector("[data-station3-state]")).toHaveAttribute(
      "data-station3-checkpoint-recovery",
      "storage_unavailable",
    );
    expect(recordButton(container, "planta")).toBeDisabled();

    unavailable = false;
    fireEvent.click(
      screen.getByRole("button", { name: "Reintentar acceso al guardado" }),
    );
    expect(container.querySelector("[data-station3-state]")).toHaveAttribute(
      "data-station3-checkpoint-recovery",
      "none",
    );
    expect(recordButton(container, "planta")).not.toBeDisabled();
  });

  it("falla cerrado al guardar PLANTA y reintenta sólo la escritura pendiente", () => {
    const nativeSetItem = Storage.prototype.setItem;
    let storageFails = true;
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(function (this: Storage, key, value) {
        if (key === WORLD3_CHECKPOINT_STORAGE_KEY && storageFails) {
          throw new Error("quota");
        }
        nativeSetItem.call(this, key, value);
      });
    const { container } = renderStation3();
    enterStation(container);
    openRecord(container, "planta");
    finishPlantNarrative(container);

    fireEvent.click(screen.getByRole("button", { name: "Guardar registro" }));

    expect(
      container.querySelector('[data-station3-plant-phase="ready"]'),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-station3-state]")).toHaveAttribute(
      "data-station3-completed-count",
      "0",
    );
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-state",
      "locked",
    );
    expect(
      window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY),
    ).toBeNull();

    storageFails = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(
      container.querySelector('[data-station3-plant-phase="confirmed"]'),
    ).toBeInTheDocument();
    expect(
      JSON.parse(
        window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY) ?? "{}",
      ),
    ).toMatchObject({ completedRecordIds: ["planta"], schemaVersion: 1 });
    expect(
      setItem.mock.calls.filter(
        ([key]) => key === WORLD3_CHECKPOINT_STORAGE_KEY,
      ),
    ).toHaveLength(2);

    advance(680);
    advance(700);
    expect(getState(container)).toBe("station3_prototype_unlocked");
  });

  it("falla cerrado al guardar PROTOTIPO y retry inicia un solo cierre", () => {
    const nativeSetItem = Storage.prototype.setItem;
    let prototypeWriteFails = true;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      const isPrototypeWrite =
        key === WORLD3_CHECKPOINT_STORAGE_KEY &&
        JSON.parse(value).completedRecordIds?.length === 2;
      if (isPrototypeWrite && prototypeWriteFails) throw new Error("quota");
      nativeSetItem.call(this, key, value);
    });
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    openRecord(container, "prototipo");
    finishPrototypeNarrative(container);

    fireEvent.click(screen.getByRole("button", { name: "Guardar registro" }));
    expect(
      container.querySelector('[data-station3-prototype-phase="ready"]'),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-station3-state]")).toHaveAttribute(
      "data-station3-completed-count",
      "1",
    );
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "locked",
    );

    prototypeWriteFails = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(
      container.querySelector('[data-station3-prototype-phase="confirmed"]'),
    ).toBeInTheDocument();
    advance(799);
    expect(getState(container)).toBe("station3_prototype_page");
    advance(1);
    expect(getState(container)).toBe("station3_returning_from_prototype");
    advance(700);
    expect(getState(container)).toBe("station3_signal_unlocked");
  });

  it("falla cerrado al guardar SEÑAL y no muestra sello hasta retry verificado", () => {
    const nativeSetItem = Storage.prototype.setItem;
    let signalWriteFails = true;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key,
      value,
    ) {
      const isSignalWrite =
        key === WORLD3_CHECKPOINT_STORAGE_KEY &&
        JSON.parse(value).completedRecordIds?.length === 3;
      if (isSignalWrite && signalWriteFails) throw new Error("quota");
      nativeSetItem.call(this, key, value);
    });
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    completeRecord(container, "prototipo");
    openRecord(container, "senal");
    finishSignalNarrative(container);

    fireEvent.click(screen.getByRole("button", { name: "Guardar registro" }));
    expect(
      container.querySelector('[data-station3-signal-phase="ready"]'),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-station3-state]")).toHaveAttribute(
      "data-station3-completed-count",
      "2",
    );
    expect(container.querySelector(".s3-stamp")).not.toBeInTheDocument();

    signalWriteFails = false;
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(
      container.querySelector('[data-station3-signal-phase="confirmed"]'),
    ).toBeInTheDocument();
    advance(800);
    advance(700);
    expect(getState(container)).toBe("station3_adjusted_unlocked");
    expect(container.querySelector(".s3-stamp")).toHaveAttribute(
      "data-stamp-stage",
      "unlocking",
    );
  });

  it("hace idempotente el doble click de Guardar registro", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const { container } = renderStation3();
    enterStation(container);
    openRecord(container, "planta");
    finishPlantNarrative(container);
    const save = screen.getByRole("button", { name: "Guardar registro" });

    fireEvent.click(save);
    fireEvent.click(save);

    expect(
      setItem.mock.calls.filter(
        ([key]) => key === WORLD3_CHECKPOINT_STORAGE_KEY,
      ),
    ).toHaveLength(1);
    expect(
      JSON.parse(
        window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY) ?? "{}",
      ).completedRecordIds,
    ).toEqual(["planta"]);
    advance(680);
    advance(700);
    expect(getState(container)).toBe("station3_prototype_unlocked");
  });

  it("no usa audio, video, canvas, iframes ni medios externos", () => {
    const { container } = renderStation3();

    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    const imageSources = Array.from(container.querySelectorAll("img")).map(
      (image) => image.getAttribute("src"),
    );
    expect(imageSources).toHaveLength(5);
    expect(
      imageSources.every((source) => source?.startsWith("/assets/gvo/")),
    ).toBe(true);
  });

  it("centraliza quince rutas aprobadas e integra ASSET_012 a ASSET_015", () => {
    const runtimeSources = [
      world3RuntimeAssets.environment.ambientTexture,
      ...Object.values(world3RuntimeAssets.notebook),
      ...Object.values(world3RuntimeAssets.lia),
      ...Object.values(world3RuntimeAssets.records),
      ...Object.values(world3RuntimeAssets.plant),
      ...Object.values(world3RuntimeAssets.prototype),
      ...Object.values(world3RuntimeAssets.signal),
      ...Object.values(world3RuntimeAssets.index),
    ];

    expect(runtimeSources).toHaveLength(15);
    expect(new Set(runtimeSources)).toHaveLength(15);
    expect(
      runtimeSources.every((source) =>
        source.startsWith(
          "/assets/gvo/stations/world-3/notebook-pixel/runtime/",
        ),
      ),
    ).toBe(true);
    expect(world3SemanticAssetManifest.proceduralOnly).toContain("waveform");
    expect(world3SemanticAssetManifest.proceduralOnly).toContain("checks");
    expect(world3SemanticAssetManifest.proceduralOnly).toContain("stamp");
    expect(world3RuntimeAssets.notebook.turnPage).toBe(
      "/assets/gvo/stations/world-3/notebook-pixel/runtime/notebook/world3_notebook_turn_page_v01.png",
    );
    expect(world3SemanticAssetManifest.notebookTurnPage).toMatchObject({
      asset: world3RuntimeAssets.notebook.turnPage,
      category: "notebook-page",
      scope: "world3-shared",
      role: "transition-sheet",
      dynamic: false,
      canvas: { width: 1024, height: 1024 },
      contentAspectRatio: "derived-from-alpha-bounds",
      transformOrigin: "left center",
    });
    expect(world3RuntimeAssets.plant.notebookMarksSheet).toBe(
      "/assets/gvo/stations/world-3/notebook-pixel/runtime/plant/world3_plant_notebook_marks_sheet_v01.png",
    );
    expect(world3SemanticAssetManifest.plantNotebookMarksSheet).toMatchObject({
      asset: world3RuntimeAssets.plant.notebookMarksSheet,
      category: "notebook-annotation",
      scope: "world3-plant",
      dynamic: false,
      consumedAsSpriteSheet: true,
      grid: {
        columns: 4,
        rows: 2,
        cell: { width: 256, height: 256 },
      },
    });
    expect(world3RuntimeAssets.prototype.notebookMarksSheet).toBe(
      "/assets/gvo/stations/world-3/notebook-pixel/runtime/prototype/world3_prototype_notebook_marks_sheet_v01.png",
    );
    expect(
      world3SemanticAssetManifest.prototypeNotebookMarksSheet,
    ).toMatchObject({
      asset: world3RuntimeAssets.prototype.notebookMarksSheet,
      category: "notebook-annotation",
      scope: "world3-prototype",
      dynamic: false,
      consumedAsSpriteSheet: true,
      grid: {
        columns: 4,
        rows: 2,
        cell: { width: 256, height: 256 },
      },
    });
    expect(world3RuntimeAssets.signal.notebookMarksSheet).toBe(
      "/assets/gvo/stations/world-3/notebook-pixel/runtime/signal/world3_signal_notebook_marks_sheet_v01.png",
    );
    expect(world3SemanticAssetManifest.signalNotebookMarksSheet).toMatchObject({
      asset: world3RuntimeAssets.signal.notebookMarksSheet,
      category: "notebook-annotation",
      scope: "world3-signal",
      dynamic: false,
      consumedAsSpriteSheet: true,
      grid: {
        columns: 4,
        rows: 2,
        cell: { width: 256, height: 256 },
      },
    });
    expect(world3RuntimeAssets.index.notebookMarksSheet).toBe(
      "/assets/gvo/stations/world-3/notebook-pixel/runtime/index/world3_index_notebook_marks_sheet_v01.png",
    );
    expect(world3SemanticAssetManifest.indexNotebookMarksSheet).toMatchObject({
      asset: world3RuntimeAssets.index.notebookMarksSheet,
      category: "notebook-annotation",
      scope: "world3-index",
      dynamic: true,
      consumedAsSpriteSheet: true,
      grid: {
        columns: 4,
        rows: 2,
        cell: { width: 256, height: 256 },
      },
    });
  });

  it("valida ASSET_013 byte-identical, RGBA 4x2 y sin bleed entre celdas", async () => {
    const runtimePath = resolve(
      process.cwd(),
      "public/assets/gvo/stations/world-3/notebook-pixel/runtime/prototype/world3_prototype_notebook_marks_sheet_v01.png",
    );
    const currentUsedPath = resolve(
      process.cwd(),
      "public/assets/gvo/current-used/world-3-root/prototype/world3_prototype_notebook_marks_sheet_v01.png",
    );
    const expectedHash =
      "76052c3563f4754f4b5b993d448d4354c468933e07c45a5389fdfa43f1905907";
    const runtimeBytes = readFileSync(runtimePath);
    const currentUsedBytes = readFileSync(currentUsedPath);

    expect(runtimeBytes.equals(currentUsedBytes)).toBe(true);
    expect(createHash("sha256").update(runtimeBytes).digest("hex")).toBe(
      expectedHash,
    );
    expect(createHash("sha256").update(currentUsedBytes).digest("hex")).toBe(
      expectedHash,
    );

    const metadata = await sharp(runtimeBytes).metadata();
    expect(metadata).toMatchObject({
      format: "png",
      width: 1024,
      height: 512,
      channels: 4,
      hasAlpha: true,
    });

    const { data, info } = await sharp(runtimeBytes)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const alphaAt = (x: number, y: number) =>
      data[(y * info.width + x) * info.channels + 3];
    const separatorColumns = [255, 256, 511, 512, 767, 768];
    const separatorRows = [255, 256];
    expect(
      separatorColumns.every((x) =>
        Array.from({ length: info.height }, (_, y) => alphaAt(x, y)).every(
          (alpha) => alpha === 0,
        ),
      ),
    ).toBe(true);
    expect(
      separatorRows.every((y) =>
        Array.from({ length: info.width }, (_, x) => alphaAt(x, y)).every(
          (alpha) => alpha === 0,
        ),
      ),
    ).toBe(true);
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        let occupied = false;
        for (let y = row * 256; y < (row + 1) * 256 && !occupied; y += 1) {
          for (let x = column * 256; x < (column + 1) * 256; x += 1) {
            if (alphaAt(x, y) > 0) {
              occupied = true;
              break;
            }
          }
        }
        expect(occupied).toBe(true);
      }
    }
  });

  it("valida ASSET_014 byte-identical, RGBA 4x2 y ocho celdas", async () => {
    const runtimePath = resolve(
      process.cwd(),
      "public/assets/gvo/stations/world-3/notebook-pixel/runtime/signal/world3_signal_notebook_marks_sheet_v01.png",
    );
    const currentUsedPath = resolve(
      process.cwd(),
      "public/assets/gvo/current-used/world-3-root/signal/world3_signal_notebook_marks_sheet_v01.png",
    );
    const expectedHash =
      "b8e77d292bb787c684c5cedc5dd75822f36d9db24561c54eaa8574f52b10326c";
    const runtimeBytes = readFileSync(runtimePath);
    const currentUsedBytes = readFileSync(currentUsedPath);

    expect(runtimeBytes).toHaveLength(94_920);
    expect(runtimeBytes.equals(currentUsedBytes)).toBe(true);
    expect(createHash("sha256").update(runtimeBytes).digest("hex")).toBe(
      expectedHash,
    );
    expect(createHash("sha256").update(currentUsedBytes).digest("hex")).toBe(
      expectedHash,
    );

    const metadata = await sharp(runtimeBytes).metadata();
    expect(metadata).toMatchObject({
      format: "png",
      width: 1024,
      height: 512,
      channels: 4,
      hasAlpha: true,
    });

    const { data, info } = await sharp(runtimeBytes)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const alphaAt = (x: number, y: number) =>
      data[(y * info.width + x) * info.channels + 3];
    for (const x of [255, 256, 511, 512, 767, 768]) {
      expect(
        Array.from({ length: info.height }, (_, y) => alphaAt(x, y)).every(
          (alpha) => alpha === 0,
        ),
      ).toBe(true);
    }
    for (const y of [255, 256]) {
      expect(
        Array.from({ length: info.width }, (_, x) => alphaAt(x, y)).every(
          (alpha) => alpha === 0,
        ),
      ).toBe(true);
    }
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        let occupied = false;
        for (let y = row * 256; y < (row + 1) * 256 && !occupied; y += 1) {
          for (let x = column * 256; x < (column + 1) * 256; x += 1) {
            if (alphaAt(x, y) > 0) {
              occupied = true;
              break;
            }
          }
        }
        expect(occupied).toBe(true);
      }
    }
  });

  it("valida ASSET_015 byte-identical, RGBA 4x2, ocho motivos y sin bleed", async () => {
    const runtimePath = resolve(
      process.cwd(),
      "public/assets/gvo/stations/world-3/notebook-pixel/runtime/index/world3_index_notebook_marks_sheet_v01.png",
    );
    const currentUsedPath = resolve(
      process.cwd(),
      "public/assets/gvo/current-used/world-3-root/index/world3_index_notebook_marks_sheet_v01.png",
    );
    const expectedHash =
      "5b3d1e3631da7454f765d7524a7479272a59e45b15109a895cba8b5c4e3ed358";

    expect(existsSync(runtimePath)).toBe(true);
    expect(existsSync(currentUsedPath)).toBe(true);
    const runtimeBytes = readFileSync(runtimePath);
    const currentUsedBytes = readFileSync(currentUsedPath);
    expect(runtimeBytes).toHaveLength(61_421);
    expect(runtimeBytes.equals(currentUsedBytes)).toBe(true);
    expect(createHash("sha256").update(runtimeBytes).digest("hex")).toBe(
      expectedHash,
    );
    expect(createHash("sha256").update(currentUsedBytes).digest("hex")).toBe(
      expectedHash,
    );

    const metadata = await sharp(runtimeBytes).metadata();
    expect(metadata).toMatchObject({
      format: "png",
      width: 1024,
      height: 512,
      channels: 4,
      hasAlpha: true,
    });

    const { data, info } = await sharp(runtimeBytes)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const alphaAt = (x: number, y: number) =>
      data[(y * info.width + x) * info.channels + 3];
    for (const x of [255, 256, 511, 512, 767, 768]) {
      expect(
        Array.from({ length: info.height }, (_, y) => alphaAt(x, y)).every(
          (alpha) => alpha === 0,
        ),
      ).toBe(true);
    }
    for (const y of [255, 256]) {
      expect(
        Array.from({ length: info.width }, (_, x) => alphaAt(x, y)).every(
          (alpha) => alpha === 0,
        ),
      ).toBe(true);
    }
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        let occupied = false;
        for (let y = row * 256; y < (row + 1) * 256 && !occupied; y += 1) {
          for (let x = column * 256; x < (column + 1) * 256; x += 1) {
            if (alphaAt(x, y) > 0) {
              occupied = true;
              break;
            }
          }
        }
        expect(occupied).toBe(true);
      }
    }
  });

  it("el actor de Lía ofrece las cinco poses aprobadas con fallback decorativo", () => {
    const poses: World3LiaPose[] = [
      "idle",
      "pointing",
      "observing",
      "confirming",
      "closure",
    ];
    const { container } = render(
      <>
        {poses.map((pose) => (
          <World3LiaActor key={pose} pose={pose} />
        ))}
      </>,
    );

    expect(container.querySelectorAll("[data-station3-lia]")).toHaveLength(5);
    for (const pose of poses) {
      const actor = container.querySelector(`[data-lia-pose="${pose}"]`);
      expect(actor).toBeInTheDocument();
      expect(actor?.querySelector("img")).toHaveAttribute(
        "src",
        world3RuntimeAssets.lia[pose],
      );
      expect(actor?.querySelector("img")).toHaveAttribute("alt", "");
    }
  });

  it("solo PLANTA está disponible al inicio; PROTOTIPO y SEÑAL bloqueados", () => {
    const { container } = renderStation3();
    enterStation(container);

    expect(recordButton(container, "planta")).toHaveAttribute(
      "data-record-state",
      "available",
    );
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-state",
      "locked",
    );
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-soft-locked",
      "true",
    );
    expect(recordButton(container, "prototipo")).not.toHaveAttribute(
      "aria-disabled",
    );
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "locked",
    );
    expect(
      screen.getByRole("button", {
        name: "Registro 1 de 3. Planta. Disponible.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Registro 2 de 3. Prototipo. Bloqueado. Activa para recibir orientación.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Registro 3 de 3. Señal. Bloqueado. Activa para recibir orientación.",
      }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-station3-record]")).toHaveLength(
      3,
    );
    expect(screen.getByText("Observar lo vivo")).toBeInTheDocument();
    expect(screen.getByText("Construir y probar")).toBeInTheDocument();
    expect(screen.getByText("Revisar la señal")).toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll("[data-station3-record]")).map(
        (button) => button.getAttribute("data-station3-record"),
      ),
    ).toEqual(["planta", "prototipo", "senal"]);
  });

  it("llena el índice de 0 a 3 con sets acumulativos de 0, 3, 6 y 8 motivos", () => {
    const { container } = renderStation3();
    enterStation(container);

    const marks = () =>
      container.querySelector<HTMLElement>(
        '[data-station3-index-marks="progressive"]',
      );
    const expectProgress = (progress: 0 | 1 | 2 | 3) => {
      const motifs = world3IndexMotifsByProgress[progress];
      expect(marks()).toHaveAttribute(
        "data-station3-index-progress",
        `${progress}`,
      );
      expect(marks()).toHaveAttribute(
        "data-station3-index-motifs",
        motifs.join(","),
      );
      expect(
        marks()?.querySelectorAll("[data-station3-index-mark]"),
      ).toHaveLength(motifs.length);
      expect(
        Array.from(
          marks()?.querySelectorAll("[data-station3-index-mark]") ?? [],
        ).map((motif) =>
          Number(motif.getAttribute("data-station3-index-mark")),
        ),
      ).toEqual([...motifs]);
    };

    expectProgress(0);
    expect(marks()).toHaveAttribute("aria-hidden", "true");
    expect(marks()).toHaveAttribute(
      "data-runtime-asset",
      world3RuntimeAssets.index.notebookMarksSheet,
    );

    completeRecord(container, "planta");
    expectProgress(1);
    expect(
      document.body.querySelector(".gvo-gesture-hint.s3-index__gesture"),
    ).toHaveAttribute(
      "data-gvo-gesture-target-label",
      "Abrir registro PROTOTIPO",
    );
    completeRecord(container, "prototipo");
    expectProgress(2);
    expect(
      document.body.querySelector(".gvo-gesture-hint.s3-index__gesture"),
    ).toHaveAttribute("data-gvo-gesture-target-label", "Abrir registro SEÑAL");
    completeRecord(container, "senal");
    expectProgress(3);
    expect(
      document.body.querySelector(".gvo-gesture-hint.s3-index__gesture"),
    ).not.toBeInTheDocument();

    const stylesheet = readFileSync(
      resolve(process.cwd(), "src/screens/World3Root/World3RootScreen.css"),
      "utf8",
    );
    expect(stylesheet).toContain("background-size: 400% 200%");
    expect(stylesheet).toContain("image-rendering: pixelated");
    expect(stylesheet).toContain("pointer-events: none");
  });

  it("guía solo con tap la próxima ficha, espera 1800 ms y desaparece al abrirla", () => {
    const { container } = renderStation3();
    enterStation(container);

    const hint = () =>
      document.body.querySelector<HTMLElement>(
        ".gvo-gesture-hint.s3-index__gesture",
      );
    expect(hint()).toHaveAttribute("data-gvo-gesture-hint", "tap");
    expect(hint()).toHaveAttribute(
      "data-gvo-gesture-target-label",
      "Abrir registro PLANTA",
    );
    expect(hint()).toHaveAttribute("data-gvo-gesture-state", "waiting");
    expect(recordButton(container, "planta")).toContainElement(
      container.querySelector(".s3-record__guide-anchor"),
    );
    expect(
      document.body.querySelector('[data-gvo-gesture-hint="swipe-vertical"]'),
    ).not.toBeInTheDocument();
    expect(
      document.body.querySelector('[data-gvo-gesture-hint="swipe-horizontal"]'),
    ).not.toBeInTheDocument();

    advance(1799);
    expect(hint()).toHaveAttribute("data-gvo-gesture-state", "waiting");
    advance(1);
    expect(hint()).toHaveAttribute("data-gvo-gesture-state", "visible");

    fireEvent.click(recordButton(container, "planta"));
    expect(getState(container)).toBe("station3_turning_to_plant");
    expect(hint()).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-gvo-gesture-target]"),
    ).not.toBeInTheDocument();

    advance(700);
    advance(150);
    expect(getState(container)).toBe("station3_plant_page");
    expect(
      document.body.querySelector("[data-gvo-gesture-hint]"),
    ).not.toBeInTheDocument();
  });

  it("mapea las tres manos aprobadas pero Estación III usa solo tap, también en reduced motion", () => {
    expect(gestureHintAssets).toEqual({
      tap: "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_tap_v01.png",
      "swipe-vertical":
        "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_swipe_vertical_v01.png",
      "swipe-horizontal":
        "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_swipe_horizontal_v01.png",
    });
    expect(new Set(Object.values(gestureHintAssets)).size).toBe(3);

    stubReducedMotion(true);
    const { container } = renderStation3();
    enterStation(container);
    const hint = document.body.querySelector(
      ".gvo-gesture-hint.s3-index__gesture",
    );
    expect(hint).toHaveClass("s3-index__gesture--reduced");
    expect(hint).toHaveAttribute("data-gvo-gesture-hint", "tap");
    expect(hint).toHaveAttribute("data-gvo-gesture-direction", "right");
    expect(hint).toHaveAttribute(
      "data-gvo-gesture-calibration-profile",
      "tap-generic-v1",
    );
    advance(1800);
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "visible");
    expect(
      document.body.querySelector('[data-gvo-gesture-hint^="swipe-"]'),
    ).not.toBeInTheDocument();
  });

  it("tocar un registro bloqueado no lo abre y Lía responde", () => {
    const { container } = renderStation3();
    enterStation(container);

    fireEvent.click(recordButton(container, "senal"));

    expect(getState(container)).toBe("station3_index");
    expect(screen.getByText(station3Lia.locked)).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-pose='pointing']"),
    ).toBeInTheDocument();
    expect(
      document.body.querySelector(".gvo-gesture-hint.s3-index__gesture"),
    ).toHaveAttribute("data-gvo-gesture-target-label", "Abrir registro PLANTA");
  });

  it("gira la página al abrir PLANTA y muestra la hoja interior", () => {
    const { container } = renderStation3();
    enterStation(container);

    fireEvent.click(recordButton(container, "planta"));

    expect(getState(container)).toBe("station3_turning_to_plant");
    const pageTurn = container.querySelector(
      "[data-station3-page-turn='open']",
    );
    expect(pageTurn).toBeInTheDocument();
    expect(pageTurn).toHaveAttribute("data-station3-page-geometry", "stable");
    const plane = container.querySelector("[data-station3-page-turn-plane]");
    expect(plane).toHaveAttribute(
      "data-station3-page-turn-plane",
      "normalized",
    );
    expect(plane).toHaveAttribute(
      "data-station3-turn-hinge",
      "normalized-left-edge",
    );
    expect(container.querySelectorAll(".s3-page-turn__face")).toHaveLength(2);
    const textures = Array.from(
      container.querySelectorAll<HTMLImageElement>(
        "[data-station3-turn-texture]",
      ),
    );
    expect(textures).toHaveLength(2);
    expect(textures.map((image) => image.dataset.station3TurnTexture)).toEqual([
      "alpha-normalized",
      "alpha-normalized",
    ]);
    expect(textures.map((image) => image.src)).toEqual([
      expect.stringContaining(world3RuntimeAssets.notebook.turnPage),
      expect.stringContaining(world3RuntimeAssets.notebook.turnPage),
    ]);

    advance(700);

    expect(getState(container)).toBe("station3_plant_page");
    expect(
      container.querySelector("[data-station3-page-turn]"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Registro 1 de 3")).toBeInTheDocument();
    expect(
      container.querySelector('[data-station3-plant-phase="entering"]'),
    ).toBeInTheDocument();
  });

  it("normaliza el alfa de ASSET_012 y gira únicamente la plane desde su borde real", () => {
    expect(world3TurnPageAlphaBounds).toEqual({
      canvas: { width: 1024, height: 1024 },
      left: 177,
      top: 37,
      width: 676,
      height: 941,
    });
    expect(world3TurnPageTextureNormalization).toEqual({
      left: "-26.18343195%",
      top: "-3.93198725%",
      width: "151.47928994%",
      height: "108.82040383%",
    });
    expect(world3PageTurnGeometryContract).toEqual({
      transformOrigin: "0% 50%",
      perspective: "clamp(1100px, 220vw, 1800px)",
      normalDurationMs: 680,
      reducedDurationMs: 120,
      easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      openDegrees: [0, -180],
      closeDegrees: [-180, 0],
      textureSizing: "alpha-normalized-absolute",
    });

    const { container } = renderStation3();
    enterStation(container);
    fireEvent.click(recordButton(container, "planta"));
    const stage = container.querySelector<HTMLElement>(
      "[data-station3-page-turn]",
    );
    const plane = container.querySelector<HTMLElement>(
      "[data-station3-page-turn-plane]",
    );
    expect(stage?.style.getPropertyValue("--s3-turn-texture-left")).toBe(
      "-26.18343195%",
    );
    expect(stage?.style.getPropertyValue("--s3-turn-texture-top")).toBe(
      "-3.93198725%",
    );
    expect(stage?.style.getPropertyValue("--s3-turn-texture-width")).toBe(
      "151.47928994%",
    );
    expect(stage?.style.getPropertyValue("--s3-turn-texture-height")).toBe(
      "108.82040383%",
    );
    expect(stage?.style.getPropertyValue("--s3-page-perspective")).toBe(
      world3PageTurnGeometryContract.perspective,
    );
    expect(stage?.style.getPropertyValue("--s3-page-turn-duration")).toBe(
      "680ms",
    );
    expect(stage?.style.getPropertyValue("--s3-page-turn-easing")).toBe(
      world3PageTurnGeometryContract.easing,
    );
    expect(plane).toHaveAttribute(
      "data-station3-turn-hinge",
      "normalized-left-edge",
    );
    expect(plane?.className).not.toMatch(/translate|scale/);
    container
      .querySelectorAll<HTMLImageElement>("[data-station3-turn-texture]")
      .forEach((texture) => expect(texture.style.objectFit).toBe(""));
  });

  it("coordina typewriter, hold, salida y resumen antes de habilitar Guardar", () => {
    const { container } = renderStation3();
    enterStation(container);

    fireEvent.click(recordButton(container, "planta"));
    expect(
      container.querySelector('[data-station3-plant-phase="entering"]'),
    ).toBeInTheDocument();

    advance(700);
    advance(150);

    const plantPage = container.querySelector('[data-station3-page="planta"]');
    expect(plantPage).toHaveAttribute("data-station3-plant-phase", "observing");
    expect(plantPage).toHaveAttribute("data-station3-plant-revisit", "false");
    expect(
      container.querySelector("[data-lia-pose='observing']"),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".s3-plant__pulse")).toHaveLength(3);
    expect(
      container.querySelector('[data-station3-plant-pulses="active"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-station3-plant-ground="absent"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".s3-plant__ground"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-station3-plant-visual="shifted-wrapper"]'),
    ).toBeInTheDocument();

    const sequence = container.querySelector(".s3-plant-narrative");
    const steps = station3Records[0].plantPage!.narrativeSteps;
    expect(sequence).toHaveAttribute("data-station3-plant-sequence-step", "1");
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "typing",
    );
    expect(sequence).toHaveAttribute(
      "data-station3-plant-typed-complete",
      "false",
    );
    expect(sequence).toHaveAttribute(
      "data-station3-plant-typewriter",
      "animated",
    );
    expect(sequence).toHaveAttribute("data-station3-plant-show-all", "absent");
    expect(sequence).toHaveAttribute("data-station3-plant-summary", "hidden");
    const typewriter = container.querySelector(
      '[data-station3-typewriter="plant-observe"]',
    );
    expect(typewriter).toHaveAttribute("data-typewriter-visible-chars", "0");
    expect(
      typewriter?.querySelector(".s3-typewriter__fragment"),
    ).toHaveTextContent("");
    expect(
      screen.queryByRole("button", { name: "Guardar registro" }),
    ).not.toBeInTheDocument();

    advance(
      Math.floor(steps[0].text.length / 2) *
        PLANT_NARRATIVE_TYPEWRITER_SPEED_MS,
    );
    const partialChars = Number(
      typewriter?.getAttribute("data-typewriter-visible-chars"),
    );
    expect(partialChars).toBeGreaterThan(0);
    expect(partialChars).toBeLessThan(steps[0].text.length);

    advance(
      (steps[0].text.length - partialChars) *
        PLANT_NARRATIVE_TYPEWRITER_SPEED_MS +
        1,
    );
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "holding",
    );
    expect(sequence).toHaveAttribute(
      "data-station3-plant-typed-complete",
      "true",
    );
    expect(
      typewriter?.querySelector(".s3-typewriter__fragment"),
    ).toHaveTextContent(steps[0].text);

    advance(steps[0].holdMs);
    expect(
      container.querySelector('[data-station3-plant-message-exiting="true"]'),
    ).toBeInTheDocument();
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "exiting",
    );
    advance(PLANT_NARRATIVE_EXIT_MS);
    expect(sequence).toHaveAttribute("data-station3-plant-sequence-step", "2");
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "typing",
    );
    expect(
      container.querySelector('[data-station3-typewriter="plant-care"]'),
    ).toHaveAttribute("data-typewriter-visible-chars", "0");

    advance(steps[1].text.length * PLANT_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[1].holdMs);
    advance(PLANT_NARRATIVE_EXIT_MS);
    expect(sequence).toHaveAttribute("data-station3-plant-sequence-step", "3");
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "typing",
    );

    advance(steps[2].text.length * PLANT_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[2].holdMs);
    advance(PLANT_NARRATIVE_EXIT_MS);
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "summary",
    );
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-step",
      "summary",
    );
    expect(sequence).toHaveAttribute("data-station3-plant-summary", "visible");
    steps.forEach((step) => expect(sequence).toHaveTextContent(step.text));
    expect(plantPage).toHaveAttribute("data-station3-plant-phase", "ready");
    expect(
      screen.getByRole("button", { name: "Guardar registro" }),
    ).toBeInTheDocument();
  });

  it("confirma PLANTA, desbloquea PROTOTIPO y retorna por pointer sin foco amarillo", () => {
    const { container } = renderStation3();
    enterStation(container);
    fireEvent.pointerDown(recordButton(container, "planta"));
    openRecord(container, "planta");
    finishPlantNarrative(container);

    fireEvent.click(screen.getByRole("button", { name: "Guardar registro" }));

    const confirmedPage = container.querySelector(
      '[data-station3-plant-phase="confirmed"]',
    );
    expect(confirmedPage).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-pose='confirming']"),
    ).toBeInTheDocument();
    expect(confirmedPage).toHaveTextContent("Pista registrada");
    expect(
      confirmedPage?.querySelector(".s3-plant__registered-check"),
    ).toBeInTheDocument();

    advance(600);
    expect(getState(container)).toBe("station3_plant_page");
    advance(100);
    advance(700);
    advance(0);

    expect(getState(container)).toBe("station3_prototype_unlocked");
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-state",
      "available",
    );
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-newly-available",
      "true",
    );
    expect(recordButton(container, "planta")).not.toHaveFocus();
    expect(
      container.querySelector("[data-station3-return-modality='pointer']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        "[data-station3-record-highlight='keyboard-focus']",
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-station3-index-entry='return-stable']"),
    ).toBeInTheDocument();
  });

  it("abre la revisita de PLANTA completa, sin pulsos ni relock", () => {
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");

    openRecord(container, "planta");

    const revisitPage = container.querySelector(
      '[data-station3-plant-phase="revisit"]',
    );
    expect(revisitPage).toHaveAttribute("data-station3-plant-revisit", "true");
    expect(revisitPage).toHaveAttribute(
      "data-station3-editorial-source",
      "station3-content-spec",
    );
    expect(container.querySelectorAll(".s3-plant__pulse")).toHaveLength(0);
    expect(revisitPage).toHaveTextContent("Pista registrada");
    const revisitSequence = container.querySelector(
      '[data-station3-plant-sequence-state="summary"]',
    );
    expect(revisitSequence).toHaveAttribute(
      "data-station3-plant-sequence-step",
      "summary",
    );
    expect(revisitSequence).toHaveAttribute(
      "data-station3-plant-typewriter",
      "animated",
    );
    expect(revisitSequence).toHaveAttribute(
      "data-station3-plant-summary",
      "visible",
    );
    station3Records[0].plantPage!.narrativeSteps.forEach((step) => {
      expect(revisitSequence).toHaveTextContent(step.text);
    });
    expect(
      screen.queryByRole("button", { name: "Mostrar todo" }),
    ).not.toBeInTheDocument();
    advance(30_000);
    expect(revisitSequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "summary",
    );
    expect(
      screen.getByRole("button", { name: "Volver al índice" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Volver al índice" }));
    expect(
      container.querySelector("[data-station3-page-turn='close']"),
    ).toHaveAttribute("data-station3-page-geometry", "stable");
    expect(
      container.querySelector("[data-station3-turn-hinge]"),
    ).toHaveAttribute("data-station3-turn-hinge", "normalized-left-edge");
    advance(700);
    advance(0);

    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-state",
      "available",
    );
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "locked",
    );
    expect(recordButton(container, "planta")).not.toHaveFocus();
  });

  it("completar PLANTA desbloquea PROTOTIPO; completar PROTOTIPO desbloquea SEÑAL", () => {
    const { container } = renderStation3();
    enterStation(container);

    completeRecord(container, "planta");

    expect(getState(container)).toBe("station3_prototype_unlocked");
    expect(recordButton(container, "planta")).toHaveAttribute(
      "data-record-state",
      "completed",
    );
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-state",
      "available",
    );
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "locked",
    );

    completeRecord(container, "prototipo");

    expect(getState(container)).toBe("station3_signal_unlocked");
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "available",
    );
  });

  it("abre PROTOTIPO con el page-turn aprobado y activa assembly solo después del giro", () => {
    stubViewport(390, 844);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");

    fireEvent.click(recordButton(container, "prototipo"));

    expect(getState(container)).toBe("station3_turning_to_prototype");
    expect(
      container.querySelector('[data-station3-page-turn="open"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-station3-prototype-phase="entering"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-station3-prototype-sequence-state]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-station3-prototype-test-route]"),
    ).toHaveAttribute("data-station3-prototype-test-route", "hidden");
    expect(
      container.querySelector("[data-station3-prototype-led]"),
    ).toHaveAttribute("data-station3-prototype-led", "off");

    advance(700);
    expect(
      container.querySelector('[data-station3-prototype-phase="entering"]'),
    ).toBeInTheDocument();
    advance(120);

    const page = container.querySelector('[data-station3-page="prototipo"]');
    expect(getState(container)).toBe("station3_prototype_page");
    expect(page).toHaveAttribute("data-station3-prototype-phase", "assembly");
    expect(page).toHaveAttribute("data-station3-prototype-step", "1");
    expect(page).toHaveAttribute(
      "data-station3-editorial-source",
      "station3-content-spec",
    );
    expect(page).toHaveAttribute("aria-label", "Registro 2 de 3. Prototipo");
    expect(
      screen.getByRole("heading", { name: "PROTOTIPO" }),
    ).toBeInTheDocument();
    expect(
      page?.querySelector<HTMLImageElement>(".s3-prototype__asset"),
    ).toHaveAttribute("src", world3RuntimeAssets.records.prototipo);
    expect(
      Array.from(
        page?.querySelectorAll("[data-station3-prototype-zone]") ?? [],
      ).map((zone) => zone.getAttribute("data-station3-prototype-zone")),
    ).toEqual([
      "prototype-header",
      "prototype-workbench",
      "prototype-build-log",
      "prototype-confirmation",
      "prototype-action",
    ]);
    expect(container.querySelectorAll("[data-station3-lia]")).toHaveLength(1);
    expect(
      container.querySelector("[data-lia-pose='pointing']"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Guardar registro" }),
    ).not.toBeInTheDocument();
  });

  it("recorre assembly, testing, learning, summary y ready con ruta, LED y motivos", () => {
    stubViewport(390, 844);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    openRecord(container, "prototipo");

    const steps = station3Records[1].prototypePage!.narrativeSteps;
    const page = container.querySelector('[data-station3-page="prototipo"]');
    const sequence = container.querySelector(
      "[data-station3-prototype-sequence-state]",
    );
    const annotations = container.querySelector(".s3-prototype-annotations");

    expect(page).toHaveAttribute("data-station3-prototype-phase", "assembly");
    expect(sequence).toHaveAttribute(
      "data-station3-prototype-sequence-state",
      "typing",
    );
    expect(
      container.querySelector(
        '[data-station3-typewriter="prototype-assembly"] .s3-typewriter__fragment',
      ),
    ).toHaveTextContent("");
    expect(annotations).toHaveAttribute(
      "data-station3-prototype-annotation-motifs",
      "1,2,4",
    );
    expect(
      container.querySelector("[data-station3-prototype-component-focus]"),
    ).toHaveAttribute(
      "data-station3-prototype-component-focus",
      "terminals,structure",
    );
    expect(
      container.querySelectorAll("[data-station3-prototype-focus-zone]"),
    ).toHaveLength(2);
    expect(
      screen.queryByRole("button", { name: "Mostrar todo" }),
    ).not.toBeInTheDocument();

    advance(steps[0].text.length * PROTOTYPE_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    expect(sequence).toHaveAttribute(
      "data-station3-prototype-sequence-state",
      "holding",
    );
    advance(steps[0].holdMs - 1);
    expect(sequence).toHaveAttribute(
      "data-station3-prototype-sequence-state",
      "holding",
    );
    advance(1);
    expect(sequence).toHaveAttribute(
      "data-station3-prototype-sequence-state",
      "exiting",
    );
    advance(PROTOTYPE_NARRATIVE_EXIT_MS);

    expect(page).toHaveAttribute("data-station3-prototype-phase", "testing");
    expect(page).toHaveAttribute("data-station3-prototype-step", "2");
    expect(annotations).toHaveAttribute(
      "data-station3-prototype-annotation-motifs",
      "3,5,8",
    );
    const route = container.querySelector(
      "[data-station3-prototype-test-route]",
    );
    expect(route).toHaveAttribute(
      "data-station3-prototype-test-route",
      "tracing",
    );
    expect(route).toHaveAttribute("shape-rendering", "crispEdges");
    expect(route).toHaveAttribute("aria-hidden", "true");
    expect(
      route?.querySelectorAll("[data-station3-prototype-route-checkpoint]"),
    ).toHaveLength(4);
    expect(
      Array.from(
        route?.querySelectorAll("[data-station3-prototype-route-checkpoint]") ??
          [],
      ).map((checkpoint) =>
        checkpoint.getAttribute("data-station3-prototype-route-checkpoint"),
      ),
    ).toEqual(["terminal", "dip", "socket", "esp32-led"]);
    expect(
      container.querySelector("[data-station3-prototype-led]"),
    ).toHaveAttribute("data-station3-prototype-led", "testing");
    expect(
      container.querySelector("[data-station3-prototype-led]"),
    ).toHaveAttribute("data-station3-prototype-led-activations", "2");
    expect(
      container.querySelector("[data-lia-pose='observing']"),
    ).toBeInTheDocument();

    advance(steps[1].text.length * PROTOTYPE_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[1].holdMs);
    advance(PROTOTYPE_NARRATIVE_EXIT_MS);
    expect(page).toHaveAttribute("data-station3-prototype-phase", "learning");
    expect(page).toHaveAttribute("data-station3-prototype-step", "3");
    expect(annotations).toHaveAttribute(
      "data-station3-prototype-annotation-motifs",
      "6,7,4",
    );
    expect(
      container.querySelector("[data-station3-prototype-component-focus]"),
    ).toHaveAttribute("data-station3-prototype-component-focus", "esp32,led");

    advance(steps[2].text.length * PROTOTYPE_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[2].holdMs);
    advance(PROTOTYPE_NARRATIVE_EXIT_MS);
    expect(page).toHaveAttribute("data-station3-prototype-phase", "summary");
    expect(page).toHaveAttribute("data-station3-prototype-step", "summary");
    expect(sequence).toHaveAttribute(
      "data-station3-prototype-sequence-state",
      "summary",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-prototype-annotation-source",
      "sprite-sheet-v01",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-prototype-annotation-motifs",
      "1,3,5,6,7,8",
    );
    expect(
      Array.from(
        container.querySelectorAll(".s3-prototype-narrative__summary li"),
      ).map((item) => item.textContent),
    ).toEqual(steps.map((step) => step.text));
    expect(
      screen.queryByRole("button", { name: "Guardar registro" }),
    ).not.toBeInTheDocument();

    advance(PROTOTYPE_NARRATIVE_READY_DELAY_MS);
    expect(page).toHaveAttribute("data-station3-prototype-phase", "ready");
    expect(
      screen.getByRole("button", { name: "Guardar registro" }),
    ).toBeInTheDocument();
  });

  it("en reduced motion muestra mensajes completos, conserva holds y evita recorridos", () => {
    stubReducedMotion(true);
    stubViewport(390, 844);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    openRecord(container, "prototipo");

    const steps = station3Records[1].prototypePage!.narrativeSteps;
    const sequence = container.querySelector(
      '[data-station3-prototype-sequence-motion="reduced"]',
    );
    expect(sequence).toHaveAttribute(
      "data-station3-prototype-sequence-state",
      "holding",
    );
    expect(sequence).toHaveAttribute(
      "data-station3-prototype-typewriter",
      "instant-reduced",
    );
    expect(
      container.querySelector(
        '[data-station3-typewriter="prototype-assembly"] .s3-typewriter__fragment',
      ),
    ).toHaveTextContent(steps[0].text);
    expect(
      container.querySelector(".s3-typewriter__caret"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-station3-prototype-test-route]"),
    ).toHaveAttribute("data-station3-prototype-test-route", "hidden");
    const stylesheet = readFileSync(
      resolve(process.cwd(), "src/screens/World3Root/World3RootScreen.css"),
      "utf8",
    );
    expect(
      stylesheet.match(
        /data-station3-prototype-route-motion="reduced"\]\[data-station3-prototype-test-route="final"\]/g,
      ),
    ).toHaveLength(4);

    advance(steps[0].holdMs - 1);
    expect(sequence).toHaveAttribute(
      "data-station3-prototype-sequence-state",
      "holding",
    );
    advance(1);
    advance(PROTOTYPE_NARRATIVE_EXIT_MS);

    const route = container.querySelector(
      "[data-station3-prototype-test-route]",
    );
    expect(route).toHaveAttribute(
      "data-station3-prototype-test-route",
      "final",
    );
    expect(route).toHaveAttribute(
      "data-station3-prototype-route-motion",
      "reduced",
    );
    expect(
      container.querySelector("[data-station3-prototype-led]"),
    ).toHaveAttribute("data-station3-prototype-led-activations", "0");
    expect(
      container.querySelector(".s3-prototype-annotations"),
    ).toHaveAttribute("data-station3-prototype-annotations-motion", "reduced");
    expect(
      container.querySelector(
        '[data-station3-typewriter="prototype-testing"] .s3-typewriter__fragment',
      ),
    ).toHaveTextContent(steps[1].text);
  });

  it("mantiene el paso activo al rotar entre portrait y tablet landscape", () => {
    stubViewport(390, 844);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    openRecord(container, "prototipo");

    const firstStep = station3Records[1].prototypePage!.narrativeSteps[0];
    advance(
      firstStep.text.length * PROTOTYPE_NARRATIVE_TYPEWRITER_SPEED_MS + 1,
    );
    advance(firstStep.holdMs);
    advance(PROTOTYPE_NARRATIVE_EXIT_MS);
    expect(
      container.querySelector('[data-station3-prototype-phase="testing"]'),
    ).toBeInTheDocument();

    stubViewport(1024, 768);
    const landscapeGuide = container.querySelector(
      '[data-station3-prototype-guide="build-log-confirmation-action"]',
    );
    expect(
      container.querySelector('[data-station3-prototype-phase="testing"]'),
    ).toBeInTheDocument();
    expect(landscapeGuide).toBeInTheDocument();
    expect(
      landscapeGuide?.querySelector(
        '[data-station3-prototype-sequence-step="2"]',
      ),
    ).toBeInTheDocument();
    expect(
      landscapeGuide?.querySelector(
        '[data-station3-typewriter="prototype-testing"]',
      ),
    ).toBeInTheDocument();
    expect(
      landscapeGuide?.querySelector(
        '[data-station3-typewriter="prototype-assembly"]',
      ),
    ).not.toBeInTheDocument();

    stubViewport(390, 844);
    const portraitSequence = container.querySelector(
      '[data-station3-page="prototipo"] [data-station3-prototype-sequence-step="2"]',
    );
    expect(
      container.querySelector('[data-station3-prototype-phase="testing"]'),
    ).toBeInTheDocument();
    expect(portraitSequence).toBeInTheDocument();
  });

  it("confirma con evidencia textual, desbloquea SEÑAL tras 800 ms y revisita estable", () => {
    stubViewport(390, 844);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    openRecord(container, "prototipo");
    finishPrototypeNarrative(container);

    fireEvent.click(screen.getByRole("button", { name: "Guardar registro" }));

    const page = container.querySelector('[data-station3-page="prototipo"]');
    expect(page).toHaveAttribute("data-station3-prototype-phase", "confirmed");
    expect(
      container.querySelector("[data-lia-pose='confirming']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-station3-prototype-led]"),
    ).toHaveAttribute("data-station3-prototype-led", "confirmed");
    expect(
      container.querySelector('[data-station3-prototype-registered="true"]'),
    ).toHaveTextContent("Pista registrada");
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "locked",
    );

    advance(799);
    expect(getState(container)).toBe("station3_prototype_page");
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "locked",
    );
    advance(1);
    expect(getState(container)).toBe("station3_returning_from_prototype");
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "available",
    );
    advance(700);

    expect(getState(container)).toBe("station3_signal_unlocked");
    expect(recordButton(container, "planta")).toHaveAttribute(
      "data-record-state",
      "completed",
    );
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-state",
      "completed",
    );

    openRecord(container, "prototipo");
    const revisitPage = container.querySelector(
      '[data-station3-page="prototipo"]',
    );
    expect(revisitPage).toHaveAttribute(
      "data-station3-prototype-phase",
      "revisit",
    );
    expect(revisitPage).toHaveAttribute(
      "data-station3-prototype-revisit",
      "true",
    );
    expect(
      revisitPage?.querySelector("[data-station3-prototype-test-route]"),
    ).toHaveAttribute("data-station3-prototype-test-route", "final");
    expect(
      revisitPage?.querySelector("[data-station3-prototype-led]"),
    ).toHaveAttribute("data-station3-prototype-led", "off");
    expect(
      revisitPage?.querySelector(".s3-prototype-annotations"),
    ).toHaveAttribute(
      "data-station3-prototype-annotation-motifs",
      "1,3,5,6,7,8",
    );
    expect(
      revisitPage?.querySelector('[data-station3-prototype-registered="true"]'),
    ).toHaveTextContent("Pista registrada");
    expect(
      revisitPage?.querySelector("[data-station3-typewriter]"),
    ).not.toBeInTheDocument();
    const returnButton = screen.getByRole("button", {
      name: "Volver al índice",
    });
    expect(returnButton).toBeInTheDocument();

    advance(30_000);
    expect(revisitPage).toHaveAttribute(
      "data-station3-prototype-phase",
      "revisit",
    );
    fireEvent.click(returnButton);
    advance(700);
    expect(getState(container)).toBe("station3_signal_unlocked");
    expect(recordButton(container, "planta")).toHaveAttribute(
      "data-record-state",
      "completed",
    );
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-record-state",
      "completed",
    );
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "available",
    );
  });

  it("toma la modalidad real de la acción PROTOTIPO al restaurar foco", () => {
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");

    const prototype = recordButton(container, "prototipo");
    fireEvent.keyDown(prototype, { key: "Enter" });
    fireEvent.click(prototype);
    advance(700);
    advance(150);
    finishPrototypeNarrative(container);

    const save = screen.getByRole("button", { name: "Guardar registro" });
    fireEvent.pointerDown(save);
    fireEvent.click(save);
    advance(800);
    advance(700);

    expect(
      container.querySelector("[data-station3-return-modality='pointer']"),
    ).toBeInTheDocument();
    expect(recordButton(container, "prototipo")).not.toHaveFocus();
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-station3-record-highlight",
      "none",
    );

    const completedPrototype = recordButton(container, "prototipo");
    fireEvent.pointerDown(completedPrototype);
    fireEvent.click(completedPrototype);
    advance(700);
    const back = screen.getByRole("button", { name: "Volver al índice" });
    fireEvent.keyDown(back, { key: "Enter" });
    fireEvent.click(back);
    advance(700);

    expect(
      container.querySelector("[data-station3-return-modality='keyboard']"),
    ).toBeInTheDocument();
    expect(recordButton(container, "prototipo")).toHaveFocus();
    expect(recordButton(container, "prototipo")).toHaveAttribute(
      "data-station3-record-highlight",
      "keyboard-focus",
    );
  });

  it("en tablet landscape separa notebook-stage y guide-rail sin columna móvil", () => {
    stubViewport(1024, 768);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    openRecord(container, "prototipo");
    finishPrototypeNarrative(container);

    const page = container.querySelector('[data-station3-page="prototipo"]');
    const guide = container.querySelector(
      '[data-station3-prototype-guide="build-log-confirmation-action"]',
    );
    expect(
      page?.querySelector(".s3-prototype-narrative"),
    ).not.toBeInTheDocument();
    expect(page?.querySelector(".s3-prototype__asset")).toBeInTheDocument();
    expect(guide).toBeInTheDocument();
    expect(guide?.querySelector(".s3-prototype-narrative")).toHaveAttribute(
      "data-station3-prototype-summary",
      "visible",
    );
    expect(
      guide?.querySelector('[data-station3-prototype-zone="prototype-action"]'),
    ).toContainElement(
      screen.getByRole("button", { name: "Guardar registro" }),
    );
    expect(container.querySelectorAll("[data-station3-lia]")).toHaveLength(1);
  });

  it("abre SEÑAL con PageTurn y activa capturing en cinco zonas dedicadas", () => {
    stubViewport(390, 844);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    completeRecord(container, "prototipo");

    fireEvent.click(recordButton(container, "senal"));

    expect(getState(container)).toBe("station3_turning_to_signal");
    expect(
      container.querySelector('[data-station3-page-turn="open"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-station3-signal-phase="entering"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-station3-signal-sequence-state]"),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".s3-stamp")).not.toBeInTheDocument();

    advance(700);
    expect(
      container.querySelector('[data-station3-signal-phase="entering"]'),
    ).toBeInTheDocument();
    advance(120);

    const page = container.querySelector('[data-station3-page="senal"]');
    const device = page?.querySelector<HTMLElement>(".s3-signal-device");
    const viewport = page?.querySelector<HTMLElement>(
      "[data-station3-signal-screen-viewport]",
    );
    expect(getState(container)).toBe("station3_signal_page");
    expect(page).toHaveAttribute("data-station3-signal-phase", "capturing");
    expect(page).toHaveAttribute("data-station3-signal-step", "1");
    expect(page).toHaveAttribute("data-station3-signal-revisit", "false");
    expect(page).toHaveAttribute(
      "data-station3-editorial-source",
      "station3-content-spec",
    );
    expect(page).toHaveAttribute("aria-label", "Registro 3 de 3. Señal");
    expect(screen.getByRole("heading", { name: "SEÑAL" })).toBeInTheDocument();
    expect(
      Array.from(
        page?.querySelectorAll("[data-station3-signal-zone]") ?? [],
      ).map((zone) => zone.getAttribute("data-station3-signal-zone")),
    ).toEqual([
      "signal-header",
      "signal-analysis-stage",
      "signal-observation-log",
      "signal-confirmation",
      "signal-action",
    ]);
    expect(
      device?.querySelector<HTMLImageElement>(".s3-signal-device__asset"),
    ).toHaveAttribute("src", world3RuntimeAssets.records.senal);
    expect(device).toContainElement(viewport ?? null);
    expect(viewport?.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 320 150",
    );
    expect(container.querySelectorAll("[data-station3-lia]")).toHaveLength(1);
    expect(
      page?.querySelector('[data-lia-pose="observing"]'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Guardar registro" }),
    ).not.toBeInTheDocument();
  });

  it("en tablet landscape conserva dispositivo en notebook y lleva Lía y bitácora al guide-rail", () => {
    stubViewport(1024, 768);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    completeRecord(container, "prototipo");
    openRecord(container, "senal");
    finishSignalNarrative(container);

    const page = container.querySelector('[data-station3-page="senal"]');
    const guide = container.querySelector(
      '[data-station3-signal-guide="actor-observation-confirmation-action"]',
    );
    expect(page?.querySelector(".s3-signal-device")).toBeInTheDocument();
    expect(page?.querySelector(".s3-signal-narrative")).not.toBeInTheDocument();
    expect(guide).toBeInTheDocument();
    expect(guide?.querySelector("[data-station3-lia]")).toHaveAttribute(
      "data-lia-pose",
      "observing",
    );
    expect(guide?.querySelector(".s3-signal-narrative")).toHaveAttribute(
      "data-station3-signal-summary",
      "visible",
    );
    expect(
      guide?.querySelector('[data-station3-signal-zone="signal-action"]'),
    ).toContainElement(
      screen.getByRole("button", { name: "Guardar registro" }),
    );
    expect(container.querySelectorAll("[data-station3-lia]")).toHaveLength(1);
  });

  it("recorre captura, inspección, evidencia y confirma SEÑAL después de 800 ms", () => {
    stubViewport(390, 844);
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    completeRecord(container, "prototipo");
    openRecord(container, "senal");

    const steps = station3Records[2].signalPage!.narrativeSteps;
    const page = container.querySelector('[data-station3-page="senal"]');
    const sequence = container.querySelector(
      "[data-station3-signal-sequence-state]",
    );
    const annotations = container.querySelector(".s3-signal-annotations");
    const trace = () =>
      container.querySelector("[data-station3-signal-trace-stage]");

    expect(steps).toEqual([
      {
        id: "capturing",
        text: "Después del montaje, observamos la señal obtenida.",
        holdMs: 3600,
      },
      {
        id: "inspecting",
        text: "La variación mostró ruido, inestabilidad y límites.",
        holdMs: 4300,
      },
      {
        id: "evidence",
        text: "Cada cambio registrado indicó qué debía ajustarse después.",
        holdMs: 4000,
      },
    ]);
    expect(sequence).toHaveAttribute(
      "data-station3-signal-sequence-state",
      "typing",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-signal-annotation-motifs",
      "1,4",
    );
    expect(trace()).toHaveAttribute(
      "data-station3-signal-trace-stage",
      "capturing",
    );
    expect(trace()).toHaveAttribute("data-station3-signal-regions", "none");

    advance(steps[0].text.length * SIGNAL_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    expect(sequence).toHaveAttribute(
      "data-station3-signal-sequence-state",
      "holding",
    );
    advance(steps[0].holdMs);
    expect(sequence).toHaveAttribute(
      "data-station3-signal-sequence-state",
      "exiting",
    );
    advance(SIGNAL_NARRATIVE_EXIT_MS);

    expect(page).toHaveAttribute("data-station3-signal-phase", "inspecting");
    expect(page).toHaveAttribute("data-station3-signal-step", "2");
    expect(annotations).toHaveAttribute(
      "data-station3-signal-annotation-motifs",
      "2,3,5",
    );
    expect(trace()).toHaveAttribute(
      "data-station3-signal-regions",
      "noise,amplitude-limit",
    );
    expect(
      container.querySelectorAll("[data-station3-signal-checkpoint]"),
    ).toHaveLength(3);
    expect(
      container.querySelector('[data-lia-pose="pointing"]'),
    ).toBeInTheDocument();

    advance(steps[1].text.length * SIGNAL_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[1].holdMs);
    advance(SIGNAL_NARRATIVE_EXIT_MS);
    expect(page).toHaveAttribute("data-station3-signal-phase", "evidence");
    expect(page).toHaveAttribute("data-station3-signal-step", "3");
    expect(annotations).toHaveAttribute(
      "data-station3-signal-annotation-motifs",
      "6,7,8",
    );
    expect(trace()).toHaveAttribute("data-station3-signal-evidence", "frozen");
    expect(trace()).toHaveAttribute("data-station3-signal-cursor", "stopped");

    advance(steps[2].text.length * SIGNAL_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[2].holdMs);
    advance(SIGNAL_NARRATIVE_EXIT_MS);
    expect(page).toHaveAttribute("data-station3-signal-phase", "summary");
    expect(annotations).toHaveAttribute(
      "data-station3-signal-annotation-motifs",
      "1,2,3,6,7,8",
    );
    expect(
      Array.from(
        container.querySelectorAll(".s3-signal-narrative__summary li"),
      ).map((item) => item.textContent),
    ).toEqual(steps.map((step) => step.text));
    expect(
      screen.queryByRole("button", { name: "Guardar registro" }),
    ).not.toBeInTheDocument();

    advance(SIGNAL_NARRATIVE_READY_DELAY_MS);
    expect(page).toHaveAttribute("data-station3-signal-phase", "ready");
    const save = screen.getByRole("button", { name: "Guardar registro" });
    fireEvent.pointerDown(save);
    fireEvent.click(save);

    expect(page).toHaveAttribute("data-station3-signal-phase", "confirmed");
    expect(
      container.querySelector("[data-station3-completed-count]"),
    ).toHaveAttribute("data-station3-completed-count", "2");
    expect(
      container.querySelector('[data-station3-signal-registered="true"]'),
    ).toHaveTextContent("Pista registrada");
    expect(
      container.querySelector('[data-lia-pose="confirming"]'),
    ).toBeInTheDocument();
    expect(container.querySelector(".s3-stamp")).not.toBeInTheDocument();

    advance(799);
    expect(getState(container)).toBe("station3_signal_page");
    expect(
      container.querySelector("[data-station3-completed-count]"),
    ).toHaveAttribute("data-station3-completed-count", "2");
    advance(1);
    expect(getState(container)).toBe("station3_returning_from_signal");
    expect(
      container.querySelector("[data-station3-completed-count]"),
    ).toHaveAttribute("data-station3-completed-count", "3");
    advance(700);
    expect(getState(container)).toBe("station3_adjusted_unlocked");
    expect(recordButton(container, "senal")).not.toHaveFocus();
  });

  it("mantiene una traza SVG determinista, sin curvas ni loops, en normal y reduced", () => {
    const capturePoints = SIGNAL_CAPTURE_TRACE_POINTS.map(
      ([x, y]) => `${x},${y}`,
    ).join(" ");
    const inspectionPoints = SIGNAL_INSPECTION_TRACE_POINTS.map(
      ([x, y]) => `${x},${y}`,
    ).join(" ");
    const evidencePoints = SIGNAL_EVIDENCE_TRACE_POINTS.map(
      ([x, y]) => `${x},${y}`,
    ).join(" ");
    const traceSource = readFileSync(
      resolve(process.cwd(), "src/screens/World3Root/SignalTraceDisplay.tsx"),
      "utf8",
    );
    expect(traceSource).not.toContain("Math.random");
    expect(traceSource).not.toContain("getRandomValues");
    expect(traceSource).not.toContain("<animate");
    const { container, rerender } = render(
      <SignalTraceDisplay stage="capturing" reducedMotion={false} />,
    );

    const traceRoot = container.querySelector(
      "[data-station3-signal-trace-stage]",
    );
    const line = container.querySelector(
      '[data-station3-signal-trace="capturing"]',
    );
    const svg = container.querySelector("svg");
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-trace-reveal",
      "revealing-once",
    );
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-trace-loop",
      "absent",
    );
    expect(svg).toHaveAttribute("viewBox", "0 0 320 150");
    expect(svg).toHaveAttribute("shape-rendering", "crispEdges");
    expect(line).toHaveAttribute("points", capturePoints);
    expect(line).toHaveAttribute("vector-effect", "non-scaling-stroke");
    expect(line).toHaveAttribute("stroke-linecap", "butt");
    expect(line).toHaveAttribute("stroke-linejoin", "miter");
    expect(container.querySelector("animate")).not.toBeInTheDocument();
    expect(container.querySelector("path")).not.toBeInTheDocument();

    advance(SIGNAL_TRACE_REVEAL_MS - 1);
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-trace-reveal",
      "revealing-once",
    );
    advance(1);
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-trace-reveal",
      "complete",
    );
    advance(30_000);
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-trace-loop",
      "absent",
    );

    rerender(<SignalTraceDisplay stage="inspecting" reducedMotion={false} />);
    expect(
      container.querySelector('[data-station3-signal-trace="inspecting"]'),
    ).toHaveAttribute("points", inspectionPoints);
    expect(container.querySelectorAll(".s3-signal-region")).toHaveLength(2);
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-regions",
      "noise,amplitude-limit",
    );

    rerender(<SignalTraceDisplay stage="evidence" reducedMotion={false} />);
    expect(
      container.querySelector('[data-station3-signal-trace="evidence"]'),
    ).toHaveAttribute("points", evidencePoints);
    expect(evidencePoints).toBe(inspectionPoints);
    expect(evidencePoints).not.toBe(capturePoints);
    expect(container.querySelectorAll(".s3-signal-region")).toHaveLength(3);
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-evidence",
      "frozen",
    );
    expect(traceRoot).toHaveAttribute("data-station3-signal-cursor", "stopped");

    rerender(<SignalTraceDisplay stage="capturing" reducedMotion />);
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-trace-motion",
      "reduced",
    );
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-trace-reveal",
      "complete",
    );
    expect(traceRoot).toHaveAttribute("data-station3-signal-cursor", "stopped");
    expect(traceRoot).toHaveAttribute(
      "data-station3-signal-cursor-motion",
      "static",
    );
    expect(
      container.querySelector('[data-station3-signal-trace="capturing"]'),
    ).toHaveAttribute("points", capturePoints);
  });

  it("en reduced motion muestra copy completo y conserva holds de SEÑAL", () => {
    const steps = station3Records[2].signalPage!.narrativeSteps;
    const onComplete = vi.fn();
    const { container } = render(
      <SignalNarrativeSequence
        active
        steps={steps}
        reducedMotion
        revisit={false}
        onComplete={onComplete}
      />,
    );

    const sequence = container.querySelector(
      "[data-station3-signal-sequence-state]",
    );
    expect(sequence).toHaveAttribute(
      "data-station3-signal-sequence-motion",
      "reduced",
    );
    expect(sequence).toHaveAttribute(
      "data-station3-signal-sequence-state",
      "holding",
    );
    expect(
      container.querySelector(
        '[data-station3-typewriter="signal-capturing"] .s3-typewriter__fragment',
      ),
    ).toHaveTextContent(steps[0].text);
    expect(
      container.querySelector(".s3-typewriter__caret"),
    ).not.toBeInTheDocument();

    advance(steps[0].holdMs - 1);
    expect(sequence).toHaveAttribute(
      "data-station3-signal-sequence-state",
      "holding",
    );
    advance(1);
    expect(sequence).toHaveAttribute(
      "data-station3-signal-sequence-state",
      "exiting",
    );
    advance(SIGNAL_NARRATIVE_EXIT_MS);
    expect(sequence).toHaveAttribute("data-station3-signal-sequence-step", "2");
    expect(
      container.querySelector(
        '[data-station3-typewriter="signal-inspecting"] .s3-typewriter__fragment',
      ),
    ).toHaveTextContent(steps[1].text);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("reabre SEÑAL como evidencia estática sin relock ni timers narrativos", () => {
    stubViewport(390, 844);
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    completeRecord(container, "prototipo");
    completeRecord(container, "senal");
    advance(1600);

    openRecord(container, "senal");
    const page = container.querySelector('[data-station3-page="senal"]');
    const trace = container.querySelector("[data-station3-signal-trace-stage]");
    expect(page).toHaveAttribute("data-station3-signal-phase", "revisit");
    expect(page).toHaveAttribute("data-station3-signal-revisit", "true");
    expect(page).toHaveAttribute("data-station3-signal-composition", "summary");
    expect(trace).toHaveAttribute("data-station3-signal-evidence", "frozen");
    expect(trace).toHaveAttribute("data-station3-signal-cursor", "stopped");
    expect(page?.querySelector(".s3-signal-annotations")).toHaveAttribute(
      "data-station3-signal-annotation-motifs",
      "1,2,3,6,7,8",
    );
    expect(
      page?.querySelector('[data-station3-signal-registered="true"]'),
    ).toHaveTextContent("Pista registrada");
    expect(
      page?.querySelector("[data-station3-typewriter]"),
    ).not.toBeInTheDocument();
    const back = screen.getByRole("button", { name: "Volver al índice" });

    advance(30_000);
    expect(page).toHaveAttribute("data-station3-signal-phase", "revisit");
    fireEvent.keyDown(back, { key: "Enter" });
    fireEvent.click(back);
    advance(700);
    expect(getState(container)).toBe("station3_ready_to_continue");
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-record-state",
      "completed",
    );
    expect(
      screen.getByRole("button", { name: "Escanea el QR para abrir Mundo 4" }),
    ).toHaveAttribute("data-interstation-qr-action", "open");
    expect(recordButton(container, "senal")).toHaveFocus();
    expect(recordButton(container, "senal")).toHaveAttribute(
      "data-station3-record-highlight",
      "keyboard-focus",
    );
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    focusSpy.mockRestore();
  });

  it("completar SEÑAL activa el sello AJUSTADO y luego ready_to_continue", () => {
    const { container } = renderStation3();
    enterStation(container);

    completeRecord(container, "planta");
    completeRecord(container, "prototipo");

    expect(container.querySelector(".s3-stamp")).not.toBeInTheDocument();

    completeRecord(container, "senal");

    expect(getState(container)).toBe("station3_adjusted_unlocked");
    const stamp = container.querySelector(".s3-stamp");
    expect(stamp).toBeInTheDocument();
    expect(stamp).toHaveAttribute("data-stamp-stage", "unlocking");
    expect(stamp).toHaveAttribute("aria-label", "Proceso de pruebas ajustado.");
    expect(screen.getByText(station3Lia.adjusted)).toBeInTheDocument();

    advance(1600);

    expect(getState(container)).toBe("station3_ready_to_continue");
    expect(container.querySelector(".s3-stamp")).toHaveAttribute(
      "data-stamp-stage",
      "ready",
    );
    expect(
      container.querySelector("[data-lia-pose='closure']"),
    ).toBeInTheDocument();
  });

  it("Continuar no existe en el árbol interactivo antes de AJUSTADO", () => {
    const { container } = renderStation3();
    enterStation(container);

    expect(
      screen.queryByRole("button", {
        name: "Escanea el QR para abrir Mundo 4",
      }),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".s3-footer")).toHaveAttribute(
      "data-cta-visible",
      "false",
    );
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/estacion/3",
    );
  });

  it("Continuar se habilita tras el sello y navega a la transición W3→W4", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({ completedStations: [1, 2], updatedAt: null }),
    );
    const { container } = renderStation3();
    enterStation(container);

    completeRecord(container, "planta");
    completeRecord(container, "prototipo");
    completeRecord(container, "senal");
    advance(1600);

    const continueButton = screen.getByRole("button", {
      name: "Escanea el QR para abrir Mundo 4",
    });
    expect(continueButton).toHaveAttribute(
      "data-interstation-qr-action",
      "open",
    );

    fireEvent.click(continueButton);
    expect(getState(container)).toBe("station3_exiting");
    advance(400);

    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-3-to-world-4",
    );
    expect(
      JSON.parse(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "{}"),
    ).toMatchObject({ schemaVersion: 1, completedStations: [1, 2, 3] });
  });

  it("falla cerrado en el sello final y reintenta sin repetir registros", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({ completedStations: [1, 2], updatedAt: null }),
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
    const { container } = renderStation3();
    enterStation(container);
    completeRecord(container, "planta");
    completeRecord(container, "prototipo");
    completeRecord(container, "senal");
    advance(1600);

    fireEvent.click(
      screen.getByRole("button", { name: "Escanea el QR para abrir Mundo 4" }),
    );

    expect(getState(container)).toBe("station3_ready_to_continue");
    expect(
      screen.getByText(
        "No fue posible guardar tu progreso. Intenta nuevamente.",
      ),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-station3-state]")).toHaveAttribute(
      "data-station3-completed-count",
      "3",
    );
    expect(
      JSON.parse(
        window.localStorage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY) ?? "{}",
      ).completedRecordIds,
    ).toEqual(["planta", "prototipo", "senal"]);

    storageFails = false;
    fireEvent.click(
      screen.getByRole("button", {
        name: "Escanea el QR para abrir Mundo 4",
      }),
    );
    advance(400);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/transition/world-3-to-world-4",
    );
  });

  it("en revisión libre los tres registros se reabren en cualquier orden", () => {
    const { container } = renderStation3();
    enterStation(container);

    completeRecord(container, "planta");
    completeRecord(container, "prototipo");
    completeRecord(container, "senal");
    advance(1600);

    expect(
      container.querySelector("[data-station3-revisit='true']"),
    ).toBeInTheDocument();

    openRecord(container, "senal");
    expect(getState(container)).toBe("station3_signal_page");
    expect(
      screen.getByRole("button", { name: "Volver al índice" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Volver al índice" }));
    expect(
      container.querySelector("[data-lia-pose='confirming']"),
    ).toBeInTheDocument();
    advance(700);

    expect(screen.getByText(station3Lia.revisit)).toBeInTheDocument();
    expect(container.querySelector(".s3-stamp")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Escanea el QR para abrir Mundo 4" }),
    ).toHaveAttribute("data-interstation-qr-action", "open");
  });

  it("elimina Mostrar todo y conserva la acción bloqueada hasta el resumen automático", () => {
    const { container } = renderStation3();
    enterStation(container);

    openRecord(container, "planta");

    const sequence = container.querySelector(
      '[data-station3-plant-sequence-state="typing"]',
    );
    expect(sequence).toHaveAttribute("data-station3-plant-sequence-step", "1");
    expect(
      screen.queryByRole("button", { name: "Mostrar todo" }),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(".s3-plant-narrative__show-all"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Guardar registro" }),
    ).not.toBeInTheDocument();

    finishPlantNarrative(container);

    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "summary",
    );
    expect(
      screen.getByRole("button", { name: "Guardar registro" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/estacion/3",
    );
  });

  it("sincroniza motivos del sprite sheet por paso sin conservar SVG procedural", () => {
    const { container } = renderStation3();
    enterStation(container);
    openRecord(container, "planta");

    const annotations = container.querySelector(".s3-plant-annotations");
    const steps = station3Records[0].plantPage!.narrativeSteps;
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotations",
      "step-1",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotations-motion",
      "normal",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotation-source",
      "sprite-sheet-v01",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotation-motifs",
      "1,7",
    );
    expect(
      annotations?.querySelectorAll("[data-station3-plant-annotation-motif]"),
    ).toHaveLength(2);
    expect(annotations?.querySelector("svg")).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-annotation-group]"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-station3-plant-pulse-origin="pot-base"]'),
    ).toBeInTheDocument();

    advance(steps[0].text.length * PLANT_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[0].holdMs);
    advance(PLANT_NARRATIVE_EXIT_MS);
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotations",
      "step-2",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotation-motifs",
      "2,3",
    );

    advance(steps[1].text.length * PLANT_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[1].holdMs);
    advance(PLANT_NARRATIVE_EXIT_MS);
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotations",
      "step-3",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotation-motifs",
      "5,6,8",
    );
    expect(
      annotations?.querySelector('[data-station3-plant-annotation-motif="4"]'),
    ).not.toBeInTheDocument();

    advance(steps[2].text.length * PLANT_NARRATIVE_TYPEWRITER_SPEED_MS + 1);
    advance(steps[2].holdMs);
    advance(PLANT_NARRATIVE_EXIT_MS);
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotations",
      "summary",
    );
    expect(annotations).toHaveAttribute(
      "data-station3-plant-annotation-motifs",
      "1,2,3,5,6,8",
    );
    expect(
      annotations?.querySelectorAll("[data-station3-plant-annotation-motif]"),
    ).toHaveLength(6);
  });

  it("separa summary, planta y confirmación en zonas DOM accesibles", () => {
    const { container } = renderStation3();
    enterStation(container);
    openRecord(container, "planta");
    finishPlantNarrative(container);

    const page = container.querySelector('[data-station3-page="planta"]');
    const narrative = page?.querySelector(
      '[data-station3-plant-zone="plant-narrative-summary"]',
    );
    const visual = page?.querySelector(
      '[data-station3-plant-zone="plant-visual"]',
    );
    const confirmation = page?.querySelector(
      '[data-station3-plant-zone="plant-confirmation"]',
    );

    expect(page).toHaveAttribute(
      "data-station3-plant-composition",
      "summary-first",
    );
    expect(narrative).toHaveAttribute("data-station3-plant-summary", "visible");
    expect(visual).toBeInTheDocument();
    expect(confirmation).toHaveAttribute("data-plant-registered", "false");
    expect(narrative?.contains(confirmation ?? null)).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Guardar registro" }));
    expect(confirmation).toHaveAttribute("data-plant-registered", "true");
    expect(confirmation).toHaveTextContent("Pista registrada");
  });

  it("mantiene una capa índice montada, inerte y geométricamente reutilizable", () => {
    const { container } = renderStation3();
    enterStation(container);

    const indexLayer = container.querySelector(
      '[data-station3-index-layer="mounted"]',
    );
    const plantBefore = recordButton(container, "planta");
    expect(indexLayer).toHaveAttribute("data-station3-layer-visible", "true");
    expect(indexLayer).toHaveAttribute("aria-hidden", "false");
    expect(indexLayer).not.toHaveAttribute("inert");

    openRecord(container, "planta");
    expect(indexLayer).toHaveAttribute("data-station3-layer-visible", "false");
    expect(indexLayer).toHaveAttribute("aria-hidden", "true");
    expect(indexLayer).toHaveAttribute("inert");
    expect(recordButton(container, "planta")).toBe(plantBefore);

    finishPlantNarrative(container);
    fireEvent.click(screen.getByRole("button", { name: "Guardar registro" }));
    advance(700);

    expect(indexLayer).toHaveAttribute("data-station3-layer-visible", "true");
    expect(indexLayer).toHaveAttribute("aria-hidden", "true");
    expect(indexLayer).toHaveAttribute("inert");
    expect(
      container.querySelector('[data-station3-index-entry="return-stable"]'),
    ).toBeInTheDocument();
    expect(recordButton(container, "planta")).toBe(plantBefore);

    advance(700);
    expect(indexLayer).toHaveAttribute("aria-hidden", "false");
    expect(indexLayer).not.toHaveAttribute("inert");
    expect(recordButton(container, "planta")).toBe(plantBefore);
  });

  it("restaura foco solo para teclado con preventScroll y marker amarillo semántico", () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus");
    const { container } = renderStation3();
    enterStation(container);

    const plant = recordButton(container, "planta");
    fireEvent.keyDown(plant, { key: "Enter" });
    fireEvent.click(plant);
    advance(700);
    advance(150);
    finishPlantNarrative(container);
    fireEvent.click(screen.getByRole("button", { name: "Guardar registro" }));
    advance(700);
    advance(700);

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    expect(recordButton(container, "planta")).toHaveFocus();
    expect(
      container.querySelector("[data-station3-return-modality='keyboard']"),
    ).toBeInTheDocument();
    expect(recordButton(container, "planta")).toHaveAttribute(
      "data-station3-record-highlight",
      "keyboard-focus",
    );
    focusSpy.mockRestore();
  });

  it("con reduced motion conserva la secuencia y tiempos, sin traslación ni pulsos", () => {
    stubReducedMotion(true);
    const { container } = renderStation3();

    advance(100);
    expect(getState(container)).toBe("station3_index");
    expect(
      container.querySelector("[data-station3-reduced-motion='true']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-reduced-motion='true']"),
    ).toBeInTheDocument();

    fireEvent.click(recordButton(container, "planta"));
    expect(
      container.querySelector("[data-station3-page-turn]"),
    ).toHaveAttribute("data-station3-page-turn-motion", "reduced");
    advance(200);
    advance(150);

    const sequence = container.querySelector(
      '[data-station3-plant-sequence-motion="reduced"]',
    );
    const steps = station3Records[0].plantPage!.narrativeSteps;
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "holding",
    );
    expect(sequence).toHaveAttribute("data-station3-plant-sequence-step", "1");
    expect(sequence).toHaveAttribute(
      "data-station3-plant-typewriter",
      "instant-reduced",
    );
    expect(sequence).toHaveAttribute(
      "data-station3-plant-typed-complete",
      "true",
    );
    expect(
      container.querySelector(
        '[data-station3-typewriter="plant-observe"] .s3-typewriter__fragment',
      ),
    ).toHaveTextContent(steps[0].text);
    expect(
      container.querySelector('[data-station3-plant-phase="observing"]'),
    ).toBeInTheDocument();
    expect(container.querySelectorAll(".s3-plant__pulse")).toHaveLength(0);
    expect(container.querySelector(".s3-plant-annotations")).toHaveAttribute(
      "data-station3-plant-annotations-motion",
      "reduced",
    );
    expect(
      screen.queryByRole("button", { name: "Guardar registro" }),
    ).not.toBeInTheDocument();

    advance(steps[0].holdMs);
    advance(PLANT_NARRATIVE_EXIT_MS);
    expect(sequence).toHaveAttribute("data-station3-plant-sequence-step", "2");
    expect(sequence).toHaveAttribute(
      "data-station3-plant-sequence-state",
      "holding",
    );
    expect(
      container.querySelector(
        '[data-station3-typewriter="plant-care"] .s3-typewriter__fragment',
      ),
    ).toHaveTextContent(steps[1].text);
  });

  it("permite forzar movimiento normal solo para QA en desarrollo", () => {
    window.history.replaceState({}, "", "/?gvoQaMotion=normal");
    stubReducedMotion(true);
    const { container } = renderStation3();

    advance(1000);

    expect(
      container.querySelector("[data-station3-reduced-motion='false']"),
    ).toBeInTheDocument();
    fireEvent.click(recordButton(container, "planta"));
    expect(
      container.querySelector("[data-station3-page-turn='open']"),
    ).toHaveAttribute("data-station3-page-turn-motion", "normal");
  });

  it("limpia timers de la secuencia PLANTA al desmontar", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { container, unmount } = renderStation3();
    enterStation(container);
    fireEvent.click(recordButton(container, "planta"));
    advance(700);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("limpia timers de la secuencia PROTOTIPO al desmontar", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const onComplete = vi.fn();
    const { unmount } = render(
      <PrototypeNarrativeSequence
        active
        steps={station3Records[1].prototypePage!.narrativeSteps}
        reducedMotion={false}
        revisit={false}
        onComplete={onComplete}
      />,
    );

    advance(500);
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("limpia timers de la secuencia SEÑAL al desmontar", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const onComplete = vi.fn();
    const { container, unmount } = render(
      <SignalNarrativeSequence
        active
        steps={station3Records[2].signalPage!.narrativeSteps}
        reducedMotion={false}
        revisit={false}
        onComplete={onComplete}
      />,
    );

    advance(500);
    expect(container.querySelector(".s3-signal-narrative")).toHaveAttribute(
      "data-station3-signal-show-all",
      "absent",
    );
    unmount();
    advance(30_000);

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
}, 10_000);
