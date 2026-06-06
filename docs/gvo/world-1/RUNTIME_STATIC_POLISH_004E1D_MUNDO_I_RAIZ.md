# GVO - Mundo I: Raiz
## Runtime static polish 004E-1D

## 0. Estado

`004E-1D_STATIC_PLANT_ROOT_ALIGNMENT / EMPALME_PLANTA_RAIZ_AJUSTADO / SIN_INTERACCION / SIN_ANIMACION`

Este ticket corrige unicamente el empalme visual entre planta y raiz. No implementa interaccion, animacion, teletransporte, particulas, root flow ni focus scaling.

## 1. Objetivo

Ajustar la composicion estatica de `/estacion/1` para que la base de la planta quede mejor empalmada con el nacimiento visual de la raiz.

El objetivo no fue cambiar escala general, interaccion, nodos ni logica. La correccion se concentro en el anclaje de planta frente a la raiz base existente.

## 2. Observacion manual que origina el ticket

Tras `004E-1C`, la planta ya tenia mejor escala y los nodos estaban mejor ubicados, pero la base de la planta todavia no parecia coincidir del todo con el nacimiento de la raiz.

La revision manual pidio que la planta subiera mas y que su base quedara sobre el origen de la raiz, evitando la lectura de que la planta estaba al lado del sistema subterraneo.

## 3. Correccion aplicada al empalme planta-raiz

Se ajusto solo `World1RootScreen.css`:

- se subio la planta desde `12.8%` a `11.2%`;
- se mantuvo la escala de planta en `40%`;
- se agrego un anclaje horizontal fino de planta en `49.6%`;
- se agrego `transform-origin: center bottom` para dejar documentado el ancla visual de la planta;
- no se redujo la raiz;
- no se movieron los nodos conceptuales frente al resultado de `004E-1C`.

## 4. Valores CSS finales

```css
.world1-root-stage {
  --world1-plant-x: 49.6%;
  --world1-plant-top: 11.2%;
  --world1-plant-width: 40%;
  --world1-roots-top: 20.3%;
  --world1-roots-width: 100%;
}
```

La raiz conserva:

```css
--world1-roots-top: 20.3%;
--world1-roots-width: 100%;
```

## 5. Relacion final entre planta y raiz

La planta queda mas arriba que en `004E-1C`, con el tallo/base visual colocado sobre el tronco principal de la raiz.

La raiz sigue grande y completa. La solucion principal no fue reducir ni encoger la raiz, sino ajustar el anclaje visual de la planta para que el sistema subterraneo parezca nacer desde ella.

Comparacion contra `004E-1C`:

| Variable | 004E-1C | 004E-1D |
| --- | ---: | ---: |
| `--world1-plant-x` | `50%` implicito | `49.6%` |
| `--world1-plant-top` | `12.8%` | `11.2%` |
| `--world1-plant-width` | `40%` | `40%` |
| `--world1-roots-top` | `20.3%` | `20.3%` |
| `--world1-roots-width` | `100%` | `100%` |

## 6. Estado de nodos

Los nodos conservan la distribucion de `004E-1C`.

Estados iniciales:

| Nodo | Estado inicial |
| --- | --- |
| RELACION | available |
| PERCEPCION | locked/inactive |
| MEDIACION | locked/inactive |

No se agregaron clicks, foco, seleccion ni estado activo.

## 7. Validacion mobile

Capturas y metricas generadas en:

`docs/gvo/world-1/validation/004E1D/`

| Viewport | Archivo | Estado |
| --- | --- | --- |
| 360x800 | `mobile_360x800.png` | Generada |
| 390x844 | `mobile_390x844.png` | Generada |
| 430x932 | `mobile_430x932.png` | Generada |
| metricas | `layout-metrics.json` | Generado |

Criterios revisados:

- no aparece placeholder;
- no hay overflow horizontal;
- planta grande y legible;
- planta mejor empalmada con raiz que en `004E-1C`;
- base de planta sobre nacimiento visual de raiz;
- raiz no reducida;
- nodos completos y bien ubicados;
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
- El ajuste puede necesitar una ultima afinacion visual si el usuario detecta un desfase restante en dispositivo fisico.
