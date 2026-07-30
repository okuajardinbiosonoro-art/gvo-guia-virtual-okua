import type { ProgressStorage } from "../../domain/progress/progress.types";
import type { Station5AreaId } from "./station5Content";

export const WORLD5_PROGRESS_STORAGE_KEY = "gvo.station5.v1";
export const WORLD5_PROGRESS_SCHEMA_VERSION = 1;
export const WORLD5_AREA_ORDER = [
  "plantas",
  "sistema",
  "espacio",
  "visitante",
] as const satisfies readonly Station5AreaId[];

export type World5Progress = {
  schemaVersion: 1;
  completedAreas: Station5AreaId[];
  updatedAt: string | null;
};

export type World5WriteResult =
  | { ok: true; progress: World5Progress; changed: boolean }
  | { ok: false; progress: World5Progress; error: "storage_unavailable" };

export const emptyWorld5Progress: World5Progress = {
  schemaVersion: WORLD5_PROGRESS_SCHEMA_VERSION,
  completedAreas: [],
  updatedAt: null,
};

function getDefaultStorage(): ProgressStorage | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
}

export function normalizeWorld5Progress(value: unknown): World5Progress {
  if (!value || typeof value !== "object") {
    return { ...emptyWorld5Progress };
  }

  const candidate = value as Partial<World5Progress>;
  const supplied = new Set(
    Array.isArray(candidate.completedAreas)
      ? candidate.completedAreas.filter(
          (area): area is Station5AreaId =>
            typeof area === "string" &&
            WORLD5_AREA_ORDER.includes(area as Station5AreaId),
        )
      : [],
  );
  const completedAreas: Station5AreaId[] = [];

  for (const area of WORLD5_AREA_ORDER) {
    if (!supplied.has(area)) {
      break;
    }
    completedAreas.push(area);
  }

  return {
    schemaVersion: WORLD5_PROGRESS_SCHEMA_VERSION,
    completedAreas,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : null,
  };
}

export function readWorld5Progress(
  storage = getDefaultStorage(),
): World5Progress {
  if (!storage) {
    return { ...emptyWorld5Progress };
  }

  try {
    const raw = storage.getItem(WORLD5_PROGRESS_STORAGE_KEY);
    return raw ? normalizeWorld5Progress(JSON.parse(raw)) : { ...emptyWorld5Progress };
  } catch {
    return { ...emptyWorld5Progress };
  }
}

export function completeWorld5Area(
  area: Station5AreaId,
  storage = getDefaultStorage(),
  now: () => string = () => new Date().toISOString(),
): World5WriteResult {
  const current = readWorld5Progress(storage);
  const expected = WORLD5_AREA_ORDER[current.completedAreas.length];

  if (current.completedAreas.includes(area)) {
    return { ok: true, progress: current, changed: false };
  }
  if (area !== expected || !storage) {
    return { ok: false, progress: current, error: "storage_unavailable" };
  }

  const next: World5Progress = {
    schemaVersion: WORLD5_PROGRESS_SCHEMA_VERSION,
    completedAreas: [...current.completedAreas, area],
    updatedAt: now(),
  };

  try {
    storage.setItem(WORLD5_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    const verified = readWorld5Progress(storage);
    if (!verified.completedAreas.includes(area)) {
      return { ok: false, progress: current, error: "storage_unavailable" };
    }
    return { ok: true, progress: verified, changed: true };
  } catch {
    return { ok: false, progress: current, error: "storage_unavailable" };
  }
}
