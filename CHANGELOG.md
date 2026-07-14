# Changelog

## Unreleased

### Added

- Estación III (`/estacion/3`) como Cuaderno Pixel de Pruebas mobile-first con índice progresivo, PLANTA, PROTOTIPO, SEÑAL, AJUSTADO y revisitas.
- Quince assets runtime aprobados de Estación III y sus quince espejos byte-idénticos bajo `current-used/world-3-root`.
- PageTurn con hoja real, cinco poses runtime de Lía, anotaciones por sprite sheet, motor determinista de traza de SEÑAL y ayudas compartidas de interacción.
- Contrato canónico de cierre, inventario de assets, roadmap, trazabilidad de limpieza y handoff de Estación III.

### Changed

- La transición Mundo II → Mundo III queda definitiva, pasiva y automática, sin CTA, con duraciones de 2300 ms y 1000 ms en reduced motion.
- Los slots `TRANS_W2_W3_*` registran el copy aprobado como `FINAL` con fuente de aprobación humana.
- La documentación viva refleja Estación III cerrada y separa la base técnica preexistente no aprobada de Mundo IV.

### Removed

- `PixelLia.tsx`, fallback procedural provisional sin consumidores, sustituido por `World3LiaActor` y cinco poses aprobadas.
- Informe intermedio de port Fable de Estación III, materialmente supersedido por el contrato canónico final.
