import type { ProgressStorage } from "../progress/progress.types";
import { createVersionedCheckpointStore } from "./checkpointStore";

export const WORLD3_CHECKPOINT_STORAGE_KEY = "gvo.station3.v1";
export const WORLD3_CHECKPOINT_SCHEMA_VERSION = 1;

export const WORLD3_RECORD_ORDER = ["planta", "prototipo", "senal"] as const;

export type Station3RecordId = (typeof WORLD3_RECORD_ORDER)[number];

export type World3CheckpointState = Readonly<{
  completedRecordIds: readonly Station3RecordId[];
}>;

export type World3CheckpointV1 = World3CheckpointState &
  Readonly<{
    schemaVersion: 1;
    updatedAt: string;
  }>;

const checkpointKeys = [
  "completedRecordIds",
  "schemaVersion",
  "updatedAt",
] as const;

function hasExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
) {
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return (
    actual.length === sortedExpected.length &&
    actual.every((key, index) => key === sortedExpected[index])
  );
}

function isExactRecordPrefix(
  value: unknown,
): value is readonly Station3RecordId[] {
  return (
    Array.isArray(value) &&
    value.length <= WORLD3_RECORD_ORDER.length &&
    value.every((entry, index) => entry === WORLD3_RECORD_ORDER[index])
  );
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return false;
  }
  return new Date(value).toISOString() === value;
}

function isWorld3Checkpoint(value: unknown): value is World3CheckpointV1 {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (!hasExactKeys(record, checkpointKeys)) {
    return false;
  }

  const candidate = value as Partial<World3CheckpointV1>;
  return (
    candidate.schemaVersion === WORLD3_CHECKPOINT_SCHEMA_VERSION &&
    isExactRecordPrefix(candidate.completedRecordIds) &&
    isIsoTimestamp(candidate.updatedAt)
  );
}

function sameRecordIds(
  left: readonly Station3RecordId[],
  right: readonly Station3RecordId[],
) {
  return (
    left.length === right.length &&
    left.every((recordId, index) => recordId === right[index])
  );
}

function sameStableState(left: World3CheckpointV1, right: World3CheckpointV1) {
  return sameRecordIds(left.completedRecordIds, right.completedRecordIds);
}

function matches(left: World3CheckpointV1, right: World3CheckpointV1) {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.updatedAt === right.updatedAt &&
    sameStableState(left, right)
  );
}

const store = createVersionedCheckpointStore<World3CheckpointV1>({
  isCheckpoint: isWorld3Checkpoint,
  key: WORLD3_CHECKPOINT_STORAGE_KEY,
  matches,
  sameStableState,
  schemaVersion: WORLD3_CHECKPOINT_SCHEMA_VERSION,
});

export const readWorld3Checkpoint = store.read;
export const removeWorld3Checkpoint = store.remove;

export function writeWorld3Checkpoint(
  checkpoint: World3CheckpointState,
  storage?: ProgressStorage | null,
  now: () => string = () => new Date().toISOString(),
) {
  return store.write(
    {
      completedRecordIds: [...checkpoint.completedRecordIds],
      schemaVersion: WORLD3_CHECKPOINT_SCHEMA_VERSION,
      updatedAt: now(),
    },
    storage,
  );
}

export function freshWorld3CheckpointState(): World3CheckpointState {
  return { completedRecordIds: [] };
}

export function completedWorld3CheckpointState(): World3CheckpointState {
  return { completedRecordIds: [...WORLD3_RECORD_ORDER] };
}
