import { world3RuntimeAssets } from "./world3RuntimeAssets";

export const world3SemanticAssetManifest = {
  environment: {
    asset: world3RuntimeAssets.environment.ambientTexture,
    visualMode: "asset-css" as const,
    responsibility: "Ambiente oscuro recortable; sin contenido narrativo.",
  },
  notebook: {
    asset: world3RuntimeAssets.notebook.openBase,
    visualMode: "asset-dom" as const,
    responsibility:
      "Shell visual; páginas, texto y controles permanecen en DOM.",
  },
  notebookTurnPage: {
    asset: world3RuntimeAssets.notebook.turnPage,
    category: "notebook-page" as const,
    scope: "world3-shared" as const,
    role: "transition-sheet" as const,
    dynamic: false,
    canvas: { width: 1024, height: 1024 },
    alphaBounds: { left: 177, top: 37, right: 853, bottom: 978 },
    contentAspectRatio: "derived-from-alpha-bounds" as const,
    transformOrigin: "left center" as const,
    visualMode: "asset-dom" as const,
    responsibility:
      "Hoja real compartida por ambas caras del giro; el margen alfa se compensa en el origen sin editar el PNG.",
  },
  lia: {
    assets: world3RuntimeAssets.lia,
    visualMode: "pose-actor" as const,
    responsibility:
      "Actor decorativo por poses; el mensaje accesible vive en DOM.",
  },
  records: {
    planta: world3RuntimeAssets.records.planta,
    prototipo: world3RuntimeAssets.records.prototipo,
    senal: world3RuntimeAssets.records.senal,
    visualMode: "asset-dom" as const,
    responsibility:
      "Figuras aisladas; títulos, estados y controles permanecen en DOM.",
  },
  plantNotebookMarksSheet: {
    asset: world3RuntimeAssets.plant.notebookMarksSheet,
    category: "notebook-annotation" as const,
    scope: "world3-plant" as const,
    dynamic: false,
    consumedAsSpriteSheet: true,
    grid: {
      columns: 4,
      rows: 2,
      cell: { width: 256, height: 256 },
    },
    visualMode: "sprite-sheet-css" as const,
    responsibility:
      "Marcas pixelart decorativas por paso; narrativa, check y estado permanecen semánticos en DOM.",
  },
  prototypeNotebookMarksSheet: {
    asset: world3RuntimeAssets.prototype.notebookMarksSheet,
    category: "notebook-annotation" as const,
    scope: "world3-prototype" as const,
    dynamic: false,
    consumedAsSpriteSheet: true,
    grid: {
      columns: 4,
      rows: 2,
      cell: { width: 256, height: 256 },
    },
    visualMode: "sprite-sheet-css" as const,
    responsibility:
      "Marcas pixelart decorativas por fase; narrativa, ruta, LED y estado permanecen semánticos en DOM.",
  },
  signalNotebookMarksSheet: {
    asset: world3RuntimeAssets.signal.notebookMarksSheet,
    category: "notebook-annotation" as const,
    scope: "world3-signal" as const,
    dynamic: false,
    consumedAsSpriteSheet: true,
    grid: {
      columns: 4,
      rows: 2,
      cell: { width: 256, height: 256 },
    },
    visualMode: "sprite-sheet-css" as const,
    responsibility:
      "Marcas pixelart decorativas por revisión; narrativa, traza, regiones y estado permanecen semánticos en DOM.",
  },
  indexNotebookMarksSheet: {
    asset: world3RuntimeAssets.index.notebookMarksSheet,
    category: "notebook-annotation" as const,
    scope: "world3-index" as const,
    dynamic: true,
    consumedAsSpriteSheet: true,
    grid: {
      columns: 4,
      rows: 2,
      cell: { width: 256, height: 256 },
    },
    visualMode: "sprite-sheet-css" as const,
    responsibility:
      "Marcas pixelart decorativas progresivas según avance; opciones, estados y controles permanecen semánticos en DOM.",
  },
  proceduralOnly: [
    "waveform",
    "checks",
    "stamp",
    "text",
    "controls",
    "frame",
    "particles",
  ] as const,
} as const;
