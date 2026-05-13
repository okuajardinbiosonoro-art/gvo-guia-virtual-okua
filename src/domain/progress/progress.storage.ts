import { stationIds, type StationId } from "../../data/stations";
import type { GvoProgress, ProgressStorage } from "./progress.types";

export const GVO_PROGRESS_STORAGE_KEY = "gvo.progress.v1";

export const emptyProgress: GvoProgress = {
  completedStations: [],
  updatedAt: null,
};

function getDefaultStorage(): ProgressStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function isStationId(value: unknown): value is StationId {
  return typeof value === "number" && stationIds.includes(value as StationId);
}

function normalizeProgress(value: unknown): GvoProgress {
  if (!value || typeof value !== "object") {
    return { ...emptyProgress };
  }

  const candidate = value as Partial<GvoProgress>;
  const completedStations = Array.isArray(candidate.completedStations)
    ? Array.from(new Set(candidate.completedStations.filter(isStationId)))
    : [];

  return {
    completedStations,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : null,
  };
}

export function readProgress(storage = getDefaultStorage()): GvoProgress {
  if (!storage) {
    return { ...emptyProgress };
  }

  const raw = storage.getItem(GVO_PROGRESS_STORAGE_KEY);
  if (!raw) {
    return { ...emptyProgress };
  }

  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return { ...emptyProgress };
  }
}

export function writeProgress(
  progress: GvoProgress,
  storage = getDefaultStorage(),
): GvoProgress {
  const normalized = normalizeProgress(progress);

  if (storage) {
    storage.setItem(GVO_PROGRESS_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function markStationCompleted(
  stationId: StationId,
  storage = getDefaultStorage(),
): GvoProgress {
  const currentProgress = readProgress(storage);
  const completedStations = Array.from(
    new Set([...currentProgress.completedStations, stationId]),
  ).sort((a, b) => a - b);

  return writeProgress(
    {
      completedStations,
      updatedAt: new Date().toISOString(),
    },
    storage,
  );
}

export function resetProgress(storage = getDefaultStorage()): GvoProgress {
  if (storage) {
    storage.removeItem(GVO_PROGRESS_STORAGE_KEY);
  }

  return { ...emptyProgress };
}

export function canOpenStation(
  stationId: StationId,
  progress = readProgress(),
): boolean {
  if (stationId === 1) {
    return true;
  }

  return progress.completedStations.includes((stationId - 1) as StationId);
}

export function canOpenFinal(progress = readProgress()): boolean {
  return progress.completedStations.includes(5);
}
