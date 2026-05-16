# Запуск из корня recipe-spa: powershell -ExecutionPolicy Bypass -File scripts/git-push-fix.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$logFile = Join-Path (Get-Location) 'git-push-fix.log'
function Log($msg) { $msg | Tee-Object -FilePath $logFile -Append }
"" | Set-Content $logFile
Log "=== git-push-fix $(Get-Date -Format o) ==="

Log "=== npm test ==="
npm test -- --runInBand --watchAll=false
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Log "=== npm run build (как на CI) ==="
$repoName = (git remote get-url origin 2>$null) -replace '.*[/:]([^/]+?)(?:\.git)?$', '$1'
if (-not $repoName -or $repoName -match '\.github\.io$') {
  $env:VITE_BASE_PATH = "/"
} else {
  $env:VITE_BASE_PATH = "/$repoName/"
}
Log "VITE_BASE_PATH=$($env:VITE_BASE_PATH)"
$env:VITE_ENABLE_MSW = "true"
$env:VITE_API_URL = "/api"
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Log "=== verify-dist ==="
node scripts/verify-dist.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Log "=== git commit & push ==="
git add -A
git status
git commit -m "fix: CI tsc exclude tests, GitHub Pages bootstrap and API paths"
if ($LASTEXITCODE -ne 0) { Log "Нечего коммитить или коммит уже есть" }
$branch = git branch --show-current
git push -u origin $branch
Log "Готово."
