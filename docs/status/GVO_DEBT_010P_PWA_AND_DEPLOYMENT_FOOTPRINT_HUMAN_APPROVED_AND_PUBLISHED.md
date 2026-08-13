# GVO_DEBT_010P — Aprobación humana y publicación del footprint PWA

## 1. Identidad y autoridad

| Campo                   | Valor                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Proyecto                | GVO — Guía Virtual OKÚA                                                                                            |
| Fase                    | `PROJECT DEBT CORRECTION`                                                                                          |
| Fecha                   | 2026-08-13 (`America/Bogota`)                                                                                      |
| Baseline                | `491775466f0afc96b1ae610e5adb565243e80893`                                                                         |
| Ticket publicado        | `GVO_DEBT_010`                                                                                                     |
| Informe histórico       | [GVO_DEBT_010_PWA_AND_DEPLOYMENT_FOOTPRINT_FOR_REVIEW.md](GVO_DEBT_010_PWA_AND_DEPLOYMENT_FOOTPRINT_FOR_REVIEW.md) |
| Decisión arquitectónica | [ADR-0004](../decisions/ADR-0004-pwa-precache-y-cache-runtime.md)                                                  |
| Autoridad humana        | Ing. José David                                                                                                    |
| Estado humano           | `HUMAN_APPROVED`                                                                                                   |
| SHA publicado           | `SELF`                                                                                                             |

El informe histórico conserva el estado `PENDING_HUMAN_REVIEW` y su SHA-256
`2c0e506ee534bb463447cb037f1c14ecf8f4055417a3de4ac1082feefc23ad05`.
ADR-0004 permanece byte-idéntico con SHA-256
`e9bcfb6e94b01d57ea7d85235418bf2b403d8896d2f16de652afc18189d28923`.
Esta acta posterior registra la aprobación humana vinculante sin reescribir
ninguno de esos documentos.

`SELF` identifica el único commit que contiene la implementación de
`GVO_DEBT_010`, el informe histórico, ADR-0004, esta acta y la actualización de
`CURRENT_STATE.md`. Adquiere efecto de publicación cuando ese mismo commit
queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende:

- reducción del artefacto `dist` de `247.700.044` a `120.234.304` bytes;
- reducción del precache de `278` a `49` entradas;
- clasificación de recursos A/B/C/D;
- precache limitado al primer acceso;
- cache runtime local para recursos de recorrido y estación;
- exclusión segura de mirrors y documentación no runtime únicamente desde
  `dist`;
- fallback de navegación, actualización y cleanup del service worker;
- verificadores reproducibles estático y de navegador.

Los archivos fuente excluidos del deploy se conservan en el repositorio. No se
aprueba la eliminación, conversión ni sustitución de assets canónicos.

## 3. Contrato visitante

El contrato publicado continúa siendo:

```text
QR → navegador → recorrido
```

El visitante no instala aplicaciones ni paquetes, no ve botones o instrucciones
de instalación y no configura red, cache ni permisos. La app opera desde el
servidor de la red LAN sin dependencias de Internet. El shell y los recursos ya
visitados cuentan además con disponibilidad desde cache.

No se declara que una estación nunca solicitada pueda abrirse después de perder
también el servidor LAN. La instalación/reapertura como PWA sigue sin
certificación de plataforma y no es requisito del recorrido.

## 4. Estrategia publicada

| Clase | Contenido                                                        | Estrategia                         |
| ----- | ---------------------------------------------------------------- | ---------------------------------- |
| A     | Shell, bundle, fuentes, icono, Carga inicial y Portada           | Precache                           |
| B     | Assets compartidos de Transición                                 | Deploy + cache runtime             |
| C     | Estaciones, Mirador, gestos y Lía compartida consumida           | Deploy + cache runtime             |
| D     | Mirrors, bibliotecas no consumidas y documentación bajo `public` | Fuente preservada; fuera de `dist` |

Workbox usa `StaleWhileRevalidate` para extensiones locales autorizadas bajo
`/assets/` y el mismo origen. El cache `gvo-runtime-assets-v1` conserva máximo
`256` entradas durante `30` días, acepta respuestas `0/200` y purga ante
presión de cuota. `/index.html` permanece como fallback de navegación,
`autoUpdate` se conserva y `cleanupOutdatedCaches` queda activo.

## 5. Métricas publicadas

| Métrica                             |      Before |             After |                        Delta |
| ----------------------------------- | ----------: | ----------------: | ---------------------------: |
| Archivos en `dist`                  |         518 |               257 |                         −261 |
| Tamaño de `dist`                    | 247.700.044 | 120.234.304 bytes | −127.465.740 bytes / −51,46% |
| Entradas de precache                |         278 |                49 |               −229 / −82,37% |
| Tamaño único de precache            | 133.691.842 |  15.761.044 bytes | −117.930.798 bytes / −88,21% |
| URLs duplicadas en precache         |           2 |                 0 |                           −2 |
| Grupos duplicados en `dist`         |         224 |                22 |                         −202 |
| Bytes extra por copias de contenido | 133.840.052 |   6.507.757 bytes |           −127.332.295 bytes |

Los duplicados restantes corresponden a consumidores runtime o contratos de
assets que este ticket no autoriza reescribir.

## 6. Evidencia técnica publicada

| Validación                          | Resultado                                                          |
| ----------------------------------- | ------------------------------------------------------------------ |
| `npm run audit:assets`              | PASS — sin URLs externas, CDN ni audio                             |
| `npm run lint`                      | PASS                                                               |
| `npm test`                          | PASS — 482/482 en 36 archivos                                      |
| `npm run build`                     | PASS — 608 módulos; 49 entradas / 15.390,89 KiB de precache        |
| Verificador estático PWA            | PASS                                                               |
| Probe del service worker            | PASS — shell offline y asset runtime `200` desde cache             |
| `npm run test:e2e`                  | PASS — 141/141, un worker, exit code `0`                           |
| Recorrido y QR                      | PASS dentro de la suite integral                                   |
| `docs/visual`                       | 1.039 archivos, 352.510.118 bytes, sin diff                        |
| Inventario SHA-256 de `docs/visual` | `6b569c6a4ed9db15523ea9e2c372d6d7b813dd44ec57b5b252268fdf1878a402` |
| `git diff --check`                  | PASS                                                               |

## 7. Warnings aceptados

- Build: chunk monolítico `818,39 kB`, superior al umbral informativo de
  `500 kB`.
- Build: warning informativo `PLUGIN_TIMINGS`.
- E2E: fallbacks de preload `coverIntroActivation` y `coverIntroCritical` por
  timeout, ambos con `failed: 0`.
- Git: avisos informativos de normalización potencial LF→CRLF; sin errores de
  whitespace.

Route chunking y lazy loading permanecen fuera de este alcance.

## 8. Alcance preservado

- Progreso, checkpoints, registros, revisita y reset: intactos.
- Mirador, Final y navegación: intactos.
- Rutas, resolver y guards QR: intactos.
- Assets canónicos, mirrors fuente e inventarios: intactos.
- Copy, composición e identidad de Lía: intactos.
- Dependencias, `package.json` y lockfile: intactos.
- Sin instalación obligatoria, botón instalar, permisos, audio, recursos
  externos ni configuración técnica para el visitante.
- `docs/visual`: intacto.
- La fase completa `PROJECT DEBT CORRECTION` no se declara terminada.

## 9. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_010 — PWA AND DEPLOYMENT FOOTPRINT / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_010 — PWA AND DEPLOYMENT FOOTPRINT / HUMAN_APPROVED / PUBLISHED
```
