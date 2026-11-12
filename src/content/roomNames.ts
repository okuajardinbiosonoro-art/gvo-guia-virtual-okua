/** Visible editorial names; routes, QR payloads and storage keys keep their IDs. */
export type RoomNumber = 1 | 2 | 3 | 4 | 5;

export const ROOM_ROMANS = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" } as const;

export const ROOM_NAMES = {
  1: "Raíz",
  2: "Pulso invisible",
  3: "Cuaderno de práctica",
  4: "Sistema biosonoro",
  5: "OKÚA, arte sensorial",
} as const;

export const ROOM_HEADINGS = {
  1: "Sala I · Raíz",
  2: "Sala II · Pulso invisible",
  3: "Sala III · Cuaderno de práctica",
  4: "Sala IV · Sistema biosonoro",
  5: "Sala V · OKÚA, arte sensorial",
} as const;
