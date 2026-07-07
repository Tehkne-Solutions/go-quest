import type { StoneCharacter } from "../../types/character";
import type { Board, Position } from "../../types/game";
import { findGroup } from "../../engine/findGroup";

function getCharacterPosition(board: Board, character?: StoneCharacter): Position | undefined {
  if (!character) return undefined;

  for (const row of board) {
    for (const cell of row) {
      if (cell.character?.id === character.id) {
        return cell.position;
      }
    }
  }

  return undefined;
}

type CharacterPanelProps = {
  board: Board;
  character?: StoneCharacter;
};

export function CharacterPanel({ board, character }: CharacterPanelProps) {
  const position = getCharacterPosition(board, character);
  const group = position ? findGroup(board, position) : undefined;

  return (
    <section className="panel character-panel">
      <p className="eyebrow">Unidade selecionada</p>

      {!character && (
        <>
          <h2>Codex vivo</h2>
          <p>Clique em uma unidade no tabuleiro ou convoque uma nova tropa para ver sua ficha.</p>
        </>
      )}

      {character && (
        <>
          <h2>{character.name}</h2>
          <div className="character-title">{character.title}</div>

          <div className="character-grid">
            <span>Facção</span>
            <strong>{character.faction === "CROWN" ? "Coroa de Onix" : "Véu de Marfim"}</strong>

            <span>Papel</span>
            <strong>{character.role}</strong>

            <span>Posição</span>
            <strong>{position ? `x:${position.x}, y:${position.y}` : "fora do campo"}</strong>

            <span>Rotas</span>
            <strong>{group ? group.liberties.length : 0}</strong>
          </div>

          <p>{character.personality}</p>
          <blockquote>{character.battleLine}</blockquote>
        </>
      )}
    </section>
  );
}
