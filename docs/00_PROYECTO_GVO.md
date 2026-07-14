# Proyecto GVO

GVO — Guía Virtual OKÚA es una aplicación web local para guiar el recorrido OKÚA desde el navegador móvil del visitante. La experiencia debe funcionar dentro de una red MikroTik sin Internet y sin instalación por parte del público.

## Objetivo

Crear una guía visual, secuencial e insonora que organice el recorrido por mundos/estaciones mediante QR físicos.

## Estado vivo 017K

Este repositorio nació con base técnica, documentación metodológica y rutas placeholder. Ese estado inicial ya fue superado por las pantallas runtime aprobadas para avanzar.

Estado técnico vivo:

- Carga inicial pre-portada integrada en `/` y `/carga`.
- Portada / Intro integrada en `/portada`.
- Transiciones reutilizables integradas; el tramo Mundo II → Mundo III está cerrado como pasivo, automático y sin CTA.
- Mundo I: Raíz montado en `/estacion/1` mediante `World1RootScreen`.
- Mundo II finalizado para el alcance actual en `/estacion/2`.
- Mundo III / Estación III cerrado y aprobado por revisión humana en `/estacion/3`.
- Mundo IV conserva una base técnica preexistente no aprobada; no fue iniciado por 017K.
- Mundo V, final real y scanner interno conservan su estado documentado y no fueron ampliados por 017K.

La documentación histórica puede conservar menciones a placeholders como evidencia de etapas anteriores. La fuente viva debe distinguirlas del estado actual del runtime.

La fuente vigente es [`status/CURRENT_STATE.md`](status/CURRENT_STATE.md); el contrato integral de Estación III es [`status/GVO_STATION3_COMPLETE.md`](status/GVO_STATION3_COMPLETE.md).

## Principio operativo

La app debe ser autosuficiente en runtime: todos los recursos necesarios deben estar incluidos localmente en el build desplegado.
