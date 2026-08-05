# GVO_FINAL_021P — Retorno/reset aprobados y fase Mirador completa

Fecha: `2026-08-05`

Estado: `GVO_FINAL_021P_MIRADOR_PHASE_PUBLISHED_AND_HANDOFF_COMPLETE`

```text
GATE 8 — REVISIT RETURN AND REAL RESET / HUMAN_APPROVED / COMPLETE
GVO FINAL — MIRADOR PHASE / COMPLETE
```

## Baseline y alcance

- Branch: `main`.
- HEAD previo: `aecaf32ff5d720cb6cf3c5a2ea9c3c2963021989`.
- `origin/main` local y `refs/heads/main` remoto: mismo SHA previo.
- Divergencia inicial: `0/0`.
- Worktree inicial: `28` paths exactos heredados de 021O.
- Paths inesperados/prohibidos iniciales: `0/0`.
- Staged inicial: `0`.
- No se ejecutó `fetch`.

021P no incorpora comportamiento funcional nuevo. Publica exactamente el
changeset técnico aprobado de 021O, registra la decisión humana, actualiza el
estado general y genera el handoff de la siguiente fase.

## Aprobación humana vinculante

El Ing. José David aprobó manualmente el resultado 021O:

```text
GVO_FINAL_021O_REVISIT_RETURN_AND_REAL_RESET
RETURN TO MIRADOR: HUMAN_APPROVED
REAL RESET: HUMAN_APPROVED
SNAPSHOT/ROLLBACK/RETRY: HUMAN_APPROVED
GATE 8: READY_TO_CLOSE
```

La aprobación cubre navigation state con respaldo de refresh en
`sessionStorage`, control global `Volver al Mirador`, invalidación segura del
contexto, reset selectivo, snapshot en memoria, eliminación y verificación,
rollback completo, copy condicionado a rollback verificado, retry con snapshot
nuevo, bloqueo de doble ejecución, accesibilidad, responsive y preservación de
composición y motion.

El acta 021O conserva su estado histórico `PENDING_HUMAN_REVIEW`. Este documento
es la autoridad posterior y no reescribe retrospectivamente ese registro.

## Revisita y retorno aprobados

Contrato:

```text
key: gvo.final.reviewContext.v1
version: 1
source preferred: React Router navigation state
refresh fallback: sessionStorage
```

Rutas envueltas sin cambiar contenido interno de los Mundos:

- `/estacion/1`.
- `/estacion/2`.
- `/estacion/3`.
- `/estacion/4`.
- `/estacion/5`.
- `/estacion/5/plantas`.
- `/estacion/5/sistema`.
- `/estacion/5/espacio`.
- `/estacion/5/visitante`.

El botón nativo usa los slots `FINAL_RETURN_TO_MIRADOR_BTN_01` y
`FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01`. Aparece sólo con contexto válido de
revisita, sobrevive refresh en la misma pestaña, desaparece en entrada directa,
limpia el contexto al volver y conserva el progreso global.

## Reset real aprobado

Allowlist exacta:

```text
localStorage:gvo.progress.v1
localStorage:gvo.station5.v1
localStorage:gvo.coverIntro.introCompleted.v1
sessionStorage:gvo.final.reviewContext.v1
```

Preserve exacto:

- preferencias de orientación y hints;
- accesibilidad, tema e idioma;
- Cache Storage y datos del service worker;
- configuración de plataforma;
- credenciales/tokens, si existieran;
- presets de desarrollo;
- cualquier dato no demostrado como recorrido.

La transacción toma un snapshot en memoria de backend, clave, existencia y valor
raw; verifica lectura estable, elimina sólo la allowlist y confirma ausencia. La
navegación con `replace` a `/portada` ocurre únicamente después de success. Ante
fallo se restaura y compara el snapshot raw; el copy de conservación sólo se
muestra después de rollback completo y verificado. Retry crea una operación y
snapshot nuevos. El guard UI bloquea doble ejecución.

No existen llamadas runtime a `localStorage.clear()`,
`sessionStorage.clear()`, borrado global de IndexedDB ni borrado global de Cache
Storage.

## Estados y accesibilidad

- State machine: `idle / confirm / busy / error / success`.
- Confirmación: foco inicial seguro en Cancelar.
- Cancelación: foco restituido al trigger Reiniciar recorrido.
- Busy: `aria-busy=true`, live region y acciones deshabilitadas.
- Error verificable: foco en Reintentar y copy de conservación aprobado.
- Rollback no verificable: sin copy engañoso y flag
  `GVO_FINAL_021O_ROLLBACK_COPY_GAP`.
