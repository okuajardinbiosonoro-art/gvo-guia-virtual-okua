# GVO_DEBT_014B — Mobile Fullscreen Contract for Review

Estado de implementación: `GVO_DEBT_014B_MOBILE_FULLSCREEN_IMPLEMENTATION_COMPLETE_FOR_HUMAN_REVIEW`  
Estado de aprobación: `PENDING_HUMAN_REVIEW`  
QA físico Android/iPhone: `NOT_EXECUTED_NO_DEVICE_AVAILABLE`

## Why desktop passed but mobile failed

### Desktop environment

`GVO_DEBT_014A` demostró Fullscreen API real en Chrome, Edge y Opera GX de
escritorio, top-level y sobre loopback. El control estaba habilitado y
`document.fullscreenElement` llegó a `HTML`.

### Mobile environment

La revisión humana informó que en los teléfonos el control no estaba habilitado.
No se recibió todavía el dump de capability, dispositivo, navegador, versión ni
URL exacta de esos teléfonos; por tanto no es técnicamente válido atribuir el
resultado a una causa Android o iOS concreta.

El defecto de producto reproducible en código sí era claro: cuando Element
Fullscreen API no existía, `/inicio` y el shell global mostraban la opción como un
botón permanentemente disabled. Eso convertía una limitación de plataforma en una
aparente falla del visitante y no ofrecía el contrato de fallback requerido.

### URL difference

- 014A desktop: `http://127.0.0.1:4173`.
- Probe LAN 014B ejecutado durante implementación:
  `http://172.20.10.2:4175/qa/fullscreen/index.html`.
- Dispositivo físico: pendiente; la IP LAN debe confirmarse en el momento de QA.

El probe LAN en desktop registró `isSecureContext=false`, pero mantuvo API
estándar disponible y logró fullscreen real. Por ello un contexto HTTP no seguro,
por sí solo, no explica el hallazgo móvil sin evidencia del teléfono.

### API and context difference

La autoridad implementada es feature detection más policy/contexto real:

1. método estándar disponible;
2. método prefijado sólo si el navegador lo expone realmente;
3. API ausente en plataforma;
4. API presente pero bloqueada por `fullscreenEnabled` o Permissions Policy;
5. solicitud rechazada;
6. estado activo realmente concedido.

UA, `platform` y fabricante sólo quedan como diagnóstico.

## Android

- Devices: ninguno físicamente conectado o accesible desde esta sesión.
- Browsers: ninguno ejecutado en hardware Android.
- Capability: pendiente de probe real.
- Standard/prefixed: estándar tiene prioridad; compatibilidad WebKit queda detrás
  de feature detection y automatización contractual. Ningún navegador móvil real
  de esta campaña demostró que el prefijo fuera necesario.
- Real request: no ejecutado.
- Result: `ANDROID_REAL_FULLSCREEN_NOT_EXECUTED_NO_DEVICE_AVAILABLE`.

No se declara `ANDROID_REAL_FULLSCREEN_PASS`.

## iPhone

- Device: no disponible.
- Safari: no ejecutado en hardware real.
- Capability: pendiente.
- Platform limitation: el producto contempla explícitamente Element Fullscreen
  API ausente sin presentarlo como error.
- UI fallback: mensaje honesto en `/inicio`, CTA disponible y cero controles
  globales fullscreen dentro del recorrido.
- Result: `IPHONE_REAL_DEVICE_QA_NOT_EXECUTED_NO_DEVICE_AVAILABLE`.

No se declaran todavía
`IPHONE_FULLSCREEN_PLATFORM_LIMITATION_CONFIRMED` ni
`IPHONE_PRODUCT_FALLBACK_PASS`.

## Product contract

### Real fullscreen platforms

- Control visible y habilitado.
- La llamada nativa comienza en el tramo síncrono del tap, antes de navegación,
  timers o trabajo asíncrono.
- API estándar primero.
- Cambio y error sincronizados para eventos estándar y prefijados.
- Persistencia durante navegación SPA y salida desde la autoridad global.

### Expected limitation platforms

- `/inicio` no renderiza botón fullscreen muerto.
- Presenta: `La vista de navegador ya está optimizada para este dispositivo.`
- `Iniciar recorrido` continúa disponible tras seleccionar idioma.
- Portada, estaciones y Mirador renderizan cero controles fullscreen y cero dock.
- No se usa CSS para falsificar fullscreen.

### No-install guarantee

El contrato continúa siendo `QR → browser → experiencia`. No se añadió flujo de
instalación, Add to Home Screen, Web Clip ni requisito PWA instalada.

### Global control policy

- Capability real: exactamente un control compartido en rutas autorizadas.
- Plataforma sin API: cero controles y cero hueco de dock.
- Contexto bloqueado: control diagnóstico diferenciado, sin bloquear el recorrido.
- Ninguna estación recibió control local.

## Probe técnico

