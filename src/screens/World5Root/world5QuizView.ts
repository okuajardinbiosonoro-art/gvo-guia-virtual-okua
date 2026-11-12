import type { Station5AreaId } from "./station5Content";
import { WORLD5_QUIZ_AREA_ORDER, type World5RoundsRead } from "./world5Quiz";

export type World5QuizView = Station5AreaId | "resultado";

/** The local round cursor never rewinds or substitutes the essential journey. */
export function resolveWorld5QuizView({ pathname, read, readOnly, pendingStepId, canUseStep }: {
  pathname: string;
  read: World5RoundsRead;
  readOnly: boolean;
  pendingStepId: string | null;
  canUseStep: (id: string) => boolean;
}): World5QuizView {
  const requested = pathname.split("/")[3];
  const requestedIndex = WORLD5_QUIZ_AREA_ORDER.indexOf(requested as Station5AreaId);
  const pendingIndex = WORLD5_QUIZ_AREA_ORDER.indexOf(pendingStepId as Station5AreaId);
  if (readOnly) {
    if (requestedIndex >= 0 && canUseStep(requested)) return requested as Station5AreaId;
    if (pendingIndex >= 0) return WORLD5_QUIZ_AREA_ORDER[pendingIndex];
    return "resultado";
  }
  const unresolved = WORLD5_QUIZ_AREA_ORDER.findIndex((id) => !read.round?.outcomes[id]);
  const roundCursor = unresolved < 0 ? 3 : unresolved;
  // In a live round the saved cursor wins over older or future URLs.
  // A durable finish alone cannot jump past a failed essential confirmation.
  if (read.complete && canUseStep("resultado")) return "resultado";
  const cursor = pendingIndex >= 0 ? Math.min(roundCursor, pendingIndex) : roundCursor;
  return WORLD5_QUIZ_AREA_ORDER[cursor];
}
