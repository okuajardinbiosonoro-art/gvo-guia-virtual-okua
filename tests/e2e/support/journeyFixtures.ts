import type { Page } from "@playwright/test";

const globalProgressKey = "gvo.progress.v1";

export async function installWorldFiveAccessFixture(page: Page) {
  await page.addInitScript((key) => {
    if (window.localStorage.getItem(key) === null) {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          completedStations: [1, 2, 3, 4],
          updatedAt: "2026-08-05T12:00:00.000Z",
        }),
      );
    }
  }, globalProgressKey);
}
