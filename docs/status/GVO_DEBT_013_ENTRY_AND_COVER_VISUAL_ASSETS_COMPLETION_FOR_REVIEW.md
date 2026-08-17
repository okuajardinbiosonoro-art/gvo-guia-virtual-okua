# GVO_DEBT_013 — Entry and Cover Visual Assets Completion

Estado: `PENDING_HUMAN_REVIEW`

Fecha técnica: 2026-08-15

## Resultado

`GVO_DEBT_013_IMPLEMENTATION_COMPLETE_FOR_REVIEW`

Se completó la capa visual de `/inicio` y la representación diferenciada de
las Estaciones I–V en Portada. La implementación reutiliza exclusivamente seis
assets locales ya aprobados y publicados: el fondo de identidad de Portada y
los cinco accesos visuales del Mirador.

No se generó arte nuevo, no se alteraron binarios y la aprobación previa de las
fuentes no se traslada automáticamente a estas composiciones. `/inicio` y
Portada quedan pendientes de revisión humana.

## Baseline y worktree

- Baseline indicado por el ticket: `eb4761e22e2d85634e4aef75bb13a8862610fc69`.
- Baseline canónico encontrado al iniciar: `458c788843a3eb12beaee844ac407bae166f7c50`.
- El SHA indicado por el ticket precede a la publicación de DEBT_012 y no
  contiene `/inicio`; el alcance visual solicitado depende explícitamente de
  esa pantalla y de la continuidad ya publicada de DEBT_011/DEBT_012.
- Se aplicó DEBT_013 sobre el `main` canónico actual sin revertir publicaciones
  aprobadas ni reescribir historia.
- HEAD final: `458c788843a3eb12beaee844ac407bae166f7c50`.
- `origin/main`: `458c788843a3eb12beaee844ac407bae166f7c50`.
- Rama: `main`; divergencia `0 ahead / 0 behind`.
- Sin stage, commit, push ni PR.

## Auditoría inicial

### `/inicio`

- Conservaba correctamente selección `es/en`, persistencia, fullscreen por
  gesto y CTA, pero la presentación era un panel funcional sobre un fondo
  plano.
- No consumía assets visuales de identidad ni representaciones de estaciones.
- Los controles operativos ya medían `48 px` y la semántica accesible estaba
  presente.

### Portada

- Fondo, Lía, marcos, locks, números romanos, labels y coreografía histórica
  estaban integrados.
- Los cinco interiores seguían explícitamente diferidos en manifest mediante
  `portalInteriorsDeferred: true`.
- No existía una representación visual propia de Mundo I–V dentro de los
  portales.
- El CTA medía menos de `44 px` en la matriz inicial y las acciones de diálogo
  también heredaban alturas inferiores al target mínimo.

## Decisión de assets

Se revisaron la política de assets runtime, el índice `current-used` y el
inventario antes de integrar. Existían fuentes aprobadas suficientes, por lo
que no se invocó generación de imagen ni se inventó arte adicional.

| Uso | Ruta runtime | Formato / dimensiones | SHA-256 |
| --- | ------------ | --------------------- | ------- |
| Fondo `/inicio` | `public/assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png` | PNG RGBA / 941×1672 | `D1AB1AD83C48883CF725E6FCB9AA34778AF8660CE15277B6A58F3231098E13C8` |
| Estación I | `public/assets/gvo/stations/final-root/access/final_access_world1_root_v01.webp` | WEBP RGBA / 1024×1024 | `F1BE36246795D8A89241AA708D8E8ECE29FA5C98F3F0DCCAF5C2BD5F8F1BF046` |
| Estación II | `public/assets/gvo/stations/final-root/access/final_access_world2_pulse_v01.webp` | WEBP RGBA / 1024×1024 | `6EE6B093DEE9ABBEA96FDA66C6C80DB3601CDF588A34FD062D0F844466EDD7B6` |
| Estación III | `public/assets/gvo/stations/final-root/access/final_access_world3_notebook_v01.webp` | WEBP RGBA / 1024×1024 | `2EFAB6C3CA5430D7BA1F0113AA4E19A4B99CE6D4AF5C3212371AC86314039CD3` |
| Estación IV | `public/assets/gvo/stations/final-root/access/final_access_world4_system_v01.webp` | WEBP RGBA / 1024×1024 | `5472BDCA276DBD851D0C3C7C48A96038A5D7544AA13EF4A51BE7BC4DCC2E2B9D` |
| Estación V | `public/assets/gvo/stations/final-root/access/final_access_world5_map_v01.webp` | WEBP RGBA / 1024×1024 | `A034AA6940E2043870FF3EE0B6C833DF4F3C3F15CFD386C846DB78AA1CBFC07F` |

