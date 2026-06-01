import { expect, test } from "@playwright/test";

test("preview tecnico de transicion entre mundos conserva base no interactiva", async ({
  page,
}) => {
  await page.goto("/dev/transition-world");

  await expect(
    page.getByRole("heading", { name: "Abriendo Mundo I: Raíz..." }),
  ).toBeVisible();
  await expect(page.getByText("Preparando recorrido...")).toBeVisible();
  await expect(page.getByTestId("transition-world-portal")).toBeVisible();
  await expect(page.getByTestId("transition-world-lia-fallback")).toBeVisible();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("a")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.getByText(/Cargando assets/i)).toHaveCount(0);

  const routeData = await page.locator("main").evaluate((element) => ({
    version: element.getAttribute("data-transition-world-version"),
    id: element.getAttribute("data-transition-world-id"),
    fromRoute: element.getAttribute("data-transition-from-route"),
    toRoute: element.getAttribute("data-transition-to-route"),
    durationMs: element.getAttribute("data-duration-ms"),
    reducedMotionDurationMs: element.getAttribute(
      "data-reduced-motion-duration-ms",
    ),
  }));

  expect(routeData).toEqual({
    version: "T003B_STATIC_BASE",
    id: "intro-to-station-1",
    fromRoute: "/portada",
    toRoute: "/mundo-i-raiz",
    durationMs: "2300",
    reducedMotionDurationMs: "1000",
  });
});
