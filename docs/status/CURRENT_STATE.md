# Estado actual del proyecto

Actualizado: 2026-07-14

## Estado canónico

- Estación III / Mundo III — Cuaderno Pixel de Pruebas: `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`).
- Ruta runtime: `/estacion/3`, servida por `World3RootScreen`.
- Recorrido aprobado: `PLANTA → PROTOTIPO → SEÑAL → AJUSTADO → Continuar`.
- Transición Mundo II → Mundo III: cierre final pasivo y automático hacia `/estacion/3`, sin CTA; duración `2300 ms` en movimiento normal y `1000 ms` con reduced motion.
- Contrato completo de Estación III: [GVO_STATION3_COMPLETE.md](GVO_STATION3_COMPLETE.md).
- Contrato previo de Mundo II: [WORLD_II_FINAL.md](../worlds/WORLD_II_FINAL.md).

## Contrato de Estación III

El índice aplica gates secuenciales: solo está disponible el siguiente registro; los demás permanecen con bloqueo suave. Al cerrar cada página se vuelve al índice estable, se habilita la siguiente y se conserva la posibilidad de revisitar registros completados. Tras completar los tres registros aparece `AJUSTADO` y luego el control `Continuar`.

La experiencia usa una hoja real para el page-turn (`680 ms` normal, `120 ms` reduced motion), cinco poses aprobadas de Lía mediante `World3LiaActor`, assets runtime declarados en `world3RuntimeAssets` y responsabilidades semánticas declaradas en `world3SemanticAssetManifest`. La traza de SEÑAL es determinista, se revela una vez y queda congelada como evidencia.

El progreso de Estación III vive únicamente en el estado de la instancia montada. Las revisitas funcionan mientras esa instancia permanece montada; una recarga reinicia el recorrido. No hay persistencia de Estación III en `localStorage` ni `sessionStorage`.

## Experiencia y acceso

- Responsive: composiciones específicas para móvil compacto, retrato balanceado, tablet portrait y tablet landscape.
- Interacción: pointer y teclado, restauración de foco al índice y estados semánticos `locked`, `available` y `completed`.
- Ayuda: `GestureHint` señala el siguiente registro disponible sin sustituir su etiqueta accesible.
- Accesibilidad: controles nativos, etiquetas accesibles, capas inactivas fuera del orden de interacción y soporte de `prefers-reduced-motion`.
- Permisos sensibles: cámara y QR permanecen bloqueados en esta pantalla.

## QA y aprobación

Las validaciones automatizadas de código, estados, rutas, responsive y reduced motion forman parte del cierre. El Browser integrado completó el smoke de diez casos y el recorrido pointer; sus únicas limitaciones fueron la activación nativa por Enter/Espacio desde el controlador de automatización y el timeout de captura raster. La suite focal cubre teclado y foco, y la revisión humana explícita aprobó Estación III y la transición pasiva Mundo II → Mundo III.

## Límites de alcance

Mundo IV conserva únicamente una base técnica preexistente. No está aprobado, no fue iniciado por el ticket `GVO-017K-R1` y no debe presentarse como siguiente experiencia terminada.

Los documentos numerados de `docs/status/` son evidencia histórica del momento en que se emitieron. No reemplazan este estado actual ni los contratos canónicos enlazados arriba.
