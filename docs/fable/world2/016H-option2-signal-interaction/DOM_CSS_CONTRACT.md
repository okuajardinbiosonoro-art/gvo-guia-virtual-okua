# DOM and CSS contract

This contract describes what Fable should preserve while redesigning option 2.

## Likely editable files for Fable

The next implementation should stay scoped to:

- `src/screens/World2Root/World2RootScreen.tsx`
- `src/screens/World2Root/World2RootScreen.css`
- `src/screens/World2Root/World2RootScreen.test.tsx`

Read-only support files:

- `src/screens/World2Root/world2RuntimeAssets.ts`
- `src/screens/World2Root/World2LiaActor.tsx`
- `src/screens/World2Root/world2LiaLayerProfiles.ts`

## Required root guards

Preserve these root-level guards:

```tsx
data-sensitive-permissions="blocked"
data-qr-camera="blocked"
data-world2-nav-mode="stable-visible-row"
```

Preserve stable nav markup:

```tsx
<nav
  className="world2-layer-nav world2-layer-nav--stable"
  data-world2-zone="nav"
  data-world2-nav-mode="stable-visible-row"
>
```

Do not reintroduce `data-world2-nav-state`, nav tray toggles, collapsible nav, or mobile drawer behavior.

## Signal cinema DOM

The signal layer should continue to expose a single local cinema block:

```tsx
<div
  className="world2-signal-cinema"
  data-signal-cinema="016H"
  data-signal-reveal-state={signalRevealState}
>
```

016H is a handoff ticket, so current runtime remains `016G`. The next implementation may update runtime markers to its own ticket id, but must keep the state and selector semantics auditable.

Required concepts:

- one static base asset image;
- one expanded projection container;
- two clean waveform layers inside expanded projection:
  - dim base layer;
  - bright alpha-mask layer;
- one interactive `Onda medida` button;
- one local readout only in expanded state.

## Static base asset contract

Use:

```tsx
world2RuntimeAssets.signalProbeCableWaveformUnified
```

The base asset should remain:

- `img`, not generated CSS;
- static;
- visibly attached to a leaf;
- not scanned;
- not animated with mask;
- not duplicated as old contact PNG or CSS electrode/cable.

Recommended selector to preserve or evolve:

```css
.world2-signal-cinema__static-base
```

## Expanded projection contract

Use:

```tsx
world2RuntimeAssets.signalWaveformCleanTechnical
```

The expanded projection must use the clean waveform asset in two stacked image layers. It may be renamed internally if tests are updated, but the semantic split should remain:

```css
.world2-signal-cinema__projected-wave--base
.world2-signal-cinema__projected-wave--scan
```

The mask layer may use CSS `mask-image` / `-webkit-mask-image`, but the moving object must be a soft vertical alpha band. The waveform image itself must not translate, morph, or redraw.

## Interactivity contract

`Onda medida` should remain a real button:

```tsx
type="button"
data-world2-signal-reveal-control="onda-medida"
aria-pressed={signalRevealState === "expanded"}
```

Tap/click should only switch `data-signal-reveal-state` from `idle` to `expanded`. It must not change the active layer.

## Forbidden DOM/CSS artifacts

Do not render or reintroduce:

- `[data-world2-signal-tracer]`
- `.world2-signal-cinema__tracer`
- `[data-world2-signal-focus]`
- `.world2-signal-cinema__focus-band` inside option 2
- `.world2-signal-probe-assembly`
- `[data-world2-signal-probe-assembly]`
- `[data-world2-cable-stroke]`
- `[data-signal-cable-start-anchor]`
- `.world2-signal-cable`
- `.world2-signal-reference-cable`
- `[data-world2-signal-cable-bead]`
- `[data-world2-signal-origin="unified-probe-cable"]`
- `[data-world2-visual-role="signal-electrode"]`
- visible `svg` signal cable in option 2
- `signalOriginContact` runtime asset in option 2
- `plantBioelectricContactNode` runtime asset in option 2
- `pulseCore` as option 2 origin
- `data-world2-lia-microblink`
- `data-world2-lia-microanimation="015Y"`
- `data-lia-motion-profile="signal-attentive-microblink"`

## Tests to preserve or update

The existing `World2RootScreen.test.tsx` already checks the most important regression guards:

- runtime marker;
- `data-signal-cinema`;
- idle to expanded state;
- `Onda medida` interaction;
- no layer change on expand;
- no external tracer/focus/cursor/cable;
- no old cables `015Y`, `015Z`, `016B`;
- no `signalOriginContact`;
- no duplicate contact PNG;
- no microblink;
- nav remains stable visible row.

Fable should update expected runtime marker names if the implementation ticket changes them, but keep these behavioral assertions.

## Reduced motion

Current CSS has reduced-motion fallbacks for `[data-signal-cinema="016G"]`. If Fable changes the marker, update reduced-motion selectors too. The reduced-motion version must still show:

- static base;
- expanded projection when expanded;
- readable label/cue;
- readable local text;
- no moving-only dependency for meaning.
