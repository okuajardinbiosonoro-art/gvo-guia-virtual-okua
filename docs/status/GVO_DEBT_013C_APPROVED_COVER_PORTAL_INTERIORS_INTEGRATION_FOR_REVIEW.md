# GVO_DEBT_013C — Integración de interiores aprobados de Portada para revisión

Fecha de ejecución: 2026-08-16  
Estado: `IMPLEMENTATION_COMPLETE_FOR_REVIEW / PENDING_HUMAN_REVIEW`

## Baseline y límites

- Rama: `main`.
- Baseline local y remoto: `458c788843a3eb12beaee844ac407bae166f7c50`.
- Divergencia final `HEAD...origin/main`: `0 / 0`.
- Worktree heredado de `GVO_DEBT_013`, `013A` y `013B`: preservado. Se
  cotejaron 40 archivos heredados fuera del solapamiento intencional de 013C y
  los 40 conservaron su hash de blob inicial.
- Sin commit, push ni Pull Request.
- `CURRENT_STATE.md`, `package.json`, `package-lock.json`, configuración Vite,
  Workbox/PWA, progreso, checkpoints, reset, QR, idiomas, fullscreen, copy,
  identidad de Lía, timings y motion: sin cambios de 013C.

## Paquete aprobado

- Archivo: `C:\Users\JOSE DAVID\Downloads\GVO_COVER_PORTAL_INTERIORS_APPROVED_V01.zip`.
- Tamaño: 23.241.310 bytes.
- SHA-256 verificado:
  `B70B2604DD5E960A0057C10D269F756C18E3CD47411D84348B395E0F119A78CC`.
- Extracción y verificación: fuera del repositorio.
- Resultado contra `MANIFEST.md`: 15/15 binarios, dimensiones, canales,
  tamaños y SHA-256 exactos.
- Transformaciones, reexportaciones u optimizaciones: ninguna.

## Inventario de los 15 binarios aprobados

Las fuentes y masters se conservan en
`docs/assets/cover-intro/production-sources/<portal>/`. Los WebP se copiaron a
`public/assets/runtime/cover-intro/portals/<portal>/interior/` y a su mirror
byte-idéntico bajo
`public/assets/gvo/current-used/cover-intro/portals/<portal>/interior/`.

| Portal | Rol     | Archivo                                                | Formato / dimensiones / canales |     Bytes | SHA-256                                                            |
| ------ | ------- | ------------------------------------------------------ | ------------------------------- | --------: | ------------------------------------------------------------------ |
| I      | Source  | `cover_portal_world1_root_interior_source_v01.png`     | PNG / 927×1697 / RGB            | 2.476.254 | `082E4CDEFF2162434AD2360AF2B0CFA1364B61132897E12A3889CA6716A57699` |
| I      | Master  | `cover_portal_world1_root_interior_master_v01.png`     | PNG / 2048×3744 / RGB           | 2.415.742 | `16D0AE890201666B747AE06D896D72684EBAC49DBD9D5E558944164FFAE61739` |
| I      | Runtime | `cover_portal_world1_root_interior_v01.webp`           | WEBP / 1024×1872 / RGB          |   182.100 | `31A0635850AF15531EE75DC9C2A3E4D1EDFE322FA9D4569D6D94513434255C92` |
| II     | Source  | `cover_portal_world2_pulse_interior_source_v01.png`    | PNG / 927×1697 / RGB            | 2.368.204 | `B50483344074AE11647AA24E2FACE8E37233BCDE81A21A638AAEE7AC35CCB89E` |
| II     | Master  | `cover_portal_world2_pulse_interior_master_v01.png`    | PNG / 2048×3744 / RGB           | 2.437.074 | `82D48D58E17B7552F2CC03B9387AED165C3C676A983CB106D21F9C771CD56421` |
| II     | Runtime | `cover_portal_world2_pulse_interior_v01.webp`          | WEBP / 1024×1872 / RGB          |   160.624 | `50C605CDC891F8B21D9ED792D299A8BE14A28954A78D1BD25C85BB1915F3A941` |
| III    | Source  | `cover_portal_world3_notebook_interior_source_v01.png` | PNG / 941×1672 / RGB            | 2.196.933 | `896485E3BF97C0D6B6E6E6C1A51D81CB47CFC6A7A9B728E49D3CC07AB4F787F1` |
| III    | Master  | `cover_portal_world3_notebook_interior_master_v01.png` | PNG / 2048×3744 / RGB           | 2.234.636 | `7C3D229A5D12C830904AC90E036FB217DBFDE8FB09F6217E6B9E268BC2471998` |
| III    | Runtime | `cover_portal_world3_notebook_interior_v01.webp`       | WEBP / 1024×1872 / RGB          |    97.608 | `D2298B810E358474B75FE3DF60FF92B0ECE15A2B7B06C85BDAF2AAF8CBDD6659` |
| IV     | Source  | `cover_portal_world4_system_interior_source_v01.png`   | PNG / 941×1672 / RGB            | 1.957.941 | `AA7F3CFB83716D1C7958BBD706A31CAC9CE9FF8FBC8F03251341D4DEB7043727` |
| IV     | Master  | `cover_portal_world4_system_interior_master_v01.png`   | PNG / 2048×3744 / RGB           | 1.959.886 | `35A7892BF8584BE96A16994CD76A5C2066A443B11781BC012D9CFEF4B152684D` |
| IV     | Runtime | `cover_portal_world4_system_interior_v01.webp`         | WEBP / 1024×1872 / RGB          |    80.136 | `96A961322FE58371C60B078DF03A11B240F6672929359AFED539BF485E1CE939` |
| V      | Source  | `cover_portal_world5_map_interior_source_v01.png`      | PNG / 928×1695 / RGB            | 2.498.539 | `643A0934F9EFB3FCBF1B1B587AB48652337121989A1E8683104919BC1BC97A20` |
| V      | Master  | `cover_portal_world5_map_interior_master_v01.png`      | PNG / 2048×3744 / RGBA          | 2.540.957 | `CF6DAA1E205B16707CC6C6FEB39BC56576AF3F6B93C7B5C4856D678A462790B5` |
| V      | Runtime | `cover_portal_world5_map_interior_v01.webp`            | WEBP / 1024×1872 / RGBA         |   187.046 | `CC95E888B472D8E14295F8B9623144262F699D7583D5A2B1062085CDD5019563` |

