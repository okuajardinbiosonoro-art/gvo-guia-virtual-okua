# Asset inventory

## Recursos de entrada · GVO 1.1.3

El [registro de Carga](../../public/assets/gvo/current-used/loading-initial/GVO-1.1.3-runtime-assets.json)
y el [registro de Portada](../../public/assets/gvo/current-used/cover-intro/GVO-1.1.3-runtime-assets.json)
describen los tres WebP sin pérdida y sus espejos. Los PNG originales
permanecen en Git. La distribución sirve sus equivalentes WebP y Workbox
los prepara en las mismas pantallas.

## Sonidos del recorrido · GVO 1.1

El paquete «Sonidos para GVO.zip» entregó 14 MP3. Se sirven desde
`/assets/gvo/audio/` y el registro conserva sus nombres originales, duraciones,
SHA-256 y disparadores. Los manifiestos están bajo
`current-used/{shared,world-2-root,world-3-root,world-4-root,world-5-root}/audio/`.
Los MP3 del runtime y los del registro conservan los bytes del diseñador.

## Recursos aprobados de GVO 1.1.1

La foto instantánea usa una enredadera floral WebP RGBA de 199 × 2025,
con follaje tupido y flores inspiradas en curubas colombianas. Se renderiza con
escala uniforme y una superposición leve sobre el margen derecho del retrato.
Su procedencia, SHA-256, copia de runtime y espejo figuran en el
[registro de la foto](../../public/assets/gvo/current-used/final-root/photo/manifest.json).
La mesa de Sala IV reutiliza seis de sus objetos registrados. Los recursos
de MIDI y Wi-Fi conservan su registro histórico.

## Revisión en iPhone · Sala V

Los fondos limpios de Sistema v03 registrados en
`current-used/world-5-root/system/OBS03-cleanplates-manifest.json` pasan a
ser el ambiente común de la trivia. Se usan sus variantes de retrato y
paisaje con los mismos bytes. El marco v02 y los fondos de cada tema se
conservan en el historial de la galería. El
[registro de Sala V](../../public/assets/gvo/current-used/world-5-root/README.md)
identifica la composición y la precarga vigentes de la candidata.

## OBS05 — reutilización de biblioteca, composición III/V

La revisión actual reutiliza los assets registrados, sin nuevos bitmaps ni
recompresión. III conserva cuaderno proporcional, giro, tres motivos y tres
clips; V conserva mapa, marco, cuatro motivos, ocho alternativas, fondos limpios
y el rig compartido de cinco pétalos. Los consumidores y límites actuales están
en `current-used/world-3-root/README.md` y `current-used/world-5-root/README.md`.
La conexión decorativa se resuelve en DOM/CSS/SVG; el texto sigue en DOM.

La candidata OBS05 build02 corrige el reflujo con texto ampliado y la reserva
del control fijo. La QA compilada verifica40 perfiles III y20 visuales V más
regresiones de respuesta/premio y recorrido fresco; las aprobaciones y cifras de
los apartados históricos siguientes no se transfieren a esta composición.
No se autoriza publicación ni despliegue de campo.
R3 fue recibido y conciliado, sin bloqueantes nuevos en la revisión estática,
editorial y de PNG seleccionados. La aprobación artística humana permanece
pendiente y no se añaden bitmaps en este cierre.

## Addendum OBS03.2 + R3 — recursos actuales, revisión pendiente

Estado: `AGENT_STATIC_ASSET_CHECK_PASS / SCENE_QA_PENDING / HUMAN_PENDING`.
El [inventario verificable OBS03](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/assets-motion/OBS03_ASSETS_MOTION_AUDIT.json)
registra rutas runtime/espejo, formato, dimensiones, bytes, SHA-256, consumidores
y límites del corte. Cada grupo presente fue contrastado con su espejo y todos
los pares coinciden. Los capítulos previos se conservan como historial.

| Grupo actual | Registro | Comprobación y límite |
| --- | --- | --- |
| Rig Lía compartido | `current-used/shared/lia/articulated-v03/manifest.json` | 16 capas WebP 432×768; exactamente cinco capas de pétalos. Portada/I/II/IV/V. Derivados de los originales auténticos; escena y aceptación humana pendientes. |
| Mano swipe v03 | `production/HAND-SWIPE-result.json` | WebP alfa 256×256, SHA-256 `8c3668ac88fa584a2dd07a0250cd2b52858b7cbe9233d45e14c9b37303679df9`. Un recurso para ambos ejes; tap anterior permanece. |
| Cuaderno III | `current-used/world-3-root/OBS03-runtime-reference.json` | Original openBase restaurado: PNG 1536×1024, SHA-256 `3abf81f4772302cb7a38b9c428c104951e35d087ff1f5989c55468ddec31d0f3`. Ambiente/base/giro y tres motivos activos; folio v02 y cinco poses históricas fuera del consumidor actual. |
| Lía pixel III, tres clips | `current-used/world-3-root/lia/clips/OBS03-clips-manifest.json` | Tres hojas reales 768×512, 18 celdas 256² en total, 495.570 bytes. INTRO/escucha/acompañamiento activos, índice neutral INTRO y base medida (128,212). Sin fallback silencioso. Piloto INTRO técnico revisado; QA de los tres clips actuales y aceptación humana pendientes. |
| Objetos IV | `production/IV-PLANTA-result.json` y `production/IV-seven-result.json` | Ocho WebP 512×512 con espejos, fuentes originales y hashes. La inspección documental no sustituye su contacto y legibilidad en escena. |
| Opciones V | `production/V-PLANTAS-*-result.json` y `production/V-six-result.json` | Ocho opciones v03 presentes. Las seis nuevas de Sistema/Espacio/Visitante suman 225.772 bytes WebP 512×512, con seis espejos y doce hashes de fuentes verificados; composición en escena pendiente. |
| Fondos limpios Sistema V | `production/SYSTEM-cleanplates-result.json` y `current-used/world-5-root/system/OBS03-cleanplates-manifest.json` | Dos fondos v03 activos en el consumidor de Sistema; 2.014.716 bytes. Par runtime/espejo, máscaras y decodificación lossless verificados. QA de escena y aprobación humana pendientes. |

