import { expect, test } from "@playwright/test";

test("default-off visitor candidate has no Lía chat entry, route or API request", async ({ page }) => {
  test.skip(process.env.VITE_LIA_PREVIEW_ENABLED === "true", "Default-off production contract is checked with the default flag.");
  const apiRequests:string[]=[];
  page.on("request",request=>{if(new URL(request.url()).pathname.startsWith("/lia-api"))apiRequests.push(request.url());});
  await page.addInitScript(()=>localStorage.setItem("gvo.progress.v1",JSON.stringify({schemaVersion:1,completedStations:[1,2,3,4,5],updatedAt:"2026-10-23T12:00:00.000Z"})));
  await page.goto("/final");
  await expect(page.locator("[data-final-root]")).toBeVisible();
  await expect(page.locator("#lia-preview-entry")).toHaveCount(0);
  await page.goto("/final/lia");
  await expect(page).toHaveURL(/\/final$/);
  await expect(page.locator("[data-lia-preview]")).toHaveCount(0);
  expect(apiRequests).toEqual([]);
});
