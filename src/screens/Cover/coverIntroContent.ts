export const coverIntroText = {
  logo: "OKÚA",
  subtitle: "GUÍA VISUAL",
  archiveTitle: "EL ARCHIVO VIVO DE OKÚA",
  cta: "Comenzar recorrido",
  enterWorldOne: "Entrar a Mundo I",
  openingWorldOne: "Abriendo Mundo I: Raíz...",
  dialogueNext: "Siguiente",
  dialogueFinish: "Finalizar introducción",
} as const;

export const coverIntroTransitionText = {
  opening: "Abriendo Mundo I: Raíz...",
  preparing: "Preparando recorrido...",
  pending: "La transición visual final se integrará en una fase posterior.",
  continue: "Continuar a Mundo I",
} as const;

export const coverIntroWorldOnePlaceholderRoute = "/estacion/1";

export const coverIntroDialogues = [
  {
    id: "intro-01-presentation",
    liaPose: "greeting",
    text: "Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.",
  },
  {
    id: "intro-02-clarification",
    liaPose: "explainCalm",
    text: "Antes de entrar, aclaremos algo: las plantas no hacen música por sí solas.",
  },
  {
    id: "intro-03-mediation",
    liaPose: "explainCalm",
    text: "Lo que vas a recorrer es una mediación: una señal viva, una captura técnica y una interpretación.",
  },
  {
    id: "intro-04-order",
    liaPose: "explainCalm",
    text: "Primero seguiremos el orden de los mundos. Al final podrás volver libremente a cualquier estación.",
  },
  {
    id: "intro-05-root",
    liaPose: "pointPortal1",
    text: "Empecemos por la raíz: el origen y el propósito de OKÚA.",
  },
] as const;

export const coverIntroPortals = [
  {
    id: "portal-1",
    world: 1,
    roman: "I",
    title: "Estación I — Mundo I: Raíz",
    state: "available",
    ariaLabel: "Estación I, Mundo Raíz, disponible.",
    reviewAriaLabel: "Estación I, Mundo Raíz, disponible para revisar.",
  },
  {
    id: "portal-2",
    world: 2,
    roman: "II",
    title: "Estación II — Mundo II: Lía y el pulso invisible",
    state: "locked",
    ariaLabel: "Estación II, bloqueada hasta completar Mundo I.",
    reviewAriaLabel:
      "Estación II, Mundo Lía y el pulso invisible, disponible para revisar.",
  },
  {
    id: "portal-3",
    world: 3,
    roman: "III",
    title: "Estación III — Mundo III: Cuaderno de pruebas",
    state: "locked",
    ariaLabel: "Estación III, bloqueada hasta avanzar en el recorrido.",
    reviewAriaLabel:
      "Estación III, Mundo Cuaderno de pruebas, disponible para revisar.",
  },
  {
    id: "portal-4",
    world: 4,
    roman: "IV",
    title: "Estación IV — Mundo IV: Mesa de sistema",
    state: "locked",
    ariaLabel: "Estación IV, bloqueada hasta conocer la mediación.",
    reviewAriaLabel:
      "Estación IV, Mundo Mesa de sistema, disponible para revisar.",
  },
  {
    id: "portal-5",
    world: 5,
    roman: "V",
    title: "Estación V — Mundo V: Mapa del presente",
    state: "locked",
    ariaLabel: "Estación V, bloqueada hasta el final del recorrido.",
    reviewAriaLabel:
      "Estación V, Mundo Mapa del presente, disponible para revisar.",
  },
] as const;

export type CoverIntroPortal = (typeof coverIntroPortals)[number];

export const lockedPortalMessages = {
  "portal-2":
    "Primero debemos entrar por Raíz. Después llegaremos al pulso invisible.",
  "portal-3":
    "Ese mundo se desbloquea más adelante. Antes necesitamos entender el origen y la señal.",
  "portal-4":
    "La operación técnica tendrá sentido cuando ya conozcas la mediación.",
  "portal-5": "El presente se entiende mejor al final del recorrido.",
} as const;

export type CoverIntroDialogue = (typeof coverIntroDialogues)[number];
export type CoverIntroDialoguePose = CoverIntroDialogue["liaPose"];
export type LockedPortalId = keyof typeof lockedPortalMessages;
