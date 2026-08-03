# GVO_FINAL_021F — Briefs de producción de placas UI y decisión de diálogo

- Fecha: 2026-08-03
- Pantalla: Final — Mirador (`/final`)
- Clasificación: `PREPRODUCTION / DOCUMENTATION / NOT_RUNTIME`
- Estado: `GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS_COMPLETE`

## 1. Baseline

| Campo | Valor verificado antes de escribir |
| --- | --- |
| Rama | `main` |
| HEAD | `ec2be8b954a983832bc4d9de8557159814d6f010` |
| `origin/main` local | `ec2be8b954a983832bc4d9de8557159814d6f010` |
| `refs/heads/main` remoto | `ec2be8b954a983832bc4d9de8557159814d6f010` |
| Divergencia | `0/0` |
| Worktree | limpio |

No se ejecutó `fetch`.

## 2. Autoridad y límites

Se revisaron 021C, 021B, su inventario maestro, 021E, la política de assets runtime, `current-used/README.md`, el inventario general y el consumidor actual sólo en lectura. Este ticket no genera arte ni integra assets.

- `src/**`, `tests/**`, `public/assets/**`, `current-used`, slots editoriales y manifests runtime: **sin cambios**.
- Binarios de producción en Descargas: **auditados, no editados**.
- Build, tests runtime, Playwright, navegador y web: **no ejecutados por prohibición del ticket**.
- Overlays/guías: documentos técnicos planos, no arte final.

## 3. Auditoría de las 12 referencias de producción

Cada filename canónico tuvo una sola coincidencia fuera de packs generados. Clasificación común: `APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME`.

| Ref | Filename | Carpeta | Bytes | Canvas / formato / modo / alpha | SHA-256 | Estado |
| --- | --- | --- | ---: | --- | --- | --- |
| `PR01` | `final_environment_portrait_v01.webp` | `I1` | 157294 | 1440×2560 / WEBP / RGBA / yes | `1E8B599BE197EE26E346B1B1974CAA571DE42AF4B8587758C801C914C04C1347` | `PASS_WITH_DOCUMENTED_ALPHA_DEVIATION` |
| `PR02` | `final_environment_landscape_v01.webp` | `I2` | 212234 | 2560×1440 / WEBP / RGB / no | `EDB75703A398724B9084D800CF21B888D72B6028C4199DC1D7A2C5F5CC0D1D84` | `PASS` |
| `PR03` | `final_valley_depth_portrait_v01.webp` | `I3` | 108270 | 1440×2560 / WEBP / RGBA / yes | `F64326254C5215CB44E0F9D93134B425E8806EA41E27556A4BBC40EA36D71E99` | `PASS` |
| `PR04` | `final_valley_depth_landscape_v01.webp` | `I4` | 107632 | 2560×1440 / WEBP / RGBA / yes | `FA9999A33EA636F57FA901D8C06B4FF9694A27F66704DAE7968B9E2DC45EC42B` | `PASS` |
| `PR05` | `final_mirador_foreground_portrait_v01.webp` | `I5` | 124114 | 1440×1280 / WEBP / RGBA / yes | `19290CF1995A8FAB2B643BEBC88126D3BA6E67A516A43877E1AA79A16E11427D` | `PASS` |
| `PR06` | `final_mirador_foreground_landscape_v01.webp` | `I6` | 168898 | 2560×900 / WEBP / RGBA / yes | `455EDBA68398FBB8BC1A508C42D0EB1BC7D2B6AFC236BF5F8928C2356FD60544` | `PASS` |
| `PR07` | `final_access_world1_root_v01.webp` | `I7` | 375436 | 1024×1024 / WEBP / RGBA / yes | `F1BE36246795D8A89241AA708D8E8ECE29FA5C98F3F0DCCAF5C2BD5F8F1BF046` | `PASS` |
| `PR08` | `final_access_world2_pulse_v01.webp` | `I8` | 297082 | 1024×1024 / WEBP / RGBA / yes | `6EE6B093DEE9ABBEA96FDA66C6C80DB3601CDF588A34FD062D0F844466EDD7B6` | `PASS` |
| `PR09` | `final_access_world3_notebook_v01.webp` | `I9` | 238198 | 1024×1024 / WEBP / RGBA / yes | `2EFAB6C3CA5430D7BA1F0113AA4E19A4B99CE6D4AF5C3212371AC86314039CD3` | `PASS` |
| `PR10` | `final_access_world4_system_v01.webp` | `I10` | 254472 | 1024×1024 / WEBP / RGBA / yes | `5472BDCA276DBD851D0C3C7C48A96038A5D7544AA13EF4A51BE7BC4DCC2E2B9D` | `PASS` |
| `PR11` | `final_access_world5_map_v01.webp` | `I11` | 354658 | 1024×1024 / WEBP / RGBA / yes | `A034AA6940E2043870FF3EE0B6C833DF4F3C3F15CFD386C846DB78AA1CBFC07F` | `PASS` |
| `PR12` | `final_access_label_backplate_v01.png` | `I12` | 314629 | 1024×256 / PNG / RGBA / yes | `36257FEC3E1E69D58A9F5E7CA2543F983D309776E45F757D1A81A7CAECFA3698` | `PASS` |

