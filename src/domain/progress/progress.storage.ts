import { stationIds, type StationId } from "../../data/stations";
import type {
  GvoProgress,
  ProgressCompletionResult,
  ProgressReadResult,
  ProgressResetResult,
  ProgressStorage,
  ProgressWriteFailureReason,
  ProgressWriteResult,
} from "./progress.types";

export const GVO_PROGRESS_STORAGE_KEY = "gvo.progress.v1";
export const GVO_PROGRESS_SCHEMA_VERSION = 1;

export const emptyProgress: GvoProgress = {
  schemaVersion: GVO_PROGRESS_SCHEMA_VERSION,
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

function normalizeUpdatedAt(value: unknown): string | null {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
    ? value
    : null;
}

function normalizeCompletedStations(value: unknown): StationId[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return Array.from(new Set(value.filter(isStationId))).sort((a, b) => a - b);
}

function canonicalProgress(
  completedStations: readonly StationId[],
  updatedAt: unknown,
): GvoProgress {
  return {
    schemaVersion: GVO_PROGRESS_SCHEMA_VERSION,
    completedStations: [...completedStations],
    updatedAt: normalizeUpdatedAt(updatedAt),
  };
}

export function parseProgressValue(value: unknown): ProgressReadResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { status: "corrupt", progress: null, rawPreserved: true };
  }

  const candidate = value as {
    completedStations?: unknown;
    schemaVersion?: unknown;
    updatedAt?: unknown;
  };
  const hasSchemaVersion = Object.prototype.hasOwnProperty.call(
    candidate,
    "schemaVersion",
  );

  if (
    hasSchemaVersion &&
    candidate.schemaVersion !== GVO_PROGRESS_SCHEMA_VERSION
  ) {
    return {
      status: "unknown_version",
      progress: null,
      rawPreserved: true,
    };
  }

  const completedStations = normalizeCompletedStations(
    candidate.completedStations,
  );
  if (!completedStations) {
    return { status: "corrupt", progress: null, rawPreserved: true };
  }

  return {
    status: hasSchemaVersion ? "ok" : "legacy",
    progress: canonicalProgress(completedStations, candidate.updatedAt),
    rawPreserved: true,
  };
}

export function readProgress(
  storage = getDefaultStorage(),
): ProgressReadResult {
  if (!storage) {
    return {
      status: "storage_unavailable",
      progress: null,
      rawPreserved: true,
    };
  }

  let raw: string | null;
  try {
    raw = storage.getItem(GVO_PROGRESS_STORAGE_KEY);
  } catch {
    return {
      status: "storage_unavailable",
      progress: null,
      rawPreserved: true,
    };
  }

  if (raw === null) {
    return {
      status: "empty",
      progress: { ...emptyProgress, completedStations: [] },
      rawPreserved: true,
    };
  }

  try {
    return parseProgressValue(JSON.parse(raw));
  } catch {
    return { status: "corrupt", progress: null, rawPreserved: true };
  }
}

function readFailureReason(
  result: ProgressReadResult,
): ProgressWriteFailureReason | null {
  if (result.status === "corrupt") return "corrupt";
  if (result.status === "unknown_version") return "unknown_version";
  if (result.status === "storage_unavailable") return "storage_unavailable";
  return null;
}

function progressMatches(left: GvoProgress, right: GvoProgress): boolean {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.updatedAt === right.updatedAt &&
    left.completedStations.length === right.completedStations.length &&
    left.completedStations.every(
      (stationId, index) => right.completedStations[index] === stationId,
    )
  );
}

function persistProgress(
  progress: GvoProgress,
  storage = getDefaultStorage(),
): ProgressWriteResult {
  if (!storage) {
    return { ok: false, reason: "storage_unavailable" };
  }

  const normalized = canonicalProgress(
    normalizeCompletedStations(progress.completedStations) ?? [],
    progress.updatedAt,
  );

  try {
    storage.setItem(GVO_PROGRESS_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    return { ok: false, reason: "storage_unavailable" };
  }

  const verified = readProgress(storage);
  if (
    verified.status !== "ok" ||
    !verified.progress ||
    !progressMatches(verified.progress, normalized)
  ) {
    return { ok: false, reason: "verification_failed" };
  }

  return { ok: true, progress: verified.progress };
}

export function writeProgress(
  progress: GvoProgress,
  storage = getDefaultStorage(),
): ProgressWriteResult {
  const current = readProgress(storage);
  const failureReason = readFailureReason(current);
  if (failureReason) {
    return { ok: false, reason: failureReason };
  }

  return persistProgress(progress, storage);
}

export function markStationCompleted(
  stationId: StationId,
  storage = getDefaultStorage(),
  now: () => string = () => new Date().toISOString(),
): ProgressCompletionResult {
  const current = readProgress(storage);
  const failureReason = readFailureReason(current);
  if (failureReason || !current.progress) {
    return {
      ok: false,
      reason: failureReason ?? "storage_unavailable",
    };
  }

  if (current.progress.completedStations.includes(stationId)) {
    return { ok: true, progress: current.progress, changed: false };
  }

  const completedStations = Array.from(
    new Set([...current.progress.completedStations, stationId]),
  ).sort((a, b) => a - b);

  const written = persistProgress(
    {
      schemaVersion: GVO_PROGRESS_SCHEMA_VERSION,
      completedStations,
      updatedAt: now(),
    },
    storage,
  );

  return written.ok
    ? { ok: true, progress: written.progress, changed: true }
    : written;
}

export function resetProgress(
  storage = getDefaultStorage(),
): ProgressResetResult {
  if (!storage) {
    return { ok: false, reason: "storage_unavailable" };
  }

  try {
    storage.removeItem(GVO_PROGRESS_STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false, reason: "storage_unavailable" };
  }
}

function progressFrom(
  value: GvoProgress | ProgressReadResult,
): GvoProgress | null {
  return "status" in value ? value.progress : value;
}

export function coherentProgressPrefixLength(
  value: GvoProgress | ProgressReadResult,
): number {
  const progress = progressFrom(value);
  if (!progress) return 0;

  let prefixLength = 0;
  for (const stationId of stationIds) {
    if (!progress.completedStations.includes(stationId)) break;
    prefixLength += 1;
  }
  return prefixLength;
}

export function mostAdvancedAvailableStation(
  value: GvoProgress | ProgressReadResult,
): StationId {
  const prefixLength = coherentProgressPrefixLength(value);
  return Math.min(prefixLength + 1, 5) as StationId;
}

export function canOpenStation(
  stationId: StationId,
  progress: GvoProgress | ProgressReadResult = readProgress(),
): boolean {
  if (stationId === 1) {
    return true;
  }

  return coherentProgressPrefixLength(progress) >= stationId - 1;
}

export function canOpenTransition(
  completedOriginStation: StationId,
  progress: GvoProgress | ProgressReadResult = readProgress(),
): boolean {
  return coherentProgressPrefixLength(progress) >= completedOriginStation;
}

export function canOpenFinal(
  progress: GvoProgress | ProgressReadResult = readProgress(),
): boolean {
  return coherentProgressPrefixLength(progress) === stationIds.length;
}
