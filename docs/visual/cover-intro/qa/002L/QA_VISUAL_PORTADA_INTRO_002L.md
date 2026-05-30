# QA visual final 002L - Portada / Intro

Fecha: 2026-05-30

Pantalla: `Portada / Intro - El Archivo Vivo de OKÚA`

Estado técnico: `QA_FINAL_002L_GENERADO / CANDIDATA_APROBADA_PARA_AVANZAR / PENDIENTE_CONFIRMACION_FINAL_USUARIO`

Viewport principal: `390x844`

## Capturas generadas

- `cover-intro-002l-01-root-flow-fresh-idle-390x844.png`
- `cover-intro-002l-02-idle-direct-reset-390x844.png`
- `cover-intro-002l-03-dialogue-paso-1-happy-390x844.png`
- `cover-intro-002l-04-dialogue-paso-2-aclaracion-390x844.png`
- `cover-intro-002l-05-portal-1-ready-390x844.png`
- `cover-intro-002l-06-activation-contact-390x844.png`
- `cover-intro-002l-07-transition-placeholder-390x844.png`
- `cover-intro-002l-08-blocked-portal-feedback-390x844.png`
- `cover-intro-002l-09-reduced-motion-dialogue-390x844.png`
- `cover-intro-002l-10-station-1-placeholder-390x844.png`

## Matriz QA

| Criterio                                             | Estado | Observación                                                |
| ---------------------------------------------------- | ------ | ---------------------------------------------------------- |
| Flujo `/?resetIntro=1` funciona                      | OK     | Se valida carga inicial y llegada a `/portada` fresca.     |
| `/portada?resetIntro=1` funciona                     | OK     | Limpia persistencia y muestra `Comenzar recorrido`.        |
| `/carga` sigue funcionando                           | OK     | Conserva pantalla de carga inicial y textos aprobados.     |
| Fondo Archivo Vivo visible y coherente               | OK     | La escena mantiene referencia editorial orgánica.          |
| Lía visible como guía principal                      | OK     | Lía se mantiene legible y protagonista.                    |
| Microvida de Lía perceptible sin exagerar            | OK     | Rig seguro visible en idle y diálogos 1-4.                 |
| Diálogo integrado con Lía                            | OK     | Panel conserva badge `Lía`, acento y ubicación integrada.  |
| No existe línea/flecha/triángulo ordinario           | OK     | No se reintrodujo conector ordinario.                      |
| Tipografía de diálogo legible                        | OK     | Se conserva tipografía de lectura para textos largos.      |
| `Paso X de 5` legible                                | OK     | `Paso 1 de 5` y `Paso 2 de 5` capturados.                  |
| Diálogos obligatorios aparecen en orden              | OK     | Flujo avanza de presentación a aclaración y cierre.        |
| Aclaración sobre plantas no hacen música es visible  | OK     | Captura 04 documenta la frase completa.                    |
| Portal I se distingue como disponible/listo          | OK     | Captura 05 muestra CTA `Entrar a Mundo I`.                 |
| Portales II-V se entienden bloqueados                | OK     | Candados y estados bloqueados se conservan.                |
| Candados visibles                                    | OK     | Capturas idle, ready y feedback los muestran.              |
| Feedback de portales bloqueados funciona             | OK     | Portal II muestra mensaje breve sin navegar.               |
| Activación Portal I se siente anclada                | OK     | Lía `activatePortal1` aparece dentro del rig del Portal I. |
| Transition placeholder claro                         | OK     | Overlay DOM muestra `Preparando recorrido...`.             |
| `Continuar a Mundo I` va a `/estacion/1` placeholder | OK     | Captura 10 confirma ruta placeholder.                      |
| Reduced motion estable                               | OK     | Diálogo funcional sin animación continua fuerte.           |
| No audio                                             | OK     | Validado por e2e y auditoría.                              |
| No video runtime                                     | OK     | Validado por e2e y auditoría.                              |
| No recursos externos                                 | OK     | Validado por auditoría de assets.                          |
| No Estación I real                                   | OK     | `/estacion/1` sigue mostrando `Estación placeholder`.      |
| No transición pixelart final                         | OK     | Se mantiene transition placeholder documentado.            |

## Decisión técnica de Codex

`CANDIDATA_APROBADA_PARA_AVANZAR`

La pantalla supera el control técnico de QA final 002L sin detectar regresiones dentro del alcance del ticket.

## Decisión visual final del usuario

`PENDIENTE / PARA CONFIRMAR EN CHAT`

Opciones metodológicas disponibles:

- `APROBADA_PARA_AVANZAR`
- `AJUSTE_VISUAL_REQUERIDO`
- `CERRADA_APROBADA_FINAL`
