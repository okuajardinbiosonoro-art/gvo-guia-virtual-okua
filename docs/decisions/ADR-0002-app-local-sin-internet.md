# ADR-0002: App local sin Internet

## Estado

Aceptado.

## Contexto

El recorrido OKÚA opera dentro de una red MikroTik sin Internet. Cualquier dependencia remota puede romper la experiencia del visitante.

## Decisión

La app no debe cargar recursos externos en runtime. Fuentes, imágenes, scripts, estilos y datos deben vivir dentro del repositorio o del build local.

## Consecuencias

- No se permiten CDN ni APIs remotas.
- La auditoría de assets debe detectar URLs externas en `src`, `public` y `assets`.
- Los QR deben apuntar a direcciones locales verificadas.
