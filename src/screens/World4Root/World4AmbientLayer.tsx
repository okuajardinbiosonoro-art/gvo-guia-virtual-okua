import type { CSSProperties } from "react";

export type World4AmbientDensity =
  | "compact-portrait"
  | "mobile-landscape"
  | "full";

export type World4AmbientLayerProps = {
  className?: string;
  density?: World4AmbientDensity;
  reducedMotion: boolean;
};

type AmbientElementStyle = CSSProperties & {
  "--s4-ambient-delay"?: string;
  "--s4-ambient-duration": string;
  "--s4-ambient-opacity": string;
  "--s4-ambient-size"?: string;
  "--s4-ambient-x": string;
  "--s4-ambient-y": string;
};

export const WORLD4_AMBIENT_RIBBONS = [
  {
    durationMs: 18_000,
    id: "left",
    opacity: 0.07,
    x: 27,
    y: 58,
  },
  {
    durationMs: 21_000,
    id: "right",
    opacity: 0.055,
    x: 73,
    y: 48,
  },
] as const;

export const WORLD4_TECHNICAL_MOTES = [
  {
    delayMs: 0,
    durationMs: 19_000,
    id: "m1",
    opacity: 0.11,
    size: 1.5,
    x: 13,
    y: 35,
  },
  {
    delayMs: -4_100,
    durationMs: 23_000,
    id: "m2",
    opacity: 0.08,
    size: 2,
    x: 29,
    y: 63,
  },
  {
    delayMs: -8_600,
    durationMs: 21_000,
    id: "m3",
    opacity: 0.14,
    size: 1,
    x: 43,
    y: 29,
  },
  {
    delayMs: -2_700,
    durationMs: 24_000,
    id: "m4",
    opacity: 0.09,
    size: 2.5,
    x: 58,
    y: 69,
  },
  {
    delayMs: -11_200,
    durationMs: 20_000,
    id: "m5",
    opacity: 0.12,
    size: 1.5,
    x: 72,
    y: 37,
  },
  {
    delayMs: -6_300,
    durationMs: 22_000,
    id: "m6",
    opacity: 0.07,
    size: 2,
    x: 87,
    y: 59,
  },
] as const;

const moteCountByDensity: Record<World4AmbientDensity, number> = {
  "compact-portrait": 3,
  "mobile-landscape": 4,
  full: 6,
};

export function World4AmbientLayer({
  className,
  density = "full",
  reducedMotion,
}: World4AmbientLayerProps) {
  const visibleMotes = WORLD4_TECHNICAL_MOTES.slice(
    0,
    moteCountByDensity[density],
  );

  return (
    <div
      aria-hidden="true"
      className={["s4-ambient", className].filter(Boolean).join(" ")}
      data-station4-ambient="technical-contained"
      data-station4-ambient-density={density}
      data-station4-ambient-motion={reducedMotion ? "static" : "slow-drift"}
      data-station4-mote-count={visibleMotes.length}
      data-station4-ribbon-count={WORLD4_AMBIENT_RIBBONS.length}
      style={{ pointerEvents: "none" }}
    >
      <div className="s4-ambient__ribbons" data-station4-ribbons="2">
        {WORLD4_AMBIENT_RIBBONS.map((ribbon, index) => {
          const style = {
            "--s4-ambient-duration": `${ribbon.durationMs}ms`,
            "--s4-ambient-opacity": String(ribbon.opacity),
            "--s4-ambient-x": `${ribbon.x}%`,
            "--s4-ambient-y": `${ribbon.y}%`,
          } as AmbientElementStyle;

          return (
            <span
              className="s4-ambient__ribbon"
              data-station4-ribbon={ribbon.id}
              data-station4-ribbon-index={index + 1}
              key={ribbon.id}
              style={style}
            />
          );
        })}
      </div>

      <div className="s4-ambient__motes" data-station4-motes="deterministic">
        {visibleMotes.map((mote, index) => {
          const style = {
            "--s4-ambient-delay": `${mote.delayMs}ms`,
            "--s4-ambient-duration": `${mote.durationMs}ms`,
            "--s4-ambient-opacity": String(mote.opacity),
            "--s4-ambient-size": `${mote.size}px`,
            "--s4-ambient-x": `${mote.x}%`,
            "--s4-ambient-y": `${mote.y}%`,
          } as AmbientElementStyle;

          return (
            <span
              className="s4-ambient__mote"
              data-station4-mote={mote.id}
              data-station4-mote-index={index + 1}
              data-station4-mote-position={`${mote.x},${mote.y}`}
              key={mote.id}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}
