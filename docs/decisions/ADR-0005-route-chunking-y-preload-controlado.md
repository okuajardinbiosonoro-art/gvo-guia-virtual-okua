# ADR-0005: Route chunking y preload controlado

## Estado

Aceptado técnicamente; pendiente de revisión humana bajo `GVO_DEBT_011`.

## Contexto

El baseline `eb4761e22e2d85634e4aef75bb13a8862610fc69` entregaba toda la
aplicación en un único JS inicial de `818.393` bytes. Carga inicial, Portada,
Transición, Mundos I–V y Mirador se evaluaban antes de que el visitante
necesitara las estaciones. `GVO_DEBT_010` ya había separado los assets de
estación del precache, pero excluyó expresamente el route chunking.

La división no puede cambiar rutas públicas, guards, progreso, checkpoints,
reset, QR, copy, composición, assets ni estrategia PWA. También debe evitar un
fallback visible durante las transiciones automáticas.

## Decisión

- Mantener críticos y estáticos `GlobalImmersiveShell`, Carga inicial y
  Portada.
- Definir loaders dinámicos explícitos para Transición, Mundos I–V y Mirador
  en `src/app/routeModules.ts`.
- Montar esos módulos con `React.lazy` y un único límite `Suspense` accesible.
- Precalentar el módulo de Transición sólo cuando el visitante manifiesta la
  intención de abrir el portal I.
- Al montar cada transición, iniciar una sola promesa de importación para el
  destino; completar la navegación cuando ese módulo esté disponible.
- Si el import del destino falla, usar navegación completa hacia la misma ruta
  pública como fallback seguro.
- Mantener el JS/CSS inicial en precache y dejar JS/CSS de rutas en el cache
  runtime same-origin existente cuando se solicitan.

Los imports apuntan al archivo de pantalla concreto para producir nombres de
chunk distinguibles y evitar que el patrón `index-*` del shell incluya rutas
diferidas en el precache.

## Consecuencias

- La primera carga ya no evalúa Transición, estaciones ni Mirador.
- Cada ruta descarga su JS y CSS al entrar, salvo el destino que una transición
  ya esté precargando por intención confirmada.
- Una ruta visitada queda cubierta por `gvo-runtime-assets-v1`, de acuerdo con
  el contrato PWA aprobado: el shell funciona offline y los recursos B/C sólo
  están garantizados después de haber sido solicitados.
- Las rutas no visitadas no se prometen offline; no se amplía el contrato de
  `GVO_DEBT_010`.
- No se agregan dependencias, rutas, assets ni estados funcionales.
