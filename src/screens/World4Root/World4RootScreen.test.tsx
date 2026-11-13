import {
  WORLD4_EXPLANATION_STORAGE_KEY,
  freshWorld4ExplanationCheckpoint,
} from "../../domain/checkpoints/world4ExplanationCheckpoint";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JourneyActivationProvider } from "../../app/journey/JourneyActivation";
import * as essentialFacade from "../../app/journey/journeyEssential";
import {
  ESSENTIAL_STORAGE_KEY,
  invalidateJourneyEssential,
  readEssentialSnapshot,
  setJourneyRuntimeContext,
  type ValidatedJourneyContext,
} from "../../app/journey/journeyEssential";
import {
  WORLD4_ORDERING_STORAGE_KEY,
  WORLD4_ORDERING_TARGET,
  readWorld4OrderingCheckpoint,
} from "../../domain/checkpoints/world4OrderingCheckpoint";
import { World4RootScreen } from "./World4RootScreen";
import { getWorld4OrderingNodes } from "./world4OrderingContent";

const context: ValidatedJourneyContext = {
  active: true,
  attemptId: "test-iv",
  screen: 4,
  mode: "normal",
  authorized: true,
  reviewReturnAllowed: false,
};
async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}
async function click(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
  await flush();
}
function show(change: Partial<ValidatedJourneyContext> = {}) {
  const value = { ...context, ...change };
  setJourneyRuntimeContext(value);
  return render(
    <MemoryRouter>
      <JourneyActivationProvider context={value}>
        <World4RootScreen />
      </JourneyActivationProvider>
    </MemoryRouter>,
  );
}
function checkpoint() {
  const result = readWorld4OrderingCheckpoint();
  if (result.status !== "ok") throw new Error("Missing ordering checkpoint");
  return result.checkpoint;
}
async function start() {
  await click("Comenzar");
}
async function help() {
  await start();
  await click("Ayúdame a ordenar");
  act(() => vi.advanceTimersByTime(700));
  await flush();
}
function piece(index: number) {
  return document.querySelectorAll<HTMLButtonElement>("[data-ordering-object]")[
    index
  ];
}

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  window.localStorage.clear();
  window.sessionStorage.clear();
  // Declared prerequisite fixture for the existing GAME regressions below.
  // The new consumer suite exercises all six explanation gestures from empty.
  window.localStorage.setItem(WORLD4_EXPLANATION_STORAGE_KEY, JSON.stringify({
    ...freshWorld4ExplanationCheckpoint(),
    revision: 16,
    presentedStepIds: [...WORLD4_ORDERING_TARGET],
    confirmedStepIds: [...WORLD4_ORDERING_TARGET],
    activeStepId: null,
    complete: true,
  }));
  setJourneyRuntimeContext({ ...context, active: false });
  invalidateJourneyEssential();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: () => true,
    })),
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Sala IV OBS03 — actual game, essential closure and activity", () => {
  it("recovers start focus after native blur during asynchronous intro confirmation", async () => {
    let release: (() => void) | undefined;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    const confirm = essentialFacade.confirmEssentialStep;
    vi.spyOn(essentialFacade, "confirmEssentialStep").mockImplementationOnce(
      async (input) => {
        await pending;
        return confirm(input);
      },
    );
    show();
    await flush();
    const startButton = screen.getByRole("button", { name: "Comenzar" });
    act(() => startButton.focus());
    fireEvent.click(startButton);
    await flush();
    expect(startButton).toBeDisabled();
    // Chromium blurs a newly disabled focused button; JSDOM needs that native
    // behavior made explicit while the real facade operation is suspended.
    act(() => {
      const bodyTabIndex = document.body.getAttribute("tabindex");
      document.body.tabIndex = -1;
      document.body.focus();
      if (bodyTabIndex === null) document.body.removeAttribute("tabindex");
      else document.body.setAttribute("tabindex", bodyTabIndex);
    });
    expect(document.activeElement).toBe(document.body);
    await act(async () => release?.());
    await flush();
    expect(document.querySelector("main")).toHaveAttribute(
      "data-station4-ordering-phase",
      "playing",
    );
    expect(piece(0)).toHaveFocus();
  });
  it("orders preparation before the same table, transfers start focus and preserves manual pause selection", async () => {
    show();
    await flush();
    const stage = document.querySelector(".s4-ordering-stage");
    const preparation = document.querySelector(".s4-ordering-preparation")!;
    expect(preparation.compareDocumentPosition(stage!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(preparation.querySelectorAll("button")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Ayúdame a ordenar" })).toBeNull();
    const startButton = screen.getByRole("button", { name: "Comenzar" });
    act(() => startButton.focus());
    await start();
    expect(piece(0)).toHaveFocus();
    expect(document.querySelector(".s4-ordering-stage")).toBe(stage);
    const sticky = document.querySelector(".s4-ordering-preparation--sticky")!;
    expect(sticky.parentElement).toContainElement(stage as HTMLElement);
    expect(sticky.querySelector(".s4-ordering-clock")).not.toBeNull();
    expect(
      screen.getAllByRole("button", { name: "Ayúdame a ordenar" }),
    ).toHaveLength(1);
    fireEvent.click(piece(0));
    await flush();
    const selected = checkpoint();
    await click("Pausar");
    const paused = checkpoint();
    expect(paused.selectedObjectId).toBe(selected.selectedObjectId);
    expect(paused.permutation).toEqual(selected.permutation);
    act(() => vi.advanceTimersByTime(20_000));
    await click("Retomar");
    expect(checkpoint().remainingActiveMs).toBe(paused.remainingActiveMs);
    expect(checkpoint().selectedObjectId).toBe(selected.selectedObjectId);
    expect(document.querySelector(".s4-ordering-stage")).toBe(stage);
  });
  it("rejects an old auto-order callback after the shell rotates its attempt token", async () => {
    show();
    await flush();
    await start();
    await click("Ayúdame a ordenar");
    act(() =>
      setJourneyRuntimeContext({ ...context, attemptId: "newer-attempt" }),
    );
    act(() => vi.advanceTimersByTime(700));
    await flush();
    expect(checkpoint().phase).toBe("auto_ordering");
    expect(readEssentialSnapshot()!.stations[4].presentedStepIds).not.toContain(
      "orden_resuelto",
    );
  });
  it("waits for visible presentation when auto-ordering is interrupted by a hidden page", async () => {
    show();
    await flush();
    await start();
    await click("Ayúdame a ordenar");
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    fireEvent(document, new Event("visibilitychange"));
    await flush();
    act(() => vi.advanceTimersByTime(2000));
    await flush();
    expect(checkpoint().phase).toBe("auto_ordering");
    expect(readEssentialSnapshot()!.stations[4].presentedStepIds).not.toContain(
      "orden_resuelto",
    );
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    fireEvent(document, new Event("visibilitychange"));
    await flush();
    act(() => vi.advanceTimersByTime(700));
    await flush();
    expect(checkpoint().phase).toBe("review");
    expect(readEssentialSnapshot()!.stations[4].presentedStepIds).toContain(
      "orden_resuelto",
    );
  });
  it("prepares six objects without presenting, writing, timer, focus or QR while inactive", async () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const interval = vi.spyOn(window, "setInterval");
    const timeout = vi.spyOn(window, "setTimeout");
    show({ active: false });
    await flush();
    expect(document.querySelectorAll("[data-ordering-object]")).toHaveLength(6);
    expect(window.localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole("button", { name: "Comenzar" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
    expect(focus).not.toHaveBeenCalled();
    expect(interval).not.toHaveBeenCalled();
    expect(timeout).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(120_000));
    await flush();
    expect(window.localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
    expect(document.querySelector("main")).toHaveAttribute(
      "data-station4-ordering-phase",
      "introduction",
    );
  });
  it("shows position ordinals; piece names do not reveal their correct step", async () => {
    show();
    await flush();
    await start();
    for (let index = 0; index < WORLD4_ORDERING_TARGET.length; index += 1) {
      expect(piece(index)).toHaveAttribute(
        "aria-label",
        expect.stringContaining("Posición " + (index + 1) + ":"),
      );
      expect(piece(index).getAttribute("aria-label")).not.toMatch(/Paso/);
    }
    expect(readEssentialSnapshot()!.stations[4].confirmedStepIds).toEqual([
      "introduccion_mesa",
      "presentacion_8",
    ]);
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
  });
  it("keyboard arrows move focus, Escape cancels selection and two activations swap pieces", async () => {
    show();
    await flush();
    await start();
    const before = checkpoint().permutation;
    fireEvent.click(piece(0));
    await flush();
    expect(piece(0)).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(piece(0), { key: "ArrowDown" });
    expect(piece(2)).toHaveFocus();
    fireEvent.keyDown(piece(2), { key: "Escape" });
    await flush();
    expect(checkpoint().selectedObjectId).toBeNull();
    fireEvent.click(piece(0));
    fireEvent.click(piece(1));
    await flush();
    expect(checkpoint().permutation[0]).toBe(before[1]);
    expect(checkpoint().permutation[1]).toBe(before[0]);
  });
  it("help auto-orders but requires six manual confirmations and a verified close before QR", async () => {
    show();
    await flush();
    await help();
    expect(checkpoint()).toMatchObject({
      phase: "review",
      outcome: "assisted_requested",
      closed: false,
    });
    expect(document.querySelector("main.s4-ordering")).not.toHaveAttribute("data-station4-ordering-solved");
    expect(readEssentialSnapshot()!.stations[4].outcome).toBeNull();
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
    for (let index = 0; index < WORLD4_ORDERING_TARGET.length - 1; index += 1) {
      expect(checkpoint().reviewIndex).toBe(index);
      await click("Siguiente");
    }
    expect(
      screen.getByText(getWorld4OrderingNodes("es")[5].text),
    ).toBeVisible();
    expect(readEssentialSnapshot()!.stations[4].closed).toBe(false);
    await click("Cerrar");
    expect(checkpoint().confirmedReviewSteps).toEqual(WORLD4_ORDERING_TARGET);
    expect(checkpoint().closed).toBe(true);
    expect(readEssentialSnapshot()!.stations[4]).toMatchObject({
      closed: true,
      outcome: "assisted_review_completed",
    });
    expect(screen.getByRole("button", { name: /Escanea el QR/ })).toBeVisible();
    expect(window.localStorage.getItem("gvo.progress.v1")).toBeNull();
  });
  it("celebrates a solved permutation and allows closure without mandatory review", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    show();
    await flush();
    await start();
    for (
      let index = 0;
      index < WORLD4_ORDERING_TARGET.length - 1 && checkpoint().phase === "playing";
      index += 1
    ) {
      const order = checkpoint().permutation;
      const other = order.indexOf(WORLD4_ORDERING_TARGET[index]);
      if (other === index) continue;
      fireEvent.click(piece(index));
      fireEvent.click(piece(other));
      await flush();
    }
    expect(checkpoint()).toMatchObject({
      phase: "success",
      outcome: "solved_by_visitor",
    });
    expect(screen.getByRole("heading", { name: "¡Felicidades!" })).toBeVisible();
    expect(document.querySelector("main.s4-ordering")).toHaveAttribute("data-station4-ordering-solved", "true");
    expect(screen.queryByText(getWorld4OrderingNodes("es")[5].text)).toBeNull();
    expect(screen.queryByText("Piezas intercambiadas.")).toBeNull();
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
    await click("Cerrar");
    expect(screen.getByRole("heading", { name: "Has llegado al final de esta sala." })).toBeVisible();
    expect(document.querySelector("main.s4-ordering")).toHaveAttribute("data-station4-ordering-solved", "true");
    expect(piece(0)).toBeDisabled();
    expect(checkpoint().confirmedReviewSteps).toEqual([]);
    expect(readEssentialSnapshot()!.stations[4]).toMatchObject({
      closed: true,
      outcome: "solved",
    });
  });
  it("explicit pause preserves active time and returning from hidden requires Resume", async () => {
    show();
    await flush();
    await start();
    act(() => vi.advanceTimersByTime(4000));
    await flush();
    await click("Pausar");
    const saved = checkpoint().remainingActiveMs;
    act(() => vi.advanceTimersByTime(120_000));
    await flush();
    expect(checkpoint().remainingActiveMs).toBe(saved);
    await click("Retomar");
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    fireEvent(document, new Event("visibilitychange"));
    await flush();
    expect(checkpoint().phase).toBe("paused");
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    fireEvent(document, new Event("visibilitychange"));
    await flush();
    expect(checkpoint().phase).toBe("paused");
    expect(screen.getByRole("button", { name: "Retomar" })).toBeVisible();
  });
  it("read-only legacy review explores pieces without writing game or essential facts", async () => {
    show({ mode: "legacy_review_compatible", reviewReturnAllowed: true });
    await flush();
    const before = window.localStorage.getItem(ESSENTIAL_STORAGE_KEY);
    fireEvent.click(piece(4));
    await flush();
    expect(
      screen.getByRole("heading", { name: "Sistema central" }),
    ).toBeVisible();
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(before);
    expect(screen.queryByRole("button", { name: "Comenzar" })).toBeNull();
  });
  it("an ordering save failure preserves pending action and cannot start the clock or grant QR", async () => {
    show();
    await flush();
    const native = Storage.prototype.setItem;
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(function (this: Storage, key, value) {
        if (key === WORLD4_ORDERING_STORAGE_KEY) throw new Error("quota");
        native.call(this, key, value);
      });
    await start();
    expect(screen.getByRole("alert")).toHaveTextContent(/guardado/);
    expect(window.localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBeNull();
    expect(screen.queryByRole("button", { name: /Escanea/ })).toBeNull();
    spy.mockRestore();
    await click("Reintentar guardado");
    expect(checkpoint().phase).toBe("playing");
    expect(checkpoint().remainingActiveMs).toBe(90_000);
  });
  it("resolves faithful English content in render", async () => {
    window.localStorage.setItem("gvo.language.v1", "en");
    show();
    await flush();
    expect(
      screen.getByRole("heading", { name: "Room IV · Biosonic System" }),
    ).toBeVisible();
    expect(screen.queryByRole("button", { name: "Help me arrange them" })).toBeNull();
    fireEvent.click(piece(5));
    await flush();
    expect(
      screen.getByText(getWorld4OrderingNodes("en")[5].text),
    ).toBeVisible();
    await click("Start");
    expect(screen.getByRole("button", { name: "Help me arrange them" })).toBeVisible();
  });
});
