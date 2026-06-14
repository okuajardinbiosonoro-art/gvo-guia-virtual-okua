import type {
  EditorialEmitter,
  EditorialRegistry,
  EditorialTextEntry,
} from "./editorialTypes";

const excelPendingNote =
  "TEMP editable: reemplazar por texto final desde Excel editorial.";

type TemporaryEntryInput<SlotId extends string> = {
  emitter: EditorialEmitter;
  notes?: string;
  shortText?: string;
  slotId: SlotId;
  text: string;
};

function temporaryEsEntry<SlotId extends string>({
  emitter,
  notes = excelPendingNote,
  shortText,
  slotId,
  text,
}: TemporaryEntryInput<SlotId>): EditorialTextEntry<SlotId> {
  return {
    emitter,
    locale: "es",
    notes,
    shortText,
    slotId,
    source: "temporary",
    status: "TEMP",
    text,
  };
}

export const editorialRegistry = {
  TRANS_W1_W2_TITLE_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      notes: "TEMP de transición W1→W2; reemplazar por Excel editorial.",
      shortText: "Abriendo Mundo II",
      slotId: "TRANS_W1_W2_TITLE_01",
      text: "Abriendo Mundo II",
    }),
  },
  TRANS_W1_W2_SUB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      notes: "TEMP de transición W1→W2; reemplazar por Excel editorial.",
      shortText: "Pulso invisible",
      slotId: "TRANS_W1_W2_SUB_01",
      text: "Preparando el pulso invisible.",
    }),
  },
  TRANS_W2_W3_TITLE_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      notes: "TEMP de transición W2→W3; reemplazar por Excel editorial.",
      shortText: "Abriendo Mundo III",
      slotId: "TRANS_W2_W3_TITLE_01",
      text: "TEMP — Abriendo Mundo III",
    }),
  },
  TRANS_W2_W3_SUB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      notes: "TEMP de transición W2→W3; reemplazar por Excel editorial.",
      shortText: "Cuaderno de pruebas",
      slotId: "TRANS_W2_W3_SUB_01",
      text: "TEMP — Preparando el cuaderno de pruebas y ajustes.",
    }),
  },
  W2_INTRO_LIA_01: {
    es: temporaryEsEntry({
      emitter: "lia",
      shortText: "Intro de Lía",
      slotId: "W2_INTRO_LIA_01",
      text: "TEMP — Entremos al pulso invisible de la planta.",
    }),
  },
  W2_INTRO_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Contexto de señal",
      slotId: "W2_INTRO_AMB_01",
      text: "TEMP — Aquí la señal aún no es sonido: primero debe ser cuidada.",
    }),
  },
  W2_ACCESSIBLE_SCENE_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Escena accesible",
      slotId: "W2_ACCESSIBLE_SCENE_01",
      text: "TEMP — Escena interactiva con seis capas: planta viva, señal, captura, acondicionamiento, mapeo y resultado mediado.",
    }),
  },
  W2_PLANTA_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Planta viva",
      slotId: "W2_PLANTA_HINT_01",
      text: "TEMP — Observa la planta viva como origen de la señal.",
    }),
  },
  W2_PLANTA_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Origen vivo",
      slotId: "W2_PLANTA_AMB_01",
      text: "TEMP — La lectura comienza en un organismo vivo, no en un archivo de audio.",
    }),
  },
  W2_PLANTA_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Confirmar planta",
      slotId: "W2_PLANTA_CONFIRM_01",
      text: "TEMP — Confirmar origen vivo.",
    }),
  },
  W2_ACCESSIBLE_PLANTA_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible planta",
      slotId: "W2_ACCESSIBLE_PLANTA_01",
      text: "TEMP — Capa uno: planta viva como origen de una variación bioeléctrica.",
    }),
  },
  W2_SENAL_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Señal",
      slotId: "W2_SENAL_HINT_01",
      text: "TEMP — Sigue la señal antes de convertirla en experiencia.",
    }),
  },
  W2_SENAL_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Señal sensible",
      slotId: "W2_SENAL_AMB_01",
      text: "TEMP — La señal necesita cuidado para no confundirse con música directa.",
    }),
  },
  W2_SENAL_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Confirmar señal",
      slotId: "W2_SENAL_CONFIRM_01",
      text: "TEMP — Confirmar señal observada.",
    }),
  },
  W2_ACCESSIBLE_SENAL_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible señal",
      slotId: "W2_ACCESSIBLE_SENAL_01",
      text: "TEMP — Capa dos: señal bioeléctrica previa a cualquier interpretación.",
    }),
  },
  W2_CAPTURA_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Captura",
      slotId: "W2_CAPTURA_HINT_01",
      text: "TEMP — Revisa cómo el sistema recibe la variación.",
    }),
  },
  W2_CAPTURA_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Recepción",
      slotId: "W2_CAPTURA_AMB_01",
      text: "TEMP — Capturar no significa traducir todavía: solo abre una entrada de lectura.",
    }),
  },
  W2_CAPTURA_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Confirmar captura",
      slotId: "W2_CAPTURA_CONFIRM_01",
      text: "TEMP — Confirmar captura temporal.",
    }),
  },
  W2_ACCESSIBLE_CAPTURA_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible captura",
      slotId: "W2_ACCESSIBLE_CAPTURA_01",
      text: "TEMP — Capa tres: captura controlada de la variación recibida.",
    }),
  },
  W2_ACONDICIONAMIENTO_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Acondicionamiento",
      slotId: "W2_ACONDICIONAMIENTO_HINT_01",
      text: "TEMP — Prepara la señal antes de interpretarla.",
    }),
  },
  W2_ACONDICIONAMIENTO_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Preparación",
      slotId: "W2_ACONDICIONAMIENTO_AMB_01",
      text: "TEMP — La preparación reduce ruido conceptual antes de mapear el dato.",
    }),
  },
  W2_ACONDICIONAMIENTO_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Confirmar acondicionamiento",
      slotId: "W2_ACONDICIONAMIENTO_CONFIRM_01",
      text: "TEMP — Confirmar señal preparada.",
    }),
  },
  W2_ACCESSIBLE_ACONDICIONAMIENTO_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible acondicionamiento",
      slotId: "W2_ACCESSIBLE_ACONDICIONAMIENTO_01",
      text: "TEMP — Capa cuatro: acondicionamiento de la señal antes de interpretarla.",
    }),
  },
  W2_MAPEO_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Mapeo",
      slotId: "W2_MAPEO_HINT_01",
      text: "TEMP — Mira cómo los datos encuentran una forma legible.",
    }),
  },
  W2_MAPEO_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Forma legible",
      slotId: "W2_MAPEO_AMB_01",
      text: "TEMP — El mapeo organiza cambios para que puedan ser percibidos con cuidado.",
    }),
  },
  W2_MAPEO_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Confirmar mapeo",
      slotId: "W2_MAPEO_CONFIRM_01",
      text: "TEMP — Confirmar mapeo temporal.",
    }),
  },
  W2_ACCESSIBLE_MAPEO_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible mapeo",
      slotId: "W2_ACCESSIBLE_MAPEO_01",
      text: "TEMP — Capa cinco: mapeo de datos hacia una forma legible.",
    }),
  },
  W2_RESULTADO_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Resultado mediado",
      slotId: "W2_RESULTADO_HINT_01",
      text: "TEMP — Reconoce el resultado como una mediación, no como canto directo.",
    }),
  },
  W2_RESULTADO_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Mediación",
      slotId: "W2_RESULTADO_AMB_01",
      text: "TEMP — El resultado ayuda a entender una señal; no reemplaza a la planta.",
    }),
  },
  W2_RESULTADO_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Confirmar resultado",
      slotId: "W2_RESULTADO_CONFIRM_01",
      text: "TEMP — Confirmar resultado mediado.",
    }),
  },
  W2_ACCESSIBLE_RESULTADO_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible resultado",
      slotId: "W2_ACCESSIBLE_RESULTADO_01",
      text: "TEMP — Capa seis: resultado mediado de una señal preparada e interpretada.",
    }),
  },
  W2_LAYER_LOCKED_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Capa bloqueada",
      slotId: "W2_LAYER_LOCKED_01",
      text: "TEMP — Esta capa se abre al completar la anterior.",
    }),
  },
  W2_LAYER_REPEAT_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Relectura",
      slotId: "W2_LAYER_REPEAT_01",
      text: "TEMP — Puedes releer esta capa sin reiniciar el recorrido.",
    }),
  },
  W2_COMPLETE_LIA_01: {
    es: temporaryEsEntry({
      emitter: "lia",
      shortText: "Cierre de Lía",
      slotId: "W2_COMPLETE_LIA_01",
      text: "TEMP — El pulso ya tiene un camino para ser entendido.",
    }),
  },
  W2_COMPLETE_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Cierre ambiente",
      slotId: "W2_COMPLETE_AMB_01",
      text: "TEMP — La experiencia queda lista para continuar cuando exista la siguiente estación.",
    }),
  },
  W2_CONTINUE_BTN_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Continuar",
      slotId: "W2_CONTINUE_BTN_01",
      text: "Continuar",
    }),
  },
  W3_INTRO_LIA_01: {
    es: temporaryEsEntry({
      emitter: "lia",
      shortText: "Intro Mundo III",
      slotId: "W3_INTRO_LIA_01",
      text: "TEMP — Este cuaderno guarda pruebas, errores y ajustes del sistema.",
    }),
  },
  W3_INTRO_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Pruebas y pistas",
      slotId: "W3_INTRO_AMB_01",
      text: "TEMP — Nada aparece terminado desde el inicio: cada señal deja una pista.",
    }),
  },
  W3_ACCESSIBLE_SCENE_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Escena accesible Mundo III",
      slotId: "W3_ACCESSIBLE_SCENE_01",
      text: "TEMP — Entrada visual a Mundo III, presentado como un cuaderno de revisión y prototipos.",
    }),
  },
} as const satisfies EditorialRegistry;

export type EditorialSlotId = keyof typeof editorialRegistry;
