# ADR-0010 — Candidata editorial y participación opcional

Fecha: 2026-10-23. Estado: implementada localmente, pendiente de revisión del
responsable humano único. Encargo: GVO_INTEGRACION_FINAL_AUTONOMA_2026-10-23_v1.

El encargo actual autoriza integrar las salas sin gates humanos intermedios.
No autoriza publicar, activar el chat M3/M4 ni modificar campo.

Se conserva el orden físico y `/qr/w2`…`/qr/w5`. Continuar una actividad significa
resolver su salida voluntaria; no acredita lectura, práctica ni acierto. Las
salas I/II/IV añaden continuación a sus checkpoints preservando los hechos reales.
Sala V presenta un cierre manual legible antes de ir a Mirador.

Sala III conserva `gvo.station3.v1` sin reinterpretar prototipos antiguos como
práctica. `gvo.station3.practice.v2` conserva las declaraciones explícitas guardadas
por la primera candidata. Tras la observación del responsable, navegar por el
cuaderno sólo registra visitas: ya no exige declarar lectura ni práctica. La
salida registra páginas no visitadas y prepara el QR; únicamente el QR válido
escribe la finalización global. Cancelar la cámara conserva la página abierta.
El avance antiguo continúa válido; no se infieren lectura ni práctica física.

Sala V conserva `gvo.station5.v1` y usa `gvo.station5.quiz.v1` para respuestas,
aciertos y omisiones. Cada pregunta suma como máximo una vez; el premio físico
no depende de un umbral inventado. El reset transaccional incorpora ambas claves
nuevas a su allowlist y mantiene preferencias/datos ajenos.

Se unifica la tipografía local Pixelify Sans, se conservan textos en DOM y las
fuentes de conocimiento quedan candidatas REVIEW. El flag conversacional sigue
desactivado. Los tres originales se producen y descargan en un único hilo Images;
el símbolo se compone desde el PNG de marca, sin redibujar. Los maestros quedan
fuera del runtime y los derivados tienen espejo/hashes. Runtime y recursos siguen
locales. La revisión de `dist` puede servirse exclusivamente en loopback sin
modificar las condiciones TLS del despliegue de campo.

`tools/dev/preview-local-review.mjs` sirve `/__review` sólo en loopback: prepara
progreso global de prueba con una acción explícita, conserva el valor previo y
no crea lecturas, práctica ni respuestas. El HTML no se copia a `dist`. La
ruta queda fuera del fallback del service worker para que se pueda volver al
acceso local después de visitar la aplicación. Los guards del visitante siguen
activos y el runtime no incorpora una ruta para saltar los QR.

La revisión de acabado solicitada por el responsable utiliza cuatro piezas
adicionales del mismo hilo Images: folio adaptable, mesa vertical con los ocho
componentes DOM originales, marco de lectura y umbral del QR. El cuaderno emplea
border-image con texto fluido; la mesa cambia de dirección artística según
orientación. Se recuperan el paso de página y los movimientos contextuales de
Lía; las animaciones permiten interacción inmediata y respetan movimiento
reducido. Cada sala dispone de una salida contextual mediante el mismo gate QR.
La reducción de controles no debilita persistencia, QR secuencial ni revisita.

La cámara conserva el foco dentro del diálogo, permite Escape y devuelve el foco
al acceso de salida. El QR válido sigue siendo la única confirmación interestación.
Para revisar builds locales sucesivos, el helper elimina únicamente el registro
del service worker de su propio origen loopback antes de abrir el build actual;
no borra progreso, preferencias ni cookies. El test del helper verifica también
la restauración byte a byte tras activar el nuevo service worker. Este mecanismo
no forma parte de dist ni cambia la operación de campo.
