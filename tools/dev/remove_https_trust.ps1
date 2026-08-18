$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$metadataPath = Join-Path $repoRoot ".gvo-dev-certs\metadata.json"
if (-not (Test-Path -LiteralPath $metadataPath -PathType Leaf)) {
  throw "No existe metadata local de GVO; no se eliminó ningún certificado."
}

$metadata = Get-Content -LiteralPath $metadataPath -Raw | ConvertFrom-Json
$thumbprints = @($metadata.rootThumbprint, $metadata.leafThumbprint) |
  Where-Object { $_ -match "^[A-Fa-f0-9]{40}$" } |
  Sort-Object -Unique
if ($thumbprints.Count -ne 2) {
  throw "Metadata incompleta; no se eliminó ningún certificado."
}

foreach ($storeName in @("Root", "My")) {
  foreach ($thumbprint in $thumbprints) {
    $certificatePath = "Cert:\CurrentUser\$storeName\$thumbprint"
    if (Test-Path -LiteralPath $certificatePath -PathType Leaf) {
      Remove-Item -LiteralPath $certificatePath -Force
    }
  }
}

Write-Host "Confianza y certificados HTTPS locales de GVO retirados del usuario actual."
