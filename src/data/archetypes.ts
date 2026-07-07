export type StoneArchetype = {
  id: string;
  name: string;
  lesson: string;
  personality: string;
};

export const stoneArchetypes: StoneArchetype[] = [
  {
    id: "HUNTER",
    name: "Pedra Caçadora",
    lesson: "Captura",
    personality: "Calculista, precisa e focada em fechar rotas."
  },
  {
    id: "LINK",
    name: "Pedra Conectora",
    lesson: "Conexão",
    personality: "Cooperativa, estratégica e protetora do grupo."
  },
  {
    id: "GUARD",
    name: "Pedra Guardiã",
    lesson: "Defesa",
    personality: "Leal, paciente e atenta aos pontos fracos."
  },
  {
    id: "SCOUT",
    name: "Pedra Batedora",
    lesson: "Exploração",
    personality: "Curiosa, rápida e boa para ocupar espaço."
  }
];
