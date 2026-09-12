import { expect, test } from "@playwright/test";
import { liaPreviewCopy as copy } from "../../src/content/liaPreviewCopy";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3, 4, 5],
        updatedAt: "2026-09-11T00:00:00.000Z",
      }),
    );
  });
});

test("approved composition, final copy and initial viewport", async ({
  page,
}) => {
  await page.goto("/final");
  await page.getByRole("link", { name: copy.entry }).click();
  await expect(page.locator("[data-copy-status=FINAL_COPY]")).toBeVisible();
  await expect(page.locator("#lia-title")).toBeInViewport();
  await expect(page.locator(".lia-preview__avatar")).toBeInViewport();
  await expect(page.getByLabel(copy.prompt, { exact: true })).toBeFocused();
  const result = await page.locator(".lia-preview").evaluate((node) => ({
    background: getComputedStyle(node).backgroundImage,
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  expect(result.background).toContain("final_valley_depth_");
  expect(result.overflow).toBe(false);
});

test("local target depth changes meaning and never calls the conversation API", async ({
  page,
}) => {
  await page.goto("/final/lia");
  const selector = page.getByLabel("Ejemplo para revisar");
  await expect(selector).toBeVisible();
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/lia-api/")) requests.push(request.url());
  });
  const answers: string[] = [];
  for (const mode of ["simple", "technical"]) {
    await selector.selectOption(mode);
    await page
      .getByLabel(copy.prompt, { exact: true })
      .fill("¿Las plantas hacen música por sí solas?");
    await page.getByRole("button", { name: copy.send }).click();
    await expect(page.locator(".lia-preview__target-badge")).toContainText(
      "TARGET_SIMULATION",
    );
    answers.push(await page.locator(".lia-preview__answer p").innerText());
  }
  expect(answers[0]).not.toEqual(answers[1]);
  expect(requests).toEqual([]);
  await selector.selectOption("current");
  await expect(page.locator(".lia-preview__turns>li")).toHaveCount(0);
  await page.getByLabel(copy.prompt, { exact: true }).fill(copy.suggestion);
  await page.getByRole("button", { name: copy.send }).click();
  await expect(page.locator("[data-lia-state=supported]")).toBeVisible();
  expect(requests.length).toBe(1);
  await expect(page.locator(".lia-preview__target-badge")).toHaveCount(0);
});

test("twenty turn memory bound, clear and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/final/lia");
  await page.getByLabel("Ejemplo para revisar").selectOption("simple");
  for (let n = 0; n < 23; n++) {
    await page.getByLabel(copy.prompt, { exact: true }).fill(`pregunta ${n}`);
    await page.getByRole("button", { name: copy.send }).click();
  }
  await expect(page.locator(".lia-preview__turns>li")).toHaveCount(20);
  expect(
    await page
      .locator(".lia-preview__avatar")
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe("none");
  expect(
    await page.evaluate(() => JSON.stringify([localStorage, sessionStorage])),
  ).not.toContain("pregunta 22");
  await page.getByRole("button", { name: copy.clear }).click();
  await expect(page.locator(".lia-preview__turns>li")).toHaveCount(0);
});
