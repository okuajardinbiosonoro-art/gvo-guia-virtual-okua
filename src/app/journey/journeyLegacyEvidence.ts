import { readWorld1Checkpoint } from "../../domain/checkpoints/world1Checkpoint";
import { readWorld2Checkpoint } from "../../domain/checkpoints/world2Checkpoint";
import { readWorld4Checkpoint } from "../../domain/checkpoints/world4Checkpoint";

// Capture before a room can synthesize old records from acquired route bits.
let captured = capture();
function capture() { return { one: readWorld1Checkpoint(), two: readWorld2Checkpoint(), four: readWorld4Checkpoint() }; }
if (typeof window !== "undefined") window.addEventListener("gvo:journey-reset", () => { captured = capture(); });
export function hasLegacyContradiction() {
  const one = captured.one.status === "ok" ? captured.one.checkpoint : null;
  const two = captured.two.status === "ok" ? captured.two.checkpoint : null;
  const four = captured.four.status === "ok" ? captured.four.checkpoint : null;
  return Boolean((one?.activityContinued && one.visitedConcepts !== undefined && !["relation", "perception", "mediation"].every((id) => one.visitedConcepts!.includes(id as "relation"))) ||
    (two?.activityContinued && (two.visitedLayerIds.length < 6 || two.resultState !== "ready_to_continue")) || four?.resumeMode === "activity_skipped");
}
