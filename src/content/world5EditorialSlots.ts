import { resolveEditorialText } from "./editorial";
import type {
  EditorialEmitter,
  EditorialLocale,
  EditorialSlotId,
  EditorialSource,
  EditorialStatus,
} from "./editorial";

export type World5EditorialSlotId =
  Extract<EditorialSlotId, (typeof world5EditorialSlotIds)[number]>;

type World5EditorialSlot = {
  emitter: EditorialEmitter;
  locale: EditorialLocale;
  notes: string;
  shortText?: string;
  source: EditorialSource;
  slotId: World5EditorialSlotId;
  status: EditorialStatus;
  text: string;
};

const world5EditorialSlotIds = [
  "W5_INTRO_LIA_01",
  "W5_INTRO_AMB_01",
  "W5_ACCESSIBLE_SCENE_01",
] as const;

function resolveWorld5Slot(slotId: World5EditorialSlotId): World5EditorialSlot {
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

export const world5EditorialSlots = Object.fromEntries(
  world5EditorialSlotIds.map((slotId) => [slotId, resolveWorld5Slot(slotId)]),
) as Record<World5EditorialSlotId, World5EditorialSlot>;

export const world5ConceptAreas = [
  "PLANTAS",
  "SISTEMA",
  "ESPACIO",
  "VISITANTE",
] as const;

export const WORLD5_BASE_SLOT_COUNT = 3;
