# GoQuest — A Jornada dos Territórios

Curso gamificado e app educativo para aprender Go usando metáforas de RPG, estratégia, lógica de programação e modo Tutor Dev.

**Assinatura:** Tehkné Solutions

## Sprint atual

A base inicial implementa a Sprint 1 Técnica e já inicia a fundação da Sprint 2.

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
  - A Pedra Precisa Respirar.
  - Fechando Rotas.
  - Pedras em Squad.

### Base iniciada da Sprint 2

- XP local.
- Medalhas.
- Progresso persistido em `localStorage`.
- Seletor de missões do Mundo 1.
- Interface responsiva com visual premium.

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
    engine/
    screens/
    styles/
    types/
```

## Próxima Sprint

Sprint 2 completa:

- Tela inicial.
- Jornada do Mundo 1 mais completa.
- 10 puzzles iniciais.
- Modo Debug visual com liberdades destacadas.
- Feedback animado.
- Melhorias de UX mobile.
- Preparação para tabuleiro 7x7.

## Produto

O GoQuest ensina duas coisas em paralelo:

1. **Go como jogador:** respirar, conectar, cercar, capturar e controlar território.
2. **Programação como dev:** matriz, estado, funções, vizinhos, busca, grupos e regras de jogo.

---

Tehkné Solutions