`production/` en esta tabla corresponde a
`assets-source/editorial-2026-10-23/observaciones-03/production/`;
`current-used/` a `public/assets/gvo/current-used/`. Los seis registros nuevos
`OBS03-runtime-reference.json` por pantalla remiten al índice común y conservan
la separación entre asset histórico y composición candidata.

### Sistema de escucha V — cleanplates v03 activos

Estado: `INTEGRATION_CANDIDATE / SCENE_QA_PENDING / HUMAN_PENDING`.
Las rutas de la tabla son relativas a ambas bases:
`public/assets/gvo/stations/world-5/present-map/runtime/` y
`public/assets/gvo/current-used/world-5-root/`. Cada fila registra un par
byte-idéntico; los fondos v01 se conservan como historial.

| Ruta relativa del par | Formato / dimensiones | Bytes | SHA-256 | Función / consumidor |
| --- | --- | ---: | --- | --- |
| `system/world5_sub_system_environment_portrait_v03.webp` | WebP opaco / 1440×1920 | 1.261.922 | `e1d6d82f246215e0870449e3affd399010ffd24e046608635845aa4a7c160d08` | Fondo de Sistema sin cajas/cable/puertos horneados; `world5RuntimeAssets.ts#getWorld5Environment("sistema", "portrait")` → `World5RootScreen` |
| `system/world5_sub_system_environment_landscape_v03.webp` | WebP opaco / 1920×1080 | 752.794 | `7a2124d0db8bd573ee47960e055d40f6b41232ab2c6cc5c56fdf0d066453578b` | Mismo consumidor en orientación landscape |

Los masters registrados son
`production/pixel-two-system-cleanplates-originals/WORLD5_SYSTEM_CLEANPLATE_PORTRAIT_OBS03.png`
y `WORLD5_SYSTEM_CLEANPLATE_LANDSCAPE_OBS03.png` en esa misma carpeta.
Sus fuentes nativas `originals/*_NATIVE.png` se preservan como procedencia y
no sustituyen esos masters reparados. El pipeline
`tools/assets/derive_obs03_system_cleanplates.mjs` y su informe de producción
registran cero píxeles RGBA cambiados fuera de las máscaras autorizadas, alpha
opaco inalterado y WebP decodificado exactamente igual al master registrado.
Las superficies antes ocluidas se reconstruyen como ilustración inferida.
`getWorld5CriticalAssetSources` prepara una sola orientación de Sistema junto
a sus recursos actuales; los otros ambientes mantienen v01. Los controles de
archivo y su activación no equivalen a QA visual en escena ni aprobación humana.

El rig declara 21.233.664 bytes RGBA teóricos para sus 16 capas: cálculo
`ancho×alto×4`, sin medición de RAM/GPU ni promesa de rendimiento. Sus acciones
articulan capas de pétalos y cabeza en 1150/1450/900 ms; reduced motion sustituye
la animación por poses breves estáticas. La mano combina giro base de 30° con el
giro del eje: el contraste aritmético del pivote contra el código difiere menos
de 0,005 puntos porcentuales del lienzo; falta comprobar la alineación visible.

Las listas efectivas corrigen dos omisiones/divergencias: Portada precarga su
bitmap de activación mientras sigue montándolo, e I deja de depender de cinco
poses antiguas que ya no muestra. Dos archivos de pruebas, cinco casos PASS,
validan esas listas. El [informe OBS03](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/assets-motion/OBS03_ASSETS_MOTION_AUDIT.md)
documenta las deudas de Lía pixel III, registro del giro, pruebas visuales
responsive y producción restante. No se ejecutó navegador en esta auditoría.

## Candidata editorial anterior — 2026-10-23, historial preservado

Portada consume el logo auténtico completo de `E:/OKUA/05_ACTIVOS_MARCA_MEDIA/Logos/logo.png`
sin transformar sus bytes (178×102, SHA-256
`02a788962968ea2277211a362539bfd9efa0e21559f2191ccd0f8ab9b9a8269a`).
Carga sustituye los emblemas anteriores de la maceta y la regadera por el recorte
exacto del símbolo, en derivados de las hojas originales. Las 4 celdas de planta
y las 12 de Lía con regadera conservan todos los píxeles RGBA fuera de las placas
enumeradas; las cuatro celdas iniciales de Lía no cambian. Se conservan las grillas,
los cinco pétalos y el registro de animación. Los tres pares runtime/mirror,
dimensiones, hashes y coordenadas están en [el registro de entrada](../narrative/integracion_autonoma_2026-10-23/entry-brand-assets.json).
La composición es candidata para revisión humana.

Sala III reutiliza siete originales (ambiente, `turnPage` y cinco poses), añade
tres motivos producidos en un único hilo de ChatGPT Images y consume el nuevo
folio ilustrado. La base `openBase` es histórica. Los diez pares iniciales están
registrados con dimensiones y hashes en [el manifiesto de producción](../narrative/integracion_autonoma_2026-10-23/assets-production.json);
el folio adicional y los tres recursos de acabado de IV/V/navegación se registran
en el addendum de acabado de este inventario.
El triángulo incorpora el símbolo extraído del PNG de marca existente, sin
redibujarlo, tras la corrección expresa del responsable. Las nuevas composiciones
son candidatas para revisión humana; las aprobaciones siguientes son históricas.

## Runtime policy

Los assets runtime son locales y se referencian mediante registros tipados. La
ruta que consume la aplicación y su espejo de revisión tienen responsabilidades
distintas:

