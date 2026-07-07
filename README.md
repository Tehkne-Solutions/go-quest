# GoQuest — A Jornada dos Territórios

Curso gamificado e app educativo para aprender Go usando metáforas de RPG, estratégia, lógica de programação, personagens medievais e modo Tutor Dev.

**Assinatura:** Tehkné Solutions

## Sprint atual

A base inicial implementa a Sprint 1 Técnica, inicia a fundação da Sprint 2 e adiciona a primeira camada de imersão medieval.

### Entregue na Sprint 1

- App React + TypeScript com Vite.
- Tabuleiro 5x5 clicável.
- Motor de jogo com matriz, vizinhos, liberdades, grupos e captura.
- Bloqueio de jogada em casa ocupada.
- Bloqueio de jogada sem liberdade quando não captura.
- Modo Tutor Go explicando o conceito da jogada.
- Modo Tutor Dev explicando a lógica do código.
- Log de eventos da jogada.
- Três missões iniciais:
  - O Primeiro Batedor.
  - Cerco na Estrada Norte.
  - A Companhia Unida.

### Base iniciada da Sprint 2

- XP local.
- Medalhas.
- Progresso persistido em `localStorage`.
- Seletor de missões do Mundo 1.
- Interface responsiva com visual premium.

### Camada de imersão medieval

- Cada jogada cria um personagem associado à unidade colocada no tabuleiro.
- Personagens possuem facção, papel, nome, título, personalidade e fala de batalha.
- O motor aceita personagem opcional em cada jogada e guarda esse personagem na célula do tabuleiro.
- As missões foram reescritas como cenas de campanha medieval.
- As peças agora recebem camada visual de unidade no tabuleiro.

## Rodando localmente

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Typecheck:

```bash
npm run lint
```

## Estrutura principal

```txt
go-quest/
  src/
    components/
      board/
      tutor/
    data/
      characters.ts
      missions.ts
    engine/
    screens/
    styles/
    types/
      character.ts
      game.ts
      tutor.ts
```

## Próxima Sprint

Sprint 2 completa:

- Tela inicial.
- Jornada do Mundo 1 mais completa.
- 10 puzzles iniciais.
- Modo Debug visual com liberdades destacadas.
- Feedback animado.
- Painel de personagem selecionado.
- Codex de facções e unidades.
- Melhorias de UX mobile.
- Preparação para tabuleiro 7x7.

## Produto

O GoQuest ensina duas coisas em paralelo:

1. **Go como jogador:** respirar, conectar, cercar, capturar e controlar território.
2. **Programação como dev:** matriz, estado, funções, vizinhos, busca, grupos e regras de jogo.
3. **Estratégia como fantasia medieval:** cada pedra didática vira uma unidade com função, identidade e papel narrativo.

---

Tehkné Solutions
