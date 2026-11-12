# Assets utilizados runtime

## Addendum vigente OBS03.2 + R3 — candidata para revisión

Estado del addendum: `AGENT_STATIC_REGISTRY_CHECKED / SCENE_QA_PENDING / HUMAN_PENDING`.
La comprobación documental de bytes, dimensiones y consumidores está en
[`shared/OBS03-assets-motion-index.json`](shared/OBS03-assets-motion-index.json);
cada pantalla incluye su nuevo `OBS03-runtime-reference.json`. Los registros
históricos siguientes se conservan y no conceden aprobación a esta composición.

Portada y salas I, II, IV y V consumen el rig compartido v03 de 16 capas locales
432×768, derivadas de las capas auténticas, con exactamente cinco capas de pétalos.
El registro verificable permanece en
[`shared/lia/articulated-v03/manifest.json`](shared/lia/articulated-v03/manifest.json).
La mano oblicua de deslizamiento v03 es un único WebP transparente 256×256 para
ambos ejes; `tap` conserva su recurso anterior. Sus espejos son byte-idénticos.
Los estados atención/presentación/respuesta y reduced motion constan en código;
su resultado visual en escena sigue pendiente de revisión.

Sala III restaura `notebook/world3_notebook_open_base_v01.png` como bitmap único
proporcional y conserva la hoja original de giro y tres motivos de práctica.
El folio v02 y las cinco poses pixel anteriores quedan históricos y fuera del
consumidor/preparación actual. Las tres hojas reales de Lía ya están activas:
INTRO 650 ms, escucha 1100 ms y acompañamiento 850 ms. Son WebP 768×512,
seis celdas de 256² por hoja, 495.570 bytes en total y base registrada (128,212).
El índice usa el cuadro neutral de INTRO. El registro es
`world-3-root/lia/clips/OBS03-clips-manifest.json`; el helper crítico prepara sólo
la hoja pertinente. Un fallo no activa una pose de sustitución. El piloto INTRO
tuvo comprobación técnica en escena; la revisión de los tres clips actuales y
su aceptación humana siguen pendientes. El límite RGB bajo alfa cero permanece
explícito en el registro de producción.

Sala IV tiene ocho objetos v03 y sus espejos verificados. Sala V dispone de sus
ocho opciones v03: las seis de Sistema/Espacio/Visitante constan en
`world-5-root/options/OBS03-six-manifest.json` (225.772 bytes derivados, seis
pares runtime/espejo coincidentes). Los doce hashes de fuentes nativas y
normalizadas fueron contrastados; su composición en escena continúa pendiente.
Las listas de precarga ya conservan la
pose de activación realmente montada por Portada y excluyen las cinco poses
históricas de I que ya no se muestran. Cinco pruebas focales de esas listas pasan.

Sistema de escucha V consume sus dos fondos limpios v03, sin cajas/cable/puertos
horneados. Estado: `INTEGRATION_CANDIDATE / SCENE_QA_PENDING / HUMAN_PENDING`.
Las rutas siguientes son relativas tanto a
`public/assets/gvo/stations/world-5/present-map/runtime/` como a
`public/assets/gvo/current-used/world-5-root/`:

| Ruta relativa del par runtime / espejo | Formato / dimensiones | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `system/world5_sub_system_environment_portrait_v03.webp` | WebP opaco / 1440×1920 | 1.261.922 | `e1d6d82f246215e0870449e3affd399010ffd24e046608635845aa4a7c160d08` |
| `system/world5_sub_system_environment_landscape_v03.webp` | WebP opaco / 1920×1080 | 752.794 | `7a2124d0db8bd573ee47960e055d40f6b41232ab2c6cc5c56fdf0d066453578b` |

