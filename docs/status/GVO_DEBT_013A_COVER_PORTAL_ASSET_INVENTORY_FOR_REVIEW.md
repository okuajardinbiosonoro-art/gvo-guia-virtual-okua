# GVO_DEBT_013A — Cover Portal Visual Asset Inventory and Generation Preparation

Estado: `PENDING_HUMAN_REVIEW`

Fecha técnica: 2026-08-16

## Resultado

`GVO_DEBT_013A_IMPLEMENTATION_COMPLETE_FOR_REVIEW`

Se auditó el material disponible para producir arte específico de Portada para
los Portales I–V. Este ticket no genera, convierte, copia ni integra imágenes.

La conclusión técnica es que cada portal necesita una viñeta interior vertical
propia, con transparencia real y separada de frame, glow, lock, números romanos
y estados DOM/CSS. Los cinco accesos cuadrados del Mirador son referencias de
identidad y escala, no arte final reutilizable para Portada.

## Baseline y worktree

| Campo | Valor |
| --- | --- |
| Rama | `main` |
| Baseline obligatorio | `458c788843a3eb12beaee844ac407bae166f7c50` |
| HEAD | `458c788843a3eb12beaee844ac407bae166f7c50` |
| `origin/main` | `458c788843a3eb12beaee844ac407bae166f7c50` |
| Divergencia | `0 ahead / 0 behind` |
| Worktree de entrada | DEBT_013 integrado localmente y pendiente de revisión humana |

El manifest de Portada en HEAD sigue en `v1` y declara
`portalInteriorsDeferred: true`. El worktree heredado de DEBT_013 contiene su
versión `v2`, cinco `stationRepresentations` del Mirador y
`portalInteriorsDeferred: false`. DEBT_013A no modifica ninguna de esas dos
realidades: solo documenta el reemplazo visual requerido por la revisión
humana.

Sin stage, commit, push ni PR.

## Fuentes auditadas

- `src/screens/Cover/CoverIntroScreen.tsx` y su CSS: consumidor actual, capas y
  geometría efectiva de los cinco portales.
- `src/screens/Cover/coverIntroAssets.ts`: registry runtime de fondo, Lía,
  frames, glow y lock.
- `src/screens/FinalRoot/`, `src/shared/assets/finalRootAssets.ts` y
  `public/assets/gvo/stations/final-root/manifest.json`: consumidores y
  metadatos de Mirador.
- `public/assets/runtime/cover-intro/` y
  `public/assets/gvo/current-used/cover-intro/`: runtime y espejo de Portada.
- `public/assets/gvo/stations/final-root/` y
  `public/assets/gvo/current-used/final-root/`: runtime y espejo de Mirador.
- `public/assets/gvo/stations/world-*` y
  `public/assets/gvo/current-used/world-*-root/`: identidad visual aprobada de
  cada Mundo.
- `docs/assets/ASSET_INVENTORY.md`, manifests y README por pantalla.
- `docs/narrative/visual_refs/`: referencias narrativas; son art direction, no
  assets runtime ni autorización de copia.
- Briefs `FINAL-ACCESS-I–V-001`: antecedente de selección de referencias para
  los accesos del Mirador.

Se verificaron `24/24` pares runtime/`current-used` byte-idénticos dentro del
set binario recomendado. Los cinco manifests de acceso aún conservan el texto
histórico `NOT_YET_COMPOSED` del corte 021I; el README y el inventario vigentes
registran que 021P los publicó en Mirador. Esta diferencia documental no cambia
sus hashes ni autoriza reutilizarlos como arte final de Portada.

## Inventario común de Portada y Mirador

`Alpha: sí` significa canal alpha real según el formato decodificado. Las
referencias narrativas opacas se mantienen como documentos de dirección.

