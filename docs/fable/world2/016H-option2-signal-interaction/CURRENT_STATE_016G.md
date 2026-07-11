# Current state 016G

016G is technically valid but visually rejected.

## Runtime markers currently present

- `data-world2-runtime-version="016G"`
- `data-world2-experience="option2-signal-visual-hierarchy-expanded-projection-r1"`
- `data-signal-cinema="016G"`
- `data-world2-signal-base-mode="static-unified-probe-on-leaf-visible"`
- `data-world2-signal-expanded-mode="large-projected-waveform-moving-alpha-mask"`
- `data-world2-signal-read-style="large-projected-waveform-moving-alpha-mask"`
- `data-signal-reveal-state="idle|expanded"`

Guards preserved in current runtime:

- `data-sensitive-permissions="blocked"`
- `data-qr-camera="blocked"`
- `data-world2-nav-mode="stable-visible-row"`

## Current implementation shape

`World2RootScreen.tsx` has one local state for option 2:

```tsx
const [signalRevealState, setSignalRevealState] =
  useState<SignalRevealState>("idle");
```

When the active layer is `senal`, the screen renders `.world2-signal-cinema`. The DOM currently includes:

- one static base image using `world2RuntimeAssets.signalProbeCableWaveformUnified`;
- one projection container using `world2RuntimeAssets.signalWaveformCleanTechnical`;
- two projection image layers:
  - `.world2-signal-cinema__projected-wave--base`
  - `.world2-signal-cinema__projected-wave--scan`
- one real button:
  - `data-world2-signal-reveal-control="onda-medida"`
  - `aria-label="Expandir senal medida"`
  - `aria-pressed={signalRevealState === "expanded"}`
- expanded local readout:
  - title: `Lectura ampliada`
  - body: `La onda medida se amplia para revelar como varia el pulso bioelectrico.`

## Current CSS shape

Important 016G selectors:

- `.world2-signal-cinema`
- `.world2-signal-cinema__static-base`
- `.world2-signal-cinema__projection`
- `.world2-signal-cinema__projected-wave--base`
- `.world2-signal-cinema__projected-wave--scan`
- `.world2-signal-cinema__label`
- `.world2-signal-cinema__cue`
- `.world2-signal-cinema__readout`
- `@keyframes world2-signal-projected-alpha-scan`

The current mask implementation is conceptually correct:

- the clean waveform asset is duplicated;
- the lower layer is dim;
- the upper layer is brighter;
- a horizontal alpha mask moves across the upper layer;
- the waveform image itself does not move.

## What is accepted from 016G

- Internal state exists: `idle` to `expanded`.
- `Onda medida` remains an interactive button.
- The base and expanded projection are conceptually separated.
- The expanded projection uses the clean waveform asset.
- The moving alpha mask is on the expanded projection layer, not on the unified base asset.
- Tests assert absence of:
  - external tracer,
  - cable SVG/CSS,
  - old cable variants,
  - `signalOriginContact`,
  - duplicate contact PNG,
  - `pulseCore` origin,
  - microblink.
- Stable bottom nav remains visible.

## Why 016G is rejected visually

The human review rejects 016G for composition, not for code mechanics:

1. The static unified base asset is still too dim.
2. The static base still reads as floating instead of attached to a plant leaf.
3. The expanded waveform is too small and lateral.
4. Pressing `Onda medida` does not yet feel like a scene focus shift.
5. The expanded signal is not comparable in protagonist scale to option 3 or option 4.
6. The local readout near Lia is still too gray/transparent.
7. The local readout is not distinct enough from the main dialogue panel.
8. No old point, cursor, tracer, bead, CSS cable/electrode, contact PNG, or microblink may return while fixing the composition.

## Current visual evidence to review first

Review these before editing:

- `docs/visual/world2/016G/world2_016G_360x640_layer_2_idle_static_base_visible.png`
- `docs/visual/world2/016G/world2_016G_360x640_layer_2_expanded_projection_mid.png`
- `docs/visual/world2/016G/world2_016G_layer_2_static_asset_visibility_detail.png`
- `docs/visual/world2/016G/world2_016G_layer_2_expanded_signal_scale_detail.png`
- `docs/visual/world2/016G/world2_016G_layer_2_expanded_text_lia_detail.png`
- `docs/visual/world2/016G/world2_016G_layer_2_no_external_point_tracer_check.png`

These are copied into `visual/` with `current_016G_*_rejected.png` names for convenience.
