# Assets runtime — world-5-root

## Candidata de revisión en iPhone · 12 de noviembre

La Sala V usa los fondos limpios de Sistema v03 como ambiente continuo de
la galería. `getWorld5GalleryEnvironment` selecciona retrato o paisaje.
`World5RootScreen.tsx` muestra una sola imagen de fondo, que permanece
durante las preguntas, el feedback y el resultado. Los dos archivos y sus
espejos conservan los hashes del [manifiesto](system/OBS03-cleanplates-manifest.json).
La precarga de la trivia prepara ese fondo y las opciones de la pregunta
actual. Los demás fondos y el marco v02 quedan registrados como antecedentes.

## OBS05 — superficie compartida y resultado de Lía

`INTEGRATION_CANDIDATE / SCENE_QA_PASS / R3_RECONCILED / HUMAN_PENDING`

La composición de `World5RootScreen.tsx` y `World5QuizExperience.css` reutiliza
los mismos bytes: ambiente de mapa en una única superficie que contiene
navegación, pregunta, dos alternativas y respuesta. El marco de lectura v02
rodea ese conjunto; no se repite como tarjeta de pregunta y tarjeta de feedback.
La ruta curva es SVG decorativo local en DOM; el reflujo estrecho usa una curva
CSS detrás de las cuatro paradas en una columna. No hay interacción ni bitmap nuevo.
Los cuatro motivos de navegación, ocho opciones v03 y cleanplates de Sistema
v03 conservan sus rutas y espejos registrados; no vuelve la caja/cable antigua.

El resultado usa la misma superficie y un único rig compartido de Lía,
registrado con 16 recursos y cinco pétalos, aumentado proporcionalmente en
flujo. El fondo del mapa no se duplica en otra escena vacía. Se conserva una orientación actual por visita
y las listas críticas existentes. No hubo generación ni derivación de assets.
La medición del contenedor no certifica el área opaca: el cierre exige comparar
la huella real en PNG de escena, cuerpo/pétalos y ausencia de colisiones.
Las regiones de lectura, navegación y alternativas reservan el borde del control
fijo también al desplazar o ampliar el texto. Las opciones y paradas se apilan
cuando el ancho relativo a la tipografía lo exige, sin reducir la fuente.

Los archivos históricos y sus estados anteriores permanecen como antecedentes;
la aceptación artística de esta composición corresponde al responsable humano
único. OBS05 build02 verifica20 perfiles visuales compilados, controles/no-premio
y recorrido fresco. Los PNG nativos de entrega se separan de los pares de
diagnóstico con animación pausada y guía oculta utilizados para medir huella.

## OBS04 — recuperación material del mapa y la galería

`INTEGRATION_CANDIDATE / SCENE_QA_PENDING / HUMAN_PENDING`

`World5RootScreen.tsx` usa el ambiente vacío del mapa como base principal y
tres sectores históricos (Plantas, Espacio, Visitante) como miniaturas de los
botones de navegación. Sistema usa la opción de parlantes `agree_v03`; el
sector antiguo de caja/cable permanece excluido. Las miniaturas son decorativas
y no pertenecen al grupo de respuestas. Las dos alternativas v03, el fondo
limpio de Sistema v03, los puntos0–4 y los guards actuales se conservan.

El artículo mantiene el orden pregunta → dos respuestas → feedback/avance.
`World5QuizExperience.css` aplica el marco de lectura a los bloques de texto,
dejando el escenario fuera del marco. `getWorld5CriticalAssetSources` prepara
sólo el mapa de la orientación actual, las cuatro miniaturas visibles, el
ambiente/par actuales, el marco y el rig compartido, con URLs deduplicadas.
No reactiva `world5MapCriticalAssetSources` ni la antigua lógica del mapa.

Registro de pares y hashes:
[`OBS04-gallery-reference.json`](OBS04-gallery-reference.json).
No se han modificado o recomprimido imágenes; todos los pares ya registrados
siguen byte-idénticos. Esta activación requiere QA de escena y revisión del
responsable humano único; no es aprobación artística nueva.

## OBS03 — fondos limpios de Sistema, candidata 2026-10-24

`INTEGRATION_CANDIDATE / SCENE_QA_PENDING / HUMAN_PENDING`

`getWorld5Environment("sistema", orientation)` consume los dos fondos v03 sin
cajas, cable ni puertos horneados. La preparación crítica incluye únicamente la
orientación actual junto al marco, Lía y las dos opciones actuales. El bundle
tipado de Sistema conserva los mismos dos fondos v03. Plantas, Espacio,
Visitante y resultado mantienen sus ambientes v01; los originales de Sistema
v01 quedan preservados como antecedentes.

