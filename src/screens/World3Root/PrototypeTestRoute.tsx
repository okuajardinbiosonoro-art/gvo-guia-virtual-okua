export type PrototypeTestRouteStage =
  | "entering"
  | "assembly"
  | "testing"
  | "learning"
  | "summary"
  | "ready"
  | "confirmed"
  | "revisit";

type PrototypeLedState = "off" | "testing" | "confirmed";

type PrototypeTestRouteProps = {
  stage: PrototypeTestRouteStage;
  reducedMotion: boolean;
};

const checkpoints = [
  { id: "terminal", x: 72, y: 15 },
  { id: "dip", x: 46, y: 38 },
  { id: "socket", x: 56, y: 57 },
  { id: "esp32-led", x: 63, y: 78 },
] as const;

const focusZonesByStage = {
  assembly: ["terminals", "structure"],
  testing: ["dip", "sockets"],
  learning: ["esp32", "led"],
} as const;

export function PrototypeTestRoute({
  stage,
  reducedMotion,
}: PrototypeTestRouteProps) {
  const routeVisible = !["entering", "assembly"].includes(stage);
  const routeState = routeVisible
    ? stage === "testing" && !reducedMotion
      ? "tracing"
      : "final"
    : "hidden";
  const ledState: PrototypeLedState =
    stage === "testing" ? "testing" : stage === "confirmed" ? "confirmed" : "off";
  const focusZones =
    stage === "assembly" || stage === "testing" || stage === "learning"
      ? focusZonesByStage[stage]
      : [];

  return (
    <div
      className="s3-prototype-route-layer"
      data-station3-prototype-component-focus={focusZones.join(",") || "none"}
      aria-hidden="true"
    >
      <svg
        className="s3-prototype-route"
        data-station3-prototype-test-route={routeState}
        data-station3-prototype-route-motion={reducedMotion ? "reduced" : "normal"}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        focusable="false"
        aria-hidden="true"
      >
        <polyline
          className="s3-prototype-route__path"
          pathLength="100"
          points={checkpoints.map(({ x, y }) => `${x},${y}`).join(" ")}
        />
        {checkpoints.map((checkpoint, index) => (
          <rect
            className="s3-prototype-route__checkpoint"
            data-station3-prototype-route-checkpoint={checkpoint.id}
            data-checkpoint-order={index + 1}
            key={checkpoint.id}
            x={checkpoint.x - 1.2}
            y={checkpoint.y - 1.2}
            width="2.4"
            height="2.4"
          />
        ))}
      </svg>

      {checkpoints.map((checkpoint) => (
        <span
          className={`s3-prototype-anchor s3-prototype-anchor--${checkpoint.id}`}
          data-station3-prototype-anchor={checkpoint.id}
          key={checkpoint.id}
          style={{ left: `${checkpoint.x}%`, top: `${checkpoint.y}%` }}
        />
      ))}

      {focusZones.map((zone) => (
        <span
          className={`s3-prototype-focus s3-prototype-focus--${zone}`}
          data-station3-prototype-focus-zone={zone}
          key={zone}
        />
      ))}

      <span
        className="s3-prototype-led"
        data-station3-prototype-led={ledState}
        data-station3-prototype-led-activations={
          ledState === "testing" && !reducedMotion ? "2" : "0"
        }
      />
    </div>
  );
}
