import type { CharacterRole, StoneCharacter } from "../../types/character";
import type { PlayerColor } from "../../types/game";

type StoneViewProps = {
  color: PlayerColor;
  character?: StoneCharacter;
  formation?: boolean;
  selected?: boolean;
};

const roleAsset: Record<CharacterRole, string> = {
  SCOUT: "/assets/goquest/pieces/scout.png",
  HUNTER: "/assets/goquest/pieces/hunter.png",
  GUARD: "/assets/goquest/pieces/guard.png",
  LINK: "/assets/goquest/pieces/link.png",
  BUILDER: "/assets/goquest/pieces/builder.png",
  RAIDER: "/assets/goquest/pieces/raider.png"
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
        "asset-piece",
        `asset-piece--${color.toLowerCase()}`,
        `asset-piece--${role.toLowerCase()}`,
        formation ? "asset-piece--formation" : "",
        selected ? "asset-piece--selected" : ""
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      <span className="asset-piece__shadow" />
      <span className="asset-piece__pedestal" />
      <span className="asset-piece__figure">
        <img src={roleAsset[role]} alt="" className="asset-piece__img" draggable={false} />
      </span>
    </span>
  );
}
