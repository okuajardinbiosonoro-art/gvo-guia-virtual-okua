import type { FinalReviewWorld } from "./finalReviewContext";
import { reviewAuthority } from "../journey/journeyReceipt";
import { coherentProgressPrefixLength, createEmptyJourneyRoom, ESSENTIAL_STORAGE_KEY, readEssentialSnapshot } from "../journey/journeyEssential";
import { GVO_PROGRESS_STORAGE_KEY, readProgress } from "../../domain/progress/progress.storage";
import { inReplayVisit, replayBase, storeReplayVisit } from "../../domain/progress/replayStorage";

export function startRoomReplay(world: FinalReviewWorld) {
  const completed = readEssentialSnapshot();
  const prefix = coherentProgressPrefixLength();
  const progress = readProgress().progress;
  if (inReplayVisit() || !completed || !progress || !reviewAuthority(completed, prefix)) return false;

  // Carry earlier milestones into the practice copy. The completed original
  // remains available to the Lookout, including any previously earned prize.
  const snapshot = structuredClone(completed);
  snapshot.pendingTransition = null;
  snapshot.finalReached = false;
  for (const room of [1, 2, 3, 4, 5] as const) {
    if (room >= world) snapshot.stations[room] = createEmptyJourneyRoom(room);
  }
  const records = {
    ["local/" + ESSENTIAL_STORAGE_KEY]: JSON.stringify(snapshot),
    ["local/" + GVO_PROGRESS_STORAGE_KEY]: JSON.stringify({ ...progress, completedStations: progress.completedStations.filter(id => id < world) }),
  };
  try {
    if (!storeReplayVisit(world, records)) return false;
  } catch { return false; }
  window.location.assign(replayBase + "/estacion/" + world);
  return true;
}
