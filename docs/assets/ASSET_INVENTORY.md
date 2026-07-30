# Asset inventory

## Runtime policy

Los assets runtime son locales y se referencian mediante registros tipados. La
ruta que consume la aplicación y su espejo de revisión tienen responsabilidades
distintas:

- Runtime de Estación III: `public/assets/gvo/stations/world-3/notebook-pixel/runtime/`.
- Espejo canónico aprobado: `public/assets/gvo/current-used/world-3-root/`.
- Registro ejecutable: `src/screens/World3Root/world3RuntimeAssets.ts`.
- Propiedad semántica: `src/screens/World3Root/world3SemanticAssetManifest.ts`.

Los archivos byte-idénticos entre runtime y `current-used` son pares deliberados
de política, no duplicados accidentales. El Atlas visual sigue siendo referencia
documental y no sustituye ninguno de estos dos árboles.

## Estación III — 15 pares aprobados

Estado de cierre: `APROBADO`. La ruta de la primera columna es relativa a las dos
bases indicadas arriba; por tanto, cada fila representa exactamente un archivo
runtime y su espejo `current-used`. La comparación SHA-256 confirma identidad
byte a byte para los 15 pares.

| Ruta relativa en ambas bases | Formato / dimensiones | SHA-256 | Función / consumidor runtime | Estado |
| --- | --- | --- | --- | --- |
| `environment/world3_ambient_texture_v01.webp` | WEBP / 1536×1536 | `98BA450CB7B8A753A288C438011238ECD94973CA652DCC39500F5E9CF3C9CBB2` | Textura ambiental recortable; `World3RootScreen.tsx` | Aprobado |
| `index/world3_index_notebook_marks_sheet_v01.png` | PNG / 1024×512 | `5B3D1E3631DA7454F765D7524A7479272A59E45B15109A895CBA8B5C4E3ED358` | Hoja de marcas progresivas del índice; `World3IndexNotebookMarks.tsx` | Aprobado |
| `lia/lia_world3_closure_v01.png` | PNG / 1024×1024 | `C82EF8E9334FA5BF5359FFC4303A7D60514B29AE6785D37FADC0613812DF2AFB` | Pose de cierre y salida; `World3LiaActor.tsx` / `World3RootScreen.tsx` | Aprobado |
| `lia/lia_world3_confirming_v01.png` | PNG / 1024×1024 | `A34D643E4CE517FCD6C09F1AB6C50F0930496FEF1A8D9F7A55A6AEA12AFC0881` | Pose de confirmación, retorno y desbloqueo; `World3LiaActor.tsx` / `World3RootScreen.tsx` | Aprobado |
| `lia/lia_world3_idle_v01.png` | PNG / 1024×1024 | `0FC7473633449418A3479457B4A4F237C6F5F64E87F631674DBA94BF535EE37D` | Pose de reposo en el índice; `World3LiaActor.tsx` / `World3RootScreen.tsx` | Aprobado |
| `lia/lia_world3_observing_v01.png` | PNG / 1024×1024 | `196E1BD67D7EFB44675F2774E1EDF2524C9E9C18DC2968ED6D9A9689EEE9A5D2` | Pose de observación en registros; `World3LiaActor.tsx` / `World3RootScreen.tsx` | Aprobado |
| `lia/lia_world3_pointing_v01.png` | PNG / 1024×1024 | `51780FAF17A5AB2566D0264698F61115BE1D01745D73BEB52D4F6D10397952CA` | Pose de orientación, ensamblaje e inspección; `World3LiaActor.tsx` / `World3RootScreen.tsx` | Aprobado |
| `notebook/world3_notebook_open_base_v01.png` | PNG / 1536×1024 | `3ABF81F4772302CB7A38B9C428C104951E35D087FF1F5989C55468DDEC31D0F3` | Base visual del cuaderno abierto; `World3RootScreen.tsx` | Aprobado |
| `notebook/world3_notebook_turn_page_v01.png` | PNG / 1024×1024 | `93799B95189251EC6EE5DB833C14561B0F444DB14382CF3E0382CEB9B447408D` | Hoja real para apertura y retorno; `World3PageTurnLayer.tsx` / `World3RootScreen.tsx` | Aprobado |
| `plant/world3_plant_notebook_marks_sheet_v01.png` | PNG / 1024×512 | `CA146B3615C8377B44EB34080114E862C0D47B31DB64812C2EC7B1E8A5CF3F6A` | Hoja de marcas del registro Planta; `PlantNotebookAnnotations.tsx` | Aprobado |
| `prototype/world3_prototype_notebook_marks_sheet_v01.png` | PNG / 1024×512 | `76052C3563F4754F4B5B993D448D4354C468933E07C45A5389FDFA43F1905907` | Hoja de marcas del registro Prototipo; `PrototypeNotebookAnnotations.tsx` | Aprobado |
| `records/world3_record_plant_v01.png` | PNG / 1024×1024 | `912236E758425A5056A542D4F8EDE7A71CE5A4952222B54AA1F716513F680E0C` | Figura de Planta en índice y detalle; `World3RootScreen.tsx` | Aprobado |
| `records/world3_record_prototype_v01.png` | PNG / 1024×1024 | `9D4F4280E3395CC4AD5B890CC5032D818BA63607DCD5A0919DBF3AB2759B7783` | Figura de Prototipo en índice y detalle; `World3RootScreen.tsx` | Aprobado |
| `records/world3_record_signal_device_v01.png` | PNG / 1024×768 | `753E27F49AFD5187A8EF4A0FCB9FB5576B3E49AF049FB9FF8EA7045B41469EDA` | Dispositivo de Señal en índice y traza; `SignalTraceDisplay.tsx` / `World3RootScreen.tsx` | Aprobado |
| `signal/world3_signal_notebook_marks_sheet_v01.png` | PNG / 1024×512 | `B8E77D292BB787C684C5CEDC5DD75822F36D9DB24561C54EAA8574F52B10326C` | Hoja de marcas del registro Señal; `SignalNotebookAnnotations.tsx` | Aprobado |

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
coreografía. La experiencia permanece sin audio y ofrece reduced motion
completo. La PWA instalada no fue certificada en la plataforma de QA; esa
limitación no altera la aprobación visual y funcional de Estación IV.

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

