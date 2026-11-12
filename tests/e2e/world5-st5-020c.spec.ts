import { expect, test } from "@playwright/test";
import { openQuiz, readQuiz, chooseYes } from "./support/world5QuizFixture";
test("Sala V: Sistema de escucha, error educativo, reintento y omisión honestos", async ({
  page,
}) => {
  await openQuiz(page, "sistema");
  await page.getByRole("button", { name: /^No ·/ }).click();
  await expect(page.locator("[data-quiz-feedback]")).toHaveAttribute(
    "data-quiz-feedback",
    "wrong",
  );
  expect((await readQuiz(page)).correctAnswers).toEqual([]);
  expect((await readQuiz(page)).answeredQuestions).toEqual(["sistema"]);
  await page.reload();
  await expect(page.locator("[data-quiz-feedback]")).toHaveAttribute(
    "data-quiz-feedback",
    "wrong",
  );
  await page.getByRole("button", { name: "Siguiente", exact: true }).click();
  expect((await readQuiz(page)).skippedQuestions).toEqual(["sistema"]);
  await page.locator('[data-station5-area="sistema"]').click();
  await chooseYes(page);
  expect(await readQuiz(page)).toMatchObject({
    correctAnswers: ["sistema"],
    skippedQuestions: [],
  });
});
