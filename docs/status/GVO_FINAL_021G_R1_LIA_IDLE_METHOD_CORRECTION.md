# GVO_FINAL_021G_R1 — Corrección del método de producción del idle de Lía

## Estado

`GVO_FINAL_021G_R1_LIA_IDLE_METHOD_CORRECTION_COMPLETE`

Corrección documental y herramienta no-runtime completa. 021G permanece
trazable e intacto; R1 sustituye únicamente el método de producción del idle.

## Baseline

- Branch: `main`.
- HEAD previo: `b3ce96a5e523a5bfa4c09fc51a402c9b10b05927`.
- `origin/main` local: `b3ce96a5e523a5bfa4c09fc51a402c9b10b05927`.
- `refs/heads/main` remoto: `b3ce96a5e523a5bfa4c09fc51a402c9b10b05927`.
- Divergencia inicial: `0/0`.
- Worktree inicial: limpio.
- `fetch`: no ejecutado.

## Auditoría I17

- PNG: 509870 bytes — `6636C67A147CCA18F6FCCC44845D7C4ACB290207DA535EFA8B51A9F9B5AD8D07`.
- WebP: 124022 bytes — `92AF06EE8C4F1F43AE7DA10FF8E2615DB1C3A336F7D28096B80655F94C14425F`.
- Ambos: `1536×256`, RGBA; alpha geometry idéntica.
- Las seis celdas tienen altura visible 256 px, tocan top/bottom y fallan safe area de 16 px.
- F1/F2/F6 tocan los cuatro bordes; F3 toca left/top/bottom; F4 top/bottom; F5 top/right/bottom.
- COM horizontal: 79.42, 72.93, 92.64, 131.86, 179.69, 187.25 px; drift incompatible con el límite de 6 px.
- Blink: no existe la secuencia contractual; los seis estados permanecen abiertos.
- F6→F1: incompatible por posición, crop y encuadre.

| Frame | Alpha bbox | Margins L/T/R/B | COM | Baseline | Contacts | Safe16 |
|---|---|---|---|---:|---|---|
| F1 | `[0,0,256,256]` | 0/0/0/0 | (79.42, 131.93) | 255 | `left,top,right,bottom` | `FAIL` |
| F2 | `[0,0,256,256]` | 0/0/0/0 | (72.93, 132.58) | 255 | `left,top,right,bottom` | `FAIL` |
| F3 | `[0,0,241,256]` | 0/0/15/0 | (92.64, 133.45) | 255 | `left,top,bottom` | `FAIL` |
| F4 | `[4,0,253,256]` | 4/0/3/0 | (131.86, 133.22) | 255 | `top,bottom` | `FAIL` |
| F5 | `[4,0,256,256]` | 4/0/0/0 | (179.69, 133.31) | 255 | `top,right,bottom` | `FAIL` |
| F6 | `[0,0,256,256]` | 0/0/0/0 | (187.25, 131.51) | 255 | `left,top,right,bottom` | `FAIL` |

Resultado común: `REJECTED_PRODUCTION_CANDIDATE / NOT_RUNTIME / DO_NOT_REPAIR`.

## Causa raíz y método corregido

La causa es el framing: se pidió un strip extremo 6:1 dentro de un artboard 3:2,
la herramienta ocupó toda la altura y reinterpretó cada figura. Photopea no es
la causa y no debe reparar I17.

`DIRECT_GENERATIVE_6X1_STRIP = DEPRECATED_FOR_LIA`.

Flujo vigente:

```text
FINAL-LIA-MASTER-001 1024×1024 HUMAN-APPROVED
→ FINAL-LIA-IDLE-SHEET-001 3×2
→ deterministic assembler
→ automatic QA
→ human review
```

El filename final, canvas 1536×256, grid 6×1 y celdas 256×256 no cambian.

## Decisión de blink

`OPTION_A_SELECTED_FOR_INITIAL_PRODUCTION`.

Las capas neutral/50 %/closed comparten canvas 941×1672, pero no existe registro
aprobado contra la futura master 1024×1024. Imponer overlay requeriría inventar
una transformación o reconstruir cabeza/ojos. Opción B sólo se reabre si una
master aprobada demuestra un registro común determinista y visualmente limpio.

