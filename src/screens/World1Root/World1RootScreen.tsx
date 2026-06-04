import "./World1RootScreen.css";

import type { CSSProperties } from "react";

import { world1RootAssets } from "./world1RootAssets";

type NodeOrbStyle = CSSProperties & {
  "--world1-node-kit": string;
};

const nodeOrbStyle = {
  "--world1-node-kit": `url(${world1RootAssets.nodeKit})`,
} as NodeOrbStyle;

const conceptNodes = [
  {
    id: "relation",
    label: "RELACIÓN",
    state: "available",
    frame: "available",
  },
  {
    id: "perception",
    label: "PERCEPCIÓN",
    state: "locked",
    frame: "locked",
  },
  {
    id: "mediation",
    label: "MEDIACIÓN",
    state: "locked",
    frame: "locked",
  },
] as const;

export function World1RootScreen() {
  return (
    <main
      className="world1-root-screen"
      data-world1-root-version="004E-1-static"
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
        <img
          className="world1-root-plant"
          src={world1RootAssets.plant}
          alt=""
          aria-hidden="true"
          data-runtime-asset={world1RootAssets.plant}
        />
        <img
          className="world1-root-lia"
          src={world1RootAssets.liaIdle}
          alt="Lía, guía visual de OKÚA"
          data-runtime-asset={world1RootAssets.liaIdle}
        />

        <div
          className="world1-root-nodes"
          aria-label="Nodos conceptuales de Mundo I"
        >
          {conceptNodes.map((node) => (
            <div
              className={`world1-root-node world1-root-node--${node.id}`}
              key={node.id}
              data-world1-root-node={node.id}
              data-node-state={node.state}
              aria-label={`${node.label}, ${node.state === "available" ? "disponible en próxima fase" : "bloqueado en esta fase"}`}
            >
              <span
                className={`world1-root-node__orb world1-root-node__orb--${node.frame}`}
                aria-hidden="true"
                data-runtime-asset={world1RootAssets.nodeKit}
                data-node-frame={node.frame}
                style={nodeOrbStyle}
              >
              </span>
              <span className="world1-root-node__label">{node.label}</span>
            </div>
          ))}
        </div>

        <div className="world1-root-copy">
          <p className="world1-root-copy__eyebrow">Mundo I: Raíz</p>
          <h1 id="world1-root-title">
            Antes de escuchar, necesitamos aprender a mirar.
          </h1>
          <p>
            Mundo I empieza en la raíz: una relación viva que se observa con
            cuidado antes de ser mediada.
          </p>
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
