# FINAL-ENV-P-001 — Brief de producción

- Clasificación: `PREPRODUCTION — NOT RUNTIME`
- Estado del brief: `READY_FOR_HUMAN_ASSET_PRODUCTION`
- Orden de producción autorizado: 1 de 6; producir uno por uno.

## 1. ID

`FINAL-ENV-P-001`

## 2. Filename final exacto

`final_environment_portrait_v01.webp`

## 3. Función narrativa

Sostener el cierre contemplativo del recorrido sin crear un Mundo VI.

## 4. Función visual

Fondo opaco completo de cielo, valle lejano y eje sol-río para la cámara portrait.

## 5. Consumidor futuro

`FinalEnvironmentLayer`. Consumidor previsto, todavía inexistente/no integrado por 021D.

## 6. Estado/capas donde aparece

`/final`, capa decorativa base z0 en todos los estados; sin interacción.

## 7. Canvas final

`1440×2560`.

## 8. Ratio de generación

9:16; pedir la relación, sin afirmar dimensiones nativas de la herramienta.

## 9. Formato final

WebP opaco.

## 10. Fondo opaco/transparente

Opaco; cobertura completa sin alpha ni matte.

## 11. Alpha esperado

No esperado; alpha=false.

## 12. Orientación

Portrait, composición propia.

## 13. z-order

`z0`.

## 14. Core protegido

76% central del ancho (x=12%–88%); título y cinco respiraciones, eje sol-río, Lía, acciones y créditos no pueden quedar comprometidos.

## 15. Crop permitido

Sólo cielo superior, valle lateral y vegetación periférica fuera del core; nunca el eje central ni las cinco respiraciones.

## 16. Contenido obligatorio

- Cielo de atardecer con fuente luminosa central y nubes contenidas.
- Montañas lejanas, valle amplio y relieve lejano integrado al opaco.
- Río o camino sinuoso central legible al reducir a 375×667.
- Cinco zonas de respiración vacías en patrón 2–1–2 para assets posteriores.
- Zona superior tranquila para título DOM y tercio inferior compatible con mirador y Lía.
- Pixelart limpio; relación cálido/frío aproximada 75/25 y siluetas antes que microdetalle.

## 17. Contenido prohibido

- Accesos, islas, portales, Lía, mirador, barandal, piso, lámpara, atril, macetas u oclusores foreground.
- Texto, UI, créditos, marcas técnicas, motas, FX o bruma destinada a capa móvil.
- Semántica nueva, Mundo VI, fotorrealismo o masa plana que fusione todos los planos.

## 18. Referencias exactas a adjuntar

| Orden | Archivo externo | ID | Tomar | No copiar |
| ---: | --- | --- | --- | --- |
| 1 | `R01_08_pantalla_final_mirador.png` | `R01` | cámara elevada, eje sol-río, tono y materialidad | texto, portales, Lía y layout literal |
| 2 | `O01_env_portrait_generation_overlay.png` | `O01` | core, horizonte, anchors y exclusiones | colores de guía y texto técnico |
| 3 | `R13_world5_environment_portrait.webp` | `R13` | disciplina de canvas y escala aparente | cavidad, textura y forma |

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
Create an environment-layer-only illustration in clean, warm, poetic pixel art for an elevated balcony viewpoint, composed independently for a portrait 9:16 frame. Build a complete opaque sunset background with a central warm sun, restrained clouds, distant mountains, a broad valley, and a clearly readable winding river or path descending along the central axis. Preserve five calm negative-space pockets in a 2-1-2 arrangement for later interactive access assets, while keeping a quiet upper title zone and an unobstructed lower central zone for a later foreground and Lia. Use clear silhouettes, one consistent apparent pixel scale, short defined highlights, large material masses, and an approximately 75/25 warm-to-cool relationship. The background must remain coherent if every later layer is hidden. Include only distant atmosphere naturally baked into the opaque environment; keep mid-depth movable detail out of this layer. Make the composition readable when reduced to a 375 by 667 viewport. No operational text or technical marks in the artwork.
```

## 23. Prompt negativo en inglés

```text
text, letters, numbers, logos, signatures, watermarks, UI, buttons, labels, credits, Lia, characters, humans, animals, floating islands, station portals, five access objects, photorealism, smooth vector gradients, glossy 3D render look, anime, extra worlds, World VI, excessive particles, global bloom veil, fisheye lens, impossible perspective, symmetrical repetition, low-resolution pixel noise, mixed pixel scales, blurry resampling, cropped protected regions, balcony foreground, railing, floor, lamp, lectern, potted plants, opaque haze overlay, separate FX
```

## 24. Instrucciones de generación

- Adjuntar únicamente R01, O01 y R13 en ese orden.
- Solicitar una sola propuesta portrait 9:16; no generar lote ni variante landscape.
- Evaluar primero eje, core y respiraciones; rechazar antes de cualquier edición si falla la cámara.
- No pedir pixels nativos; conservar la salida original y llevar sólo la propuesta aprobada a Photopea.

## 25. Criterios de aceptación visual

Checklist visual:

- Sol, horizonte y río/camino alineados con O01.
- Cinco zonas de respiración distinguibles sin dibujar accesos.
- Título y tercio inferior quedan tranquilos; lectura correcta a 375×667.
- Pixelart consistente, sin seams, ruido uniforme ni velo bloom.

La aceptación requiere revisión humana explícita; un hash, dimensión o pase
técnico no la sustituye.

## 26. Hard fails

- Cualquier texto/UI, acceso, Lía o foreground horneado.
- Crop del core, pérdida del eje, perspectiva imposible o valle ilegible en miniatura.
- Fotorrealismo, look 3D/vectorial, pixel noise o semántica de Mundo VI.

Cualquier hard fail detiene el asset; no se corrige produciendo el siguiente.

## 27. Instrucciones de Photopea

- Conservar un master editable fuera de runtime y duplicar antes de crop/resize.
- Superponer O01 sin reescalado relativo; proteger x=12%–88% y ajustar sólo periferia.
- Llevar a 1440×2560 con resampling nearest-neighbor o método que preserve pixelart; inspeccionar al 100% y miniatura.
- Eliminar cualquier texto generado; revisar banding, seams y halos sin suavizado destructivo.

Flujo no destructivo: master editable fuera de runtime, duplicado de trabajo,
overlay bloqueado, revisión al 100% y miniatura, export final separado.

## 28. Exportación final

Exportar `final_environment_portrait_v01.webp`, 1440×2560, RGB opaco, objetivo preliminar <=900 KiB; no promover a runtime/current-used.

Checklist técnico:

- filename y canvas exactos;
- modo/alpha conforme al contrato;
- ausencia de texto generado, seams, banding y halos;
- presupuesto preliminar comprobado, no asumido;
- SHA-256 y bytes calculados sobre la exportación;
- para alpha: bbox reportado y prueba sobre fondos claro/oscuro;
- ninguna copia en runtime ni `current-used`.

## 29. Metadata/hash que deberá reportarse

Reportar filename, 1440×2560, modo, alpha=false, bytes, SHA-256, herramienta/modelo mostrado, fecha, referencias adjuntas y correcciones Photopea.

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

Art Bible/cámara portrait HUMAN_APPROVED; H07 controlado; ninguna dependencia de asset producido.

La secuencia de producción sigue el orden 1→6. Aunque el brief esté listo, no
se salta una dependencia ni se produce en lote.

## 32. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`

Este estado declara el brief listo, no el asset producido, aprobado o integrado.
