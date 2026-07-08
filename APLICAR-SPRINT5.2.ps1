Write-Host "Aplicando GoQuest Sprint 5.2 Full Visual..." -ForegroundColor Cyan
$source = ".\goquest-sprint5.2-full-visual-overlay"
if (Test-Path $source) {
  Copy-Item -Recurse -Force "$source\*" "."
  Remove-Item -Recurse -Force $source
}
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
Write-Host "Aplicado. Rode: npm run dev" -ForegroundColor Green
Write-Host "Valide se aparece: GoQuest Sprint 5.2" -ForegroundColor Yellow
