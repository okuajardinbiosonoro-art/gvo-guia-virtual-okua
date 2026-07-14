import "./World4RootScreen.css";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import { worldFourToWorldFiveTransitionRoute } from "../../app/routes";
import {
  station4Exit,
  station4Lia,
  station4LiaPoses,
  station4Nodes,
} from "./station4Content";
import { Station4NodeArt, Station4NodeVisual } from "./station4NodeArt";

const NODE_COUNT = station4Nodes.length;
const LAST_INDEX = NODE_COUNT - 1;

/**
 * Anclas proyectadas de cada nodo sobre el plano de la mesa.
 * x/depth en coordenadas del plano (%, 0=fondo → 1=frente); el arco
 * suave da profundidad 2.5D sin romper la lectura izquierda→derecha.
 */
const nodeAnchors = [
  { x: 8.5, depth: 0.34 },
  { x: 20.6, depth: 0.44 },
  { x: 32.7, depth: 0.52 },
  { x: 44.8, depth: 0.56 },
  { x: 56.9, depth: 0.56 },
  { x: 69, depth: 0.52 },
  { x: 81.1, depth: 0.44 },
  { x: 93.2, depth: 0.34 },
] as const;

function anchorNodeY(depth: number) {
  return 16 + depth * 46;
}

function anchorLineY(depth: number) {
  return anchorNodeY(depth) + 21;
}

type Station4Phase =
  | "entering"
  | "reading"
  | "moving"
  | "chain"
  | "exit_ready"
  | "exiting";

type NodeVisualState = "locked" | "available" | "active" | "completed";

