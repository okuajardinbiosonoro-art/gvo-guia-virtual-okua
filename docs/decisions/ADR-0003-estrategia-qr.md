# ADR-0003: Estrategia QR

## Estado

Reemplazado por `ADR-0007`.

## Contexto

El recorrido avanza mediante QR físicos. El scanner interno con cámara puede requerir contexto seguro, lo que no siempre es trivial en LAN local.

## Decisión

El flujo principal usa QR físicos que abren URLs locales con la cámara nativa del celular. El scanner interno queda como mejora opcional, no como bloqueo.

Esta fue la decisión histórica inicial. GVO_DEBT_015 la reemplaza por scanner interno obligatorio y handoff interstation QR-only.

## Consecuencias

- La app debe ser navegable por URL local directa.
- Cada estación debe tener ruta estable.
- La validación de QR se hace contra la URL real alcanzable desde el celular.
