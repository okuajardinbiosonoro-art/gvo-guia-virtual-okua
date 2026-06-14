export type World2EditorialSlotId =
  | "W2_INTRO_LIA_01"
  | "W2_INTRO_AMB_01"
  | "W2_ACCESSIBLE_SCENE_01"
  | "W2_PLANTA_HINT_01"
  | "W2_PLANTA_AMB_01"
  | "W2_PLANTA_CONFIRM_01"
  | "W2_ACCESSIBLE_PLANTA_01"
  | "W2_SENAL_HINT_01"
  | "W2_SENAL_AMB_01"
  | "W2_SENAL_CONFIRM_01"
  | "W2_ACCESSIBLE_SENAL_01"
  | "W2_CAPTURA_HINT_01"
  | "W2_CAPTURA_AMB_01"
  | "W2_CAPTURA_CONFIRM_01"
  | "W2_ACCESSIBLE_CAPTURA_01"
  | "W2_ACONDICIONAMIENTO_HINT_01"
  | "W2_ACONDICIONAMIENTO_AMB_01"
  | "W2_ACONDICIONAMIENTO_CONFIRM_01"
  | "W2_ACCESSIBLE_ACONDICIONAMIENTO_01"
  | "W2_MAPEO_HINT_01"
  | "W2_MAPEO_AMB_01"
  | "W2_MAPEO_CONFIRM_01"
  | "W2_ACCESSIBLE_MAPEO_01"
  | "W2_RESULTADO_HINT_01"
  | "W2_RESULTADO_AMB_01"
  | "W2_RESULTADO_CONFIRM_01"
  | "W2_ACCESSIBLE_RESULTADO_01"
  | "W2_LAYER_LOCKED_01"
  | "W2_LAYER_REPEAT_01"
  | "W2_COMPLETE_LIA_01"
  | "W2_COMPLETE_AMB_01"
  | "W2_CONTINUE_BTN_01";

