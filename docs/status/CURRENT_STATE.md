# Estado actual del proyecto

Actualizado: 2026-08-13

## Estado canónico

- Estación III / Mundo III — Cuaderno Pixel de Pruebas: `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`).
- Estación IV / Mundo IV — Mesa de sistema: `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`) por el cierre `GVO_ST4_018E`.
- Ruta runtime de Estación IV: `/estacion/4`, servida por `World4RootScreen`.
- Cadena aprobada: `Planta → Bionosificador → ESP32 → MIDI → Wi‑Fi/UDP → Router → Sistema central → Sonido`.
- Contrato completo de Estación IV: [GVO_ST4_018E_STATION4_CLOSEOUT.md](GVO_ST4_018E_STATION4_CLOSEOUT.md).
- Contrato completo de Estación III: [GVO_STATION3_COMPLETE.md](GVO_STATION3_COMPLETE.md).
- Contrato previo de Mundo II: [WORLD_II_FINAL.md](../worlds/WORLD_II_FINAL.md).

## Estado global verificable

| Tramo         | Estado vigente                                                                                                                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Carga inicial | `APROBADA_PARA_AVANZAR / 7.2_DE_10`, con deuda visual documentada.                                                                                                                                                                                                                                                             |
| Portada       | `APROBADA_PARA_AVANZAR / 7.8_DE_10`, no cerrada final.                                                                                                                                                                                                                                                                         |
| Mundo I       | Runtime activo, interacción refinada y deuda visual documentada.                                                                                                                                                                                                                                                               |
| Mundo II      | `GVO_DEBT_008 — WORLD II LEGIBILITY AND RESPONSIVE READABILITY / HUMAN_APPROVED / PUBLISHED`; seis capas, reflow, zoom `200%`, targets `44×44` y revisita desde Mirador validados.                                                                                                                                             |
| Transiciones  | `TRANSITION_COPY_AUDIT_COMPLETE`: seis rutas y doce piezas finales `FINAL / human_approved`; pasivas y automáticas.                                                                                                                                                                                                            |
| Mundo III     | `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.                                                                                                                                                                                                                                                                                     |
| Mundo IV      | `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.                                                                                                                                                                                                                                                                                     |
| Mundo V       | `ST5_020H_HUMAN_APPROVED`; `ESTACIÓN V CERRADA PARA EL ALCANCE ACTUAL`, con 4/4, CTA, persistencia global, guardas y salida validados.                                                                                                                                                                                         |
| W5→Final      | Copy final `Abriendo el Mirador / Preparando el cierre del recorrido.`; ruta protegida, pasiva y automática.                                                                                                                                                                                                                   |
| Final         | `GVO FINAL — MIRADOR PHASE / COMPLETE`. Gates 5–8 `HUMAN_APPROVED / COMPLETE`: assets, copy, composición responsive, motion/reduced motion, retorno en revisita y reset real con snapshot, rollback y retry publicados. Las deudas transversales se transfieren a `PROJECT DEBT CORRECTION`; no se declara terminado todo GVO. |
| Shell / QR    | `GVO_DEBT_009AB — QR SMOKE STABILITY / HUMAN_APPROVED / PUBLISHED`; acceso inmersivo compartido, contrato QR de producción, guards y matriz E2E integral `141/141` publicados.                                                                                                                                                 |

Los documentos históricos conservan el estado real de su fecha. En particular,
los flags parciales de `018C_R1` y `018D` no se reescriben: `018E` incorpora la
aprobación humana vinculante y cierra Estación IV sin alterar esos registros.

## Contrato de Estación IV

La composición usa un artboard único `1536×1024`, texto arriba y mesa abajo.
Los anchors, escalas, bboxes alfa y capas se resuelven en coordenadas de
artboard, sin offsets por viewport.

Capas aprobadas:

```text
z0  environment
z1  rear depth plane
z2  haze
z3  contact shadow
z4  lower base
z5  front edge — preservado, excluido del render por revisión humana
z6  tabletop
z7  passive route
z8  halo
z9  pedestal
z10 object
z11 Lía
z12 DOM/UI
```

