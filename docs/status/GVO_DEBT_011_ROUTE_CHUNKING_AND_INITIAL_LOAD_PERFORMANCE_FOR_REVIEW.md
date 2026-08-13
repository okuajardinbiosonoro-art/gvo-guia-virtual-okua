# GVO_DEBT_011 — Route Chunking and Initial Load Performance

Estado: `PENDING_HUMAN_REVIEW`

Fecha técnica: 2026-08-13

## Resultado

`GVO_DEBT_011_IMPLEMENTATION_COMPLETE_FOR_REVIEW`

Se separaron Transición, Mundos I–V y Mirador del bundle crítico. Carga
inicial, Portada, shell, rutas, guards, progreso, checkpoints, reset, QR,
composición, copy y assets conservan sus contratos. No se agregaron
dependencias, no se modificó el lockfile y no se creó commit, push ni PR.

## Baseline

- HEAD inicial y final: `eb4761e22e2d85634e4aef75bb13a8862610fc69`.
- `origin/main`: `eb4761e22e2d85634e4aef75bb13a8862610fc69`.
- Rama: `main`.
- Divergencia inicial: `0 ahead / 0 behind`.
- Worktree inicial: limpio.
- Worktree final: cambios de este ticket sin stage ni commit.

## Auditoría inicial

El build exacto del baseline entregaba:

- un solo JS inicial `index-C3QmAP1L.js`: `818.393` bytes minificados;
- un solo CSS inicial `index-CYu3be2N.css`: `363.429` bytes;
- ningún chunk de ruta;
- precache PWA: `49` entradas y `15.390,89 KiB`;
- todas las pantallas importadas estáticamente desde `src/app/router.tsx`.

Peso de fuente auditado por familia de pantalla:

| Familia       | Archivos | Bytes de fuente |
| ------------- | -------: | --------------: |
| Carga inicial |       13 |          55.232 |
| Portada       |       10 |          88.892 |
| Transición    |       13 |          74.376 |
| Mundo I       |       13 |         210.109 |
| Mundo II      |       15 |         361.761 |
| Mundo III     |       21 |         317.300 |
| Mundo IV      |       18 |         205.915 |
| Mundo V       |       13 |         117.864 |
| Mirador       |        6 |          74.014 |

Las rutas más costosas por fuente eran Mundo II, Mundo III, Mundo I y Mundo
IV. La clasificación aplicada fue:

- A crítica inicial: shell, Carga inicial y Portada;
- B transición: componente compartido de Transición;
- C rutas: Mundos I–V y Mirador.

Antes del cambio, la navegación no descargaba módulos entre estaciones porque
todo el código ya estaba incluido en el JS inicial. Las transiciones mantenían
su contrato automático de `2300 ms` o `1000 ms` con reduced motion.

## Implementación

- `src/app/routeModules.ts` declara un loader dinámico explícito por
  Transición, Mundo y Mirador.
- `React.lazy` y un límite `Suspense` compartido montan las rutas diferidas con
  un fallback accesible y sin cambiar rutas públicas.
- Portada precarga Transición sólo al recibir intención explícita de abrir el
  Portal I.
- Cada transición inicia una única carga del módulo destino y navega cuando la
  promesa está resuelta; ante fallo de importación conserva la misma ruta
  pública mediante navegación completa.
- El JS/CSS inicial continúa en precache. Los chunks JS/CSS de rutas usan el
  cache runtime same-origin existente al ser solicitados. No cambió la
  estrategia A/B/C/D de `GVO_DEBT_010`.
- Las pruebas históricas que medían inmediatamente después de `page.goto`
  ahora esperan el DOM de la pantalla lazy o conceden el presupuesto de carga
  antes de medir; no cambió el runtime para satisfacerlas.

La decisión está documentada en
`docs/decisions/ADR-0005-route-chunking-y-preload-controlado.md` y la
arquitectura técnica fue actualizada.

## Performance

### Bundle inicial

| Métrica                            |    Before |     After |                 Diferencia |
| ---------------------------------- | --------: | --------: | -------------------------: |
| JS inicial minificado/decodificado | 818.393 B | 529.005 B |      -289.388 B (-35,36 %) |
| JS inicial transferido en sonda    | 235.532 B | 164.768 B |       -70.764 B (-30,05 %) |
| CSS inicial minificado             | 363.429 B |  56.430 B |      -306.999 B (-84,47 %) |
| CSS inicial transferido en sonda   |  65.653 B |  11.324 B |       -54.329 B (-82,75 %) |
| Scripts iniciales                  |         1 |         1 | sin solicitudes duplicadas |

Vite conserva un warning informativo porque el JS inicial de `529,00 kB` aún
supera su umbral de `500 kB`. El warning anterior correspondía a `818,39 kB`.

### Chunks por ruta

