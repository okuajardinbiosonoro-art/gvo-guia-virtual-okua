declare const __LIA_API_BASE__: string;

export const liaPreviewEnabled =
  import.meta.env.VITE_LIA_PREVIEW_ENABLED === "true";
export const liaApiBase =
  typeof __LIA_API_BASE__ === "string" ? __LIA_API_BASE__ : "/lia-api";
export const liaPreviewEntryId = "lia-preview-entry";
export const MAX_MESSAGE_CHARS = 2000;
export const MAX_TURNS = 20;
export const REQUEST_TIMEOUT_MS = 10_000;

// Ephemeral focus intent only; never store chat or journey state here.
let returnFocus = false;
export function markLiaReturn() {
  returnFocus = true;
}
export function takeLiaReturn() {
  const value = returnFocus;
  returnFocus = false;
  return value;
}