La decisión z5 queda registrada como `front-edge-disabled-by-human-review`;
z1 permanece retenido. Los 20 assets runtime y sus 20 espejos `current-used`
son byte-idénticos. El master genérico rechazado no existe como archivo, import
ni entrada de precache.

## Interacción, movimiento y acceso

- Progreso secuencial 1→8 con estados locked, available, active y completed.
- Revisión libre después del cierre, sin duplicar progreso.
- Ruta pasiva PNG con overlay SVG activo de siete segmentos.
- Un FX semántico por nodo, Lía mediante poses existentes `greeting` y
  `explain_calm`, tarjeta DOM, ayuda tap y ambiente técnico contenido.
- Chain complete, CTA y salida hacia la transición existente W4→W5.
- Pointer, toque, Enter y Space; controles nativos, foco visible, hit targets
  de al menos 44×44 y estados no dependientes sólo del color.
- `prefers-reduced-motion` conserva comprensión y secuencia sin travel, drift
  ni loops decorativos.
- Portrait está soportado; mobile landscape es recomendado. `OrientationHint`
  es no bloqueante y fullscreen sólo se inicia mediante gesto explícito.

## PWA, red y sonido

El build mantiene manifest y service worker. La PWA instalada no pudo
certificarse en la plataforma de QA y no se declara validada. En despliegue
LAN, la instalación PWA real requiere un origen seguro. La experiencia no
añade audio y no depende de CDN, URL externa ni servicio remoto runtime.

## QA y aprobación

El cierre de Estación IV integra la evidencia de los microfrentes 018A→018D y
la aprobación humana vinculante de 018E. La suite final, build/PWA, auditoría
de assets, hashes, áreas congeladas y smoke global se registran en el reporte
externo del cierre. Los resultados históricos 018D incluyen 42/42 tests focales,
242/242 globales, 15 contact sheets y un WebM real.

## Estado de Estación V

El mapa, Plantas, Sistema, Espacio, Visitante y el estado interno 4/4 están
humanamente aprobados por `ST5_020G_HUMAN_APPROVED`. El progreso local
`gvo.station5.v1` acepta el prefijo exacto
`['plantas','sistema','espacio','visitante']`; tras 4/4 permite revisita libre
de las cuatro áreas.

`ST5-020H`, aprobado humanamente, muestra `Ir al cierre` solo en el overview
4/4. La activación verifica
la escritura de Estación V en `gvo.progress.v1` antes de entrar a la transición
W5→Final; un fallo conserva el 4/4 y permite reintentar. La transición y Final
están protegidas antes del cierre global. La evidencia técnica vigente está en
[GVO_ST5_020H_CIERRE_ESTACION_V_Y_SALIDA_W5_FINAL_PARA_REVISION.md](GVO_ST5_020H_CIERRE_ESTACION_V_Y_SALIDA_W5_FINAL_PARA_REVISION.md).
El cierre editorial global está en
[GVO_ST5_020I_CIERRE_EDITORIAL_GLOBAL_TRANSICIONES.md](GVO_ST5_020I_CIERRE_EDITORIAL_GLOBAL_TRANSICIONES.md).
Final tiene cierre editorial humano de 35 slots, documentado en
[GVO_FINAL_EDITORIAL_COPY_HUMAN_APPROVED.md](GVO_FINAL_EDITORIAL_COPY_HUMAN_APPROVED.md).
El DOM consume los 30 slots base sin `TEMP` ni `excel_pending`; los cinco slots
operativos permanecen registrados y no consumidos. Su preproducción, Art Bible,
cámaras y dirección visual están humanamente aprobadas por
[GVO_FINAL_021C_APROBACION_HUMANA_ART_BIBLE_CAMARA_Y_DIRECCION_VISUAL.md](GVO_FINAL_021C_APROBACION_HUMANA_ART_BIBLE_CAMARA_Y_DIRECCION_VISUAL.md),
con Gates 1–4 cerrados. `GVO_FINAL_021I` registra desde el paquete humano
aprobado seis Environment, seis Access, cuatro UI y tres assets de Lía bajo
`public/assets/gvo/stations/final-root/`, con 19 mirrors byte-idénticos en
`current-used/final-root` y manifest canónico. Gate 5 queda
`ASSETS PRODUCED_AND_APPROVED / COMPLETE`; las cinco fuentes de producción de
Lía permanecen fuera de `public`, `dist` y precache. 021J, R1 y 021K consumen
desde el registry tipado los 18 assets autorizados para la composición estática.
021M integra greeting, idle y glow desde el mismo registry tipado, sin cambiar
binarios ni rutas `current-used`.

