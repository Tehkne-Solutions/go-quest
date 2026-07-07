import { roleLabels } from "../../data/characters";
import type { CharacterRole } from "../../types/character";

const roles = Object.entries(roleLabels) as Array<[CharacterRole, string]>;

const roleDescriptions: Record<CharacterRole, string> = {
  SCOUT: "Explora pontos livres e ensina abertura de mapa.",
  HUNTER: "Fecha rotas de fuga e ensina captura.",
  GUARD: "Protege grupos e ensina defesa.",
  LINK: "Une tropas separadas e ensina conexão.",
  BUILDER: "Constrói espaço e ensina território.",
  RAIDER: "Invade brechas e ensina pressão."
};

export function CodexPanel() {
  return (
    <section className="panel codex-panel">
      <p className="eyebrow">Codex de facções</p>
      <h2>Companhias do tabuleiro</h2>
      <p>
        As regras continuam sendo Go. A fantasia medieval serve para transformar cada função estratégica em uma unidade memorável.
      </p>

      <div className="codex-list">
        {roles.map(([role, label]) => (
          <article key={role}>
            <strong>{label}</strong>
            <span>{roleDescriptions[role]}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
