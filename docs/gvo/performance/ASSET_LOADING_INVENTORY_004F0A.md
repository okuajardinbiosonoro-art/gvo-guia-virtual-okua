# GVO — Asset loading inventory 004F-0A

## 0. Estado

Inventario documental generado para auditar peso, criticidad y estrategia de carga de assets mobile-first.

Archivos de evidencia:

```txt
docs/gvo/performance/validation/004F0A/asset-inventory.json
docs/gvo/performance/validation/004F0A/asset-summary.json
```

No se editaron assets en este ticket.

## 1. Fuentes revisadas

- `public/assets/gvo/stations/world-1-root/README_WORLD1_ROOT_ASSETS.md`
- `public/assets/gvo/stations/world-1-root/manifests/world1_root_asset_manifest_v1.json`
- `public/assets/gvo/shared/lia/asset_manifest_lia_v1.json`
- `docs/gvo/world-1/WORLD1_ROOT_ASSET_USAGE_PLAN_004D10A.md`
- `docs/gvo/world-1/INTERACTION_STATIC_READY_CONTINUE_004E5A_MUNDO_I_RAIZ.md`
- `docs/gvo/world-1/ACTIVE_ROOTS_RUNTIME_CALIBRATION_MANUAL.md`
- `docs/gvo/world-1/WORLD1_ROOT_ADVANCED_LAYOUT_CALIBRATOR_004E2B.md`
- `docs/visual/loading-initial/ASSET_MANIFEST_CARGA_INICIAL_GVO_V1.md`
- `docs/visual/transition-world/`
- `public/assets/runtime/cover-intro/manifest.json`
- `src/assets/transition-world/root/asset-manifest.transition-root.json`

## 2. Resumen por pantalla

| Pantalla | Assets inventariados | Peso total | Assets criticos | Peso critico |
| --- | ---: | ---: | ---: | ---: |
| Carga Inicial | 8 | 3.26 MB | 8 | 3.26 MB |
| Portada / Intro | 26 | 8.65 MB | 21 | 5.31 MB |
| Transicion entre mundos | 34 | 5.16 MB | 8 | 0.15 MB |
| Mundo I: Raiz | 19 | 19.55 MB | 6 | 5.01 MB |

## 3. Assets mas pesados

| Pantalla | Asset | Peso | Dimensiones | Criticidad |
| --- | --- | ---: | --- | --- |
| Portada / Intro | `cover_bg_archivo_vivo_base_v1.png` | 2.92 MB | 941x1672 | critical |
| Transicion entre mundos | `transition_root_background_v1.png` | 2.74 MB | 1440x2560 | fallback |
| Carga Inicial | `lia_loading_16f.png` | 2.46 MB | 2560x2560 | critical |
| Mundo I: Raiz | `world1_root_exit_path_approved_v1.png` | 2.09 MB | 1024x1536 | secondary_state |
| Mundo I: Raiz | `world1_root_background_base_approved_v1.png` | 2.03 MB | 941x1672 | critical_initial |
| Mundo I: Raiz | `lia_root_teleport_in_perception_approved_v1.png` | 1.81 MB | 1024x1536 | optional_future |
| Mundo I: Raiz | `world1_root_active_mediation_approved_v1.png` | 1.38 MB | 941x1672 | secondary_state |
| Mundo I: Raiz | `world1_root_active_perception_approved_v1.png` | 1.26 MB | 941x1672 | secondary_state |
| Mundo I: Raiz | `world1_root_active_relation_approved_v1.png` | 1.24 MB | 941x1672 | secondary_state |

## 4. Lectura por pantalla

### Carga Inicial

El costo principal esta concentrado en `lia_loading_16f.png` con 2.46 MB. La pantalla carga todos sus assets criticos, lo cual es aceptable para la pantalla actual, pero no garantiza que Portada / Intro o Mundo I ya esten listos.

Recomendacion:

- mantener su set actual;
- usarla como lugar candidato para iniciar preload/decode del bundle critico de Portada / Intro;
- no convertirla en preload global de todo GVO.

### Portada / Intro

El fondo base pesa 2.92 MB y la pantalla contiene multiples poses de Lía y capas visuales. La medicion de ruta mostro 24 imagenes visibles y 53 recursos de imagen.

Recomendacion:

- separar bundle critico de entrada de poses/dialogos secundarios;
- diferir poses no visibles al inicio;
- evaluar conversion futura a WebP local con fallback, despues de validacion visual.

### Transicion entre mundos

Es el patron mas liviano en runtime porque usa WebP como fuente primaria y PNG como fallback. Aunque el inventario total incluye PNG grandes, el subconjunto critico preferente es bajo.

Recomendacion:

- reutilizar el patron de fuentes WebP + fallback local;
- documentar este patron como referencia para siguientes pantallas;
- no precargar PNG fallback si el navegador soporta WebP.

### Mundo I: Raiz

El conjunto total de assets es el mas pesado. El background, planta, raiz base y Lía idle son necesarios al inicio; raices activas, camino de salida y poses futuras deben tratarse como bundles de estado.

Recomendacion:

- `world1RootInitial`: background, plant, root base, Lia idle, nodos basicos.
- `world1RootRelation`: raiz RELACION, pose point_relation.
- `world1RootPerception`: raiz PERCEPCION, pose look_perception.
- `world1RootMediation`: raiz MEDIACION, pose guide_mediation.
- `world1RootReady`: camino de salida, pose ready_continue.
- `world1RootFutureExit`: teleport/exit poses futuras, no criticas para la primera entrada.

## 5. Deudas detectadas

- No existe todavia una capa comun de asset preloading/decode por ruta.
- No todos los assets pesados tienen variante WebP runtime.
- El camino de salida y algunos overlays de Mundo I son grandes para cargarse anticipadamente sin necesidad.
- La diferencia entre assets criticos y secundarios existe en documentacion/manifiestos, pero no esta automatizada como flujo de carga runtime.

## 6. Recomendacion de inventario vivo

Mantener un inventario versionado por pantalla con:

- `id`
- `src`
- `screen`
- `state`
- `criticality`
- `preloadGroup`
- `expectedDimensions`
- `fallback`
- `notes`

Esto permitiria que la pantalla de carga o cada transicion cargue solo lo necesario, sin inventar rutas ni depender de heuristicas DOM.
