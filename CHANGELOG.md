# Changelog

## 1.1.2 · 2026-11-13

- Reduce la descarga inicial de Workbox al sacar 28 recursos históricos del
  precache. El servidor local sigue sirviendo esos archivos.
- Consulta el [acta de versión](docs/releases/GVO_1.1.2.md).

## 1.1.1 · 2026-11-13

- Sala IV usa seis piezas y adapta el progreso válido de la versión de ocho.
- La Polaroid incluye una enredadera de curubas y la frase provisional
  «La naturaleza también canta».
- Consulta el [acta de versión](docs/releases/GVO_1.1.1.md).

## 1.1.0 · 2026-11-12

- Foto con Lía en el Mirador con cámara frontal, dos poses, opción sin Lía
  y un JPEG con el marco de OKÚA para guardar o compartir.
- Luz ambiental en el sol y reflejos en el río del Mirador.
- Catorce sonidos locales, ajuste de volumen en la entrada y control de silencio.
- Precarga por sala, incluidos los tres capítulos del cuaderno de Sala III.
- Consulta el [acta de versión](docs/releases/GVO_1.1.0.md).

## 1.0.0 · 2026-11-12

- Recorrido completo de OKÚA, desde la preportada animada hasta el Mirador.
- Cinco salas, cuatro QR, progreso verificable, revisita y reinicio.
- Acabado final de Sala V con la composición aprobada en iPhone.
- Consulta el [acta de versión](docs/releases/GVO_1.0.0.md).

## Desarrollo anterior a 1.0.0

### Added

- Estación IV (`/estacion/4`) como Mesa de sistema inmersiva con cadena Planta → Bionosificador → ESP32 → MIDI → Wi‑Fi/UDP → Router → Sistema central → Sonido.
- Veinte assets runtime aprobados de Estación IV y veinte espejos byte-idénticos bajo `current-used/world-4-root`, con manifest, dimensiones, alpha bounds y SHA-256.
- Ruta SVG activa, FX semánticos 1–8, guía de Lía, ambiente técnico, ayuda tap, chain complete, CTA, revisita y reduced motion.
- Fullscreen opt-in, `OrientationHint`, layout portrait/landscape y utilidades inmersivas compartidas.
- Contrato de cierre 018E, retrospectiva, handoff de Estación IV y handoff autosuficiente para iniciar la auditoría de Estación V.
- Estación III (`/estacion/3`) como Cuaderno Pixel de Pruebas mobile-first con índice progresivo, PLANTA, PROTOTIPO, SEÑAL, AJUSTADO y revisitas.
- Quince assets runtime aprobados de Estación III y sus quince espejos byte-idénticos bajo `current-used/world-3-root`.
- PageTurn con hoja real, cinco poses runtime de Lía, anotaciones por sprite sheet, motor determinista de traza de SEÑAL y ayudas compartidas de interacción.
- Contrato canónico de cierre, inventario de assets, roadmap, trazabilidad de limpieza y handoff de Estación III.

### Changed

- Estación IV pasa a `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`; el resultado histórico 018C y los flags parciales R1/018D se preservan sin reescritura.
- La documentación viva, inventario, arquitectura, roadmap y registros `current-used` reflejan el cierre real de Estación IV y el estado funcional pero provisional de Estación V.
- z1 permanece retenido y z5 se conserva como asset excluido del render mediante `front-edge-disabled-by-human-review`.
- La transición Mundo II → Mundo III queda definitiva, pasiva y automática, sin CTA, con duraciones de 2300 ms y 1000 ms en reduced motion.
- Los slots `TRANS_W2_W3_*` registran el copy aprobado como `FINAL` con fuente de aprobación humana.
- La documentación viva refleja Estación III cerrada; la referencia histórica a la base técnica entonces no aprobada de Mundo IV queda resuelta por el cierre humano 018E descrito arriba.

### Removed

- `station4NodeArt.tsx`, arte procedural reemplazado por los ocho objetos raster aprobados y sus overlays semánticos.
- `PixelLia.tsx`, fallback procedural provisional sin consumidores, sustituido por `World3LiaActor` y cinco poses aprobadas.
- Informe intermedio de port Fable de Estación III, materialmente supersedido por el contrato canónico final.
