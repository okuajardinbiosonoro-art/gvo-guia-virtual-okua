# GVO_DEBT_005 — World II Checkpoint Continuity

**Estado:** `PENDING_HUMAN_REVIEW`  
**Flag:** `GVO_DEBT_005_IMPLEMENTATION_COMPLETE_FOR_REVIEW`  
**Fecha:** 2026-08-05 (`America/Bogota`)  
**Naturaleza:** implementación funcional para revisión humana; no constituye aprobación ni publicación.

## 1. Baseline

| Campo | Valor verificado |
| --- | --- |
| Repositorio | `E:/OKUA/04_DESARROLLO_REPOS/gvo-guia-virtual-okua` |
| Rama | `main` |
| `HEAD` | `6a63ea35c07621452aefb268104c31c9d50107bf` |
| Subject | `fix(checkpoints): publish world1 and world4 continuity` |
| `origin/main` | `6a63ea35c07621452aefb268104c31c9d50107bf` |
| Remoto `refs/heads/main` | `6a63ea35c07621452aefb268104c31c9d50107bf` |
| Divergencia | `0 0` |
| Worktree inicial | limpio |
| URL `origin` | `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git` |
| `git fetch` | no ejecutado |

El preflight se ejecutó en el orden literal del ticket. La única consulta de
red fue `git ls-remote --heads origin refs/heads/main`.

## 2. Arquitectura anterior

Mundo II mantenía en estados React la capa activa, capas visitadas, máximo
desbloqueado, interacciones requeridas, Captura, Mapeo y Resultado. Sólo el CTA
`Continuar` escribía completion global mediante `markStationCompleted(2)`.
Reload, reapertura y revisita desde Final reconstruían la pantalla desde
`planta_viva`; los paneles temporizados declaraban completion local antes de
que existiera una persistencia durable.

La implementación reutiliza la autoridad común
`src/domain/checkpoints/checkpointStore.ts`; no crea un segundo store ni cambia
el schema de `gvo.progress.v1`.

## 3. Key y schema

Key nueva exacta:

```text
localStorage:gvo.station2.v1
```

Autoridad: `src/domain/checkpoints/world2Checkpoint.ts`.

```ts
type World2CheckpointV1 = {
  schemaVersion: 1;
  activeLayerId: World2LayerId;
  visitedLayerIds: World2LayerId[];
  highestUnlockedLayerOrder: 1 | 2 | 3 | 4 | 5 | 6;
  completedRequiredInteractions: RequiredInteractionId[];
  capture: {
    currentStepId: CaptureTimelineStepId;
    visitedStepIds: CaptureTimelineStepId[];
  };
  mappingFirstRunComplete: boolean;
  resultState:
    | "not_started"
    | "convergence_pending"
    | "ready_to_continue";
  updatedAt: string;
};
```

No se serializan `journeyComplete`, readouts derivados, dismissal de hint,
índices de animación, revisiones visuales, fases sonoras ni timers.

## 4. Invariantes

- Orden canónico: `planta_viva → senal → captura → acondicionamiento → mapeo → resultado_mediado`.
- `visitedLayerIds` es un prefix exacto, ordenado y sin duplicados.
- La capa activa pertenece al prefix.
- `highestUnlockedLayerOrder === min(visited.length + 1, 6)`.
- Interacciones: contacto → onda medida → Captura completa.
- Los pasos de Captura forman el prefix `contact → signal → system`; no se
  admiten huecos y el paso actual debe estar visitado.
- Entrar a Señal requiere contacto; entrar a Captura requiere onda medida;
  entrar a Acondicionamiento requiere Captura completa.
- `mappingFirstRunComplete` requiere Mapeo visitado, tres interacciones y
  Captura completa.
- Resultado queda gated hasta que la primera secuencia de Mapeo tenga
  completion durable.
- `convergence_pending` requiere Resultado visitado y Mapeo completo.
- `ready_to_continue` requiere las seis capas, las tres interacciones,
  Captura completa y Mapeo completo.
- El timestamp debe ser ISO canónico y el payload no acepta campos extra.

Un payload incoherente falla cerrado; no se rellenan huecos ni se inventan
interacciones.

## 5. Lectura, corrupción y recovery

