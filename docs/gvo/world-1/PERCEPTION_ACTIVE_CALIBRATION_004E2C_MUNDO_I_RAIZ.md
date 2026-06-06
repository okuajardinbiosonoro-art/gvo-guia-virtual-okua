# GVO — Mundo I: Raiz
## Calibracion visual de PERCEPCION activa 004E-2C

## 0. Estado

Estado del ticket: PREPARACION DEV IMPLEMENTADA.

La ruta `/dev/world1-root-layout` queda preparada para calibrar visualmente el estado futuro `perception_preview`. La ruta runtime `/estacion/1` no recibio valores finales de PERCEPCION, no habilito PERCEPCION y conserva la interaccion estatica aprobada de RELACION.

Nota posterior: despues de esta preparacion, el usuario entrego una calibracion manual conjunta para las tres raices activas. Esos valores quedaron sincronizados como variables CSS/defaults de calibrador en `ACTIVE_ROOTS_RUNTIME_CALIBRATION_MANUAL.md`, sin desbloquear PERCEPCION en runtime.

## 1. Objetivo

Preparar el calibrador avanzado para que el usuario pueda ajustar, revisar y exportar valores de PERCEPCION activa antes de cualquier aplicacion runtime.

El trabajo se concentra en:

- raiz activa PERCEPCION;
- nodo PERCEPCION en estado `active`;
- Lia `look_perception`;
- exportacion CSS/JSON;
- flujo de enfoque visual sin ruido.

## 2. Alcance

Incluido:

- estado seleccionable `perception_preview`;
- foco rapido `Enfocar PERCEPCION`;
- seleccion automatica de raiz activa, nodo y pose de Lia al entrar a `perception_preview`;
- controles de PERCEPCION en Raices activas, Nodos y Lia;
- guardado local, carga, duplicado, renombrado, reset, importacion y exportacion ya compatibles con PERCEPCION;
- tests para confirmar que el runtime no recibe UI dev ni desbloquea PERCEPCION.

Fuera de alcance:

- aplicar valores finales a `/estacion/1`;
- activar PERCEPCION en runtime;
- activar MEDIACION;
- habilitar Continuar;
- animacion, teletransporte, particulas, root flow o focus scaling;
- crear, editar o reexportar assets.

## 3. Estado perception_preview

`perception_preview` existe solo en la herramienta dev. Al seleccionarlo, el calibrador prepara:

- fondo base;
- luz ambiental;
- planta;
- raiz base;
- raiz activa PERCEPCION;
- nodo RELACION como `completed`;
- nodo PERCEPCION como `active`;
- nodo MEDIACION como `locked`;
- Lia con pose `look_perception`;
- panel inferior opcional segun toggles.

Este estado no se filtra al runtime real.

## 4. Controles disponibles para PERCEPCION

Raiz activa PERCEPCION:

- `activePerceptionX`: -40% a 140%.
- `activePerceptionY`: -40% a 160%.
- `activePerceptionWidth`: 20% a 220%.
- `activePerceptionOpacity`: 0 a 1.

Nodo PERCEPCION:

- `nodePerceptionX`: -25% a 125%.
- `nodePerceptionY`: -15% a 125%.
- `nodePerceptionScale`: 0.35 a 2.

Lia `look_perception`:

- `liaLookPerceptionX`: -25% a 125%.
- `liaLookPerceptionY`: -25% a 125%.
- `liaLookPerceptionWidth`: 5% a 80%.

Los rangos son iguales o mas amplios que los recomendados para permitir calibracion fina sin bloquear el movimiento necesario en mobile.

## 5. Guardar/cargar/exportar valores

El calibrador conserva el flujo de presets locales mediante:

```txt
gvo-dev-world1-layout-calibrator-v2
```

Nombre sugerido de preset para esta fase:

```txt
manual-perception-calibration
```

La exportacion CSS incluye, entre otras, estas variables:

```css
--world1-active-perception-x: ...;
--world1-active-perception-y: ...;
--world1-active-perception-width: ...;
--world1-active-perception-opacity: ...;
--world1-node-perception-x: ...;
--world1-node-perception-y: ...;
--world1-node-perception-scale: ...;
--world1-lia-lookPerception-x: ...;
--world1-lia-lookPerception-y: ...;
--world1-lia-lookPerception-width: ...;
```

La exportacion JSON conserva:

- `screen: "world1-root"`;
- `state: "perception_preview"`;
- `values.activeRoots.perception`;
- `values.nodes.perception`;
- `values.lia.lookPerception`;
- `values.flat`;
- `toggles`;
- `nodeStates`.

Exportar no aplica ningun valor al runtime.

## 6. Confirmacion de que /estacion/1 no cambio

`/estacion/1` mantiene:

- interaccion estatica de RELACION;
- PERCEPCION bloqueada;
- MEDIACION bloqueada;
- Continuar deshabilitado;
- ausencia de controles dev;
- ausencia de guias dev;
- ausencia de `perception_preview` runtime.

La calibracion posterior agrego variables CSS preparadas para PERCEPCION y MEDIACION, pero no renderiza esas raices ni habilita sus nodos en `/estacion/1`.

## 7. Validacion mobile

Rutas validadas:

- `/dev/world1-root-layout`;
- `/estacion/1`.

Viewports objetivo:

- 360 x 800;
- 390 x 844;
- 430 x 932.

Capturas documentales:

```txt
docs/gvo/world-1/validation/004E2C/
```

Capturas esperadas/generadas:

- `calibrator_perception_preview_390x844.png`;
- `calibrator_perception_controls_390x844.png`;
- `station_relation_active_390x844.png`.

## 8. Elementos no implementados

- No se aplicaron valores finales a `/estacion/1`.
- No se implemento PERCEPCION en runtime.
- No se implemento MEDIACION.
- No se habilito Continuar.
- No se implemento animacion.
- No se implemento teletransporte.
- No se implementaron particulas.
- No se implemento root flow.
- No se implemento focus scaling.
- No se crearon ni editaron assets.
- No se agregaron dependencias.
- No se usaron CDN ni recursos externos.
- No se agrego audio ni video.

## 9. Checks ejecutados

Checks de cierre del ticket:

```powershell
git status --short
npm run lint
npm run test
npm run build
npm run audit:assets
```

`npm run typecheck` no existe como script independiente en `package.json`; el typecheck se ejecuta dentro de `npm run build`.

## 10. Como debe usarla el usuario

Iniciar servidor local:

```powershell
npm run dev
```

Abrir:

```txt
http://127.0.0.1:5173/dev/world1-root-layout
```

Flujo recomendado:

1. Entrar a `Estado`.
2. Seleccionar `perception_preview`.
3. Entrar a `Capas`.
4. Usar `Enfocar PERCEPCION`.
5. Ajustar en `Raices activas`, `Nodos` y `Lia`.
6. Guardar preset local como `manual-perception-calibration`.
7. Abrir `Guardar`.
8. Copiar CSS/JSON.
9. Entregar esos valores para un ticket posterior de aplicacion runtime.

## 11. Proxima accion esperada

El usuario debe calibrar PERCEPCION visualmente y entregar el CSS/JSON aprobado. La aplicacion de esos valores a `/estacion/1` debe hacerse solo en un ticket posterior.
