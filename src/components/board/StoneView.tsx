import type { CharacterRole, StoneCharacter } from "../../types/character";
import type { PlayerColor } from "../../types/game";

type StoneViewProps = {
  color: PlayerColor;
  character?: StoneCharacter;
  formation?: boolean;
  selected?: boolean;
};

const roleGlyph: Record<CharacterRole, string> = {
  SCOUT: "♞",
  HUNTER: "➶",
  GUARD: "♜",
  LINK: "✦",
  BUILDER: "⚙",
  RAIDER: "▲"
};

export function StoneView({
  color,
  character,
  formation = false,
  selected = false
}: StoneViewProps) {
  const role: CharacterRole = character?.role ?? "SCOUT";
  const label = character
    ? `${character.name} - ${character.title}`
    : `Unidade ${color === "BLACK" ? "preta" : "branca"}`;

  return (
    <span
      className={[
        "miniature-piece",
        `miniature-piece--${color.toLowerCase()}`,
        `miniature-piece--${role.toLowerCase()}`,
        formation ? "miniature-piece--formation" : "",
        selected ? "miniature-piece--selected" : ""
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      <span className="miniature-piece__shadow" />
      <span className="miniature-piece__pedestal">
        <span className="miniature-piece__pedestal-ring" />
      </span>
      <span className="miniature-piece__body">
        <span className="miniature-piece__head" />
        <span className="miniature-piece__torso" />
        <span className="miniature-piece__left-arm" />
        <span className="miniature-piece__right-arm" />
        <span className="miniature-piece__weapon">{roleGlyph[role]}</span>
      </span>
      <span className="miniature-piece__class-mark" />
    </span>
  );
}
