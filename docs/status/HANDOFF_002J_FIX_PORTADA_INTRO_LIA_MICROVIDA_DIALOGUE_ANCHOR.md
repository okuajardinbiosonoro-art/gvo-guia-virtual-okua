# Handoff 002J-FIX - Portada / Intro microvida de Lía y dialogue anchor

Fecha: 2026-05-30

## Estado

`AJUSTE_002J_FIX / LIA_MICROVIDA_REFORZADA / DIALOGO_ANCHOR_REVISADO / NO_CERRADA`

## Rama

`feature/002J-fix-lia-microvida-dialogue-anchor`

## Base usada

- Rama base: `feature/002J-portada-intro-lia-hybrid-rig-facial`
- Commit base: `7473576 feat: add Lia hybrid idle rig facial motion`

## Qué se corrigió

- La microvida de Lía se volvió más perceptible usando el rig en diálogos seguros.
- El panel de diálogo dejó de depender de una línea/flecha/triángulo ordinario.
- El blink ahora respeta la expresión activa de Lía.
- El glow del collar gana presencia sin convertirse en flash.

## Microvida de Lía

Nuevo mapeo:

- `portada_idle`: rig idle con expresión `neutral`.
- Diálogo 1: rig idle con expresión `happy`.
- Diálogos 2-4: rig idle con expresión `attentive`.
- Diálogo 5: pose completa `pointPortal1`.
- `portal_1_ready`: pose completa `pointPortal1`.
- `portal_1_opening_placeholder`: pose completa `activatePortal1`.
- `transition_to_station_1_placeholder`: pose completa `activatePortal1`.

## Blink y expresiones

- `LiaHybridAvatar` conserva `neutral`, `happy` y `attentive`.
- El ojo base visible corresponde a la expresión activa.
- El blink usa capas `blink_25`, `blink_50` y `closed`.
- Después del blink, Lía vuelve a la expresión base activa.
- El ciclo queda en 4.2s para que la microvida sea visible en QA sin ser excesiva.
- Reduced motion desactiva blink automático y deja fija la expresión base.

## Seguridad visual

- No se superponen ojos del rig sobre poses completas.
- El rig se usa como alternativa a las poses completas, no encima de ellas.
- No hay doble ojo.
- No se crean ojos nuevos.
- No se modifican PNG staged.

## Panel de diálogo

- Se elimina el conector lineal externo.
- Se elimina el triángulo/flecha tipo tooltip.
- El panel queda asociado a Lía por:
  - badge `Lía`;
  - ubicación cercana;
  - paleta ámbar/lavanda;
  - acento superior;
  - nodo ámbar-lavanda integrado en la esquina.
- Se conserva la tipografía de lectura.
- Se conserva `Paso X de 5`.
- No aparece `1/5`.

## Capturas QA

Ruta:

`docs/visual/cover-intro/qa/002J-FIX/`

Archivos:

- `cover-intro-002j-fix-01-idle-rig-390x844.png`
- `cover-intro-002j-fix-02-dialogue-happy-390x844.png`
- `cover-intro-002j-fix-03-dialogue-attentive-390x844.png`
- `cover-intro-002j-fix-04-portal-ready-390x844.png`
- `cover-intro-002j-fix-05-opening-activation-390x844.png`

## Validaciones ejecutadas

- `npm run lint`: OK.
- `npm run test`: OK.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK.
- `npm run test:e2e`: OK.

## Qué no se implementó

- No se implementó coreografía física avanzada del Portal I.
- No se implementó transición pixelart final.
- No se implementó Estación I real.
- No se desbloquearon Portales II-V.
- No se agregaron recursos externos.
- No se agregó audio.
- No se agregó video runtime.
- No se tocó `/` ni `/carga`.
- No se modificó la carga inicial V13.

## Próximo ticket recomendado

Si la revisión visual aprueba este fix:

`TICKET_002K_PORTADA_INTRO_COREOGRAFIA_ACTIVACION_PORTAL_I.md`

Si Lía sigue sin sentirse viva:

`TICKET_002J_FIX2_LIA_RIG_VISUAL_REVIEW.md`
