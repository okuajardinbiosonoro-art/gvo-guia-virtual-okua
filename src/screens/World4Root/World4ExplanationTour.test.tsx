import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JourneyActivationProvider } from "../../app/journey/JourneyActivation";
import * as facade from "../../app/journey/journeyEssential";
import {
  WORLD4_EXPLANATION_STORAGE_KEY,
  freshWorld4ExplanationCheckpoint,
  readWorld4ExplanationCheckpoint,
} from "../../domain/checkpoints/world4ExplanationCheckpoint";
import {
  WORLD4_ORDERING_STORAGE_KEY,
  WORLD4_ORDERING_TARGET,
  freshWorld4OrderingState,
  readWorld4OrderingCheckpoint,
} from "../../domain/checkpoints/world4OrderingCheckpoint";
import { World4RootScreen } from "./World4RootScreen";
import { getWorld4OrderingNodes } from "./world4OrderingContent";

const context: facade.ValidatedJourneyContext = {
  active: true,
  attemptId: "obs04-iv-tour",
  screen: 4,
  mode: "normal",
  authorized: true,
  reviewReturnAllowed: false,
};
async function flush() { await act(async () => { await Promise.resolve(); }); }
async function click(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
  await flush();
}
function tree(value = context) {
  return <MemoryRouter><JourneyActivationProvider context={value}><World4RootScreen /></JourneyActivationProvider></MemoryRouter>;
}
function show(value = context) {
  facade.setJourneyRuntimeContext(value);
  return render(tree(value));
}
function explanation() { return readWorld4ExplanationCheckpoint().checkpoint; }
async function completeTour(locale: "es" | "en" = "es", startIndex = 0) {
  const nodes = getWorld4OrderingNodes(locale);
  for (let index = startIndex; index < WORLD4_ORDERING_TARGET.length; index += 1) {
    expect(screen.getByText(nodes[index].text)).toBeVisible();
    expect(document.querySelector("[data-station4-explanation-step]")).toHaveAttribute("data-station4-explanation-step", nodes[index].id);
    await click(index === WORLD4_ORDERING_TARGET.length - 1 ? locale === "es" ? "Continuar al juego" : "Continue to the game" : locale === "es" ? "Siguiente" : "Next");
  }
}
beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(document, "hidden", { configurable: true, value: false });
  window.localStorage.clear();
  window.sessionStorage.clear();
  facade.setJourneyRuntimeContext({ ...context, active: false });
  facade.invalidateJourneyEssential();
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
    matches: false, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })));
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("OBS04 IV — explanation before the separate ordering game", () => {
  it("requires six explicit advances over authentic text before any game clock or QR", async () => {
    show(); await flush();
    expect(document.querySelectorAll("[data-explanation-object]")).toHaveLength(6);
    expect(explanation()).toMatchObject({ presentedStepIds: ["planta"], confirmedStepIds: [], complete: false });
    fireEvent.click(screen.getByRole("button", { name: "Paso 1: Planta" }));
    act(() => vi.advanceTimersByTime(120_000)); await flush();
    expect(explanation().confirmedStepIds).toEqual([]);
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(facade.ESSENTIAL_STORAGE_KEY)).toBeNull();
    expect(screen.queryByRole("button", { name: "Comenzar" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
    await completeTour();
    expect(explanation()).toMatchObject({ presentedStepIds: WORLD4_ORDERING_TARGET, confirmedStepIds: WORLD4_ORDERING_TARGET, complete: true });
    expect(screen.getByRole("button", { name: "Comenzar" })).toBeVisible();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
    await click("Comenzar");
    expect(readWorld4OrderingCheckpoint()).toMatchObject({ status: "ok", checkpoint: { phase: "playing", remainingActiveMs: 90_000, closed: false } });
    expect(window.localStorage.getItem("gvo.progress.v1")).toBeNull();
  });

  it("restores the pending explanation without changing an existing valid paused game", async () => {
    // Explicit local checkpoint fixtures, not a claim of UI-earned access.
    window.localStorage.setItem(WORLD4_EXPLANATION_STORAGE_KEY, JSON.stringify({
      ...freshWorld4ExplanationCheckpoint(), revision: 5,
      presentedStepIds: WORLD4_ORDERING_TARGET.slice(0, 3),
      confirmedStepIds: WORLD4_ORDERING_TARGET.slice(0, 2), activeStepId: "esp32",
    }));
    const priorGame = JSON.stringify({
      ...freshWorld4OrderingState(), phase: "paused", remainingActiveMs: 64_250,
      permutation: [...WORLD4_ORDERING_TARGET.slice(1), "planta"], selectedObjectId: "router",
    });
    window.localStorage.setItem(WORLD4_ORDERING_STORAGE_KEY, priorGame);
    show(); await flush();
    expect(screen.getByRole("heading", { name: "Microcontrolador" })).toBeVisible();
    act(() => vi.advanceTimersByTime(120_000)); await flush();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBe(priorGame);
    await completeTour("es", 2);
    expect(screen.getByRole("button", { name: "Retomar" })).toBeVisible();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBe(priorGame);
    expect(readWorld4OrderingCheckpoint()).toMatchObject({ checkpoint: { remainingActiveMs: 64_250, selectedObjectId: "router" } });
  });

  it("does not reinterpret an old solved game as the six explanatory confirmations", async () => {
    const oldGame = JSON.stringify({ ...freshWorld4OrderingState(), phase: "closed", outcome: "solved_by_visitor", closed: true });
    window.localStorage.setItem(WORLD4_ORDERING_STORAGE_KEY, oldGame);
    show(); await flush();
    expect(screen.getByRole("heading", { name: "Planta" })).toBeVisible();
    expect(explanation().confirmedStepIds).toEqual([]);
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBe(oldGame);
  });

  it.each([
    ["solved_by_visitor", false],
    ["assisted_requested", true],
  ] as const)("recovers verified %s closure after the real tour and an explicit Close, preserving the saved game", async (outcome, partialEssential) => {
    facade.setJourneyRuntimeContext(context);
    if (partialEssential) {
      for (const stepId of ["introduccion_mesa", "presentacion_8"]) {
        const input = { screen: 4 as const, stepId, contentRevision: facade.ESSENTIAL_CONTENT_REVISION, attemptId: context.attemptId };
        expect((await facade.markEssentialPresented({ ...input, mode: "standard" })).ok).toBe(true);
        expect((await facade.confirmEssentialStep({ ...input, cause: "visitor_advance" })).ok).toBe(true);
      }
    }
    const oldGame = JSON.stringify({
      ...freshWorld4OrderingState(), phase: "closed", outcome, closed: true,
      ...(outcome === "assisted_requested" ? { reviewIndex: WORLD4_ORDERING_TARGET.length - 1, confirmedReviewSteps: [...WORLD4_ORDERING_TARGET] } : {}),
    }, null, 2);
    window.localStorage.setItem(WORLD4_ORDERING_STORAGE_KEY, oldGame);
    const initialConfirmed = [...facade.readEssentialSnapshot()!.stations[4].confirmedStepIds];
    show(); await flush();
    await completeTour();
    const explanationBeforeClose = window.localStorage.getItem(WORLD4_EXPLANATION_STORAGE_KEY);
    expect(facade.readEssentialSnapshot()!.stations[4].confirmedStepIds).toEqual(initialConfirmed);
    expect(facade.readEssentialSnapshot()!.stations[4].closed).toBe(false);
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
    const writes = vi.spyOn(Storage.prototype, "setItem");
    await click("Cerrar");
    expect(facade.readEssentialSnapshot()!.stations[4]).toMatchObject({
      closed: true, outcome: outcome === "solved_by_visitor" ? "solved" : "assisted_review_completed",
      confirmedStepIds: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"],
    });
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBe(oldGame);
    expect(writes.mock.calls.filter(([key]) => key === WORLD4_ORDERING_STORAGE_KEY)).toHaveLength(0);
    expect(window.localStorage.getItem(WORLD4_EXPLANATION_STORAGE_KEY)).toBe(explanationBeforeClose);
    expect(screen.getByRole("button", { name: /Escanea el QR/ })).toBeVisible();
    expect(window.localStorage.getItem("gvo.progress.v1")).toBeNull();
    expect(window.localStorage.getItem("gvo.station5.quiz.v1")).toBeNull();
  });

  it("does not recreate reset data from a pending explicit recovery Close", async () => {
    window.localStorage.setItem(WORLD4_ORDERING_STORAGE_KEY, JSON.stringify({
      ...freshWorld4OrderingState(), phase: "closed", outcome: "solved_by_visitor", closed: true,
    }));
    show(); await flush(); await completeTour();
    let release!: () => void;
    const pending = new Promise<void>((resolve) => { release = resolve; });
    const present = facade.markEssentialPresented;
    const pendingPresentation = vi.spyOn(facade, "markEssentialPresented").mockImplementationOnce(async (input) => {
      await pending; return present(input);
    });
    fireEvent.click(screen.getByRole("button", { name: "Cerrar" })); await flush();
    expect(pendingPresentation).toHaveBeenCalledTimes(1);
    act(() => {
      const serial = facade.beginJourneyReset();
      for (const key of [facade.ESSENTIAL_STORAGE_KEY, WORLD4_EXPLANATION_STORAGE_KEY, WORLD4_ORDERING_STORAGE_KEY]) window.localStorage.removeItem(key);
      facade.finishJourneyReset(serial);
    });
    await act(async () => release()); await flush();
    for (const key of [facade.ESSENTIAL_STORAGE_KEY, WORLD4_EXPLANATION_STORAGE_KEY, WORLD4_ORDERING_STORAGE_KEY]) expect(window.localStorage.getItem(key)).toBeNull();
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
  });

  it("prepares the tour inactive without facts, focus, game timers or game mount", async () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const view = show({ ...context, active: false }); await flush();
    act(() => vi.advanceTimersByTime(120_000)); await flush();
    expect(window.localStorage.getItem(WORLD4_EXPLANATION_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
    expect(focus).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
    view.rerender(tree()); await flush();
    expect(explanation().presentedStepIds).toEqual(["planta"]);
    expect(explanation().confirmedStepIds).toEqual([]);
  });

  it("preserves corrupt data, fails closed and retries the reader without silently resetting", async () => {
    const raw = "{not a checkpoint";
    window.localStorage.setItem(WORLD4_EXPLANATION_STORAGE_KEY, raw);
    show(); await flush();
    expect(screen.getByRole("alert")).toHaveTextContent("Los datos originales se conservan");
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
    await click("Reintentar lectura y guardado");
    expect(window.localStorage.getItem(WORLD4_EXPLANATION_STORAGE_KEY)).toBe(raw);
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
  });

  it("keeps a failed confirmation pending and advances only after a verified explicit retry", async () => {
    show(); await flush();
    const prior = window.localStorage.getItem(WORLD4_EXPLANATION_STORAGE_KEY);
    const native = Storage.prototype.setItem;
    const fail = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function(this: Storage, key, value) {
      if (key === WORLD4_EXPLANATION_STORAGE_KEY) throw new Error("quota");
      native.call(this, key, value);
    });
    await click("Siguiente");
    expect(screen.getByRole("alert")).toBeVisible();
    expect(explanation().confirmedStepIds).toEqual([]);
    expect(window.localStorage.getItem(WORLD4_EXPLANATION_STORAGE_KEY)).toBe(prior);
    fail.mockRestore();
    await click("Siguiente");
    expect(explanation().confirmedStepIds).toEqual(["planta"]);
    expect(screen.getByRole("heading", { name: "Bionosificador" })).toBeVisible();
  });

  it("rejects a confirmation scheduled under an old attempt and does not move or recreate facts", async () => {
    let release!: () => void;
    const pending = new Promise<void>((resolve) => { release = resolve; });
    const confirm = facade.confirmWorld4ExplanationStep;
    vi.spyOn(facade, "confirmWorld4ExplanationStep").mockImplementationOnce(async (input) => {
      await pending; return confirm(input);
    });
    show(); await flush();
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" })); await flush();
    facade.setJourneyRuntimeContext({ ...context, attemptId: "replacement-attempt" });
    window.localStorage.removeItem(WORLD4_EXPLANATION_STORAGE_KEY);
    await act(async () => release()); await flush();
    expect(window.localStorage.getItem(WORLD4_EXPLANATION_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole("heading", { name: "Planta" })).toBeVisible();
  });

  it("keeps the read-only table available and permits optional explanation browsing with zero writes", async () => {
    show({ ...context, mode: "legacy_review_compatible", reviewReturnAllowed: true }); await flush();
    expect(document.querySelector("[data-station4-ordering-phase]")).not.toBeNull();
    const before = { ...window.localStorage };
    await click("Recorrer la explicación");
    fireEvent.click(screen.getByRole("button", { name: "Paso 5: Sistema central" })); await flush();
    expect(screen.getByText(getWorld4OrderingNodes("es")[4].text)).toBeVisible();
    await click("Siguiente");
    expect(screen.getByText(getWorld4OrderingNodes("es")[5].text)).toBeVisible();
    await click("Volver a la mesa");
    expect(document.querySelector("[data-station4-ordering-phase]")).not.toBeNull();
    expect({ ...window.localStorage }).toEqual(before);
  });

  it("uses the existing English overlay for the whole tour before exposing Start", async () => {
    window.localStorage.setItem("gvo.language.v1", "en");
    show(); await flush();
    await completeTour("en");
    expect(screen.getByRole("button", { name: "Start" })).toBeVisible();
    expect(explanation().complete).toBe(true);
  });
});
