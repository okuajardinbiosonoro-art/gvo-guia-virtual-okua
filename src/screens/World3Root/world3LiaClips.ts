/** Three real registered pixel sheets. Technical file QA is separate from
 * actual scene review and the responsible human's acceptance. */
export type World3LiaClipId = "intro" | "listening" | "accompanying";
const base = "/assets/gvo/stations/world-3/notebook-pixel/runtime/lia/clips";
export const world3LiaClipContract = {
  status: "THREE_REGISTERED_CLIPS_ACTIVE_SCENE_REVIEW_PENDING",
  source: "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/exchanges/15_context-art-method-received.txt",
  columns: 3, rows: 2, frames: 6,
  master: { width: 1536, height: 1024, cell: 512 },
  runtime: { width: 768, height: 512, cell: 256 },
  exactNeutralFrames: [0, 5],
  stableReducedFrame: 2,
  registeredBaseBulbPivot: [128, 212],
  registrationManifest: "public/assets/gvo/current-used/world-3-root/lia/clips/OBS03-clips-manifest.json",
  registeredIntroPilot: {
    manifest: "public/assets/gvo/current-used/world-3-root/lia/clips/INTRO-pilot-manifest.json",
    sha256: "01689c27d863e3578c975d55dcfb6414390caaf58a81863384aca2930cb16cb2",
    logicalBase: [128, 212],
    sourceNeutralFramesDecodedIdentical: true,
    runtimeNeutralAlphaAndVisibleRgbIdentical: true,
    runtimeNeutralRawRgbaIdentical: false,
    sceneQa: "TECHNICAL_PILOT_PASS_390x844_NOT_FINAL_ACCEPTANCE",
    humanApproval: false,
  },
  measuredRegistration: { masterLogicalBase: [256, 424], runtimeLogicalBase: [128, 212], maximumMasterBaseXDeviationPx: 1.5, baseY: 424 },
  pivotStatus: "Measured registered sheets use a common logical base, never per-frame bounding-box recentering",
  petals: 5,
  physicalPracticeCompletion: false,
} as const;
export const world3LiaClipAssets = {
  intro: { src: `${base}/lia_world3_intro_6f_v03.webp`, durationMs: 650, target: "planta", action: "attend-and-present" },
  listening: { src: `${base}/lia_world3_listening_6f_v03.webp`, durationMs: 1100, target: "prototipo", action: "listening-posture" },
  accompanying: { src: `${base}/lia_world3_accompanying_6f_v03.webp`, durationMs: 850, target: "senal", action: "available-and-caring" },
} as const;
export function world3LiaClipForTarget(target: string): World3LiaClipId {
  return target === "prototipo" ? "listening" : target === "senal" ? "accompanying" : "intro";
}
/** Exact active sheet for the requested page; index uses neutral INTRO. */
export function getWorld3LiaClipSources(target: string) {
  return [world3LiaClipAssets[world3LiaClipForTarget(target)].src];
}
