# Manifiesto archivo historico visual - 007J transition-world

| Campo | Valor |
|---|---|
| ID de lote | GVO-EV-007J-001 |
| Ticket origen | 007J |
| Fecha | 2026-06-12 |
| Aprobador | Ing. Jose David |
| Ruta original | docs/visual/transition-world/ |
| Ruta de archivo externo | C:\Users\JOSE DAVID\Documents\OKUA_ARCHIVE\GVO\evidencia_visual\007J_transition_world |
| Manifiesto CSV | docs/archive_manifests/007J_transition_world.csv |
| Cantidad de archivos origen | 101 |
| Cantidad de archivos destino | 101 |
| Peso aproximado origen | 59.72 MB |
| Peso aproximado destino | 59.72 MB |
| Bytes origen | 62624460 |
| Bytes destino | 62624460 |
| Metodo de verificacion | SHA256 por archivo + conteo + suma de bytes |
| Estado | EJECUTADO_VALIDADO |
| PR | PR_NO_APLICA |

## Motivo

Archivo historico visual del lote transition-world seleccionado en 007I por su equilibrio entre impacto de peso, trazabilidad historica y riesgo bajo-medio. El lote sale del repo vivo despues de copia externa verificada, conservando manifiestos livianos dentro de GVO.

## Rutas principales

- `art-direction/`
- `art-direction/t003e0/`
- `art-direction/t003e1_reference_pack/`
- `validation/`
- `validation/t003c/` a `validation/t003e8/`

## Extensiones

- .md: 24
- .png: 77

## CSV

Columnas:

```csv
relative_path,bytes,sha256
```

El CSV contiene 101 filas de inventario, excluyendo encabezado.

## Validaciones posteriores

| Validacion | Resultado | Estado |
|---|---|---|
| git status --short --branch | Cambios esperados: eliminacion de docs/visual/transition-world/** y creacion de manifiestos 007J | PASO |
| git diff --stat | 101 archivos archivados fuera del repo; 1217 lineas documentales removidas del lote pesado | PASO |
| Test-Path docs\\visual\\transition-world | False | PASO |
| Test-Path C:\\Users\\JOSE DAVID\\Documents\\OKUA_ARCHIVE\\GVO\\evidencia_visual\\007J_transition_world | True | PASO |
| Get-ChildItem destino -Recurse -File \| Measure-Object Length -Sum | Count=101, Sum=62624460 | PASO |
| Test-Path docs\\archive_manifests\\007J_transition_world.md | True | PASO |
| Test-Path docs\\archive_manifests\\007J_transition_world.csv | True | PASO |
| npm run status | Ejecutado correctamente | PASO |
| npm run audit:assets | Auditoria de assets OK: sin URLs externas, CDN ni uso de audio. | PASO |

## Controles de calidad

| Control | Resultado | Estado |
|---|---|---|
| Manifiesto sin variables sin resolver | Sin marcadores de destino o ruta | PASO |
| Ruta externa literal | C:\Users\JOSE DAVID\Documents\OKUA_ARCHIVE\GVO\evidencia_visual\007J_transition_world | PASO |
| Encabezado CSV | relative_path,bytes,sha256 | PASO |
| Conteo origen y destino | 101 = 101 | PASO |
| Bytes origen y destino | 62624460 = 62624460 | PASO |
| SHA256 origen y destino | 101 coincidencias, 0 diferencias durante verificacion de copia | PASO |
| Origen en GVO | docs/visual/transition-world/ no existe | PASO |
| Archivo externo | Existe y fue verificado | PASO |
| npm run audit:assets | Pasa | PASO |
| PR | PR_NO_APLICA | PASO |

## Advertencias

- No tocar runtime /transition/intro-to-station-1.
- No tocar preview /dev/transition-world.
- No tocar src/**, public/**, assets/**, src/assets/transition-world/**, Atlas 006I ni documentos normativos.
- No usar red.
- No crear Pull Request: PR_NO_APLICA.
- Este manifiesto no contiene la evidencia visual pesada; solo conserva trazabilidad del archivo externo.
