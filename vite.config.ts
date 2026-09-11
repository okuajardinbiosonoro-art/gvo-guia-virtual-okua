/// <reference types="vitest" />
/// <reference types="./src/features/lia-preview/proxy-types" />

// @ts-expect-error The project intentionally omits broad Node typings.
import { existsSync, readFileSync } from "node:fs";
// @ts-expect-error The project intentionally omits broad Node typings.
import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import {
  liaPreviewProxy,
  validateApiBase,
} from "./tools/vite/lia-preview-proxy.mjs";
import { VitePWA } from "vite-plugin-pwa";

import { excludeNonDeployablePublicArtifacts } from "./tools/vite/exclude-nondeployable-public.mjs";

const devCertificatePath = resolve(".gvo-dev-certs/gvo-dev-server.pfx");
const devCertificatePassphrase = "gvo-local-development-only";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, ".", "");
  const apiBase = validateApiBase(env.LIA_API_BASE || "/lia-api");
  return {
    define: { __LIA_API_BASE__: JSON.stringify(apiBase) },
    server:
      command === "serve" && existsSync(devCertificatePath)
        ? {
            https: {
              passphrase: devCertificatePassphrase,
              pfx: readFileSync(devCertificatePath),
            },
            port: 5173,
            strictPort: true,
          }
        : undefined,
    plugins: [
      react(),
      liaPreviewProxy({
        enabled: env.VITE_LIA_PREVIEW_ENABLED === "true",
        base: apiBase,
        upstream: env.LIA_DEV_UPSTREAM,
      }),
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
            "index.html",
            "registerSW.js",
            "assets/index-*.{js,css}",
            "assets/pixelify-*.woff2",
            "assets/runtime/loading-initial-pre-portada.png",
            "assets/runtime/loading-initial/**/*.{png,json}",
            "assets/runtime/cover-intro/**/*.{png,json}",
          ],
          globIgnores: [
            "assets/gvo/current-used/**/*",
            "**/*.md",
            "**/.gitkeep",
          ],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/lia-api(?:-[a-z0-9]+)?(?:\/|$)/],
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: /\/lia-api(?:-[a-z0-9]+)?(?:\/|$)/,
              handler: "NetworkOnly",
              method: "GET",
            },
            {
              urlPattern: /\/lia-api(?:-[a-z0-9]+)?(?:\/|$)/,
              handler: "NetworkOnly",
              method: "POST",
            },
            {
              urlPattern: ({ url }) =>
                url.origin === self.location.origin &&
                url.pathname.startsWith("/assets/") &&
                /\.(?:css|js|json|png|svg|webp|woff2)$/.test(url.pathname),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "gvo-runtime-assets-v1",
                cacheableResponse: {
                  statuses: [0, 200],
                },
                expiration: {
                  maxEntries: 256,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                  purgeOnQuotaError: true,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
      excludeNonDeployablePublicArtifacts(),
    ],
    test: {
      environment: "jsdom",
      include: ["src/**/*.test.{ts,tsx}"],
      exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
      setupFiles: "./src/app/providers/test.setup.ts",
    },
  };
});
