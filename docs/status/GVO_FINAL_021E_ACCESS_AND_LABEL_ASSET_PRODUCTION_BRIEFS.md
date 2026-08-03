# GVO_FINAL_021E — Briefs de producción de accesos I–V y placa de rótulo

- Fecha: 2026-08-03
- Pantalla: Final — Mirador (`/final`)
- Clasificación: `PREPRODUCTION / DOCUMENTATION / NOT_RUNTIME`
- Estado: `GVO_FINAL_021E_ACCESS_ASSET_PRODUCTION_BRIEFS_COMPLETE`

## 1. Baseline

| Campo | Valor verificado antes de escribir |
| --- | --- |
| Rama | `main` |
| HEAD | `1aca617b3fa91dd4b961aa388aea32e94ff26739` |
| `origin/main` local | `1aca617b3fa91dd4b961aa388aea32e94ff26739` |
| `refs/heads/main` remoto | `1aca617b3fa91dd4b961aa388aea32e94ff26739` |
| Divergencia | `0/0` |
| Worktree | limpio |

No se ejecutó `fetch`.

## 2. Autoridad y límites

021C mantiene `HUMAN_APPROVED` el Art Bible, las cámaras, los wireframes, los
anchors, el patrón de cinco accesos y la dirección visual. 021D define el
contrato Environment. 021E convierte el frente de accesos y placa en briefs
producibles sin generar arte.

- Generación de arte final: **NO**.
- Integración o código runtime: **NO**.
- `public/assets/**` y `current-used`: **sin cambios**.
- Assets Environment de Descargas: **auditados y preservados sin cambios**.
- Build, tests runtime, Playwright y navegador: **no ejecutados**.
- Los overlays son documentos de encaje; no son arte final ni runtime.
- Ninguna referencia queda autorizada para reutilización binaria.

## 3. Auditoría de los seis Environment aprobados

Cada filename tuvo una sola coincidencia en Descargas; no hubo duplicados
ambiguos. Los seis archivos se registran como
`APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME`.

| Ref | Archivo / ubicación | Bytes | Canvas / modo / alpha real | SHA-256 | Estado |
| --- | --- | ---: | --- | --- | --- |
| E01 | `I1/final_environment_portrait_v01.webp` | 157294 | 1440×2560 / RGBA / sí | `1E8B599BE197EE26E346B1B1974CAA571DE42AF4B8587758C801C914C04C1347` | `PASS_WITH_DOCUMENTED_ALPHA_DEVIATION` |
| E02 | `I2/final_environment_landscape_v01.webp` | 212234 | 2560×1440 / RGB / no | `EDB75703A398724B9084D800CF21B888D72B6028C4199DC1D7A2C5F5CC0D1D84` | `PASS` |
| E03 | `I3/final_valley_depth_portrait_v01.webp` | 108270 | 1440×2560 / RGBA / sí | `F64326254C5215CB44E0F9D93134B425E8806EA41E27556A4BBC40EA36D71E99` | `PASS` |
| E04 | `I4/final_valley_depth_landscape_v01.webp` | 107632 | 2560×1440 / RGBA / sí | `FA9999A33EA636F57FA901D8C06B4FF9694A27F66704DAE7968B9E2DC45EC42B` | `PASS` |
| E05 | `I5/final_mirador_foreground_portrait_v01.webp` | 124114 | 1440×1280 / RGBA / sí | `19290CF1995A8FAB2B643BEBC88126D3BA6E67A516A43877E1AA79A16E11427D` | `PASS` |
| E06 | `I6/final_mirador_foreground_landscape_v01.webp` | 168898 | 2560×900 / RGBA / sí | `455EDBA68398FBB8BC1A508C42D0EB1BC7D2B6AFC236BF5F8928C2356FD60544` | `PASS` |

E01 contradice únicamente la expectativa técnica de opacidad publicada por
021D: contiene 2880 píxeles totalmente transparentes, exactamente dos filas,
equivalentes al 0,078125 % del canvas; `alpha_bbox=[0,0,1440,2558]`. 021E no
reexporta, repara ni reabre la aprobación visual. La desviación no bloquea su
uso como referencia documental, pero debe permanecer visible antes de una
integración futura.

## 4. Tabla canónica

