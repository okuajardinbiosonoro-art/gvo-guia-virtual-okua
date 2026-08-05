# GVO_DEBT_001 — Auditoría y priorización de deuda del proyecto

**Estado:** `PENDING_HUMAN_REVIEW`  
**Flag de ejecución:** `GVO_DEBT_001_AUDIT_COMPLETE`  
**Fecha de auditoría:** 2026-08-05 (`America/Bogota`)  
**Naturaleza:** auditoría técnica y visual en solo lectura; este documento no constituye aprobación humana, publicación ni autorización de implementación.

## 1. Encabezado y estado

La fase Mirador permanece `COMPLETE` según sus actas vigentes. Esta auditoría no reabre Gates 5–8 ni cambia el estado de ninguna pantalla. El resultado queda pendiente de revisión humana por el Ing. José David.

## 2. Baseline verificado

| Campo | Valor verificado |
|---|---|
| Repositorio | `E:/OKUA/04_DESARROLLO_REPOS/gvo-guia-virtual-okua` |
| Rama | `main` |
| `HEAD` | `e70ac6b13c33a271e60750df4931826bf30c05a4` |
| Subject | `feat(final): publish revisit return and real reset` |
| `origin/main` | `e70ac6b13c33a271e60750df4931826bf30c05a4` |
| Remoto publicado | `e70ac6b13c33a271e60750df4931826bf30c05a4` |
| URL de `origin` | `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git` |
| Divergencia `HEAD...origin/main` | `0 0` |
| Worktree inicial | limpio |
| `git fetch` | no ejecutado |

El baseline coincide exactamente con el autorizado por el ticket.

## 3. Comandos de preflight y resultados

Se ejecutaron, en el orden exigido:

```text
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git log -1 --pretty='%H%n%s'
git remote get-url origin
git status --short
git rev-parse origin/main
git rev-list --left-right --count HEAD...origin/main
git ls-remote --heads origin refs/heads/main
```

Resultados: root correcto; rama `main`; tres referencias Git en el SHA autorizado; subject y remoto exactos; divergencia `0 0`; salida vacía de `git status --short`. La única consulta de red fue `git ls-remote --heads origin refs/heads/main`.

El archivo autorizado no existía antes de la auditoría. No se detectó evidencia desconocida que obligara a detener el ticket.

## 4. Documentos autoritativos leídos

1. `docs/status/CURRENT_STATE.md`
2. `docs/status/GVO_FINAL_021P_REVISIT_RESET_HUMAN_APPROVED_AND_MIRADOR_PHASE_COMPLETE.md`
3. `docs/status/GVO_FINAL_MIRADOR_PHASE_COMPLETE.md`
4. `docs/handoffs/GVO_PROJECT_DEBT_CORRECTION_HANDOFF.txt`
5. `docs/assets/ASSET_INVENTORY.md`
6. `docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md`
7. `docs/status/GVO_FINAL_021I_APPROVED_ASSET_REGISTRATION_AND_GATE5_CLOSEOUT.md`
8. `docs/status/GVO_FINAL_021L_STATIC_COMPOSITION_HUMAN_APPROVED_AND_PUBLISHED.md`
9. `docs/status/GVO_FINAL_021N_LIA_MOTION_HUMAN_APPROVED_AND_PUBLISHED.md`
10. `docs/status/GVO_FINAL_021O_REVISIT_RETURN_AND_REAL_RESET_FOR_REVIEW.md`

También se leyó `public/assets/gvo/current-used/README.md`, obligatorio por la política de assets runtime. Se respetó que 021O es evidencia histórica `PENDING_HUMAN_REVIEW` y que 021P es el cierre vinculante posterior.

## 5. Mapa de arquitectura de progreso

| Capa | Fuente real | Símbolos | Observación |
|---|---|---|---|
| Progreso global | `localStorage:gvo.progress.v1` | `GvoProgress`, `readProgress`, `writeProgress`, `markStationCompleted`, `canOpenStation`, `canOpenFinal` | Sólo contiene `completedStations` y `updatedAt`; no tiene `schemaVersion`. |
| Portada | `localStorage:gvo.coverIntro.introCompleted.v1` | `readCoverIntroCompleted`, `persistCoverIntroCompleted` | Booleano textual; conveniencia, no guard. |
| Mundo I | memoria React | `activeConcept`, `dismissedNarrativeHints` | No escribe progreso parcial ni completion global. |
| Mundo II | memoria React | `activeLayerId`, `visitedLayerIds`, `highestUnlockedLayerOrder`, `completedRequiredInteractions`, `journeyComplete` | No escribe progreso parcial ni completion global. |
| Mundo III | memoria React | `phase`, `completed`, `stampStage`, estados narrativos | `Guardar registro` cambia memoria; no existe backend durable. |
| Mundo IV | memoria React + completion global | `persistedRevisit`, `progress`, `markStationCompleted(4)` | Sólo restaura estación completamente cerrada; no checkpoints parciales. |
| Mundo V | `localStorage:gvo.station5.v1` + progreso global al cierre | `readWorld5Progress`, `completeWorld5Area`, `markStationCompleted(5)` | Prefijo canónico de cuatro áreas, verificación después de escritura y error UI. |
| Revisita desde Final | navigation state + `sessionStorage:gvo.final.reviewContext.v1` | `beginFinalReview`, `resolveFinalReviewContext`, `FinalReviewModeLayout` | Contexto versionado por pestaña; no es progreso del Mundo. |
| Reset | allowlist transaccional | `GVO_JOURNEY_RESET_ALLOWLIST`, `resetGvoJourney` | Elimina exactamente cuatro claves; preserva hints, caches y datos ajenos. |

Conclusión: no existe una fuente única de verdad para checkpoints. Hay una marca global incompleta, estados React no persistidos y un store especial robusto sólo para Mundo V.

La lectura de los guards actuales es síncrona. No existe hidratación asíncrona tardía que pueda sobrescribir estado nuevo; la hipótesis de una carrera de hidratación queda descartada en este baseline. El problema real es que faltan guards conectados y faltan escrituras/checkpoints.

## 6. Inventario de storage keys y schemas

| Backend/key | Schema y validación | Escrituras | Corrupción/error | Reset |
|---|---|---|---|---|
| `localStorage:gvo.progress.v1` | `{completedStations: StationId[], updatedAt: string|null}`; normaliza IDs y duplicados; sin versión | inmediata, al completar Mundo IV o cerrar Mundo V | JSON corrupto retorna vacío; `getItem` y `setItem` pueden lanzar | elimina |
| `localStorage:gvo.station5.v1` | `{schemaVersion:1, completedAreas, updatedAt}`; fuerza prefijo `plantas→sistema→espacio→visitante` | inmediata y verificada por lectura | captura excepciones y falla cerrado; no rechaza explícitamente una versión suministrada distinta | elimina |
| `localStorage:gvo.coverIntro.introCompleted.v1` | string literal `"true"` | al terminar el diálogo | captura excepciones; fallback `false` | elimina |
| `sessionStorage:gvo.final.reviewContext.v1` | `origin`, `mode`, `world`, ISO, epoch, `version:1` | al iniciar revisita | parse estricto, limpia payload inválido | elimina |
| `localStorage:gvo-dev-world1-layout-calibrator-v2` | presets de herramienta dev | sólo calibrador `/dev` | no es progreso principal | preserva |
| `sessionStorage:gvo:orientation-hint:dismissed` | flag `"1"` | dismiss de hint genérico | fallback en memoria | preserva |
| `sessionStorage:gvo:world4:orientation-hint:dismissed` | flag `"1"` | dismiss de hint Mundo IV | fallback en memoria | preserva |
| `sessionStorage:gvo:world4:tap-hint:shown` | flag `"1"` | hint mostrado | fallback en memoria | preserva |

