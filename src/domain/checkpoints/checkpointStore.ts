import type { ProgressStorage } from "../progress/progress.types";

export type CheckpointReadStatus =
  | "empty"
  | "ok"
  | "corrupt"
  | "unknown_version"
  | "storage_unavailable";

export type CheckpointReadResult<T> =
  | Readonly<{
      checkpoint: T;
      rawPreserved: true;
      status: "ok";
    }>
  | Readonly<{
      checkpoint: null;
      rawPreserved: true;
      status: "empty" | "corrupt" | "unknown_version" | "storage_unavailable";
    }>;

export type CheckpointWriteFailureReason =
  | "corrupt"
  | "unknown_version"
  | "storage_unavailable"
  | "verification_failed";

export type CheckpointWriteResult<T> =
  | Readonly<{ checkpoint: T; ok: true }>
  | Readonly<{ ok: false; reason: CheckpointWriteFailureReason }>;

export type CheckpointRemoveResult =
  | Readonly<{ ok: true }>
  | Readonly<{
      ok: false;
      reason: "storage_unavailable" | "verification_failed";
    }>;

type VersionedCheckpoint = Readonly<{
  schemaVersion: number;
}>;

type VersionedCheckpointStoreConfig<T extends VersionedCheckpoint> = Readonly<{
  isCheckpoint: (value: unknown) => value is T;
  key: string;
  matches: (left: T, right: T) => boolean;
  sameStableState: (left: T, right: T) => boolean;
  schemaVersion: number;
}>;

function defaultStorage(): ProgressStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function readFailureReason<T>(
  result: CheckpointReadResult<T>,
): CheckpointWriteFailureReason | null {
  if (result.status === "corrupt") return "corrupt";
  if (result.status === "unknown_version") return "unknown_version";
  if (result.status === "storage_unavailable") {
    return "storage_unavailable";
  }
  return null;
}

export function createVersionedCheckpointStore<T extends VersionedCheckpoint>(
  config: VersionedCheckpointStoreConfig<T>,
) {
  function read(
    storage: ProgressStorage | null = defaultStorage(),
  ): CheckpointReadResult<T> {
    if (!storage) {
      return {
        checkpoint: null,
        rawPreserved: true,
        status: "storage_unavailable",
      };
    }

    let raw: string | null;
    try {
      raw = storage.getItem(config.key);
    } catch {
      return {
        checkpoint: null,
        rawPreserved: true,
        status: "storage_unavailable",
      };
    }

    if (raw === null) {
      return { checkpoint: null, rawPreserved: true, status: "empty" };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { checkpoint: null, rawPreserved: true, status: "corrupt" };
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { checkpoint: null, rawPreserved: true, status: "corrupt" };
    }

    if (!("schemaVersion" in parsed)) {
      return { checkpoint: null, rawPreserved: true, status: "corrupt" };
    }

    if (
      (parsed as { schemaVersion?: unknown }).schemaVersion !==
      config.schemaVersion
    ) {
      return {
        checkpoint: null,
        rawPreserved: true,
        status: "unknown_version",
      };
    }

    if (!config.isCheckpoint(parsed)) {
      return { checkpoint: null, rawPreserved: true, status: "corrupt" };
    }

    return { checkpoint: parsed, rawPreserved: true, status: "ok" };
  }

  function write(
    checkpoint: T,
    storage: ProgressStorage | null = defaultStorage(),
  ): CheckpointWriteResult<T> {
    if (!config.isCheckpoint(checkpoint)) {
      return { ok: false, reason: "verification_failed" };
    }

    const current = read(storage);
    const failureReason = readFailureReason(current);
    if (failureReason) {
      return { ok: false, reason: failureReason };
    }

    if (
      current.status === "ok" &&
      config.sameStableState(current.checkpoint, checkpoint)
    ) {
      return { checkpoint: current.checkpoint, ok: true };
    }

    if (!storage) {
      return { ok: false, reason: "storage_unavailable" };
    }

    try {
      storage.setItem(config.key, JSON.stringify(checkpoint));
    } catch {
      return { ok: false, reason: "storage_unavailable" };
    }

    const verified = read(storage);
    if (
      verified.status !== "ok" ||
      !config.matches(verified.checkpoint, checkpoint)
    ) {
      return { ok: false, reason: "verification_failed" };
    }

    return { checkpoint: verified.checkpoint, ok: true };
  }

  function remove(
    storage: ProgressStorage | null = defaultStorage(),
  ): CheckpointRemoveResult {
    if (!storage) {
      return { ok: false, reason: "storage_unavailable" };
    }

    try {
      storage.removeItem(config.key);
    } catch {
      return { ok: false, reason: "storage_unavailable" };
    }

    try {
      return storage.getItem(config.key) === null
        ? { ok: true }
        : { ok: false, reason: "verification_failed" };
    } catch {
      return { ok: false, reason: "storage_unavailable" };
    }
  }

  return { read, remove, write } as const;
}
