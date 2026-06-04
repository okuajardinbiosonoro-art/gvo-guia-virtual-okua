# GVO - Mundo I: Raiz
## Runtime static polish 004E-1A

## 0. Estado

`004E-1A_STATIC_POLISH / COMPOSICION_AJUSTADA / SIN_INTERACCION / SIN_ANIMACION`

Este ticket corrige composicion estatica. No implementa interaccion, teletransporte, particulas ni flujo de raices.

## 1. Objetivo

Ajustar el montaje estatico de `/estacion/1` para que:

- la planta quede mas baja y conectada con la franja visual de suelo;
- la raiz base nazca debajo de la planta, no encima;
- la planta siga visible;
- los nodos conceptuales se vean completos;
- `RELACION` quede como available;
- `PERCEPCION` y `MEDIACION` queden como locked/inactive;
- el boton `Continuar` siga deshabilitado.

## 2. Problemas detectados por revision manual

- La planta estaba demasiado arriba.
- Las raices estaban demasiado arriba.
- El nacimiento visual de la raiz quedaba por encima del punto de contacto de la planta.
- La planta no parecia tocar el suelo visual del fondo.
- El node kit se veia recortado de forma incompleta.

## 3. Correcciones aplicadas

Se ajustaron variables CSS locales en `World1RootScreen.css`:

```css
--world1-plant-top: 18.5%;
--world1-plant-width: 24%;
--world1-roots-top: 20.3%;
--world1-roots-width: 100%;
```

Tambien se reemplazo el recorte anterior del node kit, basado en un `img` desplazado manualmente, por recortes de `background-position` sobre el mismo asset local `world1_root_node_state_kit_approved_v1.png`.

## 4. Planta y raiz: alineacion final

La planta queda mas baja respecto al montaje 004E-1. La raiz base se desplaza hacia abajo para que su inicio visual quede debajo del tallo/base de la planta.

Regla aplicada:

```txt
La planta debe tocar visualmente el suelo del fondo, y la raiz debe nacer debajo de ese punto, no encima de la planta.
```

No se edito el PNG de planta ni el PNG de raices. La correccion es solo CSS.

## 5. Node kit: recorte y estados

El asset `world1_root_node_state_kit_approved_v1.png` contiene 4 estados horizontales:

```txt
0. locked / inactive
1. available
2. active
3. completed
```

Estados usados en el montaje estatico:

| Nodo | Estado | Frame |
| --- | --- | --- |
| RELACION | available | 1 |
| PERCEPCION | locked/inactive | 0 |
| MEDIACION | locked/inactive | 0 |

Los recortes usan el mismo asset como `background-image`, con `background-size` y `background-position` controlados para evitar que se mezclen estados vecinos.

## 6. Validacion mobile

Validacion local requerida:

| Viewport | Estado |
| --- | --- |
| 360x800 | Ejecutada con Playwright local |
| 390x844 | Ejecutada con Playwright local |
| 430x932 | Ejecutada con Playwright local |

Criterios revisados:

- no aparece placeholder;
- no hay overflow horizontal;
- planta visible;
- raiz nace debajo de la planta;
- raiz no tapa la planta;
- nodos completos;
- `RELACION` available;
- `PERCEPCION` y `MEDIACION` locked/inactive;
- texto inferior legible;
- boton `Continuar` deshabilitado;
- sin audio;
- sin video.

## 7. Elementos no implementados

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

## 8. Checks ejecutados

Pendiente de cierre del ticket:

- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run audit:assets`;
- `npm run typecheck` si existe.

## 9. Deudas pendientes

- La composicion estatica puede requerir una segunda revision visual del usuario.
- La fase interactiva debera decidir si el node kit se mantiene como sprite CSS o se reemplaza por estados separados aprobados.
- Raices activas, particulas, flujo de raices, teletransporte y dialogos por concepto siguen fuera de alcance.
