# FABLE5-S5-01 — Reporte de validación

Fecha: 2026-07-12 · Rama: `feature/fable5-s5-01-station5-present-map`
Entorno: Windows 11, Node 22.14.0, npm (package-lock presente).

## Comandos ejecutados

| Comando | Resultado |
| --- | --- |
| `npm run lint` (eslint .) | ✓ sin errores ni warnings |
| `npm run test` (vitest) | ✓ 18 archivos / 155 pruebas, todas pasan |
| `npx vitest run src/screens/World5Root/...` | ✓ 14/14 |
| `npm run build` (tsc -b && vite build + PWA) | ✓ compila; precache generado |
| `git diff --check` | ✓ sin errores de whitespace (solo avisos CRLF normales del repo en Windows) |
| `node tools/debug-station5-click.mjs` | ✓ botones táctiles alineados con la proyección (±1%) en 360x640 / 390x844 / 430x932 |
| `node tools/capture-station5-fable5-s5-01.mjs` | ✓ recorrido completo real (Chromium móvil) + 11 capturas |

Nota: el warning de Vite sobre chunks >500 kB es preexistente (bundle global
de la app) y no cambia con este ticket.

## Cobertura de los 15 puntos de prueba del ticket

| # | Punto | Prueba |
| --- | --- | --- |
| 1 | Estación V renderiza | "renderiza la maqueta con título, Lía oficial única y mensaje inicial" |
| 2 | Exactamente cuatro áreas | "tiene exactamente cuatro áreas principales en el orden correcto" |
| 3 | Orden Plantas, Sistema, Espacio, Visitante | ídem (asserts de orden DOM y labels) |
| 4 | Plantas inicial disponible | "al inicio solo Plantas está sugerida; el resto queda bloqueado" |
| 5 | No se saltan bloqueadas | "tocar un área futura bloqueada no avanza y Lía responde con calma" |
| 6 | Plantas habilita Sistema | "completar cada área habilita solo la siguiente, en orden secuencial" |
| 7 | Sistema habilita Espacio | ídem |
| 8 | Espacio habilita Visitante | ídem |
| 9 | Visitante activa el nexo | "al completar Visitante el nexo central se ilumina y llega la síntesis" |
| 10 | CTA deshabilitado antes | "la acción final está deshabilitada antes de completar las cuatro áreas" |
| 11 | CTA habilitado después | "la acción final se habilita tras completar y navega a la transición final" |
| 12 | Sin audio | "no usa audio, video, canvas ni iframes" |
| 13 | Revisita libre | "en revisita libre las áreas se reabren en cualquier orden sin perder el nexo" |
| 14 | Reduced motion conserva explicaciones | "con reduced motion la secuencia y las explicaciones se conservan" |
| 15 | Sin cadena de 8 nodos | "no repite la cadena técnica de ocho nodos de Estación IV" |

Prueba adicional: relectura bloqueada durante la primera pasada
("durante la primera pasada un área completada no reabre la explicación").
Ninguna prueba del ticket quedó sin implementar.

## Auditoría offline / silencio

- `grep` sobre `src/screens/World5Root/`: sin `http(s)://`, sin CDN, sin
  `@import`, sin `url()`, sin `<audio>`/`Audio`/oscillator/autoplay → ✓.
- Assets runtime: solo poses PNG locales de Lía ya registradas como
  compartidas; registro en `public/assets/gvo/current-used/world-5-root/`.
- Sin fuentes remotas (serif del sistema Georgia, como Estación IV).
- Sin permisos sensibles: `data-sensitive-permissions="blocked"`,
  `data-qr-camera="blocked"` (patrón de las estaciones previas).

## Rutas verificadas

- `/estacion/5` renderiza la nueva pantalla (misma entrada de router).
- Estación IV → `/transition/world-4-to-world-5` → `/estacion/5` intacto.
- CTA → `/transition/world-5-to-final` → `/final` (transición y pantalla
  final preexistentes, sin cambios).
- `/carga`, `/portada`, `/estacion/1..4` sin cambios (suite completa verde).

## Capturas (docs/visual/world5/fable5-s5-01/)

1. `01_initial_plants_suggested_390x844` — entrada, Plantas sugerida, Lía
   arriba-derecha con ruta punteada, CTA en baja intensidad.
2. `02_plantas_active_390x844` — explicación de Plantas, conexión 1 encendida.
3. `03_sistema_active_390x844` — Plantas completada (✓), Sistema activa.
4. `04_espacio_active_390x844` — Espacio activa, 3 conexiones.
5. `05_visitante_active_three_completed_partial_nexus_390x844` — tres áreas
   completadas, nexo parcial, Visitante activa.
6. `06_map_integrated_390x844` — mapa integrado, nexo pleno.
7. `07_cta_ready_390x844` — síntesis de Lía, CTA oliva activo, Lía al frente.
8. `08_revisit_mode_espacio_390x844` — revisita libre con nexo conservado.
9. `09_initial_360x640` / `09_initial_430x932` — viewports compactos/amplios,
   sin scroll horizontal, mapa central conservado.
10. `10_reduced_motion_initial_390x844` — estado inicial estático.
11. `11_reduced_motion_ready_390x844` — recorrido completo con reduced motion.

## Limitaciones de validación

- No se probó en dispositivo físico iOS/Android (sin acceso desde esta
  sesión); la validación móvil se hizo con emulación Chromium (viewport,
  touch, deviceScaleFactor 2, reducedMotion).
- No se ejecutó `npm run test:e2e` (la suite Playwright existente cubre
  otros flujos); la validación de Estación V en navegador real se hizo con
  `tools/capture-station5-fable5-s5-01.mjs`, que recorre el flujo completo
  con clicks reales.
