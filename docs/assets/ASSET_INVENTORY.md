# Asset inventory

## Runtime policy

Runtime assets are local and referenced through typed registries. Station II source assets live under `public/assets/gvo/stations/world-2/pulse-invisible/runtime/`. Their reviewed deployment mirrors live under `public/assets/gvo/current-used/world-2-root/`. Byte-identical files across those trees are intentional policy mirrors, not accidental duplicates.

Shared gesture assets live under `public/assets/gvo/shared/gesture-hints/runtime/` with a corresponding `current-used/shared/gesture-hints/` mirror. Lía uses the established shared current-used set.

## Station II groups

- Atmosphere and background
- Plant and bioelectric contact
- Signal and waveform projections
- Capture and conditioning sequences
- Dialogue, Lía effects, and micro-scenes
- Layer navigation and route/result assets

The executable source of truth is `src/screens/World2Root/world2RuntimeAssets.ts`; semantic layer ownership is in `world2SemanticAssetManifest.ts`. Assets not referenced by runtime may remain only when they are documented source references. Generated QA captures do not belong in `public/`.
