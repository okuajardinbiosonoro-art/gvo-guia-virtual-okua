import { readFileSync } from "node:fs";
import { URL as FileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFinalCoverRevisitContext,
  createFinalReviewContext,
  FINAL_REVIEW_CONTEXT_STORAGE_KEY,
} from "../review/finalReviewContext";

const evidenceRoot = new FileURL(
  "../../../docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/",
  import.meta.url,
);
function document(path: string) {
  return JSON.parse(
    readFileSync(new FileURL(path, evidenceRoot), "utf8").replace(
      /^\uFEFF/,
      "",
    ),
  );
}
const delta = document("incoming/r02/OBS03_CONCILIACION_CHATGPT_OBS03_2.json");
type Classification = {
  id: string;
  classification: string;
  evidence_path: string;
  json_pointer: string;
  source_kind: string;
  explicit_review_contradiction_from_asserted_fields?: boolean;
};
type Fixture = {
  id: string;
  key?: string;
  kind?: string;
  raw?: string | null;
  value?: unknown;
  storage?: Record<string, unknown>;
  asserted_storage?: Record<string, unknown>;
};
const classifications = delta.fixture_classifications as Classification[];
function sourceOf(row: Classification): Fixture {
  const source = document(`outgoing/r02/${row.evidence_path}`);
  return row.json_pointer
    .slice(1)
    .split("/")
    .reduce(
      (value: Record<string, unknown>, key: string) =>
        value[key.replace(/~1/g, "/").replace(/~0/g, "~")] as Record<
          string,
          unknown
        >,
      source,
    ) as Fixture;
}
/** Inject complete source values/bytes only. Assertion subsets never become fake persisted raw. */
function seedDocumentedFixture(source: Fixture) {
  const recorded = new Map<string, string | null>();
  const put = (key: string, raw: string | null) => {
    if (raw === null) localStorage.removeItem(key);
    else localStorage.setItem(key, raw);
    recorded.set(key, raw);
  };
  if (typeof source.raw === "string" && source.key) put(source.key, source.raw);
  else if (source.kind === "missing_key" && source.key) put(source.key, null);
  else if (source.storage)
    for (const [key, value] of Object.entries(source.storage))
      put(key, value === null ? null : JSON.stringify(value));
  else if (source.kind === "exact_object_in_repository_test" && source.key)
    put(source.key, JSON.stringify(source.value));
  else if (source.asserted_storage)
    for (const [key, value] of Object.entries(source.asserted_storage))
      if (!key.includes(".completedStations") && value === null) put(key, null);
  return recorded;
}
async function loadBeforeMount() {
  const access = await import("./journeyAccess");
  const essential = await import("./journeyEssential");
  return { ...access, essential };
}
async function fullPrefix() {
  const progress = await import("../../domain/progress/progress.storage");
  for (const id of [1, 2, 3, 4, 5] as const)
    expect(progress.markStationCompleted(id).ok).toBe(true);
}
/** Controlled current-revision setup through verified writers, never reconstructed historical raw. */
async function closePriorEssentials(through: 0 | 4) {
  const essential = await import("./journeyEssential");
  const screens =
    through === 0 ? (["cover"] as const) : (["cover", 1, 2, 3, 4] as const);
  for (const screen of screens) {
    const attemptId = `manifest-setup-${screen}`;
    essential.setJourneyRuntimeContext({
      active: true,
      attemptId,
      screen,
      mode: "normal",
      authorized: true,
      reviewReturnAllowed: false,
    });
    const input = {
      screen,
      attemptId,
      contentRevision: essential.ESSENTIAL_CONTENT_REVISION,
    };
    if (screen === 4) {
      const checkpoint =
        await import("../../domain/checkpoints/world4OrderingCheckpoint");
      const game = await import("../../screens/World4Root/world4OrderingGame");
      let state = game.reduceWorld4Ordering(
        checkpoint.freshWorld4OrderingState(),
        { type: "help" },
      );
      state = game.reduceWorld4Ordering(state, { type: "settle_auto" });
      for (let index = 0; index < 7; index++)
        state = game.reduceWorld4Ordering(state, { type: "next_review" });
      state = game.reduceWorld4Ordering(state, { type: "close" });
      expect(checkpoint.writeWorld4OrderingCheckpoint(state).ok).toBe(true);
    }
    const steps = essential.essentialSteps[screen];
    for (const [index, stepId] of steps.entries()) {
      expect(
        (
          await essential.markEssentialPresented({
            ...input,
            stepId,
            mode: "assisted",
          })
        ).ok,
      ).toBe(true);
      if (screen === 4 && stepId === "orden_resuelto")
        expect(
          (
            await essential.recordEssentialOutcome({
              ...input,
              screen: 4,
              outcome: "assisted_review_completed",
            })
          ).ok,
        ).toBe(true);
      if (index < steps.length - 1)
        expect(
          (
            await essential.confirmEssentialStep({
              ...input,
              stepId,
              cause: "visitor_advance",
            })
          ).ok,
        ).toBe(true);
    }
    expect(
      (await essential.closeEssentialRoom({ ...input, cause: "visitor_close" }))
        .ok,
    ).toBe(true);
  }
}
async function writerOmission(room: 1 | 2 | 4) {
  if (room === 1) {
    const store = await import("../../domain/checkpoints/world1Checkpoint");
    // Generated through the real writer, not reconstructed R2 bytes or an invented timestamp.
    expect(
      store.writeWorld1Checkpoint({
        activeConcept: "intro",
        highestReachedConcept: "intro",
        visitedConcepts: [],
        activityContinued: true,
      }).ok,
    ).toBe(true);
  } else if (room === 2) {
    const store = await import("../../domain/checkpoints/world2Checkpoint");
    expect(
      store.writeWorld2Checkpoint({
        ...store.freshWorld2CheckpointState(),
        activityContinued: true,
      }).ok,
    ).toBe(true);
  } else {
    const store = await import("../../domain/checkpoints/world4Checkpoint");
    expect(
      store.writeWorld4Checkpoint({
        highestSettledIndex: -1,
        resumeMode: "activity_skipped",
      }).ok,
    ).toBe(true);
  }
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.resetModules();
});
afterEach(() => vi.restoreAllMocks());