Los cinco WebP runtime suman 707.514 bytes. Sus cinco mirrors coinciden byte a
byte. El verificador además confirmó que ningún source o master está bajo
`public` o `dist`.

## Integración y desacoplamiento

- Registro dedicado nuevo:
  `src/screens/Cover/coverPortalInteriorAssets.ts`.
- `CoverIntroScreen` ya no importa ni consume
  `entryCoverStationAssets`; usa solamente los cinco WebP dedicados de Portada.
- `/inicio` conserva sin cambio su registro
  `src/shared/assets/entryCoverAssets.ts` y sus cinco rutas publicadas de
  `final-root/access`.
- No existen rutas literales de interiores en JSX.
- Cada interior es decorativo (`alt=""`, `aria-hidden="true"`), ignora eventos
  de puntero y queda detrás de frame, número romano y lock.
- CSS: caja recortada al hueco, `object-fit: cover`, centro natural y sin
  distorsión, letterbox o margen interno.
- Frame, glow, locks, números romanos, labels, CTA, Lía, gating, diálogos,
  timings y motion conservan sus capas y comportamiento previo.
- Los portales II–V permanecen bloqueados mediante las capas existentes.
- Portal V conserva exactamente sus 1.024 píxeles transparentes de borde. La
  matriz visual verificó en portrait, landscape y desktop que el frame oculta
  el borde y no aparece seam visible.

## Manifiestos y documentación

- Los manifiestos runtime y `current-used` avanzaron de `v2` a `v3` y son
  textualmente equivalentes.
- Ambos declaran exactamente cinco `portalInteriors`, sus dimensiones, SHA-256
  y la procedencia del ZIP aprobado.
- No queda ninguna ruta `final-root/access` dentro del manifiesto de Portada.
- Se actualizaron `docs/assets/ASSET_INVENTORY.md`, el README raíz de
  `current-used` y el README específico de `cover-intro`.
- No se modificó ningún manifiesto ni asset del Mirador.

## QA visual y estados

Evidencia local ignorada por Git:
`test-results/gvo-debt-013c/visual-matrix/`.

La matriz focal cerró 8/8:

1. `/inicio` ES — 390×844.
2. `/inicio` EN persistido tras reload — 844×390.
3. `/inicio` fallback sin Fullscreen API — 1440×900.
4. Portada idle / Portal I disponible / II–V bloqueados — 390×844.
5. Portada idle — 844×390.
6. Portada idle — 1440×900.
7. Apertura/activación de Portal I — 390×844.
8. Handoff a `/transition/intro-to-station-1` — 390×844.

