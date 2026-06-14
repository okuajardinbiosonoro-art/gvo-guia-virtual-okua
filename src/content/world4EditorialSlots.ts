import { resolveEditorialText } from "./editorial";
import type {
  EditorialEmitter,
  EditorialLocale,
  EditorialSlotId,
  EditorialSource,
  EditorialStatus,
} from "./editorial";

export type World4EditorialSlotId =
  Extract<EditorialSlotId, (typeof world4EditorialSlotIds)[number]>;

type World4EditorialSlot = {
  emitter: EditorialEmitter;
  locale: EditorialLocale;
  notes: string;
  shortText?: string;
  source: EditorialSource;
  slotId: World4EditorialSlotId;
  status: EditorialStatus;
  text: string;
};

const world4EditorialSlotIds = [
  "W4_INTRO_LIA_01",
  "W4_INTRO_SYS_01",
  "W4_ACCESSIBLE_SCENE_01",
] as const;

function resolveWorld4Slot(slotId: World4EditorialSlotId): World4EditorialSlot {
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

export const world4EditorialSlots = Object.fromEntries(
  world4EditorialSlotIds.map((slotId) => [slotId, resolveWorld4Slot(slotId)]),
) as Record<World4EditorialSlotId, World4EditorialSlot>;

export const world4TechnicalNodes = [
  "PLANTA",
  "BIONOSIFICADOR",
  "ESP32",
  "MIDI",
  "WI-FI/UDP",
  "ROUTER",
  "SISTEMA CENTRAL",
  "SONIDO",
] as const;

export const WORLD4_BASE_SLOT_COUNT = 3;
