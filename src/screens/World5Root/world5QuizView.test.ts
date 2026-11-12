import { describe, expect, it } from "vitest";
import { mutateWorld5Rounds, readWorld5Rounds, WORLD5_QUIZ_AREA_ORDER } from "./world5Quiz";
import { resolveWorld5QuizView } from "./world5QuizView";
import type { ProgressStorage } from "../../domain/progress/progress.types";

function fixture() {
  const values = new Map<string, string>();
  const storage: ProgressStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: (key) => { values.delete(key); } };
  let event = 0;
  const submit = (extra: { kind: "answer"; area: typeof WORLD5_QUIZ_AREA_ORDER[number]; side: "disagreement" } | { kind: "finish_round" | "begin_retry" }) => {
    const read = readWorld5Rounds(storage);
    const result = mutateWorld5Rounds({ ...extra, actionId: `view-fixture-${++event}`, expectedRaw: read.raw, roundId: read.round?.roundId ?? null }, { canCommit: () => true, storage });
    expect(result.ok).toBe(true);
    return readWorld5Rounds(storage);
  };
  return { read: () => readWorld5Rounds(storage), submit };
}
describe("OBS05 local round view shared by UI and resource preparation", () => {
  it("starts an empty new round at Plantas despite an acquired essential result and future route", () => {
    const f = fixture();
    expect(resolveWorld5QuizView({ pathname: "/estacion/5/visitante", read: f.read(), readOnly: false, pendingStepId: "resultado", canUseStep: () => true })).toBe("plantas");
  });
  it("keeps the fourth outcome on Visitante until explicit finish and essential confirmation", () => {
    const f = fixture();
    for (const area of WORLD5_QUIZ_AREA_ORDER) f.submit({ kind: "answer", area, side: "disagreement" });
    const props = { pathname: "/estacion/5", readOnly: false, pendingStepId: "visitante", canUseStep: (id: string) => id !== "resultado" };
    expect(resolveWorld5QuizView({ ...props, read: f.read() })).toBe("visitante");
    f.submit({ kind: "finish_round" });
    expect(resolveWorld5QuizView({ ...props, read: f.read() })).toBe("visitante");
    expect(resolveWorld5QuizView({ ...props, read: f.read(), pendingStepId: "resultado", canUseStep: () => true })).toBe("resultado");
  });
  it("opens the empty second round without resetting essential and rejects future navigation", () => {
    const f = fixture();
    for (const area of WORLD5_QUIZ_AREA_ORDER) f.submit({ kind: "answer", area, side: "disagreement" });
    f.submit({ kind: "finish_round" }); f.submit({ kind: "begin_retry" });
    expect(resolveWorld5QuizView({ pathname: "/estacion/5/sistema", read: f.read(), readOnly: false, pendingStepId: "resultado", canUseStep: () => true })).toBe("plantas");
    f.submit({ kind: "answer", area: "plantas", side: "disagreement" });
    expect(resolveWorld5QuizView({ pathname: "/estacion/5", read: f.read(), readOnly: false, pendingStepId: "resultado", canUseStep: () => true })).toBe("sistema");
  });
  it("retains validated readonly access independently of the normal round cursor", () => {
    const f = fixture();
    expect(resolveWorld5QuizView({ pathname: "/estacion/5/espacio", read: f.read(), readOnly: true, pendingStepId: null, canUseStep: () => true })).toBe("espacio");
    expect(resolveWorld5QuizView({ pathname: "/estacion/5", read: f.read(), readOnly: true, pendingStepId: null, canUseStep: () => true })).toBe("resultado");
  });
  it("resolves an older URL to the live cursor after an answer has been confirmed", () => {
    const f = fixture();
    f.submit({ kind: "answer", area: "plantas", side: "disagreement" });
    const props = { pathname: "/estacion/5/plantas", read: f.read(), readOnly: false, canUseStep: () => true };
    expect(resolveWorld5QuizView({ ...props, pendingStepId: "sistema" })).toBe("sistema");
    expect(resolveWorld5QuizView({ ...props, pendingStepId: "plantas" })).toBe("plantas");
  });
});
