# GoQuest — Sprint 4 Isométrica RPG

**Assinatura:** Tehkné Solutions

## Objetivo

Transformar o tabuleiro em um campo de batalha 2.5D/isométrico, com unidades de fantasia medieval, animações leves e formação visual de companhias conectadas.

## Entregas aplicadas no repo

- `.gitignore` para bloquear `node_modules`, `dist`, `.vite`, arquivos `.env` e saídas locais.
- `tsconfig.json` atualizado para `moduleResolution: Bundler`.
- `CameraControls` com quatro visões:
  - Top-down;
  - Isométrico;
  - Cinemático;
  - Rotacionado.
- `BoardGrid` com suporte a câmera e detecção simples de formação por unidade conectada.
- `BoardCell` com estado visual de formação e marcador de acampamento.
- `StoneView` com identidade visual por classe, aura, arma simbólica, inicial e animação.
- `isometric.css` com tabuleiro 2.5D, perspectiva, animações de entrada/idle e auras por papel.
- `game-ui.css` com menu sticky, organização de painéis e layout menos poluído.
- `BoardScreen` com menu superior, controles de câmera, painel de personagem e Codex.

## Observações

As imagens geradas serviram como guia visual. A implementação aplicada no repo é feita em CSS/React para manter o projeto leve e versionável. Sprites raster finais podem ser adicionados futuramente em `public/assets`.

## Próxima etapa

- Substituir os sprites CSS por sprites PNG/WebP recortados em atlas.
- Adicionar animações por estado: idle, movimento, ataque, defesa/utilidade e derrotado.
- Adicionar seleção visual de grupo completo.
- Adicionar evolução de formação com banners, caixas, fogueira e equipamentos quando grupos ficam conectados.
- Permitir transição suave entre câmeras com atalhos e persistência de preferência.

---

Tehkné Solutions