No se encontraron IndexedDB, cookies ni Cache Storage usados como backend de progreso. Tampoco hay `fetch`, XHR, WebSocket, listeners `online`/`offline`, `pagehide` o `beforeunload` en runtime. Los listeners `visibilitychange` están limitados a motion/hints de Mundo IV y motion de Lía en Final.

## 7. Matriz de rutas, guards, redirects y revisitas

| Ruta | Componente | Guard/redirect actual | Entrada directa | Revisita Final |
|---|---|---|---|---|
| `/`, `/carga` | Loading | ninguno | permitida | invalida contexto |
| `/portada` | `CoverIntroScreen` | ninguno | permitida | invalida contexto |
| seis `/transition/...` | `TransitionWorldRuntimeRoute` | sólo W5→Final usa `requireFinalAccess` | las primeras cinco son directas | invalida contexto |
| `/estacion/1` | `World1RootScreen` | ninguno | permitida | sí, con overlay |
| `/estacion/2` | `World2RootScreen` | ninguno | permitida | sí, con overlay |
| `/estacion/3` | `World3RootScreen` | ninguno | permitida | sí, con overlay |
| `/estacion/4` | `World4RootScreen` | ninguno | permitida | sí, con overlay |
| `/estacion/5` y cuatro subrutas | `World5RootScreen` | guard interno sólo para orden de subáreas | overview directo permitido; subáreas cerradas redirigen al overview | sí, con overlay |
| `/final` | `FinalRootScreen` | `requireFinalAccess`; sólo exige estación 5 | posible después de cerrar W5 aunque 1–4 no estén globalmente completas | destino |
| `/qr/:stationId` | `QrAccessPlaceholder` | ninguno; `stationId` es string libre | muestra placeholder y link genérico | no |
| `/estacion/:stationId` | `StationPlaceholder` | catch genérico | IDs inválidos muestran placeholder | no |

`canOpenStation()` tiene pruebas unitarias, pero ninguna ruta lo consume. La auditoría abrió directamente Mundos I–V. Además, desde un perfil sin completion global de I–IV se completó Mundo V por UI normal y se alcanzó `/final`: bypass confirmado.

Back/forward está cubierto de forma focal en Mundo V y en transiciones existentes; no hay un guard global que pueda reparar una entrada histórica a Mundo II–V.

## 8. Matriz de checkpoints, completion y unlock por Mundo

| Mundo | Completion real | Unlock real | Checkpoint durable | Reload parcial | Revisit completada |
|---|---|---|---|---|---|
| I | `activeConcept === ready_to_continue`, sólo memoria | derivado de `activeConcept` | ninguno | vuelve a `intro` | vuelve a inicio; no hay marca global |
| II | `journeyComplete && resultado_mediado`, sólo memoria | sets/orden en memoria | ninguno | vuelve a `planta_viva` | vuelve a inicio; no hay marca global |
| III | tres registros + sello, sólo memoria | `completed.size + 1` | ninguno | vuelve al índice 0/3 | vuelve a inicio; `Guardar registro` no persiste |
| IV | último nodo escribe `markStationCompleted(4)` | índice/progress en memoria | sólo completion final | un parcial vuelve a entrada; completion restaura modo revisit | abre en `exit_ready` si 4 está globalmente completa |
| V | cuatro áreas en `gvo.station5.v1`; cierre escribe estación 5 global | prefijo canónico y guards de subruta | después de cada área, escritura inmediata y verificada | restaura 0–4/4 y subruta válida | libre después de 4/4 |

No hay escritura debounced ni al desmontar. Mundo I–IV dependen de memoria React durante el recorrido; Mundo V escribe inmediatamente. El cierre de pestaña equivale a reload para la durabilidad: sólo Portada, completion global, Mundo V y el contexto de revisita por sesión sobreviven según su backend.

## 9. Resultados de reload, entrada directa y reconexión

| Escenario | Resultado observado |
|---|---|
| Estado nuevo | Portada y cada Mundo montan sus defaults; Mundo V habilita sólo Plantas. |
| Mundo I parcial | UI normal `intro→relation`; reload en la misma URL: `relation→intro`. |
| Mundo II parcial | UI normal desbloqueó Señal; reload: `senal→planta_viva`, visited `1,2→1`. |
| Mundo III parcial | UI normal abrió Planta; reload: `station3_plant_page→station3_index`, completados `0`. |
| Mundo IV | Static audit: sólo completion final es durable; no se inyectó estado para forzar un parcial. |
| Mundo V parcial/completo | Suite y UI confirman persistencia por área, guards de subruta, 4/4 y revisita. |
| Cierre/reapertura de pestaña | Tras completar W5 por UI, una pestaña nueva restauró cuatro áreas, completion local/global y overview; el contexto de revisión no cruzó de pestaña. |
| Entrada directa | Mundos I–V abren sin guard de predecesor. |
| QR válida | `/qr/1` es todavía un placeholder; no entra automáticamente al Mundo ni valida progression. |
| Storage ausente/corrupto | Final falla cerrado por tests; W5 muestra error y retry; Mundo IV puede fallar al montar si `getItem` lanza. |
| Versión desconocida | Review context la rechaza; global no tiene versión; W5 ignora el número suministrado y normaliza a v1. |
| Online→offline→online | No existen listeners ni backend remoto. La recarga offline real no pudo completarse porque el navegador de auditoría bloqueó por política navegar al origen local tras apagar el servidor. |

No se manipuló storage manualmente para hacer pasar la aplicación. Las escrituras del navegador fueron producto del flujo UI normal. Los casos de corrupción/ausencia se sustentan en tests existentes y lectura de código.

## 10. Análisis PWA, progreso y versiones

- Build actual: PWA `generateSW`, `registerType: autoUpdate`, `registerSW.js`, `sw.js`, manifest standalone/fullscreen y fallback `/index.html`.
- Precache: 278 entradas, `130508.80 KiB` (aprox. 127,45 MiB).
- Principales grupos precacheados: Mundo II 41,35 MiB; Mundo I 20,20 MiB; Lía compartida 17,70 MiB; Mundo IV 8,81 MiB; Mundo III 7,00 MiB; Final 6,08 MiB; Mundo V 4,26 MiB.
- El mirror raíz `assets/gvo/current-used/**` no se precachea, pero 31 assets canónicos bajo `assets/gvo/shared/lia/current-used/**` sí aparecen (7,73 MiB).
- No hay requests externos runtime ni sincronización remota demostrada. En este proyecto, “offline-first” significa shell/assets precacheados más algunos datos en almacenamiento local; no significa sync.
- No existe contrato de compatibilidad entre versión de service worker y schema de progreso. `autoUpdate` puede entregar código nuevo mientras sobreviven payloads locales antiguos.
- El fallback ante JSON corrupto es conservador, pero puede aparentar progreso vacío. No hay migración ni telemetría local de recuperación.

La disponibilidad offline del shell está respaldada por la salida de Workbox, no por una prueba offline completa en esta ejecución. No se afirma certificación PWA de dispositivo.

## 11. Auditoría transversal de Portada y Mundos I–V

### Portada

