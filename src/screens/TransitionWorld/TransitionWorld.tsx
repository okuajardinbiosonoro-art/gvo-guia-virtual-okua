import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import { TransitionBackground } from "./components/TransitionBackground";
import { TransitionFade } from "./components/TransitionFade";
import { TransitionLiaSprite } from "./components/TransitionLiaSprite";
import { TransitionPortal } from "./components/TransitionPortal";
import { TransitionProgress } from "./components/TransitionProgress";
import { TransitionSparkles } from "./components/TransitionSparkles";
import { TransitionText } from "./components/TransitionText";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";
import styles from "./TransitionWorld.module.css";
import {
  introToStationOneTransition,
  TRANSITION_WORLD_VERSION,
} from "./transitionWorld.config";
import type { TransitionWorldProps } from "./transitionWorld.types";

export function TransitionWorld({
  config = introToStationOneTransition,
  variant = "preview",
  isReducedMotion = false,
  onComplete,
}: TransitionWorldProps) {
  const completionCalledRef = useRef(false);
  const durationCompleteRef = useRef(false);
  const targetAssetsReadyRef = useRef(
    variant !== "runtime" || config.targetPreload === "none",
  );
  const transitionRootPreload = useAssetPreloader(
    screenAssetBundles.transitionRootCritical,
    {
      timeoutMs: 8000,
    },
  );
  const shouldPreloadWorld1RootInitial =
    variant === "runtime" && config.targetPreload === "world1RootInitial";
  const world1RootInitialPreload = useAssetPreloader(
    screenAssetBundles.world1RootInitial,
    {
      enabled: shouldPreloadWorld1RootInitial,
      timeoutMs: 9000,
    },
  );
  const effectiveDurationMs = isReducedMotion
    ? config.reducedMotionDurationMs
    : config.durationMs;
  const accessibleStatus = `${config.title.replace("...", ".")} ${config.subtitle.replace("...", ".")}`;
  const style = {
    "--transition-text": config.palette.text,
    "--transition-text-soft": config.palette.textSoft,
  } as CSSProperties;

  useEffect(() => {
    targetAssetsReadyRef.current =
      variant !== "runtime" ||
      config.targetPreload === "none" ||
      world1RootInitialPreload.ready;
  }, [config.targetPreload, variant, world1RootInitialPreload.ready]);

  useEffect(() => {
    if (
      variant !== "runtime" ||
      !onComplete ||
      !transitionRootPreload.ready
    ) {
      return undefined;
    }

    completionCalledRef.current = false;
    durationCompleteRef.current = false;
    const timeoutId = window.setTimeout(() => {
      durationCompleteRef.current = true;

      if (targetAssetsReadyRef.current && !completionCalledRef.current) {
        completionCalledRef.current = true;
        onComplete();
      }
    }, effectiveDurationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    effectiveDurationMs,
    onComplete,
    transitionRootPreload.ready,
    variant,
  ]);

  useEffect(() => {
    if (
      variant !== "runtime" ||
      !onComplete ||
      config.targetPreload !== "world1RootInitial" ||
      !durationCompleteRef.current ||
      !world1RootInitialPreload.ready ||
      completionCalledRef.current
    ) {
      return;
    }

    completionCalledRef.current = true;
    onComplete();
  }, [config.targetPreload, onComplete, variant, world1RootInitialPreload.ready]);

  return (
    <main
      className={styles.transitionWorld}
      data-transition-world-version={TRANSITION_WORLD_VERSION}
      data-transition-world-id={config.id}
      data-transition-world-variant={variant}
      data-transition-from-route={config.fromRoute}
      data-transition-to-route={config.toRoute}
      data-duration-ms={config.durationMs}
      data-reduced-motion-duration-ms={config.reducedMotionDurationMs}
      data-reduced-motion={isReducedMotion ? "true" : "false"}
      data-motion-mode="css-timeline"
      data-motion-state={
        variant === "runtime" ? "runtime-sequence" : "preview-sequence"
      }
      data-navigation-locked={variant === "runtime" ? "true" : "false"}
      data-critical-assets-ready={transitionRootPreload.ready ? "true" : "false"}
      data-critical-assets-status={transitionRootPreload.status}
      data-target-preload={config.targetPreload}
      data-target-assets-ready={
        variant === "runtime"
          ? config.targetPreload === "none" || world1RootInitialPreload.ready
            ? "true"
            : "false"
          : undefined
      }
      aria-labelledby="transition-world-title"
      aria-describedby="transition-world-subtitle"
      style={style}
    >
      {transitionRootPreload.ready ? null : (
        <p className={styles.preloadStatus} role="status">
          {config.subtitle}
        </p>
      )}
      <TransitionBackground palette={config.palette} />
      <TransitionSparkles />
      <TransitionFade />
      <section
        className={styles.stage}
        role="status"
        aria-live="polite"
        aria-label={accessibleStatus}
      >
        <div
          className={styles.visualStack}
          data-motion-layer="visual-stack"
          aria-hidden="false"
        >
          <TransitionPortal
            label={config.portalLabel}
            palette={config.palette}
            state={config.portalState}
          />
          <TransitionLiaSprite />
        </div>
        <TransitionText
          editorialCopyStatus={config.editorialCopyStatus}
          title={config.title}
          titleSlotId={config.titleSlotId}
          subtitle={config.subtitle}
          subtitleSlotId={config.subtitleSlotId}
        />
        <TransitionProgress
          durationMs={effectiveDurationMs}
          isReducedMotion={isReducedMotion}
          palette={config.palette}
        />
      </section>
    </main>
  );
}
