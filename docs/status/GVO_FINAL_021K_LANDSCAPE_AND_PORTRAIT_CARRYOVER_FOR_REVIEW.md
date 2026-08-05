# GVO_FINAL_021K — Landscape y carryover portrait para revisión

Fecha: `2026-08-04`

Estado: `GVO_FINAL_021K_STATIC_COMPOSITION_READY_FOR_HUMAN_REVIEW`

Gate 6: `PENDING_HUMAN_REVIEW`

## Baseline y worktree

- Branch: `main`.
- HEAD: `f310abffb9370dba5f4119c4f012a2104fd36487`.
- `origin/main` local y `refs/heads/main` remoto: mismo SHA.
- Divergencia: `0/0`.
- Worktree inicial: exactamente los 21 paths heredados de 021J + 021J-R1.
- Paths iniciales inesperados/prohibidos: `0/0`.
- Staged inicial: `0`.
- No se ejecutó `fetch`, stage, commit ni push.

## Aprobación portrait y editorial

021J-R1 queda registrado como
`TECHNICAL_PASS / HUMAN_APPROVED_WITH_CARRYOVER / PORTRAIT STATIC COMPOSITION:
APPROVED`; no se registra como rechazo.

El único copy modificado es `FINAL_CREDITS_01`:

```text
Desarrollado por Momotto S.A.S.
A cargo del Ing. José David P. Z.
```

- ID: preservado.
- Estado/fuente/locale: `FINAL / human_approved / es`.
- Registro editorial, resolución en `finalEditorialSlots`, prueba, CSV, XLSX,
  resumen Markdown y contrato de slots: coordinados.
- CSV: 202 filas, 202 IDs únicos, 35 slots Final, `TEMP 0`,
  `excel_pending 0`.
- XLSX: `A1:O203`, 202 IDs, 202 únicos, cero fórmulas y cero errores de
  fórmula; formato renderizado antes/después sin alteración estructural.
- Render: dos líneas DOM mediante `<br>` y `14px` en los cuatro viewports
  portrait.

El snapshot legacy `entrega_escritor_gvo_v1/` y el `source_txt` histórico no
fueron reescritos.

## Carryover portrait

El cluster de accesos usa una única variable coordinada
`--final-access-cluster-shift-y`:

- `390×844`: `-6px`.
- `375×667`: `-8px`.
- `360×640`: `-8px`.
- `375×548`: `-6px`.

Lía usa una variable independiente `--final-lia-base-shift-y`:

- `390×844`: `+26px` respecto de R1.
- `375×667`: `+22px`.
- `360×640`: `+22px`.
- `375×548`: `+16px`.

La medición usa el bbox alpha real de F1 `[54,35,184,184]` y un anchor
pictórico del medallón de la plataforma sobre el foreground canónico. En los
cuatro viewports la base visible de Lía queda por debajo de la cresta del
barandal y antes del centro del medallón, dentro del Mirador. No hay scroll,
clipping de contenido alpha, overlaps visibles o cruces de targets.

## Composición landscape

Landscape es una composición específica y no una rotación del portrait:

- entorno, profundidad y foreground se seleccionan con `<picture>` y
  `(orientation: landscape)` desde el registry tipado;
- la rama portrait conserva sus tres fallbacks canónicos;
- I–V forman un arco panorámico con III al centro;
- foreground anclado abajo, con overscan transparente y todo su bbox alpha
  dentro del viewport;
- Lía F1 estática usa `+26px` de base landscape y queda sobre la plataforma;
- título, créditos y acciones siguen siendo DOM/9-slice;
- créditos a `13px` y acciones a `15px` en landscape bajo, dentro de los
  mínimos aprobados;
- targets `>=44×44`, acceso directo y foco preservados;
- restart mantiene `navigation_only_no_global_cleanup`.

Resultados:

| Viewport        | Scroll | Contenido alpha | Targets | Overlaps | Consola/red | Resultado |
| --------------- | ------ | --------------- | ------- | -------- | ----------- | --------- |
| `667×375`       | 0      | completo        | PASS    | 0        | 0/0         | PASS      |
| `800×360`       | 0      | completo        | PASS    | 0        | 0/0         | PASS      |
| `844×390`       | 0      | completo        | PASS    | 0        | 0/0         | PASS      |
| `932×430`       | 0      | completo        | PASS    | 0        | 0/0         | PASS      |
| `740×360` smoke | 0      | completo        | PASS    | 0        | 0/0         | PASS      |

