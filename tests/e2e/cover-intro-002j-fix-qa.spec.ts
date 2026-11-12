import { expect, test } from "@playwright/test";
import { openEditorialCover, expectNoHorizontalOverflow } from "./support/editorial-entry";

for(const viewport of [{width:375,height:667},{width:390,height:844},{width:844,height:390}]) {
  test(`Lía orienta la presentación sin cubrir controles ${viewport.width}×${viewport.height}`, async ({page}, testInfo) => {
    await page.setViewportSize(viewport);
    await openEditorialCover(page);
    await expect(page.locator('[data-lia-rig-layer="eyes-neutral"]')).toBeVisible();
    await page.getByRole("button",{name:"Empieza aquí"}).click();
    await expect(page.locator('[data-lia-expression="happy"]')).toBeVisible();
    await page.getByRole("button",{name:"Siguiente diálogo de Lía"}).click();
    await expect(page.locator('[data-lia-expression="attentive"]')).toBeVisible();
    await page.getByRole("button",{name:"Siguiente diálogo de Lía"}).click();
    await expect(page.locator('[data-lia-pose="pointPortal1"]')).toBeVisible();
    const finish=page.getByRole("button",{name:"¡Adelante!",exact:true});
    await expect(finish).toBeInViewport();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({path:testInfo.outputPath("intro-final.png"),fullPage:true});
    await finish.click();
    await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
  });
}
