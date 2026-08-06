import { describe, expect, it } from "vitest";

import type { ProgressStorage } from "../progress/progress.types";
import type {
  CheckpointReadResult,
  CheckpointRemoveResult,
  CheckpointWriteResult,
} from "./checkpointStore";
import {
  readWorld1Checkpoint,
  removeWorld1Checkpoint,
  WORLD1_CHECKPOINT_STORAGE_KEY,
  type World1CheckpointV1,
  writeWorld1Checkpoint,
} from "./world1Checkpoint";
import {
  readWorld4Checkpoint,
  removeWorld4Checkpoint,
  WORLD4_CHECKPOINT_STORAGE_KEY,
  type World4CheckpointV1,
  writeWorld4Checkpoint,
} from "./world4Checkpoint";

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

type StoreFixture<T> = Readonly<{
  invalidShape: string;
  invalidTimestamp: string;
  key: string;
  otherKey: string;
  read: (storage: ProgressStorage) => CheckpointReadResult<T>;
  remove: (storage: ProgressStorage) => CheckpointRemoveResult;
  unknownVersion: string;
  valid: T;
  write: (
    storage: ProgressStorage,
    now?: () => string,
  ) => CheckpointWriteResult<T>;
}>;

function exerciseVersionedStore<T extends { updatedAt: string }>(
  label: string,
  fixture: StoreFixture<T>,
) {
  describe(label, () => {
    it("lee empty", () => {
      expect(fixture.read(new MemoryStorage())).toEqual({
        checkpoint: null,
        rawPreserved: true,
        status: "empty",
      });
    });

    it("lee schemaVersion válida", () => {
      const storage = new MemoryStorage({
        [fixture.key]: JSON.stringify(fixture.valid),
      });
      expect(fixture.read(storage)).toEqual({
        checkpoint: fixture.valid,
        rawPreserved: true,
        status: "ok",
      });
    });

    it("preserva versión desconocida", () => {
      const storage = new MemoryStorage({
        [fixture.key]: fixture.unknownVersion,
      });
      expect(fixture.read(storage)).toMatchObject({
        checkpoint: null,
        rawPreserved: true,
        status: "unknown_version",
      });
      expect(storage.getItem(fixture.key)).toBe(fixture.unknownVersion);
      expect(storage.mutations).toEqual([]);
    });

    it("preserva JSON corrupto", () => {
      const raw = "{checkpoint-corrupt::raw";
      const storage = new MemoryStorage({ [fixture.key]: raw });
      expect(fixture.read(storage).status).toBe("corrupt");
      expect(storage.getItem(fixture.key)).toBe(raw);
      expect(storage.mutations).toEqual([]);
    });

    it("rechaza shape inválido", () => {
      expect(
        fixture.read(new MemoryStorage({ [fixture.key]: fixture.invalidShape }))
          .status,
      ).toBe("corrupt");
    });

    it("rechaza timestamp inválido", () => {
      expect(
        fixture.read(
          new MemoryStorage({ [fixture.key]: fixture.invalidTimestamp }),
        ).status,
      ).toBe("corrupt");
    });

    it("convierte excepción getItem en storage_unavailable", () => {
      expect(fixture.read(new MemoryStorage({}, { getThrows: true }))).toEqual({
        checkpoint: null,
        rawPreserved: true,
        status: "storage_unavailable",
      });
    });

    it("escribe y relee de forma verificada", () => {
      const storage = new MemoryStorage();
      const result = fixture.write(storage, () => "2026-08-05T14:00:00.000Z");
      expect(result).toMatchObject({ ok: true });
      expect(fixture.read(storage).status).toBe("ok");
    });

    it("convierte excepción setItem en storage_unavailable", () => {
      expect(fixture.write(new MemoryStorage({}, { setThrows: true }))).toEqual(
        { ok: false, reason: "storage_unavailable" },
      );
    });

    it("detecta verification_failed tras setItem", () => {
      expect(fixture.write(new MemoryStorage({}, { ignoreSet: true }))).toEqual(
        { ok: false, reason: "verification_failed" },
      );
    });

    it("es idempotente para el mismo estado estable", () => {
      const storage = new MemoryStorage({
        [fixture.key]: JSON.stringify(fixture.valid),
      });
      const result = fixture.write(storage, () => "2030-01-01T00:00:00.000Z");
      expect(result).toEqual({ checkpoint: fixture.valid, ok: true });
      expect(storage.mutations).toEqual([]);
    });

    it("no sobrescribe raw corrupto al escribir", () => {
      const raw = "{raw-must-survive";
      const storage = new MemoryStorage({ [fixture.key]: raw });
      expect(fixture.write(storage)).toEqual({
        ok: false,
        reason: "corrupt",
      });
      expect(storage.getItem(fixture.key)).toBe(raw);
      expect(storage.mutations).toEqual([]);
    });

    it("elimina y verifica", () => {
      const storage = new MemoryStorage({
        [fixture.key]: JSON.stringify(fixture.valid),
      });
      expect(fixture.remove(storage)).toEqual({ ok: true });
      expect(storage.getItem(fixture.key)).toBeNull();
    });

    it("convierte excepción removeItem en storage_unavailable", () => {
      expect(
        fixture.remove(new MemoryStorage({}, { removeThrows: true })),
      ).toEqual({ ok: false, reason: "storage_unavailable" });
    });

    it("detecta verification_failed tras removeItem", () => {
      const storage = new MemoryStorage(
        { [fixture.key]: JSON.stringify(fixture.valid) },
        { ignoreRemove: true },
      );
      expect(fixture.remove(storage)).toEqual({
        ok: false,
        reason: "verification_failed",
      });
    });

    it("recovery explícito elimina sólo la key propia", () => {
      const raw = "{corrupt-recovery";
      const storage = new MemoryStorage({
        [fixture.key]: raw,
        [fixture.otherKey]: "other-world-raw",
      });
      expect(fixture.read(storage).status).toBe("corrupt");
      expect(fixture.remove(storage)).toEqual({ ok: true });
      expect(storage.getItem(fixture.key)).toBeNull();
      expect(storage.getItem(fixture.otherKey)).toBe("other-world-raw");
    });
  });
}

