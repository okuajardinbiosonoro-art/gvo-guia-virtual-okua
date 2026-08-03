# FINAL-ENV-L-001 — Brief de producción

- Clasificación: `PREPRODUCTION — NOT RUNTIME`
- Estado del brief: `READY_FOR_HUMAN_ASSET_PRODUCTION`
- Orden de producción autorizado: 2 de 6; producir uno por uno.

## 1. ID

`FINAL-ENV-L-001`

## 2. Filename final exacto

`final_environment_landscape_v01.webp`

## 3. Función narrativa

Sostener el mismo cierre contemplativo en cámara landscape sin derivarlo del portrait.

## 4. Función visual

Fondo opaco 16:9 independiente con arco de cinco respiraciones y eje central.

## 5. Consumidor futuro

`FinalEnvironmentLayer`. Consumidor previsto, todavía inexistente/no integrado por 021D.

## 6. Estado/capas donde aparece

`/final`, capa decorativa base z0 en todos los estados; sin interacción.

## 7. Canvas final

`2560×1440`.

## 8. Ratio de generación

16:9; pedir la relación, sin afirmar dimensiones nativas de la herramienta.

## 9. Formato final

WebP opaco.

## 10. Fondo opaco/transparente

Opaco; cobertura completa sin alpha ni matte.

## 11. Alpha esperado

No esperado; alpha=false.

## 12. Orientación

Landscape, composición propia; prohibido crop/extensión/rotación del portrait.

## 13. z-order

`z0`.

## 14. Core protegido

82% central del ancho y 86% del alto (x=9%–91%, y=7%–93%); proteger extremos I/V, eje, Lía, acciones y créditos.

## 15. Crop permitido

Sólo cielo o vegetación periféricos fuera del core; nunca extremos I/V ni alto útil del gate 667×375.

## 16. Contenido obligatorio

- Atardecer, montañas, valle y río/camino del mismo vocabulario aprobado, recompuestos para 16:9.
- Arco amplio con cinco zonas vacías; eje central claro y laterales respirables.
- Lectura completa en 667×375 y 1365×768, sin depender de crop portrait.
- Zona inferior compatible con foreground de 900 px y UI posterior.

## 17. Contenido prohibido

- Crop, outpainting automático, rotación o relleno lateral del portrait.
- Accesos, Lía, mirador, UI, texto, FX, foreground o Mundo VI.
- Detalle uniforme que cierre el alto útil de 667×375.

## 18. Referencias exactas a adjuntar

| Orden | Archivo externo | ID | Tomar | No copiar |
| ---: | --- | --- | --- | --- |
| 1 | `R01_08_pantalla_final_mirador.png` | `R01` | tono, eje y profundidad narrativa | layout portrait literal y sujetos |
| 2 | `O02_env_landscape_generation_overlay.png` | `O02` | core 16:9, arco, 667×375 y exclusiones | texto y colores técnicos |
| 3 | `R14_world5_environment_landscape.webp` | `R14` | disciplina de canvas landscape independiente | cavidad, textura y forma |

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
Create a new environment-layer-only illustration in clean, warm, poetic pixel art, independently composed for a landscape 16:9 elevated balcony viewpoint. Show a complete opaque sunset background with a centered light source, restrained clouds, distant mountains, a broad valley, and a winding river or path maintaining the central vertical narrative axis. Arrange five clear negative-space pockets as a wide arc for later access assets, protecting both outer pockets in a very short 667 by 375 viewport. Keep the upper title area and lower action, credit, foreground, and Lia zones calm and unobstructed. Use clear silhouettes, one consistent apparent pixel scale, large readable forms, short highlights, and an approximately 75/25 warm-to-cool balance. The image must be a genuinely recomposed landscape scene, not a crop, extension, rotation, or side fill of a portrait image. Include only distant atmosphere baked naturally into the opaque background and no separate mid-depth content.
```

## 23. Prompt negativo en inglés

```text
text, letters, numbers, logos, signatures, watermarks, UI, buttons, labels, credits, Lia, characters, humans, animals, floating islands, station portals, five access objects, photorealism, smooth vector gradients, glossy 3D render look, anime, extra worlds, World VI, excessive particles, global bloom veil, fisheye lens, impossible perspective, symmetrical repetition, low-resolution pixel noise, mixed pixel scales, blurry resampling, cropped protected regions, portrait crop, portrait outpainting, duplicated side fill, balcony foreground, railing, floor, lamp, lectern, opaque haze overlay
```

## 24. Instrucciones de generación

- No iniciar hasta que FINAL-ENV-P-001 haya sido producido y revisado humanamente.
- Adjuntar únicamente R01, O02 y R14; no adjuntar el binario portrait producido como base de crop.
- Solicitar una sola propuesta landscape 16:9 y evaluar primero el gate 667×375.
- Conservar salida original; Photopea sólo después de aprobar composición independiente.

## 25. Criterios de aceptación visual

Checklist visual:

- Arco completo y extremos I/V seguros en 667×375.
- Eje central y valle legibles; no parece una extensión del portrait.
- Core 82%×86% intacto y zona inferior compatible con foreground/UI.
- Pixelart coherente con portrait aprobado sin clonar su layout.

La aceptación requiere revisión humana explícita; un hash, dimensión o pase
técnico no la sustituye.

## 26. Hard fails

- Evidencia de crop/outpainting/rotación del portrait.
- Accesos, Lía, foreground, texto o UI horneados.
- I/V recortados, alto útil saturado o eje desplazado en 667×375.

Cualquier hard fail detiene el asset; no se corrige produciendo el siguiente.

## 27. Instrucciones de Photopea

- Conservar master independiente; no abrir el portrait como canvas base.
- Superponer O02 y verificar core x=9%–91%, y=7%–93% y gate corto.
- Llevar a 2560×1440 preservando pixelart; ajustar sólo periferia permitida.
- Revisar seams, banding, texto generado y miniaturas 667×375/1365×768.

Flujo no destructivo: master editable fuera de runtime, duplicado de trabajo,
overlay bloqueado, revisión al 100% y miniatura, export final separado.

## 28. Exportación final

Exportar `final_environment_landscape_v01.webp`, 2560×1440, RGB opaco, objetivo preliminar <=900 KiB; no promover.

Checklist técnico:

- filename y canvas exactos;
- modo/alpha conforme al contrato;
- ausencia de texto generado, seams, banding y halos;
- presupuesto preliminar comprobado, no asumido;
- SHA-256 y bytes calculados sobre la exportación;
- para alpha: bbox reportado y prueba sobre fondos claro/oscuro;
- ninguna copia en runtime ni `current-used`.

## 29. Metadata/hash que deberá reportarse

Reportar filename, 2560×1440, modo, alpha=false, bytes, SHA-256, herramienta/modelo mostrado, fecha, referencias y correcciones.

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

FINAL-ENV-P-001 producido y revisado; Art Bible/cámara landscape HUMAN_APPROVED; H07 controlado.

La secuencia de producción sigue el orden 1→6. Aunque el brief esté listo, no
se salta una dependencia ni se produce en lote.

## 32. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`

Este estado declara el brief listo, no el asset producido, aprobado o integrado.
