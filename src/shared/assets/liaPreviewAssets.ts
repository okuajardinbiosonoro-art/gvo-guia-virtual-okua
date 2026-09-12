import { finalRootAssets } from "./finalRootAssets";
/** Approved canonical originals, registered by reference in current-used/lia-preview. */
export const liaPreviewAssets = {
  avatar: finalRootAssets.lia.idleContemplative6f,
  greeting: finalRootAssets.lia.greeting4f,
  valley: finalRootAssets.environment.landscape,
  valleyPortrait: finalRootAssets.environment.portrait,
  action: finalRootAssets.ui.actionBackplate,
} as const;
