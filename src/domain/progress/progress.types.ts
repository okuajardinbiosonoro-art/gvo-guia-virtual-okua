import type { StationId } from "../../data/stations";

export interface GvoProgressV1 {
  schemaVersion: 1;
  completedStations: StationId[];
  updatedAt: string | null;
}

export type GvoProgress = GvoProgressV1;

export type ProgressReadStatus =
  | "empty"
  | "ok"
  | "legacy"
  | "corrupt"
  | "unknown_version"
  | "storage_unavailable";

export type ProgressReadResult =
  | Readonly<{
      status: "empty" | "ok" | "legacy";
      progress: GvoProgressV1;
      rawPreserved: true;
    }>
  | Readonly<{
      status: "corrupt" | "unknown_version" | "storage_unavailable";
      progress: null;
      rawPreserved: true;
    }>;

export type ProgressWriteFailureReason =
  | "corrupt"
  | "unknown_version"
  | "storage_unavailable"
  | "verification_failed";

export type ProgressWriteResult =
  | Readonly<{
      ok: true;
      progress: GvoProgressV1;
    }>
  | Readonly<{
      ok: false;
      reason: ProgressWriteFailureReason;
    }>;

export type ProgressCompletionResult =
  | Readonly<{
      changed: boolean;
      ok: true;
      progress: GvoProgressV1;
    }>
  | Readonly<{
      ok: false;
      reason: ProgressWriteFailureReason;
    }>;

export type ProgressResetResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: "storage_unavailable" }>;

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