En 390×844 y 844×390 no hubo overflow horizontal. Los cinco portales tienen frames/glow/locks runtime cargados y `missingImages=[]`; no faltan archivos de imagen en el DOM actual. Que el arte requiera una nueva dirección visual es una decisión humana, no un defecto técnico demostrado.

### Mundo I

Reload y revisita pierden las secciones vistas. En 390×844 los nodos exteriores se extienden 3,64 px fuera del viewport y el root usa `overflow:hidden`, por lo que el borde/halo se recorta. El CTA `Continuar` midió 135,7×39,1 px y no se solapó con el retorno al Mirador; la hipótesis de fallo responsive del CTA no se reprodujo en ese viewport.

### Mundo II

La pantalla inicial midió: eyebrow 9,36 px, hint 9,945 px, copy 12,16 px y título 15,015 px en 390×844. CSS de estados compactos llega a 0,34–0,44 rem en mapeo/mediación y a 0,43 rem en readout de Captura. Es una deuda real de legibilidad, especialmente en landscape bajo 700 px de alto.

En revisita desde Final, `Volver al Mirador` ocupó x=214..378, y=788..832 con z-index 1000; la navegación de capas ocupó x=7..383, y=731..837. La intersección fue positiva y la captura visual mostró capas inferiores tapadas.

### Mundo III

Landmarks, labels y orden básico están presentes. El contenido usa scroll vertical en landscape. El botón visible “Guardar registro” sólo actualiza sets/phase de React; el reload reinicia el cuaderno. Esto rompe la semántica esperada de “guardar”, aunque la UI automática funcione durante una sesión.

### Mundo IV — control

No se detectó una deuda visual propia: 390×844 y 844×390 sin overflow horizontal; labels, estados, hints, reduced motion y control fullscreen presentes. Sí hereda la deuda transversal de no tener checkpoints parciales y el riesgo de excepción de `gvo.progress.v1`; no se reabre su cierre visual.

### Mundo V

Estado inicial confirmado: sólo Plantas `available`; Sistema/Espacio/Visitante `locked`. Los sectores protegidos reciben click deliberadamente para anunciar la dependencia y no cambian ruta/progreso. Targets iniciales midieron aprox. 111×132 px. El flujo normal 0/4→4/4, cierre, reload y reapertura fue correcto. La afirmación general de “poco intuitivo” requiere validación humana con usuarios; no se reprodujo un bloqueo funcional.

### Mirador / Final

No se detectó regresión interna de Gate 5–8. El único hallazgo relacionado es la colisión del overlay compartido al regresar a Mundo II; se clasifica como deuda del layout de revisita, no como reapertura visual del Mirador.

### Responsive y accesibilidad no ejecutados literalmente

La inspección real cubrió portrait 390×844 y landscape 844×390; los smoke tests cubrieron Loading en 360×640, 375×667, 390×844, 414×896 y 430×932. Tablet/desktop se revisaron por CSS/tests existentes, no mediante nueva captura completa de todos los Mundos. El navegador de auditoría no expuso zoom de chrome; el 200 % literal quedó pendiente. No se sustituye esa ausencia con una afirmación basada sólo en bounding boxes.

## 12. Validación de hipótesis humanas

| Hipótesis | Estado | Evidencia/conclusión |
|---|---|---|
| `COVER-01` | `DESCARTADA` en su afirmación técnica | Los portales tienen assets runtime y cero imágenes rotas. Una nueva producción estética no está demostrada. |
| `W1-PROGRESS-01` | `CONFIRMADA` | `activeConcept` y vistos viven en React; reload relation→intro. |
| `W1-PROGRESS-02` | `CONFIRMADA` | Tras reload se bloquea de nuevo todo salvo Relación, incluso lo visto. |
| `W1-REVIEW-01` | `CONFIRMADA` | Revisita entra al default porque no existe completion/checkpoint durable de W1. |
| `W1-VISUAL-01` | `CONFIRMADA` de forma acotada | Los nodos exteriores/halos se recortan 3,64 px; el juicio de grosor final sigue siendo humano. |
| `W1-RESP-01` | `DESCARTADA` en 390×844 | CTA visible, sin overflow ni colisión; no cubre 200 % literal. |
| `W2-PROGRESS-01` | `CONFIRMADA` | Reload Señal→Planta y pérdida de interactions. |
| `W2-A11Y-01` | `CONFIRMADA` | Texto real sub-10 px en hint/eyebrow y varios valores compactos aún menores. |
| `W2-CAPTURE-01` | `PROBABLE` | CSS de readout llega a 0,43 rem; faltó walkthrough visual completo de Captura y zoom 200 %. |
| `W2-REVIEW-01` | `CONFIRMADA` | Overlay y nav se solapan en 390×844; evidencia pictórica y geométrica. |
| Reconstruir Captura/mapeo/música | `NO_CONFIRMADA` | No hay evidencia para una reconstrucción completa. |
| `W3-PROGRESS-01` | `CONFIRMADA` | Cuaderno y automatismos sólo en memoria. |
| `W3-SAVE-01` | `CONFIRMADA` | No hay checkpoint durable al confirmar registros. |
| `W3-SAVE-02` | `CONFIRMADA` | “Guardar registro” no corresponde a una escritura durable. |
| Mundo IV sin deuda propia | `CONFIRMADA` con reserva transversal | Sin deuda visual única; comparte gaps globales de checkpoint/storage. |
| `W5-STATE-01` | `CONFIRMADA` como comportamiento correcto | Sólo Plantas disponible es el contrato secuencial vigente, no un defecto. |
| `W5-AFFORDANCE-01` | `NO_CONFIRMADA` | Hay labels, estado protegido, feedback, targets amplios y continuidad; falta prueba humana de usabilidad. |
| Mirador sin deuda propia | `CONFIRMADA` | No se encontró regresión interna; overlay de retorno afecta al Mundo visitado. |
| Hidratación tardía antes de guards | `DESCARTADA` | Lecturas síncronas; la deuda es ausencia/divergencia de guards. |

## 13. Inventario completo de deudas

### `PROG-001` — Integridad global y guards de estaciones

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** progreso, router, transiciones.
- **Comportamiento observado:** W1–W3 no escriben completion; `canOpenStation` no se usa; W2–W5 abren directos; Final sólo exige estación 5.
- **Evidencia:** `rg markStationCompleted` sólo encuentra W4/W5; reproducción UI cerró W5 directo y alcanzó `/final`.
- **Paths y símbolos:** `src/domain/progress/progress.storage.ts::{canOpenStation,canOpenFinal,markStationCompleted}`; `src/app/router.tsx`; exits de `World1RootScreen`, `World2RootScreen`, `World3RootScreen`.
- **Escenario de reproducción:** perfil nuevo → `/estacion/5` → completar 4/4 → `Ir al cierre` → `/final` sin completar globalmente I–IV.
- **Impacto de usuario:** bypass de recorrido y verdad global incoherente.
- **Severidad / prioridad / confianza:** `CRÍTICA` / `P0` / `ALTA`.
- **Dependencias:** contrato de completion por Mundo; preservar reset y revisita.
- **Riesgo de regresión:** transiciones, entradas directas, Final guard, revisita y tests del cierre W5.
- **Complejidad:** `M`.
- **Quick win:** `NO`; conecta varios cierres/guards y requiere compatibilidad.
- **Investigación pendiente:** definir si una estación completada permite siempre entrada directa aunque falte un predecesor reparado.
- **Microfrente recomendado:** `GVO_DEBT_002_GLOBAL_COMPLETION_INTEGRITY_AND_STATION_GUARDS`.

