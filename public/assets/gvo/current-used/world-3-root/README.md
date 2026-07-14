# Assets utilizados — Mundo III / Estación III

## Estado

`APROBADO / RUNTIME / ESPEJO BYTE-IDÉNTICO`

Esta carpeta es el espejo canónico de revisión de los assets consumidos por
`src/screens/World3Root/`. Los imports de la aplicación permanecen en:

```text
public/assets/gvo/stations/world-3/notebook-pixel/runtime/
```

Cada ruta relativa de la tabla existe tanto bajo esa base runtime como bajo
`public/assets/gvo/current-used/world-3-root/`. Los hashes SHA-256 iguales
confirman 15 pares byte-idénticos; no son duplicados accidentales.

## Inventario aprobado — 15 pares

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

## Contrato de uso

- `world3RuntimeAssets.ts` define las URLs consumidas.
- `world3SemanticAssetManifest.ts` documenta responsabilidad visual y límites
  semánticos.
- Las hojas de marcas son sprites de 4×2 celdas de 256×256.
- Texto, narrativa, controles, estados y accesibilidad permanecen en DOM; onda,
  checks, sello, marco y partículas son procedurales.
- El Atlas visual es referencia documental. Ningún archivo de esta carpeta es un
  mockup promovido implícitamente.
- No mover, optimizar, convertir ni modificar estas copias de forma aislada. Un
  cambio aprobado debe mantener el par runtime/espejo y actualizar sus hashes.

El inventario transversal se mantiene en
`docs/assets/ASSET_INVENTORY.md` y la regla aplicable en
`docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md`.
