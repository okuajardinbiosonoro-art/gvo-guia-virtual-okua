import { station4Nodes } from "./station4Content";
import { WORLD4_ORDERING_TARGET, type World4OrderingId } from "../../domain/checkpoints/world4OrderingCheckpoint";

export type World4OrderingLocale = "es" | "en";
const english: Record<World4OrderingId, { title: string; text: string }> = {
  planta: {
    title: "Plant",
    text: "Everything begins with the plant. It provides a signal that can be converted into sound or a light impulse.",
  },
  bionosificador: {
    title: "Biosonifier",
    text: "Captures and prepares the plant's signal so the system can read it.",
  },
  esp32: {
    title: "Microcontroller",
    text: "Transforms the conditioned signal into digital data.",
  },
  router: {
    title: "Router",
    text: "Organizes local communication so the data reaches the central system.",
  },
  sistema_central: {
    title: "Central system",
    text: "Reinterprets the data to create a pleasant, relaxing sound experience.",
  },
  sonido: {
    title: "Sound",
    text: "It results from mediation between the plant's living signal and the sound design we can hear.",
  },
};
export function getWorld4OrderingNodes(locale: World4OrderingLocale) {
  return WORLD4_ORDERING_TARGET.map((id, index) => {
    const original = station4Nodes.find((node) => node.id === id)!;
    const order = index + 1;
    const node = locale === "en" ? english[id] : {
      title: id === "esp32" ? "Microcontrolador" : original.title,
      text: id === "sistema_central" ? "Reinterpreta los datos para conseguir una experiencia sonora placentera y relajante." : original.text,
    };
    const step = locale === "en" ? `Step ${order} of ${WORLD4_ORDERING_TARGET.length}` : `Paso ${order} de ${WORLD4_ORDERING_TARGET.length}`;
    return { ...original, id, ...node, order, accessibleLabel: `${step}. ${node.title}.` };
  });
}
export const world4OrderingCopy = {
  es: {
    title: "Sala IV · Sistema Biosonoro",
    invitation: "¡Ahora un juego! Memoriza cómo se conecta el sistema.",
    introduction: "Ordena los elementos en la mesa. Toca una pieza y después otra para intercambiarlas.",
    swapHeading: "Cómo intercambiar dos piezas",
    swapSteps: [
      "Toca la pieza que quieres mover. Quedará resaltada.",
      "Toca otra pieza. Las dos cambiarán de lugar.",
    ],
    start: "Comenzar",
    help: "Ayúdame a ordenar",
    pause: "Pausar",
    resume: "Retomar",
    next: "Siguiente",
    close: "Cerrar",
    review: "Repasar los seis pasos",
    position: "Posición",
    selected: "Seleccionada",
    retry: "Reintentar guardado",
    reset: "Restablecer sólo este juego",
    confirmReset: "Confirmar reinicio de este juego",
    saveError:
      "No pudimos verificar el guardado. Tu acción se conserva aquí; reintenta para continuar.",
    recoverError:
      "No pudimos recuperar este juego. Los datos originales se conservan.",
    assetsPending: "Preparando las seis piezas de la mesa…",
    assetsError:
      "Falta cargar una imagen de la mesa. El juego empezará cuando estén listas las seis piezas.",
    ready:
      "Dispones de 90 segundos activos. Puedes pausar o pedir ayuda cuando quieras.",
    playing: "Toca la pieza que quieres mover.",
    awaitingSwap: "Toca otra pieza para intercambiarla con la seleccionada.",
    paused: "Juego en pausa. El tiempo no avanza.",
    assisting: "Vamos a colocar los elementos y recorrer la cadena juntos.",
    assisted: "El orden está preparado. Repasemos juntos cada paso.",
    solved: "¡Felicidades!",
    conclusion: "Como puedes ver, OKÚA es un sistema complejo que nos permite descubrir el pulso oculto en la sinfonía de la vida.",
    complete: "Has llegado al final de esta sala.",
    readonly: "Puedes explorar los seis elementos del sistema.",
    timer: "Tiempo disponible",
    swapped: "Piezas intercambiadas.",
    reviewCount: "Repaso",
  },
  en: {
    title: "Room IV · Biosonic System",
    invitation: "Now a game! Remember how the system connects.",
    introduction: "Arrange the pieces on the table. Select one piece and then another to swap them.",
    swapHeading: "How to swap two pieces",
    swapSteps: [
      "Select the piece you want to move. It will be highlighted.",
      "Select another piece. The two pieces will swap places.",
    ],
    start: "Start",
    help: "Help me arrange them",
    pause: "Pause",
    resume: "Resume",
    next: "Next",
    close: "Close",
    review: "Review the six steps",
    position: "Position",
    selected: "Selected",
    retry: "Retry save",
    reset: "Reset only this game",
    confirmReset: "Confirm reset of this game",
    saveError:
      "We could not verify the save. Your action is kept here; retry to continue.",
    recoverError:
      "We could not recover this game. The original data is preserved.",
    assetsPending: "Preparing the six table pieces…",
    assetsError:
      "A table image has not loaded. The game will start when all six pieces are ready.",
    ready:
      "You have 90 active seconds. You may pause or ask for help at any time.",
    playing: "Select the piece you want to move.",
    awaitingSwap: "Select another piece to swap it with the highlighted one.",
    paused: "Game paused. Time is not running.",
    assisting: "Let's arrange the elements and follow the chain together.",
    assisted: "The order is ready. Let's review each step together.",
    solved: "Congratulations!",
    conclusion: "As you can see, OKÚA is a complex system that lets us discover the hidden pulse in the symphony of life.",
    complete: "You have reached the end of this room.",
    readonly: "You can explore the six system elements.",
    timer: "Time remaining",
    swapped: "Pieces swapped.",
    reviewCount: "Review",
  },
} as const;

const objectNames = {
  planta: "plant",
  bionosificador: "bionosifier",
  esp32: "esp32",
  router: "router",
  sistema_central: "central_system",
  sonido: "sound",
} as const;
export const world4OrderingObjectAssets = Object.fromEntries(
  Object.entries(objectNames).map(([id, name]) => [
    id,
    `/assets/gvo/stations/world-4/system-table/runtime/objects/world4_node_${name}_v03.webp`,
  ]),
) as Record<World4OrderingId, string>;