`GVO_FINAL_021L` registra la aprobación humana vinculante de portrait,
landscape, los tres carryovers y la composición responsive. Gate 6 queda
`STATIC COMPOSITION / HUMAN_APPROVED / COMPLETE` y publicado. `GVO_FINAL_021N`
registra la aprobación humana vinculante de greeting, idle, reduced motion y
visibility handling; Gate 7 queda `LIA MOTION / HUMAN_APPROVED / COMPLETE` y
publicado. `GVO_FINAL_021O` implementa retorno en revisita y reset real con
allowlist, snapshot, verificación, rollback y retry. Su acta conserva el estado
histórico `PENDING_HUMAN_REVIEW`; `GVO_FINAL_021P` registra la aprobación humana
posterior, publica el changeset y cierra Gate 8.

El contexto de revisita usa navigation state preferido y respaldo de refresh en
`sessionStorage:gvo.final.reviewContext.v1`. El control global se limita a las
nueve rutas válidas de Mundos I–V y vuelve a `/final` sin alterar el progreso.
El reset elimina exclusivamente `localStorage:gvo.progress.v1`,
`localStorage:gvo.station1.v1`, `localStorage:gvo.station2.v1`,
`localStorage:gvo.station3.v1`,
`localStorage:gvo.station4.v1`,
`localStorage:gvo.station5.v1`,
`localStorage:gvo.coverIntro.introCompleted.v1` y
`sessionStorage:gvo.final.reviewContext.v1`; preserva preferencias, hints,
accesibilidad, tema, idioma, Cache Storage/service worker, configuración,
credenciales/tokens y cualquier dato no demostrado como recorrido.

```text
GATE 5 — ASSETS PRODUCED_AND_APPROVED / COMPLETE
GATE 6 — STATIC COMPOSITION / HUMAN_APPROVED / COMPLETE
GATE 7 — LIA MOTION / HUMAN_APPROVED / COMPLETE
GATE 8 — REVISIT RETURN AND REAL RESET / HUMAN_APPROVED / COMPLETE
GVO FINAL — MIRADOR PHASE / COMPLETE
```

El cierre del Mirador no absorbe las deudas transversales: consistencia de
progreso entre Mundos, persistencia versionada, hidratación antes de guards,
recuperación tras reload/reconexión, continuidad offline-first, fullscreen,
auditoría de Mundos I–V y optimización del chunk principal permanecen en la
fase `PROJECT DEBT CORRECTION`.

## Estado de la corrección de deuda del proyecto

La fase `PROJECT DEBT CORRECTION` está activa. La auditoría técnica conserva su
registro histórico `PENDING_HUMAN_REVIEW` en
[GVO_DEBT_001_PROJECT_DEBT_AUDIT_AND_PRIORITIZATION_FOR_REVIEW.md](GVO_DEBT_001_PROJECT_DEBT_AUDIT_AND_PRIORITIZATION_FOR_REVIEW.md)
y su aprobación humana vinculante está publicada en
[GVO_DEBT_001P_PROJECT_DEBT_AUDIT_AND_PRIORITIZATION_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_001P_PROJECT_DEBT_AUDIT_AND_PRIORITIZATION_HUMAN_APPROVED_AND_PUBLISHED.md).

