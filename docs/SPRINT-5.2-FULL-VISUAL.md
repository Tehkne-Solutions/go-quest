# GoQuest Sprint 5.2 — Full Visual Overlay

**Assinatura:** Tehkné Solutions

## Objetivo

Aplicar no repo a versão visual mais próxima da referência aprovada:

- Peças 3D recortadas da folha visual aprovada.
- Tabuleiro novo como asset de arena de pedra.
- `main.tsx` já importando o CSS final.
- Tela identificada como `GoQuest Sprint 5.2`.
- Painel direito em abas.
- Campo livre, Jornada e Puzzles integrados.

## Validação

Depois de aplicar, confirme:

```powershell
Select-String -Path ".\src\main.tsx" -Pattern "sprint5.2-full-visual"
Select-String -Path ".\src\screens\BoardScreen.tsx" -Pattern "Sprint 5.2"
Test-Path ".\public\assets\goquest\pieces\scout.png"
Test-Path ".\public\assets\goquest\board\arena-stone-board.png"
```

Todos precisam retornar positivo/True.
