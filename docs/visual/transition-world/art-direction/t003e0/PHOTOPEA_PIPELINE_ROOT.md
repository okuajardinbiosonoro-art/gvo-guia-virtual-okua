# Pipeline Photopea - Assets Transicion Mundo I: Raiz

## Entrada local sugerida

`C:\Users\JOSE DAVID\Desktop\OKUA\Aplicaciones\GVO_archivos_iniciales\transicion_entre_mundos_v1\01_referencias_chatgpt`

## Salida local sugerida

`C:\Users\JOSE DAVID\Desktop\OKUA\Aplicaciones\GVO_archivos_iniciales\transicion_entre_mundos_v1\02_aprobadas`

## Proceso para Lía

1. Abrir candidato en Photopea.
2. Verificar identidad: cinco petalos, visor opalescente, ojos media luna, collar ambar, bulbo inferior.
3. Eliminar cualquier texto, fondo o sombra no deseada.
4. Limpiar bordes con transparencia real.
5. Normalizar canvas a 96x96 o 128x128 px por frame.
6. Alinear frames por centro del visor/collar.
7. Exportar PNG transparente.
8. Exportar WebP solo como opcion optimizada, no reemplazo unico.
9. Guardar PSD editable.

## Proceso para portal

1. Separar base, glow, open y simbolo si vienen juntos.
2. Eliminar fondo.
3. Confirmar que no hay texto ni letras falsas.
4. Ajustar canvas a 192x288 o 224x336 px.
5. Mantener borde pixelart/crisp.
6. Exportar SVG si el vector conserva pixelart; si no, PNG transparente.
7. Guardar capas editables.

## Proceso para fondo

1. Mantener 9:16.
2. Exportar versiones 390x844 y 430x932 como referencia.
3. Sin textos incrustados.
4. Dejar centro y zona inferior limpios.
5. Evitar saturacion y blur moderno excesivo.

## Contact sheet

Crear `transition_root_contact_sheet_v1.png` en 1440x2560 con:

- fila 1: Lía master y referencia canonica;
- fila 2: idle 4 frames;
- fila 3: guide 2 frames + exit + blink;
- fila 4: portal inactive/activating/open;
- fila 5: symbol root y progress reference;
- fila 6: mockup 390 y 430 sin UI incrustada.

## Nombres de archivo

- `lia_transition_root_master.png`
- `lia_transition_root_idle_4f.png`
- `lia_transition_root_guide_2f.png`
- `lia_transition_root_exit_1f.png`
- `lia_transition_root_blink_1f.png`
- `portal_root_base.svg`
- `portal_root_glow.svg`
- `portal_root_open.svg`
- `symbol_root.svg`
- `transition_root_background_reference_390x844.png`
- `transition_root_background_reference_430x932.png`
- `transition_root_progress_reference.png`
- `transition_root_contact_sheet_v1.png`

## Control antes de entregar a Codex

- Abrir cada PNG sobre fondo oscuro y claro.
- Confirmar transparencia.
- Confirmar que no hay halos sucios.
- Confirmar que los frames no saltan de escala.
- Confirmar que nombres coinciden exactamente.
