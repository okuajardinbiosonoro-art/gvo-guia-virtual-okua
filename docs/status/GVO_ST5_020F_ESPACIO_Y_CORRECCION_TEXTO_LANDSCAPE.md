# GVO ST5-020F — Espacio y corrección de texto landscape

Fecha: 2026-07-30  
Rama de publicación: `main`  
Baseline validada: `4a3c35fdb7aa9a5b09b39ad6c359a566e2329c55`  
Estado humano de entrada: `ST5_020E_HUMAN_APPROVED_WITH_LANDSCAPE_TEXT_DEBT`  
Estado publicado: `ST5_020F_PUBLISHED_PENDING_HUMAN_REVIEW`

## Alcance ejecutado

- Se integró `/estacion/5/espacio` con fondo portrait, fondo landscape y foco
  alfa del recorrido de cuatro tablones aprobados.
- El flujo persistido queda exactamente `Plantas → Sistema → Espacio`, con
  `completedAreas: ['plantas','sistema','espacio']` tras la única acción real de
  Espacio.
- Visitante conserva estado y ruta protegidos; no existe 4/4, cierre de Mundo V
  ni navegación a Final.
- Se corrigió el rail editorial compartido de Plantas, Sistema y Espacio en
  landscape corto. A 667×320 la escena ocupa 378 px, el rail 260 px, no hay
  scroll y el texto permanece a 14 px con Lía visible.
- El overview aprobado, su cavidad, sectores, rótulos y composición no se
  recomponen. Su baseline protegida a 667×320 se conserva y se reporta de forma
  separada; la regresión obligatoria del overview se valida a 667×375 y en el
  resto de la matriz.

## Assets

| ID | Runtime | Espejo `current-used/space` | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| SUB-SPACE-BG-PORTRAIT | `world5_sub_space_environment_portrait_v01.webp` | sí | 109.230 | `2D5CF7921187A67A7AEA092D7DCB84C9B4435620168187DBBB6E928A4D6F48B3` |
| SUB-SPACE-BG-LANDSCAPE | `world5_sub_space_environment_landscape_v01.webp` | sí | 73.372 | `53D57B96D5BC0ED13694361892A11CB8568E7C4DA61D95BEE1A6A44EF0EE7BD8` |
| SUB-SPACE-FOCUS | `world5_sub_space_focus_v01.webp` | sí | 141.948 | `FDD48FBC8E9F439E9D51C21C2BB3CB7406423DDCBB50AA0A3A218EA6DEB71F66` |

Los tres pares runtime/espejo son byte-idénticos. El bundle Espacio pesa
324.550 bytes. No se convirtió, rediseñó ni sintetizó ningún asset.

## Composición y acción de Espacio

- Socket portrait normalizado: `[0.24, 0.43, 0.42, 0.32]`; centro
  `[0.45, 0.59]`.
- Socket landscape normalizado: `[0.14, 0.24, 0.36, 0.58]`; centro
  `[0.32, 0.53]`.
- El mismo raster alfa se proyecta con escala uniforme en ambas orientaciones.
- La bbox alfa medida del foco es `[357,330]..[1212,1099]` sobre 1536×1536 y
  permanece dentro del socket fuente en la matriz.
- El único control de progreso usa el nombre accesible
  `Activar el recorrido de Espacio.` y mide al menos 44×44 px.
- El estado resuelto reutiliza el mismo raster con una variación sutil de
  saturación/luz; no agrega líneas, check, SVG ni visual procedural.

## Copy aplicado

- Tras Sistema: `Plantas y Sistema ya están conectadas.` / `Toca Espacio para continuar.`
- Intro: `OKÚA ocurre en un lugar, no solo en una pantalla o circuito.` /
  `Toca el recorrido de madera.`
- Resuelto: `El espacio convierte el sistema en una experiencia situada.` /
  `Recorrido reconocido.`
- Tras Espacio: `El recorrido ya tiene un lugar.` /
  `Visitante será el siguiente paso.`

## Evidencia técnica

La evidencia reproducible vive en `docs/visual/world5/st5-020f/`:

- 110 capturas: 11 viewports × 10 estados.
- Capturas individuales de intro/resuelto para Plantas, Sistema y Espacio a
  667×320 y 667×375.
- Secuencias dinámicas 667×375 → 667×320 → 667×375 y
  375×667 → 667×375 → 375×667.
- Captura de Espacio con `prefers-reduced-motion: reduce`.
- `metrics.json`, `summary.json`, `dynamic_viewport.json`,
  `browser_matrix.json` y `pwa_precache.json`.

Validaciones ejecutadas:

- `npm run check`: 261/261 tests globales, lint y build en PASS.
- Suite focal: 30/30 tests en PASS.
- Playwright focal: 3/3 E2E en Chromium en PASS.
- Chromium 148: smoke 667×320 en PASS. Firefox y WebKit no están instalados
  en este entorno y se registran como no disponibles, no como validados.
- PWA: 21/21 assets de Estación V y el shell presentes en el precache generado;
  fallback de navegación presente.

La evidencia automatizada es prueba técnica y no equivale a aprobación visual
humana. La PWA instalada y su relanzamiento siguen siendo una comprobación
manual de plataforma.

## Límites preservados

- Sin audio, CDN, fuente remota, API externa ni dependencia nueva.
- Sin cambios de identidad o asset de Lía.
- Sin Visitante, cierre 4/4, Final ni navegación hacia Final.
- Sin declaración de `HUMAN_APPROVED` para el resultado 020F.