El diálogo de reinicio `667×375` queda completo, sin clipping, con dos targets
de `138×49.5px`. Portrait `375×548` también abre el diálogo completo y conserva
targets válidos.

## Assets e invariantes

- Environment activos: portrait o landscape según orientación, nunca ambos
  como fuente seleccionada.
- Accesos: cinco assets canónicos más backplate de label.
- UI: cuatro PNG canónicos.
- Lía: idle contemplative F1 + glow; greeting no consumido.
- Assets fallidos: `0`.
- Requests externos: `0`.
- `current-used` en imports/DOM: `0`.
- Assets binarios y `public/assets/**`: sin modificaciones.
- Audio, video, canvas e iframe: `0`.
- Keyframes, animation y transitions significativas: `0`.
- Mundo VI: ausente.

## Acceso directo

Chromium verificó una activación y ausencia de panel intermedio:

| Acceso | Ruta          | Activaciones | Resultado |
| ------ | ------------- | -----------: | --------- |
| I      | `/estacion/1` |            1 | PASS      |
| II     | `/estacion/2` |            1 | PASS      |
| III    | `/estacion/3` |            1 | PASS      |
| IV     | `/estacion/4` |            1 | PASS      |
| V      | `/estacion/5` |            1 | PASS      |

Los cinco templates `FINAL_ACCESS_*_CONFIRM_01` permanecen preservados y no
crean un segundo paso. Los cinco slots operativos permanecen registrados y no
consumidos.

## Evidencia

Portrait:
`docs/visual/final/021k-portrait-carryover/`.

- cuatro capturas obligatorias;
- `final_021k_375x667_lia_platform_before_after.png`;
- `final_021k_portrait_carryover_contact_sheet.png`;
- `final_021k_portrait_carryover_metrics.json`.

Landscape:
`docs/visual/final/021k-static-landscape/`.

- cuatro capturas idle obligatorias;
- captura de reinicio `667×375`;
- `final_021k_landscape_review_contact_sheet.png`;
- `final_021k_landscape_metrics.json`.

Las carpetas de evidencia 021J y 021J-R1 permanecen intactas.

## Validación

- Editorial/CSV/XLSX: PASS.
- FinalRoot + registry/assets + editorial focal: `18/18 PASS` en `3/3`
  archivos.
- Suite global: `302/302 PASS` en `26/26` archivos.
- TypeScript: PASS.
- ESLint: PASS.
- Prettier focalizado: PASS.
- Build/PWA: PASS; 594 módulos y 278 entradas de precache.
- Precache FinalRoot: `20/20 PASS`, incluido `manifest.json`; referencias a
  `assets/gvo/current-used/final-root/`: `0`.
- Auditoría de assets: PASS; sin URLs externas, CDN ni audio.
- Chromium portrait: `4/4 PASS`.
- Chromium landscape: `4/4 PASS` + smoke PASS.
- Navegación directa: `5/5 PASS`.
- Reinicio portrait/landscape: PASS.
- Consola/requests externos: `0/0`.
- `git diff --check`: PASS.
- Auditoría final de paths: `43/43` esperados, `0` inesperados y `0`
  prohibidos.

Permanecen sólo los warnings históricos del chunk principal mayor de 500 kB y
del reporte de tiempos de plugins de Vite.

## Deudas fuera de alcance

Documentadas, no implementadas:

- progreso persistente coherente entre Mundos;
- continuidad tras recarga/reconexión y progreso offline-first;
- fullscreen desde inicio;
- retorno global al Mirador;
- reset real.

Mundos modificados: `0`.

## Gate 6 y Git

- Gate 6: `PENDING_HUMAN_REVIEW`.
- El PASS técnico no declara aprobación humana landscape/final.
- Staged: `0`.
- Commit: `NO`.
- Push: `NO`.
- Worktree final: `43` paths exactos de 021J + R1 + 021K.
- Paths inesperados/prohibidos: `0/0`.
