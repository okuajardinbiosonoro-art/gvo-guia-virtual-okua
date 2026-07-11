# Prompt for Fable / Claude Code

Use this prompt as the starting instruction for the next Fable / Claude Code pass.

```text
You are working in GVO - Guia Virtual OKUA.

Live repo:
E:\OKUA\04_DESARROLLO_REPOS\gvo-guia-virtual-okua

Runtime route:
/estacion/2

Task:
Redesign only World II / Station II / Option 2: Senal / Pulso bioelectrico.

Do not redesign the whole station. Do not touch other stations. Do not touch router, editorial registry, public assets, or main dialogue copy.

Approved foundation to preserve:
- 015O: internal layer navigation approved.
- 015J: dialogue/copy/safe-area approved.
- 015V: stable visible bottom navigation restored; labels improved; Lia acceptable with minor debt.
- 016D: unified electrode + cable + signal PNG integrated in runtime.
- 016F: correct conceptual separation between static base and expanded animated projection.

Current rejected state:
016G passed tests/build but is visually rejected. The pieces are conceptually right, but hierarchy and composition are wrong.

Problems with 016G:
1. The small unified base asset is too dim.
2. The small unified base asset still floats; it must sit on or into a visible plant leaf.
3. The expanded waveform is too small and lateral.
4. Pressing Onda medida should feel like an internal scene focus shift, not a small overlay.
5. The expanded waveform should be comparable in visual importance to option 3 capture or option 4 conditioning micro-scenes.
6. The local explanatory text near Lia is too gray/transparent.
7. The local explanatory text is too similar to the main dialogue panel.
8. No forbidden old artifacts may return.

Likely editable files:
- src/screens/World2Root/World2RootScreen.tsx
- src/screens/World2Root/World2RootScreen.css
- src/screens/World2Root/World2RootScreen.test.tsx

Read-only context files:
- src/screens/World2Root/world2RuntimeAssets.ts
- src/screens/World2Root/World2LiaActor.tsx
- src/screens/World2Root/world2LiaLayerProfiles.ts
- docs/fable/world2/016H-option2-signal-interaction/
- docs/status/016G_WORLD2_OPTION2_SIGNAL_VISUAL_HIERARCHY_EXPANDED_PROJECTION_R1.md
- docs/status/016F_WORLD2_OPTION2_SIGNAL_STATIC_BASE_EXPANDED_SCAN_R1.md
- docs/status/016D_WORLD2_OPTION2_SIGNAL_UNIFIED_ASSET_INTEGRATION_R1.md
- docs/status/015V_WORLD2_FOUNDATION_RECOVERY_LIA_LABELS_NAV_R2.md

Required assets:
1. Static base:
   public/assets/gvo/stations/world-2/pulse-invisible/runtime/signal/world2_signal_probe_cable_waveform_unified_v01.png
   Role: small static unified measurement base, electrode + cable + waveform, on a plant leaf.
2. Expanded projection:
   public/assets/gvo/stations/world-2/pulse-invisible/runtime/signal/world2_signal_waveform_clean_technical_v01.png
   Role: large projected waveform, animated with moving alpha mask.

Do not create or import new assets.

Idle state target:
The plant remains visible. The unified electrode/cable/small-waveform PNG is clearly visible, crisp, and attached to a left-side leaf. It is larger and lower/left compared to 016G. It is static. It has no scan, no mask, no cursor, no tracer, no bead, no CSS/SVG cable, and no separate electrode. Onda medida remains a clear tappable button/label with a subtle cue. Lia stays secondary and does not block the asset.

Expanded state target:
Tapping Onda medida keeps the active layer as option 2 but changes the internal focus to expanded. A large clean waveform projection appears as the visual protagonist. It should feel comparable in scale/protagonism to option 3 capture or option 4 conditioning. It should originate visually from the Onda medida/base asset axis, but it must not cover the main dialogue or bottom nav. Local explanatory text appears near Lia and is clearly distinct from the main dialogue.

Expanded text:
Use a short local title and body. Recommended:

Lectura ampliada
La onda medida se amplia para observar como cambia el pulso bioelectrico antes de convertirse en datos.

Animation contract:
Use moving alpha mask / scanning reveal over a static waveform asset.
Render the clean waveform as a dim full base layer. Render the same image again above it as a brighter layer. Apply a soft vertical alpha band to the brighter layer and move only that mask from left to right. The waveform image must not move, morph, redraw, or use stroke-dashoffset. No point, cursor, tracer, bead, or long vertical ECG reader.

Preserve:
- data-sensitive-permissions="blocked"
- data-qr-camera="blocked"
- data-world2-nav-mode="stable-visible-row"
- bottom nav stable visible row
- layer unlocking behavior
- main dialogue copy
- route /estacion/2

Forbidden:
- collapsible nav
- data-world2-nav-state
- separate CSS/SVG cable
- separate CSS electrode
- bead
- energy travelling on cable
- external tracer/cursor/point
- long vertical ECG reader
- signalOriginContact in option 2
- plantBioelectricContactNode in option 2
- pulseCore as origin visual
- microblink
- old 015Y/015Z/016B cable
- mapping PNG
- new generated assets

Visual references:
Review docs/fable/world2/016H-option2-signal-interaction/visual/.
Use current_016G_* files as negative references.
Use reference_015S_capture_micro_scene_mid.png and reference_015T_conditioning_micro_scene_mid.png as scale/protagonism references.
Use reference_016D_unified_asset_detail.png and reference_016F_expanded_signal_projection_detail.png as implementation history.

Required tests:
Update World2RootScreen.test.tsx to assert:
- runtime marker for the new implementation
- signal cinema marker
- idle and expanded state
- Onda medida is interactive
- expanded state does not change the active layer
- no tracer/cursor/point
- no CSS/SVG cable or electrode
- no signalOriginContact
- no contact PNG duplicate
- no microblink
- stable visible nav row remains

Required screenshots:
- world2_016H_360x640_layer_2_idle_static_base_leaf.png
- world2_016H_360x640_layer_2_expanded_projection_start.png
- world2_016H_360x640_layer_2_expanded_projection_mid.png
- world2_016H_360x640_layer_2_expanded_projection_end.png
- world2_016H_layer_2_static_base_leaf_detail.png
- world2_016H_layer_2_expanded_signal_projection_detail.png
- world2_016H_layer_2_expanded_text_lia_detail.png
- world2_016H_layer_2_moving_alpha_mask_detail.png
- world2_016H_layer_2_no_forbidden_artifacts_check.png
- world2_016H_nav_state_machine_regression_check.png
- optional: 390x844 expanded mid
- optional: 1024x768 expanded mid

Required validation:
git diff --check
npm run test -- World2RootScreen
npm run build

If Vitest forks fail before importing tests:
npx vitest run World2RootScreen --pool=threads

Do not commit, push, pull, reset, stash, checkout/switch, merge/rebase, or open a PR.

End with:
READY_FOR_016H_HUMAN_VISUAL_REVIEW
```
