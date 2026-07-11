Write-Host "Aplicando GoQuest Sprint 6.1 - Fantasy Textured Pieces..." -ForegroundColor Cyan
$source = ".\goquest-sprint6.1-fantasy-textured-pieces-overlay"
if (Test-Path $source) {
  Copy-Item -Recurse -Force "$source\*" "."
  Remove-Item -Recurse -Force $source
}
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
Write-Host "Aplicado. Rode: npm run build && npm run dev" -ForegroundColor Green
