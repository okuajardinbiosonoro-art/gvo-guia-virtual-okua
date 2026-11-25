import type { ProgressStorage } from "./progress.types";

// A replay runs in a separate document. Its writable records belong to this
// browser tab while preferences (language, sound) still belong to the visitor.
export const replayBase = "/repetir";
const replayKey = "gvo.replay.visit.v1";

export function inReplayVisit() {
  return typeof window !== "undefined" && window.location.pathname.startsWith(replayBase + "/");
}

type ReplayVisit = { start: number; records: Record<string, string> };
function readVisit(): ReplayVisit | null {
  const raw = window.sessionStorage.getItem(replayKey);
  if (!raw) return null;
  const visit = JSON.parse(raw) as ReplayVisit | null;
  return visit && Number.isInteger(visit.start) && visit.start >= 1 && visit.start <= 5 &&
    visit.records && typeof visit.records === "object" ? visit : null;
}

export function replayStartRoom(): number | null {
  if (!inReplayVisit()) return null;
  try { return readVisit()?.start ?? null; } catch { return null; }
}

export function storeReplayVisit(start: number, records: Record<string, string>) {
  const raw = JSON.stringify({ start, records });
  window.sessionStorage.setItem(replayKey, raw);
  return window.sessionStorage.getItem(replayKey) === raw;
}

function replayBackend(backend: "local" | "session"): ProgressStorage {
  const keyFor = (key: string) => backend + "/" + key;
  function update(key: string, value: string | null) {
    const visit = readVisit();
    if (!visit) throw Error("replay_unavailable");
    if (value === null) delete visit.records[keyFor(key)];
    else visit.records[keyFor(key)] = value;
    window.sessionStorage.setItem(replayKey, JSON.stringify(visit));
  }
  return {
    getItem: key => readVisit()?.records[keyFor(key)] ?? null,
    setItem: (key, value) => update(key, value),
    removeItem: key => update(key, null),
  };
}
const replayLocal = replayBackend("local");
const replaySession = replayBackend("session");

export function journeyStorage(backend: "local" | "session" = "local"): ProgressStorage | null {
  if (typeof window === "undefined") return null;
  if (inReplayVisit()) return backend === "local" ? replayLocal : replaySession;
  try { return backend === "local" ? window.localStorage : window.sessionStorage; }
  catch { return null; }
}
