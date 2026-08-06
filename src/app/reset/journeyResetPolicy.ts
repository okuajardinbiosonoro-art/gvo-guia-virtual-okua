import { GVO_PROGRESS_STORAGE_KEY } from "../../domain/progress/progress.storage";
import { WORLD1_CHECKPOINT_STORAGE_KEY } from "../../domain/checkpoints/world1Checkpoint";
import { WORLD4_CHECKPOINT_STORAGE_KEY } from "../../domain/checkpoints/world4Checkpoint";
import { COVER_INTRO_STORAGE_KEY } from "../../screens/Cover/coverIntroState";
import { WORLD5_PROGRESS_STORAGE_KEY } from "../../screens/World5Root/world5Progress";
import { FINAL_REVIEW_CONTEXT_STORAGE_KEY } from "../review/finalReviewContext";

export type JourneyResetBackend = "localStorage" | "sessionStorage";

export type JourneyResetPolicyEntry = Readonly<{
  backend: JourneyResetBackend;
  key: string;
  purpose:
    | "cover-completion"
    | "global-progress"
    | "world-one-state"
    | "world-four-state"
    | "world-five-state"
    | "final-review-context";
}>;

export const GVO_JOURNEY_RESET_ALLOWLIST = [
  {
    backend: "localStorage",
    key: GVO_PROGRESS_STORAGE_KEY,
    purpose: "global-progress",
  },
  {
    backend: "localStorage",
    key: WORLD1_CHECKPOINT_STORAGE_KEY,
    purpose: "world-one-state",
  },
  {
    backend: "localStorage",
    key: WORLD4_CHECKPOINT_STORAGE_KEY,
    purpose: "world-four-state",
  },
  {
    backend: "localStorage",
    key: WORLD5_PROGRESS_STORAGE_KEY,
    purpose: "world-five-state",
  },
  {
    backend: "localStorage",
    key: COVER_INTRO_STORAGE_KEY,
    purpose: "cover-completion",
  },
  {
    backend: "sessionStorage",
    key: FINAL_REVIEW_CONTEXT_STORAGE_KEY,
    purpose: "final-review-context",
  },
] as const satisfies readonly JourneyResetPolicyEntry[];

export const GVO_JOURNEY_PRESERVE_POLICY = [
  "orientation and tap-hint session preferences",
  "accessibility, theme and language preferences",
  "PWA Cache Storage and service-worker data",
  "platform configuration",
  "credentials, tokens and unrelated application data",
  "developer-only layout calibrator presets",
] as const;