## Ensamblador

- Path: `tools/asset-production/lia/build_final_lia_idle.py`.
- Input: sheet PNG RGBA 3×2 con celdas cuadradas.
- Outputs: WebP final lossless, preview PNG, preview WebP animado y JSON de métricas.
- Interpolación: `nearest` o `lanczos`; una sola redimensión por celda.
- Gates: safe ≥16 px, center drift ≤6 px, baseline drift ≤4 px, scale delta ≤2 %, bbox 46–54 % W / 58–64 % H.
- Source: SHA-256 antes/después; no se modifica.
- Self-test: fixture geométrica válida PASS; fixture insegura REJECT; output 1536×256 PASS; cuatro outputs PASS; artifacts retenidos NO.

## Briefs y gates

- `FINAL-LIA-MASTER-001_BRIEF.md`: `READY_FOR_HUMAN_ASSET_PRODUCTION / FIRST_AND_ONLY_NEXT_ASSET`.
- `FINAL-LIA-IDLE-SHEET-001_BRIEF.md`: bloqueado por aprobación humana de master.
- `FINAL-LIA-IDLE-001_ASSEMBLY_CONTRACT.md`: ensamblaje posterior a sheet aprobada.
- Greeting y glow permanecen bloqueados.

## Guías visuales

- `final_021g_r1_i17_rejection_contact_sheet.png` — 1800×1250 — `E681D7D67470718DEDA6C2D8B93C4B61254587A0F3AB1C262608F739A05BB38E`
- `final_021g_r1_lia_master_safearea_1024.png` — 1024×1024 — `81273B4C304E73225C2EE1434AD93212F1894DDFE006ECFB58EEFADDCBAC93F5`
- `final_021g_r1_lia_idle_3x2_sheet_guide.png` — 1536×1024 — `6A2F8EBBC7E63BDCEB5F70CC2D333D060FD733E82E4819C63F120BE28F08E871`
- `final_021g_r1_lia_6x1_output_guide.png` — 1536×256 — `07BEFE44BC2BFBA7838CFF82FD8B2DAA458B11B2A7AA8EDFD55D5D966E726899`
- `final_021g_r1_master_to_sheet_to_strip_flow.png` — 1800×900 — `6F43FE2561054B430AD2C14218F3D605AEC66C59DBFE2F29454C3A83B7945155`
- `final_021g_r1_blink_method_decision_sheet.png` — 1800×1000 — `C2C15F2D6F653D94EA9C742CA101C6DD5EC9310FD10EF22A880EAB5165E25A33`

Todas están marcadas `PREPRODUCTION — NOT RUNTIME`. La rejection sheet anota el I17 real sin editarlo
ni crear imágenes de error nuevas.

## Reference pack

- Fuentes únicas: `15`.
- Copias trazadas: `36`.
- Pack 021G copiado en bloque: `NO` (`0/67`).
- Manifest: `C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021G_R1_LIA_IDLE_REFERENCE_PACK\MANIFEST.csv` — `B5C7B4FBCB03EE1D267EE1317A9835CB5F26FCF8357A693635025B003FDB00D4`.
- ZIP: `C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021G_R1_LIA_IDLE_REFERENCE_PACK.zip` — `68F9D13F54B97260BFCBF81D1889AD45C740B34F60C05160484606FBE17A4C56` — 11724965 bytes.
- Clasificación: `REFERENCE_ONLY / NOT_RUNTIME`.

## Estado global

No existe `CURRENT_STATE.md` ni `ROADMAP.md` bajo la convención vigente del
checkout, por lo que R1 no fabrica uno. El idle sigue no aprobado y queda
registrado en este status trazable.

## Límites respetados

- `src/**`, `tests/**`, `public/assets/**`, `current-used`, mundos y transiciones: no modificados.
- I17 y demás assets de Descargas: no modificados.
- Arte final de Lía: no generado.
- Integración/runtime: no ejecutados.
- Build, tests runtime, Playwright y navegador: no ejecutados por contrato.
