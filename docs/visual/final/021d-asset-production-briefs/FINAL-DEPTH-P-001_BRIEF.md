# FINAL-DEPTH-P-001 — Brief de producción

- Clasificación: `PREPRODUCTION — NOT RUNTIME`
- Estado del brief: `READY_FOR_HUMAN_ASSET_PRODUCTION`
- Orden de producción autorizado: 3 de 6; producir uno por uno.

## 1. ID

`FINAL-DEPTH-P-001`

## 2. Filename final exacto

`final_valley_depth_portrait_v01.webp`

## 3. Función narrativa

Conectar visualmente los cinco mundos mediante un plano medio sobrio.

## 4. Función visual

Capa alpha de colinas medias, hombros de relieve y continuidad del río/camino portrait.

## 5. Consumidor futuro

`FinalDepthLayer`. Consumidor previsto, todavía inexistente/no integrado por 021D.

## 6. Estado/capas donde aparece

`/final`, z10 decorativo; transform opcional <=1.5%, estático en reduced motion.

## 7. Canvas final

`1440×2560`.

## 8. Ratio de generación

9:16; pedir la relación, sin afirmar dimensiones nativas de la herramienta.

## 9. Formato final

WebP con alpha.

## 10. Fondo opaco/transparente

Transparente real fuera del contenido; sin matte opaco.

## 11. Alpha esperado

Esperado; bbox objetivo x=6%–94%, y=30%–76%, con bleed mínimo 48 px.

## 12. Orientación

Portrait, capa propia.

## 13. z-order

`z10`.

## 14. Core protegido

Eje central, cinco respiraciones y bbox indicado por O03; el layer no puede ocupar título, accesos, Lía ni mirador.

## 15. Crop permitido

Sólo transparencia exterior al bbox; no cortar crestas, río/camino ni bleed de 48 px.

## 16. Contenido obligatorio

- Dos hombros de colina media y conector central de río/camino coherentes con ENV-P.
- Vegetación media escasa y acentos de haze/luz localizados que pertenezcan al plano móvil.
- Alpha limpio y solape suficiente para transform máximo 1.5% sin seams.
- Fallback estático en transform:none; ENV-P continúa completo si esta capa no carga.

## 17. Contenido prohibido

- Cielo, sol, montañas lejanas completas o color base del valle ya horneado en ENV.
- Accesos, Lía, foreground, UI, texto, motas o velo de haze global.
- Duplicación exacta de detalles de ENV-P o fondo opaco.

## 18. Referencias exactas a adjuntar

| Orden | Archivo externo | ID | Tomar | No copiar |
| ---: | --- | --- | --- | --- |
| 1 | `O03_depth_portrait_layer_map.png` | `O03` | bbox, bleed, plano permitido y exclusiones | texto/colores de guía |
| 2 | `R10_world4_rear_depth_plane_v01.png` | `R10` | separación técnica de plano alpha | forma y textura W4 |
| 3 | `R11_world4_haze_overlay_v01.png` | `R11` | haze localizado y alpha suave | distribución/textura W4 |
| 4 | `R01_08_pantalla_final_mirador.png` | `R01` | eje y relación de planos | elementos literales |

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
Create only a transparent mid-depth layer in clean, warm, poetic pixel art for a portrait 9:16 valley scene viewed from an elevated balcony. Isolate two restrained mid-distance ridge shoulders, a readable central continuation of the winding river or path, sparse mid-distance vegetation masses, and a few localized haze or light accents that logically sit between a complete opaque distant environment and later access objects. Keep true transparency everywhere else, with clean soft-to-pixel edges and at least the documented safety overlap for subtle parallax. Maintain one apparent pixel scale, clear silhouettes, the approved warm/cool relation, and a calm center around the five future access pockets. The layer must still align when motion is disabled and must add depth without being required for semantic completeness.
```

## 23. Prompt negativo en inglés

```text
text, letters, numbers, logos, signatures, watermarks, UI, buttons, labels, credits, Lia, characters, humans, animals, floating islands, station portals, five access objects, photorealism, smooth vector gradients, glossy 3D render look, anime, extra worlds, World VI, excessive particles, global bloom veil, fisheye lens, impossible perspective, symmetrical repetition, low-resolution pixel noise, mixed pixel scales, blurry resampling, cropped protected regions, opaque background, full sky, sun disk, complete distant mountains, baked environment duplicate, foreground railing, hard rectangular matte, global fog veil
```

## 24. Instrucciones de generación

- Esperar FINAL-ENV-P-001 aprobado; usarlo sólo para alinear seams, no para duplicarlo.
- Adjuntar O03, R10, R11 y R01 en ese orden; pedir una sola capa transparente.
- Rechazar cualquier fondo opaco o detalle fuera del bbox antes de Photopea.
- Probar composición estática y desplazamientos máximos documentales antes de exportar.

## 25. Criterios de aceptación visual

Checklist visual:

- Plano medio distinguible sin competir con las cinco respiraciones.
- Retirar la capa deja ENV-P completo; activarla añade profundidad sin seams.
- Haze localizado, no velo; río/camino conecta con el eje.
- Bordes y pixel scale consistentes en miniatura portrait.

La aceptación requiere revisión humana explícita; un hash, dimensión o pase
técnico no la sustituye.

## 26. Hard fails

- Fondo opaco, matte, seams o bleed menor a 48 px.
- Duplicación visible de ENV-P o inclusión de cualquier elemento prohibido.
- Capa necesaria para entender el valle o desalineada en transform:none.

Cualquier hard fail detiene el asset; no se corrige produciendo el siguiente.

## 27. Instrucciones de Photopea

- Conservar master con ENV-P como capa de referencia bloqueada y no exportable.
- Ajustar a 1440×2560; limpiar alpha sin borrar el bleed mínimo de 48 px.
- Medir alpha bbox; inspeccionar halos sobre fondos claro, oscuro y ENV-P.
- Probar transform x±22 px/y±38 px y reduced motion transform:none; corregir seams.

Flujo no destructivo: master editable fuera de runtime, duplicado de trabajo,
overlay bloqueado, revisión al 100% y miniatura, export final separado.

## 28. Exportación final

Exportar `final_valley_depth_portrait_v01.webp`, 1440×2560, RGBA con alpha real, objetivo <=450 KiB; no promover.

Checklist técnico:

- filename y canvas exactos;
- modo/alpha conforme al contrato;
- ausencia de texto generado, seams, banding y halos;
- presupuesto preliminar comprobado, no asumido;
- SHA-256 y bytes calculados sobre la exportación;
- para alpha: bbox reportado y prueba sobre fondos claro/oscuro;
- ninguna copia en runtime ni `current-used`.

## 29. Metadata/hash que deberá reportarse

Reportar filename, canvas, modo, alpha=true, alpha bbox en píxeles, bytes, SHA-256, bleed real, herramienta/modelo, fecha y correcciones.

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

FINAL-ENV-P-001 aprobado; O03; H07 controlado; prueba de seams y reduced motion.

La secuencia de producción sigue el orden 1→6. Aunque el brief esté listo, no
se salta una dependencia ni se produce en lote.

## 32. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`

Este estado declara el brief listo, no el asset producido, aprobado o integrado.
