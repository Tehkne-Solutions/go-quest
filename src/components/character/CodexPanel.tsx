import { roleLabels } from "../../data/characters";
import type { CharacterRole } from "../../types/character";

const roles = Object.entries(roleLabels) as Array<[CharacterRole, string]>;

const roleDescriptions: Record<CharacterRole, string> = {
  SCOUT: "Batedor ágil. Explora pontos livres, abre visão e ensina liberdade.",
  HUNTER: "Caçador tático. Fecha rotas de fuga e ensina captura.",
  GUARD: "Guardião blindado. Protege grupos, segura pressão e ensina defesa.",
  LINK: "Conector arcano. Une tropas separadas e ensina conexão.",
  BUILDER: "Arquiteto anão. Constrói estruturas e ensina território.",
  RAIDER: "Saqueador orc. Invade brechas e ensina pressão."
};

export function CodexPanel() {
  return (
    <section className="panel codex-panel">
      <p className="eyebrow">Codex de facções</p>
      <h2>Companhias do tabuleiro</h2>
      <p>
        As regras continuam sendo Go. A fantasia medieval transforma cada função estratégica em uma unidade memorável.
      </p>

      <div className="codex-factions">
        <article className="faction-badge faction-badge--horde">Pretas: Horda</article>
        <article className="faction-badge faction-badge--alliance">Brancas: Aliança</article>
      </div>

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
