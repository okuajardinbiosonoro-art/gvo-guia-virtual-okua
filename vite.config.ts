/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "GVO — Guía Virtual OKÚA",
        short_name: "GVO OKÚA",
        description:
          "Guía Virtual OKÚA para recorrido local mobile-first sin Internet.",
        lang: "es",
        theme_color: "#20362f",
        background_color: "#f5f1e7",
        display: "standalone",
        display_override: ["fullscreen", "standalone"],
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/assets/runtime/gvo-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,svg,png,webp,json,webmanifest,woff2}",
        ],
        globIgnores: ["assets/gvo/current-used/**/*", "**/*.md", "**/.gitkeep"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: "/index.html",
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
    setupFiles: "./src/app/providers/test.setup.ts",
  },
});
