import type { Board, Position } from "../types/game";
import { boardFromRows } from "../engine/boardFromRows";

export type Puzzle = {
  id: string;
  title: string;
  concept: string;
  intro: string;
  goal: string;
  solution: Position;
  successMessage: string;
  devGoal: string;
  createInitialBoard: () => Board;
};

export const puzzles: Puzzle[] = [
  {
    id: "p1",
    title: "Emboscada no Centro",
    concept: "Captura em 1 jogada",
    intro: "Uma tropa rival está cercada no centro. Falta fechar a rota leste.",
    goal: "Jogue em x:3, y:2.",
    solution: { x: 3, y: 2 },
    successMessage: "Cerco perfeito. A companhia rival perdeu a última rota de fuga.",
    devGoal: "Ver findGroup calcular zero liberdades e remover a unidade branca.",
    createInitialBoard: () => boardFromRows([". . . . .", ". . B . .", ". B W . .", ". . B . .", ". . . . ."])
  },
  {
    id: "p2",
    title: "Portão da Lateral",
    concept: "Captura na borda",
    intro: "Na lateral do mapa, a tropa inimiga tem menos caminhos para escapar.",
    goal: "Jogue em x:0, y:1.",
    solution: { x: 0, y: 1 },
    successMessage: "A borda virou muralha. A tropa branca foi capturada.",
    devGoal: "Ver getNeighbors ignorar casas fora do tabuleiro.",
    createInitialBoard: () => boardFromRows([". . . . .", ". . . . .", "W B . . .", "B . . . .", ". . . . ."])
  },
  {
    id: "p3",
    title: "Torre do Canto",
    concept: "Captura no canto",
    intro: "No canto, uma unidade tem apenas duas rotas naturais.",
    goal: "Jogue em x:1, y:0.",
    solution: { x: 1, y: 0 },
    successMessage: "A torre caiu. O canto ensina eficiência no cerco.",
    devGoal: "Ver a matriz limitar os vizinhos válidos no canto.",
    createInitialBoard: () => boardFromRows(["W . . . .", "B . . . .", ". . . . .", ". . . . .", ". . . . ."])
  },
  {
    id: "p4",
    title: "Resgate da Guarda",
    concept: "Salvar em atari",
    intro: "Sua guarda está quase cercada. Aumente suas rotas de fuga.",
    goal: "Jogue em x:2, y:1.",
    solution: { x: 2, y: 1 },
    successMessage: "Resgate feito. A guarda ganhou novo caminho para respirar.",
    devGoal: "Ver como uma conexão pode aumentar liberdades do grupo.",
    createInitialBoard: () => boardFromRows([". W . . .", "W B . . .", ". . . . .", ". . . . .", ". . . . ."])
  },
  {
    id: "p5",
    title: "Ponte da Companhia",
    concept: "Conectar grupos",
    intro: "Duas tropas aliadas precisam virar uma companhia.",
    goal: "Jogue em x:2, y:1.",
    solution: { x: 2, y: 1 },
    successMessage: "A ponte foi formada. As unidades agora compartilham força.",
    devGoal: "Ver findGroup percorrer as três unidades conectadas.",
    createInitialBoard: () => boardFromRows([". . . . .", ". B . B .", ". . . . .", ". . . . .", ". . . . ."])
  },
  {
    id: "p6",
    title: "Corte na Trilha",
    concept: "Corte estratégico",
    intro: "Impeça duas tropas inimigas de se unirem.",
    goal: "Jogue em x:2, y:1.",
    solution: { x: 2, y: 1 },
    successMessage: "Corte limpo. Grupos separados são mais frágeis.",
    devGoal: "Ver como ocupar uma célula altera futuras conexões.",
    createInitialBoard: () => boardFromRows([". . . . .", ". W . W .", ". . . . .", ". . . . .", ". . . . ."])
  },
  {
    id: "p7",
    title: "Cerco Duplo",
    concept: "Capturar grupo",
    intro: "Duas unidades rivais compartilham a mesma última rota.",
    goal: "Jogue em x:2, y:2.",
    solution: { x: 2, y: 2 },
    successMessage: "Duas unidades capturadas em um único cerco.",
    devGoal: "Ver removeGroup limpar mais de uma posição da matriz.",
    createInitialBoard: () => boardFromRows([". B B . .", "B W W B .", ". B . . .", ". . . . .", ". . . . ."])
  },
  {
    id: "p8",
    title: "Não Entre no Calabouço",
    concept: "Jogada sem liberdade",
    intro: "Nem todo espaço vazio é seguro. Evite entrar cercado.",
    goal: "Jogue em x:3, y:1.",
    solution: { x: 3, y: 1 },
    successMessage: "Boa leitura. Você evitou o ponto sem fuga.",
    devGoal: "Ver a regra que rejeita jogada com zero liberdades sem captura.",
    createInitialBoard: () => boardFromRows([". W . . .", "W . W . .", ". W . . .", ". . . . .", ". . . . ."])
  },
  {
    id: "p9",
    title: "Olhos do Vigia",
    concept: "Atari",
    intro: "Identifique o grupo vulnerável e responda com uma rota segura.",
    goal: "Jogue em x:2, y:3.",
    solution: { x: 2, y: 3 },
    successMessage: "A companhia ganhou uma saída e saiu do alerta vermelho.",
    devGoal: "Ver como o total de liberdades muda depois da jogada.",
    createInitialBoard: () => boardFromRows([". . . . .", ". B W . .", ". W B W .", ". . W . .", ". . . . ."])
  },
  {
    id: "p10",
    title: "Primeiro Reino",
    concept: "Território inicial",
    intro: "Complete uma pequena cerca para sentir o nascimento do território.",
    goal: "Jogue em x:2, y:2.",
    solution: { x: 2, y: 2 },
    successMessage: "O primeiro reino nasceu. Território é espaço controlado.",
    devGoal: "Preparar a futura camada de leitura de território.",
    createInitialBoard: () => boardFromRows([". . . . .", ". B B . .", ". B . . .", ". . . . .", ". . . . ."])
  }
];
