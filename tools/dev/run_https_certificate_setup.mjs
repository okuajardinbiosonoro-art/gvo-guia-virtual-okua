import { spawnSync } from "node:child_process";
import { join } from "node:path";

const windowsDirectory = process.env.SystemRoot ?? process.env.WINDIR;
if (!windowsDirectory) {
  throw new Error("No se encontró SystemRoot/WINDIR para iniciar Windows PowerShell.");
}

const powershell = join(
  windowsDirectory,
  "System32",
  "WindowsPowerShell",
  "v1.0",
  "powershell.exe",
);
const environment = { ...process.env };
delete environment.PSModulePath;

const result = spawnSync(
  powershell,
  [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    "tools/dev/ensure_https_certificate.ps1",
  ],
  {
    cwd: process.cwd(),
    env: environment,
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}
process.exit(result.status ?? 1);
