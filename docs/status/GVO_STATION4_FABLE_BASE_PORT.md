# Estación IV — base Fable integrada

Fecha: 2026-07-11

## Estado

`BASE_FABLE_INTEGRADA / PREPARADA_PARA_ITERACION_ESTACION_IV`

La Estación IV oficial reemplaza el shell temporal por la base Fable
`Mesa de sistema` en composición 2.5D.

Esta integración conserva el alcance solicitado como base técnica. No implica
aprobación visual final ni autorización automática para avanzar de fase.

## Alcance integrado

- Mesa 2.5D mobile-first construida con CSS 3D, sin Three.js.
- Cadena secuencial de ocho nodos: PLANTA, BIONOSIFICADOR, ESP32, MIDI,
  WI-FI/UDP, ROUTER, SISTEMA CENTRAL y SONIDO.
- Progresión mediante iluminación y toque del siguiente nodo.
- Movimiento de Lía entre nodos, tarjeta explicativa y revisión libre.
- Salida `Abrir Mundo V` habilitada al completar la cadena.
- Soporte de `prefers-reduced-motion`.
- Pruebas específicas de interacción y accesibilidad.

No se modificaron rutas, transiciones, Estación III, Mundo V ni los slots
editoriales globales.

## Assets runtime

La pantalla reutiliza dos poses oficiales locales de Lía. Sus rutas y hashes
quedaron registrados en:

`public/assets/gvo/current-used/world-4-root/README.md`

Los nodos técnicos y la mesa son procedurales. No se copiaron mockups ni
capturas del laboratorio al runtime oficial.

## Límites vigentes

- Las miniaturas técnicas procedurales son una base sustituible, no assets
  finales aprobados.
- La perspectiva 2.5D fue comprobada históricamente en Chromium; Safari iOS
  real continúa pendiente.
- El copy procede de la especificación V1 y conserva condición de base para
  iteración editorial.

## Validación histórica de la base Fable

- `npm run lint`: aprobado.
- `npm run test`: 14 archivos y 120 pruebas aprobadas; 12 de Estación IV.
- `npm run build`: aprobado.
- Nueve capturas visuales en 390×844, 360×640 y reduced motion.

## Validación del port oficial

- Los cinco archivos portados coincidieron por hash Git con la rama Fable.
- Prueba aislada de `World4RootScreen`: 12/12 aprobadas.
- `npm run lint`: aprobado, cero errores.
- `npm run build`: TypeScript y Vite completaron la generación de producción
  (`558 modules transformed`, `built in 11.71s`). Se mantiene el warning
  preexistente de chunk superior a 500 kB. El proceso Node no se cerró después
  de imprimir el resultado exitoso y fue detenido manualmente.
- `git diff --check`: aprobado.