const nodeStateLabel: Record<NodeVisualState, string> = {
  locked: "Bloqueado",
  available: "Disponible",
  active: "Activo",
  completed: "Completado",
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

export function World4RootScreen() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Station4Phase>("entering");
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hintReady, setHintReady] = useState(false);
  const [movingTarget, setMovingTarget] = useState<number | null>(null);
  const [liaNote, setLiaNote] = useState<string | null>(null);
  const [lockedAlt, setLockedAlt] = useState(false);

  const enterMs = reducedMotion ? 60 : 900;
  const readMs = reducedMotion ? 250 : 1600;
  const moveMs = reducedMotion ? 120 : 680;
  const chainHoldMs = reducedMotion ? 300 : 1500;

  const revisit = phase === "exit_ready" || phase === "exiting";

  useEffect(() => {
    if (phase === "entering") {
      const timeout = window.setTimeout(() => setPhase("reading"), enterMs);
      return () => window.clearTimeout(timeout);
    }

    if (movingTarget !== null) {
      const target = movingTarget;
      const timeout = window.setTimeout(() => {
        setActiveIndex(target);
        setMovingTarget(null);
        if (target > progress) {
          setProgress(target);
          setHintReady(false);
        }
        setPhase((current) => (current === "moving" ? "reading" : current));
      }, moveMs);
      return () => window.clearTimeout(timeout);
    }

    if (phase === "reading" && progress < LAST_INDEX && !hintReady) {
      const timeout = window.setTimeout(() => setHintReady(true), readMs);
      return () => window.clearTimeout(timeout);
    }

    if (
      phase === "reading" &&
      progress === LAST_INDEX &&
      activeIndex === LAST_INDEX
    ) {
      const timeout = window.setTimeout(() => setPhase("chain"), readMs);
      return () => window.clearTimeout(timeout);
    }

    if (phase === "chain") {
      const timeout = window.setTimeout(
        () => setPhase("exit_ready"),
        chainHoldMs,
      );
      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [
    phase,
    movingTarget,
    progress,
    hintReady,
    activeIndex,
    enterMs,
    readMs,
    moveMs,
    chainHoldMs,
  ]);

  function nodeVisualState(index: number): NodeVisualState {
    if (phase === "moving" && movingTarget === index) {
      return "available";
    }
    if (index === activeIndex && phase !== "entering") {
      return "active";
    }
    if (revisit || phase === "chain") {
      return "completed";
    }
    if (index <= progress) {
      return "completed";
    }
    if (index === progress + 1 && hintReady) {
      return "available";
    }
    return "locked";
  }

  function tapNode(index: number) {
    if (
      (phase !== "reading" && phase !== "exit_ready") ||
      movingTarget !== null
    ) {
      return;
    }
    if (index === activeIndex) {
      return;
    }
    const state = nodeVisualState(index);
    if (state === "locked") {
      setLiaNote(lockedAlt ? station4Lia.lockedAlt : station4Lia.locked);
      setLockedAlt((value) => !value);
      return;
    }
    setLiaNote(null);
    setMovingTarget(index);
    if (phase === "reading") {
      setPhase("moving");
    }
  }

  function handleExit() {
    if (phase !== "exit_ready") {
      return;
    }
    setPhase("exiting");
    window.setTimeout(
      () => navigate(worldFourToWorldFiveTransitionRoute),
      reducedMotion ? 0 : 300,
    );
  }

  const station4State = useMemo(() => {
    if (phase === "entering") {
      return "station4_entering";
    }
    if (phase === "exiting") {
      return "station4_exiting";
    }
    if (phase === "chain") {
      return "station4_chain_completed";
    }
    if (phase === "exit_ready") {
      return "station4_ready_to_exit";
    }
    if (phase === "moving" && movingTarget !== null) {
      return `station4_node_${movingTarget + 1}_activating`;
    }
    if (hintReady && progress < LAST_INDEX) {
      return `station4_node_${progress + 2}_ready_hint`;
    }
    return `station4_node_${activeIndex + 1}_active`;
  }, [phase, movingTarget, hintReady, progress, activeIndex]);

  const statusMessage = useMemo(() => {
    if (liaNote) {
      return liaNote;
    }
    if (phase === "chain") {
      return station4Lia.chainComplete;
    }
    if (phase === "exit_ready" || phase === "exiting") {
      return station4Lia.revisit;
    }
    if (phase === "reading" && hintReady) {
      return station4Lia.nextHint;
    }
    if (
      (phase === "entering" || phase === "reading") &&
      activeIndex === 0 &&
      progress === 0
    ) {
      return station4Lia.intro;
    }
    return null;
  }, [liaNote, phase, hintReady, activeIndex, progress]);

  const activeNode = station4Nodes[activeIndex];
  const liaIndex = movingTarget ?? activeIndex;
  const liaClosure = phase === "chain" || phase === "exit_ready" || phase === "exiting";
  const liaAnchor = liaClosure
    ? { x: 51, y: 16 }
    : {
        x: nodeAnchors[liaIndex].x,
        y: anchorNodeY(nodeAnchors[liaIndex].depth) - 5,
      };

  return (
    <main
      className="s4-screen"
      data-station4-state={station4State}
      data-station4-active-node={activeNode.id}
      data-station4-progress={progress + 1}
      data-station4-revisit={revisit}
      data-station4-reduced-motion={reducedMotion}
      data-sensitive-permissions="blocked"
      data-qr-camera="blocked"
      aria-labelledby="station4-title"
    >
      <header className="s4-title">
        <svg
          className="s4-title__leaf"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M12 3 C13 8 16 10 19 11 C16 12 13 14 12 19 C11 14 8 12 5 11 C8 10 11 8 12 3 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="12" cy="21.4" r="0.9" fill="currentColor" />
        </svg>
        <h1 id="station4-title">Estación IV</h1>
        <p className="s4-title__sub">Operación técnica</p>
        <p className="s4-title__table-name">
          <span aria-hidden="true" className="s4-title__rule" />
          Mesa de sistema
          <span aria-hidden="true" className="s4-title__rule" />
        </p>
      </header>

      <section className="s4-table-zone" aria-label="Mesa de sistema con la cadena técnica de ocho pasos">
        <div className="s4-stage">
          <div className="s4-plane">
            <span className="s4-plane__sheen" aria-hidden="true" />
            <span className="s4-plane__lip" aria-hidden="true" />

            <svg
              className="s4-flowline-svg"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              {station4Nodes.slice(0, -1).map((node, index) => {
                const from = nodeAnchors[index];
                const to = nodeAnchors[index + 1];
                const lit =
                  phase === "chain" || revisit
                    ? "soft"
                    : index < progress
                      ? "lit"
                      : phase === "moving" &&
                          movingTarget !== null &&
                          index === movingTarget - 1 &&
                          movingTarget > progress
                        ? "igniting"
                        : "dim";
                return (
                  <line
                    className={`s4-flowline__segment s4-flowline__segment--${lit}`}
                    key={`segment-${node.id}`}
                    x1={from.x * 10}
                    y1={anchorLineY(from.depth) * 6}
                    x2={to.x * 10}
                    y2={anchorLineY(to.depth) * 6}
                    pathLength={1}
                  />
                );
              })}
            </svg>

            {station4Nodes.map((node, index) => {
              const anchor = nodeAnchors[index];
              const state = nodeVisualState(index);
              return (
                <span
                  className={`s4-stop s4-stop--${state}`}
                  aria-hidden="true"
                  key={`stop-${node.id}`}
                  style={{
                    left: `${anchor.x}%`,
                    top: `${anchorLineY(anchor.depth)}%`,
                  }}
                >
                  <span className="s4-stop__halo" />
                  <span className="s4-stop__dot" />
                  <span className="s4-stop__number">{node.order}</span>
                </span>
              );
            })}

            {station4Nodes.map((node, index) => {
              const anchor = nodeAnchors[index];
              const state = nodeVisualState(index);
              return (
                <button
                  className={`s4-node s4-node--${state}`}
                  type="button"
                  aria-label={node.accessibleLabel}
                  aria-disabled={state === "locked"}
                  aria-current={state === "active" ? "step" : undefined}
                  aria-describedby={`s4-node-state-${node.id}`}
                  data-station4-node={node.id}
                  data-node-state={state}
                  key={node.id}
                  style={
                    {
                      left: `${anchor.x}%`,
                      top: `${anchorNodeY(anchor.depth)}%`,
                      zIndex: Math.round(10 + anchor.depth * 100),
                      "--s4-depth": anchor.depth,
                    } as CSSProperties
                  }
                  onClick={() => tapNode(index)}
                >
                  <span className="s4-node__shadow" aria-hidden="true" />
                  <span className="s4-node__pedestal" aria-hidden="true" />
                  <span className="s4-node__up" aria-hidden="true">
                    <span className="s4-node__hint-arrow" />
                    <Station4NodeVisual
                      nodeId={node.id}
                      visualKey={node.visualKey}
                    />
                  </span>
                  <span className="s4-sr-only" id={`s4-node-state-${node.id}`}>
                    {nodeStateLabel[state]}.
                  </span>
                </button>
              );
            })}

            <div
              className="s4-lia-anchor"
              aria-hidden="true"
              style={{ left: `${liaAnchor.x}%`, top: `${liaAnchor.y}%` }}
            >
              <span className="s4-lia-pool" />
              <div
                className="s4-lia"
                data-station4-lia="official-2-5d"
                data-lia-source="repo-existing-2-5d"
                data-lia-mode={liaClosure ? "closure" : "guide"}
              >
                <span className="s4-lia__glow" />
                <img
                  className="s4-lia__pose s4-lia__pose--guide"
                  src={station4LiaPoses.guide}
                  alt=""
                  loading="eager"
                  data-runtime-asset={station4LiaPoses.guide}
                />
                <img
                  className="s4-lia__pose s4-lia__pose--closure"
                  src={station4LiaPoses.closure}
                  alt=""
                  loading="lazy"
                  data-runtime-asset={station4LiaPoses.closure}
                />
              </div>
            </div>
          </div>
          <span className="s4-stage__shadow" aria-hidden="true" />
        </div>

        <div className="s4-panel">
          <article
            className="s4-card"
            aria-live="polite"
            data-station4-card={activeNode.id}
            key={activeNode.id}
          >
            <span className="s4-card__icon" aria-hidden="true">
              <Station4NodeArt nodeId={activeNode.id} />
            </span>
            <div className="s4-card__body">
              <p className="s4-card__step">Paso {activeNode.order} de 8</p>
              <h2 className="s4-card__title">{activeNode.title}</h2>
              <p className="s4-card__text">{activeNode.text}</p>
              <p className="s4-card__learning">{activeNode.learning}</p>
            </div>
          </article>

          <p
            className="s4-status"
            role="status"
            data-station4-status={statusMessage ? "visible" : "empty"}
          >
            {statusMessage}
          </p>

          {phase === "exit_ready" || phase === "exiting" ? (
            <button
              className="s4-exit"
              type="button"
              aria-label={station4Exit.accessibleLabel}
              data-station4-action="open-world5"
              onClick={handleExit}
            >
              <span className="s4-exit__stub" aria-hidden="true" />
              <span className="s4-exit__halo" aria-hidden="true" />
              <span className="s4-exit__label">{station4Exit.label}</span>
              <span className="s4-exit__arrow" aria-hidden="true">
                ›
              </span>
            </button>
          ) : null}
        </div>
      </section>

      <footer className="s4-footer" aria-hidden="true">
        <span className="s4-footer__dot" />
        <span className="s4-footer__dot" />
        <span className="s4-footer__station">IV</span>
        <span className="s4-footer__dot" />
        <span className="s4-footer__dot" />
      </footer>
    </main>
  );
}
