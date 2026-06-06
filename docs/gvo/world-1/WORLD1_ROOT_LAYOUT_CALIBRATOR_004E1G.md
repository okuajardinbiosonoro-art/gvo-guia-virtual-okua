# GVO - Mundo I: Raiz
## Layout calibrator 004E-1G

## 0. Estado

`004E-1G_LAYOUT_CALIBRATOR_DEV_ONLY / HERRAMIENTA_TEMPORAL / SIN_CAMBIOS_VISUALES_FINALES`

Se creo una ruta temporal de desarrollo para calibrar visualmente el empalme planta-raiz sin aplicar valores finales al runtime de `/estacion/1`.

## 1. Objetivo

Evitar continuar adivinando valores CSS en tickets sucesivos. La herramienta permite ajustar en vivo planta, raiz y nodos de referencia para que el usuario pueda reportar valores visualmente aprobados.

## 2. Problema que resuelve

Los tickets previos alinearon metricamente los anclajes, pero la percepcion visual del empalme entre base de planta y nacimiento de raiz seguia necesitando revision manual. La herramienta muestra los mismos assets reales con guias, puntos de anclaje y delta X/Y para calibracion visual.

## 3. Ruta dev creada

Ruta:

```txt
/dev/world1-root-layout
```

La ruta productiva se conserva:

```txt
/estacion/1
```

`/estacion/1` no muestra controles, guias ni exportaciones.

## 4. Controles disponibles

La herramienta incluye sliders e inputs numericos para:

- `plantX`;
- `plantY`;
- `plantWidth`;
- `plantAnchorX`;
- `plantAnchorY`;
- `rootOriginX`;
- `rootOriginY`;
- `rootsTop`;
- `rootsWidth`;
- `nodeRelationTop`;
- `nodeRelationX`;
- `nodePerceptionTop`;
- `nodePerceptionX`;
- `nodeMediationTop`;
- `nodeMediationX`.

Tambien incluye toggles para:

- `background`;
- `ambient`;
- `plant`;
- `roots`;
- `nodes`;
- `Lia`;
- `guides`;
- `anchor dots`;
- `stage center`.

## 5. Guias visuales

Cuando `guides` esta activo, la herramienta muestra:

- linea vertical del centro del stage;
- punto de origen de raiz;
- punto de anclaje visible de planta;
- linea entre ambos puntos;
- delta X/Y en pixeles;
- estado textual: `aligned`, `needs vertical adjustment`, `needs horizontal adjustment` o `manual visual check required`.

Las guias existen solo en `/dev/world1-root-layout`.

## 6. Exportacion de valores CSS/JSON

La herramienta muestra un bloque CSS copyable con variables como:

```css
--world1-root-origin-x: 50.8%;
--world1-root-origin-y: 35.9%;
--world1-plant-x: 50.5%;
--world1-plant-y: 33.5%;
--world1-plant-width: 40%;
--world1-plant-anchor-x: 56.9%;
--world1-plant-anchor-y: 93.2%;
--world1-roots-top: 20.3%;
--world1-roots-width: 100%;
```

Tambien muestra un bloque JSON copyable con los valores actuales de calibracion.

La herramienta actualiza query params para compartir una configuracion manual, pero no aplica esos valores al runtime final.

## 7. Presets

Presets disponibles:

- `004E-1D`;
- `004E-1E`;
- `current`;
- `manual candidate`.

`current` refleja el estado productivo vigente. Despues de la calibracion manual aprobada por el usuario, `current` y `manual candidate` usan:

- `plantX: 50.5%`;
- `plantY: 33.5%`;
- `plantWidth: 40%`;
- `plantAnchorX: 56.9%`;
- `plantAnchorY: 93.2%`;
- `rootOriginX: 50.8%`;
- `rootOriginY: 35.9%`;
- `rootsTop: 20.3%`;
- `rootsWidth: 100%`.

Los presets `004E-1D` y `004E-1E` quedan como comparativos historicos.

## 8. Confirmacion de que /estacion/1 no cambio funcionalmente

Validacion automatizada:

- `/estacion/1` sigue renderizando Mundo I real;
- `/estacion/1` no muestra `Calibracion Mundo I`;
- `/estacion/1` no muestra controles `plantX` ni `rootOriginX`;
- `/estacion/1` no muestra bloques CSS/JSON de calibracion;
- el boton `Continuar` sigue deshabilitado;
- no se agregaron audio ni video.

## 9. Validacion mobile

Capturas y metricas generadas en:

`docs/gvo/world-1/validation/004E1G/`

| Ruta | Viewports | Estado |
| --- | --- | --- |
| `/estacion/1` | 360x800, 390x844, 430x932 | Generadas |
| `/dev/world1-root-layout` | 360x800, 390x844, 430x932 | Generadas |
| metricas | `validation-metrics.json` | Generado |

Criterios revisados:

- sin overflow horizontal;
- `/estacion/1` sin guias ni controles;
- calibrador con controles visibles;
- calibrador con guias y puntos de anclaje;
- calibrador con exportacion CSS/JSON;
- sin audio;
- sin video;
- sin recursos externos.

## 10. Elementos no implementados

No se implemento:

- interaccion final de Mundo I;
- `activeConcept`;
- clicks funcionales en nodos o raiz;
- seleccion de conceptos;
- teletransporte;
- particulas;
- root flow;
- focus scaling;
- dialogos dinamicos;
- navegacion de `Continuar`;
- aplicacion automatica de valores a `/estacion/1`.

## 11. Checks ejecutados

- `git status --short`;
- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run audit:assets`;
- `npm run typecheck`: `NO_DISPONIBLE`.

## 12. Como debe usarse la herramienta

1. Abrir `/dev/world1-root-layout`.
2. Ajustar planta, raiz y anclajes con sliders o inputs numericos.
3. Comparar presets `004E-1D`, `004E-1E`, `current` y `manual candidate`.
4. Usar toggles para ocultar capas que estorben la lectura.
5. Revisar el delta X/Y y la lectura visual del empalme.
6. Copiar el bloque CSS o JSON cuando el usuario apruebe una configuracion.

## 13. Proxima accion esperada

La herramienta nacio como calibrador temporal sin aplicar valores finales al runtime. Tras revision manual del usuario, los valores aprobados fueron aplicados a `/estacion/1` en una iteracion posterior acotada, sin cambiar interaccion, animacion, teletransporte, particulas ni assets.
