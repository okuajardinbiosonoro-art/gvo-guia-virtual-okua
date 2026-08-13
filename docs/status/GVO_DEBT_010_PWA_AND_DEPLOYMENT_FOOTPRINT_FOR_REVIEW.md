# GVO_DEBT_010 — PWA and Deployment Footprint — Informe para revisión

## 1. Identidad

| Campo                | Valor                                      |
| -------------------- | ------------------------------------------ |
| Proyecto             | GVO — Guía Virtual OKÚA                    |
| Fase                 | `PROJECT DEBT CORRECTION`                  |
| Fecha                | 2026-08-13 (`America/Bogota`)              |
| Baseline obligatorio | `491775466f0afc96b1ae610e5adb565243e80893` |
| Rama                 | `main`                                     |
| Estado               | `PENDING_HUMAN_REVIEW`                     |

La implementación optimiza únicamente la estrategia PWA y el contenido del
artefacto generado. No cambia la experiencia, el bundle por rutas, la
navegación, el copy ni los assets canónicos.

## 2. Auditoría inicial

El build byte-idéntico del baseline produjo:

| Métrica                                 |                           Before |
| --------------------------------------- | -------------------------------: |
| Archivos en `dist`                      |                              518 |
| Tamaño de `dist`                        |                247.700.044 bytes |
| Entradas declaradas de precache         |                              278 |
| URLs únicas de precache                 |                              276 |
| Tamaño único de precache                |                133.691.842 bytes |
| Grupos de contenido duplicado en `dist` |                              224 |
| Archivos dentro de esos grupos          |                              495 |
| Bytes extra por copias de contenido     |                133.840.052 bytes |
| Mirror `dist/assets/gvo/current-used`   | 233 archivos / 113.957.960 bytes |

Dos URLs —icono y manifest— aparecían duplicadas en la declaración de
precache. Además, el deploy copiaba el mirror documental completo aunque
Workbox ya lo excluía del cache.

## 3. Clasificación de recursos

La auditoría inicial del precache quedó clasificada así:

| Clase | Responsabilidad                                                       | Entradas únicas | Bytes before | Estrategia after                   |
| ----- | --------------------------------------------------------------------- | --------------: | -----------: | ---------------------------------- |
| A     | Primer acceso: shell, bundle, fuentes, icono, Carga inicial y Portada |              49 |   15.761.044 | Precache                           |
| B     | Recorrido compartido: Transición                                      |              31 |    5.395.769 | Deploy + cache runtime             |
| C     | Estaciones, Mirador, gestos y Lía compartida consumida                |             175 |   99.049.999 | Deploy + cache runtime             |
| D     | Mirrors, bibliotecas no consumidas y documentación bajo `public`      |              21 |   13.485.030 | Fuente preservada; fuera de `dist` |

La clase D real del footprint incluía también los `233` archivos de
`current-used`, no precacheados pero sí copiados a `dist`. La lista cerrada de
exclusión cubre `261` archivos fuente y `127.449.270` bytes. Todos permanecen
en `public`; sólo se excluyen del resultado de build.

## 4. Implementación

### 4.1 Precache crítico

`vite.config.ts` limita `globPatterns` a:

- `index.html`, `registerSW.js` y manifest/icono aportados por PWA;
- bundle JS, CSS y fuentes locales;
- Carga inicial;
- Portada.

El resultado contiene `49` entradas, todas únicas, presentes en `dist` y
pertenecientes a la clase A.

### 4.2 Cache runtime

Workbox registra `gvo-runtime-assets-v1` con:

- estrategia `StaleWhileRevalidate`;
- mismo origen y prefijo `/assets/` obligatorios;
- extensiones `json`, `png`, `svg`, `webp` y `woff2`;
- respuestas cacheables `0` y `200`;
- máximo `256` entradas;
- expiración de `30` días;
- purga ante presión de cuota.

El fallback de navegación continúa en `/index.html`. `autoUpdate` se conserva y
`cleanupOutdatedCaches` queda explícito. No se agrega UI de instalación ni se
solicitan permisos.

### 4.3 Footprint de despliegue

El plugin `gvo-exclude-nondeployable-public-artifacts` actúa durante
`writeBundle`, antes de que Workbox calcule el precache. Resuelve únicamente
rutas fijas bajo el directorio de salida, rechaza escapes de path y elimina
copias sólo dentro de `dist`.

Se conservan desplegados los seis paquetes canónicos de mundos/Mirador, los
assets compartidos realmente consumidos y los recursos de Transición. No se
mueve, edita, convierte ni elimina ningún archivo de `public`.

## 5. Resultado before/after

| Métrica                             |      Before |             After |                        Delta |
| ----------------------------------- | ----------: | ----------------: | ---------------------------: |
| Archivos en `dist`                  |         518 |               257 |                         −261 |
| Tamaño de `dist`                    | 247.700.044 | 120.234.304 bytes | −127.465.740 bytes / −51,46% |
| Entradas de precache                |         278 |                49 |               −229 / −82,37% |
| URLs únicas de precache             |         276 |                49 |                         −227 |
| Tamaño único de precache            | 133.691.842 |  15.761.044 bytes | −117.930.798 bytes / −88,21% |
| URLs duplicadas en precache         |           2 |                 0 |                           −2 |
| Grupos duplicados en `dist`         |         224 |                22 |                         −202 |
| Bytes extra por copias de contenido | 133.840.052 |   6.507.757 bytes |           −127.332.295 bytes |

Distribución final:

