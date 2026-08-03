# FINAL-MIRADOR-L-001 — Brief de producción

- Clasificación: `PREPRODUCTION — NOT RUNTIME`
- Estado del brief: `READY_FOR_HUMAN_ASSET_PRODUCTION`
- Orden de producción autorizado: 6 de 6; producir uno por uno.

## 1. ID

`FINAL-MIRADOR-L-001`

## 2. Filename final exacto

`final_mirador_foreground_landscape_v01.webp`

## 3. Función narrativa

Ubicar al visitante en el mirador landscape sin consumir el alto crítico.

## 4. Función visual

Foreground alpha ancho y bajo de plataforma/barandal/materialidad aprobada.

## 5. Consumidor futuro

`FinalForegroundLayer`. Consumidor previsto, todavía inexistente/no integrado por 021D.

## 6. Estado/capas donde aparece

`/final`, z70 decorativo detrás de Lía/UI; estático en reduced motion.

## 7. Canvas final

`2560×900`.

## 8. Ratio de generación

128:45 (~2.844:1); usar el modo wide soportado más cercano y ajustar con O06, sin asumir pixels nativos.

## 9. Formato final

WebP con alpha.

## 10. Fondo opaco/transparente

Transparente real; sólo masa estructural del mirador.

## 11. Alpha esperado

Esperado; bbox medido, bordes sin matte.

## 12. Orientación

Landscape; corresponde al tramo scene-y=540–1440 del artboard 2560×1440.

## 13. z-order

`z70`.

## 14. Core protegido

Reservar arco I–V, Lía, acciones, créditos y modal; oclusores <=10% de ancho por lado y barandal bajo.

## 15. Crop permitido

Sólo extremos exteriores y borde inferior; nunca reducir alto útil ni cortar silueta estructural.

## 16. Contenido obligatorio

- Plataforma y barandal anchos/bajos recompuestos para 16:9.
- Piedra/madera en masas claras, plantas laterales escasas y sombra de contacto.
- Lámpara estable y atril sin texto sólo si no invaden el gate 667×375.
- Centro, extremos de acciones y franja de créditos tranquilos.

## 17. Contenido prohibido

- Crop/outpainting del foreground portrait.
- Lía, accesos, UI, texto, llama, motas, feedback, fondo opaco o sombras ajenas.
- Barandal alto u oclusores que reduzcan el alto útil.

## 18. Referencias exactas a adjuntar

| Orden | Archivo externo | ID | Tomar | No copiar |
| ---: | --- | --- | --- | --- |
| 1 | `R01_08_pantalla_final_mirador.png` | `R01` | materialidad y relación balcón-valle | layout portrait literal |
| 2 | `O06_mirador_landscape_exclusion_map.png` | `O06` | reservas, alto crítico y masas permitidas | texto/colores técnicos |
| 3 | `R02_atlas_final_revision_libre.png` | `R02` | jerarquía del plano físico | silueta/portales/UI literales |
| 4 | `R12_world4_table_top_v01.png` | `R12` | masa y sombra de contacto | silueta/material exactos |
| 5 | `R15_world5_plants_material.webp` | `R15` | masas vegetales alpha | plantas/macetas exactas |

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
Create only a transparent structural foreground layer in clean, warm, poetic pixel art, independently composed as a very wide, low landscape balcony plane. Build a restrained stone-and-wood overlook platform and low railing with large worn stone masses, simple warm wood grain, sparse bronze accents, contact shadows, and small grouped plants near the far sides. Preserve the short 667 by 375 viewport: keep the five-access arc, central Lia reserve, lower action targets, credits, and modal region unobstructed. Side occluders must be narrow, the railing must stay low, and optional stable lamp or textless lectern details must remain secondary. Use true transparency, clean alpha edges, one apparent pixel scale, clear silhouettes, and calm detail density. Compose this layer independently; do not crop, rotate, or extend the portrait foreground.
```

## 23. Prompt negativo en inglés

```text
text, letters, numbers, logos, signatures, watermarks, UI, buttons, labels, credits, Lia, characters, humans, animals, floating islands, station portals, five access objects, photorealism, smooth vector gradients, glossy 3D render look, anime, extra worlds, World VI, excessive particles, global bloom veil, fisheye lens, impossible perspective, symmetrical repetition, low-resolution pixel noise, mixed pixel scales, blurry resampling, cropped protected regions, portrait crop, portrait outpainting, opaque background, baked valley, tall railing, oversized side occluders, animated flame, writing on book or signs, centered large object
```

## 24. Instrucciones de generación

- No iniciar hasta revisar FINAL-MIRADOR-P-001 y aprobar FINAL-ENV-L-001.
- Adjuntar R01, O06, R02, R12 y R15; pedir una propuesta wide transparente.
- Rechazar crop portrait, fondo opaco o pérdida de alto útil antes de Photopea.
- Evaluar sobre ENV-L, checkerboard y miniatura 667×375.

## 25. Criterios de aceptación visual

Checklist visual:

- Foreground ancho/bajo; arco, Lía y UI libres en 667×375.
- Composición propia, no extensión de portrait.
- Materiales claros, oclusores <=10%, centro tranquilo y alpha limpio.
- No reduce el alto útil ni parece una mesa W4 copiada.

La aceptación requiere revisión humana explícita; un hash, dimensión o pase
técnico no la sustituye.

## 26. Hard fails

- Crop/outpainting portrait, texto, Lía/accesos/UI o fondo opaco.
- Barandal/oclusores que tapen arco, Lía, acciones o créditos.
- Alpha con matte, fotorrealismo, ruido o silueta copiada de W4.

Cualquier hard fail detiene el asset; no se corrige produciendo el siguiente.

## 27. Instrucciones de Photopea

- Conservar master independiente; ENV-L/O06 son referencias bloqueadas no exportables.
- Ajustar a 2560×900 y alinear como scene-y=540–1440.
- Limpiar alpha, medir bbox y revisar halos sobre tres fondos.
- Validar 667×375, 844×390 y 1365×768; no hornear sombras ajenas.

Flujo no destructivo: master editable fuera de runtime, duplicado de trabajo,
overlay bloqueado, revisión al 100% y miniatura, export final separado.

## 28. Exportación final

Exportar `final_mirador_foreground_landscape_v01.webp`, 2560×900, RGBA con alpha, objetivo <=600 KiB; no promover.

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

FINAL-ENV-L-001 y FINAL-MIRADOR-P-001 aprobados; O06; H07 controlado; gate 667×375.

La secuencia de producción sigue el orden 1→6. Aunque el brief esté listo, no
se salta una dependencia ni se produce en lote.

## 32. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`

Este estado declara el brief listo, no el asset producido, aprobado o integrado.
