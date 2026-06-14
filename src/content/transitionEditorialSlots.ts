import { resolveEditorialText } from "./editorial";
import type { EditorialSlotId } from "./editorial";

export type TransitionEditorialSlotId =
  Extract<EditorialSlotId, "TRANS_W1_W2_TITLE_01" | "TRANS_W1_W2_SUB_01">;

type TemporaryTransitionSlot = {
  id: TransitionEditorialSlotId;
  replacement: "editorial_matrix_pending";
  status: "temporary";
  text: string;
};

function resolveTemporaryTransitionSlot(
  slotId: TransitionEditorialSlotId,
): TemporaryTransitionSlot {
  const resolvedSlot = resolveEditorialText(slotId);

  return {
    id: resolvedSlot.slotId,
    replacement: "editorial_matrix_pending",
    status: "temporary",
    text: resolvedSlot.text,
  };
}

export const temporaryTransitionEditorialSlots = {
  TRANS_W1_W2_TITLE_01: resolveTemporaryTransitionSlot(
    "TRANS_W1_W2_TITLE_01",
  ),
  TRANS_W1_W2_SUB_01: resolveTemporaryTransitionSlot("TRANS_W1_W2_SUB_01"),
} as const satisfies Record<TransitionEditorialSlotId, TemporaryTransitionSlot>;

export const worldOneToWorldTwoTransitionCopy = {
  subtitle: temporaryTransitionEditorialSlots.TRANS_W1_W2_SUB_01,
  title: temporaryTransitionEditorialSlots.TRANS_W1_W2_TITLE_01,
} as const;
