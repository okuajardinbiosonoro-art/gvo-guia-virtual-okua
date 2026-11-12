import { resolveEditorialText } from "./editorial";
import type {
  EditorialEmitter,
  EditorialLocale,
  EditorialSlotId,
  EditorialSource,
  EditorialStatus,
} from "./editorial";

export type World2EditorialSlotId = Extract<
  EditorialSlotId,
  (typeof world2EditorialSlotIds)[number]
>;

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

// Edited integration copy and origin IDs; keep entries retain their source semantics.
export type World2Locale = "es" | "en";

const world2English: Record<string, string> = {
  TXT_2_410038ab009e: "The plant is alive before data is collected. Its pulse is not music yet: it is presence, variation and symbol.",
  TXT_2_5a930f3ad791: "The electrical variation appears as a signal, as a symbol that can be read.",
  TXT_2_05f8c5d40f25: "The system receives the vital pulse without altering it, preserves its information in an analogue state and transmits it to the system.",
  TXT_2_c902451f351c: "The pulse is cleaned and organised. It is precisely sifted, giving it a form that can be expressed.",
  TXT_2_a49aff973eec: "This point marks the first contact between the plant and the system. The electrodes are attached to the edge of the leaves, at one of the plant's upper extremities; a small bioelectrical variation is read there and will later be analysed and interpreted.",
  TXT_2_bf6b124a45bb: "Subtle electrical variations emerge from the plant. Although they cannot be seen or heard directly, they already contain living information: internal metabolic or vascular processes, small changes and pauses in its electrical pulse, signals that interact with other plants through the roots, electrical variations in the soil. All of this forms a map that must be carefully filtered until the right vibration is found.",
  TXT_2_3ba969bcbd1f: "The invisible pulse is now mediated. We can continue the journey. Scan the QR code you will find at the next box.",
};

function world2Literal(id: string, locale: World2Locale) {
  const source = world2Obs03Sources.find((entry) => entry.id === id);
  if (!source || source.action !== "replace") throw new Error(`Missing public OBS03 replacement ${id}`);
  if (locale === "en") {
    const translation = world2English[id];
    if (!translation) throw new Error(`Missing OBS03 translation ${id}`);
    return translation;
  }
  let text: string = source.writerText;
  for (const patch of [...source.patches].sort((a, b) => b.start - a.start)) {
    text = text.slice(0, patch.start) + patch.after + text.slice(patch.end);
  }
  return text.trim();
}

