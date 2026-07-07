# GoQuest — Sprint 1 Técnica

**Assinatura:** Tehkné Solutions  
**Status:** Implementada no repositório  
**Base:** React + TypeScript + Vite

## Objetivo

Criar a primeira versão funcional do GoQuest com Modo Tutor duplo:

- Tutor Go: ensina a regra do jogo.
- Tutor Dev: mostra como a lógica foi programada.

## Funcionalidades implementadas

### Motor do jogo

- `createBoard(size)` cria o tabuleiro como matriz.
- `getNeighbors(board, position)` encontra cima, direita, baixo e esquerda.
- `getStoneLiberties(board, position)` calcula liberdades diretas.
- `findGroup(board, start)` encontra pedras conectadas da mesma cor.
- `removeGroup(board, group)` remove grupos capturados.
- `playMove(board, position, color)` executa uma jogada completa.

### Modo Tutor

Cada jogada gera eventos com:

- Título do passo.
- Explicação de Go.
- Explicação de programação.
- Trecho de código em foco.

Eventos principais:

- Pedra colocada.
- Vizinhos analisados.
- Grupo inimigo analisado.
- Captura detectada.
- Liberdades calculadas.
- Jogada concluída.

### Missões implementadas

1. **A Pedra Precisa Respirar**  
   Conceito: liberdades.

2. **Fechando Rotas**  
   Conceito: captura.

3. **Pedras em Squad**  
   Conceito: conexão.

## Critério de aceite atendido

- O app abre com tela funcional.
- O tabuleiro 5x5 aparece.
- O aluno consegue clicar em casas vazias.
- As pedras aparecem no tabuleiro.
- O motor calcula liberdades.
- O motor detecta grupos.
- O motor remove grupos sem liberdade.
- O Tutor Go explica a jogada.
- O Tutor Dev explica a lógica.
- Três missões iniciais estão jogáveis.
- A interface é responsiva.

## Próximo passo

Expandir para a Sprint 2 completa:

- 10 puzzles.
- Tela inicial.
- Jornada refinada.
- XP e medalhas expandidos.
- Modo Debug visual.
- Salvamento local mais completo.

---

Tehkné Solutions
