# FINAL-PLATE-LABEL-001 — Production brief

Classification: `PREPRODUCTION / NOT RUNTIME`

## 1. ID

`FINAL-PLATE-LABEL-001`

## 2. Filename final

`final_access_label_backplate_v01.png`

## 3. Función narrativa

Placa común que nombra cada memoria mediante texto DOM.

## 4. Función visual

Backplate 9-slice reutilizable de pergamino/madera/bronce, sin contenido horneado.

## 5. Consumidor

`FinalAccessLabel`

## 6. Estado/capa

/final; backplate bajo el texto DOM; z42.

## 7. Canvas final

`1024x256` exacto.

## 8. Ratio de generación

`Widest supported landscape framing; final ratio 4:1`. El ratio de la herramienta no sustituye el canvas final.

## 9. Formato final

`PNG RGBA`.

## 10. Alpha/fondo

Transparencia real fuera de la placa; interior con contraste estable.

## 11. Orientación

Una placa reutilizable en portrait y landscape.

## 12. z-order

`z42`.

## 13. Zona segura dentro del canvas

Insets propuestos: top=64, right=112, bottom=64, left=112 px. Texto seguro: x=144–880, y=56–200.

## 14. Tamaño visual objetivo en runtime

Altura visual objetivo 28–40 px; ancho variable por label; esquinas sin escalado y centro extensible.

## 15. Contenido obligatorio

Centro horizontal extensible; esquinas estables; borde mínimo 8 px source; pergamino/madera/bronce; contraste para cinco labels DOM.

## 16. Contenido prohibido

Texto, letras, romanos, iconos, números, estiramiento no uniforme, ornamento central que impida expansión.

## 17. Referencias exactas

Adjuntar únicamente este set exacto, en orden:

1. `C01` — `Referencia canónica Mirador` — `docs/narrative/visual_refs/08_pantalla_final_mirador.png`
2. `E05` — `Environment aprobado — final_mirador_foreground_portrait_v01.webp` — `C:\Users\JOSE DAVID\Downloads\I5\final_mirador_foreground_portrait_v01.webp`
3. `E06` — `Environment aprobado — final_mirador_foreground_landscape_v01.webp` — `C:\Users\JOSE DAVID\Downloads\I6\final_mirador_foreground_landscape_v01.webp`
4. `O01` — `Portrait alignment overlay` — `docs/visual/final/021e-access-production-briefs/final_021e_access_portrait_alignment_overlay.png`
5. `O02` — `Landscape alignment overlay` — `docs/visual/final/021e-access-production-briefs/final_021e_access_landscape_alignment_overlay.png`
6. `O05` — `Label 9-slice guide` — `docs/visual/final/021e-access-production-briefs/final_021e_label_9slice_guide.png`
7. `PLC` — `Contact sheet backplates` — `docs/visual/final/021b-preproduction/final_021b_ui_backplate_candidates.png`
8. `PLW1` — `W4 text card backplate` — `public/assets/gvo/current-used/world-4-root/ui/world4_text_card_backplate_v01.png`
9. `PLW2` — `W4 button backplate` — `public/assets/gvo/current-used/world-4-root/ui/world4_open_world5_button_backplate_v01.png`
10. `PLD` — `W2 dialogue card` — `public/assets/gvo/current-used/world-2-root/dialogue/world2_dialogue_card_mobile_safe_v01.png`

Todas son `REFERENCE_ONLY / NOT_RUNTIME`.

## 18. Prioridad de referencias

El orden anterior es vinculante. La identidad específica precede a las fuentes
binarias individuales; O03/O05 gobierna geometría; O01/O02 gobiernan encaje;
Environment gobierna cámara y paleta.

## 19. Qué tomar de cada una

PLC: comparación; PLW1/PLW2: estabilidad de bordes y centro; PLD: contraste pergamino. O05 gobierna insets y pruebas.

## 20. Qué no copiar

No reutilizar ningún backplate; no copiar contorno, color o brillo literal. H07 permanece `OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE`.

## 21. Prompt positivo en inglés

```text
Create one empty reusable horizontal label backplate for a poetic pixel-art garden overlook. Use clean warm poetic pixel art, shared Mirador materiality, warm parchment, subtle wood and restrained bronze, stable corner caps, a clean repeatable center strip, transparent background, strong readable silhouette, controlled detail, mobile readability, same apparent pixel scale as the provided references, no text, no icons, no numbers, no UI content. Frame the plate at a visual ratio of at least 3.6:1 inside the widest supported landscape output, with generous transparent margin. The center must support deterministic 9-slice horizontal expansion while corners and top/bottom borders remain unchanged.
```

## 22. Prompt negativo en inglés

```text
text, letters, numbers, roman numerals, logos, watermark, Lía, characters, humans, animals, full scene, background environment, complete station screenshot, copied runtime binary, UI, buttons, cards, large glow, bloom, photorealism, 3D render, anime, mixed pixel scales, clipped silhouette, subject too small, subject too large, solid background, shadow outside safe area, baked label, icon, asymmetric center ornament, non-repeatable center, distorted corners, thick opaque rectangle, non-uniform stretching
```

## 23. Instrucciones de generación

Use the widest landscape ratio actually exposed by the selected tool; do not invent its native pixel dimensions. Generate one isolated plate with a visual ratio >=3.6:1. If the tool cannot maintain that framing without a strong crop, stop and generate three coordinated parts—left cap, repeatable center tile, right cap—then assemble deterministically in Photopea.

## 24. Framing esperado

Placa aislada con relación visual mínima 3.6:1 dentro del ratio más ancho soportado. Si no se logra, generar caps y centro coordinados por partes. Crop sólo de alpha exterior; crop de silueta o de una parte
narrativa es prohibido.

## 25. Escalado máximo aceptable en Photopea

Máximo `15 %` proporcional respecto al sujeto aprobado. Si requiere más,
estirar, rearmar partes narrativas o reconstruir detalle, regenerar.

## 26. Criterios de aceptación

Canvas 1024x256; RGBA; no text/icons; stable corners; repeatable center; all five DOM labels fit; contrast survives portrait/landscape; <=90 KiB without material degradation.

## 27. Hard fails

Any baked text/icon/number; corner distortion; center not repeatable; non-uniform stretch; unsafe text zone; opaque rectangular background; >15 % proportional repair; wrong canvas/format; >90 KiB without justified quality need.

## 28. Instrucciones de Photopea

Open a working copy; create a 1024x256 RGBA document; place proportionally without non-uniform stretch; use the O05 guide; set/verify 9-slice insets 64/112/64/112; test the five simulated DOM widths; inspect corners and borders; remove all generated text; export PNG RGBA. If one-piece framing cannot reach 4:1 with <=15 % proportional scaling, assemble approved caps/center parts instead of stretching.

## 29. Exportación

Export exactly `final_access_label_backplate_v01.png` as 1024x256 PNG RGBA; preserve alpha; do not quantize if it harms edge quality; preliminary budget <=90 KiB.

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

Cinco accesos producidos y revisados; tokens 9-slice documentales; prueba con los cinco labels DOM.

## 33. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`. Este estado declara completo el brief, no
el asset. Orden de producción: `6`. No saltar dependencias.
