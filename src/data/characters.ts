import type { CharacterRole, StoneCharacter } from "../types/character";
import type { PlayerColor, Position } from "../types/game";

const hordeNames: Record<CharacterRole, string[]> = {
  SCOUT: ["Aric", "Nyx", "Sorin"],
  HUNTER: ["Kael", "Malrik", "Zev"],
  GUARD: ["Orn", "Dusk", "Vark"],
  LINK: ["Iris", "Noct", "Sable"],
  BUILDER: ["Rurik", "Ebon", "Thane"],
  RAIDER: ["Skarn", "Rhea", "Voss"]
};

const allianceNames: Record<CharacterRole, string[]> = {
  SCOUT: ["Lysa", "Toren", "Vale"],
  HUNTER: ["Mira", "Doran", "Kara"],
  GUARD: ["Brom", "Elia", "Garran"],
  LINK: ["Rowan", "Selene", "Tavio"],
  BUILDER: ["Merek", "Asha", "Corvin"],
  RAIDER: ["Vela", "Nera", "Mora"]
};

const roleDetails: Record<CharacterRole, Omit<StoneCharacter, "id" | "color" | "faction" | "name">> = {
  SCOUT: {
    role: "SCOUT",
    title: "Batedor dos Cantos",
    portraitGlyph: "✦",
    weaponGlyph: "✦",
    personality: "Curioso, veloz e bom para abrir caminho no mapa.",
    battleLine: "Eu avanço primeiro para revelar o território."
  },
  HUNTER: {
    role: "HUNTER",
    title: "Caçador de Liberdades",
    portraitGlyph: "➶",
    weaponGlyph: "➶",
    personality: "Calculista e preciso, fecha rotas de fuga sem desperdício.",
    battleLine: "Cada saída fechada aproxima o inimigo da queda."
  },
  GUARD: {
    role: "GUARD",
    title: "Guardião do Portão",
    portraitGlyph: "◆",
    weaponGlyph: "◆",
    personality: "Leal, firme e focado em proteger o grupo.",
    battleLine: "Enquanto eu estiver aqui, o squad respira."
  },
  LINK: {
    role: "LINK",
    title: "Elo da Companhia",
    portraitGlyph: "✧",
    weaponGlyph: "✧",
    personality: "Diplomático e estratégico, une tropas separadas.",
    battleLine: "Dois grupos unidos viram uma companhia."
  },
  BUILDER: {
    role: "BUILDER",
    title: "Arquiteto de Territórios",
    portraitGlyph: "⚙",
    weaponGlyph: "⚙",
    personality: "Paciente e visionário, transforma espaço em reino.",
    battleLine: "Não luto por impulso. Eu construo domínio."
  },
  RAIDER: {
    role: "RAIDER",
    title: "Saqueador da Névoa",
    portraitGlyph: "▲",
    weaponGlyph: "▲",
    personality: "Agressivo, instável e perigoso quando encontra brechas.",
    battleLine: "Onde há uma abertura, eu invado."
  }
};

export const roleLabels: Record<CharacterRole, string> = {
  SCOUT: "Batedor",
  HUNTER: "Caçador",
  GUARD: "Guardião",
  LINK: "Conector",
  BUILDER: "Arquiteto",
  RAIDER: "Saqueador"
};

export function getRoleForMission(missionId: string): CharacterRole {
  if (missionId === "capture") return "HUNTER";
  if (missionId === "squad") return "LINK";
  return "SCOUT";
}

export function createStoneCharacter(
  color: PlayerColor,
  role: CharacterRole,
  position: Position,
  seed = 0
): StoneCharacter {
  const faction = color === "BLACK" ? "HORDE" : "ALLIANCE";
  const names = faction === "HORDE" ? hordeNames[role] : allianceNames[role];
  const name = names[(position.x + position.y + seed) % names.length];
  const details = roleDetails[role];

  return {
    ...details,
    id: `${faction}_${role}_${position.x}_${position.y}_${seed}_${Date.now()}`,
    color,
    faction,
    name
  };
}

export function createDefaultCharacter(color: PlayerColor, position: Position): StoneCharacter {
  const role: CharacterRole = color === "BLACK" ? "RAIDER" : "GUARD";
  return createStoneCharacter(color, role, position, 1);
}
