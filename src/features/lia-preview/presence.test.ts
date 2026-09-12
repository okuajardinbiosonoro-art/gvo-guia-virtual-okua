import { describe, expect, it } from "vitest";
import { presenceFor, presenceStateMap } from "./presence";

describe("human-approved presence routing", () => {
  it("uses the three approved originals for their explicit states", () => {
    for (const state of ["entry_from_mirador", "greeting"] as const)
      expect(presenceFor(state).id).toBe("LIA-M4-GREETING-A");
    for (const state of ["input_focus", "listening", "user_typing"] as const)
      expect(presenceFor(state).id).toBe("LIA-M4-LISTENING-A");
    for (const state of ["answering", "explaining", "showing_sources"] as const)
      expect(presenceFor(state).id).toBe("LIA-M4-EXPLAINING-A");
  });
  it("retains canonical art for every unproduced or fallback state", () => {
    for (const state of [
      "idle",
      "thinking",
      "clarifying",
      "uncertain",
      "safe_refusal",
      "unavailable",
      "farewell",
      "reduced_motion",
    ] as const) {
      expect(presenceFor(state).id).toBe("FINAL-LIA-IDLE-001");
      expect(presenceFor(state).frames).toBe(6);
    }
    expect(Object.keys(presenceStateMap)).toHaveLength(16);
  });
});