- Targets: `>=44×44 px`; teclado y touch mediante botones nativos.
- Reduced motion: conserva toda la lógica con Lía estática.

## Evidencia y pruebas

La evidencia reproducible aprobada permanece en:

```text
docs/visual/final/021o-revisit-reset/
```

Conteo: `15` archivos — 4 capturas de retorno, 7 de reset, 2 contact sheets y
2 JSON de métricas. Los JSON redactan valores de storage y no contienen
secretos ni credenciales.

Validación de publicación:

- Review context + layout + reset + FinalRoot + router + motion focal:
  `39/39 PASS` en `6/6` archivos.
- Registry/assets/editorial focal: `13/13 PASS`.
- Suite global: `332/332 PASS` en `30/30` archivos.
- TypeScript: PASS.
- ESLint: PASS.
- Prettier focalizado: PASS.
- Build/PWA: PASS; `600` módulos y `278` entradas de precache.
- Auditoría de assets: PASS; sin URL externa, CDN ni audio.
- Chromium de publicación fresco: portrait/landscape, retorno, refresh, entrada
  directa, confirm/cancel, reset real, guard post-reset y reduced motion: PASS.
- Failure/rollback/retry: evidencia Chromium 021O aprobada preservada y tests
  deterministas frescos de inyección de fallos: PASS.
- Visibility handling: PASS.
- Consola estándar: errores `0`, warnings `0`.
- Requests/URLs externas runtime: `0`.
- Storage diff allowlist/preserve redactado: PASS.
- `git diff --check`: PASS.
- Auditoría final de paths: PASS.

Warnings aceptados: únicamente el chunk principal mayor de 500 kB y el reporte
histórico de tiempos de plugins de Vite.

## Integridad del alcance

- Mundos I–V modificados internamente: `0`.
- Assets/binarios, `current-used` y production sources modificados: `0`.
- Copy editorial, CSV/XLSX y matrices narrativas modificados: `0`.
- Portada visual y transiciones visuales modificadas: `0`.
- Service worker, PWA config y `vite.config.ts` modificados: `0`.
- Timings/layout de `FinalLiaMotion` modificados por 021O/021P: `0`.
- Dependencias nuevas: `0`.

## Gates y cierre del Mirador

```text
GATE 5 — ASSETS PRODUCED_AND_APPROVED / COMPLETE
GATE 6 — STATIC COMPOSITION / HUMAN_APPROVED / COMPLETE
GATE 7 — LIA MOTION / HUMAN_APPROVED / COMPLETE
GATE 8 — REVISIT RETURN AND REAL RESET / HUMAN_APPROVED / COMPLETE
GVO FINAL — MIRADOR PHASE / COMPLETE
```

La fase completa incluye preproducción, dirección visual, assets, copy,
composición portrait/landscape, motion de Lía, reduced motion, revisita,
retorno, reset real, pruebas, evidencia y publicación.

## Documentación y handoff

- Cierre general: `docs/status/GVO_FINAL_MIRADOR_PHASE_COMPLETE.md`.
- Estado canónico: `docs/status/CURRENT_STATE.md`.
- Handoff autoritativo:
  `docs/handoffs/GVO_PROJECT_DEBT_CORRECTION_HANDOFF.txt`.
- Copia byte-idéntica:
  `C:\Users\JOSE DAVID\Downloads\GVO_PROJECT_DEBT_CORRECTION_HANDOFF.txt`.
- Encoding: UTF-8 sin BOM.
- Line endings: LF.

## Publicación Git

- Commit único: `feat(final): publish revisit return and real reset`.
- SHA publicado dentro del mismo changeset: `SELF`.
- Push directo: `origin/main`.
- Estado posterior requerido y verificado: `HEAD == origin/main == remote`,
  divergencia `0/0` y worktree limpio.

## Deudas transferidas

El cierre no declara terminado todo GVO. La fase `PROJECT DEBT CORRECTION`
recibe consistencia transversal de progreso, persistencia versionada, hidratación
antes de guards, recuperación tras reload/reconexión, continuidad offline-first,
fullscreen, auditoría de Mundos I–V, optimización del chunk principal y revisión
del reporte de plugin timings.

Primera acción:

```text
GVO_DEBT_001_PROJECT_DEBT_AUDIT_AND_PRIORITIZATION
```

Su alcance es inventario, evidencia, dependencias, riesgo, prioridad y roadmap;
no implementación masiva.
