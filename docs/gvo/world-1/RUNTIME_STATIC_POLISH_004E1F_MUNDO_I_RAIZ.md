# GVO - Mundo I: Raiz
## Runtime static polish 004E-1F

## 0. Estado

`004E-1F_STATIC_PLANT_VERTICAL_MICROALIGN / MICROAJUSTE_VERTICAL_PLANTA_RAIZ / SIN_INTERACCION / SIN_ANIMACION`

Este ticket realiza un microajuste vertical de la planta para mejorar el empalme visual con la raiz. No implementa interaccion, animacion, teletransporte, particulas, root flow ni focus scaling.

## 1. Objetivo

Subir ligeramente la planta frente al resultado `004E-1E` para cerrar mejor la continuidad visual entre:

- la base visible del tallo/planta;
- el nacimiento central de la raiz.

El ajuste no reabre composicion general, nodos, textos, raiz ni comportamiento.

## 2. Observacion manual que origina el ticket

La revision manual indico que `004E-1E` mejoro el empalme, pero la planta todavia se percibia un poco baja. La indicacion fue subirla apenas para que la union planta-raiz se lea mas natural.

## 3. Ajuste aplicado

Se modifico solo la variable vertical de anclaje efectivo de planta:

```css
--world1-plant-anchor-y: 93.2%;
```

Valor anterior en `004E-1E`:

```css
--world1-plant-anchor-y: 90.7%;
```

Al aumentar el ancla Y, la imagen de la planta sube aproximadamente 4 a 5 px segun viewport, sin mover horizontalmente el tallo ni cambiar el origen de la raiz.

No se tocaron nodos, textos, boton, rutas, logica ni assets.

## 4. Valores CSS finales

```css
.world1-root-stage {
  --world1-root-origin-x: 50.8%;
  --world1-root-origin-y: 35.9%;
  --world1-plant-anchor-x: 56.9%;
  --world1-plant-anchor-y: 93.2%;
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

## 5. Empalme final planta-raiz

El microajuste deja la referencia visible anterior de base/tallo ligeramente por encima del origen central de la raiz para que el tallo parezca entrar en el nacimiento de raiz en lugar de apenas apoyarse sobre el.

Metricas generadas con Playwright:

| Viewport | Planta sube aprox. frente a 004E-1E |
| --- | ---: |
| 360x800 | `3.9px` |
| 390x844 | `4.3px` |
| 430x932 | `4.8px` |

El anclaje horizontal se conserva en `0px` de diferencia frente al origen raiz.

## 6. Estado de nodos

Los nodos conservaron la ubicacion de `004E-1E`.

Estados iniciales:

| Nodo | Estado inicial |
| --- | --- |
| RELACION | available |
| PERCEPCION | locked/inactive |
| MEDIACION | locked/inactive |

No se agregaron clicks, foco, seleccion, dialogos ni estado activo.

## 7. Validacion mobile

Capturas y metricas generadas en:

`docs/gvo/world-1/validation/004E1F/`

| Viewport | Archivo | Estado |
| --- | --- | --- |
| 360x800 | `mobile_360x800.png` | Generada |
| 390x844 | `mobile_390x844.png` | Generada |
| 430x932 | `mobile_430x932.png` | Generada |
| metricas | `layout-metrics.json` | Generado |

Criterios revisados:

- no aparece placeholder;
- no hay overflow horizontal;
- planta conserva buena escala;
- planta queda un poco mas arriba que en `004E-1E`;
- empalme visual planta-raiz se percibe mas continuo;
- raiz no fue reducida;
- nodos completos y abajo;
- labels legibles;
- texto inferior legible;
- boton `Continuar` deshabilitado;
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
- Interaccion por nodos, flujo de raiz, particulas, dialogos, foco visual y navegacion siguen fuera de alcance.
- Si el usuario detecta un ultimo desfase en dispositivo fisico, el siguiente ajuste deberia mantenerse en rango de microalineacion vertical.
