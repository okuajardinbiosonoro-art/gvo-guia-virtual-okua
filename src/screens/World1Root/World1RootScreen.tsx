import "./World1RootScreen.css";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { worldTwoPlaceholderRoute } from "../../app/routes";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";
import { World1RootStageFrame } from "./layout";
import { world1RootAssets } from "./world1RootAssets";

type NodeOrbStyle = CSSProperties & {
  "--world1-node-kit": string;
};

type BackgroundLayerStyle = CSSProperties & {
  "--world1-root-background": string;
};

const nodeOrbStyle = {
  "--world1-node-kit": `url(${world1RootAssets.nodeKit})`,
} as NodeOrbStyle;

const backgroundLayerStyle = {
  "--world1-root-background": `url(${world1RootAssets.background})`,
} as BackgroundLayerStyle;

type World1Concept =
  | "intro"
  | "relation"
  | "perception"
  | "mediation"
  | "ready_to_continue";
type World1NodeState = "locked" | "available" | "active" | "completed";

type World1Node = {
  id: "relation" | "perception" | "mediation";
  label: string;
  accessibleName: string;
  lockedName?: string;
};

const conceptNodes: ReadonlyArray<World1Node> = [
  {
    id: "relation",
    label: "RELACIÓN",
    accessibleName: "Explorar RELACIÓN",
  },
  {
    id: "perception",
    label: "PERCEPCIÓN",
    accessibleName: "Explorar PERCEPCIÓN",
    lockedName: "PERCEPCIÓN bloqueada en esta fase",
  },
  {
    id: "mediation",
    label: "MEDIACIÓN",
    accessibleName: "Explorar MEDIACIÓN",
    lockedName: "MEDIACIÓN bloqueada en esta fase",
  },
];

const copyByConcept: Record<
  World1Concept,
  { eyebrow: string; title: string; body: string; secondary?: string }
> = {
  intro: {
    eyebrow: "Mundo I: Raíz",
    title: "Antes de escuchar, necesitamos aprender a mirar.",
    body: "Mundo I empieza en la raíz: una relación viva que se observa con cuidado antes de ser mediada.",
  },
  relation: {
    eyebrow: "RELACIÓN",
    title:
      "La planta no está aislada: vive en relación con la tierra, la luz, el agua y quienes se acercan a cuidarla.",
    body: "Antes de interpretar sus señales, observa cómo cada raíz sostiene un vínculo. En OKÚA, escuchar empieza reconociendo esa relación viva.",
  },
  perception: {
    eyebrow: "PERCEPCIÓN",
    title:
      "Una planta puede parecer quieta, pero eso no significa que esté inactiva.",
    body: "Percibir empieza cuando miramos con más cuidado: hay procesos vivos que no siempre vemos de inmediato.",
  },
  mediation: {
    eyebrow: "MEDIACIÓN",
    title:
      "Mediar no es inventar: es construir una forma cuidadosa de acercarnos a una señal viva.",
    body: "OKÚA no reemplaza la planta ni habla por ella. Ayuda a percibir, con respeto, algo que necesita una mediación para volverse sensible.",
  },
  ready_to_continue: {
    eyebrow: "LISTO PARA CONTINUAR",
    title:
      "Ya recorriste las tres raíces de esta pregunta: relación, percepción y mediación.",
    body: "Ahora podemos avanzar con más cuidado: no para imponer una voz, sino para seguir aprendiendo a percibir.",
    secondary: "La raíz queda lista para continuar el recorrido con calma.",
  },
};

function getNodeState(
  nodeId: World1Node["id"],
  concept: World1Concept,
): World1NodeState {
  if (concept === "intro") {
    return nodeId === "relation" ? "available" : "locked";
  }

  if (concept === "relation") {
    if (nodeId === "relation") {
      return "active";
    }

    return nodeId === "perception" ? "available" : "locked";
  }

  if (concept === "perception") {
    if (nodeId === "relation") {
      return "completed";
    }

    return nodeId === "perception" ? "active" : "available";
  }

  if (concept === "mediation") {
    return nodeId === "mediation" ? "active" : "completed";
  }

  return "completed";
}