- Runtime de Estación III: `public/assets/gvo/stations/world-3/notebook-pixel/runtime/`.
- Espejo canónico aprobado: `public/assets/gvo/current-used/world-3-root/`.
- Registro ejecutable: `src/screens/World3Root/world3RuntimeAssets.ts`.
- Propiedad semántica: `src/screens/World3Root/world3SemanticAssetManifest.ts`.

La candidata editorial del 11-11-2026 incorpora siete ilustraciones WebP RGBA
de 320 × 256 px en los folios de Introducción y Paso a paso. ChatGPT Imágenes
generó el original común. El manifiesto
`public/assets/gvo/current-used/world-3-root/editorial-2026-11-11.json`
registra origen, recortes, dimensiones, huellas y espejos de cada recurso.
El consumidor conserva la base original y la animación de pasar de página.

Los archivos byte-idénticos entre runtime y `current-used` son pares deliberados
de política, no duplicados accidentales. El Atlas visual sigue siendo referencia
documental y no sustituye ninguno de estos dos árboles.

## GVO_DEBT_013 — `/inicio` y Portada

Estado: `INTEGRATED_FOR_REVIEW / PENDING_HUMAN_REVIEW`.

`/inicio` conserva el fondo aprobado de Portada y las cinco representaciones de
Mundo I–V aprobadas y publicadas para el Mirador. `GVO_DEBT_013C` desacopla
Portada: sus cinco portales consumen interiores verticales dedicados del paquete
humano aprobado `GVO_COVER_PORTAL_INTERIORS_APPROVED_V01.zip` (SHA-256
`B70B2604DD5E960A0057C10D269F756C18E3CD47411D84348B395E0F119A78CC`).
Los WebP se copiaron sin transformación a runtime y a su mirror canónico:

```text
public/assets/gvo/current-used/initial-experience/README.md
public/assets/gvo/current-used/cover-intro/README.md
```

`/inicio` mantiene `src/shared/assets/entryCoverAssets.ts`; Portada usa el
registro dedicado `src/screens/Cover/coverPortalInteriorAssets.ts`. Fondo,
labels, controles, números romanos, locks, estados y copy conservan sus
responsabilidades previas. La aprobación de los binarios no sustituye la
revisión humana de la composición.

| Portal | Ruta relativa bajo `public/assets/runtime/cover-intro/` y `public/assets/gvo/current-used/cover-intro/` | Formato / dimensiones | SHA-256                                                            | Función / consumidor                                 | Estado                                         |
| ------ | ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------- |
| I      | `portals/portal_1/interior/cover_portal_world1_root_interior_v01.webp`                                  | WEBP RGB / 1024×1872  | `31A0635850AF15531EE75DC9C2A3E4D1EDFE322FA9D4569D6D94513434255C92` | Interior full-bleed Mundo Raíz / `CoverIntroScreen`  | Asset aprobado; pantalla pendiente de revisión |
| II     | `portals/portal_2/interior/cover_portal_world2_pulse_interior_v01.webp`                                 | WEBP RGB / 1024×1872  | `50C605CDC891F8B21D9ED792D299A8BE14A28954A78D1BD25C85BB1915F3A941` | Interior full-bleed Mundo Pulso / `CoverIntroScreen` | Asset aprobado; pantalla pendiente de revisión |
| III    | `portals/portal_3/interior/cover_portal_world3_notebook_interior_v01.webp`                              | WEBP RGB / 1024×1872  | `D2298B810E358474B75FE3DF60FF92B0ECE15A2B7B06C85BDAF2AAF8CBDD6659` | Interior full-bleed Cuaderno / `CoverIntroScreen`    | Asset aprobado; pantalla pendiente de revisión |
| IV     | `portals/portal_4/interior/cover_portal_world4_system_interior_v01.webp`                                | WEBP RGB / 1024×1872  | `96A961322FE58371C60B078DF03A11B240F6672929359AFED539BF485E1CE939` | Interior full-bleed Sistema / `CoverIntroScreen`     | Asset aprobado; pantalla pendiente de revisión |
| V      | `portals/portal_5/interior/cover_portal_world5_map_interior_v01.webp`                                   | WEBP RGBA / 1024×1872 | `CC95E888B472D8E14295F8B9623144262F699D7583D5A2B1062085CDD5019563` | Interior full-bleed Mapa / `CoverIntroScreen`        | Asset aprobado; pantalla pendiente de revisión |

Las cinco fuentes nativas y los cinco masters PNG 2048×3744 se conservan fuera
de despliegue en `docs/assets/cover-intro/production-sources/portal_1..5/` con
los hashes exactos del manifiesto aprobado. Los cinco WebP runtime suman
707.514 bytes.

## Estación III — 15 pares aprobados

Estado de cierre: `APROBADO`. La ruta de la primera columna es relativa a las dos
bases indicadas arriba; por tanto, cada fila representa exactamente un archivo
runtime y su espejo `current-used`. La comparación SHA-256 confirma identidad
byte a byte para los 15 pares.

