import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { GestureHint } from "../../components/GestureHint/GestureHint";

export const WORLD4_TAP_HINT_DELAY_MS = 1_800;
export const WORLD4_TAP_HINT_VISIBLE_MS = 1_600;
export const WORLD4_TAP_HINT_STORAGE_KEY = "gvo:world4:tap-hint:shown";

export type World4TapHintDismissReason =
  | "document-hidden"
  | "external"
  | "fullscreen"
  | "keyboard"
  | "orientation"
  | "pointer"
  | "timeout";

export type World4TapHintProps = {
  active: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  className?: string;
  delayMs?: number;
  dismissSignal?: boolean | number | string | null;
  onDismiss?: (reason: World4TapHintDismissReason) => void;
  reducedMotion: boolean;
  storageKey?: string;
  targetLabel: string;
  visibleMs?: number;
};

type TapHintState = "dismissed" | "idle" | "visible" | "waiting";

const inMemorySessionFlags = new Set<string>();

function wasShownThisSession(storageKey: string) {
  if (typeof window === "undefined") {
    return inMemorySessionFlags.has(storageKey);
  }

  try {
    return window.sessionStorage.getItem(storageKey) === "1";
  } catch {
    return inMemorySessionFlags.has(storageKey);
  }
}

function markShownThisSession(storageKey: string) {
  if (typeof window === "undefined") {
    inMemorySessionFlags.add(storageKey);
    return;
  }

  try {
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Memory fallback preserves once-per-session behavior when storage is blocked.
    inMemorySessionFlags.add(storageKey);
  }
}

export function World4TapHint({
  active,
  anchorRef,
  className,
  delayMs = WORLD4_TAP_HINT_DELAY_MS,
  dismissSignal = null,
  onDismiss,
  reducedMotion,
  storageKey = WORLD4_TAP_HINT_STORAGE_KEY,
  targetLabel,
  visibleMs = WORLD4_TAP_HINT_VISIBLE_MS,
}: World4TapHintProps) {
  const [state, setState] = useState<TapHintState>("idle");
  const [orientationHintVisible, setOrientationHintVisible] = useState(() =>
    typeof document === "undefined"
      ? false
      : Boolean(document.querySelector("[data-gvo-orientation-hint]")),
  );
  const [dismissReason, setDismissReason] =
    useState<World4TapHintDismissReason | null>(null);
  const stateRef = useRef<TapHintState>("idle");
  const delayTimerRef = useRef<number | null>(null);
  const visibleTimerRef = useRef<number | null>(null);
  const previousDismissSignalRef = useRef(dismissSignal);
  const onDismissRef = useRef(onDismiss);

  onDismissRef.current = onDismiss;

  const updateState = useCallback((nextState: TapHintState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const clearTimers = useCallback(() => {
    if (delayTimerRef.current !== null) {
      window.clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (visibleTimerRef.current !== null) {
      window.clearTimeout(visibleTimerRef.current);
      visibleTimerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(
    (reason: World4TapHintDismissReason) => {
      if (stateRef.current === "dismissed") {
        return;
      }

      clearTimers();
      markShownThisSession(storageKey);
      setDismissReason(reason);
      updateState("dismissed");
      onDismissRef.current?.(reason);
    },
    [clearTimers, storageKey, updateState],
  );

  useEffect(() => {
    const syncOrientationHint = () => {
      const visible = Boolean(
        document.querySelector("[data-gvo-orientation-hint]"),
      );
      setOrientationHintVisible((current) =>
        current === visible ? current : visible,
      );
    };

    syncOrientationHint();
    const observer = new MutationObserver(syncOrientationHint);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    clearTimers();

    if (!active || orientationHintVisible) {
      if (stateRef.current === "waiting" || stateRef.current === "visible") {
        updateState("idle");
      }
      return;
    }

    if (wasShownThisSession(storageKey)) {
      updateState("dismissed");
      return;
    }

    setDismissReason(null);
    updateState("waiting");
    delayTimerRef.current = window.setTimeout(
      () => {
        delayTimerRef.current = null;
        markShownThisSession(storageKey);
        updateState("visible");
        visibleTimerRef.current = window.setTimeout(
          () => {
            visibleTimerRef.current = null;
            dismiss("timeout");
          },
          Math.max(0, visibleMs),
        );
      },
      Math.max(0, delayMs),
    );

    return clearTimers;
  }, [
    active,
    clearTimers,
    delayMs,
    dismiss,
    orientationHintVisible,
    storageKey,
    updateState,
    visibleMs,
  ]);

  useEffect(() => {
    const previousSignal = previousDismissSignalRef.current;
    previousDismissSignalRef.current = dismissSignal;

    if (!Object.is(previousSignal, dismissSignal)) {
      dismiss("external");
    }
  }, [dismiss, dismissSignal]);

  useEffect(() => {
    if (state === "dismissed") {
      return;
    }

    const handlePointer = (event: PointerEvent) => {
      const target = event.target;
      const orientationDismissed =
        target instanceof Element &&
        Boolean(
          target.closest(
            "[data-gvo-orientation-hint] .gvo-orientation-hint__dismiss",
          ),
        );
      dismiss(orientationDismissed ? "orientation" : "pointer");
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        dismiss("keyboard");
      }
    };
    const handleFullscreen = () => dismiss("fullscreen");
    const handleVisibility = () => {
      if (document.hidden) {
        dismiss("document-hidden");
      }
    };

    window.addEventListener("pointerdown", handlePointer, true);
    window.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pointerdown", handlePointer, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [dismiss, state]);

  useEffect(() => clearTimers, [clearTimers]);

  if (state === "idle" || state === "dismissed") {
    return null;
  }

  const resolvedClassName = [
    "s4-tap-hint",
    reducedMotion ? "s4-tap-hint--reduced" : "s4-tap-hint--standard",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <span
        aria-hidden="true"
        data-station4-tap-hint="controller"
        data-station4-tap-hint-delay-ms={delayMs}
        data-station4-tap-hint-dismiss-reason={dismissReason ?? "none"}
        data-station4-tap-hint-motion={reducedMotion ? "static" : "tap"}
        data-station4-tap-hint-state={state}
        data-station4-tap-hint-visible-ms={visibleMs}
        hidden
      />
      {state === "visible" ? (
        <GestureHint
          active
          anchorRef={anchorRef}
          className={resolvedClassName}
          delayMs={0}
          direction="right"
          targetLabel={targetLabel}
          variant="tap"
        />
      ) : null}
    </>
  );
}
