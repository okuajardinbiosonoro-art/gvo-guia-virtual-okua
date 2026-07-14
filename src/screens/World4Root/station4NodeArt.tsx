/**
 * Miniaturas técnicas procedurales de la Mesa de sistema (SVG, estilo
 * museo sobrio). Referencia visual: docs/ai/station4/reference/estacion4.png
 */

import type { ReactElement } from "react";

import type { Station4NodeId } from "./station4Content";

const ink = "#10182b";
const steel = "#2b3550";
const steelDark = "#1d2540";
const steelLight = "#43507a";
const cyan = "#7fd8f0";
const cyanSoft = "rgb(127 216 240 / 45%)";
const leaf = "#5fae6f";
const leafLight = "#8ccb96";
const lavender = "#c4a6ee";

function PlantArt() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="14" ry="3" fill={ink} opacity="0.5" />
      <path
        d="M16 30 h16 l-2 11 a2 2 0 0 1 -2 1.8 h-8 a2 2 0 0 1 -2 -1.8 Z"
        fill={steelDark}
        stroke={steelLight}
        strokeWidth="1"
      />
      <path d="M15 28.6 h18 v2.4 h-18 Z" fill={steel} />
      <path
        d="M24 28 C23 20 18 18 14 15 C20 15 23 18 24 21 C25 15 21 10 19 7 C26 9 26 16 25 20 C27 14 31 12 35 11 C32 16 28 18 25 22 C27 19 31 19 34 20 C30 23 27 23 24 28 Z"
        fill={leaf}
      />
      <path
        d="M24 28 C24.5 22 26 18 29 15"
        fill="none"
        stroke={leafLight}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BionosificadorArt() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="15" ry="3" fill={ink} opacity="0.5" />
      <rect
        x="10"
        y="16"
        width="28"
        height="24"
        rx="5"
        fill={steelDark}
        stroke={steelLight}
        strokeWidth="1"
      />
      <rect x="10" y="16" width="28" height="7" rx="5" fill={steel} />
      <path
        d="M24 24 c-3 2.4 -3 6 0 8 c3 -2 3 -5.6 0 -8 Z"
        fill="none"
        stroke={leafLight}
        strokeWidth="1.4"
      />
      <circle cx="24" cy="35.5" r="1.6" fill={cyan} />
      <circle cx="24" cy="35.5" r="3.4" fill={cyanSoft} opacity="0.5" />
      <circle cx="15" cy="36" r="1.8" fill={ink} stroke={steelLight} strokeWidth="0.8" />
    </svg>
  );
}

function Esp32Art() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="16" ry="3" fill={ink} opacity="0.5" />
      <rect
        x="12"
        y="10"
        width="24"
        height="31"
        rx="3"
        fill="#16213c"
        stroke={steelLight}
        strokeWidth="1"
      />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={`pins-${i}`}>
          <rect x="9.6" y={13 + i * 4.6} width="2.4" height="2" fill={steelLight} />
          <rect x="36" y={13 + i * 4.6} width="2.4" height="2" fill={steelLight} />
        </g>
      ))}
      <rect x="16" y="13" width="16" height="12" rx="1.6" fill={steel} />
      <rect x="18" y="15" width="12" height="8" rx="1" fill={steelDark} />
      <path
        d="M20 17 h8 M20 19 h8 M20 21 h5"
        stroke={cyan}
        strokeWidth="0.9"
        opacity="0.85"
      />
      <rect x="16" y="28" width="4.5" height="3" fill={steelLight} opacity="0.7" />
      <rect x="27" y="28" width="4.5" height="3" fill={steelLight} opacity="0.7" />
      <rect x="20" y="36" width="8" height="4" rx="1" fill={steelLight} opacity="0.85" />
      <circle cx="17.6" cy="33.4" r="1.1" fill={cyan} />
      <circle cx="30.4" cy="33.4" r="1.1" fill={lavender} opacity="0.9" />
    </svg>
  );
}

function MidiArt() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="15" ry="3" fill={ink} opacity="0.5" />
      <rect
        x="9"
        y="17"
        width="30"
        height="23"
        rx="4"
        fill={steelDark}
        stroke={steelLight}
        strokeWidth="1"
      />
      <circle cx="32.5" cy="23.5" r="3.6" fill={steel} stroke={steelLight} strokeWidth="0.9" />
      <path d="M32.5 23.5 L32.5 20.6" stroke={cyan} strokeWidth="1.1" strokeLinecap="round" />
      {Array.from({ length: 6 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <rect
            key={`pad-${i}`}
            x={13 + col * 5.6}
            y={21 + row * 5.6}
            width="4.4"
            height="4.4"
            rx="1"
            fill={row === 0 && col === 1 ? steelLight : steel}
          />
        );
      })}
      <path d="M13 34.5 h22" stroke={steelLight} strokeWidth="0.8" opacity="0.6" />
      <rect x="13" y="36" width="9" height="1.8" rx="0.9" fill={cyanSoft} />
      <circle cx="34" cy="36.8" r="1.4" fill={ink} stroke={steelLight} strokeWidth="0.8" />
    </svg>
  );
}