### `PROG-002` — Checkpoints no durables en Mundos I–IV

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** W1, W2, W3, W4, storage.
- **Comportamiento observado:** progreso parcial vive en `useState`; reload/cierre de pestaña reinicia la estación. W4 sólo conserva completion final.
- **Evidencia:** reproducciones W1/W2/W3 y lectura de estados W4.
- **Paths y símbolos:** `World1RootScreen::activeConcept`; `World2RootScreen::{visitedLayerIds,completedRequiredInteractions}`; `World3RootScreen::{completed,phase}`; `World4RootScreen::{progress,persistedRevisit}`.
- **Escenario de reproducción:** avanzar un checkpoint sin cerrar Mundo y recargar.
- **Impacto de usuario:** pérdida de trabajo, repetición y revisita incorrecta.
- **Severidad / prioridad / confianza:** `ALTA` / `P0` / `ALTA`.
- **Dependencias:** `PROG-001`, `PROG-003`.
- **Riesgo de regresión:** unlocks, automatismos W3, motion W4 y back/forward.
- **Complejidad:** `XL` si se mezcla; debe dividirse por Mundo.
- **Quick win:** `NO`; no debe resolverse con escrituras ad hoc divergentes.
- **Investigación pendiente:** checkpoints mínimos humanos por cada Mundo y política de resume/revisit.
- **Microfrente recomendado:** tickets separados `GVO_DEBT_W1/W2/W3/W4_CHECKPOINT_PERSISTENCE` después del contrato común.

### `PROG-003` — Schemas divergentes y migración ausente

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** storage, PWA.
- **Comportamiento observado:** global sin versión; W5 declara v1 pero no valida el número entrante; Portada usa booleano; no hay migraciones.
- **Evidencia:** implementaciones de `normalizeProgress`, `normalizeWorld5Progress`, `coverIntroState` y review context.
- **Paths y símbolos:** `src/domain/progress/progress.storage.ts`; `src/screens/World5Root/world5Progress.ts`; `src/screens/Cover/coverIntroState.ts`; `src/app/review/finalReviewContext.ts`.
- **Escenario de reproducción:** publicación de código nuevo sobre payload local viejo/desconocido.
- **Impacto de usuario:** reset silencioso a vacío o interpretación no explícita de datos antiguos.
- **Severidad / prioridad / confianza:** `ALTA` / `P0` / `ALTA`.
- **Dependencias:** decisión de fuente de verdad; política PWA update.
- **Riesgo de regresión:** reset allowlist, W5 4/4, Final guard y perfiles instalados.
- **Complejidad:** `L`.
- **Quick win:** `NO`; requiere fixture de migración y rollback.
- **Investigación pendiente:** payloads reales desplegados que deben migrarse y ventana de compatibilidad.
- **Microfrente recomendado:** `GVO_DEBT_003_VERSIONED_PROGRESS_SCHEMA_AND_MIGRATION_CONTRACT`.

### `STOR-001` — Excepciones no uniformes en progreso global

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** storage, Mundo IV.
- **Comportamiento observado:** `readProgress` llama `getItem` fuera del `try`; W4 lo ejecuta al inicializar sin catch y escribe completion sin manejo de error.
- **Evidencia:** código; Final y W5 sí envuelven sus caminos críticos, mostrando la divergencia.
- **Paths y símbolos:** `progress.storage.ts::{readProgress,writeProgress}`; `World4RootScreen::completedBeforeMount,onStepSettled`.
- **Escenario de reproducción:** navegador donde `localStorage.getItem` o `setItem` lance.
- **Impacto de usuario:** W4 puede no montar o romper al cierre.
- **Severidad / prioridad / confianza:** `ALTA` / `P0` / `ALTA`.
- **Dependencias:** `PROG-003`.
- **Riesgo de regresión:** comportamiento fail-closed de Final y retry W5.
- **Complejidad:** `S`.
- **Quick win:** `NO`; el manejo debe definir UX y no ocultar pérdida.
- **Investigación pendiente:** estado visual aprobado para error/retry en W4.
- **Microfrente recomendado:** `GVO_DEBT_004_GLOBAL_STORAGE_FAILURE_CONTRACT`.

### `PWA-001` — Precache inicial excesivo

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** PWA, assets, performance.
- **Comportamiento observado:** 278 entradas / 127,45 MiB se descargan como precache; W2+W1 aportan 61,55 MiB.
- **Evidencia:** salida `npm run build` y análisis de URLs de `dist/sw.js`.
- **Paths y símbolos:** `vite.config.ts::VitePWA.workbox.globPatterns`; `public/assets/gvo/stations/**`.
- **Escenario de reproducción:** primera instalación o actualización del SW.
- **Impacto de usuario:** tiempo, datos, almacenamiento y updates costosos/incompletos.
- **Severidad / prioridad / confianza:** `ALTA` / `P1` / `ALTA`.
- **Dependencias:** estrategia offline y asset bundles por ruta.
- **Riesgo de regresión:** offline navigation y disponibilidad de assets de Mundos.
- **Complejidad:** `L`.
- **Quick win:** `NO`; excluir sin contrato puede romper offline.
- **Investigación pendiente:** presupuesto de instalación objetivo y assets realmente requeridos offline en primera visita.
- **Microfrente recomendado:** `GVO_DEBT_010_PWA_PRECACHE_BUDGET_AND_RUNTIME_CACHE_PLAN`.

### `PERF-001` — Bundle principal sin code splitting por ruta

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** build, router, performance.
- **Comportamiento observado:** un JS de 782,15 kB minificado / 226,54 kB gzip; 600 módulos; todas las pantallas se importan eager.
- **Evidencia:** build y `src/app/router.tsx`; warning `builtin:vite-reporter` >500 kB.
- **Paths y símbolos:** `src/app/router.tsx`; `src/components/layout/MobileShell.tsx`; roots de W1–W5/Final.
- **Escenario de reproducción:** `npm run build`.
- **Impacto de usuario:** parse/evaluación inicial y update más costosos.
- **Severidad / prioridad / confianza:** `MEDIA` / `P2` / `ALTA`.
- **Dependencias:** contratos de preloader/transition y PWA.
- **Riesgo de regresión:** navegación, precarga visual y offline fallback.
- **Complejidad:** `M`.
- **Quick win:** `NO`; lazy loading necesita presupuesto y tests de transición.
- **Investigación pendiente:** contribución exacta por módulo; no hay visualizer instalado y no se añadió dependencia.
- **Microfrente recomendado:** `GVO_DEBT_011_ROUTE_CHUNKING_MEASUREMENT_AND_SAFE_SPLIT`.

### `ASSET-001` — Mirror `current-used` duplicado en artefacto de despliegue

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** assets, build artifact.
- **Comportamiento observado:** `dist` pesa 236,18 MiB; `dist/assets/gvo/current-used` copia 233 archivos / 108,68 MiB aunque el mirror raíz no se precachea ni se importa.
- **Evidencia:** inventario post-build; Vite copia `public/**` completo.
- **Paths y símbolos:** `public/assets/gvo/current-used/**`; `vite.config.ts`.
- **Escenario de reproducción:** build limpio y medición de `dist`.
- **Impacto de usuario/operación:** despliegues, hosting y paquetes más grandes; no implica descarga runtime automática.
- **Severidad / prioridad / confianza:** `MEDIA` / `P2` / `ALTA`.
- **Dependencias:** política obligatoria `current-used`; proceso de publicación.
- **Riesgo de regresión:** trazabilidad y auditorías de assets si se mueve el mirror.
- **Complejidad:** `M`.
- **Quick win:** `NO`; no se debe violar la política para adelgazar `dist`.
- **Investigación pendiente:** si el hosting permite excluir mirrors del artefacto sin mover la fuente documental.
- **Microfrente recomendado:** `GVO_DEBT_012_DEPLOY_ARTIFACT_ASSET_EXCLUSION_CONTRACT`.

