# GoQuest Sprint 4.3 — Clean Real Sprites

Este overlay reduz o excesso de glow, melhora a legibilidade das unidades e corrige a UI para não cortar em telas médias.

## Mudanças principais

- Peças reais PNG mantidas, mas sem glow exagerado.
- Base do personagem mais discreta.
- Tamanho de unidade reduzido para evitar sobreposição.
- Tabuleiro menos brilhante e com grid mais limpo.
- UI com breakpoint intermediário: em telas até 1400px, painel direito desce para evitar corte.
- Formação visual mais sutil.

## Aplicar

```powershell
cd "W:\TEHKNE-SOLUTIONS\PROJETOS\go-quest"
Expand-Archive -Path "$env:USERPROFILE\Downloads\goquest-sprint4.3-clean-sprites-overlay.zip" -DestinationPath "." -Force
Copy-Item -Recurse -Force ".\goquest-sprint4.3-clean-sprites-overlay\*" "."
Remove-Item -Recurse -Force ".\goquest-sprint4.3-clean-sprites-overlay"
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
npm run lint
npm run build
npm run dev
```

Tehkné Solutions
