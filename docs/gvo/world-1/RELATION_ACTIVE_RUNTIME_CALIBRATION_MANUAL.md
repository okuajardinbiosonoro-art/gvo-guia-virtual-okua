# GVO — Mundo I: Raiz
## Aplicacion runtime de calibracion RELACION manual-calibration

## Estado

Aplicado al runtime de `/estacion/1`.

Actualizacion posterior: los valores iniciales de RELACION fueron reemplazados
por la calibracion conjunta de las tres raices activas documentada en
`ACTIVE_ROOTS_RUNTIME_CALIBRATION_MANUAL.md`.

## Fuente

Valores entregados por el usuario desde el calibrador `/dev/world1-root-layout`, preset local `manual-calibration`, estado `relation_active`.

## Valores aplicados

```css
--world1-active-relation-x: 49.4%;
--world1-active-relation-y: 70.1%;
--world1-active-relation-width: 96.2%;
--world1-active-relation-opacity: 1;
```

## Alcance

Se aplico solo la posicion, escala y opacidad de la raiz activa RELACION.

No se modifico:

- planta;
- raiz base;
- nodos;
- Lia;
- dialogo;
- PERCEPCION;
- MEDIACION;
- assets;
- rutas;
- comportamiento funcional.

## Confirmaciones

- `/estacion/1` mantiene la interaccion estatica existente de RELACION.
- PERCEPCION y MEDIACION siguen bloqueadas.
- `Continuar` sigue deshabilitado.
- No se agrego animacion.
- No se agrego teletransporte.
- No se agregaron particulas.
- No se agregaron dependencias.
- No se usaron recursos externos, audio, video ni CDN.
