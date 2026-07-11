# GoQuest Sprint 5.2 + 5.3 — Complete Visual Overlay

**Assinatura:** Tehkné Solutions

## Inclui

- Sprint 5.2 full visual: tabuleiro premium, peças 3D recortadas da referência, UI com abas.
- Sprint 5.3: correção de ancoragem das peças, billboard/contra-rotação no modo isométrico e ajuste de escala por classe.
- Hotfix TypeScript em `BoardCell.tsx`.
- `vite-env.d.ts` para imports CSS/PNG.
- `main.tsx` importando `sprint5.3-complete-visual.css`.
- Tela marcada como `GoQuest Sprint 5.3`.

## Validação

```powershell
Select-String -Path ".\src\main.tsx" -Pattern "sprint5.3-complete-visual"
Select-String -Path ".\src\screens\BoardScreen.tsx" -Pattern "Sprint 5.3"
Test-Path ".\public\assets\goquest\pieces\scout.png"
Test-Path ".\public\assets\goquest\board\arena-stone-board.png"
npm run build
```

## Objetivo visual

O tabuleiro continua inclinado no modo ISO, mas a miniatura recebe contra-rotação para parecer mais em pé e menos achatada.
