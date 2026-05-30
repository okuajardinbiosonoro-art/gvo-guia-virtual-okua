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
  "002L",
);

async function capture(page: Page, name: string) {
  await page.screenshot({
    fullPage: true,
    path: path.join(qaOutputDir, name),
  });
}

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

async function completeIntroFromCurrentDialogue(page: Page) {
  for (let index = 0; index < 3; index += 1) {
    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
  }

  await page.getByRole("button", { name: "Finalizar introducción" }).click();
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toBeVisible();
}

test.describe("QA visual final Portada / Intro 002L", () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeAll(() => {
    mkdirSync(qaOutputDir, { recursive: true });
  });

  test("genera evidencia final de flujo raiz, diálogos, activación y handoff", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?resetIntro=1");
    await expect(
      page.getByRole("heading", { name: "Preparando el recorrido" }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/portada$/, { timeout: 5000 });
    await expect(
      page.getByRole("button", { name: "Comenzar recorrido" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toHaveCount(0);
    await capture(page, "cover-intro-002l-01-root-flow-fresh-idle-390x844.png");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await prepareFreshCover(page);
    await expect(
      page.locator('[data-lia-avatar-mode="rig-idle"]'),
    ).toBeVisible();
    await expect(page.locator('[data-lia-expression="neutral"]')).toBeVisible();
    await expect(page.locator('[data-portal-state="locked"]')).toHaveCount(4);
    await capture(page, "cover-intro-002l-02-idle-direct-reset-390x844.png");

    await page.getByRole("button", { name: "Comenzar recorrido" }).click();
    await expect(page.getByText("Paso 1 de 5")).toBeVisible();
    await expect(
      page.getByText(
        "Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.",
      ),
    ).toBeVisible();
    await expect(page.locator('[data-lia-expression="happy"]')).toBeVisible();
    await expect(page.getByText("1/5")).toHaveCount(0);
    await capture(
      page,
      "cover-intro-002l-03-dialogue-paso-1-happy-390x844.png",
    );

    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
    await expect(page.getByText("Paso 2 de 5")).toBeVisible();
    await expect(
      page.getByText(
        "Antes de entrar, aclaremos algo: las plantas no hacen música por sí solas.",
      ),
    ).toBeVisible();
    await expect(
      page.locator('[data-lia-expression="attentive"]'),
    ).toBeVisible();
    await expect(page.getByText("2/5")).toHaveCount(0);
    await capture(
      page,
      "cover-intro-002l-04-dialogue-paso-2-aclaracion-390x844.png",
    );

    await completeIntroFromCurrentDialogue(page);
    await expect(
      page.locator('[data-cover-phase="portal_1_ready"]'),
    ).toBeVisible();
    await expect(page.locator('[data-lia-pose="pointPortal1"]')).toBeVisible();
    await expect(page.locator('[data-portal-state="locked"]')).toHaveCount(4);
    await capture(page, "cover-intro-002l-05-portal-1-ready-390x844.png");

    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    await expect(
      page.locator('[data-cover-phase="portal_1_opening_placeholder"]'),
    ).toBeVisible();
    await expect(page.getByText("Abriendo Mundo I: Raíz...")).toBeVisible();
    await expect(
      page.getByTestId("cover-portal-activation-rig"),
    ).toHaveAttribute("data-activation-stage", "portal-i");
    await expect(page.getByTestId("cover-activation-lia")).toBeVisible();
    await expect(
      page.getByTestId("cover-activation-portal-front"),
    ).toBeVisible();
    await expect(
      page.getByTestId("cover-activation-contact-light"),
    ).toBeVisible();
    await page.waitForTimeout(620);
    await capture(page, "cover-intro-002l-06-activation-contact-390x844.png");

    await expect(
      page.locator('[data-cover-phase="transition_to_station_1_placeholder"]'),
    ).toBeVisible();
    await expect(page.getByText("Preparando recorrido...")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Continuar a Mundo I" }),
    ).toHaveAttribute("href", "/estacion/1");
    await capture(
      page,
      "cover-intro-002l-07-transition-placeholder-390x844.png",
    );

    await page.getByRole("link", { name: "Continuar a Mundo I" }).click();
    await expect(page).toHaveURL(/\/estacion\/1$/);
    await expect(page.getByText("Estación placeholder")).toBeVisible();
    await expect(page.getByText("Mundo I: Raíz")).toBeVisible();
    await capture(
      page,
      "cover-intro-002l-10-station-1-placeholder-390x844.png",
    );
  });

  test("genera evidencia de feedback bloqueado y reduced motion", async ({
    page,
  }) => {
    await prepareFreshCover(page);
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
    await expect(page).toHaveURL(/\/portada$/);
    await capture(
      page,
      "cover-intro-002l-08-blocked-portal-feedback-390x844.png",
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await prepareFreshCover(page);
    await page.getByRole("button", { name: "Comenzar recorrido" }).click();
    await expect(page.getByText("Paso 1 de 5")).toBeVisible();
    await expect(page.locator('[data-lia-expression="happy"]')).toBeVisible();
    await expect(page.locator("audio")).toHaveCount(0);
    await expect(page.locator("video")).toHaveCount(0);
    await capture(
      page,
      "cover-intro-002l-09-reduced-motion-dialogue-390x844.png",
    );
  });

  test("verifica /carga como ruta intacta de carga inicial", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/carga");

    await expect(
      page.getByRole("heading", { name: "Preparando el recorrido" }),
    ).toBeVisible();
    await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
    await expect(page.locator("audio")).toHaveCount(0);
    await expect(page.locator("video")).toHaveCount(0);
  });
});
