import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Locator } from "@playwright/test";
import type { World5RoundLedger } from "../../src/screens/World5Root/world5Quiz";

const fixturePath = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json";
const fixtureBytes = readFileSync(fixturePath);
const prior = JSON.parse(fixtureBytes.toString("utf8")).normalScans[3].after;
const active = ".gvo-prepared-tree[data-journey-active='true'] main.s5-quiz";

test("OBS05 V round locks the accepted wrong answer before another choice", async ({ browser, baseURL, request }, info) => {
  if (!baseURL) throw Error("Explicit compiled baseline required");
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, serviceWorkers: "block", reducedMotion: "no-preference" });
  await context.addInitScript((state) => {
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", "es");
    for (const [key, value] of [["gvo.journey.essential.v1", state.essential], ["gvo.progress.v1", state.progress], ["gvo.station4.ordering.v1", state.ordering]]) if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    if (state.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2", state.legacyPracticeRaw);
  }, prior);
  const page = await context.newPage(), errors: string[] = [], rows: Record<string, unknown>[] = [];
  const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const snapshot = () => page.evaluate(() => ({
    quizRaw: localStorage.getItem("gvo.station5.quiz.v1"),
    roundsRaw: localStorage.getItem("gvo.station5.quiz.v2"),
    ledger: JSON.parse(localStorage.getItem("gvo.station5.quiz.v2") ?? "null") as World5RoundLedger | null,
    facts: Object.fromEntries(["gvo.journey.essential.v1", "gvo.progress.v1", "gvo.station1.v1", "gvo.station2.v1", "gvo.station3.v1", "gvo.station3.practice.v2", "gvo.station4.v1", "gvo.station4.ordering.v1", "gvo.station4.explanation.v1"].map(key => [key, localStorage.getItem(key)])),
  }));
  const save = () => writeFileSync(info.outputPath("V-round-lock-journal.json"), JSON.stringify({ qualification: "Declared acquired I-IV prior-access fixture, empty legacy V quiz. Real wrong then optional real correct tap on same question only if still enabled. No progress writes after initialization, no force or runtime API. This baseline is not a fresh earned journey or physical-device validation.", fixture: { path: fixturePath, sha256: createHash("sha256").update(fixtureBytes).digest("hex"), selection: "normalScans[3].after" }, indexBefore, rows, errors }, null, 2));
  const tap = async (button: Locator) => {
    await button.scrollIntoViewIfNeeded();
    const hit = await button.evaluate(node => { const rect = node.getBoundingClientRect(); const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2); return { rect: rect.toJSON(), centerHits: !!target && (target === node || node.contains(target)) }; });
    rows.push({ phase: "before-native-emulated-touch", ...hit }); save();
    expect(hit.centerHits).toBe(true); expect(hit.rect.width).toBeGreaterThanOrEqual(44); expect(hit.rect.height).toBeGreaterThanOrEqual(44);
    await button.tap();
  };
  try {
    await page.goto("/estacion/5");
    await expect(page.locator(active)).toHaveAttribute("data-station5-area", "plantas");
    await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
    const wrong = page.locator(`${active} [data-answer='disagreement']`), right = page.locator(`${active} [data-answer='agreement']`);
    await expect(wrong).toBeEnabled(); await expect(right).toBeEnabled();
    const initial = await snapshot(); rows.push({ phase: "before-answer", snapshot: initial }); save();
    await tap(wrong);
    await expect(page.locator(active)).toHaveAttribute("data-station5-state", "resolved");
    const wrongState = await snapshot(), wrongQuiz = JSON.parse(wrongState.quizRaw ?? "null");
    const currentWrongRound = wrongState.ledger?.rounds.at(-1);
    const measurementModel = wrongState.ledger ? "v2-current-round" : wrongQuiz ? "legacy-v1-baseline-only" : "missing";
    const wrongAccepted = wrongState.ledger
      ? currentWrongRound?.outcomes.plantas?.kind === "incorrect"
      : !!wrongQuiz?.answeredQuestions?.includes("plantas") && !wrongQuiz.correctAnswers?.includes("plantas");
    const buttonsAfterWrong = { agreementDisabled: await right.isDisabled(), disagreementDisabled: await wrong.isDisabled() };
    rows.push({ phase: "after-wrong-accepted", measurementModel, wrongAccepted, buttonsAfterWrong, snapshot: wrongState }); save();
    await page.screenshot({ path: info.outputPath("V-round-after-wrong-viewport.png"), fullPage: false, scale: "css" });
    const rightAttempted = !buttonsAfterWrong.agreementDisabled;
    if (rightAttempted) await tap(right);
    const final = await snapshot(), finalQuiz = JSON.parse(final.quizRaw ?? "null");
    const currentFinalRound = final.ledger?.rounds.at(-1);
    const correctAnswersCount = final.ledger ? Object.values(currentFinalRound!.outcomes).filter(outcome => outcome.kind === "correct").length : finalQuiz?.correctAnswers?.length ?? null;
    const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
    rows.push({ phase: "after-conditional-real-correct-attempt", rightAttempted, buttonsAfterWrong, snapshot: final, indexAfter, measurementModel, correctAnswersCount }); save();
    await page.screenshot({ path: info.outputPath("V-round-after-correct-attempt-viewport.png"), fullPage: false, scale: "css" });
    expect(indexAfter).toBe(indexBefore); expect(errors).toEqual([]);
    expect(wrongAccepted).toBe(true); expect(final.facts).toEqual(initial.facts);
    // Current v2 contract: after accepting wrong this question is terminal in its round.
    // The v1 projection above exists solely to retain the old compiled RED baseline measurement.
    expect(buttonsAfterWrong).toEqual({ agreementDisabled: true, disagreementDisabled: true });
    expect(correctAnswersCount).toBe(0);
    expect(final.ledger).not.toBeNull();
    expect(currentFinalRound?.outcomes.plantas).toMatchObject({ kind: "incorrect", choice: "disagreement" });
    expect(currentFinalRound?.status).toBe("active");
    expect(final.roundsRaw).toBe(wrongState.roundsRaw);
    expect(final.quizRaw).toBe(initial.quizRaw);
  } finally {
    save(); await info.attach("OBS05-V-round-lock-evidence", { path: info.outputPath("V-round-lock-journal.json"), contentType: "application/json" }); await context.close();
  }
});