`GVO_DEBT_002` corrige y publica el primer frente funcional de esta fase. Su
informe histórico conserva `PENDING_HUMAN_REVIEW` en
[GVO_DEBT_002_PROGRESS_CORE_AND_GLOBAL_ACCESS_INTEGRITY_FOR_REVIEW.md](GVO_DEBT_002_PROGRESS_CORE_AND_GLOBAL_ACCESS_INTEGRITY_FOR_REVIEW.md),
y su aprobación humana vinculante está registrada en
[GVO_DEBT_002P_PROGRESS_CORE_AND_GLOBAL_ACCESS_INTEGRITY_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_002P_PROGRESS_CORE_AND_GLOBAL_ACCESS_INTEGRITY_HUMAN_APPROVED_AND_PUBLISHED.md).

La integridad global de completion y guards queda corregida: el payload
`gvo.progress.v1` usa `schemaVersion: 1`, acepta legacy sin inventar progreso,
falla cerrado ante corrupción, versión desconocida o storage no disponible y
verifica cada escritura. Mundos I–V registran completion global en sus cierres;
estaciones, subrutas de Mundo V, transiciones y Final exigen el prefijo completo.
La revisita desde Final también queda condicionada a esa integridad global. La
allowlist de cuatro keys publicada por DEBT_002 queda ampliada a ocho por las
autoridades posteriores de `GVO_DEBT_004`, `GVO_DEBT_005` y `GVO_DEBT_006`.

`GVO_DEBT_003` está aprobado y publicado. Su informe histórico conserva
`PENDING_HUMAN_REVIEW` en
[GVO_DEBT_003_TEST_EVIDENCE_AND_CANONICAL_STATUS_HYGIENE_FOR_REVIEW.md](GVO_DEBT_003_TEST_EVIDENCE_AND_CANONICAL_STATUS_HYGIENE_FOR_REVIEW.md),
y su aprobación humana vinculante está registrada en
[GVO_DEBT_003P_TEST_EVIDENCE_AND_CANONICAL_STATUS_HYGIENE_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_003P_TEST_EVIDENCE_AND_CANONICAL_STATUS_HYGIENE_HUMAN_APPROVED_AND_PUBLISHED.md).

La suite E2E normal queda read-only y validada `93/93`: sus outputs productores
se alojan en `test-results`, mientras la evidencia tracked requiere un comando
explícito y un scope allowlisted. Los contratos históricos quedan reconciliados
con la autoridad posterior. La activación aprobada de Lía en Portada precarga su
asset dedicado y sólo inicia el Estado A y sus 920 ms tras readiness real, con
intención única, fallo cerrado y retry controlado. Los resúmenes vivos de assets
y `current-used` quedan reconciliados sin reescribir actas históricas.

`GVO_DEBT_004` está aprobado y publicado. Su informe histórico conserva
`PENDING_HUMAN_REVIEW` en
[GVO_DEBT_004_WORLD1_WORLD4_CHECKPOINT_CONTINUITY_FOR_REVIEW.md](GVO_DEBT_004_WORLD1_WORLD4_CHECKPOINT_CONTINUITY_FOR_REVIEW.md),
y su aprobación humana vinculante está registrada en
[GVO_DEBT_004P_WORLD1_WORLD4_CHECKPOINT_CONTINUITY_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_004P_WORLD1_WORLD4_CHECKPOINT_CONTINUITY_HUMAN_APPROVED_AND_PUBLISHED.md).

Mundo I conserva un checkpoint durable versionado bajo `gvo.station1.v1` y
restaura `activeConcept` y `highestReachedConcept` sin reducir el máximo al
volver atrás. Mundo IV conserva un checkpoint durable bajo `gvo.station4.v1`
y persiste sólo estados estables: `reading`, `chain_pending` y
`completion_retry`.

`GVO_DEBT_005` está aprobado y publicado. Su informe histórico conserva
`PENDING_HUMAN_REVIEW` en
[GVO_DEBT_005_WORLD2_CHECKPOINT_CONTINUITY_FOR_REVIEW.md](GVO_DEBT_005_WORLD2_CHECKPOINT_CONTINUITY_FOR_REVIEW.md),
y su aprobación humana vinculante está registrada en
[GVO_DEBT_005P_WORLD2_CHECKPOINT_CONTINUITY_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_005P_WORLD2_CHECKPOINT_CONTINUITY_HUMAN_APPROVED_AND_PUBLISHED.md).