| Ruta relativa en ambas bases                              | Formato / dimensiones | SHA-256                                                            | Función / consumidor runtime                                                                | Estado   |
| --------------------------------------------------------- | --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | -------- |
| `environment/world3_ambient_texture_v01.webp`             | WEBP / 1536×1536      | `98BA450CB7B8A753A288C438011238ECD94973CA652DCC39500F5E9CF3C9CBB2` | Textura ambiental recortable; `World3RootScreen.tsx`                                        | Aprobado |
| `index/world3_index_notebook_marks_sheet_v01.png`         | PNG / 1024×512        | `5B3D1E3631DA7454F765D7524A7479272A59E45B15109A895CBA8B5C4E3ED358` | Hoja de marcas progresivas del índice; `World3IndexNotebookMarks.tsx`                       | Aprobado |
| `lia/lia_world3_closure_v01.png`                          | PNG / 1024×1024       | `C82EF8E9334FA5BF5359FFC4303A7D60514B29AE6785D37FADC0613812DF2AFB` | Pose de cierre y salida; `World3LiaActor.tsx` / `World3RootScreen.tsx`                      | Aprobado |
| `lia/lia_world3_confirming_v01.png`                       | PNG / 1024×1024       | `A34D643E4CE517FCD6C09F1AB6C50F0930496FEF1A8D9F7A55A6AEA12AFC0881` | Pose de confirmación, retorno y desbloqueo; `World3LiaActor.tsx` / `World3RootScreen.tsx`   | Aprobado |
| `lia/lia_world3_idle_v01.png`                             | PNG / 1024×1024       | `0FC7473633449418A3479457B4A4F237C6F5F64E87F631674DBA94BF535EE37D` | Pose de reposo en el índice; `World3LiaActor.tsx` / `World3RootScreen.tsx`                  | Aprobado |
| `lia/lia_world3_observing_v01.png`                        | PNG / 1024×1024       | `196E1BD67D7EFB44675F2774E1EDF2524C9E9C18DC2968ED6D9A9689EEE9A5D2` | Pose de observación en registros; `World3LiaActor.tsx` / `World3RootScreen.tsx`             | Aprobado |
| `lia/lia_world3_pointing_v01.png`                         | PNG / 1024×1024       | `51780FAF17A5AB2566D0264698F61115BE1D01745D73BEB52D4F6D10397952CA` | Pose de orientación, ensamblaje e inspección; `World3LiaActor.tsx` / `World3RootScreen.tsx` | Aprobado |
| `notebook/world3_notebook_open_base_v01.png`              | PNG / 1536×1024       | `3ABF81F4772302CB7A38B9C428C104951E35D087FF1F5989C55468DDEC31D0F3` | Base visual del cuaderno abierto; `World3RootScreen.tsx`                                    | Aprobado |
| `notebook/world3_notebook_turn_page_v01.png`              | PNG / 1024×1024       | `93799B95189251EC6EE5DB833C14561B0F444DB14382CF3E0382CEB9B447408D` | Hoja real para apertura y retorno; `World3PageTurnLayer.tsx` / `World3RootScreen.tsx`       | Aprobado |
| `plant/world3_plant_notebook_marks_sheet_v01.png`         | PNG / 1024×512        | `CA146B3615C8377B44EB34080114E862C0D47B31DB64812C2EC7B1E8A5CF3F6A` | Hoja de marcas del registro Planta; `PlantNotebookAnnotations.tsx`                          | Aprobado |
| `prototype/world3_prototype_notebook_marks_sheet_v01.png` | PNG / 1024×512        | `76052C3563F4754F4B5B993D448D4354C468933E07C45A5389FDFA43F1905907` | Hoja de marcas del registro Prototipo; `PrototypeNotebookAnnotations.tsx`                   | Aprobado |
| `records/world3_record_plant_v01.png`                     | PNG / 1024×1024       | `912236E758425A5056A542D4F8EDE7A71CE5A4952222B54AA1F716513F680E0C` | Figura de Planta en índice y detalle; `World3RootScreen.tsx`                                | Aprobado |
| `records/world3_record_prototype_v01.png`                 | PNG / 1024×1024       | `9D4F4280E3395CC4AD5B890CC5032D818BA63607DCD5A0919DBF3AB2759B7783` | Figura de Prototipo en índice y detalle; `World3RootScreen.tsx`                             | Aprobado |
| `records/world3_record_signal_device_v01.png`             | PNG / 1024×768        | `753E27F49AFD5187A8EF4A0FCB9FB5576B3E49AF049FB9FF8EA7045B41469EDA` | Dispositivo de Señal en índice y traza; `SignalTraceDisplay.tsx` / `World3RootScreen.tsx`   | Aprobado |
| `signal/world3_signal_notebook_marks_sheet_v01.png`       | PNG / 1024×512        | `B8E77D292BB787C684C5CEDC5DD75822F36D9DB24561C54EAA8574F52B10326C` | Hoja de marcas del registro Señal; `SignalNotebookAnnotations.tsx`                          | Aprobado |

Las cuatro hojas de marcas son sprites de 4 columnas por 2 filas, con celdas de
256×256. Texto, controles, estados, checks, traza y narrativa permanecen
semánticos en DOM o son dibujo procedural; los PNG no contienen la interfaz
operable.

## Estación II

Los assets fuente de Estación II viven en
`public/assets/gvo/stations/world-2/pulse-invisible/runtime/`; sus espejos
revisados viven en `public/assets/gvo/current-used/world-2-root/`. El registro
ejecutable es `src/screens/World2Root/world2RuntimeAssets.ts` y la propiedad
semántica está en `world2SemanticAssetManifest.ts`.

Grupos de Estación II:

- Atmósfera y fondo.
- Planta y contacto bioeléctrico.
- Señal y proyecciones de onda.
- Secuencias de captura y acondicionamiento.
- Diálogos, efectos de Lía y microescenas.
- Navegación de capas y assets de ruta/resultado.

## Estación IV — cierre integral 018E

Estado: `CERRADA 018E / HUMAN_APPROVED / 20 PARES VERIFICADOS / PWA INSTALADA
NO CERTIFICADA`. Estación IV conserva 20 assets canónicos bajo:

```text
public/assets/gvo/stations/world-4/system-table/runtime/
```

Sus 20 espejos byte-idénticos viven en:

```text
public/assets/gvo/current-used/world-4-root/
```

El registro ejecutable es `src/screens/World4Root/world4RuntimeAssets.ts`; los
hashes, `alpha_bbox`, tamaños baseline, slices y responsabilidades semánticas se
mantienen en `world4AssetManifest.ts`. El inventario por ruta, dimensiones,
SHA-256, función, consumidor y estado está en
`public/assets/gvo/current-used/world-4-root/README.md`.