Los mirrors canónicos ya existentes permanecen byte-idénticos en
`public/assets/gvo/current-used/cover-intro/background/` y
`public/assets/gvo/current-used/final-root/access/`. Cada consumidor quedó
registrado por pantalla mediante README equivalente, sin duplicar binarios.

## Implementación

### `/inicio`

- Fondo aprobado de identidad OKÚA como capa decorativa local.
- Cinco representaciones de estaciones como constelación visual del recorrido.
- Composición responsive específica para portrait, landscape y desktop.
- En portrait, las cinco estaciones forman una banda compacta sobre el panel.
- En landscape y desktop, los emblemas ocupan una zona independiente del panel
  operativo; el reflow vertical permanece disponible cuando la altura es baja.
- Todos los textos, idiomas, estados, avisos y controles siguen en DOM/CSS.
- Assets decorativos con `alt=""` y `aria-hidden`, sin duplicar la semántica del
  recorrido.
- Sin nuevas animaciones, timers, audio, video ni recursos externos.

### Portada

- Cada Portal I–V incorpora una representación local distinta de su mundo.
- Portal I conserva su jerarquía disponible; Portales II–V mantienen bloqueo,
  opacidad, locks, labels y contratos de interacción existentes.
- Lía, CTA, diálogos, gating, timings y motion permanecen funcionalmente
  intactos.
- CTA y acciones de diálogo se normalizaron a un mínimo CSS de `44 px`, sin
  cambiar handlers ni secuencias.
- Manifest runtime y mirror `current-used` avanzan juntos a `v2`, declaran
  `portalInteriorsDeferred: false` y registran las cinco rutas reutilizadas.

### Registro compartido

- `src/shared/assets/entryCoverAssets.ts` centraliza el fondo y la relación
  tipada entre Mundo I–V, Portal I–V y sus rutas runtime.
- `docs/assets/ASSET_INVENTORY.md` registra origen, consumidores y estado.
- `public/assets/gvo/current-used/initial-experience/README.md` registra los
  seis usos de `/inicio`.
- `public/assets/gvo/current-used/cover-intro/README.md` registra los cinco
  interiores de Portada.
- El Atlas visual no se usó como origen runtime.

## QA visual y accesibilidad

Matriz final estricta: `5/5 PASS`.

| Escenario | Resultado |
| --------- | --------- |
| `/inicio` portrait `390×844` | PASS |
| `/inicio` landscape `844×390` | PASS |
| `/inicio` desktop `1440×900` | PASS |
| Portada portrait `390×844` | PASS |
| Portada desktop `1440×900` | PASS |

Evidencia local ignorada por Git:
`test-results/gvo-debt-013/final/`. Incluye cinco PNG y `matrix.json`.

La matriz confirma:

- cinco representaciones distintas, locales, decodificadas y con ancho natural
  `1024 px` en cada pantalla;
- cero requests externos, errores de consola, elementos `audio` o `video`;
- cero overflow horizontal;
- controles operativos de `/inicio` de `48 px` y CTA de Portada de `44 px`;
- panel, idioma, fullscreen, CTA, portales y Lía visibles en sus escenarios;
- navegación vertical controlada en landscape bajo, sin recorte horizontal.

