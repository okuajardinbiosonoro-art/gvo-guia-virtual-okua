import { expect, test } from "@playwright/test";
import { openQuiz, finishQuiz, readQuiz } from "./support/world5QuizFixture";
test("Sala V: cuatro preguntas, máximo cuatro puntos y cierre manual", async ({
  page,
}) => {
  await openQuiz(page);
  await finishQuiz(page);
  expect((await readQuiz(page)).correctAnswers).toHaveLength(4);
  await expect(
    page.getByText("Has finalizado tu recorrido", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Reclama tu premio sorpresa en la taquilla.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/estacion\/5$/);
  await page
    .getByRole("button", { name: "Ir al Mirador", exact: true })
    .click();
  await expect(page).toHaveURL(/\/(transition\/world-5-to-final|final)$/);
});