Estados de lectura reutilizados:

```text
empty
ok
corrupt
unknown_version
storage_unavailable
```

JSON corrupto, versión desconocida y shape inconsistente preservan el raw y no
se sobrescriben. `getItem`, `setItem` y `removeItem` que lanzan se convierten en
resultados tipados; ninguna excepción alcanza la UI.

Para `corrupt` y `unknown_version` la pantalla anuncia:

```text
No fue posible recuperar el avance de este mundo.
Restablecer avance de este mundo
```

La confirmación explícita elimina y verifica sólo `gvo.station2.v1`; conserva
completion global, W1, W4 y W5. Para `storage_unavailable`, la primera y única
acción destructiva no se ofrece: se muestra `Reintentar`.

## 6. Fresh y completion global

Fresh en memoria, sin escritura al montar:

```text
activeLayerId = planta_viva
visitedLayerIds = [planta_viva]
highestUnlockedLayerOrder = 2
completedRequiredInteractions = []
capture.currentStepId = contact
capture.visitedStepIds = [contact]
mappingFirstRunComplete = false
resultState = not_started
```

Si `gvo.progress.v1` ya contiene Mundo II, completion global prevalece: se
restauran seis capas, tres interacciones, Captura, Mapeo y Resultado ready. Una
capa activa válida del checkpoint se conserva; sin checkpoint se usa
`resultado_mediado`. No se escribe al montar y no se degrada completion.

## 7. Capas e interacciones estables

Cada interacción o selección estable construye el checkpoint siguiente,
escribe, relee y verifica antes de aplicar estado React. Una capa locked o gated
no escribe. Volver atrás sólo cambia `activeLayerId`; visited y highest nunca
disminuyen.

- Planta: el readout sólo expande tras persistir
  `plant_contact_readout_seen`.
- Señal: seleccionar la capa no revela la onda; `Onda medida` persiste la
  interacción y luego expande el readout.
- Los readouts de Planta y Señal se derivan de interacciones completadas y se
  restauran expandidos.

## 8. Captura

Cada cambio válido persiste `currentStepId` y el prefix visitado. Elegir un paso
futuro saltando el orden no escribe ni cambia la UI. Volver a un paso visitado
cambia el actual sin reducir visited. El tercer paso agrega durablemente
`capture_data_readout_seen` y desbloquea Acondicionamiento. El estado del
`GestureHint` no se persiste.

## 9. Mapeo

El autoplay conserva exactamente `3200 ms × 3 = 9600 ms`.

- `mappingFirstRunComplete = false`: cada montaje/reload empieza en la primera
  relación; no hay índice, timer ni revision en storage.
- Al terminar, la escena permanece en la tercera relación mientras se persiste
  y verifica completion.
- Sólo después de PASS se habilita review y Resultado.
- Si la escritura falla, review queda bloqueado; retry guarda únicamente la
  completion sin repetir los 9,6 segundos durante ese montaje.
- `mappingFirstRunComplete = true` restaura la relación final y review libre.

## 10. Resultado mediado

Los tiempos permanecen exactamente `2100/4200/6300/9000 ms`.

- `not_started`: Resultado aún no se ha alcanzado.
- Seleccionar Resultado persiste primero `convergence_pending`; sólo después
  monta la convergencia.
- Un reload pending reinicia en `intensity`; no restaura `rhythm`, `pitch` ni
  timers parciales.
- Al finalizar, se persiste y verifica `ready_to_continue`; sólo después se
  activan `journeyComplete`, `sonicConvergenceComplete` y el CTA.
- Ante fallo, la escena puede quedar resuelta, pero el CTA permanece bloqueado;
  retry no repite la secuencia durante ese montaje.
- Ready se restaura resuelto y no repite convergencia.

## 11. Completion global y revisita

Completion global continúa ocurriendo exclusivamente desde `Continuar`. El CTA
comprueba que exista un checkpoint ready; si global completion preexistía sin
checkpoint, crea y verifica el ready sólo al activar el CTA. Después ejecuta
`markStationCompleted(2)`, verifica y navega. Un fallo global conserva el
checkpoint final, enfoca retry y no repite Mapeo o Resultado.

