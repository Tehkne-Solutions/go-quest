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
    title: "O Primeiro Batedor",
    concept: "Liberdades",
    player: "BLACK",
    intro: "Convoque um batedor no centro do mapa e observe como ele abre quatro rotas de fuga.",
    goal: "Clique na casa central x:2, y:2.",
    expectedMove: { x: 2, y: 2 },
    successMessage: "Boa. Um batedor no centro respira melhor porque vigia quatro direções do campo.",
    devGoal: "Ver como uma célula da matriz muda de EMPTY para BLACK e como os vizinhos são calculados.",
    createInitialBoard: () => createBoard(5)
  },
  {
    id: "capture",
    title: "Cerco na Estrada Norte",
    concept: "Captura",
    player: "BLACK",
    intro: "Uma tropa rival está quase cercada. Feche a última rota de fuga para concluir o cerco.",
    goal: "Jogue em x:3, y:2 para capturar a tropa branca.",
    expectedMove: { x: 3, y: 2 },
    successMessage: "Cerco concluído. Você não atacou a unidade diretamente: removeu todas as opções dela.",
    devGoal: "Ver o motor chamar findGroup(), detectar liberties.length === 0 e remover o grupo.",
    createInitialBoard: () => boardFromRows([". . . . .", ". . B . .", ". B W . .", ". . B . .", ". . . . ."])
  },
  {
    id: "squad",
    title: "A Companhia Unida",
    concept: "Conexão",
    player: "BLACK",
    intro: "Duas unidades aliadas estão separadas. Coloque uma unidade entre elas para formar uma companhia.",
    goal: "Jogue em x:2, y:1 para conectar as unidades pretas.",
    expectedMove: { x: 2, y: 1 },
    successMessage: "Companhia formada. Agora as unidades compartilham rotas de fuga como um grupo.",
    devGoal: "Ver a busca em profundidade percorrer unidades vizinhas da mesma cor.",
    createInitialBoard: () => boardFromRows([". . . . .", ". B . B .", ". . . . .", ". . . . .", ". . . . ."])
  }
];

export function getMissionById(id: MissionId): Mission {
  return missions.find((mission) => mission.id === id) ?? missions[0];
}
