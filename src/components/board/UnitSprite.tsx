import type { CharacterRole } from "../../types/character";
import type { PlayerColor } from "../../types/game";

export type UnitVisualState = "idle" | "move" | "ready" | "attack" | "utility" | "defeated";

type UnitSpriteProps = {
  role: CharacterRole;
  color: PlayerColor;
  state?: UnitVisualState;
  selected?: boolean;
  formation?: boolean;
};

const roleAsset: Record<CharacterRole, string> = {
  SCOUT: "/assets/units/scout.png",
  HUNTER: "/assets/units/hunter.png",
  GUARD: "/assets/units/guard.png",
  LINK: "/assets/units/link.png",
  BUILDER: "/assets/units/builder.png",
  RAIDER: "/assets/units/raider.png"
};

const roleLabel: Record<CharacterRole, string> = {
  SCOUT: "Batedor",
  HUNTER: "Caçador",
  GUARD: "Guardião",
  LINK: "Conector",
  BUILDER: "Arquiteto",
  RAIDER: "Saqueador"
};

export function UnitSprite({
  role,
  color,
  state = "idle",
  selected = false,
  formation = false
}: UnitSpriteProps) {
  return (
    <span
      className={`unit-sprite-shell unit-role-${role.toLowerCase()} unit-team-${color.toLowerCase()} unit-state-${state} ${selected ? "unit-sprite-shell--selected" : ""} ${formation ? "unit-sprite-shell--formation" : ""}`}
      data-role={roleLabel[role]}
    >
      <span className="unit-ground-shadow" />
      <span className="unit-base-disc" />
      {formation && <span className="unit-formation-badge" />}
      <img className="unit-sprite-img" src={roleAsset[role]} alt="" draggable={false} />
    </span>
  );
}
