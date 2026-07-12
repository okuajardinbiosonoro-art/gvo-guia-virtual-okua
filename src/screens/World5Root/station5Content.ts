/**
 * Copy de Estación V — Mundo V: Mapa del presente.
 * Fuente: 07_estacion_v_mapa_presente_especificacion_v1.txt y ticket
 * FABLE5-S5-01 (texto sugerido aprobado). Sustituye a los TEMP de
 * world5EditorialSlots para esta pantalla; ver
 * docs/status/FABLE5_S5_01_STATION5_PRESENT_MAP.md.
 */

export type Station5AreaId = "plantas" | "sistema" | "espacio" | "visitante";

/**
 * Clave estable del slot visual de cada área. Codex puede sustituir el
 * placeholder procedural por un asset propio buscando este identificador
 * (data-station5-visual en el DOM / visualKey en el contenido).
 */
export type Station5VisualKey = "plants" | "system" | "space" | "visitor";

export type Station5AreaContent = {
  id: Station5AreaId;
  order: number;
  title: string;
  accessibleLabel: string;
  /** Explicación pedagógica de Lía al activar el área (máx. 2-3 líneas). */
  text: string;
  /** Línea clave breve del área. */
  keyLine: string;
  /** Hint suave de Lía que invita a tocar esta área cuando queda sugerida. */
  hint: string;
  visualKey: Station5VisualKey;
};

export const station5Areas: readonly Station5AreaContent[] = [
  {
    id: "plantas",
    order: 1,
    title: "Plantas",
    accessibleLabel: "Área 1 de 4. Plantas.",
    text: "Aquí están las plantas del montaje. No son decoración: son el origen vivo de la experiencia.",
    keyLine: "Lo vivo inicia la relación.",
    hint: "Comienza por las plantas del montaje.",
    visualKey: "plants",
  },
  {
    id: "sistema",
    order: 2,
    title: "Sistema",
    accessibleLabel: "Área 2 de 4. Sistema.",
    text: "Aquí está el sistema que sostiene la mediación. No reemplaza a la planta: ayuda a volver perceptible su señal.",
    keyLine: "La técnica sostiene la mediación.",
    hint: "Mira ahora el sistema.",
    visualKey: "system",
  },
  {
    id: "espacio",
    order: 3,
    title: "Espacio",
    accessibleLabel: "Área 3 de 4. Espacio.",
    text: "El espacio también hace parte de OKÚA. Aquí la mediación se vuelve experiencia para quien recorre el jardín.",
    keyLine: "El lugar transforma componentes en experiencia.",
    hint: "Sigue hacia el espacio.",
    visualKey: "space",
  },
  {
    id: "visitante",
    order: 4,
    title: "Visitante",
    accessibleLabel: "Área 4 de 4. Visitante.",
    text: "Tú también haces parte del presente de OKÚA. La experiencia se completa cuando alguien la recorre, la escucha y la comprende.",
    keyLine: "El visitante completa la lectura.",
    hint: "Falta tu lugar en el mapa.",
    visualKey: "visitor",
  },
] as const;

export const station5Lia = {
  intro:
    "Este es el presente de OKÚA. Miremos cómo se encuentran plantas, sistema, espacio y visitante.",
  locked: "Miremos primero cómo se organiza este presente.",
  lockedAlt: "Esa parte tendrá más sentido después de revisar la anterior.",
  revisitLater:
    "Esa parte ya quedó en el mapa. Al completar el recorrido podrás volver a mirarla.",
  synthesis:
    "OKÚA ocurre aquí: en la relación entre plantas, sistema, espacio y visitante.",
  revisit: "Puedes volver a mirar cualquier parte del mapa del presente.",
  ctaBlocked: "Antes de cerrar, revisemos las partes del presente.",
} as const;

export const station5Cta = {
  label: "Ir al cierre",
  accessibleLabel: "Ir al cierre.",
  accessibleLabelDisabled:
    "Ir al cierre. Completa las cuatro áreas para continuar.",
} as const;

export const station5Header = {
  brand: "OKÚA",
  brandSub: "Guía Virtual OKÚA",
  eyebrow: "Estación V",
  title: "Mundo V: Mapa del presente",
  subtitle: "Qué significa este montaje hoy",
} as const;

const liaBase = "/assets/gvo/shared/lia/current-used/portada-intro";

export const station5LiaPoses = {
  guide: `${liaBase}/lia_pose_explain_calm_v1.png`,
  closure: `${liaBase}/lia_pose_greeting_v1.png`,
} as const;
