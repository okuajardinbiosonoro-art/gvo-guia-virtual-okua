import { expect, test } from "@playwright/test";
import { openQuiz, readQuiz, chooseYes } from "./support/world5QuizFixture";
import { isLocalTestRequest } from "./support/local-network";
// The October integration replaces historical exploration with explicit answers.
// Approved raster/hash and map-source geometry contracts remain covered by unit tests.
test("Sala V: cuatro preguntas opcionales, sin acierto por explorar ni red externa", async ({
  page,
}) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on("request", (request) => {
    if (!isLocalTestRequest(request.url())) external.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  await openQuiz(page);
  await expect(page.locator("[data-station5-area]")).toHaveCount(4);
  await expect(page.locator('[data-protected="true"]')).toHaveCount(0);
  await page.locator('[data-station5-area="plantas"]').click();
  await expect(
    page.getByText(
      "¿Las plantas son seres vivos capaces de relacionarse con su entorno y emitir señales?",
    ),
  ).toBeVisible();
  expect((await readQuiz(page)).correctAnswers).toEqual([]);
  await chooseYes(page);
  expect((await readQuiz(page)).correctAnswers).toEqual(["plantas"]);
  await expect(page.locator("[data-quiz-score]")).toHaveAttribute(
    "data-quiz-score",
    "1",
  );
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