export function getWorld2Content(locale: World2Locale) {
  const en = locale === "en";
  const labels = en ? ["Plant", "Signal", "Capture", "Conditioning", "Mapping", "Music"] : ["Planta", "Señal", "Captura", "Acond.", "Mapeo", "Música"];
  const titles = en ? ["Life before the signal", "Bioelectrical pulse", "Careful capture", "Prepared signal", "From data to gesture", "Mediated music"] : ["La vida antes de la señal", "Pulso bioeléctrico", "Captura cuidadosa", "Señal preparada", "Del dato al gesto", "Música mediada"];
  const origin = ["TXT_2_410038ab009e", "TXT_2_5a930f3ad791", "TXT_2_05f8c5d40f25", "TXT_2_c902451f351c", "legacy:W2_MAPEO_HINT_01", "legacy:W2_RESULTADO_HINT_01"];
  const bodies = [
    ...origin.slice(0, 4).map((id) => world2Literal(id, locale)),
    en ? "The signal finds correspondences. Some changes become pitch, rhythm, brightness or silence." : "La señal encuentra correspondencias. Algunos cambios se vuelven altura, ritmo, brillo o silencio.",
    en ? "Listen to the installation around you. What you hear is a sensitive translation between life, data and sound." : "Escucha a tu alrededor, lo que oyes es una traducción sensible entre vida, datos y sonido.",
  ];
  const layers = Object.fromEntries(world2LayerDefinitions.map((layer, index) => [layer.id, {
    origin: origin[index], navLabel: labels[index], accessibleLabel: labels[index], title: titles[index],
    dialogue: bodies[index], ambient: bodies[index],
    hint: layer.id === "planta_viva" ? en ? "Open the reading point." : "Toca el punto de lectura." : layer.id === "senal" ? en ? "Tap Measured wave." : "Toca Onda medida." : layer.id === "captura" ? en ? "Explore the three steps." : "Recorre los tres pasos." : "",
  }])) as Record<World2LayerId, {origin:string;navLabel:string;accessibleLabel:string;title:string;dialogue:string;ambient:string;hint:string}>;
  return { layers, readouts: {
    plant: { origin: "TXT_2_a49aff973eec", title: en ? "Reading point" : "Punto de lectura", text: en ? "This point marks the first contact between the plant and the system. The contact electrodes are attached to the edge of the leaves. They measure a very small bioelectrical variation." : "Este punto marca el primer contacto entre la planta y el sistema. Los electrodos de contacto se fijan al borde de las hojas, donde se realiza la lectura de una pequeña variación bioeléctrica." },
    signal: { origin: "TXT_2_bf6b124a45bb", title: en ? "Measured wave" : "Onda medida", text: en ? "Subtle electrical variations emerge from the plant. Although they cannot be seen or heard directly, we can measure small changes and pauses in the pulse. The signal is then filtered before it is mapped to sound." : "Desde la planta emergen variaciones eléctricas sutiles. Aunque no se ven ni se escuchan directamente, podemos medir pequeños cambios y pausas en su pulso. La señal se filtra antes de interpretarla como sonido." },
    complete: { origin: "TXT_2_3ba969bcbd1f", text: en ? "The invisible pulse has become sound in the installation. We can continue the journey." : "El pulso invisible ya se ha transformado en sonido en la instalación. Podemos continuar con el recorrido." },
  }, capture: [
    { id: "contact" as const, label: en ? "Contact" : "Contacto", readout: en ? "This is where reading begins. The electrode comes into contact with the plant and makes it possible to perceive a very small bioelectrical variation." : "Aquí comienza la lectura. El electrodo entra en contacto con la planta y permite percibir una variación bioeléctrica muy pequeña." },
    { id: "signal" as const, label: en ? "Captured signal" : "Señal tomada", readout: en ? "The system receives the pulse without altering it and preserves its information in analogue form. The signal has yet to be filtered or transformed." : "El sistema recibe el pulso vital sin alterarlo y conserva su información en estado analógico. En este punto la señal no ha sido limpiada ni transformada." },
    { id: "system" as const, label: en ? "Data to the system" : "Datos al sistema", readout: en ? "The system records the signal. It can now preserve it as data to organise and analyse it." : "El sistema registra la señal. Ahora puede conservarla como datos para ordenarla y analizarla." },
  ], ui: {
    heading: en ? "Room II · Invisible pulse" : "Sala II · Pulso invisible", layer: en ? "Layer" : "Capa", of: en ? "of" : "de",
    advance: en ? "Continue" : "Continuar", close: en ? "Close Music" : "Cerrar Música", more: en ? "+ More" : "+ Más", less: en ? "Less" : "Menos",
    assist: en ? "Show result" : "Ver resultado", retry: en ? "Try again" : "Reintentar",
    saveError: en ? "We could not verify your progress. Try again before continuing." : "No pudimos verificar el guardado. Reintenta antes de continuar.",
    qr: en ? "Scan the QR code in the next room to continue." : "Escanea el QR de la siguiente sala para continuar.",
    tap: en ? "Tap here" : "Toca aquí", wave: en ? "Measured wave" : "Onda medida",
    silent: en ? "Music belongs to the physical installation. This browser remains silent." : "La música pertenece a la instalación física. Este navegador permanece sin sonido.",
    review: en ? "You can revisit any open layer without losing your progress." : "Puedes revisar cualquier capa ya abierta sin perder el recorrido.",
  } };
}

