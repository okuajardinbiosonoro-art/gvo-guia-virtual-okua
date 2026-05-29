# Handoff 002D - Portada / Intro base visual

Fecha: 2026-05-29

## Qué se implementó

Se implementó la primera base visual funcional de:

`PORTADA / INTRO - EL ARCHIVO VIVO DE OKÚA`

Ruta activa:

`/portada`

La pantalla usa assets staged de `public/assets/runtime/cover-intro/` y mantiene textos, números romanos, botón y estructura interactiva como DOM/CSS.

## Assets usados

- Fondo: `cover_bg_archivo_vivo_base_v1.png`
- Lía principal: `lia_pose_idle_v1.png`
- Portal I: `portal_1_frame_enabled_v1.png`
- Glow de Portal I: `portal_1_glow_enabled_v1.png`
- Portales II-V: `portal_locked_frame_base_v1.png`
- Candados: `lock_soft_gold_v1.png`

Las rutas están centralizadas en:

`src/screens/Cover/coverIntroAssets.ts`

## Contenido controlado

Los textos están centralizados en:

`src/screens/Cover/coverIntroContent.ts`

Textos DOM visibles:

- `OKÚA`
- `GUÍA VISUAL`
- `EL ARCHIVO VIVO DE OKÚA`
- `Comenzar recorrido`
- `I`
- `II`
- `III`
- `IV`
- `V`

## Comportamiento implementado

- Portal I queda visualmente disponible.
- Portales II-V quedan visualmente bloqueados.
- Portales bloqueados exponen estado accesible.
- El botón principal existe como DOM/CSS.
- Portal I y botón tienen placeholder interno para 002E.
- Se agregó reduced motion básico para cortar animaciones amplias.

## Qué no se implementó

- No se implementó secuencia completa de diálogos de Lía.
- No se implementó gating narrativo final.
- No se implementó transición pixelart a Mundo I.
- No se desbloquearon portales II-V.
- No se crearon interiores de portales.
- No se modificaron assets staged.
- No se modificó la carga inicial.
- No se cambió comportamiento de `/` ni `/carga`.
- No se agregó audio.
- No se agregó video runtime.
- No se usaron recursos externos.

## Rutas activas

- `/`: carga inicial V13.
- `/carga`: carga inicial V13.
- `/portada`: base visual de Portada / Intro 002D.

## Validaciones ejecutadas

- `npm run lint`: OK.
- `npm run test`: OK, 4 archivos y 21 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK, 27 rutas PNG validadas.
- `npm run test:e2e`: OK, 12 tests.

## Revisión visual local

Se generó una captura temporal 390x844 de `/portada` para revisión local. La composición muestra fondo Archivo Vivo, Lía visible en zona superior/derecha, cinco portales, Portal I disponible, Portales II-V bloqueados con candados, título y botón DOM visibles.

La captura no se agregó al repo.

## Estado

`BASE_VISUAL_IMPLEMENTADA / SIN_DIALOGOS / SIN_GATING_FINAL / NO_CERRADA`

## Próximo ticket recomendado

`TICKET_002E_PORTADA_INTRO_DIALOGOS_Y_GATING.md`

Ese ticket debe implementar diálogos reales, inicio de introducción desde botón/Portal I, estado `intro_dialogue_active`, feedback de portales bloqueados y preparación de Portal I después de diálogos.
