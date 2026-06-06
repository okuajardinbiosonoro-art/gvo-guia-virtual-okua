import "./World1RootLayoutCalibrator.css";

import type { CSSProperties, ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { world1RootAssets } from "../world1RootAssets";

type LayoutValues = {
  plantX: number;
  plantY: number;
  plantWidth: number;
  plantAnchorX: number;
  plantAnchorY: number;
  rootOriginX: number;
  rootOriginY: number;
  rootsTop: number;
  rootsWidth: number;
  nodeRelationTop: number;
  nodeRelationX: number;
  nodePerceptionTop: number;
  nodePerceptionX: number;
  nodeMediationTop: number;
  nodeMediationX: number;
};

type ToggleValues = {
  showBackground: boolean;
  showAmbientLight: boolean;
  showPlant: boolean;
  showRoots: boolean;
  showNodes: boolean;
  showLia: boolean;
  showGuides: boolean;
  showAnchorDots: boolean;
  showStageCenter: boolean;
};

type CalibratorStyle = CSSProperties & {
  "--cal-plant-x": string;
  "--cal-plant-y": string;
  "--cal-plant-width": string;
  "--cal-plant-anchor-x": string;
  "--cal-plant-anchor-y": string;
  "--cal-root-origin-x": string;
  "--cal-root-origin-y": string;
  "--cal-roots-top": string;
  "--cal-roots-width": string;
  "--cal-node-relation-top": string;
  "--cal-node-relation-x": string;
  "--cal-node-perception-top": string;
  "--cal-node-perception-x": string;
  "--cal-node-mediation-top": string;
  "--cal-node-mediation-x": string;
  "--cal-node-kit": string;
};

const defaultToggles: ToggleValues = {
  showBackground: true,
  showAmbientLight: true,
  showPlant: true,
  showRoots: true,
  showNodes: true,
  showLia: false,
  showGuides: true,
  showAnchorDots: true,
  showStageCenter: true,
};

const presets: Record<string, LayoutValues> = {
  "004E-1D": {
    plantX: 49.6,
    plantY: 36.5,
    plantWidth: 40,
    plantAnchorX: 50,
    plantAnchorY: 90.7,
    rootOriginX: 50.8,
    rootOriginY: 35.9,
    rootsTop: 20.3,
    rootsWidth: 100,
    nodeRelationTop: 62,
    nodeRelationX: 8,
    nodePerceptionTop: 60,
    nodePerceptionX: 50,
    nodeMediationTop: 62,
    nodeMediationX: 8,
  },
  "004E-1E": {
    plantX: 50.8,
    plantY: 35.9,
    plantWidth: 40,
    plantAnchorX: 56.9,
    plantAnchorY: 90.7,
    rootOriginX: 50.8,
    rootOriginY: 35.9,
    rootsTop: 20.3,
    rootsWidth: 100,
    nodeRelationTop: 62,
    nodeRelationX: 8,
    nodePerceptionTop: 60,
    nodePerceptionX: 50,
    nodeMediationTop: 62,
    nodeMediationX: 8,
  },
  current: {
    plantX: 50.5,
    plantY: 33.5,
    plantWidth: 40,
    plantAnchorX: 56.9,
    plantAnchorY: 93.2,
    rootOriginX: 50.8,
    rootOriginY: 35.9,
    rootsTop: 20.3,
    rootsWidth: 100,
    nodeRelationTop: 62,
    nodeRelationX: 8,
    nodePerceptionTop: 60,
    nodePerceptionX: 50,
    nodeMediationTop: 62,
    nodeMediationX: 8,
  },
  "manual candidate": {
    plantX: 50.5,
    plantY: 33.5,
    plantWidth: 40,
    plantAnchorX: 56.9,
    plantAnchorY: 93.2,
    rootOriginX: 50.8,
    rootOriginY: 35.9,
    rootsTop: 20.3,
    rootsWidth: 100,
    nodeRelationTop: 62,
    nodeRelationX: 8,
    nodePerceptionTop: 60,
    nodePerceptionX: 50,
    nodeMediationTop: 62,
    nodeMediationX: 8,
  },
};

const controlGroups: Array<{
  title: string;
  controls: Array<{
    key: keyof LayoutValues;
    label: string;
    min: number;
    max: number;
    step: number;
  }>;
}> = [
  {
    title: "Planta",
    controls: [
      { key: "plantX", label: "plantX", min: 40, max: 60, step: 0.1 },
      { key: "plantY", label: "plantY", min: 5, max: 45, step: 0.1 },
      { key: "plantWidth", label: "plantWidth", min: 30, max: 55, step: 0.1 },
      {
        key: "plantAnchorX",
        label: "plantAnchorX",
        min: 40,
        max: 70,
        step: 0.1,
      },
      {
        key: "plantAnchorY",
        label: "plantAnchorY",
        min: 75,
        max: 100,
        step: 0.1,
      },
    ],
  },
  {
    title: "Raiz",
    controls: [
      {
        key: "rootOriginX",
        label: "rootOriginX",
        min: 45,
        max: 55,
        step: 0.1,
      },
      {
        key: "rootOriginY",
        label: "rootOriginY",
        min: 25,
        max: 45,
        step: 0.1,
      },
      { key: "rootsTop", label: "rootsTop", min: 15, max: 30, step: 0.1 },
      {
        key: "rootsWidth",
        label: "rootsWidth",
        min: 90,
        max: 110,
        step: 0.1,
      },
    ],
  },
  {
    title: "Nodos",
    controls: [
      {
        key: "nodeRelationTop",
        label: "nodeRelationTop",
        min: 50,
        max: 75,
        step: 0.1,
      },
      {
        key: "nodeRelationX",
        label: "nodeRelationX",
        min: 2,
        max: 20,
        step: 0.1,
      },
      {
        key: "nodePerceptionTop",
        label: "nodePerceptionTop",
        min: 50,
        max: 75,
        step: 0.1,
      },
      {
        key: "nodePerceptionX",
        label: "nodePerceptionX",
        min: 40,
        max: 60,
        step: 0.1,
      },
      {
        key: "nodeMediationTop",
        label: "nodeMediationTop",
        min: 50,
        max: 75,
        step: 0.1,
      },
      {
        key: "nodeMediationX",
        label: "nodeMediationX",
        min: 2,
        max: 20,
        step: 0.1,
      },
    ],
  },
];

const toggleControls: Array<{ key: keyof ToggleValues; label: string }> = [
  { key: "showBackground", label: "background" },
  { key: "showAmbientLight", label: "ambient" },
  { key: "showPlant", label: "plant" },
  { key: "showRoots", label: "roots" },
  { key: "showNodes", label: "nodes" },
  { key: "showLia", label: "Lia" },
  { key: "showGuides", label: "guides" },
  { key: "showAnchorDots", label: "anchor dots" },
  { key: "showStageCenter", label: "stage center" },
];

function readInitialValues() {
  if (typeof window === "undefined") {
    return presets.current;
  }

  const params = new URLSearchParams(window.location.search);
  const initial = { ...presets.current };

  for (const key of Object.keys(initial) as Array<keyof LayoutValues>) {
    const value = Number.parseFloat(params.get(key) ?? "");
    if (Number.isFinite(value)) {
      initial[key] = value;
    }
  }

  return initial;
}

function format(value: number) {
  return Number(value.toFixed(1));
}

function makePercent(value: number) {
  return `${format(value)}%`;
}

function useStageSize() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    const update = () => {
      setSize({
        width: stage.clientWidth,
        height: stage.clientHeight,
      });
    };

    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);

      return () => {
        window.removeEventListener("resize", update);
      };
    }

    const observer = new ResizeObserver(update);
    observer.observe(stage);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { stageRef, size };
}

