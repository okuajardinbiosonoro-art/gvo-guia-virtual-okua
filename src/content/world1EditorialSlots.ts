import { resolveEditorialText } from "./editorial";
import type {
  EditorialEmitter,
  EditorialLocale,
  EditorialSlotId,
  EditorialSource,
  EditorialStatus,
} from "./editorial";

export type World1EditorialSlotId = Extract<
  EditorialSlotId,
  (typeof world1EditorialSlotIds)[number]
>;

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

export const WORLD1_REQUIRED_SLOT_COUNT = world1EditorialSlotIds.length;

export type World1Locale = "es" | "en";

// Translations preserve the source segment order; they are not writer literals.
const world1EnglishSegments: Record<string, readonly string[]> = {
  TXT_1_bda987858a09: [
    "To listen to a plant, we must understand that, although it may seem motionless, it is a living, social and intelligent being.",
    "It communicates with other plants and can detect and relate to its surroundings, including human beings.",
  ],
  TXT_1_8dca94bf5283: [
    "The earth, light, water, air and those who approach to care for it are part of the same relationship.",
    "Before sonifying a signal, we need to recognise that web of connections.",
    "At OKÚA, listening begins when we stop seeing the plant as an isolated thing and begin to see it as a being of living relationships.",
  ],
  TXT_1_8baa6441ea68: [
    "To perceive is to sharpen our attention to notice what is hidden from view.",
    "Plants contain rhythms and silences, subtle changes from their roots to their leaves and flowers, converted into small electrical pulses.",
    "Perceiving them allows us to listen to them performing digital and musical sounds.",
  ],
  TXT_1_08d39e75680b: [
    "The plant's pulse is inaudible; it needs mediation so that the human ear can perceive that hidden music in the rhythm of life.",
    "At Okúa, we developed a system that translates those bioelectrical pulses into digital signals, which can control lights and virtual musical instruments live.",
    "So that you can see and hear the invisible.",
  ],
};

function world1SourceSegments(id: string, locale: World1Locale): string[] {
  const source = world1Obs03Sources.find((entry) => entry.id === id);
  if (!source) throw new Error(`Missing OBS03 source ${id}`);
  if (locale === "en") {
    const translated = world1EnglishSegments[id];
    if (!translated) throw new Error(`Missing OBS03 English segments ${id}`);
    return [...translated];
  }
  return source.segments.map((segment) => {
    let text: string = segment.text;
    for (const patch of source.patches) {
      if (patch.start >= segment.start && patch.end <= segment.end) {
        const start = patch.start - segment.start;
        text = text.slice(0, start) + patch.after + text.slice(patch.end - segment.start);
      }
    }
    return text.trim();
  });
}

