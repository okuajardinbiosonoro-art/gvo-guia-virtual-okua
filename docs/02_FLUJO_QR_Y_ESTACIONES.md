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
- `/estacion/1`
- `/estacion/2`
- `/estacion/3`
- `/estacion/4`
- `/estacion/5`
- `/final`
- `/qr/:stationId`

## Regla secuencial

La estación 1 queda disponible desde portada. Cada estación siguiente requiere completar la estación anterior. El final requiere completar la estación 5.

## Transición entre mundos

La pantalla de transición es reutilizable y tendrá ticket propio. En este ticket solo existe placeholder técnico.
