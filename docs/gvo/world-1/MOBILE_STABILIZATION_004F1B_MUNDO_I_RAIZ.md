# GVO — Mundo I: Raiz
## Mobile stabilization 004F-1B

## 0. Estado

Estado del ticket: IMPLEMENTADO EN RUNTIME.

Este ticket estabiliza layout móvil de Mundo I. No implementa animación, teletransporte, partículas, root flow, focus scaling, persistencia ni navegación de salida.

Ruta intervenida:

```txt
/estacion/1
```

Base:

```txt
13053c2 feat(gvo): add critical asset preload by screen
```

## 1. Objetivo

Estabilizar visualmente Mundo I: Raiz en mobile antes de cualquier trabajo de animacion o salida entre pantallas.

El foco fue:

- separar nodos del panel inferior;
- estabilizar lectura del panel;
- suavizar visualmente el camino luminoso de salida;
- mantener planta/raiz aprobadas;
- conservar la secuencia estatica actual.

## 2. Problemas detectados en móvil

Problemas de partida:

- los nodos estaban cerca del panel inferior, especialmente en estados con texto mas largo;
- `mediation` era el estado mas sensible por sumar boton interno `Cerrar raiz`;
- el camino luminoso de salida se percibia como una capa grande pegada/sobrepuesta;
- 360x800 era el viewport mas estricto;
- no convenia avanzar con efectos si el layout base podia competir con el texto.

## 3. Cambios aplicados

Archivos runtime modificados:

```txt
src/screens/World1Root/World1RootScreen.tsx
src/screens/World1Root/World1RootScreen.css
```

Cambios:

- se agrego metadata `data-world1-mobile-stabilization="004F-1B"`;
- se agregaron variables CSS para posiciones/escala de nodos;
- se subieron y redujeron ligeramente los nodos en mobile;
- se agrego override especifico para `mediation`;
- se redujo presion vertical del panel en `ready_to_continue`;
- se convirtio el camino de salida de full-cover a capa contenida con variables propias.

## 4. Nodos y panel inferior

Variables agregadas:

```css
--world1-node-relation-x
--world1-node-relation-y
--world1-node-relation-scale
--world1-node-perception-x
--world1-node-perception-y
--world1-node-perception-scale
--world1-node-mediation-x
--world1-node-mediation-y
--world1-node-mediation-scale
--world1-ready-node-relation-y
--world1-ready-node-perception-y
--world1-ready-node-mediation-y
```

Base runtime:

```css
relation: x 13%, y 51.5%, scale 0.92
perception: x 50%, y 49.5%, scale 0.92
mediation: x 87%, y 51.5%, scale 0.92
ready relation/perception/mediation y: 43% / 41% / 43%
```

Mobile 360:

```css
relation: x 13%, y 48.5%, scale 0.86
perception: x 50%, y 46.5%, scale 0.86
mediation: x 87%, y 48.5%, scale 0.86
ready relation/perception/mediation y: 40.5% / 38.5% / 40.5%
```

Override `mediation`:

```css
base: 48% / 46% / 48%
360px: 45.5% / 43.5% / 45.5%
```

Validacion:

- no hubo solape nodo-panel en 360, 390 ni 430;
- no hubo overflow horizontal;
- no hubo scroll vertical en flujo runtime.

## 5. Camino de salida

Variables agregadas:

```css
--world1-exit-path-x
--world1-exit-path-y
--world1-exit-path-width
--world1-exit-path-opacity
```

Valores base:

```css
x: 50%
y: 39%
width: 58%
opacity: 0.42
```

Valores 360px:

```css
y: 38%
width: 56%
opacity: 0.4
```

Cambio técnico:

- el asset dejo de ocupar todo el stage con `object-fit: cover`;
- ahora usa `object-fit: contain`;
- queda bajo planta, Lía, nodos y panel;
- no solapa geometricamente el panel en las metricas.

## 6. Planta y raíz

No se modificaron:

```css
--world1-plant-x
--world1-plant-y
--world1-plant-width
--world1-root-origin-x
--world1-root-origin-y
```

Motivo:

- la validacion no mostro una necesidad clara de microajuste;
- el ticket pedia preservar la calibracion aprobada salvo evidencia en contra;
- mover nodos/panel resolvio el problema primario sin reabrir planta-raiz.

## 7. Estados revisados

Estados validados:

- `intro`
- `relation`
- `perception`
- `mediation`
- `ready_to_continue`

La secuencia funcional se conserva:

```txt
intro -> RELACIÓN -> PERCEPCIÓN -> MEDIACIÓN -> ready_to_continue
```

`Continuar` sigue preparado en ready, pero no navega.

## 8. Viewports validados

Viewports:

- `360x800`
- `390x844`
- `430x932`

Capturas:

```txt
docs/gvo/world-1/validation/004F1B/intro_360x800.png
docs/gvo/world-1/validation/004F1B/relation_360x800.png
docs/gvo/world-1/validation/004F1B/perception_360x800.png
docs/gvo/world-1/validation/004F1B/mediation_360x800.png
docs/gvo/world-1/validation/004F1B/ready_360x800.png
docs/gvo/world-1/validation/004F1B/intro_390x844.png
docs/gvo/world-1/validation/004F1B/ready_390x844.png
docs/gvo/world-1/validation/004F1B/intro_430x932.png
docs/gvo/world-1/validation/004F1B/ready_430x932.png
```

Metricas:

```txt
docs/gvo/world-1/validation/004F1B/layout-metrics.json
```

Resultado:

- `horizontalOverflow`: false en todos los estados/viewports.
- `verticalScroll`: false en todos los estados/viewports.
- `nodePanelOverlaps`: vacio en todos los estados/viewports.
- `exitPathOverlapsPanel`: false en todos los estados/viewports.
- `continueVisible`: true en todos los estados/viewports.
- `hasAudio`: false.
- `hasVideo`: false.
- `hasDevUi`: false.

## 9. Elementos no implementados

No se implemento:

- animacion;
- teletransporte;
- particulas;
- root flow;
- focus scaling;
- persistencia;
- navegacion de salida;
- revision libre de nodos;
- nuevas rutas;
- nuevos assets.

## 10. Checks ejecutados

Resultado de cierre:

- `npm run lint`: OK.
- `npm run test`: OK, 8 archivos / 65 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run typecheck`: NO_DISPONIBLE como script separado.

Nota:

`npm run build` ejecuta `tsc -b` antes de `vite build`. Vite mantiene la advertencia conocida de chunk mayor a 500 KB; no se corrige en este ticket.

Validacion parcial previa:

```txt
src/screens/World1Root/World1RootScreen.test.tsx: OK, 9 tests.
```

## 11. Deudas pendientes

- Validacion manual en celular fisico real.
- Revisar percepcion del camino luminoso con el usuario antes de conectar salida.
- Mantener congelada la relacion planta-raiz hasta una revision visual especifica.
- No avanzar a efectos hasta que el usuario confirme que la lectura mobile esta estable.

## 12. Revisión manual requerida

Codex valido con Playwright en viewports mobile, pero la aprobacion visual debe realizarse en celular real por el usuario.

No se declara aprobacion visual final.
