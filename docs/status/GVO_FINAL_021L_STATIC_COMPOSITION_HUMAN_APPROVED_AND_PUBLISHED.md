# GVO_FINAL_021L — Composición estática aprobada y publicada

Fecha: `2026-08-04`

Estado: `GVO_FINAL_021L_STATIC_COMPOSITION_PUBLISHED_COMPLETE`

Gate 6: `STATIC COMPOSITION / HUMAN_APPROVED / COMPLETE`

## Baseline

- Branch: `main`.
- HEAD previo: `f310abffb9370dba5f4119c4f012a2104fd36487`.
- `origin/main` local y `refs/heads/main` remoto: mismo SHA previo.
- Divergencia inicial: `0/0`.
- Worktree inicial: `43` paths exactos de 021J + R1 + 021K.
- Paths inesperados/prohibidos iniciales: `0/0`.
- Staged inicial: `0`.
- No se ejecutó `fetch`.

## Aprobación humana vinculante

La revisión humana aprueba completamente la composición estática 021K:

```text
GVO_FINAL_021K_STATIC_COMPOSITION
PORTRAIT: HUMAN_APPROVED
LANDSCAPE: HUMAN_APPROVED
RESPONSIVE STATIC COMPOSITION: HUMAN_APPROVED
```

La aprobación cubre portrait y landscape, título, subtítulo, copy final,
accesos I–V, foreground, plataforma, posición base de Lía, acciones, diálogo de
reinicio, assets canónicos, tipografía, targets, comportamiento funcional
existente y ausencia deliberada de motion.

Los tres carryovers portrait quedan aprobados como implementados:

1. `FINAL_CREDITS_01` corto en dos líneas DOM.
2. Cluster I–V elevado coordinadamente.
3. Base de Lía centrada sobre la plataforma.

El DOM publica la autoridad posterior mediante
`static_portrait_landscape_human_approved_021l` y
`human_approved_published_021l`. Las actas 021J, R1 y 021K conservan su estado
histórico.

## Editorial

`FINAL_CREDITS_01`:

```text
Desarrollado por Momotto S.A.S.
A cargo del Ing. José David P. Z.
```

- Estado/fuente/locale: `FINAL / human_approved / es`.
- CSV: 202 filas, 202 IDs únicos, 35 slots Final, `TEMP 0` y
  `excel_pending 0`.
- XLSX: `A1:O203`, 202 IDs, 202 únicos, 35 slots Final, cero fórmulas y cero
  errores de fórmula.
- Ningún otro copy fue modificado por 021L.

## Assets y composición

- Portrait: Environment, Depth y Mirador foreground canónicos.
- Landscape: Environment, Depth y Mirador foreground canónicos.
- Compartidos: cinco accesos, backplate de labels, cuatro UI, Lía idle F1 y
  glow.
- Subset estático consumido: 18 assets registrados desde el registry tipado.
- Greeting: registrado para el frente posterior, no consumido.
- `current-used`: mirror canónico preservado; no se usa como ruta de import.
- Fuentes de producción: fuera de runtime, imports, `dist` y precache.
- Assets rechazados: ausentes.
- Cambios binarios y `public/assets/**`: `0`.

## Responsive y acceso

Smokes finales:

| Viewport  | Orientación | Scroll | Clipping | Targets | Assets | Resultado |
| --------- | ----------- | ------ | -------- | ------- | ------ | --------- |
| `375×667` | portrait    | 0      | 0        | PASS    | PASS   | PASS      |
| `390×844` | portrait    | 0      | 0        | PASS    | PASS   | PASS      |
| `667×375` | landscape   | 0      | 0        | PASS    | PASS   | PASS      |
| `844×390` | landscape   | 0      | 0        | PASS    | PASS   | PASS      |

Los cinco accesos navegan con una activación y sin panel intermedio:

| Acceso | Ruta          | Resultado |
| ------ | ------------- | --------- |
| I      | `/estacion/1` | PASS      |
| II     | `/estacion/2` | PASS      |
| III    | `/estacion/3` | PASS      |
| IV     | `/estacion/4` | PASS      |
| V      | `/estacion/5` | PASS      |

El diálogo de reinicio conserva `navigation_only_no_global_cleanup`; portrait
`375×667` y landscape `667×375` quedan completos, sin clipping y con targets
`>=44×44`.

## Evidencia y validación

Las 29 piezas de evidencia de 021J, R1 y 021K permanecen presentes y no fueron
regeneradas.

- FinalRoot + registry/assets + editorial focal: `18/18 PASS` en `3/3`
  archivos.
- Suite global: `302/302 PASS` en `26/26` archivos.
- TypeScript: PASS.
- ESLint: PASS.
- Prettier focalizado: PASS.
- Build/PWA: PASS; 594 módulos y 278 entradas de precache.
- Precache FinalRoot: `20/20 PASS`, incluido `manifest.json`.
- Auditoría de assets: PASS; sin URLs externas, CDN ni audio.
- Chromium portrait: `2/2 PASS`.
- Chromium landscape: `2/2 PASS`.
- Acceso directo: `5/5 PASS`.
- Reinicio portrait/landscape: PASS.
- Consola y requests externos: `0/0`.
- `git diff --check`: PASS.

Sólo permanecen los warnings históricos del chunk principal mayor de 500 kB y
del reporte de tiempos de plugins de Vite.

## Gate 6

```text
GATE 6 — STATIC COMPOSITION / HUMAN_APPROVED / COMPLETE
```

La composición estática responsive queda publicada. Esto no declara motion,
animación idle, greeting, persistencia, offline-first, fullscreen, retorno
global, reset real ni experiencia final completamente cerrada.

## Publicación Git

- Commit único: `feat(final): publish responsive mirador composition`.
- Commit/SHA publicado dentro de este mismo changeset: `SELF`.
- Push directo: `origin/main`.
- Estado requerido tras publicación: `HEAD == origin/main == remote`,
  divergencia `0/0` y worktree limpio.

## Siguiente microfrente

`GVO_FINAL_021M_LIA_MOTION_AND_CEREMONIAL_BEHAVIOR`.

021M no se inicia dentro de este ticket.
