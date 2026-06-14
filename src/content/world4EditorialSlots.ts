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

export type World4NodeId =
  | "planta"
  | "bionosificador"
  | "esp32"
  | "midi"
  | "wifi_udp"
  | "router"
  | "sistema_central"
  | "sonido";

export type World4NodeDefinition = {
  accessibleSlot: World4EditorialSlotId;
  cardSlot: World4EditorialSlotId;
  confirmSlot: World4EditorialSlotId;
  hintSlot: World4EditorialSlotId;
  id: World4NodeId;
  label: (typeof world4TechnicalNodes)[number];
  order: number;
};

const world4EditorialSlotIds = [
  "W4_INTRO_LIA_01",
  "W4_INTRO_SYS_01",
  "W4_ACCESSIBLE_SCENE_01",
  "W4_PLANTA_HINT_01",
  "W4_PLANTA_CARD_01",
  "W4_PLANTA_CONFIRM_01",
  "W4_ACCESSIBLE_PLANTA_01",
  "W4_BIONOSIFICADOR_HINT_01",
  "W4_BIONOSIFICADOR_CARD_01",
  "W4_BIONOSIFICADOR_CONFIRM_01",
  "W4_ACCESSIBLE_BIONOSIFICADOR_01",
  "W4_ESP32_HINT_01",
  "W4_ESP32_CARD_01",
  "W4_ESP32_CONFIRM_01",
  "W4_ACCESSIBLE_ESP32_01",
  "W4_MIDI_HINT_01",
  "W4_MIDI_CARD_01",
  "W4_MIDI_CONFIRM_01",
  "W4_ACCESSIBLE_MIDI_01",
  "W4_WIFI_UDP_HINT_01",
  "W4_WIFI_UDP_CARD_01",
  "W4_WIFI_UDP_CONFIRM_01",
  "W4_ACCESSIBLE_WIFI_UDP_01",
  "W4_ROUTER_HINT_01",
  "W4_ROUTER_CARD_01",
  "W4_ROUTER_CONFIRM_01",
  "W4_ACCESSIBLE_ROUTER_01",
  "W4_SISTEMA_CENTRAL_HINT_01",
  "W4_SISTEMA_CENTRAL_CARD_01",
  "W4_SISTEMA_CENTRAL_CONFIRM_01",
  "W4_ACCESSIBLE_SISTEMA_CENTRAL_01",
  "W4_SONIDO_HINT_01",
  "W4_SONIDO_CARD_01",
  "W4_SONIDO_CONFIRM_01",
  "W4_ACCESSIBLE_SONIDO_01",
  "W4_NODE_LOCKED_01",
  "W4_NODE_REPEAT_01",
  "W4_COMPLETE_LIA_01",
  "W4_COMPLETE_SYS_01",
  "W4_CONTINUE_BTN_01",
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

export const world4NodeDefinitions = [
  {
    accessibleSlot: "W4_ACCESSIBLE_PLANTA_01",
    cardSlot: "W4_PLANTA_CARD_01",
    confirmSlot: "W4_PLANTA_CONFIRM_01",
    hintSlot: "W4_PLANTA_HINT_01",
    id: "planta",
    label: "PLANTA",
    order: 1,
  },
  {
    accessibleSlot: "W4_ACCESSIBLE_BIONOSIFICADOR_01",
    cardSlot: "W4_BIONOSIFICADOR_CARD_01",
    confirmSlot: "W4_BIONOSIFICADOR_CONFIRM_01",
    hintSlot: "W4_BIONOSIFICADOR_HINT_01",
    id: "bionosificador",
    label: "BIONOSIFICADOR",
    order: 2,
  },
  {
    accessibleSlot: "W4_ACCESSIBLE_ESP32_01",
    cardSlot: "W4_ESP32_CARD_01",
    confirmSlot: "W4_ESP32_CONFIRM_01",
    hintSlot: "W4_ESP32_HINT_01",
    id: "esp32",
    label: "ESP32",
    order: 3,
  },
  {
    accessibleSlot: "W4_ACCESSIBLE_MIDI_01",
    cardSlot: "W4_MIDI_CARD_01",
    confirmSlot: "W4_MIDI_CONFIRM_01",
    hintSlot: "W4_MIDI_HINT_01",
    id: "midi",
    label: "MIDI",
    order: 4,
  },
  {
    accessibleSlot: "W4_ACCESSIBLE_WIFI_UDP_01",
    cardSlot: "W4_WIFI_UDP_CARD_01",
    confirmSlot: "W4_WIFI_UDP_CONFIRM_01",
    hintSlot: "W4_WIFI_UDP_HINT_01",
    id: "wifi_udp",
    label: "WI-FI/UDP",
    order: 5,
  },
  {
    accessibleSlot: "W4_ACCESSIBLE_ROUTER_01",
    cardSlot: "W4_ROUTER_CARD_01",
    confirmSlot: "W4_ROUTER_CONFIRM_01",
    hintSlot: "W4_ROUTER_HINT_01",
    id: "router",
    label: "ROUTER",
    order: 6,
  },
  {
    accessibleSlot: "W4_ACCESSIBLE_SISTEMA_CENTRAL_01",
    cardSlot: "W4_SISTEMA_CENTRAL_CARD_01",
    confirmSlot: "W4_SISTEMA_CENTRAL_CONFIRM_01",
    hintSlot: "W4_SISTEMA_CENTRAL_HINT_01",
    id: "sistema_central",
    label: "SISTEMA CENTRAL",
    order: 7,
  },
  {
    accessibleSlot: "W4_ACCESSIBLE_SONIDO_01",
    cardSlot: "W4_SONIDO_CARD_01",
    confirmSlot: "W4_SONIDO_CONFIRM_01",
    hintSlot: "W4_SONIDO_HINT_01",
    id: "sonido",
    label: "SONIDO",
    order: 8,
  },
] as const satisfies ReadonlyArray<World4NodeDefinition>;

export const WORLD4_REQUIRED_SLOT_COUNT = 40;