El consumidor es `world5RuntimeAssets.ts#getWorld5Environment("sistema", orientation)`;
su helper crítico prepara sólo la orientación actual. Plantas, Espacio,
Visitante y resultado conservan sus fondos v01. El [registro de Sistema](world-5-root/system/OBS03-cleanplates-manifest.json)
identifica masters, máscaras, pares byte-idénticos y activación; el informe
`assets-source/editorial-2026-10-23/observaciones-03/production/SYSTEM-cleanplates-result.json`
documenta cero cambios RGBA fuera de las máscaras, alpha opaco inalterado y
decodificación lossless exacta. Las fuentes finales son los PNG superiores
`WORLD5_SYSTEM_CLEANPLATE_{PORTRAIT,LANDSCAPE}_OBS03.png` dentro de
`production/pixel-two-system-cleanplates-originals/`; los archivos
`originals/*_NATIVE.png` son procedencia preservada, no masters activos.
Los dos pares suman 2.014.716 bytes; los originales v01 permanecen históricos.
La comprobación de archivo no acredita composición en escena ni aprobación del
responsable humano único.

El [informe de recursos y movimiento](../../../../docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/assets-motion/OBS03_ASSETS_MOTION_AUDIT.md)
explica alcance, hashes, calibración aritmética de la mano, registro del cuaderno
y deudas. Este addendum no acredita navegador, dispositivos físicos ni aprobación
del responsable humano único.

## Candidata editorial anterior — 2026-10-23, historial preservado

`cover-intro/brand/` registra el logo auténtico completo sin alterar sus bytes.
`loading-initial/integration-brand-2026-10-23.json` registra las dos hojas derivadas
con el mismo símbolo en maceta/regadera, conservando grillas, cinco pétalos y
píxeles fuera de las pequeñas placas. Los tres mirrors tienen hash idéntico a
runtime. La composición continúa pendiente de revisión humana.

`world-3-root/integration-2026-10-23.json` registra siete originales reutilizados
(ambiente, `turnPage` y cinco poses) y tres motivos nuevos con sus pares
runtime/mirror, dimensiones y hashes. El folio nuevo de acabado se registra en el
manifiesto adicional citado abajo; `openBase` es historia preservada. El símbolo
del triángulo procede del PNG de marca existente y conserva su trazado. Los nuevos
assets y la composición esperan revisión humana; las aprobaciones históricas
siguientes corresponden a las versiones anteriores y originales conservados.

El acabado añade cuatro pares `INTEGRATION_CANDIDATE / HUMAN_PENDING`: folio
ilustrado de III, mesa vertical de IV, marco de lectura de V y umbral compartido
de navegación. Sus fichas están en los README de `world-3-root`, `world-4-root`,
`world-5-root` y [`shared/navigation`](shared/navigation/README.md). La fuente
común es `docs/narrative/integracion_autonoma_2026-10-23/revision-acabado/assets-manifest.json`.
Estos recursos no heredan aprobación de los originales históricos.

Esta carpeta es el registro canónico de assets usados por pantallas reales de
GVO. No es el Atlas visual, una carpeta de prompts ni un depósito de mockups. Es
el espejo organizado de assets consumidos por runtime o registrados para una
pantalla con estado documentado.

## Regla obligatoria

Todo asset runtime usado por una pantalla debe quedar copiado o registrado aquí,
organizado por pantalla, aunque el ticket no lo pida explícitamente.

Antes de continuar cualquier trabajo de assets o pantallas, revisar:

```text
docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md
docs/assets/ASSET_INVENTORY.md
```

## Estructura registrada

```text
current-used/
  loading-initial/
  initial-experience/
  cover-intro/
  transition-world/
  world-1-root/
  world-2-root/
  world-3-root/
    environment/
    index/
    lia/
    notebook/
    plant/
    prototype/
    records/
    signal/
  world-4-root/
  world-5-root/
  final-root/
    access/
    environment/
    lia/
    ui/
  shared/
  global/
```

## Registros históricos por bloque anteriores al acabado

- `loading-initial`, `transition-world`, `world-1-root`, `world-2-root`,
  `shared` y `global` conservan sus registros runtime preexistentes.
- `initial-experience` registra por referencia el fondo aprobado de Portada y
  conserva los cinco emblemas aprobados del Mirador. `cover-intro` registra
  cinco interiores dedicados, aprobados y byte-idénticos a sus pares runtime
  bajo `public/assets/runtime/cover-intro/portals/portal_1..5/interior/`. Las
  rutas de ambos consumidores quedan desacopladas por `GVO_DEBT_013C`; las
  composiciones permanecen `PENDING_HUMAN_REVIEW`.
