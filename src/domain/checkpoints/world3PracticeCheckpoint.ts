import type { ProgressStorage } from "../progress/progress.types";
import { createVersionedCheckpointStore } from "./checkpointStore";
import { WORLD3_RECORD_ORDER, type Station3RecordId } from "./world3Checkpoint";

// The old notebook recorded prototype research, never a visitor's practice.
// Keep gvo.station3.v1 intact. Global journey progress also stays intact.
export const WORLD3_PRACTICE_STORAGE_KEY = "gvo.station3.practice.v2";
export type PracticeStatus =
  | "not_started"
  | "started"
  | "declared_done"
  | "skipped";
export type World3PracticeState = Readonly<{
  visitedPages: readonly Station3RecordId[];
  reviewedPages: readonly Station3RecordId[];
  skippedPages: readonly Station3RecordId[];
  practiceStatus: PracticeStatus;
  activityContinued: boolean;
}>;
export type World3PracticeCheckpoint = World3PracticeState &
  Readonly<{
    schemaVersion: 2;
    updatedAt: string;
  }>;

export function freshWorld3PracticeState(): World3PracticeState {
  return {
    visitedPages: [],
    reviewedPages: [],
    skippedPages: [],
    practiceStatus: "not_started",
    activityContinued: false,
  };
}

function isIds(value: unknown): value is readonly Station3RecordId[] {
  return (
    Array.isArray(value) &&
    new Set(value).size === value.length &&
    value.every((id) => WORLD3_RECORD_ORDER.includes(id))
  );
}
function valid(value: unknown): value is World3PracticeCheckpoint {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const c = value as World3PracticeCheckpoint;
  return (
    Object.keys(c).sort().join() ===
      [
        "visitedPages",
        "reviewedPages",
        "skippedPages",
        "practiceStatus",
        "activityContinued",
        "schemaVersion",
        "updatedAt",
      ]
        .sort()
        .join() &&
    c.schemaVersion === 2 &&
    isIds(c.visitedPages) &&
    isIds(c.reviewedPages) &&
    isIds(c.skippedPages) &&
    c.reviewedPages.every(
      (id) => c.visitedPages.includes(id) && !c.skippedPages.includes(id),
    ) &&
    ["not_started", "started", "declared_done", "skipped"].includes(
      c.practiceStatus,
    ) &&
    typeof c.activityContinued === "boolean" &&
    typeof c.updatedAt === "string" &&
    !Number.isNaN(Date.parse(c.updatedAt))
  );
}
function sameState(a: World3PracticeState, b: World3PracticeState) {
  return (
    a.practiceStatus === b.practiceStatus &&
    a.activityContinued === b.activityContinued &&
    ["visitedPages", "reviewedPages", "skippedPages"].every((key) => {
      const k = key as "visitedPages" | "reviewedPages" | "skippedPages";
      return a[k].join() === b[k].join();
    })
  );
}
const store = createVersionedCheckpointStore<World3PracticeCheckpoint>({
  key: WORLD3_PRACTICE_STORAGE_KEY,
  schemaVersion: 2,
  isCheckpoint: valid,
  sameStableState: sameState,
  matches: (a, b) => sameState(a, b) && a.updatedAt === b.updatedAt,
});
export const readWorld3PracticeCheckpoint = store.read;
export const removeWorld3PracticeCheckpoint = store.remove;
export function writeWorld3PracticeCheckpoint(
  state: World3PracticeState,
  storage?: ProgressStorage | null,
) {
  return store.write(
    { ...state, schemaVersion: 2, updatedAt: new Date().toISOString() },
    storage,
  );
}
