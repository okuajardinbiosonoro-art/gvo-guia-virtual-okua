import { expect, type Page } from "@playwright/test";

type InterstationQrOriginWorld = 1 | 2 | 3 | 4;

const payloadByOriginWorld: Readonly<
  Record<InterstationQrOriginWorld, string>
> = {
  1: "/qr/w2",
  2: "/qr/w3",
  3: "/qr/w4",
  4: "/qr/w5",
};

export async function installInterstationQrTestMode(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, "__GVO_QR_TEST_MODE__", {
      configurable: true,
      value: true,
      writable: true,
    });
    const mediaDevices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: mediaDevices,
    });
    Object.defineProperty(mediaDevices, "getUserMedia", {
      configurable: true,
      value: async () =>
        ({
          getTracks: () => [{ stop: () => undefined }],
        }) as unknown as MediaStream,
    });
  });
}

export async function scanInterstationQrForTest(
  page: Page,
  originWorld: InterstationQrOriginWorld,
) {
  const gate = page.locator(
    `[data-interstation-qr-gate="active"][data-interstation-origin-world="${originWorld}"]`,
  );
  await expect(gate).toBeVisible({ timeout: 20_000 });
  await gate.locator('[data-interstation-qr-action="open"]').click();
  await expect(gate).toHaveAttribute("data-camera-status", "camera-granted");
  await page.evaluate((payload) => {
    window.dispatchEvent(
      new CustomEvent("gvo:qr-test-payload", { detail: { payload } }),
    );
  }, payloadByOriginWorld[originWorld]);
}
