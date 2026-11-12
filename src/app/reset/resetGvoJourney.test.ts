import { beforeEach, describe, expect, it } from "vitest";

import {
  canOpenFinal,
  readProgress,
} from "../../domain/progress/progress.storage";
import { GVO_LANGUAGE_STORAGE_KEY } from "../preferences/languagePreference";
import { beginFinalReview } from "../review/finalReviewContext";
import {
  confirmEssentialStep,
  captureJourneyMutationToken,
  getJourneyRuntimeContext,
  invalidateJourneyEssential,
  isJourneyResetInProgress,
  markEssentialPresented,
  persistJourneyReceipt,
  readEssentialSnapshot,
  setJourneyRuntimeContext,
} from "../journey/journeyEssential";
import {
  GVO_JOURNEY_PRESERVE_POLICY,
  GVO_JOURNEY_RESET_ALLOWLIST,
} from "./journeyResetPolicy";
import {
  createJourneyResetSnapshot,
  resetGvoJourney,
  restoreJourneyResetSnapshot,
  type JourneyResetStorageBackends,
} from "./resetGvoJourney";

type FailureHooks = {
  getItem?: (key: string, count: number) => void;
  removeItem?: (key: string, count: number) => "skip" | void;
  setItem?: (key: string, value: string, count: number) => void;
};

class FakeStorage {
  readonly values = new Map<string, string>();
  readonly mutations: string[] = [];
  private getCount = 0;
  private removeCount = 0;
  private setCount = 0;

  constructor(
    initial: Record<string, string> = {},
    private readonly hooks: FailureHooks = {},
  ) {
    for (const [key, value] of Object.entries(initial)) {
      this.values.set(key, value);
    }
  }

  getItem(key: string) {
    this.getCount += 1;
    this.hooks.getItem?.(key, this.getCount);
    return this.values.get(key) ?? null;
  }

  removeItem(key: string) {
    this.removeCount += 1;
    if (this.hooks.removeItem?.(key, this.removeCount) === "skip") {
      return;
    }
    this.mutations.push(`remove:${key}`);
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.setCount += 1;
    this.hooks.setItem?.(key, value, this.setCount);
    this.mutations.push(`set:${key}`);
    this.values.set(key, value);
  }
}

function seededBackends(
  hooks: {
    local?: FailureHooks;
    session?: FailureHooks;
  } = {},
) {
  const localStorage = new FakeStorage(
    {
      "gvo.journey.essential.v1": "essential-snapshot-raw",
      "gvo.station4.ordering.v1": "ordering-snapshot-raw",
      "gvo.station4.explanation.v1": "explanation-snapshot-raw",
      "gvo.progress.v1":
        '{"schemaVersion":1,"completedStations":[1,2,3,4,5],"updatedAt":"2026-08-05T12:00:00.000Z"}',
      "gvo.station1.v1":
        '{"schemaVersion":1,"activeConcept":"relation","highestReachedConcept":"perception","updatedAt":"2026-08-05T12:01:00.000Z"}',
      "gvo.station2.v1":
        '{"schemaVersion":1,"activeLayerId":"senal","visitedLayerIds":["planta_viva","senal"],"highestUnlockedLayerOrder":3,"completedRequiredInteractions":["plant_contact_readout_seen"],"capture":{"currentStepId":"contact","visitedStepIds":["contact"]},"mappingFirstRunComplete":false,"resultState":"not_started","updatedAt":"2026-08-05T12:01:30.000Z"}',
      "gvo.station3.v1":
        '{"schemaVersion":1,"completedRecordIds":["planta","prototipo"],"updatedAt":"2026-08-05T12:01:45.000Z"}',
      "gvo.station3.practice.v2": "practice-snapshot-raw",
      "gvo.station4.v1":
        '{"schemaVersion":1,"highestSettledIndex":3,"resumeMode":"reading","updatedAt":"2026-08-05T12:02:00.000Z"}',
      "gvo.station5.v1": '{"completedAreas":["plantas"]}',
      "gvo.station5.quiz.v1": "quiz-snapshot-raw",
      "gvo.station5.quiz.v2": "round-ledger-snapshot-raw",
      "gvo.station5.quiz.recovery.v1": "quiz-backup-snapshot-raw",
      "gvo.coverIntro.introCompleted.v1": "true",
      [GVO_LANGUAGE_STORAGE_KEY]: "en",
      "gvo:accessibility:contrast": "high",
      "gvo-dev-world1-layout-calibrator-v2": "developer-preset",
      "unrelated.token": "opaque-byte-value",
    },
    hooks.local,
  );
  const sessionStorage = new FakeStorage(
    {
      "gvo.final.reviewContext.v1": "review-context",
      "gvo:orientation-hint:dismissed": "1",
      "gvo:world4:tap-hint:shown": "1",
    },
    hooks.session,
  );

  return {
    localStorage,
    sessionStorage,
    storage: { localStorage, sessionStorage } as JourneyResetStorageBackends,
  };
}

