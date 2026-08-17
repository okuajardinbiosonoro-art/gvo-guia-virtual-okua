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
