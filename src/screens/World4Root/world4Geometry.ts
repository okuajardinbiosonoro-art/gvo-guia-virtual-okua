import type { Station4NodeId } from "./station4Content";

export const WORLD4_ARTBOARD = {
  width: 1536,
  height: 1024,
  aspectRatio: 3 / 2,
} as const;

export const WORLD4_PORTRAIT_ARTBOARD = {
  width: 1536,
  height: 2048,
  aspectRatio: 3 / 4,
} as const;

export type World4NodeAnchor = {
  id: Station4NodeId;
  order: number;
  x: number;
  y: number;
  xPercent: number;
  yPercent: number;
};

const sourceAnchors = [
  { id: "planta", x: 170, y: 500 },
  { id: "bionosificador", x: 340, y: 470 },
  { id: "esp32", x: 510, y: 445 },
  { id: "midi", x: 680, y: 430 },
  { id: "wifi_udp", x: 856, y: 430 },
  { id: "router", x: 1026, y: 445 },
  { id: "sistema_central", x: 1196, y: 470 },
  { id: "sonido", x: 1366, y: 500 },
] as const satisfies ReadonlyArray<{
  id: Station4NodeId;
  x: number;
  y: number;
}>;

export const WORLD4_NODE_ANCHORS = sourceAnchors.map((anchor, index) => ({
  ...anchor,
  order: index + 1,
  xPercent: (anchor.x / WORLD4_ARTBOARD.width) * 100,
  yPercent: (anchor.y / WORLD4_ARTBOARD.height) * 100,
})) as ReadonlyArray<
  (typeof sourceAnchors)[number] & {
    order: number;
    xPercent: number;
    yPercent: number;
  }
>;

export const WORLD4_PORTRAIT_NODE_ANCHORS: readonly World4NodeAnchor[] =
  sourceAnchors.map((anchor, index) => {
    const xPercent = index % 2 === 0 ? 26 : 74;
    const yPercent = 24 + Math.floor(index / 2) * 18;
    return {
      id: anchor.id,
      order: index + 1,
      x: (WORLD4_PORTRAIT_ARTBOARD.width * xPercent) / 100,
      y: (WORLD4_PORTRAIT_ARTBOARD.height * yPercent) / 100,
      xPercent,
      yPercent,
    };
  });

export const WORLD4_NODE_STACK = {
  haloFullCanvasWidth: 152,
  pedestalFullCanvasWidth: 136,
  objectVisibleBaselineOffsetY: -12,
  minimumHitTargetCssPx: 44,
} as const;

export const WORLD4_Z_ORDER = {
  environment: 0,
  rearDepthPlane: 1,
  haze: 2,
  tableContactShadow: 3,
  tableLowerBase: 4,
  tableFrontEdge: 5,
  tableTop: 6,
  passiveRoute: 7,
  nodeHalo: 8,
  nodePedestal: 9,
  nodeObject: 10,
  lia: 11,
  domUi: 12,
} as const;
