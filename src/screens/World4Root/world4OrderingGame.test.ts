import { describe, expect, it } from "vitest";
import {
  freshWorld4OrderingState,
  isWorld4OrderingState,
  LEGACY_WORLD4_ORDERING_TARGET,
  readWorld4OrderingCheckpoint,
  restoreWorld4OrderingState,
  writeWorld4OrderingCheckpoint,
  WORLD4_ORDERING_STORAGE_KEY,
  WORLD4_ORDERING_TARGET,
  type World4OrderingState,
} from "../../domain/checkpoints/world4OrderingCheckpoint";
import { reduceWorld4Ordering as reduce } from "./world4OrderingGame";

function memory() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
}
function nearlySolved(): World4OrderingState {
  const permutation = [...WORLD4_ORDERING_TARGET];
  [permutation[0], permutation[1]] = [permutation[1], permutation[0]];
  return { ...freshWorld4OrderingState(), phase: "playing", permutation };
}
describe("IV ordering — active time, truthful outcome and durable review", () => {
  it("starts90active seconds and shuffles once without changing piece identities", () => {
    const started = reduce(freshWorld4OrderingState(), {
      type: "start",
      random: () => 0.999,
    });
    expect(started.remainingActiveMs).toBe(90_000);
    expect(started.permutation).not.toEqual(WORLD4_ORDERING_TARGET);
    expect(new Set(started.permutation).size).toBe(6);
    expect(
      reduce(started, { type: "start", random: () => 0 }).permutation,
    ).toEqual(started.permutation);
    expect(isWorld4OrderingState(started)).toBe(true);
  });
  it("selects/cancels with the same action and swaps exactly two positions", () => {
    const initial = nearlySolved();
    const selected = reduce(initial, { type: "select", id: "bionosificador" });
    expect(
      reduce(selected, { type: "select", id: "bionosificador" })
        .selectedObjectId,
    ).toBeNull();
    const solved = reduce(selected, { type: "select", id: "planta" }, 200);
    expect(solved).toMatchObject({
      phase: "success",
      outcome: "solved_by_visitor",
      remainingActiveMs: 89_800,
      selectedObjectId: null,
    });
    expect(solved.permutation).toEqual(WORLD4_ORDERING_TARGET);
  });
  it("timeout takes precedence over an otherwise winning late swap", () => {
    const selected = reduce(
      { ...nearlySolved(), remainingActiveMs: 20 },
      { type: "select", id: "bionosificador" },
    );
    const expired = reduce(selected, { type: "select", id: "planta" }, 20);
    expect(expired).toMatchObject({
      phase: "auto_ordering",
      outcome: "assisted_timeout",
      remainingActiveMs: 0,
    });
    expect(reduce(expired, { type: "select", id: "planta" }).outcome).toBe(
      "assisted_timeout",
    );
    expect(isWorld4OrderingState(expired)).toBe(true);
  });
  it("pause spends only the previous active segment; hidden time does not spend", () => {
    const selected = reduce(nearlySolved(), {
      type: "select",
      id: "bionosificador",
    });
    const paused = reduce(selected, { type: "pause" }, 1200);
    expect(paused.remainingActiveMs).toBe(88_800);
    expect(paused.selectedObjectId).toBe("bionosificador");
    expect(paused.permutation).toEqual(selected.permutation);
    expect(reduce(paused, { type: "tick" }, 600_000).remainingActiveMs).toBe(
      88_800,
    );
    const resumed = reduce(paused, { type: "resume" }, 600_000);
    expect(resumed.selectedObjectId).toBe("bionosificador");
    expect(resumed.permutation).toEqual(selected.permutation);
    expect(reduce(resumed, { type: "tick" }, 800).remainingActiveMs).toBe(
      88_000,
    );
  });
  it("requested assistance never grants success and requires all six manual review advances", () => {
    let state = reduce(freshWorld4OrderingState(), { type: "help" });
    state = reduce(state, { type: "settle_auto" });
    expect(state).toMatchObject({
      phase: "review",
      outcome: "assisted_requested",
      closed: false,
    });
    expect(reduce(state, { type: "close" }).closed).toBe(false);
    for (let index = 0; index < WORLD4_ORDERING_TARGET.length - 1; index += 1) {
      expect(state.reviewIndex).toBe(index);
      state = reduce(state, { type: "next_review" });
      expect(state.confirmedReviewSteps).toHaveLength(index + 1);
      expect(isWorld4OrderingState(state)).toBe(true);
    }
    state = reduce(state, { type: "close" });
    expect(state.closed).toBe(true);
    expect(state.confirmedReviewSteps).toEqual(WORLD4_ORDERING_TARGET);
    expect(state.outcome).toBe("assisted_requested");
    expect(isWorld4OrderingState(state)).toBe(true);
  });
  it("true success may close manually without mandatory six-step review", () => {
    const selected = reduce(nearlySolved(), {
      type: "select",
      id: "bionosificador",
    });
    const solved = reduce(selected, { type: "select", id: "planta" });
    const closed = reduce(solved, { type: "close" });
    expect(closed).toMatchObject({
      closed: true,
      outcome: "solved_by_visitor",
      confirmedReviewSteps: [],
    });
    expect(isWorld4OrderingState(closed)).toBe(true);
  });
  it("reload restores playing as paused and interrupted auto-order as pending review", () => {
    const storage = memory();
    const playing = reduce(nearlySolved(), { type: "tick" }, 1200);
    expect(writeWorld4OrderingCheckpoint(playing, storage).ok).toBe(true);
    const read = readWorld4OrderingCheckpoint(storage);
    expect(read.status).toBe("ok");
    if (read.status !== "ok") throw new Error("checkpoint missing");
    expect(restoreWorld4OrderingState(read.checkpoint)).toMatchObject({
      phase: "paused",
      remainingActiveMs: 88_800,
    });
    const automatic = reduce(playing, { type: "help" });
    expect(restoreWorld4OrderingState(automatic)).toMatchObject({
      phase: "review",
      confirmedReviewSteps: [],
      closed: false,
    });
  });
  it("preserves unknown/corrupt raw; silent writes cannot grant a closure", () => {
    const storage = memory();
    const raw = '{"schemaVersion":99,"outcome":"solved_by_visitor"}';
    storage.setItem(WORLD4_ORDERING_STORAGE_KEY, raw);
    expect(readWorld4OrderingCheckpoint(storage).status).toBe(
      "unknown_version",
    );
    expect(
      writeWorld4OrderingCheckpoint(freshWorld4OrderingState(), storage).ok,
    ).toBe(false);
    expect(storage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBe(raw);
    const silent = memory();
    silent.setItem = () => {};
    expect(
      writeWorld4OrderingCheckpoint(freshWorld4OrderingState(), silent).ok,
    ).toBe(false);
  });
  it("adapts a saved eight-piece board without granting success or spending time", () => {
    const storage = memory();
    const permutation = [...LEGACY_WORLD4_ORDERING_TARGET];
    [permutation[3], permutation[4]] = [permutation[4], permutation[3]];
    const raw = JSON.stringify({
      ...freshWorld4OrderingState(), contractRevision: "OBS03.2",
      phase: "paused", remainingActiveMs: 31_000, permutation, selectedObjectId: "midi",
    });
    storage.setItem(WORLD4_ORDERING_STORAGE_KEY, raw);
    const read = readWorld4OrderingCheckpoint(storage);
    expect(read.checkpoint).toMatchObject({
      phase: "paused", remainingActiveMs: 31_000, selectedObjectId: null, outcome: null,
    });
    expect(read.checkpoint?.permutation).toHaveLength(6);
    expect(read.checkpoint?.permutation).not.toEqual(WORLD4_ORDERING_TARGET);
    expect(storage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBe(raw);
    expect(writeWorld4OrderingCheckpoint(read.checkpoint!, storage).ok).toBe(true);
  });
  it("rejects invented assisted closure and repeated/missing pieces", () => {
    const state = freshWorld4OrderingState();
    expect(
      isWorld4OrderingState({
        ...state,
        phase: "closed",
        closed: true,
        outcome: "assisted_requested",
      }),
    ).toBe(false);
    expect(
      isWorld4OrderingState({ ...state, permutation: Array(WORLD4_ORDERING_TARGET.length).fill("planta") }),
    ).toBe(false);
    expect(
      isWorld4OrderingState({
        ...state,
        phase: "review",
        outcome: "assisted_requested",
        reviewIndex: WORLD4_ORDERING_TARGET.length - 1,
        confirmedReviewSteps: [],
      }),
    ).toBe(false);
  });
});
