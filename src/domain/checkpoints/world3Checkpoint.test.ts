import { describe, expect, it } from "vitest";

import type { ProgressStorage } from "../progress/progress.types";
import {
  readWorld3Checkpoint,
  removeWorld3Checkpoint,
  WORLD3_CHECKPOINT_STORAGE_KEY,
  type World3CheckpointV1,
  writeWorld3Checkpoint,
} from "./world3Checkpoint";

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

const validCheckpoint: World3CheckpointV1 = {
  completedRecordIds: ["planta", "prototipo"],
  schemaVersion: 1,
  updatedAt: "2026-08-05T16:00:00.000Z",
};

function raw(value: unknown) {
  return JSON.stringify(value);
}

function readValue(value: unknown) {
  return readWorld3Checkpoint(
    new MemoryStorage({ [WORLD3_CHECKPOINT_STORAGE_KEY]: raw(value) }),
  );
}

describe("world3Checkpoint", () => {
  it("lee empty y acepta cada prefijo canónico", () => {
    expect(readWorld3Checkpoint(new MemoryStorage()).status).toBe("empty");
    for (const completedRecordIds of [
      [],
      ["planta"],
      ["planta", "prototipo"],
      ["planta", "prototipo", "senal"],
    ]) {
      expect(readValue({ ...validCheckpoint, completedRecordIds }).status).toBe(
        "ok",
      );
    }
  });

  it("preserva raw corrupto y de versión desconocida sin mutar", () => {
    for (const [invalidRaw, expectedStatus] of [
      ["{world-three-corrupt::raw", "corrupt"],
      ['{"schemaVersion":77,"opaque":"world-three"}', "unknown_version"],
    ] as const) {
      const storage = new MemoryStorage({
        [WORLD3_CHECKPOINT_STORAGE_KEY]: invalidRaw,
      });
      expect(readWorld3Checkpoint(storage).status).toBe(expectedStatus);
      expect(storage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY)).toBe(invalidRaw);
      expect(storage.mutations).toEqual([]);
    }
  });

  it.each([
    ["empieza tarde", ["prototipo"]],
    ["tiene hueco", ["planta", "senal"]],
    ["duplica", ["planta", "planta"]],
    ["invierte", ["planta", "senal", "prototipo"]],
    ["añade ID", ["planta", "prototipo", "senal", "otro"]],
  ])("rechaza como corrupt un prefijo que %s", (_label, completedRecordIds) => {
    expect(readValue({ ...validCheckpoint, completedRecordIds }).status).toBe(
      "corrupt",
    );
  });

  it("rechaza timestamp no canónico, campo adicional y formas inválidas", () => {
    for (const value of [
      { ...validCheckpoint, updatedAt: "2026-08-05" },
      { ...validCheckpoint, phase: "confirmed" },
      { ...validCheckpoint, completedRecordIds: "planta" },
      null,
      [],
    ]) {
      expect(readValue(value).status).toBe("corrupt");
    }
  });

  it("convierte excepciones y fallos de verificación", () => {
    expect(
      readWorld3Checkpoint(new MemoryStorage({}, { getThrows: true })).status,
    ).toBe("storage_unavailable");
    expect(
      writeWorld3Checkpoint(
        { completedRecordIds: ["planta"] },
        new MemoryStorage({}, { setThrows: true }),
      ),
    ).toEqual({ ok: false, reason: "storage_unavailable" });
    expect(
      writeWorld3Checkpoint(
        { completedRecordIds: ["planta"] },
        new MemoryStorage({}, { ignoreSet: true }),
      ),
    ).toEqual({ ok: false, reason: "verification_failed" });
    expect(
      removeWorld3Checkpoint(new MemoryStorage({}, { removeThrows: true })),
    ).toEqual({ ok: false, reason: "storage_unavailable" });
    expect(
      removeWorld3Checkpoint(
        new MemoryStorage(
          { [WORLD3_CHECKPOINT_STORAGE_KEY]: raw(validCheckpoint) },
          { ignoreRemove: true },
        ),
      ),
    ).toEqual({ ok: false, reason: "verification_failed" });
  });

  it("escribe verificado y no reescribe el mismo estado estable", () => {
    const storage = new MemoryStorage();
    expect(
      writeWorld3Checkpoint(
        { completedRecordIds: ["planta", "prototipo"] },
        storage,
        () => "2026-08-05T17:00:00.000Z",
      ),
    ).toMatchObject({ ok: true });
    const firstRaw = storage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY);

    storage.mutations.length = 0;
    expect(
      writeWorld3Checkpoint(
        { completedRecordIds: ["planta", "prototipo"] },
        storage,
        () => "2030-01-01T00:00:00.000Z",
      ),
    ).toMatchObject({ ok: true });
    expect(storage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY)).toBe(firstRaw);
    expect(storage.mutations).toEqual([]);
  });

  it("no sobrescribe inválidos y recovery elimina sólo W3", () => {
    const invalidRaw = "{world-three-must-survive";
    const storage = new MemoryStorage({
      [WORLD3_CHECKPOINT_STORAGE_KEY]: invalidRaw,
      "gvo.progress.v1": "global-preserved",
      "gvo.station1.v1": "world-one-preserved",
      "gvo.station2.v1": "world-two-preserved",
      "gvo.station4.v1": "world-four-preserved",
      "gvo.station5.v1": "world-five-preserved",
    });

    expect(
      writeWorld3Checkpoint({ completedRecordIds: ["planta"] }, storage),
    ).toEqual({ ok: false, reason: "corrupt" });
    expect(storage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY)).toBe(invalidRaw);
    expect(removeWorld3Checkpoint(storage)).toEqual({ ok: true });
    expect(storage.getItem(WORLD3_CHECKPOINT_STORAGE_KEY)).toBeNull();
    expect(storage.getItem("gvo.progress.v1")).toBe("global-preserved");
    expect(storage.getItem("gvo.station1.v1")).toBe("world-one-preserved");
    expect(storage.getItem("gvo.station2.v1")).toBe("world-two-preserved");
    expect(storage.getItem("gvo.station4.v1")).toBe("world-four-preserved");
    expect(storage.getItem("gvo.station5.v1")).toBe("world-five-preserved");
  });
});
