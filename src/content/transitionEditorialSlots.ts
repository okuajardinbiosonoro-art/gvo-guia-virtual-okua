export type TransitionEditorialSlotId =
  | "TRANS_W1_W2_TITLE_01"
  | "TRANS_W1_W2_SUB_01";

type TemporaryTransitionSlot = {
  id: TransitionEditorialSlotId;
  replacement: "editorial_matrix_pending";
  status: "temporary";
  text: string;
};

export const temporaryTransitionEditorialSlots = {
  TRANS_W1_W2_TITLE_01: {
    id: "TRANS_W1_W2_TITLE_01",
    replacement: "editorial_matrix_pending",
    status: "temporary",
    text: "Abriendo Mundo II",
  },
  TRANS_W1_W2_SUB_01: {
    id: "TRANS_W1_W2_SUB_01",
    replacement: "editorial_matrix_pending",
    status: "temporary",
    text: "Preparando el pulso invisible.",
  },
} as const satisfies Record<TransitionEditorialSlotId, TemporaryTransitionSlot>;

export const worldOneToWorldTwoTransitionCopy = {
  subtitle: temporaryTransitionEditorialSlots.TRANS_W1_W2_SUB_01,
  title: temporaryTransitionEditorialSlots.TRANS_W1_W2_TITLE_01,
} as const;
