# GVO_DEBT_012 — Initial Experience, Language Selection and Immersive Entry

Estado: `PENDING_HUMAN_REVIEW`

Fecha técnica: 2026-08-13

## Resultado

`GVO_DEBT_012_IMPLEMENTATION_COMPLETE_FOR_REVIEW`

Se incorporó una entrada inicial accesible en `/inicio`, con selección
explícita `es/en`, persistencia local, Fullscreen API sólo mediante gesto y
fallback no bloqueante. La entrada normal queda:

```text
QR / navegador → Carga inicial → /inicio → Portada → recorrido
```

No se tradujo ni reescribió contenido editorial. English registra la
preferencia y localiza únicamente la microinterfaz operacional de entrada.

## Baseline y worktree

- Baseline obligatorio: `eb4761e22e2d85634e4aef75bb13a8862610fc69`.
- HEAD final: `eb4761e22e2d85634e4aef75bb13a8862610fc69`.
- `origin/main`: `eb4761e22e2d85634e4aef75bb13a8862610fc69`.
- Rama: `main`; divergencia `0 ahead / 0 behind`.
- El worktree ya contenía DEBT_011 completo y pendiente de revisión. DEBT_012
  se aplicó encima del mismo baseline sin sobrescribirlo ni publicarlo.
- Sin stage, commit, push ni PR.

## Auditoría inicial

### Flujo

- `/` montaba `JourneyLoadingRoute` durante la timeline canónica de `12.000 ms`
  y precargaba Portada.
- Al completar duración y preload, navegaba directamente a `/portada`.
- `/carga` mantenía la pantalla de carga aislada sin navegación automática.
- `/?resetIntro=1` reproducía Carga y entregaba una Portada fresca.

### Idioma y almacenamiento

- `index.html` declaraba `lang="es"`.
- La interfaz y todo el contenido editorial estaban en español.
- No existía clave ni preferencia de idioma.
- El almacenamiento existente separaba progreso global, checkpoints I–IV,
  estado de Mundo V, finalización de Portada y contexto de revisita.
- La política de reset ya declaraba idioma dentro de preferencias a preservar,
  pero no existía implementación.

### Fullscreen y móvil

- `shared/immersive/immersiveMode.ts` ya encapsulaba la API estándar, comprobaba
  soporte y user activation, y capturaba rechazos.
- `ImmersiveModeControl` ofrecía botón nativo solamente en rutas de estaciones
  mediante `GlobalImmersiveShell`.
- No existía una opción fullscreen en la primera interacción.
- Fullscreen variaba por navegador móvil y nunca estaba autorizado de forma
  automática.
- Las estaciones ya conservaban safe-area y targets mínimos; no existía una
  pantalla inicial dedicada que auditar.

## Implementación

### Pantalla inicial

- Nueva ruta `/inicio`, integrada después de la Carga inicial normal.
- `/carga`, `/portada`, entradas QR y `/?resetIntro=1` preservan sus contratos.
- Pantalla DOM/CSS local, sin imágenes ni assets nuevos.
- Primer foco programático en el encabezado para anunciar el nuevo contexto.
- Controles nativos con estados de foco visibles y targets mínimos de `48 px`.
- CTA de recorrido deshabilitado hasta que exista selección de idioma.

### Idioma

- Contrato tipado cerrado: `es | en`.
- Clave: `gvo.language.v1`.
- Sólo se aceptan valores exactos; corrupción o lectura bloqueada falla a `es`.
- Si `localStorage.setItem` falla, la selección se conserva para la instancia y
  se informa `memory-only`; el recorrido continúa.
- `document.documentElement.lang` se actualiza al seleccionar, recargar o entrar
  directamente a una ruta.
- La clave queda fuera de la allowlist de reset y se verificó que sobrevive al
  reset real.

### Entrada inmersiva

- Reutiliza `requestImmersiveMode`, sin duplicar la integración de navegador.
- La llamada ocurre exclusivamente en el handler del botón nativo.
- No hay fullscreen automático al cargar, seleccionar idioma o iniciar.
- Con API disponible y concesión: estado `active` y `aria-pressed="true"`.
- Con denegación: estado `error`, explicación visible y CTA disponible.
- Sin API: botón fullscreen visible pero deshabilitado, explicación de fallback
  y CTA disponible.
- El control compartido dentro de estaciones permanece intacto y permite salir
  posteriormente de fullscreen.

