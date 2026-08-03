# FINAL-MIRADOR-P-001 — Brief de producción

- Clasificación: `PREPRODUCTION — NOT RUNTIME`
- Estado del brief: `READY_FOR_HUMAN_ASSET_PRODUCTION`
- Orden de producción autorizado: 5 de 6; producir uno por uno.

## 1. ID

`FINAL-MIRADOR-P-001`

## 2. Filename final exacto

`final_mirador_foreground_portrait_v01.webp`

## 3. Función narrativa

Ubicar físicamente al visitante en el mirador sin competir con el cierre.

## 4. Función visual

Foreground alpha portrait de plataforma, barandal, piedra/madera y vegetación estructural.

## 5. Consumidor futuro

`FinalForegroundLayer`. Consumidor previsto, todavía inexistente/no integrado por 021D.

## 6. Estado/capas donde aparece

`/final`, z70 decorativo detrás de Lía/UI; transform opcional mínimo, estático en reduced motion.

## 7. Canvas final

`1440×1280`.

## 8. Ratio de generación

9:8 aproximado; usar sólo un modo soportado documentado y ajustar con O05, sin asumir pixels de salida.

## 9. Formato final

WebP con alpha.

## 10. Fondo opaco/transparente

Transparente real; sólo masa estructural del mirador.

## 11. Alpha esperado

Esperado; bbox medido y bordes sin matte.

## 12. Orientación

Portrait; corresponde al tramo inferior y=0.50–1.00 del artboard 1440×2560.

## 13. z-order

`z70`.

## 14. Core protegido

Reservar Lía central, accesos, acciones, créditos y modal conforme a O05; oclusores laterales <=14% del ancho cada uno.

## 15. Crop permitido

Permitido sólo en extremos exteriores y borde inferior; no cortar barandal estructural ni invadir reservas.

## 16. Contenido obligatorio

- Plataforma/piso y barandal legibles con bloques de piedra, madera simple y sombra de contacto.
- Plantas/macetas estructurales y oclusores laterales contenidos.
- Lámpara apagada/estable y atril/libro sin texto sólo si caben sin invadir reservas.
- Centro y bandas de acciones/créditos visualmente tranquilos.

## 17. Contenido prohibido

- Lía, accesos, botones, labels, título, créditos, texto de libro/cartel o modal.
- Llama animada, motas, feedback, sombras de assets inexistentes o fondo opaco.
- Oclusores que tapen targets o anatomía/ornamento copiado literalmente.

## 18. Referencias exactas a adjuntar

| Orden | Archivo externo | ID | Tomar | No copiar |
| ---: | --- | --- | --- | --- |
| 1 | `R01_08_pantalla_final_mirador.png` | `R01` | vocabulario piedra/madera y relación balcón-valle | layout, texto, portales y Lía |
| 2 | `O05_mirador_portrait_exclusion_map.png` | `O05` | masas permitidas y reservas | texto/colores técnicos |
| 3 | `R02_atlas_final_revision_libre.png` | `R02` | jerarquía de foreground y oclusores | silueta literal, portales y UI |
| 4 | `R12_world4_table_top_v01.png` | `R12` | masa estructural y sombra de contacto | silueta/material exactos |
| 5 | `R15_world5_plants_material.webp` | `R15` | masas vegetales alpha legibles | plantas/macetas exactas |

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
Create only a transparent structural foreground layer in clean, warm, poetic pixel art for the lower half of a portrait elevated balcony scene. Build a readable stone-and-wood overlook platform with a restrained railing, large worn stone blocks, simple warm wood grain, sparse bronze accents, contact shadows, and a few clearly grouped structural plants or pots near the sides. A stable unlit lamp and a textless lectern or closed/open book may appear only if they remain secondary. Keep the central Lia reserve, five access sightlines, action bands, credits, and modal region unobstructed according to the exclusion map. Use true transparency outside the physical foreground, clean alpha edges, one apparent pixel scale, clear silhouettes, and calm detail density. Side occluders must remain narrow and the layer must work without animation.
```

## 23. Prompt negativo en inglés

```text
text, letters, numbers, logos, signatures, watermarks, UI, buttons, labels, credits, Lia, characters, humans, animals, floating islands, station portals, five access objects, photorealism, smooth vector gradients, glossy 3D render look, anime, extra worlds, World VI, excessive particles, global bloom veil, fisheye lens, impossible perspective, symmetrical repetition, low-resolution pixel noise, mixed pixel scales, blurry resampling, cropped protected regions, opaque background, baked valley, animated flame, floating motes, generated writing on book or signs, centered large object, oversized side occluders, shadows for absent objects
```

## 24. Instrucciones de generación

- Esperar aprobación de FINAL-ENV-P-001 y no iniciar antes de su revisión.
- Adjuntar R01, O05, R02, R12 y R15 en ese orden; pedir una sola capa transparente.
- Rechazar texto, fondo opaco o invasión de reservas antes de Photopea.
- Evaluar sobre ENV-P como referencia bloqueada y también sobre checkerboard.

## 25. Criterios de aceptación visual

Checklist visual:

- Mirador legible y estable sin tapar Lía, cinco sightlines ni UI.
- Materiales en masas grandes, sin ruido; oclusores laterales <=14%.
- Centro y franja inferior tranquilos; alpha limpio.
- Lectura correcta al componer en 375×667.

La aceptación requiere revisión humana explícita; un hash, dimensión o pase
técnico no la sustituye.

## 26. Hard fails

- Texto generado, Lía/accesos/UI o fondo opaco.
- Reserva central/acciones/créditos invadida o targets visualmente tapados.
- Alpha con matte, oclusores excesivos, fotorrealismo o detalle uniforme.

Cualquier hard fail detiene el asset; no se corrige produciendo el siguiente.

## 27. Instrucciones de Photopea

- Conservar master con ENV-P/O05 como referencias bloqueadas no exportables.
- Ajustar a 1440×1280 y alinear como y=1280–2560 del artboard portrait.
- Limpiar alpha, medir bbox y revisar halos en checkerboard, fondo claro y ENV-P.
- Comprobar reservas y miniatura 375×667; no hornear sombras de otros assets.

Flujo no destructivo: master editable fuera de runtime, duplicado de trabajo,
overlay bloqueado, revisión al 100% y miniatura, export final separado.

## 28. Exportación final

Exportar `final_mirador_foreground_portrait_v01.webp`, 1440×1280, RGBA con alpha, objetivo <=600 KiB; no promover.

Checklist técnico:

- filename y canvas exactos;
- modo/alpha conforme al contrato;
- ausencia de texto generado, seams, banding y halos;
- presupuesto preliminar comprobado, no asumido;
- SHA-256 y bytes calculados sobre la exportación;
- para alpha: bbox reportado y prueba sobre fondos claro/oscuro;
- ninguna copia en runtime ni `current-used`.

## 29. Metadata/hash que deberá reportarse

Reportar filename, canvas, modo, alpha=true, alpha bbox, bytes, SHA-256, alineación scene-y, herramienta/modelo, fecha y correcciones.

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

FINAL-ENV-P-001 aprobado; O05; H07 controlado; prueba de reservas y alpha.

La secuencia de producción sigue el orden 1→6. Aunque el brief esté listo, no
se salta una dependencia ni se produce en lote.

## 32. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`

Este estado declara el brief listo, no el asset producido, aprobado o integrado.