`PR01` conserva la desviación conocida: 2880 píxeles transparentes, exactamente dos filas; no fue reparado. El PNG `PR12` es la autoridad canónica. Existe `final_access_label_backplate_v01.webp` en `I12`, SHA-256 `AF248DF788A8C39528A71B3872EA0F74456406C16BD117CE5F91CC40A4E06557`, 1024×256 RGBA; queda como `NOT_ALLOWED / DERIVED_NONCANONICAL`, no como ambigüedad de filename exacto.

## 4. Tabla canónica y secuencia

| Asset | Filename | Canvas | Alpha | z | Estado |
| --- | --- | ---: | --- | ---: | --- |
| `FINAL-PLATE-TITLE-001` | `final_title_backplate_v01.png` | 1536×512 | sí | 80 | `READY / FIRST_ONLY` |
| `FINAL-PLATE-CREDITS-001` | `final_credits_backplate_v01.png` | 1536×384 | sí | 82 | bloqueado hasta revisar TITLE |
| `FINAL-PLATE-ACTION-001` | `final_action_backplate_v01.png` | 1024×256 | sí | 82 | bloqueado por revisiones previas |
| `FINAL-PLATE-DIALOG-001` | `final_restart_dialog_backplate_v01.png` | 1536×1024 | sí | 110 | decisión A; bloqueado por revisiones previas |

La única producción siguiente habilitada es TITLE. No iniciar créditos, acciones ni diálogo hasta revisar la placa anterior correspondiente.

## 5. Decisión explícita del diálogo

Se eligió `A — NUEVO BACKPLATE 9-SLICE`. TITLE/CREDITS no tienen altura para el contrato modal; los binarios W2/W4 están bloqueados por H07 y acoplan semánticas ajenas; CSS/DOM solo conserva legibilidad pero pierde la materialidad pictórica aprobada. El nuevo PNG aporta únicamente materialidad. Scrim, foco, layout, busy, error, retry y copy pertenecen a DOM/CSS.

Contrato cerrado: `final_restart_dialog_backplate_v01.png`, 1536×1024 PNG RGBA, z110, insets T160/R192/B160/L192.

## 6. Briefs y manifests

- Cuatro documentos incluyen las 33 secciones contractuales.
- TITLE es el único `FIRST_ONLY`.
- El manifest de familia contiene 4 filas.
- El manifest de producción contiene 12 filas auditadas.
- El manifest de referencias contiene 32 filas: 31 adjuntables y 1 derivado `NOT_ALLOWED`.
- H07 permanece `OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE`.

## 7. Guías y fit

Se generaron siete PNG documentales, todos rotulados `PREPRODUCTION — NOT RUNTIME`:

1. guía 9-slice TITLE;
2. guía 9-slice CREDITS;
3. guía 9-slice ACTION;
4. decisión/layout DIALOG;
5. fit portrait 375×667 y 390×844;
6. fit landscape/tablet 667×375, 844×390, 1024×768 y 1365×768;
7. contact sheet de copy DOM exacto y mínimos.

`667×375` se trata como gate independiente y pasa documentalmente sin scroll interno. La fuente visualizada es Segoe UI local como sustituta documental; no se hornea texto en assets finales.

## 8. Reference pack externo

- Ruta: `C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021F_UI_BACKPLATE_REFERENCE_PACK`
- ZIP: `C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021F_UI_BACKPLATE_REFERENCE_PACK.zip`
- Carpetas: TITLE, CREDITS, ACTION, DIALOG y COMMON.
- Copias de imagen: 89.
- Archivos totales: 101.
- Entries ZIP: 101.
- SHA-256 manifest raíz: `17D2EDF08AF87C60BE81487A8CB7DFE65A03CA5E9EA66DBA32770DD70426D5AF`.
- SHA-256 ZIP: `EC9FCFD2861E648B6B0CFA46C7E2EDC1B598AE79E5BF37248A9F3B48A55CD557`.
- Copias verificadas byte a byte; no incluye todo `current-used`.

## 9. Salidas

- `docs/status/GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS.md`
- `docs/visual/final/021f-ui-backplate-production-briefs/` (16 archivos, incluido generador)
- `C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021F_UI_BACKPLATE_REFERENCE_PACK`
- `C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021F_UI_BACKPLATE_REFERENCE_PACK.zip`

## 10. Validación documental

- Baseline exacto: PASS.
- 12/12 referencias y una coincidencia exacta por filename: PASS.
- Hash, canvas, formato, modo, alpha y bytes: PASS; PR01 conserva desviación documentada.
- PNG canónico vs WebP derivado: PASS.
- Cuatro briefs × 33 secciones: PASS.
- Decisión A/B/C explícita y brief resultante: PASS.
- Siete guías/overlays con dimensiones y sello: PASS.
- Seis viewports, incluido 667×375 independiente: PASS.
- Copy DOM y tamaños mínimos: PASS documental.
- Runtime/current-used/arte final: 0 cambios / 0 producidos.

## 11. Estado

```text
GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS_COMPLETE
```

El primer y único asset posterior habilitado es `FINAL-PLATE-TITLE-001`. Credits, Action y Dialog no deben iniciarse antes de su secuencia de revisión humana.