### `IMM-001` — Immersive control no transversal

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** shell, fullscreen, responsive.
- **Comportamiento observado:** Fullscreen API y fallback existen, pero `ImmersiveModeControl` sólo se monta en Mundo IV.
- **Evidencia:** búsqueda de uso y auditoría DOM W1–W5.
- **Paths y símbolos:** `src/shared/immersive/*`; `World4RootScreen`.
- **Escenario de reproducción:** abrir Portada/W1/W2/W3/W5 en navegador compatible.
- **Impacto de usuario:** experiencia inmersiva inconsistente y dependencia de barras del navegador.
- **Severidad / prioridad / confianza:** `MEDIA` / `P1` / `ALTA`.
- **Dependencias:** shell global, gesto explícito, standalone y safe areas.
- **Riesgo de regresión:** layouts congelados y superposición con controles de revisita.
- **Complejidad:** `M`.
- **Quick win:** `NO`; no debe copiarse el botón por pantalla.
- **Investigación pendiente:** punto de montaje global que no invada composición ni prometa fullscreen automático.
- **Microfrente recomendado:** `GVO_DEBT_008_IMMERSIVE_SHELL_CONTRACT_AND_PROTOTYPE`.

### `W2-A11Y-001` — Legibilidad transversal de Mundo II

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** Mundo II, accesibilidad, responsive.
- **Comportamiento observado:** textos críticos entre 9,36 y 12,16 px en portrait; varios labels compactos de 0,34–0,44 rem.
- **Evidencia:** computed styles reales, captura 390×844 y CSS compacto.
- **Paths y símbolos:** `World2RootScreen.css`; `World2CaptureTimeline.css`; panels de mapping/mediated.
- **Escenario de reproducción:** 390×844 y alturas ≤700 px.
- **Impacto de usuario:** lectura difícil y fatiga; riesgo mayor en baja visión/landscape.
- **Severidad / prioridad / confianza:** `ALTA` / `P1` / `ALTA`.
- **Dependencias:** `W2-REVIEW-001`; copy y layout existentes.
- **Riesgo de regresión:** reflow, composición pictórica y controles de capas.
- **Complejidad:** `M`.
- **Quick win:** `NO`; subir fuentes aisladas puede provocar clipping.
- **Investigación pendiente:** test visual completo 200 %, contraste medido y viewports 360×640/desktop.
- **Microfrente recomendado:** `GVO_DEBT_W2_A11Y_LEGIBILITY_AND_REFLOW`.

### `W2-CAPTURE-001` — Captura candidata de alta prioridad visual

- **Estado de evidencia:** `PROBABLE`
- **Área:** Mundo II/Captura.
- **Comportamiento observado:** readout compacto puede caer a 0,43 rem y control labels a 0,45 rem; la interacción general está implementada.
- **Evidencia:** `World2CaptureTimeline.css` y tests de timeline; no hubo walkthrough pictórico completo de la capa.
- **Paths y símbolos:** `World2CaptureTimeline`, `World2CaptureTimeline.css`, `selectCaptureTimelineStep`.
- **Escenario de reproducción:** Captura en móvil de baja altura y zoom alto.
- **Impacto de usuario:** datos/steps potencialmente ilegibles.
- **Severidad / prioridad / confianza:** `ALTA` / `P1` / `MEDIA`.
- **Dependencias:** `W2-A11Y-001`.
- **Riesgo de regresión:** swipe timeline, gating `capture_data_readout_seen`.
- **Complejidad:** `M`.
- **Quick win:** `NO`; requiere evidencia visual de todos los pasos.
- **Investigación pendiente:** capturas por step en 360×640, 390×844, 844×390 y zoom 200 %.
- **Microfrente recomendado:** incluido en `GVO_DEBT_W2_A11Y_LEGIBILITY_AND_REFLOW` como subalcance, sin reconstrucción completa.

### `W2-REVIEW-001` — Retorno al Mirador tapa navegación

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** revisita, Mundo II, overlay.
- **Comportamiento observado:** el control fijo cubre capas inferiores de la navegación.
- **Evidencia:** screenshot y rectángulos intersectados en 390×844.
- **Paths y símbolos:** `FinalReviewModeLayout.tsx/.css`; `World2RootScreen.css::.world2-layer-nav`.
- **Escenario de reproducción:** Final 4/4 → revisar Mundo II.
- **Impacto de usuario:** controles ocultos y navegación difícil.
- **Severidad / prioridad / confianza:** `ALTA` / `P1` / `ALTA`.
- **Dependencias:** contrato de retorno 021P y `W2-A11Y-001`.
- **Riesgo de regresión:** retorno de W1/W3/W4/W5 y safe areas.
- **Complejidad:** `S`.
- **Quick win:** `NO`; un offset global puede romper otros Mundos.
- **Investigación pendiente:** matriz de colisión del mismo control en nueve rutas válidas y orientación/zoom.
- **Microfrente recomendado:** `GVO_DEBT_007_FINAL_REVIEW_RETURN_SAFE_AREA_LAYOUT`.

### `W1-VISUAL-001` — Halos exteriores recortados

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** Mundo I, visual responsive.
- **Comportamiento observado:** Relación empieza en x=-3,64 y Mediación termina en x=393,62 en viewport de 390; root oculta overflow.
- **Evidencia:** screenshot y geometría real.
- **Paths y símbolos:** `World1RootScreen.css`; nodos `.world1-root-node`; root `overflow:hidden`.
- **Escenario de reproducción:** W1 intro, 390×844.
- **Impacto de usuario:** borde/halo incompleto; deuda estética baja.
- **Severidad / prioridad / confianza:** `BAJA` / `P2` / `ALTA`.
- **Dependencias:** aprobación visual de W1.
- **Riesgo de regresión:** composición de raíces y hit targets.
- **Complejidad:** `S`.
- **Quick win:** `SÍ`, sólo si un ticket visual aprueba un ajuste de tokens y prueba ambos orientations.
- **Investigación pendiente:** validar si el recorte es intencional en el arte aprobado.
- **Microfrente recomendado:** `GVO_DEBT_W1_EDGE_HALO_RESPONSIVE_REVIEW`.

### `W3-SAVE-001` — Semántica “Guardar” sin persistencia

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** Mundo III, UX, progreso.
- **Comportamiento observado:** confirmar “Guardar registro” sólo cambia memoria; reload devuelve 0/3.
- **Evidencia:** código y reproducción de reload en Planta.
- **Paths y símbolos:** `station3Content.ts::confirmLabel`; `World3RootScreen::closeRecord,setCompleted`.
- **Escenario de reproducción:** completar/abrir registro y recargar antes del cierre total.
- **Impacto de usuario:** expectativa falsa de guardado y repetición del flujo automático.
- **Severidad / prioridad / confianza:** `ALTA` / `P0` / `ALTA`.
- **Dependencias:** `PROG-002`, `PROG-003`.
- **Riesgo de regresión:** automatismos, sello, focus restore e idempotencia.
- **Complejidad:** `M`.
- **Quick win:** `NO`; cambiar copy no resuelve el contrato de progreso.
- **Investigación pendiente:** checkpoint exacto por registro y comportamiento de resume en fase automática.
- **Microfrente recomendado:** `GVO_DEBT_W3_DURABLE_RECORD_CHECKPOINTS`.

