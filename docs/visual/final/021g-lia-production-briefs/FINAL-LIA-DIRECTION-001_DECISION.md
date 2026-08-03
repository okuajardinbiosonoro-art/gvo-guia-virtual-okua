# FINAL-LIA-DIRECTION-001 — Decisión 021G

> PREPRODUCTION — NOT RUNTIME. No se produce asset en este ticket.

## Opciones

| Opción | Descripción | Comparación | Resultado |
|---|---|---|---|
| A | Rotación/traslación determinista pequeña | Sin binario nuevo; conserva identidad y evita inversión | `SELECTED_FOR_INITIAL_TEST` |
| B | Flip horizontal | Invierte iluminación, collar, pétalos y asimetrías | `REJECTED` |
| C | Cinco poses raster dedicadas | Mayor costo y riesgo antes de probar comprensión | `DEFERRED` |

## Decisión

`DEFERRED / NO_NEW_ASSET_IN_INITIAL_SET`

## Fundamento

La orientación inicial debe probarse con rotación/traslación mínima; no con flip. Producir estados separados sólo se justifica si una prueba humana muestra una mejora material de comprensión.

## Condición explícita de reapertura

Reabrir únicamente con evidencia humana comparativa de que la rotación/traslación no comunica dirección y que un raster separado mejora materialmente la comprensión sin romper identidad.

## Restricciones

Sin flip, sin arte anticipado, sin integración, sin `current-used` y sin reinterpretar identidad.
