# GVO_FINAL_021O — Retorno en revisita y reset real para revisión

Fecha: `2026-08-04`

Estado: `GVO_FINAL_021O_REVISIT_RETURN_AND_REAL_RESET_READY_FOR_HUMAN_REVIEW`

```text
GATE 8 = PENDING_HUMAN_REVIEW
```

## Baseline

- Branch: `main`.
- HEAD inicial: `aecaf32ff5d720cb6cf3c5a2ea9c3c2963021989`.
- `origin/main` local y `refs/heads/main` remoto: mismo SHA.
- Divergencia inicial: `0/0`.
- Worktree inicial: limpio.
- Staged inicial: `0`.
- No se ejecutó `fetch`.

## Auditoría de rutas

Rutas reales envueltas sin modificar el contenido interno de los Mundos:

- Mundo I: `/estacion/1`.
- Mundo II: `/estacion/2`.
- Mundo III: `/estacion/3`.
- Mundo IV: `/estacion/4`.
- Mundo V: `/estacion/5`, `/estacion/5/plantas`,
  `/estacion/5/sistema`, `/estacion/5/espacio` y
  `/estacion/5/visitante`.
- Final: `/final`, con el guard publicado intacto.
- Portada: `/portada`.
- Transiciones normales: seis rutas tipadas ya existentes; ahora invalidan
  cualquier revisita activa antes de continuar el recorrido normal.

No se fabricaron rutas ni subrutas. La ruta genérica `/estacion/:stationId` no
activa el control de retorno.

## Auditoría de storage

### localStorage runtime

| Clave                                 | Escritor/lector       | Alcance                           | Reset     |
| ------------------------------------- | --------------------- | --------------------------------- | --------- |
| `gvo.progress.v1`                     | `progress.storage.ts` | progreso global y guard de Final  | sí        |
| `gvo.station5.v1`                     | `world5Progress.ts`   | completion/checkpoints de Mundo V | sí        |
| `gvo.coverIntro.introCompleted.v1`    | `coverIntroState.ts`  | flag del recorrido de Portada     | sí        |
| `gvo-dev-world1-layout-calibrator-v2` | calibrador dev        | preset de plataforma/desarrollo   | preservar |

### sessionStorage runtime

| Clave/familia                           | Alcance                             | Reset     |
| --------------------------------------- | ----------------------------------- | --------- |
| `gvo.final.reviewContext.v1`            | contexto de revisita 021O           | sí        |
| `gvo:orientation-hint:dismissed`        | preferencia de orientación          | preservar |
| `gvo:world4:orientation-hint:dismissed` | preferencia de orientación Mundo IV | preservar |
| `gvo:world4:tap-hint:shown`             | hint de interfaz por sesión         | preservar |

- IndexedDB runtime en `src`: `NOT_FOUND`.
- Cookies runtime en `src`: `NOT_FOUND`.
- Cache Storage runtime en `src`: `NOT_FOUND`; el cache PWA generado se
  preserva y no se modificó su configuración.
- No se encontraron credenciales/tokens en las claves auditadas. Cualquier
  dato no demostrado como recorrido queda fuera de la allowlist.

## Contexto de revisita

Contrato explícito:

```ts
{
  origin: "/final",
  mode: "final-review",
  world: 1 | 2 | 3 | 4 | 5,
  startedAt: string,
  timestamp: number,
  version: 1,
}
```

- Navigation state de React Router es la fuente preferida.
- `sessionStorage` bajo `gvo.final.reviewContext.v1` permite refresh y
  continuidad por subrutas válidas del Mundo seleccionado.
- El contexto se invalida al volver al Mirador, entrar a Portada, tomar una
  transición normal, abrir otro Mundo, completar un reset o detectar
  corrupción/versión inválida.
- No usa `localStorage`.
- Storage bloqueado no impide la navegación con state; sólo elimina la
  capacidad de sobrevivir refresh en ese entorno.

## Control global de retorno

`FinalReviewModeLayout` envuelve las rutas reales I–V y agrega un botón nativo
fuera del contenido interno de cada Mundo únicamente durante revisita activa.

- Copy: `FINAL_RETURN_TO_MIRADOR_BTN_01`.
- Nombre accesible: `FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01`.
- Target medido: `163.3125×44 px` en portrait y landscape.
- Portrait: esquina inferior derecha con safe areas.
- Landscape: esquina superior derecha con safe areas.
- Una activación limpia el contexto y navega a `/final`.
- El progreso global permanece intacto; el guard de Final siguió abierto tras
  el retorno real de Mundo I.
- Entrada directa y flujo normal: control ausente.

## Política y transacción de reset

Allowlist tipada:

1. `localStorage:gvo.progress.v1`.
2. `localStorage:gvo.station5.v1`.
3. `localStorage:gvo.coverIntro.introCompleted.v1`.
4. `sessionStorage:gvo.final.reviewContext.v1`.

Preserve explícito:

- preferencias de orientación, hints, accesibilidad, tema e idioma;
- caches PWA y datos del service worker;
- configuración de plataforma y presets dev;
- credenciales/tokens si existieran;
- cualquier dato ajeno o no demostrado como recorrido.

`resetGvoJourney()`:

