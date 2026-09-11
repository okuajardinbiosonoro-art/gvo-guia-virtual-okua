/* Public approved snapshot only; verified against the frozen bundle by cross-product QA. */
export const publicEvidence: Record<
  string,
  {
    source_id: string;
    source_digest: string;
    source_version: string;
    section: string;
    freshness: string;
    text: string;
    label: string;
  }
> = {
  "GVO-INTRO-01": {
    source_id: "GVO-INTRO",
    source_digest:
      "f73eb82839f43bb21555f691e4beb0bfcb678b37eb74b1afe6bff8a8becc930b",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "intro-01-presentation",
    freshness: "DATED",
    text: "Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.",
    label: "Lía y la introducción al Archivo Vivo",
  },
  "GVO-INTRO-02": {
    source_id: "GVO-INTRO",
    source_digest:
      "f73eb82839f43bb21555f691e4beb0bfcb678b37eb74b1afe6bff8a8becc930b",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "intro-02-clarification",
    freshness: "DATED",
    text: "Antes de entrar, aclaremos algo: las plantas no hacen música por sí solas.",
    label: "Lía y la introducción al Archivo Vivo",
  },
  "GVO-INTRO-03": {
    source_id: "GVO-INTRO",
    source_digest:
      "f73eb82839f43bb21555f691e4beb0bfcb678b37eb74b1afe6bff8a8becc930b",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "intro-03-mediation",
    freshness: "DATED",
    text: "Lo que vas a recorrer es una mediación: una señal viva, una captura técnica y una interpretación.",
    label: "Lía y la introducción al Archivo Vivo",
  },
  "GVO-INTRO-04": {
    source_id: "GVO-INTRO",
    source_digest:
      "f73eb82839f43bb21555f691e4beb0bfcb678b37eb74b1afe6bff8a8becc930b",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "intro-04-order",
    freshness: "DATED",
    text: "Primero seguiremos el orden de los mundos. Al final podrás volver libremente a cualquier estación.",
    label: "Lía y la introducción al Archivo Vivo",
  },
  "GVO-INTRO-05": {
    source_id: "GVO-INTRO",
    source_digest:
      "f73eb82839f43bb21555f691e4beb0bfcb678b37eb74b1afe6bff8a8becc930b",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "intro-05-root",
    freshness: "DATED",
    text: "Empecemos por la raíz: el origen y el propósito de OKÚA.",
    label: "Lía y la introducción al Archivo Vivo",
  },
  "GVO-PLANTA-01": {
    source_id: "GVO-PLANTA",
    source_digest:
      "5a7cf8674467745c8fa5631c7fd3c9b4b19c3230aca115db01de032b3831a29f",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "observe",
    freshness: "DATED",
    text: "La primera pista fue observar una planta viva.",
    label: "Observar y cuidar",
  },
  "GVO-PLANTA-02": {
    source_id: "GVO-PLANTA",
    source_digest:
      "5a7cf8674467745c8fa5631c7fd3c9b4b19c3230aca115db01de032b3831a29f",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "care",
    freshness: "DATED",
    text: "Antes de construir, había que mirar qué relación queríamos cuidar.",
    label: "Observar y cuidar",
  },
  "GVO-PLANTA-03": {
    source_id: "GVO-PLANTA",
    source_digest:
      "5a7cf8674467745c8fa5631c7fd3c9b4b19c3230aca115db01de032b3831a29f",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "record",
    freshness: "DATED",
    text: "Registrar lo observado ayudó a decidir qué construir después.",
    label: "Observar y cuidar",
  },
  "GVO-PROTOTIPO-01": {
    source_id: "GVO-PROTOTIPO",
    source_digest:
      "22dd0f7903a47c53735a70cb007540d5e467ba4f9cf0805e713a73d5deafd50c",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "assembly",
    freshness: "DATED",
    text: "Después de observar, construimos un primer montaje.",
    label: "Construir y aprender",
  },
  "GVO-PROTOTIPO-02": {
    source_id: "GVO-PROTOTIPO",
    source_digest:
      "22dd0f7903a47c53735a70cb007540d5e467ba4f9cf0805e713a73d5deafd50c",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "testing",
    freshness: "DATED",
    text: "Cada componente ayudó a probar cómo captar y cuidar la señal.",
    label: "Construir y aprender",
  },
  "GVO-PROTOTIPO-03": {
    source_id: "GVO-PROTOTIPO",
    source_digest:
      "22dd0f7903a47c53735a70cb007540d5e467ba4f9cf0805e713a73d5deafd50c",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "learning",
    freshness: "DATED",
    text: "Lo que no funcionaba también dejó una pista para la siguiente versión.",
    label: "Construir y aprender",
  },
  "GVO-SENAL-01": {
    source_id: "GVO-SENAL",
    source_digest:
      "8df2630f9adcd842384e24f211b699136be32d113bc4cff0176277ca65ab98ae",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "capturing",
    freshness: "DATED",
    text: "Después del montaje, observamos la señal obtenida.",
    label: "Observar la señal",
  },
  "GVO-SENAL-02": {
    source_id: "GVO-SENAL",
    source_digest:
      "8df2630f9adcd842384e24f211b699136be32d113bc4cff0176277ca65ab98ae",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "inspecting",
    freshness: "DATED",
    text: "La variación mostró ruido, inestabilidad y límites.",
    label: "Observar la señal",
  },
  "GVO-SENAL-03": {
    source_id: "GVO-SENAL",
    source_digest:
      "8df2630f9adcd842384e24f211b699136be32d113bc4cff0176277ca65ab98ae",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "evidence",
    freshness: "DATED",
    text: "Cada cambio registrado indicó qué debía ajustarse después.",
    label: "Observar la señal",
  },
  "GVO-APRENDIZAJE-01": {
    source_id: "GVO-APRENDIZAJE",
    source_digest:
      "4c88c3a853339c81d01effdccbb5bf9fd0159b176c21ef2ab3744e98d8a412e5",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "intro",
    freshness: "DATED",
    text: "Abramos el cuaderno de pruebas. Aquí veremos cómo OKÚA fue aprendiendo.",
    label: "Prueba, error y ajuste",
  },
  "GVO-APRENDIZAJE-02": {
    source_id: "GVO-APRENDIZAJE",
    source_digest:
      "4c88c3a853339c81d01effdccbb5bf9fd0159b176c21ef2ab3744e98d8a412e5",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "adjusted",
    freshness: "DATED",
    text: "Cada prueba dejó una pista. Por eso el sistema se ajustó.",
    label: "Prueba, error y ajuste",
  },
  "GVO-APRENDIZAJE-03": {
    source_id: "GVO-APRENDIZAJE",
    source_digest:
      "4c88c3a853339c81d01effdccbb5bf9fd0159b176c21ef2ab3744e98d8a412e5",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "adjustedAlt",
    freshness: "DATED",
    text: "No fue magia: fue prueba, error y ajuste.",
    label: "Prueba, error y ajuste",
  },
  "GVO-MIRADOR-01": {
    source_id: "GVO-MIRADOR",
    source_digest:
      "cce5776c0958f059bcc5f544fdbff501d94affdedb081e425deb567624548fa9",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "FINAL_TITLE_01",
    freshness: "DATED",
    text: "Mirador final del jardín",
    label: "Mundos y revisión del recorrido",
  },
  "GVO-MIRADOR-02": {
    source_id: "GVO-MIRADOR",
    source_digest:
      "cce5776c0958f059bcc5f544fdbff501d94affdedb081e425deb567624548fa9",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "FINAL_ACCESS_I_LABEL_01",
    freshness: "DATED",
    text: "I — Raíz",
    label: "Mundos y revisión del recorrido",
  },
  "GVO-MIRADOR-03": {
    source_id: "GVO-MIRADOR",
    source_digest:
      "cce5776c0958f059bcc5f544fdbff501d94affdedb081e425deb567624548fa9",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "FINAL_ACCESS_II_LABEL_01",
    freshness: "DATED",
    text: "II — Pulso invisible",
    label: "Mundos y revisión del recorrido",
  },
  "GVO-MIRADOR-04": {
    source_id: "GVO-MIRADOR",
    source_digest:
      "cce5776c0958f059bcc5f544fdbff501d94affdedb081e425deb567624548fa9",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "FINAL_ACCESS_III_LABEL_01",
    freshness: "DATED",
    text: "III — Cuaderno de pruebas",
    label: "Mundos y revisión del recorrido",
  },
  "GVO-MIRADOR-05": {
    source_id: "GVO-MIRADOR",
    source_digest:
      "cce5776c0958f059bcc5f544fdbff501d94affdedb081e425deb567624548fa9",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "FINAL_ACCESS_IV_LABEL_01",
    freshness: "DATED",
    text: "IV — Mesa de sistema",
    label: "Mundos y revisión del recorrido",
  },
  "GVO-MIRADOR-06": {
    source_id: "GVO-MIRADOR",
    source_digest:
      "cce5776c0958f059bcc5f544fdbff501d94affdedb081e425deb567624548fa9",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "FINAL_ACCESS_V_LABEL_01",
    freshness: "DATED",
    text: "V — Mapa del presente",
    label: "Mundos y revisión del recorrido",
  },
  "GVO-MIRADOR-07": {
    source_id: "GVO-MIRADOR",
    source_digest:
      "cce5776c0958f059bcc5f544fdbff501d94affdedb081e425deb567624548fa9",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "FINAL_LIA_MESSAGE_01",
    freshness: "DATED",
    text: "Llegaste al final del recorrido. Puedes volver a cualquier mundo cuando quieras.",
    label: "Mundos y revisión del recorrido",
  },
  "GVO-MIRADOR-08": {
    source_id: "GVO-MIRADOR",
    source_digest:
      "cce5776c0958f059bcc5f544fdbff501d94affdedb081e425deb567624548fa9",
    source_version: "gvo-1251a4fd789193e51183a03e29cbb8971d50302d",
    section: "FINAL_HELP_01",
    freshness: "DATED",
    text: "Elige un mundo para revisarlo libremente.",
    label: "Mundos y revisión del recorrido",
  },
};