Mundo II conserva un checkpoint durable versionado bajo `gvo.station2.v1` y
restaura active layer, prefix visitado, gates, Captura, Mapeo y Resultado.
Mapeo y Resultado incompletos reinician sus secuencias; sus estados completos
restauran review y ready sin repetir timers. Completion global permanece
separada y se escribe sólo desde `Continuar`. El reset transaccional cubre ahora
siete keys con snapshot, verificación, rollback byte-exacto y retry.

`GVO_DEBT_006` está aprobado y publicado. Su informe histórico conserva
`PENDING_HUMAN_REVIEW` en
[GVO_DEBT_006_WORLD3_DURABLE_RECORDS_AND_SAVE_SEMANTICS_FOR_REVIEW.md](GVO_DEBT_006_WORLD3_DURABLE_RECORDS_AND_SAVE_SEMANTICS_FOR_REVIEW.md),
y su aprobación humana vinculante está registrada en
[GVO_DEBT_006P_WORLD3_DURABLE_RECORDS_AND_SAVE_SEMANTICS_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_006P_WORLD3_DURABLE_RECORDS_AND_SAVE_SEMANTICS_HUMAN_APPROVED_AND_PUBLISHED.md).

Mundo III conserva un checkpoint durable versionado bajo `gvo.station3.v1`.
Sus prefixes estables son Planta, Planta+Prototipo y
Planta+Prototipo+Señal. `Guardar registro` exige write, relectura y verificación
antes de confirmar o desbloquear el siguiente registro. Las narrativas
incompletas reinician tras reload; los registros guardados restauran su summary
de revisita. El sello `AJUSTADO` deriva del prefix durable y completion global
permanece separada bajo `Continuar`. El reset transaccional cubre ahora ocho
keys con snapshot, verificación, rollback byte-exacto y retry.

`GVO_DEBT_007A` está aprobado y publicado. Sus informes históricos conservan
`PENDING_HUMAN_REVIEW` en
[GVO_DEBT_007_FINAL_REVIEW_RETURN_SAFE_AREA_LAYOUT_FOR_REVIEW.md](GVO_DEBT_007_FINAL_REVIEW_RETURN_SAFE_AREA_LAYOUT_FOR_REVIEW.md)
y
[GVO_DEBT_007A_REVIEW_DOCK_COMPACT_PLACEMENT_FOR_REVIEW.md](GVO_DEBT_007A_REVIEW_DOCK_COMPACT_PLACEMENT_FOR_REVIEW.md);
la aprobación humana vinculante está registrada en
[GVO_DEBT_007AP_REVIEW_DOCK_COMPACT_PLACEMENT_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_007AP_REVIEW_DOCK_COMPACT_PLACEMENT_HUMAN_APPROVED_AND_PUBLISHED.md).

El retorno desde Final usa un dock compacto compartido en las nueve rutas:
`44/72` combinaciones flotan y `28/72` reservan clearance sólo cuando la
geometría lo requiere. La matriz conserva `0/72` colisiones, safe-area,
accesibilidad y modo normal intacto; reduce `51,22%` el área reservada y
`61,11%` la altura reservada promedio.

`GVO_DEBT_008` está aprobado y publicado. Su informe histórico conserva
`PENDING_HUMAN_REVIEW` en
[GVO_DEBT_008_WORLD2_LEGIBILITY_AND_RESPONSIVE_READABILITY_FOR_REVIEW.md](GVO_DEBT_008_WORLD2_LEGIBILITY_AND_RESPONSIVE_READABILITY_FOR_REVIEW.md),
y su aprobación humana vinculante está registrada en
[GVO_DEBT_008P_WORLD2_LEGIBILITY_AND_RESPONSIVE_READABILITY_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_008P_WORLD2_LEGIBILITY_AND_RESPONSIVE_READABILITY_HUMAN_APPROVED_AND_PUBLISHED.md).

