import { resolveEditorialText } from "./editorial";
import type {
  EditorialEmitter,
  EditorialLocale,
  EditorialSlotId,
  EditorialSource,
  EditorialStatus,
} from "./editorial";

export type FinalEditorialSlotId =
  Extract<EditorialSlotId, (typeof finalEditorialSlotIds)[number]>;

type FinalEditorialSlot = {
  emitter: EditorialEmitter;
  locale: EditorialLocale;
  notes: string;
  shortText?: string;
  source: EditorialSource;
  slotId: FinalEditorialSlotId;
  status: EditorialStatus;
  text: string;
};

const finalEditorialSlotIds = [
  "FINAL_TITLE_01",
  "FINAL_SUBTITLE_01",
  "FINAL_LIA_MESSAGE_01",
  "FINAL_AMB_01",
  "FINAL_ACCESS_I_LABEL_01",
  "FINAL_ACCESS_I_CONFIRM_01",
  "FINAL_ACCESS_II_LABEL_01",
  "FINAL_ACCESS_II_CONFIRM_01",
  "FINAL_ACCESS_III_LABEL_01",
  "FINAL_ACCESS_III_CONFIRM_01",
  "FINAL_ACCESS_IV_LABEL_01",
  "FINAL_ACCESS_IV_CONFIRM_01",
  "FINAL_ACCESS_V_LABEL_01",
  "FINAL_ACCESS_V_CONFIRM_01",
  "FINAL_HELP_01",
  "FINAL_BACK_HOME_BTN_01",
  "FINAL_BACK_HOME_HELP_01",
  "FINAL_RESTART_BTN_01",
  "FINAL_RESTART_CONFIRM_01",
  "FINAL_RESTART_CANCEL_BTN_01",
  "FINAL_RESTART_CONFIRM_BTN_01",
  "FINAL_CREDITS_01",
  "FINAL_ACCESSIBLE_SCENE_01",
  "FINAL_ACCESSIBLE_ACCESS_I_01",
  "FINAL_ACCESSIBLE_ACCESS_II_01",
  "FINAL_ACCESSIBLE_ACCESS_III_01",
  "FINAL_ACCESSIBLE_ACCESS_IV_01",
  "FINAL_ACCESSIBLE_ACCESS_V_01",
  "FINAL_ACCESSIBLE_BACK_HOME_01",
  "FINAL_ACCESSIBLE_RESTART_01",
] as const;

function resolveFinalSlot(slotId: FinalEditorialSlotId): FinalEditorialSlot {
  const resolvedSlot = resolveEditorialText(slotId);

  return {
    emitter: resolvedSlot.emitter,
    locale: resolvedSlot.locale,
    notes: resolvedSlot.notes,
    shortText: resolvedSlot.shortText,
    slotId: resolvedSlot.slotId,
    source: resolvedSlot.source,
    status: resolvedSlot.status,
    text: resolvedSlot.text,
  };
}

export const finalEditorialSlots = Object.fromEntries(
  finalEditorialSlotIds.map((slotId) => [slotId, resolveFinalSlot(slotId)]),
) as Record<FinalEditorialSlotId, FinalEditorialSlot>;

export const FINAL_REQUIRED_SLOT_COUNT = finalEditorialSlotIds.length;

export const FINAL_BASE_SLOT_COUNT = FINAL_REQUIRED_SLOT_COUNT;
