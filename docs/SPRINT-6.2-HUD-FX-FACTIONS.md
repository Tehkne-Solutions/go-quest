# GoQuest Sprint 6.2 — HUD + FX + Facções

**Assinatura:** Tehkné Solutions

## Objetivo

Aplicar a camada de game feel sobre o core 3D já funcional:

- interface em formato de HUD de jogo;
- partículas para eventos de tabuleiro;
- áudio procedural sem assets externos;
- facções claras: Pretas = Horda, Brancas = Aliança;
- peças não genéricas, com silhueta e cor por classe.

## Eventos com feedback

- `spawn`: invocação da unidade no pedestal;
- `select`: seleção de unidade;
- `group`: união com grupo/companhia;
- `capture`: captura e dissipação;
- `mission`: conclusão de missão/puzzle.

## Regras preservadas

A jogabilidade do Go segue soberana:

- clique continua preso à interseção lógica;
- `playMove` segue como motor oficial;
- peça, pedestal, HUD, som e partículas são camadas visuais;
- nenhuma decoração visual deve bloquear a leitura do tabuleiro.

## Facções

### Horda — Pretas

- ferro bruto;
- vermelho queimado;
- couro escuro;
- postura agressiva.

### Aliança — Brancas

- aço claro;
- azul;
- ouro/marfim;
- postura disciplinada.

## Próxima evolução

Sprint 6.3 deve focar em animações reais de entrada, escala e dissipação por frame, além de modelos GLB quando a direção visual estiver aprovada.
