# GVO_FINAL_021J — Composición estática portrait para revisión

Fecha: `2026-08-04`

Estado: `GVO_FINAL_021J_STATIC_PORTRAIT_READY_FOR_HUMAN_REVIEW`

Gate: `GATE 6 — PENDING_HUMAN_REVIEW`

## 1. Baseline

- Branch: `main`.
- HEAD inicial y final: `f310abffb9370dba5f4119c4f012a2104fd36487`.
- `origin/main` local: mismo SHA.
- `refs/heads/main` remoto: mismo SHA.
- Divergencia: `0/0`.
- Worktree inicial: limpio.
- No se ejecutó `fetch`, branch, stage, commit, push, tag ni PR.

## 2. Implementación

`FinalRootScreen` monta una composición inmersiva estática a pantalla completa
para los viewports portrait `375×667` y `390×844`. La jerarquía visual usa
environment, depth, accesos I–V en formación `2–1–2`, foreground, Lía estática,
acciones y créditos.

- Los backplates de título, labels, acciones, créditos y confirmación se
  consumen como 9-slice; los textos permanecen en DOM/CSS.
- Existe un único `h1` visible.
- El copy de Lía, ambiente y ayuda permanece accesible en DOM sin
  `display:none`.
- Lía usa únicamente el frame F1 del strip idle mediante viewport con
  `overflow:hidden`; no hay animación.
- `data-final-landscape-status="pending-021k"` mantiene landscape fuera del
  cierre visual.
- No se añadió comportamiento funcional nuevo.

## 3. Assets portrait consumidos

Se consumen desde `src/shared/assets/finalRootAssets.ts` exactamente 15 assets
autorizados:

1. `environment/final_environment_portrait_v01.webp`.
2. `environment/final_valley_depth_portrait_v01.webp`.
3. `environment/final_mirador_foreground_portrait_v01.webp`.
4. `access/final_access_world1_root_v01.webp`.
5. `access/final_access_world2_pulse_v01.webp`.
6. `access/final_access_world3_notebook_v01.webp`.
7. `access/final_access_world4_system_v01.webp`.
8. `access/final_access_world5_map_v01.webp`.
9. `access/final_access_label_backplate_v01.png`.
10. `ui/final_title_backplate_v01.png`.
11. `ui/final_action_backplate_v01.png`.
12. `ui/final_credits_backplate_v01.png`.
13. `ui/final_restart_dialog_backplate_v01.png`.
14. `lia/final_lia_idle_contemplative_6f_v01.webp`.
15. `lia/final_lia_glow_shadow_v01.png`.

Excluidos del consumo: environment/depth/foreground landscape, Lía greeting,
production sources, previews, rejected candidates y cualquier path
`current-used`. No se modificaron los árboles de assets registrados en 021I.

## 4. Invariantes funcionales preservadas

- Los 35 slots editoriales finales siguen siendo la única fuente de copy.
- Los cinco accesos conservan selección y Link directo a las rutas existentes.
- Volver al inicio conserva navegación a `/portada` sin borrar progreso.
- Reiniciar conserva confirmación y navegación existente, sin introducir
  cleanup global.
- Los cinco slots operativos siguen registrados y no consumidos.
- No se añadió Mundo VI, QR, permisos, contador diario, requests, audio, video,
  canvas, iframe, librería ni motion.
- El guard real de `/final` queda intacto en `src/app/router.tsx` y cubierto por
  la suite global.

Para capturar la composición en el navegador integrado se retiró local y
temporalmente el loader de `/final`, porque el sandbox visual no expone escritura
de `localStorage`. El loader fue restaurado antes de las validaciones finales;
`src/app/router.tsx` no aparece en el diff.

## 5. Evidencia portrait

Carpeta:
`docs/visual/final/021j-static-portrait/`.

| Evidencia                                      | Canvas   | SHA-256                                                            |
| ---------------------------------------------- | -------- | ------------------------------------------------------------------ |
| `final_021j_375x667_idle.png`                  | 375×667  | `EC66951A79963968789F686D2649155A9223C7C688AA979E3B602A61065D26C3` |
| `final_021j_390x844_idle.png`                  | 390×844  | `1D681329559773916F1BD204BF9F586383B924BEBAC47BF0EB8332CB4391F135` |
| `final_021j_375x667_access_selected.png`       | 375×667  | `345C18BDC2864EF6D918D7AB2B29F99F9F02F6A0D46241C9FE75065E8B06BCBA` |
| `final_021j_375x667_restart_open.png`          | 375×667  | `9965B5B7A2E3614995234148761FCC2C0862FF8727803B9034795E4481502258` |
| `final_021j_portrait_review_contact_sheet.png` | 908×1848 | `5F9D5204296652D879B3DA3B1B159AE499C372F7EDB706CA8BF83DB35698E1C4` |

