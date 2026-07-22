import { useCallback, useEffect, useRef, useState } from "react";

import {
  WORLD4_MOTION_NODE_COUNT,
  WORLD4_MOTION_TIMELINES,
  type World4EntryMode,
  type World4MotionMode,
  type World4VisualPhase,
} from "./world4MotionTokens";

export type World4MotionKind = "entry" | "node_step" | "chain" | "exit";

export type World4MotionCompletionReason =
  | "timeline"
  | "manual-settle"
  | "document-hidden"
  | "reduced-motion-change";

export type World4MotionContext = {
  entryMode: World4EntryMode | null;
  epoch: number;
  kind: World4MotionKind;
  mode: World4MotionMode;
  nodeIndex: number | null;
};

export type World4MotionCompletion = World4MotionContext & {
  reason: World4MotionCompletionReason;
};

export type UseWorld4MotionControllerOptions = {
  reducedMotion: boolean;
  onCardSwap?: (context: World4MotionContext) => void;
  onEntrySettled?: (completion: World4MotionCompletion) => void;
  onStepSettled?: (completion: World4MotionCompletion) => void;
  onChainSettled?: (completion: World4MotionCompletion) => void;
  onExitSettled?: (completion: World4MotionCompletion) => void;
};

type ActiveOperation = World4MotionContext & {
  cardSwapFired: boolean;
};

type StartResult = number | null;

function motionMode(reducedMotion: boolean): World4MotionMode {
  return reducedMotion ? "reduced" : "standard";
}

function assertNodeIndex(nodeIndex: number) {
  if (
    !Number.isInteger(nodeIndex) ||
    nodeIndex < 0 ||
    nodeIndex >= WORLD4_MOTION_NODE_COUNT
  ) {
    throw new RangeError(
      `World4 motion node index must be between 0 and ${WORLD4_MOTION_NODE_COUNT - 1}.`,
    );
  }
}

/**
 * Owns only ephemeral visual choreography. Pedagogical progress and route
 * persistence remain the responsibility of World4RootScreen.
 */
