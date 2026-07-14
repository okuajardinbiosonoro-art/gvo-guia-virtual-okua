# Estación III completa — Cuaderno Pixel de Pruebas

Estado: `CERRADA_APROBADA_FINAL`
Aprobación: `HUMAN_APPROVED`
Ruta: `/estacion/3`
Actualizado: 2026-07-14

## Objetivo y narrativa

Estación III muestra cómo OKÚA aprende mediante observación, construcción, prueba, error y ajuste. El cuaderno no presenta un sistema perfecto ni atribuye el resultado a magia: convierte cada resultado en una pista verificable para la siguiente decisión.

El recorrido final es:

```text
PLANTA → PROTOTIPO → SEÑAL → AJUSTADO → Continuar
```

- `PLANTA`: observar una planta viva, reconocer la relación que se quiere cuidar y guardar la primera pista.
- `PROTOTIPO`: construir un primer montaje, probar sus componentes y registrar también lo que no funcionó.
- `SEÑAL`: capturar la señal, inspeccionar ruido e inestabilidad y congelar la evidencia que orienta el ajuste.
- `AJUSTADO`: confirmar que la mejora surge de prueba, error y ajuste; habilitar `Continuar`.

El copy runtime canónico vive en `src/screens/World3Root/station3Content.ts`. Los documentos numerados anteriores que describen una experiencia temporal o slots `W3_*` TEMP son históricos y no gobiernan esta versión cerrada.

## Arquitectura runtime

`src/screens/World3Root/World3RootScreen.tsx` compone la experiencia y mantiene el estado de la instancia montada. Sus colaboradores principales son:

| Pieza | Responsabilidad |
| --- | --- |
| `World3PageTurnLayer` | Hoja real compartida por ambas caras del giro, geometría congelada durante la transición y tiempos normal/reduced. |
| `World3LiaActor` | Actor decorativo de Lía basado en cinco poses runtime aprobadas. |
| `PlantNarrativeSequence` / `PlantNotebookAnnotations` | Secuencia y anotaciones semánticas de PLANTA. |
| `PrototypeNarrativeSequence` / `PrototypeTestRoute` / `PrototypeNotebookAnnotations` | Ensamble, prueba, aprendizaje y confirmación de PROTOTIPO. |
| `SignalNarrativeSequence` / `SignalTraceDisplay` / `SignalNotebookAnnotations` | Captura, inspección y evidencia determinista de SEÑAL. |
| `World3IndexNotebookMarks` | Marcas progresivas del índice según registros completados. |
| `GestureHint` | Ayuda visual dirigida al siguiente registro disponible. |
| `world3RuntimeAssets` | Rutas únicas del paquete runtime de Estación III. |
| `world3SemanticAssetManifest` | Rol, modo de consumo y responsabilidad semántica de cada familia visual. |

## Máquina de estados

La fase superior distingue `entering`, `index`, `turning` y `page`. `turning` conserva registro, dirección (`open` o `close`) y subfase para evitar saltos visuales; `page` delega el avance a la secuencia específica de PLANTA, PROTOTIPO o SEÑAL.

El atributo `data-station3-state` expone estados de QA reproducibles:

- entrada e índice: `station3_entering`, `station3_index`;
- apertura y retorno: `station3_turning_to_*`, `station3_returning_from_*`;
- páginas: `station3_plant_page`, `station3_prototype_page`, `station3_signal_page`;
- gates: `station3_prototype_unlocked`, `station3_signal_unlocked`;
- cierre: `station3_adjusted_unlocked`, `station3_ready_to_continue`, `station3_exiting`.

Los marcadores son inocuos en producción, no contienen datos sensibles y permiten verificar regresiones sin convertir el DOM en fuente narrativa.

## Índice, gates y revisitas

Cada registro tiene uno de tres estados visuales y semánticos: `locked`, `available` o `completed`.

| Condición | Resultado |
| --- | --- |
| Inicio | PLANTA disponible; PROTOTIPO y SEÑAL con bloqueo suave. |
| PLANTA completada | PROTOTIPO disponible. |
| PROTOTIPO completado | SEÑAL disponible. |
| Tres registros completados | Se desbloquea `AJUSTADO`; después aparece `Continuar`. |
| Modo revisita | Los tres registros permanecen seleccionables sin perder el cierre. |

Los bloqueos no son callejones sin salida: Lía explica que falta la pista anterior. Al regresar desde una página, el índice conserva geometría estable y restaura el foco del registro para navegación por teclado.

El progreso (`completed`, subfases y revisitas) reside solo en estado React de `World3RootScreen`. Una recarga desmonta la instancia y reinicia Estación III; no se escribe progreso de esta estación en `localStorage` ni `sessionStorage`.

## Page-turn

La transición usa `world3_notebook_turn_page_v01.png`, no una hoja procedural. `world3PageTurnGeometryContract` define `680 ms` para movimiento normal y `120 ms` con reduced motion. La geometría del viewport se congela mientras gira la hoja; los límites alfa del PNG se compensan desde el origen sin alterar el asset. La capa del índice y la del detalle usan `aria-hidden` e `inert` para que solo la cara activa participe en lectura e interacción.

## Lía