| ID | Ruta / nombre | Formato y dimensiones | Alpha | Uso actual / estado | SHA-256 |
| --- | --- | --- | :---: | --- | --- |
| `COV-REF` | `docs/narrative/visual_refs/01_portada_archivo_vivo.png` | PNG RGB / 941×1672 | no | Referencia narrativa de Portada; no runtime | `58F1874005DD5181512B625FD565C4F2784DC2F344E228A7FBC64BC9B588C341` |
| `MIR-REF` | `docs/narrative/visual_refs/08_pantalla_final_mirador.png` | PNG RGB / 941×1672 | no | Referencia narrativa de Mirador; no runtime | `01A3CFC3B1B0398E688A7E609E1833A9663A3956D4F13AE88808DA7B2FA8DB93` |
| `COV-BG` | `public/assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png` | PNG RGBA / 941×1672 | sí | Fondo de `CoverIntroScreen`; también registrado para `/inicio` | `D1AB1AD83C48883CF725E6FCB9AA34778AF8660CE15277B6A58F3231098E13C8` |
| `COV-LIA` | `public/assets/runtime/cover-intro/lia/reference/lia_master_cover_reference_v1.png` | PNG RGBA / 941×1672 | sí | Referencia maestra de Lía en el paquete de Portada | `3387E924A280EDA332744B5F458DCD01468D8C35D33BEDAF1846D29BF5C2E144` |
| `COV-FRAME-A` | `public/assets/runtime/cover-intro/portals/portal_1/frame/portal_1_frame_enabled_v1.png` | PNG RGBA / 941×1672 | sí | Frame disponible de Portal I | `B35D8DAD04F2C92915714A1E979095C726841AF79F5CE639317DC8317FE1E2D2` |
| `COV-GLOW-A` | `public/assets/runtime/cover-intro/portals/portal_1/glow/portal_1_glow_enabled_v1.png` | PNG RGBA / 941×1672 | sí | Glow de disponibilidad/activación; capa independiente | `6FE773E9F2F0AF44BA21BED4159A71812904474DAF084C848F7568503B6575D8` |
| `COV-FRAME-L` | `public/assets/runtime/cover-intro/portals/shared/frame/portal_locked_frame_base_v1.png` | PNG RGBA / 941×1672 | sí | Frame compartido de Portales II–V bloqueados | `6D4706A520B1E5130CDE314EE27081EF03F6ACF54A2CA0C14ABA8AA1E40765AA` |
| `COV-LOCK` | `public/assets/runtime/cover-intro/locks/lock_soft_gold_v1.png` | PNG RGBA / 941×1672 | sí | Lock de Portales II–V; capa independiente | `F1137CA67103CB15A247C587901789D497C4626F8602F443EE502B8AE9C1DE85` |

`COV-GLOW-A`, `COV-LOCK` y `COV-LIA` sirven para comprobar continuidad, pero no
deben adjuntarse como contenido principal de generación: el futuro interior no
debe hornear glow, lock ni personaje.

## Portal I — Mundo Raíz

| ID | Ruta / nombre | Formato y dimensiones | Alpha | Uso actual / estado | SHA-256 |
| --- | --- | --- | :---: | --- | --- |
| `MIR-I` | `public/assets/gvo/current-used/final-root/access/final_access_world1_root_v01.webp` | WebP RGBA / 1024×1024 | sí | Acceso publicado de `FinalRoot`; representación provisional de DEBT_013 en Portada | `F1BE36246795D8A89241AA708D8E8ECE29FA5C98F3F0DCCAF5C2BD5F8F1BF046` |
| `W1-VIS` | `docs/narrative/visual_refs/03_estacion_i_mundo_raiz.png` | PNG RGB / 941×1672 | no | Referencia narrativa de Mundo I; no runtime | `FFDA032F99A0E924C3FA27D6A5D84B55D55E43DC056264294941CBEF9AEE548A` |
| `W1-PLANT` | `public/assets/gvo/current-used/world-1-root/plant/world1_root_young_plant_approved_v1.png` | PNG RGBA / 798×987 | sí | Brote joven consumido por `World1Root` | `DCA068C4BF01DAA907B98EAB6A64C7810C4B87E479B10CBB133CDA5492C6D10A` |
| `W1-ROOTS` | `public/assets/gvo/current-used/world-1-root/roots/world1_root_roots_base_approved_v1.png` | PNG RGBA / 941×1672 | sí | Raíces base consumidas por `World1Root` | `FB47E049D43CE1FA0354FF9133E4F873B1095117496768B30168C9AA07E0F662` |

Identidad a conservar: brote vivo, raíces legibles, relación con suelo/piedra y
luz cálida. No copiar las siluetas exactas de `W1-PLANT`, `W1-ROOTS` o `MIR-I`.

## Portal II — Pulso invisible

