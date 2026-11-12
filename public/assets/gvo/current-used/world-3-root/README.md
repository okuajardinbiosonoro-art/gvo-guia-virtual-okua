# Assets utilizados — Mundo III / Estación III

## Consumidor OBS05 — ajuste local de título e índice

Estado: `IMPLEMENTATION_CANDIDATE / COMPILED_QA_PASS / R3_RECONCILED / HUMAN_PENDING`.
El contrato R1 OBS05 conserva los nueve pares activos registrados en
`OBS04-composition-reference.json`: ambiente, cuaderno original proporcional,
giro, tres motivos y tres clips. No se produce, modifica, comprime ni sustituye
ningún bitmap; tampoco cambian sus URLs, precarga o registro geométrico.

`World3Practice.css` centra el título con reservas laterales simétricas en CSS px
y permite una fila inferior de ancho completo cuando el texto ampliado o el
ancho disponible lo necesitan. Los números del índice conservan sus columnas,
padding y separadores, con fondo transparente y sin contorno decorativo propio;
los estados y el foco permanecen en la fila y su botón.
Cuando la hoja queda estrecha respecto al tamaño de letra, el texto del capítulo
ocupa una segunda fila a todo el ancho, debajo del número y motivo. Este reflujo
evita fragmentar «INTRO» en columnas de dos letras con texto ampliado; mantiene
la composición de tres columnas cuando hay espacio. No modifica el cuaderno.

El h2 aislado «conectar» deja de mostrarse en el índice, sin conservar un hueco
artificial. Su literal `TXT_3_74471ccd389d`, traducción EN y procedencia permanecen
íntegros en `world3EditorialSlots.ts` y `station3Content.ts`. Esta nueva disposición
procede de OBS05, no de una modificación retroactiva del texto del escritor.
Las siete hojas, tres pasos esenciales, confirmaciones manuales, Lía, movimiento,
QR y revisita conservan sus consumidores. La evidencia OBS04 siguiente mantiene
su identidad histórica. OBS05 build02 verifica40 perfiles compilados ES/EN,
movimiento natural/reducido y texto normal/ampliado, además del recorrido fresco.
Son perfiles finitos y no aceptación humana o certificación universal.

## Candidata de práctica vigente — 2026-10-23

`INTEGRATION_CANDIDATE / HUMAN_PENDING`

El cuaderno activo reutiliza siete originales: ambiente, hoja de paso de página
(`turnPage`) y cinco poses de Lía. Añade tres motivos de práctica y el nuevo folio
`notebook/world3_notebook_folio_v02.webp`. La base
`notebook/world3_notebook_open_base_v01.png` (`openBase`) es histórica y no es
la base activa de esta candidata.

El detalle inicial de los siete reusos y tres motivos está en
`integration-2026-10-23.json`; el cuarto recurso nuevo, el folio, está en
[`revision-acabado/assets-manifest.json`](../../../../../docs/narrative/integracion_autonoma_2026-10-23/revision-acabado/assets-manifest.json).
Los registros incluyen dimensiones, SHA-256 y pares byte-idénticos. El
triángulo contiene el símbolo extraído del PNG de marca existente, sin redibujarlo.
Los nuevos motivos, el folio y la composición esperan revisión humana. Los
assets de montaje/trazas siguientes se preservan como historia y no se consumen
en el nuevo cuaderno de práctica.

## Estado histórico de los quince originales

`APROBADO / RUNTIME / ESPEJO BYTE-IDÉNTICO`

Esta carpeta conserva el espejo de los quince originales históricos y los
cuatro recursos nuevos de la candidata. Los imports de la aplicación permanecen en:

```text
public/assets/gvo/stations/world-3/notebook-pixel/runtime/
```

Cada ruta relativa de la tabla existe tanto bajo esa base runtime como bajo
`public/assets/gvo/current-used/world-3-root/`. Los hashes SHA-256 iguales
confirman 15 pares byte-idénticos; no son duplicados accidentales.

## Inventario histórico aprobado — 15 pares

| Ruta relativa en runtime y espejo | Formato / dimensiones | SHA-256 | Función / consumidor runtime | Estado |
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

## Contrato histórico y conservación

- `world3RuntimeAssets.ts` define las URLs consumidas.
- `world3SemanticAssetManifest.ts` documenta responsabilidad visual y límites
  semánticos.
- Las hojas de marcas son sprites de 4×2 celdas de 256×256.
- Texto, narrativa, controles, estados y accesibilidad permanecen en DOM. La
  candidata actual usa un folio raster ilustrado; las hojas de marcas y trazas
  de la composición original se conservan como historia.
- El Atlas visual es referencia documental. Ningún archivo de esta carpeta es un
  mockup promovido implícitamente.
- No mover, optimizar, convertir ni modificar estas copias de forma aislada. Un
  cambio aprobado debe mantener el par runtime/espejo y actualizar sus hashes.

El inventario transversal se mantiene en
`docs/assets/ASSET_INVENTORY.md` y la regla aplicable en
`docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md`.
## Folio activo de acabado — 2026-10-23

| Nuevo par runtime / espejo | Formato / dimensiones | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `notebook/world3_notebook_folio_v02.webp` | WebP RGBA / 768×960 | 581.516 | `ee0085b3cfcf81793d530b42070c2f942a18f9289213e04eff8354903704c3a4` |

Original preservado:
`assets-source/editorial-2026-10-23/finishing/W3_NOTEBOOK_FOLIO_v02.png`.
Consumidor: `World3RootScreen.tsx` con nueve segmentos responsive. Los motivos
INTRO/PASO A PASO/BENEFICIOS permanecen como capas independientes del folio.
Las aprobaciones anteriores corresponden a los originales históricos y no se
extienden al nuevo folio ni a la composición actual.

## Composición vigente OBS04 — 2026-10-24

La candidata OBS04 conserva el bitmap original proporcional y su hoja de giro.
Distribuye los literales en siete hojas locales dentro de tres capítulos, con
navegación exterior, estados de selección y respuestas finitas. El folio v02
del apartado anterior es histórico y no se consume en esta escena. Los nueve
pares activos reutilizados y sus hashes están en `OBS04-composition-reference.json`;
los clips proceden del único hilo Images registrado. La QA compilada de doce
perfiles no constituye aprobación artística humana ni certificación física.
# Ilustraciones editoriales del 11-11-2026

El archivo [editorial-2026-11-11.json](editorial-2026-11-11.json) registra los
siete WebP de los folios de Introducción y Paso a paso, con su ruta de runtime,
espejo local, dimensiones, huella y procedencia. La base abierta y el recurso
de pasar página conservan su registro histórico y su consumidor actual.
