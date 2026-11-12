export const gestureHintAssets = {
  tap: "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_tap_v01.png",
  "swipe-vertical":
    "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_swipe_v03.webp",
  "swipe-horizontal":
    "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_swipe_v03.webp",
} as const;

export type GestureHintVariant = keyof typeof gestureHintAssets;

