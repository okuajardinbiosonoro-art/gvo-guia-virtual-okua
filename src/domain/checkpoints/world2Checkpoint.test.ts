import { describe, expect, it } from "vitest";

import type { ProgressStorage } from "../progress/progress.types";
import {
  readWorld2Checkpoint,
  removeWorld2Checkpoint,
  WORLD2_CHECKPOINT_STORAGE_KEY,
  type World2CheckpointState,
  type World2CheckpointV1,
  writeWorld2Checkpoint,
} from "./world2Checkpoint";

type StorageOptions = Readonly<{
  getThrows?: boolean;
  ignoreRemove?: boolean;
  ignoreSet?: boolean;
  removeThrows?: boolean;
  setThrows?: boolean;
}>;

class MemoryStorage implements ProgressStorage {
  readonly values = new Map<string, string>();
  readonly mutations: string[] = [];

  constructor(
    initial: Record<string, string> = {},
    private readonly options: StorageOptions = {},
  ) {
    Object.entries(initial).forEach(([key, value]) =>
      this.values.set(key, value),
    );
  }

  getItem(key: string) {
    if (this.options.getThrows) throw new Error("get unavailable");
    return this.values.get(key) ?? null;
  }

  removeItem(key: string) {
    if (this.options.removeThrows) throw new Error("remove unavailable");
    this.mutations.push(`remove:${key}`);
    if (!this.options.ignoreRemove) this.values.delete(key);
  }

  setItem(key: string, value: string) {
    if (this.options.setThrows) throw new Error("set unavailable");
    this.mutations.push(`set:${key}`);
    if (!this.options.ignoreSet) this.values.set(key, value);
  }
}

const validCheckpoint: World2CheckpointV1 = {
  activeLayerId: "captura",
  visitedLayerIds: ["planta_viva", "senal", "captura"],
  highestUnlockedLayerOrder: 4,
  completedRequiredInteractions: [
    "plant_contact_readout_seen",
    "signal_measured_wave_seen",
  ],
  capture: {
    currentStepId: "signal",
    visitedStepIds: ["contact", "signal"],
  },
  mappingFirstRunComplete: false,
  resultState: "not_started",
  schemaVersion: 1,
  updatedAt: "2026-08-05T15:00:00.000Z",
};

function raw(value: unknown) {
  return JSON.stringify(value);
}

function readValue(value: unknown) {
  return readWorld2Checkpoint(
    new MemoryStorage({ [WORLD2_CHECKPOINT_STORAGE_KEY]: raw(value) }),
  );
}

function stableState(
  checkpoint: World2CheckpointV1 = validCheckpoint,
): World2CheckpointState {
  return {
    activeLayerId: checkpoint.activeLayerId,
    visitedLayerIds: checkpoint.visitedLayerIds,
    highestUnlockedLayerOrder: checkpoint.highestUnlockedLayerOrder,
    completedRequiredInteractions: checkpoint.completedRequiredInteractions,
    capture: checkpoint.capture,
    mappingFirstRunComplete: checkpoint.mappingFirstRunComplete,
    resultState: checkpoint.resultState,
  };
}

