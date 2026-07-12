/**
 * Visuales procedurales de las cuatro áreas del Mapa del presente.
 * Son placeholders editoriales reemplazables: Codex puede sustituir cada
 * renderer buscando su visualKey (data-station5-visual en el DOM) o
 * registrando un asset en public/assets/gvo/current-used/world-5-root/
 * y cambiando el mapa de renderers de este archivo.
 */

import type { ReactElement } from "react";

import type { Station5AreaId, Station5VisualKey } from "./station5Content";

/* Grupo de plantas reales en materas: hojas variadas, sin notas musicales. */
function PlantsVisual(): ReactElement {
  return (
    <svg viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      {/* matera grande */}
      <path d="M22 70 L42 70 L39 92 L25 92 Z" fill="#b39a76" />
      <ellipse cx="32" cy="70" rx="10" ry="3" fill="#c9b18f" />
      {/* monstera: hojas anchas lobuladas */}
      <g fill="#5f7248">
        <path d="M32 68 C20 58 12 44 20 32 C30 24 40 36 34 48 C40 42 48 46 44 56 C40 64 36 66 32 68 Z" />
        <path d="M33 68 C40 54 54 46 60 52 C64 60 52 68 42 66 C48 68 46 74 40 72 Z" />
        <path d="M31 68 C28 52 30 40 42 34 C52 32 52 46 42 52 C48 52 50 60 42 62 Z" />
      </g>
      <g stroke="#4a5a38" strokeWidth="1.1" fill="none" opacity="0.65">
        <path d="M32 68 C27 56 23 46 22 36" />
        <path d="M33 68 C42 58 50 52 57 52" />
      </g>
      {/* helecho en matera media */}
      <path d="M74 74 L92 74 L89 92 L77 92 Z" fill="#a98d63" />
      <ellipse cx="83" cy="74" rx="9" ry="2.6" fill="#bfa67e" />
      <g fill="none" stroke="#77895a" strokeWidth="2.4" strokeLinecap="round">
        <path d="M83 72 C80 58 72 50 62 46" />
        <path d="M83 72 C84 56 90 46 100 42" />
        <path d="M83 72 C82 60 82 50 84 40" />
        <path d="M83 72 C78 64 70 60 64 60" />
        <path d="M83 72 C90 64 98 60 104 60" />
      </g>
      <g fill="#8fa06b">
        {[
          [64, 47, -34],
          [70, 52, -28],
          [76, 58, -20],
          [100, 44, 30],
          [94, 50, 24],
          [88, 57, 16],
          [84, 42, 2],
          [83, 52, -3],
          [66, 60, -12],
          [102, 60, 12],
        ].map(([x, y, r], index) => (
          <ellipse
            key={index}
            cx={x}
            cy={y}
            rx="5.6"
            ry="2.1"
            transform={`rotate(${r} ${x} ${y})`}
          />
        ))}
      </g>
      {/* planta pequeña al frente */}
      <path d="M52 82 L66 82 L64 94 L54 94 Z" fill="#c9b18f" />
      <g fill="#6b7d4f">
        <path d="M59 81 C54 74 52 66 57 62 C62 66 62 74 59 81 Z" />
        <path d="M59 81 C63 75 68 71 71 74 C70 79 64 82 59 81 Z" />
        <path d="M59 81 C55 76 50 74 47 77 C49 81 55 83 59 81 Z" />
      </g>
      {/* pulso vivo mínimo (hoja con brillo) */}
      <circle className="s5-art-pulse" cx="26" cy="38" r="2.4" fill="#e8ddb4" />
    </svg>
  );
}

/* Sistema compacto: un módulo de circuito, cable contenido, luz indicadora.
   No repite la cadena de 8 nodos de Estación IV. */
function SystemVisual(): ReactElement {
  return (
    <svg viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      {/* placa principal */}
      <g transform="rotate(-4 46 62)">
        <rect x="16" y="46" width="60" height="34" rx="5" fill="#5d7052" />
        <rect x="16" y="46" width="60" height="6" rx="3" fill="#6d8060" />
        <rect x="34" y="56" width="18" height="14" rx="2" fill="#3c4a34" />
        <rect x="38" y="60" width="10" height="6" rx="1" fill="#2c3826" />
        {/* pistas */}
        <g stroke="#87996f" strokeWidth="1.4" fill="none" opacity="0.85">
          <path d="M22 54 H32 V64" />
          <path d="M56 60 H68" />
          <path d="M56 66 H64 V74" />
          <path d="M22 70 H30" />
        </g>
        <circle cx="24" cy="76" r="1.6" fill="#87996f" />
        <circle cx="70" cy="52" r="1.6" fill="#87996f" />
        {/* antena corta */}
        <rect x="66" y="34" width="2.6" height="14" rx="1.3" fill="#4a5a3e" />
        <circle cx="67.3" cy="33" r="2.4" fill="#3c4a34" />
        {/* luz indicadora */}
        <circle className="s5-art-indicator" cx="60" cy="53" r="2.6" fill="#e4c878" />
      </g>
      {/* cable contenido hacia el módulo pequeño */}
      <path
        d="M74 72 C88 76 92 80 96 84"
        fill="none"
        stroke="#4a4438"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* módulo cilíndrico */}
      <g>
        <rect x="88" y="70" width="18" height="18" rx="4" fill="#3f3a30" />
        <ellipse cx="97" cy="70" rx="9" ry="3.2" fill="#57503f" />
        <circle cx="97" cy="70" r="2" fill="#2c2820" />
      </g>
      {/* apoyo de piedra suave */}
      <ellipse cx="42" cy="88" rx="26" ry="5" fill="#b7a583" opacity="0.5" />
    </svg>
  );
}