El contact sheet compone las cuatro capturas originales sin reescalarlas ni
modificar sus binarios.

## 6. Métricas Chromium

Registro reproducible:
`docs/visual/final/021j-static-portrait/final_021j_portrait_metrics.json`.

- `375×667 idle`: scroll horizontal/vertical `0`, overlaps críticos `0`, h1
  `20.01px`, labels `14px`, acciones `16px`, créditos `14px`.
- `390×844 idle`: scroll horizontal/vertical `0`, overlaps críticos `0`, h1
  `22px`, labels `15px`, acciones `16px`, créditos `14px`.
- Selección `375×667`: scroll `0`, overlaps críticos `0`, feedback visible y
  acceso III marcado con `aria-pressed`.
- Reinicio `375×667`: scroll `0`, controles visibles; las intersecciones del
  diálogo con la escena son overlay esperado y las intersecciones críticas no
  esperadas son `0`.
- Targets de accesos, acciones, Link de revisión y diálogo: todos `>=44×44`.
- Assets DOM cargados: completos; fallos `0`.
- Consola Chromium: errores/warnings `0`.
- Recursos externos observados: `0`.
- Elementos FinalRoot con animation/transition activa: `0`.

## 7. Landscape

Estado: `pending-021k`.

Sólo se ejecutó smoke funcional `667×375`: root presente, un `h1`, cinco
accesos, dos acciones, assets cargados, sin crash, sin error de consola y sin
overflow horizontal. No se generó evidencia estética ni se implementó layout
landscape final.

## 8. Validación

- FinalRoot focal: `5/5 PASS`.
- Registry/assets focal: `6/6 PASS`.
- Suite global: `302/302 PASS` en `26/26` archivos.
- TypeScript: PASS.
- ESLint: PASS.
- Prettier focalizado: PASS.
- Build/PWA: PASS; 594 módulos, 278 entradas de precache.
- Assets consumidos presentes en `dist` y precache: `15/15 PASS`.
- Chromium portrait: PASS en cuatro estados/capturas.
- Auditoría de requests: PASS; externos `0`.
- `npm run audit:assets`: PASS; sin URL externa, CDN ni audio.
- `git diff --check`: PASS.
- Auditoría de paths: `11/11` esperados; inesperados `0`, staged `0` y diff
  residual de `src/app/router.tsx` `0`.

Permanece el warning histórico permitido de chunk principal mayor de 500 kB y
el reporte histórico de tiempos de plugins de Vite. No apareció warning nuevo
de assets, layout o runtime.

## 9. Paths del ticket

Código y pruebas:

- `src/screens/FinalRoot/FinalRootScreen.tsx`.
- `src/screens/FinalRoot/FinalRootScreen.css`.
- `src/screens/FinalRoot/FinalRootScreen.test.tsx`.
- `src/shared/assets/finalRootAssets.test.ts`.

Documentación y evidencia:

- `docs/status/GVO_FINAL_021J_STATIC_COMPOSITION_PORTRAIT_FOR_REVIEW.md`.
- `docs/visual/final/021j-static-portrait/final_021j_375x667_idle.png`.
- `docs/visual/final/021j-static-portrait/final_021j_390x844_idle.png`.
- `docs/visual/final/021j-static-portrait/final_021j_375x667_access_selected.png`.
- `docs/visual/final/021j-static-portrait/final_021j_375x667_restart_open.png`.
- `docs/visual/final/021j-static-portrait/final_021j_portrait_metrics.json`.
- `docs/visual/final/021j-static-portrait/final_021j_portrait_review_contact_sheet.png`.

Paths fuera de alcance: `0`.

## 10. Deudas y estado de Gate 6

- La composición portrait requiere revisión humana; esta prueba técnica no la
  reemplaza.
- Gate 6 permanece `PENDING_HUMAN_REVIEW`.
- Landscape final permanece pendiente y fuera del alcance 021J.
- Motion de Lía y greeting no están consumidos.
- La confirmación de reinicio no se declara modal accesible definitivo; no se
  añadió focus trap ni rollback funcional.

## 11. Git

- Staged: `0`.
- Commit: `NO`.
- Push: `NO`.
- Worktree final esperado: modificado sólo por los 11 paths enumerados.

021J produce evidencia técnica reproducible y deja la composición estática
portrait preparada, pero no aprobada, para revisión humana.