## Estación V — vertical slice Plantas ST5-020A

Estado: `ST5_020A_PUBLISHED_PENDING_HUMAN_REVIEW`, no `HUMAN_APPROVED` ni estación cerrada.

- Runtime: `public/assets/gvo/stations/world-5/present-map/runtime/`.
- Espejo byte-idéntico: `public/assets/gvo/current-used/world-5-root/`.
- Registro ejecutable: `src/screens/World5Root/world5RuntimeAssets.ts`.
- Inventario completo: `public/assets/gvo/stations/world-5/present-map/runtime/manifest.json`.
- Once WEBP: ocho para mapa y tres para Plantas.
- Mapa crítico: 1.290.122 bytes; Plantas: 428.412 bytes.
- `LIA_NOT_YET_INTEGRATED_IN_020A`; no se añadió ningún bitmap.
- Sistema, Espacio, Visitante y cierre 4/4 permanecen fuera del alcance.

El arte procedural anterior dejó de ser la capa principal. Labels, estados,
nexo, vínculos, foco, controles y pulso siguen siendo DOM/SVG/CSS accesible.

La presencia de una carpeta en `current-used` no prueba aprobación funcional de
una estación. Estación IV sí quedó cerrada y `HUMAN_APPROVED` por autorización
expresa en 018E, no por la sola existencia de `world-4-root/`. La instalación y
el relanzamiento como PWA permanecen no certificados.

Los assets sin referencia runtime solo pueden permanecer como fuentes
documentadas. Las capturas generadas para QA no pertenecen en `public/`.
