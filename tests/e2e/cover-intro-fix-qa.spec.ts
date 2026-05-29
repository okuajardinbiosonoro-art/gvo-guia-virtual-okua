import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const fixQaOutputDir = path.join(
  process.cwd(),
  "docs",
  "visual",
  "cover-intro",
  "qa",
  "002I-FIX",
);

async function prepareFreshCover(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portada?resetIntro=1");
  await expect(page).toHaveURL(/\/portada$/);
  await expect(
    page.getByRole("button", { name: "Comenzar recorrido" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toHaveCount(0);
}

async function capture(page: Page, name: string) {
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: path.join(fixQaOutputDir, name),
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
  test.beforeAll(() => {
    mkdirSync(fixQaOutputDir, { recursive: true });
  });

  test("genera capturas 002I-FIX de estados clave", async ({ page }) => {
    await prepareFreshCover(page);
    await capture(page, "cover-intro-fix-01-idle-fresh-390x844.png");

    await page.getByRole("button", { name: "Comenzar recorrido" }).click();
    await expect(page.getByText("1/5")).toBeVisible();
    await capture(page, "cover-intro-fix-02-dialogue-01-390x844.png");

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
    await expect(page.getByText("2/5")).toBeVisible();
    await capture(
      page,
      "cover-intro-fix-03-dialogue-clarification-390x844.png",
    );

    await completeDialogues(page);
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toBeVisible();
    await capture(page, "cover-intro-fix-04-portal-ready-390x844.png");

    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    await expect(page.getByText("Preparando recorrido...")).toBeVisible();
    await capture(
      page,
      "cover-intro-fix-05-transition-placeholder-390x844.png",
    );
  });

  test("genera captura del flujo / con resetIntro hacia portada fresca", async ({
    page,
  }) => {
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
      "cover-intro-fix-06-root-loading-to-portada-390x844.png",
    );

    await expect(page).toHaveURL(/\/portada$/, { timeout: 5000 });
    await expect(
      page.getByRole("button", { name: "Comenzar recorrido" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toHaveCount(0);
  });
});
