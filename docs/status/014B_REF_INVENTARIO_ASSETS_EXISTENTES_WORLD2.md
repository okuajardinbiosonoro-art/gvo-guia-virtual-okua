# 014B-REF - Inventario referencial de assets existentes para World II

## 1. Proposito

Este documento inventaria assets y referencias existentes en GVO para orientar la produccion manual de assets de Estacion II / Mundo II - Pulso invisible.

El ticket no produce assets, no integra assets, no modifica runtime y no copia archivos desde Descargas. Su funcion es dejar una base documental para que ChatGPT prepare prompts concretos, el usuario genere imagenes con ChatGPT Images, las corrija en Photopea y luego Codex las integre en un ticket posterior autorizado.

## 2. Alcance

Se inspeccionaron rutas permitidas por el ticket:

- `public/assets/**`
- `assets/**`
- `src/assets/**`
- `docs/narrative/**`
- `docs/archive_manifests/**`
- `docs/visual/**`
- `docs/status/**`
- `src/screens/World1Root/**`
- `src/screens/TransitionWorld/**`
- `src/components/progress/**`

Archivo creado en este ticket:

- `docs/status/014B_REF_INVENTARIO_ASSETS_EXISTENTES_WORLD2.md`

No se modificaron archivos existentes.

## 3. Estado Git inicial

```text
## main...origin/main
0247c18 fix: correct loading preload and asset methodology 014A1
008c67a fix: polish loading and specify World II assets 014A
c1d5d62 fix: align loading visuals and define asset pipeline 013C
13bbaa2 fix: stabilize W1 exit and loading visual flow 013B
0e63943 tools: add offline editorial Excel validator 012F
0e305f2 docs: prepare editorial Excel import plan 012E
86d5708 docs: review full W1 Final flow 013A
f0241a2 feat: build Mirador final temporary experience 012C
```

## 4. Comandos de inspeccion

```bash
git status --short --branch
git log --oneline -n 8
rg --files public assets src/assets docs src/screens/World1Root src/screens/TransitionWorld src/components/progress
git diff --check
```

No se ejecutaron scripts npm, servidor local, baseline, `npm audit`, `pre-commit`, `gitleaks` ni herramientas externas.

## 5. Inventario general

