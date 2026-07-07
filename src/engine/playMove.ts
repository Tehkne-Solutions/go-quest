import type { Board, PlayerColor, Position } from "../types/game";
import type { TutorEvent } from "../types/tutor";
import { findGroup } from "./findGroup";
import { getNeighbors } from "./getNeighbors";
import { getStoneLiberties } from "./getStoneLiberties";
import { removeGroup } from "./removeGroup";

export type MoveResult = {
  board: Board;
  success: boolean;
  captured: Position[];
  message: string;
  tutorEvents: TutorEvent[];
};

function colorLabel(color: PlayerColor): string {
  return color === "BLACK" ? "preta" : "branca";
}

export function playMove(
  board: Board,
  position: Position,
  color: PlayerColor
): MoveResult {
  const cell = board[position.y][position.x];

  if (cell.state !== "EMPTY") {
    return {
      board,
      success: false,
      captured: [],
      message: "Essa casa já está ocupada.",
      tutorEvents: [
        {
          title: "Jogada bloqueada",
          goExplanation: "Você só pode jogar em casas vazias.",
          devExplanation:
            "Antes de alterar a matriz, o motor verificou que essa célula não está com estado EMPTY.",
          codeFocus: "if (cell.state !== 'EMPTY')"
        }
      ]
    };
  }

  let nextBoard = structuredClone(board) as Board;

  nextBoard[position.y][position.x] = {
    position,
    state: color
  };

  const opponent: PlayerColor = color === "BLACK" ? "WHITE" : "BLACK";
  const neighbors = getNeighbors(nextBoard, position);
  let captured: Position[] = [];

  const tutorEvents: TutorEvent[] = [
    {
      title: "Pedra colocada",
      goExplanation: `Você colocou uma pedra ${colorLabel(color)} no tabuleiro.`,
      devExplanation: `A célula board[${position.y}][${position.x}] mudou de EMPTY para ${color}.`,
      codeFocus: "nextBoard[position.y][position.x] = { position, state: color }"
    },
    {
      title: "Vizinhos analisados",
      goExplanation:
        "O jogo olhou para cima, direita, baixo e esquerda. Diagonais não contam como respiração.",
      devExplanation:
        "O motor chamou getNeighbors() para descobrir quais casas encostam na pedra dentro do tabuleiro.",
      codeFocus: "const neighbors = getNeighbors(nextBoard, position)"
    }
  ];

  for (const neighbor of neighbors) {
    const neighborCell = nextBoard[neighbor.y][neighbor.x];

    if (neighborCell.state === opponent) {
      const enemyGroup = findGroup(nextBoard, neighbor);

      tutorEvents.push({
        title: "Grupo inimigo analisado",
        goExplanation:
          "Depois da sua jogada, o jogo verificou se algum grupo inimigo ficou sem liberdades.",
        devExplanation:
          "O motor chamou findGroup() para calcular pedras conectadas e liberdades do grupo inimigo.",
        codeFocus: "const enemyGroup = findGroup(nextBoard, neighbor)"
      });

      if (enemyGroup.liberties.length === 0) {
        captured = [...captured, ...enemyGroup.stones];
        nextBoard = removeGroup(nextBoard, enemyGroup);

        tutorEvents.push({
          title: "Captura detectada",
          goExplanation:
            "O grupo inimigo não tinha mais nenhuma rota de fuga e saiu do tabuleiro.",
          devExplanation:
            "Como enemyGroup.liberties.length era 0, o motor chamou removeGroup() e transformou aquelas células em EMPTY.",
          codeFocus: "if (enemyGroup.liberties.length === 0) removeGroup(...)"
        });
      }
    }
  }

  const ownGroup = findGroup(nextBoard, position);
  const ownLiberties = getStoneLiberties(nextBoard, position);

  tutorEvents.push({
    title: "Liberdades calculadas",
    goExplanation:
      ownGroup.liberties.length === 1
        ? "Atenção: esse grupo está em atari, com apenas uma rota de fuga."
        : `Esse grupo possui ${ownGroup.liberties.length} liberdade(s).`,
    devExplanation:
      "O motor encontrou o grupo da pedra jogada e contou todas as casas vazias conectadas a ele.",
    codeFocus: "const ownGroup = findGroup(nextBoard, position)"
  });

  if (ownGroup.liberties.length === 0 && captured.length === 0) {
    return {
      board,
      success: false,
      captured: [],
      message: "Essa jogada não é permitida porque sua pedra ficaria sem respirar.",
      tutorEvents: [
        ...tutorEvents,
        {
          title: "Jogada sem liberdade",
          goExplanation:
            "Essa pedra nasceria sem nenhuma rota de fuga e não capturaria nada.",
          devExplanation:
            "O motor detectou que o próprio grupo ficou com 0 liberdades e rejeitou a jogada.",
          codeFocus: "if (ownGroup.liberties.length === 0 && captured.length === 0)"
        }
      ]
    };
  }

  return {
    board: nextBoard,
    success: true,
    captured,
    message:
      captured.length > 0
        ? `Você capturou ${captured.length} pedra(s).`
        : `Pedra ${colorLabel(color)} colocada com ${ownLiberties.length} liberdade(s) diretas e ${ownGroup.liberties.length} liberdade(s) no grupo.`,
    tutorEvents: [
      ...tutorEvents,
      {
        title: "Jogada concluída",
        goExplanation:
          captured.length > 0
            ? "Sua jogada fechou todas as liberdades de um grupo inimigo. Isso é uma captura."
            : "Sua pedra entrou no mapa e ainda possui rotas para respirar.",
        devExplanation:
          "O motor retornou um novo estado de tabuleiro para a interface renderizar.",
        codeFocus: "return { board: nextBoard, success: true, captured, message }"
      }
    ]
  };
}
