# QA visual Portada / Intro 002H

Fecha: 2026-05-29

Ruta revisada: `/portada`

Viewport de evidencia: `390x844`

Estado QA: `QA_VISUAL_GENERADO / PENDIENTE_APROBACION_USUARIO / NO_CERRADA`

Decisión visual del usuario: `PENDIENTE`

## Alcance

Este QA documenta evidencia visual y técnica de la Portada / Intro después del ticket 002G. No implementa nuevas funciones, no rediseña la pantalla, no crea assets runtime y no modifica la carga inicial.

La aprobación visual sigue dependiendo del usuario Ing. José David.

## Capturas generadas

| Estado | Archivo |
| --- | --- |
| `portada_idle` | `cover-intro-qa-01-idle-390x844.png` |
| Primer diálogo | `cover-intro-qa-02-dialogue-01-390x844.png` |
| Diálogo de aclaración | `cover-intro-qa-03-dialogue-clarification-390x844.png` |
| Portal I listo | `cover-intro-qa-04-portal-1-ready-390x844.png` |
| Opening placeholder | `cover-intro-qa-05-opening-placeholder-390x844.png` |
| Transition placeholder | `cover-intro-qa-06-transition-placeholder-390x844.png` |
| Portal bloqueado | `cover-intro-qa-07-blocked-portal-feedback-390x844.png` |
| Reduced motion con diálogo | `cover-intro-qa-08-reduced-motion-dialogue-390x844.png` |

## Matriz de evaluación visual

| Criterio | Estado | Evidencia / nota |
| --- | --- | --- |
| Composición mobile-first | OK | Capturas 390x844 generadas sin evidencia de overflow en el flujo e2e. |
| Legibilidad de logo/título | OK | `OKÚA`, `GUÍA VISUAL` y `EL ARCHIVO VIVO DE OKÚA` se mantienen como DOM/CSS visible. |
| Legibilidad del botón | OK | `Comenzar recorrido` y `Entrar a Mundo I` son visibles y accionables. |
| Lía como guía principal | OK | Lía conserva protagonismo visual en idle, diálogos y placeholder. |
| Portal I disponible | OK | Portal I aparece disponible y puede iniciar la introducción. |
| Portales II-V bloqueados | OK | Portales II-V permanecen bloqueados. |
| Candados visibles | OK | Candados visibles en portales bloqueados. |
| Diálogo no tapa información crítica | OK | La tarjeta de diálogo queda en la zona inferior sin impedir la lectura de Lía/portales principales. |
| Textos de mediación claros | OK | Se capturan los diálogos obligatorios de presentación y aclaración. |
| Movimiento no saturado | OBSERVACIÓN | Las capturas estáticas son correctas; la aprobación fina de motion queda a revisión manual del usuario. |
| Reduced motion estable | OK | Captura reduced motion generada y flujo e2e reducido validado. |
| No hay audio | OK | Tests e2e verifican ausencia de `audio`. |
| No hay video | OK | Tests e2e verifican ausencia de `video`. |
| No hay recursos externos | OK | `audit:assets` y validador de assets quedan como validaciones obligatorias del cierre. |
| No hay salto directo a Mundo I antes de diálogos | OK | El flujo exige completar los diálogos antes de `Entrar a Mundo I`. |
| Transition placeholder claro | OK | Se captura `Preparando recorrido...` y acción explícita `Continuar a Mundo I`. |

## Criterios para APROBADA_PARA_AVANZAR

La pantalla puede quedar `APROBADA_PARA_AVANZAR` si:

- El usuario la califica visualmente con `7/10` o más.
- No rompe restricciones no negociables.
- Funciona técnicamente.
- Los diálogos introductorios están presentes.
- Portal I queda gated correctamente.
- Portales II-V no navegan.
- La deuda visual queda documentada.

## Criterios para CERRADA_APROBADA_FINAL

La pantalla solo puede quedar `CERRADA_APROBADA_FINAL` si se acerca a `9/10` o `10/10` y no tiene deuda visual importante.

Este ticket no asigna `CERRADA_APROBADA_FINAL`.

## Deuda y decisión pendiente

- La transición pixelart final hacia Mundo I no está implementada.
- Estación I real no está implementada.
- Los interiores de portales siguen diferidos.
- La revisión de motion fina queda pendiente de la evaluación visual del usuario.

Decisión posterior requerida:

- `APROBADA_PARA_AVANZAR`, o
- `AJUSTE_VISUAL_REQUERIDO`, o
- `CERRADA_APROBADA_FINAL`.