### `QR-001` — Entrada QR todavía es placeholder

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** QR, rutas, dependencias.
- **Comportamiento observado:** `/qr/:stationId` acepta cualquier string y muestra link a un placeholder; no aplica guards. `@zxing/browser` está declarado pero no importado.
- **Evidencia:** DOM `/qr/1`, router, búsqueda de imports.
- **Paths y símbolos:** `QrAccessPlaceholder.tsx`; `router.tsx::QrRoute`; `package.json`.
- **Escenario de reproducción:** abrir `/qr/1` o un ID inválido.
- **Impacto de usuario:** acceso físico no finalizado y posible bypass/confusión.
- **Severidad / prioridad / confianza:** `MEDIA` / `P1` / `ALTA`.
- **Dependencias:** `PROG-001` y definición de URLs QR físicas.
- **Riesgo de regresión:** cámara nativa, permisos prohibidos y rutas genéricas.
- **Complejidad:** `M`.
- **Quick win:** `NO`; no debe activarse scanner interno ni permisos sin ticket.
- **Investigación pendiente:** contrato aprobado de QR: redirect, landing o link manual, y IDs válidos impresos.
- **Microfrente recomendado:** `GVO_DEBT_009_QR_ROUTE_CONTRACT_AND_GUARDS`.

### `EDIT-001` — Registry editorial previo conserva `TEMP`

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** editorial, documentación, DOM.
- **Comportamiento observado:** registry contiene 137 entradas temporales: W1 18, W2 32, W3 23, W4 40 y W5 24; W2 expone `excel_pending`.
- **Evidencia:** conteo de `temporaryEsEntry` y data attributes runtime.
- **Paths y símbolos:** `src/content/editorial/editorialRegistry.ts`; `World2RootScreen`.
- **Escenario de reproducción:** inspeccionar registry/DOM de Mundos I–V.
- **Impacto de usuario/proyecto:** estado editorial de Mundos no coincide con el cierre editorial final del Mirador; riesgo de copy no canónico.
- **Severidad / prioridad / confianza:** `MEDIA` / `P1` / `ALTA`.
- **Dependencias:** aprobación humana editorial específica por Mundo.
- **Riesgo de regresión:** 137 slots y tests de UI/copy.
- **Complejidad:** `XL` si se mezcla; dividir por Mundo.
- **Quick win:** `NO`; no promover texto a `FINAL` sin aprobación humana.
- **Investigación pendiente:** cuáles textos tienen aprobación humana documentada fuera del registry.
- **Microfrente recomendado:** auditorías editoriales separadas por Mundo, comenzando sólo con evidencia aprobada.

### `TEST-001` — Smoke E2E contradice timeline vigente

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** tests, Loading.
- **Comportamiento observado:** test espera `/portada` en 5 s bajo reduced motion; runtime fija reduced motion en 12 s.
- **Evidencia:** fallo 2/2 ejecuciones; URL permaneció `/?resetIntro=1`; `REDUCED_MOTION_DURATION_MS=12000`.
- **Paths y símbolos:** `tests/e2e/smoke.spec.ts:165`; `loadingInitialTimeline.ts`.
- **Escenario de reproducción:** spec focal `resetIntro desde /`.
- **Impacto de proyecto:** CI rojo/ruido; suite no representa contrato temporal actual.
- **Severidad / prioridad / confianza:** `MEDIA` / `P1` / `ALTA`.
- **Dependencias:** decidir si 12 s es contrato aprobado o regresión de UX.
- **Riesgo de regresión:** Loading/reduced motion y tiempo de test.
- **Complejidad:** `XS` después de decisión humana/técnica.
- **Quick win:** `SÍ`; alinear expectativa al contrato documentado, sin ocultar una posible regresión.
- **Investigación pendiente:** evidencia de aprobación de duración 12 s para reduced motion.
- **Microfrente recomendado:** `GVO_DEBT_005_LOADING_TIMELINE_E2E_CONTRACT_ALIGNMENT`.

### `TEST-002` — Specs E2E escriben evidencia tracked

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** tooling, tests.
- **Comportamiento observado:** varios specs escriben PNG/JSON directamente en `docs/visual/**`; ejecutar toda la suite puede ensuciar el repo.
- **Evidencia:** búsquedas de `page.screenshot`, `fs.writeFile`, `sharp` y paths de docs.
- **Paths y símbolos:** `world5-st5-020h.spec.ts`, `transition-copy-st5-020i.spec.ts`, `world5-st5-020b/d.spec.ts`, varios cover/transition specs.
- **Escenario de reproducción:** `npm run test:e2e` completo.
- **Impacto de proyecto:** side effects, diffs accidentales y dificultad de auditoría limpia.
- **Severidad / prioridad / confianza:** `MEDIA` / `P1` / `ALTA`.
- **Dependencias:** política de evidencia visual y snapshots aprobados.
- **Riesgo de regresión:** conservación de evidencias históricas.
- **Complejidad:** `S`.
- **Quick win:** `SÍ`; redirigir outputs corrientes a `testInfo.outputPath` manteniendo generación histórica sólo en scripts explícitos.
- **Investigación pendiente:** qué specs son generadores de acta intencionales y cuáles deberían ser read-only.
- **Microfrente recomendado:** `GVO_DEBT_006_E2E_ARTIFACT_ISOLATION`.

### `DOC-001` — Documentación canónica con estados superados

- **Estado de evidencia:** `CONFIRMADA`
- **Área:** documentación, assets, status.
- **Comportamiento observado:** `CURRENT_STATE` dice cinco slots operativos no consumidos; `ASSET_INVENTORY` deja W5 en ST5-020G y Visitante fuera; `current-used/README` deja W5/Final en cortes históricos.
- **Evidencia:** contradicción con 021P y handoff, que declaran 35 slots consumidos, ST5-020H y Mirador complete. Mirror W5 real tiene 24 assets, no los 21 descritos en README.
- **Paths y símbolos:** los tres documentos citados y `GVO_PROJECT_DEBT_CORRECTION_HANDOFF.txt`.
- **Escenario de reproducción:** comparar status canónico y archivos/mirrors actuales.
- **Impacto de proyecto:** onboarding ambiguo y riesgo de reabrir estados ya cerrados.
- **Severidad / prioridad / confianza:** `MEDIA` / `P1` / `ALTA`.
- **Dependencias:** preservar actas históricas; 021P es autoridad.
- **Riesgo de regresión:** borrar contexto histórico legítimo.
- **Complejidad:** `S`.
- **Quick win:** `SÍ`; añadir aclaraciones de supersession, sin reescribir actas históricas.
- **Investigación pendiente:** dueño canónico de cada resumen de assets tras publicación.
- **Microfrente recomendado:** `GVO_DEBT_013_CANONICAL_STATUS_AND_ASSET_DOC_RECONCILIATION`.

## 14. Dependencias entre deudas

