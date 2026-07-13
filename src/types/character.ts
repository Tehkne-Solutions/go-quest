import type { PlayerColor } from "./game";

export type CharacterRole = "SCOUT" | "HUNTER" | "GUARD" | "LINK" | "BUILDER" | "RAIDER";

export type CharacterFaction = "HORDE" | "ALLIANCE";

export type StoneCharacter = {
  id: string;
  color: PlayerColor;
  faction: CharacterFaction;
  role: CharacterRole;
  name: string;
  title: string;
  portraitGlyph: string;
  weaponGlyph: string;
  personality: string;
  battleLine: string;
};
