import type { Station3RecordId } from "../../domain/checkpoints/world3Checkpoint";
import { world3RuntimeAssets } from "./world3RuntimeAssets";

export type { Station3RecordId } from "../../domain/checkpoints/world3Checkpoint";

/**
 * Sala III — contrato OBS03.2, candidata para revisión.
 * Orígenes TXT_3_*, hashes, recortes y erratas en world3EditorialSlots.ts;
 * los tres originales omitidos por D17 se conservan en el inventario documental.
 * Las propiedades históricas se conservan para compatibilidad; el consumidor
 * actual presenta fragments manualmente, sin sus holdMs.
 */

export type Station3PlantNarrativeStep = {
  id: "observe" | "care" | "record";
  text: string;
  holdMs: number;
};

export type Station3PrototypeNarrativeStep = {
  id: "assembly" | "testing" | "learning";
  text: string;
  holdMs: number;
};

export type Station3SignalNarrativeStep = {
  id: "capturing" | "inspecting" | "evidence";
  text: string;
  holdMs: number;
};

type Station3Folio = {
  sourceId: string;
  text: string;
  illustration?: string;
  steps?: readonly { text: string; illustration?: string }[];
};

export type Station3RecordContent = {
  id: Station3RecordId;
  order: 1 | 2 | 3;
  label: string;
  registro: string;
  accessibleLabel: string;
  indexCopy: string;
  pageTitle: string;
  fragments: readonly string[];
  /** OBS04 leaves are exact source blocks, not additional essential steps. */
  folios: readonly Station3Folio[];
  marginNotes: readonly string[];
  confirmLabel: string;
  plantPage?: {
    narrativeSteps: readonly Station3PlantNarrativeStep[];
    registeredLabel: string;
    revisitLabel: string;
    editorialSource: "station3-content-spec";
  };
  prototypePage?: {
    narrativeSteps: readonly Station3PrototypeNarrativeStep[];
    registeredLabel: string;
    revisitLabel: string;
    editorialSource: "station3-content-spec";
  };
  signalPage?: {
    narrativeSteps: readonly Station3SignalNarrativeStep[];
    registeredLabel: string;
    revisitLabel: string;
    editorialSource: "station3-content-spec";
  };
};