describe("resetGvoJourney", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    invalidateJourneyEssential();
    setJourneyRuntimeContext({ active: false, attemptId: null, screen: null, mode: "normal", authorized: false, reviewReturnAllowed: false });
  });

  it("delimita el reset al recorrido, práctica y trivia; preserva preferencias", () => {
    expect(GVO_JOURNEY_RESET_ALLOWLIST).toEqual([
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.journey.essential.v1",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station4.ordering.v1",
      }),
      expect.objectContaining({ backend: "localStorage", key: "gvo.station4.explanation.v1", purpose: "world-four-state" }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.progress.v1",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station1.v1",
        purpose: "world-one-state",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station2.v1",
        purpose: "world-two-state",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station3.v1",
        purpose: "world-three-state",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station3.practice.v2",
        purpose: "world-three-state",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station4.v1",
        purpose: "world-four-state",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station5.v1",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station5.quiz.v1",
      }),
      expect.objectContaining({ backend: "localStorage", key: "gvo.station5.quiz.v2", purpose: "world-five-state" }),
      expect.objectContaining({ backend: "localStorage", key: "gvo.station5.quiz.recovery.v1", purpose: "world-five-state" }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.coverIntro.introCompleted.v1",
      }),
      expect.objectContaining({
        backend: "sessionStorage",
        key: "gvo.final.reviewContext.v1",
      }),
    ]);
    expect(GVO_JOURNEY_PRESERVE_POLICY).toHaveLength(6);
  });

  it("crea snapshot raw estable, elimina sólo allowlist y preserva bytes ajenos", async () => {
    const { localStorage, sessionStorage, storage } = seededBackends();
    const snapshot = createJourneyResetSnapshot(
      GVO_JOURNEY_RESET_ALLOWLIST,
      storage,
    );

    expect(snapshot).toHaveLength(15);
    expect(snapshot.every((entry) => entry.existed)).toBe(true);
    expect(snapshot.find((entry) => entry.key === "gvo.progress.v1")?.raw).toBe(
      '{"schemaVersion":1,"completedStations":[1,2,3,4,5],"updatedAt":"2026-08-05T12:00:00.000Z"}',
    );

    const result = await resetGvoJourney({ storage });
    expect(result).toMatchObject({
      ok: true,
      snapshotCount: 15,
      verifiedInitialState: true,
    });
    for (const entry of GVO_JOURNEY_RESET_ALLOWLIST) {
      expect(storage[entry.backend]?.getItem(entry.key)).toBeNull();
    }
    expect(localStorage.getItem("gvo:accessibility:contrast")).toBe("high");
    expect(localStorage.getItem(GVO_LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(localStorage.getItem("unrelated.token")).toBe("opaque-byte-value");
    expect(sessionStorage.getItem("gvo:orientation-hint:dismissed")).toBe("1");
    expect(
      [...localStorage.mutations, ...sessionStorage.mutations].every(
        (mutation) =>
          GVO_JOURNEY_RESET_ALLOWLIST.some(({ key }) => mutation.endsWith(key)),
      ),
    ).toBe(true);
  });

  it("restablece el guard de Final y elimina contexto real en success", async () => {
    window.localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3, 4, 5],
        updatedAt: "2026-08-05T12:00:00.000Z",
      }),
    );
    window.localStorage.setItem("gvo.station5.v1", "world-five");
    window.localStorage.setItem("gvo.station1.v1", "world-one");
    window.localStorage.setItem("gvo.station2.v1", "world-two");
    window.localStorage.setItem("gvo.station3.v1", "world-three");
    window.localStorage.setItem("gvo.station4.v1", "world-four");
    window.localStorage.setItem("gvo.coverIntro.introCompleted.v1", "true");
    beginFinalReview(5);

    expect(canOpenFinal(readProgress())).toBe(true);
    expect(await resetGvoJourney()).toMatchObject({ ok: true });
    expect(canOpenFinal(readProgress())).toBe(false);
    expect(
      window.sessionStorage.getItem("gvo.final.reviewContext.v1"),
    ).toBeNull();
  });

  it("falla snapshot sin mutar ni afirmar conservación", async () => {
    const { storage } = seededBackends({
      local: {
        getItem: () => {
          throw new Error("snapshot failure");
        },
      },
    });

    expect(await resetGvoJourney({ storage })).toMatchObject({
      copySafe: false,
      errorCode: "snapshot_failed",
      failedStage: "snapshot",
      ok: false,
      rollbackAttempted: false,
      rollbackVerified: false,
      snapshotCreated: false,
    });
  });

  it("hace rollback completo cuando falla la eliminación", async () => {
    const { localStorage, sessionStorage, storage } = seededBackends({
      local: {
        removeItem: (_key, count) => {
          if (count === 2) throw new Error("delete failure");
        },
      },
    });
    const beforeLocal = new Map(localStorage.values);
    const beforeSession = new Map(sessionStorage.values);

    expect(await resetGvoJourney({ storage })).toMatchObject({
      copySafe: true,
      errorCode: "delete_failed",
      failedStage: "delete",
      ok: false,
      rollbackAttempted: true,
      rollbackVerified: true,
      snapshotCreated: true,
    });
    expect(localStorage.values).toEqual(beforeLocal);
    expect(sessionStorage.values).toEqual(beforeSession);
  });

  it("hace rollback cuando falla la verificación post-reset", async () => {
    const { localStorage, sessionStorage, storage } = seededBackends({
      session: {
        removeItem: (key, count) =>
          key === "gvo.final.reviewContext.v1" && count === 1
            ? "skip"
            : undefined,
      },
    });
    const beforeLocal = new Map(localStorage.values);
    const beforeSession = new Map(sessionStorage.values);

    expect(await resetGvoJourney({ storage })).toMatchObject({
      copySafe: true,
      errorCode: "verify_failed",
      failedStage: "verify",
      ok: false,
      rollbackVerified: true,
    });
    expect(localStorage.values).toEqual(beforeLocal);
    expect(sessionStorage.values).toEqual(beforeSession);
  });

  it("detecta rollback fallido y no autoriza copy de conservación", async () => {
    const { storage } = seededBackends({
      local: {
        removeItem: (_key, count) => {
          if (count === 2) throw new Error("delete failure");
        },
        setItem: () => {
          throw new Error("restore failure");
        },
      },
    });

    expect(await resetGvoJourney({ storage })).toMatchObject({
      copySafe: false,
      errorCode: "rollback_failed",
      failedStage: "rollback",
      ok: false,
      rollbackAttempted: true,
      rollbackVerified: false,
    });
  });

  it("restaura entradas ausentes como ausentes", () => {
    const { storage } = seededBackends();
    storage.sessionStorage?.removeItem("gvo.final.reviewContext.v1");
    const snapshot = createJourneyResetSnapshot(
      GVO_JOURNEY_RESET_ALLOWLIST,
      storage,
    );
    storage.sessionStorage?.setItem("gvo.final.reviewContext.v1", "stale");

    expect(restoreJourneyResetSnapshot(snapshot, storage)).toBe(true);
    expect(
      storage.sessionStorage?.getItem("gvo.final.reviewContext.v1"),
    ).toBeNull();
  });

  it("restaura byte-exacto payloads globales legacy y versionados", () => {
    for (const raw of [
      '{"completedStations":[4,5],"updatedAt":"legacy"}',
      '{"schemaVersion":1,"completedStations":[1,4,5],"updatedAt":null}',
    ]) {
      const { localStorage, storage } = seededBackends();
      localStorage.setItem("gvo.progress.v1", raw);
      const snapshot = createJourneyResetSnapshot(
        GVO_JOURNEY_RESET_ALLOWLIST,
        storage,
      );

      localStorage.setItem("gvo.progress.v1", "mutated");
      expect(restoreJourneyResetSnapshot(snapshot, storage)).toBe(true);
      expect(localStorage.getItem("gvo.progress.v1")).toBe(raw);
    }
  });

  it("restaura checkpoints W1/W2/W3/W4 corruptos byte-exacto después de un fallo intermedio", async () => {
    const { localStorage, sessionStorage, storage } = seededBackends({
      local: {
        removeItem: (_key, count) => {
          if (count === 5) throw new Error("delete failure");
        },
      },
    });
    const world1Raw = "{world-one-corrupt::raw";
    const world2Raw = '{"schemaVersion":88,"opaque":"world-two"}';
    const world3Raw = '{"schemaVersion":66,"opaque":"world-three"}';
    const world4Raw = '{"schemaVersion":77,"opaque":"world-four"}';
    localStorage.setItem("gvo.station1.v1", world1Raw);
    localStorage.setItem("gvo.station2.v1", world2Raw);
    localStorage.setItem("gvo.station3.v1", world3Raw);
    localStorage.setItem("gvo.station4.v1", world4Raw);
    const beforeLocal = new Map(localStorage.values);
    const beforeSession = new Map(sessionStorage.values);

    expect(await resetGvoJourney({ storage })).toMatchObject({
      copySafe: true,
      failedStage: "delete",
      ok: false,
      rollbackVerified: true,
      snapshotCount: 15,
    });
    expect(localStorage.values).toEqual(beforeLocal);
    expect(sessionStorage.values).toEqual(beforeSession);
    expect(localStorage.getItem("gvo.station1.v1")).toBe(world1Raw);
    expect(localStorage.getItem("gvo.station2.v1")).toBe(world2Raw);
    expect(localStorage.getItem("gvo.station3.v1")).toBe(world3Raw);
    expect(localStorage.getItem("gvo.station4.v1")).toBe(world4Raw);
  });

  it("restaura raw W2 corrupto y unknown byte-exacto en rollback", async () => {
    for (const world2Raw of [
      "{world-two-corrupt::raw",
      '{"schemaVersion":88,"opaque":"world-two"}',
    ]) {
      const { localStorage, storage } = seededBackends({
        local: {
          removeItem: (_key, count) => {
            if (count === 6) throw new Error("delete failure after W2");
          },
        },
      });
      localStorage.setItem("gvo.station2.v1", world2Raw);

      expect(await resetGvoJourney({ storage })).toMatchObject({
        ok: false,
        rollbackVerified: true,
        snapshotCount: 15,
      });
      expect(localStorage.getItem("gvo.station2.v1")).toBe(world2Raw);
    }
  });

  it("restaura raw W3 corrupto y unknown byte-exacto en rollback", async () => {
    for (const world3Raw of [
      "{world-three-corrupt::raw",
      '{"schemaVersion":88,"opaque":"world-three"}',
    ]) {
      const { localStorage, storage } = seededBackends({
        local: {
          removeItem: (_key, count) => {
            if (count === 7) throw new Error("delete failure after W3");
          },
        },
      });
      localStorage.setItem("gvo.station3.v1", world3Raw);

      expect(await resetGvoJourney({ storage })).toMatchObject({
        ok: false,
        rollbackVerified: true,
        snapshotCount: 15,
      });
      expect(localStorage.getItem("gvo.station3.v1")).toBe(world3Raw);
    }
  });

  it("retry toma un snapshot nuevo del recorrido, práctica y trivia", async () => {
    let fail = true;
    const { localStorage, storage } = seededBackends({
      local: {
        removeItem: (_key, count) => {
          if (fail && count === 2) throw new Error("first delete failure");
        },
      },
    });

    expect(await resetGvoJourney({ storage })).toMatchObject({ ok: false });
    localStorage.setItem("gvo.station1.v1", "new-snapshot-world-one");
    fail = false;
    expect(await resetGvoJourney({ storage })).toMatchObject({
      ok: true,
      snapshotCount: 15,
    });
    expect(localStorage.getItem("gvo.station1.v1")).toBeNull();
  });

  it("suspende los escritores antes del snapshot y rechaza callbacks viejos tras reactivar la misma sala", async () => {
    const oldContext = { active: true, attemptId: "before-reset", screen: 1, mode: "normal", authorized: true, reviewReturnAllowed: false } as const;
    setJourneyRuntimeContext(oldContext);
    const capturedPresentation = { screen: 1, stepId: "intro", contentRevision: "OBS03.2", attemptId: oldContext.attemptId, mode: "standard" } as const;
    const capturedConfirmation = { screen: 1, stepId: "intro", contentRevision: "OBS03.2", attemptId: oldContext.attemptId, cause: "visitor_advance" } as const;
    expect((await markEssentialPresented(capturedPresentation)).ok).toBe(true);
    const resetMutationToken = captureJourneyMutationToken();
    let release!: () => void;
    const reset = resetGvoJourney({ yieldBeforeMutation: () => new Promise<void>((resolve) => { release = resolve; }) });
    expect(isJourneyResetInProgress()).toBe(true);
    expect(getJourneyRuntimeContext()).toMatchObject({ active: false, authorized: false, attemptId: null });
    expect((await markEssentialPresented(capturedPresentation)).ok).toBe(false);
    expect((await confirmEssentialStep(capturedConfirmation)).ok).toBe(false);
    expect(persistJourneyReceipt(null, resetMutationToken).ok).toBe(false);
    release();
    expect(await reset).toMatchObject({ ok: true });
    expect(isJourneyResetInProgress()).toBe(false);
    expect(persistJourneyReceipt(null, resetMutationToken)).toMatchObject({ ok: false, reason: "stale_revision" });
    expect((await markEssentialPresented(capturedPresentation)).ok).toBe(false);
    expect(readEssentialSnapshot()?.stations[1].presentedStepIds).toEqual([]);

    setJourneyRuntimeContext({ ...oldContext, attemptId: "after-reset" });
    expect(await markEssentialPresented(capturedPresentation)).toMatchObject({ ok: false, reason: "stale_revision" });
    expect(await confirmEssentialStep(capturedConfirmation)).toMatchObject({ ok: false, reason: "stale_revision" });
    expect(readEssentialSnapshot()?.stations[1].presentedStepIds).toEqual([]);
    expect(readProgress().progress?.completedStations).toEqual([]);
    expect((await markEssentialPresented({ ...capturedPresentation, attemptId: "after-reset" })).ok).toBe(true);
    expect(readEssentialSnapshot()?.stations[1].presentedStepIds).toEqual(["intro"]);
  });

  it("detecta crédito cambiado durante yield sin borrarlo ni afirmar copySafe", async () => {
    const { localStorage, sessionStorage, storage } = seededBackends();
    const initial = '{"schemaVersion":1,"completedStations":[],"updatedAt":null}';
    const credited = '{"schemaVersion":1,"completedStations":[1],"updatedAt":"external-credit"}';
    localStorage.values.set("gvo.progress.v1", initial);
    const beforeSession = new Map(sessionStorage.values);
    const result = await resetGvoJourney({ storage, yieldBeforeMutation: async () => {
      expect(isJourneyResetInProgress()).toBe(true);
      localStorage.values.set("gvo.progress.v1", credited);
    } });
    expect(result).toMatchObject({ ok: false, errorCode: "reset_conflict", failedStage: "snapshot", copySafe: false, rollbackAttempted: false, rollbackVerified: false });
    expect(localStorage.getItem("gvo.progress.v1")).toBe(credited);
    expect(localStorage.mutations).toEqual([]);
    expect(sessionStorage.values).toEqual(beforeSession);
    expect(isJourneyResetInProgress()).toBe(false);
  });

  it("rollback restaura sólo sus ausencias verificadas y conserva crédito externo posterior a su delete", async () => {
    const credited = '{"schemaVersion":1,"completedStations":[1],"updatedAt":"external-credit"}';
    const seeded = seededBackends({ local: { removeItem: (key) => {
      if (key === "gvo.station1.v1") {
        // A deterministic local interleaving, not an atomic cross-tab transaction.
        backing.values.set("gvo.progress.v1", credited);
        throw new Error("delete failure after external credit");
      }
    } } });
    const backing = seeded.localStorage;
    backing.values.set("gvo.progress.v1", '{"schemaVersion":1,"completedStations":[],"updatedAt":null}');
    const beforeLocal = new Map(backing.values);
    const beforeSession = new Map(seeded.sessionStorage.values);
    expect(await resetGvoJourney({ storage: seeded.storage })).toMatchObject({ ok: false, failedStage: "rollback", copySafe: false, rollbackAttempted: true, rollbackVerified: false });
    expect(backing.getItem("gvo.progress.v1")).toBe(credited);
    for (const [key, raw] of beforeLocal) {
      if (key !== "gvo.progress.v1") expect(backing.getItem(key)).toBe(raw);
    }
    expect(backing.mutations).not.toContain("set:gvo.progress.v1");
    expect(seeded.sessionStorage.values).toEqual(beforeSession);
    expect(isJourneyResetInProgress()).toBe(false);
  });

  it("libera la barrera también si falla el snapshot y mantiene inactivo el intento anterior", async () => {
    setJourneyRuntimeContext({ active: true, attemptId: "snapshot-failed", screen: 1, mode: "normal", authorized: true, reviewReturnAllowed: false });
    const { storage } = seededBackends({ local: { getItem: () => {
      expect(isJourneyResetInProgress()).toBe(true);
      expect(getJourneyRuntimeContext()).toMatchObject({ active: false, authorized: false, attemptId: null });
      throw new Error("snapshot failure");
    } } });
    expect(await resetGvoJourney({ storage })).toMatchObject({ ok: false, failedStage: "snapshot", copySafe: false });
    expect(isJourneyResetInProgress()).toBe(false);
    expect(getJourneyRuntimeContext()).toMatchObject({ active: false, authorized: false, attemptId: null });
  });
});
