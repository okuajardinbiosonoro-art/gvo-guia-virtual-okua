import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const scopes = Object.freeze({
  "cover-intro-002i-fix2": "tests/e2e/cover-intro-fix2-qa.spec.ts",
  "cover-intro-002j-fix": "tests/e2e/cover-intro-002j-fix-qa.spec.ts",
  "cover-intro-002k": "tests/e2e/cover-intro-002k-qa.spec.ts",
  "cover-intro-002l": "tests/e2e/cover-intro-002l-final-qa.spec.ts",
  "cover-to-transition-t003e8": "tests/e2e/cover-to-transition-flow.spec.ts",
  "transition-copy-st5-020i": "tests/e2e/transition-copy-st5-020i.spec.ts",
  "transition-world-t003e7c": "tests/e2e/transition-world.spec.ts",
  "world5-st5-020b": "tests/e2e/world5-st5-020b.spec.ts",
  "world5-st5-020d": "tests/e2e/world5-st5-020d.spec.ts",
  "world5-st5-020h": "tests/e2e/world5-st5-020h.spec.ts",
});

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.stderr.write(
    "Usage: npm run test:e2e:evidence -- --scope <allowlisted-scope> [--dry-run]\n",
  );
  process.stderr.write(`Scopes: ${Object.keys(scopes).join(", ")}\n`);
  process.exit(2);
}

const args = process.argv.slice(2);
const scopeIndex = args.indexOf("--scope");
const dryRun = args.includes("--dry-run");
const unknownArgs = args.filter(
  (value, index) =>
    value !== "--dry-run" && value !== "--scope" && index !== scopeIndex + 1,
);

if (scopeIndex === -1 || !args[scopeIndex + 1]) {
  fail("Tracked evidence generation requires an explicit --scope.");
}
if (unknownArgs.length > 0) {
  fail(`Unknown arguments: ${unknownArgs.join(", ")}`);
}

const scope = args[scopeIndex + 1];
const spec = scopes[scope];
if (!spec) {
  fail(`Unknown or disallowed evidence scope: ${scope}`);
}

const cli = path.resolve("node_modules/@playwright/test/cli.js");
const command = [process.execPath, cli, "test", spec];
process.stdout.write(`Scope: ${scope}\nSpec: ${spec}\n`);
process.stdout.write("Tracked target: docs/visual (selected scope only)\n");

if (dryRun) {
  process.stdout.write(`Dry run: ${command.join(" ")}\n`);
  process.exit(0);
}

const result = spawnSync(command[0], command.slice(1), {
  env: {
    ...process.env,
    GVO_E2E_EVIDENCE_INTENT: "update-tracked-evidence",
    GVO_E2E_EVIDENCE_MODE: "tracked",
    GVO_E2E_EVIDENCE_SCOPE: scope,
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}
process.exit(result.status ?? 1);
