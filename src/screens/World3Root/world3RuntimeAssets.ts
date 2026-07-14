const world3RuntimeBase = "/assets/gvo/stations/world-3/notebook-pixel/runtime";

export const world3RuntimeAssets = {
  environment: {
    ambientTexture: `${world3RuntimeBase}/environment/world3_ambient_texture_v01.webp`,
  },
  notebook: {
    openBase: `${world3RuntimeBase}/notebook/world3_notebook_open_base_v01.png`,
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
