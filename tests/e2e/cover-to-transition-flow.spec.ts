import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const flowOutputDir = path.join(
  process.cwd(),
  "docs",
  "visual",
  "transition-world",
  "validation",
  "t003e8",
);

async function finishIntroDialogue(page: Page) {
  await page.getByRole("button", { name: "Comenzar recorrido" }).click();

  for (let index = 0; index < 4; index += 1) {
    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
  }

  await page.getByRole("button", { name: "Finalizar introducción" }).click();
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toBeVisible();
}

async function capture(page: Page, name: string) {
  await page.screenshot({
    fullPage: true,
    path: path.join(flowOutputDir, name),
  });
}

async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
}

test.describe("T003E8 flujo Portada a Transición y Mundo I", () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeAll(() => {
    mkdirSync(flowOutputDir, { recursive: true });
  });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
  ]) {
    test(`flujo completo en ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/portada?resetIntro=1");
      await expect(page).toHaveURL(/\/portada(?:\?resetIntro=1)?$/);
      await expect(
        page.getByRole("button", { name: "Comenzar recorrido" }),
      ).toBeVisible();
      await expect(await hasHorizontalOverflow(page)).toBe(false);
      await capture(
        page,
        `flow-cover-start-${viewport.width}x${viewport.height}.png`,
      );

      await finishIntroDialogue(page);

      const enterButton = page.getByRole("button", {
        name: "Entrar a Mundo I",
      });
      const enterButtonBox = await enterButton.boundingBox();
      expect(enterButtonBox).not.toBeNull();
      const enterButtonCenter = {
        x: enterButtonBox!.x + enterButtonBox!.width / 2,
        y: enterButtonBox!.y + enterButtonBox!.height / 2,
      };
      await page.mouse.click(enterButtonCenter.x, enterButtonCenter.y);
      await page.mouse.click(enterButtonCenter.x, enterButtonCenter.y);
      await expect(
        page.locator('[data-cover-phase="portal_1_opening_placeholder"]'),
      ).toBeVisible();
      await expect(page.getByText("Abriendo Mundo I: Raíz...")).toBeVisible();

      await expect(page).toHaveURL(/\/transition\/intro-to-station-1$/, {
        timeout: 5000,
      });
      await expect(
        page.getByRole("heading", { name: "Abriendo Mundo I" }),
      ).toBeVisible();
      await expect(page.getByText("Preparando la raíz.")).toBeVisible();
      await expect(page.locator("main")).toHaveAttribute(
        "data-transition-world-variant",
        "runtime",
      );
      await expect(page.locator("main")).toHaveAttribute(
        "data-navigation-locked",
        "true",
      );
      await expect(page.locator("button")).toHaveCount(0);
      await expect(page.locator("a")).toHaveCount(0);
      await expect(page.locator("audio")).toHaveCount(0);
      await expect(page.locator("video")).toHaveCount(0);
      await expect(await hasHorizontalOverflow(page)).toBe(false);
      await capture(
        page,
        `flow-transition-mid-${viewport.width}x${viewport.height}.png`,
      );

      await expect(page).toHaveURL(/\/estacion\/1$/, { timeout: 5000 });
      await expect(page.getByText("Mundo I: Raíz")).toBeVisible();
      await expect(page.getByText("Antes de escuchar")).toBeVisible();
      await expect(page.getByText("RELACIÓN")).toBeVisible();
      await expect(page.getByText("PERCEPCIÓN")).toBeVisible();
      await expect(page.getByText("MEDIACIÓN")).toBeVisible();
      await expect(page.locator("audio")).toHaveCount(0);
      await expect(page.locator("video")).toHaveCount(0);
      await expect(await hasHorizontalOverflow(page)).toBe(false);
      await capture(
        page,
        `flow-destination-${viewport.width}x${viewport.height}.png`,
      );
    });
  }
});
