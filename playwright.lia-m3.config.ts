import { defineConfig } from "@playwright/test";
import process from "node:process";

const baseURL = process.env.LIA_DEMO_URL;
if (!baseURL || !/^https:\/\/127\.0\.0\.1:49\d{3}$/.test(baseURL)) {
  throw new Error("Set LIA_DEMO_URL to the owned loopback HTTPS demo origin");
}
export default defineConfig({
  testDir: "./tests/e2e", testMatch: "lia-m3-*.spec.ts", workers: 1, timeout: 60_000,
  outputDir: process.env.LIA_E2E_OUTPUT || "test-results/lia-m3",
  reporter: [["line"], ["json", { outputFile: process.env.LIA_E2E_REPORT || "test-results/lia-m3.json" }]],
  use: { baseURL, channel: "chrome", ignoreHTTPSErrors: true, trace: "off" },
  projects: [
    { name: "lia-mobile", use: { viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true } },
    { name: "lia-desktop", use: { viewport: { width: 1280, height: 800 } } },
  ],
});
