# FINAL-ACCESS-II-001 — Production brief

Classification: `PREPRODUCTION / NOT RUNTIME`

## 1. ID

`FINAL-ACCESS-II-001`

## 2. Filename final

`final_access_world2_pulse_v01.webp`

## 3. Función narrativa

Memoria de Pulso invisible.

## 4. Función visual

Mini escena flotante de planta y área reservada para una señal violeta.

## 5. Consumidor

`FinalAccessCard[II]`

## 6. Estado/capa

/final / acceso II; imagen decorativa dentro del botón; z30.

## 7. Canvas final

`1024x1024` exacto.

## 8. Ratio de generación

`1:1 square`. El ratio de la herramienta no sustituye el canvas final.

## 9. Formato final

`WebP alpha`.

## 10. Alpha/fondo

Transparencia real; fondo completamente transparente.

## 11. Orientación

Asset único compatible con portrait y landscape.

## 12. z-order

`z30`.

## 13. Zona segura dentro del canvas

Silueta dentro del 14–86 % de x/y; 10–16 % de alpha exterior; reservar un arco limpio dentro del bbox para FX futuro.

## 14. Tamaño visual objetivo en runtime

88 px mínimo de lectura; objetivo 96–112 px portrait y 88–104 px landscape.

## 15. Contenido obligatorio

Planta reconocible; relación planta–pulso; reserva visible para señal violeta; base material común.

## 16. Contenido prohibido

Texto técnico, dashboard, loop horneado, fondo completo, captura W2, halo que ocupe todo el canvas.

## 17. Referencias exactas

Adjuntar únicamente este set exacto, en orden:

1. `C01` — `Referencia canónica Mirador` — `docs/narrative/visual_refs/08_pantalla_final_mirador.png`
2. `E01` — `Environment aprobado — final_environment_portrait_v01.webp` — `C:\Users\JOSE DAVID\Downloads\I1\final_environment_portrait_v01.webp`
3. `E02` — `Environment aprobado — final_environment_landscape_v01.webp` — `C:\Users\JOSE DAVID\Downloads\I2\final_environment_landscape_v01.webp`
4. `E05` — `Environment aprobado — final_mirador_foreground_portrait_v01.webp` — `C:\Users\JOSE DAVID\Downloads\I5\final_mirador_foreground_portrait_v01.webp`
5. `E06` — `Environment aprobado — final_mirador_foreground_landscape_v01.webp` — `C:\Users\JOSE DAVID\Downloads\I6\final_mirador_foreground_landscape_v01.webp`
6. `O01` — `Portrait alignment overlay` — `docs/visual/final/021e-access-production-briefs/final_021e_access_portrait_alignment_overlay.png`
7. `O02` — `Landscape alignment overlay` — `docs/visual/final/021e-access-production-briefs/final_021e_access_landscape_alignment_overlay.png`
8. `O03` — `Square safe-area overlay` — `docs/visual/final/021e-access-production-briefs/final_021e_access_square_safearea_overlay.png`
9. `O04` — `Family scale contact sheet` — `docs/visual/final/021e-access-production-briefs/final_021e_access_family_scale_contact_sheet.png`
10. `W2C` — `Contact sheet Mundo II` — `docs/visual/final/021b-preproduction/final_021b_world2_memory_candidates.png`
11. `W2P` — `W2 planta viva` — `public/assets/gvo/current-used/world-2-root/plant/world2_main_living_plant_v01.png`
12. `W2W` — `W2 waveform bioeléctrico` — `public/assets/gvo/current-used/world-2-root/signal/world2_raw_bioelectric_waveform_v01.png`
13. `W2N` — `W2 núcleo de pulso` — `public/assets/gvo/current-used/world-2-root/signal/world2_pulse_core_node_v01.png`

Todas son `REFERENCE_ONLY / NOT_RUNTIME`.

## 18. Prioridad de referencias

El orden anterior es vinculante. La identidad específica precede a las fuentes
binarias individuales; O03/O05 gobierna geometría; O01/O02 gobiernan encaje;
Environment gobierna cámara y paleta.