import { world3EditorialText, type World3Locale } from "../../content/world3EditorialSlots";
export function getStation3Content(locale: World3Locale) {
  const t = (id: string) => world3EditorialText(id, locale);
  const en = locale === "en";
  const art = world3RuntimeAssets.illustrations;
  const folios: Record<string, Station3Folio> = {
    TXT_3_ea0217fac7f6: { sourceId: "TXT_3_ea0217fac7f6", text: t("TXT_3_ea0217fac7f6"), illustration: art.pausa },
    TXT_3_d1384cb3c055: {
      sourceId: "TXT_3_d1384cb3c055",
      text: en ? "You already know the theory behind how biosound works. Leave this space to enjoy the result, without preconceptions." : "Ya conoces la teoría detrás del funcionamiento biosonoro. Deja este espacio para disfrutar del resultado, sin prejuicios.",
      illustration: art.descanso,
    },
    TXT_3_f4d4d818e31e: {
      sourceId: "TXT_3_f4d4d818e31e",
      text: en ? "Accept the experience as a unique concert the plants give you, and let the sound carry you." : "Acepta la experiencia como un concierto único que te regalan las plantas y déjate llevar por el sonido.",
      illustration: art.musica,
    },
    TXT_3_1e4564d904af: {
      sourceId: "TXT_3_1e4564d904af",
      text: t("TXT_3_1e4564d904af"),
      steps: [
        { text: en ? "Breathe deeply. Inhale for six counts, hold for three and exhale for nine, at a comfortable pace." : "Respira profundo, inhala en seis tiempos, retén en tres y exhala en nueve, a un ritmo cómodo.", illustration: art.respirar },
        { text: en ? "Listen carefully to the sounds the plants produce, their rhythms and textures. When permitted, touch their leaves gently, notice their scent and become fully aware of the present." : "Escucha con atención los sonidos que producen las plantas, sus ritmos y texturas. Si está permitido, toca sus hojas con suavidad, siente el aroma y toma conciencia plena del presente.", illustration: art.escuchar },
      ],
    },
    TXT_3_034a41e11f4b: {
      sourceId: "TXT_3_034a41e11f4b",
      text: t("TXT_3_034a41e11f4b"),
      steps: [
        { text: en ? "After five minutes of listening, describe on a card what you heard and felt during this exercise." : "Después de cinco minutos de escucha, describe en una tarjeta lo que escuchaste y sentiste mientras realizabas este ejercicio.", illustration: art.escribir },
        { text: en ? "If you wish, take a photo, share it and tag us in your story. @okuajardinsonoro" : "Si quieres, toma una foto, compártela y etiquétanos en tu historia. @okuajardinsonoro", illustration: art.fotografia },
      ],
    },
    TXT_3_30f92d565590: { sourceId: "TXT_3_30f92d565590", text: t("TXT_3_30f92d565590") },
  };
  const groups = [
    { id: "planta" as const, label: t("TXT_3_835c5985f329"), subtitle: t("TXT_3_8ab07739da9e"), ids: ["TXT_3_ea0217fac7f6", "TXT_3_d1384cb3c055", "TXT_3_f4d4d818e31e"] },
    { id: "prototipo" as const, label: t("TXT_3_b7761744e2bd"), subtitle: t("TXT_3_51781e0a75fe"), ids: ["TXT_3_1e4564d904af", "TXT_3_034a41e11f4b"] },
    { id: "senal" as const, label: t("TXT_3_1fdc4f4d4f09"), subtitle: t("TXT_3_e315ce794cf2"), ids: ["TXT_3_30f92d565590"] },
  ];
  const records: readonly Station3RecordContent[] = groups.map((group, index) => ({
    id: group.id, order: (index + 1) as 1|2|3, label: group.label,
    registro: (en ? "CH " : "CAP ") + String(index + 1).padStart(2, "0"),
    accessibleLabel: en ? `Page ${index + 1} of 3. ${group.label}. ${group.subtitle}.` : `Página ${index + 1} de 3. ${group.label}. ${group.subtitle}.`,
    indexCopy: group.subtitle, pageTitle: group.label, fragments: group.ids.map(t),
    folios: group.ids.map((sourceId) => folios[sourceId]),
    marginNotes: [], confirmLabel: t("TXT_3_8338dbaa1d16"),
  }));
  const indexDialogue = en
    ? "It is time to connect your energy with the energy of Nature. Connecting involves a ritual, a willingness. Follow these simple steps and give your body and mind five minutes of rest."
    : "Ha llegado el momento de conectar tu energía con la energía de la Naturaleza. Conectar conlleva un ritual, una disposición. Sigue estos sencillos pasos y regala a tu cuerpo y mente cinco minutos de descanso.";
  const practiceBenefits = en ? [
    { title: "Mindfulness", text: "Unhurried observation reveals shapes, textures and small changes that often go unnoticed." },
    { title: "Deep listening", text: "The sounds of the garden become more distinct. Their rhythms, silences and nuances reveal how they relate to one another." },
  ] : [
    { title: "Atención plena", text: "La observación pausada permite descubrir formas, texturas y pequeños cambios que suelen pasar inadvertidos." },
    { title: "Escucha profunda", text: "Los sonidos del Jardín se distinguen mejor. Sus ritmos, silencios y matices revelan cómo se relacionan entre sí." },
  ];
  return { records, groups, practiceBenefits, heading: (en ? "Room III · " : "Sala III · ") + t("TXT_3_b17de4dff672"), connect: t("TXT_3_74471ccd389d"), introduction: t("TXT_3_514ab0f6e29f"), indexDialogue, closing: t("TXT_3_ff711cf372d1"), completed: t("TXT_3_b991b344a871"), ui: {
    index: en ? "Index" : "Índice", returnIndex: en ? "Back to index" : "Volver al índice",
    scroll: en ? "Scroll to read more" : "Desliza para seguir leyendo", retry: en ? "Try again" : "Reintentar", saveError: en ? "We could not verify your progress. Try again before continuing." : "No pudimos verificar el guardado. Reintenta antes de continuar.",
    qr: en ? "Scan the QR code in the next room to continue." : "Escanea el QR de la siguiente sala para continuar.", selected: en ? "Selected" : "Seleccionado", selectIllustration: en ? "Explore illustration" : "Explorar ilustración", continue: en ? "Continue" : "Continuar",
    folio: en ? "Leaf" : "Hoja", of: en ? "of" : "de", nextFolio: en ? "Next" : "Siguiente", previousFolio: en ? "Previous" : "Anterior",
    available: en ? "Available" : "Disponible", current: en ? "Current page" : "Página actual", confirmed: en ? "Confirmed" : "Confirmada", locked: en ? "Previous page first" : "Primero la anterior",
  } };
}
// Historical exports remain available to dormant detail consumers; runtime resolves by locale.
export const station3Records = getStation3Content("es").records;
export const station3Lia = { intro: getStation3Content("es").introduction, locked: "Primero revisemos la página anterior.", lockedAlt: "Continúa por la página disponible.", continueLocked: "Aún falta recorrer el cuaderno.", adjusted: getStation3Content("es").closing, adjustedAlt: "", revisit: "Puedes volver a cualquier página del cuaderno." } as const;
export const station3Stamp = { label: "completado", accessibleLabel: "Cuaderno completado." } as const;
export const station3Continue = { label: "Continuar", accessibleLabel: "Escanear el QR hacia Sala IV." } as const;
