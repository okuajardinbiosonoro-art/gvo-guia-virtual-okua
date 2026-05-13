import type { StationId } from "../../data/stations";

export interface GvoProgress {
  completedStations: StationId[];
  updatedAt: string | null;
}

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