## 19. Qué tomar de cada una

W2C: relación planta-señal; W2P: identidad vegetal; W2W: ritmo lineal; W2N: foco violeta. Common: escala y encaje.

## 20. Qué no copiar

No copiar planta, waveform, core o constelación; no hornear una animación completa. H07 permanece `OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE`.

## 21. Prompt positivo en inglés

```text
Create one independent floating memory mini-scene for the Final Mirador: a small floating stone-and-moss islet with a recognizable living plant and a restrained open arc reserved for one violet bioelectric pulse. Clean warm poetic pixel art, shared Mirador stone and vegetation materiality, transparent square asset, strong readable silhouette, mobile readability at 88 px, same apparent pixel scale as the other four access assets, controlled detail, compatible with portrait and landscape, no copied full-world scene, no UI, no character, no background environment. The visible subject must occupy 68–78 percent of both canvas width and height, keep 10–16 percent transparent alpha margin on every side, and keep the optical center within 8 percent of canvas center. Use restrained contact shadow only inside the safe area.
```

## 22. Prompt negativo en inglés

```text
text, letters, numbers, roman numerals, logos, watermark, Lía, characters, humans, animals, full scene, background environment, complete station screenshot, copied runtime binary, UI, buttons, cards, large glow, bloom, photorealism, 3D render, anime, mixed pixel scales, clipped silhouette, subject too small, subject too large, solid background, shadow outside safe area, literal door, five identical portals, long baked directional shadow
```

## 23. Instrucciones de generación

Request a square 1:1 generation. Preserve the original generated file. Judge framing before editing; do not ask Photopea to repair composition. Generate one asset only and keep all surrounding pixels transparent.

## 24. Framing esperado

Planta y reserva de señal forman una sola silueta 68–78 %; el pulso futuro no queda detrás del label. Crop sólo de alpha exterior; crop de silueta o de una parte
narrativa es prohibido.

## 25. Escalado máximo aceptable en Photopea

Máximo `15 %` proporcional respecto al sujeto aprobado. Si requiere más,
estirar, rearmar partes narrativas o reconstruir detalle, regenerar.

## 26. Criterios de aceptación

Canvas 1024x1024; WebP alpha; narrative reads at 88 px; bbox obeys O03; source occupation 68–78 %; common family materiality; no prohibited content; <=180 KiB without material degradation.

## 27. Hard fails

Any text/number/UI/character/background; copied station binary or silhouette; alpha margin outside 10–16 %; subject outside 68–78 %; optical center outside 8 %; clipped silhouette; unreadable at 88 px; >15 % scaling/recomposition; wrong filename/canvas/format.

## 28. Instrucciones de Photopea

Open a working copy in a 1024x1024 document; verify real alpha; place O03 above the art; center by visible-content bbox, not empty canvas; allow only proportional scaling, alpha cleanup and slight centering; never stretch or reconstruct; inspect at 1024, 256, 128 and 88 px; export WebP with alpha.

## 29. Exportación

Export exactly `final_access_world2_pulse_v01.webp` as 1024x1024 WebP with alpha; preserve apparent pixel scale; preliminary budget <=180 KiB.

## 30. Metadata/hash

Reportar filename, canvas, formato, modo, alpha sí/no, bytes, SHA-256, bbox
alpha/visible `x0,y0,x1,y1`, ocupación porcentual x/y, escala aplicada y ruta
del original preservado. No promover a runtime.

## 31. Plantilla de retorno

```text
asset_id:
final_filename:
source_original_path:
working_copy_path:
canvas:
format_mode_alpha:
visible_or_alpha_bbox:
subject_occupancy_x_y:
photopea_scale_percent:
bytes:
sha256:
checks_1024_256_128_88:
hard_fails:
human_review:
runtime_promoted: NO
```

## 32. Dependencias

Acceso I producido y revisado; Art Bible/cámara; Environment auditado.

## 33. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`. Este estado declara completo el brief, no
el asset. Orden de producción: `2`. No saltar dependencias.
