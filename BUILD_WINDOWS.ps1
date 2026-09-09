$ErrorActionPreference = "Stop"

if (Test-Path ".\src\App.js") {
  Write-Error "OLD FILES DETECTED: .\src\App.js exists. You extracted the clean project over the old frontend. Use a brand-new empty folder."
}
if (Test-Path ".\src\pages") {
  Write-Error "OLD FILES DETECTED: .\src\pages exists. You extracted the clean project over the old frontend. Use a brand-new empty folder."
}

Write-Host "Clean AdGenie Next.js project detected." -ForegroundColor Green
if (Test-Path ".\.next") { Remove-Item -Recurse -Force ".\.next" }
npm install
npm run build