| ID | Ruta / nombre | Formato y dimensiones | Alpha | Uso actual / estado | SHA-256 |
| --- | --- | --- | :---: | --- | --- |
| `MIR-II` | `public/assets/gvo/current-used/final-root/access/final_access_world2_pulse_v01.webp` | WebP RGBA / 1024×1024 | sí | Acceso publicado de `FinalRoot`; representación provisional de DEBT_013 en Portada | `6EE6B093DEE9ABBEA96FDA66C6C80DB3601CDF588A34FD062D0F844466EDD7B6` |
| `W2-VIS` | `docs/narrative/visual_refs/04_estacion_ii_pulso_invisible.png` | PNG RGB / 941×1672 | no | Referencia narrativa de Mundo II; no runtime | `32E34D86CE0460C8E75F26C93C606F2938DF494347C19C11DC20ACE7CF5159C1` |
| `W2-PLANT` | `public/assets/gvo/current-used/world-2-root/plant/world2_main_living_plant_v01.png` | PNG RGBA / 1400×2200 | sí | Planta principal consumida por `World2Root` | `1BF0B6DF13162407AC6DA1CF2895D5E3DEDB08B78BAE62F9154425DE9F7F178F` |
| `W2-WAVE` | `public/assets/gvo/current-used/world-2-root/signal/world2_raw_bioelectric_waveform_v01.png` | PNG RGBA / 1600×900 | sí | Onda bioeléctrica consumida por `World2Root` | `9403CD167B62FDD5E40D522743EF73D5312709F6C0D16808809D1D3EB057E617` |
| `W2-CORE` | `public/assets/gvo/current-used/world-2-root/signal/world2_pulse_core_node_v01.png` | PNG RGBA / 1024×1024 | sí | Núcleo de pulso consumido por `World2Root` | `ABA5E43C27271DBE48C939AA5E26E64BF3EBD39F5F06E85B0FB11EB9B0E8B64C` |

Identidad a conservar: planta reconocible, relación de contacto y señal
violeta contenida. No copiar la planta, waveform, core ni una captura completa.

## Portal III — Cuaderno de pruebas

| ID | Ruta / nombre | Formato y dimensiones | Alpha | Uso actual / estado | SHA-256 |
| --- | --- | --- | :---: | --- | --- |
| `MIR-III` | `public/assets/gvo/current-used/final-root/access/final_access_world3_notebook_v01.webp` | WebP RGBA / 1024×1024 | sí | Acceso publicado de `FinalRoot`; representación provisional de DEBT_013 en Portada | `2EFAB6C3CA5430D7BA1F0113AA4E19A4B99CE6D4AF5C3212371AC86314039CD3` |
| `W3-VIS` | `docs/narrative/visual_refs/05_estacion_iii_cuaderno_pixel.png` | PNG RGB / 941×1672 | no | Referencia narrativa de Mundo III; no runtime | `F3144754A67E235AB828269970A9C89FF453846B834A102B924DBA37F117FB19` |
| `W3-BOOK` | `public/assets/gvo/current-used/world-3-root/notebook/world3_notebook_open_base_v01.png` | PNG RGBA / 1536×1024 | sí | Cuaderno base consumido por `World3Root` | `3ABF81F4772302CB7A38B9C428C104951E35D087FF1F5989C55468DDEC31D0F3` |
| `W3-MARKS` | `public/assets/gvo/current-used/world-3-root/index/world3_index_notebook_marks_sheet_v01.png` | PNG RGBA / 1024×512 | sí | Hoja de marcas consumida por `World3Root` | `5B3D1E3631DA7454F765D7524A7479272A59E45B15109A895CBA8B5C4E3ED358` |

Identidad a conservar: cuaderno abierto, páginas claras y pocas marcas
pictóricas abstractas. No copiar el cuaderno, los símbolos ni contenido
pedagógico específico.

## Portal IV — Mesa de sistema