- `world-3-root` contiene los 15 espejos aprobados de Estación III. Cada archivo
  es byte-idéntico a su par bajo
  `public/assets/gvo/stations/world-3/notebook-pixel/runtime/`; rutas,
  dimensiones, SHA-256 y consumidor están inventariados en
  `world-3-root/README.md` y `docs/assets/ASSET_INVENTORY.md`.
- `world-4-root` contiene los 20 espejos byte-idénticos integrados por 018C para
  la composición estática de Estación IV. R1 conserva los 20 archivos y sus
  hashes, retiene z1 y excluye z5 únicamente del render tras el toggle visual
  obligatorio. El cierre 018E declara la pantalla `HUMAN_APPROVED` y cerrada; el
  detalle vive en su `README.md`. La experiencia no usa audio, ofrece reduced
  motion completo y mantiene la PWA instalada como no certificada en la
  plataforma de QA.
- `world-5-root` registra 24 pares byte-idénticos: ocho del mapa, tres de
  Plantas, tres de Sistema, tres de Espacio, tres de Visitante y cuatro poses
  aprobadas de Lía. Plantas, Sistema, Espacio y Visitante están integradas; el
  progreso local alcanza 4/4 y el cierre global con salida W5→Final está
  publicado. `ST5_020G_HUMAN_APPROVED`, `ST5_020H_HUMAN_APPROVED` y
  `ST5_020I_PUBLISHED_COMPLETE` dejan Estación V cerrada para el alcance actual.
  Esta autoridad procede de las decisiones humanas publicadas, no de la sola
  existencia del mirror.
- `final-root` registra 19 pares byte-idénticos aprobados humanamente para el
  Mirador: seis Environment, seis Access, cuatro UI y tres Lía. Gate 5 queda
  `ASSETS PRODUCED_AND_APPROVED / COMPLETE`; Gates 6–8 también están
  `HUMAN_APPROVED / COMPLETE`. Composición responsive, motion, revisita y reset
  están publicados, y el estado vigente es
  `GVO FINAL — MIRADOR PHASE / COMPLETE`. La frase histórica
  `REGISTERED / NOT_YET_COMPOSED` corresponde al corte 021I y fue superada por
  021P. Las cinco fuentes de producción permanecen fuera de `public` y no tienen
  mirror ni precache.
- Cualquier carpeta posterior debe declarar su propio estado. La sola existencia
  del directorio nunca equivale a aprobación de pantalla.

## Reglas

- No borrar ni mover originales.
- No cambiar imports runtime solo por este espejo.
- No optimizar, convertir o reexportar archivos desde esta carpeta.
- Mantener nombres estables y organización por pantalla.
- No incluir referencias del Atlas como si fueran assets runtime.
- Verificar identidad byte a byte cuando runtime y `current-used` contengan una
  copia física del mismo asset.
- Registrar formato, dimensiones, SHA-256, función, consumidor y estado de cada
  asset aprobado en el inventario correspondiente.

## Lía Preview — LIA-M3-01

`current-used/lia-preview/` registra el reuse canónico de Lía para la pantalla dedicada `/final/lia`. Tira WebP 1536×256, frame estático 256×256, 28306 bytes; SHA-256 `D3171A70C467EFCDA6D1FBB553FA2BEC5D3CFF0DE1A3B00306F5FF121F18CCDE`. Función: avatar guía. Consumidor: `LiaPreview`. Asset `HUMAN_APPROVED_CANONICAL_REUSE`; pantalla/copy pendientes del gate final. No cambia el original ni el Mirador con flag apagado.

## LIA-M4 CONCEPT_A

The Lía preview screen reuses four unchanged approved FinalRoot assets. The exact runtime/mirror registry is `public/assets/gvo/current-used/lia-preview/manifest.json`; generated candidates are excluded from runtime pending human selection.

## LIA-M4-FINAL-01 approved presence

