import { beforeEach, describe, expect, it, vi } from "vitest";
import { getJourneyResourceManifest, getWorld5ResourceView } from "./journeyResources";
import { getWorld5CriticalAssetSources } from "../../screens/World5Root/world5RuntimeAssets";
import { mutateWorld5Rounds, readWorld5Rounds, WORLD5_QUIZ_AREA_ORDER, WORLD5_QUIZ_STORAGE_KEY, type World5RoundCommand } from "../../screens/World5Root/world5Quiz";
const context = vi.hoisted(() => ({ pending: "resultado" as string | null, mode: "normal" }));
vi.mock("./journeyEssential", () => ({
  ESSENTIAL_CONTENT_REVISION: "OBS03.2",
  readEssentialSnapshot: () => ({ stations: { 5: { activeStepId: context.pending } } }),
  canUseUiStep: (_screen: number, id: string) => id !== "resultado" || context.pending === "resultado" || context.pending === null,
}));
vi.mock("./journeyAccess", () => ({ screenForRoute: () => 5, resolveJourneyAccess: () => ({ mode: context.mode }) }));
let serial = 0;
function write(action: { kind: "answer"; area: typeof WORLD5_QUIZ_AREA_ORDER[number]; side: "disagreement" } | { kind: "finish_round" | "begin_retry" }) {
  const read = readWorld5Rounds();
  const command: World5RoundCommand = { ...action, actionId: `resource-${++serial}`, expectedRaw: read.raw, roundId: read.round?.roundId ?? null };
  expect(mutateWorld5Rounds(command, { canCommit: () => true }).ok).toBe(true);
}
const manifest = (route = "/estacion/5") => getJourneyResourceManifest({ route, locale: "es", orientation: "portrait" });
function expectView(view: "plantas" | "visitante" | "resultado") {
  expect(manifest().images).toEqual(expect.arrayContaining(getWorld5CriticalAssetSources(view, "portrait")));
}
beforeEach(() => { localStorage.clear(); serial = 0; context.pending = "resultado"; context.mode = "normal"; });
describe("OBS05 V prepared resources follow the rendered local round", () => {
  it("prepares a new complete question set despite a historically completed essential V", () => {
    localStorage.setItem(WORLD5_QUIZ_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, correctAnswers: [...WORLD5_QUIZ_AREA_ORDER], answeredQuestions: [...WORLD5_QUIZ_AREA_ORDER], skippedQuestions: [] }));
    expectView("plantas");
    expect(JSON.parse(manifest().contextKey).normalized).toBe("plantas");
    expect(readWorld5Rounds().ledger).toBeNull();
  });
  it("does not invalidate the same visible question when its answer revision changes", () => {
    const route = "/estacion/5/plantas";
    const quizView = getWorld5ResourceView(route);
    const before = getJourneyResourceManifest({ route, quizView, locale: "es", orientation: "portrait" });
    write({ kind: "answer", area: "plantas", side: "disagreement" });
    const after = getJourneyResourceManifest({ route, quizView, locale: "es", orientation: "portrait" });
    expect(after).toEqual(before);
    expect(getWorld5ResourceView(route)).toBe("sistema");
  });
  it("prepares Plantas after an explicit retry while essential remains at resultado", () => {
    WORLD5_QUIZ_AREA_ORDER.forEach(area => write({ kind: "answer", area, side: "disagreement" }));
    write({ kind: "finish_round" }); expectView("resultado");
    write({ kind: "begin_retry" }); expectView("plantas");
    expect(context.pending).toBe("resultado");
  });
  it("keeps fourth-question resources when finish persisted but essential confirmation is pending", () => {
    WORLD5_QUIZ_AREA_ORDER.forEach(area => write({ kind: "answer", area, side: "disagreement" }));
    write({ kind: "finish_round" }); context.pending = "visitante";
    expectView("visitante");
    expect(JSON.parse(manifest().contextKey).normalized).toBe("visitante");
  });
  it("preserves a read-only result and its resource identity without starting a round", () => {
    context.mode = "legacy_review_compatible"; context.pending = null;
    expectView("resultado");
    expect(readWorld5Rounds().ledger).toBeNull();
  });
});
