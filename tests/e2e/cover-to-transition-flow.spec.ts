import { expect, test } from "@playwright/test";
import { openEditorialCover, readEditorialIntro, expectNoHorizontalOverflow } from "./support/editorial-entry";

for (const viewport of [{width: 360,height: 640},{width:390,height:844},{width:844,height:390}]) {
  test(`presentación opcional y entrada directa ${viewport.width}×${viewport.height}`, async ({page}) => {
    await page.setViewportSize(viewport);
    await openEditorialCover(page);
    await expect(page.locator("[data-portal-id]")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    await readEditorialIntro(page);
    await page.getByRole("button", {name: "¡Adelante!", exact: true}).click();
    await expect(page).toHaveURL(/\/transition\/intro-to-station-1$/, {timeout: 20_000});
    await expect(page.getByRole("heading", {name: "Abriendo Sala I · Raíz"})).toBeVisible();
    const continueButton = page.getByRole("button", {name: "Continuar ahora"});
    await expect(continueButton).toBeEnabled();
    await continueButton.click();
    await expect(page).toHaveURL(/\/estacion\/1$/);
    await expect(page.locator("main[data-world1-root-state]")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expect(page.locator("audio,video")).toHaveCount(0);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("gvo.progress.v1") || '{"completedStations":[]}').completedStations)).toEqual([]);
  });
}