| Par runtime / espejo bajo `system/` | Formato / dimensiones | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `world5_sub_system_environment_portrait_v03.webp` | WebP opaco / 1440×1920 | 1.261.922 | `e1d6d82f246215e0870449e3affd399010ffd24e046608635845aa4a7c160d08` |
| `world5_sub_system_environment_landscape_v03.webp` | WebP opaco / 1920×1080 | 752.794 | `7a2124d0db8bd573ee47960e055d40f6b41232ab2c6cc5c56fdf0d066453578b` |

Registro: [`system/OBS03-cleanplates-manifest.json`](system/OBS03-cleanplates-manifest.json).
Fuentes: `assets-source/editorial-2026-10-23/observaciones-03/production/pixel-two-system-cleanplates-originals/`.
El informe `production/SYSTEM-cleanplates-result.json` registra cero cambios
RGBA fuera de las máscaras autorizadas, alpha opaco inalterado y decodificación
lossless exacta. Estos controles de archivo no certifican la composición en
escena ni la aprobación del responsable humano único. Los dos pares suman
2.014.716 bytes; el consumidor prepara una sola orientación por visita.

## Candidata de acabado — 2026-10-23

`INTEGRATION_CANDIDATE / HUMAN_PENDING`

Los 24 originales de la tabla histórica se conservan. La candidata añade un
marco material de lectura consumido como nueve segmentos por
`World5RootScreen.css`, identificado también en `World5EditorialPanel.tsx`.
Las preguntas, puntos reales de 0 a 4, feedback y la única salida contextual
permanecen en DOM. Las respuestas son los objetos y zonas del escenario con
botones nativos, nombres accesibles y foco visible; el marco no contiene texto
ni respuestas horneadas.

| Nuevo par runtime / espejo | Formato / dimensiones | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `ui/world5_gallery_reading_frame_v02.webp` | WebP RGBA / 768×512 | 309.198 | `8ba0daf382166647fa92b4d1b8f3ab2d19b2a3b1a346df12863bfff05cd44460` |

Runtime: `public/assets/gvo/stations/world-5/present-map/runtime/`.
Espejo: esta carpeta. Original:
`assets-source/editorial-2026-10-23/finishing/W5_GALLERY_READING_FRAME_v02.png`.
La transparencia se verifica sobre el alpha y en navegador; el RGB de un píxel
con alpha cero no representa un fondo visible. El registro vigente es
[`revision-acabado/assets-manifest.json`](../../../../../docs/narrative/integracion_autonoma_2026-10-23/revision-acabado/assets-manifest.json).
La aprobación humana de esta composición y del asset nuevo queda pendiente.

## Historial de los originales

Estado de entrada: `ST5_020F_HUMAN_APPROVED`.
Estado publicado: `ST5_020G_PUBLISHED_PENDING_HUMAN_REVIEW`.

Los veinticuatro assets integrados en `public/assets/gvo/stations/world-5/present-map/runtime/`
tienen aquí una copia byte-idéntica para revisión. El runtime importa únicamente
la ruta `stations/world-5/present-map/runtime`; esta carpeta no es fuente de imports.

