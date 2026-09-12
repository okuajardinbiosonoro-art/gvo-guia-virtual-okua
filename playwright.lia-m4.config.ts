import { defineConfig } from "@playwright/test";
import process from "node:process";

const baseURL = process.env.LIA_DEMO_URL;
if (!baseURL || !/^https:\/\/127\.0\.0\.1:49\d{3}$/.test(baseURL)) {
  throw new Error("Set LIA_DEMO_URL to the owned loopback HTTPS demo origin");
}
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "lia-m4-*.spec.ts",
  workers: 1,
  timeout: 60_000,
  outputDir: process.env.LIA_E2E_OUTPUT || "test-results/lia-m4",
  reporter: [
    ["line"],
    [
      "json",
      { outputFile: process.env.LIA_E2E_REPORT || "test-results/lia-m4.json" },
    ],
  ],
  use: { baseURL, channel: "chrome", ignoreHTTPSErrors: true, trace: "off" },
  projects: [
    {
      name: "lia-minimum",
      use: {
        viewport: { width: 360, height: 640 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "lia-mobile",
      use: {
        viewport: { width: 393, height: 852 },
        isMobile: true,
        hasTouch: true,
      },
    },
    { name: "lia-landscape", use: { viewport: { width: 844, height: 390 } } },
    { name: "lia-desktop", use: { viewport: { width: 1280, height: 800 } } },
  ],
});
