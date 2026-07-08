Write-Host "Aplicando GoQuest Sprint 5.0 Visual Reboot..." -ForegroundColor Cyan
$source = ".\goquest-sprint5-full-overlay"
if (Test-Path $source) {
  Copy-Item -Recurse -Force "$source\*" "."
  Remove-Item -Recurse -Force $source
}
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
Write-Host "Aplicado. Rode: npm run dev" -ForegroundColor Green
Write-Host "Verifique se aparece: GoQuest Sprint 5.0 no hero." -ForegroundColor Yellow