1. crea snapshot en memoria sólo de la allowlist;
2. guarda backend, clave, existencia y valor raw;
3. valida lectura estable/restaurabilidad;
4. elimina únicamente las cuatro claves;
5. verifica que las cuatro estén ausentes;
6. navega con `replace` a `/portada` sólo tras success;
7. ante fallo restaura todas las entradas y compara raw byte a byte.

No existen llamadas runtime a `localStorage.clear()`, `sessionStorage.clear()`,
`indexedDB.deleteDatabase()` ni borrado de Cache Storage.

## Estados, rollback y retry

State machine: `idle -> confirm -> busy -> success` o
`idle -> confirm -> busy -> error -> busy`.

- Busy publica `aria-busy=true`, live region prudente, copy
  `FINAL_RESTART_BUSY_01` y dos controles deshabilitados.
- Error sólo consume `FINAL_RESTART_ERROR_01` cuando snapshot, restauración y
  verificación completa confirman conservación.
- `FINAL_RESTART_RETRY_BTN_01` inicia una operación nueva con snapshot nuevo;
  no recarga la página y el guard UI evita doble ejecución.
- Fallos deterministas cubiertos: snapshot, eliminación, verificación y
  restauración.
- Si falla rollback no se muestra el copy de conservación, no se navega, se
  registra error técnico y el DOM expone
  `GVO_FINAL_021O_ROLLBACK_COPY_GAP`.
- No existe copy editorial alternativo aprobado para rollback no verificable;
  esa rama bloquea publicación y deliberadamente no inventa texto.

## Accesibilidad

- Al abrir confirmación, foco seguro en Cancelar.
- Al cancelar, foco vuelve al trigger Reiniciar recorrido.
- En error, foco pasa a Reintentar.
- Botones nativos operables por teclado y touch; targets `>=44×44`.
- No se declara modal accesible definitivo ni `aria-modal`; no se añadió un
  focus trap global fuera del ticket.
- Reduced motion conserva lógica de reset/retorno. Chromium verificó
  `reduced_static`, frame 1, greeting count 0 y timers 0.

## Integridad y regresión

- Composición estática 021L: preservada.
- Motion 021N: preservado; `FinalLiaMotion` focal `6/6 PASS`.
- Greeting, idle, reduced motion, visibility handling y cleanup: sin cambios.
- Accesos I–V: siguen siendo enlaces directos con una activación.
- Reinicio visual: mismo backplate, scrim, acciones y composición responsive;
  se añadieron sólo estados funcionales.
- Mundos modificados internamente: `0`.
- Assets modificados: `0`.
- Copy/CSV/XLSX modificados: `0`.
- Portada visual, transiciones visuales, service worker, PWA config,
  `vite.config.ts` y timings/layout de `FinalLiaMotion`: sin cambios.
- Dependencias nuevas: `0`.

## Evidencia

Carpeta:

```text
docs/visual/final/021o-revisit-reset/
```

Contiene `15` archivos:

- 4 screenshots de retorno;
- 7 screenshots de reset;
- 2 contact sheets;
- 2 JSON de métricas.

Busy/error visuales se capturaron mediante inyección QA determinista temporal
en desarrollo. La inyección quedó eliminada antes de las validaciones finales;
la lógica equivalente también está cubierta por dependencias inyectadas en
tests. La captura success corresponde a `resetGvoJourney()` real y fue seguida
por una comprobación real del guard: solicitar `/final` resolvió a
`/estacion/5` sin montar Final.

Los JSON no contienen valores de storage, secretos ni credenciales. La revisión
visual de ambas hojas de contacto confirmó ausencia de clipping y preservación
de la composición base.

## Validación

- Review context + layout + reset + FinalRoot + router + motion focal:
  `39/39 PASS` en `6/6` archivos.
- Registry/assets/editorial focal: `13/13 PASS`.
- Suite global: `332/332 PASS` en `30/30` archivos.
- TypeScript: `PASS`.
- ESLint: `PASS`.
- Prettier focalizado: `PASS`.
- Build/PWA: `PASS`; `600` módulos y `278` entradas de precache.
- Auditoría de assets: `PASS`; sin URLs externas, CDN ni audio.
- Chromium return portrait/landscape: `PASS`.
- Refresh, retorno, entrada directa y guard post-reset: `PASS`.
- Reset confirm/busy/error/retry/success: `PASS`.
- Rollback y copy condicionado: `PASS` por fallos inyectados.
- Reduced motion Chromium: `PASS`.
- Visibility handling: `PASS` por prueba focal publicada y vigente.
- Consola limpia estándar: errores `0`, warnings `0`.
- URLs DOM externas estándar: `0`.
- Storage diff allowlist/preserve: `PASS` por backend instrumentado; valores
  redactados.
- Warnings aceptados: sólo chunk principal mayor de 500 kB y reporte histórico
  de tiempos de plugins de Vite.

## Git y cierre técnico

- No se ejecutó `git add`, `git commit` ni `git push`.
- Staged requerido: `0`.
- HEAD requerido: `aecaf32ff5d720cb6cf3c5a2ea9c3c2963021989`.
- Worktree: `28` paths, todos permitidos de 021O.
- Unexpected paths: `0`.
- Prohibited paths: `0`.

## Gate 8

```text
GATE 8 = PENDING_HUMAN_REVIEW
```

Este ticket no declara persistencia transversal, offline-first, fullscreen ni
cierre final completo. No publica ni inicia esos frentes.
