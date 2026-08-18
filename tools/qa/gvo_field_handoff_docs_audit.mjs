import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const canonicalFiles = [
  "README.md",
  "AGENTS.md",
  "docs/README.md",
  "docs/status/README.md",
  "docs/status/CURRENT_STATE.md",
  "docs/ROADMAP.md",
  "docs/07_ESTRATEGIA_QR_CAMARA.md",
  "docs/05_ARQUITECTURA_TECNICA.md",
  "docs/02_FLUJO_QR_Y_ESTACIONES.md",
  "docs/decisions/ADR-0007-https-local-dinamico-y-scanner-qr-interno.md",
  "docs/qa/GVO_DEBT_015_IN_APP_QR_SCANNER_PHYSICAL_QA.md",
  "docs/field/FIELD_PC_HANDOFF.md",
  "docs/status/GVO_DEBT_011R_ROUTE_CHUNKING_STATUS_RECONCILIATION.md",
  "docs/status/GVO_DEBT_015P_IN_APP_QR_SCANNER_HUMAN_APPROVED_AND_PUBLISHED.md",
  "docs/status/GVO_DEBT_015P_FIELD_HANDOFF_REPOSITORY_CANONICALIZATION_PUBLISHED.md",
];

function fail(message) {
  failures.push(message);
}

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function requireFile(relativePath) {
  if (!fs.existsSync(absolute(relativePath))) {
    fail(`missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolute(relativePath), "utf8");
}

const contents = new Map(
  canonicalFiles.map((relativePath) => [relativePath, requireFile(relativePath)]),
);

let verifiedLinks = 0;
const markdownLinkPattern = /\[[^\]]*\]\(([^)]+)\)/g;

for (const [relativePath, content] of contents) {
  for (const match of content.matchAll(markdownLinkPattern)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, "");
    if (
      rawTarget.startsWith("http://") ||
      rawTarget.startsWith("https://") ||
      rawTarget.startsWith("mailto:") ||
      rawTarget.startsWith("#")
    ) {
      continue;
    }

    const fileTarget = decodeURIComponent(rawTarget.split("#", 1)[0]);
    if (!fileTarget) continue;

    const resolved = path.resolve(
      root,
      path.dirname(relativePath),
      fileTarget,
    );
    if (!fs.existsSync(resolved)) {
      fail(`${relativePath}: broken link ${rawTarget}`);
    } else {
      verifiedLinks += 1;
    }
  }
}

const readme = contents.get("README.md") ?? "";
const handoff = contents.get("docs/field/FIELD_PC_HANDOFF.md") ?? "";
const currentState = contents.get("docs/status/CURRENT_STATE.md") ?? "";
const qrFlow = contents.get("docs/02_FLUJO_QR_Y_ESTACIONES.md") ?? "";
const allCanonical = [...contents.values()].join("\n");
const statusScript = requireFile("tools/print_project_status.mjs");

if (!readme.includes("docs/field/FIELD_PC_HANDOFF.md")) {
  fail("README does not point to FIELD_PC_HANDOFF");
}
if (!handoff.includes("docs/status/CURRENT_STATE.md")) {
  fail("FIELD_PC_HANDOFF does not point to CURRENT_STATE");
}
if (
  !currentState.includes(
    "GVO_DEBT_015P_IN_APP_QR_SCANNER_HUMAN_APPROVED_AND_PUBLISHED.md",
  )
) {
  fail("CURRENT_STATE does not point to the GVO_DEBT_015P authority");
}

const qrDirectory = "docs/assets/qr/interstation";
const qrBases = [
  "gvo_qr_world1_to_world2_v01",
  "gvo_qr_world2_to_world3_v01",
  "gvo_qr_world3_to_world4_v01",
  "gvo_qr_world4_to_world5_v01",
];
let verifiedQrFiles = 0;
for (const base of qrBases) {
  for (const extension of ["png", "svg"]) {
    const relativePath = `${qrDirectory}/${base}.${extension}`;
    if (!fs.existsSync(absolute(relativePath))) {
      fail(`missing canonical QR: ${relativePath}`);
    } else {
      verifiedQrFiles += 1;
    }
  }
}

const historicalStatePatterns = [
  /GVO_DEBT_001[^\n]{0,120}\b(next|siguiente|pr[oó]ximo)\b/iu,
  /Portada[^\n]{0,80}7[,.]8\s*(?:\/\s*10|DE_10)?/iu,
  /GVO_DEBT_011[^\n]{0,160}PENDING_HUMAN_REVIEW/iu,
];
for (const pattern of historicalStatePatterns) {
  if (pattern.test(allCanonical)) {
    fail(`stale canonical state matched: ${pattern}`);
  }
}

for (const contractSource of [readme, handoff, currentState]) {
  if (!contractSource.includes("INSTALACIONES EN EL DISPOSITIVO = 0")) {
    fail("a visitor-contract document lacks the zero-install guarantee");
  }
}

const forbiddenVisitorInstallPatterns = [
  /el visitante debe instalar/iu,
  /el visitante instala (?:una? )?(?:CA|certificado|PWA|app)/iu,
  /visitante.{0,40}Add to Home Screen/iu,
  /cada dispositivo m[oó]vil.{0,100}instalar.{0,60}autoridad/iu,
];
for (const pattern of forbiddenVisitorInstallPatterns) {
  if (pattern.test(allCanonical)) {
    fail(`visitor installation requirement matched: ${pattern}`);
  }
}

if (!qrFlow.includes("AVANCE INTERESTACIÓN POR BOTÓN = PROHIBIDO")) {
  fail("QR flow does not prohibit button-based interstation advancement");
}
if (!qrFlow.includes("/qr/w2") || !qrFlow.includes("/qr/w5")) {
  fail("QR flow does not document the complete interstation payload range");
}
if (!readme.includes("Rama operativa única: `main`")) {
  fail("README does not declare main as the only active branch");
}
if (
  !statusScript.includes("CURRENT_STATE.md") ||
  statusScript.includes("ESTADO_ACTUAL_PROYECTO.md")
) {
  fail("npm run status does not use CURRENT_STATE as its authority");
}

if (failures.length > 0) {
  console.error("GVO_FIELD_HANDOFF_DOCS_AUDIT_FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `GVO_FIELD_HANDOFF_DOCS_AUDIT_PASS canonical=${canonicalFiles.length} links=${verifiedLinks} qr=${verifiedQrFiles}`,
);
