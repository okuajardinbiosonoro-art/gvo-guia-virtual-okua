import "./World5RootScreen.css";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import { worldFiveToFinalTransitionRoute } from "../../app/routes";
import { Station5AreaVisual } from "./station5AreaArt";
import {
  station5Areas,
  station5Cta,
  station5Header,
  station5Lia,
  station5LiaPoses,
} from "./station5Content";
import type { Station5AreaContent } from "./station5Content";

const AREA_COUNT = station5Areas.length;
const LAST_INDEX = AREA_COUNT - 1;

/**
 * Anclas de cada área sobre la superficie de la maqueta (% del plano).
 * Distribución tomada de la referencia: Plantas arriba-izquierda, Sistema
 * arriba-derecha, Espacio abajo-izquierda, Visitante abajo-derecha, con el
 * nexo de relación en el cruce central.
 */
const areaAnchors = [
  { x: 27, y: 30 },
  { x: 72, y: 29 },
  { x: 27, y: 73 },
  { x: 71, y: 72 },
] as const;

/**
 * Anclas de los botones táctiles en espacio de pantalla (% del escenario).
 * Los botones accesibles viven en una capa plana sobre el diorama porque el
 * hit-test 3D de Chromium falla en la mitad inferior del plano rotado
 * (medido con tools/debug-station5-click.mjs). Corresponden a la
 * proyección de areaAnchors, estable ±1% entre 360x640 y 430x932.
 */
const areaTouchAnchors = [
  { x: 31.3, y: 34.4 },
  { x: 68.2, y: 32.3 },
  { x: 31.5, y: 71 },
  { x: 69.7, y: 68.7 },
] as const;

const nexusAnchor = { x: 50, y: 51 } as const;

/**
 * Lía acompaña sin tapar: en las zonas superiores se acerca por el lado
 * interior; en las inferiores, por el lado exterior (lejos del nexo y de
 * las etiquetas).
 */
function liaAnchorForArea(index: number) {
  const anchor = areaAnchors[index];
  const isTop = anchor.y < 50;
  const outward = anchor.x < 50 ? -15 : 15;
  return {
    x: anchor.x + (isTop ? -outward : outward),
    y: anchor.y - (isTop ? 19 : 13),
  };
}

type Station5Phase =
  | "entering"
  | "awaiting"
  | "area"
  | "integrating"
  | "ready"
  | "exiting";

type AreaVisualState = "locked" | "suggested" | "active" | "completed";

