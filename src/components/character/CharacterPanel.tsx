import type { StoneCharacter } from "../../types/character";
import type { Board, Position } from "../../types/game";
import { findGroup } from "../../engine/findGroup";

function getCharacterPosition(board: Board, character?: StoneCharacter): Position | undefined {
  if (!character) return undefined;

  for (const row of board) {
    for (const cell of row) {
      if (cell.character?.id === character.id) return cell.position;
    }
  }

  return undefined;
}

type CharacterPanelProps = {
  board: Board;
  character?: StoneCharacter;
};

const factionLabel = {
  HORDE: "Horda",
  ALLIANCE: "Aliança"
};

const factionSubLabel = {
  HORDE: "Preta — ferro bruto, vermelho queimado e tática agressiva",
  ALLIANCE: "Branca — aço claro, ouro, azul e formação disciplinada"
};

export function CharacterPanel({ board, character }: CharacterPanelProps) {
  const position = getCharacterPosition(board, character);
  const group = position ? findGroup(board, position) : undefined;
  const formationLevel = group ? Math.max(1, group.stones.length) : 0;
  const risk = group
    ? group.liberties.length <= 1
      ? "Crítico"
      : group.liberties.length <= 2
        ? "Atenção"
        : "Seguro"
    : "-";

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
          <div className={`faction-badge faction-badge--${character.faction.toLowerCase()}`}>
            {factionLabel[character.faction]}
          </div>

          <div className="character-grid">
            <span>Exército</span>
            <strong>{factionLabel[character.faction]}</strong>

            <span>Uniforme</span>
            <strong>{factionSubLabel[character.faction]}</strong>

            <span>Papel</span>
            <strong>{character.role}</strong>

            <span>Posição</span>
            <strong>{position ? `x:${position.x}, y:${position.y}` : "fora do campo"}</strong>

            <span>Rotas</span>
            <strong>{group ? group.liberties.length : 0}</strong>

            <span>Formação</span>
            <strong>{formationLevel > 1 ? `${formationLevel} unidades` : "Solo"}</strong>

            <span>Risco</span>
            <strong>{risk}</strong>
          </div>

          <p>{character.personality}</p>
          <blockquote>{character.battleLine}</blockquote>
        </>
      )}
    </section>
  );
}
