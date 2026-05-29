export const coverIntroText = {
  logo: "OKÚA",
  subtitle: "GUÍA VISUAL",
  archiveTitle: "EL ARCHIVO VIVO DE OKÚA",
  cta: "Comenzar recorrido",
} as const;

export const coverIntroPortals = [
  {
    id: "portal-1",
    roman: "I",
    title: "Estación I — Mundo I: Raíz",
    state: "available",
    ariaLabel: "Estación I, Mundo Raíz, disponible.",
  },
  {
    id: "portal-2",
    roman: "II",
    title: "Estación II — Mundo II: Lía y el pulso invisible",
    state: "locked",
    ariaLabel: "Estación II, bloqueada hasta completar Mundo I.",
  },
  {
    id: "portal-3",
    roman: "III",
    title: "Estación III — Mundo III: Cuaderno de pruebas",
    state: "locked",
    ariaLabel: "Estación III, bloqueada hasta avanzar en el recorrido.",
  },
  {
    id: "portal-4",
    roman: "IV",
    title: "Estación IV — Mundo IV: Mesa de sistema",
    state: "locked",
    ariaLabel: "Estación IV, bloqueada hasta conocer la mediación.",
  },
  {
    id: "portal-5",
    roman: "V",
    title: "Estación V — Mundo V: Mapa del presente",
    state: "locked",
    ariaLabel: "Estación V, bloqueada hasta el final del recorrido.",
  },
] as const;

export type CoverIntroPortal = (typeof coverIntroPortals)[number];