| ID | Ruta / nombre | Formato y dimensiones | Alpha | Uso actual / estado | SHA-256 |
| --- | --- | --- | :---: | --- | --- |
| `MIR-IV` | `public/assets/gvo/current-used/final-root/access/final_access_world4_system_v01.webp` | WebP RGBA / 1024×1024 | sí | Acceso publicado de `FinalRoot`; representación provisional de DEBT_013 en Portada | `5472BDCA276DBD851D0C3C7C48A96038A5D7544AA13EF4A51BE7BC4DCC2E2B9D` |
| `W4-VIS` | `docs/narrative/visual_refs/06_estacion_iv_mesa_sistema.png` | PNG RGB / 941×1672 | no | Referencia narrativa de Mundo IV; no runtime | `FA44789C056C663349C8ADB1DD3B27CBD6B9255C03D5F1581DE6C50BA89AB02C` |
| `W4-TABLE` | `public/assets/gvo/current-used/world-4-root/table/world4_table_top_v01.png` | PNG RGBA / 1536×1024 | sí | Superficie de mesa consumida por `World4Root` | `414D3DBF394ACC4C6649C46B6703400B8419E0EB912BA12ADAD36B56E9B74282` |
| `W4-ROUTE` | `public/assets/gvo/current-used/world-4-root/route/world4_system_route_base_v01.png` | PNG RGBA / 1536×1024 | sí | Ruta pasiva consumida por `World4Root` | `111B8855F3FFE68BE5EE27DB16317C26C389012BAA1E36B5E8202863151460AB` |
| `W4-CENTRAL` | `public/assets/gvo/current-used/world-4-root/objects/world4_node_central_system_v01.png` | PNG RGBA / 1024×1024 | sí | Nodo central consumido por `World4Root` | `069DDCF6DCA26053C067D649D8794A19C06D21307C0E725D2FE71AFF4DFF2EAA` |

Identidad a conservar: pequeña mesa/superficie, red legible de 3–5 nodos y una
jerarquía central. No copiar la mesa runtime, la cadena completa ni hornear
pulsos activos.

## Portal V — Mapa del presente

| ID | Ruta / nombre | Formato y dimensiones | Alpha | Uso actual / estado | SHA-256 |
| --- | --- | --- | :---: | --- | --- |
| `MIR-V` | `public/assets/gvo/current-used/final-root/access/final_access_world5_map_v01.webp` | WebP RGBA / 1024×1024 | sí | Acceso publicado de `FinalRoot`; representación provisional de DEBT_013 en Portada | `A034AA6940E2043870FF3EE0B6C833DF4F3C3F15CFD386C846DB78AA1CBFC07F` |
| `W5-VIS` | `docs/narrative/visual_refs/07_estacion_v_mapa_presente.png` | PNG RGB / 941×1672 | no | Referencia narrativa de Mundo V; no runtime | `1C96DBF2E65B7EFA5198B7B87A21AE4191915C1CA2BC8E06AB744F84FE429B0B` |
| `W5-MAP` | `public/assets/gvo/current-used/world-5-root/world5_map_environment_portrait_v01.webp` | WebP RGB / 1440×2560 | no | Base portrait consumida por `World5Root` | `4EA310071C8D7D6CAEBAFBF2D245DF20F8F36603D0BF61E62EBCAD5FCD3546A0` |
| `W5-PLANTS` | `public/assets/gvo/current-used/world-5-root/world5_map_sector_plants_v01.webp` | WebP RGBA / 1536×1536 | sí | Sector Plantas consumido por `World5Root` | `6694571EF217B853C8A76E027F99988133315538E7A286721210BDD4D0E0A530` |
| `W5-SYSTEM` | `public/assets/gvo/current-used/world-5-root/world5_map_sector_system_v01.webp` | WebP RGBA / 1536×1536 | sí | Sector Sistema consumido por `World5Root` | `B1534F1E43D248A30283E0FA3A94C383F9012B1F146B329EB6F446F743805C20` |

Identidad a conservar: mapa/tablero compacto y síntesis espacial de áreas. No
copiar la geografía, los sectores ni la organización runtime completa.

## Matriz obligatoria de preparación

El set común que encabeza cada prompt es:
`COV-REF → COV-BG → COV-FRAME-A → COV-FRAME-L`. Los frames se adjuntan para
encaje y materialidad, nunca para hornearlos dentro del interior.

| Portal | Referencias disponibles | Qué adjuntar al prompt, en orden | Dimensión objetivo | Formato |
| --- | --- | --- | --- | --- |
| I | Portada, frames, Mirador I, referencia W1, brote y raíces | Set común → `W1-VIS` → `W1-PLANT` → `W1-ROOTS` → `MIR-I` | master 2048×3072; runtime 1024×1536 | master PNG RGBA; runtime WebP alpha |
| II | Portada, frames, Mirador II, referencia W2, planta, onda y núcleo | Set común → `W2-VIS` → `W2-PLANT` → `W2-WAVE` → `W2-CORE` → `MIR-II` | master 2048×3072; runtime 1024×1536 | master PNG RGBA; runtime WebP alpha |
| III | Portada, frames, Mirador III, referencia W3, cuaderno y marcas | Set común → `W3-VIS` → `W3-BOOK` → `W3-MARKS` → `MIR-III` | master 2048×3072; runtime 1024×1536 | master PNG RGBA; runtime WebP alpha |
| IV | Portada, frames, Mirador IV, referencia W4, mesa, ruta y nodo | Set común → `W4-VIS` → `W4-TABLE` → `W4-ROUTE` → `W4-CENTRAL` → `MIR-IV` | master 2048×3072; runtime 1024×1536 | master PNG RGBA; runtime WebP alpha |
| V | Portada, frames, Mirador V, referencia W5, mapa y dos sectores | Set común → `W5-VIS` → `W5-MAP` → `W5-PLANTS` → `W5-SYSTEM` → `MIR-V` | master 2048×3072; runtime 1024×1536 | master PNG RGBA; runtime WebP alpha |

