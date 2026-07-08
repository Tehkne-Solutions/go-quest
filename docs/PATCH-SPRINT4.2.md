# Patch Técnico — GoQuest Sprint 4.2

## Objetivo

Substituir o visual intermediário das peças por sprites reais baseados no spritesheet de fantasia medieval, corrigindo a UI que cortava painéis e preparando a tela para Jornada, Puzzles e Campo Livre.

## Arquivos principais

### Assets

- `public/assets/units/scout.png`
- `public/assets/units/hunter.png`
- `public/assets/units/guard.png`
- `public/assets/units/link.png`
- `public/assets/units/builder.png`
- `public/assets/units/raider.png`
- `public/assets/units/goquest-spritesheet-fantasia-wow-02-all-classes.png`

### Componentes de tabuleiro

- `src/components/board/UnitSprite.tsx`
  - Novo renderizador de unidade usando PNG real.
- `src/components/board/StoneView.tsx`
  - Passa a renderizar `UnitSprite`.
- `src/components/board/BoardCell.tsx`
  - Suporta célula selecionada, formação e personagem.
- `src/components/board/BoardGrid.tsx`
  - Suporta câmera, seleção e detecção de formação.
- `src/components/board/CameraControls.tsx`
  - Controle de câmera: top, iso, cinematic, rotated.

### Tela

- `src/screens/BoardScreen.tsx`
  - Modos: Jornada, Puzzles, Campo Livre.
  - Rejogar.
  - Limpar progresso.
  - Seleção de personagem.
  - Progressão local v4.2.

### Estilos

- `src/styles/fantasy-board.css`
  - Pele do tabuleiro em pedra/fantasia.
- `src/styles/unit-sprites.css`
  - Sprites reais, ring de time, seleção, formação e idle.
- `src/styles/isometric.css`
  - Câmeras e perspectiva.
- `src/styles/game-ui.css`
  - Layout responsivo sem cortes.

## Observações

O patch usa PNGs individuais para as classes porque isso é mais estável do que usar `background-position` sobre o spritesheet inteiro com títulos e poses múltiplas. O spritesheet completo também fica no projeto como fonte visual e base futura para animações por estado.

Próxima Sprint sugerida: recortar poses adicionais de cada classe e criar estados animados reais: `idle`, `move`, `ready`, `attack`, `utility`, `defeated`.

---

Tehkné Solutions
