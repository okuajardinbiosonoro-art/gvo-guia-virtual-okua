# Target behavior - Option 2 Signal

The next implementation should only redesign World II option 2, `senal`.

It must keep the user on layer 2. It must not change the global dialogue, bottom navigation, unlocking state machine, router, or other station screens.

## Concept

Option 2 needs two internal visual states:

```text
idle -> expanded
```

Idle explains the measurement origin. Expanded turns the measured waveform into a large projected micro-scene.

## Idle target

Idle should read as:

```text
plant visible
+ static unified electrode/cable/small-waveform asset
+ asset visibly attached to a left-side plant leaf
+ clear Onda medida label/button with a subtle cue
+ Lia secondary and out of the way
+ approved main dialogue intact
+ stable bottom nav visible
```

Fable should tune composition until:

- the unified base asset is crisp and clearly visible, not ghosted;
- the electrode end visually touches or embeds into a visible leaf area;
- the asset sits lower and more left than 016G;
- the asset feels like a measurement point, not the main animation;
- there is no moving alpha mask, scan, cursor, tracer, bead, point, or extra visual reader on the base asset;
- `Onda medida` reads as a live affordance, not disabled text.

## Expanded target

After tapping `Onda medida`, expanded should read as:

```text
same layer 2
+ internal focus shift
+ large clean waveform projection
+ moving alpha mask on that projection only
+ local explanatory text near Lia
+ main dialogue and bottom nav stable
```

Fable should tune composition until:

- the large waveform is the protagonist visual of option 2;
- its scale feels comparable to option 3 capture or option 4 conditioning micro-scenes;
- it occupies a significant area of the scene, above the dialogue and away from the nav;
- it visually originates from `Onda medida` or the axis of the static base asset;
- it does not cover the main dialogue, nav, full plant, or Lia;
- it does not feel like a small lateral annotation.

## Expanded waveform animation

Use exactly this semantic model:

```text
moving alpha mask / scanning reveal over a static waveform asset
```

Required implementation semantics:

1. Use `world2_signal_waveform_clean_technical_v01.png`.
2. Render the full waveform as a dim base layer.
3. Render the same full waveform again as a brighter overlay.
4. Apply a soft vertical alpha band to the brighter overlay.
5. Move only the alpha band from left to right.
6. Do not move the waveform image.
7. Do not alter the waveform shape.
8. Do not draw or generate a new waveform.
9. Do not use SVG stroke-dashoffset for the signal.
10. Do not add cursor, point, bead, tracer, or a long vertical ECG reader.

## Local explanatory text

Expanded text should be visually local to Lia, not a duplicate of the main dialogue.

Recommended text:

```text
Lectura ampliada
La onda medida se amplia para observar como cambia el pulso bioelectrico antes de convertirse en datos.
```

Visual requirements:

- more white/cyan, higher contrast than 016G;
- compact and readable;
- not transparent gray;
- visually distinct from `Pulso bioelectrico` dialogue;
- near Lia or her secondary focus zone;
- not over the plant electrode or bottom dialogue panel.

## Lia

Preserve Lia as stable and secondary.

Do not add:

- microblink;
- eye overlays;
- eye glow;
- new Lia animation;
- Lia covering `Onda medida`, static base, expanded waveform, or local text.

Existing gentle actor motion can remain if it does not distract or block the signal.

## Explicit non-goals

Do not redesign the whole station.

Do not change:

- option 1, 3, 4, 5, or 6, except for passive visual regression checks;
- navigation 015O/015V;
- main dialogue copy/safe-area 015J;
- router;
- editorial registry;
- assets in `public/assets`;
- `world2RuntimeAssets.ts`, unless the build fails directly because of the implementation and no other fix is possible.