Los assets `MIR-I–V` aparecen al final deliberadamente: solo comunican memoria,
escala y familia material. La identidad del Mundo y el encaje de Portada tienen
prioridad; copiar o reencuadrar el acceso de Mirador es un hard fail.

## Contrato del asset principal

Se requiere un único asset estático por portal:

| Portal | Asset principal | ID recomendado | Naming runtime recomendado |
| --- | --- | --- | --- |
| I | Viñeta vertical de brote y raíces | `COVER-PORTAL-I-INTERIOR-001` | `cover_portal_world1_root_interior_v01.webp` |
| II | Viñeta vertical de planta y pulso bioeléctrico | `COVER-PORTAL-II-INTERIOR-001` | `cover_portal_world2_pulse_interior_v01.webp` |
| III | Viñeta vertical de cuaderno de pruebas | `COVER-PORTAL-III-INTERIOR-001` | `cover_portal_world3_notebook_interior_v01.webp` |
| IV | Viñeta vertical de mesa y red de sistema | `COVER-PORTAL-IV-INTERIOR-001` | `cover_portal_world4_system_interior_v01.webp` |
| V | Viñeta vertical de mapa del presente | `COVER-PORTAL-V-INTERIOR-001` | `cover_portal_world5_map_interior_v01.webp` |

### Canvas y transparencia

- Ratio contractual: `2:3 portrait`.
- Master normalizado: `2048×3072`, PNG RGBA, alpha real.
- Runtime propuesto: `1024×1536`, WebP con alpha.
- Fondo: completamente transparente fuera de la viñeta; no generar un entorno
  rectangular opaco.
- Conservar el archivo original de la herramienta en su tamaño/formato nativo.
- Normalizar mediante escala proporcional y padding transparente; nunca
  estirar, reconstruir o recortar contenido narrativo.

La relación 2:3 deriva del slot real de `.cover-intro__portal-representation`:
el portal primario mide hasta `118×215 px`, los secundarios hasta `84×155 px`,
y el interior usa 86–90 % del ancho por 72–76 % del alto. Su caja visible queda
aproximadamente en 2:3, mientras el material de Mirador es 1:1.

### Zona segura y lectura mínima

- Contenido visible dentro de `x=12–88 %`, `y=8–92 %`.
- Centro óptico dentro del 8 % central.
- Sombra contenida dentro de la misma zona segura.
- Silueta legible en `60×112`, `72×112` y `106×163 px`.
- Detalle principal reconocible sin depender de glow, color o texto.
- Sin frame, lock, números romanos o estado de bloqueo horneados: esas capas ya
  existen y deben seguir siendo independientes.

No se fija presupuesto de bytes en este ticket. Debe medirse después de la
aprobación visual, antes de cualquier compresión o promoción runtime.

## Estructura propuesta para un ticket de producción posterior

No se creó ninguna de estas carpetas en DEBT_013A:

```text
docs/assets/cover-intro/production-sources/portals/
  portal_1/
  portal_2/
  portal_3/
  portal_4/
  portal_5/

public/assets/runtime/cover-intro/portals/
  portal_1/interior/
  portal_2/interior/
  portal_3/interior/
  portal_4/interior/
  portal_5/interior/

public/assets/gvo/current-used/cover-intro/portals/
  portal_1/interior/
  portal_2/interior/
  portal_3/interior/
  portal_4/interior/
  portal_5/interior/
```

Naming de masters:

```text
cover_portal_world1_root_interior_master_v01.png
cover_portal_world2_pulse_interior_master_v01.png
cover_portal_world3_notebook_interior_master_v01.png
cover_portal_world4_system_interior_master_v01.png
cover_portal_world5_map_interior_master_v01.png
```

