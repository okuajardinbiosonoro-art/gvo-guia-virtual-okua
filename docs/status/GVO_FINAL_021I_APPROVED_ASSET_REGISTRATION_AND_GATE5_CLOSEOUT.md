# GVO_FINAL_021I — Registro de assets aprobados y cierre de Gate 5

Fecha: `2026-08-04`

Estado: `GVO_FINAL_021I_APPROVED_ASSET_REGISTRATION_COMPLETE`

## 1. Baseline

- Branch: `main`.
- HEAD previo: `8b8dcbde1352919215a30d32e80ea3e9519eae1e`.
- `origin/main` local y `refs/heads/main` remoto: mismo SHA.
- Divergencia inicial: `0/0`.
- Worktree inicial: limpio.
- No se ejecutó `fetch`.

## 2. Verificación del paquete

- Entrada exclusiva:
  `C:\Users\JOSE DAVID\Downloads\GVO_FINAL_APPROVED_ASSET_PACKAGE.zip`.
- SHA-256:
  `4E2AB2A95437411EC9519AF77D46BCFAD3E44B5B88F2A2B17EDC83402348644F`.
- Tamaño: 6.747.089 bytes.
- Entries documentadas: 26 archivos; 19 runtime, 5 production sources,
  `manifest.json` y `README.md`.
- Path traversal, paths absolutos, separadores inesperados, symlinks y entries
  duplicadas: 0.
- Archivos adicionales no documentados: 0.
- Hashes, bytes, canvas, formato, modo, alpha y `alpha_bbox`: PASS.
- Resultado: `PACKAGE_VERIFIED`.

## 3. Assets runtime canónicos

| Categoría | Archivo | SHA-256 |
| --- | --- | --- |
| environment | `final_environment_portrait_v01.webp` | `1E8B599BE197EE26E346B1B1974CAA571DE42AF4B8587758C801C914C04C1347` |
| environment | `final_environment_landscape_v01.webp` | `EDB75703A398724B9084D800CF21B888D72B6028C4199DC1D7A2C5F5CC0D1D84` |
| environment | `final_valley_depth_portrait_v01.webp` | `F64326254C5215CB44E0F9D93134B425E8806EA41E27556A4BBC40EA36D71E99` |
| environment | `final_valley_depth_landscape_v01.webp` | `FA9999A33EA636F57FA901D8C06B4FF9694A27F66704DAE7968B9E2DC45EC42B` |
| environment | `final_mirador_foreground_portrait_v01.webp` | `19290CF1995A8FAB2B643BEBC88126D3BA6E67A516A43877E1AA79A16E11427D` |
| environment | `final_mirador_foreground_landscape_v01.webp` | `455EDBA68398FBB8BC1A508C42D0EB1BC7D2B6AFC236BF5F8928C2356FD60544` |
| access | `final_access_world1_root_v01.webp` | `F1BE36246795D8A89241AA708D8E8ECE29FA5C98F3F0DCCAF5C2BD5F8F1BF046` |
| access | `final_access_world2_pulse_v01.webp` | `6EE6B093DEE9ABBEA96FDA66C6C80DB3601CDF588A34FD062D0F844466EDD7B6` |
| access | `final_access_world3_notebook_v01.webp` | `2EFAB6C3CA5430D7BA1F0113AA4E19A4B99CE6D4AF5C3212371AC86314039CD3` |
| access | `final_access_world4_system_v01.webp` | `5472BDCA276DBD851D0C3C7C48A96038A5D7544AA13EF4A51BE7BC4DCC2E2B9D` |
| access | `final_access_world5_map_v01.webp` | `A034AA6940E2043870FF3EE0B6C833DF4F3C3F15CFD386C846DB78AA1CBFC07F` |
| access | `final_access_label_backplate_v01.png` | `36257FEC3E1E69D58A9F5E7CA2543F983D309776E45F757D1A81A7CAECFA3698` |
| ui | `final_title_backplate_v01.png` | `898949FFAA35E66507A3AA799BFE32AEC36FA4D3B73B54E58FC1E1A2715C360D` |
| ui | `final_credits_backplate_v01.png` | `45C6FD147A04FF9F8FF5A249EDBC2FCE16EA07FE843A9082B2E011ABC75FFFB1` |
| ui | `final_action_backplate_v01.png` | `C771BA00ACD157962EA1C1BD54FC54758BB6D7306F99C9C0616B5BDCEF211B81` |
| ui | `final_restart_dialog_backplate_v01.png` | `2E81A8CE8C4DFB17E519BC3AE8513367D0C45418A312DC863C9238186FDAB32C` |
| lia | `final_lia_idle_contemplative_6f_v01.webp` | `D3171A70C467EFCDA6D1FBB553FA2BEC5D3CFF0DE1A3B00306F5FF121F18CCDE` |
| lia | `final_lia_greeting_4f_v01.webp` | `80F30DB75C3ABD1A795F8519EF75218B27981DBCE4F1ADAB4DD6941741CD22DD` |
| lia | `final_lia_glow_shadow_v01.png` | `BE1A7499B742B36652F3382B805A012D015C1D06581844C72EA247EC0367E375` |

Conteo: environment 6, access 6, UI 4, Lía 3; total `19/19`.

## 4. Fuentes de producción no-runtime

