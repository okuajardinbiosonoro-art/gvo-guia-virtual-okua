import type { StationId } from "../data/stations";

export const coverIntroRoute = "/portada";

export const initialExperienceRoute = "/inicio";

export const coverToWorldOneTransitionRoute = "/transition/intro-to-station-1";

export const worldOneToWorldTwoTransitionRoute =
  "/transition/world-1-to-world-2";

export const worldTwoToWorldThreeTransitionRoute =
  "/transition/world-2-to-world-3";

export const worldThreeToWorldFourTransitionRoute =
  "/transition/world-3-to-world-4";

export const worldFourToWorldFiveTransitionRoute =
  "/transition/world-4-to-world-5";

export const worldFiveToFinalTransitionRoute = "/transition/world-5-to-final";

export const worldOneEntryRoute = "/estacion/1";

export const worldTwoEntryRoute = "/estacion/2";

export const worldTwoPlaceholderRoute = worldTwoEntryRoute;

export const worldThreeEntryRoute = "/estacion/3";

export const worldFourEntryRoute = "/estacion/4";

export const worldFiveEntryRoute = "/estacion/5";

export const worldFivePlantsRoute = "/estacion/5/plantas";

export const worldFiveSystemRoute = "/estacion/5/sistema";

export const worldFiveSpaceRoute = "/estacion/5/espacio";

export const worldFiveVisitorRoute = "/estacion/5/visitante";

export const finalEntryRoute = "/final";

export const qrEntryRoutePattern = "/qr/:qrId";

export const qrFallbackRoutePattern = "/qr/*";

export const qrJourneyStartRoute = "/qr/start";

export const qrWorldEntryRoutes = {
  2: "/qr/w2",
  3: "/qr/w3",
  4: "/qr/w4",
  5: "/qr/w5",
} as const satisfies Readonly<Record<Exclude<StationId, 1>, string>>;

export const stationEntryRoutes: Readonly<Record<StationId, string>> = {
  1: worldOneEntryRoute,
  2: worldTwoEntryRoute,
  3: worldThreeEntryRoute,
  4: worldFourEntryRoute,
  5: worldFiveEntryRoute,
};
