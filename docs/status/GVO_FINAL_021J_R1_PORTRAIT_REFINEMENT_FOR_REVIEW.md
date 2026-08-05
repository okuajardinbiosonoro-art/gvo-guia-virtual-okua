# GVO_FINAL_021J_R1 — Refinamiento portrait para revisión

Fecha: `2026-08-04`

Estado: `GVO_FINAL_021J_R1_PORTRAIT_REFINEMENT_READY_FOR_HUMAN_REVIEW`

Gate: `GATE 6 — PENDING_HUMAN_REVIEW`

## 1. Revisión humana atendida

El resultado 021J conservaba un PASS técnico, pero la revisión humana detectó
densidad pictórica real en portrait de baja altura: Lía parecía apoyada o
incrustada en el barandal, IV/V quedaban visualmente amontonados con el
foreground y el acceso a cada Mundo exigía dos activaciones.

Las métricas de bboxes de 021J no cerraban Gate 6 porque no medían el contenido
alpha interno de los assets ni la lectura pictórica. R1 mantiene:

```text
GVO_FINAL_021J_STATIC_PORTRAIT
TECHNICAL_PASS
HUMAN_REVIEW: CHANGES_REQUIRED
GATE 6: PENDING
```

R1 corrige esos dos hallazgos y queda preparado, no aprobado, para una nueva
revisión humana.

## 2. Baseline y worktree de entrada

- Branch: `main`.
- HEAD: `f310abffb9370dba5f4119c4f012a2104fd36487`.
- `origin/main` local y `refs/heads/main` remoto: mismo SHA.
- Divergencia: `0/0`.
- Worktree inicial: exactamente los 11 paths no publicados de 021J.
- Paths iniciales inesperados: `0`.
- Staged inicial: `0`.
- No se ejecutó `fetch`, branch, stage, commit, push, tag ni PR.

## 3. Corrección short-height

La composición conceptual se conserva: título, accesos `2–1–2`, Lía, Mirador,
acciones y créditos.

- `<=700px` portrait usa `--final-core-shift-y: -14px` para trasladar de forma
  coordinada accesos y Lía.
- Las acciones dejan de depender de un porcentaje vertical en baja altura y se
  anclan sobre créditos mediante un bottom estable.
- `<=580px` aplica la variante estricta medida en `375×548`:
  - I/II reciben el desplazamiento común de `-16px`;
  - III y Lía reciben un desplazamiento adicional de `-28px`;
  - IV/V reciben un desplazamiento adicional de `-14px` para conservar
    hitboxes independientes respecto de II/V e I/IV.
- El foreground permanece anclado abajo, sin alterar escala, binario o forma.
- No se redujo tipografía, targets, Lía ni foreground.
- No se añadieron offsets por dispositivo ni user-agent detection.

La evidencia 375×548 conserva una intersección matemática entre los canvas de
III y Lía. Corresponde a zona alpha transparente: la captura muestra separación
pictórica, Lía no captura puntero y no existe colisión entre hit targets.

## 4. Acceso directo I–V

Cada mini escena completa es ahora un `<Link>` nativo de React Router:

| Acceso                    | Ruta          | Activaciones | Resultado Chromium |
| ------------------------- | ------------- | -----------: | ------------------ |
| I — Raíz                  | `/estacion/1` |            1 | PASS               |
| II — Pulso invisible      | `/estacion/2` |            1 | PASS               |
| III — Cuaderno de pruebas | `/estacion/3` |            1 | PASS               |
| IV — Mesa de sistema      | `/estacion/4` |            1 | PASS               |
| V — Mapa del presente     | `/estacion/5` |            1 | PASS               |

- Panel intermedio: `false`.
- Segundo control requerido: `false`.
- `aria-pressed`: eliminado.
- Labels visibles, `aria-label`, foco y rutas publicadas: preservados.
- Los cinco slots `FINAL_ACCESS_*_CONFIRM_01` permanecen
  `FINAL / human_approved / es` como templates ocultos de anuncios para una
  futura transición local; no generan una segunda interacción.
- Los cinco slots operativos nuevos siguen registrados/no consumidos.

## 5. Assets, copy e invariantes

- Assets runtime portrait: los mismos `15/15` del subset 021J mediante
  `src/shared/assets/finalRootAssets.ts`.
- Assets modificados: `0`.
- `public/assets/**` y `current-used/**`: sin diff.
- Assets landscape, greeting, production sources y previews: no consumidos.
- Copy y matriz editorial: sin cambios.
- Lía: F1 estático; sin strip ejecutado, keyframes, flotación ni greeting.
- Restart: `navigation_only_no_global_cleanup`.
- Router/guards, storage, PWA config, service worker, Portada, transiciones y
  Mundos I–V: sin cambios.
- Landscape: `pending-021k` y fuera de alcance.

El bypass local del loader de `/final` se usó sólo para evidencia porque el
sandbox del navegador no permite preparar `localStorage`. Se revirtió antes de
las validaciones finales; `src/app/router.tsx` no tiene diff.