La prueba visual de capas R1 determinó que z1 no produce las protuberancias
laterales y permanece en el escenario. z5 sí produce exactamente esas dos
formas: se preserva byte-idéntica en runtime, manifest y `current-used`, pero no
se emite como elemento visual. La decisión queda expuesta en DOM como
`front-edge-disabled-by-human-review`.

El cierre 018E registra la aprobación humana de la composición, el layout y la
coreografía. Esa versión se entregó sin audio y con movimiento reducido
completo. La certificación de la PWA instalada quedó pendiente. La política
vigente para nuevas entregas está en las [reglas de GVO](../01_REGLAS_NO_NEGOCIABLES.md).

| Grupo            | Cantidad | Rutas relativas                                                                                                                                                                                                                                                                                                          |
| ---------------- | -------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Entorno          |        3 | `environment/world4_environment_base_v01.webp`, `environment/world4_rear_depth_plane_v01.png`, `environment/world4_haze_overlay_v01.png`                                                                                                                                                                                 |
| Mesa             |        4 | `table/world4_table_contact_shadow_v01.png`, `table/world4_table_lower_base_v01.png`, `table/world4_table_front_edge_v01.png`, `table/world4_table_top_v01.png`                                                                                                                                                          |
| Ruta             |        1 | `route/world4_system_route_base_v01.png`                                                                                                                                                                                                                                                                                 |
| Sistema de nodos |        2 | `nodes/world4_node_state_halo_sheet_v01.png`, `nodes/world4_node_pedestal_v01.png`                                                                                                                                                                                                                                       |
| Objetos          |        8 | `objects/world4_node_plant_v01.png`, `objects/world4_node_bionosifier_v01.png`, `objects/world4_node_esp32_v01.png`, `objects/world4_node_midi_v01.png`, `objects/world4_node_wifi_udp_v01.png`, `objects/world4_node_router_v01.png`, `objects/world4_node_central_system_v01.png`, `objects/world4_node_sound_v01.png` |
| UI               |        2 | `ui/world4_text_card_backplate_v01.png`, `ui/world4_open_world5_button_backplate_v01.png`                                                                                                                                                                                                                                |

La pantalla conserva las poses compartidas de Lía `explain_calm` y `greeting`;
sus copias aprobadas siguen registradas en `current-used/cover-intro`. No se
duplicaron ni alteraron. El archivo rechazado
`world4_node_top_object_master_v01.png` no está integrado.

## Pantallas posteriores

## Estación V — cuatro áreas y cierre publicados

Estado vigente: `ST5_020G_HUMAN_APPROVED`, `ST5_020H_HUMAN_APPROVED` y
`ST5_020I_PUBLISHED_COMPLETE`. Estación V queda cerrada para el alcance actual.

- Runtime: `public/assets/gvo/stations/world-5/present-map/runtime/`.
- Espejo byte-idéntico: `public/assets/gvo/current-used/world-5-root/`.
- Registro ejecutable: `src/screens/World5Root/world5RuntimeAssets.ts`.
- Inventario completo: `public/assets/gvo/stations/world-5/present-map/runtime/manifest.json`.
- Veinticuatro assets: once WEBP de mapa/Plantas, tres WEBP de Sistema, tres WEBP
  de Espacio, tres WEBP de Visitante y cuatro poses aprobadas de Lía (dos PNG y dos WEBP).
- Mapa crítico: 1.290.122 bytes; Plantas: 428.412 bytes; Sistema: 328.882
  bytes; Espacio: 324.550 bytes; Visitante: 398.238 bytes; Lía: 1.686.309 bytes.
- Las cuatro áreas Plantas, Sistema, Espacio y Visitante están integradas; el
  progreso local alcanza y restaura el cierre interno 4/4.
- El CTA `Ir al cierre`, la completion global verificada y la salida W5→Final
  fueron aprobados humanamente y publicados por 020H/020I.
- Los 24 archivos runtime y los 24 mirrors `current-used` permanecen
  byte-idénticos. La presencia del mirror documenta el par, pero no sustituye la
  aprobación funcional registrada por las actas.

El arte procedural anterior dejó de ser la capa principal. Labels, estados,
nexo, vínculos, foco, controles y pulso siguen siendo DOM/SVG/CSS accesible.

La presencia de una carpeta en `current-used` no prueba aprobación funcional de
una estación. Estación IV sí quedó cerrada y `HUMAN_APPROVED` por autorización
expresa en 018E, no por la sola existencia de `world-4-root/`. La instalación y
el relanzamiento como PWA permanecen no certificados.

Los assets sin referencia runtime solo pueden permanecer como fuentes
documentadas. Las capturas generadas para QA no pertenecen en `public/`.

## Pantalla Final — Mirador / Gates 5–8 completos

Estado: `GVO FINAL — MIRADOR PHASE / COMPLETE`; runtime
`HUMAN_APPROVED / INTEGRATED / PUBLISHED`.

- Runtime canónico: `public/assets/gvo/stations/final-root/`.
- Espejo byte-idéntico: `public/assets/gvo/current-used/final-root/`.
- Registry tipado consumido por `FinalRoot` y `FinalLiaMotion`:
  `src/shared/assets/finalRootAssets.ts`.
- Fuentes de producción no-runtime:
  `docs/assets/final-root/production-sources/lia/`.
- Paquete aprobado SHA-256:
  `4E2AB2A95437411EC9519AF77D46BCFAD3E44B5B88F2A2B17EDC83402348644F`.

