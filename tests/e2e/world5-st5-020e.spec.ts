import { expect, test } from "@playwright/test";
import {
  openQuiz,
  readQuiz,
  chooseYes,
  quizKey,
} from "./support/world5QuizFixture";
test("Sala V: recarga/revisita no suman y áreas históricas no son aciertos", async ({
  page,
}) => {
  await openQuiz(page);
  await page.evaluate(() =>
    localStorage.setItem(
      "gvo.station5.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedAreas: ["plantas", "sistema", "espacio", "visitante"],
      }),
    ),
  );
  await page.reload();
  expect((await readQuiz(page)).correctAnswers).toEqual([]);
  await page.locator('[data-station5-area="visitante"]').click();
  await chooseYes(page);
  await page.reload();
  expect((await readQuiz(page)).correctAnswers).toEqual(["visitante"]);
  await expect(page.getByRole("button", { name: /^Sí ·/ })).toHaveCount(0);
  const raw = await page.evaluate((key) => localStorage.getItem(key), quizKey);
  await page
    .getByRole("button", { name: "Volver a las preguntas", exact: true })
    .click();
  await page.locator('[data-station5-area="visitante"]').click();
  expect(await page.evaluate((key) => localStorage.getItem(key), quizKey)).toBe(
    raw,
  );
});