`World3LiaActor` consume cinco poses aprobadas desde `world3RuntimeAssets.lia`:

- `idle`;
- `pointing`;
- `observing`;
- `confirming`;
- `closure`.

La imagen es decorativa; el mensaje accesible permanece en DOM. La pose responde a la fase actual, al retorno al índice, al desbloqueo de `AJUSTADO` y a la salida.

## PLANTA

PLANTA recorre `entering → observing → ready → confirmed`; al abrirla de nuevo usa `revisit`. La narrativa muestra observación, cuidado y registro. El control final guarda la pista y vuelve al índice.

## PROTOTIPO

PROTOTIPO recorre ensamble, prueba, aprendizaje, resumen y confirmación mediante `PrototypeTestRoute` y su secuencia narrativa. La revisita presenta el resumen ya estable sin repetir obligatoriamente la progresión temporal.

## SEÑAL

SEÑAL recorre captura, inspección, evidencia, resumen y confirmación. `SignalTraceDisplay` usa conjuntos de puntos constantes: la traza es determinista, se revela una sola vez en movimiento normal, marca regiones de ruido, caída y límite, y queda congelada como evidencia. Reduced motion omite el barrido animado y presenta el estado legible sin bucle.

## AJUSTADO y salida

Después de completar los tres registros, el sello pasa por `hidden → unlocking → ready`. Solo en `ready` aparece `Continuar`. La salida abre la ruta técnica de transición Mundo III → Mundo IV; esto no implica que Mundo IV esté aprobado.

## Assets y manifests

Los 15 assets aprobados de Estación III viven bajo `public/assets/gvo/stations/world-3/notebook-pixel/runtime/` y tienen copia registrada bajo `public/assets/gvo/current-used/world-3-root/`. El detalle de formato, dimensiones, SHA-256, función y consumidor se mantiene en [ASSET_INVENTORY.md](../assets/ASSET_INVENTORY.md).

`world3RuntimeAssets.ts` evita rutas dispersas. `world3SemanticAssetManifest.ts` separa decoración y significado: textura ambiental, cuaderno, hoja de giro, poses de Lía, figuras de registros y cuatro sprite sheets de anotaciones. Texto, estados, controles, checks y evidencia siguen siendo semánticos en DOM.

## Ayudas, responsive y accesibilidad

- `GestureHint` se ancla al siguiente registro `available`, aparece con retraso y desaparece cuando no hay un siguiente gate; su etiqueta describe el destino.
- Los modos `compact-scroll`, `portrait-balanced`, `tablet-portrait` y `tablet-landscape` reorganizan cuaderno, narrativa y Lía sin cambiar el orden del recorrido.
- Pointer y teclado comparten los mismos gates. Enter/Espacio registran modalidad de teclado, y el foco vuelve al registro correspondiente tras cerrar la página.
- Botones, títulos, estados y mensajes permanecen en DOM; las imágenes decorativas usan texto alternativo vacío.
- Las capas no interactivas se excluyen mediante `inert` y `aria-hidden`.
- `prefers-reduced-motion` reduce page-turn a `120 ms`, elimina recorridos repetitivos y mantiene visible el resultado final de cada secuencia.
- Cámara, QR y permisos sensibles permanecen bloqueados.

## Transición Mundo II → Mundo III

La entrada final a Estación III es `/transition/world-2-to-world-3 → /estacion/3`. Es pasiva y automática: no presenta CTA ni depende de una acción adicional. Usa `2300 ms` en movimiento normal y `1000 ms` con reduced motion, y navega reemplazando la entrada de transición para no dejar una pantalla intermedia útil en el historial.

## QA y aprobación humana

El cierre cubre estados, gates, revisitas, pointer, teclado, recarga, movimiento normal, reduced motion, móvil compacto, tablet portrait y tablet landscape, además de lint, tests y build del repositorio.

El Browser integrado completó el smoke de diez casos y el recorrido pointer. El controlador no produjo la activación nativa de botones por Enter/Espacio y la captura raster agotó su tiempo de espera; la suite focal cubre teclado, retorno de foco y `preventScroll`, y no se fabricaron capturas. La revisión humana explícita aprobó la composición de Estación III y la transición pasiva Mundo II → Mundo III; por ello el estado final es `CERRADA_APROBADA_FINAL` / `HUMAN_APPROVED`.

## Commit de cierre y evidencia

Para evitar un hash autorreferencial imposible, el commit de cierre se identifica de forma estable como **el commit que contiene este documento y cuyo asunto es**:

```text
feat(world3): complete Station III and finalize World II transition
```

El SHA resuelto después de crear el commit, la verificación del push y el inventario final se registran en los entregables externos `commit_details.md`, `push_verification.md` y `final_repository_inventory.csv` del paquete de cierre `GVO_ST3_017K_CLOSEOUT_*`; no se crea un segundo commit solo para incrustar su propio hash.

## Fuera de alcance

Mundo IV conserva una base técnica preexistente, pero está **NO APROBADA**. El ticket `GVO-017K-R1` no inició desarrollo de Mundo IV y este documento no lo declara listo, aprobado ni cerrado.

Los documentos numerados de `docs/status/` se conservan como trazabilidad histórica. [README.md](README.md) explica su relación con los contratos canónicos.
