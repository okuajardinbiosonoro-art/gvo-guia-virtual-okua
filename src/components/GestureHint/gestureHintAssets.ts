export const gestureHintAssets = {
  tap: "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_tap_v01.png",
  "swipe-vertical":
    "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_swipe_vertical_v01.png",
  "swipe-horizontal":
    "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_swipe_horizontal_v01.png",
} as const;

export type GestureHintVariant = keyof typeof gestureHintAssets;

