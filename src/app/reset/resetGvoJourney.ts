import type { ProgressStorage } from "../../domain/progress/progress.types";
import { beginJourneyReset, finishJourneyReset } from "../journey/journeyEssential";
import {
  GVO_JOURNEY_RESET_ALLOWLIST,
  type JourneyResetBackend,
  type JourneyResetPolicyEntry,
} from "./journeyResetPolicy";

export type JourneyResetStorageBackends = Readonly<
  Record<JourneyResetBackend, ProgressStorage | null>
>;

export type JourneyResetSnapshotEntry = Readonly<{
  backend: JourneyResetBackend;
  existed: boolean;
  key: string;
  raw: string | null;
}>;

export type JourneyResetFailureStage =
  | "snapshot"
  | "delete"
  | "verify"
  | "rollback";

export type JourneyResetResult =
  | Readonly<{
      deleted: readonly string[];
      durationMs: number;
      ok: true;
      snapshotCount: number;
      verifiedInitialState: true;
    }>
  | Readonly<{
      copySafe: boolean;
      durationMs: number;
      errorCode: string;
      failedStage: JourneyResetFailureStage;
      ok: false;
      rollbackAttempted: boolean;
      rollbackVerified: boolean;
      snapshotCount: number;
      snapshotCreated: boolean;
    }>;

export type ResetGvoJourneyDependencies = Readonly<{
  allowlist?: readonly JourneyResetPolicyEntry[];
  now?: () => number;
  storage?: JourneyResetStorageBackends;
  yieldBeforeMutation?: () => Promise<void>;
}>;

function defaultStorageBackends(): JourneyResetStorageBackends {
  if (typeof window === "undefined") {
    return { localStorage: null, sessionStorage: null };
  }

  return {
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
  };
}

function backendFor(
  entry: Pick<JourneyResetPolicyEntry, "backend">,
  storage: JourneyResetStorageBackends,
): ProgressStorage {
  const backend = storage[entry.backend];
  if (!backend) {
    throw new Error(`storage_unavailable:${entry.backend}`);
  }
  return backend;
}

export function createJourneyResetSnapshot(
  allowlist: readonly JourneyResetPolicyEntry[],
  storage: JourneyResetStorageBackends,
): readonly JourneyResetSnapshotEntry[] {
  const snapshot = allowlist.map((entry) => {
    const backend = backendFor(entry, storage);
    const raw = backend.getItem(entry.key);

    return {
      backend: entry.backend,
      existed: raw !== null,
      key: entry.key,
      raw,
    } as const;
  });

  for (const entry of snapshot) {
    const raw = backendFor(entry, storage).getItem(entry.key);
    if (raw !== entry.raw) {
      throw new Error(`snapshot_not_stable:${entry.backend}:${entry.key}`);
    }
  }

  return snapshot;
}

export function verifyInitialJourneyState(
  allowlist: readonly JourneyResetPolicyEntry[],
  storage: JourneyResetStorageBackends,
): boolean {
  return allowlist.every(
    (entry) => backendFor(entry, storage).getItem(entry.key) === null,
  );
}

export function restoreJourneyResetSnapshot(
  snapshot: readonly JourneyResetSnapshotEntry[],
  storage: JourneyResetStorageBackends,
  expectedCurrent?: ReadonlyMap<string, string | null>,
): boolean {
  let restoreSucceeded = true;

  for (const entry of snapshot) {
    try {
      const backend = backendFor(entry, storage);
      if (expectedCurrent) {
        const identity = `${entry.backend}:${entry.key}`;
        // During reset, only restore a value whose verified deletion belongs to
        // this attempt. A different current raw belongs to another writer.
        if (!expectedCurrent.has(identity)) continue;
        const current = backend.getItem(entry.key);
        if (current === entry.raw) continue;
        if (current !== expectedCurrent.get(identity)) {
          restoreSucceeded = false;
          continue;
        }
      }
      if (entry.existed && entry.raw !== null) {
        backend.setItem(entry.key, entry.raw);
      } else {
        backend.removeItem(entry.key);
      }
    } catch {
      restoreSucceeded = false;
    }
  }

  let verificationSucceeded = true;
  for (const entry of snapshot) {
    try {
      const current = backendFor(entry, storage).getItem(entry.key);
      if (current !== entry.raw) {
        verificationSucceeded = false;
      }
    } catch {
      verificationSucceeded = false;
    }
  }

  return restoreSucceeded && verificationSucceeded;
}

