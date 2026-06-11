# Flujo QR y estaciones

El recorrido se organiza como una secuencia de pantallas locales. El acceso principal se piensa para QR físicos colocados en el espacio OKÚA.

## Orden del recorrido

1. Carga inicial pre-portada
2. Portada / Intro
3. Estación I — Mundo I: Raíz
4. Estación II — Mundo II: Lía y el pulso invisible
5. Estación III — Mundo III: Cuaderno Pixel de Pruebas
6. Estación IV — Mundo IV: Mesa de sistema
7. Estación V — Mundo V: Mapa del presente
8. Final — Mirador final del jardín

## Rutas base

- `/`
- `/carga`
- `/portada`
- `/transition/intro-to-station-1`
- `/estacion/1`
- `/estacion/2`
- `/estacion/3`
- `/estacion/4`
- `/estacion/5`
- `/final`
- `/qr/:stationId`

## Regla secuencial

La Portada / Intro entrega el flujo a la transición runtime `/transition/intro-to-station-1`, y esta transición conduce a `/estacion/1`.

La estación 1 ya está montada como Mundo I: Raíz mediante `World1RootScreen`. Cada estación siguiente requiere completar la estación anterior. Las estaciones II-V y el final real siguen pendientes de implementación funcional.

## Transición entre mundos

La pantalla de transición reutilizable ya existe para el tramo Portada / Intro -> Mundo I. La preview técnica se conserva en `/dev/transition-world` y el runtime aprobado usa `/transition/intro-to-station-1`.
