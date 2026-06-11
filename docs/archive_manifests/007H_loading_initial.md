# Manifiesto de archivo historico visual - 007H loading-initial

## Identificacion

| Campo | Valor |
|---|---|
| ID de lote | GVO-EV-007H-001 |
| Ticket origen | 007H |
| Fecha | 2026-06-11 18:36:01 -05:00 |
| Aprobador | Ing. Jose David |
| Estado | EJECUTADO_VALIDADO |
| Motivo | Archivo historico visual por lote piloto de evidencia de carga inicial ya cerrada como etapa historica. |

## Rutas

| Campo | Valor |
|---|---|
| Ruta original | docs/visual/loading-initial/ |
| Ruta de archivo externo | C:\Users\JOSE DAVID\Documents\OKUA_ARCHIVE\GVO\evidencia_visual\007H_loading_initial |
| Manifiesto CSV | docs/archive_manifests/007H_loading_initial.csv |

## Conteo y peso

| Campo | Valor |
|---|---:|
| Cantidad de archivos origen | 127 |
| Cantidad de archivos destino | 127 |
| Peso aproximado origen | 18.72 MB |
| Peso aproximado destino | 18.72 MB |
| Bytes origen | 19627499 |
| Bytes destino | 19627499 |

## Metodo de verificacion

SHA256 por archivo, mas conteo total y suma de bytes origen/destino.

El inventario completo se conserva en docs/archive_manifests/007H_loading_initial.csv con columnas:

`relative_path,bytes,sha256`

## Rutas principales

| Ruta relativa | Bytes | SHA256 |
|---|---:|---|
| ANIMATION_MAP_CARGA_INICIAL_GVO_V1.md | 2438 | 1FDD9528D8D8304EEFA49C43D1B52B06A511B01C211D65324302762C763E3A87 |
| ANIMATION_MAP_CARGA_INICIAL_GVO_V2.md | 3622 | 5B1DBCE2CA658D652761168687D9FCB9BD0666836C73FBD357B4C5E37B4CB5FD |
| ANIMATION_MAP_CARGA_INICIAL_GVO_V3.md | 4737 | AA492AD4898F2F3AF8144ACFFD242706AD48F825E3AFE12E1BFDF911AEFB66B7 |
| ANIMATION_MAP_CARGA_INICIAL_GVO_V4.md | 5269 | FBD027018954C3B2AF2C0A3C82EB4E802A4176438CAB289D6D0397C2FC188425 |
| ANIMATION_MAP_CARGA_INICIAL_GVO_V5.md | 5508 | 55EE59A9EA30FD69CEEB5EA6F7D9994D5D26BAC32513C8C185BAC32564A29FF6 |
| ASSET_MANIFEST_CARGA_INICIAL_GVO_V1.md | 3709 | 81635D8EA0B5E13C50E86D27E6CC6C75401084247E059ECE3A325AEB20DDD876 |
| ASSET_NORMALIZATION_REPORT.md | 2566 | A2372CC673521E2122607D135B8F0467483EB59B1401FAA2CB8A4A8EA065BC45 |
| validation/t003e7d/loading-initial-t003e7d-390x844.png | 82165 | 0CC1034338D8F3BFCBFE6B3CAE9F7FDE5492B79E9ED5B6BE62A149D7F89A27D9 |
| validation/t003e7d/loading-initial-t003e7d-430x932.png | 92306 | 5B84CEDEB46D510455E7D79B79DF64976061F94E1760753CCF0578687C5415DC |
| validation/v10/loading_initial_v10_mobile.mp4 | 280077 | 8884334966E3476BA963EDE9900F55114EB301803FC312AA4001F26ABAC8A651 |
| validation/v10/mobile_360x640_end.png | 107892 | 6FFD199FAC0F8A2E9A68B0D5A03844BF6F2FEB411F25F3D0D724BCD89C9245D8 |
| validation/v10/mobile_360x640_mid.png | 105555 | DEA091735CF019F0C6D1AC5B80089230105830D6BF77518C0B21A3B7F2204D9A |

Nota: la tabla anterior muestra una muestra inicial del inventario. El listado completo esta en el CSV liviano versionado.

## Validaciones posteriores

| Validacion | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | Cambios esperados: baja de `docs/visual/loading-initial/` y alta de `docs/archive_manifests/`. | PASO |
| `git diff --stat` | 127 archivos historicos retirados del repo; manifiestos livianos pendientes de stage. | PASO |
| `Test-Path docs\visual\loading-initial` | `False` | PASO |
| `Test-Path "C:\Users\JOSE DAVID\Documents\OKUA_ARCHIVE\GVO\evidencia_visual\007H_loading_initial"` | `True` | PASO |
| `Get-ChildItem "...007H_loading_initial" -Recurse -File \| Measure-Object Length -Sum` | `Count=127`, `Sum=19627499` bytes. | PASO |
| `Test-Path docs\archive_manifests\007H_loading_initial.md` | `True` | PASO |
| `npm run status` | Ejecutado correctamente. | PASO |
| `npm run audit:assets` | `Auditoria de assets OK: sin URLs externas, CDN ni uso de audio.` | PASO |

## Advertencias

- El archivo externo esta fuera del repo GVO.
- No se movieron assets runtime.
- No se tocaron src/, public/, assets/, Atlas 006I, docs/status/, docs/process/, docs/decisions/, AGENTS.md, package.json ni lockfiles.
- No se uso red.
- No se instalaron dependencias.
