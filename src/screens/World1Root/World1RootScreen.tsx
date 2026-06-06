import "./World1RootScreen.css";

import type { CSSProperties } from "react";
import { useState } from "react";

import { world1RootAssets } from "./world1RootAssets";

type NodeOrbStyle = CSSProperties & {
  "--world1-node-kit": string;
};

const nodeOrbStyle = {
  "--world1-node-kit": `url(${world1RootAssets.nodeKit})`,
} as NodeOrbStyle;

type World1Concept = "intro" | "relation" | "perception" | "mediation";
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
  { eyebrow: string; title: string; body: string }
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

  return nodeId === "mediation" ? "active" : "completed";
}

export function World1RootScreen() {
  const [activeConcept, setActiveConcept] = useState<World1Concept>("intro");
  const copy = copyByConcept[activeConcept];
  const activeRoot =
    activeConcept === "intro"
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
  };
  const liaPoseByConcept: Record<World1Concept, string> = {
    intro: "idle",
    relation: "point_relation",
    perception: "look_perception",
    mediation: "guide_mediation",
  };

  return (
    <main
      className="world1-root-screen"
      data-world1-root-version="004E-4A-static-mediation"
      data-world1-root-state={activeConcept}
      aria-labelledby="world1-root-title"
    >
      <section
        className="world1-root-stage"
        data-testid="world1-root-stage"
        aria-label="Mundo I: Raíz"
      >
        <img
          className="world1-root-layer world1-root-layer--background"
          src={world1RootAssets.background}
          alt=""
          aria-hidden="true"
          data-runtime-asset={world1RootAssets.background}
        />
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
              activeRoot.concept === "relation" ? "manual-calibration" : undefined
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
                >
                </span>
                <span className="world1-root-node__label">{node.label}</span>
              </button>
            );
          })}
        </div>

        <div className="world1-root-copy">
          <p className="world1-root-copy__eyebrow">{copy.eyebrow}</p>
          <h1 id="world1-root-title">{copy.title}</h1>
          <p>{copy.body}</p>
        </div>

        <button
          className="world1-root-continue"
          type="button"
          disabled
          aria-disabled="true"
        >
          Continuar
        </button>
      </section>
    </main>
  );
}
