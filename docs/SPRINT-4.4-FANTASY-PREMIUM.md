# GoQuest Sprint 4.4 — Fantasy Premium Rework

**Assinatura:** Tehkné Solutions

## Objetivo

Transformar o GoQuest em uma experiência visual mais premium, com identidade de arena fantasy, tabuleiro-terreno e peças com aparência de miniaturas pseudo-3D / xadrez fantasy.

## Principais mudanças

- UI com identidade fantasy premium.
- Layout principal mais organizado.
- Painel direito com abas: Unidade, Tutor Dev, Debug e Codex.
- Tabuleiro com frame, cantos ornamentais e banners.
- Peças deixam de ser sprites soltos e viram miniaturas pseudo-3D.
- Formação recebe camp sutil com banner, caixa e brasa.
- Puzzles e Campo Livre integrados na tela principal.
- Progresso local migrado para `goquest-progress-v4`.

## Arquivos principais

- `src/screens/BoardScreen.tsx`
- `src/components/panels/RightPanelTabs.tsx`
- `src/components/board/BoardFrame.tsx`
- `src/components/board/FormationCamp.tsx`
- `src/components/board/StoneView.tsx`
- `src/styles/fantasy-premium.css`
- `src/styles/premium-board.css`
- `src/styles/miniature-pieces.css`
- `src/styles/isometric.css`

## Aplicação

Extraia o overlay sobre o repositório local e rode:

```powershell
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npm install
npm run lint
npm run build
npm run dev
```

## Testes

1. Limpar progresso.
2. Rodar Jornada.
3. Testar câmeras.
4. Testar Campo Livre.
5. Criar duas unidades conectadas para ver formação.
6. Testar Puzzles.

---
Tehkné Solutions
