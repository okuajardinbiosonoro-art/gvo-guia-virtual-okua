# ADR-0004: Precache crítico y cache runtime local

## Estado

Aceptado técnicamente; pendiente de revisión humana bajo `GVO_DEBT_010`.

## Contexto

El build anterior copiaba `247.700.044` bytes a `dist` y declaraba `278`
entradas de precache. El service worker almacenaba por adelantado recursos de
todo el recorrido, incluidos assets de estaciones que aún no se habían
visitado y copias documentales que no son consumidores runtime.

GVO debe seguir funcionando en la red local sin Internet, desde un navegador
móvil y sin exigir instalación. La optimización no puede cambiar rutas,
progreso, assets canónicos, navegación ni composición, y tampoco puede
introducir route chunking o lazy loading.

## Decisión

Dividir la entrega en cuatro clases:

- `A — primer acceso`: shell HTML, manifest, registro del service worker,
  bundle monolítico, CSS, fuentes, icono, Carga inicial y Portada. Se mantiene
  en precache.
- `B — recorrido`: assets compartidos de Transición. Se despliegan y entran en
  cache runtime al solicitarse.
- `C — estación específica`: assets canónicos de estaciones, Mirador, gestos y
  las poses compartidas consumidas por Mundo II/Mundo IV. Se despliegan y
  entran en cache runtime al solicitarse.
- `D — no runtime`: mirrors `current-used`, bibliotecas duplicadas no
  consumidas, manifests documentales y README alojados bajo `public`. Se
  preservan en el repositorio, pero se excluyen únicamente del artefacto
  generado `dist`.

Workbox aplica `StaleWhileRevalidate` sólo a recursos same-origin bajo
`/assets/` con extensiones locales `json`, `png`, `svg`, `webp` o `woff2`. El
cache `gvo-runtime-assets-v1` admite `256` entradas, expira a los `30` días,
acepta respuestas `0/200` y purga en caso de presión de cuota. El fallback de
navegación continúa en `/index.html`; `autoUpdate` y
`cleanupOutdatedCaches` mantienen la actualización del service worker.

La exclusión de clase D ocurre durante `writeBundle`, después de copiar
`public` y antes de que Workbox calcule el precache. Los targets son rutas
fijas, se validan como descendientes de `dist` y nunca eliminan archivos de
`public`.

## Consecuencias

- El primer acceso deja de descargar por adelantado todos los mundos.
- La red local sigue sirviendo el recorrido completo sin depender de Internet.
- Los recursos B/C visitados quedan disponibles desde cache y se revalidan
  cuando el servidor local está accesible.
- No se promete que una estación nunca visitada funcione después de perder
  también la conexión al servidor LAN; ese escenario no equivale al contrato
  local sin Internet.
- El visitante no ve controles, instrucciones ni requisitos de instalación.
- Los mirrors, inventarios y assets fuente conservan sus rutas e hashes en el
  repositorio aunque no formen parte del despliegue.
- Route chunking y lazy loading permanecen fuera de alcance.
