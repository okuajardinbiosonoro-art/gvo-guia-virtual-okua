import { beforeEach, describe, expect, it } from "vitest";

import type { ProgressStorage } from "./progress.types";
import {
  canOpenFinal,
  canOpenStation,
  canOpenTransition,
  coherentProgressPrefixLength,
  GVO_PROGRESS_SCHEMA_VERSION,
  GVO_PROGRESS_STORAGE_KEY,
  markStationCompleted,
  mostAdvancedAvailableStation,
  readProgress,
  resetProgress,
} from "./progress.storage";

class FakeStorage implements ProgressStorage {
  readonly values = new Map<string, string>();
  getThrows = false;
  setThrows = false;
  removeThrows = false;
  ignoreSet = false;
  setCalls = 0;

  constructor(raw?: string) {
    if (raw !== undefined) {
      this.values.set(GVO_PROGRESS_STORAGE_KEY, raw);
    }
  }

  getItem(key: string) {
    if (this.getThrows) throw new Error("get blocked");
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.setCalls += 1;
    if (this.setThrows) throw new Error("set blocked");
    if (!this.ignoreSet) this.values.set(key, value);
  }

  removeItem(key: string) {
    if (this.removeThrows) throw new Error("remove blocked");
    this.values.delete(key);
  }
}

const canonical = (completedStations: number[], updatedAt: string | null) =>
  JSON.stringify({
    schemaVersion: GVO_PROGRESS_SCHEMA_VERSION,
    completedStations,
    updatedAt,
  });

