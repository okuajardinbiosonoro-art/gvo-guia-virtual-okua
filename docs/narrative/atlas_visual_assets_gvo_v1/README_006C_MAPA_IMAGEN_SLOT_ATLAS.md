# README 006C — Mapa imagen-slot del Atlas

Este directorio consolida la raíz visual del futuro PDF B — Atlas Visual de Pantallas e Interacciones GVO.

## Finalidad

El archivo `manifest_006c_slot_image_map.csv` conecta cada slot de la matriz narrativa con una imagen representativa del Atlas.
La matriz conserva los 197 diálogos y textos exactos; este mapa sólo define qué referencia visual acompaña cada slot.

## Tipos de imagen

- `captura_actual`: imagen tomada desde el runtime real con Playwright. Sirve para documentar lo que ya existe implementado.
- `mockup_aprobado`: imagen aprobada como intención visual o patrón esperado. Puede mostrar estados aún no reflejados completamente en runtime.
- `referencia_base`: imagen copiada desde `docs/narrative/visual_refs/`. Sirve como base editorial cuando todavía no hay captura o mockup específico suficiente.

## Imágenes representativas

No debe existir una imagen por cada diálogo.
Una misma imagen puede representar varios slots cuando comparten pantalla, estado, patrón visual o interacción.
Por eso `representative_only` queda marcado como `yes`: el PNG guía la composición visual, pero no reemplaza el texto del slot.

## Pendientes visuales

`requires_new_image=yes` indica que la imagen actual es temporal o demasiado general para el Atlas final.
`later_image_tanda` sugiere en qué tanda futura conviene producir la imagen específica.
`manifest_006c_pending_visuals.csv` agrupa esos pendientes para pedir nuevas imágenes sin repetir los 197 slots.

## Uso para PDF B

`manifest_006c_atlas_assets_consolidated.csv` describe todos los assets disponibles en la carpeta Atlas.
`manifest_006c_slot_image_map.csv` dice qué imagen primaria y secundaria acompaña cada slot.
`manifest_006c_pending_visuals.csv` separa lo que ya está cubierto de lo que debe generarse o capturarse después.

## Texto final

Los textos finales siguen viviendo en `docs/narrative/02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO.csv` y su versión `.xlsx`.
Los PNG no son fuente de texto final y no deben usarse para fijar copy definitivo dentro del Atlas.
