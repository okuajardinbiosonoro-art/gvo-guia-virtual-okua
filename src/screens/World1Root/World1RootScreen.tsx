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

type World1Concept = "intro" | "relation";

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
};

function getNodeState(nodeId: World1Node["id"], concept: World1Concept) {
  if (nodeId === "relation") {
    return concept === "relation" ? "active" : "available";
  }

  return "locked";
}

export function World1RootScreen() {
  const [activeConcept, setActiveConcept] = useState<World1Concept>("intro");
  const copy = copyByConcept[activeConcept];
  const isRelationActive = activeConcept === "relation";
  const liaAsset = isRelationActive
    ? world1RootAssets.liaPointRelation
    : world1RootAssets.liaIdle;

  return (
    <main
      className="world1-root-screen"
      data-world1-root-version="004E-2A-static-relation"
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
        {isRelationActive ? (
          <img
            className="world1-root-layer world1-root-layer--active-relation"
            src={world1RootAssets.activeRelation}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world1RootAssets.activeRelation}
            data-world1-root-active="relation"
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
          src={liaAsset}
          alt="Lía, guía visual de OKÚA"
          data-runtime-asset={liaAsset}
          data-world1-lia-pose={isRelationActive ? "point_relation" : "idle"}
        />

        <div
          className="world1-root-nodes"
          aria-label="Nodos conceptuales de Mundo I"
        >
          {conceptNodes.map((node) => {
            const nodeState = getNodeState(node.id, activeConcept);
            const isRelationNode = node.id === "relation";
            const isLocked = nodeState === "locked";

            return (
              <button
                className={`world1-root-node world1-root-node--${node.id}`}
                key={node.id}
                type="button"
                data-world1-root-node={node.id}
                data-node-state={nodeState}
                aria-label={isLocked ? node.lockedName : node.accessibleName}
                aria-disabled={isLocked ? "true" : undefined}
                aria-pressed={isRelationNode ? isRelationActive : undefined}
                disabled={isLocked}
                onClick={
                  isRelationNode
                    ? () => setActiveConcept("relation")
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
