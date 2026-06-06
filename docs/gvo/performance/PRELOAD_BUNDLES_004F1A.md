# GVO — Bundles de preload
## Ticket 004F-1A

## 0. Estado

Estado: IMPLEMENTADO.

Definición runtime:

```txt
src/shared/assets/screenAssetBundles.ts
```

Los bundles son locales, no contienen URLs externas y no intentan cargar todo GVO al inicio.

## 1. Metodología

Cada bundle agrupa assets visibles o necesarios para un primer frame estable de una pantalla o estado. La estrategia separa:

- carga inicial;
- primer frame de portada;
- primer frame de transición;
- entrada inicial de Mundo I;
- estados internos de Mundo I.

Los tamaños son aproximados y se basan en la auditoría `004F-0A` y pesos conocidos de los assets más relevantes.

## 2. `loadingInitialCritical`

Ruta:

```txt
/
/carga
```

Cantidad de assets:

```txt
8
```

Incluye:

- Lía loading 16f;
- planta 4f;
- agua 5f;
- halo;
- 4 sparkles.

Peso aproximado:

```txt
3.26 MB
```

Uso:

- asegurar la carga visual propia;
- servir como base para iniciar preload de Portada.

## 3. `coverIntroCritical`

Ruta:

```txt
/portada
```

Cantidad de assets:

```txt
19
```

Incluye:

- fondo principal de portada;
- rig inicial de Lía;
- ojos/blink iniciales del rig;
- Portal I;
- glow de Portal I;
- frame bloqueado;
- lock.

Peso aproximado:

```txt
5 MB aprox.
```

Assets excluidos:

- poses completas de diálogo no visibles en el primer frame;
- pose `activatePortal1`;
- assets que solo aparecen después de interacción del usuario.

## 4. `transitionRootCritical`

Ruta:

```txt
/transition/intro-to-station-1
```

Cantidad de assets:

```txt
14
```

Incluye:

- background WebP de transición;
- portal inactive/activating/open WebP;
- Lía idle/guide/exit WebP;
- barra track/fill/spark;
- sparkles reutilizados de Carga Inicial.

Peso aproximado preferente:

```txt
0.2 MB aprox. usando WebP preferente
```

Nota:

Los PNG fallback siguen existiendo, pero el bundle crítico usa WebP cuando el runtime ya lo prioriza.

## 5. `world1RootInitial`

Ruta:

```txt
/estacion/1
```

Cantidad de assets:

```txt
6
```

Incluye:

- background base;
- luz ambiente;
- planta;
- raíz base;
- node kit;
- Lía idle.

Peso aproximado:

```txt
5.01 MB
```

Uso:

- primer frame estable de Mundo I.

## 6. `world1RootRelation`

Estado:

```txt
RELACIÓN
```

Cantidad de assets:

```txt
2
```

Incluye:

- raíz activa RELACIÓN;
- Lía point_relation.

Peso aproximado:

```txt
1.9 MB
```

Uso:

- se precarga desde intro.

## 7. `world1RootPerception`

Estado:

```txt
PERCEPCIÓN
```

Cantidad de assets:

```txt
2
```

Incluye:

- raíz activa PERCEPCIÓN;
- Lía look_perception.

Peso aproximado:

```txt
1.9 MB
```

Uso:

- se precarga después de activar RELACIÓN.

## 8. `world1RootMediation`

Estado:

```txt
MEDIACIÓN
```

Cantidad de assets:

```txt
2
```

Incluye:

- raíz activa MEDIACIÓN;
- Lía guide_mediation.

Peso aproximado:

```txt
2.0 MB
```

Uso:

- se precarga después de activar PERCEPCIÓN.

## 9. `world1RootReady`

Estado:

```txt
ready_to_continue
```

Cantidad de assets:

```txt
2
```

Incluye:

- camino de salida;
- Lía ready_continue.

Peso aproximado:

```txt
2.9 MB
```

Uso:

- se precarga durante MEDIACIÓN;
- no se carga desde el primer frame de Mundo I.

## 10. Tamaño estimado por bundle

| Bundle | Assets | Peso aprox. | Uso |
| --- | ---: | ---: | --- |
| `loadingInitialCritical` | 8 | 3.26 MB | Carga Inicial |
| `coverIntroCritical` | 19 | 5 MB aprox. | Primer frame Portada |
| `transitionRootCritical` | 14 | 0.2 MB aprox. | Primer frame Transición |
| `world1RootInitial` | 6 | 5.01 MB | Primer frame Mundo I |
| `world1RootRelation` | 2 | 1.9 MB | Estado RELACIÓN |
| `world1RootPerception` | 2 | 1.9 MB | Estado PERCEPCIÓN |
| `world1RootMediation` | 2 | 2.0 MB | Estado MEDIACIÓN |
| `world1RootReady` | 2 | 2.9 MB | Ready to continue |

## 11. Assets excluidos

Excluidos por decisión:

- assets futuros de teletransporte;
- Lía exit de Mundo I;
- poses no usadas en la secuencia estática actual;
- PNG fallback de transición cuando ya existe WebP preferente;
- cualquier asset de estaciones futuras.

Motivo:

- evitar preload global;
- reducir memoria inicial;
- preservar el principio mobile-first;
- no adelantar comportamiento no implementado.

## 12. Próximas optimizaciones

No realizadas en este ticket:

- conversión controlada a WebP para Portada y Mundo I;
- inventario automatizado con pesos exactos por bundle;
- barra de progreso real conectada al hook;
- persistencia de estado de preload entre rutas;
- service worker tuneado por bundles.

