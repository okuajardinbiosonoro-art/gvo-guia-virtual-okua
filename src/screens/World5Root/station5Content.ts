export type Station5AreaId = "plantas" | "sistema" | "espacio" | "visitante";

export type Station5AreaContent = {
  id: Station5AreaId;
  order: number;
  title: string;
  accessibleLabel: string;
};

export const station5ContentApprovalStatus = "candidate" as const;

export const station5Areas: readonly Station5AreaContent[] = [
  { id: "plantas", order: 1, title: "Plantas", accessibleLabel: "Plantas, área 1 de 4" },
  { id: "sistema", order: 2, title: "Sistema", accessibleLabel: "Sistema, área 2 de 4" },
  { id: "espacio", order: 3, title: "Espacio", accessibleLabel: "Espacio, área 3 de 4" },
  { id: "visitante", order: 4, title: "Visitante", accessibleLabel: "Visitante, área 4 de 4" },
] as const;

export const station5Header = {
  eyebrow: "ESTACIÓN V",
  title: "MUNDO V: MAPA DEL PRESENTE",
} as const;

export const station5PlantsCopy = {
  intro: "Las plantas abren el recorrido.",
  description: "Son seres vivos y el punto de partida de esta experiencia.",
  instruction: "Toca la hoja para activar un pulso visual.",
  leafAccessibleLabel: "Activar el pulso visual desde la hoja.",
  resolvedStatus: "El pulso visual llegó al suelo.",
  resolvedDescription: "Las plantas sostienen el origen vivo del montaje.",
  returnLabel: "Volver al mapa",
  storageError: "No fue posible guardar el avance. Inténtalo de nuevo.",
  retryLabel: "Reintentar guardado",
} as const;

export const station5FixedCta = "Ir al cierre" as const;
