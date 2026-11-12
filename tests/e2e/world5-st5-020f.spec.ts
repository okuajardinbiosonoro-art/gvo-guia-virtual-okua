import { expect, test } from "@playwright/test";
import {
  openQuiz,
  readQuiz,
  chooseYes,
  quizKey,
} from "./support/world5QuizFixture";
test("Sala V: conserva la entrada animada de escena sin bloquear una respuesta válida", async ({
  page,
}) => {
  await openQuiz(page);
  await page.locator('[data-station5-area="plantas"]').click();
  const timing = await page
    .locator('[data-station5-scene="plantas"]')
    .evaluate((element) => ({
      name: getComputedStyle(element).animationName,
      duration: getComputedStyle(element).animationDuration,
    }));
  expect(timing).toEqual({ name: "s5-sub-in", duration: "0.76s" });
  await expect(page.locator("main")).toHaveAttribute(
    "data-motion-lock",
    "false",
  );
  await chooseYes(page);
  expect((await readQuiz(page)).correctAnswers).toEqual(["plantas"]);
});
test("Sala V: fallo de almacenamiento permite reintentar sin falso punto", async ({
  page,
}) => {
  await openQuiz(page, "espacio");
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    (
      window as unknown as { restoreQuizStorage: () => void }
    ).restoreQuizStorage = () => {
      Storage.prototype.setItem = original;
    };
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new Error("Synthetic quiz write failure");
      original.call(this, k, v);
    };
  }, quizKey);
  await chooseYes(page);
  expect((await readQuiz(page)).correctAnswers).toEqual([]);
  await expect(page.getByRole("status")).toContainText(
    "No fue posible guardar tu progreso.",
  );
  await page.evaluate(() =>
    (
      window as unknown as { restoreQuizStorage: () => void }
    ).restoreQuizStorage(),
  );
  await chooseYes(page);
  expect((await readQuiz(page)).correctAnswers).toEqual(["espacio"]);
});
test("Sala V: movimiento reducido mantiene respuestas y Lía contextual única", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openQuiz(page, "visitante");
  await expect(page.locator("[data-station5-lia]")).toHaveCount(1);
  await expect(page.locator("[data-lia-purpose]")).toHaveAttribute(
    "data-lia-purpose",
    "present-question",
  );
  await chooseYes(page);
  await expect(page.locator("[data-lia-purpose]")).toHaveAttribute(
    "data-lia-purpose",
    "recognize-answer",
  );
  expect((await readQuiz(page)).correctAnswers).toEqual(["visitante"]);
});

test("Sala V: recuperación local de respuestas inválidas conserva progreso global", async ({
  page,
}) => {
  await openQuiz(page);
  const global = await page.evaluate(() =>
    localStorage.getItem("gvo.progress.v1"),
  );
  await page.evaluate(
    (key) => localStorage.setItem(key, '{"schemaVersion":99}'),
    quizKey,
  );
  await page.reload();
  await page
    .getByRole("button", { name: "Restablecer solo la trivia", exact: true })
    .click();
  expect(await page.evaluate((key) => localStorage.getItem(key), quizKey)).toBe(
    '{"schemaVersion":99}',
  );
  await page
    .getByRole("button", {
      name: "Borrar respuestas de la trivia",
      exact: true,
    })
    .click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), quizKey),
  ).toBeNull();
  expect(
    await page.evaluate(() => localStorage.getItem("gvo.progress.v1")),
  ).toBe(global);
  await page
    .getByRole("button", { name: "Continuar sin participar", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Ir al Mirador", exact: true }),
  ).toBeVisible();
});
