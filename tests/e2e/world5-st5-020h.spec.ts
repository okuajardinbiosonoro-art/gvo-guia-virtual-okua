import { expect, test } from "@playwright/test";
import { openQuiz, readQuiz, chooseYes } from "./support/world5QuizFixture";
test("Sala V: premio visible también con 0/4 y preguntas omitidas revisables", async ({
  page,
}) => {
  await openQuiz(page);
  await page
    .getByRole("button", { name: "Continuar sin participar", exact: true })
    .click();
  expect(await readQuiz(page)).toMatchObject({
    correctAnswers: [],
    skippedQuestions: ["plantas", "sistema", "espacio", "visitante"],
  });
  await expect(
    page.getByText("Reclama tu premio sorpresa en la taquilla.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("[data-quiz-score]")).toHaveAttribute(
    "data-quiz-score",
    "0",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Ir al Mirador", exact: true }),
  ).toBeVisible();
  await page.locator('[data-station5-area="plantas"]').click();
  await chooseYes(page);
  expect(await readQuiz(page)).toMatchObject({
    correctAnswers: ["plantas"],
    skippedQuestions: ["sistema", "espacio", "visitante"],
  });
});
