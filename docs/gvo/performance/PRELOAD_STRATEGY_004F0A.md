# GVO — Preload strategy 004F-0A

## 0. Estado

Propuesta documental. No implementada en runtime.

Objetivo: definir una estrategia mobile-first para evitar aparicion tardia de capas, mantener experiencia local sin CDN y no bloquear el flujo con un preload global excesivo.

## 1. Principios

- GVO debe funcionar localmente, sin Internet, CDN ni recursos externos.
- No se debe precargar todo el proyecto antes de empezar.
- Cada pantalla debe declarar sus assets criticos y secundarios.
- La carga debe combinar preload de red local + decode de imagen.
- El usuario debe ver un fallback estable si un asset tarda mas de lo esperado.
- La pantalla de carga no debe mentir: si se usa como compuerta, debe reflejar al menos el progreso del bundle inmediato.

## 2. Recomendacion sobre preload global

No implementar preload global de todos los assets de GVO.

Motivo:

- Mundo I completo ya pesa 19.55 MB en inventario.
- Portada / Intro pesa 8.65 MB.
- Carga Inicial pesa 3.26 MB.
- Preload global aumentaria tiempo inicial, memoria y riesgo de decodificacion tardia en celulares.

Alternativa recomendada:

- preload por pantalla;
- preload por estado;
- cache local del navegador/PWA;
- decode progresivo con timeout.

## 3. Bundles propuestos

### `loadingInitial`

Assets actuales de `/` y `/carga`.

Uso:

- mostrar experiencia inicial;
- iniciar preload de `coverIntroCritical` cuando la UI ya esta estable.

### `coverIntroCritical`

Assets necesarios para primer frame estable de Portada / Intro:

- fondo base;
- Lía inicial;
- portal I visible;
- locks/portales minimos visibles;
- assets de boton si aplica;
- sin cargar todas las poses secundarias antes de primer render.

### `coverIntroDialogue`

Poses y assets usados durante dialogos y activacion del portal I.

Uso:

- cargar despues de `coverIntroCritical`;
- puede cargarse en background mientras el usuario lee.

### `transitionRootCritical`

Assets de la transicion Portada -> Mundo I.

Uso:

- precargar desde Portada cuando el Portal I queda habilitado o antes de ejecutar la transicion.
- usar WebP preferente y PNG fallback solo si hace falta.

### `world1RootInitial`

Assets para primer estado de `/estacion/1`:

- background;
- planta;
- raiz base;
- Lía idle;
- nodos base.

### `world1RootStateAssets`

Bundles por estado:

- `relation`: raiz activa RELACION + Lía point_relation.
- `perception`: raiz activa PERCEPCION + Lía look_perception.
- `mediation`: raiz activa MEDIACION + Lía guide_mediation.
- `ready`: camino de salida + Lía ready_continue.

### `world1RootFutureExit`

Assets opcionales/futuros:

- teleport out;
- teleport in relation/perception/mediation;
- pose exit;
- otros recursos de salida que no son necesarios para el primer recorrido estatico.

## 4. API tecnica sugerida

Archivo futuro sugerido:

```txt
src/lib/assets/assetPreloader.ts
```

Contrato conceptual:

```ts
type AssetPreloadStatus = 'idle' | 'loading' | 'decoded' | 'timeout' | 'failed';

type AssetPreloadItem = {
  id: string;
  src: string;
  kind: 'image';
  group: string;
  critical: boolean;
};

type PreloadResult = {
  group: string;
  total: number;
  decoded: number;
  failed: number;
  timedOut: boolean;
};
```

Funciones futuras:

- `preloadImage(src)`
- `decodeImage(src, timeoutMs)`
- `preloadAssetGroup(groupId)`
- `getAssetGroupProgress(groupId)`
- `markAssetGroupReady(groupId)`

## 5. Compuerta de pantalla de carga

La carga inicial puede evolucionar a una compuerta ligera:

1. renderizar Carga Inicial inmediatamente;
2. cargar/decodificar `coverIntroCritical`;
3. completar barra cuando el bundle critico este listo o el timeout seguro termine;
4. permitir paso a Portada sin imagenes principales apareciendo tarde.

No deberia cargar desde ahi:

- todos los estados de Mundo I;
- assets futuros de salida;
- assets de estaciones posteriores.

## 6. Camino de salida de Mundo I

El camino de salida debe cargarse como bundle `world1RootReady`, no como asset obligatorio de primer frame.

Motivo:

- pesa 2.09 MB;
- solo aparece despues de completar RELACION, PERCEPCION y MEDIACION;
- visualmente necesita calibracion propia antes de conectar navegacion.

Recomendacion:

- precargarlo durante el estado `mediation`;
- decodificar antes de mostrar `ready_to_continue`;
- si no esta listo, mantener el estado `mediation` o mostrar ready sin camino durante un fallback breve.

## 7. Estrategia para red local MikroTik

- No depender de latencia externa.
- Servir todo desde el host local.
- Usar cache del navegador/PWA cuando aplique.
- Mantener nombres versionados para assets aprobados.
- Evitar querystrings dinamicos que invaliden cache sin necesidad.

## 8. Fases recomendadas de implementacion

### Fase A — manifiestos por pantalla

Formalizar grupos de assets en TypeScript o JSON local.

### Fase B — preloader de imagenes

Crear utilidad local con `Image`, `decode()` y timeout.

### Fase C — integracion por flujo

Aplicar primero:

- Carga Inicial -> Portada.
- Portada -> Transicion.
- Transicion -> Mundo I.

### Fase D — optimizacion de formato

Evaluar WebP local para Portada y Mundo I, con comparacion visual y fallback PNG.

## 9. Decision de T004F-0A

La estrategia aprobable para continuar es preload por bundles, no preload global.

Este ticket no implementa esa estrategia; solo deja el contrato tecnico para un ticket funcional posterior.
