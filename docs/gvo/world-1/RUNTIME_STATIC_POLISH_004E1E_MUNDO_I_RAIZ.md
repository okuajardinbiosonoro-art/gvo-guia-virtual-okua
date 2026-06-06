# GVO - Mundo I: Raiz
## Runtime static polish 004E-1E

## 0. Estado

`004E-1E_STATIC_PLANT_ROOT_ANCHORS / ANCLAJE_VISUAL_PLANTA_RAIZ_AJUSTADO / SIN_INTERACCION / SIN_ANIMACION`

Este ticket corrige unicamente el empalme visual entre planta y raiz. No implementa interaccion, animacion, teletransporte, particulas, root flow ni focus scaling.

## 1. Objetivo

Resolver el desfase persistente entre la base visible de la planta y el nacimiento central de la raiz en `/estacion/1`.

La correccion se enfoco en alinear puntos visuales reales, no solo mover la caja CSS completa de la planta.

## 2. Observacion manual que origina el ticket

Tras `004E-1D`, la planta seguia pareciendo cerca de la raiz, pero no necesariamente naciendo desde ella. El usuario indico que la base de la planta debia quedar exactamente sobre el origen visual de la raiz y que el ajuste anterior no habia cambiado lo suficiente la lectura del empalme.

## 3. Diagnostico del problema de anclaje

El montaje anterior posicionaba la planta como una imagen directa con `top`, `left` y `translateX(-50%)`. Ese enfoque centraba la caja del PNG, pero no alineaba el punto visible de la base/tallo.

Diagnostico tecnico:

- La caja de la planta esta controlada por `.world1-root-plant`.
- La caja de raiz esta controlada por `.world1-root-layer--roots`.
- La planta se posicionaba con `top`, `left`, `width` y `transform`.
- El PNG de planta tiene transparencia interna y el centro visible de su base/tallo no coincide con el centro geometrico de la caja.
- La lectura de alpha del PNG mostro que el punto visible de base de planta usado para anclaje esta aproximadamente en `56.9%` horizontal y `90.7%` vertical dentro del PNG.
- La lectura del asset de raiz ubica el nacimiento central util cerca del centro real del stage, documentado como `50.8%` horizontal.
- `004E-1D` movia la caja, pero seguia usando la caja como referencia principal. Por eso el empalme visible podia seguir desfasado.

## 4. Correccion aplicada

Se reemplazo el enfoque de caja centrada por anclajes visuales explicitos:

- `--world1-root-origin-x`;
- `--world1-root-origin-y`;
- `--world1-plant-anchor-x`;
- `--world1-plant-anchor-y`.

La planta ahora se coloca en el origen visual de la raiz y su `transform` descuenta el punto visible de base/tallo dentro del PNG:

```css
.world1-root-plant {
  top: var(--world1-root-origin-y);
  left: var(--world1-root-origin-x);
  transform: translate(
    calc(-1 * var(--world1-plant-anchor-x)),
    calc(-1 * var(--world1-plant-anchor-y))
  );
}
```

No se modificaron nodos, textos, boton, rutas, logica ni assets.

## 5. Valores CSS finales

```css
.world1-root-stage {
  --world1-root-origin-x: 50.8%;
  --world1-root-origin-y: 35.9%;
  --world1-plant-anchor-x: 56.9%;
  --world1-plant-anchor-y: 90.7%;
  --world1-plant-width: 40%;
  --world1-roots-top: 20.3%;
  --world1-roots-width: 100%;
}
```

La raiz conserva su presencia:

```css
--world1-roots-width: 100%;
```

No se redujo como solucion principal.

## 6. Empalme final planta-raiz

El tallo/base visible de la planta queda alineado con el origen central de la raiz mediante anclaje CSS.

Metricas generadas con Playwright:

| Viewport | Delta X ancla | Delta Y ancla |
| --- | ---: | ---: |
| 360x800 | `0px` | `0.3px` |
| 390x844 | `0px` | `0.3px` |
| 430x932 | `0px` | `0.3px` |

Se genero una captura diagnostica con guias temporales en `mobile_390x844_anchor_guides.png`. Las guias fueron inyectadas solo durante Playwright y no forman parte del runtime final.

## 7. Estado de nodos

Los nodos conservaron la ubicacion alcanzada en `004E-1C`/`004E-1D`.

Estados iniciales:

| Nodo | Estado inicial |
| --- | --- |
| RELACION | available |
| PERCEPCION | locked/inactive |
| MEDIACION | locked/inactive |

No se agregaron clicks, foco, seleccion, dialogos ni estado activo.

## 8. Validacion mobile

Capturas y metricas generadas en:

`docs/gvo/world-1/validation/004E1E/`

| Viewport | Archivo | Estado |
| --- | --- | --- |
| 360x800 | `mobile_360x800.png` | Generada |
| 390x844 | `mobile_390x844.png` | Generada |
| 430x932 | `mobile_430x932.png` | Generada |
| 390x844 con guias | `mobile_390x844_anchor_guides.png` | Generada como diagnostico temporal |
| metricas | `layout-metrics.json` | Generado |

Criterios revisados:

- no aparece placeholder;
- no hay overflow horizontal;
- planta conserva escala suficiente;
- tallo/base visible de planta alineado con origen central de raiz;
- raiz parece nacer desde la planta;
- raiz no fue reducida;
- nodos completos y abajo;
- labels legibles;
- texto inferior legible;
- boton `Continuar` deshabilitado;
- sin audio;
- sin video.

## 9. Elementos no implementados

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

## 10. Checks ejecutados

- `git status --short`;
- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run audit:assets`;
- `npm run typecheck`: `NO_DISPONIBLE`.

## 11. Deudas pendientes

- La composicion estatica queda lista para revision visual del usuario.
- La fase funcional debera definir interaccion por nodos, flujo de raiz, particulas, dialogos, foco visual y navegacion.
- El anclaje puede reusarse como referencia si luego se agregan estados activos de raiz o planta.
