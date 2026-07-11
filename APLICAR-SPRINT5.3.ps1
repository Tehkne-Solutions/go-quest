Write-Host "Aplicando GoQuest Sprint 5.2 + 5.3 Complete Overlay..." -ForegroundColor Cyan
$source = ".\goquest-sprint5.2-5.3-complete-overlay"
if (Test-Path $source) {
  Copy-Item -Recurse -Force "$source\*" "."
  Remove-Item -Recurse -Force $source
}
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
Write-Host "Aplicado. Rode: npm run build && npm run dev" -ForegroundColor Green
Write-Host "Valide se aparece: GoQuest Sprint 5.3" -ForegroundColor Yellow