| Clase desplegada         | Archivos |      Bytes |
| ------------------------ | -------: | ---------: |
| A — primer acceso        |       49 | 15.761.044 |
| B — recorrido compartido |       31 |  5.395.769 |
| C — estación específica  |      175 | 99.049.999 |
| Infraestructura SW       |        2 |     27.492 |

Los `22` grupos duplicados restantes corresponden principalmente a Lía
compartida entre Portada, Mundo II/Mundo IV y el paquete canónico de Mundo V.
Se preservan porque sus rutas son consumidores runtime o contratos de assets;
no se reescriben imports ni se sustituyen assets en este ticket.

## 6. Validación de service worker y disponibilidad local

El verificador estático confirma:

- build presente y menor de `130 MiB`;
- precache menor de `25 MiB`;
- cero URLs duplicadas, faltantes o fuera de clase A;
- clase D ausente de `dist` y completa en `public`;
- assets representativos de Mundo I–V y Mirador desplegados;
- cache runtime, matcher local, fallback y cleanup presentes en `sw.js`.

El probe de navegador sobre `vite preview` confirmó:

| Prueba                          | Resultado                                  |
| ------------------------------- | ------------------------------------------ |
| Controlador activo              | `http://127.0.0.1:4175/sw.js`              |
| Reload del shell sin red        | PASS                                       |
| Asset Mundo I solicitado online | `200`, incorporado a runtime cache         |
| Mismo asset con red desactivada | `200`, 2.127.097 bytes desde cache         |
| Caches observados               | precache Workbox + `gvo-runtime-assets-v1` |

El contrato “sin Internet” significa que el recorrido opera desde el servidor
de la red LAN sin dependencias externas. Los recursos B/C ya visitados además
quedan disponibles desde cache. No se declara disponible sin servidor LAN una
estación que nunca fue solicitada.

## 7. Validaciones completas

| Validación                                     | Resultado                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `npm run audit:assets`                         | PASS — sin URLs externas, CDN ni audio                                          |
| `npm run lint`                                 | PASS                                                                            |
| `npm test`                                     | PASS — 482/482 en 36 archivos                                                   |
| `npm run build`                                | PASS — 608 módulos; 49 entradas / 15.390,89 KiB de precache                     |
| `node tools/qa/gvo_debt_010_verify_pwa.mjs`    | PASS                                                                            |
| `node tools/qa/gvo_debt_010_browser_probe.mjs` | PASS sobre preview de producción                                                |
| `npm run test:e2e`                             | PASS — 141/141, un worker, 14,5 min, exit code `0`                              |
| Recorrido y QR                                 | PASS dentro de la suite integral                                                |
| `docs/visual`                                  | 1.039 archivos, 352.510.118 bytes, sin diff                                     |
| Inventario SHA-256 de `docs/visual`            | `6b569c6a4ed9db15523ea9e2c372d6d7b813dd44ec57b5b252268fdf1878a402` before/after |
| `git diff --check`                             | PASS                                                                            |

## 8. Warnings y límites

- Build: chunk monolítico `818,39 kB`, superior al umbral informativo de
  `500 kB`. Route chunking y lazy loading están expresamente fuera de alcance.
- Build: warning informativo `PLUGIN_TIMINGS`.
- E2E: fallbacks de preload `coverIntroActivation` y `coverIntroCritical` por
  timeout, ambos con `failed: 0`; la suite cerró `141/141`.
- La instalación/reapertura como PWA no se declara certificada; el ticket no
  exige instalación al visitante.

Incidencias resueltas durante la ejecución:

- La primera compilación focal se detuvo con `TS7016` porque el helper `.mjs`
  no tenía declaración de tipos; `exclude-nondeployable-public.d.mts` resolvió
  el contrato y las compilaciones posteriores pasaron.
- El primer probe reveló que un `fetch` programático no declaraba
  `request.destination=image`; el matcher se acotó por mismo origen, prefijo y
  extensiones locales. El probe final confirmó cache y respuesta offline.

## 9. Archivos del ticket

- `vite.config.ts`: precache crítico, runtime caching y cleanup.
- `tools/vite/exclude-nondeployable-public.mjs`: exclusión segura de clase D.
- `tools/vite/exclude-nondeployable-public.d.mts`: contrato TypeScript del
  plugin.
- `tools/qa/gvo_debt_010_verify_pwa.mjs`: auditoría estática reproducible.
- `tools/qa/gvo_debt_010_browser_probe.mjs`: probe real de SW/cache/offline.
- `docs/decisions/ADR-0004-pwa-precache-y-cache-runtime.md`: decisión
  arquitectónica.
- `docs/05_ARQUITECTURA_TECNICA.md`: arquitectura PWA vigente.
- Este informe.

## 10. Alcance preservado

- Progreso, checkpoints, registros, revisita y reset: intactos.
- Mirador y Final: intactos.
- Rutas, resolver y guards QR: intactos.
- Assets canónicos, mirrors fuente e inventarios: intactos.
- Copy, composición, identidad de Lía y navegación: intactos.
- Dependencias, `package.json` y lockfile: intactos.
- Sin route chunking, lazy loading, instalación obligatoria, permisos, audio ni
  recursos externos.
- `docs/visual`: intacto.

## 11. Estado

```text
GVO_DEBT_010 — PWA AND DEPLOYMENT FOOTPRINT / IMPLEMENTATION_COMPLETE / PENDING_HUMAN_REVIEW
```

Sin commit, sin push y sin Pull Request.
