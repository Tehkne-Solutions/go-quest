import type { Board, MissionId, PlayerColor, Position } from "../types/game";
import { boardFromRows } from "../engine/boardFromRows";
import { createBoard } from "../engine/createBoard";

export type Mission = {
  id: MissionId;
  title: string;
  concept: string;
  player: PlayerColor;
  intro: string;
  goal: string;
  expectedMove?: Position;
  successMessage: string;
  devGoal: string;
  createInitialBoard: () => Board;
};

export const missions: Mission[] = [
  {
    id: "breath",
    title: "A Pedra Precisa Respirar",
    concept: "Liberdades",
    player: "BLACK",
    intro:
      "Coloque uma pedra no centro do tabuleiro e observe como ela ganha rotas de fuga.",
    goal: "Clique na casa central x:2, y:2.",
    expectedMove: { x: 2, y: 2 },
    successMessage:
      "Boa. Uma pedra no centro respira melhor porque tem quatro direções disponíveis.",
    devGoal:
      "Ver como uma célula da matriz muda de EMPTY para BLACK e como os vizinhos são calculados.",
    createInitialBoard: () => createBoard(5)
  },
  {
    id: "capture",
    title: "Fechando Rotas",
    concept: "Captura",
    player: "BLACK",
    intro:
      "A pedra branca está quase cercada. Feche a última rota de fuga para capturá-la.",
    goal: "Jogue em x:3, y:2 para capturar a pedra branca.",
    expectedMove: { x: 3, y: 2 },
    successMessage:
      "Captura realizada. Você não atacou a pedra: removeu todas as opções dela.",
    devGoal:
      "Ver o motor chamar findGroup(), detectar liberties.length === 0 e remover o grupo.",
    createInitialBoard: () =>
      boardFromRows([
        ". . . . .",
        ". . B . .",
        ". B W . .",
        ". . B . .",
        ". . . . ."
      ])
  },
  {
    id: "squad",
    title: "Pedras em Squad",
    concept: "Conexão",
    player: "BLACK",
    intro:
      "Duas pedras separadas são frágeis. Coloque uma pedra entre elas para formar um único grupo.",
    goal: "Jogue em x:2, y:1 para conectar as pedras pretas.",
    expectedMove: { x: 2, y: 1 },
    successMessage:
      "Squad conectado. Agora as pedras compartilham liberdades como um grupo.",
    devGoal:
      "Ver a busca em profundidade percorrer pedras vizinhas da mesma cor.",
    createInitialBoard: () =>
      boardFromRows([
        ". . . . .",
        ". B . B .",
        ". . . . .",
        ". . . . .",
        ". . . . ."
      ])
  }
];

export function getMissionById(id: MissionId): Mission {
  return missions.find((mission) => mission.id === id) ?? missions[0];
}