function getStatus(deltaX: number, deltaY: number) {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX <= 1.5 && absY <= 1.5) {
    return "aligned";
  }

  if (absX > 1.5 && absX > absY) {
    return "needs horizontal adjustment";
  }

  if (absY > 1.5 && absY >= absX) {
    return "needs vertical adjustment";
  }

  return "manual visual check required";
}

export function World1RootLayoutCalibrator() {
  const [values, setValues] = useState<LayoutValues>(() =>
    readInitialValues(),
  );
  const [toggles, setToggles] = useState<ToggleValues>(defaultToggles);
  const { stageRef, size } = useStageSize();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      params.set(key, String(format(value)));
    }
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [values]);

  const style = useMemo<CalibratorStyle>(
    () => ({
      "--cal-plant-x": makePercent(values.plantX),
      "--cal-plant-y": makePercent(values.plantY),
      "--cal-plant-width": makePercent(values.plantWidth),
      "--cal-plant-anchor-x": makePercent(values.plantAnchorX),
      "--cal-plant-anchor-y": makePercent(values.plantAnchorY),
      "--cal-root-origin-x": makePercent(values.rootOriginX),
      "--cal-root-origin-y": makePercent(values.rootOriginY),
      "--cal-roots-top": makePercent(values.rootsTop),
      "--cal-roots-width": makePercent(values.rootsWidth),
      "--cal-node-relation-top": makePercent(values.nodeRelationTop),
      "--cal-node-relation-x": makePercent(values.nodeRelationX),
      "--cal-node-perception-top": makePercent(values.nodePerceptionTop),
      "--cal-node-perception-x": makePercent(values.nodePerceptionX),
      "--cal-node-mediation-top": makePercent(values.nodeMediationTop),
      "--cal-node-mediation-x": makePercent(values.nodeMediationX),
      "--cal-node-kit": `url(${world1RootAssets.nodeKit})`,
    }),
    [values],
  );

  const deltaX = ((values.plantX - values.rootOriginX) / 100) * size.width;
  const deltaY = ((values.plantY - values.rootOriginY) / 100) * size.height;
  const status = getStatus(deltaX, deltaY);

  const cssExport = [
    `--world1-root-origin-x: ${makePercent(values.rootOriginX)};`,
    `--world1-root-origin-y: ${makePercent(values.rootOriginY)};`,
    `--world1-plant-x: ${makePercent(values.plantX)};`,
    `--world1-plant-y: ${makePercent(values.plantY)};`,
    `--world1-plant-width: ${makePercent(values.plantWidth)};`,
    `--world1-plant-anchor-x: ${makePercent(values.plantAnchorX)};`,
    `--world1-plant-anchor-y: ${makePercent(values.plantAnchorY)};`,
    `--world1-roots-top: ${makePercent(values.rootsTop)};`,
    `--world1-roots-width: ${makePercent(values.rootsWidth)};`,
  ].join("\n");

  const jsonExport = JSON.stringify(
    Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, makePercent(value)]),
    ),
    null,
    2,
  );

  const updateValue =
    (key: keyof LayoutValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number.parseFloat(event.target.value);
      if (!Number.isFinite(nextValue)) {
        return;
      }
      setValues((current) => ({ ...current, [key]: nextValue }));
    };

  return (
    <main className="world1-calibrator" data-testid="world1-layout-calibrator">
      <section className="world1-calibrator__preview" aria-label="Calibración Mundo I">
        <div
          className="world1-calibrator__stage"
          data-testid="world1-calibrator-stage"
          ref={stageRef}
          style={style}
        >
          {toggles.showBackground ? (
            <img
              className="world1-calibrator__layer world1-calibrator__layer--background"
              src={world1RootAssets.background}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world1RootAssets.background}
            />
          ) : null}
          {toggles.showAmbientLight ? (
            <img
              className="world1-calibrator__layer world1-calibrator__layer--ambient"
              src={world1RootAssets.ambientLight}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world1RootAssets.ambientLight}
            />
          ) : null}
          {toggles.showRoots ? (
            <img
              className="world1-calibrator__roots"
              src={world1RootAssets.rootsBase}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world1RootAssets.rootsBase}
            />
          ) : null}
          {toggles.showPlant ? (
            <img
              className="world1-calibrator__plant"
              src={world1RootAssets.plant}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world1RootAssets.plant}
            />
          ) : null}
          {toggles.showLia ? (
            <img
              className="world1-calibrator__lia"
              src={world1RootAssets.liaIdle}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world1RootAssets.liaIdle}
            />
          ) : null}
          {toggles.showNodes ? (
            <div className="world1-calibrator__nodes" aria-hidden="true">
              <div className="world1-calibrator__node world1-calibrator__node--relation">
                <span className="world1-calibrator__node-label">RELACIÓN</span>
                <span className="world1-calibrator__orb world1-calibrator__orb--available"></span>
              </div>
              <div className="world1-calibrator__node world1-calibrator__node--perception">
                <span className="world1-calibrator__node-label">PERCEPCIÓN</span>
                <span className="world1-calibrator__orb world1-calibrator__orb--locked"></span>
              </div>
              <div className="world1-calibrator__node world1-calibrator__node--mediation">
                <span className="world1-calibrator__node-label">MEDIACIÓN</span>
                <span className="world1-calibrator__orb world1-calibrator__orb--locked"></span>
              </div>
            </div>
          ) : null}
          {toggles.showGuides ? (
            <svg
              className="world1-calibrator__guides"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {toggles.showStageCenter ? (
                <line
                  className="world1-calibrator__guide-center"
                  x1="50"
                  y1="0"
                  x2="50"
                  y2="100"
                />
              ) : null}
              <line
                className="world1-calibrator__guide-connector"
                x1={values.rootOriginX}
                y1={values.rootOriginY}
                x2={values.plantX}
                y2={values.plantY}
              />
            </svg>
          ) : null}
          {toggles.showAnchorDots ? (
            <div className="world1-calibrator__anchor-layer" aria-hidden="true">
              <span className="world1-calibrator__anchor world1-calibrator__anchor--root"></span>
              <span className="world1-calibrator__anchor world1-calibrator__anchor--plant"></span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="world1-calibrator__panel">
        <div className="world1-calibrator__header">
          <h1>Calibración Mundo I</h1>
          <p>
            Delta X {deltaX.toFixed(1)}px · Delta Y {deltaY.toFixed(1)}px ·{" "}
            {status}
          </p>
        </div>

        <fieldset className="world1-calibrator__fieldset">
          <legend>Presets</legend>
          <div className="world1-calibrator__preset-row">
            {Object.keys(presets).map((presetName) => (
              <button
                className="world1-calibrator__preset"
                key={presetName}
                type="button"
                onClick={() => setValues(presets[presetName])}
              >
                {presetName}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="world1-calibrator__fieldset">
          <legend>Capas</legend>
          <div className="world1-calibrator__toggle-grid">
            {toggleControls.map((control) => (
              <label className="world1-calibrator__toggle" key={control.key}>
                <input
                  checked={toggles[control.key]}
                  onChange={(event) =>
                    setToggles((current) => ({
                      ...current,
                      [control.key]: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
                <span>{control.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {controlGroups.map((group) => (
          <fieldset className="world1-calibrator__fieldset" key={group.title}>
            <legend>{group.title}</legend>
            {group.controls.map((control) => (
              <label className="world1-calibrator__control" key={control.key}>
                <span>{control.label}</span>
                <input
                  aria-label={control.label}
                  max={control.max}
                  min={control.min}
                  onChange={updateValue(control.key)}
                  step={control.step}
                  type="range"
                  value={values[control.key]}
                />
                <input
                  aria-label={`${control.label} value`}
                  max={control.max}
                  min={control.min}
                  onChange={updateValue(control.key)}
                  step={control.step}
                  type="number"
                  value={values[control.key]}
                />
              </label>
            ))}
          </fieldset>
        ))}

        <section className="world1-calibrator__exports" aria-label="Exportación">
          <h2>CSS</h2>
          <pre>{cssExport}</pre>
          <h2>JSON</h2>
          <pre>{jsonExport}</pre>
        </section>
      </section>
    </main>
  );
}
