# GVO - Mundo I: Raiz
## Runtime static base 004E-1

## 0. Estado

`004E-1_RUNTIME_STATIC_BASE / ASSETS_REALES / SIN_INTERACCION / SIN_ANIMACION`

Este ticket monta la primera base runtime estatica de Mundo I: Raiz en `/estacion/1`. La pantalla deja de usar el placeholder tecnico para Estacion I y muestra una composicion mobile-first con assets reales ingeridos en 004D-10A.

Este ticket no implementa interaccion, teletransporte, flujo de raices, particulas, dialogos por concepto ni navegacion de salida.

## 1. Objetivo

Crear una escena estatica validable con:

- fondo base;
- luz ambiental;
- planta joven;
- raices base;
- nodos conceptuales;
- Lia en estado idle inicial;
- textos y labels como DOM/CSS;
- boton `Continuar` deshabilitado.

## 2. Archivos modificados

- `src/app/router.tsx`
- `src/screens/World1Root/World1RootScreen.tsx`
- `src/screens/World1Root/World1RootScreen.css`
- `src/screens/World1Root/world1RootAssets.ts`
- `src/screens/World1Root/index.ts`
- `src/screens/World1Root/World1RootScreen.test.tsx`
- `tests/e2e/smoke.spec.ts`
- `tests/e2e/cover-intro-002l-final-qa.spec.ts`
- `tests/e2e/cover-to-transition-flow.spec.ts`
- `tests/e2e/transition-world.spec.ts`

## 3. Ruta implementada

```txt
/estacion/1
```

La ruta se conecta con `World1RootScreen`. Las demas rutas `/estacion/:stationId` siguen usando `StationPlaceholder`.

## 4. Assets usados

Assets renderizados:

| Capa | Asset |
| --- | --- |
| Fondo base | `public/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png` |
| Luz ambiental | `public/assets/gvo/stations/world-1-root/light/world1_root_ambient_light_kit_approved_v1.png` |
| Planta joven | `public/assets/gvo/stations/world-1-root/plant/world1_root_young_plant_approved_v1.png` |
| Raices base | `public/assets/gvo/stations/world-1-root/roots/world1_root_roots_base_approved_v1.png` |
| Nodos | `public/assets/gvo/stations/world-1-root/nodes/world1_root_node_state_kit_approved_v1.png` |
| Lia idle | `public/assets/gvo/stations/world-1-root/lia/lia_root_idle_approved_v1.png` |

Assets registrados pero no renderizados en este ticket:

- raices activas;
- exit path;
- poses de Lia distintas a idle;
- teleport out/in;
- estados futuros de salida.

## 5. Capas renderizadas

Orden visual:

```txt
1. background base
2. ambient light
3. roots base
4. plant
5. node ornaments
6. Lia idle
7. DOM/CSS labels
8. DOM/CSS dialogue copy
9. DOM/CSS disabled button
```

El camino de salida no se renderiza todavia. Las raices activas tampoco se renderizan para evitar lectura de seleccion.

## 6. Textos DOM/CSS

Textos visibles:

```txt
Mundo I: Raiz
Antes de escuchar, necesitamos aprender a mirar.
Mundo I empieza en la raiz: una relacion viva que se observa con cuidado antes de ser mediada.
RELACION
PERCEPCION
MEDIACION
Continuar
```

En runtime se muestran con acentos:

```txt
Mundo I: Raíz
relación
RELACIÓN
PERCEPCIÓN
MEDIACIÓN
```

Los textos son DOM/CSS. No hay texto incrustado en imagen.

## 7. Elementos todavia no interactivos

- Los nodos conceptuales no tienen `onClick`.
- No existe `activeConcept`.
- El boton `Continuar` esta deshabilitado.
- No se usa `localStorage`.
- No se registra progreso persistente.
- No hay navegacion de salida.

## 8. Animaciones no implementadas

No se implemento:

- particulas doradas;
- flujo visual de raices;
- glow en loop;
- flotacion de Lia;
- respiracion del collar;
- teletransporte;
- scaling focus;
- zoom global de camara;
- materializacion/desmaterializacion;
- dialogs por concepto.

El CSS no define `@keyframes` para esta pantalla.

## 9. Deudas documentadas

- El node kit se usa como fuente visual para estados estaticos recortados por CSS; la lectura fina de cada estado debera revisarse visualmente en la fase interactiva.
- Las raices activas y el exit path quedan sin renderizar hasta que exista interaccion.
- La composicion puede requerir ajuste visual tras capturas mobile reales.
- Reduced motion avanzado no aplica todavia porque no hay animacion activa.

## 10. Checks ejecutados

Pendiente de cierre en la ejecucion del ticket:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run typecheck` si existe