describe("OBS03.2 — all26 documented evidence classifications before room mount", () => {
  it("retains26 distinct classified sources and marks7 projections instead of pretending complete raw", () => {
    expect(classifications).toHaveLength(26);
    expect(new Set(classifications.map((row) => row.id)).size).toBe(26);
    const partial = classifications.filter((row) =>
      /subset|PROJECTION/.test(row.source_kind),
    );
    expect(partial).toHaveLength(7);
    for (const row of partial)
      expect(typeof sourceOf(row).raw).not.toBe("string");
  });
  it.each(classifications)(
    "$id ($classification): preserves available raw and never mints essential facts",
    async (row) => {
      const source = sourceOf(row);
      expect(source.id).toBe(row.id);
      const recorded = seedDocumentedFixture(source);
      const { essential, resolveJourneyAccess } = await loadBeforeMount();
      const snapshot = essential.readEssentialSnapshot()!;
      for (const room of [
        snapshot.cover,
        ...Object.values(snapshot.stations),
      ]) {
        expect(room.presentedStepIds).toEqual([]);
        expect(room.confirmedStepIds).toEqual([]);
        expect(room.closed).toBe(false);
        expect(room.outcome).toBeNull();
      }
      expect(snapshot.finalReached).toBe(false);
      expect(snapshot.pendingTransition).toBeNull();
      expect(resolveJourneyAccess("/final", null).authorized).toBe(false);
      for (const [key, raw] of recorded)
        expect(localStorage.getItem(key)).toBe(raw);
      expect(localStorage.getItem(essential.ESSENTIAL_STORAGE_KEY)).toBeNull();
      if (source.storage?.["gvo.station5.quiz.v1"]) {
        const { readWorld5Quiz } =
          await import("../../screens/World5Root/world5Quiz");
        expect(readWorld5Quiz().quiz).toEqual(
          source.storage["gvo.station5.quiz.v1"],
        );
      }
    },
  );
});

