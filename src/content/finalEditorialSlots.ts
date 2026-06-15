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
  "FINAL_ACCESSIBLE_SCENE_01",
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

export const FINAL_BASE_SLOT_COUNT = finalEditorialSlotIds.length;
