# GVO - Mundo I: Raiz
## Static relation interaction 004E-2A

## 0. Estado

`004E-2A_STATIC_RELATION_INTERACTION / FUNCIONAL_MINIMO / SIN_ANIMACION`

Este ticket implementa solo la interaccion estatica inicial de RELACION. No implementa PERCEPCION, MEDIACION, teletransporte, particulas, root flow, focus scaling, animacion ni navegacion de salida.

## 1. Objetivo

Agregar una primera capa funcional minima en `/estacion/1` para que el usuario pueda seleccionar el nodo `RELACION` y recibir una respuesta estatica clara:

- `RELACION` pasa de `available` a `active`;
- aparece la raiz activa de `RELACION`;
- Lia cambia de pose idle a `point_relation`;
- el panel DOM/CSS cambia al dialogo de `RELACION`;
- `PERCEPCION` y `MEDIACION` permanecen bloqueadas;
- `Continuar` permanece deshabilitado.

## 2. Alcance implementado

Se implemento un estado local simple:

```ts
type World1Concept = "intro" | "relation";
```

El estado inicial es `intro`. Al hacer click/tap o activar por teclado el boton accesible `Explorar RELACION`, el estado pasa a `relation`.

No se uso `localStorage`, persistencia de progreso, temporizadores, rutas nuevas ni navegacion.

## 3. Estado inicial

En el estado `intro`:

- `RELACION`: `available`;
- `PERCEPCION`: `locked`;
- `MEDIACION`: `locked`;
- Lia usa `lia_root_idle_approved_v1.png`;
- no se renderiza raiz activa;
- el copy mantiene:
  - `Antes de escuchar, necesitamos aprender a mirar.`;
  - `Mundo I empieza en la raiz: una relacion viva que se observa con cuidado antes de ser mediada.`;
- `Continuar` permanece deshabilitado.

## 4. Interaccion RELACION

`RELACION` es el unico nodo interactivo de esta iteracion.

Al seleccionarlo:

- `RELACION` pasa a `active`;
- `aria-pressed` pasa a `true`;
- el frame del node kit cambia a `active`;
- aparece el overlay estatico de raiz activa;
- Lia cambia a la pose estatica de orientacion a `RELACION`;
- el copy cambia a contenido especifico de `RELACION`;
- `PERCEPCION` y `MEDIACION` siguen `disabled` y `locked`.

## 5. Assets nuevos renderizados

Se renderizan solo en estado `relation`:

```txt
public/assets/gvo/stations/world-1-root/roots/world1_root_active_relation_approved_v1.png
public/assets/gvo/stations/world-1-root/lia/lia_root_point_relation_approved_v1.png
```

No se generaron, editaron, reexportaron ni normalizaron assets.

## 6. Dialogos DOM/CSS

Los textos se mantienen como DOM/CSS.

Texto inicial:

```txt
Antes de escuchar, necesitamos aprender a mirar.
Mundo I empieza en la raiz: una relacion viva que se observa con cuidado antes de ser mediada.
```

Texto de `RELACION`:

```txt
RELACION
La planta no esta aislada: vive en relacion con la tierra, la luz, el agua y quienes se acercan a cuidarla.
Antes de interpretar sus senales, observa como cada raiz sostiene un vinculo. En OKUA, escuchar empieza reconociendo esa relacion viva.
```

No se mencionan sensores, ESP32, MIDI, red ni que la planta cante.

## 7. Accesibilidad

- `RELACION` se renderiza como `button` con `aria-label="Explorar RELACION"`.
- `RELACION` usa `aria-pressed`.
- `PERCEPCION` y `MEDIACION` se renderizan como botones deshabilitados con `aria-disabled="true"`.
- El boton `Continuar` sigue deshabilitado.
- Los textos visibles de los nodos siguen siendo DOM y mantienen la fuente legible ajustada tras la calibracion.

## 8. Elementos no implementados

No se implemento:

- interaccion de `PERCEPCION`;
- interaccion de `MEDIACION`;
- dialogos de `PERCEPCION`;
- dialogos de `MEDIACION`;
- frame `completed`;
- navegacion de salida;
- habilitacion de `Continuar`;
- teletransporte;
- particulas;
- root flow;
- focus scaling;
- animaciones CSS;
- persistencia de progreso;
- clicks directos sobre raices.

## 9. Validacion mobile

Capturas y metricas generadas en:

```txt
docs/gvo/world-1/validation/004E2A/
```

Viewports validados:

- `360x800`;
- `390x844`;
- `430x932`.

Criterios:

- sin placeholder;
- sin overflow horizontal;
- `RELACION` inicia `available`;
- `PERCEPCION` y `MEDIACION` inician `locked`;
- al activar `RELACION`, aparece la raiz activa;
- Lia cambia a `point_relation`;
- el dialogo cambia a copy de `RELACION`;
- `PERCEPCION` y `MEDIACION` siguen bloqueadas;
- `Continuar` sigue deshabilitado;
- no aparece el calibrador en `/estacion/1`;
- no hay audio ni video.

## 10. Checks ejecutados

- `git status --short`;
- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run audit:assets`;
- `npm run typecheck`: `NO_DISPONIBLE`.

## 11. Deudas pendientes

- Implementar `PERCEPCION` en un ticket posterior.
- Implementar `MEDIACION` en un ticket posterior.
- Definir cuando se habilita `Continuar`.
- Definir si el frame `completed` se usa despues de completar cada concepto.
- Mantener fuera de esta iteracion cualquier animacion, teletransporte, particulas, root flow y focus scaling.
