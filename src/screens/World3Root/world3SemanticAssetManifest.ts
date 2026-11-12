import { world3RuntimeAssets } from "./world3RuntimeAssets";
import { world3LiaClipAssets } from "./world3LiaClips";

export const world3SemanticAssetManifest = {
  currentComposition: {
    status: "OBS03.2-original-notebook-candidate-pending-visual-QA",
    consumer: "World3RootScreen.tsx",
    reused: ["environment", "notebook", "notebookTurnPage", "practiceMotifs"],
    generated: Object.values(world3LiaClipAssets).map((clip) => clip.src),
    historicalNotConsumed: [
      "records",
      "notebookFolioV02",
      "plantNotebookMarksSheet",
      "prototypeNotebookMarksSheet",
      "signalNotebookMarksSheet",
      "indexNotebookMarksSheet",
      "historicalPixelLiaPoses",
    ],
    practiceMotifs: world3RuntimeAssets.practice,
    editorialIllustrations: world3RuntimeAssets.illustrations,
    pendingProduction: [],
    pendingVisualReview: ["three-pixel-clips-in-current-scene-normal-and-reduced-motion"],
    clipsManifest: "public/assets/gvo/current-used/world-3-root/lia/clips/OBS03-clips-manifest.json",
    productionManifest:
      "docs/narrative/integracion_autonoma_2026-10-23/assets-production.json",
    finishingManifest:
      "docs/narrative/integracion_autonoma_2026-10-23/revision-acabado/assets-manifest.json",
  },
  environment: {
    asset: world3RuntimeAssets.environment.ambientTexture,
    visualMode: "asset-css" as const,
    responsibility: "Ambiente oscuro recortable; sin contenido narrativo.",
  },
  notebook: {
    asset: world3RuntimeAssets.notebook.openBase,
    visualMode: "asset-dom" as const,
    responsibility:
      "Bitmap original proporcional, recortado por alfa medido sin nueve segmentos; papel, texto y controles permanecen en DOM.",
  },
  notebookOpenBase: {
    asset: world3RuntimeAssets.notebook.openBase,
    historical: false,
    responsibility:
      "Base original restaurada por OBS03; mismo archivo, sin transformación raster.",
  },
  notebookFolioV02: {
    asset: world3RuntimeAssets.notebook.folio,
    historical: true,
    responsibility: "Variante rechazada conservada como historia; no consumida por la composición OBS03.",
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
    historicalAssetsNotConsumed: world3RuntimeAssets.lia,
    assets: world3LiaClipAssets,
    visualMode: "three-registered-six-frame-clips" as const,
    responsibility:
      "Índice neutral e INTRO usan la hoja intro; PASO escucha y BENEFICIOS acompaña. Tres hojas reales registradas, sin fallback silencioso, callbacks de cierre ni aprobación visual implícita. El mensaje accesible vive en DOM.",
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
    "particles",
  ] as const,
} as const;
