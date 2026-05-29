# Handoff 002E - Portada / Intro diálogos y gating

Fecha: 2026-05-29

## Estado

`DIALOGOS_BASE_IMPLEMENTADOS / GATING_PORTAL_I_BASE / SIN_TRANSICION_REAL / NO_CERRADA`

## Rama

`feature/002E-portada-intro-dialogos-gating`

## Base usada

- Rama base: `feature/002D-portada-intro-base-visual`
- Commit base: `4af05b3 feat: implement cover intro base visual`

## Qué se implementó

- Secuencia introductoria de Lía con cinco diálogos obligatorios.
- Inicio de diálogos desde `Comenzar recorrido`.
- Inicio de diálogos desde Portal I en primera pasada.
- Estado `portal_1_ready` después de completar la introducción.
- Botón `Entrar a Mundo I` después de los diálogos.
- Estado `portal_1_opening_placeholder` con el texto `Abriendo Mundo I: Raíz...`.
- Feedback breve para Portales II-V bloqueados.
- Cambio de pose de Lía según el estado narrativo.
- Persistencia local mínima con la clave `gvo.coverIntro.introCompleted.v1`.

## Estados implementados

- `portada_idle`
- `intro_dialogue_started`
- `intro_dialogue_active`
- `intro_dialogue_completed`
- `portal_1_ready`
- `portal_1_opening_placeholder`

## Diálogos implementados

1. `Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.`
2. `Antes de entrar, aclaremos algo: las plantas no hacen música por sí solas.`
3. `Lo que vas a recorrer es una mediación: una señal viva, una captura técnica y una interpretación.`
4. `Primero seguiremos el orden de los mundos. Al final podrás volver libremente a cualquier estación.`
5. `Empecemos por la raíz: el origen y el propósito de OKÚA.`

## Portales bloqueados

- Portal II: `Primero debemos entrar por Raíz. Después llegaremos al pulso invisible.`
- Portal III: `Ese mundo se desbloquea más adelante. Antes necesitamos entender el origen y la señal.`
- Portal IV: `La operación técnica tendrá sentido cuando ya conozcas la mediación.`
- Portal V: `El presente se entiende mejor al final del recorrido.`

## Qué no se implementó

- No se implementó transición real a Mundo I.
- No se implementó Estación I.
- No se implementaron estaciones II-V.
- No se desbloquearon Portales II-V.
- No se crearon interiores de portales.
- No se agregaron assets nuevos.
- No se modificaron PNG staged.
- No se modificó la carga inicial V13.
- No se cambió `/` ni `/carga`.
- No se agregó audio.
- No se agregó video runtime.
- No se usaron recursos externos ni CDN.

## Validaciones ejecutadas

- `npm run lint`: OK.
- `npm run test`: OK, 4 archivos y 29 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK, 27 rutas PNG validadas.
- `npm run test:e2e`: OK, 12 tests.

## Revisión visual local

Se generaron capturas temporales 390x844 de `/portada` para revisar estado inicial, diálogo 1, Portal I listo y placeholder de apertura. La composición mantiene la base visual 002D, muestra un solo diálogo a la vez y conserva textos/botones como DOM/CSS.

Las capturas no se agregaron al repo.

## Próximo ticket recomendado

`TICKET_002F_PORTADA_INTRO_MOTION_POLISH_Y_REDUCED_MOTION.md`

Ese ticket debe encargarse de polish de motion de Lía, pulso fino de Portal I, aparición suave de diálogos y reduced motion robusto sin implementar todavía la transición real a Mundo I.
