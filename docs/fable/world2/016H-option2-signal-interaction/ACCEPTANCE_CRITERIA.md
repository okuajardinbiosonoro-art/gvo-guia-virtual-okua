# Acceptance criteria for next option 2 implementation

The next implementation is acceptable only if all mandatory criteria pass.

## Mandatory visual criteria

1. In idle, the unified base asset is visible, crisp, and not ghosted.
2. In idle, the unified base asset visually touches or embeds into a left-side plant leaf.
3. In idle, the unified base asset has no scan, mask, tracer, cursor, bead, or separate reader animation.
4. `Onda medida` is a clear tappable button/label with a subtle visible cue.
5. Tapping `Onda medida` changes only the local option 2 state from `idle` to `expanded`.
6. The active layer remains option 2 / `senal` after expanding.
7. In expanded, the clean waveform projection is large enough to feel like the main visual focus.
8. Expanded signal scale is comparable in prominence to option 3 capture or option 4 conditioning references.
9. Expanded waveform uses moving alpha mask over a static waveform asset.
10. The waveform image does not move, morph, draw from zero, or use SVG stroke-dashoffset.
11. Local text near Lia is readable, brighter than 016G, and distinct from the main dialogue panel.
12. Lia remains stable and secondary.
13. Lia does not cover the static base, `Onda medida`, expanded waveform, or local readout.
14. Main dialogue and bottom nav remain stable and visible.
15. No forbidden old artifacts return.

## Forbidden artifacts checklist

The DOM and visual output must not contain:

- collapsible nav;
- `data-world2-nav-state`;
- separate CSS/SVG cable;
- separate CSS electrode;
- cable bead;
- external cursor;
- external point;
- external tracer;
- long vertical ECG reader;
- `signalOriginContact` visible in option 2;
- `plantBioelectricContactNode` visible in option 2;
- `pulseCore` as option 2 origin;
- microblink;
- old 015Y/015Z/016B cable visuals;
- generated mapping PNG;
- new generated assets.

## Required tests

Update or keep `World2RootScreen.test.tsx` assertions for:

1. runtime marker for the new implementation ticket;
2. signal cinema marker;
3. `idle|expanded` state;
4. `Onda medida` interactability;
5. expanding without changing layer;
6. no tracer/cursor/point;
7. no separate CSS electrode;
8. no separate SVG/CSS cable;
9. no `signalOriginContact`;
10. no contact PNG duplicate;
11. no microblink;
12. stable visible nav row.

## Required screenshots

Generate at least:

- `world2_016H_360x640_layer_2_idle_static_base_leaf.png`
- `world2_016H_360x640_layer_2_expanded_projection_start.png`
- `world2_016H_360x640_layer_2_expanded_projection_mid.png`
- `world2_016H_360x640_layer_2_expanded_projection_end.png`
- `world2_016H_layer_2_static_base_leaf_detail.png`
- `world2_016H_layer_2_expanded_signal_projection_detail.png`
- `world2_016H_layer_2_expanded_text_lia_detail.png`
- `world2_016H_layer_2_moving_alpha_mask_detail.png`
- `world2_016H_layer_2_no_forbidden_artifacts_check.png`
- `world2_016H_nav_state_machine_regression_check.png`

Recommended additional screenshots:

- `world2_016H_390x844_layer_2_expanded_projection_mid.png`
- `world2_016H_1024x768_layer_2_expanded_projection_mid.png`

## Required validations

Run:

```bash
git diff --check
npm run test -- World2RootScreen
npm run build
```

If Vitest forks fail before importing tests, run:

```bash
npx vitest run World2RootScreen --pool=threads
```

Report both the failed fork result and the successful thread fallback if fallback is used.

## Final review flag for the next implementation

The next runtime implementation should not claim final visual approval. It should end with a human review flag, for example:

```text
READY_FOR_016H_HUMAN_VISUAL_REVIEW
```

This 016H handoff pack itself ends with:

```text
READY_FOR_016H_FABLE_HANDOFF_REVIEW
```
