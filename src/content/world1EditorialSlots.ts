import { resolveEditorialText } from "./editorial";
import type {
  EditorialEmitter,
  EditorialLocale,
  EditorialSlotId,
  EditorialSource,
  EditorialStatus,
} from "./editorial";

export type World1EditorialSlotId =
  Extract<EditorialSlotId, (typeof world1EditorialSlotIds)[number]>;

type World1EditorialSlot = {
  emitter: EditorialEmitter;
  locale: EditorialLocale;
  notes: string;
  shortText?: string;
  source: EditorialSource;
  slotId: World1EditorialSlotId;
  status: EditorialStatus;
  text: string;
};

export type World1ConceptId =
  | "intro"
  | "relation"
  | "perception"
  | "mediation"
  | "ready_to_continue";

export type World1ConceptCopy = {
  body: World1EditorialSlot;
  durationMs: number;
  eyebrow: World1EditorialSlot;
  title: World1EditorialSlot;
};

const world1EditorialSlotIds = [
  "W1_ACCESSIBLE_SCENE_01",
  "W1_INTRO_EYEBROW_01",
  "W1_INTRO_TITLE_01",
  "W1_INTRO_BODY_01",
  "W1_RELATION_EYEBROW_01",
  "W1_RELATION_TITLE_01",
  "W1_RELATION_BODY_01",
  "W1_PERCEPTION_EYEBROW_01",
  "W1_PERCEPTION_TITLE_01",
  "W1_PERCEPTION_BODY_01",
  "W1_MEDIATION_EYEBROW_01",
  "W1_MEDIATION_TITLE_01",
  "W1_MEDIATION_BODY_01",
  "W1_READY_EYEBROW_01",
  "W1_READY_TITLE_01",
  "W1_READY_BODY_01",
  "W1_CLOSE_ROOT_BTN_01",
  "W1_CONTINUE_BTN_01",
] as const;

function resolveWorld1Slot(slotId: World1EditorialSlotId): World1EditorialSlot {
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

export const world1EditorialSlots = Object.fromEntries(
  world1EditorialSlotIds.map((slotId) => [slotId, resolveWorld1Slot(slotId)]),
) as Record<World1EditorialSlotId, World1EditorialSlot>;

export const world1ConceptCopy = {
  intro: {
    body: world1EditorialSlots.W1_INTRO_BODY_01,
    durationMs: 30000,
    eyebrow: world1EditorialSlots.W1_INTRO_EYEBROW_01,
    title: world1EditorialSlots.W1_INTRO_TITLE_01,
  },
  relation: {
    body: world1EditorialSlots.W1_RELATION_BODY_01,
    durationMs: 36000,
    eyebrow: world1EditorialSlots.W1_RELATION_EYEBROW_01,
    title: world1EditorialSlots.W1_RELATION_TITLE_01,
  },
  perception: {
    body: world1EditorialSlots.W1_PERCEPTION_BODY_01,
    durationMs: 34000,
    eyebrow: world1EditorialSlots.W1_PERCEPTION_EYEBROW_01,
    title: world1EditorialSlots.W1_PERCEPTION_TITLE_01,
  },
  mediation: {
    body: world1EditorialSlots.W1_MEDIATION_BODY_01,
    durationMs: 36000,
    eyebrow: world1EditorialSlots.W1_MEDIATION_EYEBROW_01,
    title: world1EditorialSlots.W1_MEDIATION_TITLE_01,
  },
  ready_to_continue: {
    body: world1EditorialSlots.W1_READY_BODY_01,
    durationMs: 34000,
    eyebrow: world1EditorialSlots.W1_READY_EYEBROW_01,
    title: world1EditorialSlots.W1_READY_TITLE_01,
  },
} as const satisfies Record<World1ConceptId, World1ConceptCopy>;

export const WORLD1_REQUIRED_SLOT_COUNT = world1EditorialSlotIds.length;
