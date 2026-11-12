import {
  station5Areas,
  station5Questions,
  type Station5AreaId,
} from "./station5Content";
export type World5Locale = "es" | "en";
const answerPrompt = "Choose an answer.";
const englishQuestions: typeof station5Questions = {
  plantas: {
    ...station5Questions.plantas,
    title: "Plants · Question 1 of 4",
    question:
      "Are they living beings able to relate to their environment and emit signals?",
    instruction: answerPrompt,
    agreement: "I agree",
    disagreement: "I disagree",
    feedback: "Correct!",
    point: "Vitality recognised in the plant. You have 1 point",
  },
  sistema: {
    ...station5Questions.sistema,
    title: "Listening system · Question 2 of 4",
    question:
      "Does the system transform the plant’s living pulse into live musical sounds?",
    instruction: answerPrompt,
    agreement: "I agree",
    disagreement: "I disagree",
    feedback: "Correct!",
    point: "Mediation recognised. You have 1 point.",
  },
  espacio: {
    ...station5Questions.espacio,
    title: "Space · Question 3 of 4",
    question:
      "Is OKÚA an interactive installation that brings together art, science and technology to connect visitors with nature?",
    instruction: answerPrompt,
    agreement: "I agree",
    disagreement: "I disagree",
    feedback:
      "Correct! OKÚA turns biosonification into an interactive artistic experience.",
    point: "Journey recognised. You have 1 point.",
  },
  visitante: {
    ...station5Questions.visitante,
    title: "Visitor · Question 4 of 4",
    question: "Are you also part of the artwork?",
    instruction: answerPrompt,
    agreement: "I agree",
    disagreement: "I disagree",
    feedback:
      "Correct! The artwork is completed when someone walks through it, listens to it and understands it.",
    point: "Presence recognised. You have 1 point.",
  },
};
export function getWorld5Question(area: Station5AreaId, locale: World5Locale) {
  return (locale === "en" ? englishQuestions : station5Questions)[area];
}
export function getWorld5AreaTitle(area: Station5AreaId, locale: World5Locale) {
  return locale === "es"
    ? station5Areas.find((item) => item.id === area)!.title
    : {
        plantas: "Plants",
        sistema: "Listening system",
        espacio: "Space",
        visitante: "Visitor",
      }[area];
}
// OBS05 functional conditional cut: the human now requires four correct in one
// round for the prize. Archived writer wording remains untouched in its source.
export const world5QuizCopy = {
  es: {
    room: "Sala V",
    title: "OKÚA, arte interactivo",
    introduction: "Coloca a prueba tu aprendizaje en nuestro Jardín.",
    prizeCondition:
      "El premio sorpresa requiere cuatro aciertos en una misma ronda.",
    guidance:
      "Responde las preguntas que encontrarás por cada dimensión de la obra.",
    next: "Siguiente",
    pass: "Pasar pregunta",
    wrong:
      "Esta respuesta no es correcta. Puedes continuar con la siguiente pregunta.",
    skipped: "Pregunta pasada sin sumar un punto.",
    credited: "Punto ya obtenido",
    result: "Resultado",
    prize: "Reclama tu premio sorpresa en la taquilla.",
    readonlyPrize: "Tu registro conserva una ronda de cuatro aciertos.",
    noPrize: "Este resultado no reúne los cuatro aciertos necesarios para el premio.",
    round: (number: number) => `Ronda ${number} de 4`,
    retryRound: "Reintentar cuestionario completo",
    exhausted: "Has completado las cuatro rondas disponibles.",
    legacyHistory: (score: number) => `Registro anterior: ${score} ${score === 1 ? "acierto" : "aciertos"}. No acredita una ronda de este cuestionario.`,
    legacyOutcome: (score: number) => `Consulta del registro anterior: ${score} ${score === 1 ? "acierto" : "aciertos"}.`,
    legacyNoPrize: "El registro anterior no acredita cuatro aciertos en una misma ronda.",
    noRound: "No hay una ronda registrada para consultar.",
    close: "Ir al Mirador",
    error: "No fue posible verificar el guardado. Tu avance permanece aquí.",
    retry: "Reintentar guardado",
    recovery:
      "No se puede leer el registro de rondas. Puedes reintentar o recuperar sólo este registro.",
    reset: "Recuperar registro de trivia",
    confirmReset: "Confirmar recuperación del registro",
    cancel: "Cancelar",
    readonly: "Consulta del recorrido. Tus respuestas y puntos se conservan.",
    assets:
      "No fue posible cargar las alternativas. Reintenta la preparación de la sala.",
    review: "Dimensiones de la obra",
    outcome: (score: number) =>
      `Has finalizado esta ronda. Tienes ${score} de 4 aciertos.`,
  },
  en: {
    room: "Room V",
    title: "OKÚA, interactive art",
    introduction: "Put your learning in our Garden to the test.",
    prizeCondition:
      "The surprise prize requires four correct answers in a single round.",
    guidance:
      "Answer the questions you will find in each dimension of the artwork.",
    next: "Next",
    pass: "Pass question",
    wrong: "This answer is incorrect. You can continue to the next question.",
    skipped: "Question passed without adding a point.",
    credited: "Point already earned",
    result: "Result",
    prize: "Claim your surprise prize at the ticket office.",
    readonlyPrize: "Your record includes a round with four correct answers.",
    noPrize: "This result does not meet the four correct answers required for the prize.",
    round: (number: number) => `Round ${number} of 4`,
    retryRound: "Retry the whole quiz",
    exhausted: "You have completed all four available rounds.",
    legacyHistory: (score: number) => `Previous record: ${score} correct ${score === 1 ? "answer" : "answers"}. It does not establish a round of this quiz.`,
    legacyOutcome: (score: number) => `Previous record review: ${score} correct ${score === 1 ? "answer" : "answers"}.`,
    legacyNoPrize: "The previous record does not establish four correct answers in a single round.",
    noRound: "There is no recorded round to review.",
    close: "Go to the Lookout",
    error: "The save could not be verified. Your progress remains here.",
    retry: "Retry saving",
    recovery:
      "The round record cannot be read. You can retry or recover only this record.",
    reset: "Recover quiz record",
    confirmReset: "Confirm record recovery",
    cancel: "Cancel",
    readonly: "Journey review. Your answers and points are preserved.",
    assets: "The alternatives could not be loaded. Retry preparing the room.",
    review: "Dimensions of the artwork",
    outcome: (score: number) =>
      `You have completed this round. You have ${score} of 4 correct answers.`,
  },
};
/** Functional conditional cut only: omit the sentence awarding a point already held. */
export function alreadyCreditedPoint(point: string, locale: World5Locale) {
  return point.split(
    locale === "es" ? " Tienes 1 punto" : " You have 1 point",
  )[0];
}