| Grupo | Ruta | Cantidad de archivos | Formatos | Uso actual | Runtime / Referencia | Reutilizable en W2 | Riesgo | Recomendacion |
|---|---:|---:|---|---|---|---|---|---|
| Pre-portada runtime | `public/assets/runtime/loading-initial/**` y `public/assets/runtime/loading-initial-pre-portada.png` | 12 | `png`, `json` | LoadingInitial, pre-portada y microanimaciones | Runtime | Como referencia parcial | Medio: puede arrastrar lenguaje de carga inicial | Usar para barra, halo, chispa y logica visual de espera; no usar como fondo W2 |
| Transicion runtime | `src/assets/transition-world/root/runtime/**` | 35 | `png`, `webp`, `md` | Transicion W1 a W2 y barra comun | Runtime | Alta como referencia para transicion y UI | Medio: semantica de portal raiz | Usar para UI, progreso, profundidad y entrada/salida |
| Transicion src assets | `src/assets/transition-world/root/**` | 38 | `png`, `webp`, `json`, `md`, `ts` | Manifest y referencias runtime de transicion | Runtime / configuracion | Media | Medio: no copiar estructura sin ticket de integracion | Usar para entender familias, no para tocar runtime |
| Mundo I runtime | `public/assets/gvo/stations/world-1-root/**` | 22 | `png`, `json`, `md` | Estacion I aprobada | Runtime | Baja directa, media como referencia | Alto: Mundo II debe diferenciarse de raiz/relacion/percepcion | Usar solo como contraste y escala de sistema |
| Assets compartidos | `public/assets/gvo/shared/**` | 44 | `png`, `webp`, `json`, `md` | Biblioteca compartida de Lia y copias de uso actual | Runtime / biblioteca | Alta para Lia, baja para fondos | Alto si se congela Lia en estado Mundo I | Usar Lia como identidad base, producir poses W2 nuevas |
| Referencias globales | `assets/reference/**` | 4 | `png`, `md` | Referencia historica curada | Referencia | Media | Medio: carga/portada no son W2 | Usar para tono GVO y no para semantica de pulso |
| Atlas visual | `docs/narrative/atlas_visual_assets_gvo_v1/**` | 72 | `png`, `csv`, `md` | Atlas documental y mockups historicos | Referencia | Alta | Medio: contiene mockups no runtime | Usar W2 atlas como referencia principal |
| Manifiestos de archivo | `docs/archive_manifests/**` | 4 | `md`, `csv` | Registro liviano de lotes archivados | Referencia documental | Baja | Bajo | Usar para saber que evidencia historica fue retirada de repo vivo |
| Docs visual | `docs/visual/**` | 59 | `png`, `md` | QA, validaciones visuales, paquetes de portada | Referencia | Media | Medio: mucha portada/typography puede contaminar W2 | Usar para tipografia y UI; no para fondos W2 |
| Referencias narrativas | `docs/narrative/visual_refs/**` | 10 | `png`, `jpg` | Dossier visual del recorrido | Referencia | Alta | Bajo si se eligen 2-4 piezas maximo | Usar `04_estacion_ii_pulso_invisible.png` como referencia central |
| Referencias escritor | `docs/narrative/entrega_escritor_gvo_v1/visual_refs/**` | 9 | `png` | Entrega curada para guionizacion | Referencia | Alta | Bajo/medio | Usar pares W2 + transicion; evitar saturar prompts |
| Validaciones Mundo I | `docs/gvo/world-1/validation/**` | 94 | `png`, `json` | Evidencia historica de layout y estados Mundo I | Referencia | Baja directa | Alto: contamina W2 con lenguaje de raices | Usar solo para escala mobile y estados, no como estilo |
| Validaciones performance | `docs/gvo/performance/validation/**` | 28 | `png`, `json` | Evidencia de rutas y performance | Referencia | Media | Bajo/medio | Usar para encuadre mobile, no para identidad W2 |
| World1Root source | `src/screens/World1Root/**` | 13 | `tsx`, `ts`, `css` | Runtime Estacion I | Codigo fuente | No | Alto | No usar para produccion visual, solo para entender uso actual |
| TransitionWorld source | `src/screens/TransitionWorld/**` | 13 | `tsx`, `ts`, `css` | Runtime transicion | Codigo fuente | No directo | Medio | No modificar; usar como contexto de continuidad |
| Componentes progress | `src/components/progress/**` | 5 | `tsx`, `ts`, `css` | Barra/progreso compartido | Codigo fuente | No directo | Bajo | No modificar; usar como referencia de UI ya aprobada |

## 6. Inventario por grupos

### 6.1 Assets runtime de pre-portada

| Ruta / grupo | Cantidad | Tipo | Uso actual | Puede servir como referencia W2 | Riesgo | Recomendacion |
|---|---:|---|---|---|---|---|
| `public/assets/runtime/loading-initial-pre-portada.png` | 1 | PNG | Imagen compuesta de pre-portada | Si, como referencia de arranque y atmosfera GVO | Medio: no es Mundo II | Adjuntar solo si el prompt necesita continuidad con la carga inicial |
| `public/assets/runtime/loading-initial/water/water_flow_5f.*` | 2 | PNG + JSON | Sprite/metadata de flujo de agua | Si, para microflujo organico | Medio: agua y semilla pueden desviar el pulso invisible | Usar como referencia secundaria para movimiento suave |
| `public/assets/runtime/loading-initial/plant/plant_growth_4f.*` | 2 | PNG + JSON | Crecimiento vegetal | Parcial | Alto: puede volver W2 demasiado botanico | Evitar en fondos W2; util solo para ritmo de crecimiento |
| `public/assets/runtime/loading-initial/lia/lia_loading_16f.*` | 2 | PNG + JSON | Lia en carga | Si, para identidad base de Lia | Medio | Usar como referencia de proporcion, no como pose final |
| `public/assets/runtime/loading-initial/sparkles/*.png` | 4 | PNG | Chispas/microbrillos | Si, para pulso/señal puntual | Bajo/medio | Usar en prompts de senal o feedback, no como motivo central |
| `public/assets/runtime/loading-initial/ground/ground_halo_01_orbital_ring.png` | 1 | PNG | Halo/anillo de base | Si, para UI organica o nodo | Medio | Buena referencia de energia circular; adaptar a W2 |

### 6.2 Assets runtime de transiciones