```text
PROG-001 (completion/guards)
├─ PROG-003 (schema/migración común)
│  ├─ PROG-002 (checkpoints W1–W4 por microfrentes)
│  │  └─ W3-SAVE-001
│  └─ STOR-001 (fallo uniforme de storage)
└─ QR-001 (QR debe respetar guards)

W2-A11Y-001
├─ W2-CAPTURE-001
└─ W2-REVIEW-001

PWA-001 ↔ PERF-001 ↔ ASSET-001
TEST-001 y TEST-002 habilitan validación confiable de los frentes anteriores.
DOC-001 y EDIT-001 requieren autoridad humana, no bloquean PROG-001.
```

No se debe iniciar persistencia por Mundo antes de fijar completion/guards y schema, porque crearía nuevas fuentes divergentes.

## 15. Riesgos de regresión

1. Cambiar `gvo.progress.v1` puede bloquear perfiles con W5/Final completados.
2. Añadir keys exige revisar el reset de cuatro entradas; no se autoriza ampliar la allowlist por inferencia.
3. Guards nuevos pueden bloquear revisitas válidas desde Final si no distinguen contexto de revisión.
4. Guardar fases automáticas de W3 puede reanudar en un estado visual imposible o duplicar timers.
5. Persistir W4 parcial puede alterar motion, visibility pause y estado humano cerrado.
6. Mover el retorno al Mirador globalmente puede romper W1/W3/W4/W5 aunque corrija W2.
7. Subir tipografía W2 sin reflow puede tapar assets, botones o navegación.
8. Excluir assets del precache puede romper una visita offline posterior.
9. Excluir `current-used` del artefacto sin contrato puede romper trazabilidad del proceso de assets.
10. Code splitting puede invalidar preloaders y la continuidad temporal de transiciones.
11. Corregir docs históricos reescribiéndolos destruiría evidencia; sólo se deben actualizar resúmenes vigentes o añadir notas de supersession.

## 16. Quick wins reales

| ID | Quick win | Condición |
|---|---|---|
| `TEST-001` | alinear timeout/assertion con timeline aprobado | primero decidir si 12 s es correcto |
| `TEST-002` | aislar outputs corrientes en `test-results` | conservar generadores históricos explícitos |
| `DOC-001` | aclarar estados superados en docs vigentes | no editar retrospectivamente actas cerradas |
| `W1-VISUAL-001` | ajustar token/offset de nodos exteriores | requiere ticket y aprobación visual |
| dependencia `@zxing/browser` | retirar si QR seguirá sin scanner interno | sólo tras contrato QR y actualización intencional del lockfile |

Ninguno debe mezclarse con `PROG-001` en el siguiente ticket.

## 17. Temas que requieren investigación adicional

- Payloads reales desplegados y política de migración/rollback.
- Definición humana de resume vs revisit por Mundo.
- Contrato exacto de cierre para W1–W3 y si W4/W5 ya completados reparan huecos anteriores.
- Matriz visual completa de W2/Captura a 360×640, tablet, desktop y zoom 200 %.
- Usabilidad humana de affordances W5; no inferir rediseño desde auditoría técnica.
- Presupuesto PWA de instalación, almacenamiento y actualización.
- Evidencia aprobatoria del timeline Loading de 12 s también en reduced motion.
- Clasificación de specs E2E generadores de evidencia vs tests read-only.
- Autoridad editorial disponible para promover los 137 slots `TEMP`.
- Contrato físico de QR y lista de IDs impresos.
- Capacidad del hosting para excluir mirrors sin moverlos de `public`.

## 18. Gaps de tests

- No hay test de router que demuestre guards para estaciones 2–5; `canOpenStation` se prueba aislado pero está desconectado.
- No hay test de completion global W1–W3 porque no existe escritura.
- No hay tests de reload/checkpoints W1–W4; W5 sí tiene cobertura profunda.
- Global progress carece de fixtures corruptos/versionados propios; los casos corruptos sólo protegen el loader de Final.
- Falta versión desconocida para `world5Progress`; el normalizador no la rechaza.
- Falta storage exception/retry de W4.
- Falta matriz de overlay de revisita en las nueve rutas válidas.
- Falta zoom 200 % y contraste automatizado/manual documentado de W2.
- Falta compatibilidad code/schema a través de un update de service worker.
- Falta navegación offline reproducible en el tooling actual de auditoría.
- El smoke `resetIntro desde /` está desalineado y falla de forma reproducible.
- La suite E2E completa no es read-only porque varios specs generan evidencia tracked.

Protecciones que no deben debilitarse: 332 unitarias actuales, Final guard fail-closed, W5 storage/retry, review context, reset transaccional/rollback, registry Final, asset mirrors y motion/reduced-motion de Final.

## 19. Deuda de documentación y tooling

- `DOC-001`: resúmenes vigentes contienen cortes históricos no claramente reconciliados.
- `EDIT-001`: 137 slots de Mundos I–V siguen `TEMP`; los 35 slots Final sí son `FINAL`.
- El warning `[PLUGIN_TIMINGS]` viene de `builtin:vite-reporter`, no de un plugin custom. Costes medidos: `vite:asset` 46 %, `prepare-out-dir` 34 %, `vite:css` 10 % y `vite:css-post` 7 %. Debe conservarse como diagnóstico hasta medir builds repetidos; no hay evidencia para “limpiar un plugin”.
- `@zxing/browser` no tiene imports runtime; su necesidad depende del futuro contrato QR.
- No hay reporte de bundle por módulo instalado. Añadir un visualizer estaba fuera de alcance.
- Los scripts disponibles no separan E2E read-only de generadores de evidencia.

## 20. Roadmap por microfrentes