describe("legacy review compatibility is a predicate, not a migration classification", () => {
  it("preloads the gallery while keeping the first pending V question selected for a locked URL", async () => {
    const progress = await import("../../domain/progress/progress.storage");
    for (const id of [1, 2, 3, 4] as const)
      expect(progress.markStationCompleted(id).ok).toBe(true);
    await loadBeforeMount();
    await closePriorEssentials(4);
    const { getJourneyResourceManifest } = await import("./journeyResources");
    const { world5OptionAssets } =
      await import("../../screens/World5Root/world5RuntimeAssets");
    const manifest = getJourneyResourceManifest({
      route: "/estacion/5/visitante",
      locale: "es",
      orientation: "portrait",
    });
    expect(JSON.parse(manifest.contextKey).normalized).toBe("plantas");
    expect(
      manifest.images.filter((src) => src.includes("/options/")).sort(),
    ).toEqual(Object.values(world5OptionAssets).flatMap(Object.values).sort());
  });
  it.each([
    ["/portada/", "cover"],
    ["/estacion/4/", 4],
    ["/estacion/5/sistema/", 5],
    ["/final/", "final"],
  ] as const)(
    "classifies router-compatible trailing slash alias %s as a protected screen",
    async (route, screen) => {
      const { screenForRoute } = await loadBeforeMount();
      expect(screenForRoute(route)).toBe(screen);
    },
  );
  it("preserves full legacy credit but recovers pending essence before opening an acquired destination without review context", async () => {
    await fullPrefix();
    const { essential, resolveJourneyAccess, essentialRecoveryRoute } =
      await loadBeforeMount();
    expect(resolveJourneyAccess("/estacion/5", null)).toMatchObject({
      authorized: false,
      mode: "normal",
      reviewReturnAllowed: false,
      active: false,
    });
    expect(resolveJourneyAccess("/final", null).authorized).toBe(false);
    expect(essential.readEssentialSnapshot()!.finalReached).toBe(false);
    expect(essentialRecoveryRoute()).toBe("/portada");
    expect(essential.coherentProgressPrefixLength()).toBe(5);
  });
  it("prefix1 plus pending I cannot open II and falls back to I after the cover is closed", async () => {
    const progress = await import("../../domain/progress/progress.storage");
    expect(progress.markStationCompleted(1).ok).toBe(true);
    const { resolveJourneyAccess, essentialRecoveryRoute } =
      await loadBeforeMount();
    await closePriorEssentials(0);
    expect(resolveJourneyAccess("/estacion/2", null).authorized).toBe(false);
    expect(essentialRecoveryRoute()).toBe("/estacion/1");
  });
  it("scattered bits [1,4,5] preserve only prefix1 despite a valid review context", async () => {
    const progress = await import("../../domain/progress/progress.storage");
    for (const id of [1, 4, 5] as const) progress.markStationCompleted(id);
    sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      JSON.stringify(createFinalReviewContext(5)),
    );
    const { essential, resolveJourneyAccess } = await loadBeforeMount();
    expect(essential.coherentProgressPrefixLength()).toBe(1);
    expect(resolveJourneyAccess("/final", null).authorized).toBe(false);
    expect(resolveJourneyAccess("/estacion/5", null)).toMatchObject({
      authorized: false,
      mode: "normal",
    });
  });
  it("accepts concordant roomV subroutes and session fallback in read-only mode without granting current facts", async () => {
    await fullPrefix();
    const review = createFinalReviewContext(5);
    sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      JSON.stringify(review),
    );
    const { essential, resolveJourneyAccess } = await loadBeforeMount();
    const before = localStorage.getItem("gvo.progress.v1");
    const context = resolveJourneyAccess("/estacion/5/sistema", null);
    expect(context).toMatchObject({
      authorized: true,
      mode: "legacy_review_compatible",
      reviewReturnAllowed: true,
      active: false,
    });
    essential.setJourneyRuntimeContext({
      ...context,
      active: true,
      attemptId: "review-contract",
    });
    expect(essential.isEssentialExitReady(5)).toBe(true);
    expect(
      await essential.markEssentialPresented({
        screen: 5,
        stepId: "plantas",
        attemptId: "review-contract",
        contentRevision: essential.ESSENTIAL_CONTENT_REVISION,
        mode: "standard",
      }),
    ).toMatchObject({ ok: false, reason: "read_only_review" });
    expect(essential.readEssentialSnapshot()!.finalReached).toBe(false);
    expect(localStorage.getItem("gvo.progress.v1")).toBe(before);
    expect(localStorage.getItem(essential.ESSENTIAL_STORAGE_KEY)).toBeNull();
  });
  it("does not rescue malformed pertinent navigation state with a valid stale session", async () => {
    await fullPrefix();
    sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      JSON.stringify(createFinalReviewContext(4)),
    );
    const { resolveJourneyAccess } = await loadBeforeMount();
    expect(
      resolveJourneyAccess("/estacion/4", { finalReview: null }),
    ).toMatchObject({ mode: "normal", reviewReturnAllowed: false });
    expect(
      resolveJourneyAccess("/final", { finalReview: { mode: "invalid" } })
        .authorized,
    ).toBe(false);
  });
  it("does not rescue a mismatched world with session or query-string markers", async () => {
    await fullPrefix();
    sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      JSON.stringify(createFinalReviewContext(4)),
    );
    const { resolveJourneyAccess } = await loadBeforeMount();
    expect(
      resolveJourneyAccess("/estacion/4", {
        finalReview: createFinalReviewContext(2),
      }),
    ).toMatchObject({ mode: "normal", reviewReturnAllowed: false });
    sessionStorage.clear();
    expect(
      resolveJourneyAccess("/final", { search: "?finalReview=true" })
        .authorized,
    ).toBe(false);
  });
  it("cover revisit context matches only Portada and a captured manual return to Mirador", async () => {
    await fullPrefix();
    const cover = createFinalCoverRevisitContext();
    const { resolveJourneyAccess } = await loadBeforeMount();
    expect(
      resolveJourneyAccess("/portada", { finalCoverRevisit: cover }),
    ).toMatchObject({
      mode: "legacy_review_compatible",
      reviewReturnAllowed: true,
    });
    expect(
      resolveJourneyAccess("/estacion/4", { finalCoverRevisit: cover }),
    ).toMatchObject({ mode: "normal", reviewReturnAllowed: false });
    expect(
      resolveJourneyAccess("/final", { finalCoverRevisit: cover }),
    ).toMatchObject({ authorized: true, mode: "legacy_review_compatible" });
  });
  it("captured validated context authorizes return after session clearing and refresh revalidation", async () => {
    await fullPrefix();
    const returning = createFinalReviewContext(4);
    sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      JSON.stringify(returning),
    );
    const { resolveJourneyAccess } = await loadBeforeMount();
    expect(resolveJourneyAccess("/estacion/4", null).reviewReturnAllowed).toBe(
      true,
    );
    sessionStorage.clear();
    expect(
      resolveJourneyAccess("/final", { finalReview: returning }),
    ).toMatchObject({ authorized: true, mode: "legacy_review_compatible" });
    expect(resolveJourneyAccess("/final", null).authorized).toBe(false);
  });
  it.each([1, 2, 4] as const)(
    "real writer-emitted explicit omission in room%s blocks legacy review",
    async (room) => {
      await fullPrefix();
      await writerOmission(room);
      const { hasLegacyContradiction, resolveJourneyAccess } =
        await loadBeforeMount();
      expect(hasLegacyContradiction()).toBe(true);
      expect(
        resolveJourneyAccess(`/estacion/${room}`, {
          finalReview: createFinalReviewContext(room),
        }),
      ).toMatchObject({ mode: "normal", reviewReturnAllowed: false });
    },
  );
  it("absence of IV checkpoint and four historical V skips are not an explicit contradiction", async () => {
    await fullPrefix();
    const source = sourceOf(
      classifications.find((row) => row.id === "V_all_skipped")!,
    );
    seedDocumentedFixture(source);
    const { hasLegacyContradiction, resolveJourneyAccess } =
      await loadBeforeMount();
    expect(localStorage.getItem("gvo.station4.v1")).toBeNull();
    expect(hasLegacyContradiction()).toBe(false);
    expect(
      resolveJourneyAccess("/estacion/5", {
        finalReview: createFinalReviewContext(5),
      }),
    ).toMatchObject({
      mode: "legacy_review_compatible",
      reviewReturnAllowed: true,
    });
  });
  it("recognises the actual three legacy I visits without inventing an intro visit", async () => {
    await fullPrefix();
    const store = await import("../../domain/checkpoints/world1Checkpoint");
    expect(
      store.writeWorld1Checkpoint({
        activeConcept: "ready_to_continue",
        highestReachedConcept: "mediation",
        visitedConcepts: ["relation", "perception", "mediation"],
        activityContinued: true,
      }).ok,
    ).toBe(true);
    const { hasLegacyContradiction, resolveJourneyAccess } =
      await loadBeforeMount();
    expect(hasLegacyContradiction()).toBe(false);
    expect(
      resolveJourneyAccess("/estacion/1", {
        finalReview: createFinalReviewContext(1),
      }).mode,
    ).toBe("legacy_review_compatible");
  });
  it("does not substitute an intro visit for missing legacy mediation merely because the count is three", async () => {
    await fullPrefix();
    const store = await import("../../domain/checkpoints/world1Checkpoint");
    expect(
      store.writeWorld1Checkpoint({
        activeConcept: "ready_to_continue",
        highestReachedConcept: "perception",
        visitedConcepts: ["intro", "relation", "perception"],
        activityContinued: true,
      }).ok,
    ).toBe(true);
    const { hasLegacyContradiction } = await loadBeforeMount();
    expect(hasLegacyContradiction()).toBe(true);
  });
  it("missing optional I visits are unknown, not proof of an explicit omission", async () => {
    await fullPrefix();
    const store = await import("../../domain/checkpoints/world1Checkpoint");
    // Additional contract case emitted by real writer. This is not claimed as any partial R2 raw.
    expect(
      store.writeWorld1Checkpoint({
        activeConcept: "intro",
        highestReachedConcept: "intro",
        activityContinued: true,
      }).ok,
    ).toBe(true);
    const { hasLegacyContradiction, resolveJourneyAccess } =
      await loadBeforeMount();
    expect(hasLegacyContradiction()).toBe(false);
    expect(
      resolveJourneyAccess("/estacion/1", {
        finalReview: createFinalReviewContext(1),
      }).mode,
    ).toBe("legacy_review_compatible");
  });
});

