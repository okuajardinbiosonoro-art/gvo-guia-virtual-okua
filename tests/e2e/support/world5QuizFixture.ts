import { expect, type Page } from "@playwright/test";
import { installWorldFiveAccessFixture } from "./journeyFixtures";
export const quizKey = "gvo.station5.quiz.v1";
export const areas = ["plantas", "sistema", "espacio", "visitante"] as const;
export async function openQuiz(page: Page, area?: (typeof areas)[number]) {
  await installWorldFiveAccessFixture(page);
  await page.goto(area ? `/estacion/5/${area}` : "/estacion/5", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator(".s5-screen")).toBeVisible();
}
export async function readQuiz(page: Page) {
  return page.evaluate(
    (key) =>
      JSON.parse(
        localStorage.getItem(key) ||
          '{"correctAnswers":[],"skippedQuestions":[]}',
      ),
    quizKey,
  ) as Promise<{
    correctAnswers: string[];
    answeredQuestions: string[];
    skippedQuestions: string[];
  }>;
}
export async function chooseYes(page: Page) {
  await page.getByRole("button", { name: /^Sí ·/ }).click();
}
export async function finishQuiz(page: Page) {
  for (const area of areas) {
    await page.locator(`[data-station5-area="${area}"]`).click();
    await chooseYes(page);
    await page
      .getByRole("button", { name: "Volver a las preguntas", exact: true })
      .click();
  }
}
