# Asset manifest - Option 2 Signal

No assets were created or modified by 016H.

This manifest documents the existing assets Fable must use.

## Static base asset

File name:

```text
world2_signal_probe_cable_waveform_unified_v01.png
```

Runtime path:

```text
public/assets/gvo/stations/world-2/pulse-invisible/runtime/signal/world2_signal_probe_cable_waveform_unified_v01.png
```

Current-used mirror:

```text
public/assets/gvo/current-used/world-2-root/signal/world2_signal_probe_cable_waveform_unified_v01.png
```

Observed metadata:

- dimensions: `1600x900`
- bytes: `272788`
- SHA256 runtime: `2FFD7534139A92C5A9B6E97BDEDE4D157959B39BE110F343942EA944A38813E7`
- SHA256 current-used: `2FFD7534139A92C5A9B6E97BDEDE4D157959B39BE110F343942EA944A38813E7`

Role:

- small static measurement base;
- electrode + cable + small waveform as one unified PNG;
- must sit on or into a visible plant leaf;
- must not receive moving alpha mask;
- must not be replaced with CSS electrode/cable pieces.

## Expanded waveform asset

File name:

```text
world2_signal_waveform_clean_technical_v01.png
```

Runtime path:

```text
public/assets/gvo/stations/world-2/pulse-invisible/runtime/signal/world2_signal_waveform_clean_technical_v01.png
```

Current-used mirror:

```text
public/assets/gvo/current-used/world-2-root/signal/world2_signal_waveform_clean_technical_v01.png
```

Observed metadata:

- dimensions: `1600x900`
- bytes: `305109`
- SHA256 runtime: `4B2F45093A6FB6DFB5373CD49403A0A5BCA00F7CEA830837D501C0565A898EA6`
- SHA256 current-used: `4B2F45093A6FB6DFB5373CD49403A0A5BCA00F7CEA830837D501C0565A898EA6`

Role:

- large expanded projection;
- used twice in stacked layers:
  - dim full waveform;
  - bright full waveform with moving alpha mask;
- the image itself must remain static.

## Current-used policy note

The two required assets already exist in both runtime and `public/assets/gvo/current-used/world-2-root/signal/`. This satisfies the current-used mirror requirement for this handoff.

Do not copy, optimize, convert, or regenerate these assets in the next implementation unless a new ticket explicitly asks for it.

## Forbidden option 2 assets

Do not use these as visible option 2 origin assets:

- `world2_signal_origin_contact_v01.png`
- `world2_plant_bioelectric_contact_node_v01.png`
- `world2_pulse_core_node_v01.png`
- old cable 015Y / 015Z / 016B visuals;
- generated mapping PNGs;
- any new generated image;
- any CSS/SVG cable or electrode replacement.

The static base must remain the unified PNG, and the expanded projection must remain the clean waveform PNG.
