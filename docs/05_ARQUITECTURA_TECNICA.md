# Arquitectura técnica

Actualizado: 2026-08-13

La base usa Vite, React, TypeScript y React Router. La aplicación es local-first, silenciosa y empaqueta sus recursos requeridos en el build; las pantallas runtime no dependen de recursos remotos obligatorios.

## Carpetas principales

- `src/app`: aplicación, router, rutas y providers.
- `src/app/qr`: contrato tipado y resolución read-only de entradas QR.
- `src/app/shell`: shell inmersivo transversal y autorización por ruta.
- `src/components`: componentes reutilizables, incluido `GestureHint`.
- `src/content`: slots y copy editorial compartido.
- `src/data`: datos estáticos del flujo.
- `src/domain`: utilidades aisladas de dominio.
- `src/screens`: pantallas runtime y herramientas de desarrollo autorizadas.
- `src/shared/assets`: preloader y contratos compartidos de assets.
- `src/styles`: tokens y estilos globales.
- `public/assets/gvo`: assets runtime y registro fuente `current-used`; el
  registro documental no se copia al artefacto de despliegue.
- `docs`: contratos canónicos, inventarios y registros históricos.
- `tools`: scripts de auditoría y estado.
- `tests/e2e`: pruebas end-to-end.

## Rutas runtime relevantes

| Ruta                             | Componente / contrato                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| `/` y `/carga`                   | `LoadingInitialScreen`.                                                                       |
| `/portada`                       | `CoverIntroScreen`.                                                                           |
| `/transition/intro-to-station-1` | `TransitionWorldRuntimeRoute`.                                                                |
| `/estacion/1`                    | `World1RootScreen`.                                                                           |
| `/transition/world-1-to-world-2` | Transición compartida.                                                                        |
| `/estacion/2`                    | `World2RootScreen`.                                                                           |
| `/transition/world-2-to-world-3` | Transición pasiva final hacia Estación III.                                                   |
| `/estacion/3`                    | `World3RootScreen`, Estación III aprobada.                                                    |
| `/transition/world-3-to-world-4` | Transición compartida; copy editorial todavía `TEMP`.                                         |
| `/estacion/4`                    | `World4RootScreen`, Estación IV cerrada y aprobada.                                           |
| `/transition/world-4-to-world-5` | Transición compartida; copy editorial todavía `TEMP`.                                         |
| `/estacion/5`                    | `World5RootScreen`, base Fable funcional con visuales procedurales reemplazables; no cerrada. |
| `/transition/world-5-to-final`   | Transición compartida; copy editorial todavía `TEMP`.                                         |
| `/final`                         | `FinalRootScreen`.                                                                            |
| `/qr/:stationId`                 | Entrada QR tipada; redirige mediante los guards secuenciales existentes.                      |

Las rutas `/dev/*` son herramientas aisladas y no se deben presentar como pantallas finales.

## Shell inmersivo y entradas QR

`GlobalImmersiveShell` es un layout único del router. Autoriza el control sólo
en las cinco rutas base de estaciones y las cuatro subrutas de Mundo V. El
shell reutiliza `ImmersiveModeControl` y el núcleo estándar de
`shared/immersive`; no replica controles por pantalla, no activa fullscreen de
forma automática y no solicita permisos sensibles. Su dock fijo usa safe-area,
un área interactiva de `44px × 44px` y `pointer-events: none` fuera del botón.

`qrNavigation.ts` deriva cinco contratos desde `stations` y
`stationEntryRoutes`. La resolución acepta únicamente identificadores exactos
`1…5`, consulta el progreso mediante `readProgress`, reutiliza
`canOpenStation` y aplica `mostAdvancedAvailableStation` como fallback. El
loader limpia exclusivamente un posible contexto de revisita; no escribe ni
normaliza `gvo.progress.v1`. `/qr/*` captura variantes inválidas o manipuladas
sin añadir scanner, cámara, red externa ni dependencias.

## Arquitectura de Estación III

La ruta `/estacion/3` monta `World3RootScreen`. Este componente coordina índice, gates, páginas narrativas, giro de hoja, Lía, ayuda gestual, responsive y salida; el copy específico vive en `station3Content.ts`.