Mundo II conserva sus seis capas y su comportamiento funcional. La publicación
elimina textos bajo piso, recortes, controles menores de `44px` y colisiones en
la matriz auditada; valida zoom `200%`, reflow `320px`, Planta separada de Lía,
electrodo alineado antes de `Onda medida` y revisita sin solapamientos en Señal,
Captura ni Mapeo.

`GVO_DEBT_009`, `GVO_DEBT_009A` y `GVO_DEBT_009AB` están aprobados y
publicados. Sus informes históricos conservan `PENDING_HUMAN_REVIEW` en
[GVO_DEBT_009_IMMERSIVE_SHELL_AND_QR_NAVIGATION_FOR_REVIEW.md](GVO_DEBT_009_IMMERSIVE_SHELL_AND_QR_NAVIGATION_FOR_REVIEW.md),
[GVO_DEBT_009A_PRODUCTION_QR_CONTRACT_ALIGNMENT_FOR_REVIEW.md](GVO_DEBT_009A_PRODUCTION_QR_CONTRACT_ALIGNMENT_FOR_REVIEW.md)
y
[GVO_DEBT_009AB_QR_SMOKE_STABILITY_FOR_REVIEW.md](GVO_DEBT_009AB_QR_SMOKE_STABILITY_FOR_REVIEW.md).
La aprobación humana vinculante de la reconciliación final está registrada en
[GVO_DEBT_009ABP_QR_SMOKE_STABILITY_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_DEBT_009ABP_QR_SMOKE_STABILITY_HUMAN_APPROVED_AND_PUBLISHED.md).

El shell inmersivo global conserva una sola instancia en las nueve rutas de
estación autorizadas, safe-area, targets de `44px`, teclado, touch y reduced
motion. El contrato QR de producción publica `/qr/start` y `/qr/w2`–`/qr/w5`,
sin QR para Mundo I, con identificadores estrictos, guards canónicos, fallback
seguro y cero mutaciones de almacenamiento. La reconciliación E2E acota los
selectores por pantalla, observa estados DOM explícitos y sincroniza la
revisita; la suite integral cierra `141/141` sin modificar ese runtime.

Permanecen pendientes una eventual reconstrucción visual de Captura fuera de
este alcance, PWA/precache, route chunking y el copy operativo/editorial
`TEMP`.
La fase `PROJECT DEBT CORRECTION` no se declara terminada; cada frente requiere
un ticket separado. El Mirador permanece `COMPLETE` bajo la autoridad de
`GVO_FINAL_021P`.

El cierre de assets está en
[GVO_FINAL_021I_APPROVED_ASSET_REGISTRATION_AND_GATE5_CLOSEOUT.md](GVO_FINAL_021I_APPROVED_ASSET_REGISTRATION_AND_GATE5_CLOSEOUT.md).
El cierre de composición estática está en
[GVO_FINAL_021L_STATIC_COMPOSITION_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_FINAL_021L_STATIC_COMPOSITION_HUMAN_APPROVED_AND_PUBLISHED.md).
El cierre de motion está en
[GVO_FINAL_021N_LIA_MOTION_HUMAN_APPROVED_AND_PUBLISHED.md](GVO_FINAL_021N_LIA_MOTION_HUMAN_APPROVED_AND_PUBLISHED.md).
El cierre de Gate 8 y la aprobación de 021O están en
[GVO_FINAL_021P_REVISIT_RESET_HUMAN_APPROVED_AND_MIRADOR_PHASE_COMPLETE.md](GVO_FINAL_021P_REVISIT_RESET_HUMAN_APPROVED_AND_MIRADOR_PHASE_COMPLETE.md).
El resumen general está en
[GVO_FINAL_MIRADOR_PHASE_COMPLETE.md](GVO_FINAL_MIRADOR_PHASE_COMPLETE.md).
Los registros 020A–020H y 021B–021O permanecen históricos y no se reescriben.
