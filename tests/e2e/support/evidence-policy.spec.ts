import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  resolveEvidenceDirectory,
  resolveEvidencePath,
  TRACKED_EVIDENCE_INTENT,
} from "./evidence";

test("modo normal resuelve dentro del output ignorado y nunca en docs/visual", () => {
  const normalRoot = path.resolve("test-results/policy-proof");
  const target = resolveEvidencePath("world5-st5-020h", "metrics.json", {
    normalRoot,
  });

  expect(path.relative(normalRoot, target)).toBe(
    path.join("world5-st5-020h", "metrics.json"),
  );
  expect(target).not.toContain(path.resolve("docs/visual"));
});

test("modo tracked falla sin intención explícita o sin scope exacto", () => {
  expect(() =>
    resolveEvidenceDirectory("world5-st5-020h", {
      mode: "tracked",
      requestedScope: "world5-st5-020h",
    }),
  ).toThrow(/explicit intent/);

  expect(() =>
    resolveEvidenceDirectory("world5-st5-020h", {
      intent: TRACKED_EVIDENCE_INTENT,
      mode: "tracked",
      requestedScope: "world5-st5-020d",
    }),
  ).toThrow(/exact selected scope/);
});

test("rechaza scope desconocido y traversal", () => {
  expect(() => resolveEvidenceDirectory("../docs/visual")).toThrow(
    /Unknown evidence scope/,
  );
  expect(() =>
    resolveEvidencePath("world5-st5-020h", "../outside.png"),
  ).toThrow(/escaped its selected scope/);
});

test("modo explícito queda acotado a un único directorio allowlisted", () => {
  const trackedRoot = path.resolve("tracked-proof");
  const selected = resolveEvidenceDirectory("transition-copy-st5-020i", {
    intent: TRACKED_EVIDENCE_INTENT,
    mode: "tracked",
    requestedScope: "transition-copy-st5-020i",
    trackedRoot,
  });

  expect(selected).toBe(path.resolve(trackedRoot, "transitions", "st5-020i"));
  expect(selected).not.toContain("world5");
});