## 6. Evidencia R1

Carpeta: `docs/visual/final/021j-r1-static-portrait/`.

| Archivo                                           | Canvas    | SHA-256                                                            |
| ------------------------------------------------- | --------- | ------------------------------------------------------------------ |
| `final_021j_r1_375x667_idle.png`                  | 375×667   | `63580F031A52DCB6F8F425AD5EFDF2BF8AC062C62A75F9A5A78DFD6BC0A633C7` |
| `final_021j_r1_390x844_idle.png`                  | 390×844   | `1D681329559773916F1BD204BF9F586383B924BEBAC47BF0EB8332CB4391F135` |
| `final_021j_r1_360x640_idle.png`                  | 360×640   | `5BF9230C4E02038855EBB3220CE593F38E02D1BF16F87CF99A2584A322B3EA42` |
| `final_021j_r1_375x548_idle.png`                  | 375×548   | `89DE1FDA4DA67196B78480E53847D1AEA77E6E6E8A0F41B0C23968AEE2F0B2AC` |
| `final_021j_r1_375x667_restart_open.png`          | 375×667   | `6C42B831D69DE8377AB6EA8DFEA8E091A30569128AA3329EC58B5B34E161A0FD` |
| `final_021j_r1_portrait_review_contact_sheet.png` | 1354×1848 | `5DB4F3102205103C86476532E3FEA74DEDDEB5B201A09017776F546938763DBC` |
| `final_021j_r1_375x667_before_after.png`          | 878×757   | `F5D6AB069B1F0FA1E62E5B43FEE5C86BDF70938A53C1637A8DD764060F881888` |

Métricas:

- `final_021j_r1_portrait_metrics.json`.
- `final_021j_r1_direct_access_metrics.json`.

La evidencia original 021J permanece intacta. Sus cuatro screenshots y contact
sheet conservan los SHA-256 registrados en el acta 021J. La captura R1 390×844
es byte-idéntica a 021J, confirmando ausencia de regresión visual en el viewport
alto.

## 7. Resultado Chromium

- `375×667`: PASS; núcleo `-14px`, separación Lía/barandal recuperada.
- `390×844`: PASS; sin regresión, desplazamiento `0px`.
- `360×640`: PASS; composición completa y equilibrada.
- `375×548`: PASS pictórico; variante estricta, plataforma reconocible y
  acciones/créditos completos.
- Scroll documento/shell: `0` en todos los estados.
- Clipping de elementos esenciales: `0`.
- Targets: todos `>=44×44`.
- Tipografía mínima: preservada.
- Assets fallidos: `0`.
- Consola: errores/warnings `0`.
- Requests externos: `0`.
- Navegación directa: `5/5 PASS` con una activación.

## 8. Deferred global stabilization findings

Estos hallazgos quedan documentados y no implementados:

### Persistencia coherente entre mundos

- Store de progreso versionado.
- Esquema de completion/unlocked state por Mundo.
- Hidratación anterior a guards.
- Migración y fallback ante corrupción.
- Escrituras atómicas o transaccionales donde corresponda.

### Continuidad offline

- Persistencia offline-first del progreso.
- Verificación de cache PWA/runtime.
- Recuperación después de reload/reconexión.
- Separación entre app shell cacheada y progreso del usuario.

### Fullscreen

- Presentación fullscreen desde el inicio como deuda futura de plataforma.
- No se usó fullscreen para resolver el layout R1.

Mundos modificados por R1: `0`.

## 9. Validación

- FinalRoot focal: `5/5 PASS`.
- Registry/assets focal: `6/6 PASS`.
- Suite global: `302/302 PASS` en `26/26` archivos.
- Auditoría de slots: PASS; 35 finales, cinco confirm preservados y cinco
  operativos no consumidos.
- TypeScript: PASS.
- ESLint: PASS.
- Prettier focalizado: PASS.
- Build/PWA: PASS; 594 módulos y 278 entradas de precache.
- Assets consumidos presentes en `dist` y precache: `15/15 PASS`.
- Chromium en cuatro viewports, reinicio y cinco navegaciones: PASS.
- `npm run audit:assets`: PASS.
- `git diff --check`: PASS.
- Auditoría de paths: `21/21` esperados, inesperados `0`, prohibidos `0`,
  staged `0` y diff residual de `src/app/router.tsx` `0`.

Permanecen únicamente el warning histórico del chunk principal mayor de 500 kB
y el reporte histórico de tiempos de plugins de Vite.

## 10. Git y Gate 6

- Staged: `0`.
- Commit: `NO`.
- Push: `NO`.
- Worktree final: 21 paths exactos de 021J + R1.
- Paths inesperados: `0`.
- Gate 6: `PENDING_HUMAN_REVIEW`.
- Landscape y motion no pueden comenzar por este resultado técnico.

R1 queda preparado para nueva revisión humana sin declarar aprobación visual.
