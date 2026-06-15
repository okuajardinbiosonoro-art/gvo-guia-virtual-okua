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

export type World5AreaId = "plantas" | "sistema" | "espacio" | "visitante";

export type World5AreaDefinition = {
  accessibleSlot: World5EditorialSlotId;
  ambientSlot: World5EditorialSlotId;
  confirmSlot: World5EditorialSlotId;
  hintSlot: World5EditorialSlotId;
  id: World5AreaId;
  label: (typeof world5ConceptAreas)[number];
  order: number;
};

const world5EditorialSlotIds = [
  "W5_INTRO_LIA_01",
  "W5_INTRO_AMB_01",
  "W5_ACCESSIBLE_SCENE_01",
  "W5_PLANTAS_HINT_01",
  "W5_PLANTAS_AMB_01",
  "W5_PLANTAS_CONFIRM_01",
  "W5_ACCESSIBLE_PLANTAS_01",
  "W5_SISTEMA_HINT_01",
  "W5_SISTEMA_AMB_01",
  "W5_SISTEMA_CONFIRM_01",
  "W5_ACCESSIBLE_SISTEMA_01",
  "W5_ESPACIO_HINT_01",
  "W5_ESPACIO_AMB_01",
  "W5_ESPACIO_CONFIRM_01",
  "W5_ACCESSIBLE_ESPACIO_01",
  "W5_VISITANTE_HINT_01",
  "W5_VISITANTE_AMB_01",
  "W5_VISITANTE_CONFIRM_01",
  "W5_ACCESSIBLE_VISITANTE_01",
  "W5_AREA_LOCKED_01",
  "W5_AREA_REPEAT_01",
  "W5_COMPLETE_LIA_01",
  "W5_COMPLETE_AMB_01",
  "W5_FINAL_BTN_01",
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

export const world5AreaDefinitions = [
  {
    accessibleSlot: "W5_ACCESSIBLE_PLANTAS_01",
    ambientSlot: "W5_PLANTAS_AMB_01",
    confirmSlot: "W5_PLANTAS_CONFIRM_01",
    hintSlot: "W5_PLANTAS_HINT_01",
    id: "plantas",
    label: "PLANTAS",
    order: 1,
  },
  {
    accessibleSlot: "W5_ACCESSIBLE_SISTEMA_01",
    ambientSlot: "W5_SISTEMA_AMB_01",
    confirmSlot: "W5_SISTEMA_CONFIRM_01",
    hintSlot: "W5_SISTEMA_HINT_01",
    id: "sistema",
    label: "SISTEMA",
    order: 2,
  },
  {
    accessibleSlot: "W5_ACCESSIBLE_ESPACIO_01",
    ambientSlot: "W5_ESPACIO_AMB_01",
    confirmSlot: "W5_ESPACIO_CONFIRM_01",
    hintSlot: "W5_ESPACIO_HINT_01",
    id: "espacio",
    label: "ESPACIO",
    order: 3,
  },
  {
    accessibleSlot: "W5_ACCESSIBLE_VISITANTE_01",
    ambientSlot: "W5_VISITANTE_AMB_01",
    confirmSlot: "W5_VISITANTE_CONFIRM_01",
    hintSlot: "W5_VISITANTE_HINT_01",
    id: "visitante",
    label: "VISITANTE",
    order: 4,
  },
] as const satisfies ReadonlyArray<World5AreaDefinition>;

export const WORLD5_REQUIRED_SLOT_COUNT = 24;
