# 016H Fable handoff - World II Option 2 Signal

Status: handoff pack for Fable / Claude Code.

This folder is documentation only. It does not implement runtime changes, does not edit React or CSS, does not generate new assets, and does not change the current application state.

## Source of truth

- Live repo: `E:\OKUA\04_DESARROLLO_REPOS\gvo-guia-virtual-okua`
- Runtime route: `/estacion/2`
- Branch observed during 016H: `main`
- `HEAD`: `2ba3a30bf48f3282ed701aeb3568390fb2a18bac`
- `origin/main`: `ed62302e733e575b868ee3862f17aafc25016bad`
- Ahead/behind observed: `6 0`
- Remote guard: `git log HEAD..origin/main --oneline` returned no commits.

Do not use any historical `C:` repo path as source of truth. Downloads were used only to read the 016H ticket and the separate Fable brief.

## Human decision encoded here

016G passed tests/build but is not visually approved. Direct Codex iteration on option 2 is paused. This handoff gives Fable enough context to redesign the visual composition and microinteraction with a finer visual pass.

## Approved foundation to preserve

- `015O`: internal layer navigation approved.
- `015J`: dialogue/copy/safe-area approved.
- `015V`: stable visible bottom navigation restored; labels improved; Lia acceptable with minor debt.
- `016D`: unified signal asset integrated in runtime.
- `016F`: correct conceptual separation between static base and expanded animated projection.

## Files in this pack

- `CURRENT_STATE_016G.md`: current runtime state, what works, and why 016G is visually rejected.
- `TARGET_BEHAVIOR_OPTION2_SIGNAL.md`: desired idle and expanded states for Fable.
- `DOM_CSS_CONTRACT.md`: selectors, data attributes, CSS responsibilities, and regression guards.
- `ASSET_MANIFEST_OPTION2.md`: required assets, paths, hashes, dimensions, and forbidden assets.
- `VISUAL_REFERENCES_INDEX.md`: source and copied screenshots to review.
- `ACCEPTANCE_CRITERIA.md`: pass/fail criteria, screenshots, and validations for the next implementation.
- `FABLE_PROMPT_OPTION2_SIGNAL.md`: prompt ready to paste into Fable / Claude Code.
- `handoff.json`: machine-readable summary.
- `visual/`: copied visual references from existing evidence only.

## Files read for this handoff

- `src/screens/World2Root/World2RootScreen.tsx`
- `src/screens/World2Root/World2RootScreen.css`
- `src/screens/World2Root/World2RootScreen.test.tsx`
- `src/screens/World2Root/world2RuntimeAssets.ts`
- `src/screens/World2Root/World2LiaActor.tsx`
- `src/screens/World2Root/world2LiaLayerProfiles.ts`
- `docs/status/016G_WORLD2_OPTION2_SIGNAL_VISUAL_HIERARCHY_EXPANDED_PROJECTION_R1.md`
- `docs/status/016D_WORLD2_OPTION2_SIGNAL_UNIFIED_ASSET_INTEGRATION_R1.md`
- `docs/status/016F_WORLD2_OPTION2_SIGNAL_STATIC_BASE_EXPANDED_SCAN_R1.md`
- `docs/status/015V_WORLD2_FOUNDATION_RECOVERY_LIA_LABELS_NAV_R2.md`
- `docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md`
- `public/assets/gvo/current-used/README.md`
- `C:\Users\JOSE DAVID\Downloads\GVO-FABLE-BRIEF-016H-W2-OPTION2-SIGNAL-INTERACTION-R1.md`

## Non-actions in 016H

- No runtime implementation.
- No CSS or React edits.
- No asset generation.
- No public asset edits.
- No router/editorial registry edits.
- No test/build run required beyond `git diff --check`.
- No commit, push, pull, reset, stash, checkout/switch, merge/rebase, or PR.

READY_FOR_016H_FABLE_HANDOFF_REVIEW
