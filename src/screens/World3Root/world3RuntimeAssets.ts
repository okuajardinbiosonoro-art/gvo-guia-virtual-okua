import { getWorld3LiaClipSources } from "./world3LiaClips";

const world3RuntimeBase = "/assets/gvo/stations/world-3/notebook-pixel/runtime";

export const world3RuntimeAssets = {
  environment: {
    ambientTexture: `${world3RuntimeBase}/environment/world3_ambient_texture_v01.webp`,
  },
  notebook: {
    openBase: `${world3RuntimeBase}/notebook/world3_notebook_open_base_v01.png`,
    folio: `${world3RuntimeBase}/notebook/world3_notebook_folio_v02.webp`,
    turnPage: `${world3RuntimeBase}/notebook/world3_notebook_turn_page_v01.png`,
  },
  lia: {
    idle: `${world3RuntimeBase}/lia/lia_world3_idle_v01.png`,
    pointing: `${world3RuntimeBase}/lia/lia_world3_pointing_v01.png`,
    observing: `${world3RuntimeBase}/lia/lia_world3_observing_v01.png`,
    confirming: `${world3RuntimeBase}/lia/lia_world3_confirming_v01.png`,
    closure: `${world3RuntimeBase}/lia/lia_world3_closure_v01.png`,
  },
  records: {
    planta: `${world3RuntimeBase}/records/world3_record_plant_v01.png`,
    prototipo: `${world3RuntimeBase}/records/world3_record_prototype_v01.png`,
    senal: `${world3RuntimeBase}/records/world3_record_signal_device_v01.png`,
  },
  practice: {
    planta: `${world3RuntimeBase}/practice/world3_intro_token_v01.webp`,
    prototipo: `${world3RuntimeBase}/practice/world3_practice_listening_v01.webp`,
    senal: `${world3RuntimeBase}/practice/world3_benefits_care_v01.webp`,
  },
  illustrations: {
    pausa: `${world3RuntimeBase}/practice/world3_editorial_pausa_v01.webp`,
    descanso: `${world3RuntimeBase}/practice/world3_editorial_descanso-mental_v01.webp`,
    musica: `${world3RuntimeBase}/practice/world3_editorial_planta-musical_v01.webp`,
    respirar: `${world3RuntimeBase}/practice/world3_editorial_respirar_v01.webp`,
    escuchar: `${world3RuntimeBase}/practice/world3_editorial_escuchar_v01.webp`,
    escribir: `${world3RuntimeBase}/practice/world3_editorial_escribir_v01.webp`,
    fotografia: `${world3RuntimeBase}/practice/world3_editorial_fotografia_v01.webp`,
  },
  plant: {
    notebookMarksSheet: `${world3RuntimeBase}/plant/world3_plant_notebook_marks_sheet_v01.png`,
  },
  prototype: {
    notebookMarksSheet: `${world3RuntimeBase}/prototype/world3_prototype_notebook_marks_sheet_v01.png`,
  },
  signal: {
    notebookMarksSheet: `${world3RuntimeBase}/signal/world3_signal_notebook_marks_sheet_v01.png`,
  },
  index: {
    notebookMarksSheet: `${world3RuntimeBase}/index/world3_index_notebook_marks_sheet_v01.png`,
  },
} as const;

/** Active notebook resources only; v02 folio and old mark sheets are historical. */
export function getWorld3CriticalAssetSources(page: "planta" | "prototipo" | "senal" | null) {
  const common = [world3RuntimeAssets.environment.ambientTexture, world3RuntimeAssets.notebook.openBase, world3RuntimeAssets.notebook.turnPage];
  if (page === null) return [...common, ...Object.values(world3RuntimeAssets.practice), ...getWorld3LiaClipSources("index")];
  const { pausa, descanso, musica, respirar, escuchar, escribir, fotografia } = world3RuntimeAssets.illustrations;
  const illustrations = page === "planta" ? [pausa, descanso, musica] : page === "prototipo" ? [respirar, escuchar, escribir, fotografia] : [];
  return [...common, world3RuntimeAssets.practice[page], ...illustrations, ...getWorld3LiaClipSources(page)];
}
