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
  "W3_PLANTA_HINT_01",
  "W3_PLANTA_NOTE_01",
  "W3_PLANTA_CONFIRM_01",
  "W3_ACCESSIBLE_SCENE_01",
  "W3_ACCESSIBLE_PLANTA_01",
  "W3_PROTOTIPO_HINT_01",
  "W3_PROTOTIPO_NOTE_01",
  "W3_PROTOTIPO_CONFIRM_01",
  "W3_ACCESSIBLE_PROTOTIPO_01",
  "W3_SENAL_HINT_01",
  "W3_SENAL_NOTE_01",
  "W3_SENAL_CONFIRM_01",
  "W3_ACCESSIBLE_SENAL_01",
  "W3_AJUSTADO_HINT_01",
  "W3_AJUSTADO_AMB_01",
  "W3_AJUSTADO_CONFIRM_01",
  "W3_ACCESSIBLE_AJUSTADO_01",
  "W3_BLOCK_LOCKED_01",
  "W3_BLOCK_REPEAT_01",
  "W3_COMPLETE_LIA_01",
  "W3_CONTINUE_BTN_01",
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

export type World3BlockId = "planta" | "prototipo" | "senal" | "ajustado";

export type World3BlockDefinition = {
  accessibleSlot: World3EditorialSlotId;
  confirmSlot: World3EditorialSlotId;
  hintSlot: World3EditorialSlotId;
  id: World3BlockId;
  label: (typeof world3ConceptSequence)[number];
  noteSlot: World3EditorialSlotId;
  order: number;
};

export const world3BlockDefinitions = [
  {
    accessibleSlot: "W3_ACCESSIBLE_PLANTA_01",
    confirmSlot: "W3_PLANTA_CONFIRM_01",
    hintSlot: "W3_PLANTA_HINT_01",
    id: "planta",
    label: "PLANTA",
    noteSlot: "W3_PLANTA_NOTE_01",
    order: 1,
  },
  {
    accessibleSlot: "W3_ACCESSIBLE_PROTOTIPO_01",
    confirmSlot: "W3_PROTOTIPO_CONFIRM_01",
    hintSlot: "W3_PROTOTIPO_HINT_01",
    id: "prototipo",
    label: "PROTOTIPO",
    noteSlot: "W3_PROTOTIPO_NOTE_01",
    order: 2,
  },
  {
    accessibleSlot: "W3_ACCESSIBLE_SENAL_01",
    confirmSlot: "W3_SENAL_CONFIRM_01",
    hintSlot: "W3_SENAL_HINT_01",
    id: "senal",
    label: "SEÑAL",
    noteSlot: "W3_SENAL_NOTE_01",
    order: 3,
  },
  {
    accessibleSlot: "W3_ACCESSIBLE_AJUSTADO_01",
    confirmSlot: "W3_AJUSTADO_CONFIRM_01",
    hintSlot: "W3_AJUSTADO_HINT_01",
    id: "ajustado",
    label: "AJUSTADO",
    noteSlot: "W3_AJUSTADO_AMB_01",
    order: 4,
  },
] as const satisfies ReadonlyArray<World3BlockDefinition>;

export const WORLD3_REQUIRED_SLOT_COUNT = 23;
