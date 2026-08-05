import path from "node:path";

export const TRACKED_EVIDENCE_INTENT = "update-tracked-evidence";

export const evidenceScopes = {
  "cover-intro-002i-fix2": "cover-intro/qa/002I-FIX2",
  "cover-intro-002j-fix": "cover-intro/qa/002J-FIX",
  "cover-intro-002k": "cover-intro/qa/002K",
  "cover-intro-002l": "cover-intro/qa/002L",
  "cover-to-transition-t003e8": "transition-world/validation/t003e8",
  "transition-copy-st5-020i": "transitions/st5-020i",
  "transition-world-t003e7c": "transition-world/validation/t003e7c",
  "world5-st5-020b": "world5/st5-020b",
  "world5-st5-020d": "world5/st5-020d",
  "world5-st5-020h": "world5/st5-020h",
} as const;

export type EvidenceScope = keyof typeof evidenceScopes;

type EvidenceResolutionOptions = {
  intent?: string;
  mode?: string;
  normalRoot?: string;
  requestedScope?: string;
  trackedRoot?: string;
};

function isEvidenceScope(value: string): value is EvidenceScope {
  return Object.prototype.hasOwnProperty.call(evidenceScopes, value);
}

function staysInside(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) &&
      relative !== ".." &&
      !path.isAbsolute(relative))
  );
}

export function resolveEvidenceDirectory(
  scope: string,
  options: EvidenceResolutionOptions = {},
): string {
  if (!isEvidenceScope(scope)) {
    throw new Error(`Unknown evidence scope: ${scope}`);
  }

  const normalRoot = path.resolve(
    options.normalRoot ?? "test-results/evidence",
  );
  if (options.mode !== "tracked") {
    return path.resolve(normalRoot, scope);
  }

  if (options.intent !== TRACKED_EVIDENCE_INTENT) {
    throw new Error("Tracked evidence mode requires explicit intent.");
  }
  if (options.requestedScope !== scope) {
    throw new Error("Tracked evidence mode requires the exact selected scope.");
  }

  const trackedRoot = path.resolve(options.trackedRoot ?? "docs/visual");
  const target = path.resolve(trackedRoot, evidenceScopes[scope]);
  if (!staysInside(trackedRoot, target)) {
    throw new Error("Tracked evidence target escaped docs/visual.");
  }
  return target;
}

export function resolveEvidencePath(
  scope: string,
  relativeName: string,
  options: EvidenceResolutionOptions = {},
): string {
  if (!relativeName || path.isAbsolute(relativeName)) {
    throw new Error("Evidence filename must be a non-empty relative path.");
  }

  const directory = resolveEvidenceDirectory(scope, options);
  const target = path.resolve(directory, relativeName);
  if (!staysInside(directory, target)) {
    throw new Error("Evidence filename escaped its selected scope.");
  }
  return target;
}

function environmentOptions(): EvidenceResolutionOptions {
  return {
    intent: process.env.GVO_E2E_EVIDENCE_INTENT,
    mode: process.env.GVO_E2E_EVIDENCE_MODE,
    requestedScope: process.env.GVO_E2E_EVIDENCE_SCOPE,
  };
}

export function evidenceDirectory(scope: EvidenceScope): string {
  return resolveEvidenceDirectory(scope, environmentOptions());
}

export function evidencePath(
  scope: EvidenceScope,
  relativeName: string,
): string {
  return resolveEvidencePath(scope, relativeName, environmentOptions());
}