Reload, reapertura en nueva pestaña y revisita desde Final restauran active,
prefix, gates, Captura, Mapeo y Resultado. El checkpoint se conserva después de
completion para recordar la capa activa de revisión.

## 12. Error, retry, foco y doble clic

`PendingCheckpointAction` representa una sola acción:

```text
plant_interaction
layer_change
signal_interaction
capture_step
mapping_completion
result_completion
```

Un fallo mantiene la UI estable anterior, anuncia el copy operativo en el live
region y enfoca `Reintentar`. Retry repite únicamente la escritura pendiente y,
al pasar, enfoca el control lógico. Una segunda activación durante el pendiente
no escribe de nuevo y devuelve foco al retry. La acción pendiente, el foco y los
timers no se serializan.

## 13. Reset de siete keys

Allowlist final, en orden:

1. `localStorage:gvo.progress.v1` — `global-progress`.
2. `localStorage:gvo.station1.v1` — `world-one-state`.
3. `localStorage:gvo.station2.v1` — `world-two-state`.
4. `localStorage:gvo.station4.v1` — `world-four-state`.
5. `localStorage:gvo.station5.v1` — `world-five-state`.
6. `localStorage:gvo.coverIntro.introCompleted.v1` — `cover-completion`.
7. `sessionStorage:gvo.final.reviewContext.v1` — `final-review-context`.

La implementación transaccional genérica no cambió. Tests demuestran snapshot
de siete, success de siete, rollback completo, raw W2 válido/corrupto/unknown
byte-exacto, retry con snapshot nuevo y preservación de preferencias, hints y
familias ajenas. No existe `clear()` global ni key W3.

## 14. Estados estables y transitorios

| Persistidos | Reiniciados o derivados |
| --- | --- |
| active layer y prefix visitado | `journeyComplete` |
| highest unlocked | readouts Planta/Señal |
| interacciones requeridas | `captureTimelineInteracted` |
| current/visited de Captura | índices y revision de Mapeo |
| completion primera de Mapeo | timers Mapeo |
| `not_started/pending/ready` de Resultado | fase y timers de convergencia |
| timestamp ISO | focus, hints y pending action |

## 15. Paths creados

- `src/domain/checkpoints/world2Checkpoint.ts`
- `src/domain/checkpoints/world2Checkpoint.test.ts`
- `tests/e2e/gvo-debt-005-world2-checkpoint-continuity.spec.ts`
- `docs/status/GVO_DEBT_005_WORLD2_CHECKPOINT_CONTINUITY_FOR_REVIEW.md`

## 16. Paths modificados

- `src/app/reset/journeyResetPolicy.ts`
- `src/app/reset/resetGvoJourney.test.ts`
- `src/screens/World2Root/World2CaptureTimeline.tsx`
- `src/screens/World2Root/World2MappingPanel.tsx`
- `src/screens/World2Root/World2MappingPanel.test.tsx`
- `src/screens/World2Root/World2MediatedResultPanel.tsx`
- `src/screens/World2Root/World2RootScreen.tsx`
- `src/screens/World2Root/World2RootScreen.test.tsx`
- `tests/e2e/gvo-debt-002-progress-integrity.spec.ts`
- `tests/e2e/gvo-debt-004-world1-world4-checkpoint-continuity.spec.ts`

No se requirió un path fuera de la allowlist del ticket.

## 17. Unit e integración

`npm run test`:

```text
33 files passed
439 tests passed
0 failed
```

El store cubre empty, válido, corrupción, versión desconocida, IDs, prefix,
active/highest, orden de interacciones/Captura, Mapeo/Resultado, timestamp,
excepciones Web Storage, verification failure, idempotencia, remove verificado,
raw preservado y recovery sólo W2.

La integración de pantalla cubre fresh/no-write, readouts, selección de capas,
Captura, regreso a pasos, reload, Mapeo pending/complete/failure/retry, Resultado
pending/ready/failure/retry, completion global prevalente, recovery, storage
unavailable, doble clic, foco y preservación de máximos. Se usan fake timers en
unit; no hay esperas reales largas.

## 18. E2E focal

Comando:

```text
npx playwright test tests/e2e/gvo-debt-005-world2-checkpoint-continuity.spec.ts
```

