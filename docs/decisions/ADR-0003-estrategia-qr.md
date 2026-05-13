# ADR-0003: Estrategia QR

## Estado

Aceptado.

## Contexto

El recorrido avanza mediante QR físicos. El scanner interno con cámara puede requerir contexto seguro, lo que no siempre es trivial en LAN local.

## Decisión

El flujo principal usa QR físicos que abren URLs locales con la cámara nativa del celular. El scanner interno queda como mejora opcional, no como bloqueo.

## Consecuencias

- La app debe ser navegable por URL local directa.
- Cada estación debe tener ruta estable.
- La validación de QR se hace contra la URL real alcanzable desde el celular.