| Asset ID | Filename final exacto | Canvas | Formato/alpha | Orientación | z | Orden |
| --- | --- | ---: | --- | --- | ---: | ---: |
| `FINAL-ACCESS-I-001` | `final_access_world1_root_v01.webp` | 1024×1024 | WebP alpha | ambas | 30 | 1 |
| `FINAL-ACCESS-II-001` | `final_access_world2_pulse_v01.webp` | 1024×1024 | WebP alpha | ambas | 30 | 2 |
| `FINAL-ACCESS-III-001` | `final_access_world3_notebook_v01.webp` | 1024×1024 | WebP alpha | ambas | 30 | 3 |
| `FINAL-ACCESS-IV-001` | `final_access_world4_system_v01.webp` | 1024×1024 | WebP alpha | ambas | 30 | 4 |
| `FINAL-ACCESS-V-001` | `final_access_world5_map_v01.webp` | 1024×1024 | WebP alpha | ambas | 30 | 5 |
| `FINAL-PLATE-LABEL-001` | `final_access_label_backplate_v01.png` | 1024×256 | PNG RGBA | ambas | 42 | 6 |

Los IDs, nombres, formatos y canvas coinciden literalmente con el inventario
021B. No se encontraron contradicciones canónicas.

## 5. Framing y 9-slice cerrados

Para los cinco accesos:

- generación 1:1;
- sujeto visible 68–78 % del ancho y del alto;
- 10–16 % de alpha exterior por lado;
- centro óptico dentro del 8 % central;
- crop permitido sólo sobre alpha exterior;
- redimensión proporcional máxima en Photopea: 15 %;
- revisión a 1024, 256, 128 y 88 px;
- target documental: 96–112 px en portrait y 88–104 px en landscape.

Para la placa:

- canvas final 1024×256;
- insets propuestos `top=64, right=112, bottom=64, left=112`;
- zona segura DOM `x=144–880, y=56–200`;
- borde mínimo de 8 px en source;
- esquinas estables y centro horizontal extensible;
- prueba documental con los cinco labels;
- generación en el ratio landscape más ancho realmente soportado, sin inventar
  dimensiones nativas;
- si la herramienta no conserva una placa visual de al menos 3.6:1, producir
  caps y centro coordinados por partes y ensamblarlos determinísticamente; nunca
  estirar.

## 6. Briefs

Los seis documentos contienen las 33 secciones contractuales, prompt positivo y
negativo específicos en inglés, framing, Photopea, exportación, metadata, hard
fails, plantilla de retorno, dependencias y estado.

| Brief | Estado | Gate |
| --- | --- | --- |
| `FINAL-ACCESS-I-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION` | primero; sin acceso previo |
| `FINAL-ACCESS-II-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION` | acceso I producido y revisado |
| `FINAL-ACCESS-III-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION` | acceso II producido y revisado |
| `FINAL-ACCESS-IV-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION` | acceso III producido y revisado |
| `FINAL-ACCESS-V-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION` | acceso IV producido y revisado |
| `FINAL-PLATE-LABEL-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION` | cinco accesos producidos y revisados |

`READY` describe la completitud del brief. No declara que el asset exista,
esté aprobado o pueda saltarse su gate.

## 7. Primer brief listo

El único asset que puede producirse primero es:

```text
FINAL-ACCESS-I-001 — final_access_world1_root_v01.webp
```

Su set exacto reúne la referencia canónica, Environment/foreground portrait y
landscape, overlays de encaje/safe area/escala, contact sheet W1, brote y raíces.
No iniciar `FINAL-ACCESS-II-001` antes de revisión humana del acceso I.

## 8. Reference manifest y H07

El manifest normativo contiene 34 filas:

- 29 fuentes reales;
- 5 overlays 021E;
- 6 Environment aprobados dentro de las 29 fuentes;
- paths, hashes, dimensiones, modo y alpha recalculados;
- consumidor, procedencia, licencia conocida, uso permitido, assets servidos,
  prioridad y prohibición de copia.

Estado de H07:

```text
OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE
```

Los usos se limitan a `IDENTITY_REFERENCE`, `MATERIAL_REFERENCE`,
`COMPOSITION_ALIGNMENT_REFERENCE`, `TECHNICAL_9SLICE_REFERENCE` y
`ART_DIRECTION_ONLY`. Ninguna fila es candidata a reutilización binaria.

Los contact sheets 021B conservan su leyenda histórica anterior a 021C; no se
reescribieron. La aprobación 021C permite usarlos como dirección/referencia, no
como binarios Final.

## 9. Overlays