El E2E dedicado añade selección de idioma, visibilidad del CTA y fullscreen,
contención de cada representación dentro de su portal, ausencia de solape del
CTA, diálogo vigente y reflow de `/inicio` con texto al `200 %`.

## Pruebas

- `node tools/qa/gvo_debt_013_verify_assets.mjs`: PASS; `6/6` pares verificados,
  hashes esperados y manifests `v2` equivalentes.
- `node tools/qa/gvo_debt_013_visual_matrix.mjs` en modo estricto: PASS; `5/5`.
- `npm run audit:assets`: PASS.
- `npm run lint`: PASS.
- Pruebas focales Vitest: PASS; `3` archivos y `34/34` tests.
- `npm test`: PASS final; `40` archivos y `503/503` tests.
- `npm run build`: PASS; `607` módulos transformados, PWA `49` entradas y
  `14.822,97 KiB` de precache.
- E2E dedicado DEBT_013: PASS final; `6/6`.
- `npm run test:e2e`: PASS final; `158/158` en `16,7 min`.

Incidencias de runner documentadas:

- La primera corrida global Vitest obtuvo `502/503` por timeout de `10 s` en un
  test histórico no modificado de `World3Root`. El caso aislado pasó y la
  repetición global limpia terminó `503/503`; no se cambió Mundo III.
- La primera corrida E2E dedicada obtuvo `4/6`: una espera fría de imágenes
  necesitó más margen y una comparación por bounding box incluía transparencia
  del canvas de Lía. Se corrigió sólo el arnés para esperar decodificación y
  medir geometría visible/operativa; el resultado dedicado fue `6/6` y el
  global `158/158`.
- La primera regeneración final de la matriz agotó `30 s` mientras arrancaba el
  servidor local. Con el endpoint caliente, la misma matriz estricta terminó
  `5/5`.

El build conserva el warning informativo ya conocido para un chunk inicial
superior a `500 kB`; no se cambiaron chunking ni configuración PWA.

## Archivos creados por DEBT_013

- `docs/status/GVO_DEBT_013_ENTRY_AND_COVER_VISUAL_ASSETS_COMPLETION_FOR_REVIEW.md`
- `public/assets/gvo/current-used/cover-intro/README.md`
- `public/assets/gvo/current-used/initial-experience/README.md`
- `src/shared/assets/entryCoverAssets.ts`
- `src/shared/assets/entryCoverAssets.test.ts`
- `tests/e2e/gvo-debt-013-entry-cover-visual-assets.spec.ts`
- `tools/qa/gvo_debt_013_verify_assets.mjs`
- `tools/qa/gvo_debt_013_visual_matrix.mjs`

## Archivos modificados por DEBT_013

- `docs/assets/ASSET_INVENTORY.md`
- `public/assets/gvo/current-used/README.md`
- `public/assets/gvo/current-used/cover-intro/manifest.json`
- `public/assets/runtime/cover-intro/manifest.json`
- `src/screens/Cover/CoverIntroScreen.css`
- `src/screens/Cover/CoverIntroScreen.test.tsx`
- `src/screens/Cover/CoverIntroScreen.tsx`
- `src/screens/InitialExperience/InitialExperienceScreen.css`
- `src/screens/InitialExperience/InitialExperienceScreen.test.tsx`
- `src/screens/InitialExperience/InitialExperienceScreen.tsx`

## Fuera de alcance confirmado

Sin cambios en progreso, checkpoints, reset, QR, PWA, route chunking,
dependencias, lockfile, arquitectura de rutas, timings, motion de Lía, Mirador
o comportamientos funcionales. No se modificó ningún archivo binario.
`docs/status/CURRENT_STATE.md` permanece intacto hasta aprobación humana.

## Estado final

`PENDING_HUMAN_REVIEW`

Sin commit. Sin push. Sin PR.
