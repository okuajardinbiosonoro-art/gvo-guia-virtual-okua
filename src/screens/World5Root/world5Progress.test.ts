import { describe, expect, it, vi } from "vitest";

import type { ProgressStorage } from "../../domain/progress/progress.types";
import {
  WORLD5_PROGRESS_STORAGE_KEY,
  completeWorld5Area,
  normalizeWorld5Progress,
  readWorld5Progress,
} from "./world5Progress";

function memoryStorage(): ProgressStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("world5Progress", () => {
  it("normaliza desconocidos, duplicados y saltos al prefijo canónico", () => {
    expect(
      normalizeWorld5Progress({
        completedAreas: ["plantas", "plantas", "visitante", "otro"],
        updatedAt: 9,
      }),
    ).toEqual({
      schemaVersion: 1,
      completedAreas: ["plantas"],
      updatedAt: null,
    });
    expect(
      normalizeWorld5Progress({ completedAreas: ["sistema"] }).completedAreas,
    ).toEqual([]);
  });

  it("la primera acción completa solo Plantas y la repetición es idempotente", () => {
    const storage = memoryStorage();
    const first = completeWorld5Area(
      "plantas",
      storage,
      () => "2026-07-29T12:00:00.000Z",
    );
    const second = completeWorld5Area("plantas", storage, () => "later");
    expect(first).toMatchObject({ ok: true, changed: true });
    expect(second).toMatchObject({ ok: true, changed: false });
    expect(readWorld5Progress(storage)).toEqual({
      schemaVersion: 1,
      completedAreas: ["plantas"],
      updatedAt: "2026-07-29T12:00:00.000Z",
    });
  });

  it("rechaza completar Sistema fuera de orden", () => {
    const storage = memoryStorage();
    expect(completeWorld5Area("sistema", storage)).toMatchObject({ ok: false });
    expect(storage.getItem(WORLD5_PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("persiste Plantas y Sistema como prefijo canónico y verifica la lectura", () => {
    const storage = memoryStorage();
    completeWorld5Area("plantas", storage, () => "2026-07-30T12:00:00.000Z");
    const result = completeWorld5Area(
      "sistema",
      storage,
      () => "2026-07-30T12:01:00.000Z",
    );
    expect(result).toMatchObject({ ok: true, changed: true });
    expect(readWorld5Progress(storage)).toEqual({
      schemaVersion: 1,
      completedAreas: ["plantas", "sistema"],
      updatedAt: "2026-07-30T12:01:00.000Z",
    });
  });

  it("persiste Espacio y Visitante en orden exacto e ignora repeticiones", () => {
    const storage = memoryStorage();
    completeWorld5Area("plantas", storage, () => "2026-07-30T12:00:00.000Z");
    completeWorld5Area("sistema", storage, () => "2026-07-30T12:01:00.000Z");
    const space = completeWorld5Area(
      "espacio",
      storage,
      () => "2026-07-30T12:02:00.000Z",
    );
    const visitor = completeWorld5Area(
      "visitante",
      storage,
      () => "2026-07-30T12:03:00.000Z",
    );
    const repeated = completeWorld5Area("visitante", storage, () => "later");

    expect(space).toMatchObject({ ok: true, changed: true });
    expect(visitor).toMatchObject({ ok: true, changed: true });
    expect(repeated).toMatchObject({ ok: true, changed: false });
    expect(readWorld5Progress(storage)).toEqual({
      schemaVersion: 1,
      completedAreas: ["plantas", "sistema", "espacio", "visitante"],
      updatedAt: "2026-07-30T12:03:00.000Z",
    });
  });

  it("reporta fallo de escritura y no simula progreso", () => {
    const storage: ProgressStorage = {
      getItem: () => null,
      setItem: vi.fn(() => {
        throw new Error("quota");
      }),
      removeItem: vi.fn(),
    };
    expect(completeWorld5Area("plantas", storage)).toMatchObject({
      ok: false,
      error: "storage_unavailable",
    });
    expect(readWorld5Progress(storage).completedAreas).toEqual([]);
  });
});