type World2EditorialSlot = {
  emitter: "ambiente" | "interfaz" | "lia" | "sistema";
  notes: string;
  shortText?: string;
  slotId: World2EditorialSlotId;
  status: "TEMP";
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

const excelPendingNote =
  "TEMP editable: reemplazar por texto final desde Excel editorial.";

export const world2EditorialSlots = {
  W2_INTRO_LIA_01: {
    emitter: "lia",
    notes: excelPendingNote,
    shortText: "Intro de Lía",
    slotId: "W2_INTRO_LIA_01",
    status: "TEMP",
    text: "TEMP — Entremos al pulso invisible de la planta.",
  },
  W2_INTRO_AMB_01: {
    emitter: "ambiente",
    notes: excelPendingNote,
    shortText: "Contexto de señal",
    slotId: "W2_INTRO_AMB_01",
    status: "TEMP",
    text: "TEMP — Aquí la señal aún no es sonido: primero debe ser cuidada.",
  },
  W2_ACCESSIBLE_SCENE_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Escena accesible",
    slotId: "W2_ACCESSIBLE_SCENE_01",
    status: "TEMP",
    text: "TEMP — Escena interactiva con seis capas: planta viva, señal, captura, acondicionamiento, mapeo y resultado mediado.",
  },
  W2_PLANTA_HINT_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Planta viva",
    slotId: "W2_PLANTA_HINT_01",
    status: "TEMP",
    text: "TEMP — Observa la planta viva como origen de la señal.",
  },
  W2_PLANTA_AMB_01: {
    emitter: "ambiente",
    notes: excelPendingNote,
    shortText: "Origen vivo",
    slotId: "W2_PLANTA_AMB_01",
    status: "TEMP",
    text: "TEMP — La lectura comienza en un organismo vivo, no en un archivo de audio.",
  },
  W2_PLANTA_CONFIRM_01: {
    emitter: "sistema",
    notes: excelPendingNote,
    shortText: "Confirmar planta",
    slotId: "W2_PLANTA_CONFIRM_01",
    status: "TEMP",
    text: "TEMP — Confirmar origen vivo.",
  },
  W2_ACCESSIBLE_PLANTA_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Accesible planta",
    slotId: "W2_ACCESSIBLE_PLANTA_01",
    status: "TEMP",
    text: "TEMP — Capa uno: planta viva como origen de una variación bioeléctrica.",
  },
  W2_SENAL_HINT_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Señal",
    slotId: "W2_SENAL_HINT_01",
    status: "TEMP",
    text: "TEMP — Sigue la señal antes de convertirla en experiencia.",
  },
  W2_SENAL_AMB_01: {
    emitter: "ambiente",
    notes: excelPendingNote,
    shortText: "Señal sensible",
    slotId: "W2_SENAL_AMB_01",
    status: "TEMP",
    text: "TEMP — La señal necesita cuidado para no confundirse con música directa.",
  },
  W2_SENAL_CONFIRM_01: {
    emitter: "sistema",
    notes: excelPendingNote,
    shortText: "Confirmar señal",
    slotId: "W2_SENAL_CONFIRM_01",
    status: "TEMP",
    text: "TEMP — Confirmar señal observada.",
  },
  W2_ACCESSIBLE_SENAL_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Accesible señal",
    slotId: "W2_ACCESSIBLE_SENAL_01",
    status: "TEMP",
    text: "TEMP — Capa dos: señal bioeléctrica previa a cualquier interpretación.",
  },
  W2_CAPTURA_HINT_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Captura",
    slotId: "W2_CAPTURA_HINT_01",
    status: "TEMP",
    text: "TEMP — Revisa cómo el sistema recibe la variación.",
  },
  W2_CAPTURA_AMB_01: {
    emitter: "ambiente",
    notes: excelPendingNote,
    shortText: "Recepción",
    slotId: "W2_CAPTURA_AMB_01",
    status: "TEMP",
    text: "TEMP — Capturar no significa traducir todavía: solo abre una entrada de lectura.",
  },
  W2_CAPTURA_CONFIRM_01: {
    emitter: "sistema",
    notes: excelPendingNote,
    shortText: "Confirmar captura",
    slotId: "W2_CAPTURA_CONFIRM_01",
    status: "TEMP",
    text: "TEMP — Confirmar captura temporal.",
  },
  W2_ACCESSIBLE_CAPTURA_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Accesible captura",
    slotId: "W2_ACCESSIBLE_CAPTURA_01",
    status: "TEMP",
    text: "TEMP — Capa tres: captura controlada de la variación recibida.",
  },
  W2_ACONDICIONAMIENTO_HINT_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Acondicionamiento",
    slotId: "W2_ACONDICIONAMIENTO_HINT_01",
    status: "TEMP",
    text: "TEMP — Prepara la señal antes de interpretarla.",
  },
  W2_ACONDICIONAMIENTO_AMB_01: {
    emitter: "ambiente",
    notes: excelPendingNote,
    shortText: "Preparación",
    slotId: "W2_ACONDICIONAMIENTO_AMB_01",
    status: "TEMP",
    text: "TEMP — La preparación reduce ruido conceptual antes de mapear el dato.",
  },
  W2_ACONDICIONAMIENTO_CONFIRM_01: {
    emitter: "sistema",
    notes: excelPendingNote,
    shortText: "Confirmar acondicionamiento",
    slotId: "W2_ACONDICIONAMIENTO_CONFIRM_01",
    status: "TEMP",
    text: "TEMP — Confirmar señal preparada.",
  },
  W2_ACCESSIBLE_ACONDICIONAMIENTO_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Accesible acondicionamiento",
    slotId: "W2_ACCESSIBLE_ACONDICIONAMIENTO_01",
    status: "TEMP",
    text: "TEMP — Capa cuatro: acondicionamiento de la señal antes de interpretarla.",
  },
  W2_MAPEO_HINT_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Mapeo",
    slotId: "W2_MAPEO_HINT_01",
    status: "TEMP",
    text: "TEMP — Mira cómo los datos encuentran una forma legible.",
  },
  W2_MAPEO_AMB_01: {
    emitter: "ambiente",
    notes: excelPendingNote,
    shortText: "Forma legible",
    slotId: "W2_MAPEO_AMB_01",
    status: "TEMP",
    text: "TEMP — El mapeo organiza cambios para que puedan ser percibidos con cuidado.",
  },
  W2_MAPEO_CONFIRM_01: {
    emitter: "sistema",
    notes: excelPendingNote,
    shortText: "Confirmar mapeo",
    slotId: "W2_MAPEO_CONFIRM_01",
    status: "TEMP",
    text: "TEMP — Confirmar mapeo temporal.",
  },
  W2_ACCESSIBLE_MAPEO_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Accesible mapeo",
    slotId: "W2_ACCESSIBLE_MAPEO_01",
    status: "TEMP",
    text: "TEMP — Capa cinco: mapeo de datos hacia una forma legible.",
  },
  W2_RESULTADO_HINT_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Resultado mediado",
    slotId: "W2_RESULTADO_HINT_01",
    status: "TEMP",
    text: "TEMP — Reconoce el resultado como una mediación, no como canto directo.",
  },
  W2_RESULTADO_AMB_01: {
    emitter: "ambiente",
    notes: excelPendingNote,
    shortText: "Mediación",
    slotId: "W2_RESULTADO_AMB_01",
    status: "TEMP",
    text: "TEMP — El resultado ayuda a entender una señal; no reemplaza a la planta.",
  },
  W2_RESULTADO_CONFIRM_01: {
    emitter: "sistema",
    notes: excelPendingNote,
    shortText: "Confirmar resultado",
    slotId: "W2_RESULTADO_CONFIRM_01",
    status: "TEMP",
    text: "TEMP — Confirmar resultado mediado.",
  },
  W2_ACCESSIBLE_RESULTADO_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Accesible resultado",
    slotId: "W2_ACCESSIBLE_RESULTADO_01",
    status: "TEMP",
    text: "TEMP — Capa seis: resultado mediado de una señal preparada e interpretada.",
  },
  W2_LAYER_LOCKED_01: {
    emitter: "sistema",
    notes: excelPendingNote,
    shortText: "Capa bloqueada",
    slotId: "W2_LAYER_LOCKED_01",
    status: "TEMP",
    text: "TEMP — Esta capa se abre al completar la anterior.",
  },
  W2_LAYER_REPEAT_01: {
    emitter: "sistema",
    notes: excelPendingNote,
    shortText: "Relectura",
    slotId: "W2_LAYER_REPEAT_01",
    status: "TEMP",
    text: "TEMP — Puedes releer esta capa sin reiniciar el recorrido.",
  },
  W2_COMPLETE_LIA_01: {
    emitter: "lia",
    notes: excelPendingNote,
    shortText: "Cierre de Lía",
    slotId: "W2_COMPLETE_LIA_01",
    status: "TEMP",
    text: "TEMP — El pulso ya tiene un camino para ser entendido.",
  },
  W2_COMPLETE_AMB_01: {
    emitter: "ambiente",
    notes: excelPendingNote,
    shortText: "Cierre ambiente",
    slotId: "W2_COMPLETE_AMB_01",
    status: "TEMP",
    text: "TEMP — La experiencia queda lista para continuar cuando exista la siguiente estación.",
  },
  W2_CONTINUE_BTN_01: {
    emitter: "interfaz",
    notes: excelPendingNote,
    shortText: "Continuar",
    slotId: "W2_CONTINUE_BTN_01",
    status: "TEMP",
    text: "Continuar",
  },
} as const satisfies Record<World2EditorialSlotId, World2EditorialSlot>;

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