export function useWorld4MotionController({
  reducedMotion,
  onCardSwap,
  onEntrySettled,
  onStepSettled,
  onChainSettled,
  onExitSettled,
}: UseWorld4MotionControllerOptions) {
  const [visualPhase, setVisualPhase] =
    useState<World4VisualPhase>("station_enter");
  const [motionKind, setMotionKind] = useState<World4MotionKind | null>(null);
  const [motionEpoch, setMotionEpoch] = useState(0);
  const [motionNodeIndex, setMotionNodeIndex] = useState<number | null>(null);
  const [entryMode, setEntryMode] = useState<World4EntryMode | null>(null);
  const [inputLocked, setInputLocked] = useState(false);

  const callbacksRef = useRef({
    onCardSwap,
    onEntrySettled,
    onStepSettled,
    onChainSettled,
    onExitSettled,
  });
  callbacksRef.current = {
    onCardSwap,
    onEntrySettled,
    onStepSettled,
    onChainSettled,
    onExitSettled,
  };

  const mountedRef = useRef(true);
  const lockRef = useRef(false);
  const epochRef = useRef(0);
  const operationRef = useRef<ActiveOperation | null>(null);
  const timersRef = useRef<Set<number>>(new Set());
  const previousReducedMotionRef = useRef(reducedMotion);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) {
      window.clearTimeout(timer);
    }
    timersRef.current.clear();
  }, []);

  const updateLock = useCallback((locked: boolean) => {
    lockRef.current = locked;
    if (mountedRef.current) {
      setInputLocked(locked);
    }
  }, []);

  const schedule = useCallback(
    (epoch: number, delayMs: number, callback: () => void) => {
      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer);
        if (mountedRef.current && operationRef.current?.epoch === epoch) {
          callback();
        }
      }, delayMs);
      timersRef.current.add(timer);
    },
    [],
  );

  const fireCardSwap = useCallback((operation: ActiveOperation) => {
    if (operation.kind !== "node_step" || operation.cardSwapFired) {
      return;
    }

    operation.cardSwapFired = true;
    callbacksRef.current.onCardSwap?.(operation);
  }, []);

  const finishCurrent = useCallback(
    (reason: World4MotionCompletionReason) => {
      const operation = operationRef.current;
      if (!operation) {
        return;
      }

      clearTimers();
      fireCardSwap(operation);
      operationRef.current = null;

      if (mountedRef.current) {
        setMotionKind(null);
        setMotionNodeIndex(null);
        setEntryMode(null);
        setVisualPhase(operation.kind === "exit" ? "exiting" : "idle");
      }

      // Exit remains terminally locked while the caller performs navigation.
      updateLock(operation.kind === "exit");

      const completion: World4MotionCompletion = {
        entryMode: operation.entryMode,
        epoch: operation.epoch,
        kind: operation.kind,
        mode: operation.mode,
        nodeIndex: operation.nodeIndex,
        reason,
      };

      if (operation.kind === "entry") {
        callbacksRef.current.onEntrySettled?.(completion);
      } else if (operation.kind === "node_step") {
        callbacksRef.current.onStepSettled?.(completion);
      } else if (operation.kind === "chain") {
        callbacksRef.current.onChainSettled?.(completion);
      } else {
        callbacksRef.current.onExitSettled?.(completion);
      }
    },
    [clearTimers, fireCardSwap, updateLock],
  );

  const beginOperation = useCallback(
    (
      kind: World4MotionKind,
      mode: World4MotionMode,
      nodeIndex: number | null,
      nextEntryMode: World4EntryMode | null,
      initialPhase: World4VisualPhase,
    ): ActiveOperation | null => {
      if (lockRef.current || operationRef.current) {
        return null;
      }

      clearTimers();
      const epoch = epochRef.current + 1;
      epochRef.current = epoch;
      const operation: ActiveOperation = {
        cardSwapFired: false,
        entryMode: nextEntryMode,
        epoch,
        kind,
        mode,
        nodeIndex,
      };
      operationRef.current = operation;
      updateLock(true);

      if (mountedRef.current) {
        setMotionEpoch(epoch);
        setMotionKind(kind);
        setMotionNodeIndex(nodeIndex);
        setEntryMode(nextEntryMode);
        setVisualPhase(initialPhase);
      }

      return operation;
    },
    [clearTimers, updateLock],
  );

  const startEntry = useCallback(
    (nextEntryMode: World4EntryMode = "full"): StartResult => {
      const mode = motionMode(reducedMotionRef.current);
      const operation = beginOperation(
        "entry",
        mode,
        null,
        nextEntryMode,
        "station_enter",
      );
      if (!operation) {
        return null;
      }

      schedule(
        operation.epoch,
        WORLD4_MOTION_TIMELINES[mode].entry[nextEntryMode],
        () => finishCurrent("timeline"),
      );
      return operation.epoch;
    },
    [beginOperation, finishCurrent, schedule],
  );

  const startNodeStep = useCallback(
    (nodeIndex: number): StartResult => {
      assertNodeIndex(nodeIndex);
      const mode = motionMode(reducedMotionRef.current);
      const operation = beginOperation(
        "node_step",
        mode,
        nodeIndex,
        null,
        "node_departing",
      );
      if (!operation) {
        return null;
      }

      const timeline = WORLD4_MOTION_TIMELINES[mode].node;
      schedule(operation.epoch, timeline.liaTravel, () =>
        setVisualPhase("lia_travel"),
      );
      schedule(operation.epoch, timeline.routeTransfer, () =>
        setVisualPhase("route_transfer"),
      );
      schedule(operation.epoch, timeline.cardSwap, () =>
        fireCardSwap(operation),
      );
      schedule(operation.epoch, timeline.nodeArrival, () =>
        setVisualPhase("node_arrival"),
      );
      schedule(operation.epoch, timeline.nodeActive, () =>
        setVisualPhase("node_active"),
      );
      schedule(operation.epoch, timeline.nodeSettle, () =>
        setVisualPhase("node_settle"),
      );
      schedule(operation.epoch, timeline.complete, () =>
        finishCurrent("timeline"),
      );

      return operation.epoch;
    },
    [beginOperation, finishCurrent, fireCardSwap, schedule],
  );

  const startChainComplete = useCallback((): StartResult => {
    const mode = motionMode(reducedMotionRef.current);
    const operation = beginOperation(
      "chain",
      mode,
      null,
      null,
      "chain_complete",
    );
    if (!operation) {
      return null;
    }

    const timeline = WORLD4_MOTION_TIMELINES[mode].chain;
    schedule(operation.epoch, timeline.exitReveal, () =>
      setVisualPhase("exit_reveal"),
    );
    schedule(operation.epoch, timeline.complete, () =>
      finishCurrent("timeline"),
    );
    return operation.epoch;
  }, [beginOperation, finishCurrent, schedule]);

  const startExit = useCallback((): StartResult => {
    const mode = motionMode(reducedMotionRef.current);
    const operation = beginOperation("exit", mode, null, null, "exiting");
    if (!operation) {
      return null;
    }

    schedule(operation.epoch, WORLD4_MOTION_TIMELINES[mode].exit.complete, () =>
      finishCurrent("timeline"),
    );
    return operation.epoch;
  }, [beginOperation, finishCurrent, schedule]);

  const settleMotion = useCallback(() => {
    finishCurrent("manual-settle");
  }, [finishCurrent]);

  const cancelMotion = useCallback(() => {
    clearTimers();
    operationRef.current = null;
    updateLock(false);
    if (mountedRef.current) {
      setMotionKind(null);
      setMotionNodeIndex(null);
      setEntryMode(null);
      setVisualPhase("idle");
    }
  }, [clearTimers, updateLock]);

  useEffect(() => {
    const previous = previousReducedMotionRef.current;
    previousReducedMotionRef.current = reducedMotion;
    if (previous !== reducedMotion && operationRef.current) {
      finishCurrent("reduced-motion-change");
    }
  }, [finishCurrent, reducedMotion]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && operationRef.current) {
        finishCurrent("document-hidden");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [finishCurrent]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimers();
      operationRef.current = null;
      lockRef.current = false;
    };
  }, [clearTimers]);

  return {
    cancelMotion,
    entryMode,
    inputLocked,
    motionEpoch,
    motionKind,
    motionNodeIndex,
    settleMotion,
    startChainComplete,
    startEntry,
    startExit,
    startNodeStep,
    visualPhase,
  } as const;
}