// OBS03.2 source register: saved writer words remain immutable; UI/EN are separate.
export const world2Obs03Sources = [
  {
    "id": "EL_ab3981b344ae",
    "action": "hide",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/0/literal/writer"
  },
  {
    "id": "EL_495eef2dd253",
    "action": "keep",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/1/literal/writer"
  },
  {
    "id": "TXT_2_8263a577d1f3",
    "action": "replace",
    "writerText": "SALA II",
    "writerTextSha256": "3e33cbc07be28ce1e36a22fcd23827e92f59bc67c5eec0ff475e5ba5609e4b51",
    "segments": [
      {
        "segment_id": "TXT_2_8263a577d1f3::s01",
        "start": 0,
        "end": 7,
        "text": "SALA II"
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/21/literal/writer"
  },
  {
    "id": "TXT_2_236d9f952122",
    "action": "replace",
    "writerText": "Toca aquí",
    "writerTextSha256": "9dcf52dbbce36e4e368c5748e7cdb3a09a32b4c0245f15ec48b2b098a84b2c16",
    "segments": [
      {
        "segment_id": "TXT_2_236d9f952122::s01",
        "start": 0,
        "end": 9,
        "text": "Toca aquí"
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/22/literal/writer"
  },
  {
    "id": "EL_64f9f19457b9",
    "action": "replace",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/23/literal/writer"
  },
  {
    "id": "TXT_2_7b2cea3bf230",
    "action": "keep",
    "writerText": "La variación aparece como una señal pequeña. Todavía no canta: primero debe ser leída.",
    "writerTextSha256": "d7feb0646c86ad36bb553c506a20157fabe5980bd532c397a6d8a19570d4557d",
    "segments": [
      {
        "segment_id": "TXT_2_7b2cea3bf230::s01",
        "start": 0,
        "end": 45,
        "text": "La variación aparece como una señal pequeña. "
      },
      {
        "segment_id": "TXT_2_7b2cea3bf230::s02",
        "start": 45,
        "end": 86,
        "text": "Todavía no canta: primero debe ser leída."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/25/literal/writer"
  },
  {
    "id": "TXT_2_48e0d1fa9385",
    "action": "keep",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/26/literal/writer"
  },
  {
    "id": "TXT_2_a49aff973eec",
    "action": "replace",
    "writerText": "Este punto marca el primer contacto entre la planta y el sistema. Los electródos se fijan al borde de las hojas, en uno de los extremos superiores de la planta, allí se realiza la lectura de una pequeña variación bioeléctrica que después será analizada e interpretada.",
    "writerTextSha256": "e91459638238a21f4dd28e3c504454f5de57f3099165a2ec4d60abe9ed356b7c",
    "segments": [
      {
        "segment_id": "TXT_2_a49aff973eec::s01",
        "start": 0,
        "end": 66,
        "text": "Este punto marca el primer contacto entre la planta y el sistema. "
      },
      {
        "segment_id": "TXT_2_a49aff973eec::s02",
        "start": 66,
        "end": 268,
        "text": "Los electródos se fijan al borde de las hojas, en uno de los extremos superiores de la planta, allí se realiza la lectura de una pequeña variación bioeléctrica que después será analizada e interpretada."
      }
    ],
    "patches": [
      {
        "source_id": "TXT_2_a49aff973eec",
        "start": 70,
        "end": 80,
        "before": "electródos",
        "after": "electrodos",
        "publication_disposition": "eligible_if_bound_to_public_consumer"
      }
    ],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/27/literal/writer"
  },
  {
    "id": "EL_b8fefd103241",
    "action": "keep",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/28/literal/writer"
  },
  {
    "id": "TXT_2_a491f0e2fef2",
    "action": "replace",
    "writerText": "Toca Señal para continuar",
    "writerTextSha256": "3bde1cd27869c87c1efb003cf0a67d533e3563537cb73d50e86c4cb9d2c3b525",
    "segments": [
      {
        "segment_id": "TXT_2_a491f0e2fef2::s01",
        "start": 0,
        "end": 25,
        "text": "Toca Señal para continuar"
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/29/literal/writer"
  },
  {
    "id": "EL_b351b0d9d3fb",
    "action": "replace",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/30/literal/writer"
  },
  {
    "id": "TXT_2_9be17e585b70",
    "action": "replace",
    "writerText": "Onda medida",
    "writerTextSha256": "4810519c8249e727a39ee6ca7ab43ab9093bfc87f3c522a98702464c2c8298dc",
    "segments": [
      {
        "segment_id": "TXT_2_9be17e585b70::s01",
        "start": 0,
        "end": 11,
        "text": "Onda medida"
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/31/literal/writer"
  },
  {
    "id": "TXT_2_bf6b124a45bb",
    "action": "replace",
    "writerText": "Desde la planta emergen variaciones eléctricas sutiles. Aunque no se ven ni se escuchan directamente, ya contienen información viva: procesos metabólicos o vasculares internos, pequeños cambios y pausas en su pulso eléctrico, señales que interactúan con otras plantas desde las raíces, variaciones eléctricas del suelo. Todo ello constituye un mapa que debe ser filtrado cuidadosamente hasta encontrar la vibración correcta.",
    "writerTextSha256": "17bafe1c2a866db38cc2dc35c2390374723e6b70ec277e7b7399d54f771961fc",
    "segments": [
      {
        "segment_id": "TXT_2_bf6b124a45bb::s01",
        "start": 0,
        "end": 56,
        "text": "Desde la planta emergen variaciones eléctricas sutiles. "
      },
      {
        "segment_id": "TXT_2_bf6b124a45bb::s02",
        "start": 56,
        "end": 320,
        "text": "Aunque no se ven ni se escuchan directamente, ya contienen información viva: procesos metabólicos o vasculares internos, pequeños cambios y pausas en su pulso eléctrico, señales que interactúan con otras plantas desde las raíces, variaciones eléctricas del suelo. "
      },
      {
        "segment_id": "TXT_2_bf6b124a45bb::s03",
        "start": 320,
        "end": 424,
        "text": "Todo ello constituye un mapa que debe ser filtrado cuidadosamente hasta encontrar la vibración correcta."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/32/literal/writer"
  },
  {
    "id": "TXT_2_cd264feb015e",
    "action": "keep",
    "writerText": "Aquí comienza la lectura. El electrodo entra en contacto con la planta y permite percibir una variación bioeléctrica muy pequeña.",
    "writerTextSha256": "ada8b3cbe233d3ea5eeec690e905887097e3ee3a77c4ef79c973a6226b1e3fd2",
    "segments": [
      {
        "segment_id": "TXT_2_cd264feb015e::s01",
        "start": 0,
        "end": 26,
        "text": "Aquí comienza la lectura. "
      },
      {
        "segment_id": "TXT_2_cd264feb015e::s02",
        "start": 26,
        "end": 129,
        "text": "El electrodo entra en contacto con la planta y permite percibir una variación bioeléctrica muy pequeña."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/33/literal/writer"
  },
  {
    "id": "TXT_2_05f8c5d40f25",
    "action": "replace",
    "writerText": "El sistema recibe el pulso vital sin alterarlo, conserva su información en estado analógico y la transmite al sistema.",
    "writerTextSha256": "f2518470dd9df1a9d4b9813a24c60aaada068c8ca8800ef7467d4bf41c055070",
    "segments": [
      {
        "segment_id": "TXT_2_05f8c5d40f25::s01",
        "start": 0,
        "end": 118,
        "text": "El sistema recibe el pulso vital sin alterarlo, conserva su información en estado analógico y la transmite al sistema."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/34/literal/writer"
  },
  {
    "id": "TXT_2_c902451f351c",
    "action": "replace",
    "writerText": "El pulso se limpia y se ordena. Se tamiza de una manera precisa, dándole una forma que se pueda expresar.",
    "writerTextSha256": "dd47e7c482d20b040790a15a22583b04559e0cfe21df650a8b1bb4bb3266032a",
    "segments": [
      {
        "segment_id": "TXT_2_c902451f351c::s01",
        "start": 0,
        "end": 32,
        "text": "El pulso se limpia y se ordena. "
      },
      {
        "segment_id": "TXT_2_c902451f351c::s02",
        "start": 32,
        "end": 105,
        "text": "Se tamiza de una manera precisa, dándole una forma que se pueda expresar."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/35/literal/writer"
  },
  {
    "id": "TXT_2_ab8acbe9b03f",
    "action": "keep",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/36/literal/writer"
  },
  {
    "id": "TXT_2_410038ab009e",
    "action": "replace",
    "writerText": "La planta está viva antes de la toma de  datos. Su pulso no es música todavía: es presencia, variación y símbolo.",
    "writerTextSha256": "377225fd3d39666f5b276f5e363b0d7db986f7e9db4193a0cd823c40a3cf3a98",
    "segments": [
      {
        "segment_id": "TXT_2_410038ab009e::s01",
        "start": 0,
        "end": 48,
        "text": "La planta está viva antes de la toma de  datos. "
      },
      {
        "segment_id": "TXT_2_410038ab009e::s02",
        "start": 48,
        "end": 113,
        "text": "Su pulso no es música todavía: es presencia, variación y símbolo."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/37/literal/writer"
  },
  {
    "id": "TXT_2_5a930f3ad791",
    "action": "replace",
    "writerText": "La variación eléctrica aparece como una señal, como un símbolo suceptible de ser leído.",
    "writerTextSha256": "f35813e06268c1e535da1cd6f70674036a1a9936abc3365069a842ea048d76de",
    "segments": [
      {
        "segment_id": "TXT_2_5a930f3ad791::s01",
        "start": 0,
        "end": 87,
        "text": "La variación eléctrica aparece como una señal, como un símbolo suceptible de ser leído."
      }
    ],
    "patches": [
      {
        "source_id": "TXT_2_5a930f3ad791",
        "start": 63,
        "end": 73,
        "before": "suceptible",
        "after": "susceptible",
        "publication_disposition": "eligible_if_bound_to_public_consumer"
      }
    ],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/38/literal/writer"
  },
  {
    "id": "TXT_2_eb57f9ae7ee6",
    "action": "replace",
    "writerText": "Toca Música para oír el resultado.",
    "writerTextSha256": "090f3a49e198dc621cdb6438d378dc5bb7de7c22388b1468c523e496ffb30dd8",
    "segments": [
      {
        "segment_id": "TXT_2_eb57f9ae7ee6::s01",
        "start": 0,
        "end": 34,
        "text": "Toca Música para oír el resultado."
      }
    ],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/39/literal/writer"
  },
  {
    "id": "TXT_2_a511f271b4fa",
    "action": "keep",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/40/literal/writer"
  },
  {
    "id": "TXT_2_667068310376",
    "action": "keep",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/49/literal/writer"
  },
  {
    "id": "TXT_2_3ba969bcbd1f",
    "action": "replace",
    "writerText": "El pulso invisible ya está mediado. Podemos continuar con el recorrido. Escanéa el código QR que encontrarás en la siguiente caja.",
    "writerTextSha256": "c5e32b160a61dd821f429581ed8a49a7571a4d00c1b1b8179530dd0ab8d7ba3f",
    "segments": [
      {
        "segment_id": "TXT_2_3ba969bcbd1f::s01",
        "start": 0,
        "end": 36,
        "text": "El pulso invisible ya está mediado. "
      },
      {
        "segment_id": "TXT_2_3ba969bcbd1f::s02",
        "start": 36,
        "end": 72,
        "text": "Podemos continuar con el recorrido. "
      },
      {
        "segment_id": "TXT_2_3ba969bcbd1f::s03",
        "start": 72,
        "end": 130,
        "text": "Escanéa el código QR que encontrarás en la siguiente caja."
      }
    ],
    "patches": [
      {
        "source_id": "TXT_2_3ba969bcbd1f",
        "start": 72,
        "end": 79,
        "before": "Escanéa",
        "after": "Escanea",
        "publication_disposition": "eligible_if_bound_to_public_consumer"
      }
    ],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/50/literal/writer"
  },
  {
    "id": "TXT_2_0345c8892098",
    "action": "keep",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/51/literal/writer"
  },
  {
    "id": "EL_bcf16f585f54",
    "action": "replace",
    "writerText": "",
    "writerTextSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "segments": [],
    "patches": [],
    "source": "03_EDITORIAL/plan_cambios_origen.json",
    "jsonPointer": "/entries/81/literal/writer"
  }
] as const;

// Compatibility exports; the screen uses getWorld2Content(locale) each render.
export const world2IntegrationCopy = getWorld2Content("es").layers;
export const world2ReadoutCopy = getWorld2Content("es").readouts;