Resultado final: `4/4 PASS`.

La spec recorre UI real para parcial/reload, Mapeo/Resultado, fallo/retry,
reapertura, revisita desde Final y reset real. Una corrida de desarrollo previa
detectó que el segundo click físico devolvía foco al control original; el
bloqueo se corrigió y tanto el caso focal aislado como la repetición completa
quedaron en PASS.

## 19. Suite completa

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS — sin URL externa, CDN ni audio |
| `npm run lint` | PASS |
| `npm run test` | PASS — 439/439 en 33 archivos |
| `npm run build` | PASS — PWA `generateSW` |
| E2E focal DEBT_005 | PASS — 4/4 |
| `npm run test:e2e` | PASS — 100/100 |
| `git diff --check` | PASS |

## 20. Read-only de la suite

Las huellas se tomaron inmediatamente antes y después de la validación
completa, antes de crear este informe:

- status before/after: idéntico, 10 tracked modificados y 3 untracked;
- manifest SHA-256 de los 13 paths before/after:
  `40D855719E3E8D2D4816D6D30A9B8E975A89A1114E23A753A3893D51E638FA5F`;
- diff binario tracked SHA-256 before/after:
  `9DEB85F7F8B63A94CD1341D8420A0AF1A0D7468857AEE375E24575568F69EDDF`;
- `docs/visual`: 1039 archivos before/after;
- manifest `docs/visual` SHA-256 before/after:
  `3881E0D70E8FD93448B2BDC3600F80F28E106A39CC39B53502F39707147D38E4`.

La suite normal sólo produjo outputs ignorados bajo `test-results`; no escribió
evidencia tracked ni alteró los archivos de implementación.

## 21. Visuales, assets y tiempos congelados

- Cero CSS modificado.
- Cero assets, manifests de assets o binarios modificados.
- Cero copy editorial aprobado modificado.
- DOM visual y composición existentes preservados; sólo se añadieron estados y
  controles operativos `TEMP` para error/recovery autorizados.
- Mapeo conserva `3200/6400/9600 ms`.
- Resultado conserva `2100/4200/6300/9000 ms`.
- Cero audio, CDN, servicios externos o permisos.

## 22. Warnings

- Build: chunk principal `808.78 kB` minificado, warning >500 kB ya conocido.
- Build: desglose informativo `PLUGIN_TIMINGS`.
- Git: avisos informativos LF→CRLF; `git diff --check` pasa.
- La primera corrida focal completa tuvo el hallazgo de foco descrito en §18;
  no permanece como fallo final.

## 23. Gaps

No quedan gaps dentro del alcance funcional de GVO_DEBT_005. No se declara
aprobación humana, publicación ni cierre de la fase global de deuda.

## 24. Riesgos residuales

- Web Storage puede quedar indisponible por política o cuota del navegador; el
  runtime falla cerrado y ofrece retry, pero no puede garantizar disponibilidad
  de plataforma.
- El copy operativo permanece `TEMP` por contrato.
- Legibilidad, Captura visual, reflow y safe-area de Mundo II continúan fuera de
  alcance; esta implementación no los agrava ni los declara resueltos.
- El warning de bundle/PWA y el coste de precache permanecen como deuda separada.

## 25. Alcance preservado

- W1: runtime intacto; sólo expectativas de reset históricas reconciliadas.
- W3: sin implementación ni key.
- W4: runtime intacto; sólo expectativas de reset históricas reconciliadas.
- W5, Final y Mirador: runtime intacto.
- Guards y schema global: intactos.
- CSS, visuales, assets, Lía, PWA, QR, dependencias y lockfile: intactos.
- `docs/visual/**`: intacto.
- `docs/status/CURRENT_STATE.md`: intacto.

## 26. Control Git y estado final

- Commit: no ejecutado.
- Push: no ejecutado.
- Pull Request: no creado.
- `git fetch`: no ejecutado.
- Stage: vacío; `git diff --cached --name-only` sin salida.
- Rama: `main`.
- Estado: `PENDING_HUMAN_REVIEW`.

`GVO_DEBT_005_IMPLEMENTATION_COMPLETE_FOR_REVIEW`
