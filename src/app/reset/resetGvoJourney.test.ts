import { beforeEach, describe, expect, it } from "vitest";

import {
  canOpenFinal,
  readProgress,
} from "../../domain/progress/progress.storage";
import { beginFinalReview } from "../review/finalReviewContext";
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
      "gvo.progress.v1":
        '{"schemaVersion":1,"completedStations":[1,2,3,4,5],"updatedAt":"2026-08-05T12:00:00.000Z"}',
      "gvo.station1.v1":
        '{"schemaVersion":1,"activeConcept":"relation","highestReachedConcept":"perception","updatedAt":"2026-08-05T12:01:00.000Z"}',
      "gvo.station2.v1":
        '{"schemaVersion":1,"activeLayerId":"senal","visitedLayerIds":["planta_viva","senal"],"highestUnlockedLayerOrder":3,"completedRequiredInteractions":["plant_contact_readout_seen"],"capture":{"currentStepId":"contact","visitedStepIds":["contact"]},"mappingFirstRunComplete":false,"resultState":"not_started","updatedAt":"2026-08-05T12:01:30.000Z"}',
      "gvo.station4.v1":
        '{"schemaVersion":1,"highestSettledIndex":3,"resumeMode":"reading","updatedAt":"2026-08-05T12:02:00.000Z"}',
      "gvo.station5.v1": '{"completedAreas":["plantas"]}',
      "gvo.coverIntro.introCompleted.v1": "true",
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
  });

  it("usa una allowlist tipada de siete claves auditadas y preserve explícito", () => {
    expect(GVO_JOURNEY_RESET_ALLOWLIST).toEqual([
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
        key: "gvo.station4.v1",
        purpose: "world-four-state",
      }),
      expect.objectContaining({
        backend: "localStorage",
        key: "gvo.station5.v1",
      }),
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

    expect(snapshot).toHaveLength(7);
    expect(snapshot.every((entry) => entry.existed)).toBe(true);
    expect(snapshot.find((entry) => entry.key === "gvo.progress.v1")?.raw).toBe(
      '{"schemaVersion":1,"completedStations":[1,2,3,4,5],"updatedAt":"2026-08-05T12:00:00.000Z"}',
    );

    const result = await resetGvoJourney({ storage });
    expect(result).toMatchObject({
      ok: true,
      snapshotCount: 7,
      verifiedInitialState: true,
    });
    for (const entry of GVO_JOURNEY_RESET_ALLOWLIST) {
      expect(storage[entry.backend]?.getItem(entry.key)).toBeNull();
    }
    expect(localStorage.getItem("gvo:accessibility:contrast")).toBe("high");
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

  it("restaura checkpoints W1/W2/W4 corruptos byte-exacto después de un fallo intermedio", async () => {
    const { localStorage, sessionStorage, storage } = seededBackends({
      local: {
        removeItem: (_key, count) => {
          if (count === 5) throw new Error("delete failure");
        },
      },
    });
    const world1Raw = "{world-one-corrupt::raw";
    const world2Raw = '{"schemaVersion":88,"opaque":"world-two"}';
    const world4Raw = '{"schemaVersion":77,"opaque":"world-four"}';
    localStorage.setItem("gvo.station1.v1", world1Raw);
    localStorage.setItem("gvo.station2.v1", world2Raw);
    localStorage.setItem("gvo.station4.v1", world4Raw);
    const beforeLocal = new Map(localStorage.values);
    const beforeSession = new Map(sessionStorage.values);

    expect(await resetGvoJourney({ storage })).toMatchObject({
      copySafe: true,
      failedStage: "delete",
      ok: false,
      rollbackVerified: true,
      snapshotCount: 7,
    });
    expect(localStorage.values).toEqual(beforeLocal);
    expect(sessionStorage.values).toEqual(beforeSession);
    expect(localStorage.getItem("gvo.station1.v1")).toBe(world1Raw);
    expect(localStorage.getItem("gvo.station2.v1")).toBe(world2Raw);
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
            if (count === 5) throw new Error("delete failure after W2");
          },
        },
      });
      localStorage.setItem("gvo.station2.v1", world2Raw);

      expect(await resetGvoJourney({ storage })).toMatchObject({
        ok: false,
        rollbackVerified: true,
        snapshotCount: 7,
      });
      expect(localStorage.getItem("gvo.station2.v1")).toBe(world2Raw);
    }
  });

  it("retry toma un snapshot nuevo de las siete claves", async () => {
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
      snapshotCount: 7,
    });
    expect(localStorage.getItem("gvo.station1.v1")).toBeNull();
  });
});