| ID                        | Ruta relativa común                                       | Formato / dimensiones | SHA-256                                                            | Función / consumidor                            | Estado                                |
| ------------------------- | --------------------------------------------------------- | --------------------- | ------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------- |
| `FINAL-ENV-P-001`         | `environment/final_environment_portrait_v01.webp`         | WEBP RGBA / 1440×2560 | `1E8B599BE197EE26E346B1B1974CAA571DE42AF4B8587758C801C914C04C1347` | Entorno portrait / `FinalRoot`                  | Human approved, integrado y publicado |
| `FINAL-ENV-L-001`         | `environment/final_environment_landscape_v01.webp`        | WEBP RGB / 2560×1440  | `EDB75703A398724B9084D800CF21B888D72B6028C4199DC1D7A2C5F5CC0D1D84` | Entorno landscape / `FinalRoot`                 | Human approved, integrado y publicado |
| `FINAL-DEPTH-P-001`       | `environment/final_valley_depth_portrait_v01.webp`        | WEBP RGBA / 1440×2560 | `F64326254C5215CB44E0F9D93134B425E8806EA41E27556A4BBC40EA36D71E99` | Profundidad del valle portrait / `FinalRoot`    | Human approved, integrado y publicado |
| `FINAL-DEPTH-L-001`       | `environment/final_valley_depth_landscape_v01.webp`       | WEBP RGBA / 2560×1440 | `FA9999A33EA636F57FA901D8C06B4FF9694A27F66704DAE7968B9E2DC45EC42B` | Profundidad del valle landscape / `FinalRoot`   | Human approved, integrado y publicado |
| `FINAL-MIRADOR-P-001`     | `environment/final_mirador_foreground_portrait_v01.webp`  | WEBP RGBA / 1440×1280 | `19290CF1995A8FAB2B643BEBC88126D3BA6E67A516A43877E1AA79A16E11427D` | Foreground del Mirador portrait / `FinalRoot`   | Human approved, integrado y publicado |
| `FINAL-MIRADOR-L-001`     | `environment/final_mirador_foreground_landscape_v01.webp` | WEBP RGBA / 2560×900  | `455EDBA68398FBB8BC1A508C42D0EB1BC7D2B6AFC236BF5F8928C2356FD60544` | Foreground del Mirador landscape / `FinalRoot`  | Human approved, integrado y publicado |
| `FINAL-ACCESS-I-001`      | `access/final_access_world1_root_v01.webp`                | WEBP RGBA / 1024×1024 | `F1BE36246795D8A89241AA708D8E8ECE29FA5C98F3F0DCCAF5C2BD5F8F1BF046` | Acceso visual Mundo I / `FinalRoot`             | Human approved, integrado y publicado |
| `FINAL-ACCESS-II-001`     | `access/final_access_world2_pulse_v01.webp`               | WEBP RGBA / 1024×1024 | `6EE6B093DEE9ABBEA96FDA66C6C80DB3601CDF588A34FD062D0F844466EDD7B6` | Acceso visual Mundo II / `FinalRoot`            | Human approved, integrado y publicado |
| `FINAL-ACCESS-III-001`    | `access/final_access_world3_notebook_v01.webp`            | WEBP RGBA / 1024×1024 | `2EFAB6C3CA5430D7BA1F0113AA4E19A4B99CE6D4AF5C3212371AC86314039CD3` | Acceso visual Mundo III / `FinalRoot`           | Human approved, integrado y publicado |
| `FINAL-ACCESS-IV-001`     | `access/final_access_world4_system_v01.webp`              | WEBP RGBA / 1024×1024 | `5472BDCA276DBD851D0C3C7C48A96038A5D7544AA13EF4A51BE7BC4DCC2E2B9D` | Acceso visual Mundo IV / `FinalRoot`            | Human approved, integrado y publicado |
| `FINAL-ACCESS-V-001`      | `access/final_access_world5_map_v01.webp`                 | WEBP RGBA / 1024×1024 | `A034AA6940E2043870FF3EE0B6C833DF4F3C3F15CFD386C846DB78AA1CBFC07F` | Acceso visual Mundo V / `FinalRoot`             | Human approved, integrado y publicado |
| `FINAL-LABEL-001`         | `access/final_access_label_backplate_v01.png`             | PNG RGBA / 1024×256   | `36257FEC3E1E69D58A9F5E7CA2543F983D309776E45F757D1A81A7CAECFA3698` | Materialidad de labels DOM / `FinalRoot`        | Human approved, integrado y publicado |
| `FINAL-PLATE-TITLE-001`   | `ui/final_title_backplate_v01.png`                        | PNG RGBA / 1536×512   | `898949FFAA35E66507A3AA799BFE32AEC36FA4D3B73B54E58FC1E1A2715C360D` | Backplate de título DOM / `FinalRoot`           | Human approved, integrado y publicado |
| `FINAL-PLATE-CREDITS-001` | `ui/final_credits_backplate_v01.png`                      | PNG RGBA / 1536×384   | `45C6FD147A04FF9F8FF5A249EDBC2FCE16EA07FE843A9082B2E011ABC75FFFB1` | Backplate de créditos DOM / `FinalRoot`         | Human approved, integrado y publicado |
| `FINAL-PLATE-ACTION-001`  | `ui/final_action_backplate_v01.png`                       | PNG RGBA / 1024×256   | `C771BA00ACD157962EA1C1BD54FC54758BB6D7306F99C9C0616B5BDCEF211B81` | Backplate de acciones DOM / `FinalRoot`         | Human approved, integrado y publicado |
| `FINAL-PLATE-DIALOG-001`  | `ui/final_restart_dialog_backplate_v01.png`               | PNG RGBA / 1536×1024  | `2E81A8CE8C4DFB17E519BC3AE8513367D0C45418A312DC863C9238186FDAB32C` | Materialidad del diálogo / `FinalRoot`          | Human approved, integrado y publicado |
| `FINAL-LIA-IDLE-001`      | `lia/final_lia_idle_contemplative_6f_v01.webp`            | WEBP RGBA / 1536×256  | `D3171A70C467EFCDA6D1FBB553FA2BEC5D3CFF0DE1A3B00306F5FF121F18CCDE` | Secuencia idle contemplativa / `FinalLiaMotion` | Human approved, integrado y publicado |
| `FINAL-LIA-GREETING-001`  | `lia/final_lia_greeting_4f_v01.webp`                      | WEBP RGBA / 1024×256  | `80F30DB75C3ABD1A795F8519EF75218B27981DBCE4F1ADAB4DD6941741CD22DD` | Secuencia de saludo / `FinalLiaMotion`          | Human approved, integrado y publicado |
| `FINAL-LIA-SHADOW-001`    | `lia/final_lia_glow_shadow_v01.png`                       | PNG RGBA / 1024×512   | `BE1A7499B742B36652F3382B805A012D015C1D06581844C72EA247EC0367E375` | Glow/sombra de presencia / `FinalRoot`          | Human approved, integrado y publicado |