| ID | Archivo | Dimensiones | Alpha | Bytes | SHA-256 |
|---|---|---:|:---:|---:|---|
| MAP-01 | `world5_map_environment_portrait_v01.webp` | 1440×2560 | no | 87.632 | `4EA310071C8D7D6CAEBAFBF2D245DF20F8F36603D0BF61E62EBCAD5FCD3546A0` |
| MAP-02 | `world5_map_environment_landscape_v01.webp` | 2560×1440 | no | 56.796 | `7EB9261B1ED1CE01B6ABAE302FA020A99DBFE2B5BA0F30A493E665F6753D938C` |
| MAP-03 | `world5_map_rim_portrait_v01.webp` | 1440×2560 | sí | 86.014 | `39DB9B7A016E8839F3788FD505A51F3C33127E51AAACC3AEFE134F194C6CAF7C` |
| MAP-04 | `world5_map_rim_landscape_v01.webp` | 2560×1440 | sí | 357.670 | `EB838E7F7E2ED0DF6561AE2A13AD4BD26209F313DAFCA0CAD51B78D48D5B95B2` |
| MAP-05 | `world5_map_sector_plants_v01.webp` | 1536×1536 | sí | 303.502 | `6694571EF217B853C8A76E027F99988133315538E7A286721210BDD4D0E0A530` |
| MAP-06 | `world5_map_sector_system_v01.webp` | 1536×1536 | sí | 115.746 | `B1534F1E43D248A30283E0FA3A94C383F9012B1F146B329EB6F446F743805C20` |
| MAP-07 | `world5_map_sector_space_v01.webp` | 1536×1536 | sí | 145.786 | `5774B6A8E6BF6E4E1A14F7F97D57B42FA5928A4DD24DA165A5E9BEC2809A6145` |
| MAP-08 | `world5_map_sector_visitor_v01.webp` | 1536×1536 | sí | 136.976 | `D596549E9C5550A70DF7E0615790157705E14766EBCA9590A4E5934F561D4533` |
| SUB-PLANTS-BG-PORTRAIT | `world5_sub_plants_environment_portrait_v01.webp` | 1440×1920 | no | 158.160 | `400279CBD5A569DB261277D14A1730AA0F7B0A4410BF56C8683DC1CA62FC1612` |
| SUB-PLANTS-BG-LANDSCAPE | `world5_sub_plants_environment_landscape_v01.webp` | 1920×1080 | no | 115.856 | `27FBB61F3C6817990F4C049DB3879879226AC2A51291D4F93F1E11A6ADB9CB26` |
| SUB-PLANTS-FOCUS | `world5_sub_plants_focus_v01.webp` | 1536×1536 | sí | 154.396 | `3A3FC7759B7F51B6EAF5646F488F401C15F68C3A8540D9EF84A35862FFEEC8BE` |
| SUB-SYSTEM-BG-PORTRAIT | `system/world5_sub_system_environment_portrait_v01.webp` | 1440×1920 | no | 91.210 | `F9C5978400F3DEB37E027CDBC9AEB0D6754E6FA04441BE641F83561496326BCB` |
| SUB-SYSTEM-BG-LANDSCAPE | `system/world5_sub_system_environment_landscape_v01.webp` | 1920×1080 | no | 51.930 | `9AF9FEF48649CBFCD650513EB5F7662FEDC584079800616F7E6C4AB652C231D3` |
| SUB-SYSTEM-FOCUS | `system/world5_sub_system_focus_v01.webp` | 1536×1536 | sí | 185.742 | `680392B58B8A6C9B13C5AA36783FF481303B31712F3646471DCC4375AE3390B2` |
| LIA-EXPLAIN-CALM | `lia/lia_pose_explain_calm_v1.png` | 1086×1448 | sí | 727.614 | `17020FCDCE68624DB85FF173869D693D77A009E408859E323FC238D2F90B7064` |
| LIA-GREETING | `lia/lia_pose_greeting_v1.png` | 1086×1448 | sí | 702.541 | `7A25A54FBC96852D0C5E26B4DE1FD470AE708ECCDEF7EF7352D37806E89C0AD5` |
| LIA-LEAD-FORWARD | `lia/lia_world5_lead_forward_v01.webp` | 1536×1536 | sí | 120.244 | `58696A77F16BDE395FB093771790377F3B44FC788FF9D1B661080E92806A009E` |
| LIA-ATTEND-NEUTRAL | `lia/lia_world5_attend_neutral_v01.webp` | 1536×1536 | sí | 135.910 | `BFD5C5E3EB4DE9B9A908C6DAA7730EA9005AF912ABB58CE735C81DDCAA451316` |
| SUB-SPACE-BG-PORTRAIT | `space/world5_sub_space_environment_portrait_v01.webp` | 1440×1920 | no | 109.230 | `2D5CF7921187A67A7AEA092D7DCB84C9B4435620168187DBBB6E928A4D6F48B3` |
| SUB-SPACE-BG-LANDSCAPE | `space/world5_sub_space_environment_landscape_v01.webp` | 1920×1080 | no | 73.372 | `53D57B96D5BC0ED13694361892A11CB8568E7C4DA61D95BEE1A6A44EF0EE7BD8` |
| SUB-SPACE-FOCUS | `space/world5_sub_space_focus_v01.webp` | 1536×1536 | sí | 141.948 | `FDD48FBC8E9F439E9D51C21C2BB3CB7406423DDCBB50AA0A3A218EA6DEB71F66` |
| SUB-VISITOR-BG-PORTRAIT | `visitor/world5_sub_visitor_environment_portrait_v01.webp` | 1440×1920 | no | 166.804 | `0434D75215C7F93A0F5C1DC37AEFDFAAD9A0FB7DFA1FB1F7DC51D4FB627CE6E7` |
| SUB-VISITOR-BG-LANDSCAPE | `visitor/world5_sub_visitor_environment_landscape_v01.webp` | 1920×1080 | no | 98.454 | `A7EC3EEB48E30003AA2E2D8817D2E7508621EBDC73648A4C632C69C6D017C3BE` |
| SUB-VISITOR-FOCUS | `visitor/world5_sub_visitor_focus_v01.webp` | 1536×1536 | sí | 132.980 | `8F0C0F3A424453081484D2B97961E4ED53375FEB931E9A5ECCE431C768B998D4` |

Presupuestos: mapa crítico 1.290.122 bytes; Plantas 428.412 bytes; Sistema
328.882 bytes; Espacio 324.550 bytes; Visitante 398.238 bytes; Lía 1.686.309 bytes. No se integró
`SUB-PLANTS-FG-01`.
Runtime consume únicamente las rutas canónicas; `current-used` no es fuente de
imports. Las cuatro poses de Lía permanecen sin mirror CSS, recomprensión ni
deformación.