const areaStateLabel: Record<AreaVisualState, string> = {
  locked: "Bloqueada",
  suggested: "Sugerida",
  active: "Activa",
  completed: "Completada",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Conexión punteada área → nexo, proyectada sobre la superficie. */
function Station5AreaConnection({
  area,
  anchor,
  lit,
}: {
  area: Station5AreaContent;
  anchor: { x: number; y: number };
  lit: boolean;
}) {
  const startX = anchor.x * 10;
  const startY = anchor.y * 10;
  const midX = (startX + nexusAnchor.x * 10) / 2;
  const midY = (startY + nexusAnchor.y * 10) / 2 + (anchor.y < 50 ? 34 : -34);
  return (
    <path
      className={`s5-link${lit ? " s5-link--lit" : ""}`}
      data-station5-connection={area.id}
      data-connection-state={lit ? "lit" : "dim"}
      d={`M ${startX} ${startY} Q ${midX} ${midY} ${nexusAnchor.x * 10} ${nexusAnchor.y * 10}`}
      pathLength={1}
    />
  );
}

/** Nexo central de relación: consecuencia visual, nunca un área interactiva. */
function Station5RelationshipNexus({ level }: { level: number }) {
  return (
    <span
      className="s5-nexus"
      aria-hidden="true"
      data-station5-nexus={level}
      data-station5-nexus-state={level >= AREA_COUNT ? "full" : "partial"}
      style={
        {
          left: `${nexusAnchor.x}%`,
          top: `${nexusAnchor.y}%`,
          "--s5-nexus-level": level / AREA_COUNT,
        } as CSSProperties
      }
    >
      <span className="s5-nexus__halo" />
      <span className="s5-nexus__ring" />
      <span className="s5-nexus__core" />
    </span>
  );
}

/** Escena decorativa del área sobre la maqueta (suelo, objetos y etiqueta). */
function Station5AreaZone({
  area,
  anchor,
  state,
}: {
  area: Station5AreaContent;
  anchor: { x: number; y: number };
  state: AreaVisualState;
}) {
  return (
    <span
      className={`s5-zone s5-zone--${state}`}
      aria-hidden="true"
      data-station5-area-decor={area.id}
      data-zone-state={state}
      style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
    >
      <span className="s5-zone__ground" />
      <span className="s5-zone__halo" />
      <span className="s5-zone__up">
        <Station5AreaVisual areaId={area.id} visualKey={area.visualKey} />
      </span>
      <span className="s5-zone__label">
        <span className="s5-zone__check">✓</span>
        {area.title}
      </span>
    </span>
  );
}

/**
 * Área tocable del mapa: botón accesible real en una capa plana de pantalla
 * (sin transformaciones 3D), alineado con la proyección de su zona visual.
 */
function Station5Area({
  area,
  touchAnchor,
  state,
  onTap,
}: {
  area: Station5AreaContent;
  touchAnchor: { x: number; y: number };
  state: AreaVisualState;
  onTap: () => void;
}) {
  return (
    <button
      className={`s5-area s5-area--${state}`}
      type="button"
      aria-label={area.accessibleLabel}
      aria-disabled={state === "locked"}
      aria-current={state === "active" ? "step" : undefined}
      aria-describedby={`s5-area-state-${area.id}`}
      data-station5-area={area.id}
      data-station5-area-order={area.order}
      data-area-state={state}
      style={{ left: `${touchAnchor.x}%`, top: `${touchAnchor.y}%` }}
      onClick={onTap}
    >
      <span className="s5-sr-only" id={`s5-area-state-${area.id}`}>
        {areaStateLabel[state]}.
      </span>
    </button>
  );
}

/** Lía oficial en la escena: guía calmada de síntesis. */
function Station5LiaGuide({
  anchor,
  mode,
}: {
  anchor: { x: number; y: number };
  mode: "guide" | "closure";
}) {
  return (
    <div
      className="s5-lia-anchor"
      aria-hidden="true"
      style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
    >
      <span className="s5-lia-pool" />
      <div
        className="s5-lia"
        data-station5-lia="official-2-5d"
        data-lia-source="repo-existing-2-5d"
        data-lia-mode={mode}
      >
        <span className="s5-lia__glow" />
        <img
          className="s5-lia__pose s5-lia__pose--guide"
          src={station5LiaPoses.guide}
          alt=""
          loading="eager"
          data-runtime-asset={station5LiaPoses.guide}
        />
        <img
          className="s5-lia__pose s5-lia__pose--closure"
          src={station5LiaPoses.closure}
          alt=""
          loading="lazy"
          data-runtime-asset={station5LiaPoses.closure}
        />
      </div>
    </div>
  );
}

/** Acción final "Ir al cierre": presente en baja intensidad, activa al final. */
function Station5FinalAction({
  ready,
  onActivate,
}: {
  ready: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      className={`s5-cta s5-cta--${ready ? "ready" : "waiting"}`}
      type="button"
      aria-label={
        ready ? station5Cta.accessibleLabel : station5Cta.accessibleLabelDisabled
      }
      aria-disabled={!ready}
      data-station5-action="ir-al-cierre"
      data-cta-state={ready ? "ready" : "waiting"}
      onClick={onActivate}
    >
      <svg
        className="s5-cta__leaf"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 4 C13 8.4 15.6 10.4 18.5 11.4 C15.6 12.4 13 14.4 12 18.8 C11 14.4 8.4 12.4 5.5 11.4 C8.4 10.4 11 8.4 12 4 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
      <span className="s5-cta__divider" aria-hidden="true" />
      <span className="s5-cta__label">{station5Cta.label}</span>
    </button>
  );
}

export function World5RootScreen() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Station5Phase>("entering");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hintReady, setHintReady] = useState(false);
  const [revisitIndex, setRevisitIndex] = useState<number | null>(null);
  const [liaNote, setLiaNote] = useState<string | null>(null);
  const [lockedAlt, setLockedAlt] = useState(false);

  const enterMs = reducedMotion ? 60 : 900;
  const readMs = reducedMotion ? 250 : 1800;
  const integrateMs = reducedMotion ? 250 : 1500;

  useEffect(() => {
    if (phase === "entering") {
      const timeout = window.setTimeout(() => setPhase("awaiting"), enterMs);
      return () => window.clearTimeout(timeout);
    }

    if (phase === "area" && !hintReady && activeIndex < LAST_INDEX) {
      const timeout = window.setTimeout(() => setHintReady(true), readMs);
      return () => window.clearTimeout(timeout);
    }

    if (phase === "area" && activeIndex === LAST_INDEX) {
      const timeout = window.setTimeout(() => setPhase("integrating"), readMs);
      return () => window.clearTimeout(timeout);
    }

    if (phase === "integrating") {
      const timeout = window.setTimeout(() => setPhase("ready"), integrateMs);
      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [phase, hintReady, activeIndex, enterMs, readMs, integrateMs]);

  function areaVisualState(index: number): AreaVisualState {
    if (phase === "entering") {
      return "locked";
    }
    if (phase === "awaiting") {
      return index === 0 ? "suggested" : "locked";
    }
    if (phase === "area") {
      if (index < activeIndex) {
        return "completed";
      }
      if (index === activeIndex) {
        return "active";
      }
      if (index === activeIndex + 1 && hintReady) {
        return "suggested";
      }
      return "locked";
    }
    // integrating / ready / exiting: mapa integrado, revisita libre
    return revisitIndex === index ? "active" : "completed";
  }

  function connectionLit(index: number): boolean {
    if (phase === "area") {
      return index <= activeIndex;
    }
    return phase === "integrating" || phase === "ready" || phase === "exiting";
  }

  function tapArea(index: number) {
    if (phase === "entering" || phase === "integrating" || phase === "exiting") {
      return;
    }

    if (phase === "ready") {
      setLiaNote(null);
      setRevisitIndex(index);
      return;
    }

    const state = areaVisualState(index);

    if (state === "locked") {
      setLiaNote(lockedAlt ? station5Lia.lockedAlt : station5Lia.locked);
      setLockedAlt((value) => !value);
      return;
    }

    if (state === "suggested") {
      setLiaNote(null);
      setHintReady(false);
      setActiveIndex(index);
      if (phase === "awaiting") {
        setPhase("area");
      }
      return;
    }

    if (state === "completed") {
      setLiaNote(station5Lia.revisitLater);
    }
  }

  function handleCta() {
    if (phase !== "ready") {
      setLiaNote(station5Lia.ctaBlocked);
      return;
    }
    setLiaNote(null);
    setRevisitIndex(null);
    setPhase("exiting");
    window.setTimeout(
      () => navigate(worldFiveToFinalTransitionRoute),
      reducedMotion ? 0 : 320,
    );
  }

  // Intensidad del nexo: sube con cada área completada; solo queda plena
  // (nivel 4) cuando Visitante se completa y el mapa se integra.
  const nexusLevel =
    phase === "area"
      ? activeIndex
      : phase === "integrating" || phase === "ready" || phase === "exiting"
        ? AREA_COUNT
        : 0;

  const station5State = useMemo(() => {
    if (phase === "entering") {
      return "station5_entering";
    }
    if (phase === "awaiting") {
      return "station5_plants_suggested";
    }
    if (phase === "area") {
      return `station5_${station5Areas[activeIndex].id}_active`;
    }
    if (phase === "integrating") {
      return "station5_map_integrated";
    }
    if (phase === "exiting") {
      return "station5_exiting";
    }
    return revisitIndex === null
      ? "station5_ready_to_close"
      : "station5_revisit_mode";
  }, [phase, activeIndex, revisitIndex]);

  const dialogArea =
    phase === "area"
      ? station5Areas[activeIndex]
      : (phase === "ready" || phase === "exiting") && revisitIndex !== null
        ? station5Areas[revisitIndex]
        : null;

  const statusMessage = useMemo(() => {
    if (liaNote) {
      return liaNote;
    }
    if (phase === "awaiting") {
      return station5Areas[0].hint;
    }
    if (phase === "area" && hintReady && activeIndex < LAST_INDEX) {
      return station5Areas[activeIndex + 1].hint;
    }
    if (phase === "ready" && revisitIndex === null) {
      return station5Lia.revisit;
    }
    return null;
  }, [liaNote, phase, hintReady, activeIndex, revisitIndex]);

  const liaMode: "guide" | "closure" =
    phase === "integrating" || phase === "ready" || phase === "exiting"
      ? "closure"
      : "guide";

  const liaAnchor = useMemo(() => {
    if (phase === "entering" || phase === "awaiting") {
      return { x: 82, y: 13 };
    }
    if (phase === "area") {
      return liaAnchorForArea(activeIndex);
    }
    if (phase === "integrating") {
      return { x: 50, y: 28 };
    }
    if (revisitIndex !== null) {
      return liaAnchorForArea(revisitIndex);
    }
    return { x: 50, y: 97 };
  }, [phase, activeIndex, revisitIndex]);

  const ctaReady = phase === "ready" || phase === "exiting";

  return (
    <main
      className="s5-screen"
      data-station5-state={station5State}
      data-station5-nexus-level={nexusLevel}
      data-station5-revisit={phase === "ready" || phase === "exiting"}
      data-station5-reduced-motion={reducedMotion}
      data-sensitive-permissions="blocked"
      data-qr-camera="blocked"
      aria-labelledby="station5-title"
    >
      <header className="s5-header">
        <svg
          className="s5-header__mark"
          viewBox="0 0 32 32"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M16 23 C16 17 16 13 16 9 M16 13 C13 12 11 10 10.5 8 M16 13 C19 12 21 10 21.5 8 M16 18 C13.4 17.4 12 16 11.5 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <p className="s5-header__brand">{station5Header.brand}</p>
        <p className="s5-header__brand-sub">{station5Header.brandSub}</p>
      </header>

      <div className="s5-title">
        <p className="s5-title__eyebrow">{station5Header.eyebrow}</p>
        <h1 id="station5-title">{station5Header.title}</h1>
        <p className="s5-title__subtitle">{station5Header.subtitle}</p>
      </div>

      <section
        className="s5-map-zone"
        aria-label="Maqueta del presente de OKÚA con cuatro áreas: plantas, sistema, espacio y visitante, unidas por un nexo central."
      >
        <div className="s5-stage" data-station5-scene="present-map">
          <div className="s5-tray">
            <span className="s5-tray__lip" aria-hidden="true" />
            <div className="s5-tray__surface">
              <span className="s5-tray__light" aria-hidden="true" />

              <svg
                className="s5-links"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  className="s5-lia-trail"
                  d="M 900 60 Q 760 120 560 170 Q 400 210 310 280"
                  data-trail-state={
                    phase === "entering" || phase === "awaiting"
                      ? "visible"
                      : "hidden"
                  }
                />
                {station5Areas.map((area, index) => (
                  <Station5AreaConnection
                    key={area.id}
                    area={area}
                    anchor={areaAnchors[index]}
                    lit={connectionLit(index)}
                  />
                ))}
              </svg>

              <Station5RelationshipNexus level={nexusLevel} />

              {station5Areas.map((area, index) => (
                <Station5AreaZone
                  key={area.id}
                  area={area}
                  anchor={areaAnchors[index]}
                  state={areaVisualState(index)}
                />
              ))}

              <Station5LiaGuide anchor={liaAnchor} mode={liaMode} />
            </div>
          </div>
          <span className="s5-stage__shadow" aria-hidden="true" />
          <div className="s5-touch-layer">
            {station5Areas.map((area, index) => (
              <Station5Area
                key={area.id}
                area={area}
                touchAnchor={areaTouchAnchors[index]}
                state={areaVisualState(index)}
                onTap={() => tapArea(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="s5-panel">
        <article
          className="s5-dialog"
          aria-live="polite"
          data-station5-dialog={dialogArea ? dialogArea.id : station5State}
          key={dialogArea ? dialogArea.id : station5State}
        >
          {dialogArea ? (
            <>
              <p className="s5-dialog__step">
                Área {dialogArea.order} de {AREA_COUNT}
              </p>
              <h2 className="s5-dialog__title">{dialogArea.title}</h2>
              <p className="s5-dialog__text">{dialogArea.text}</p>
              <p className="s5-dialog__key">{dialogArea.keyLine}</p>
            </>
          ) : nexusLevel === AREA_COUNT ? (
            <>
              <p className="s5-dialog__step">Síntesis</p>
              <p className="s5-dialog__text s5-dialog__text--synthesis">
                {station5Lia.synthesis}
              </p>
            </>
          ) : (
            <p className="s5-dialog__text s5-dialog__text--intro">
              {station5Lia.intro}
            </p>
          )}
        </article>

        <p
          className="s5-status"
          role="status"
          data-station5-status={statusMessage ? "visible" : "empty"}
        >
          {statusMessage}
        </p>

        <Station5FinalAction ready={ctaReady} onActivate={handleCta} />
      </section>

      <footer className="s5-footer" aria-hidden="true">
        <span className="s5-footer__dot" />
        <span className="s5-footer__dot" />
        <span className="s5-footer__station">V</span>
        <span className="s5-footer__dot" />
        <span className="s5-footer__dot" />
      </footer>
    </main>
  );
}