## Guía para prompts

### Prompt base positivo

```text
Create one independent vertical 2:3 transparent interior vignette for Portal
[ROMAN] in the GVO Cover / El Archivo Vivo de OKÚA. It must sit behind the
existing portal frame and remain readable at very small mobile size. Preserve
the warm organic-editorial OKÚA materiality with restrained pixel-art accents.
Use the Cover references only for palette, lighting, scale and fit. Use the
World references for narrative identity. Use the Mirador access only as a
memory-family reference and do not copy, crop, reframe or reproduce it.

Required subject: [PORTAL-SPECIFIC SUBJECT]. Keep one strong vertical silhouette,
controlled detail, optical center near the canvas center, and real transparent
alpha around the complete vignette. Do not bake the portal frame, glow, lock or
Roman numeral into the artwork. No full background environment.
```

Sustitución por portal:

| Portal | `[PORTAL-SPECIFIC SUBJECT]` |
| --- | --- |
| I | one living sprout above clearly readable branching roots and a restrained soil/stone base |
| II | one recognizable living plant connected to one restrained violet bioelectric pulse path |
| III | one open field notebook with clear pages and only a few abstract pictographic marks |
| IV | one compact system table with three to five simplified nodes and one clear network relationship |
| V | one compact present-map board with an abstract spatial arrangement of areas and one clear focal marker zone |

### Prompt negativo común

```text
text, letters, numbers, roman numerals, logos, watermark, UI, buttons, cards,
portal frame, lock, baked glow, Lía, character, human, animal, full-screen
background, complete station screenshot, copied Mirador access asset, copied
runtime asset or silhouette, dashboard, photorealism, 3D render, anime, dense
particles, mixed pixel scales, clipped subject, opaque rectangular background,
long directional shadow, unreadable micro-detail
```

### Reglas de adjuntos

1. Usar los IDs y el orden exacto de la matriz; no adjuntar carpetas completas.
2. Explicar explícitamente qué tomar y qué no copiar de cada archivo.
3. Tratar `docs/narrative/visual_refs` como art direction, nunca como runtime.
4. Tratar `current-used` como evidencia de identidad/aprobación, nunca como
   permiso para recomponer binarios.
5. No adjuntar `COV-GLOW-A`, `COV-LOCK` o `COV-LIA` salvo una revisión humana
   controlada que necesite comprobar continuidad; nunca deben aparecer en el
   asset generado.
6. Generar una familia de uno en uno: el primer asset aprobado fija escala,
   materialidad y densidad para comparar los cuatro restantes.

## Criterios de revisión futura

- Filename, canvas, formato y alpha coinciden con el contrato.
- No hay texto, logo, UI, frame, lock, número ni personaje.
- No existe reutilización binaria ni silueta copiada del Mirador o del Mundo.
- El Mundo se reconoce en los tres tamaños mínimos.
- Los cinco assets comparten escala aparente, luz y densidad, pero no parecen
  cinco variantes del mismo objeto.
- Funcionan detrás del frame activo y del frame locked sin recorte narrativo.
- La versión locked se obtiene por estado/CSS, no mediante otro bitmap.
- Se preservan original, master, export runtime, dimensiones, bytes, SHA-256 y
  bbox alpha antes de solicitar integración.

## Archivos

### Creado por DEBT_013A

- `docs/status/GVO_DEBT_013A_COVER_PORTAL_ASSET_INVENTORY_FOR_REVIEW.md`

### Modificados por DEBT_013A

- Ninguno.

Los cambios locales de DEBT_013 permanecen en el worktree y no fueron
alterados por este ticket.

## Validación documental

- Baseline HEAD/origin/divergencia: PASS.
- CoverIntro, FinalRoot, Mirador, runtime, `current-used`, manifests e
  inventarios auditados: PASS.
- Metadatos reales de 31 referencias: PASS.
- Pares runtime/`current-used` del set binario: `24/24` byte-idénticos.
- Matriz I–V, adjuntos, dimensiones, formatos, naming y estructura: completa.
- Imágenes generadas: `0`.
- Assets, runtime, Portada, Mirador y manifests modificados por DEBT_013A: `0`.
- Pruebas runtime: no aplican; el ticket es documental y no cambia código.

## Estado final

`PENDING_HUMAN_REVIEW`

Sin generación. Sin commit. Sin push. Sin PR.
