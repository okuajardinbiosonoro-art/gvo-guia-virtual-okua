import type { StationId } from "../../data/stations";
import {
  canOpenStation,
  mostAdvancedAvailableStation,
  readProgress,
} from "../../domain/progress/progress.storage";
import type {
  GvoProgress,
  ProgressReadResult,
} from "../../domain/progress/progress.types";
import {
  qrJourneyStartRoute,
  qrWorldEntryRoutes,
  stationEntryRoutes,
} from "../routes";

type QrStationId = Exclude<StationId, 1>;

export type QrIdentifier = "start" | `w${QrStationId}`;

export type QrRouteContract = Readonly<{
  destination: string;
  fallback: "journey_start" | "most_advanced_authorized_station";
  identifier: QrIdentifier;
  kind: "journey_start" | "station_entry";
  requiredCompletedStations: readonly StationId[];
  route: string;
  stationId: QrStationId | null;
}>;

export const qrLanStartContract = {
  identifier: "lan-start",
  implementation: "resolution_only",
  journeyIdentifier: "start",
  networkConfiguration: null,
  responsibilities: ["connect_local_network", "open_journey"],
} as const;

export type QrNavigationResolution = Readonly<{
  contract: QrRouteContract | null;
  destination: string;
  fallbackStationId: StationId;
  requestedIdentifier: string | null;
  status:
    | "valid_start"
    | "valid_station"
    | "insufficient_progress"
    | "invalid_identifier";
}>;

export const qrRouteContracts: readonly QrRouteContract[] = [
  {
    destination: "/",
    fallback: "journey_start",
    identifier: "start",
    kind: "journey_start",
    requiredCompletedStations: [],
    route: qrJourneyStartRoute,
    stationId: null,
  },
  ...([2, 3, 4, 5] as const).map(
    (stationId): QrRouteContract => ({
      destination: stationEntryRoutes[stationId],
      fallback: "most_advanced_authorized_station",
      identifier: `w${stationId}`,
      kind: "station_entry",
      requiredCompletedStations: Array.from(
        { length: stationId - 1 },
        (_, index) => (index + 1) as StationId,
      ),
      route: qrWorldEntryRoutes[stationId],
      stationId,
    }),
  ),
];

function findQrContract(identifier: string | null): QrRouteContract | null {
  return (
    qrRouteContracts.find((candidate) => candidate.identifier === identifier) ??
    null
  );
}

export function resolveQrNavigation(
  requestedIdentifier: string | null | undefined,
  progress: GvoProgress | ProgressReadResult = readProgress(),
): QrNavigationResolution {
  const normalizedRequestedIdentifier = requestedIdentifier ?? null;
  const contract = findQrContract(normalizedRequestedIdentifier);
  const fallbackStationId = mostAdvancedAvailableStation(progress);
  const fallbackDestination = stationEntryRoutes[fallbackStationId];

  if (!contract) {
    return {
      contract: null,
      destination: fallbackDestination,
      fallbackStationId,
      requestedIdentifier: normalizedRequestedIdentifier,
      status: "invalid_identifier",
    };
  }

  if (contract.kind === "journey_start") {
    return {
      contract,
      destination: contract.destination,
      fallbackStationId,
      requestedIdentifier: normalizedRequestedIdentifier,
      status: "valid_start",
    };
  }

  if (
    contract.stationId === null ||
    !canOpenStation(contract.stationId, progress)
  ) {
    return {
      contract,
      destination: fallbackDestination,
      fallbackStationId,
      requestedIdentifier: normalizedRequestedIdentifier,
      status: "insufficient_progress",
    };
  }

  return {
    contract,
    destination: contract.destination,
    fallbackStationId,
    requestedIdentifier: normalizedRequestedIdentifier,
    status: "valid_station",
  };
}
