import { describe, expect, it } from "vitest";
import type { ProgressStorage } from "../../domain/progress/progress.types";
import {
  readWorld5Quiz,
  updateWorld5Quiz,
  WORLD5_QUIZ_AREA_ORDER,
  WORLD5_QUIZ_STORAGE_KEY,
} from "./world5Quiz";
function memory(): ProgressStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}
describe("world5Quiz v1 — preserved historical format (not OBS05 prize eligibility)", () => {
  it("awards once per explicit correct answer and caps at four across rereads", () => {
    const storage = memory();
    for (const area of WORLD5_QUIZ_AREA_ORDER) {
      expect(
        updateWorld5Quiz({ kind: "correct", area }, storage),
      ).toMatchObject({ ok: true, awarded: true });
      expect(
        updateWorld5Quiz({ kind: "correct", area }, storage),
      ).toMatchObject({ ok: true, awarded: false });
    }
    expect(readWorld5Quiz(storage).quiz.correctAnswers).toHaveLength(4);
  });
  it("skip grants zero and a later correct answer removes the omission", () => {
    const storage = memory();
    updateWorld5Quiz({ kind: "skip_remaining" }, storage);
    expect(readWorld5Quiz(storage).quiz.correctAnswers).toEqual([]);
    expect(readWorld5Quiz(storage).quiz.skippedQuestions).toHaveLength(4);
    updateWorld5Quiz({ kind: "correct", area: "espacio" }, storage);
    expect(readWorld5Quiz(storage).quiz).toMatchObject({
      correctAnswers: ["espacio"],
      skippedQuestions: ["plantas", "sistema", "visitante"],
    });
    updateWorld5Quiz({ kind: "skip_remaining" }, storage);
    expect(readWorld5Quiz(storage).quiz.correctAnswers).toEqual(["espacio"]);
  });
  it("persists incorrect responses separately from correct and omitted questions", () => {
    const storage = memory();
    expect(
      updateWorld5Quiz({ kind: "incorrect", area: "plantas" }, storage),
    ).toMatchObject({ ok: true, awarded: false });
    expect(readWorld5Quiz(storage).quiz).toMatchObject({
      answeredQuestions: ["plantas"],
      correctAnswers: [],
      skippedQuestions: [],
    });
    updateWorld5Quiz({ kind: "skip", area: "plantas" }, storage);
    expect(readWorld5Quiz(storage).quiz).toMatchObject({
      answeredQuestions: ["plantas"],
      correctAnswers: [],
      skippedQuestions: ["plantas"],
    });
    updateWorld5Quiz({ kind: "correct", area: "plantas" }, storage);
    expect(readWorld5Quiz(storage).quiz).toMatchObject({
      answeredQuestions: ["plantas"],
      correctAnswers: ["plantas"],
      skippedQuestions: [],
    });
  });
  it.each([
    '{"schemaVersion":9}',
    '{"schemaVersion":1,"correctAnswers":["espacio","espacio"],"skippedQuestions":[]}',
    '{"schemaVersion":1,"correctAnswers":["espacio"],"skippedQuestions":["espacio"]}',
    "{bad",
  ])("preserves invalid payload %s without awarding", (raw) => {
    const storage = memory();
    storage.setItem(WORLD5_QUIZ_STORAGE_KEY, raw);
    expect(
      updateWorld5Quiz({ kind: "correct", area: "plantas" }, storage).ok,
    ).toBe(false);
    expect(storage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe(raw);
    expect(readWorld5Quiz(storage).quiz.correctAnswers).toHaveLength(0);
  });
  it("does not claim a write when storage silently drops it", () => {
    const storage = memory();
    storage.setItem = () => {};
    expect(
      updateWorld5Quiz({ kind: "correct", area: "plantas" }, storage).ok,
    ).toBe(false);
  });
});
