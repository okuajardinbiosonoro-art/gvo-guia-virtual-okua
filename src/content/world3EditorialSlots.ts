import { resolveEditorialText } from "./editorial";
import type {
  EditorialEmitter,
  EditorialLocale,
  EditorialSlotId,
  EditorialSource,
  EditorialStatus,
} from "./editorial";

export type World3EditorialSlotId =
  Extract<EditorialSlotId, (typeof world3EditorialSlotIds)[number]>;

type World3EditorialSlot = {
  emitter: EditorialEmitter;
  locale: EditorialLocale;
  notes: string;
  shortText?: string;
  source: EditorialSource;
  slotId: World3EditorialSlotId;
  status: EditorialStatus;
  text: string;
};

const world3EditorialSlotIds = [
  "W3_INTRO_LIA_01",
  "W3_INTRO_AMB_01",
  "W3_ACCESSIBLE_SCENE_01",
] as const;

function resolveWorld3Slot(slotId: World3EditorialSlotId): World3EditorialSlot {
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

export const world3EditorialSlots = Object.fromEntries(
  world3EditorialSlotIds.map((slotId) => [slotId, resolveWorld3Slot(slotId)]),
) as Record<World3EditorialSlotId, World3EditorialSlot>;

export const world3ConceptSequence = [
  "PLANTA",
  "PROTOTIPO",
  "SEÑAL",
  "AJUSTADO",
] as const;

export const WORLD3_BASE_SLOT_COUNT = 3;
