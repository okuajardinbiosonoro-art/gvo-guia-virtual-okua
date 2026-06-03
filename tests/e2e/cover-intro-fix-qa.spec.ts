import { expect, test } from "@playwright/test";
import type { Page, TestInfo } from "@playwright/test";

async function prepareFreshCover(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portada");
  await page.evaluate(() => {
    window.localStorage.removeItem("gvo.coverIntro.introCompleted.v1");
  });
  await page.goto("/portada?resetIntro=1");
  await expect(page).toHaveURL(/\/portada(?:\?resetIntro=1)?$/);
  await expect(
    page.getByRole("button", { name: "Comenzar recorrido" }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toHaveCount(0);
}

async function capture(page: Page, testInfo: TestInfo, name: string) {
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: testInfo.outputPath(name),
  });
}

async function completeDialogues(page: Page) {
  for (let index = 0; index < 3; index += 1) {
    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
  }
  await page.getByRole("button", { name: "Finalizar introducción" }).click();
}

test.describe("QA visual Portada / Intro 002I-FIX", () => {
  test.describe.configure({ timeout: 90_000 });

  test("genera capturas 002I-FIX de estados clave", async ({
    page,
  }, testInfo) => {
    await prepareFreshCover(page);
    await capture(page, testInfo, "cover-intro-fix-01-idle-fresh-390x844.png");

    await page.getByRole("button", { name: "Comenzar recorrido" }).click();
    await expect(page.getByText("Paso 1 de 5")).toBeVisible();
    await expect(page.getByText("1/5")).toHaveCount(0);
    await capture(page, testInfo, "cover-intro-fix-02-dialogue-01-390x844.png");

    const dialogueBox = await page
      .getByTestId("cover-dialogue-panel")
      .boundingBox();
    const liaBox = await page.locator(".cover-intro__lia").boundingBox();

    expect(dialogueBox).not.toBeNull();
    expect(liaBox).not.toBeNull();
    expect(dialogueBox!.y).toBeGreaterThan(liaBox!.y + 130);

    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
    await expect(page.getByText("Paso 2 de 5")).toBeVisible();
    await expect(page.getByText("2/5")).toHaveCount(0);
    await capture(
      page,
      testInfo,
      "cover-intro-fix-03-dialogue-clarification-390x844.png",
    );

    await completeDialogues(page);
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toBeVisible();
    await capture(
      page,
      testInfo,
      "cover-intro-fix-04-portal-ready-390x844.png",
    );

    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    await expect(page).toHaveURL(/\/transition\/intro-to-station-1$/, {
      timeout: 5000,
    });
    await expect(page.getByText("Preparando recorrido...")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("button")).toHaveCount(0);
    await expect(page.locator("a")).toHaveCount(0);
    await capture(
      page,
      testInfo,
      "cover-intro-fix-05-transition-placeholder-390x844.png",
    );
  });

  test("genera captura del flujo / con resetIntro hacia portada fresca", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/portada");
    await page.evaluate(() => {
      window.localStorage.setItem("gvo.coverIntro.introCompleted.v1", "true");
    });

    await page.goto("/?resetIntro=1");
    await expect(
      page.getByRole("heading", { name: "Preparando el recorrido" }),
    ).toBeVisible();
    await capture(
      page,
      testInfo,
      "cover-intro-fix-06-root-loading-to-portada-390x844.png",
    );

    await expect(page).toHaveURL(/\/portada$/, { timeout: 15_000 });
    await expect(
      page.getByRole("button", { name: "Comenzar recorrido" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toHaveCount(0);
  });
});