describe("IV outcome semantic boundary needs verified local evidence", () => {
  it.each([
    null,
    {
      kind: "capture_step",
      id: "invented",
      contentRevision: "OBS03.2",
      origin: "visitor_ui",
    },
  ])(
    "rejects malformed interaction evidence before a room consumer dereferences it",
    async (evidence) => {
      const { essential } = await loadBeforeMount();
      const snapshot = structuredClone(essential.readEssentialSnapshot()!);
      Object.assign(snapshot.stations[2], { interactionEvidence: [evidence] });
      expect(
        essential.parseEssentialSnapshot(JSON.stringify(snapshot)),
      ).toBeNull();
    },
  );
  it("rejects a durable finalReached flag without the current V closure required by its writer", async () => {
    const { essential } = await loadBeforeMount();
    const snapshot = structuredClone(essential.readEssentialSnapshot()!);
    snapshot.finalReached = true;
    expect(
      essential.parseEssentialSnapshot(JSON.stringify(snapshot)),
    ).toBeNull();
  });
  it("rejects a solved claim with no verified ordering checkpoint", async () => {
    const { essential } = await loadBeforeMount();
    essential.setJourneyRuntimeContext({
      active: true,
      attemptId: "contract",
      screen: 4,
      mode: "normal",
      authorized: true,
      reviewReturnAllowed: false,
    });
    const result = await essential.recordEssentialOutcome({
      screen: 4,
      contentRevision: essential.ESSENTIAL_CONTENT_REVISION,
      attemptId: "contract",
      outcome: "solved",
    });
    expect(result.ok).toBe(false);
    expect(essential.readEssentialSnapshot()!.stations[4].outcome).toBeNull();
  });
  it("rejects an assisted-review claim before the local manual review is closed", async () => {
    const checkpoint =
      await import("../../domain/checkpoints/world4OrderingCheckpoint");
    const game = await import("../../screens/World4Root/world4OrderingGame");
    const review = game.reduceWorld4Ordering(
      game.reduceWorld4Ordering(checkpoint.freshWorld4OrderingState(), {
        type: "help",
      }),
      { type: "settle_auto" },
    );
    expect(checkpoint.writeWorld4OrderingCheckpoint(review).ok).toBe(true);
    const { essential } = await loadBeforeMount();
    essential.setJourneyRuntimeContext({
      active: true,
      attemptId: "contract",
      screen: 4,
      mode: "normal",
      authorized: true,
      reviewReturnAllowed: false,
    });
    expect(
      (
        await essential.recordEssentialOutcome({
          screen: 4,
          contentRevision: essential.ESSENTIAL_CONTENT_REVISION,
          attemptId: "contract",
          outcome: "assisted_review_completed",
        })
      ).ok,
    ).toBe(false);
  });
  it.each(["invented", null, undefined])(
    "rejects a persisted IVclosed record with invalid outcome %s",
    async (outcome) => {
      const { essential } = await loadBeforeMount();
      const state = structuredClone(essential.readEssentialSnapshot()!);
      Object.assign(state.stations[4], {
        presentedStepIds: [...essential.essentialSteps[4]],
        confirmedStepIds: [...essential.essentialSteps[4]],
        activeStepId: null,
        closed: true,
        outcome,
      });
      expect(
        essential.parseEssentialSnapshot(JSON.stringify(state)),
      ).toBeNull();
    },
  );
});
