# GVO_FINAL_021N — Motion de Lía aprobado y publicado

Fecha: `2026-08-04`

Estado: `GVO_FINAL_021N_LIA_MOTION_PUBLISHED_COMPLETE`

Gate 7: `LIA MOTION / HUMAN_APPROVED / COMPLETE`

## Baseline

- Branch: `main`.
- HEAD previo: `d69d9fa886e4184c17a183dd010c575e42cce26c`.
- `origin/main` local y `refs/heads/main` remoto: mismo SHA previo.
- Divergencia inicial: `0/0`.
- Worktree inicial: `22` paths exactos de 021M.
- Paths inesperados/prohibidos iniciales: `0/0`.
- Staged inicial: `0`.
- No se ejecutó `fetch`.

## Aprobación humana vinculante

La revisión humana aprueba completamente el resultado 021M:

```text
GVO_FINAL_021M_LIA_MOTION
GREETING: HUMAN_APPROVED
IDLE: HUMAN_APPROVED
REDUCED MOTION: HUMAN_APPROVED
VISIBILITY HANDLING: HUMAN_APPROVED
GATE 7: READY_TO_CLOSE
```

La aprobación cubre greeting F1–F4, idle F1–F6, reduced motion, cambios runtime
de la preferencia reduce, pausa/reanudación por visibilidad, cleanup de timers y
listeners, glow estático, composición responsive e interacción preservada.

El acta 021M conserva su estado histórico `PENDING_HUMAN_REVIEW`; este documento
es la autoridad posterior que registra la aprobación.

## Contrato publicado

Greeting:

- F1–F4 a `160/160/160/160 ms`.
- Total: `640 ms`.
- Una reproducción por montaje.
- Transición F4 → idle F1.

Idle:

- F1–F6 a `4200/180/160/160/180/320 ms`.
- Ciclo: `5200 ms`.
- Transición F6 → F1.

Reduced motion:

- idle F1 estático;
- greeting e idle loop omitidos;
- timers `0`.

Visibility:

- hidden: `hidden_paused`, F1 y timers `0`;
- visible: idle F1;
- sin catch-up ni repetición del greeting.

## Assets y arquitectura

Se preservan los tres assets canónicos existentes:

- `final_lia_greeting_4f_v01.webp`;
- `final_lia_idle_contemplative_6f_v01.webp`;
- `final_lia_glow_shadow_v01.png`.

Los imports proceden del registry tipado. Runtime y mirrors `current-used` son
byte-idénticos; no se modifican binarios. Fuentes de producción, previews y
rechazados permanecen fuera de imports, `dist` y precache.

`FinalLiaMotion` conserva máximo un `setTimeout` encadenado, cero intervalos,
cero RAF permanente, cero canvas/WebGL/video/audio, cero dependencias nuevas y
cero cambios de `src` por frame. Timer y listeners se limpian en unmount.

## Responsive e interacción

- Portrait: `375×667`, `390×844`, `360×640` y `375×548`.
- Landscape: `667×375`, `800×360`, `844×390` y `932×430`.
- Clipping alpha, scroll, layout shifts y overlaps nuevos: `0`.
- Wrapper, offsets y z-index aprobados por 021L: intactos.
- Accesos I–V: directos y operables durante greeting e idle.
- Restart: operativo durante greeting e idle; conserva
  `navigation_only_no_global_cleanup`.
- Copy, foco, targets, slots operativos y semántica: preservados.

## Evidencia

La evidencia aprobada se preserva sin regeneración en:

```text
docs/visual/final/021m-lia-motion/
```

Contiene 16 archivos: seis capturas portrait, tres landscape, dos reduced
motion, tres contact sheets y dos JSON de métricas de timing/layout.

## Validación de publicación

- FinalLiaMotion focal: `6/6 PASS`.
- FinalRoot focal: `6/6 PASS`.
- Registry/assets/editorial focal: `13/13 PASS`.
- Suite global: `309/309 PASS` en `27/27` archivos.
- TypeScript: PASS.
- ESLint: PASS.
- Prettier focalizado: PASS.
- Build/PWA: PASS; `595` módulos y `278` entradas de precache.
- Chromium standard portrait/landscape: PASS.
- Reduced motion portrait/landscape: PASS.
- Visibility pause/resume: PASS.
- Accesos I–V y restart durante greeting/idle: PASS.
- Consola y requests externos: `0/0`.
- Auditoría de assets: PASS.
- Greeting, idle y glow en `dist`/precache: `3/3 PASS`.
- `git diff --check`: PASS.

Sólo se aceptan los warnings históricos del chunk principal mayor de 500 kB y
del reporte de tiempos de plugins de Vite.

## Gate 7

```text
GATE 7 — LIA MOTION / HUMAN_APPROVED / COMPLETE
```

Este cierre no declara persistencia completa, offline-first, fullscreen,
retorno global al Mirador, reset real ni experiencia final completamente
cerrada.

## Deudas fuera de alcance

- Persistencia transversal y continuidad offline-first.
- Fullscreen desde el inicio.
- Retorno global al Mirador durante revisitas.
- Reset real con allowlist, snapshot y rollback.
- Consumo de estados busy/error/retry del reset.

Mundos modificados: `0`.

## Publicación Git

- Commit único: `feat(final): publish Lia motion behavior`.
- Commit/SHA publicado dentro de este mismo changeset: `SELF`.
- Push directo: `origin/main`.
- Estado requerido tras publicación: `HEAD == origin/main == remote`,
  divergencia `0/0` y worktree limpio.

## Siguiente microfrente

`GVO_FINAL_021O_REVISIT_RETURN_AND_REAL_RESET_BEHAVIOR`.

021O no se inicia dentro de este ticket.