export function getWorld1Editorial(locale: World1Locale) {
  const en = locale === "en";
  const slots = Object.fromEntries(world1EditorialSlotIds.map((slotId) => [
    slotId, { ...resolveWorld1Slot(slotId), locale, status: "REVIEW" as const },
  ])) as Record<World1EditorialSlotId, World1EditorialSlot>;
  const set = (id: World1EditorialSlotId, text: string) => { slots[id].text = text; };
  set("W1_ACCESSIBLE_SCENE_01", en ? "Interactive scene in Room I · Root: Relationship, Perception and Mediation." : "Escena interactiva de Sala I · Raíz: Relación, Percepción y Mediación.");
  set("W1_INTRO_EYEBROW_01", en ? "Room I · Root" : "Sala I · Raíz");
  set("W1_INTRO_TITLE_01", en ? "Before listening, we must learn to observe:" : "Antes de escuchar, debemos aprender a observar:");
  set("W1_RELATION_EYEBROW_01", en ? "RELATIONSHIP" : "RELACIÓN");
  set("W1_RELATION_TITLE_01", en ? "The plant is not isolated: it lives in relationship with everything that sustains it." : "La planta no está aislada: vive en relación con todo lo que la sostiene.");
  set("W1_PERCEPTION_EYEBROW_01", en ? "PERCEPTION" : "PERCEPCIÓN");
  set("W1_PERCEPTION_TITLE_01", en ? "A plant may seem motionless, but its pulse never stops." : "Una planta puede parecer inmóvil, pero su pulso nunca se detiene.");
  set("W1_MEDIATION_EYEBROW_01", en ? "MEDIATION" : "MEDIACIÓN");
  set("W1_MEDIATION_TITLE_01", en ? "To mediate is to build a bridge to approach a living signal." : "Mediar es construir un puente para  acercarnos a una señal viva.");
  set("W1_READY_EYEBROW_01", en ? "ROOTS EXPLORED" : "RAÍCES RECORRIDAS");
  set("W1_READY_TITLE_01", en ? "You have explored the roots; it is time to continue the journey" : "Ya recorriste las raíces, es hora de continuar el viaje");
  set("W1_READY_BODY_01", en ? "We invite you to continue your journey through the other rooms and keep learning with Okúa." : "Te invitamos a continuar tu recorrido por las otras salas y seguir aprendiendo con Okúa.");
  set("W1_CLOSE_ROOT_BTN_01", en ? "Close" : "Cerrar");
  set("W1_CONTINUE_BTN_01", en ? "Continue" : "Continuar");
  const bindings = { intro: "TXT_1_bda987858a09", relation: "TXT_1_8dca94bf5283", perception: "TXT_1_8baa6441ea68", mediation: "TXT_1_08d39e75680b" } as const;
  const details: Partial<Record<World1ConceptId, string>> = {};
  for (const [concept, id] of Object.entries(bindings)) {
    const segments = world1SourceSegments(id, locale);
    const prefix = concept.toUpperCase() as "INTRO" | "RELATION" | "PERCEPTION" | "MEDIATION";
    set(`W1_${prefix}_BODY_01`, segments[0]);
    details[concept as World1ConceptId] = segments.slice(1).join(" ");
  }
  if (!en) {
    set("W1_RELATION_BODY_01", "La tierra, la luz, el agua, el aire y quienes se acercan a cuidarla forman parte de la misma relación.");
    set("W1_PERCEPTION_BODY_01", "Percibir es afinar la atención para notar algo oculto o vedado.");
  }
  const conceptCopy = Object.fromEntries((["intro", "relation", "perception", "mediation", "ready_to_continue"] as World1ConceptId[]).map((concept) => {
    const prefix = concept === "ready_to_continue" ? "READY" : concept.toUpperCase() as "INTRO" | "RELATION" | "PERCEPTION" | "MEDIATION";
    return [concept, { body: slots[`W1_${prefix}_BODY_01`], eyebrow: slots[`W1_${prefix}_EYEBROW_01`], title: slots[`W1_${prefix}_TITLE_01`], durationMs: 0 }];
  })) as Record<World1ConceptId, World1ConceptCopy>;
  return { slots, conceptCopy, details, ui: {
    more: en ? "+ More" : "+ Más", less: en ? "Less" : "Menos",
    advance: en ? "Continue" : "Continuar", close: en ? "Close" : "Cerrar",
    retry: en ? "Try again" : "Reintentar",
    saveError: en ? "We could not verify your progress. Try again before continuing." : "No pudimos verificar el guardado. Reintenta antes de continuar.",
    qr: en ? "Scan the QR code in the next room to continue." : "Escanea el QR de la siguiente sala para continuar.",
    nodes: en ? ["RELATIONSHIP", "PERCEPTION", "MEDIATION"] : ["RELACIÓN", "PERCEPCIÓN", "MEDIACIÓN"],
  } };
}

