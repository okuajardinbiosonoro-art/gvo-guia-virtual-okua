import { expect, test } from "@playwright/test";

const mobileViewports = [
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
];

test("muestra la carga inicial en la primera ruta del recorrido", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Preparando el recorrido",
  );
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
  await expect(
    page.getByRole("progressbar", {
      name: "Preparando el recorrido",
    }),
  ).toBeVisible();
  await expect(
    page.getByTestId("loading-initial-animated-scene"),
  ).toBeVisible();
  await expect(page.getByText("Portada / Intro")).toHaveCount(0);
  await expect(page.getByText("Estación I")).toHaveCount(0);
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
});

test("muestra la carga inicial en /carga", async ({ page }) => {
  await page.goto("/carga");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Preparando el recorrido",
  );
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
});

for (const viewport of mobileViewports) {
  test(`sin overflow horizontal en /carga ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/carga");

    await expect(
      page.getByRole("heading", { name: "Preparando el recorrido" }),
    ).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
}

test("reduced motion mantiene la pantalla de carga sin elementos fuera de alcance", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/carga");

  await expect(page.getByText("Preparando el recorrido")).toBeVisible();
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
});