| Orden | Ticket propuesto | Objetivo único / IDs | Prerequisitos | Paths probables | No-objetivos | Aceptación y pruebas | Evidencia humana | Complejidad / riesgo |
|---|---|---|---|---|---|---|---|---|
| 1 | `GVO_DEBT_002_GLOBAL_COMPLETION_INTEGRITY_AND_STATION_GUARDS` | cerrar `PROG-001` | contrato de completion documentado | confirmados: `progress.storage.ts`, `router.tsx`, roots W1–W3 y tests; estimados: config de transiciones | no checkpoints parciales, no visual, no schema nuevo | W1–W5 escriben completion una vez; guards de direct/transition/Final; revisita válida; corrupción fail-closed | walkthrough flujo normal, direct y Final | M / alto |
| 2 | `GVO_DEBT_003_VERSIONED_PROGRESS_SCHEMA_AND_MIGRATION_CONTRACT` | `PROG-003` | inventario de payloads | progress/world5/reset/tests | no UI por Mundo | fixtures v1/unknown/corrupt, migración idempotente y rollback | aprobación de política de datos | L / alto |
| 3 | `GVO_DEBT_004_GLOBAL_STORAGE_FAILURE_CONTRACT` | `STOR-001` | schema decidido | progress + W4 UI/tests | no rediseño W4 | storage absent/read/write con estado recuperable | aprobación del estado de error | S–M / medio |
| 4 | tickets `W1/W2/W3/W4_CHECKPOINT_PERSISTENCE` | `PROG-002`, `W3-SAVE-001` por Mundo | tickets 2–3 | root de un Mundo + store común + tests | no mezclar Mundos | reload/close/revisit/idempotencia por checkpoint | walkthrough y aprobación por pantalla | M cada uno / alto |
| 5 | `GVO_DEBT_005_LOADING_TIMELINE_E2E_CONTRACT_ALIGNMENT` | `TEST-001` | decidir duración | timeline + smoke spec | no rediseño Loading | spec focal verde sin timeout arbitrario | confirmar timing | XS / bajo |
| 6 | `GVO_DEBT_006_E2E_ARTIFACT_ISOLATION` | `TEST-002` | clasificar generadores | tests/e2e + config | no borrar evidencia histórica | suite read-only no toca tracked | no aplica visual | S / medio |
| 7 | `GVO_DEBT_007_FINAL_REVIEW_RETURN_SAFE_AREA_LAYOUT` | `W2-REVIEW-001` | matriz nueve rutas | review CSS + tests | no reabrir Final art/motion | cero colisiones portrait/landscape/zoom | aprobación visual de retornos | S–M / alto |
| 8 | `GVO_DEBT_W2_A11Y_LEGIBILITY_AND_REFLOW` | `W2-A11Y-001`, validar `W2-CAPTURE-001` | evidencia visual completa | CSS/components W2 | no reconstrucción artística | lectura/reflow/targets/contraste, gating intacto | aprobación W2 | M / alto |
| 9 | `GVO_DEBT_008_IMMERSIVE_SHELL_CONTRACT_AND_PROTOTYPE` | `IMM-001` | safe-area matrix | shell/app/immersive | no fullscreen automático | gesto, fallback, standalone, sin overlays | aprobación transversal | M / alto |
| 10 | `GVO_DEBT_009_QR_ROUTE_CONTRACT_AND_GUARDS` | `QR-001` | contrato físico y `PROG-001` | QR/router/package | no permisos/scanner sin autorización | IDs válidos/inválidos y guards | prueba con QR físico | M / medio |
| 11 | `GVO_DEBT_010_PWA_PRECACHE_BUDGET_AND_RUNTIME_CACHE_PLAN` | `PWA-001` | presupuesto offline | Vite/assets/tests | no recomprimir/mover arte | instalación/update/offline por Mundo | prueba dispositivo | L / alto |
| 12 | `GVO_DEBT_011_ROUTE_CHUNKING_MEASUREMENT_AND_SAFE_SPLIT` | `PERF-001` | métricas y PWA plan | router/build | no split especulativo | presupuesto JS, transiciones/preload/offline verdes | evidencia de carga | M / alto |
| 13 | `GVO_DEBT_012_DEPLOY_ARTIFACT_ASSET_EXCLUSION_CONTRACT` | `ASSET-001` | decisión hosting/política | pipeline/config | no mover current-used | artefacto menor, trazabilidad intacta | aprobación de proceso | M / alto |
| 14 | `GVO_DEBT_013_CANONICAL_STATUS_AND_ASSET_DOC_RECONCILIATION` | `DOC-001` | autoridad 021P | docs vigentes | no reescribir actas | cero contradicciones actuales | revisión humana documental | S / bajo |

El orden prioriza el contrato base de progreso y evita mezclar persistencia con rediseño visual.

## 21. Siguiente ticket recomendado

Recomiendo **únicamente** `GVO_DEBT_002_GLOBAL_COMPLETION_INTEGRITY_AND_STATION_GUARDS`.

Objetivo único: lograr que el cierre real de cada Mundo I–V alimente una verdad global coherente y que las rutas/transiciones respeten esa verdad, preservando la revisita desde Final. Debe incluir migración compatible sólo si es imprescindible para el valor actual de `gvo.progress.v1`; no debe añadir checkpoints parciales, rediseños, fullscreen, cambios PWA, assets ni copy.

Criterios mínimos: W1–W5 completion idempotente; guard secuencial en entrada directa y transición; Final requiere recorrido global coherente; corrupción/storage falla cerrado con UX existente; revisita desde `/final` continúa permitida; reset conserva su allowlist contractual; pruebas unitarias y Chromium focales sin escribir evidencia tracked.

Este ticket no fue ejecutado.

## 22. Qué no debe tocarse todavía

- Gates 5–8, assets, composición, motion y copy aprobado del Mirador.
- `FinalRootScreen`, `FinalLiaMotion` y timings 640/5200 ms salvo regresión específica.
- Allowlist/rollback del reset y sus cuatro keys.
- Identidad de Lía, audio, APIs externas, CDN o dependencias nuevas.
- Assets runtime/mirrors ni `current-used`; no mover, recomprimir o convertir.
- Arte/portales de Portada sin definición, producción y aprobación humana.
- Mundo IV visual por actuar como control; sólo contratos transversales demostrados.
- Rediseño completo de Mundo II; primero legibilidad/reflow con evidencia.
- Code splitting, precache o exclusión de dist antes de presupuestos y tests offline.
- Promoción de `TEMP` a `FINAL` sin aprobación editorial humana.
- QR scanner/permisos de cámara sin ticket explícito.

## 23. Pruebas y comandos ejecutados con resultado

| Comando/acción | Resultado |
|---|---|
| Preflight Git + `ls-remote` | PASS exacto; sin fetch |
| búsquedas `rg`, lectura de código/docs/config/tests | PASS |
| `npm run audit:assets` | PASS: sin URLs externas, CDN ni audio |
| `npm run lint` | PASS |
| `npm run test` | PASS: 30/30 archivos, 332/332 tests; 82,02 s |
| `npm run build` | PASS: 600 módulos; JS 782,15 kB; CSS 348,83 kB; PWA 278 entradas/130508,80 KiB; warnings conocidos |
| `npx prettier --check <informe>` | WARN/exit 1: Prettier propone cambios de estilo; no se ejecutó `--write` porque el ticket prohíbe autofix de formato |
| Chromium focal `smoke.spec.ts` + `world5-st5-020g.spec.ts` | 14 PASS / 1 FAIL; W5 3/3 PASS |
| Repetición aislada del fallo smoke | FAIL reproducible 1/1: timeout 5 s vs timeline reduced 12 s |
| Suite E2E completa | no ejecutada: varios specs escriben/reescriben `docs/visual/**`; hacerlo violaría el scope |
| Browser visual 390×844 / 844×390 | Portada y W1–W5 inspeccionados; W2 overlay reproducido; W1–W3 reload reproducido; W5 0/4→4/4, Final y reapertura verificados |
| Offline real tras apagar preview | no completado: política del navegador bloqueó la navegación al origen local apagado |
| Zoom 200 % literal | no ejecutado: capability no disponible; no se afirmó sustituto equivalente |
| Tablet/desktop pictórico completo | no ejecutado en esta corrida; revisión limitada a CSS/tests existentes |

La primera corrida de Vitest con límite de 120 s fue abortada por timeout de la herramienta sin resumen; no dejó procesos huérfanos. La repetición con margen terminó verde en 82,02 s.

Los archivos de `test-results` creados por las pruebas focales se limpiaron. El build generó `dist/` como artefacto ignorado; no aparece como cambio tracked.

## 24. Archivos creados o modificados

Único archivo creado:

- `docs/status/GVO_DEBT_001_PROJECT_DEBT_AUDIT_AND_PRIORITIZATION_FOR_REVIEW.md`

No se modificaron código, tests, configuración, assets, manifests, lockfiles, actas cerradas ni otros documentos.

## 25. Declaración de alcance y cierre técnico

- Cero implementación funcional.
- Cero cambio de comportamiento runtime.
- Cero assets generados, movidos o integrados.
- Cero `git fetch`.
- Cero commit.
- Cero push.
- Cero Pull Request.
- Mirador/Gates 5–8 permanecen congelados.
- Resultado `PENDING_HUMAN_REVIEW`; no equivale a aprobación ni publicación.

`GVO_DEBT_001_AUDIT_COMPLETE`
