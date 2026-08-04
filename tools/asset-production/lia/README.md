# Ensamblador no-runtime del idle final de Lía

Esta carpeta implementa el contrato corregido por `GVO_FINAL_021G_R1`. No es
código runtime, no genera arte y no promueve archivos a `public/assets` ni a
`current-used`.

## Decisión de blink

`OPTION_A_SELECTED_FOR_INITIAL_PRODUCTION`

Los tres estados canónicos de ojos comparten canvas `941×1672`, pero todavía no
existe un registro aprobado que los alinee con la futura master `1024×1024`.
Aplicarlos como overlay exigiría inventar una transformación o reconstruir la
cabeza. Por eso el primer sheet 3×2 debe traer los estados de ojos dentro de sus
frames, manteniendo la master aprobada como referencia obligatoria.

La Opción B sólo puede reabrirse después de aprobar la master y demostrar una
transformación común, determinista y visualmente limpia para cabeza y ojos. No
se permite resolver esa incertidumbre por ajuste manual frame a frame.

## Uso

Requisitos: Python 3 y Pillow ya disponibles en el entorno. No instalar nuevas
dependencias.

```powershell
python tools/asset-production/lia/build_final_lia_idle.py `
  --sheet C:\ruta\final_lia_idle_3x2_sheet_v01.png `
  --output-dir C:\ruta\salida-no-runtime `
  --interpolation nearest
```

Interpolaciones permitidas:

- `nearest`: conserva el pixel scale; opción inicial recomendada.
- `lanczos`: sólo si una inspección humana demuestra que el source no usa una
  grilla de píxel rígida y que no introduce blur material.

El flag `--force` sólo permite sobrescribir los cuatro filenames exactos de
salida. Debe usarse después de comprobar manualmente el directorio destino.

## Inputs

- Una sheet PNG RGBA `3×2`.
- Seis celdas cuadradas naturales.
- Orden row-major: F1, F2, F3 / F4, F5, F6.
- Source aprobado y fuera de runtime.

La utilidad calcula SHA-256 antes y después del proceso y falla si la sheet
fuente cambia.

## Outputs

- `final_lia_idle_contemplative_6f_v01.webp`: strip WebP RGBA lossless
  `1536×256`, 6×1.
- `final_lia_idle_contemplative_6f_preview.png`: preview documental estático.
- `final_lia_idle_contemplative_6f_preview_animated.webp`: preview documental
  animado.
- `final_lia_idle_contemplative_6f_metrics.json`: hashes, bboxes, centros,
  baselines, drift, escalas, safe areas y cierre F6→F1.

Ninguna salida queda aprobada o autorizada para runtime por el solo hecho de
pasar la herramienta. El estado posterior es
`PRODUCTION_OUTPUT_PENDING_HUMAN_REVIEW / NOT_RUNTIME`.

## Reglas de fallo

La ejecución termina con código `2` si:

- el input no tiene alpha;
- el layout no es 3×2 con seis celdas cuadradas;
- un frame está vacío o toca cualquier borde;
- un margen final es menor de 16 px;
- el bbox visible sale de 46–54 % W o 58–64 % H;
- el centro deriva más de 6 px respecto a F1;
- el baseline deriva más de 4 px respecto a F1;
- ancho o alto visible difieren más de 2 % frente a F1;
- un destino existe y no se entregó `--force`;
- la sheet cambia durante el proceso.

## Self-test

```powershell
python tools/asset-production/lia/build_final_lia_idle.py --self-test
```

El self-test crea en un directorio temporal una fixture geométrica 3×2 válida,
verifica los cuatro outputs y confirma que una fixture insegura es rechazada.
No conserva artefactos ni produce un asset de Lía.
