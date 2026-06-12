param(
  [string]$Python = "python",
  [string]$Gitleaks = "gitleaks",
  [string]$SourcePath = "."
)

Write-Host "== OKUA frontend security checks =="

if (-not $env:PRE_COMMIT_HOME) {
  $env:PRE_COMMIT_HOME = ".pre-commit-cache"
}

Write-Host "== pre-commit =="
& $Python -m pre_commit run --all-files
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host "== gitleaks =="
& $Gitleaks detect --source $SourcePath --redact --verbose
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

if (Test-Path "package.json") {
  Write-Host "== package.json detected =="

  if (-not $env:npm_config_cache) {
    $env:npm_config_cache = ".npm-cache"
  }

  $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json

  if (Test-Path "pnpm-lock.yaml") {
    $pm = "pnpm"
  } elseif (Test-Path "package-lock.json") {
    $pm = "npm"
  } elseif (Test-Path "yarn.lock") {
    $pm = "yarn"
  } else {
    $pm = "npm"
  }

  Write-Host "Package manager candidate: $pm"

  if (-not (Get-Command $pm -ErrorAction SilentlyContinue)) {
    Write-Error "Package manager not available: $pm"
    exit 1
  }

  $auditExit = 0
  if ($pm -eq "pnpm") {
    pnpm audit
    $auditExit = $LASTEXITCODE
  } elseif ($pm -eq "npm") {
    npm audit
    $auditExit = $LASTEXITCODE
  } elseif ($pm -eq "yarn") {
    yarn audit
    $auditExit = $LASTEXITCODE
  }

  if ($auditExit -ne 0) {
    Write-Host "Package audit returned exit code $auditExit; classify this result before blocking adoption."
  }

  if ($pkg.scripts) {
    $scripts = $pkg.scripts.PSObject.Properties.Name

    if ($scripts -contains "lint") {
      Write-Host "== frontend lint =="
      if ($pm -eq "pnpm") { pnpm run lint }
      elseif ($pm -eq "yarn") { yarn run lint }
      else { npm run lint }
      if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }

    if ($scripts -contains "typecheck") {
      Write-Host "== typecheck =="
      if ($pm -eq "pnpm") { pnpm run typecheck }
      elseif ($pm -eq "yarn") { yarn run typecheck }
      else { npm run typecheck }
      if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }

    if ($scripts -contains "test") {
      Write-Host "== test =="
      if ($pm -eq "pnpm") { pnpm test }
      elseif ($pm -eq "yarn") { yarn test }
      else { npm test }
      if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }
  }
} else {
  Write-Host "No package.json found; skipping frontend package checks."
}

Write-Host "== OKUA frontend security checks completed =="
