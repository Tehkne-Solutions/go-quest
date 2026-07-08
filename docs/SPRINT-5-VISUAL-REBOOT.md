# GoQuest Sprint 5.0 — Visual Reboot

**Assinatura:** Tehkné Solutions

## O que muda

Esta entrega troca a linha visual antiga por assets reais:

- `arena-stone-board.png`: tabuleiro/arena de pedra.
- `pieces/*.png`: miniaturas por classe.
- `goquest-crest.png`: brasão da interface.
- `sprint5-visual-reboot.css`: identidade visual e layout.
- `BoardScreen.tsx`: tela integrada com Jornada, Puzzles e Campo Livre.
- `RightPanelTabs.tsx`: painel contextual com abas.

## Validação visual

Depois de aplicar, deve aparecer:

- Header com brasão à esquerda.
- Texto `GoQuest Sprint 5.0`.
- Tabuleiro usando imagem de pedra com ornamentos.
- Peças PNG grandes no tabuleiro, não formas CSS.
- CSS importado via `sprint5-visual-reboot.css`.

## Aplicação

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\goquest-sprint5-full-overlay.zip" -DestinationPath "." -Force
Copy-Item -Recurse -Force ".\goquest-sprint5-full-overlay\*" "."
Remove-Item -Recurse -Force ".\goquest-sprint5-full-overlay"
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npm run dev
```

---
Tehkné Solutions
