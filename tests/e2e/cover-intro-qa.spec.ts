import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const qaOutputDir = path.join(
  process.cwd(),
  "docs",
  "visual",
  "cover-intro",
  "qa",
  "002H",
);

async function prepareCover(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portada");
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/portada");
  await expect(
    page.getByRole("heading", { name: "EL ARCHIVO VIVO DE OKÚA" }),
  ).toBeVisible();
}

async function capture(page: Page, name: string) {
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: path.join(qaOutputDir, name),
  });
}

test.describe("QA visual Portada / Intro 002H", () => {
  test.beforeAll(() => {
    mkdirSync(qaOutputDir, { recursive: true });
  });

  test("genera capturas 390x844 de estados principales", async ({ page }) => {
    await prepareCover(page);
    await capture(page, "cover-intro-qa-01-idle-390x844.png");

    await page.getByRole("button", { name: "Comenzar recorrido" }).click();
    await expect(
      page.getByText(
        "Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.",
      ),
    ).toBeVisible();
    await capture(page, "cover-intro-qa-02-dialogue-01-390x844.png");

    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
    await expect(
      page.getByText(
        "Antes de entrar, aclaremos algo: las plantas no hacen música por sí solas.",
      ),
    ).toBeVisible();
    await capture(
      page,
      "cover-intro-qa-03-dialogue-clarification-390x844.png",
    );

    for (let index = 0; index < 3; index += 1) {
      await page
        .getByRole("button", { name: "Siguiente diálogo de Lía" })
        .click();
    }
    await page.getByRole("button", { name: "Finalizar introducción" }).click();
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toBeVisible();
    await capture(page, "cover-intro-qa-04-portal-1-ready-390x844.png");

    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    await expect(page.getByText("Abriendo Mundo I: Raíz...")).toBeVisible();
    await capture(
      page,
      "cover-intro-qa-05-opening-placeholder-390x844.png",
    );

    await expect(page.getByText("Preparando recorrido...")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Continuar a Mundo I" }),
    ).toHaveAttribute("href", "/estacion/1");
    await capture(
      page,
      "cover-intro-qa-06-transition-placeholder-390x844.png",
    );
    await expect(page).toHaveURL(/\/portada$/);
  });

  test("genera captura de portal bloqueado", async ({ page }) => {
    await prepareCover(page);
    await page
      .getByRole("button", {
        name: "Estación II, bloqueada hasta completar Mundo I.",
      })
      .click({ force: true });
    await expect(
      page.getByText(
        "Primero debemos entrar por Raíz. Después llegaremos al pulso invisible.",
      ),
    ).toBeVisible();
    await capture(
      page,
      "cover-intro-qa-07-blocked-portal-feedback-390x844.png",
    );
    await expect(page).toHaveURL(/\/portada$/);
  });

  test("genera captura reduced motion con diálogo activo", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await prepareCover(page);
    await page.getByRole("button", { name: "Comenzar recorrido" }).click();
    await expect(
      page.getByText(
        "Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.",
      ),
    ).toBeVisible();
    await capture(
      page,
      "cover-intro-qa-08-reduced-motion-dialogue-390x844.png",
    );
  });
});
