$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$certificateDirectory = Join-Path $repoRoot ".gvo-dev-certs"
$pfxPath = Join-Path $certificateDirectory "gvo-dev-server.pfx"
$rootCerPath = Join-Path $certificateDirectory "GVO_LOCAL_DEVELOPMENT_CA.cer"
$metadataPath = Join-Path $certificateDirectory "metadata.json"
$pfxPassphrase = "gvo-local-development-only"
$rootSubject = "CN=GVO Local Development CA"
$rootFriendlyName = "GVO Local Development CA"
$leafSubject = "CN=GVO Local HTTPS"
$leafFriendlyName = "GVO Local HTTPS (automatic)"

New-Item -ItemType Directory -Path $certificateDirectory -Force | Out-Null

function Get-CurrentIpv4Addresses {
  $addresses = @()
  if (Get-Command Get-NetIPAddress -ErrorAction SilentlyContinue) {
    $addresses = @(
      Get-NetIPAddress -AddressFamily IPv4 -AddressState Preferred -ErrorAction SilentlyContinue |
        Where-Object {
          $_.IPAddress -and
          $_.IPAddress -ne "127.0.0.1" -and
          -not $_.IPAddress.StartsWith("169.254.")
        } |
        Select-Object -ExpandProperty IPAddress
    )
  }

  if ($addresses.Count -eq 0) {
    $addresses = @(
      [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
        Where-Object {
          $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and
          $_.IPAddressToString -ne "127.0.0.1" -and
          -not $_.IPAddressToString.StartsWith("169.254.")
        } |
        ForEach-Object { $_.IPAddressToString }
    )
  }

  return @($addresses | Sort-Object -Unique)
}

function Get-UsableRootCertificate {
  $minimumExpiry = (Get-Date).AddYears(2)
  return Get-ChildItem Cert:\CurrentUser\My |
    Where-Object {
      $_.Subject -eq $rootSubject -and
      $_.HasPrivateKey -and
      $_.NotAfter -gt $minimumExpiry
    } |
    Sort-Object NotAfter -Descending |
    Select-Object -First 1
}

$rootCertificate = Get-UsableRootCertificate
if (-not $rootCertificate) {
  $rootCertificate = New-SelfSignedCertificate `
    -Type Custom `
    -Subject $rootSubject `
    -FriendlyName $rootFriendlyName `
    -KeyAlgorithm RSA `
    -KeyLength 3072 `
    -HashAlgorithm SHA256 `
    -KeyExportPolicy NonExportable `
    -KeyUsage CertSign, CRLSign, DigitalSignature `
    -NotAfter (Get-Date).AddYears(10) `
    -CertStoreLocation Cert:\CurrentUser\My `
    -TextExtension @("2.5.29.19={critical}{text}ca=TRUE&pathlength=0")
}

Export-Certificate -Cert $rootCertificate -FilePath $rootCerPath -Force | Out-Null
$trustedRoot = Get-ChildItem Cert:\CurrentUser\Root |
  Where-Object { $_.Thumbprint -eq $rootCertificate.Thumbprint } |
  Select-Object -First 1
if (-not $trustedRoot) {
  Import-Certificate `
    -FilePath $rootCerPath `
    -CertStoreLocation Cert:\CurrentUser\Root | Out-Null
}

$ipv4Addresses = @(Get-CurrentIpv4Addresses)
$dnsNames = @("localhost", [System.Net.Dns]::GetHostName()) | Sort-Object -Unique
$allIpAddresses = @("127.0.0.1") + $ipv4Addresses | Sort-Object -Unique
$sanParts = @($dnsNames | ForEach-Object { "DNS=$_" })
$sanParts += @($allIpAddresses | ForEach-Object { "IPAddress=$_" })
$sanExtension = "2.5.29.17={text}" + ($sanParts -join "&")
$sanSignature = (@($dnsNames | ForEach-Object { "dns:$_" }) + @($allIpAddresses | ForEach-Object { "ip:$_" }) | Sort-Object) -join "|"

$metadata = $null
if (Test-Path -LiteralPath $metadataPath -PathType Leaf) {
  try {
    $metadata = Get-Content -LiteralPath $metadataPath -Raw | ConvertFrom-Json
  } catch {
    $metadata = $null
  }
}

$leafCertificate = $null
if (
  $metadata -and
  $metadata.rootThumbprint -eq $rootCertificate.Thumbprint -and
  $metadata.sanSignature -eq $sanSignature -and
  (Test-Path -LiteralPath $pfxPath -PathType Leaf)
) {
  $leafCertificate = Get-ChildItem Cert:\CurrentUser\My |
    Where-Object {
      $_.Thumbprint -eq $metadata.leafThumbprint -and
      $_.HasPrivateKey -and
      $_.NotAfter -gt (Get-Date).AddDays(30)
    } |
    Select-Object -First 1
}

if (-not $leafCertificate) {
  $leafCertificate = New-SelfSignedCertificate `
    -Type Custom `
    -Subject $leafSubject `
    -FriendlyName $leafFriendlyName `
    -Signer $rootCertificate `
    -KeyAlgorithm RSA `
    -KeyLength 2048 `
    -HashAlgorithm SHA256 `
    -KeyExportPolicy Exportable `
    -KeyUsage DigitalSignature, KeyEncipherment `
    -NotAfter (Get-Date).AddDays(397) `
    -CertStoreLocation Cert:\CurrentUser\My `
    -TextExtension @(
      "2.5.29.19={critical}{text}ca=FALSE",
      "2.5.29.37={text}1.3.6.1.5.5.7.3.1",
      $sanExtension
    )

  $securePassphrase = ConvertTo-SecureString `
    -String $pfxPassphrase `
    -AsPlainText `
    -Force
  Export-PfxCertificate `
    -Cert $leafCertificate `
    -FilePath $pfxPath `
    -Password $securePassphrase `
    -ChainOption BuildChain `
    -Force | Out-Null
}

$urls = @($ipv4Addresses | ForEach-Object { "https://${_}:5173" })
$metadataOutput = [ordered]@{
  schemaVersion = 1
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  rootThumbprint = $rootCertificate.Thumbprint
  rootExpiresAt = $rootCertificate.NotAfter.ToUniversalTime().ToString("o")
  leafThumbprint = $leafCertificate.Thumbprint
  leafExpiresAt = $leafCertificate.NotAfter.ToUniversalTime().ToString("o")
  dnsNames = $dnsNames
  ipv4Addresses = $allIpAddresses
  sanSignature = $sanSignature
  urls = $urls
}
$metadataOutput | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $metadataPath -Encoding UTF8

Write-Host "GVO HTTPS local listo."
Write-Host "Autoridad publica para dispositivos: $rootCerPath"
Write-Host "La autoridad se conserva; el certificado servidor se renueva automaticamente cuando cambian las IP activas."
Write-Host "URLs LAN detectadas:"
if ($urls.Count -eq 0) {
  Write-Host "  (sin IPv4 LAN activa; localhost sigue cubierto)"
} else {
  $urls | ForEach-Object { Write-Host "  $_" }
}
