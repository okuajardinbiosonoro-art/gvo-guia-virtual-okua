import type { ProgressStorage } from "../progress/progress.types";
import { createVersionedCheckpointStore } from "./checkpointStore";

export const WORLD1_CHECKPOINT_STORAGE_KEY = "gvo.station1.v1";
export const WORLD1_CHECKPOINT_SCHEMA_VERSION = 1;

export const WORLD1_CONCEPT_ORDER = [
  "intro",
  "relation",
  "perception",
  "mediation",
  "ready_to_continue",
] as const;

export type World1CheckpointConcept = (typeof WORLD1_CONCEPT_ORDER)[number];

export type World1CheckpointV1 = Readonly<{
  activeConcept: World1CheckpointConcept;
  highestReachedConcept: World1CheckpointConcept;
  schemaVersion: 1;
  updatedAt: string;
}>;

function isConcept(value: unknown): value is World1CheckpointConcept {
  return WORLD1_CONCEPT_ORDER.includes(value as World1CheckpointConcept);
}

export function world1ConceptIndex(concept: World1CheckpointConcept) {
  return WORLD1_CONCEPT_ORDER.indexOf(concept);
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return false;
  }
  return new Date(value).toISOString() === value;
}

function isWorld1Checkpoint(value: unknown): value is World1CheckpointV1 {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<World1CheckpointV1>;
  return (
    candidate.schemaVersion === WORLD1_CHECKPOINT_SCHEMA_VERSION &&
    isConcept(candidate.activeConcept) &&
    isConcept(candidate.highestReachedConcept) &&
    world1ConceptIndex(candidate.activeConcept) <=
      world1ConceptIndex(candidate.highestReachedConcept) &&
    isIsoTimestamp(candidate.updatedAt)
  );
}

function matches(left: World1CheckpointV1, right: World1CheckpointV1) {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.activeConcept === right.activeConcept &&
    left.highestReachedConcept === right.highestReachedConcept &&
    left.updatedAt === right.updatedAt
  );
}

function sameStableState(left: World1CheckpointV1, right: World1CheckpointV1) {
  return (
    left.activeConcept === right.activeConcept &&
    left.highestReachedConcept === right.highestReachedConcept
  );
}

const store = createVersionedCheckpointStore<World1CheckpointV1>({
  isCheckpoint: isWorld1Checkpoint,
  key: WORLD1_CHECKPOINT_STORAGE_KEY,
  matches,
  sameStableState,
  schemaVersion: WORLD1_CHECKPOINT_SCHEMA_VERSION,
});

export const readWorld1Checkpoint = store.read;
export const removeWorld1Checkpoint = store.remove;

export function writeWorld1Checkpoint(
  checkpoint: Readonly<{
    activeConcept: World1CheckpointConcept;
    highestReachedConcept: World1CheckpointConcept;
  }>,
  storage?: ProgressStorage | null,
  now: () => string = () => new Date().toISOString(),
) {
  return store.write(
    {
      ...checkpoint,
      schemaVersion: WORLD1_CHECKPOINT_SCHEMA_VERSION,
      updatedAt: now(),
    },
    storage,
  );
}
