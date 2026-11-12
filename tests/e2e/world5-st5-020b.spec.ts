import { expect, test } from "@playwright/test";
import { openQuiz, areas } from "./support/world5QuizFixture";
for (const [width, height] of [
  [280, 568],
  [320, 568],
  [360, 560],
  [390, 844],
  [844, 390],
  [568, 280],
  [1440, 900],
  [1920, 1080],
]) {
  test(`Sala V: contenido y dianas accesibles en ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await openQuiz(page);
    for (const area of areas) {
      await page.locator(`[data-station5-area="${area}"]`).click();
      const scene = page.locator(`[data-station5-scene="${area}"]`);
      for (const answer of ["yes", "no"]) {
        const target =
          answer === "no"
            ? page.locator(`[data-quiz-answer="no"]`)
            : scene.locator(`[data-quiz-answer="yes"]`);
        await expect(target).toBeVisible();
        const rect = await target.boundingBox();
        const stage = await page.locator(".s5-stage").boundingBox();
        expect(rect!.width).toBeGreaterThanOrEqual(44);
        expect(rect!.height).toBeGreaterThanOrEqual(44);
        expect(rect!.x + rect!.width / 2).toBeGreaterThan(stage!.x);
        expect(rect!.x + rect!.width / 2).toBeLessThan(stage!.x + stage!.width);
        expect(rect!.y + rect!.height / 2).toBeGreaterThan(stage!.y);
        expect(rect!.y + rect!.height / 2).toBeLessThan(
          stage!.y + stage!.height,
        );
      }
      await page
        .getByRole("button", { name: "Omitir esta pregunta", exact: true })
        .click();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("button", { name: "Ir al Mirador", exact: true }),
    ).toBeVisible();
  });
}
