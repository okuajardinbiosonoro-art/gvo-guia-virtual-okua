# FINAL-LIA-IDLE-001 — Contrato de ensamblaje

> PREPRODUCTION — NOT RUNTIME. Ensamblaje técnico no-runtime; pasar QA automática no equivale a aprobación humana.

## Input

- `final_lia_idle_3x2_sheet_v01.png`, PNG RGBA aprobado.
- Layout 3×2 con celdas cuadradas y orden row-major F1–F6.
- Source fuera de runtime; la herramienta verifica SHA antes/después.

## Tool usage

```powershell
python tools/asset-production/lia/build_final_lia_idle.py `
  --sheet C:/ruta/final_lia_idle_3x2_sheet_v01.png `
  --output-dir C:/ruta/salida-no-runtime `
  --interpolation nearest
```

`lanczos` existe como opción explícita, pero `nearest` es la inicial para
preservar pixel scale. No se instalan dependencias.

## Transformación

1. Validar alpha y ratio 3×2.
2. Dividir seis celdas cuadradas row-major.
3. Redimensionar cada celda una sola vez a 256×256.
4. Validar bboxes, safe area, centro, baseline y escala.
5. Ensamblar F1–F6 en 1536×256.
6. Exportar outputs y metadata.

## Outputs

- `final_lia_idle_contemplative_6f_v01.webp`: WebP RGBA lossless 1536×256.
- `final_lia_idle_contemplative_6f_preview.png`: preview estático documental.
- `final_lia_idle_contemplative_6f_preview_animated.webp`: preview loop documental.
- `final_lia_idle_contemplative_6f_metrics.json`: métricas y hashes.

## Métricas

Por frame: alpha bbox, ancho/alto visible, porcentaje visible, centro alpha,
drift desde F1, baseline, baseline drift, scale delta, márgenes, contactos y
safe-area. Para el loop: alpha IoU y mean RGBA delta F6→F1.

## Failure rules

Fallar si frame count no es 6; falta alpha; celdas no son cuadradas; un frame
toca borde; cualquier margen final es <16 px; bbox sale de 46–54 % W o 58–64 %
H; center drift >6 px; baseline drift respecto a F1 >4 px; ancho/alto varía >2
%; source cambia; output existente sin `--force`; canvas final no es 1536×256.

## Blink y preview

Blink seleccionado: `OPTION_A_SHEET_STATES`. Secuencia F1 open, F2 open, F3
half, F4 closed, F5 reopening, F6 open. Preview default: 4000 ms total, loop
continuo, sólo documental.

## Metadata/hash y gate final

El JSON registra SHA-256 source antes/después, configuración, límites, métricas,
outputs y hashes. Resultado automático:
`PRODUCTION_OUTPUT_PENDING_HUMAN_REVIEW / NOT_RUNTIME`.

La promoción a runtime o `current-used` requiere ticket futuro explícito y
aprobación humana del asset; esta herramienta no la realiza.
