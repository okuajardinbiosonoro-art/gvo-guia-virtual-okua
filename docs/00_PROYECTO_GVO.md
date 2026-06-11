# Proyecto GVO

GVO — Guía Virtual OKÚA es una aplicación web local para guiar el recorrido OKÚA desde el navegador móvil del visitante. La experiencia debe funcionar dentro de una red MikroTik sin Internet y sin instalación por parte del público.

## Objetivo

Crear una guía visual, secuencial e insonora que organice el recorrido por mundos/estaciones mediante QR físicos.

## Estado vivo 007C

Este repositorio nació con base técnica, documentación metodológica y rutas placeholder. Ese estado inicial ya fue superado por las pantallas runtime aprobadas para avanzar.

Estado técnico vivo:

- Carga inicial pre-portada integrada en `/` y `/carga`.
- Portada / Intro integrada en `/portada`.
- Transición entre mundos integrada en `/transition/intro-to-station-1`.
- Mundo I: Raíz montado en `/estacion/1` mediante `World1RootScreen`.
- Estaciones II-V, final real y scanner interno siguen pendientes de tickets futuros.

La documentación histórica puede conservar menciones a placeholders como evidencia de etapas anteriores. La fuente viva debe distinguirlas del estado actual del runtime.

## Principio operativo

La app debe ser autosuficiente en runtime: todos los recursos necesarios deben estar incluidos localmente en el build desplegado.
