export type Station5AreaId = "plantas" | "sistema" | "espacio" | "visitante";

export type Station5AreaContent = {
  id: Station5AreaId;
  order: number;
  title: string;
  accessibleLabel: string;
};

export const station5ContentApprovalStatus = "candidate" as const;

export const station5Areas: readonly Station5AreaContent[] = [
  {
    id: "plantas",
    order: 1,
    title: "Plantas",
    accessibleLabel: "Plantas, pregunta 1 de 4",
  },
  {
    id: "sistema",
    order: 2,
    title: "Sistema de escucha",
    accessibleLabel: "Sistema de escucha, pregunta 2 de 4",
  },
  {
    id: "espacio",
    order: 3,
    title: "Espacio",
    accessibleLabel: "Espacio, pregunta 3 de 4",
  },
  {
    id: "visitante",
    order: 4,
    title: "Visitante",
    accessibleLabel: "Visitante, pregunta 4 de 4",
  },
] as const;

export const station5Header = {
  eyebrow: "Sala V",
  title: "OKÚA, arte sensorial",
} as const;

export const station5PlantsCopy = {
  intro: "Las plantas abren el recorrido.",
  description: "Son seres vivos y el punto de partida de esta experiencia.",
  instruction: "Toca la hoja para reconocer su vitalidad.",
  leafAccessibleLabel: "Reconocer la vitalidad desde la hoja.",
  resolvedStatus: "Vitalidad reconocida en la planta.",
  resolvedDescription: "Las plantas sostienen el origen vivo del montaje.",
  returnLabel: "Volver al mapa",
  storageError: "No fue posible guardar el avance. Inténtalo de nuevo.",
  retryLabel: "Reintentar guardado",
} as const;

export const station5SystemCopy = {
  heading: "Sistema",
  intro: "Aquí, la técnica actúa como mediación.",
  lia: "El sistema media la señal; no reemplaza a la planta.",
  instruction: "Toca el conector para hacer visible la mediación.",
  actionAccessibleLabel:
    "Hacer visible la mediación desde el conector del sistema.",
  resolvedStatus: "Mediación visible.",
  resolvedDescription: "La técnica conecta el montaje sin ser su centro.",
  returnLabel: "Volver al mapa",
  spaceLocked: "Completa Sistema para habilitar Espacio.",
  storageError: "No fue posible guardar el avance. Inténtalo de nuevo.",
  retryLabel: "Reintentar guardado",
} as const;

export const station5SpaceCopy = {
  heading: "Espacio",
  lead: "OKÚA ocurre en un lugar, no solo en una pantalla o circuito.",
  instruction: "Toca el recorrido de madera.",
  actionAccessibleLabel: "Activar el recorrido de Espacio.",
  resolvedStatus: "Recorrido reconocido.",
  resolvedDescription:
    "El espacio convierte el sistema en una experiencia situada.",
  returnLabel: "Volver al mapa",
  storageError: "No fue posible guardar el avance. Inténtalo de nuevo.",
  retryLabel: "Reintentar guardado",
} as const;

export const station5VisitorCopy = {
  heading: "Visitante",
  lead: "Tú también haces parte del presente de OKÚA.",
  instruction: "Toca la presencia dentro del aro.",
  actionAccessibleLabel:
    "Reconocer la presencia del visitante dentro del recorrido.",
  resolvedStatus: "Presencia reconocida.",
  resolvedDescription:
    "La experiencia se completa cuando alguien la recorre, la escucha y la comprende.",
  returnLabel: "Volver al mapa",
  storageError: "No fue posible guardar el avance. Inténtalo de nuevo.",
  retryLabel: "Reintentar guardado",
} as const;

export const station5DeprecatedCopy = {
  W5_SISTEMA_ACTION: "DEPRECATED_NO_RENDER",
} as const;

export const station5FixedCta = "Ir al Mirador" as const;

// Writer source bound to the active question, feedback and point.
const answerPrompt = "Elige una respuesta.";
export const station5Questions: Record<
  Station5AreaId,
  {
    sourceId: string;
    title: string;
    question: string;
    instruction: string;
    agreement: string;
    disagreement: string;
    feedback: string;
    point: string;
  }
> = {
  plantas: {
    sourceId: "TXT_5_492e47aeb6b8",
    // OBS05: first-letter correction of writer title TXT_5_ac326cd04f19.
    title: "Plantas - trivia 1 de 4",
    question:
      "¿Son seres vivos capaces de relacionarse con su entorno y emitir señales?",
    instruction: answerPrompt,
    agreement: "Estoy de acuerdo",
    disagreement: "No estoy de acuerdo",
    feedback: "¡Correcto!",
    point: "Vitalidad reconocida en la planta. Tienes 1 punto",
  },
  sistema: {
    sourceId: "TXT_5_9b70a607a49a",
    title: "Sistema de escucha · Pregunta 2 de 4",
    question:
      "¿El sistema transforma el pulso vivo de la planta en sonidos musicales en directo?",
    instruction: answerPrompt,
    agreement: "Estoy de acuerdo",
    disagreement: "No estoy de acuerdo",
    feedback: "¡Correcto!",
    point: "Mediación reconocida. Tienes 1 punto.",
  },
  espacio: {
    sourceId: "TXT_5_3b6bbc87ed80",
    title: "Espacio · Pregunta 3 de 4",
    question:
      "¿OKÚA es una instalación interactiva que reúne arte, ciencia y tecnología para conectar al visitante con la naturaleza?",
    instruction: answerPrompt,
    agreement: "Estoy de acuerdo",
    disagreement: "No estoy de acuerdo",
    feedback:
      "¡Correcto! OKÚA convierte la biosonificación en una experiencia artística interactiva.",
    point: "Recorrido reconocido. Tienes 1 punto.",
  },
  visitante: {
    sourceId: "TXT_5_bfb7f09e357a",
    title: "Visitante · Pregunta 4 de 4",
    question: "¿Tú también haces parte de la obra?",
    instruction: answerPrompt,
    agreement: "Estoy de acuerdo",
    disagreement: "No estoy de acuerdo",
    feedback:
      "¡Correcto! La obra se completa cuando alguien la recorre, la escucha y la comprende.",
    point: "Presencia reconocida. Tienes 1 punto.",
  },
};
