# FABLE5-S5-01 — Changelog

Rama: `feature/fable5-s5-01-station5-present-map` (desde `main` @ 6f1670b).

## Commits

1. `docs(station5): add execution plan for FABLE5-S5-01`
   - `docs/ai/station5/FABLE5_S5_01_EXECUTION_PLAN.md` (nuevo).
2. `feat(station5): add approved copy and replaceable area art slots`
   - `src/screens/World5Root/station5Content.ts` (nuevo): copy aprobado,
     4 áreas, mensajes de Lía, CTA, encabezado, poses.
   - `src/screens/World5Root/station5AreaArt.tsx` (nuevo): visuales
     procedurales SVG por área con slots reemplazables.
3. `feat(station5): build organic present-map diorama with sequential
   guidance and nexus`
   - `src/screens/World5Root/World5RootScreen.tsx` (reescrito): diorama
     2.5D, máquina de estados secuencial, nexo, Lía, CTA, revisita.
   - `src/screens/World5Root/World5RootScreen.css` (reescrito): paleta
     crema/oliva/dorado, bandeja orgánica con borde y labio, estados,
     entrada suave, animación ambiental y reduced motion.
   - `public/assets/gvo/current-used/world-5-root/README.md` (nuevo):
     registro de assets runtime (política POLITICA_ASSETS_UTILIZADOS_RUNTIME).
4. `test(station5): add map interaction coverage`
   - `src/screens/World5Root/World5RootScreen.test.tsx` (reescrito):
     14 pruebas que cubren los 15 puntos del ticket.
5. `feat(station5): add flat accessible touch layer and calibrated guidance`
   - Capa táctil plana `.s5-touch-layer` (fallo de hit-test 3D de Chromium
     en la mitad inferior del plano rotado), separación zona decorativa
     (`Station5AreaZone`) / botón accesible (`Station5Area`).
   - Ajustes: anclas de Lía (no tapar etiquetas), contraste de conexiones,
     entarimado horizontal en Espacio, nexo pleno solo tras Visitante.
   - `tools/debug-station5-click.mjs` (nuevo): sonda de geometría/hit-test.
   - `tools/capture-station5-fable5-s5-01.mjs` (nuevo): capturas Playwright.
6. `docs(station5): add visual captures for FABLE5-S5-01`
   - `docs/visual/world5/fable5-s5-01/*.png` (11 capturas).
7. `docs(station5): add validation report and status documentation`
   - `docs/status/FABLE5_S5_01_STATION5_PRESENT_MAP.md`,
     `docs/ai/station5/FABLE5_S5_01_VALIDATION_REPORT.md`, este changelog.

## Sin cambios

- Router/rutas (`/estacion/5` y transiciones ya existían).
- Estaciones I–IV, transiciones, pantalla final, componentes globales.
- `package.json` (cero dependencias nuevas).
- Los cambios sin commit de World3/World4 presentes en el working tree
  pertenecen a otra sesión y no se tocaron ni se incluyeron en commits.