This entry supersedes the earlier candidate-only runtime status for exactly three originals. The original human review approved Greeting A, Listening A and Explaining A; LIA-M4-FINAL-01 authorizes their deterministic runtime integration. Screen acceptance remains pending. Four prior canonical assets remain; rejected poses are excluded. [Correction details](../../../../docs/lia/m4/FINAL_CORRECTION.md).

- `LIA-M4-GREETING-A`: source `assets-source/lia-m4/LIA-M4-GREETING-A.png` SHA256 `3C4A4C454758D3C5380ED9405C4AD534D97FCCA553281CCDBF2E56CAE939D4F3`; runtime `public/assets/gvo/lia-preview/lia/lia-m4-greeting-a.webp` / mirror `public/assets/gvo/current-used/lia-preview/lia/lia-m4-greeting-a.webp`; WebP RGBA [1254, 1254], 385836 bytes, SHA256 `82DC04328F41E959DC9C731B7EEDEEFE745EC278F538EC379B119D79AB6D2193`; consumer LiaPreview, state greeting; HUMAN_APPROVED_SOURCE_DERIVATION.
- `LIA-M4-LISTENING-A`: source `assets-source/lia-m4/LIA-M4-LISTENING-A.png` SHA256 `B08125CA85720D50EEEF8A4DDABB52645CE41D5C5C98F53CC3D266503F1DF714`; runtime `public/assets/gvo/lia-preview/lia/lia-m4-listening-a.webp` / mirror `public/assets/gvo/current-used/lia-preview/lia/lia-m4-listening-a.webp`; WebP RGBA [1254, 1254], 288932 bytes, SHA256 `7150C930446C4AF85EA5B3E1D81EC45EECC61D1C081C5D65146136166CF6C93E`; consumer LiaPreview, state listening; HUMAN_APPROVED_SOURCE_DERIVATION.
- `LIA-M4-EXPLAINING-A`: source `assets-source/lia-m4/LIA-M4-EXPLAINING-A.png` SHA256 `89297153A015937E82D2B020A159C4254100ABE10016BEE89C6AC81B41A11C6F`; runtime `public/assets/gvo/lia-preview/lia/lia-m4-explaining-a.webp` / mirror `public/assets/gvo/current-used/lia-preview/lia/lia-m4-explaining-a.webp`; WebP RGBA [1254, 1254], 473646 bytes, SHA256 `96C9AD6AFA43A66BE982434BE36FCD112B4F3DDB8BB1369C0678E744CC0C384E`; consumer LiaPreview, state explaining; HUMAN_APPROVED_SOURCE_DERIVATION.

## Addendum de marca OBS03 — v03 vigente, aceptación pendiente

Estado: `ART_TECHNICAL_CANDIDATE_SCENE_QA_PENDING_HUMAN_PENDING`.
Carga usa `loading-initial/lia/lia_loading_16f_okua_v03.png` (2560²,
2.050.024 bytes) y `loading-initial/plant/plant_growth_4f_okua_v03.png`
(3072×768,370.976 bytes), con metadatos de grilla v03. Portada usa
`cover-intro/brand/okua-emblem-material-v03.png` (116×142 RGBA,44.961 bytes).
Los tres espejos coinciden byte a byte. Registros completos:
[`loading-initial/OBS03-brand-v03.json`](loading-initial/OBS03-brand-v03.json)
y [`cover-intro/OBS03-brand-v03.json`](cover-intro/OBS03-brand-v03.json).

La máscara auténtica única58×71 se aplica como grabado del soporte; ChatGPT
Images aporta material local limpio. Se conservan alpha original íntegra,
0RGBA cambiado fuera de máscaras finales, borde de regadera protegido y
Lía frames1–4idénticos. El emblema de Portada tiene alpha real, sin rectángulo
blanco, medallón ni texto horneado; marca y títulos permanecen en DOM.
Los contactos4maceta/12regadera fueron inspeccionados, sin sustituir QA de
animación/tamaño real en escena ni revisión/aprobación del responsable humano
único. v01 y sus registros anteriores permanecen como historial fuera de los
consumidores actuales de marca. Detalle y fallos conservados en
[entry-transitions/brand-v03](../../../../docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/entry-transitions/brand-v03/README.md).
