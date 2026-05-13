import { stations } from "./stations";

export interface FlowStep {
  id: string;
  label: string;
  route: string;
}

export const flowSteps: FlowStep[] = [
  {
    id: "loading",
    label: "Carga inicial",
    route: "/carga",
  },
  {
    id: "cover",
    label: "Portada",
    route: "/portada",
  },
  ...stations.map((station) => ({
    id: `station-${station.id}`,
    label: `${station.label} - ${station.world}`,
    route: station.route,
  })),
  {
    id: "final",
    label: "Final",
    route: "/final",
  },
];
