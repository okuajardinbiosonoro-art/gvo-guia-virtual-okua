# Handoff 002C - Portada / Intro asset staging

Fecha: 2026-05-28

## Qué se hizo

Se preparó el staging técnico de assets aprobados para Portada / Intro dentro del repo.

- Se creó `public/assets/runtime/cover-intro/`.
- Se copiaron 27 PNG aprobados desde la carpeta local `portada_intro_v1/02_aprobadas`.
- Se creó `public/assets/runtime/cover-intro/manifest.json`.
- Se creó `tools/validate_cover_intro_assets.mjs`.
- Se agregó el script npm `validate:cover-intro-assets`.
- Se documentó el paquete en `docs/visual/cover-intro/ASSET_PACKAGE_PORTADA_INTRO_V1.md`.
- Se actualizó el estado de Portada / Intro a `ASSETS_STAGED / NO_IMPLEMENTADA`.

## Qué no se hizo

- No se implementó Portada / Intro en React.
- No se creó ruta funcional de portada.
- No se modificó `/` ni `/carga`.
- No se crearon diálogos de Lía.
- No se creó gating de Portal I.
- No se creó transición a Mundo I.
- No se modificaron visualmente los PNG.
- No se recortó, reencuadró, escaló ni recomprimió ningún asset.
- No se agregaron recursos externos.
- No se agregó audio.
- No se agregó video runtime.

## Assets seleccionados

- Fondo base del Archivo Vivo.
- Cinco poses completas de Lía.
- Referencia maestra de Lía.
- Rig idle V1 de Lía.
- Frame y glow de Portal I.
- Frame locked compartido para Portales II-V.
- Candado soft gold.

## Decisiones importantes

- Portales II-V usarán `portal_locked_frame_base_v1.png` en la primera implementación.
- Los frames locked específicos de portales no fueron copiados como runtime principal.
- Interiores de portales quedan diferidos.
- Textos, números, botón y diálogos se mantienen como HTML/CSS.
- `lia_rig_shadow_soft_v1.png` queda disponible pero opcional.

## Validaciones ejecutadas

- `npm run lint`: OK.
- `npm run test`: OK, 3 archivos y 16 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK, 27 rutas PNG validadas desde manifest.

## Estado para 002D

La futura implementación base de Portada / Intro puede leer assets desde:

`/assets/runtime/cover-intro/manifest.json`

El siguiente ticket recomendado es:

`TICKET_002D_PORTADA_INTRO_IMPLEMENTACION_BASE.md`

002D puede montar componente, layout mobile-first, Lía, Portal I disponible, Portales II-V bloqueados y estados visuales base. No debe reabrir la selección de assets salvo bloqueo documentado.