| Ruta / grupo | Cantidad | Tipo | Uso actual | Puede servir como referencia W2 | Riesgo | Recomendacion |
|---|---:|---|---|---|---|---|
| `src/assets/transition-world/root/runtime/progress/**` | 12 | PNG + WEBP | Track, fill, spark, extremos y ornamento de progreso | Alta para UI/paneles y CTA organico | Bajo/medio | Referencia prioritaria para barras, medidores y feedback |
| `src/assets/transition-world/root/runtime/background/**` | 2 | PNG + WEBP | Fondo de transicion | Media para entrada/salida W2 | Medio: transicion no debe convertirse en estacion | Usar para atmosfera de paso, no para fondo base W2 |
| `src/assets/transition-world/root/runtime/lia/**` | 8 | PNG + WEBP | Lia en transicion | Alta para presencia guia | Medio: pose de transicion, no de estacion | Usar para continuidad de Lia y producir pose W2 nueva |
| `src/assets/transition-world/root/runtime/portal/**` | 12 | PNG + WEBP | Portal, simbolo y estados | Media para nodo/pulso | Alto: portal raiz puede invadir W2 | Usar con cuidado para energia/estados, no copiar portal |
| `src/assets/transition-world/root/runtime/validation/README.md` | 1 | MD | Registro de validacion | Documental | Bajo | Mantener como evidencia, no adjuntar a ChatGPT Images |

### 6.3 Assets Mundo I

| Categoria | Ruta | Cantidad aprox. | Uso actual | Recomendacion para W2 |
|---|---|---:|---|---|
| Fondos | `public/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png` | 1 | Fondo Mundo I | No reutilizar directo; usar solo para escala/encuadre mobile |
| Raices / estados activos | `public/assets/gvo/stations/world-1-root/roots/*.png` | 4 | Base y estados relacion/percepcion/mediacion | No adjuntar para fondo W2 salvo contraste; semantica de raices es fuerte |
| Nodo interactivo | `public/assets/gvo/stations/world-1-root/nodes/world1_root_node_state_kit_approved_v1.png` | 1 | Kit de estados del nodo Mundo I | Referencia baja/media para estados, no para forma final |
| Lia Mundo I | `public/assets/gvo/stations/world-1-root/lia/*.png` | 11 | Poses aprobadas de Lia Mundo I | Usar solo para identidad de Lia; producir nuevas poses W2 |
| Luz ambiente | `public/assets/gvo/stations/world-1-root/light/world1_root_ambient_light_kit_approved_v1.png` | 1 | Luz/ambiente | Referencia posible para iluminacion suave |
| Exit path | `public/assets/gvo/stations/world-1-root/exit-path/world1_root_exit_path_approved_v1.png` | 1 | Evidencia/asset de salida W1 | No usar para W2; pertenece a cierre Mundo I |
| Validaciones | `docs/gvo/world-1/validation/**` | 94 | Capturas y metricas historicas | Usar solo para escala, layout y estados; no como referencia estetica principal |

### 6.4 Assets compartidos

| Categoria | Ruta | Uso actual | Reutilizable en W2 | Recomendacion |
|---|---|---|---|---|
| Lia carga | `public/assets/gvo/shared/lia/current-used/carga-inicial/lia_loading_16f.png` | Lia en loading | Referencia | Identidad base, no pose final |
| Lia portada | `public/assets/gvo/shared/lia/current-used/portada-intro/**` | Poses y rig de portada | Referencia alta para identidad | Adjuntar 1-2 piezas maximo si se produce Lia W2 |
| Lia transicion | `public/assets/gvo/shared/lia/current-used/transition-world/**` | Lia en transicion | Referencia alta | Usar para continuidad entre pantallas |
| Lia futuro Mundo I | `public/assets/gvo/shared/lia/future/mundo-i-raiz/**` | Duplicado/biblioteca futura de Mundo I | Referencia baja/media | Evitar para W2 salvo rasgos de identidad |
| Manifest Lia | `public/assets/gvo/shared/lia/asset_manifest_lia_v1.json` | Registro tecnico | Documental | No adjuntar a generacion de imagen |

### 6.5 Assets globales / revision

