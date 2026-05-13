export type StationId = 1 | 2 | 3 | 4 | 5;

export interface StationDefinition {
  id: StationId;
  label: string;
  world: string;
  route: string;
  qrRoute: string;
}

export const stations: StationDefinition[] = [
  {
    id: 1,
    label: "Estación I",
    world: "Mundo I: Raíz",
    route: "/estacion/1",
    qrRoute: "/qr/1",
  },
  {
    id: 2,
    label: "Estación II",
    world: "Mundo II: Lía y el pulso invisible",
    route: "/estacion/2",
    qrRoute: "/qr/2",
  },
  {
    id: 3,
    label: "Estación III",
    world: "Mundo III: Cuaderno Pixel de Pruebas",
    route: "/estacion/3",
    qrRoute: "/qr/3",
  },
  {
    id: 4,
    label: "Estación IV",
    world: "Mundo IV: Mesa de sistema",
    route: "/estacion/4",
    qrRoute: "/qr/4",
  },
  {
    id: 5,
    label: "Estación V",
    world: "Mundo V: Mapa del presente",
    route: "/estacion/5",
    qrRoute: "/qr/5",
  },
];

export const stationIds = stations.map((station) => station.id);

export function getStationById(id: number) {
  return stations.find((station) => station.id === id);
}
