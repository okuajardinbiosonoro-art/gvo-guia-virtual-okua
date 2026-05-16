import "./LoadingInitialScreen.css";

import type { CSSProperties } from "react";

import { loadingInitialAssets } from "./loadingInitialAssets";
import { loadingInitialCopy } from "./loadingInitialCopy";
import {
  loadingInitialSparkleSlots,
  loadingInitialWaterStreams,
} from "./loadingInitialScene";
import { loadingInitialTimeline } from "./loadingInitialTimeline";

const sceneAssetStyle = {
  "--loading-lia-sprite": `url("${loadingInitialAssets.lia.src}")`,
  "--loading-plant-sprite": `url("${loadingInitialAssets.plant.src}")`,
  "--loading-water-sprite": `url("${loadingInitialAssets.water.src}")`,
  "--loading-duration": `${loadingInitialTimeline.durationMs}ms`,
  "--loading-reduced-duration": `${loadingInitialTimeline.reducedMotionDurationMs}ms`,
} as CSSProperties;

export function LoadingInitialScreen() {
  return (
    <main
      className="loading-initial"
      aria-labelledby="loading-initial-title"
      aria-describedby="loading-initial-description"
    >
      <section
        className="loading-initial__stage"
        data-duration-ms={loadingInitialTimeline.durationMs}
        data-reduced-motion-duration-ms={
          loadingInitialTimeline.reducedMotionDurationMs
        }
      >
        <div
          className="loading-initial__scene"
          aria-hidden="true"
          data-testid="loading-initial-animated-scene"
          style={sceneAssetStyle}
        >
          <img
            className="loading-initial__halo"
            src={loadingInitialAssets.ground.src}
            alt=""
            draggable="false"
          />
          <span
            className="loading-initial__plant"
            data-testid="loading-initial-plant"
            data-runtime-asset={loadingInitialAssets.plant.src}
          >
            {[1, 2, 3, 4].map((frame) => (
              <span
                key={frame}
                className={`loading-initial__plant-frame loading-initial__plant-frame--${frame}`}
              />
            ))}
          </span>
          <span
            className="loading-initial__water-field"
            data-testid="loading-initial-water-field"
          >
            {loadingInitialWaterStreams.map((stream) => (
              <span
                key={stream.id}
                className={`loading-initial__water-stream ${stream.className}`}
                data-water-stream={stream.id}
                data-runtime-asset={loadingInitialAssets.water.src}
                style={
                  {
                    "--water-stream-delay": `${stream.delayMs}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
          <span
            className="loading-initial__lia-track"
            data-testid="loading-initial-lia-track"
            data-entry-state="lateral-offscreen-to-plant"
          >
            <span className="loading-initial__lia-bob">
              <span
                className="loading-initial__lia"
                data-runtime-asset={loadingInitialAssets.lia.src}
              />
            </span>
          </span>
          {loadingInitialSparkleSlots.map((slot) => {
            const sparkle = loadingInitialAssets.sparkles[slot.assetIndex];

            return (
              <img
                key={slot.id}
                className={`loading-initial__sparkle ${slot.className}`}
                src={sparkle.src}
                alt=""
                draggable="false"
                data-sparkle-slot={slot.id}
                data-runtime-asset={sparkle.src}
                style={
                  {
                    "--sparkle-x": slot.x,
                    "--sparkle-y": slot.y,
                    "--sparkle-delay": `${slot.delayMs}ms`,
                    "--sparkle-duration": `${slot.durationMs}ms`,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>

        <div className="loading-initial__copy">
          <h1 id="loading-initial-title">{loadingInitialCopy.title}</h1>
          <p id="loading-initial-description">{loadingInitialCopy.subtitle}</p>
        </div>

        <div
          className="loading-initial__progress"
          role="progressbar"
          aria-labelledby="loading-initial-title"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="loading-initial__progress-fill" />
        </div>
      </section>
    </main>
  );
}
