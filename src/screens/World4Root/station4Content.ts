/**
 * Copy de Estación IV — Mesa de sistema.
 * Fuente: GVO_ESTACION_IV_MESA_SISTEMA_ESPECIFICACION_V1.txt y ticket
 * FABLE5-S4-01 (texto sugerido aprobado). Sustituye a los TEMP de
 * world4EditorialSlots para esta pantalla; ver
 * docs/status/FABLE5_S4_01_STATION4_SYSTEM_TABLE.md.
 */

export type Station4NodeId =
  | "planta"
  | "bionosificador"
  | "esp32"
  | "midi"
  | "wifi_udp"
  | "router"
  | "sistema_central"
  | "sonido";

/**
 * Clave editorial estable conservada por compatibilidad con la base funcional.
 * La composición 018C resuelve el asset aprobado mediante el id semántico del
 * nodo en `world4AssetManifest.ts`; no existe ya un placeholder procedural.
 */
export type Station4VisualKey =
  | "plant"
  | "bionosifier"
  | "esp32"
  | "midi"
  | "wifiUdp"
  | "router"
  | "centralSystem"
  | "sound";

export type Station4NodeContent = {
  id: Station4NodeId;
  order: number;
  title: string;
  accessibleLabel: string;
  text: string;
  learning: string;
  visualKey: Station4VisualKey;
};

export const station4Nodes: readonly Station4NodeContent[] = [
  {
    id: "planta",
    order: 1,
    title: "Planta",
    accessibleLabel: "Paso 1 de 8. Planta.",
    text: "Todo inicia en la planta viva. No produce música directa: entrega una actividad que puede ser mediada.",
    learning: "Origen vivo del sistema.",
    visualKey: "plant",
  },
  {
    id: "bionosificador",
    order: 2,
    title: "Bionosificador",
    accessibleLabel: "Paso 2 de 8. Bionosificador.",
    text: "Capta y prepara la señal de la planta para que el sistema pueda leerla con estabilidad.",
    learning: "Primera mediación técnica.",
    visualKey: "bionosifier",
  },
  {
    id: "esp32",
    order: 3,
    title: "ESP32",
    accessibleLabel: "Paso 3 de 8. ESP32.",
    text: "Interpreta la señal acondicionada y prepara eventos digitales.",
    learning: "Control y procesamiento.",
    visualKey: "esp32",
  },
  {
    id: "midi",
    order: 4,
    title: "MIDI",
    accessibleLabel: "Paso 4 de 8. MIDI.",
    text: "Organiza la información como eventos. No es la voz de la planta: es una forma de traducción.",
    learning: "Eventos de control musical.",
    visualKey: "midi",
  },
  {
    id: "wifi_udp",
    order: 5,
    title: "Wi-Fi/UDP",
    accessibleLabel: "Paso 5 de 8. Wi-Fi UDP.",
    text: "Transporta los eventos dentro de la red local, sin depender de internet.",
    learning: "Comunicación local.",
    visualKey: "wifiUdp",
  },
  {
    id: "router",
    order: 6,
    title: "Router",
    accessibleLabel: "Paso 6 de 8. Router.",
    text: "Organiza la comunicación local para que los datos lleguen al sistema central.",
    learning: "Red local ordenada.",
    visualKey: "router",
  },
  {
    id: "sistema_central",
    order: 7,
    title: "Sistema central",
    accessibleLabel: "Paso 7 de 8. Sistema central.",
    text: "Recibe, organiza e interpreta los eventos que sostienen la experiencia.",
    learning: "Coordinación del sistema.",
    visualKey: "centralSystem",
  },
  {
    id: "sonido",
    order: 8,
    title: "Sonido",
    accessibleLabel: "Paso 8 de 8. Sonido.",
    text: "Aparece al final de la cadena. Es un resultado mediado, no una emisión directa de la planta.",
    learning: "Resultado final mediado.",
    visualKey: "sound",
  },
] as const;

export const station4Lia = {
  intro: "Ahora veremos cómo se conecta todo el sistema.",
  nextHint: "Toca el siguiente punto luminoso.",
  locked: "Sigamos el flujo en orden. Esta parte viene después.",
  lockedAlt: "Aún no. Primero veamos cómo llega la señal hasta aquí.",
  chainComplete:
    "Entre la planta y el sonido no hay un salto mágico: hay una cadena técnica.",
  revisit: "Puedes revisar cualquier parte del sistema.",
} as const;

export const station4Exit = {
  label: "Abrir Mundo V",
  accessibleLabel: "Abrir Mundo V. Ir al Mapa del presente.",
} as const;