describe("world2Checkpoint", () => {
  it("lee empty y un checkpoint válido", () => {
    expect(readWorld2Checkpoint(new MemoryStorage()).status).toBe("empty");
    expect(readValue(validCheckpoint)).toEqual({
      checkpoint: validCheckpoint,
      rawPreserved: true,
      status: "ok",
    });
  });

  it("preserva JSON corrupto y versión desconocida", () => {
    for (const invalidRaw of [
      "{world-two-corrupt::raw",
      '{"schemaVersion":77,"opaque":"world-two"}',
    ]) {
      const storage = new MemoryStorage({
        [WORLD2_CHECKPOINT_STORAGE_KEY]: invalidRaw,
      });
      expect(readWorld2Checkpoint(storage).status).toBe(
        invalidRaw.startsWith("{") && invalidRaw.includes("schemaVersion")
          ? "unknown_version"
          : "corrupt",
      );
      expect(storage.getItem(WORLD2_CHECKPOINT_STORAGE_KEY)).toBe(invalidRaw);
      expect(storage.mutations).toEqual([]);
    }
  });

  it.each([
    ["layer ID inválido", { ...validCheckpoint, activeLayerId: "otro" }],
    [
      "prefix que empieza tarde",
      { ...validCheckpoint, visitedLayerIds: ["senal"] },
    ],
    [
      "prefix con hueco",
      { ...validCheckpoint, visitedLayerIds: ["planta_viva", "captura"] },
    ],
    [
      "prefix duplicado",
      {
        ...validCheckpoint,
        visitedLayerIds: ["planta_viva", "senal", "senal"],
      },
    ],
    [
      "active fuera del prefix",
      { ...validCheckpoint, activeLayerId: "acondicionamiento" },
    ],
    [
      "highest incoherente",
      { ...validCheckpoint, highestUnlockedLayerOrder: 6 },
    ],
    [
      "interacción fuera de orden",
      {
        ...validCheckpoint,
        completedRequiredInteractions: ["signal_measured_wave_seen"],
      },
    ],
    [
      "pasos de Captura con hueco",
      {
        ...validCheckpoint,
        capture: {
          currentStepId: "system",
          visitedStepIds: ["contact", "system"],
        },
      },
    ],
    [
      "paso actual no visitado",
      {
        ...validCheckpoint,
        capture: {
          currentStepId: "system",
          visitedStepIds: ["contact", "signal"],
        },
      },
    ],
    [
      "Mapeo inconsistente",
      { ...validCheckpoint, mappingFirstRunComplete: true },
    ],
    [
      "Resultado pending inconsistente",
      { ...validCheckpoint, resultState: "convergence_pending" },
    ],
    [
      "Resultado ready inconsistente",
      { ...validCheckpoint, resultState: "ready_to_continue" },
    ],
    [
      "timestamp no canónico",
      { ...validCheckpoint, updatedAt: "2026-08-05" },
    ],
    ["campo adicional", { ...validCheckpoint, timer: 3200 }],
  ])("rechaza como corrupt: %s", (_label, checkpoint) => {
    expect(readValue(checkpoint).status).toBe("corrupt");
  });

  it("acepta Mapeo completo, Resultado pending y Resultado ready coherentes", () => {
    const mappingComplete: World2CheckpointV1 = {
      ...validCheckpoint,
      activeLayerId: "mapeo",
      visitedLayerIds: [
        "planta_viva",
        "senal",
        "captura",
        "acondicionamiento",
        "mapeo",
      ],
      highestUnlockedLayerOrder: 6,
      completedRequiredInteractions: [
        "plant_contact_readout_seen",
        "signal_measured_wave_seen",
        "capture_data_readout_seen",
      ],
      capture: {
        currentStepId: "system",
        visitedStepIds: ["contact", "signal", "system"],
      },
      mappingFirstRunComplete: true,
    };
    const pending: World2CheckpointV1 = {
      ...mappingComplete,
      activeLayerId: "resultado_mediado",
      visitedLayerIds: [
        "planta_viva",
        "senal",
        "captura",
        "acondicionamiento",
        "mapeo",
        "resultado_mediado",
      ],
      resultState: "convergence_pending",
    };
    const ready: World2CheckpointV1 = {
      ...pending,
      resultState: "ready_to_continue",
    };

    expect(readValue(mappingComplete).status).toBe("ok");
    expect(readValue(pending).status).toBe("ok");
    expect(readValue(ready).status).toBe("ok");
  });

  it("convierte excepciones de get/set/remove y fallo de verificación", () => {
    expect(
      readWorld2Checkpoint(new MemoryStorage({}, { getThrows: true })).status,
    ).toBe("storage_unavailable");
    expect(
      writeWorld2Checkpoint(
        stableState(),
        new MemoryStorage({}, { setThrows: true }),
      ),
    ).toEqual({ ok: false, reason: "storage_unavailable" });
    expect(
      writeWorld2Checkpoint(
        stableState(),
        new MemoryStorage({}, { ignoreSet: true }),
      ),
    ).toEqual({ ok: false, reason: "verification_failed" });
    expect(
      removeWorld2Checkpoint(new MemoryStorage({}, { removeThrows: true })),
    ).toEqual({ ok: false, reason: "storage_unavailable" });
    expect(
      removeWorld2Checkpoint(
        new MemoryStorage(
          { [WORLD2_CHECKPOINT_STORAGE_KEY]: raw(validCheckpoint) },
          { ignoreRemove: true },
        ),
      ),
    ).toEqual({ ok: false, reason: "verification_failed" });
  });

  it("escribe verificado y es idempotente para el mismo estado estable", () => {
    const storage = new MemoryStorage();
    expect(
      writeWorld2Checkpoint(
        stableState(),
        storage,
        () => "2026-08-05T16:00:00.000Z",
      ),
    ).toMatchObject({ ok: true });
    const firstRaw = storage.getItem(WORLD2_CHECKPOINT_STORAGE_KEY);
    expect(readWorld2Checkpoint(storage).status).toBe("ok");

    storage.mutations.length = 0;
    expect(
      writeWorld2Checkpoint(
        stableState(),
        storage,
        () => "2030-01-01T00:00:00.000Z",
      ),
    ).toMatchObject({ ok: true });
    expect(storage.getItem(WORLD2_CHECKPOINT_STORAGE_KEY)).toBe(firstRaw);
    expect(storage.mutations).toEqual([]);
  });

  it("no sobrescribe raw inválido y recovery elimina sólo W2", () => {
    const invalidRaw = "{world-two-must-survive";
    const storage = new MemoryStorage({
      [WORLD2_CHECKPOINT_STORAGE_KEY]: invalidRaw,
      "gvo.progress.v1": "global-preserved",
      "gvo.station1.v1": "world-one-preserved",
      "gvo.station4.v1": "world-four-preserved",
      "gvo.station5.v1": "world-five-preserved",
    });

    expect(writeWorld2Checkpoint(stableState(), storage)).toEqual({
      ok: false,
      reason: "corrupt",
    });
    expect(storage.getItem(WORLD2_CHECKPOINT_STORAGE_KEY)).toBe(invalidRaw);
    expect(removeWorld2Checkpoint(storage)).toEqual({ ok: true });
    expect(storage.getItem(WORLD2_CHECKPOINT_STORAGE_KEY)).toBeNull();
    expect(storage.getItem("gvo.progress.v1")).toBe("global-preserved");
    expect(storage.getItem("gvo.station1.v1")).toBe("world-one-preserved");
    expect(storage.getItem("gvo.station4.v1")).toBe("world-four-preserved");
    expect(storage.getItem("gvo.station5.v1")).toBe("world-five-preserved");
  });
});
