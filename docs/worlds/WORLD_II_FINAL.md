# Station II: Lía and the invisible pulse

## Contract

Station II teaches how an imperceptible plant signal becomes a mediated result. Navigation advances through six gated layers while preserving access to completed layers. The final layer converges intensity, rhythm, and pitch into one sonic representation; completion opens a centered closure and permits revisiting any unlocked layer.

## Architecture

- Screen orchestration: `src/screens/World2Root/World2RootScreen.tsx`.
- Layer-specific components: capture timeline, mapping panel, mediated result panel, and Lía actor.
- Semantic assets: `world2RuntimeAssets.ts` and `world2SemanticAssetManifest.ts`.
- Editorial content: the editorial registry and resolver.
- Shared interaction cue: `src/components/GestureHint/`.

## Interaction states

`guided -> focused -> resolved -> next unlocked -> completed -> revisitable`

The experience accepts pointer, touch, and keyboard activation where controls are exposed. Reduced-motion preferences suppress nonessential motion. Mobile safe areas and compact-height viewports are covered by responsive rules and visual QA.

## Evidence

The final evidence set and reproducible Playwright runner are documented in [docs/visual/world2/final](../visual/world2/final/README.md).