| Archivo | Dimensión | SHA-256 | Prueba documental |
| --- | ---: | --- | --- |
| `final_021e_access_portrait_alignment_overlay.png` | 1440×2560 | `6EB4D0E81F0B83840D29B470DF805571062197E98070B51EB494719DEBDF0ED8` | 2–1–2, anchors, labels, Lía, título, acciones, créditos y oclusión |
| `final_021e_access_landscape_alignment_overlay.png` | 2560×1440 | `DBBBEA41AB9025F3E815D722B3A73217480626EE37BB38D22C473A5E64849CB5` | arco I–V, extremos protegidos y gate 667×375 |
| `final_021e_access_square_safearea_overlay.png` | 1024×1024 | `A2E4BDCDE32D9D7B3027665B3321ECDE4CDAE1496705D0CD9E89C79A035DB477` | ocupación, alpha, centro, sombra, no texto y preview 88 px |
| `final_021e_access_family_scale_contact_sheet.png` | 2560×1440 | `87008F4D76983B018BD527AA4B9C70864B6A68560B847DDA32E66ECA9072C9A0` | cinco placeholders en portrait/landscape y reducción exacta a 88 px |
| `final_021e_label_9slice_guide.png` | 1536×1024 | `408CD329047AAB4F98F4C9DB1C5B4CDF27F608AC38EC15BC9352B802D7B71DDF` | insets, zona DOM y cinco anchos simulados |

Todos muestran `PREPRODUCTION — NOT RUNTIME`. Portrait y landscape usan como
base documental los Environment y foreground aprobados, sin crear arte Final.

## 10. Paquete externo

Creado fuera del repositorio:

```text
C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021E_ACCESS_REFERENCE_PACK\
C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021E_ACCESS_REFERENCE_PACK.zip
```

Contiene `COMMON`, cinco carpetas de accesos y una carpeta para la placa. Cada
carpeta tiene README y manifest específicos. Resultado:

- 7 carpetas de referencia;
- 34 imágenes de referencia;
- 50 archivos totales;
- manifiestos con copia byte-idéntica verificada;
- 50 entries ZIP verificadas contra la carpeta;
- SHA-256 del ZIP:
  `0B0C47D3A3E6FAA342C38B8DE6EAD93168505BB01BCAC658F3A7CF7272547FAD`;
- SHA-256 del manifest raíz externo:
  `73BC09251E4106D830F5D9CCC3F2350EEDA2F821A166967085D58B3CB5AE12EB`.

El pack es `REFERENCE_ONLY / NOT_RUNTIME` y no se versiona.

## 11. Paquete versionado

Se crearon 16 archivos bajo
`docs/visual/final/021e-access-production-briefs/`:

- seis briefs;
- tres manifests CSV;
- un summary JSON;
- cinco overlays;
- un generador determinista.

Hashes de control:

| Archivo | SHA-256 |
| --- | --- |
| `final_021e_access_family_manifest.csv` | `75E423F374B647A17CBF6CE09C2C81520ED8C21BFBE2310A160D3D6AEBE95E42` |
| `final_021e_access_reference_manifest.csv` | `FE47639B65779079EE6C76B119536BC05937000C80213A6B3B5E5C7707EE7CFC` |
| `final_021e_environment_production_reference_manifest.csv` | `1441B80F66915A34B1458C86846C629BE4CE6B13C015DD609410372B55CF99CF` |
| `final_021e_access_family_summary.json` | `D730CAD84598081FAB1CE44CE135920E45F6D411099F2A915E57135DBCE26838` |
| `generate_final_021e_access_briefs.py` | `7969C53C13D19906DE6FDD0996CE7ABE16CD9996E86D49CD749D8ECA93F37D24` |

El hash del presente documento se calcula después de cerrar su contenido y se
reporta en la salida final.

## 12. Validación

- Baseline: PASS.
- Seis Environment encontrados, sin duplicados ambiguos: PASS.
- Hashes/dimensiones/modo/alpha de Environment: PASS con una desviación E01
  documentada.
- Seis briefs con 33 secciones: PASS.
- IDs, filenames, canvas, formato, alpha y z-order: PASS.
- Prompts, Photopea, hard fails y retorno: PASS.
- Manifest normativo: 34 referencias, cero reutilización binaria.
- Overlays: dimensiones y QA visual PASS.
- Reducción placeholder a 88 px: PASS documental.
- Prueba 9-slice con cinco labels DOM simulados: PASS documental.
- External pack y ZIP: 50/50 hashes PASS.
- Assets Final de accesos/placa producidos: 0.
- Runtime/current-used tocado: 0.

## 13. Siguiente acción controlada

Producir únicamente `FINAL-ACCESS-I-001` siguiendo su brief y el set exacto de
referencias. No iniciar `FINAL-ACCESS-II-001` hasta que el acceso I sea revisado
humanamente. La producción requiere un ticket posterior; 021E no la ejecuta.
