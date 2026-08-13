# GVO_DEBT_009ABP — Aprobación humana y publicación de estabilidad del smoke QR

## 1. Identidad y autoridad

| Campo             | Valor                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| Proyecto          | GVO — Guía Virtual OKÚA                                                                            |
| Fase              | `PROJECT DEBT CORRECTION`                                                                          |
| Fecha             | 2026-08-13 (`America/Bogota`)                                                                      |
| Baseline          | `04eb2e125e67f1634b261fa05905e5415bc19185`                                                         |
| Ticket publicado  | `GVO_DEBT_009AB`                                                                                   |
| Informe histórico | [GVO_DEBT_009AB_QR_SMOKE_STABILITY_FOR_REVIEW.md](GVO_DEBT_009AB_QR_SMOKE_STABILITY_FOR_REVIEW.md) |
| Autoridad humana  | Ing. José David                                                                                    |
| Estado humano     | `HUMAN_APPROVED`                                                                                   |
| SHA publicado     | `SELF`                                                                                             |

El informe técnico histórico de `GVO_DEBT_009AB` conserva el estado
`PENDING_HUMAN_REVIEW`. Esta acta posterior registra su SHA-256 publicado y la
aprobación humana vinculante de la reconciliación de estabilidad E2E.

`SELF` identifica el único commit que contiene la cadena aprobada
`GVO_DEBT_009` → `GVO_DEBT_009A` → `GVO_DEBT_009AB`, sus informes históricos,
esta acta y la actualización de `CURRENT_STATE.md`. Adquiere efecto de
publicación cuando ese mismo commit queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende la estabilización de los contratos E2E que
ejercitan el acceso inmersivo y QR:

- handoff Portada → Transición → Mundo I sincronizado mediante estados DOM
  observables;
- selectores acotados a la pantalla activa;
- espera explícita por los estados de preload y transición que preceden Mundo
  I;
- medición de revisita `GVO_DEBT_009` sincronizada cuando ambos controles de
  retorno están visibles;
- ejecución equivalente con movimiento normal y `prefers-reduced-motion`.

La delta de `GVO_DEBT_009AB` modifica únicamente pruebas E2E. No introduce
cambios de runtime, rutas, resolver, guards, progreso, persistencia ni assets.

## 3. Contratos preservados

La reconciliación conserva intactos los contratos publicados por sus tickets
padre:

- acceso inmersivo global compartido y restringido a las nueve rutas de
  estación autorizadas;
- `/qr/start` como entrada canónica a Portada;
- `/qr/w2`, `/qr/w3`, `/qr/w4` y `/qr/w5` sujetos a los guards de progreso
  existentes;
- ausencia deliberada de un QR para Mundo I;
- fallback seguro para identificadores QR desconocidos;
- resolver puro, sin escritura de progreso ni almacenamiento;
- contrato LAN futuro de resolución solamente, sin configurar Wi-Fi, cámara,
  escáner ni router.

Los hashes publicados de los informes históricos son:

| Informe histórico                                              | SHA-256                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `GVO_DEBT_009_IMMERSIVE_SHELL_AND_QR_NAVIGATION_FOR_REVIEW.md` | `f3a30822f528f81a67ce477c7147e482cb9ddb3a48968f5bce1d44aebc167ee5` |
| `GVO_DEBT_009A_PRODUCTION_QR_CONTRACT_ALIGNMENT_FOR_REVIEW.md` | `e56fe4caf750750b16c15e2d48fb85a9caec560469f8143ffe09edd44100f4d6` |
| `GVO_DEBT_009AB_QR_SMOKE_STABILITY_FOR_REVIEW.md`              | `67e423ea8b2077234bc467b5691de72fa63c9849478dd2dae1e093446e3b13ab` |

## 4. Evidencia técnica aprobada

| Validación                  | Resultado                                          |
| --------------------------- | -------------------------------------------------- |
| `npm run audit:assets`      | PASS — sin URLs externas, CDN ni audio             |
| `npm run lint`              | PASS                                               |
| `npm run test`              | PASS — 482/482 en 36 archivos                      |
| `npm run build`             | PASS — 608 módulos, PWA `generateSW`, 278 entradas |
| Smoke normal/reduced motion | PASS — 10/10                                       |
| Campaña DEBT009 + DEBT009A  | PASS — 34/34                                       |
| Revisita DEBT009            | PASS — 10/10                                       |
| Bloque combinado            | PASS — 26/26                                       |
| `npm run test:e2e`          | PASS — 141/141, un worker, 15,3 min, exit code `0` |
| `git diff --check`          | PASS                                               |

La suite integral cubre la navegación normal, reduced motion, acceso directo,
guards, revisita y la matriz QR de producción. Los fallbacks informativos de
preload reportaron `failed: 0`.

## 5. Resolución de la inestabilidad

La inestabilidad no provenía de rutas ni del runtime QR. Los fallos se
originaban en dos expectativas E2E que observaban elementos compartidos antes
de que su pantalla correspondiente estuviera activa:

1. el smoke de Portada podía intentar continuar antes de que Transición y sus
   preloads declararan el estado observable requerido;
2. la medición de revisita podía intersectar los controles antes de que ambos
   estuvieran visibles.

Las pruebas ahora esperan el estado real de cada pantalla y no dependen de
pausas fijas. Con ello se elimina la carrera sin relajar las aserciones
funcionales.

## 6. Warnings aceptados

- Build: chunk principal `818,39 kB`, superior al umbral informativo de
  `500 kB`.
- Build: warning informativo `PLUGIN_TIMINGS`.
- E2E: fallbacks de preload de Portada y Transición con `failed: 0`.
- Git: avisos informativos de normalización potencial LF→CRLF; el diff no
  contiene errores de whitespace.

## 7. Alcance preservado

- Runtime QR, rutas, resolver y guards: intactos por la delta `009AB`.
- Assets, manifests, mirrors `current-used` e identidad de Lía: intactos.
- Copy editorial FINAL: intacto.
- Checkpoints, progreso, persistencia y reset: intactos.
- Mirador y contexto de revisita: intactos.
- Dependencias, `package.json` y lockfile: intactos.
- Sin servicios externos, cámara, scanner, configuración Wi-Fi, MikroTik ni
  nuevas APIs.
- No se reescriben los informes históricos ni se declara terminada la fase
  completa `PROJECT DEBT CORRECTION`.

## 8. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_009AB — QR SMOKE STABILITY / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_009AB — QR SMOKE STABILITY / HUMAN_APPROVED / PUBLISHED
```
