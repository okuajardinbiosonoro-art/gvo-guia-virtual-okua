# GVO_DEBT_006P — Aprobación humana y publicación de World III Durable Records and Save Semantics

## 1. Identidad y autoridad

| Campo             | Valor                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Proyecto          | GVO — Guía Virtual OKÚA                                                                                                                      |
| Fase              | `PROJECT DEBT CORRECTION`                                                                                                                    |
| Fecha             | 2026-08-06 (`America/Bogota`)                                                                                                                |
| Baseline          | `924157ca336db2aa82ac0e50181b187a69d46b53`                                                                                                   |
| Informe histórico | [GVO_DEBT_006_WORLD3_DURABLE_RECORDS_AND_SAVE_SEMANTICS_FOR_REVIEW.md](GVO_DEBT_006_WORLD3_DURABLE_RECORDS_AND_SAVE_SEMANTICS_FOR_REVIEW.md) |
| Autoridad humana  | Ing. José David                                                                                                                              |
| Estado humano     | `HUMAN_APPROVED`                                                                                                                             |
| SHA publicado     | `SELF`                                                                                                                                       |

El informe técnico histórico permanece byte-idéntico, conserva su SHA-256
`ed47283a177a71e60d724df03ac6e6e37b16ba239b3d8ee792ec1f16b40d3b8f`
y mantiene el estado `PENDING_HUMAN_REVIEW`. Esta acta posterior registra la
aprobación humana vinculante y la publicación del changeset descrito allí.

`SELF` identifica el único commit que contiene la implementación, el informe
histórico, esta acta y la actualización mínima de `CURRENT_STATE.md`. Adquiere
efecto de publicación cuando ese mismo commit queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende:

- checkpoint versionado de Mundo III en `localStorage:gvo.station3.v1`, con
  `schemaVersion: 1`, prefix de registros completados y timestamp ISO canónico;
- prefix estricto `planta → prototipo → senal`, sin inicio tardío, huecos,
  duplicados, orden invertido, IDs desconocidos ni campos extra;
- `Guardar registro` con escritura, relectura y verificación antes de
  `confirmed`, `Pista registrada`, unlock o inicio del cierre;
- PLANTA durable antes del cierre de `680 ms` y desbloqueo de PROTOTIPO;
- PROTOTIPO durable antes del cierre de `800 ms` y desbloqueo de SEÑAL;
- SEÑAL durable antes del cierre de `800 ms` y el sello `AJUSTADO`;
- fallo cerrado y retry que repite únicamente la escritura pendiente, sin
  reiniciar narrativas ni duplicar timers, page-turns o writes;
- reload, reapertura y revisita con restauración del prefix durable;
- narrativas no guardadas reiniciadas desde `observe`, `assembly` o
  `capturing`, sin serializar fases intermedias;
- registros guardados abiertos directamente en summary de revisita;
- `unlocking` del sello sólo cuando SEÑAL se guarda en el montaje actual y
  restore completo directamente en `ready`;
- completion global separada, escrita sólo desde `Continuar`, con completion
  existente como autoridad superior;
- recovery explícito con raw inválido preservado;
- reset transaccional ampliado a ocho keys, con snapshot, verificación,
  rollback byte-exacto y retry con snapshot nuevo;
- visuales, CSS, assets, copy editorial y timings intactos.

No se serializan narrative stages, annotation stages, typing, page-turns,
timers, animación de sello, pending action, foco, scroll, geometry, modalidad de
retorno, highlighting, salida ni completion global.

## 3. Checkpoint, restore y recovery publicados

El schema publicado es:

```ts
type World3CheckpointV1 = {
  schemaVersion: 1;
  completedRecordIds: Station3RecordId[];
  updatedAt: string;
};
```

Los estados de lectura son `empty`, `ok`, `corrupt`, `unknown_version` y
`storage_unavailable`. Write y remove se verifican por relectura; un write del
mismo estado estable es idempotente. JSON corrupto, versión desconocida, shape
inválida y campos extra conservan el raw y fallan cerrado.

