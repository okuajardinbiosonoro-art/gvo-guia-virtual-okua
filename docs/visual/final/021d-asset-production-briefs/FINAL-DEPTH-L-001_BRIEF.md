# FINAL-DEPTH-L-001 — Brief de producción

- Clasificación: `PREPRODUCTION — NOT RUNTIME`
- Estado del brief: `READY_FOR_HUMAN_ASSET_PRODUCTION`
- Orden de producción autorizado: 4 de 6; producir uno por uno.

## 1. ID

`FINAL-DEPTH-L-001`

## 2. Filename final exacto

`final_valley_depth_landscape_v01.webp`

## 3. Función narrativa

Conectar los cinco mundos en paisaje corto sin perder el arco aprobado.

## 4. Función visual

Capa alpha de relieve/río medios recompuesta para landscape.

## 5. Consumidor futuro

`FinalDepthLayer`. Consumidor previsto, todavía inexistente/no integrado por 021D.

## 6. Estado/capas donde aparece

`/final`, z10 decorativo; transform opcional <=1.5%, estático en reduced motion.

## 7. Canvas final

`2560×1440`.

## 8. Ratio de generación

16:9; pedir la relación, sin afirmar dimensiones nativas de la herramienta.

## 9. Formato final

WebP con alpha.

## 10. Fondo opaco/transparente

Transparente real fuera del contenido; sin matte opaco.

## 11. Alpha esperado

Esperado; bbox objetivo x=4%–96%, y=27%–78%, con bleed mínimo 48 px.

## 12. Orientación

Landscape, capa propia; no crop de portrait.

## 13. z-order

`z10`.

## 14. Core protegido

Arco completo, eje y alto crítico 667×375 dentro de O04; ningún relieve tapa I/V o UI inferior.

## 15. Crop permitido

Sólo transparencia exterior al bbox; no cortar hombros, conector central ni bleed.

## 16. Contenido obligatorio

- Relieve medio ancho y conector río/camino recompuestos para 16:9.
- Cinco respiraciones en arco y centro legible en 667×375.
- Alpha/bleed para transform <=1.5%; fallback estático sin seams.
- ENV-L permanece completo al ocultar esta capa.

## 17. Contenido prohibido

- Crop/rotación/outpainting de DEPTH-P.
- Cielo, sol, fondo completo, accesos, Lía, mirador, UI, texto o haze global.
- Duplicación exacta de ENV-L o fondo opaco.

## 18. Referencias exactas a adjuntar

| Orden | Archivo externo | ID | Tomar | No copiar |
| ---: | --- | --- | --- | --- |
| 1 | `O04_depth_landscape_layer_map.png` | `O04` | bbox, bleed, arco y gate corto | texto/colores de guía |
| 2 | `R10_world4_rear_depth_plane_v01.png` | `R10` | separación técnica alpha | forma/textura W4 |
| 3 | `R11_world4_haze_overlay_v01.png` | `R11` | haze localizado | distribución W4 |
| 4 | `R01_08_pantalla_final_mirador.png` | `R01` | eje y relación de planos | layout portrait literal |

No adjuntar todo el paquete. Los hashes y paths originales se verifican en
`final_021d_environment_reference_manifest.csv` y en el `reference_manifest.json`
externo.

## 19. Orden de prioridad de referencias

El orden de la tabla anterior es vinculante. La referencia 1 gobierna arte o
composición; el overlay gobierna geometría y exclusiones; las restantes sólo
aportan la función descrita.

## 20. Qué debe tomarse de cada referencia

Usar exclusivamente la columna **Tomar** de la tabla. Una referencia de cámara
o material no autoriza copiar contenido, textura ni silueta.

## 21. Qué no debe copiarse

Usar como hard boundary la columna **No copiar**, el campo `do_not_copy` del
manifest y las prohibiciones de la sección 17. Ninguna referencia es candidato
de reutilización binaria para `/final`.

## 22. Prompt positivo en inglés

