import type { Board, PlayerColor, Position } from "../types/game";
import type { StoneCharacter } from "../types/character";
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
  color: PlayerColor,
  character?: StoneCharacter
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
          goExplanation: "Você só pode mover tropas para casas vazias do campo.",
          devExplanation: "Antes de alterar a matriz, o motor verificou que essa célula não está com estado EMPTY.",
          codeFocus: "if (cell.state !== 'EMPTY')"
        }
      ]
    };
  }

  let nextBoard = structuredClone(board) as Board;
  nextBoard[position.y][position.x] = { position, state: color, character };

  const opponent: PlayerColor = color === "BLACK" ? "WHITE" : "BLACK";
  const neighbors = getNeighbors(nextBoard, position);
  let captured: Position[] = [];
  const actorName = character ? `${character.name}, ${character.title}` : `pedra ${colorLabel(color)}`;

  const tutorEvents: TutorEvent[] = [
    {
      title: "Personagem convocado",
      goExplanation: `${actorName} entrou no tabuleiro. No Go oficial isso ainda é uma pedra ${colorLabel(color)}, mas no GoQuest ela ganha papel de unidade medieval.`,
      devExplanation: `A célula board[${position.y}][${position.x}] mudou de EMPTY para ${color} e recebeu um objeto character.`,
      codeFocus: "nextBoard[position.y][position.x] = { position, state: color, character }"
    },
    {
      title: "Vizinhos analisados",
      goExplanation: "A unidade só respira e se conecta pelas quatro direções do mapa: norte, leste, sul e oeste. Diagonais não contam.",
      devExplanation: "O motor chamou getNeighbors() para descobrir quais casas encostam na unidade dentro do tabuleiro.",
      codeFocus: "const neighbors = getNeighbors(nextBoard, position)"
    }
  ];

  for (const neighbor of neighbors) {
    const neighborCell = nextBoard[neighbor.y][neighbor.x];

    if (neighborCell.state === opponent) {
      const enemyGroup = findGroup(nextBoard, neighbor);

      tutorEvents.push({
        title: "Companhia inimiga analisada",
        goExplanation: "Depois da sua jogada, o jogo verificou se alguma tropa inimiga ficou sem rotas de fuga.",
        devExplanation: "O motor chamou findGroup() para calcular unidades conectadas e liberdades do grupo inimigo.",
        codeFocus: "const enemyGroup = findGroup(nextBoard, neighbor)"
      });

      if (enemyGroup.liberties.length === 0) {
        captured = [...captured, ...enemyGroup.stones];
        nextBoard = removeGroup(nextBoard, enemyGroup);

        tutorEvents.push({
          title: "Cerco completo",
          goExplanation: "A companhia inimiga perdeu todas as rotas de fuga e foi removida do campo de batalha.",
          devExplanation: "Como enemyGroup.liberties.length era 0, o motor chamou removeGroup() e transformou aquelas células em EMPTY.",
          codeFocus: "if (enemyGroup.liberties.length === 0) removeGroup(...)"
        });
      }
    }
  }

  const ownGroup = findGroup(nextBoard, position);
  const ownLiberties = getStoneLiberties(nextBoard, position);

  tutorEvents.push({
    title: "Rotas de fuga calculadas",
    goExplanation:
      ownGroup.liberties.length === 1
        ? "Alerta de batalha: essa companhia está em atari, com apenas uma rota de fuga."
        : `Essa companhia possui ${ownGroup.liberties.length} rota(s) de fuga compartilhadas.`,
    devExplanation: "O motor encontrou o grupo da unidade jogada e contou todas as casas vazias conectadas a ele.",
    codeFocus: "const ownGroup = findGroup(nextBoard, position)"
  });

  if (ownGroup.liberties.length === 0 && captured.length === 0) {
    return {
      board,
      success: false,
      captured: [],
      message: "Essa jogada não é permitida porque sua unidade ficaria sem respirar.",
      tutorEvents: [
        ...tutorEvents,
        {
          title: "Unidade sem rota de fuga",
          goExplanation: "Essa unidade entraria no campo já cercada e não capturaria ninguém.",
          devExplanation: "O motor detectou que o próprio grupo ficou com 0 liberdades e rejeitou a jogada.",
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
        ? `${actorName} completou um cerco e capturou ${captured.length} unidade(s).`
        : `${actorName} entrou em campo com ${ownLiberties.length} rota(s) diretas e ${ownGroup.liberties.length} rota(s) na companhia.`,
    tutorEvents: [
      ...tutorEvents,
      {
        title: "Ordem executada",
        goExplanation:
          captured.length > 0
            ? "Sua jogada fechou todas as rotas de fuga de uma companhia inimiga. Isso é uma captura."
            : "Sua unidade entrou no mapa e ainda possui espaço para respirar.",
        devExplanation: "O motor retornou um novo estado de tabuleiro para a interface renderizar.",
        codeFocus: "return { board: nextBoard, success: true, captured, message }"
      }
    ]
  };
}
