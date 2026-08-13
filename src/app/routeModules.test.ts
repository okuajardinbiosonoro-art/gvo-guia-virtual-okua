import { describe, expect, it } from "vitest";

import {
  journeyRouteModuleLoaders,
  routeModuleForDestination,
} from "./routeModules";
import {
  finalEntryRoute,
  worldFiveEntryRoute,
  worldFourEntryRoute,
  worldOneEntryRoute,
  worldThreeEntryRoute,
  worldTwoEntryRoute,
} from "./routes";

describe("route module contract", () => {
  it("mantiene un loader diferido por Transición, Mundo y Mirador", () => {
    expect(Object.keys(journeyRouteModuleLoaders)).toEqual([
      "transition",
      "world1",
      "world2",
      "world3",
      "world4",
      "world5",
      "final",
    ]);

    for (const loader of Object.values(journeyRouteModuleLoaders)) {
      expect(loader).toBeTypeOf("function");
    }
  });

  it.each([
    [worldOneEntryRoute, "world1"],
    [worldTwoEntryRoute, "world2"],
    [worldThreeEntryRoute, "world3"],
    [worldFourEntryRoute, "world4"],
    [worldFiveEntryRoute, "world5"],
    [finalEntryRoute, "final"],
  ] as const)("asocia %s con el chunk %s", (route, moduleId) => {
    expect(routeModuleForDestination(route)).toBe(moduleId);
  });

  it("no intenta precargar destinos ajenos al contrato", () => {
    expect(routeModuleForDestination("/portada")).toBeNull();
    expect(routeModuleForDestination("/qr/w5")).toBeNull();
    expect(routeModuleForDestination("/desconocida")).toBeNull();
  });
});
