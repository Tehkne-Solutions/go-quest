# GoQuest Sprint 6.1 — Fantasy Textured Pieces

Assinatura: Tehkné Solutions

## Objetivo
Substituir o visual simplificado das peças 3D por miniaturas de fantasia mais ricas, baseadas na arte heroica aprovada.

## Estratégia
Em vez de modelagem mesh completa nesta etapa, a sprint usa **impostors 3D**:
- dois planos cruzados por peça;
- textura recortada da miniatura da classe;
- pedestal 3D por classe;
- leitura muito melhor em top, iso e rotated.

## Arquivos alterados
- `src/3d/pieces/Piece3D.tsx`
- `public/assets/goquest/pieces-textured/*.png`

## Resultado esperado
- Scout, Hunter, Guard, Link, Builder e Raider com aparência de miniaturas de fantasia;
- melhor silhueta e leitura visual no tabuleiro;
- sem quebrar a lógica do Go.

## Próxima etapa sugerida
Sprint 6.2: peças mesh 3D reais por classe com animações leves.
