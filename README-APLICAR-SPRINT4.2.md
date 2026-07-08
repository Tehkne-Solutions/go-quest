# GoQuest Sprint 4.2 — Sprite Real + UI Corrigida

**Assinatura:** Tehkné Solutions

Este ZIP é um overlay completo para aplicar por cima do repo local `go-quest`.

## O que este patch faz

1. Troca as peças SVG/CSS genéricas por sprites reais em PNG.
2. Adiciona assets em `public/assets/units/`:
   - `scout.png`
   - `hunter.png`
   - `guard.png`
   - `link.png`
   - `builder.png`
   - `raider.png`
   - `goquest-spritesheet-fantasia-wow-02-all-classes.png`
3. Reorganiza a tela principal com:
   - Jornada;
   - Puzzles;
   - Campo livre;
   - Rejogar;
   - Limpar progresso;
   - câmeras do tabuleiro.
4. Corrige UI cortando lateral/painel.
5. Mantém o tabuleiro em 2.5D/isométrico, mas com sprites verticais reais.
6. Adiciona progressão persistida em `localStorage` v4.2.

## Como aplicar

No PowerShell, dentro do repo local:

```powershell
cd "W:\TEHKNE-SOLUTIONS\PROJETOS\go-quest"

# opcional, mas recomendado
copy . "..\go-quest-backup-sprint4-2" -Recurse

Expand-Archive -Path "$env:USERPROFILE\Downloads\goquest-sprint4.2-sprite-overlay.zip" -DestinationPath "." -Force

Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

npm install
npm run lint
npm run build
npm run dev
```

No navegador:

```text
Ctrl + F5
```

Se o progresso antigo atrapalhar, use o botão **Limpar progresso** na UI.

## Commit

```powershell
git status --short
git add -A
git status --short
git commit -m "feat: add real sprite units and fixed tactical UI"
git push origin main
```

Antes do commit, confirme que `node_modules/` não aparece no `git status`.

---

Tehkné Solutions
