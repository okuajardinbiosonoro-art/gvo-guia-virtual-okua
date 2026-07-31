import { resolveEditorialText } from "./editorial";
import type { EditorialSlotId } from "./editorial";

export type TransitionEditorialSlotId =
  Extract<
    EditorialSlotId,
    | "TRANS_COVER_W1_TITLE_01"
    | "TRANS_COVER_W1_SUB_01"
    | "TRANS_W1_W2_TITLE_01"
    | "TRANS_W1_W2_SUB_01"
    | "TRANS_W2_W3_TITLE_01"
    | "TRANS_W2_W3_SUB_01"
    | "TRANS_W3_W4_TITLE_01"
    | "TRANS_W3_W4_SUB_01"
    | "TRANS_W4_W5_TITLE_01"
    | "TRANS_W4_W5_SUB_01"
    | "TRANS_W5_FINAL_TITLE_01"
    | "TRANS_W5_FINAL_SUB_01"
  >;

type TransitionSlot = {
  id: TransitionEditorialSlotId;
  replacement: "editorial_matrix_pending" | null;
  status: "final" | "temporary";
  text: string;
};

function resolveTransitionSlot(
  slotId: TransitionEditorialSlotId,
): TransitionSlot {
  const resolvedSlot = resolveEditorialText(slotId);
  const isFinal = resolvedSlot.status === "FINAL";

  return {
    id: resolvedSlot.slotId,
    replacement: isFinal ? null : "editorial_matrix_pending",
    status: isFinal ? "final" : "temporary",
    text: resolvedSlot.text,
  };
}

export const transitionEditorialSlots = {
  TRANS_COVER_W1_TITLE_01: resolveTransitionSlot(
    "TRANS_COVER_W1_TITLE_01",
  ),
  TRANS_COVER_W1_SUB_01: resolveTransitionSlot("TRANS_COVER_W1_SUB_01"),
  TRANS_W1_W2_TITLE_01: resolveTransitionSlot(
    "TRANS_W1_W2_TITLE_01",
  ),
  TRANS_W1_W2_SUB_01: resolveTransitionSlot("TRANS_W1_W2_SUB_01"),
  TRANS_W2_W3_TITLE_01: resolveTransitionSlot(
    "TRANS_W2_W3_TITLE_01",
  ),
  TRANS_W2_W3_SUB_01: resolveTransitionSlot("TRANS_W2_W3_SUB_01"),
  TRANS_W3_W4_TITLE_01: resolveTransitionSlot(
    "TRANS_W3_W4_TITLE_01",
  ),
  TRANS_W3_W4_SUB_01: resolveTransitionSlot("TRANS_W3_W4_SUB_01"),
  TRANS_W4_W5_TITLE_01: resolveTransitionSlot(
    "TRANS_W4_W5_TITLE_01",
  ),
  TRANS_W4_W5_SUB_01: resolveTransitionSlot("TRANS_W4_W5_SUB_01"),
  TRANS_W5_FINAL_TITLE_01: resolveTransitionSlot(
    "TRANS_W5_FINAL_TITLE_01",
  ),
  TRANS_W5_FINAL_SUB_01: resolveTransitionSlot(
    "TRANS_W5_FINAL_SUB_01",
  ),
} as const satisfies Record<TransitionEditorialSlotId, TransitionSlot>;

export const coverToWorldOneTransitionCopy = {
  subtitle: transitionEditorialSlots.TRANS_COVER_W1_SUB_01,
  title: transitionEditorialSlots.TRANS_COVER_W1_TITLE_01,
} as const;

export const worldOneToWorldTwoTransitionCopy = {
  subtitle: transitionEditorialSlots.TRANS_W1_W2_SUB_01,
  title: transitionEditorialSlots.TRANS_W1_W2_TITLE_01,
} as const;

export const worldTwoToWorldThreeTransitionCopy = {
  subtitle: transitionEditorialSlots.TRANS_W2_W3_SUB_01,
  title: transitionEditorialSlots.TRANS_W2_W3_TITLE_01,
} as const;

export const worldThreeToWorldFourTransitionCopy = {
  subtitle: transitionEditorialSlots.TRANS_W3_W4_SUB_01,
  title: transitionEditorialSlots.TRANS_W3_W4_TITLE_01,
} as const;

export const worldFourToWorldFiveTransitionCopy = {
  subtitle: transitionEditorialSlots.TRANS_W4_W5_SUB_01,
  title: transitionEditorialSlots.TRANS_W4_W5_TITLE_01,
} as const;

export const worldFiveToFinalTransitionCopy = {
  subtitle: transitionEditorialSlots.TRANS_W5_FINAL_SUB_01,
  title: transitionEditorialSlots.TRANS_W5_FINAL_TITLE_01,
} as const;