No existía una convención inequívoca previa para estas fuentes. Se aplicó el
fallback autorizado:
`docs/assets/final-root/production-sources/lia/`.

| Archivo | Bytes | SHA-256 |
| --- | ---: | --- |
| `final_lia_idle_master_v01.png` | 236589 | `9ACB9A44C1E2C0DC32CA5078A9ED826BE5F8648F36C80207B99439D158A56FCF` |
| `final_lia_idle_3x2_sheet_v01.png` | 81383 | `C032E39C0C3BFCBBFE06AD95827637864AF9C3502E4729DA3EB8AD8537F5565A` |
| `final_lia_greeting_2x2_sheet_deterministic_v01.png` | 107432 | `1104EFCD73E16A9806FB919F94EBA730D1B5AE7B42218548D9B74EB7EF48A697` |
| `final_lia_idle_contemplative_6f_metrics.json` | 6552 | `125B8BEFDC2DD4677F37F7AAA538E3CCA80A1E77421C4B88612E24BBA293E3A7` |
| `final_lia_greeting_4f_metrics.json` | 2816 | `09B3A94427B4DF3586F4E924E537E1B980561BDF123235071F77972ADCBF6DAC` |

Clasificación común:
`PRODUCTION_SOURCE / HUMAN_APPROVED / NOT_RUNTIME`. No existen bajo `public`,
`current-used`, `dist`, imports o precache.

## 5. Paths y mirrors

- Runtime: `public/assets/gvo/stations/final-root/`.
- Categorías: `environment/`, `access/`, `ui/`, `lia/`.
- Mirror: `public/assets/gvo/current-used/final-root/` con la misma estructura.
- Pares runtime↔mirror: `19/19` byte-idénticos.
- README de pantalla: `public/assets/gvo/current-used/final-root/README.md`.
- Manifest mirror documental: byte-idéntico al manifest runtime.

## 6. Manifest y registry

El manifest canónico vive en
`public/assets/gvo/stations/final-root/manifest.json`; su mirror está en
`public/assets/gvo/current-used/final-root/manifest.json`. Ambos tienen SHA-256
`B2072DAE3650766EE081713D8FBBC82225E057C1CF2DF99622B9DAFEC7614BD4`.

Cada entrada contiene ID, filename, path, categoría, consumidor, canvas,
formato, modo, alpha, `alpha_bbox`, bytes, SHA-256, aprobación humana, SHA del
paquete, estado runtime, mirror y expectativa de precache.

`src/shared/assets/finalRootAssets.ts` exporta 19 rutas locales readonly
agrupadas en environment/access/ui/lia. No importa React, copy ni
`current-used`; no está consumido por `FinalRootScreen`.

## 7. PWA y precache

- Build/PWA: PASS; 278 entradas totales de precache.
- Assets runtime presentes en `dist`: `19/19`, hashes y bytes verificados.
- Assets runtime precacheados: `19/19`.
- Rutas `current-used` precacheadas: 0.
- Fuentes de producción en `dist`: 0.
- Fuentes de producción precacheadas: 0.
- Assets por encima de 4 MiB: 0.
- URLs/requests externos nuevos: 0.
- Manifest y service worker: válidos.
- Warning conocido: chunk principal mayor de 500 kB. La telemetría de tiempos
  de plugins de Vite permanece sin regresión funcional.

## 8. Exclusiones

No se registraron I17, I19, I20, los primeros intentos rechazados I3/I4,
previews animados, contact sheets temporales, candidatas rechazadas ni WebP no
canónicos derivados de los PNG UI/Lía. Los árboles runtime y mirror sólo
contienen los 19 filenames aprobados, README y manifest donde corresponde.

## 9. Validación

- SHA-256 del ZIP y manifest del paquete: PASS.
- Seguridad y contenido del ZIP: PASS.
- Hashes, bytes, canvas, formato, modo, alpha y `alpha_bbox`: PASS.
- Identidad runtime↔mirror: `19/19 PASS`.
- Fuentes de producción: `5/5 PASS`.
- Prueba focal del registry/assets: `6/6 PASS`.
- `npm run audit:assets`: PASS.
- Suite global: `301/301 PASS` en `26/26` archivos.
- TypeScript: PASS.
- ESLint: PASS.
- Prettier focalizado: PASS.
- Build/PWA y auditoría de precache: PASS.
- Playwright visual del Mirador: no ejecutado por contrato; no existe nueva
  composición.

## 10. Cierre de Gate 5

```text
GATE 5 — ASSETS PRODUCED_AND_APPROVED / COMPLETE
```

El cierre prueba 19 assets runtime canónicos versionados, 19 mirrors
byte-idénticos, cinco fuentes preservadas, hashes/manifests, precache offline,
exclusiones y trazabilidad de aprobación humana.

## 11. Límites runtime

- Consumo de assets desde `FinalRoot`: **NO**.
- Composición estática: **NO**.
- Layout responsive aprobado: **NO**.
- Retorno o reset real: **NO**.
- Interacción o motion nuevos: **NO**.
- Copy modificado: **NO**.
- Gate 6 cerrado: **NO**.

## 12. Gate siguiente

`GVO_FINAL_021J_STATIC_COMPOSITION_PORTRAIT` es el siguiente microfrente. 021I
no lo inicia.
