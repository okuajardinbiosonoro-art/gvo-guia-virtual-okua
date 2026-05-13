import js from "@eslint/js";
import tseslint from "typescript-eslint";

const browserGlobals = {
  console: "readonly",
  document: "readonly",
  HTMLElement: "readonly",
  localStorage: "readonly",
  navigator: "readonly",
  Storage: "readonly",
  window: "readonly",
};

const nodeGlobals = {
  console: "readonly",
  process: "readonly",
};

export default tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
      "coverage",
      "playwright-report",
      "test-results",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: browserGlobals,
    },
  },
  {
    files: ["*.config.{js,ts}", "tools/**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: nodeGlobals,
    },
  },
);
