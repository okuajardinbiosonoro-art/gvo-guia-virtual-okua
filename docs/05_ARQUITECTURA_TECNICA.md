# Arquitectura técnica

Actualizado: 2026-07-14

La base usa Vite, React, TypeScript y React Router. La aplicación es local-first, silenciosa y empaqueta sus recursos requeridos en el build; las pantallas runtime no dependen de recursos remotos obligatorios.

## Carpetas principales

- `src/app`: aplicación, router, rutas y providers.
- `src/components`: componentes reutilizables, incluido `GestureHint`.
- `src/content`: slots y copy editorial compartido.
- `src/data`: datos estáticos del flujo.
- `src/domain`: utilidades aisladas de dominio.
- `src/screens`: pantallas runtime y herramientas de desarrollo autorizadas.
- `src/shared/assets`: preloader y contratos compartidos de assets.
- `src/styles`: tokens y estilos globales.
- `public/assets/gvo`: assets empaquetados y registro `current-used`.
- `docs`: contratos canónicos, inventarios y registros históricos.
- `tools`: scripts de auditoría y estado.
- `tests/e2e`: pruebas end-to-end.

## Rutas runtime relevantes

| Ruta | Componente / contrato |
| --- | --- |
| `/` y `/carga` | `LoadingInitialScreen`. |
| `/portada` | `CoverIntroScreen`. |
| `/transition/intro-to-station-1` | `TransitionWorldRuntimeRoute`. |
| `/estacion/1` | `World1RootScreen`. |
| `/transition/world-1-to-world-2` | Transición compartida. |
| `/estacion/2` | `World2RootScreen`. |
| `/transition/world-2-to-world-3` | Transición pasiva final hacia Estación III. |
| `/estacion/3` | `World3RootScreen`, Estación III aprobada. |
| `/transition/world-3-to-world-4` | Salida técnica existente; no aprueba Mundo IV. |
| `/estacion/4` | Base técnica preexistente, **NO APROBADA**. |
| `/final` | `FinalRootScreen`. |
| `/qr/:stationId` | Entrada QR técnica. |

Las rutas `/dev/*` son herramientas aisladas y no se deben presentar como pantallas finales.

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

## PWA y permisos

La PWA mantiene cache local básico. No usa notificaciones push ni solicita permisos innecesarios. Estación III declara cámara, QR y permisos sensibles como bloqueados.

## Estado y límites

Estación III está `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`). Mundo IV conserva una base técnica preexistente, está **NO APROBADA** y no fue iniciado por `GVO-017K-R1`. Los documentos numerados bajo `docs/status/` son registros históricos; el estado vigente se consulta en [CURRENT_STATE.md](status/CURRENT_STATE.md) y el contrato completo en [GVO_STATION3_COMPLETE.md](status/GVO_STATION3_COMPLETE.md).
