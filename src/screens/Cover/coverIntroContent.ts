import { ROOM_HEADINGS, ROOM_NAMES } from "../../content/roomNames";

export const coverIntroText = {
  logo: "OKÚA",
  subtitle: "JARDÍN BIOSONORO",
  archiveTitle: "Exposición Interactiva",
  cta: "Empieza aquí",
  enterWorldOne: "Entrar a Sala I",
  openingWorldOne: "Abriendo Sala I · Raíz",
  dialogueNext: "Siguiente",
  dialogueFinish: "¡Adelante!",
} as const;

export const coverIntroTransitionText = {
  opening: "Abriendo Sala I · Raíz",
  preparing: "Preparando tu recorrido",
  pending: "La transición visual final se integrará en una fase posterior.",
  continue: "Continuar a Sala I",
} as const;

export const coverIntroWorldOnePlaceholderRoute = "/estacion/1";

export const coverIntroRouteHelp = "Recorreremos las salas en orden. Al final podrás volver a cualquiera.";

export const coverIntroDialogues = [
  {
    id: "intro-01-presentation",
    stepId: "saludo",
    liaPose: "greeting",
    text: "Hola soy Lía, tu guía virtual. Te estaré acompañando en este mágico recorrido.",
    sourceIds: ["TXT_portada_f3151772c877"],
    en: "Hello, I’m Lía, your virtual guide. I’ll be accompanying you on this magical journey.",
  },
  {
    id: "intro-02-clarification",
    stepId: "cinco_salas_y_proposito",
    liaPose: "explainCalm",
    text: "Podrás visitar nuestras cinco salas interactivas, aprender, conectar con las plantas y la Sinfonía de la Vida.",
    sourceIds: ["TXT_portada_bedf033bdb26", "TXT_portada_02f65084352d"],
    en: "You’ll be able to visit our 5 interactive rooms, learn, connect with plants and the Symphony of Life.",
  },
  {
    id: "intro-03-order",
    stepId: "orden_y_revisita",
    liaPose: "explainCalm",
    text: "Primero seguiremos el orden de las salas. Al final podrás volver libremente a cualquiera de ellas.",
    sourceIds: ["TXT_portada_3d12461299b8"],
    en: "First, we’ll follow the rooms in order. At the end, you’ll be free to return to any of them.",
  },
  {
    id: "intro-05-root",
    stepId: "raiz",
    liaPose: "pointPortal1",
    text: "Nuestro viaje empieza desde la Raíz. ¡Adelante!",
    sourceIds: ["TXT_portada_aec52aadd67c"],
    en: "Our journey begins at the Root. Let’s go!",
  },
] as const;

export const coverIntroCopyByLocale = {
  es: {
    ...coverIntroText,
    dialogueLabel: "Diálogo de Lía", nextLabel: "Siguiente diálogo de Lía",
    step: (index: number) => `Paso ${index + 1} de 4`,
    portalLocked: "Sala I · Raíz. Termina la presentación para abrir el portal.",
    portalReady: "Sala I · Raíz, lista para abrir.",
    portalAnnouncement: "El portal de Sala I está listo. Tócalo para entrar.",
    saving: "Guardando…", retry: "Reintentar guardado",
    saveError: "No fue posible guardar este paso. Reintenta para continuar.",
    unavailable: "No fue posible comenzar el cruce. Reintenta en el portal.",
    liaAlt: "Lía, guía visual de OKÚA", scene: "Jardín Biosonoro OKÚA", portals: "Portales del recorrido",
  },
  en: {
    logo: "OKÚA", subtitle: "BIOSONIC GARDEN", archiveTitle: "Interactive Exhibition",
    cta: "Start here", enterWorldOne: "Enter Room I", openingWorldOne: "Opening Room I · Root",
    dialogueNext: "Next", dialogueFinish: "Let’s go!", dialogueLabel: "Lía’s dialogue", nextLabel: "Lía’s next dialogue",
    step: (index: number) => `Step ${index + 1} of 4`,
    portalLocked: "Room I · Root. Complete the introduction to open the portal.",
    portalReady: "Room I · Root, ready to open.",
    portalAnnouncement: "The portal to Room I is ready. Tap it to enter.",
    saving: "Saving…", retry: "Retry saving",
    saveError: "This step could not be saved. Retry to continue.",
    unavailable: "The crossing could not be started. Try the portal again.",
    liaAlt: "Lía, OKÚA’s visual guide", scene: "OKÚA Biosonic Garden", portals: "Journey portals",
  },
} as const;

export const coverIntroPortals = [
  {
    id: "portal-1",
    world: 1,
    roman: "I",
    title: ROOM_HEADINGS[1],
    state: "available",
    ariaLabel: `${ROOM_HEADINGS[1]}, disponible.`,
    reviewAriaLabel: `Revisar Sala I · ${ROOM_NAMES[1]}`,
  },
  {
    id: "portal-2",
    world: 2,
    roman: "II",
    title: ROOM_HEADINGS[2],
    state: "locked",
    ariaLabel: `${ROOM_HEADINGS[2]}, disponible al revisar el recorrido.`,
    reviewAriaLabel: `Revisar Sala II · ${ROOM_NAMES[2]}`,
  },
  {
    id: "portal-3",
    world: 3,
    roman: "III",
    title: ROOM_HEADINGS[3],
    state: "locked",
    ariaLabel: `${ROOM_HEADINGS[3]}, disponible al revisar el recorrido.`,
    reviewAriaLabel: `Revisar Sala III · ${ROOM_NAMES[3]}`,
  },
  {
    id: "portal-4",
    world: 4,
    roman: "IV",
    title: ROOM_HEADINGS[4],
    state: "locked",
    ariaLabel: `${ROOM_HEADINGS[4]}, disponible al revisar el recorrido.`,
    reviewAriaLabel: `Revisar Sala IV · ${ROOM_NAMES[4]}`,
  },
  {
    id: "portal-5",
    world: 5,
    roman: "V",
    title: ROOM_HEADINGS[5],
    state: "locked",
    ariaLabel: `${ROOM_HEADINGS[5]}, disponible al revisar el recorrido.`,
    reviewAriaLabel: `Revisar Sala V · ${ROOM_NAMES[5]}`,
  },
] as const;

export type CoverIntroPortal = (typeof coverIntroPortals)[number];

export const lockedPortalMessages = {
  "portal-2":
    "Primero debemos entrar por Raíz. Después llegaremos al pulso invisible.",
  "portal-3":
    "Esa sala forma parte del recorrido secuencial. Antes conoceremos el origen y la señal.",
  "portal-4":
    "La operación técnica tendrá sentido cuando ya conozcas la mediación.",
  "portal-5": "El presente se entiende mejor al final del recorrido.",
} as const;

export type CoverIntroDialogue = (typeof coverIntroDialogues)[number];
export type CoverIntroDialoguePose = CoverIntroDialogue["liaPose"];
export type LockedPortalId = keyof typeof lockedPortalMessages;