const world1Valid: World1CheckpointV1 = {
  activeConcept: "relation",
  highestReachedConcept: "perception",
  schemaVersion: 1,
  updatedAt: "2026-08-05T12:00:00.000Z",
};

exerciseVersionedStore("world1Checkpoint", {
  invalidShape:
    '{"schemaVersion":1,"activeConcept":"mediation","highestReachedConcept":"relation","updatedAt":"2026-08-05T12:00:00.000Z"}',
  invalidTimestamp:
    '{"schemaVersion":1,"activeConcept":"intro","highestReachedConcept":"intro","updatedAt":"2026-08-05"}',
  key: WORLD1_CHECKPOINT_STORAGE_KEY,
  otherKey: WORLD4_CHECKPOINT_STORAGE_KEY,
  read: readWorld1Checkpoint,
  remove: removeWorld1Checkpoint,
  unknownVersion: '{"schemaVersion":2,"opaque":true}',
  valid: world1Valid,
  write: (storage, now) =>
    writeWorld1Checkpoint(
      {
        activeConcept: world1Valid.activeConcept,
        highestReachedConcept: world1Valid.highestReachedConcept,
      },
      storage,
      now,
    ),
});

const world4Valid: World4CheckpointV1 = {
  highestSettledIndex: 3,
  resumeMode: "reading",
  schemaVersion: 1,
  updatedAt: "2026-08-05T12:00:00.000Z",
};

exerciseVersionedStore("world4Checkpoint", {
  invalidShape:
    '{"schemaVersion":1,"highestSettledIndex":4,"resumeMode":"chain_pending","updatedAt":"2026-08-05T12:00:00.000Z"}',
  invalidTimestamp:
    '{"schemaVersion":1,"highestSettledIndex":-1,"resumeMode":"reading","updatedAt":"2026-08-05"}',
  key: WORLD4_CHECKPOINT_STORAGE_KEY,
  otherKey: WORLD1_CHECKPOINT_STORAGE_KEY,
  read: readWorld4Checkpoint,
  remove: removeWorld4Checkpoint,
  unknownVersion: '{"schemaVersion":5,"opaque":true}',
  valid: world4Valid,
  write: (storage, now) =>
    writeWorld4Checkpoint(
      {
        highestSettledIndex: world4Valid.highestSettledIndex,
        resumeMode: world4Valid.resumeMode,
      },
      storage,
      now,
    ),
});