export function World1RootScreen() {
  const navigate = useNavigate();
  const [activeConcept, setActiveConcept] = useState<World1Concept>("intro");
  const initialPreload = useAssetPreloader(
    screenAssetBundles.world1RootInitial,
    {
      timeoutMs: 9000,
    },
  );
  const relationPreload = useAssetPreloader(
    screenAssetBundles.world1RootRelation,
    {
      enabled: activeConcept === "intro",
      timeoutMs: 8000,
    },
  );
  const perceptionPreload = useAssetPreloader(
    screenAssetBundles.world1RootPerception,
    {
      enabled: activeConcept === "relation",
      timeoutMs: 8000,
    },
  );
  const mediationPreload = useAssetPreloader(
    screenAssetBundles.world1RootMediation,
    {
      enabled: activeConcept === "perception",
      timeoutMs: 8000,
    },
  );
  const readyPreload = useAssetPreloader(screenAssetBundles.world1RootReady, {
    enabled: activeConcept === "mediation",
    timeoutMs: 8000,
  });
  const copy = copyByConcept[activeConcept];
  const isReadyToContinue = activeConcept === "ready_to_continue";
  const activeRoot =
    activeConcept === "intro" || isReadyToContinue
      ? null
      : {
          concept: activeConcept,
          asset: {
            relation: world1RootAssets.activeRelation,
            perception: world1RootAssets.activePerception,
            mediation: world1RootAssets.activeMediation,
          }[activeConcept],
        };
  const liaAssetByConcept: Record<World1Concept, string> = {
    intro: world1RootAssets.liaIdle,
    relation: world1RootAssets.liaPointRelation,
    perception: world1RootAssets.liaLookPerception,
    mediation: world1RootAssets.liaGuideMediation,
    ready_to_continue: world1RootAssets.liaReadyContinue,
  };
  const liaPoseByConcept: Record<World1Concept, string> = {
    intro: "idle",
    relation: "point_relation",
    perception: "look_perception",
    mediation: "guide_mediation",
    ready_to_continue: "ready_continue",
  };

  return (
    <main
      className="world1-root-screen"
      data-world1-root-version="004E-5A-static-ready"
      data-world1-mobile-stabilization="004F-1C"
      data-world1-root-state={activeConcept}
      data-world1-exit-ready={isReadyToContinue ? "true" : undefined}
      data-critical-assets-ready={initialPreload.ready ? "true" : "false"}
      data-critical-assets-status={initialPreload.status}
      data-world1-relation-preload-ready={
        relationPreload.ready ? "true" : "false"
      }
      data-world1-perception-preload-ready={
        perceptionPreload.ready ? "true" : "false"
      }
      data-world1-mediation-preload-ready={
        mediationPreload.ready ? "true" : "false"
      }
      data-world1-ready-preload-ready={readyPreload.ready ? "true" : "false"}
      aria-labelledby="world1-root-title"
    >
      {initialPreload.ready ? null : (
        <p className="world1-root-preload-status" role="status">
          Preparando raíz...
        </p>
      )}
      <World1RootStageFrame
        className="world1-root-stage"
        data-testid="world1-root-stage"
        aria-label="Mundo I: Raíz"
      >
        <div
          className="world1-root-stage-coordinate-layer"
          data-world1-stage-coordinate-layer="true"
          data-runtime-asset={world1RootAssets.background}
          style={backgroundLayerStyle}
        >
          <img
            className="world1-root-layer world1-root-layer--ambient"
            src={world1RootAssets.ambientLight}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world1RootAssets.ambientLight}
          />
          <img
            className="world1-root-layer world1-root-layer--roots"
            src={world1RootAssets.rootsBase}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world1RootAssets.rootsBase}
          />
          {activeRoot ? (
            <img
              className={`world1-root-layer world1-root-layer--active-${activeRoot.concept}`}
              src={activeRoot.asset}
              alt=""
              aria-hidden="true"
              data-runtime-asset={activeRoot.asset}
              data-world1-root-active={activeRoot.concept}
              data-world1-active-roots-calibration="manual-calibration"
              data-world1-relation-calibration={
                activeRoot.concept === "relation"
                  ? "manual-calibration"
                  : undefined
              }
            />
          ) : null}
          <img
            className="world1-root-plant"
            src={world1RootAssets.plant}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world1RootAssets.plant}
          />
          <img
            className="world1-root-lia"
            src={liaAssetByConcept[activeConcept]}
            alt="Lía, guía visual de OKÚA"
            data-runtime-asset={liaAssetByConcept[activeConcept]}
            data-world1-lia-pose={liaPoseByConcept[activeConcept]}
          />

          <div
            className="world1-root-nodes"
            aria-label="Nodos conceptuales de Mundo I"
          >
            {conceptNodes.map((node) => {
              const nodeState = getNodeState(node.id, activeConcept);
              const isLocked = nodeState === "locked";
              const isPressed = nodeState === "active";
              const isClickable = nodeState === "available" || isPressed;

              return (
                <button
                  className={`world1-root-node world1-root-node--${node.id}`}
                  key={node.id}
                  type="button"
                  data-world1-root-node={node.id}
                  data-node-state={nodeState}
                  aria-label={isLocked ? node.lockedName : node.accessibleName}
                  aria-disabled={!isClickable ? "true" : undefined}
                  aria-pressed={isClickable ? isPressed : undefined}
                  disabled={!isClickable}
                  onClick={
                    isClickable
                      ? () =>
                          setActiveConcept(
                            node.id === "mediation"
                              ? "mediation"
                              : node.id === "perception"
                                ? "perception"
                                : "relation",
                          )
                      : undefined
                  }
                >
                  <span
                    className={`world1-root-node__orb world1-root-node__orb--${nodeState}`}
                    aria-hidden="true"
                    data-runtime-asset={world1RootAssets.nodeKit}
                    data-node-frame={nodeState}
                    style={nodeOrbStyle}
                  ></span>
                  <span className="world1-root-node__label">{node.label}</span>
                </button>
              );
            })}
          </div>

          <div className="world1-root-copy">
            <p className="world1-root-copy__eyebrow">{copy.eyebrow}</p>
            <h1 id="world1-root-title">{copy.title}</h1>
            <p className="world1-root-copy__body">{copy.body}</p>
            {copy.secondary ? (
              <p className="world1-root-copy__note">{copy.secondary}</p>
            ) : null}
            {activeConcept === "mediation" ? (
              <button
                className="world1-root-copy__action"
                type="button"
                onClick={() => {
                  setActiveConcept("ready_to_continue");
                }}
              >
                Cerrar raíz
              </button>
            ) : null}
          </div>

          <button
            className={`world1-root-continue${isReadyToContinue ? " world1-root-continue--ready" : ""}`}
            type="button"
            disabled={!isReadyToContinue}
            aria-disabled={isReadyToContinue ? "false" : "true"}
            data-world1-exit-target={
              isReadyToContinue ? worldTwoPlaceholderRoute : undefined
            }
            onClick={
              isReadyToContinue
                ? () => navigate(worldTwoPlaceholderRoute)
                : undefined
            }
          >
            Continuar
          </button>
        </div>
      </World1RootStageFrame>
    </main>
  );
}