### Estado y progreso

La máquina distingue cuatro fases superiores:

```text
entering → index ↔ turning ↔ page
```

Las páginas tienen subfases propias. PLANTA recorre observación; PROTOTIPO recorre ensamble, prueba y aprendizaje; SEÑAL recorre captura, inspección y evidencia. Los registros usan `locked`, `available` y `completed`, y solo el siguiente registro de `PLANTA → PROTOTIPO → SEÑAL` queda disponible. Al completar los tres, el sello pasa de `hidden` a `unlocking` y `ready`, habilitando `Continuar`.

El conjunto `completed`, las subfases y el modo revisita viven en estado React de la instancia montada. No se escriben en `localStorage` ni `sessionStorage`; recargar desmonta la pantalla y reinicia Estación III. La utilidad aislada `src/domain/progress/progress.storage.ts` no está conectada a este runtime.

### Page-turn

`World3PageTurnLayer` consume la hoja real declarada en `world3RuntimeAssets.notebook.turnPage`. `world3PageTurnGeometryContract` fija `680 ms` en movimiento normal y `120 ms` con reduced motion. La geometría se congela durante el giro y compensa los límites alfa desde `left center`; índice y detalle permanecen montados, pero solo la capa activa es interactiva.

### Actor de Lía

`World3LiaActor` resuelve las poses `idle`, `pointing`, `observing`, `confirming` y `closure` desde el manifest runtime. La pose es decorativa y responde a la fase; los mensajes accesibles permanecen como texto DOM.

### Assets y manifests

- `world3RuntimeAssets.ts`: fuente única de rutas para textura, cuaderno, hoja, cinco poses de Lía, tres figuras de registros y cuatro sprite sheets.
- `world3SemanticAssetManifest.ts`: contrato de rol, modo de consumo, grilla y responsabilidad semántica.
- `public/assets/gvo/stations/world-3/notebook-pixel/runtime/`: paquete runtime aprobado.
- `public/assets/gvo/current-used/world-3-root/`: copia auditable de assets usados.

Las sprite sheets aportan anotaciones decorativas por fase. Narrativa, estados, controles, traza, checks y etiquetas no se rasterizan: permanecen semánticos y testeables.

### Traza de SEÑAL

`SignalTraceDisplay` usa arrays constantes de puntos para captura, inspección y evidencia. La revelación ocurre una sola vez en movimiento normal, sin bucle; luego la traza se congela con regiones deterministas de ruido, caída y límite. Reduced motion presenta el resultado sin barrido animado.

### Gates, revisitas y ayudas de mano

El índice calcula el siguiente registro disponible desde el número de completados. `GestureHint` se ancla a ese control y no altera el gate ni sustituye su nombre accesible. Los registros completados siguen disponibles para revisita. Después de cerrar una página, se restaura el foco al índice y se conserva la modalidad pointer/teclado para QA.

### Responsive y accesibilidad

`World3RootScreen` clasifica la composición como `compact-scroll`, `portrait-balanced`, `tablet-portrait` o `tablet-landscape`. La narrativa puede moverse fuera del cuaderno en tablet landscape sin duplicar elementos interactivos. Controles nativos, `aria-label`, `aria-hidden`, `inert`, restauración de foco y bloqueo explícito de cámara/QR mantienen el contrato accesible. `prefers-reduced-motion` reduce transiciones y elimina movimiento repetitivo sin ocultar estados finales.

## Transición Mundo II → Mundo III

`worldTwoToWorldThreeTransition` usa `TransitionWorldRuntimeRoute` y `TransitionWorld`. El contrato es pasivo y automático, sin CTA: espera `2300 ms` en movimiento normal o `1000 ms` con reduced motion y navega a `/estacion/3` con reemplazo de historial. La aprobación humana de este comportamiento forma parte del cierre de Estación III.

## Arquitectura de Estación IV

La ruta `/estacion/4` monta `World4RootScreen`. La máquina pedagógica mantiene
una sola fuente de progreso y recorre `entering`, `reading`, `moving`, `chain`,
`exit_ready` y `exiting`. `useWorld4MotionController` deriva fases visuales,
epoch, input lock y timers cancelables sin persistir una segunda máquina.

