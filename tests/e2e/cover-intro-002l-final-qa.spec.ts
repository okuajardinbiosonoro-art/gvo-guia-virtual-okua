import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

test("refresh después de la presentación conserva el acceso sin repetirla", async ({page}) => {
  await page.goto("/portada");
  await page.getByRole("button", {name:"Empieza aquí"}).click();
  const next = page.locator('.cover-intro__dialogue-button');
  for (let step = 0; step < 4; step++) await next.click();
  await expect(page.locator('[data-portal-id="portal-1"]')).toBeEnabled();
  await page.goto("/portada");
  const portal = page.getByRole("button", {name:"Sala I · Raíz, lista para abrir."});
  await expect(portal).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await portal.click();
  await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
});

test("Mirador restaura las cinco salas con nombres coherentes sin iniciar cámara", async ({page}) => {
  const saved = JSON.parse(readFileSync("docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json", "utf8")).endEarned;
  await page.goto("/portada");
  await page.evaluate(({progress, essential}) => {
    localStorage.setItem("gvo.progress.v1", JSON.stringify(progress));
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify(essential));
  }, saved);
  await page.goto("/final");
  await page.locator('[data-final-action="safe_navigation_portada"]').click();
  await expect(page.locator("main[data-cover-revisit]")).toHaveAttribute("data-cover-revisit","active");
  await expect(page.locator('[data-portal-state="available"]')).toHaveCount(5);
  await expect(page.getByRole("button",{name:"Volver a Sala III · Cuaderno de práctica"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Volver a Sala V · OKÚA, arte sensorial"})).toBeVisible();
  await page.getByRole("button",{name:"Volver a Sala III · Cuaderno de práctica"}).click();
  await expect(page).toHaveURL(/\/repetir\/estacion\/3$/);
  const ready = page.locator(".gvo-prepared-tree[data-journey-active=true] .s3-screen");
  const error = page.locator("[data-preparation-detail]");
  await expect(ready.or(error).first()).toBeVisible({timeout: 45000});
  if (await error.count()) throw new Error(await error.getAttribute("data-preparation-detail") ?? "preparación");
  await expect(ready).toBeVisible();
  await expect(page.locator('[data-final-review-active="true"]')).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
});