Las cinco fuentes `PRODUCTION_SOURCE / HUMAN_APPROVED / NOT_RUNTIME` conservan
los binarios originales y métricas aprobadas fuera de `public`. No entran en
`current-used`, imports, `dist` ni precache. El manifest completo registra
bytes, canvas, modo, alpha, `alpha_bbox`, hashes y procedencia por asset.

Gate 5 cierra producción y registro; Gate 6 composición responsive; Gate 7
motion, reduced motion y visibility handling; Gate 8 revisita, retorno y reset
real. Los 19 assets proceden del registry tipado: 18 participan en la
composición estática y el greeting completa el consumo en `FinalLiaMotion`.
`current-used/final-root` continúa como mirror byte-idéntico y nunca como ruta de
import runtime. I17, I19, I20, previews, candidatas rechazadas y derivados no
canónicos permanecen fuera de runtime, imports, `dist` y precache.

## Lía Preview — LIA-M3-01

`current-used/lia-preview/` registra el reuse canónico de Lía para la pantalla dedicada `/final/lia`. Tira WebP 1536×256, frame estático 256×256, 28306 bytes; SHA-256 `D3171A70C467EFCDA6D1FBB553FA2BEC5D3CFF0DE1A3B00306F5FF121F18CCDE`. Función: avatar guía. Consumidor: `LiaPreview`. Asset `HUMAN_APPROVED_CANONICAL_REUSE`; pantalla/copy pendientes del gate final. No cambia el original ni el Mirador con flag apagado.

## LIA-M4 CONCEPT_A

The Lía preview screen reuses four unchanged approved FinalRoot assets. The exact runtime/mirror registry is `public/assets/gvo/current-used/lia-preview/manifest.json`; generated candidates are excluded from runtime pending human selection.

## Foto con Lía en el Mirador · GVO 1.1.0

`FinalLiaPhoto` consume dos poses creadas para el recuerdo, Al hombro y Se asoma.
El JPG incorpora el grabado botánico nuevo, el logotipo y el emblema de Portada.
El registro de hashes, dimensiones, procedencia y copias runtime está en
[`current-used/final-root/photo/manifest.json`](../../public/assets/gvo/current-used/final-root/photo/manifest.json).
El detector local Pico y su modelo facial se registran con sus licencias y hashes en
[`photo/tracking/manifest.json`](../../public/assets/gvo/current-used/final-root/photo/tracking/manifest.json).

## LIA-M4-FINAL-01 approved presence

This entry supersedes the earlier candidate-only runtime status for exactly three originals. The original human review approved Greeting A, Listening A and Explaining A; LIA-M4-FINAL-01 authorizes their deterministic runtime integration. Screen acceptance remains pending. Four prior canonical assets remain; rejected poses are excluded. [Correction details](../lia/m4/FINAL_CORRECTION.md).

- `LIA-M4-GREETING-A`: source `assets-source/lia-m4/LIA-M4-GREETING-A.png` SHA256 `3C4A4C454758D3C5380ED9405C4AD534D97FCCA553281CCDBF2E56CAE939D4F3`; runtime `public/assets/gvo/lia-preview/lia/lia-m4-greeting-a.webp` / mirror `public/assets/gvo/current-used/lia-preview/lia/lia-m4-greeting-a.webp`; WebP RGBA [1254, 1254], 385836 bytes, SHA256 `82DC04328F41E959DC9C731B7EEDEEFE745EC278F538EC379B119D79AB6D2193`; consumer LiaPreview, state greeting; HUMAN_APPROVED_SOURCE_DERIVATION.
- `LIA-M4-LISTENING-A`: source `assets-source/lia-m4/LIA-M4-LISTENING-A.png` SHA256 `B08125CA85720D50EEEF8A4DDABB52645CE41D5C5C98F53CC3D266503F1DF714`; runtime `public/assets/gvo/lia-preview/lia/lia-m4-listening-a.webp` / mirror `public/assets/gvo/current-used/lia-preview/lia/lia-m4-listening-a.webp`; WebP RGBA [1254, 1254], 288932 bytes, SHA256 `7150C930446C4AF85EA5B3E1D81EC45EECC61D1C081C5D65146136166CF6C93E`; consumer LiaPreview, state listening; HUMAN_APPROVED_SOURCE_DERIVATION.
- `LIA-M4-EXPLAINING-A`: source `assets-source/lia-m4/LIA-M4-EXPLAINING-A.png` SHA256 `89297153A015937E82D2B020A159C4254100ABE10016BEE89C6AC81B41A11C6F`; runtime `public/assets/gvo/lia-preview/lia/lia-m4-explaining-a.webp` / mirror `public/assets/gvo/current-used/lia-preview/lia/lia-m4-explaining-a.webp`; WebP RGBA [1254, 1254], 473646 bytes, SHA256 `96C9AD6AFA43A66BE982434BE36FCD112B4F3DDB8BB1369C0678E744CC0C384E`; consumer LiaPreview, state explaining; HUMAN_APPROVED_SOURCE_DERIVATION.
# Candidata editorial local — 2026-10-23

La integración conserva los originales aprobados. Sala III reusa siete archivos
byte-idénticos con sus mirrors; su nuevo consumidor deja de presentar el
montaje/trazas de prototipos. Inventario inicial medido:
[`assets-production.json`](../narrative/integracion_autonoma_2026-10-23/assets-production.json).
Los tres originales fueron descargados por el navegador integrado, preservados
fuera del runtime y derivados con transparencia. La candidata espera revisión humana.
El detalle histórico de assets conservados continúa a continuación.