function WifiArt() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="14" ry="3" fill={ink} opacity="0.5" />
      <ellipse
        cx="24"
        cy="34"
        rx="14"
        ry="7"
        fill={steelDark}
        stroke={steelLight}
        strokeWidth="1"
      />
      <ellipse cx="24" cy="32.4" rx="14" ry="7" fill={steel} />
      <path
        d="M15.5 28.5 a12 12 0 0 1 17 0"
        fill="none"
        stroke={cyan}
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M18.6 31.4 a7.6 7.6 0 0 1 10.8 0"
        fill="none"
        stroke={cyan}
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="24" cy="34.6" r="1.7" fill={cyan} />
    </svg>
  );
}

function RouterArt() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="16" ry="3" fill={ink} opacity="0.5" />
      <path
        d="M15 26 L15.8 12 M33 26 L32.2 12"
        stroke={steelLight}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="15.8" cy="11.4" r="1.3" fill={steelLight} />
      <circle cx="32.2" cy="11.4" r="1.3" fill={steelLight} />
      <rect
        x="9"
        y="26"
        width="30"
        height="13"
        rx="4"
        fill={steelDark}
        stroke={steelLight}
        strokeWidth="1"
      />
      <rect x="9" y="26" width="30" height="4.5" rx="2.2" fill={steel} />
      {Array.from({ length: 4 }, (_, i) => (
        <circle
          key={`led-${i}`}
          cx={16 + i * 5.4}
          cy="34.5"
          r="1.1"
          fill={i < 3 ? cyan : cyanSoft}
          opacity={i < 3 ? 0.9 : 0.6}
        />
      ))}
    </svg>
  );
}

function SistemaCentralArt() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="14" ry="3" fill={ink} opacity="0.5" />
      <rect
        x="13"
        y="9"
        width="22"
        height="31"
        rx="4"
        fill={steelDark}
        stroke={steelLight}
        strokeWidth="1"
      />
      <rect x="13" y="9" width="22" height="8" rx="4" fill={steel} />
      <path
        d="M24 20 c-3.4 2.6 -3.4 6.6 0 9 c3.4 -2.4 3.4 -6.4 0 -9 Z"
        fill="none"
        stroke={leafLight}
        strokeWidth="1.3"
      />
      <path d="M17 33 h14" stroke={steelLight} strokeWidth="0.8" opacity="0.6" />
      <circle cx="18.5" cy="36.2" r="1.2" fill={cyan} />
      <rect x="22" y="35.4" width="9" height="1.6" rx="0.8" fill={cyanSoft} />
    </svg>
  );
}

function SonidoArt() {
  return (
    <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="12" ry="3" fill={ink} opacity="0.5" />
      <path d="M20 40 h8 l-1.2 -4 h-5.6 Z" fill={steelDark} stroke={steelLight} strokeWidth="0.8" />
      <g className="s4-sound-gesture">
        <path
          d="M24 31 c-6 0 -9 -5 -6.5 -9.5 c2.2 -4 7.6 -4.6 10.6 -1.6 c2.4 2.4 2 6.4 -0.8 8.2 c-2.2 1.4 -5 0.8 -6.2 -1.4 c-1 -1.8 -0.2 -4 1.6 -4.8"
          fill="none"
          stroke={lavender}
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path
          d="M33.5 15.5 c1.6 1.2 2.8 2.8 3.3 4.8 M14.5 15.5 c-1.6 1.2 -2.8 2.8 -3.3 4.8"
          fill="none"
          stroke={lavender}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>
      <circle cx="24" cy="24" r="1.6" fill="#e9dcff" />
    </svg>
  );
}

const artByNode: Record<Station4NodeId, () => ReactElement> = {
  planta: PlantArt,
  bionosificador: BionosificadorArt,
  esp32: Esp32Art,
  midi: MidiArt,
  wifi_udp: WifiArt,
  router: RouterArt,
  sistema_central: SistemaCentralArt,
  sonido: SonidoArt,
};

export function Station4NodeArt({ nodeId }: { nodeId: Station4NodeId }) {
  const Art = artByNode[nodeId];
  return <Art />;
}

/**
 * Slot visual reemplazable de cada nodo de la mesa.
 *
 * Hoy renderiza la miniatura procedural (placeholder aprobado); cuando
 * exista arte propio, Codex puede sustituir el contenido de este slot
 * buscando `data-station4-visual="<visualKey>"` sin tocar interacción,
 * anclas ni accesibilidad.
 */
export function Station4NodeVisual({
  nodeId,
  visualKey,
}: {
  nodeId: Station4NodeId;
  visualKey: string;
}) {
  return (
    <span
      className={`s4-node-visual s4-node-visual--${visualKey}`}
      data-station4-visual={visualKey}
      data-visual-slot="procedural-placeholder"
    >
      <Station4NodeArt nodeId={nodeId} />
    </span>
  );
}