Fresh no escribe al montar. Los prefixes `[planta]` y
`[planta, prototipo]` restauran únicamente los registros durables y habilitan
el siguiente. El prefix completo restaura tres registros, sello `ready` y CTA
sin repetir `unlocking`. Completion global que ya contiene Mundo III prevalece
sobre checkpoint vacío, parcial o inválido sin borrar ni reescribir su raw.

El recovery bloquea las entradas. Corrupción y versión desconocida permiten
reintentar lectura o descartar sólo `gvo.station3.v1` mediante confirmación
explícita y eliminación verificada. Ante storage no disponible, la primera
acción es retry. El copy operativo permanece `TEMP`.

## 4. Reset de ocho keys

La allowlist publicada queda ordenada así:

1. `localStorage:gvo.progress.v1` — `global-progress`.
2. `localStorage:gvo.station1.v1` — `world-one-state`.
3. `localStorage:gvo.station2.v1` — `world-two-state`.
4. `localStorage:gvo.station3.v1` — `world-three-state`.
5. `localStorage:gvo.station4.v1` — `world-four-state`.
6. `localStorage:gvo.station5.v1` — `world-five-state`.
7. `localStorage:gvo.coverIntro.introCompleted.v1` — `cover-completion`.
8. `sessionStorage:gvo.final.reviewContext.v1` — `final-review-context`.

Snapshot, success, rollback y retry abarcan las ocho keys. Raw W3 válido,
corrupto o de versión desconocida se restaura byte-exacto ante fallo
intermedio. Preferencias, hints, accesibilidad, tema, idioma, Cache
Storage/service worker, configuración, credenciales, tokens, presets de
desarrollo y familias ajenas permanecen fuera del reset.

## 5. Evidencia técnica publicada

| Validación             | Resultado                                                        |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run audit:assets` | PASS                                                             |
| `npm run lint`         | PASS                                                             |
| `npm run test`         | PASS — 464/464 en 34 archivos                                    |
| `npm run build`        | PASS — 606 módulos                                               |
| E2E focal DEBT_006     | PASS — 3/3                                                       |
| `npm run test:e2e`     | PASS — 103/103                                                   |
| Working diff check     | PASS                                                             |
| Cached diff check      | `KNOWN_EXCEPTION` — 3 hard-breaks Markdown del informe congelado |
| Filtered cached diff   | PASS                                                             |

La comprobación read-only incluye status, name-status, stat, SHA-256 por cada
path, hash binario del diff y manifest de `docs/visual/**` antes y después de la
suite E2E completa. Los 12 paths permanecen idénticos y la suite no escribe
evidencia tracked.

Warnings aceptados y documentados:

- chunk principal superior a 500 kB;
- desglose informativo `PLUGIN_TIMINGS`;
- preload operativo de Portada;
- avisos informativos LF→CRLF de Git.

## 6. Alcance preservado

- No se modificaron CSS, composición visual, assets, binarios, manifests,
  identidad de Lía, copy editorial aprobado ni timings.
- Mundo I, Mundo II, Mundo IV, Mundo V, Final y Mirador conservan sus runtimes;
  sólo se reconcilia el test histórico de progreso autorizado para la octava
  key de reset.
- No se modificaron guards globales ni el schema `gvo.progress.v1`.
- No se añadieron PWA, QR, immersive shell, audio, video, CDN, fuentes remotas,
  APIs externas, dependencias ni cambios de lockfile.
- No se reescribieron actas históricas ni evidencia bajo `docs/visual/**`.
- No se declaran resueltas las deudas restantes ni terminada la fase completa
  `PROJECT DEBT CORRECTION`.

## 7. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_006 — WORLD III DURABLE RECORDS AND SAVE SEMANTICS / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_006 — WORLD III DURABLE RECORDS AND SAVE SEMANTICS / HUMAN_APPROVED / PUBLISHED
```
