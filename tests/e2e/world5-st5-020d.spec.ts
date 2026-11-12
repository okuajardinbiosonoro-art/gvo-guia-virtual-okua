import { expect, test } from "@playwright/test";
import { openQuiz, readQuiz, areas } from "./support/world5QuizFixture";
for (const area of areas) {
  test(`Sala V: ${area}, zonas sí/no deliberadas y fondo neutral`, async ({
    page,
  }) => {
    await openQuiz(page, area);
    const stage = page.locator(".s5-stage");
    const box = (await stage.boundingBox())!;
    await stage.click({ position: { x: box.width - 6, y: 6 } });
    expect((await readQuiz(page)).correctAnswers).toEqual([]);
    await expect(page.locator("[data-quiz-feedback]")).toHaveAttribute(
      "data-quiz-feedback",
      "none",
    );
    const scene = page.locator(`[data-station5-scene="${area}"]`);
    await page.locator('[data-quiz-answer="no"]').click();
    await expect(page.locator("[data-quiz-feedback]")).toHaveAttribute(
      "data-quiz-feedback",
      "wrong",
    );
    expect((await readQuiz(page)).correctAnswers).toEqual([]);
    await scene.locator('[data-quiz-answer="yes"]').click();
    expect((await readQuiz(page)).correctAnswers).toEqual([area]);
  });
}
