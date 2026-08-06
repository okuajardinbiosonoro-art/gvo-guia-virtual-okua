import type { World2LayerId } from "../../content/world2EditorialSlots";
import type { ProgressStorage } from "../progress/progress.types";
import { createVersionedCheckpointStore } from "./checkpointStore";

export const WORLD2_CHECKPOINT_STORAGE_KEY = "gvo.station2.v1";
export const WORLD2_CHECKPOINT_SCHEMA_VERSION = 1;

export const WORLD2_LAYER_ORDER = [
  "planta_viva",
  "senal",
  "captura",
  "acondicionamiento",
  "mapeo",
  "resultado_mediado",
] as const satisfies readonly World2LayerId[];

export const WORLD2_REQUIRED_INTERACTION_ORDER = [
  "plant_contact_readout_seen",
  "signal_measured_wave_seen",
  "capture_data_readout_seen",
] as const;

export const WORLD2_CAPTURE_TIMELINE_STEP_ORDER = [
  "contact",
  "signal",
  "system",
] as const;

export type RequiredInteractionId =
  (typeof WORLD2_REQUIRED_INTERACTION_ORDER)[number];

export type CaptureTimelineStepId =
  (typeof WORLD2_CAPTURE_TIMELINE_STEP_ORDER)[number];

export type World2ResultState =
  | "not_started"
  | "convergence_pending"
  | "ready_to_continue";

export type World2CheckpointState = Readonly<{
  activeLayerId: World2LayerId;
  visitedLayerIds: readonly World2LayerId[];
  highestUnlockedLayerOrder: 1 | 2 | 3 | 4 | 5 | 6;
  completedRequiredInteractions: readonly RequiredInteractionId[];
  capture: Readonly<{
    currentStepId: CaptureTimelineStepId;
    visitedStepIds: readonly CaptureTimelineStepId[];
  }>;
  mappingFirstRunComplete: boolean;
  resultState: World2ResultState;
}>;

export type World2CheckpointV1 = World2CheckpointState &
  Readonly<{
    schemaVersion: 1;
    updatedAt: string;
  }>;

const checkpointKeys = [
  "activeLayerId",
  "capture",
  "completedRequiredInteractions",
  "highestUnlockedLayerOrder",
  "mappingFirstRunComplete",
  "resultState",
  "schemaVersion",
  "updatedAt",
  "visitedLayerIds",
] as const;

const captureKeys = ["currentStepId", "visitedStepIds"] as const;

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

function isExactPrefix<T>(
  value: unknown,
  canonicalOrder: readonly T[],
  minimumLength: number,
): value is T[] {
  return (
    Array.isArray(value) &&
    value.length >= minimumLength &&
    value.length <= canonicalOrder.length &&
    value.every((entry, index) => entry === canonicalOrder[index])
  );
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return false;
  }
  return new Date(value).toISOString() === value;
}

function isWorld2LayerId(value: unknown): value is World2LayerId {
  return WORLD2_LAYER_ORDER.includes(value as World2LayerId);
}

function isResultState(value: unknown): value is World2ResultState {
  return (
    value === "not_started" ||
    value === "convergence_pending" ||
    value === "ready_to_continue"
  );
}

function isWorld2Checkpoint(value: unknown): value is World2CheckpointV1 {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (!hasExactKeys(record, checkpointKeys)) {
    return false;
  }

  const candidate = value as Partial<World2CheckpointV1>;
  if (
    candidate.schemaVersion !== WORLD2_CHECKPOINT_SCHEMA_VERSION ||
    !isWorld2LayerId(candidate.activeLayerId) ||
    !isExactPrefix(candidate.visitedLayerIds, WORLD2_LAYER_ORDER, 1) ||
    !Number.isInteger(candidate.highestUnlockedLayerOrder) ||
    !isExactPrefix(
      candidate.completedRequiredInteractions,
      WORLD2_REQUIRED_INTERACTION_ORDER,
      0,
    ) ||
    typeof candidate.mappingFirstRunComplete !== "boolean" ||
    !isResultState(candidate.resultState) ||
    !isIsoTimestamp(candidate.updatedAt)
  ) {
    return false;
  }

  const expectedHighest = Math.min(candidate.visitedLayerIds.length + 1, 6);
  if (
    candidate.highestUnlockedLayerOrder !== expectedHighest ||
    !candidate.visitedLayerIds.includes(candidate.activeLayerId)
  ) {
    return false;
  }

  if (
    !candidate.capture ||
    typeof candidate.capture !== "object" ||
    Array.isArray(candidate.capture)
  ) {
    return false;
  }
  const captureRecord = candidate.capture as unknown as Record<
    string,
    unknown
  >;
  if (
    !hasExactKeys(captureRecord, captureKeys) ||
    !isExactPrefix(
      candidate.capture.visitedStepIds,
      WORLD2_CAPTURE_TIMELINE_STEP_ORDER,
      1,
    ) ||
    !WORLD2_CAPTURE_TIMELINE_STEP_ORDER.includes(
      candidate.capture.currentStepId as CaptureTimelineStepId,
    ) ||
    !candidate.capture.visitedStepIds.includes(candidate.capture.currentStepId)
  ) {
    return false;
  }

  const visited = new Set(candidate.visitedLayerIds);
  const interactions = new Set(candidate.completedRequiredInteractions);
  const captureComplete =
    candidate.capture.visitedStepIds.length ===
    WORLD2_CAPTURE_TIMELINE_STEP_ORDER.length;
  const interactionCaptureComplete = interactions.has(
    "capture_data_readout_seen",
  );

  if (
    (interactions.has("signal_measured_wave_seen") &&
      (!interactions.has("plant_contact_readout_seen") ||
        !visited.has("senal"))) ||
    (interactionCaptureComplete &&
      (!interactions.has("plant_contact_readout_seen") ||
        !interactions.has("signal_measured_wave_seen") ||
        !visited.has("captura") ||
        !captureComplete)) ||
    captureComplete !== interactionCaptureComplete
  ) {
    return false;
  }

  if (
    (visited.has("senal") &&
      !interactions.has("plant_contact_readout_seen")) ||
    (visited.has("captura") &&
      !interactions.has("signal_measured_wave_seen")) ||
    (visited.has("acondicionamiento") && !interactionCaptureComplete)
  ) {
    return false;
  }

  if (
    candidate.mappingFirstRunComplete &&
    (!visited.has("mapeo") ||
      candidate.completedRequiredInteractions.length !==
        WORLD2_REQUIRED_INTERACTION_ORDER.length)
  ) {
    return false;
  }

  if (candidate.resultState === "not_started") {
    return !visited.has("resultado_mediado");
  }

  if (
    !visited.has("resultado_mediado") ||
    !candidate.mappingFirstRunComplete
  ) {
    return false;
  }

  return candidate.resultState === "convergence_pending"
    ? true
    : candidate.visitedLayerIds.length === WORLD2_LAYER_ORDER.length &&
        candidate.completedRequiredInteractions.length ===
          WORLD2_REQUIRED_INTERACTION_ORDER.length &&
        captureComplete;
}

