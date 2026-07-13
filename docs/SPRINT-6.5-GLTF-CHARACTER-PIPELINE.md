# GoQuest Sprint 6.5 — GLTF Character Pipeline

**Assinatura:** Tehkné Solutions

## Objetivo

Parar de depender de peças desenhadas por CSS/canvas/geometria solta e passar a usar uma pipeline de assets 3D carregados como arquivos `.gltf`.

## O que mudou

- `scripts/generate-goquest-models.mjs` gera 12 modelos GLTF antes de `dev` e `build`.
- Os modelos ficam em:
  - `public/assets/goquest/models/horde/*.gltf`
  - `public/assets/goquest/models/alliance/*.gltf`
- `CharacterModel3D.tsx` carrega os modelos com `GLTFLoader`.
- `Piece3D.tsx` renderiza o pedestal + modelo GLTF.
- `FallbackPiece3D.tsx` entra apenas se o GLTF não carregar.
- O clique continua preso à interseção/pedestal lógico, não à peça.

## Classes geradas

- scout
- hunter
- guard
- link
- builder
- raider

Cada classe possui variação para:

- Horda / peças pretas
- Aliança / peças brancas

## Como validar

```powershell
npm install
npm run build
npm run dev
```

O script de geração roda automaticamente em:

```json
"predev": "node scripts/generate-goquest-models.mjs",
"prebuild": "node scripts/generate-goquest-models.mjs"
```

## Próxima etapa

Esta sprint cria assets GLTF reais gerados pelo projeto. Para chegar em arte final de RPG/RTS, substitua os arquivos `.gltf` gerados por modelos exportados do Blender/Mixamo/Sketchfab/Quaternius, mantendo os mesmos caminhos e nomes.
