const directory = "/assets/gvo/audio";
const tracks = {
  interaction: "shared/interaction.mp3",
  roomComplete: "shared/room-complete.mp3",
  conditioning: "world-2-root/conditioning.mp3",
  intensity: "world-2-root/intensity.mp3",
  rhythm: "world-2-root/rhythm.mp3",
  pitch: "world-2-root/pitch.mp3",
  mediatedMusic: "world-2-root/mediated-music.mp3",
  pageTurn: "world-3-root/page-turn.mp3",
  gameStart: "world-4-root/game-start.mp3",
  gameSwap: "world-4-root/game-swap.mp3",
  gameSolved: "world-4-root/game-solved.mp3",
  gameTimeout: "world-4-root/game-timeout.mp3",
  correct: "world-5-root/correct.mp3",
  incorrect: "world-5-root/incorrect.mp3",
} as const;

export type JourneySound = keyof typeof tracks;

const preferenceKey = "gvo.sound.muted.v1";
const volumeKey = "gvo.sound.volume.v1";
const interactionGain = 0.7;
const preparationMs = 6000;
const sharedSounds = ["interaction", "roomComplete"] as const;
const roomSounds: Record<string, readonly JourneySound[]> = {
  "/estacion/2": ["conditioning", "intensity", "rhythm", "pitch", "mediatedMusic"],
  "/estacion/3": ["pageTurn"],
  "/estacion/4": ["gameStart", "gameSwap", "gameSolved", "gameTimeout"],
  "/estacion/5": ["correct", "incorrect"],
};
const listeners = new Set<() => void>();
const buffers = new Map<JourneySound, Promise<AudioBuffer>>();
const encoded = new Map<JourneySound, Promise<ArrayBuffer>>();
let context: AudioContext | undefined;
let master: GainNode | undefined;
let interaction: GainNode | undefined;
let resuming: Promise<void> | undefined;
let muted: boolean | undefined;
let volume: number | undefined;
let playing: { sound: JourneySound; source?: AudioBufferSourceNode } | undefined;

export function isJourneySoundMuted() {
  if (muted === undefined) {
    try { muted = window.localStorage.getItem(preferenceKey) === "true"; }
    catch { muted = false; }
  }
  return muted;
}

export function subscribeToJourneySound(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getJourneySoundVolume() {
  if (volume === undefined) {
    try {
      const saved = window.localStorage.getItem(volumeKey);
      const value = saved === null ? 100 : Number(saved);
      volume = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 100;
    } catch { volume = 100; }
  }
  return volume;
}

export function setJourneySoundVolume(value: number) {
  if (!Number.isFinite(value)) return;
  volume = Math.min(100, Math.max(0, value));
  if (master) master.gain.value = volume / 100;
  if (volume === 0) stopJourneySound();
  try { window.localStorage.setItem(volumeKey, String(volume)); }
  catch { /* Keep the preference for this visit. */ }
  listeners.forEach((listener) => listener());
}

function fetchTrack(sound: JourneySound) {
  const cached = encoded.get(sound);
  if (cached) return cached;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), preparationMs);
  const request = fetch(`${directory}/${tracks[sound]}`, { signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error("Audio unavailable");
      return response.arrayBuffer();
    }).finally(() => window.clearTimeout(timer));
  encoded.set(sound, request);
  void request.catch(() => { if (encoded.get(sound) === request) encoded.delete(sound); });
  return request;
}

function decodeTrack(audio: AudioContext, sound: JourneySound) {
  const cached = buffers.get(sound);
  if (cached) return cached;
  const request = fetchTrack(sound).then((bytes) => audio.decodeAudioData(bytes.slice(0)));
  buffers.set(sound, request);
  void request.catch(() => { if (buffers.get(sound) === request) buffers.delete(sound); });
  return request;
}

/** Warm local bytes even before the first gesture. Decode once the context exists. */
export async function prepareJourneyAudio(path: string, signal: AbortSignal, deadlineAt: number) {
  const match = /^\/estacion\/[1-5](?=\/|$)/.exec(path);
  if (!match && path !== "/final" && path !== "/portada") return;
  const budget = Math.min(preparationMs, deadlineAt - performance.now() - 500);
  if (signal.aborted || budget <= 0 || typeof AudioContext === "undefined") return;
  const sounds = [...sharedSounds, ...(roomSounds[match?.[0] ?? ""] ?? [])];
  await new Promise<void>((resolve) => {
    const finish = () => {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const timer = window.setTimeout(finish, budget);
    signal.addEventListener("abort", finish, { once: true });
    void Promise.allSettled(sounds.map((sound) => context ? decodeTrack(context, sound) : fetchTrack(sound))).then(finish);
  });
}

/** Resume on a trusted click before a screen starts its async checkpoint write. */
export function unlockJourneySound() {
  if (isJourneySoundMuted() || document.hidden || typeof AudioContext === "undefined") return;
  try {
    if (!context) {
      const audio = new AudioContext();
      const output = audio.createGain();
      output.gain.value = getJourneySoundVolume() / 100;
      output.connect(audio.destination);
      const cue = audio.createGain();
      cue.gain.value = interactionGain;
      cue.connect(output);
      context = audio;
      master = output;
      interaction = cue;
      for (const sound of encoded.keys()) void decodeTrack(audio, sound).catch(() => {});
    }
    if (context.state !== "running") resuming = context.resume().catch(() => {});
  } catch {
    // Sound never gates the experience.
  }
}

export function stopJourneySound(sound?: JourneySound) {
  if (!playing || (sound && playing.sound !== sound)) return;
  const previous = playing;
  playing = undefined;
  previous.source?.stop();
}

export function stopJourneySoundOnNavigation() {
  if (playing?.sound !== "roomComplete" && playing?.sound !== "interaction") stopJourneySound();
}

export function toggleJourneySound() {
  muted = !isJourneySoundMuted();
  try { window.localStorage.setItem(preferenceKey, String(muted)); }
  catch { /* Keep the preference for this visit. */ }
  if (muted) stopJourneySound();
  else unlockJourneySound();
  listeners.forEach((listener) => listener());
}

export function playJourneySound(sound: JourneySound, { replace = false } = {}) {
  const audio = context;
  const output = sound === "interaction" ? interaction : master;
  if (!audio || !output || isJourneySoundMuted() || getJourneySoundVolume() === 0 || document.hidden) return;
  if (sound === "interaction" && !replace && playing && playing.sound !== "interaction") return;

  stopJourneySound();
  const request: NonNullable<typeof playing> = { sound };
  playing = request;
  const requestedAt = performance.now();
  void Promise.all([decodeTrack(audio, sound), resuming]).then(([decoded]) => {
    if (playing !== request || document.hidden || audio.state !== "running" || performance.now() - requestedAt > 900) return;
    const source = audio.createBufferSource();
    source.buffer = decoded;
    source.connect(output);
    source.onended = () => {
      source.disconnect();
      if (playing === request) playing = undefined;
    };
    source.start();
    request.source = source;
  }).catch(() => { /* A failed track does not block the action. */ }).finally(() => {
    if (playing === request && !request.source) playing = undefined;
  });
}
