import {
  finalEntryRoute,
  worldFiveEntryRoute,
  worldFourEntryRoute,
  worldOneEntryRoute,
  worldThreeEntryRoute,
  worldTwoEntryRoute,
} from "./routes";

export const journeyRouteModuleLoaders = {
  transition: () => import("../screens/TransitionWorld/TransitionWorld"),
  world1: () => import("../screens/World1Root/World1RootScreen"),
  world2: () => import("../screens/World2Root/World2RootScreen"),
  world3: () => import("../screens/World3Root/World3RootScreen"),
  world4: () => import("../screens/World4Root/World4RootScreen"),
  world5: () => import("../screens/World5Root/World5RootScreen"),
  final: () => import("../screens/FinalRoot/FinalRootScreen"),
} as const;

export type JourneyRouteModuleId = keyof typeof journeyRouteModuleLoaders;

const routeModuleByDestination = {
  [worldOneEntryRoute]: "world1",
  [worldTwoEntryRoute]: "world2",
  [worldThreeEntryRoute]: "world3",
  [worldFourEntryRoute]: "world4",
  [worldFiveEntryRoute]: "world5",
  [finalEntryRoute]: "final",
} as const satisfies Record<string, JourneyRouteModuleId>;

export function routeModuleForDestination(
  destination: string,
): JourneyRouteModuleId | null {
  return (
    routeModuleByDestination[
      destination as keyof typeof routeModuleByDestination
    ] ?? null
  );
}

export function preloadJourneyRouteModule(moduleId: JourneyRouteModuleId) {
  return journeyRouteModuleLoaders[moduleId]();
}
