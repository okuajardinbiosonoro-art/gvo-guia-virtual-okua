import { expect, test, type Page } from "@playwright/test";
import { liaPreviewCopy as copy } from "../../src/content/liaPreviewCopy";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3, 4, 5],
        updatedAt: "2026-09-12T00:00:00.000Z",
      }),
    ),
  );
});
async function pose(page: Page, id: string) {
  await expect(page.locator(".lia-preview__avatar")).toHaveAttribute(
    "data-asset-id",
    id,
  );
  await page.locator(".lia-preview__avatar").evaluate(async (node) => {
    const image = new Image();
    image.src = getComputedStyle(node).backgroundImage.slice(5, -2);
    await image.decode();
  });
}
async function question(page: Page, value: string) {
  await page.getByLabel(copy.prompt, { exact: true }).fill(value);
  await page.getByRole("button", { name: copy.send }).click();
}

test("approved presence changes with focus and real answer, and remains beside sources", async ({
  page,
}, info) => {
  await page.goto("/final");
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("mirador.png"),
  });
  await page.getByRole("link", { name: copy.entry }).click();
  await pose(page, "LIA-M4-GREETING-A");
  await expect(page.locator("#lia-title")).toBeInViewport();
  await expect(page.locator(".lia-preview__avatar")).toBeInViewport();
  await expect(page.locator(".lia-preview__presence-state")).toBeInViewport({
    ratio: 1,
  });
  await expect(page.getByLabel("Ejemplo para revisar")).toHaveCount(0);
  await expect(page.locator(".lia-preview__target-controls")).toHaveCount(0);
  const visualHeight = await page
    .locator(".lia-preview__avatar")
    .evaluate(async (node) => {
      const image = new Image();
      image.src = getComputedStyle(node).backgroundImage.slice(5, -2);
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let min = canvas.height,
        max = 0;
      for (let y = 0; y < canvas.height; y++)
        for (let x = 0; x < canvas.width; x++) {
          if (pixels[(y * canvas.width + x) * 4 + 3] >= 64) {
            min = Math.min(min, y);
            max = Math.max(max, y);
          }
        }
      return (
        ((max - min + 1) / canvas.height) * node.getBoundingClientRect().height
      );
    });
  if (info.project.name === "desktop") {
    expect(visualHeight).toBeGreaterThanOrEqual(240);
    expect(visualHeight).toBeLessThanOrEqual(320);
  }
  if (["portrait", "minimum"].includes(info.project.name)) {
    expect(visualHeight).toBeGreaterThanOrEqual(104);
    expect(visualHeight).toBeLessThanOrEqual(144);
  }
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("greeting.png"),
  });
  await page.getByLabel(copy.prompt, { exact: true }).click();
  await pose(page, "LIA-M4-LISTENING-A");
  await page.getByLabel(copy.prompt, { exact: true }).fill(copy.suggestion);
  await pose(page, "LIA-M4-LISTENING-A");
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("listening.png"),
  });
  await page.getByRole("button", { name: copy.send }).click();
  await expect(page.locator("[data-lia-state=supported]")).toBeVisible();
  await pose(page, "LIA-M4-EXPLAINING-A");
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("explaining.png"),
  });
  await page.locator("summary").click();
  await expect(page.locator("details[open] blockquote").first()).toBeVisible();
  await pose(page, "LIA-M4-EXPLAINING-A");
  if (info.project.name === "desktop")
    await expect(page.locator(".lia-preview__avatar")).toBeInViewport({
      ratio: 0.9,
    });
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("sources.png"),
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: copy.back }).click();
  await expect(page.getByRole("link", { name: copy.entry })).toBeFocused();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("return.png"),
  });
});

test("fallbacks keep canonical identity and safe messages", async ({
  page,
}, info) => {
  await page.goto("/final/lia");
  for (const [q, state] of [
    ["¿Qué es OKUA?", "abstain"],
    ["Reinicia el sistema", "refused"],
  ]) {
    await question(page, q);
    await expect(page.locator(`[data-lia-state=${state}]`)).toBeVisible();
    await pose(page, "FINAL-LIA-IDLE-001");
    await page.screenshot({
      animations: "disabled",
      path: info.outputPath(state + ".png"),
    });
    await page.getByRole("button", { name: copy.clear }).click();
  }
  await page.route("**/lia-api/**", (route) => route.abort("failed"));
  await question(page, copy.suggestion);
  await expect(page.locator("[data-lia-state=unavailable]")).toBeVisible();
  await pose(page, "FINAL-LIA-IDLE-001");
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("unavailable.png"),
  });
  await expect(page.getByRole("button", { name: copy.back })).toBeEnabled();
});

test("reduced motion removes animation while preserving approved state changes", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/final/lia");
  await pose(page, "LIA-M4-GREETING-A");
  await page.getByLabel(copy.prompt, { exact: true }).click();
  await pose(page, "LIA-M4-LISTENING-A");
  await question(page, copy.suggestion);
  await expect(page.locator("[data-lia-state=supported]")).toBeVisible();
  await pose(page, "LIA-M4-EXPLAINING-A");
  expect(
    await page
      .locator(".lia-preview__avatar")
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe("none");
  expect(
    await page
      .locator(".lia-preview")
      .evaluate((node) => getComputedStyle(node).backgroundAttachment),
  ).toBe("scroll");
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("reduced-motion.png"),
  });
});
