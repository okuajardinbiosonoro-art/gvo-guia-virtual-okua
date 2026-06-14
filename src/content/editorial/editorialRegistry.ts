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
  TRANS_W3_W4_TITLE_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      notes: "TEMP de transición W3→W4; reemplazar por Excel editorial.",
      shortText: "Abriendo Mundo IV",
      slotId: "TRANS_W3_W4_TITLE_01",
      text: "TEMP — Abriendo Mundo IV",
    }),
  },
  TRANS_W3_W4_SUB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      notes: "TEMP de transición W3→W4; prepara entrada base de Mundo IV.",
      shortText: "Mesa del sistema",
      slotId: "TRANS_W3_W4_SUB_01",
      text: "TEMP — Preparando la mesa del sistema.",
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
  W3_PLANTA_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Planta inicial",
      slotId: "W3_PLANTA_HINT_01",
      text: "TEMP — Empieza por la planta que originó la prueba.",
    }),
  },
  W3_PLANTA_NOTE_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Observación inicial",
      slotId: "W3_PLANTA_NOTE_01",
      text: "TEMP — La observación inicial muestra dónde puede comenzar el ajuste.",
    }),
  },
  W3_PLANTA_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Abrir registro",
      slotId: "W3_PLANTA_CONFIRM_01",
      text: "TEMP — Primer registro abierto.",
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
  W3_ACCESSIBLE_PLANTA_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible planta",
      slotId: "W3_ACCESSIBLE_PLANTA_01",
      text: "TEMP — Bloque planta: observación inicial que abre una prueba ajustable.",
    }),
  },
  W3_PROTOTIPO_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Prototipo",
      slotId: "W3_PROTOTIPO_HINT_01",
      text: "TEMP — Revisa el prototipo como una versión en construcción.",
    }),
  },
  W3_PROTOTIPO_NOTE_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Versión en prueba",
      slotId: "W3_PROTOTIPO_NOTE_01",
      text: "TEMP — Un prototipo no demuestra perfección: permite probar.",
    }),
  },
  W3_PROTOTIPO_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Prototipo revisado",
      slotId: "W3_PROTOTIPO_CONFIRM_01",
      text: "TEMP — Prototipo revisado.",
    }),
  },
  W3_ACCESSIBLE_PROTOTIPO_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible prototipo",
      slotId: "W3_ACCESSIBLE_PROTOTIPO_01",
      text: "TEMP — Bloque prototipo: versión temporal que se revisa antes de corregir.",
    }),
  },
  W3_SENAL_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Señal",
      slotId: "W3_SENAL_HINT_01",
      text: "TEMP — Mira cómo la señal obliga a corregir el camino.",
    }),
  },
  W3_SENAL_NOTE_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Escucha conceptual",
      slotId: "W3_SENAL_NOTE_01",
      text: "TEMP — La lectura cambia cuando el sistema aprende a escuchar mejor.",
    }),
  },
  W3_SENAL_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Señal registrada",
      slotId: "W3_SENAL_CONFIRM_01",
      text: "TEMP — Señal registrada.",
    }),
  },
  W3_ACCESSIBLE_SENAL_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible señal",
      slotId: "W3_ACCESSIBLE_SENAL_01",
      text: "TEMP — Bloque señal: registro que muestra por qué el prototipo necesita ajuste.",
    }),
  },
  W3_AJUSTADO_HINT_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Ajustado",
      slotId: "W3_AJUSTADO_HINT_01",
      text: "TEMP — Observa el ajuste que ordena la prueba.",
    }),
  },
  W3_AJUSTADO_AMB_01: {
    es: temporaryEsEntry({
      emitter: "ambiente",
      shortText: "Error integrado",
      slotId: "W3_AJUSTADO_AMB_01",
      text: "TEMP — El sistema mejora porque acepta el error como parte del recorrido.",
    }),
  },
  W3_AJUSTADO_CONFIRM_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Ajuste integrado",
      slotId: "W3_AJUSTADO_CONFIRM_01",
      text: "TEMP — Ajuste integrado.",
    }),
  },
  W3_ACCESSIBLE_AJUSTADO_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Accesible ajustado",
      slotId: "W3_ACCESSIBLE_AJUSTADO_01",
      text: "TEMP — Bloque ajustado: cierre temporal de una prueba que incorpora error y corrección.",
    }),
  },
  W3_BLOCK_LOCKED_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Bloque bloqueado",
      slotId: "W3_BLOCK_LOCKED_01",
      text: "TEMP — Antes de abrir este bloque, revisa el paso anterior.",
    }),
  },
  W3_BLOCK_REPEAT_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Repetir registro",
      slotId: "W3_BLOCK_REPEAT_01",
      text: "TEMP — Puedes volver a mirar este registro antes de continuar.",
    }),
  },
  W3_COMPLETE_LIA_01: {
    es: temporaryEsEntry({
      emitter: "lia",
      shortText: "Cierre Mundo III",
      slotId: "W3_COMPLETE_LIA_01",
      text: "TEMP — El cuaderno ya muestra cómo una prueba se transforma en ajuste.",
    }),
  },
  W3_CONTINUE_BTN_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Continuar",
      slotId: "W3_CONTINUE_BTN_01",
      text: "Continuar",
    }),
  },
  W4_INTRO_LIA_01: {
    es: temporaryEsEntry({
      emitter: "lia",
      shortText: "Intro Mundo IV",
      slotId: "W4_INTRO_LIA_01",
      text: "TEMP — Aquí veremos cómo la señal recorre el sistema completo.",
    }),
  },
  W4_INTRO_SYS_01: {
    es: temporaryEsEntry({
      emitter: "sistema",
      shortText: "Cadena técnica",
      slotId: "W4_INTRO_SYS_01",
      text: "TEMP — La cadena conecta planta, bionosificador, ESP32, MIDI, Wi-Fi/UDP, router, sistema central y sonido.",
    }),
  },
  W4_ACCESSIBLE_SCENE_01: {
    es: temporaryEsEntry({
      emitter: "interfaz",
      shortText: "Escena accesible Mundo IV",
      slotId: "W4_ACCESSIBLE_SCENE_01",
      text: "TEMP — Entrada visual a Mundo IV, presentada como una mesa técnica con ocho nodos ordenados.",
    }),
  },
} as const satisfies EditorialRegistry;

export type EditorialSlotId = keyof typeof editorialRegistry;
