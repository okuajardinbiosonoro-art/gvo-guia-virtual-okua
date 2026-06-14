import { resolveEditorialText } from "./editorial";
import type {
  EditorialEmitter,
  EditorialLocale,
  EditorialSlotId,
  EditorialSource,
  EditorialStatus,
} from "./editorial";

export type World2EditorialSlotId =
  Extract<EditorialSlotId, (typeof world2EditorialSlotIds)[number]>;

type World2EditorialSlot = {
  emitter: EditorialEmitter;
  locale: EditorialLocale;
  notes: string;
  shortText?: string;
  source: EditorialSource;
  slotId: World2EditorialSlotId;
  status: EditorialStatus;
  text: string;
};

export type World2LayerId =
  | "planta_viva"
  | "senal"
  | "captura"
  | "acondicionamiento"
  | "mapeo"
  | "resultado_mediado";

export type World2LayerDefinition = {
  accessibleSlot: World2EditorialSlotId;
  ambientSlot: World2EditorialSlotId;
  confirmSlot: World2EditorialSlotId;
  hintSlot: World2EditorialSlotId;
  id: World2LayerId;
  label: string;
  order: number;
};

const world2EditorialSlotIds = [
  "W2_INTRO_LIA_01",
  "W2_INTRO_AMB_01",
  "W2_ACCESSIBLE_SCENE_01",
  "W2_PLANTA_HINT_01",
  "W2_PLANTA_AMB_01",
  "W2_PLANTA_CONFIRM_01",
  "W2_ACCESSIBLE_PLANTA_01",
  "W2_SENAL_HINT_01",
  "W2_SENAL_AMB_01",
  "W2_SENAL_CONFIRM_01",
  "W2_ACCESSIBLE_SENAL_01",
  "W2_CAPTURA_HINT_01",
  "W2_CAPTURA_AMB_01",
  "W2_CAPTURA_CONFIRM_01",
  "W2_ACCESSIBLE_CAPTURA_01",
  "W2_ACONDICIONAMIENTO_HINT_01",
  "W2_ACONDICIONAMIENTO_AMB_01",
  "W2_ACONDICIONAMIENTO_CONFIRM_01",
  "W2_ACCESSIBLE_ACONDICIONAMIENTO_01",
  "W2_MAPEO_HINT_01",
  "W2_MAPEO_AMB_01",
  "W2_MAPEO_CONFIRM_01",
  "W2_ACCESSIBLE_MAPEO_01",
  "W2_RESULTADO_HINT_01",
  "W2_RESULTADO_AMB_01",
  "W2_RESULTADO_CONFIRM_01",
  "W2_ACCESSIBLE_RESULTADO_01",
  "W2_LAYER_LOCKED_01",
  "W2_LAYER_REPEAT_01",
  "W2_COMPLETE_LIA_01",
  "W2_COMPLETE_AMB_01",
  "W2_CONTINUE_BTN_01",
] as const;

function resolveWorld2Slot(slotId: World2EditorialSlotId): World2EditorialSlot {
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

export const world2EditorialSlots = Object.fromEntries(
  world2EditorialSlotIds.map((slotId) => [slotId, resolveWorld2Slot(slotId)]),
) as Record<World2EditorialSlotId, World2EditorialSlot>;

export const world2LayerDefinitions = [
  {
    accessibleSlot: "W2_ACCESSIBLE_PLANTA_01",
    ambientSlot: "W2_PLANTA_AMB_01",
    confirmSlot: "W2_PLANTA_CONFIRM_01",
    hintSlot: "W2_PLANTA_HINT_01",
    id: "planta_viva",
    label: "PLANTA VIVA",
    order: 1,
  },
  {
    accessibleSlot: "W2_ACCESSIBLE_SENAL_01",
    ambientSlot: "W2_SENAL_AMB_01",
    confirmSlot: "W2_SENAL_CONFIRM_01",
    hintSlot: "W2_SENAL_HINT_01",
    id: "senal",
    label: "SEÑAL",
    order: 2,
  },
  {
    accessibleSlot: "W2_ACCESSIBLE_CAPTURA_01",
    ambientSlot: "W2_CAPTURA_AMB_01",
    confirmSlot: "W2_CAPTURA_CONFIRM_01",
    hintSlot: "W2_CAPTURA_HINT_01",
    id: "captura",
    label: "CAPTURA",
    order: 3,
  },
  {
    accessibleSlot: "W2_ACCESSIBLE_ACONDICIONAMIENTO_01",
    ambientSlot: "W2_ACONDICIONAMIENTO_AMB_01",
    confirmSlot: "W2_ACONDICIONAMIENTO_CONFIRM_01",
    hintSlot: "W2_ACONDICIONAMIENTO_HINT_01",
    id: "acondicionamiento",
    label: "ACONDICIONAMIENTO",
    order: 4,
  },
  {
    accessibleSlot: "W2_ACCESSIBLE_MAPEO_01",
    ambientSlot: "W2_MAPEO_AMB_01",
    confirmSlot: "W2_MAPEO_CONFIRM_01",
    hintSlot: "W2_MAPEO_HINT_01",
    id: "mapeo",
    label: "MAPEO",
    order: 5,
  },
  {
    accessibleSlot: "W2_ACCESSIBLE_RESULTADO_01",
    ambientSlot: "W2_RESULTADO_AMB_01",
    confirmSlot: "W2_RESULTADO_CONFIRM_01",
    hintSlot: "W2_RESULTADO_HINT_01",
    id: "resultado_mediado",
    label: "RESULTADO MEDIADO",
    order: 6,
  },
] as const satisfies ReadonlyArray<World2LayerDefinition>;

export const WORLD2_REQUIRED_SLOT_COUNT = 32;
