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

## Contrato de entrada QR

Las rutas locales `/qr/1` a `/qr/5` son enlaces físicos tipados; no abren un
scanner interno ni solicitan cámara. Cada entrada se resuelve contra la misma
regla secuencial usada por los guards de las estaciones:

- con progreso suficiente, redirige a la estación solicitada;
- sin progreso suficiente, redirige a la estación más avanzada autorizada;
- con un identificador inválido, manipulado o fuera de `1…5`, aplica el mismo
  fallback seguro;
- la resolución es read-only respecto a `gvo.progress.v1` y no concede ni
  inventa progreso.

La cámara nativa del dispositivo puede abrir la URL local codificada en un QR,
pero GVO no activa `getUserMedia`, scanner, micrófono ni permisos sensibles.

## Shell inmersivo

Las rutas reales de Estaciones I–V y las cuatro subrutas de Mundo V comparten
un único `ImmersiveModeControl`. El control solicita fullscreen estándar sólo
después de un gesto explícito, respeta safe-area y reduced motion, y no se
muestra en carga, portada, transiciones, Mirador, rutas QR intermedias ni rutas
de desarrollo.

## Regla secuencial

La Portada / Intro entrega el flujo a `/transition/intro-to-station-1`, que conduce a `/estacion/1`. El recorrido consolidado continúa por Mundo I y Mundo II hasta la transición definitiva `/transition/world-2-to-world-3`, que avanza automáticamente a `/estacion/3`.

Mundo III exige la primera pasada `PLANTA → PROTOTIPO → SEÑAL → AJUSTADO`; después permite revisitas y habilita `Continuar`. El avance conduce a la transición W3→W4, cuyo copy sigue siendo `TEMP`.

Mundo IV exige la primera pasada `Planta → Bionosificador → ESP32 → MIDI → Wi‑Fi/UDP → Router → Sistema central → Sonido`. Al completar la cadena habilita CTA y revisitas. Estación IV está cerrada y aprobada; su salida usa la ruta W4→W5 existente, cuyo copy editorial continúa `TEMP`.

Mundo V posee una base Fable funcional con cuatro áreas (`PLANTAS → SISTEMA → ESPACIO → VISITANTE`) y revisitas posteriores. Sus visuales siguen siendo procedurales/reemplazables: la estación no está cerrada ni aprobada por revisión humana.

## Transición entre mundos

La pantalla de transición reutilizable cubre los tramos del recorrido. La transición W2→W3 es pasiva y automática, usa `Abriendo Mundo III` / `Preparando el Cuaderno Pixel de Pruebas…`, dura 2300 ms en movimiento normal y 1000 ms en reduced motion, y no expone CTA, link ni hotspot. La preview técnica se conserva en `/dev/transition-world`.

Las rutas W3→W4, W4→W5 y W5→Final existen y funcionan con el componente compartido, pero su copy permanece `TEMP`; no se documentan como transiciones definitivas. Estación IV no modifica esos contratos durante 018E.
