# Assets utilizados runtime

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

## Estado por bloque

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
