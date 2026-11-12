import { expect, type Page } from "@playwright/test";

export async function openEditorialCover(page: Page) {
  await page.goto("/portada?resetIntro=1");
  await expect(
    page.getByRole("button", { name: "Empieza aquí" }),
  ).toBeVisible();
  await expect(page.locator("main[data-cover-phase]")).toHaveAttribute(
    "data-critical-assets-ready",
    "true",
  );
}

export async function readEditorialIntro(page: Page) {
  await page.getByRole("button", { name: "Empieza aquí" }).click();
  for (const [index, text] of [
    "Hola, soy Lía, tu guía por el Jardín Biosonoro.",
    "Visitaremos cinco salas para descubrir cómo se unen plantas, arte y tecnología.",
    "Nuestro viaje empieza en la raíz. ¡Adelante!",
  ].entries()) {
    await expect(page.getByRole("dialog")).toContainText(text);
    await expect(page.getByText(`Paso ${index + 1} de 3`)).toBeVisible();
    if (index < 2) {
      await expect(
        page.getByRole("button", { name: "Omitir presentación y entrar" }),
      ).toBeEnabled();
    } else {
      await expect(
        page.getByRole("button", { name: "Omitir presentación y entrar" }),
      ).toHaveCount(0);
    }
    if (index < 2)
      await page
        .getByRole("button", { name: "Siguiente diálogo de Lía" })
        .click();
  }
}

export async function enterAfterEditorialIntro(page: Page) {
  await readEditorialIntro(page);
  await page.getByRole("button", { name: "¡Adelante!", exact: true }).click();
  await expect(page).toHaveURL(
    /\/(?:transition\/intro-to-station-1|estacion\/1)$/,
    { timeout: 20_000 },
  );
  await expect(page).toHaveURL(/\/estacion\/1$/, { timeout: 20_000 });
}

export async function expectNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

export async function seedCompletedJourney(page: Page) {
  await page.goto("/portada");
  await page.evaluate(() => {
    localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3, 4, 5],
        updatedAt: "2026-10-23T12:00:00.000Z",
      }),
    );
  });
}
