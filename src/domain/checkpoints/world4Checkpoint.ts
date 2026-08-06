import type { ProgressStorage } from "../progress/progress.types";
import { createVersionedCheckpointStore } from "./checkpointStore";

export const WORLD4_CHECKPOINT_STORAGE_KEY = "gvo.station4.v1";
export const WORLD4_CHECKPOINT_SCHEMA_VERSION = 1;

export type World4ResumeMode = "reading" | "chain_pending" | "completion_retry";

export type World4SettledIndex = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type World4CheckpointV1 = Readonly<{
  highestSettledIndex: World4SettledIndex;
  resumeMode: World4ResumeMode;
  schemaVersion: 1;
  updatedAt: string;
}>;

function isSettledIndex(value: unknown): value is World4SettledIndex {
  return Number.isInteger(value) && Number(value) >= -1 && Number(value) <= 7;
}

function isResumeMode(value: unknown): value is World4ResumeMode {
  return (
    value === "reading" ||
    value === "chain_pending" ||
    value === "completion_retry"
  );
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return false;
  }
  return new Date(value).toISOString() === value;
}

function isWorld4Checkpoint(value: unknown): value is World4CheckpointV1 {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<World4CheckpointV1>;
  if (
    candidate.schemaVersion !== WORLD4_CHECKPOINT_SCHEMA_VERSION ||
    !isSettledIndex(candidate.highestSettledIndex) ||
    !isResumeMode(candidate.resumeMode) ||
    !isIsoTimestamp(candidate.updatedAt)
  ) {
    return false;
  }

  return candidate.resumeMode === "reading"
    ? candidate.highestSettledIndex <= 6
    : candidate.highestSettledIndex === 7;
}

function matches(left: World4CheckpointV1, right: World4CheckpointV1) {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.highestSettledIndex === right.highestSettledIndex &&
    left.resumeMode === right.resumeMode &&
    left.updatedAt === right.updatedAt
  );
}

function sameStableState(left: World4CheckpointV1, right: World4CheckpointV1) {
  return (
    left.highestSettledIndex === right.highestSettledIndex &&
    left.resumeMode === right.resumeMode
  );
}

const store = createVersionedCheckpointStore<World4CheckpointV1>({
  isCheckpoint: isWorld4Checkpoint,
  key: WORLD4_CHECKPOINT_STORAGE_KEY,
  matches,
  sameStableState,
  schemaVersion: WORLD4_CHECKPOINT_SCHEMA_VERSION,
});

export const readWorld4Checkpoint = store.read;
export const removeWorld4Checkpoint = store.remove;

export function writeWorld4Checkpoint(
  checkpoint: Readonly<{
    highestSettledIndex: World4SettledIndex;
    resumeMode: World4ResumeMode;
  }>,
  storage?: ProgressStorage | null,
  now: () => string = () => new Date().toISOString(),
) {
  return store.write(
    {
      ...checkpoint,
      schemaVersion: WORLD4_CHECKPOINT_SCHEMA_VERSION,
      updatedAt: now(),
    },
    storage,
  );
}
