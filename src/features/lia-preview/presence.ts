import { liaPreviewAssets } from "../../shared/assets/liaPreviewAssets";

/** LIA-M4-FINAL-01: exact approved poses; all other states use canonical artwork. */
export const presenceStateMap = {
  entry_from_mirador: "greeting",
  greeting: "greeting",
  input_focus: "listening",
  listening: "listening",
  user_typing: "listening",
  answering: "explaining",
  explaining: "explaining",
  showing_sources: "explaining",
  idle: "canonical",
  thinking: "canonical",
  clarifying: "canonical",
  uncertain: "canonical",
  safe_refusal: "canonical",
  unavailable: "canonical",
  farewell: "canonical",
  reduced_motion: "canonical",
} as const;
export type PresenceState = keyof typeof presenceStateMap;
const poses = {
  greeting: {
    id: "LIA-M4-GREETING-A",
    url: liaPreviewAssets.approvedGreeting,
    frames: 1,
  },
  listening: {
    id: "LIA-M4-LISTENING-A",
    url: liaPreviewAssets.listening,
    frames: 1,
  },
  explaining: {
    id: "LIA-M4-EXPLAINING-A",
    url: liaPreviewAssets.explaining,
    frames: 1,
  },
  canonical: {
    id: "FINAL-LIA-IDLE-001",
    url: liaPreviewAssets.avatar,
    frames: 6,
  },
} as const;
export function presenceFor(state: PresenceState) {
  return poses[presenceStateMap[state]];
}
