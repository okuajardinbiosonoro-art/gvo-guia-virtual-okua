# GVO - Mundo I: Raiz
## Runtime static layout refine 004E-1B

## 0. Estado

`004E-1B_STATIC_LAYOUT_REFINE / COMPOSICION_ESTATICO_AJUSTADA / SIN_INTERACCION / SIN_ANIMACION`

Este ticket refina la composicion estatica de `/estacion/1`. No implementa interaccion, animacion, teletransporte, particulas, root flow ni focus scaling.

## 1. Objetivo

Ajustar solo layout visual estatico para que:

- la planta se lea mas grande y protagonista;
- la raiz siga naciendo debajo de la planta;
- la raiz no se use como solucion principal reduciendola;
- la planta se mantenga alineada con el suelo visual;
- los nodos conceptuales bajen hacia el tramo final de sus ramas;
- `RELACION` siga disponible;
- `PERCEPCION` y `MEDIACION` sigan bloqueados/inactivos;
- el boton `Continuar` siga deshabilitado.

## 2. Cambios aplicados

Se ajustaron variables y posiciones CSS locales en `World1RootScreen.css`:

```css
--world1-plant-top: 15.8%;
--world1-plant-width: 31%;
--world1-roots-top: 20.3%;
--world1-roots-width: 100%;
```

La raiz conserva su escala/ancho de 004E-1A. La correccion principal fue aumentar la presencia de la planta y reajustar su anclaje vertical para mantener contacto visual con el suelo.

## 3. Nodos conceptuales

Los nodos fueron reubicados hacia los tramos finales de sus ramas:

```css
.world1-root-node--relation {
  top: 56%;
  left: 10%;
}

.world1-root-node--perception {
  top: 54%;
  left: 50%;
}

.world1-root-node--mediation {
  top: 56%;
  right: 10%;
}
```

En viewports `<= 374px`, los nodos laterales usan `left: 8%` y `right: 8%` para conservar cercania con los extremos de ramas sin generar overflow horizontal.

La etiqueta del nodo se coloca sobre el orbe para permitir que el orbe baje mas sin invadir el bloque de texto inferior.

## 4. Estados iniciales conservados

| Nodo | Estado inicial |
| --- | --- |
| RELACION | available |
| PERCEPCION | locked/inactive |
| MEDIACION | locked/inactive |

No se agrego estado activo, foco, click, dialogo ni flujo funcional.

## 5. Elementos no modificados

No se modificaron:

- assets PNG/JSON runtime;
- dependencias;
- rutas;
- textos;
- boton deshabilitado;
- `data-world1-root-version`;
- estructura de estados de nodos;
- comportamiento de navegacion.

## 6. Validacion mobile

Validacion visual local documentada en:

`docs/gvo/world-1/validation/004E1B/`

Viewports previstos:

| Viewport | Estado |
| --- | --- |
| 360x800 | Generada |
| 390x844 | Generada |
| 430x932 | Generada |

Criterios revisados:

- planta mas grande que en 004E-1A;
- planta conectada con el suelo visual;
- raiz nace debajo de la planta;
- raiz no fue reducida como solucion principal;
- nodos completos y mas bajos;
- nodos cerca del tramo final de sus ramas;
- textos y boton siguen legibles;
- no hay overflow horizontal;
- no hay interaccion, animacion, teletransporte ni particulas.

## 7. Checks ejecutados

- `npm run lint`;
- `npm run test`;
- `npm run build`.

## 8. Deudas pendientes

- La composicion estatica queda lista para nueva revision visual del usuario.
- Interaccion, dialogos, root flow, focus scaling, particulas, teletransporte y navegacion de `Continuar` siguen fuera de alcance.
- El refinamiento fino de alineacion nodo-rama podra revisarse en una pasada funcional posterior si el usuario lo solicita.
