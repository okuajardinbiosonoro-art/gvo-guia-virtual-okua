# Handoff 002H - Portada / Intro QA visual

Fecha: 2026-05-29

## Estado

`QA_VISUAL_GENERADO / PENDIENTE_APROBACION_USUARIO / NO_CERRADA`

## Rama

`feature/002H-portada-intro-qa-visual`

## Base usada

- Rama base: `feature/002G-portada-intro-transition-handoff`
- Commit base: `e6143b1 feat: add cover intro transition placeholder`

## Commit

Commit final del ticket: registrado en el HEAD de `feature/002H-portada-intro-qa-visual`.

## Qué se hizo

- Se creó un spec Playwright estable para QA visual de `/portada`.
- Se generaron ocho capturas documentales 390x844.
- Se validaron estados principales de Portada / Intro:
  - idle;
  - primer diálogo;
  - diálogo de aclaración;
  - Portal I listo;
  - opening placeholder;
  - transition placeholder;
  - feedback de portal bloqueado;
  - reduced motion con diálogo activo.
- Se documentó la matriz de evaluación visual.
- Se dejó la decisión visual en manos del usuario Ing. José David.

## Capturas generadas

Ruta:

`docs/visual/cover-intro/qa/002H/`

Archivos:

- `cover-intro-qa-01-idle-390x844.png`
- `cover-intro-qa-02-dialogue-01-390x844.png`
- `cover-intro-qa-03-dialogue-clarification-390x844.png`
- `cover-intro-qa-04-portal-1-ready-390x844.png`
- `cover-intro-qa-05-opening-placeholder-390x844.png`
- `cover-intro-qa-06-transition-placeholder-390x844.png`
- `cover-intro-qa-07-blocked-portal-feedback-390x844.png`
- `cover-intro-qa-08-reduced-motion-dialogue-390x844.png`

## Estado técnico

- `/portada` conserva diálogos y gating.
- `transition_to_station_1_placeholder` conserva el handoff DOM hacia Mundo I.
- `/estacion/1` sigue siendo ruta placeholder existente.
- No hay navegación automática a Estación I.
- Portales II-V siguen bloqueados.

## Estado visual

La evidencia está generada para revisión del usuario.

Decisión visual pendiente:

- `APROBADA_PARA_AVANZAR`, o
- `AJUSTE_VISUAL_REQUERIDO`.

## Validaciones ejecutadas

- `npm run test:e2e -- tests/e2e/cover-intro-qa.spec.ts`: OK, 3 tests y capturas generadas.
- `npm run lint`: OK.
- `npm run test`: OK, 4 archivos y 31 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK, 27 rutas PNG validadas.
- `npm run test:e2e`: OK, 16 tests.

## Qué no se tocó

- No se implementó Estación I real.
- No se implementó transición pixelart final.
- No se modificaron PNG staged.
- No se agregaron assets nuevos salvo capturas QA documentales.
- No se agregaron recursos externos.
- No se agregó audio.
- No se agregó video runtime.
- No se tocó `/` ni `/carga`.
- No se modificó carga inicial V13.

## Próximo paso

El usuario debe revisar las capturas y decidir:

- aprobar Portada / Intro para avanzar;
- pedir microticket de ajustes visuales;
- reservar cierre final para una etapa posterior.
