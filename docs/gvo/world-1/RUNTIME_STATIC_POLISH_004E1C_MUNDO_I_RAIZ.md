# GVO - Mundo I: Raiz
## Runtime static polish 004E-1C

## 0. Estado

`004E-1C_STATIC_PLANT_SCALE_NODE_POSITIONS / COMPOSICION_ESTATICA_AJUSTADA / SIN_INTERACCION / SIN_ANIMACION`

Este ticket corrige composicion estatica. No implementa interaccion, teletransporte, particulas, root flow ni focus scaling.

## 1. Objetivo

Corregir dos observaciones persistentes detectadas tras `004E-1B`:

- la planta seguia viendose pequena frente a la raiz;
- los nodos conceptuales seguian demasiado cerca del origen de ramas y debian bajar hacia sus tramos finales.

El ajuste se limita a `/estacion/1` y a CSS/documentacion de validacion.

## 2. Observaciones persistentes detectadas por revision manual

- La raiz base ya funcionaba como elemento representativo y no debia reducirse.
- La planta necesitaba mayor presencia visual para sentirse como origen vivo del sistema subterraneo.
- `RELACION`, `PERCEPCION` y `MEDIACION` debian sentirse mas cerca del destino conceptual de cada rama.
- Los nodos no debian invadir el bloque de texto inferior ni perder legibilidad.

## 3. Correcciones aplicadas

Se ajusto `World1RootScreen.css`:

- aumento claro de escala de planta;
- reposicion vertical de planta para conservar contacto con suelo visual;
- raiz conservada en ancho y posicion;
- nodos reubicados mas abajo y un poco mas hacia los extremos laterales;
- panel inferior y boton desplazados levemente hacia abajo para liberar aire visual a los nodos sin cambiar textos ni comportamiento.

No se modifico `World1RootScreen.tsx`, porque los estados, assets, textos y boton deshabilitado ya cumplian el alcance.

## 4. Escala final de planta

Valores finales:

```css
--world1-plant-top: 12.8%;
--world1-plant-width: 40%;
```

Comparacion:

| Variable | 004E-1B | 004E-1C |
| --- | ---: | ---: |
| `--world1-plant-top` | `15.8%` | `12.8%` |
| `--world1-plant-width` | `31%` | `40%` |

La planta queda visiblemente mas grande que en `004E-1B` y sigue alineada con el suelo visual. La base/tallo permanece centrada sobre el nacimiento de la raiz.

## 5. Ubicacion final de nodos

Valores finales base:

```css
.world1-root-node--relation {
  top: 62%;
  left: 8%;
}

.world1-root-node--perception {
  top: 60%;
  left: 50%;
}

.world1-root-node--mediation {
  top: 62%;
  right: 8%;
}
```

Valores para `width <= 374px`:

```css
.world1-root-node--relation {
  top: 60%;
  left: 5%;
}

.world1-root-node--perception {
  top: 58%;
}

.world1-root-node--mediation {
  top: 60%;
  right: 5%;
}
```

La excepcion responsive conserva el principio del ticket: los nodos estan mas bajos que en `004E-1B`, pero no invaden el bloque de texto en 360px.

## 6. Comparacion contra 004E-1B

| Elemento | 004E-1B | 004E-1C |
| --- | --- | --- |
| Planta | `31%` de ancho | `40%` de ancho |
| Raiz | `100%` de ancho | `100%` de ancho |
| RELACION | `top: 56%; left: 10%` | `top: 62%; left: 8%` |
| PERCEPCION | `top: 54%; left: 50%` | `top: 60%; left: 50%` |
| MEDIACION | `top: 56%; right: 10%` | `top: 62%; right: 8%` |

La raiz no se redujo. La solucion principal fue aumentar planta y bajar nodos.

## 7. Validacion mobile

Capturas y metricas generadas en:

`docs/gvo/world-1/validation/004E1C/`

| Viewport | Archivo | Estado |
| --- | --- | --- |
| 360x800 | `mobile_360x800.png` | Generada |
| 390x844 | `mobile_390x844.png` | Generada |
| 430x932 | `mobile_430x932.png` | Generada |
| metricas | `layout-metrics.json` | Generado |

Criterios revisados:

- no aparece placeholder;
- no hay overflow horizontal;
- planta mas grande que en `004E-1B`;
- planta proporcionalmente mas coherente con la raiz;
- raiz no fue reducida;
- raiz nace debajo de la planta;
- nodos completos y mas bajos;
- labels legibles;
- texto inferior legible;
- boton `Continuar` sigue deshabilitado;
- sin audio;
- sin video.

## 8. Elementos no implementados

No se implemento:

- `activeConcept`;
- click en nodo;
- click en raiz;
- dialog state;
- teleport state;
- particulas;
- root flow;
- focus scaling;
- exit path visible;
- navegacion de `Continuar`;
- `localStorage`;
- reduced-motion avanzado.

## 9. Checks ejecutados

- `git status --short`;
- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run audit:assets`;
- `npm run typecheck`: `NO_DISPONIBLE`.

## 10. Deudas pendientes

- La composicion estatica queda lista para revision visual del usuario.
- La fase funcional debera definir interaccion por nodos, root flow, particulas, dialogos y navegacion.
- La afinacion exacta entre cada rama y su nodo puede revisarse de nuevo cuando exista estado activo real de cada concepto.