/* Espacio físico: entarimado, tapete tejido y asiento bajo; lugar de recorrido. */
function SpaceVisual(): ReactElement {
  return (
    <svg viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      {/* entarimado de madera (tarima baja de recorrido) */}
      <g transform="skewX(-6)">
        <rect x="14" y="34" width="44" height="11" rx="3" fill="#c2a479" />
        <rect x="16" y="47" width="44" height="11" rx="3" fill="#b5966c" />
        <rect x="18" y="60" width="44" height="11" rx="3" fill="#c2a479" />
        <g stroke="#a98d63" strokeWidth="1" opacity="0.6">
          <path d="M20 39 C32 40 46 39 54 40" fill="none" />
          <path d="M22 52 C34 53 48 52 56 53" fill="none" />
          <path d="M24 65 C36 66 50 65 58 66" fill="none" />
        </g>
      </g>
      {/* tapete tejido */}
      <g>
        <rect x="58" y="52" width="46" height="30" rx="6" fill="#c8b492" />
        <rect
          x="61.5"
          y="55.5"
          width="39"
          height="23"
          rx="4"
          fill="none"
          stroke="#b7a179"
          strokeWidth="1.6"
        />
        <g stroke="#b7a179" strokeWidth="1.1" opacity="0.75">
          <path d="M66 60 H96 M66 65 H96 M66 70 H96 M66 75 H96" />
        </g>
      </g>
      {/* asiento bajo (puf) */}
      <g>
        <ellipse cx="80" cy="46" rx="15" ry="6.5" fill="#ac9468" />
        <path d="M65 46 L65 52 A15 6.5 0 0 0 95 52 L95 46 Z" fill="#9c8258" />
        <path
          d="M70 43 C74 40 86 40 90 43"
          fill="none"
          stroke="#8d754e"
          strokeWidth="1.2"
          opacity="0.8"
        />
      </g>
      {/* luz cálida de sol y sombra suave */}
      <ellipse
        className="s5-art-sun"
        cx="46"
        cy="84"
        rx="30"
        ry="7"
        fill="#e8d9ae"
        opacity="0.55"
      />
      <ellipse cx="82" cy="88" rx="24" ry="5" fill="#a08a64" opacity="0.35" />
    </svg>
  );
}

/* Visitante: una sola figura humana simplificada (peg doll) sobre un
   marcador circular tenue. Neutra, inclusiva, sin rostro identificable. */
function VisitorVisual(): ReactElement {
  return (
    <svg viewBox="0 0 120 96" aria-hidden="true" focusable="false">
      {/* marcador circular de posición */}
      <ellipse
        className="s5-art-marker"
        cx="60"
        cy="82"
        rx="26"
        ry="8"
        fill="none"
        stroke="#c8b184"
        strokeWidth="1.8"
        strokeDasharray="5 5"
      />
      <ellipse cx="60" cy="82" rx="17" ry="5" fill="#e3d5ae" opacity="0.5" />
      {/* figura de madera torneada */}
      <path
        d="M60 30 C69 30 74 40 74 54 C74 70 70 80 60 80 C50 80 46 70 46 54 C46 40 51 30 60 30 Z"
        fill="#d3b98e"
      />
      <path
        d="M60 30 C69 30 74 40 74 54 C74 60 73 66 71 71 C66 73 54 73 49 71 C47 66 46 60 46 54 C46 40 51 30 60 30 Z"
        fill="#dcc59d"
      />
      <circle cx="60" cy="22" r="12" fill="#e0cba4" />
      <path
        d="M50 18 C53 12 67 12 70 18"
        fill="none"
        stroke="#c9ae82"
        strokeWidth="1.4"
        opacity="0.8"
      />
      {/* sombra de contacto */}
      <ellipse cx="60" cy="83" rx="12" ry="3.4" fill="#8d7550" opacity="0.4" />
    </svg>
  );
}

const areaVisualRenderers: Record<Station5VisualKey, () => ReactElement> = {
  plants: PlantsVisual,
  system: SystemVisual,
  space: SpaceVisual,
  visitor: VisitorVisual,
};

export function Station5AreaVisual({
  areaId,
  visualKey,
}: {
  areaId: Station5AreaId;
  visualKey: Station5VisualKey;
}): ReactElement {
  const Renderer = areaVisualRenderers[visualKey];
  return (
    <span
      className="s5-area-visual"
      data-station5-visual={visualKey}
      data-station5-visual-area={areaId}
      data-station5-visual-source="procedural-placeholder"
    >
      <Renderer />
    </span>
  );
}
