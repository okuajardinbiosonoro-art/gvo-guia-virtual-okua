# GVO - Mundo I: Raiz

## Mobile coordinate system fix 004F-1C

## 0. Estado

004F-1C queda como correccion estructural mobile del sistema de coordenadas de Mundo I. La pantalla sigue en revision visual y requiere revision manual real del usuario antes de declararse aprobada.

Este ticket corrige el sistema de coordenadas mobile y la equivalencia runtime-calibrador. No implementa animacion, teletransporte, particulas, root flow, focus scaling ni navegacion de salida.

## 1. Objetivo

Unificar la geometria de `/estacion/1` y `/dev/world1-root-layout` para que planta, raices, nodos, Lia, copy, boton y camino de salida se posicionen contra el mismo stage visual mobile-first.

## 2. Problema detectado

La pantalla podia verse correcta en PC o viewport reducido, pero no era confiable en navegador movil real. El problema no era un valor aislado: el runtime y el calibrador no compartian exactamente el mismo contenedor ni la misma proyeccion responsive.

## 3. Diagnostico runtime vs calibrador

- El runtime usaba `.world1-root-stage` como stage real centrado en pantalla.
- El calibrador usaba `.world1-calibrator__stage-shell` con padding y un stage interno propio, lo que reducia el area calibrada.
- El runtime tenia `max-height` sobre un stage con `width` fija; en pantallas bajas esto podia comprimir altura sin recalcular ancho desde la proporcion original.
- El calibrador usaba variables `--cal-*` para capas principales, mientras el runtime usaba `--world1-*`.
- Los nodos se anclaban solo en X con `translateX(-50%)`; el valor Y representaba borde superior, no centro visual.
- La posicion de Lia en runtime estaba expresada con `right`, mientras el calibrador la expresaba como X porcentual.
- Los defaults del calibrador para nodos no reflejaban la estabilizacion mobile 004F-1B.

## 4. Sistema de coordenadas aplicado

Se creo el sistema compartido:

```txt
world1-stage-941x1672-004F1C
```

Regla aplicada:

```txt
X/Y de capas principales = porcentaje sobre el stage visual 941 / 1672.
Nodos = left/top porcentual + translate(-50%, -50%).
Lia = left/top porcentual + translateX(-50%).
Planta = left/top porcentual con ancla interna aprobada.
```

## 5. Cambios en stage

- Nuevo componente compartido `World1RootStageFrame`.
- Nuevo archivo de tokens `world1RootLayoutTokens.ts`.
- Runtime y calibrador declaran `data-world1-coordinate-system="world1-stage-941x1672-004F1C"`.
- El ancho del stage ahora considera la altura disponible:

```css
width: min(
  100%,
  430px,
  calc(var(--world1-stage-available-height) * 941 / 1672)
);
aspect-ratio: 941 / 1672;
```

- Se usa fallback `100vh`, preferencia `100svh` y `100dvh` cuando el navegador lo soporta.

## 6. Cambios en panel inferior

El panel inferior no se movio funcionalmente. La correccion garantiza que se mida dentro del mismo stage y que las validaciones detecten si los nodos o el camino de salida invaden el panel.

## 7. Cambios en nodos

- Los nodos usan ancla central en X/Y.
- Los valores responsive de 004F-1B se conservaron.
- Se mantuvo la tipografia legible para evitar la confusion de letras en labels.
- No se hizo focus scaling ni nuevas interacciones.

## 8. Cambios en planta-raiz

No se cambiaron assets ni valores base de planta/raiz. La correccion evita que el stage mobile altere la relacion perceptual por compresion de caja.

## 9. Cambios en exit path

No se cambio el asset ni se implemento navegacion de salida. El exit path permanece contenido en el mismo stage y se valido que no invada el panel en `ready_to_continue`.

## 10. Cambios en calibrador

- `/dev/world1-root-layout` usa el mismo `World1RootStageFrame`.
- Las capas principales del calibrador pasan a variables `--world1-*`.
- `--cal-*` queda reservado para UI dev: panel de prueba, guias y controles.
- El marco visual del calibrador usa outline externo para no modificar el area calibrada.
- Los presets locales siguen siendo locales y no modifican `/estacion/1`.

## 11. Validacion por dispositivo

Se genero `docs/gvo/world-1/validation/004F1C/layout-metrics.json` con contextos moviles simulados:

- iPhone SE: 375x667, mobile, touch, DPR 2.
- iPhone 12/13: 390x844, mobile, touch, DPR 3.
- Pixel-like: 393x851, mobile, touch, DPR 2.75.
- Samsung-like: 412x915, mobile, touch, DPR 2.625.
- Small Android: 360x740, mobile, touch, DPR 2.
- Viewports basicos: 360x800, 390x844, 430x932.

Resultado automatico: 45 mediciones runtime sin overflow horizontal, sin scroll vertical, sin solapes nodo-panel, sin audio, sin video y sin UI dev filtrada.

## 12. Validacion por estado

Estados validados en `/estacion/1`:

- intro.
- relation.
- perception.
- mediation.
- ready_to_continue.

Capturas generadas:

- `runtime_iphone_se_intro.png`
- `runtime_iphone_se_ready.png`
- `runtime_iphone_13_intro.png`
- `runtime_iphone_13_ready.png`
- `runtime_pixel_intro.png`
- `runtime_pixel_ready.png`
- `runtime_360_relation.png`
- `runtime_360_perception.png`
- `runtime_360_mediation.png`
- `runtime_360_ready.png`
- `calibrator_390_relation.png`
- `calibrator_390_ready.png`

## 13. Elementos no implementados

- No se implemento animacion.
- No se implemento teletransporte.
- No se implementaron particulas.
- No se implemento root flow.
- No se implemento focus scaling.
- No se implemento navegacion de salida.
- No se crearon ni editaron assets.
- No se agregaron dependencias.
- No se tocaron Carga Inicial, Portada / Intro ni Transicion entre mundos.

## 14. Checks ejecutados

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run typecheck`: no disponible en `package.json`.

## 15. Deudas pendientes

- Revision manual en celular real por el usuario.
- Si un navegador movil especifico muestra diferencias por barra dinamica o zoom del sistema, revisar con evidencia de ese dispositivo antes de ajustar valores.
- La salida visual sigue como placeholder funcional sin navegacion real, por alcance del ticket.

## 16. Revision manual requerida

La validacion automatica confirma estabilidad tecnica, pero la aprobacion visual final debe hacerla el usuario Ing. Jose David en dispositivo real.
