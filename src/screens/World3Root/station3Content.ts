import type { Station3RecordId } from "../../domain/checkpoints/world3Checkpoint";

export type { Station3RecordId } from "../../domain/checkpoints/world3Checkpoint";

/**
 * Copy de Estación III — Cuaderno Pixel de Pruebas.
 * Fuente: docs/narrative/source_txt/05_estacion_iii_cuaderno_pixel_especificacion_v1.txt
 * (texto sugerido de la especificación aprobada). Sustituye a los TEMP de
 * world3EditorialSlots para esta estación; ver docs/status/GVO_STATION3_COMPLETE.md.
 */

export type Station3PlantNarrativeStep = {
  id: "observe" | "care" | "record";
  text: string;
  holdMs: number;
};

export type Station3PrototypeNarrativeStep = {
  id: "assembly" | "testing" | "learning";
  text: string;
  holdMs: number;
};

export type Station3SignalNarrativeStep = {
  id: "capturing" | "inspecting" | "evidence";
  text: string;
  holdMs: number;
};

export type Station3RecordContent = {
  id: Station3RecordId;
  order: 1 | 2 | 3;
  label: string;
  registro: string;
  accessibleLabel: string;
  indexCopy: string;
  pageTitle: string;
  fragments: readonly string[];
  marginNotes: readonly string[];
  confirmLabel: string;
  plantPage?: {
    narrativeSteps: readonly Station3PlantNarrativeStep[];
    registeredLabel: string;
    revisitLabel: string;
    editorialSource: "station3-content-spec";
  };
  prototypePage?: {
    narrativeSteps: readonly Station3PrototypeNarrativeStep[];
    registeredLabel: string;
    revisitLabel: string;
    editorialSource: "station3-content-spec";
  };
  signalPage?: {
    narrativeSteps: readonly Station3SignalNarrativeStep[];
    registeredLabel: string;
    revisitLabel: string;
    editorialSource: "station3-content-spec";
  };
};

const station3PlantNarrativeSteps = [
  {
    id: "observe",
    text: "La primera pista fue observar una planta viva.",
    holdMs: 3600,
  },
  {
    id: "care",
    text: "Antes de construir, había que mirar qué relación queríamos cuidar.",
    holdMs: 4200,
  },
  {
    id: "record",
    text: "Registrar lo observado ayudó a decidir qué construir después.",
    holdMs: 3800,
  },
] as const satisfies readonly Station3PlantNarrativeStep[];

const station3PrototypeNarrativeSteps = [
  {
    id: "assembly",
    text: "Después de observar, construimos un primer montaje.",
    holdMs: 3600,
  },
  {
    id: "testing",
    text: "Cada componente ayudó a probar cómo captar y cuidar la señal.",
    holdMs: 4300,
  },
  {
    id: "learning",
    text: "Lo que no funcionaba también dejó una pista para la siguiente versión.",
    holdMs: 4000,
  },
] as const satisfies readonly Station3PrototypeNarrativeStep[];

const station3SignalNarrativeSteps = [
  {
    id: "capturing",
    text: "Después del montaje, observamos la señal obtenida.",
    holdMs: 3600,
  },
  {
    id: "inspecting",
    text: "La variación mostró ruido, inestabilidad y límites.",
    holdMs: 4300,
  },
  {
    id: "evidence",
    text: "Cada cambio registrado indicó qué debía ajustarse después.",
    holdMs: 4000,
  },
] as const satisfies readonly Station3SignalNarrativeStep[];

export const station3Records: readonly Station3RecordContent[] = [
  {
    id: "planta",
    order: 1,
    label: "PLANTA",
    registro: "REGISTRO 01",
    accessibleLabel: "Registro 1 de 3. Planta.",
    indexCopy: "Observar lo vivo",
    pageTitle: "PLANTA",
    fragments: station3PlantNarrativeSteps.map((step) => step.text),
    marginNotes: [],
    confirmLabel: "Guardar registro",
    plantPage: {
      narrativeSteps: station3PlantNarrativeSteps,
      registeredLabel: "Pista registrada",
      revisitLabel: "Volver al índice",
      // Los slots W3_PLANTA_* continúan TEMP y no son equivalentes a 017E.
      editorialSource: "station3-content-spec",
    },
  },
  {
    id: "prototipo",
    order: 2,
    label: "PROTOTIPO",
    registro: "REGISTRO 02",
    accessibleLabel: "Registro 2 de 3. Prototipo.",
    indexCopy: "Construir y probar",
    pageTitle: "PROTOTIPO",
    fragments: station3PrototypeNarrativeSteps.map((step) => step.text),
    marginNotes: [],
    confirmLabel: "Guardar registro",
    prototypePage: {
      narrativeSteps: station3PrototypeNarrativeSteps,
      registeredLabel: "Pista registrada",
      revisitLabel: "Volver al índice",
      // Los slots W3_PROTOTIPO_* continúan TEMP y no equivalen al copy 017G.
      editorialSource: "station3-content-spec",
    },
  },
  {
    id: "senal",
    order: 3,
    label: "SEÑAL",
    registro: "REGISTRO 03",
    accessibleLabel: "Registro 3 de 3. Señal.",
    indexCopy: "Revisar la señal",
    pageTitle: "SEÑAL",
    fragments: station3SignalNarrativeSteps.map((step) => step.text),
    marginNotes: [],
    confirmLabel: "Guardar registro",
    signalPage: {
      narrativeSteps: station3SignalNarrativeSteps,
      registeredLabel: "Pista registrada",
      revisitLabel: "Volver al índice",
      // Los slots W3_SIGNAL_* continúan TEMP y no equivalen al copy 017H.
      editorialSource: "station3-content-spec",
    },
  },
] as const;

export const station3Lia = {
  intro:
    "Abramos el cuaderno de pruebas. Aquí veremos cómo OKÚA fue aprendiendo.",
  locked: "Primero revisemos la pista anterior.",
  lockedAlt: "Este registro tendrá sentido después del paso actual.",
  continueLocked: "Aún falta revisar una pista del cuaderno.",
  adjusted: "Cada prueba dejó una pista. Por eso el sistema se ajustó.",
  adjustedAlt: "No fue magia: fue prueba, error y ajuste.",
  revisit: "Puedes volver a revisar cualquier pista del cuaderno.",
} as const;

export const station3Stamp = {
  label: "AJUSTADO",
  accessibleLabel: "Proceso de pruebas ajustado.",
} as const;

export const station3Continue = {
  label: "Continuar",
  accessibleLabel: "Continuar a Mundo IV.",
} as const;
