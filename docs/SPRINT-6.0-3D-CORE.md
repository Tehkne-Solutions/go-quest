# GoQuest Sprint 6.0 — 3D Core

**Assinatura:** Tehkné Solutions

## Objetivo

Substituir a dependência de sprites/pseudo-3D por uma camada 3D real, sem mexer no motor de Go.

## Entregas

- Instala `three` e `@react-three/fiber`.
- Cena 3D com Canvas.
- Tabuleiro 3D com base, grid e interseções.
- Interseções clicáveis independentes das peças.
- Peças 3D placeholder por classe.
- Câmeras top, iso, cinematic e rotated.
- `BoardScreen` integrado ao `GoScene3D`.

## Validação

```powershell
npm install
npm run build
npm run dev
```

A jogada deve ocorrer clicando na interseção, não na peça.
