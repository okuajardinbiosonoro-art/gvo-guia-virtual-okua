# GVO_DEBT_012P — Aprobación humana y publicación de la experiencia inicial

## 1. Identidad y autoridad

| Campo                   | Valor                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Proyecto                | GVO — Guía Virtual OKÚA                                                                                                          |
| Fase                    | `PROJECT DEBT CORRECTION`                                                                                                        |
| Fecha                   | 2026-08-13 (`America/Bogota`)                                                                                                    |
| Baseline                | `eb4761e22e2d85634e4aef75bb13a8862610fc69`                                                                                       |
| Ticket publicado        | `GVO_DEBT_012`                                                                                                                   |
| Informe histórico       | [GVO_DEBT_012_INITIAL_EXPERIENCE_LANGUAGE_AND_IMMERSIVE_ENTRY_FOR_REVIEW.md](GVO_DEBT_012_INITIAL_EXPERIENCE_LANGUAGE_AND_IMMERSIVE_ENTRY_FOR_REVIEW.md) |
| Decisión arquitectónica | [ADR-0006](../decisions/ADR-0006-entrada-inicial-idioma-y-fullscreen.md)                                                          |
| Autoridad humana        | Ing. José David                                                                                                                  |
| Estado humano           | `HUMAN_APPROVED`                                                                                                                 |
| SHA publicado           | `SELF`                                                                                                                           |

El informe histórico conserva el estado `PENDING_HUMAN_REVIEW` y su SHA-256
`90908d01ff2b2177a4c51e1bc84645303e4144d94d434b3fa52631d29e12c464`.
ADR-0006 permanece byte-idéntico con SHA-256
`60d68d48dd1a555af4b10a658a780f0f590127342253957330a2a0ed16d3b8bc`.
Esta acta posterior registra la aprobación humana vinculante sin reescribir
ninguno de esos documentos.

`SELF` identifica el único commit que contiene la implementación de
`GVO_DEBT_012`, el informe histórico, ADR-0006, esta acta y la actualización de
`CURRENT_STATE.md`. Adquiere efecto de publicación cuando ese mismo commit
queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende:

- `/inicio` como entrada inicial después de la Carga normal;
- selector explícito `Español / English`;
- persistencia local bajo `gvo.language.v1`;
- actualización coherente de `document.documentElement.lang`;
- fullscreen solicitado únicamente desde un gesto explícito;
- fallback no bloqueante ante API ausente, denegada o fallida;
- controles nativos, foco visible, teclado, touch y targets mínimos.

English localiza sólo la microinterfaz operacional de entrada. No se traduce,
reescribe ni duplica automáticamente el contenido editorial del recorrido.

## 3. Contrato visitante publicado

El contrato continúa siendo:

```text
QR → navegador → experiencia
```

La entrada normal queda:

```text
QR / navegador → Carga inicial → /inicio → Portada → recorrido
```

No se exige instalación, no se solicitan permisos adicionales y no se intenta
fullscreen al cargar, seleccionar idioma o iniciar navegación. `/carga`, las
entradas QR, el acceso directo a `/portada` y `/?resetIntro=1` conservan sus
contratos existentes.

## 4. Idioma, fullscreen y accesibilidad

- El idioma admite únicamente los valores cerrados `es | en`; cualquier valor
  corrupto o lectura bloqueada falla a español.
- La preferencia se aplica al elemento raíz al seleccionar, recargar o entrar
  directamente a una ruta.
- Si la escritura de `localStorage` falla, la selección queda disponible en
  memoria para la instancia y el visitante puede continuar.
- `gvo.language.v1` es una preferencia y sobrevive al reset pedagógico real.
- El CTA de recorrido permanece deshabilitado hasta elegir idioma.
- El botón fullscreen reutiliza el helper inmersivo compartido y sólo invoca la
  API desde su handler de activación.
- La ausencia o denegación de fullscreen informa el fallback y nunca bloquea
  el paso a Portada.