function sameArray<T>(left: readonly T[], right: readonly T[]) {
  return (
    left.length === right.length &&
    left.every((entry, index) => entry === right[index])
  );
}

function sameStableState(
  left: World2CheckpointV1,
  right: World2CheckpointV1,
) {
  return (
    left.activeLayerId === right.activeLayerId &&
    sameArray(left.visitedLayerIds, right.visitedLayerIds) &&
    left.highestUnlockedLayerOrder === right.highestUnlockedLayerOrder &&
    sameArray(
      left.completedRequiredInteractions,
      right.completedRequiredInteractions,
    ) &&
    left.capture.currentStepId === right.capture.currentStepId &&
    sameArray(left.capture.visitedStepIds, right.capture.visitedStepIds) &&
    left.mappingFirstRunComplete === right.mappingFirstRunComplete &&
    left.resultState === right.resultState
  );
}

function matches(left: World2CheckpointV1, right: World2CheckpointV1) {
  return (
    left.schemaVersion === right.schemaVersion &&
    left.updatedAt === right.updatedAt &&
    sameStableState(left, right)
  );
}

const store = createVersionedCheckpointStore<World2CheckpointV1>({
  isCheckpoint: isWorld2Checkpoint,
  key: WORLD2_CHECKPOINT_STORAGE_KEY,
  matches,
  sameStableState,
  schemaVersion: WORLD2_CHECKPOINT_SCHEMA_VERSION,
});

export const readWorld2Checkpoint = store.read;
export const removeWorld2Checkpoint = store.remove;

export function writeWorld2Checkpoint(
  checkpoint: World2CheckpointState,
  storage?: ProgressStorage | null,
  now: () => string = () => new Date().toISOString(),
) {
  return store.write(
    {
      ...checkpoint,
      capture: {
        currentStepId: checkpoint.capture.currentStepId,
        visitedStepIds: [...checkpoint.capture.visitedStepIds],
      },
      completedRequiredInteractions: [
        ...checkpoint.completedRequiredInteractions,
      ],
      schemaVersion: WORLD2_CHECKPOINT_SCHEMA_VERSION,
      updatedAt: now(),
      visitedLayerIds: [...checkpoint.visitedLayerIds],
    },
    storage,
  );
}

export function freshWorld2CheckpointState(): World2CheckpointState {
  return {
    activeLayerId: "planta_viva",
    visitedLayerIds: ["planta_viva"],
    highestUnlockedLayerOrder: 2,
    completedRequiredInteractions: [],
    capture: {
      currentStepId: "contact",
      visitedStepIds: ["contact"],
    },
    mappingFirstRunComplete: false,
    resultState: "not_started",
  };
}

export function completedWorld2CheckpointState(
  activeLayerId: World2LayerId = "resultado_mediado",
): World2CheckpointState {
  return {
    activeLayerId,
    visitedLayerIds: [...WORLD2_LAYER_ORDER],
    highestUnlockedLayerOrder: 6,
    completedRequiredInteractions: [...WORLD2_REQUIRED_INTERACTION_ORDER],
    capture: {
      currentStepId: "system",
      visitedStepIds: [...WORLD2_CAPTURE_TIMELINE_STEP_ORDER],
    },
    mappingFirstRunComplete: true,
    resultState: "ready_to_continue",
  };
}