Comprobaciones: identidades I–V correctas, cero rutas del Mirador en Portada,
imágenes 1024×1872 decodificadas, `object-fit: cover`, jerarquía de capas,
cuatro locks, CTA sin colisión, cero overflow horizontal, cero solicitudes
externas, cero audio/video y cero errores de consola.

La regresión de `/inicio` cubrió ES/EN, persistencia, gesto de fullscreen,
denegación y fallback, CTA, cinco representaciones existentes, portrait,
landscape, desktop y reflow 200 %. Los archivos fuente de
`InitialExperienceScreen` y `entryCoverAssets` conservaron sus hashes heredados.

## PWA y rendimiento

| Métrica                                      | Baseline preintegración |       Build final | Diferencia |
| -------------------------------------------- | ----------------------: | ----------------: | ---------: |
| Archivos en `dist`                           |                     286 |               291 |         +5 |
| Bytes totales en `dist`                      |             120.255.532 |       120.964.855 |   +709.323 |
| WebP dedicados de Portada en `dist`          |                       0 | 5 / 707.514 bytes |   +707.514 |
| Source/master de 013C en `dist`              |                       0 |                 0 |          0 |
| Entradas PWA precache                        |                      49 |                49 |          0 |
| Entradas dedicadas de interiores en precache |                       0 |                 0 |          0 |
| Tamaño precache reportado                    |           14.822,97 KiB |     14.824,74 KiB |  +1,77 KiB |

- Workbox y la configuración VitePWA quedaron intactos, como exige el ticket.
- Los interiores se sirven bajo `/assets/runtime/` y quedan cubiertos por la
  política runtime cache existente cuando se solicitan; no se añadieron al
  precache.
- No se creó un chunk de ruta nuevo. El chunk principal aumentó 869 bytes por
  el registro y preload; los chunks diferidos por mundo permanecen separados.
- El build conserva la advertencia histórica de chunk principal mayor a 500
  kB; no fue introducida por los binarios ni se amplió arquitectura para
  resolverla fuera de alcance.

## Validaciones ejecutadas

| Validación                                                      | Resultado                                                                                                                    |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run audit:assets`                                          | PASS — sin URLs externas, CDN ni audio                                                                                       |
| `npm run lint`                                                  | PASS                                                                                                                         |
| Prueba unitaria focal (4 archivos)                              | PASS — 37/37                                                                                                                 |
| `npm test` inicial                                              | No concluyente: 31 archivos y 236 aserciones PASS, pero 10 workers no arrancaron dentro del timeout; cero fallos de aserción |
| `npm test -- --maxWorkers=1`                                    | PASS — 41 archivos / 505 pruebas                                                                                             |
| `npm run build`                                                 | PASS — 608 módulos, PWA generada                                                                                             |
| `node tools/qa/gvo_debt_013c_verify_cover_portal_interiors.mjs` | PASS — 15 aprobados, 20 copias del repo, 5 pares byte-idénticos                                                              |
| `node tools/qa/gvo_debt_013c_visual_matrix.mjs`                 | PASS — 8/8                                                                                                                   |
| E2E focal `gvo-debt-013-entry-cover-visual-assets.spec.ts`      | PASS — 7/7                                                                                                                   |
| `npm run test:e2e`                                              | PASS — 159/159 en 16,6 min                                                                                                   |

## Archivos de 013C

- 10 fuentes/masters bajo
  `docs/assets/cover-intro/production-sources/portal_1..5/`.
- 5 WebP runtime y 5 mirrors `current-used` bajo los árboles descritos.
- `src/screens/Cover/coverPortalInteriorAssets.ts` y su prueba.
- `CoverIntroScreen.tsx`, CSS y prueba.
- `src/shared/assets/screenAssetBundles.ts` y su prueba.
- Manifiestos runtime/current-used de Portada.
- Inventario y READMEs de política runtime.
- E2E responsive DEBT_013 actualizado.
- Verificador binario y matriz visual focal de 013C.
- Este informe de revisión.

## Estado final

`GVO_DEBT_013C_IMPLEMENTATION_COMPLETE_FOR_REVIEW`

Los cinco interiores aprobados quedaron integrados sin transformación,
separados del Mirador y verificados. La composición permanece
`PENDING_HUMAN_REVIEW`; no se declara aprobación visual humana ni publicación.