- `Enter`, `Space`, touch, `aria-pressed`, `aria-live`, `fieldset`, `legend` y
  foco inicial quedan cubiertos por pruebas.
- `prefers-reduced-motion` elimina transiciones no esenciales.

## 5. Evidencia técnica publicada

| Validación                     | Resultado                                                               |
| ------------------------------ | ----------------------------------------------------------------------- |
| `npm run audit:assets`         | PASS — sin URLs externas, CDN ni audio                                  |
| `npm run lint`                 | PASS                                                                    |
| `npm test`                     | PASS — 500/500 en 39 archivos                                           |
| `npm run build`                | PASS — PWA generada; 49 entradas / 14.817,03 KiB de precache            |
| E2E focal DEBT_012             | PASS — 6/6, un worker, 1,1 min                                          |
| `npm run test:e2e`             | PASS — 152/152, un worker, 17,5 min, exit code `0`                      |
| QA visual Pixel 5              | PASS — sin solapes ni overflow; controles de al menos `44×44 px`        |
| Integridad de datos del viaje  | PASS — progreso y checkpoints preservados byte a byte                   |
| `docs/visual`                  | 1.039 archivos, 352.510.118 bytes, sin diff                             |
| Assets, dependencias y lockfile | PASS — sin diff                                                         |
| `git diff --check`             | PASS                                                                    |

## 6. Trazabilidad del worktree acumulado

La implementación de `GVO_DEBT_012` se desarrolló sobre el mismo worktree que
ya contenía `GVO_DEBT_011`, ambos desde el baseline indicado. Esa condición es
la que produce la matriz aceptada de `500` pruebas unitarias y `152` E2E.

Esta aprobación se limita a `GVO_DEBT_012`: no confiere aprobación humana a
`GVO_DEBT_011`, cuyo informe conserva `PENDING_HUMAN_REVIEW`. Durante
`GVO_DEBT_012P` no se alteraron su runtime, sus pruebas, sus herramientas ni
ADR-0005. Sus registros permanecen byte-idénticos:

| Registro DEBT_011 | SHA-256 |
| ----------------- | ------- |
| Informe histórico | `d0d2b8841a697b4a3aec0867942d38ef9bfd45d30e1255a08cc8074337b7f12d` |
| ADR-0005          | `e752de11f9b067095782d910c20f39dfc586f5877ed68002f60120ed22220ce3` |

## 7. Warnings informativos aceptados

- Build: JS inicial de `534,74 kB`, superior al umbral informativo de
  `500 kB` y todavía separado de los siete chunks de ruta.
- Build: warning informativo `PLUGIN_TIMINGS`.
- E2E: fallbacks de preload por timeout con `failed: 0`; ninguna carga produjo
  error y las baterías focal e integral cerraron completas.
- Git: avisos informativos de normalización potencial LF→CRLF; el diff no
  contiene errores de whitespace.

## 8. Alcance preservado

- Progreso, checkpoints, records y completion: intactos.
- Reset: misma allowlist transaccional; idioma preservado como preferencia.
- QR y contrato de acceso de producción: intactos.
- PWA y estrategia de deploy/cache: intactas.
- Route chunking: sin delta durante esta publicación y sin cambio de estado
  humano para `GVO_DEBT_011`.
- Mirador, revisita y retorno: intactos.
- Assets canónicos, mirrors `current-used` e identidad de Lía: intactos.
- Dependencias, `package.json` y lockfile: intactos.
- `docs/visual`: intacto.
- Sin audio, video runtime, recursos externos ni permisos nuevos.
- La fase completa `PROJECT DEBT CORRECTION` no se declara terminada.

## 9. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_012 — INITIAL EXPERIENCE LANGUAGE AND IMMERSIVE ENTRY / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_012 — INITIAL EXPERIENCE LANGUAGE AND IMMERSIVE ENTRY / HUMAN_APPROVED / PUBLISHED
```
