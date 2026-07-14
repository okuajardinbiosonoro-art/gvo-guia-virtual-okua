# 017K repository inventory — cierre Estación III

Actualizado: 2026-07-14
Baseline: `main` en `b2a269973bc96fc462f2e053bcf33c6380dcbb3e`
Alcance: clasificación de los 63 paths iniciales, limpieza, documentación y preparación del cierre.

## Snapshot inicial

Antes de editar se registraron fuera del repositorio el status, diff completo, diff stat, rutas, tamaños, SHA-256, refs locales y ref remota. El `fetch --prune` autorizado confirmó:

    HEAD = origin/main local = main remoto
    divergencia = 0 0
    staged = 0
    dirty paths = 63

La matriz completa ruta por ruta forma parte del paquete externo `GVO_ST3_017K_CLOSEOUT_*`.

## Clasificación

| Clase | Conteo inicial | Disposición |
| --- | ---: | --- |
| A — producción aprobada Estación III / transición | 52 | Conservar y stagear tras validación. |
| B — documentación final requerida | 0 | La documentación 017K se crea después del snapshot y se audita por separado. |
| C — cambio legítimo ya aprobado en `main` | 2 | Eran dos marcadores stat-only sin delta semántico. El CSS se normalizó sin stage; el TSX pasó después a A al recibir el wiring explícito de metadata final. |
| D — evidencia transitoria o supersedida | 2 | Retirar con evidencia. |
| E — base Mundo IV no aprobada | 7 | Conservar bajo la excepción literal del ticket, siempre etiquetada como base técnica preexistente no aprobada. |
| F — ambiguo | 0 | Ningún bloqueo de clasificación. |

De los 63 paths, 30 eran binarios: 15 assets runtime de Estación III y sus 15 espejos `current-used`. Los pares tienen tamaño y SHA-256 idénticos; son duplicación deliberada exigida por política.

La matriz externa conserva esas 63 filas y agrega 37 paths generados durante el propio cierre: 6 de cableado/QA final clase A y 31 de documentación o trazabilidad clase B. Su disposición final es A59, B31, C1, D2, E7 y F0 (100 filas). El staging contiene 97 paths porque los dos D fueron retirados y el único C terminó sin delta.

## Retiros demostrados

- `src/screens/World3Root/PixelLia.tsx`: componente procedural provisional con cero consumidores, sustituido por `World3LiaActor` y cinco poses runtime aprobadas.
- `docs/status/GVO_STATION3_FABLE_BASE_PORT.md`: informe intermedio que afirmaba ausencia de binarios, ausencia de `current-used` y falta de aprobación; quedó materialmente supersedido por `GVO_STATION3_COMPLETE.md`.

## Código muerto retirado

La auditoría de consumidores demostró que el fallback genérico de detalle en `World3RootScreen` era inalcanzable: los únicos tres IDs posibles entran antes en sus ramas específicas PLANTA, PROTOTIPO y SEÑAL. Se retiraron:

- `recordArt()` y la rama genérica;
- `PixelPlant`, `PixelPrototype` y `PixelSignalScope`;
- selectores CSS usados solo por ese fallback;
- `world3InitialRuntimeAssetSources`, export sin consumidores.

`PixelCheck`, `PixelTypewriterText`, `usePixelTypewriter`, las tres secuencias narrativas, las anotaciones, PageTurn y la traza de SEÑAL sí tienen consumidores y se preservan.

## Assets

- Runtime aprobado: `public/assets/gvo/stations/world-3/notebook-pixel/runtime/`.
- Espejo aprobado: `public/assets/gvo/current-used/world-3-root/`.
- Registro ejecutable: `world3RuntimeAssets.ts`.
- Contrato semántico: `world3SemanticAssetManifest.ts`.
- Inventario verificable: [ASSET_INVENTORY.md](../assets/ASSET_INVENTORY.md).

No se eliminaron, movieron, convirtieron ni recomprimieron assets. No se promovieron mockups del Atlas.

## Base preexistente de Mundo IV

Los siete paths E corresponden a:

- tres archivos tracked de `World4RootScreen`;
- `station4Content.ts`;
- `station4NodeArt.tsx`;
- `docs/status/GVO_STATION4_FABLE_BASE_PORT.md`;
- `public/assets/gvo/current-used/world-4-root/README.md`.

Los cinco archivos funcionales coinciden byte a byte con la base Fable deliberada previamente integrada. Se conservan como base técnica **NO APROBADA**. El cierre 017K no inicia, aprueba ni completa Mundo IV.

## Documentación consolidada

Las fuentes vivas quedan gobernadas por:

- [CURRENT_STATE.md](../status/CURRENT_STATE.md);
- [GVO_STATION3_COMPLETE.md](../status/GVO_STATION3_COMPLETE.md);
- [Arquitectura técnica](../05_ARQUITECTURA_TECNICA.md);
- [Inventario de assets](../assets/ASSET_INVENTORY.md);
- [Roadmap](../ROADMAP.md);
- [Handoff de cierre](../../GVO-HANDOFF-CIERRE-ESTACION-III.md).

`docs/status/README.md` diferencia contratos canónicos y registros históricos. Los insumos `W3_*` TEMP quedan etiquetados como inventario editorial legacy no consumido por runtime; W3→W4 y transiciones posteriores conservan sus gaps TEMP reales.

## Exclusiones

No se añadieron al repositorio ZIP, logs, caches, `dist`, `node_modules`, configuración local de asistentes, secretos, patches ni artefactos de Downloads. La evidencia bruta y los reportes de cierre permanecen fuera de Git.
