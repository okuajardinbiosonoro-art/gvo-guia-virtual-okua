import { finalRootAssets } from "./finalRootAssets";
/** Approved canonical originals, registered by reference in current-used/lia-preview. */
export const liaPreviewAssets = {
  avatar: finalRootAssets.lia.idleContemplative6f,
  greeting: finalRootAssets.lia.greeting4f,
  approvedGreeting: "/assets/gvo/lia-preview/lia/lia-m4-greeting-a.webp",
  listening: "/assets/gvo/lia-preview/lia/lia-m4-listening-a.webp",
  explaining: "/assets/gvo/lia-preview/lia/lia-m4-explaining-a.webp",
  valley: finalRootAssets.environment.landscape,
  valleyPortrait: finalRootAssets.environment.portrait,
  action: finalRootAssets.ui.actionBackplate,
} as const;
