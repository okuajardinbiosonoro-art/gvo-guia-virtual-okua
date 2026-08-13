import { describe, expect, it } from "vitest";

import type { GvoProgress } from "../../domain/progress/progress.types";
import {
  qrLanStartContract,
  qrRouteContracts,
  resolveQrNavigation,
} from "./qrNavigation";

function progress(
  completedStations: GvoProgress["completedStations"],
): GvoProgress {
  return {
    schemaVersion: 1,
    completedStations,
    updatedAt: null,
  };
}

describe("QR navigation contract", () => {
  it("publishes start plus W2-W5 without a QR entry for Mundo I", () => {
    expect(qrRouteContracts).toEqual([
      {
        destination: "/",
        fallback: "journey_start",
        identifier: "start",
        kind: "journey_start",
        requiredCompletedStations: [],
        route: "/qr/start",
        stationId: null,
      },
      {
        destination: "/estacion/2",
        fallback: "most_advanced_authorized_station",
        identifier: "w2",
        kind: "station_entry",
        requiredCompletedStations: [1],
        route: "/qr/w2",
        stationId: 2,
      },
      {
        destination: "/estacion/3",
        fallback: "most_advanced_authorized_station",
        identifier: "w3",
        kind: "station_entry",
        requiredCompletedStations: [1, 2],
        route: "/qr/w3",
        stationId: 3,
      },
      {
        destination: "/estacion/4",
        fallback: "most_advanced_authorized_station",
        identifier: "w4",
        kind: "station_entry",
        requiredCompletedStations: [1, 2, 3],
        route: "/qr/w4",
        stationId: 4,
      },
      {
        destination: "/estacion/5",
        fallback: "most_advanced_authorized_station",
        identifier: "w5",
        kind: "station_entry",
        requiredCompletedStations: [1, 2, 3, 4],
        route: "/qr/w5",
        stationId: 5,
      },
    ]);
  });

  it("keeps QR-LAN-START as a resolution-only future contract", () => {
    expect(qrLanStartContract).toEqual({
      identifier: "lan-start",
      implementation: "resolution_only",
      journeyIdentifier: "start",
      networkConfiguration: null,
      responsibilities: ["connect_local_network", "open_journey"],
    });
  });

  it("resolves journey start without inventing a QR for Mundo I", () => {
    expect(resolveQrNavigation("start", progress([]))).toMatchObject({
      destination: "/",
      status: "valid_start",
    });
    expect(resolveQrNavigation("w1", progress([]))).toMatchObject({
      destination: "/estacion/1",
      status: "invalid_identifier",
    });
  });

  it("opens a valid world QR only when the sequential guard permits it", () => {
    expect(resolveQrNavigation("w3", progress([1, 2]))).toMatchObject({
      destination: "/estacion/3",
      status: "valid_station",
    });
    expect(resolveQrNavigation("w5", progress([1]))).toMatchObject({
      destination: "/estacion/2",
      fallbackStationId: 2,
      status: "insufficient_progress",
    });
  });

  it("rejects legacy, malformed and manipulated identifiers", () => {
    for (const qrId of [null, "", "1", "2", "W2", "w1", "w6", "w2/../w5"]) {
      expect(resolveQrNavigation(qrId, progress([1, 2]))).toMatchObject({
        contract: null,
        destination: "/estacion/3",
        fallbackStationId: 3,
        status: "invalid_identifier",
      });
    }
  });

  it("fails closed to Mundo I when progress cannot be trusted", () => {
    expect(
      resolveQrNavigation("w5", {
        status: "corrupt",
        progress: null,
        rawPreserved: true,
      }),
    ).toMatchObject({
      destination: "/estacion/1",
      fallbackStationId: 1,
      status: "insufficient_progress",
    });
  });
});
