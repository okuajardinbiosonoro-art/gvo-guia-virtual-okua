import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JourneyActivationProvider } from "../../app/journey/JourneyActivation";
import {
  ESSENTIAL_STORAGE_KEY,
  ESSENTIAL_CONTENT_REVISION,
  essentialSteps,
  markEssentialPresented,
  confirmEssentialStep,
  closeEssentialRoom,
  confirmWorld4ExplanationStep,
  markWorld4ExplanationPresented,
  recordEssentialOutcome,
  invalidateJourneyEssential,
  readEssentialSnapshot,
  setJourneyRuntimeContext,
  type ValidatedJourneyContext,
} from "../../app/journey/journeyEssential";
import * as essentialApi from "../../app/journey/journeyEssential";
import * as journeyIntent from "../../app/journey/journeyIntent";
import {
  markStationCompleted,
  readProgress,
} from "../../domain/progress/progress.storage";
import {
  freshWorld4OrderingState,
  WORLD4_ORDERING_TARGET,
  writeWorld4OrderingCheckpoint,
} from "../../domain/checkpoints/world4OrderingCheckpoint";
import { reduceWorld4Ordering } from "../World4Root/world4OrderingGame";
import { WORLD4_EXPLANATION_REVISION } from "../../domain/checkpoints/world4ExplanationCheckpoint";
import { worldFiveToFinalTransitionRoute } from "../../app/routes";
import { World5RootScreen } from "./World5RootScreen";
import {
  getWorld5CriticalAssetSources,
  getWorld5GalleryEnvironment,
  world5NavigationAssets,
  world5OptionAssets,
} from "./world5RuntimeAssets";
import { station5Questions } from "./station5Content";
import {
  WORLD5_QUIZ_AREA_ORDER,
  WORLD5_QUIZ_STORAGE_KEY,
  readWorld5Quiz,
  readWorld5Rounds,
  WORLD5_ROUNDS_STORAGE_KEY,
  updateWorld5Quiz,
} from "./world5Quiz";
const context: ValidatedJourneyContext = {
  active: true,
  attemptId: "test-v",
  screen: 5,
  mode: "normal",
  authorized: true,
  reviewReturnAllowed: false,
};
function LocationProbe() {
  const location = useLocation();
  return <span data-testid="location" data-location-key={location.key}>{location.pathname}</span>;
}
async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}
async function click(name: string | RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
  await flush();
}
function show(
  change: Partial<ValidatedJourneyContext> = {},
  path = "/estacion/5",
) {
  const value = { ...context, ...change };
  setJourneyRuntimeContext(value);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <JourneyActivationProvider context={value}>
        <World5RootScreen />
        <LocationProbe />
      </JourneyActivationProvider>
    </MemoryRouter>,
  );
}
/** Complete the actual current source prerequisites through verified writers, without forged stored raw. */
async function closePriorJourney() {
  for (const source of ["cover", 1, 2, 3, 4] as const) {
    const attemptId = `v-prerequisite-${source}`;
    setJourneyRuntimeContext({ ...context, screen: source, attemptId });
    const input = {
      screen: source,
      contentRevision: ESSENTIAL_CONTENT_REVISION,
      attemptId,
    };
    if (source === 4) {
      for (const stepId of WORLD4_ORDERING_TARGET) {
        const explanation = { stepId, contentRevision: WORLD4_EXPLANATION_REVISION, attemptId } as const;
        expect((await markWorld4ExplanationPresented(explanation)).ok).toBe(true);
        expect((await confirmWorld4ExplanationStep(explanation)).ok).toBe(true);
      }
      let state = reduceWorld4Ordering(freshWorld4OrderingState(), {
        type: "help",
      });
      state = reduceWorld4Ordering(state, { type: "settle_auto" });
      for (let i = 0; i < WORLD4_ORDERING_TARGET.length - 1; i++)
        state = reduceWorld4Ordering(state, { type: "next_review" });
      state = reduceWorld4Ordering(state, { type: "close" });
      expect(writeWorld4OrderingCheckpoint(state).ok).toBe(true);
    }
    for (const [index, stepId] of essentialSteps[source].entries()) {
      expect(
        (await markEssentialPresented({ ...input, stepId, mode: "assisted" }))
          .ok,
      ).toBe(true);
      if (source === 4 && stepId === "orden_resuelto")
        expect(
          (
            await recordEssentialOutcome({
              ...input,
              screen: 4,
              outcome: "assisted_review_completed",
            })
          ).ok,
        ).toBe(true);
      if (index < essentialSteps[source].length - 1)
        expect(
          (
            await confirmEssentialStep({
              ...input,
              stepId,
              cause: "visitor_advance",
            })
          ).ok,
        ).toBe(true);
    }
    expect(
      (await closeEssentialRoom({ ...input, cause: "visitor_close" })).ok,
    ).toBe(true);
    if (source !== "cover") expect(markStationCompleted(source).ok).toBe(true);
  }
}
async function allAnswers(correct: boolean) {
  for (let index = 0; index < 4; index++) {
    await click(correct ? "Estoy de acuerdo" : "No estoy de acuerdo");
    await click("Siguiente");
  }
}
beforeEach(() => {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  window.localStorage.clear();
  window.sessionStorage.clear();
  setJourneyRuntimeContext({ ...context, active: false });
  invalidateJourneyEssential();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("Sala V OBS03 — ordered writer questions and two real alternatives", () => {
  it.each(["normal", "legacy_review_compatible"] as const)("asset recovery OBS04 restores %s only after a new verified activation on the same route tree", async (mode) => {
    const value: ValidatedJourneyContext = { ...context, mode, reviewReturnAllowed: mode !== "normal" };
    let preparationVerified = true;
    const canActivate = () => preparationVerified;
    const tree = (next: ValidatedJourneyContext) => (
      <MemoryRouter initialEntries={["/estacion/5"]}>
        <JourneyActivationProvider context={next} canActivate={canActivate}>
          <World5RootScreen /><LocationProbe />
        </JourneyActivationProvider>
      </MemoryRouter>
    );
    const mounted = render(tree(value)); await flush();
    const sameMain = document.querySelector("main.s5-quiz");
    const sameImage = document.querySelector(".s5-quiz-gallery")!;
    const sameKey = screen.getByTestId("location").getAttribute("data-location-key");
    fireEvent.error(sameImage); await flush();
    expect(screen.getByRole("alert")).toHaveTextContent("No fue posible cargar las alternativas");
    expect(screen.getByRole("button", { name: "Estoy de acuerdo" })).toBeDisabled();
    const before = { ...localStorage };
    const next = { ...value, attemptId: "new-verified-assets", active: false };
    mounted.rerender(tree(next)); await flush();
    fireEvent.load(sameImage); await flush();
    expect(screen.getByRole("alert")).toBeVisible();
    preparationVerified = false;
    mounted.rerender(tree({ ...next, active: true })); await flush();
    expect(screen.getByRole("alert")).toBeVisible();
    preparationVerified = true;
    mounted.rerender(tree({ ...next, active: true })); await flush();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(document.querySelector("main.s5-quiz")).toBe(sameMain);
    expect(document.querySelector(".s5-quiz-gallery")).toBe(sameImage);
    expect(screen.getByTestId("location")).toHaveAttribute("data-location-key", sameKey);
    expect({ ...localStorage }).toEqual(before);
    if (mode === "normal") expect(screen.getByRole("button", { name: "Estoy de acuerdo" })).toBeEnabled();
    else expect(screen.getByRole("button", { name: "Estoy de acuerdo" })).toBeDisabled();
  });
  it("asset recovery OBS04 preserves an error on same-attempt resume and inactive or rejected replacement", async () => {
    let acceptPreparedAttempt = true;
    const canActivate = () => acceptPreparedAttempt;
    const tree = (value: ValidatedJourneyContext) => (
      <MemoryRouter initialEntries={["/estacion/5"]}>
        <JourneyActivationProvider context={value} canActivate={canActivate}>
          <World5RootScreen /><LocationProbe />
        </JourneyActivationProvider>
      </MemoryRouter>
    );
    const mounted = render(tree(context)); await flush();
    const image = document.querySelector(".s5-quiz-gallery")!;
    fireEvent.error(image); await flush();
    const before = { ...localStorage };
    mounted.rerender(tree({ ...context, active: false })); await flush();
    mounted.rerender(tree({ ...context })); await flush();
    expect(screen.getByRole("alert")).toBeVisible();
    const stalePreparation = { ...context, attemptId: "not-accredited", active: false };
    mounted.rerender(tree(stalePreparation)); await flush();
    expect(screen.getByRole("alert")).toBeVisible();
    acceptPreparedAttempt = false;
    mounted.rerender(tree({ ...stalePreparation, active: true })); await flush();
    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.getByRole("button", { name: "Estoy de acuerdo" })).toBeDisabled();
    expect({ ...localStorage }).toEqual(before);
  });

  it("places one literal prompt before both answers and the single advance in the actual DOM", async () => {
    show();
    await flush();
    const unit = document.querySelector(".s5-question-unit")!;
    expect(Array.from(unit.children).map((child) => child.className)).toEqual([
      "s5-question-prompt s5-quiz-reading",
      "s5-quiz-scene",
      "s5-question-response s5-quiz-reading",
    ]);
    const title = screen.getByRole("heading", {
      name: station5Questions.plantas.title,
    });
    const left = screen.getByRole("button", { name: "Estoy de acuerdo" });
    const right = screen.getByRole("button", { name: "No estoy de acuerdo" });
    const next = screen.getByRole("button", { name: "Pasar pregunta" });
    expect(title).toHaveFocus();
    expect(
      title.compareDocumentPosition(left) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      right.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.getAllByText(station5Questions.plantas.question),
    ).toHaveLength(1);
    expect(
      screen.getByRole("group", { name: station5Questions.plantas.question }),
    ).toHaveAccessibleDescription(station5Questions.plantas.instruction);
  });
  it("groups four semantic stops with the question and removes the decorative S path", async () => {
    const { container } = show(); await flush();
    const journey = container.querySelector<HTMLElement>(".s5-gallery-journey")!;
    const navigation = screen.getByRole("navigation");
    const unit = journey.querySelector<HTMLElement>(".s5-question-unit")!;
    expect(journey).toContainElement(navigation);
    const room = screen.getByRole("main");
    expect(room).toContainElement(journey);
    expect(room.querySelectorAll(".s5-quiz-backdrop .s5-quiz-gallery")).toHaveLength(1);
    expect(journey).toContainElement(unit);
    expect(navigation.compareDocumentPosition(unit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(navigation.querySelector("svg")).toBeNull();
    expect(navigation.querySelectorAll("button")).toHaveLength(4);
    fireEvent.click(navigation); await flush();
    expect(readWorld5Rounds().quiz.answeredQuestions).toEqual([]);
    expect(screen.getByRole("group", { name: station5Questions.plantas.question }).querySelectorAll("button")).toHaveLength(2);
  });
  it("states the new four-correct prize condition before answering and fixes only the Plantas title capitalization", async () => {
    show(); await flush();
    expect(screen.getByRole("heading", { name: "Plantas - trivia 1 de 4" })).toBeVisible();
    const introduction = screen.getByText(/Coloca a prueba tu aprendizaje/).parentElement;
    expect(introduction).toHaveTextContent("El premio sorpresa requiere cuatro aciertos en una misma ronda.");
    expect(screen.queryByText(/llévate un/)).toBeNull();
    expect(screen.queryByText("Reclama tu premio sorpresa en la taquilla.")).toBeNull();
  });
  it("locks a wrong answer for its round and recovers its disabled focus to the same feedback once", async () => {
    show(); await flush();
    const feedback = document.querySelector(".s5-quiz-feedback")!;
    const wrong = screen.getByRole("button", { name: "No estoy de acuerdo" });
    act(() => wrong.focus()); await click("No estoy de acuerdo");
    expect(document.querySelector(".s5-quiz-feedback")).toBe(feedback);
    expect(feedback).toHaveFocus(); expect(feedback).toHaveAttribute("aria-live", "off");
    expect(wrong).toBeDisabled(); expect(screen.getByRole("button", { name: "Estoy de acuerdo" })).toBeDisabled();
    expect(wrong).toHaveAttribute("data-answer-selected", "true");
    expect(document.querySelector(".s5-quiz-lia")).toHaveAttribute("data-lia-direction", "right");
    expect(screen.queryByText(station5Questions.plantas.point)).toBeNull();
    const next = screen.getByRole("button", { name: "Siguiente" });
    act(() => next.focus()); fireEvent(document, new Event("visibilitychange")); await flush();
    expect(next).toHaveFocus();
  });
  it("announces feedback without moving a still-valid focus elsewhere in the question", async () => {
    show();
    await flush();
    const title = screen.getByRole("heading", {
      name: station5Questions.plantas.title,
    });
    expect(title).toHaveFocus();
    await click("Estoy de acuerdo");
    expect(title).toHaveFocus();
    expect(document.querySelector(".s5-quiz-feedback")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });
  it("rejects answer callbacks captured under an older attempt without changing quiz points", async () => {
    show();
    await flush();
    act(() =>
      setJourneyRuntimeContext({ ...context, attemptId: "newer-attempt" }),
    );
    await click("Estoy de acuerdo");
    expect(readWorld5Rounds().quiz.correctAnswers).toEqual([]);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBeNull();
  });
  it("does not present or focus a newly prepared question while the page is hidden", async () => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    show();
    await flush();
    expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBeNull();
    expect(focus).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Estoy de acuerdo" }),
    ).toBeDisabled();
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    fireEvent(document, new Event("visibilitychange"));
    await flush();
    expect(readEssentialSnapshot()!.stations[5].presentedStepIds).toEqual([
      "plantas",
    ]);
    expect(
      screen.getByRole("button", { name: "Estoy de acuerdo" }),
    ).toBeEnabled();
    expect(readWorld5Rounds().quiz.answeredQuestions).toEqual([]);
  });
  it("renders only current pair while inactive, without writes, focus or score", async () => {
    const focus = vi.spyOn(HTMLElement.prototype, "focus");
    const { container } = show({ active: false });
    await flush();
    expect(container.querySelectorAll("[data-answer]")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Estoy de acuerdo" }),
    ).toBeDisabled();
    expect(window.localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBeNull();
    expect(focus).not.toHaveBeenCalled();
    expect(screen.queryByText(/Tienes.*punto/)).toBeNull();
  });
  it("uses literal active source and explicit two-sided objects; background and guide stay neutral", async () => {
    const { container } = show();
    await flush();
    expect(screen.getByText(station5Questions.plantas.question)).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Plantas - trivia 1 de 4" }),
    ).toBeVisible();
    expect(
      screen.getByText(station5Questions.plantas.instruction),
    ).not.toBeVisible();
    expect(
      screen
        .getByRole("button", { name: "Estoy de acuerdo" })
        .querySelector("img"),
    ).toHaveAttribute("src", world5OptionAssets.plantas.agreement);
    expect(container.querySelectorAll("[data-answer]")).toHaveLength(2);
    fireEvent.click(container.querySelector(".s5-quiz-scene")!);
    fireEvent.click(container.querySelector("[data-lia-target]")!);
    await flush();
    expect(readWorld5Rounds().quiz.correctAnswers).toEqual([]);
    expect(
      screen.getByRole("button", { name: /2.*Sistema de escucha/ }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Continuar sin participar" }),
    ).toBeNull();
    expect(screen.queryByRole("button", { name: "Ir al Mirador" })).toBeNull();
  });
  it("restores the immutable wrong outcome after reload without accepting a same-question correction", async () => {
    let mounted = show(); await flush(); await click("No estoy de acuerdo");
    const raw = localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY);
    mounted.unmount(); mounted = show(); await flush();
    expect(screen.getByText(/Esta respuesta no es correcta/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Estoy de acuerdo" })).toBeDisabled();
    await click("Estoy de acuerdo");
    expect(localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBe(raw);
    expect(readWorld5Rounds().quiz).toMatchObject({ answeredQuestions: ["plantas"], correctAnswers: [], skippedQuestions: [] });
    expect(readWorld5Rounds().roundNumber).toBe(1);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBeNull();
    mounted.unmount();
  });
  it("presents all4questions individually, permits4wrong answers and closes result manually with0points", async () => {
    await closePriorJourney();
    show();
    await flush();
    await allAnswers(false);
    expect(readWorld5Rounds().quiz).toMatchObject({
      correctAnswers: [],
      answeredQuestions: [...WORLD5_QUIZ_AREA_ORDER],
      skippedQuestions: [],
    });
    expect(
      screen.getByText("Has finalizado esta ronda. Tienes 0 de 4 aciertos."),
    ).toBeVisible();
    // OBS05 supersedes the historical unconditional invitation; the writer raw
    // and the old compiled RED remain preserved as separate authority cuts.
    expect(screen.queryByText("Reclama tu premio sorpresa en la taquilla.")).toBeNull();
    expect(screen.getByText("Este resultado no reúne los cuatro aciertos necesarios para el premio.")).toBeVisible();
    expect(document.querySelector(".s5-quiz-scene--result .s5-quiz-lia")).toHaveAttribute("data-lia-action", "attention");
    expect(readEssentialSnapshot()!.stations[5]).toMatchObject({
      presentedStepIds: [...WORLD5_QUIZ_AREA_ORDER, "resultado"],
      confirmedStepIds: [...WORLD5_QUIZ_AREA_ORDER],
      closed: false,
    });
    expect(screen.getByTestId("location")).toHaveTextContent("/estacion/5");
    await click("Ir al Mirador");
    expect(readEssentialSnapshot()!.stations[5].closed).toBe(true);
    expect(readEssentialSnapshot()!.pendingTransition).toMatchObject({
      from: 5,
      to: "/final",
      kind: "result_closure",
      phase: "pending",
    });
    expect(screen.getByTestId("location")).toHaveTextContent(
      worldFiveToFinalTransitionRoute,
    );
    expect(readProgress().progress?.completedStations).toEqual([1, 2, 3, 4]);
  });
  it("preserves four historical skips and starts an independently answered new round", async () => {
    updateWorld5Quiz({ kind: "skip_remaining" });
    const raw = localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY);
    show(); await flush();
    expect(readWorld5Rounds().quiz.skippedQuestions).toEqual([]);
    expect(localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBeNull();
    for (let i = 0; i < 4; i++) await click("Pasar pregunta");
    expect(readEssentialSnapshot()!.stations[5].confirmedStepIds).toEqual([...WORLD5_QUIZ_AREA_ORDER]);
    expect(readWorld5Rounds().complete).toBe(true);
    expect(readWorld5Rounds().score).toBe(0);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe(raw);
  });
  it("locks a skipped slot until a new complete round without transferring a point", async () => {
    show(); await flush(); await click("Pasar pregunta");
    expect(readWorld5Rounds().quiz.skippedQuestions).toEqual(["plantas"]);
    const raw = localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY);
    const previous = screen.getByRole("button", { name: /1.*Plantas/ });
    expect(previous).toBeDisabled();
    fireEvent.click(previous); await flush();
    expect(screen.getByText(station5Questions.sistema.question)).toBeVisible();
    expect(readWorld5Rounds().quiz.correctAnswers).toEqual([]);
    expect(localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBe(raw);
  });
  it("retains a failed answer for explicit retry without false feedback or progress", async () => {
    show();
    await flush();
    const original = Storage.prototype.setItem;
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(function (this: Storage, key, value) {
        if (key === WORLD5_ROUNDS_STORAGE_KEY) throw new Error("quota");
        original.call(this, key, value);
      });
    await click("Estoy de acuerdo");
    expect(screen.getByRole("alert")).toHaveTextContent(/guardado/);
    expect(screen.queryByText("¡Correcto!")).toBeNull();
    expect(readWorld5Rounds().quiz.correctAnswers).toEqual([]);
    expect(readEssentialSnapshot()!.stations[5].confirmedStepIds).toEqual([]);
    spy.mockRestore();
    await click("Reintentar guardado");
    expect(readWorld5Rounds().quiz.correctAnswers).toEqual(["plantas"]);
    expect(screen.getByText(station5Questions.plantas.point)).toBeVisible();
  });
  it("retains verified result when receipt fails and an explicit idempotent retry creates no extra points", async () => {
    await closePriorJourney();
    show();
    await flush();
    await allAnswers(true);
    expect(
      screen.getByText("Has finalizado esta ronda. Tienes 4 de 4 aciertos."),
    ).toBeVisible();
    expect(screen.getByText("Reclama tu premio sorpresa en la taquilla.")).toBeVisible();
    expect(document.querySelector("[data-station5-celebration]")).toHaveAttribute("aria-hidden", "true");
    const hero = document.querySelector(".s5-quiz-scene--result .s5-quiz-lia")!;
    expect(hero).toHaveAttribute("data-lia-action", "respond");
    expect(hero.querySelectorAll("[data-lia-rig-layer^='petal-']")).toHaveLength(5);
    expect(document.querySelector(".s5-quiz-scene--result .s5-quiz-environment")).toBeNull();
    const spy = vi
      .spyOn(journeyIntent, "acceptJourneyIntent")
      .mockReturnValueOnce(false);
    await click("Ir al Mirador");
    expect(screen.getByRole("alert")).toHaveTextContent(/guardado/);
    expect(readEssentialSnapshot()!.stations[5].closed).toBe(true);
    expect(readEssentialSnapshot()!.pendingTransition).toBeNull();
    await click("Reintentar guardado");
    expect(spy).toHaveBeenCalledTimes(2);
    expect(readWorld5Rounds().quiz.correctAnswers).toHaveLength(4);
    expect(screen.getByTestId("location")).toHaveTextContent(
      worldFiveToFinalTransitionRoute,
    );
  });
  it("keeps a durable finish on Visitante through essential failure and remount, then reuses its receipt on Next", async () => {
    await closePriorJourney(); let mounted = show(); await flush();
    for (let index = 0; index < 3; index++) { await click("Estoy de acuerdo"); await click("Siguiente"); }
    await click("Estoy de acuerdo");
    const spy = vi.spyOn(essentialApi, "confirmEssentialStep").mockResolvedValueOnce({ ok: false, reason: "storage_unverified", snapshot: readEssentialSnapshot() });
    await click("Siguiente");
    const finished = readWorld5Rounds();
    expect(finished.complete).toBe(true);
    expect(readEssentialSnapshot()!.stations[5].activeStepId).toBe("visitante");
    expect(screen.queryByText("Reclama tu premio sorpresa en la taquilla.")).toBeNull();
    expect(screen.getByRole("heading", { name: station5Questions.visitante.title })).toBeVisible();
    spy.mockRestore(); mounted.unmount(); mounted = show(); await flush();
    expect(screen.getByRole("heading", { name: station5Questions.visitante.title })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Ir al Mirador" })).toBeNull();
    await click("Siguiente");
    expect(readWorld5Rounds().raw).toBe(finished.raw);
    expect(readWorld5Rounds().round!.completionReceipt).toBe(finished.round!.completionReceipt);
    expect(screen.getByText("Reclama tu premio sorpresa en la taquilla.")).toBeVisible();
    mounted.unmount();
  });
  it("keeps an unknown committed answer recoverable through a new verified activation using the same action", async () => {
    const tree = (value: ValidatedJourneyContext) => <MemoryRouter><JourneyActivationProvider context={value}><World5RootScreen /><LocationProbe /></JourneyActivationProvider></MemoryRouter>;
    const mounted = render(tree(context)); await flush();
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem;
    let unreadable = false;
    const getSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(function (this: Storage, key) {
      if (key === WORLD5_ROUNDS_STORAGE_KEY && unreadable) throw new Error("readback unavailable");
      return get.call(this, key);
    });
    const setSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      set.call(this, key, value); if (key === WORLD5_ROUNDS_STORAGE_KEY) unreadable = true;
    });
    await click("Estoy de acuerdo");
    const persisted = get.call(localStorage, WORLD5_ROUNDS_STORAGE_KEY);
    expect(persisted).not.toBeNull();
    expect(screen.getByRole("alert")).toHaveTextContent(/guardado/);
    getSpy.mockRestore(); setSpy.mockRestore();
    mounted.rerender(tree({ ...context, active: false })); await flush();
    mounted.rerender(tree({ ...context, attemptId: "reprepared-pending-answer" })); await flush();
    expect(screen.getByRole("alert")).toHaveTextContent(/guardado/);
    expect(screen.getByRole("button", { name: "Reintentar guardado" })).toBeEnabled();
    await click("Reintentar guardado");
    expect(readWorld5Rounds().raw).toBe(persisted);
    expect(readWorld5Rounds().ledger!.rounds).toHaveLength(1);
    expect(readWorld5Rounds().ledger!.seenActionIds).toHaveLength(1);
    expect(readWorld5Rounds().score).toBe(1);
    expect(screen.queryByRole("alert")).toBeNull();
    mounted.unmount();
  });
  it("starts only one retry on a double gesture and preserves the essential journey", async () => {
    await closePriorJourney(); show(); await flush(); await allAnswers(false);
    const before = localStorage.getItem(ESSENTIAL_STORAGE_KEY);
    const retry = screen.getByRole("button", { name: "Reintentar cuestionario completo" });
    act(() => { fireEvent.click(retry); fireEvent.click(retry); }); await flush();
    expect(readWorld5Rounds().roundNumber).toBe(2);
    expect(readWorld5Rounds().ledger!.rounds).toHaveLength(2);
    expect(readWorld5Rounds().score).toBe(0);
    expect(readWorld5Rounds().quiz.answeredQuestions).toEqual([]);
    expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(before);
    expect(screen.getByRole("heading", { name: station5Questions.plantas.title })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Estoy de acuerdo" })).toBeEnabled();
  });
  it("does not transfer legacy four-correct credits into a new-round prize", async () => {
    for (const area of WORLD5_QUIZ_AREA_ORDER) updateWorld5Quiz({ kind: "correct", area });
    const legacyRaw = localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY);
    show(); await flush();
    expect(readWorld5Quiz().quiz.correctAnswers).toHaveLength(4);
    expect(readWorld5Rounds().quiz.correctAnswers).toEqual([]);
    expect(localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBeNull();
    expect(screen.queryByText("Reclama tu premio sorpresa en la taquilla.")).toBeNull();
    await click("No estoy de acuerdo");
    expect(readWorld5Rounds().score).toBe(0);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe(legacyRaw);
  });
  it("keeps a three-correct result neutral and manually closable without a prize", async () => {
    await closePriorJourney(); show(); await flush();
    for (let index = 0; index < 4; index++) {
      await click(index < 3 ? "Estoy de acuerdo" : "No estoy de acuerdo");
      await click("Siguiente");
    }
    expect(readWorld5Rounds().quiz.correctAnswers).toHaveLength(3);
    expect(screen.getByText("Has finalizado esta ronda. Tienes 3 de 4 aciertos.")).toBeVisible();
    expect(screen.queryByText("Reclama tu premio sorpresa en la taquilla.")).toBeNull();
    expect(document.querySelector(".s5-quiz-scene--result .s5-quiz-lia")).toHaveAttribute("data-lia-action", "attention");
    expect(screen.getByRole("button", { name: "Ir al Mirador" })).toBeEnabled();
    expect(readEssentialSnapshot()!.stations[5].closed).toBe(false);
  });
  it.each([
    [
      "es",
      "¿El sistema transforma el pulso vivo de la planta en sonidos musicales en directo?",
      "Elige una respuesta.",
      "Estoy de acuerdo",
      "Siguiente",
    ],
    [
      "en",
      "Does the system transform the plant’s living pulse into live musical sounds?",
      "Choose an answer.",
      "I agree",
      "Next",
    ],
  ] as const)("read-only system consultation keeps one localized accessible instruction without mutating facts in %s", async (locale, question, instruction, agreement, next) => {
    window.localStorage.setItem("gvo.language.v1", locale);
    const before = window.localStorage.getItem(ESSENTIAL_STORAGE_KEY);
    show(
      { mode: "legacy_review_compatible", reviewReturnAllowed: true },
      "/estacion/5/sistema",
    );
    await flush();
    expect(screen.getByText(question)).toBeVisible();
    expect(screen.getByText(question)).toHaveAttribute("data-source-id", "TXT_5_9b70a607a49a");
    expect(screen.getAllByText(instruction)).toHaveLength(1);
    expect(screen.getByText(instruction)).not.toBeVisible();
    expect(screen.getByRole("group", { name: question })).toHaveAccessibleDescription(instruction);
    expect(screen.getByRole("button", { name: agreement })).toBeDisabled();
    expect(screen.queryByRole("button", { name: next })).toBeNull();
    expect(window.localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(before);
    expect(window.localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBeNull();
  });
  it("prepares the visible gallery/navigation plus the active pair in one orientation, excluding old System subjects", () => {
    const sources = getWorld5CriticalAssetSources("sistema", "portrait");
    expect(sources).toContain(world5OptionAssets.sistema.agreement);
    expect(sources).toContain(world5OptionAssets.sistema.disagreement);
    expect(sources.filter((src) => src.includes("environment"))).toEqual([
      getWorld5GalleryEnvironment("portrait"),
    ]);
    expect(sources.filter((src) => src.includes("/options/"))).toHaveLength(2);
    expect(sources.some((src) => src.includes("landscape"))).toBe(false);
    expect(sources.some((src) => src.includes("lia_rig_petal_top"))).toBe(true);
    expect(new Set(sources).size).toBe(sources.length);
    for (const navigation of Object.values(world5NavigationAssets)) expect(sources).toContain(navigation);
    expect(sources).toContain(getWorld5GalleryEnvironment("portrait"));
    expect(sources.some((src) => /sector_system|_focus_|sub_system_environment.*v01/.test(src))).toBe(false);
    const result = getWorld5CriticalAssetSources("resultado", "landscape");
    expect(result.filter((src) => src.includes("/options/"))).toEqual([world5NavigationAssets.sistema]);
    expect(result.some((src) => src.includes("portrait"))).toBe(false);
  });
  it("keeps decorative gallery navigation distinct from the two semantic answers", async () => {
    const { container } = show(); await flush();
    const navigation = screen.getByRole("navigation");
    expect(navigation.querySelectorAll("button")).toHaveLength(4);
    expect(navigation.querySelectorAll("img")).toHaveLength(4);
    expect(container.querySelector(".s5-quiz-gallery")).toHaveAttribute("src", getWorld5GalleryEnvironment("landscape"));
    const answers = screen.getByRole("group", { name: station5Questions.plantas.question });
    expect(answers.querySelectorAll("button")).toHaveLength(2);
    expect(answers).not.toContainElement(navigation);
    fireEvent.click(navigation.querySelector("img")!); await flush();
    expect(readWorld5Rounds().quiz.answeredQuestions).toEqual([]);
    expect(readWorld5Rounds().quiz.correctAnswers).toEqual([]);
    expect(container.querySelector(".s5-question-unit")).not.toHaveClass("s5-quiz-reading");
  });
});
