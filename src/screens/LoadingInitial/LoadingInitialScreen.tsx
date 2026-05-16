import "./LoadingInitialScreen.css";

import type { CSSProperties } from "react";

import { loadingInitialAssets } from "./loadingInitialAssets";
import { loadingInitialCopy } from "./loadingInitialCopy";
import { loadingInitialTimeline } from "./loadingInitialTimeline";

const sceneAssetStyle = {
  "--loading-lia-sprite": `url("${loadingInitialAssets.lia.src}")`,
  "--loading-plant-sprite": `url("${loadingInitialAssets.plant.src}")`,
  "--loading-water-sprite": `url("${loadingInitialAssets.water.src}")`,
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
        data-duration-seconds={loadingInitialTimeline.durationSeconds}
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
            data-runtime-asset={loadingInitialAssets.plant.src}
          />
          <span
            className="loading-initial__water"
            data-runtime-asset={loadingInitialAssets.water.src}
          />
          <span className="loading-initial__lia-shell">
            <span
              className="loading-initial__lia"
              data-runtime-asset={loadingInitialAssets.lia.src}
            />
          </span>
          {loadingInitialAssets.sparkles.map((sparkle, index) => (
            <img
              key={sparkle.assetId}
              className={`loading-initial__sparkle loading-initial__sparkle--${
                index + 1
              }`}
              src={sparkle.src}
              alt=""
              draggable="false"
              data-runtime-asset={sparkle.src}
            />
          ))}
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
