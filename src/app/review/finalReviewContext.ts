import type { ProgressStorage } from "../../domain/progress/progress.types";

export const FINAL_REVIEW_CONTEXT_STORAGE_KEY = "gvo.final.reviewContext.v1";
export const FINAL_REVIEW_CONTEXT_VERSION = 1;

export type FinalReviewWorld = 1 | 2 | 3 | 4 | 5;

export type FinalReviewContext = Readonly<{
  mode: "final-review";
  origin: "/final";
  startedAt: string;
  timestamp: number;
  version: 1;
  world: FinalReviewWorld;
}>;

export type FinalReviewNavigationState = Readonly<{
  finalReview: FinalReviewContext;
}>;

const FINAL_REVIEW_WORLDS = [1, 2, 3, 4, 5] as const;

function getDefaultSessionStorage(): ProgressStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

function isFinalReviewWorld(value: unknown): value is FinalReviewWorld {
  return (
    typeof value === "number" &&
    FINAL_REVIEW_WORLDS.includes(value as FinalReviewWorld)
  );
}

export function parseFinalReviewContext(
  value: unknown,
): FinalReviewContext | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<FinalReviewContext>;
  if (
    candidate.origin !== "/final" ||
    candidate.mode !== "final-review" ||
    candidate.version !== FINAL_REVIEW_CONTEXT_VERSION ||
    !isFinalReviewWorld(candidate.world) ||
    typeof candidate.startedAt !== "string" ||
    Number.isNaN(Date.parse(candidate.startedAt)) ||
    typeof candidate.timestamp !== "number" ||
    !Number.isFinite(candidate.timestamp) ||
    candidate.timestamp <= 0
  ) {
    return null;
  }

  return {
    origin: "/final",
    mode: "final-review",
    world: candidate.world,
    startedAt: candidate.startedAt,
    timestamp: candidate.timestamp,
    version: FINAL_REVIEW_CONTEXT_VERSION,
  };
}

export function createFinalReviewContext(
  world: FinalReviewWorld,
  now: () => number = Date.now,
): FinalReviewContext {
  const timestamp = now();

  return {
    origin: "/final",
    mode: "final-review",
    world,
    startedAt: new Date(timestamp).toISOString(),
    timestamp,
    version: FINAL_REVIEW_CONTEXT_VERSION,
  };
}

export function persistFinalReviewContext(
  context: FinalReviewContext,
  storage: ProgressStorage | null = getDefaultSessionStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY, JSON.stringify(context));
    return true;
  } catch {
    return false;
  }
}

export function beginFinalReview(
  world: FinalReviewWorld,
  storage: ProgressStorage | null = getDefaultSessionStorage(),
  now: () => number = Date.now,
): FinalReviewNavigationState {
  const finalReview = createFinalReviewContext(world, now);
  persistFinalReviewContext(finalReview, storage);

  return { finalReview };
}

export function clearFinalReviewContext(
  storage: ProgressStorage | null = getDefaultSessionStorage(),
): void {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY);
  } catch {
    // A blocked session store must not make navigation unusable.
  }
}

export function readFinalReviewContext(
  storage: ProgressStorage | null = getDefaultSessionStorage(),
): FinalReviewContext | null {
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = parseFinalReviewContext(JSON.parse(raw));
    if (!parsed) {
      clearFinalReviewContext(storage);
    }
    return parsed;
  } catch {
    clearFinalReviewContext(storage);
    return null;
  }
}

export function resolveFinalReviewContext(
  state: unknown,
  expectedWorld: FinalReviewWorld,
  storage: ProgressStorage | null = getDefaultSessionStorage(),
): FinalReviewContext | null {
  const hasNavigationContext =
    state !== null &&
    state !== undefined &&
    typeof state === "object" &&
    "finalReview" in state;
  if (hasNavigationContext) {
    const navigationContext = parseFinalReviewContext(
      (state as Partial<FinalReviewNavigationState>).finalReview,
    );
    if (!navigationContext) {
      clearFinalReviewContext(storage);
      return null;
    }

    if (navigationContext.world !== expectedWorld) {
      clearFinalReviewContext(storage);
      return null;
    }

    persistFinalReviewContext(navigationContext, storage);
    return navigationContext;
  }

  const storedContext = readFinalReviewContext(storage);
  if (storedContext?.world !== expectedWorld) {
    if (storedContext) {
      clearFinalReviewContext(storage);
    }
    return null;
  }

  return storedContext;
}

export function finalReviewWorldForPathname(
  pathname: string,
): FinalReviewWorld | null {
  const normalized =
    pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const match =
    /^\/estacion\/([1-5])(?:\/(plantas|sistema|espacio|visitante))?$/.exec(
      normalized,
    );
  if (!match) {
    return null;
  }

  const world = Number(match[1]) as FinalReviewWorld;
  const subroute = match[2];
  if (subroute && world !== 5) {
    return null;
  }

  return world;
}