// OBS03.2 source register: saved writer words remain immutable; UI/EN are separate.
export const world1Obs03Sources = [
  {
    "id": "TXT_1_bda987858a09",
    "action": "replace",
    "writerText": "Para escuchar una planta debemos comprender, que aunque parezca inmóvil es un ser vivo, social e inteligente. Que se comunica con otras plantas y es capaz de detectar y relacionarse con su entorno, incluyendo a los seres humanos.\n",
    "writerTextSha256": "dc6a2a95af75ac6c27fb583d9198c8f01c547faaf7d632d06323e1cd0ffa8c4a",
    "segments": [
      {
        "segment_id": "TXT_1_bda987858a09::s01",
        "start": 0,
        "end": 110,
        "text": "Para escuchar una planta debemos comprender, que aunque parezca inmóvil es un ser vivo, social e inteligente. "
      },
      {
        "segment_id": "TXT_1_bda987858a09::s02",
        "start": 110,
        "end": 230,
        "text": "Que se comunica con otras plantas y es capaz de detectar y relacionarse con su entorno, incluyendo a los seres humanos.\n"
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/15/literal/writer"
  },
  {
    "id": "TXT_1_8dca94bf5283",
    "action": "replace",
    "writerText": "La tierra, la luz, el agua, el aire y quienes se acercan a cuidarla forman parte de la misma escena. Antes de sonificar una señal, necesitamos reconocer ese tejido de vínculos. En OKÚA, escuchar empieza cuando dejamos de mirar la planta como una cosa aislada y empezamos a verla como un ser de relaciones vivas.",
    "writerTextSha256": "3b3c2ff064e4d66583f3e59d234d936f8efe73ca54791d79998afa6446990fdb",
    "segments": [
      {
        "segment_id": "TXT_1_8dca94bf5283::s01",
        "start": 0,
        "end": 101,
        "text": "La tierra, la luz, el agua, el aire y quienes se acercan a cuidarla forman parte de la misma escena. "
      },
      {
        "segment_id": "TXT_1_8dca94bf5283::s02",
        "start": 101,
        "end": 177,
        "text": "Antes de sonificar una señal, necesitamos reconocer ese tejido de vínculos. "
      },
      {
        "segment_id": "TXT_1_8dca94bf5283::s03",
        "start": 177,
        "end": 311,
        "text": "En OKÚA, escuchar empieza cuando dejamos de mirar la planta como una cosa aislada y empezamos a verla como un ser de relaciones vivas."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/16/literal/writer"
  },
  {
    "id": "TXT_1_08d39e75680b",
    "action": "replace",
    "writerText": "El pulso de la planta es inaudible, necesita una mediación para que el oído humano pueda percebir esa música oculta  en el ritmo de la vida. En Okúa, desarrollamos un sistema que traduce esos pulsos bioeléctricos en señales digitales, que pueden controlar luces e instrumentos musicales virtuales en vivo. Para que puedas ver y escuchar lo invisible.",
    "writerTextSha256": "7203a90532765c7507bf84e46cf4348636e0003d55d989aecebae0a9a97a2b26",
    "segments": [
      {
        "segment_id": "TXT_1_08d39e75680b::s01",
        "start": 0,
        "end": 141,
        "text": "El pulso de la planta es inaudible, necesita una mediación para que el oído humano pueda percebir esa música oculta  en el ritmo de la vida. "
      },
      {
        "segment_id": "TXT_1_08d39e75680b::s02",
        "start": 141,
        "end": 306,
        "text": "En Okúa, desarrollamos un sistema que traduce esos pulsos bioeléctricos en señales digitales, que pueden controlar luces e instrumentos musicales virtuales en vivo. "
      },
      {
        "segment_id": "TXT_1_08d39e75680b::s03",
        "start": 306,
        "end": 350,
        "text": "Para que puedas ver y escuchar lo invisible."
      }
    ],
    "patches": [
      {
        "source_id": "TXT_1_08d39e75680b",
        "start": 89,
        "end": 97,
        "before": "percebir",
        "after": "percibir",
        "publication_disposition": "eligible_if_bound_to_public_consumer"
      }
    ],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/17/literal/writer"
  },
  {
    "id": "TXT_1_b3de95b919e3",
    "action": "replace",
    "writerText": "Una planta puede parecer inmóvil, pero su pulso nunca se detiene.",
    "writerTextSha256": "48826b5e48f6332c202abd519cce3d4f56efe0e17a9fbc1f165d05ccb8b84f2a",
    "segments": [
      {
        "segment_id": "TXT_1_b3de95b919e3::s01",
        "start": 0,
        "end": 65,
        "text": "Una planta puede parecer inmóvil, pero su pulso nunca se detiene."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/18/literal/writer"
  },
  {
    "id": "TXT_1_fbe435b5a20d",
    "action": "replace",
    "writerText": "Mediar es construir un puente para  acercarnos a una señal viva.",
    "writerTextSha256": "badfeacb6e386cd43e0ab05f14fde0da6cab42cd6df7cb2dfa421ce2706b5117",
    "segments": [
      {
        "segment_id": "TXT_1_fbe435b5a20d::s01",
        "start": 0,
        "end": 64,
        "text": "Mediar es construir un puente para  acercarnos a una señal viva."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/19/literal/writer"
  },
  {
    "id": "TXT_1_5afe5e801ebf",
    "action": "replace",
    "writerText": "Te invitamos a continuar tu recorrido por las otras salas y seguir aprendiendo con Okúa Jardín Biosonoro. Escanéa el código QR que encontrarás en la siguiente caja.",
    "writerTextSha256": "4a2c9dc21a2733510006cb5eaa1b9340f8eba997dff0797535231af1d667a7fc",
    "segments": [
      {
        "segment_id": "TXT_1_5afe5e801ebf::s01",
        "start": 0,
        "end": 106,
        "text": "Te invitamos a continuar tu recorrido por las otras salas y seguir aprendiendo con Okúa Jardín Biosonoro. "
      },
      {
        "segment_id": "TXT_1_5afe5e801ebf::s02",
        "start": 106,
        "end": 164,
        "text": "Escanéa el código QR que encontrarás en la siguiente caja."
      }
    ],
    "patches": [
      {
        "source_id": "TXT_1_5afe5e801ebf",
        "start": 106,
        "end": 113,
        "before": "Escanéa",
        "after": "Escanea",
        "publication_disposition": "eligible_if_bound_to_public_consumer"
      }
    ],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/20/literal/writer"
  },
  {
    "id": "TXT_1_b018f753fe2c",
    "action": "keep",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/24/literal/writer"
  },
  {
    "id": "TXT_1_8baa6441ea68",
    "action": "replace",
    "writerText": "Percibir es afinar la atención para notar algo vedado. Hay en las plantas ritmos y silencios, cambios sutiles desde la raíz hasta sus hojas y flores, convertidos en pequeños pulsos eléctricos. Percibirlos nos permite escucharlas interpretar sonidos digitales y musicales.",
    "writerTextSha256": "a6dc7f1efd04b983766e42ca45f98a54732c5a03d925a807f85a80fedf1af034",
    "segments": [
      {
        "segment_id": "TXT_1_8baa6441ea68::s01",
        "start": 0,
        "end": 55,
        "text": "Percibir es afinar la atención para notar algo vedado. "
      },
      {
        "segment_id": "TXT_1_8baa6441ea68::s02",
        "start": 55,
        "end": 193,
        "text": "Hay en las plantas ritmos y silencios, cambios sutiles desde la raíz hasta sus hojas y flores, convertidos en pequeños pulsos eléctricos. "
      },
      {
        "segment_id": "TXT_1_8baa6441ea68::s03",
        "start": 193,
        "end": 271,
        "text": "Percibirlos nos permite escucharlas interpretar sonidos digitales y musicales."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/47/literal/writer"
  },
  {
    "id": "TXT_1_355423610a9d",
    "action": "replace",
    "writerText": "Ya recorriste las raíces, es hora de continuar el viaje",
    "writerTextSha256": "32c5e1c59600f44b9e89b9ec0c7eb9a3c138ceffc415443c937c612ce8836ee3",
    "segments": [
      {
        "segment_id": "TXT_1_355423610a9d::s01",
        "start": 0,
        "end": 55,
        "text": "Ya recorriste las raíces, es hora de continuar el viaje"
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/48/literal/writer"
  },
  {
    "id": "TXT_1_1bc82f9b063e",
    "action": "replace",
    "writerText": "Antes de escuchar, debemos aprender a observar:",
    "writerTextSha256": "a484269949641b660aa2fcfd001d764d41934c7a3ea660f48a95fc439d27e084",
    "segments": [
      {
        "segment_id": "TXT_1_1bc82f9b063e::s01",
        "start": 0,
        "end": 47,
        "text": "Antes de escuchar, debemos aprender a observar:"
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/56/literal/writer"
  },
  {
    "id": "TXT_1_f317c06a89cf",
    "action": "replace",
    "writerText": "Sala I: Raíz",
    "writerTextSha256": "7af65f75054fc95311a341fc5a77fb6ba5906673aecfe8e54675be665d403e30",
    "segments": [
      {
        "segment_id": "TXT_1_f317c06a89cf::s01",
        "start": 0,
        "end": 12,
        "text": "Sala I: Raíz"
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/82/literal/writer"
  },
  {
    "id": "EL_30af9418e731",
    "action": "replace",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/83/literal/writer"
  }
] as const;

// Compatibility exports for non-runtime consumers. Screens resolve at render time.
export const world1EditorialSlots = getWorld1Editorial("es").slots;
export const world1ConceptCopy = getWorld1Editorial("es").conceptCopy;
export const world1OptionalDetails = getWorld1Editorial("es").details;
