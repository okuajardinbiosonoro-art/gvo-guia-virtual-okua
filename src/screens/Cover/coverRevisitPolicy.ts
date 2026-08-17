import type { FinalCoverRevisitContext } from "../../app/review/finalReviewContext";
import { canOpenFinal } from "../../domain/progress/progress.storage";
import type {
  GvoProgress,
  ProgressReadResult,
} from "../../domain/progress/progress.types";

export function isCoverRevisitUnlocked(
  context: FinalCoverRevisitContext | null,
  progress: GvoProgress | ProgressReadResult,
): boolean {
  return context !== null && canOpenFinal(progress);
}