function failureResult(
  startedAt: number,
  now: () => number,
  failedStage: JourneyResetFailureStage,
  errorCode: string,
  snapshot: readonly JourneyResetSnapshotEntry[] | null,
  rollbackAttempted: boolean,
  rollbackVerified: boolean,
  conflictDetected = false,
): JourneyResetResult {
  const snapshotCreated = snapshot !== null;

  return {
    copySafe: snapshotCreated && rollbackAttempted && rollbackVerified && !conflictDetected,
    durationMs: Math.max(0, now() - startedAt),
    errorCode,
    failedStage,
    ok: false,
    rollbackAttempted,
    rollbackVerified,
    snapshotCount: snapshot?.length ?? 0,
    snapshotCreated,
  };
}

export async function resetGvoJourney(
  dependencies: ResetGvoJourneyDependencies = {},
): Promise<JourneyResetResult> {
  // Close current writers and invalidate their captured attempts before any
  // storage getter, snapshot or asynchronous yield can run.
  const resetToken = beginJourneyReset();
  try {
    const allowlist = dependencies.allowlist ?? GVO_JOURNEY_RESET_ALLOWLIST;
    const now = dependencies.now ?? Date.now;
    const yieldBeforeMutation =
      dependencies.yieldBeforeMutation ?? (() => Promise.resolve());
    const startedAt = now();
    let storage: JourneyResetStorageBackends;
    let snapshot: readonly JourneyResetSnapshotEntry[];
    let failedStage: JourneyResetFailureStage = "snapshot";
    const deletedByThisReset = new Map<string, string | null>();
    let conflictDetected = false;

    try {
      storage = dependencies.storage ?? defaultStorageBackends();
      snapshot = createJourneyResetSnapshot(allowlist, storage);
    } catch {
      return failureResult(startedAt, now, "snapshot", "snapshot_failed", null, false, false);
    }

    try {
      await yieldBeforeMutation();
      // A stable copy before the yield is insufficient: external storage may
      // have changed while our own writers were suspended.
      for (const entry of snapshot) {
        if (backendFor(entry, storage).getItem(entry.key) !== entry.raw) {
          conflictDetected = true;
          throw new Error("snapshot_changed");
        }
      }
      failedStage = "delete";
      for (const entry of snapshot) {
        const backend = backendFor(entry, storage);
        if (backend.getItem(entry.key) !== entry.raw) {
          conflictDetected = true;
          throw new Error("snapshot_changed");
        }
        if (!entry.existed) continue;
        try {
          backend.removeItem(entry.key);
          const afterDelete = backend.getItem(entry.key);
          if (afterDelete === null) deletedByThisReset.set(`${entry.backend}:${entry.key}`, null);
          else if (afterDelete !== entry.raw) {
            conflictDetected = true;
            throw new Error("delete_conflict");
          }
        } catch (error) {
          // A storage wrapper may perform the deletion and then throw. Only
          // an observed absence authorizes this attempt to restore that raw.
          try {
            if (backend.getItem(entry.key) === null) {
              deletedByThisReset.set(`${entry.backend}:${entry.key}`, null);
            }
          } catch { /* No proof of deletion: do not claim ownership. */ }
          throw error;
        }
      }

      failedStage = "verify";
      if (!verifyInitialJourneyState(allowlist, storage)) throw new Error("initial_state_not_verified");
      return {
        deleted: allowlist.map((entry) => `${entry.backend}:${entry.key}`),
        durationMs: Math.max(0, now() - startedAt),
        ok: true,
        snapshotCount: snapshot.length,
        verifiedInitialState: true,
      };
    } catch {
      const rollbackAttempted = deletedByThisReset.size > 0;
      const rollbackVerified = restoreJourneyResetSnapshot(snapshot, storage, deletedByThisReset);
      return failureResult(
        startedAt, now,
        rollbackVerified || !rollbackAttempted ? failedStage : "rollback",
        conflictDetected ? "reset_conflict" : rollbackVerified ? `${failedStage}_failed` : "rollback_failed",
        snapshot, rollbackAttempted, rollbackVerified, conflictDetected,
      );
    }
  } finally {
    // Both success and every failure leave stale callbacks suspended. The
    // controller may authorize a fresh attempt after this reconciliation.
    finishJourneyReset(resetToken);
  }
}
