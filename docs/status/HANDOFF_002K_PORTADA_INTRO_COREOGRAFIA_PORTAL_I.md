# Handoff 002K - Portada / Intro coreografía de activación Portal I

Fecha: 2026-05-30

## Estado

`COREOGRAFIA_PORTAL_I_BASE / LIA_MICROVIDA_OK / NO_CERRADA`

## Rama

`feature/002K-portada-intro-coreografia-portal-i`

## Base usada

- Rama base: `feature/002J-fix-lia-microvida-dialogue-anchor`
- Commit base: `9f1dcd7 fix: improve Lia microexpressions and dialogue anchor`

## Qué se implementó

- Coreografía breve de activación del Portal I al presionar `Entrar a Mundo I`.
- Lía conserva `activatePortal1` para opening y transition placeholder.
- La activación queda anclada al contenedor del Portal I mediante `cover-intro__portal-activation-rig`.
- Se mantiene el test id heredado `cover-portal-activation-rig` y se agrega `data-activation-stage="portal-i"`.
- Se agregan test ids estables para QA:
  - `cover-activation-lia`
  - `cover-activation-portal-front`
  - `cover-activation-contact-light`

## Coreografía y capas

La activación usa una composición por capas:

1. Glow de Portal I detrás.
2. Frame back de Portal I.
3. Lía `activatePortal1`.
4. Luz CSS de contacto.
5. Frame front duplicado como rim.

El objetivo es que Lía no parezca un sticker encima del portal, sino una figura que entra en relación con el borde y la profundidad del Portal I.

## Timing

- `portal_1_ready`: Lía sigue en `pointPortal1` y el botón muestra `Entrar a Mundo I`.
- `portal_1_opening_placeholder`: Lía cambia a `activatePortal1`, aparece la coreografía y se muestra `Abriendo Mundo I: Raíz...`.
- El handoff a `transition_to_station_1_placeholder` se retrasa a `920ms` para que la aproximación/contacto se lea antes del overlay.
- `transition_to_station_1_placeholder`: se mantiene el overlay DOM con `Preparando recorrido...` y el enlace explícito `Continuar a Mundo I`.

## Assets usados

- `portal_1_glow_enabled_v1.png`
- `portal_1_frame_enabled_v1.png`
- `lia_pose_activate_portal_1_v1.png`

No se generaron assets nuevos y no se modificaron PNG staged.

## Reduced motion

Reduced motion conserva el flujo y evita approach amplio, pulso continuo y scale perceptible. La coreografía queda como estado casi estático con opacidad simple.

## Capturas QA

Ruta:

`docs/visual/cover-intro/qa/002K/`

Archivos esperados:

- `cover-intro-002k-01-portal-ready-390x844.png`
- `cover-intro-002k-02-activation-opening-390x844.png`
- `cover-intro-002k-03-transition-placeholder-390x844.png`
- `cover-intro-002k-04-reduced-motion-opening-390x844.png`

## Validaciones ejecutadas

- `npm run lint`: OK.
- `npm run test`: OK.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK.
- `npm run test:e2e`: OK.

## Qué no se implementó

- No se implementó Estación I real.
- No se implementó transición pixelart final.
- No se desbloquearon Portales II-V.
- No se agregaron recursos externos.
- No se agregó audio.
- No se agregó video runtime.
- No se modificó la carga inicial V13.
- No se modificaron rutas `/`, `/carga`, `/portada` ni `/estacion/1`.

## Próximo ticket recomendado

`TICKET_002L_PORTADA_INTRO_QA_VISUAL_REAPROBACION.md`

Objetivo: generar QA visual completo de D3 + L2 + P3, confirmar si Portada / Intro alcanza `APROBADA_PARA_AVANZAR` y decidir deuda visual antes de transición real o Mundo I.