## Addendum de acabado — 2026-10-23 (cuatro assets)

Estado de los cuatro recursos y de su composición: **INTEGRATION_CANDIDATE / HUMAN_PENDING**.
La aprobación humana histórica de otros assets no se extiende a estos archivos.

Procedencia, originales preservados fuera de runtime, derivaciones, alpha, hashes
y pares completos están en [el manifiesto de acabado](../narrative/integracion_autonoma_2026-10-23/revision-acabado/assets-manifest.json).
Se produjeron en [el único hilo de ChatGPT Images](gvo-provenance:images).
Runtime consume las rutas canónicas y current-used conserva sus mirrors byte-idénticos.

| ID | Runtime | Espejo de revisión | Formato / dimensiones / bytes | SHA-256 de ambos | Consumidor |
| --- | --- | --- | --- | --- | --- |
| W4_PORTRAIT_SYSTEM_TABLE_v02 | `public/assets/gvo/stations/world-4/system-table/runtime/environment/world4_table_environment_portrait_v02.webp` | `public/assets/gvo/current-used/world-4-root/environment/world4_table_environment_portrait_v02.webp` | WebP RGB / 768×1024 / 48478 B | `5e863f4f084becf6a528b1e0af77318442ba5fe8941493b19affd01f51adf343` | `src/screens/World4Root/World4Stage.tsx` |
| W5_GALLERY_READING_FRAME_v02 | `public/assets/gvo/stations/world-5/present-map/runtime/ui/world5_gallery_reading_frame_v02.webp` | `public/assets/gvo/current-used/world-5-root/ui/world5_gallery_reading_frame_v02.webp` | WebP RGBA / 768×512 / 309198 B | `8ba0daf382166647fa92b4d1b8f3ab2d19b2a3b1a346df12863bfff05cd44460` | `src/screens/World5Root/World5RootScreen.css` |
| W3_NOTEBOOK_FOLIO_v02 | `public/assets/gvo/stations/world-3/notebook-pixel/runtime/notebook/world3_notebook_folio_v02.webp` | `public/assets/gvo/current-used/world-3-root/notebook/world3_notebook_folio_v02.webp` | WebP RGBA / 768×960 / 581516 B | `ee0085b3cfcf81793d530b42070c2f942a18f9289213e04eff8354903704c3a4` | `src/screens/World3Root/World3RootScreen.tsx` |
| GVO_TRANSITION_THRESHOLD_v02 | `public/assets/gvo/shared/navigation/runtime/gvo_transition_threshold_v02.webp` | `public/assets/gvo/current-used/shared/navigation/gvo_transition_threshold_v02.webp` | WebP RGBA / 192×192 / 18370 B | `8cc588240f749a2aa3e7b30c6f084055be3dce80cd54397ee96b41f4db56c17a` | `src/app/qr/InterstationQrGate.tsx` |

La mesa vertical distribuye los mismos ocho componentes DOM en dos columnas y
cuatro filas; la composición horizontal anterior se conserva en landscape. El
marco de V y el folio de III se consumen mediante nueve segmentos, manteniendo
texto, decisiones y estados como DOM. El umbral compartido se presenta a 48×48
CSS px con un símbolo QR de 18 px y etiqueta accesible en DOM: no lleva un payload
ni texto horneado en la imagen. Los tres motivos de práctica de III siguen activos
como capas independientes; los siete reusos son ambiente, turnPage y cinco poses,
mientras openBase permanece como original histórico.

Fichas por consumidor: public/assets/gvo/current-used/world-3-root/README.md,
world-4-root/README.md, world-5-root/README.md y shared/navigation/README.md.
La evidencia de navegador suplementaria de IV/V está en
[el registro de revisión](../narrative/integracion_autonoma_2026-10-23/revision-acabado/evidence-4-5/runtime-qa.json);
no sustituye el recorrido principal limpio ni certifica cámara física o aprobación humana.

## Addendum de marca OBS03 v03 — corte posterior de ensamblaje

Estado: `ART_TECHNICAL_CANDIDATE_SCENE_QA_PENDING_HUMAN_PENDING`.
Este addendum posterior actualiza sólo la marca de entrada; conserva como
historial las descripciones v01 anteriores y no altera los registros de III.

| Consumidor actual | Registro canónico | Comprobación técnica y límite |
| --- | --- | --- |
| Carga, cuatro macetas y doce regaderas | `public/assets/gvo/current-used/loading-initial/OBS03-brand-v03.json` | Atlases PNG3072×768 (370976B) y2560² (2050024B); alpha original íntegra, 0RGBA fuera de las máscaras finales, borde protegido y primeras4celdas de Lía idénticas. Contactos inspeccionados; animación/escena y aceptación humana pendientes. |
| Portada, emblema material | `public/assets/gvo/current-used/cover-intro/OBS03-brand-v03.json` | PNG RGBA116×142,44961B; SHA-256 `476cf4dbef9cc320b5144f599982c692f22bac69dbb4d5eb32487486ad52b283`; máscara auténtica58×71 y material de ChatGPT Images. Sin placa ni texto baked; encuadre proporcional, marca/títulos DOM. Escena y aceptación humana pendientes. |

Fuentes originales/piloto conservadas en `production/brand-pixel-pilot-originals/`
bajo `assets-source/editorial-2026-10-23/observaciones-03/`; generador reproducible
`tools/assets/derive_obs03_brand_assets.mjs`. Tres pares runtime/espejo coinciden.
El [registro de este corte](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/entry-transitions/brand-v03/README.md)
incluye hashes, superficies por fotograma, correcciones visuales de método y
límites de evidencia. No se contó build, E2E ni aprobación humana en ese corte.