### Composición y geometría

- `world4Geometry.ts` fija artboard `1536×1024`, ocho anchors y z-order.
- `World4Stage.tsx` compone environment, rear plane, haze, sombra, base, mesa,
  ruta pasiva, nodos, Lía y UI.
- `World4NodeStack.tsx` resuelve halo, pedestal, objeto, FX y hit target.
- z1 permanece retenido; z5 se conserva como asset pero no se renderiza por
  `front-edge-disabled-by-human-review`.
- El layout se escala como una sola escena; no usa offsets por viewport.

### Assets

- `world4RuntimeAssets.ts`: fuente única de 20 rutas runtime.
- `world4AssetManifest.ts`: hashes aprobados, dimensiones, alpha bounds, slices
  y sentinel del master genérico rechazado.
- Runtime: `public/assets/gvo/stations/world-4/system-table/runtime/`.
- Espejos auditables: `public/assets/gvo/current-used/world-4-root/`.
- Los 20 pares son byte-idénticos. Lía reutiliza assets compartidos existentes;
  no duplica nuevas poses.

### Motion e interacción

- `World4RoutePulse` superpone siete segmentos SVG al PNG pasivo.
- `World4NodeFx` y `world4NodeFxConfig` aplican un efecto semántico por nodo
  en coordenadas normalizadas al bbox alfa.
- `World4LiaGuide` reutiliza `greeting` y `explain_calm` con WAAPI puntual.
- `World4AmbientLayer` limita ambiente a haze, ribbons, motes y pool local.
- `World4TapHint` reutiliza `GestureHint` una vez por sesión.
- Chain complete revela el CTA y la revisita habilita los ocho nodos sin
  alterar progreso.

### Responsive, fullscreen y accesibilidad

Portrait es soportado y mobile landscape recomendado. `OrientationHint` es
no bloqueante; `ImmersiveModeControl` sólo solicita fullscreen mediante gesto
explícito. Los controles son nativos, admiten pointer/Enter/Space, mantienen
focus visible y hit targets ≥44×44. Estados completed no dependen sólo del
color. Reduced motion conserva secuencia, copy, CTA y revisita mediante fades
y highlights estáticos.

## PWA y permisos

La PWA mantiene manifest, service worker y cache local. No usa notificaciones
push ni solicita permisos innecesarios. Estación III declara cámara, QR y
permisos sensibles como bloqueados. Estación IV añade fullscreen opt-in, sin
permisos persistentes; la instalación PWA no se certificó en la plataforma QA
y un despliegue LAN instalable requiere origen seguro.

`GVO_DEBT_010` separa el precache crítico del cache runtime sin dividir el
bundle por rutas. La clase A —shell, bundle, fuentes, Carga inicial y Portada—
se precachea. Los assets compartidos del recorrido y los assets específicos de
estación permanecen desplegados y usan `StaleWhileRevalidate` same-origin al
solicitarse; el matcher queda restringido a `/assets/` locales con extensiones
`json`, `png`, `svg`, `webp` o `woff2`. El fallback de navegación continúa en
`/index.html` y la limpieza de precaches obsoletos permanece activa.

Los mirrors `public/assets/gvo/current-used`, las bibliotecas no consumidas y
los README/manifests documentales se conservan como fuentes tracked, pero el
plugin de build los excluye de `dist` mediante una lista cerrada y validada.
No se alteran assets canónicos ni imports runtime. La decisión completa está en
[ADR-0004](decisions/ADR-0004-pwa-precache-y-cache-runtime.md).

## Estado y límites

Estaciones III y IV están `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`). Mundo V conserva una base Fable funcional, pero sus visuales son procedurales/reemplazables y no está cerrado ni aprobado. Los documentos numerados bajo `docs/status/` son registros históricos; el estado vigente se consulta en [CURRENT_STATE.md](status/CURRENT_STATE.md) y los contratos completos en [GVO_STATION3_COMPLETE.md](status/GVO_STATION3_COMPLETE.md) y [GVO_ST4_018E_STATION4_CLOSEOUT.md](status/GVO_ST4_018E_STATION4_CLOSEOUT.md).
