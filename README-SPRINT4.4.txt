GoQuest Sprint 4.4 — Fantasy Premium Overlay
Tehkné Solutions

Aplicar:
1. Extraia este ZIP sobre o repo local.
2. Copie o conteúdo da pasta para a raiz do projeto.
3. Limpe cache do Vite.
4. Rode npm run lint, npm run build e npm run dev.

Comandos:
cd "W:\TEHKNE-SOLUTIONS\PROJETOS\go-quest"
Expand-Archive -Path "$env:USERPROFILE\Downloads\goquest-sprint4.4-fantasy-premium-overlay.zip" -DestinationPath "." -Force
Copy-Item -Recurse -Force ".\goquest-sprint4.4-fantasy-premium-overlay\*" "."
Remove-Item -Recurse -Force ".\goquest-sprint4.4-fantasy-premium-overlay"
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npm install
npm run lint
npm run build
npm run dev