describe("progress storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("distingue storage vacío y entrega el schema canónico v1", () => {
    expect(readProgress()).toEqual({
      status: "empty",
      progress: {
        schemaVersion: 1,
        completedStations: [],
        updatedAt: null,
      },
      rawPreserved: true,
    });
  });

  it("migra legacy en memoria, normaliza IDs, duplicados, orden y updatedAt", () => {
    const validTimestamp = "2026-08-05T12:00:00.000Z";
    const storage = new FakeStorage(
      JSON.stringify({
        completedStations: [5, 2, 2, 9, 1, "3"],
        updatedAt: validTimestamp,
      }),
    );

    expect(readProgress(storage)).toEqual({
      status: "legacy",
      progress: {
        schemaVersion: 1,
        completedStations: [1, 2, 5],
        updatedAt: validTimestamp,
      },
      rawPreserved: true,
    });

    storage.values.set(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({ completedStations: [1], updatedAt: "not-a-date" }),
    );
    expect(readProgress(storage).progress?.updatedAt).toBeNull();
    expect(storage.setCalls).toBe(0);
  });

  it("lee payload canónico v1 sin mutar el raw", () => {
    const raw = canonical([1, 4, 5], "2026-08-05T12:00:00.000Z");
    const storage = new FakeStorage(raw);

    expect(readProgress(storage)).toMatchObject({
      status: "ok",
      progress: { schemaVersion: 1, completedStations: [1, 4, 5] },
    });
    expect(storage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(raw);
    expect(storage.setCalls).toBe(0);
  });

  it("distingue JSON corrupto, objeto incompatible y versión desconocida", () => {
    expect(readProgress(new FakeStorage("{corrupto"))).toMatchObject({
      status: "corrupt",
      progress: null,
    });
    expect(
      readProgress(new FakeStorage(JSON.stringify({ foo: "bar" }))),
    ).toMatchObject({ status: "corrupt", progress: null });
    expect(
      readProgress(
        new FakeStorage(
          JSON.stringify({
            schemaVersion: 2,
            completedStations: [1, 2, 3, 4, 5],
            updatedAt: null,
          }),
        ),
      ),
    ).toMatchObject({ status: "unknown_version", progress: null });
  });

  it("distingue getItem bloqueado como storage_unavailable", () => {
    const storage = new FakeStorage();
    storage.getThrows = true;

    expect(readProgress(storage)).toEqual({
      status: "storage_unavailable",
      progress: null,
      rawPreserved: true,
    });
  });

  it("persiste y verifica completion canónica, idempotente y sin duplicados", () => {
    const storage = new FakeStorage();
    const first = markStationCompleted(
      1,
      storage,
      () => "2026-08-05T12:01:00.000Z",
    );
    const rawAfterFirst = storage.getItem(GVO_PROGRESS_STORAGE_KEY);
    const second = markStationCompleted(
      1,
      storage,
      () => "2026-08-05T12:02:00.000Z",
    );

    expect(first).toMatchObject({
      ok: true,
      changed: true,
      progress: { schemaVersion: 1, completedStations: [1] },
    });
    expect(second).toMatchObject({ ok: true, changed: false });
    expect(storage.setCalls).toBe(1);
    expect(storage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(rawAfterFirst);
  });

  it("migra legacy al escribir y preserva completion dispersa sin inventar huecos", () => {
    const storage = new FakeStorage(
      JSON.stringify({
        completedStations: [4, 5],
        updatedAt: "2026-08-04T00:00:00.000Z",
      }),
    );

    expect(
      markStationCompleted(1, storage, () => "2026-08-05T12:00:00.000Z"),
    ).toMatchObject({
      ok: true,
      progress: { schemaVersion: 1, completedStations: [1, 4, 5] },
    });
    expect(
      JSON.parse(storage.getItem(GVO_PROGRESS_STORAGE_KEY) ?? "{}"),
    ).toEqual({
      schemaVersion: 1,
      completedStations: [1, 4, 5],
      updatedAt: "2026-08-05T12:00:00.000Z",
    });
  });

  it("no sobrescribe raw corrupto ni versión desconocida durante completion", () => {
    for (const raw of [
      "{corrupto",
      canonical([1], null).replace('"schemaVersion":1', '"schemaVersion":2'),
    ]) {
      const storage = new FakeStorage(raw);
      const result = markStationCompleted(1, storage);

      expect(result.ok).toBe(false);
      expect(storage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(raw);
      expect(storage.setCalls).toBe(0);
    }
  });

  it("reporta setItem bloqueado y verificación posterior fallida", () => {
    const blocked = new FakeStorage();
    blocked.setThrows = true;
    expect(markStationCompleted(1, blocked)).toEqual({
      ok: false,
      reason: "storage_unavailable",
    });

    const ignored = new FakeStorage();
    ignored.ignoreSet = true;
    expect(markStationCompleted(1, ignored)).toEqual({
      ok: false,
      reason: "verification_failed",
    });
  });

  it("calcula prefijo, acceso secuencial, transiciones, Final y destino seguro", () => {
    const cases = [
      { completedStations: [], prefix: 0, safe: 1 },
      { completedStations: [1], prefix: 1, safe: 2 },
      { completedStations: [1, 2], prefix: 2, safe: 3 },
      { completedStations: [1, 2, 3], prefix: 3, safe: 4 },
      { completedStations: [1, 2, 3, 4], prefix: 4, safe: 5 },
      { completedStations: [4, 5], prefix: 0, safe: 1 },
      { completedStations: [1, 4, 5], prefix: 1, safe: 2 },
      { completedStations: [1, 2, 3, 4, 5], prefix: 5, safe: 5 },
    ] as const;

    for (const testCase of cases) {
      const progress = {
        schemaVersion: 1 as const,
        completedStations: [...testCase.completedStations],
        updatedAt: null,
      };
      expect(coherentProgressPrefixLength(progress)).toBe(testCase.prefix);
      expect(mostAdvancedAvailableStation(progress)).toBe(testCase.safe);
    }

    const scattered = {
      schemaVersion: 1 as const,
      completedStations: [1, 4, 5] as (1 | 2 | 3 | 4 | 5)[],
      updatedAt: null,
    };
    expect(canOpenStation(1, scattered)).toBe(true);
    expect(canOpenStation(2, scattered)).toBe(true);
    expect(canOpenStation(3, scattered)).toBe(false);
    expect(canOpenTransition(1, scattered)).toBe(true);
    expect(canOpenTransition(2, scattered)).toBe(false);
    expect(canOpenFinal(scattered)).toBe(false);
    expect(
      canOpenFinal({
        ...scattered,
        completedStations: [1, 2, 3, 4, 5],
      }),
    ).toBe(true);
  });

  it("falla cerrado para accesos protegidos y permite Mundo I con lectura inválida", () => {
    const invalid = readProgress(new FakeStorage("{corrupto"));

    expect(canOpenStation(1, invalid)).toBe(true);
    expect(canOpenStation(2, invalid)).toBe(false);
    expect(canOpenTransition(1, invalid)).toBe(false);
    expect(canOpenFinal(invalid)).toBe(false);
    expect(mostAdvancedAvailableStation(invalid)).toBe(1);
  });

  it("captura removeItem bloqueado al reiniciar", () => {
    const storage = new FakeStorage(canonical([1], null));
    storage.removeThrows = true;
    expect(resetProgress(storage)).toEqual({
      ok: false,
      reason: "storage_unavailable",
    });
    storage.removeThrows = false;
    expect(resetProgress(storage)).toEqual({ ok: true });
    expect(readProgress(storage).status).toBe("empty");
  });
});
