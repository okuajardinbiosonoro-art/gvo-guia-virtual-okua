# GVO - Mundo I: Raiz
## Static mediation interaction 004E-4A

## 0. Estado

Estado del ticket: IMPLEMENTADO EN RUNTIME.

`/estacion/1` ahora soporta una secuencia estatica minima:

```txt
intro -> RELACION -> PERCEPCION -> MEDIACION
```

Este ticket implementa solo la interacción estática secuencial hasta MEDIACIÓN. No implementa teletransporte, partículas, root flow, focus scaling, animación ni navegación de salida.

## 1. Objetivo

Extender Mundo I: Raiz para permitir que el usuario avance desde RELACION hasta MEDIACION dentro de la misma pantalla, usando estados locales DOM/CSS y assets runtime ya aprobados.

## 2. Alcance implementado

Incluido:

- estado local `intro`;
- estado local `relation`;
- estado local `perception`;
- estado local `mediation`;
- nodo RELACION disponible desde inicio;
- nodo PERCEPCION disponible solo despues de seleccionar RELACION;
- nodo MEDIACION disponible solo despues de seleccionar PERCEPCION;
- raiz activa RELACION cuando RELACION esta activa;
- raiz activa PERCEPCION cuando PERCEPCION esta activa;
- raiz activa MEDIACION cuando MEDIACION esta activa;
- pose estatica de Lia `point_relation` en RELACION;
- pose estatica de Lia `look_perception` en PERCEPCION;
- pose estatica de Lia `guide_mediation` en MEDIACION;
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
- MEDIACION: `available`;
- Lia: `lia_root_look_perception_approved_v1.png`;
- raiz activa: `world1_root_active_perception_approved_v1.png`;
- dialogo: copy especifico de PERCEPCION;
- `Continuar`: disabled.

## 6. Estado mediation

En `mediation`:

- RELACION: `completed`;
- PERCEPCION: `completed`;
- MEDIACION: `active`;
- Lia: `lia_root_guide_mediation_approved_v1.png`;
- raiz activa: `world1_root_active_mediation_approved_v1.png`;
- dialogo: copy especifico de MEDIACION;
- `Continuar`: disabled.

Copy principal:

```txt
Mediar no es inventar: es construir una forma cuidadosa de acercarnos a una señal viva.
```

Copy secundario:

```txt
OKUA no reemplaza la planta ni habla por ella. Ayuda a percibir, con respeto, algo que necesita una mediacion para volverse sensible.
```

## 7. Assets nuevos renderizados

Se renderizan por primera vez en runtime, solo dentro del estado `mediation`:

- `public/assets/gvo/stations/world-1-root/roots/world1_root_active_mediation_approved_v1.png`
- `public/assets/gvo/stations/world-1-root/lia/lia_root_guide_mediation_approved_v1.png`

No se crearon, editaron ni reexportaron assets.

## 8. Dialogos DOM/CSS

Los textos se renderizan como DOM/CSS dentro del panel existente. No se incrusto texto en imagen.

No se agrego lenguaje tecnico, sensores, ESP32, MIDI, red ni frases sobre plantas cantando.

## 9. Accesibilidad

- RELACION usa `aria-pressed` cuando esta activa.
- PERCEPCION permanece `disabled` en `intro`.
- PERCEPCION se habilita con label `Explorar PERCEPCION` en `relation`.
- PERCEPCION usa `aria-pressed="true"` cuando esta activa.
- MEDIACION permanece `disabled` hasta seleccionar PERCEPCION.
- MEDIACION se habilita con label `Explorar MEDIACION` en `perception`.
- MEDIACION usa `aria-pressed="true"` cuando esta activa.
- Nodos completados quedan deshabilitados para evitar retroceso accidental en esta version estatica.
- `Continuar` permanece `disabled` y sin navegacion.

## 10. Elementos no implementados

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

## 11. Validacion mobile

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
docs/gvo/world-1/validation/004E4A/
```

Archivos:

- `intro_390x844.png`
- `relation_active_390x844.png`
- `perception_active_390x844.png`
- `mediation_active_390x844.png`
- `validation-metrics.json`

## 12. Checks ejecutados

Checks de cierre:

```powershell
git status --short
npm run lint
npm run test
npm run build
npm run audit:assets
```

`npm run typecheck` no existe como script independiente; el typecheck se ejecuta dentro de `npm run build`.

## 13. Deudas pendientes

- `Continuar` sigue pendiente de definicion funcional.
- No existe persistencia de progreso.
- No existe animacion, root flow, teletransporte ni salida de pantalla.
- MEDIACION queda implementada solo como estado estatico secuencial.