Se añadió `public/qa/fullscreen/index.html`, servido en
`/qa/fullscreen/index.html` y sin enlace desde la navegación normal. Funciona sin DevTools y
muestra/copia UA, plataforma, touch points, screen, viewport visual, contexto,
protocolo, métodos estándar/prefijados, policy, display mode, activación durante
tap, resultado, error y `fullscreenElement`.

La prueba de implementación sobre URL LAN desktop confirmó:

- top-level: `true`;
- protocol: `http:`;
- secure context: `false`;
- fullscreen enabled: `true`;
- standard request/exit: `function`;
- policy fullscreen: `true`;
- during-tap activation: `true`;
- request result: `fullscreen-element-present`;
- fullscreen element durante concesión: `HTML`;
- entrada y salida desde los controles del probe: observadas.

Esto valida el probe y la URL LAN, no un dispositivo móvil.

## Regression

- Portal I fit 0 px: PASS en verifier 014 y matriz visual 11/11.
- Cover revisit I–V: PASS en E2E global.
- Global desktop fullscreen: PASS headed real, sin monkeypatch, en Chrome
  `151.0.7922.138`, Edge `151.0.4129.86` y Opera GX/Chromium
  `150.0.7871.187`.
- Assets HUMAN_APPROVED: sin cambios binarios; verifier 013C PASS.
- PWA: 49 entradas / 14829.05 KiB; sin cambios de configuración o dependencias.
- Chunks: arquitectura lazy preservada. Chunk principal `540944` bytes, incremento
  de `734` bytes (`0.14 %`) frente al build final de 014A.
- `CURRENT_STATE.md`: intacto.
- `docs/visual`: intacto.

## Tests

- Audit assets: PASS — sin URL externa, CDN ni audio.
- Lint: PASS.
- Unit focal: PASS — 3 archivos / 29 pruebas.
- Unit global: dos campañas con timeout histórico de 10 s en Mundo III, sin fallo
  de aserción. El archivo aislado pasó 63/63 y la campaña global directa con un
  solo worker y timeout de infraestructura de 30 s pasó 42 archivos / 522 pruebas.
- TypeScript: PASS.
- Build: PASS — 609 módulos; PWA generada; único warning histórico de chunk
  principal mayor a 500 kB.
- E2E 014B focal: primera campaña 5/6; el mock de API ausente no neutralizaba
  `webkitRequestFullScreen`. Corregido y retest focal 1/1 PASS.
- E2E global: campaña inicial 174/176 por navegación fría 002J y expectativa
  histórica DEBT_012; ambas reconciliadas. Campaña final 176/176 PASS en 17.3 min.
- 013C verifier: PASS — 15 aprobados, 20 copias de repositorio, 5 pares runtime,
  manifests equivalentes y ZIP SHA-256
  `b70b2604dd5e960a0057c10d269f756c18e3cd47411d84348b395e0f119a78cc`.
- 014 verifier: PASS; matriz visual 11/11.
- 014A contract: 5/5 PASS dentro de la suite global.
- 014B contract: 7/7 PASS, rotulado explícitamente como automatización no física.
- Desktop real fullscreen regression: PASS en Chrome, Edge y Opera GX; entrada,
  navegación SPA, salida por control y reentrada.
- Real device QA: `NOT_EXECUTED_NO_DEVICE_AVAILABLE`.

## Files in scope

- `src/shared/immersive/immersiveMode.ts`
- `src/shared/immersive/index.ts`
- `src/shared/immersive/ImmersiveModeControl.tsx`
- `src/shared/immersive/ImmersiveModeControl.css`
- `src/shared/immersive/ImmersiveModeControl.test.tsx`
- `src/screens/InitialExperience/InitialExperienceScreen.tsx`
- `src/screens/InitialExperience/InitialExperienceScreen.css`
- `src/screens/InitialExperience/InitialExperienceScreen.test.tsx`
- `src/app/shell/GlobalImmersiveShell.tsx`
- `src/app/shell/GlobalImmersiveShell.test.tsx`
- `public/qa/fullscreen/index.html`
- `tests/e2e/gvo-debt-014a-real-fullscreen-enablement.spec.ts`
- `tests/e2e/gvo-debt-014b-mobile-fullscreen-contract.spec.ts`
- `tests/e2e/gvo-debt-012-initial-experience.spec.ts`
- `tests/e2e/cover-intro-002j-fix-qa.spec.ts`
- `tools/qa/gvo_debt_014_verify_global_experience.mjs`
- `docs/qa/GVO_DEBT_014B_MOBILE_FULLSCREEN_REAL_DEVICE_QA.md`
- `docs/status/GVO_DEBT_014B_MOBILE_FULLSCREEN_CONTRACT_FOR_REVIEW.md`

## Repository state

- Branch: `main`.
- Baseline local y remoto al inicio:
  `458c788843a3eb12beaee844ac407bae166f7c50`.
- Divergencia inicial: `0 0`.
- Cadena local `013 → 014A`: preservada. Snapshot: 102 archivos heredados; 13
  solapes intencionales del ticket y 89/89 archivos heredados restantes con el
  mismo Git blob hash.
- Sin commit, push ni PR.
