# GVO — Mundo I: Raiz
## Static perception interaction 004E-3A

## 0. Estado

Estado del ticket: IMPLEMENTADO EN RUNTIME.

`/estacion/1` ahora soporta una secuencia estatica minima:

```txt
intro -> RELACION -> PERCEPCION
```

Este ticket implementa solo la interaccion estatica secuencial hasta PERCEPCION. No implementa MEDIACION, teletransporte, particulas, root flow, focus scaling, animacion ni navegacion de salida.

## 1. Objetivo

Extender Mundo I: Raiz para permitir que el usuario avance de RELACION a PERCEPCION dentro de la misma pantalla, usando estados locales DOM/CSS y assets runtime ya aprobados.

## 2. Alcance implementado

Incluido:

- estado local `intro`;
- estado local `relation`;
- estado local `perception`;
- nodo RELACION disponible desde inicio;
- nodo PERCEPCION disponible solo despues de seleccionar RELACION;
- MEDIACION bloqueada en todos los estados;
- raiz activa RELACION cuando RELACION esta activa;
- raiz activa PERCEPCION cuando PERCEPCION esta activa;
- pose estatica de Lia `point_relation` en RELACION;
- pose estatica de Lia `look_perception` en PERCEPCION;
- dialogos DOM/CSS por estado;
- boton `Continuar` deshabilitado.

## 3. Estado intro

En `intro`:

- RELACION: `available`;
- PERCEPCION: `locked`;
- MEDIACION: `locked`;
- Lia: `lia_root_idle_approved_v1.png`;
- raiz activa: ninguna;
- dialogo: introduccion de Mundo I;
- `Continuar`: disabled.

## 4. Estado relation

En `relation`:

- RELACION: `active`;
- PERCEPCION: `available`;
- MEDIACION: `locked`;
- Lia: `lia_root_point_relation_approved_v1.png`;
- raiz activa: `world1_root_active_relation_approved_v1.png`;
- dialogo: copy especifico de RELACION;
- `Continuar`: disabled.

## 5. Estado perception

En `perception`:

- RELACION: `completed`;
- PERCEPCION: `active`;
- MEDIACION: `locked`;
- Lia: `lia_root_look_perception_approved_v1.png`;
- raiz activa: `world1_root_active_perception_approved_v1.png`;
- dialogo: copy especifico de PERCEPCION;
- `Continuar`: disabled.

Copy principal:

```txt
Una planta puede parecer quieta, pero eso no significa que este inactiva.
```

Copy secundario:

```txt
Percibir empieza cuando miramos con mas cuidado: hay procesos vivos que no siempre vemos de inmediato.
```

## 6. Assets nuevos renderizados

Se renderizan por primera vez en runtime, solo dentro del estado `perception`:

- `public/assets/gvo/stations/world-1-root/roots/world1_root_active_perception_approved_v1.png`
- `public/assets/gvo/stations/world-1-root/lia/lia_root_look_perception_approved_v1.png`

No se crearon, editaron ni reexportaron assets.

## 7. Dialogos DOM/CSS

Los textos se renderizan como DOM/CSS dentro del panel existente. No se incrusto texto en imagen.

No se agrego lenguaje tecnico, sensores, ESP32, MIDI, red ni frases sobre plantas cantando.

## 8. Accesibilidad

- RELACION usa `aria-pressed` cuando esta activa.
- PERCEPCION permanece `disabled` en `intro`.
- PERCEPCION se habilita con label `Explorar PERCEPCION` en `relation`.
- PERCEPCION usa `aria-pressed="true"` cuando esta activa.
- MEDIACION permanece `disabled` en todos los estados de este ticket.
- `Continuar` permanece `disabled` y sin navegacion.

## 9. Elementos no implementados

- No se implemento MEDIACION.
- No se desbloqueo MEDIACION.
- No se habilito `Continuar`.
- No se implemento navegacion de salida.
- No se implemento animacion.
- No se implemento teletransporte.
- No se usaron poses `teleport`.
- No se implementaron particulas.
- No se implemento root flow.
- No se implemento focus scaling.
- No se agregaron dependencias.
- No se usaron CDN ni recursos externos.
- No se agrego audio ni video.

## 10. Validacion mobile

Ruta validada:

```txt
/estacion/1
```

Viewports:

- 360 x 800;
- 390 x 844;
- 430 x 932.

Capturas:

```txt
docs/gvo/world-1/validation/004E3A/
```

Archivos:

- `intro_390x844.png`
- `relation_active_390x844.png`
- `perception_active_390x844.png`
- `validation-metrics.json`

## 11. Checks ejecutados

Checks de cierre:

```powershell
git status --short
npm run lint
npm run test
npm run build
npm run audit:assets
```

`npm run typecheck` no existe como script independiente; el typecheck se ejecuta dentro de `npm run build`.

## 12. Deudas pendientes

- MEDIACION sigue pendiente para un ticket posterior.
- `Continuar` sigue pendiente de definicion funcional.
- No existe persistencia de progreso.
- No existe animacion, root flow, teletransporte ni salida de pantalla.