```text
Create only a transparent mid-depth layer in clean, warm, poetic pixel art, independently composed for a landscape 16:9 valley viewed from an elevated balcony. Isolate broad but restrained mid-distance ridge shoulders, a central winding river or path continuation, sparse vegetation masses, and very localized haze or light accents. Preserve five empty pockets across a wide arc, including both outer pockets in a short 667 by 375 viewport. Keep true transparency outside the documented bounding area and provide safe overlapping edges for subtle parallax without seams. Use one apparent pixel scale and clear silhouettes. The layer must align statically when reduced motion is enabled and must never be required for the opaque environment to remain complete. This is a new landscape composition, not a crop or extension of the portrait depth layer.
```

## 23. Prompt negativo en inglés

```text
text, letters, numbers, logos, signatures, watermarks, UI, buttons, labels, credits, Lia, characters, humans, animals, floating islands, station portals, five access objects, photorealism, smooth vector gradients, glossy 3D render look, anime, extra worlds, World VI, excessive particles, global bloom veil, fisheye lens, impossible perspective, symmetrical repetition, low-resolution pixel noise, mixed pixel scales, blurry resampling, cropped protected regions, opaque background, portrait crop, portrait outpainting, full sky, sun disk, distant environment duplicate, foreground railing, global fog veil, clipped outer arc
```

## 24. Instrucciones de generación

- No iniciar hasta aprobar FINAL-ENV-L-001 y revisar la capa portrait anterior.
- Adjuntar O04, R10, R11 y R01; pedir una sola capa alpha landscape.
- Rechazar crop del portrait, fondo opaco o pérdida de I/V en 667×375.
- Probar estático y desplazamientos máximos antes de exportar.

## 25. Criterios de aceptación visual

Checklist visual:

- Arco y extremos legibles a 667×375; centro sin saturación.
- ENV-L completo sin capa; con capa hay profundidad sin seams.
- Haze localizado y eje continuo; pixel scale consistente.
- Composición independiente de DEPTH-P.

La aceptación requiere revisión humana explícita; un hash, dimensión o pase
técnico no la sustituye.

## 26. Hard fails

- Crop/outpainting del portrait, fondo opaco, seams o bleed insuficiente.
- I/V recortados o inclusión de elementos prohibidos.
- Desalineación en transform:none o dependencia semántica.

Cualquier hard fail detiene el asset; no se corrige produciendo el siguiente.

## 27. Instrucciones de Photopea

- Usar ENV-L bloqueado como referencia; no usar DEPTH-P como base de crop.
- Ajustar a 2560×1440 y conservar bleed mínimo de 48 px.
- Medir alpha bbox y revisar halos sobre fondos claro, oscuro y ENV-L.
- Probar transform x±38 px/y±22 px, transform:none y miniatura 667×375.

Flujo no destructivo: master editable fuera de runtime, duplicado de trabajo,
overlay bloqueado, revisión al 100% y miniatura, export final separado.

## 28. Exportación final

Exportar `final_valley_depth_landscape_v01.webp`, 2560×1440, RGBA con alpha real, objetivo <=450 KiB; no promover.

Checklist técnico:

- filename y canvas exactos;
- modo/alpha conforme al contrato;
- ausencia de texto generado, seams, banding y halos;
- presupuesto preliminar comprobado, no asumido;
- SHA-256 y bytes calculados sobre la exportación;
- para alpha: bbox reportado y prueba sobre fondos claro/oscuro;
- ninguna copia en runtime ni `current-used`.

## 29. Metadata/hash que deberá reportarse

Reportar filename, canvas, modo, alpha=true, alpha bbox, bytes, SHA-256, bleed, herramienta/modelo, fecha y correcciones.

## 30. Plantilla de retorno del usuario

```text
ASSET_ID LISTO
Archivo:
Canvas:
Fondo:
Correcciones en Photopea:
Observaciones:
```

## 31. Dependencias

FINAL-ENV-L-001 aprobado; FINAL-DEPTH-P-001 revisado; O04; H07 controlado.

La secuencia de producción sigue el orden 1→6. Aunque el brief esté listo, no
se salta una dependencia ni se produce en lote.

## 32. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`

Este estado declara el brief listo, no el asset producido, aprobado o integrado.
