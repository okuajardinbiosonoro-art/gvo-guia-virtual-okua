# Handoff 002J - Portada / Intro Lía hybrid rig facial

Fecha: 2026-05-29

## Estado

`LIA_HYBRID_RIG_IDLE_IMPLEMENTADO / DIALOGO_LIA_INTEGRADO / NO_CERRADA`

## Rama

`feature/002J-portada-intro-lia-hybrid-rig-facial`

## Base usada

- Rama base: `feature/002I-fix2-portada-intro-dialogo-lia-portal`
- Commit base: `b8d2ad7 fix: integrate cover intro dialogue with Lia and portal activation`

## Qué se implementó

- Se agrega `LiaHybridAvatar` para separar la representación de Lía en dos modos seguros:
  - `rig-idle`, usado solo en `portada_idle`.
  - `pose`, usado en estados narrativos y de activación.
- El modo `rig-idle` usa capas locales staged del rig idle V1.
- El modo `pose` conserva los PNG completos staged ya aprobados para diálogos y activación.
- El estado idle suma parpadeo controlado y glow sutil del collar.
- Reduced motion deja a Lía visible, pero desactiva parpadeo automático y pulso del collar.

## Cómo funciona `LiaHybridAvatar`

- En `rig-idle`, el componente renderiza un contenedor con `role="img"` y una sola descripción accesible global: `Lía, guía visual de OKÚA`.
- Todas las capas internas del rig usan `aria-hidden="true"` para evitar lecturas duplicadas.
- En `pose`, el componente renderiza una sola imagen completa con `alt="Lía, guía visual de OKÚA"`.
- Los atributos `data-lia-avatar-mode`, `data-lia-expression`, `data-lia-rig-layer` y `data-lia-pose` quedan disponibles para pruebas estables y QA visual.

## Assets usados

Todos los assets vienen de rutas locales staged ya existentes:

- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_body_bulb_segmented_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_left_lower_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_right_lower_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_left_upper_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_right_upper_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_top_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_collar_amber_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_glow_collar_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_head_opal_clean_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_neutral_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_25_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_50_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_closed_v1.png`
- `public/assets/runtime/cover-intro/lia/poses/*.png`

La capa `lia_rig_shadow_soft_v1.png` queda disponible en el componente, pero visualmente desactivada porque en QA se percibía como una sombra flotante debajo de Lía.

## Reglas de seguridad visual

- No se superponen ojos del rig sobre poses completas.
- El parpadeo aplica solo en `rig-idle`.
- Las poses completas se conservan en diálogos, Portal I listo, opening placeholder y transition placeholder.
- No se cambia la identidad de Lía.
- No se modifican PNG staged.

## Estados de uso

- `portada_idle`: `LiaHybridAvatar mode="rig-idle"`.
- `intro_dialogue_started`: pose completa `greeting`.
- `intro_dialogue_active`: poses completas según diálogo activo.
- `portal_1_ready`: pose completa `pointPortal1`.
- `portal_1_opening_placeholder`: pose completa `activatePortal1`.
- `transition_to_station_1_placeholder`: pose completa `activatePortal1`.

## Capturas QA

Ruta:

`docs/visual/cover-intro/qa/002J/`

Archivos:

- `cover-intro-002j-01-idle-rig-390x844.png`
- `cover-intro-002j-02-dialogue-greeting-390x844.png`

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
- No se modificó `/`, `/carga` ni la carga inicial.

## Próximo ticket recomendado

Si la revisión visual aprueba el rig híbrido:

`TICKET_002K_PORTADA_INTRO_COREOGRAFIA_ACTIVACION_PORTAL_I.md`

Si el rig introduce problemas visuales:

`002J-FIX`