| Clasificacion | Ruta | Cantidad | Uso | Recomendacion |
|---|---|---:|---|---|
| `reference` | `assets/reference/screens/001_carga_inicial_pre_portada.png` | 1 | Referencia de carga inicial | Usar solo para continuidad de pre-portada |
| `reference` | `assets/reference/screens/002_portada_intro_archivo_vivo_reference.png` | 1 | Referencia portada | Usar con cuidado para UI/tono, no para W2 |
| `reference` | `assets/reference/screens/loading-initial/loading_initial_master_reference_v2.png` | 1 | Master de loading | Buena referencia de atmosfera y pulido |
| `global-review` | `assets/reference/README.md` | 1 | Indice | No adjuntar a imagen |
| `source/raw/unused/candidate` | `assets/**` | No se detectaron otros grupos en el listado permitido | No aplica | Sin accion en este ticket |

### 6.6 Atlas visual

| Subgrupo | Rutas relevantes | Utilidad W2 | Recomendacion |
|---|---|---|---|
| Referencia W2 directa | `docs/narrative/visual_refs/04_estacion_ii_pulso_invisible.png`, `docs/narrative/entrega_escritor_gvo_v1/visual_refs/04_estacion_ii_pulso_invisible.png` | Estilo y concepto central de Estacion II | Referencia principal para fondos |
| Atlas W2 conceptual | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_104_mundo_ii_intro_conceptual_mockup.png` | Intro/concepto W2 | Usar para direccion visual, no copiar literalmente |
| Atlas W2 senal | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_105_mundo_ii_capa_senal_mockup.png` | Pulso/senal/capa invisible | Referencia prioritaria para pulso y overlays |
| Atlas ref Estacion II | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006c_205_ref_estacion_ii_pulso_invisible.png` | Referencia consolidada W2 | Alta prioridad para prompts de fondo |
| Atlas W2 estados | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_201_mundo_ii_planta_viva_mockup.png` a `gvo_atlas_006d_207_mundo_ii_cierre_esperado_mockup.png` | Estados planta viva, captura, acondicionamiento, mapeo, resultado, bloqueo, cierre | Usar por familia segun asset objetivo |
| Atlas transicion | `docs/narrative/visual_refs/02_transicion_entre_mundos.png`, `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_006_transicion_mundo_i_actual.png`, `gvo_atlas_006b_103_transicion_generica_entre_mundos_mockup.png` | Puente visual | Usar para entradas/salidas |
| Atlas Mundo I | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_007_mundo_i_intro_actual.png` a `gvo_atlas_006b_012_mundo_i_bloqueo_actual.png` | Contraste y escala | No usar como referencia principal W2 |
| Manifiestos | `docs/narrative/atlas_visual_assets_gvo_v1/manifest_*.csv` | Trazabilidad | No adjuntar a imagen; usar para ubicar material |

## 7. Assets runtime

Runtime vivo detectado:

- Pre-portada: `public/assets/runtime/loading-initial-pre-portada.png` y `public/assets/runtime/loading-initial/**`.
- Transicion W1 a W2: `src/assets/transition-world/root/runtime/**`.
- Mundo I: `public/assets/gvo/stations/world-1-root/**`.
- Lia compartida: `public/assets/gvo/shared/lia/current-used/**`.
- Cover intro: aparece en `public/assets/runtime/cover-intro/**`, pero no es el centro de este ticket y debe evitarse como fuente dominante para W2.

Ningun asset runtime fue modificado.

## 8. Assets de referencia

Referencias vivas o documentales utiles para Estacion II:

- `docs/narrative/visual_refs/04_estacion_ii_pulso_invisible.png`
- `docs/narrative/entrega_escritor_gvo_v1/visual_refs/04_estacion_ii_pulso_invisible.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006c_205_ref_estacion_ii_pulso_invisible.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_105_mundo_ii_capa_senal_mockup.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_201_mundo_ii_planta_viva_mockup.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_202_mundo_ii_captura_mockup.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_203_mundo_ii_acondicionamiento_mockup.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_204_mundo_ii_mapeo_mockup.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_205_mundo_ii_resultado_mediado_mockup.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_206_mundo_ii_bloqueo_suave_mockup.png`
- `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_207_mundo_ii_cierre_esperado_mockup.png`

## 9. Assets Mundo I

Los assets de Mundo I son runtime aprobado y deben conservarse intactos. Para Mundo II, conviene usarlos como referencia de escala, capas y comportamiento de estado, no como lenguaje visual dominante.

No conviene adjuntar demasiadas piezas de Mundo I a ChatGPT Images cuando se genere W2, porque el modelo puede copiar raices, tierra, colorimetria y semantica de Estacion I. Mundo II debe expresar pulso invisible, senal, mediacion tecnica y lectura de actividad, no raiz viva como protagonista.

## 10. Assets compartidos

Lia es el asset compartido con mayor valor para W2. Reutilizacion recomendada:

- Identidad base: usar referencias de Lia de portada/transicion para proporciones, silueta, ojos y lenguaje de guia.
- Poses W2: generar nuevas poses especificas para Pulso invisible.
- Runtime directo: no copiar ni integrar en este ticket.
- Evitar: usar poses de Mundo I como si fueran poses finales de W2.

## 11. Atlas visual

El atlas contiene el mejor puente entre concepto y produccion. Para World II son prioritarios los mockups y referencias con nombres `mundo_ii`, `estacion_ii` y `pulso_invisible`.

Tambien hay referencias de tipografia y QA en `docs/visual/**`; son utiles para UI y legibilidad, pero no deben dominar la estetica de fondos.

## 12. Matriz - Referencias recomendadas para ChatGPT Images

| Referencia | Ruta | Que ensena | Cuando adjuntarla | Cuando NO adjuntarla | Riesgo de contaminacion | Prioridad |
|---|---|---|---|---|---|---|
| W2 visual ref narrativa | `docs/narrative/visual_refs/04_estacion_ii_pulso_invisible.png` | Concepto central de Pulso invisible | Fondos base W2, atmosfera, paleta | Si se busca UI aislada transparente | Bajo | ALTA |
| W2 ref escritor | `docs/narrative/entrega_escritor_gvo_v1/visual_refs/04_estacion_ii_pulso_invisible.png` | Version curada para guion | Fondos y prompts narrativos | Si ya se adjunto la version narrativa equivalente | Bajo | ALTA |
| Atlas W2 consolidado | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006c_205_ref_estacion_ii_pulso_invisible.png` | Direccion visual consolidada | Fondo base, ambiente, estado general | Si se quiere una variacion radical | Bajo/medio | ALTA |
| Capa senal W2 | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_105_mundo_ii_capa_senal_mockup.png` | Pulso, senal, overlay invisible | Pulso/senal, capas de estado, overlays | En prompts de Lia o UI pura | Bajo | ALTA |
| Planta viva W2 | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_201_mundo_ii_planta_viva_mockup.png` | Materia viva de W2 | Fondo/ambiente de estacion | Si el prompt debe enfocarse en interfaz | Medio | MEDIA |
| Captura W2 | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_202_mundo_ii_captura_mockup.png` | Lectura/captura de senal | Nodo interactivo y estados de medicion | Para fondos limpios sin UI | Medio | MEDIA |
| Acondicionamiento W2 | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_203_mundo_ii_acondicionamiento_mockup.png` | Preparacion/mediacion tecnica | Mediacion tecnica, feedback | Para Lia/presencia guia | Medio | MEDIA |
| Mapeo W2 | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_204_mundo_ii_mapeo_mockup.png` | Mapeo de actividad | Overlays y lectura de senal | Para fondo organico sin HUD | Medio | MEDIA |
| Resultado mediado | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_205_mundo_ii_resultado_mediado_mockup.png` | Estado de resultado | Estado final o feedback positivo | Para intro neutral | Medio | MEDIA |
| Bloqueo suave W2 | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_206_mundo_ii_bloqueo_suave_mockup.png` | Error/bloqueo amable | Estado bloqueado o fallback visual | Para asset base de bienvenida | Medio | MEDIA |
| Cierre esperado W2 | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_207_mundo_ii_cierre_esperado_mockup.png` | Cierre de Mundo II | Transicion de salida W2 | Para fondo inicial | Medio | MEDIA |
| Progress transition | `src/assets/transition-world/root/runtime/progress/transition_root_progress_track_base_v1.png` | Track y lenguaje UI | UI/paneles/CTA organico | Para fondos de escena completa | Bajo | ALTA |
| Progress fill | `src/assets/transition-world/root/runtime/progress/transition_root_progress_fill_segment_v1.png` | Energia de avance | Barras, medidores, pulso horizontal | Para fondos generales | Bajo | ALTA |
| Progress spark | `src/assets/transition-world/root/runtime/progress/transition_root_progress_spark_v1.png` | Chispa de avance | Senal puntual, feedback, highlights | Si ya se adjuntan muchas referencias brillantes | Bajo | MEDIA |
| Lia transition master | `src/assets/transition-world/root/runtime/lia/lia_transition_root_master_v1.png` | Identidad Lia en transicion | Lia/presencia guia W2 | Para fondos sin personaje | Medio | ALTA |
| Lia portada rig/head | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_head_opal_clean_v1.png` | Rostro/identidad de Lia | Poses nuevas de Lia | En prompts de fondo o UI | Medio | ALTA |
| Loading halo | `public/assets/runtime/loading-initial/ground/ground_halo_01_orbital_ring.png` | Halo circular organico | Nodo/pulso/CTA organico | Si el resultado se vuelve demasiado loading | Medio | MEDIA |
| Mundo I background | `public/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png` | Escala y composicion mobile W1 | Solo contraste de escala | No adjuntar para fondo W2 final | Alto | NO_USAR |
| Mundo I roots | `public/assets/gvo/stations/world-1-root/roots/world1_root_roots_base_approved_v1.png` | Raices y lenguaje W1 | Solo analisis interno | No adjuntar a ChatGPT Images para W2 | Alto | NO_USAR |

## 13. Referencias que NO deben usarse

No adjuntar como referencia principal para assets W2:

- `public/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png`
- `public/assets/gvo/stations/world-1-root/roots/world1_root_roots_base_approved_v1.png`
- `public/assets/gvo/stations/world-1-root/roots/world1_root_active_relation_approved_v1.png`
- `public/assets/gvo/stations/world-1-root/roots/world1_root_active_perception_approved_v1.png`
- `public/assets/gvo/stations/world-1-root/roots/world1_root_active_mediation_approved_v1.png`
- `public/assets/gvo/stations/world-1-root/exit-path/world1_root_exit_path_approved_v1.png`
- Capturas masivas de `docs/gvo/world-1/validation/**`
- Paquetes visuales completos de portada en `docs/visual/cover-intro/**`, salvo cuando se necesite UI/typography con mucho control.

Motivo: esas referencias pueden contaminar W2 con semantica de raices, portada, portal o cierre de Mundo I.

## 14. Matriz - Reutilizacion para Estacion II

| Asset o grupo | Ruta | Reutilizacion directa | Reutilizacion como referencia | Requiere adaptacion | No recomendado | Motivo |
|---|---|---|---|---|---|---|
| Fondo base W2 del atlas | `docs/narrative/visual_refs/04_estacion_ii_pulso_invisible.png` | No | Si | Si | No | Es referencia conceptual, no runtime final |
| Atlas W2 consolidado | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006c_205_ref_estacion_ii_pulso_invisible.png` | No | Si | Si | No | Guia estilo y composicion |
| Capa senal W2 | `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_105_mundo_ii_capa_senal_mockup.png` | No | Si | Si | No | Base para pulso/senal |
| Progress track/fill/spark | `src/assets/transition-world/root/runtime/progress/**` | No en este ticket | Si | Si | No | Util para UI coherente; integracion requiere ticket runtime |
| Lia transition | `src/assets/transition-world/root/runtime/lia/**` | No | Si | Si | No | Mantiene identidad; W2 necesita poses propias |
| Lia portada rig | `public/assets/gvo/shared/lia/current-used/portada-intro/**` | No | Si | Si | No | Referencia de identidad y piezas |
| Loading sparkles | `public/assets/runtime/loading-initial/sparkles/*.png` | No | Si | Si | No | Buen lenguaje de pulso menor |
| Loading plant/water | `public/assets/runtime/loading-initial/plant/**`, `water/**` | No | Parcial | Si | Parcial | Puede desviar a loading/crecimiento |
| Mundo I roots | `public/assets/gvo/stations/world-1-root/roots/**` | No | Solo contraste | Si | Si | Semantica W1 demasiado dominante |
| Mundo I background | `public/assets/gvo/stations/world-1-root/background/**` | No | Solo escala | Si | Si | Fondo W2 debe ser nuevo |
| Portal root | `src/assets/transition-world/root/runtime/portal/**` | No | Parcial | Si | Parcial | Util para energia/estado, peligro de portalizar W2 |

## 15. Matriz - Assets faltantes para Estacion II

| Familia | Asset esperado | Existe algo parecido | Referencia recomendada | Debe generarse nuevo | Prioridad | Notas |
|---|---|---|---|---|---|---|
| fondos | `world2_background_base_mobile_v01.webp` | Si, mockups W2 en atlas | `docs/narrative/visual_refs/04_estacion_ii_pulso_invisible.png`; `gvo_atlas_006c_205_ref_estacion_ii_pulso_invisible.png` | Si | ALTA | Primer asset recomendado |
| ambiente | `world2_ambient_depth_layers_v01.webp/png` | Si, W2 planta/captura/acondicionamiento | `gvo_atlas_006d_201`, `006d_202`, `006d_203` | Si | ALTA | Separar fondo y capas si se animara luego |
| pulso/senal | `world2_signal_pulse_overlay_v01.png` | Si, capa senal atlas y sparkles loading | `gvo_atlas_006b_105_mundo_ii_capa_senal_mockup.png`; `transition_root_progress_spark_v1.png` | Si | ALTA | Transparente preferible |
| nodo interactivo | `world2_signal_node_states_v01.png` | Parcial, nodo W1 y portal states | `world1_root_node_state_kit_approved_v1.png` solo como contraste; `portal_root_states_3f_v1.png` con cuidado | Si | ALTA | No copiar raiz/portal |
| capas por estado | `world2_state_layers_capture_mapping_result_v01.png` | Si, atlas W2 006d_202 a 006d_205 | Atlas W2 estados | Si | MEDIA | Puede dividirse en assets por estado |
| mediacion tecnica | `world2_technical_mediation_panel_v01.png` | Si, `006d_203` y progress UI | `gvo_atlas_006d_203_mundo_ii_acondicionamiento_mockup.png`; progress track/fill | Si | MEDIA | Debe sentirse organico, no dashboard frio |
| Lia/presencia guia | `lia_world2_guide_idle_v01.png`, `lia_world2_signal_point_v01.png` | Si, Lia portada/transicion/Mundo I | `lia_transition_root_master_v1.png`; `lia_rig_head_opal_clean_v1.png` | Si | ALTA | Mantener identidad sin reciclar pose W1 |
| CTA organico | `world2_cta_continue_signal_v01.png` | Parcial, progress y halo | progress track/fill; `ground_halo_01_orbital_ring.png` | Si | MEDIA | Integrar con barra comun |
| transicion entrada/salida | `world2_transition_entry_signal_v01.png`, `world2_transition_exit_v01.png` | Si, TransitionWorld runtime | `transition_root_background_v1.png`; `portal_root_open_v1.png` con cuidado | Si | MEDIA | No convertir estacion en portal |
| UI/overlays | `world2_ui_reading_overlay_v01.png` | Si, progress UI y W2 mapeo | `transition_root_progress_*`; `gvo_atlas_006d_204_mundo_ii_mapeo_mockup.png` | Si | ALTA | Transparente, legible y mobile-first |
| fallbacks | `world2_fallback_static_v01.webp` | Si, bloqueo suave W2 | `gvo_atlas_006d_206_mundo_ii_bloqueo_suave_mockup.png` | Si | MEDIA | Para error/bloqueo amable |

## 16. REFERENCIAS PARA CHATGPT IMAGES - WORLD II

### 16.1 Adjuntar para generar fondos

Usar maximo 2-4 referencias por prompt:

1. `docs/narrative/visual_refs/04_estacion_ii_pulso_invisible.png`
2. `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006c_205_ref_estacion_ii_pulso_invisible.png`
3. `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_105_mundo_ii_capa_senal_mockup.png`
4. `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_201_mundo_ii_planta_viva_mockup.png`

### 16.2 Adjuntar para generar assets transparentes

1. `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_105_mundo_ii_capa_senal_mockup.png`
2. `src/assets/transition-world/root/runtime/progress/transition_root_progress_spark_v1.png`
3. `public/assets/runtime/loading-initial/sparkles/sparkle_04_micro_white.png`
4. `public/assets/runtime/loading-initial/ground/ground_halo_01_orbital_ring.png`

### 16.3 Adjuntar para generar UI/paneles

1. `src/assets/transition-world/root/runtime/progress/transition_root_progress_track_base_v1.png`
2. `src/assets/transition-world/root/runtime/progress/transition_root_progress_fill_segment_v1.png`
3. `src/assets/transition-world/root/runtime/progress/transition_root_progress_center_ornament_v1.png`
4. `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006d_204_mundo_ii_mapeo_mockup.png`

### 16.4 Adjuntar para generar Lia/presencia guia

1. `src/assets/transition-world/root/runtime/lia/lia_transition_root_master_v1.png`
2. `src/assets/transition-world/root/runtime/lia/lia_transition_root_guide_2f_v1.png`
3. `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_head_opal_clean_v1.png`
4. `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_explain_calm_v1.png`

### 16.5 Archivos que NO debe adjuntar

1. `public/assets/gvo/stations/world-1-root/roots/world1_root_roots_base_approved_v1.png`
2. `public/assets/gvo/stations/world-1-root/roots/world1_root_active_relation_approved_v1.png`
3. `public/assets/gvo/stations/world-1-root/roots/world1_root_active_perception_approved_v1.png`
4. `public/assets/gvo/stations/world-1-root/roots/world1_root_active_mediation_approved_v1.png`
5. `public/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png`
6. `public/assets/gvo/stations/world-1-root/exit-path/world1_root_exit_path_approved_v1.png`
7. Capturas masivas de `docs/gvo/world-1/validation/**`
8. Paquetes completos de portada en `public/assets/runtime/cover-intro/**`

### 16.6 Riesgos al adjuntar Mundo I para generar Mundo II

- El modelo puede copiar raices y tierra, debilitando la identidad de Pulso invisible.
- Puede convertir Mundo II en una variante de Mundo I en vez de una estacion nueva.
- Puede arrastrar colorimetria y estados de relacion/percepcion/mediacion que ya tienen semantica propia.
- Puede producir assets que luego parezcan runtime aprobado por accidente.

### 16.7 Regla practica de referencias por prompt

Adjuntar 2-4 referencias maximo:

- 1 referencia principal W2.
- 1 referencia de capa/senal.
- 1 referencia de UI o Lia si aplica.
- 1 referencia de continuidad GVO solo si es estrictamente necesaria.

## 17. Recomendacion final de metodologia

Para `ASSET_001_WORLD2 - world2_background_base_mobile_v01.webp`, usar:

- Referencia principal: `docs/narrative/visual_refs/04_estacion_ii_pulso_invisible.png`
- Referencia secundaria: `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006c_205_ref_estacion_ii_pulso_invisible.png`
- Referencia de pulso: `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006b_105_mundo_ii_capa_senal_mockup.png`
- Evitar: assets de raices Mundo I y portada completa.

Prompt futuro debe pedir fondo mobile-first, sin texto incrustado, sin UI final pegada al fondo, con espacio respirable para overlays DOM/CSS y con paleta coherente GVO pero diferenciada de Mundo I.

## 18. Riesgos

- Riesgo de contaminacion visual si se adjuntan demasiadas referencias de Mundo I.
- Riesgo de confundir mockup documental con asset runtime.
- Riesgo de generar fondos con texto incrustado; debe prohibirse en prompt.
- Riesgo de producir UI demasiado tecnica si se sobreusan referencias de progress sin capa organica.
- Riesgo de generar Lia inconsistente si se mezclan demasiadas poses de estados distintos.
- Riesgo de preparar assets fuera de nombre exacto; el siguiente ticket debe exigir nombre final en Descargas.

## 19. Confirmaciones obligatorias

- No se produjeron assets.
- No se copiaron assets.
- No se movieron assets.
- No se renombraron assets.
- No se modificaron assets existentes.
- No se creo carpeta en Descargas.
- No se toco Descargas.
- No se modifico runtime.
- No se modifico `src/**`.
- No se instalaron dependencias.
- No se modifico `package.json`.
- No se modificaron lockfiles.
- No se uso red.
- No se ejecutaron scripts npm.
- No se abrio servidor local.
- No se ejecuto baseline completo.
- No se ejecuto `npm audit`.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto `scripts/run_security_checks.ps1`.
- No se creo rama.
- No se hizo push.
- No se creo Pull Request.
- `PR_NO_APLICA`.

## 20. Siguiente paso recomendado

Preparar en ChatGPT:

```text
ASSET_001_WORLD2 - world2_background_base_mobile_v01.webp
```

El usuario generara el asset con ChatGPT Images, lo corregira en Photopea y lo guardara en Descargas con el nombre exacto. Codex no debe integrar nada hasta recibir un ticket posterior autorizado.
