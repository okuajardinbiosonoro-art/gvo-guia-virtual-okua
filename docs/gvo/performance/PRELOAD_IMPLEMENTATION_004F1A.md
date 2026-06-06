# GVO — Implementación preload/decode crítico
## Ticket 004F-1A

## 0. Estado

Estado del ticket: IMPLEMENTADO EN RUNTIME.

Rama auditada e intervenida:

```txt
main
```

Base:

```txt
04467b8 docs(gvo): add mobile performance and preload audit
```

Este ticket implementa la primera capa funcional de preload/decode crítico por pantalla. No optimiza, convierte, borra ni edita imágenes.

## 1. Objetivo

Reducir la percepción de carga por capas en mobile mediante bundles críticos locales por pantalla y una utilidad reusable de preload/decode con timeout seguro.

## 2. Problema abordado

La auditoría `004F-0A` detectó que Carga Inicial, Portada / Intro y Mundo I solicitan varios MB de imágenes locales y que la experiencia podía mostrar capas apareciendo tarde en celulares. El problema no venía de CDN ni recursos externos, sino de imagenes locales sin compuerta explícita de preload/decode.

## 3. Utilidades creadas

Se creó:

```txt
src/shared/assets/assetPreloader.ts
src/shared/assets/screenAssetBundles.ts
src/shared/assets/useAssetPreloader.ts
```

`assetPreloader.ts` incluye:

- `preloadImage(src, options)`
- `preloadImages(srcs, options)`
- cache interna por ruta;
- deduplicación de rutas;
- `new Image()`;
- `HTMLImageElement.decode()` cuando existe;
- fallback si `decode()` no está disponible;
- `onload`;
- `onerror`;
- timeout controlado;
- rechazo de URLs externas `http://` / `https://` fuera del origen local;
- manejo seguro de rutas vacías.

`useAssetPreloader.ts` expone:

- `status`;
- `progress`;
- `ready`;
- `failed`;
- `timedOut`;
- `total`;
- `summary`.

Estados:

```txt
idle
loading
ready
error
timeout
```

## 4. Integración por pantalla

### Carga Inicial

Ruta:

```txt
/
/carga
```

Cambios:

- `/` mantiene la Carga Inicial visible de inmediato;
- la ruta de carga ahora precarga `coverIntroCritical`;
- la navegación a Portada ocurre cuando se cumplen:

```txt
duración mínima de carga + coverIntroCritical listo o fallback
```

`/carga` sigue siendo pantalla de revisión sin navegación automática.

### Portada / Intro

Ruta:

```txt
/portada
```

Cambios:

- usa `coverIntroCritical`;
- oculta visualmente el stage hasta que el bundle crítico esté listo o entre en fallback;
- precarga `transitionRootCritical` en segundo plano;
- al abrir Portal I, conserva la demora visual aprobada y solo navega cuando la transición crítica está lista o entra en fallback.

No se cambió el diálogo, los portales, Lía ni la coreografía aprobada.

### Transición entre mundos

Ruta:

```txt
/transition/intro-to-station-1
```

Cambios:

- usa `transitionRootCritical` para primer frame estable;
- en modo runtime precarga `world1RootInitial`;
- no llama `onComplete` hasta que termine la duración de transición y el bundle inicial de Mundo I esté listo o en fallback.

No se modificó duración, textos, animaciones, sparkles ni composición.

### Mundo I: Raíz

Ruta:

```txt
/estacion/1
```

Cambios:

- usa `world1RootInitial` antes de revelar visualmente la composición completa;
- precarga `world1RootRelation` desde el estado intro;
- precarga `world1RootPerception` al activar RELACIÓN;
- precarga `world1RootMediation` al activar PERCEPCIÓN;
- precarga `world1RootReady` al activar MEDIACIÓN.

No se alteró la secuencia:

```txt
intro -> RELACIÓN -> PERCEPCIÓN -> MEDIACIÓN -> ready_to_continue
```

No se habilitó navegación de salida.

## 5. Política de timeout/error

Timeouts usados:

- Carga Inicial -> Portada: `9000ms`.
- Portada -> Transición: `9000ms`.
- Transición crítica: `8000ms`.
- Transición -> Mundo I: `9000ms`.
- Mundo I inicial: `9000ms`.
- Estados internos de Mundo I: `8000ms`.

Si un asset falla o vence timeout:

- el estado interno registra `error` o `timeout`;
- se permite continuar con fallback controlado;
- en desarrollo se emite `console.warn`;
- no se muestra error técnico al visitante.

## 6. Qué cambió en Carga Inicial

- Se agregó metadata `data-preload-target`, `data-preload-status` y `data-preload-progress`.
- La ruta `/` usa la Carga Inicial como compuerta ligera hacia Portada.
- No se cambió la duración visual normal de la pantalla.
- No se rediseñó la barra.

## 7. Qué cambió en Portada

- Se agregó compuerta visual mínima para `coverIntroCritical`.
- Se agregó preload anticipado de `transitionRootCritical`.
- La apertura de Portal I ahora espera transición crítica lista o fallback.
- No se cambiaron textos, estados, diálogos, assets ni rutas visibles.

## 8. Qué cambió en Transición

- Se agregó compuerta de assets críticos de transición.
- En runtime se precarga `world1RootInitial` antes de llamar `onComplete`.
- La duración de transición sigue siendo la configurada en la pantalla.

## 9. Qué cambió en Mundo I

- Se agregó compuerta para `world1RootInitial`.
- Se agregaron preloads escalonados por estado conceptual.
- La interacción secuencial existente se mantiene intacta.
- El botón `Continuar` sigue sin navegación real.

## 10. Validación mobile

Carpeta:

```txt
docs/gvo/performance/validation/004F1A/
```

Capturas generadas:

- `loading_390x844.png`
- `cover_390x844.png`
- `transition_390x844.png`
- `world1_intro_390x844.png`
- `world1_ready_390x844.png`

Métricas:

- `preload-metrics.json`

Viewports medidos:

- `360x800`
- `390x844`
- `430x932`

Resultado observado:

- Portada, Transición y Mundo I reportan `data-critical-assets-ready="true"` antes de captura.
- No hay imágenes incompletas en los estados medidos.
- No hay overflow horizontal.
- No hay audio.
- No hay video.
- No hay controles dev en runtime.

## 11. No implementado

- No se optimizaron imágenes.
- No se convirtieron PNG a WebP/AVIF.
- No se agregaron assets.
- No se agregaron dependencias.
- No se agregaron animaciones.
- No se implementó teletransporte.
- No se implementaron partículas.
- No se implementó root flow.
- No se implementó focus scaling.
- No se habilitó salida real de Mundo I.

## 12. Checks ejecutados

Resultado de cierre:

- `npm run lint`: OK.
- `npm run test`: OK, 8 archivos / 65 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run typecheck`: NO_DISPONIBLE como script separado.

Nota:

`npm run build` ejecuta `tsc -b` antes de `vite build`, por lo que TypeScript queda validado dentro del build. Vite mantiene la advertencia conocida de chunk mayor a 500 KB; no se corrige en este ticket.

## 13. Deudas pendientes

- Evaluar optimización WebP local para Portada y Mundo I en ticket separado.
- Añadir UI de progreso real de bundle si se decide elevar la pantalla de carga a compuerta explícita.
- Calibrar visualmente el camino de salida de Mundo I antes de conectar navegación.
- Medir en dispositivo físico dentro de la red local MikroTik.