## Accesibilidad y QA visual

- Botones nativos para idioma, fullscreen e inicio.
- `Enter`, `Space` y touch validados mediante Playwright.
- `aria-pressed` en selección y fullscreen.
- `aria-label`, `fieldset`, `legend`, `aria-live` y foco inicial explícito.
- Pixel 5 (`393×851` CSS): pantalla completa visible, sin solapes ni overflow
  horizontal; todos los botones miden al menos `44×44 px`.
- `prefers-reduced-motion` elimina transiciones no esenciales.
- No existen elementos `audio` ni `video`.

## Integridad del recorrido

Se sembraron sentinels para:

- `gvo.progress.v1`;
- `gvo.station1.v1`;
- `gvo.station2.v1`;
- `gvo.station3.v1`;
- `gvo.station4.v1`;
- `gvo.station5.v1`.

Selección `es/en`, reload, fullscreen concedido/denegado/no disponible e inicio
de Portada preservaron todos los valores byte a byte. La prueba unitaria de
reset confirma además que `gvo.language.v1` sobrevive al reset pedagógico.

## Compatibilidad DEBT_011, PWA y QR

- Build final: `606` módulos transformados.
- JS crítico acumulado: `534.746` bytes, todavía `34,66 %` por debajo del
  baseline monolítico de `818.393` bytes.
- Los siete pares de chunks de Transición, Mundos I–V y Mirador siguen
  presentes y ninguno entró al precache.
- No se modificó `vite.config.ts` dentro de DEBT_012 ni la estrategia PWA.
- Precache acumulado: `49` entradas, `14.817,03 KiB`.
- El contrato QR conserva redirecciones y guards; QR start llega al flujo normal
  del navegador y no exige instalación.
- Permanece el warning informativo del JS inicial superior a `500 kB`.

## Pruebas

- `npm run audit:assets`: PASS; sin URL externa, CDN ni audio.
- `npm run lint`: PASS.
- `npm test`: PASS; `39` archivos y `500` tests.
- `npm run build`: PASS.
- Verificación acumulada DEBT_011: PASS; siete rutas separadas, cero chunks de
  ruta precacheados.
- `tests/e2e/gvo-debt-012-initial-experience.spec.ts`: PASS; `6/6`.
- `npm run test:e2e`: PASS final; `152/152` en `16,7 min`.

La primera corrida global alcanzó `151/152`: un test histórico de QA visual de
Portada usaba `5 s` para observar navegación y DOM de Transición durante el
arranque frío. Se ajustó sólo su sincronización con el chunk lazy existente; el
caso pasó focalmente y la batería final terminó `152/152`.

## Archivos creados por DEBT_012

- `docs/decisions/ADR-0006-entrada-inicial-idioma-y-fullscreen.md`
- `docs/status/GVO_DEBT_012_INITIAL_EXPERIENCE_LANGUAGE_AND_IMMERSIVE_ENTRY_FOR_REVIEW.md`
- `src/app/preferences/languagePreference.ts`
- `src/app/preferences/languagePreference.test.ts`
- `src/screens/InitialExperience/InitialExperienceScreen.tsx`
- `src/screens/InitialExperience/InitialExperienceScreen.css`
- `src/screens/InitialExperience/InitialExperienceScreen.test.tsx`
- `src/screens/InitialExperience/index.ts`
- `tests/e2e/gvo-debt-012-initial-experience.spec.ts`

## Archivos modificados por DEBT_012

- `docs/05_ARQUITECTURA_TECNICA.md`
- `src/app/reset/resetGvoJourney.test.ts`
- `src/app/router.tsx`
- `src/app/routes.ts`
- `src/app/shell/GlobalImmersiveShell.tsx`
- `src/app/shell/GlobalImmersiveShell.test.tsx`
- `src/shared/immersive/index.ts`
- `tests/e2e/cover-intro-002j-fix-qa.spec.ts`

## Fuera de alcance confirmado

Sin cambios funcionales en progreso, checkpoints, QR, PWA, route chunking,
Mirador, Portada, copy editorial, identidad de Lía, assets canónicos,
dependencias, `package.json` o lockfile. No se crearon assets ni se modificó
`public/assets/gvo/current-used`. `docs/status/CURRENT_STATE.md` permanece
intacto hasta aprobación humana.

## Estado final

`PENDING_HUMAN_REVIEW`

Sin commit. Sin push. Sin PR.