| Ruta lógica |       JS |       CSS |
| ----------- | -------: | --------: |
| Transición  | 13.238 B |  18.197 B |
| Mundo I     | 17.382 B |  27.017 B |
| Mundo II    | 50.780 B | 122.563 B |
| Mundo III   | 53.937 B |  62.145 B |
| Mundo IV    | 56.624 B |  24.914 B |
| Mundo V     | 21.868 B |  15.763 B |
| Mirador     | 19.097 B |  10.288 B |

Los siete pares JS/CSS existen una sola vez. Ninguno quedó en el precache; no
hay doble descarga inducida por un preload declarativo adicional.

### First load

Medición diagnóstica local con Chromium headless, `vite preview`, service
worker bloqueado y cinco contextos nuevos por estado:

| Mediana                | Before |  After |
| ---------------------- | -----: | -----: |
| DOMContentLoaded       | 107 ms | 119 ms |
| load                   | 108 ms | 119 ms |
| First Contentful Paint | 272 ms | 336 ms |

La sonda loopback confirma la reducción de transferencia, pero no demuestra
una mejora de latencia: las muestras de FCP no estuvieron disponibles en todos
los contextos y la variación local fue mayor que la diferencia observada. Por
eso la aceptación se sustenta en bytes, separación verificable, continuidad
E2E y comportamiento offline, no en una afirmación de tiempo no concluyente.

### Preload y route loading

- Primera carga y Portada: no solicitan componentes de Transición, Mundos ni
  Mirador.
- Portal I: precarga el módulo Transición sólo al iniciar la apertura.
- Transiciones: precargan el módulo de su destino antes del handoff.
- Acceso directo: cada Mundo y Mirador solicita su módulo al entrar.
- QR-W5: conserva el guard y entrega el chunk autorizado de Mundo V.
- Producción offline: después de visitar Mundo III, su JS y CSS aparecen en
  `gvo-runtime-assets-v1`; una recarga offline de `/estacion/3` vuelve a montar
  `.s3-screen` bajo control de `/sw.js`.

## PWA

- Precache final: `49` entradas, `14.808,65 KiB`.
- Shell, fuentes, Carga inicial y Portada permanecen en clase A.
- JS/CSS de rutas se incorporan al matcher same-origin del cache runtime como
  compatibilidad necesaria para el nuevo empaquetado.
- El fallback de navegación, `autoUpdate`, limpieza, cache name, expiración y
  garantía offline para recursos B/C visitados permanecen intactos.
- No se promete uso offline de una ruta nunca visitada.

## Pruebas

- `npm run audit:assets`: PASS; sin URLs externas, CDN ni audio.
- `npm run lint`: PASS.
- `npm test`: PASS; `37` archivos, `490` tests.
- `npm run build`: PASS; `602` módulos transformados, PWA generada.
- `node tools/qa/gvo_debt_011_verify_chunks.mjs`: PASS; reducción `35,36 %`,
  siete pares de ruta y cero chunks de ruta precacheados.
- `tests/e2e/gvo-debt-011-route-chunking.spec.ts`: PASS; `5/5`.
- Sonda offline de producción: PASS; Mundo III visitado recarga offline con
  JS/CSS desde runtime cache.
- `npm run test:e2e`: PASS final; `146/146` en `15,1 min`.

Durante la validación global se detectaron esperas históricas incompatibles
con el nuevo límite lazy. Los tres casos geométricos afectados pasaron `3/3`
tras esperar el DOM real; el recorrido de progreso I–III pasó focalmente y la
última batería global terminó `146/146`.

## Archivos creados

- `docs/decisions/ADR-0005-route-chunking-y-preload-controlado.md`
- `docs/status/GVO_DEBT_011_ROUTE_CHUNKING_AND_INITIAL_LOAD_PERFORMANCE_FOR_REVIEW.md`
- `src/app/routeModules.ts`
- `src/app/routeModules.test.ts`
- `tests/e2e/gvo-debt-011-route-chunking.spec.ts`
- `tools/qa/gvo_debt_011_browser_probe.mjs`
- `tools/qa/gvo_debt_011_measure_initial_load.mjs`
- `tools/qa/gvo_debt_011_verify_chunks.mjs`

## Archivos modificados

- `docs/05_ARQUITECTURA_TECNICA.md`
- `src/app/router.tsx`
- `src/screens/Cover/CoverIntroScreen.tsx`
- `tests/e2e/gvo-debt-002-progress-integrity.spec.ts`
- `tests/e2e/gvo-debt-007-final-review-return-safe-area.spec.ts`
- `tests/e2e/world5-st5-020e.spec.ts`
- `vite.config.ts`

## Fuera de alcance confirmado

Sin cambios en progreso, checkpoints, reset, contrato QR, rutas públicas,
comportamiento de Mirador, copy, identidad de Lía, composición, assets
canónicos, dependencias, `package.json` ni lockfile. No se modificó
`docs/status/CURRENT_STATE.md` porque este ticket permanece pendiente de
revisión humana.

## Estado final

`PENDING_HUMAN_REVIEW`

Sin commit. Sin push. Sin PR.
