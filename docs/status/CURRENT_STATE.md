# Estado actual del proyecto

Actualizado: 2026-11-13

## GVO 1.1.2 · versión oficial del recorrido

MOMOTTO_PC opera GVO 1.1.2 desde `d6c0e1d0fa37467240f31cf4412e845509be1097`.
La precarga de instalación de Workbox baja de 72 a 44 archivos y la
presentación de Carga conserva sus 12 segundos. Campo verificó la entrada
`/qr/start` por HTTPS, el DNS del MikroTik y el kit de seis QR. La prueba
autorizada de 20 clientes simulados pasó. Quedan pendientes la cámara y la
Polaroid en móviles físicos y la observación de la radio con equipos reales.
[Acta](../releases/GVO_1.1.2.md) · [Ticket](../tickets/GVO_PRECARGA_WORKBOX_20261113.md).

## GVO 1.1.1 · versión anterior del recorrido

La explicación, la mesa y el repaso de Sala IV usan seis piezas. La pieza
«Microcontrolador» conserva el identificador interno para compatibilidad con
el progreso. El marco de foto incorpora una enredadera de flores y sustituye
el emblema dorado por «La naturaleza también canta». José David comprobó en su
iPhone el recorrido, las seis piezas de Sala IV y la Polaroid con la enredadera
definitiva. Aprobó la publicación en `main` con la frase provisional mientras el
escritor prepara el texto final. El despliegue en campo queda pendiente.
[Acta](../releases/GVO_1.1.1.md) · [Ticket](../tickets/GVO_SALA_IV_FOTO_20261113.md).

## GVO 1.1.0 · versión anterior del recorrido

José David completó el recorrido de 1.1 en su iPhone, confirmó el nivel de
sonido y comprobó que el cuaderno de Sala III abre al primer toque. Autorizó el
cierre y el registro en `main`. El [acta de 1.1.0](../releases/GVO_1.1.0.md)
registra el alcance, la validación y los límites de campo.

La versión incluye la foto con Lía, el movimiento ambiental del Mirador, los
14 MP3 originales, el volumen general y la precarga de audio y recursos por
sala. La [versión 1.0.0](../releases/GVO_1.0.0.md) y las revisiones anteriores
se conservan como antecedentes.

## Retoque visual de Sala V · candidata para revisita

El responsable revisó en su iPhone la candidata anterior y pidió un
[retoque de acabado en Sala V](../tickets/GVO_SALA_V_RELIEVE_20261112.md).
Durante las preguntas, la Lía registrada se dibuja al 130 % sobre un
medallón y las tarjetas y pedestales tienen más relieve. El resultado con
confeti conserva su escena y su tratamiento visual. La revisión en el
iPhone de este ajuste precede al trabajo de Instagram.

El índice compilado tiene SHA-256
`dc4c14eb48fb5b8b19e1de8772cde2dde11a8ad13d81b66629dbb51b6d848dcb`.
Las pruebas, la revisita y el enlace temporal constan en
`.tool-reports/revision-iphone-20261112-sala-v/EXECUTION_STATE.json`.

## Segunda revisión en iPhone · nueva candidata

El [ticket de la segunda ronda](../tickets/GVO_REVISION_IPHONE_RONDA2_20261112.md)
recupera la preportada de Lía en el acceso directo, mejora la lectura del
cierre de I, prolonga el filtrado de II y centra su rótulo al activarlo si
queda fuera de vista. III conserva el literal del escritor y añade beneficios
perceptivos. IV vuelve a mostrar los textos anteriores con una explicación
visual de los dos toques antes del tiempo de juego.

Sala V usa el mismo fondo en todas las preguntas y el resultado, con un eje
centrado para los rótulos, las opciones, la respuesta y Lía. La revisión
consultiva comparó tres capturas y devolvió `PASS_CON_LIMITES`. La revisión
física de esta candidata queda pendiente.

El índice de la nueva compilación tiene SHA-256
`a9643d26bd9934daf77b0e895fc26057990eab1426ef3aa9934dca24eaf287c7`.
La vista local está en `http://127.0.0.1:8894/inicio`. La evidencia y el enlace
temporal constan en `.tool-reports/revision-iphone-20261112-ronda2/EXECUTION_STATE.json`.

## Revisión en iPhone · candidata local de correcciones

El [ticket de revisión](../tickets/GVO_REVISION_IPHONE_20261112.md) recoge las
observaciones del responsable sobre las salas II–V. El filtrado de II vuelve
a barrer de izquierda a derecha. III conserva el texto del escritor y suma
dos ejercicios de atención y escucha en Beneficios. IV explica los dos toques
antes de iniciar el tiempo. V reúne la trivia y el resultado sobre el mismo
fondo de galería y concentra pregunta, alternativas y respuesta en un panel.

La [regla vigente de audio](../01_REGLAS_NO_NEGOCIABLES.md) admite archivos
locales entregados por el diseñador de sonido. El inventario y los puntos de
reproducción se completarán al recibir la entrega. El estudio de Instagram se
retoma después de la segunda revisión del responsable.

El índice compilado de la candidata tiene SHA-256
`9c0c8d9e5e13fd991288a70829d122759c269e0adc7691827bc12e5a59492385`.
Pasaron el recorrido automatizado desde Inicio hasta Mirador con cuatro
lecturas QR y seis perfiles de Sala V en Chromium. Cada perfil mantuvo
la misma imagen de fondo durante las cuatro preguntas y el resultado.
Queda pendiente la revisión física de esta candidata en el iPhone.
La vista local está en `http://127.0.0.1:8892/inicio`. La evidencia y el enlace
temporal de revisión se registran en
`.tool-reports/revision-iphone-20261112/EXECUTION_STATE.json`.

## Coherencia editorial 128 · candidata local para revisión

El [ticket de coherencia](../tickets/GVO_COHERENCIA_20261112.md) unifica la
escala de títulos y el tratamiento de las salidas de las cinco salas. El
lector QR anuncia el mismo destino que se muestra en el botón. Las escenas,
la narrativa editorial y los 310 archivos de recursos y manifiestos
comparados se conservan.

Índice compilado de la nueva candidata: SHA-256
`3cdf0f0d71f58f67f31ccc5a69ed5570e2c7c24b7a4fd3e0d7569db54f42ec3f`.
La copia extraída de Windows pasó 721 pruebas unitarias, seis perfiles
visuales y el recorrido desde cero con cuatro lecturas ZXing en laboratorio.
Se verificaron la persistencia de Sala III, las ocho luces de éxito manual
en Sala IV, las cuatro rondas y el premio 4/4 de Sala V, la revisita y el
reinicio de 15 claves. El chat contextual devolvió
`PASS_WITH_DECLARED_LIMITS`.

La candidata, las capturas y el estudio IEEE sobre foto con Lía e Instagram
están en `.tool-reports/coherencia-gvo-20261112/entrega/`. El estado retomable
es `.tool-reports/coherencia-gvo-20261112/EXECUTION_STATE.json`. La vista
local está en `http://127.0.0.1:8889/inicio`. Se mantienen pendientes la
revisión humana, la cámara física, la decisión de taquilla y el ordinal
clínico 045. La publicación y el despliegue siguen pendientes.

## Integración editorial 128 · candidata para revisión

El encargo y sus fuentes constan en el
[ticket editorial del 11 de noviembre](../tickets/GVO_EDITORIAL_20261111_FINAL.md).
La revisión bilateral cerró técnicamente Inicio, Portada y las salas I–IV.
Sala III conserva el cuaderno de seis folios y siete ilustraciones nuevas.
Sala IV comparte los ocho textos entre explicación y repaso e ilumina las
ocho casillas al resolver el juego manualmente. Se verificó también la
expiración de 90 segundos activos.

La revisión bilateral de Sala V y Mirador dio `PASS` consultivo. La matriz
conserva las 112 propuestas y las 97 entradas Word. Verificó 111 propuestas y
difirió la ampliación clínica del ordinal 045 por falta de respaldo.

El índice compilado tiene SHA-256
`a66726f044b02b1de612becbb32b5a054a8f5eb06c0dc718d43beafd5aa60835`.
La copia extraída del paquete Windows pasó el recorrido fresco con cuatro QR
en laboratorio, el premio 4/4, la revisita y el reinicio de 15 claves.
Pasaron 721 pruebas unitarias. El expediente y los dictámenes están en
`.tool-reports/editorial-final-20261111/EXECUTION_STATE.json`.

La candidata queda para revisión del responsable. La publicación, el
despliegue de campo y las pruebas de cámara física siguen pendientes.

## Herramienta editorial del escritor · 29-10-2026

La petición directa del responsable autoriza un paquete nuevo desde OBS05
build02 con el editor local conocido: guardado único verificado, borradores
recuperables, aviso de salida, cuadros añadidos/ocultados/movidos y controles
simples de color/tipografía. No autoriza cambios del visitante ni publicación.
El [ticket](../tickets/GVO_EDITORIAL_20261029_V4.md),
[ADR-0014](../decisions/ADR-0014-editorial-local-v4.md) y
[estado retomable](../narrative/editor_local_2026-10-29/EXECUTION_STATE.json)
separan esta herramienta de la revisión humana pendiente de la candidata.

El editor se mantiene en `tools/editorial/local-editor/`. Se verificaron los
351 archivos de fuentes protegidos y los 349 de la candidata, sin diferencias.
La copia editorial conserva 348 módulos/assets idénticos; su índice tiene el
bootstrap explícito y el registro SW desactivado. Las propuestas históricas se
conservan como referencia, sin aplicarlas automáticamente. La coordinación y
revisión consultiva siguen en el mismo ChatGPT contextual.

17 pruebas unitarias, cuatro suites integradas y una regresión focal posterior a R3 cubren recuperación, guardado,
fallos de cuota/conexión/acuse, concurrencia, selección y anclas tras React,
estilos/arrastre, todas las salas/transiciones, exportación e importación y
restauración limpia en Windows con Node portátil. No equivalen a certificación
física de un iPhone ni aprobación editorial humana. El recibo final del paquete
y las limitaciones se registran en el estado retomable.

La entrega final es `GVO_Editor_Local_Windows_v4_2026-10-29_r2.zip`, en Descargas:
170.347.328 bytes, SHA-256
`9fd5cdd21f356f38278f396f6eaa7744cfa2a2864b4a60cc739051be013e6281`.
Sus 380 entradas pasaron CRC/manifiesto. Los dos hallazgos consultivos de R3
fueron corregidos y validados con regresiones focales, preservando el original.

## Revisión activa OBS05 — feedback humano posterior a OBS04 build06

El responsable pidió centrar el título de III, retirar o integrar «conectar» y
quitar los cuadros claros de los números conservando su posición. En V pide
cohesión entre los cuatro componentes, mayúsculas iniciales, premio sólo4/4,
tres reintentos y Lía protagonista del resultado. Las demás salas se conservan.
El umbral4/4 es una instrucción humana nueva que sustituye el contrato anterior;
la cifra de reintentos no procede del escritor. El responsable aclaró:
«Cuestionario completo: una ronda inicial y hasta tres reintentos.» R1 y R2
originales se recibieron, validaron estrictamente y conciliaron con el mismo
ChatGPT contextual antes de integrar el dominio de rondas completas.

Fuentes y consumidores inspeccionados; baseline compilado V capturado sobre
build06 con cinco PNG nativos. Ese caso PASS certifica la captura del estado
anterior, no la corrección visual. El
contexto36 v2 (18.656.804 bytes, SHA d75eeee4f1f69a72752da644f0ec514e7254dec2af5425bfaa150040e9f706e0)
pasó verificación independiente y fue enviado al mismo ChatGPT. Se reprodujeron
los negativos de III, premio con0/4 y respuesta incorrecta sustituible sobre
build06, con PNG y fuentes ejecutadas preservados. III y V ya están integradas
en fuente; V usa un registro separado de cuatro rondas, cierre explícito y premio
sólo por4/4 de una misma ronda. V1 conserva sus bytes y derechos anteriores,
sin acreditar una ronda nueva. El reinicio global incluye15 claves, con snapshot,
rollback y copia verificada para la recuperación exclusiva de datos corruptos.
Los detalles están en [ADR-0013](../decisions/ADR-0013-obs05-whole-quiz-rounds.md).

La suite completa actual verificó719 pruebas en69 archivos; TypeScript02 y
lint01 pasan. La candidata aislada OBS05 es `build02`, índice SHA-256
`96d518d5887e4e8fe9da7a489ab82171cbff830f4c74fdfae367e0eaf70fc941`.
Vite/PWA y351 fuentes estables;64 casos compilados del mismo índice PASS:
40 de III,20 visuales V, bloqueo de respuesta1, no-premio0/4 y3/4 y recorrido
fresco1. El recorrido obtiene por UI cinco salas, cuatro QR con ZXing real sobre
cámara canvas, ronda0/4→reintento explícito→4/4, Mirador, revisita y reset15.
No equivale a cámara física del iPhone ni aprobación humana.

La inspección nativa build01 detectó dos detalles adicionales con texto ampliado:
columna del índice III demasiado estrecha y un rótulo V bajo el control fijo.
Se reprodujeron, corrigieron en CSS y validaron en build02. Todos los TS/TSX y
tests unitarios permanecen iguales entre ambas candidatas. Los fallos previos
de arranque de worker, tipado y suite interrumpida se preservan sin retag.
La revisión editorial verificó47 objetos III/V, sin nuevas paráfrasis de las
preguntas. DELTA38 v1 (25.628.595 bytes; SHA-256
`9102b58a34dc8e2ff8e494437f72cf660a05e4a362e0436cc2360c774cb1528b`)
pasó verificación independiente de sus779 entradas y fue enviado al mismo
ChatGPT contextual. Su original R3 (19.135 bytes; SHA-256
`be103d2a2afb997b2869719633d42c729d5dd109b415ab5b9fa937d989e106c8`)
fue validado estrictamente y conciliado: `READY_WITH_DECLARED_LIMITS`,18
criterios y cero bloqueantes nuevos. La revisión humana sigue pendiente.
La vista HTTPS temporal entrega el mismo índice build02 y
la hoja externa de cuatro QR está verificada en el PC. Los recibos actuales
están en `revision-observaciones-05/mobile-review/`; este acceso temporal
autorizado no equivale al despliegue de campo.
El cierre está en [Conciliación R3](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-05/RECONCILIACION_R3.md)
y [Entrega candidata](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-05/ENTREGA_CANDIDATA_OBS05.md).
ChatGPT inspeccionó fuentes/evidencias sin ejecutar otra suite ni un navegador
de producto. La comprobación final confirma351 fuentes e índice sin cambios.
Una deuda de formato heredada, sin efecto funcional, conserva su disposición
explícita en `GIT_FORMAT_CHECK_DISPOSITION.json`; no se declara PASS.
El repositorio sigue en main79a31106, remoto igual y divergencia0/0, con un
worktree de integración preservado. No se autorizaron ramas, commits, push ni
despliegue. La referencia humana a publicar describe el cierre futuro.

[Observaciones OBS05](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-05/00_OBSERVACIONES_RESPONSABLE.md)
y [estado retomable](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-05/EXECUTION_STATE.json).

## Antecedente OBS04 — candidata revisada build06

El responsable terminó el recorrido móvil y solicita corregir duración/preparación
de entrada, composición de Portada, seis transiciones vacías y Salas I–V. Sala III
es la prioridad visual; IV conserva el juego y añade su recorrido explicativo
previo. Mirador cumple y se conserva. La aceptación técnica OBS03 no equivale a
aceptación visual humana. Esta revisión posterior sustituye los criterios
incompatibles sin reescribir ni borrar los paquetes y pruebas históricos.

Los intercambios31/32 cerraron metodología y contrato R2 con el mismo ChatGPT
contextual. Antes de editar producto se reprodujeron dos transiciones con opacidad
cero durante carga/404 y los fallos de duración/handoff de entrada sobre build12.
La candidata aislada final OBS04 es `build06`, índice SHA-256
`4dc563dc1a92f53d74aec29da314da7e1b8700ab997cfef5fad21860b954f0ab`. Vite/PWA06 y 332 fuentes estables;
9 casos compilados actuales PASS (V focal4 + V galería4 + recorrido fresco1), sin errores/skips/flaky.
La suite de 670 tests/66 archivos corresponde a build05 y conserva su identidad;
TS/TSX/package/lock/tsconfig permanecen iguales en el delta CSS06. Los negativos
anteriores permanecen preservados y no se reclasifican como PASS.

R4 recibido/verificado: READY_WITH_DECLARED_LIMITS. Su LOW B01 fue reproducido,
corregido y validado; E01 se reforzó con seis capturas intermedias nativas reales,
sin convertirlas en prueba de todos los fotogramas. R5 delta recibido/verificado:
`READY_WITH_DECLARED_LIMITS`, candidata lista para revisión del responsable humano único.
Acceso temporal HTTPS y cuatro QR fuera de la aplicación están preparados;
no hay controles de prueba. Se mantiene la autorización autónoma de integración,
pero aprobación humana, publicación Git, publicación definitiva y campo siguen
pendientes. El acceso temporal no equivale a despliegue de campo.

[Observaciones OBS04](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-04/00_OBSERVACIONES_RESPONSABLE.md)
y [estado retomable OBS04](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-04/EXECUTION_STATE.json).

## Antecedente OBS03 — corte histórico anterior al feedback OBS04

El responsable completó la revisión de la candidata y pidió correcciones en
Carga, Portada, las seis transiciones y Salas I–V. Mirador se conserva. Sus
observaciones posteriores sustituyen los criterios anteriores incompatibles
(omitir presentación/transiciones, acceso QR prematuro, folio III nuevo y marca
pegada). La implementación OBS03 está en marcha bajo el contrato OBS03.2 conciliado IA↔IA.

Por instrucción directa posterior, ChatGPT contextual prepara y cuestiona la
metodología; Codex ejecutará y devolverá evidencia para revisión bilateral. El
responsable sólo interviene por necesidad estricta o al revisar la candidata
completa. R1, R2 y R3 fueron recibidos y conciliados; el delta OBS03.2 de R2 tiene
SHA-256 `e06209be0dc49184fcba2585928bf103cc321b6b61312d056b351d28c02f1b20`.
La candidata actual es build12, índice SHA-256
`47f05eb54200552e388d066fcfa16c4c656db60314ffcfee764f0192dea5aad2`,
servida de forma aislada en `http://127.0.0.1:4184/`. Los assets del único hilo
Images están verificados, derivados, registrados e integrados. Mirador incorpora
35 traducciones EN con estado REVIEW y conserva las 35 entradas ES exactas.
La procedencia editorial separa 120 objetos recientes y 43 antecedentes no sumables.

R4 independiente delimitó siete correcciones y cuatro observaciones, ya
implementadas. La suite completa nueva pasó:62archivos/619pruebas. Desde ese
corte no cambió el JS/TS runtime; las correcciones posteriores de II son CSS y
tienen ocho focales actuales PASS, incluidos movimiento natural/reducido,
texto200%, títulos, QR y revisita. El recorrido fresco final separado pasó:
cinco salas ganadas por UI, cuatro QR mediante ZXing de producción sobre cámara
canvas, Mirador, revisita con otro QR, retorno y reinicio confirmado. Typecheck08,
lint09 y build12 PASS. Se mantienen las advertencias de bundle/imports de Vite.

Las matrices amplias anteriores, el contraste compuesto, los clips pixel y las
seis recuperaciones conservan sus cortes propios y límites. No se suman conjuntos
solapados ni se retaggean resultados. Se conservan los fallos históricos, incluida
la suite594/10 previa, y las correcciones verificadas que condujeron al619actual.

El intercambio29 envió el delta final al mismo ChatGPT contextual:98.931.334B,
1241entradas, SHA-256
`89014e20bf131dacdc805fec434c6cf0d42d9a110491904cc7df96a162104c41`.
CRC/SHA/manifiesto/selección/fuentes actuales pasaron el checker independiente.
Se omitieron sólo30copias exactamente iguales, con alias; no se perdieron datos
únicos, reportes o capturas actuales. La conciliación del delta quedó cerrada:
los16hallazgos B/N/E están resueltos o satisfechos dentro de sus límites,
sin nuevos bloqueos técnicos y con readyForOwnerReview=true. El JSON original
20557B/SHA8278d8b4f50186bc0956cbe35002eb69326d0401ffb66b92e10de39bbd404981
fue recibido byte por byte y validado estrictamente; el primer retorno corrupto
se rechazó y conservó. La aprobación humana, publicación y despliegue siguen
en false; la revisión/retroalimentación de José David es el siguiente paso.

[Corte técnico final](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/FINAL_CLOSURE.json)
y [lectura breve del delta](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/R4_DELTA_REVIEW_BRIEF.md).

[Entrega para revisión](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/ENTREGA_BUILD12.md)
y [validación de la recepción bilateral](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/incoming/r04-delta/RECEIPT_VALIDATION.json).

El detalle retomable está en `EXECUTION_STATE.json` del registro OBS03. No se
certifican cámara física, lectura, usabilidad de todas las edades ni compatibilidad
universal. El `dist` anterior y su corrección de cámara se preservan. El túnel
temporal anterior está detenido; su enlace no es actual. La revisión temporal
autorizada está activa sobre build12 con HTTPS03 verificado y una hoja de QR
separada: [acceso móvil OBS03](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/mobile-review/ACCESO_MOVIL.md).
Este acceso usa Internet y no acredita despliegue de campo. No hay commit, push,
rama, PR ni publicación Git nuevos.

[Observaciones, instrucciones, fuentes e intercambios](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/).

Contrato actual: [ADR-0011](../decisions/ADR-0011-obs03-essential-prepared-journey.md).

## Antecedente preservado — candidata de acabado 02

Encargo vigente: `GVO_INTEGRACION_FINAL_AUTONOMA_2026-10-23_v1`, autorizado por el
responsable humano único para integrar el recorrido completo sin aprobaciones
intermedias. Estado actual: `LOCAL_REVIEW_CANDIDATE_FINISHING_02`.
La primera candidata está preservada como antecedente; no certifica el acabado
actual. Se integraron cuatro assets adicionales del mismo hilo Images, navegación
más discreta y animaciones recuperadas. Implementación y validación local terminadas;
queda pendiente la revisión/aprobación del responsable humano único.

Base comprobada: `79a31106a6286367db83b4075926862eaed7b716`, `main`, actualizada por
fast-forward tras fetch; el candidato se entrega con cambios locales sin publicar.
Se conservaron los archivos no rastreados preexistentes. No se crearon ramas ni PR.

La candidata incorpora editorial, jerarquía tipográfica local común, Lía
contextual, práctica opcional, cuatro preguntas con puntuación 0–4, cierre manual
y revisión desde Mirador. Conserva orden/QR y separa visitas, omisiones y aciertos;
abrir páginas no acredita lectura ni práctica física.
El triángulo de Sala III usa el símbolo extraído del PNG de marca existente.

Build, lint y auditoría de recursos PASS. Unitarias: 50 archivos / 496 pruebas.
Gate de navegador: 208 casos aplicables PASS, 23 no aplicables con flags apagados,
conciliados entre ejecuciones. Matriz: 12 tamaños × 15 rutas, 180 escenarios sin
incidencias, con scroll vertical cuando es necesario. Recorrido continuo de
producción PASS: 566,385 s con lectura pautada a 150 ppm y cuatro QR decodificados
en laboratorio. El extracto de 60,96 s procede de ese único recorrido.

La entrega, estado retomable, cobertura y resultados están en
[`integracion_autonoma_2026-10-23/`](../narrative/integracion_autonoma_2026-10-23/).
ADR aplicable: [ADR-0010](../decisions/ADR-0010-editorial-optional-journey.md).
El flag de Lía conversacional sigue desactivado. Aceptación humana, publicación y
despliegue de campo permanecen posteriores; los gates físicos/de red no cambiaron.

Para la revisión móvil, el responsable autorizó posteriormente una exposición
pública temporal mediante Cloudflare Quick Tunnel, con HTTPS confiable y sin
instalaciones en el móvil. Sirve la misma compilación; la hoja de cuatro QR queda
separada de la aplicación. [Enlace temporal, estado y cierre](../narrative/integracion_autonoma_2026-10-23/revision-acabado/mobile-review/ACCESO_MOVIL.md).
Usa Internet y no certifica el acceso final exclusivamente LAN, DNS/TLS ni cámara
física. No hubo commit, push, release ni despliegue de campo.

Durante esa revisión, el responsable reportó un fallo repetible al abrir la
cámara en Sala I (iPhone 14 Plus/Brave). Se reprodujo en el build minificado:
el primer fotograma sin QR detenía el scanner por clasificar errores mediante
el nombre de clase minificado. Se corrigió con el identificador estable del SDK,
10/10 regresiones focales y comparación de producción blanco→QR válido PASS.
La corrección está en el mismo enlace; el responsable confirmó en su iPhone/Brave
que pudo avanzar a Sala II. El resto del recorrido físico sigue pendiente.
[Evidencia y alcance](../narrative/integracion_autonoma_2026-10-23/revision-acabado/camera-fix/README.md).
Las cifras de la suite completa y el tour anteriores son del acabado previo
a esta corrección; no se repitieron como suite completa después del cambio.

## Estado publicado de referencia — 2026-08-18

```text
FASE = FIELD DEPLOYMENT PREPARATION
RAMA OPERATIVA = main
GVO_DEBT_001→015 = HUMAN_APPROVED / PUBLISHED / RECONCILED
REPOSITORY HANDOFF = READY
FIELD DEPLOYMENT = PENDING PHYSICAL AND NETWORK GATES
```

El repositorio está preparado para continuar en el PC de campo. Esto no
significa que la red, el TLS o la cámara estén certificados en el lugar.

## Contrato del producto en la candidata local

```text
QR → navegador → experiencia
INSTALACIONES EN EL DISPOSITIVO = 0
```

El flujo normal es:

```text
Carga → /inicio → idioma + cámara → Portada → Mundo I
→ QR /qr/w2 → Mundo II
→ QR /qr/w3 → Mundo III
→ QR /qr/w4 → Mundo IV
→ QR /qr/w5 → Mundo V
→ Mirador
```

No existen botones de avance interestación entre Mundos I–V. Los QR inválidos
no escriben progreso ni navegan. La candidata permite revisar el resultado de
Mundo V y continuar explícitamente al Mirador, sin cierre automático.

## Estado publicado del recorrido — referencia histórica

| Área | Estado canónico |
| --- | --- |
| Carga, `/inicio` y Portada | `HUMAN_APPROVED / PUBLISHED` |
| Mundos I–V | Recorrido funcional, secuencial, durable y publicado |
| Transiciones | Copy final, automáticas y publicadas |
| Mirador | Gates 5–8 completos; revisita y reset real publicados |
| Progreso y checkpoints | Versionados, fail-closed y verificados |
| Shell y fullscreen | Compartidos; deuda de plataforma iPhone aceptada y pendiente de certificación de campo |
| PWA/cache | Build local-first y route chunking publicados |
| Cámara y QR | `GVO_DEBT_015 / HUMAN_APPROVED_WITH_FIELD_DEPLOYMENT_DEBT / PUBLISHED` |

## Cierre de deuda GVO_DEBT_001→015

| Tramo | Resultado vigente |
| --- | --- |
| 001–003 | Auditoría, integridad global, evidencia y estados canónicos publicados |
| 004–006 | Checkpoints durables de Mundos I–IV y semántica de guardado publicados |
| 007–008 | Revisita/safe-area y legibilidad responsive publicadas |
| 009–010 | Shell inmersivo, contrato QR de entrada y footprint PWA publicados |
| 011 | `HUMAN_APPROVED / IMPLEMENTATION_PRESENT_ON_MAIN / STATUS_RECONCILED` |
| 012–014 | Entrada, assets visuales y fullscreen global publicados |
| 015 | Scanner interno, cámara y handoff QR interestación aprobados y publicados |

La reconciliación vinculante de GVO_DEBT_011 está en
[`GVO_DEBT_011R_ROUTE_CHUNKING_STATUS_RECONCILIATION.md`](GVO_DEBT_011R_ROUTE_CHUNKING_STATUS_RECONCILIATION.md).
Su informe `FOR_REVIEW` permanece histórico.

La aprobación vinculante de GVO_DEBT_015 está en
[`GVO_DEBT_015P_IN_APP_QR_SCANNER_HUMAN_APPROVED_AND_PUBLISHED.md`](GVO_DEBT_015P_IN_APP_QR_SCANNER_HUMAN_APPROVED_AND_PUBLISHED.md).
El cierre del repositorio y handoff está en
[`GVO_DEBT_015P_FIELD_HANDOFF_REPOSITORY_CANONICALIZATION_PUBLISHED.md`](GVO_DEBT_015P_FIELD_HANDOFF_REPOSITORY_CANONICALIZATION_PUBLISHED.md).

## Deudas abiertas exclusivamente de campo

- `FIELD TRUSTED HTTPS WITHOUT CLIENT INSTALLATION`.
- `FIELD HOSTNAME / DNS`.
- `MIKROTIK VISITOR ACCESS`.
- `QR NETWORK + APP START`.
- `PHYSICAL FIELD CAMERA CERTIFICATION` en iPhone y Android.
- `MOBILE FULLSCREEN` como certificación/limitación de plataforma.

No permanece deuda editorial `TEMP` en las transiciones canónicas.

## Límites de despliegue

- La CA creada por `npm run dev` es sólo `LAB / DEVELOPMENT QA`.
- El visitante no instala CA, certificado, PWA ni app.
- El host provisional es `gvo`; el FQDN final debe ser
  `gvo.<dominio-real-controlado-por-OKÚA>`.
- `.local` no es la solución de TLS confiable de campo.
- Ningún QR canónico contiene IP ni hostname absoluto.
- Los QR de red y `/qr/start` siguen diferidos.

## Fuentes canónicas

- [Handoff del PC de campo](../field/FIELD_PC_HANDOFF.md)
- [Arquitectura técnica](../05_ARQUITECTURA_TECNICA.md)
- [Flujo QR y estaciones](../02_FLUJO_QR_Y_ESTACIONES.md)
- [Roadmap](../ROADMAP.md)
- [Índice documental](../README.md)

Los informes `FOR_REVIEW` conservan su estado histórico. Una aprobación o
reconciliación posterior no los reescribe: prevalecen esta fuente viva y las
actas humanas publicadas.

## Lía M3 — preview de desarrollo

Ver [integración](../lia/EXTRACTIVE_PREVIEW.md) y ADR-0008. Pantalla dedicada desde el Mirador, flag desactivado por defecto, SAFE_EXTRACTIVE sin modelos. Copy/aceptación humana final pendientes. No modifica el estado de deployment/campo ni autoriza M4.

## LIA-M4 active ticket

CONCEPT_A direction approved. Experience and knowledge foundation build under review; final approval pending. CTA/title are FINAL_COPY under LIA-M4-01. Production and field are unchanged. Details: [M4 status](LIA_M4_FOUNDATION.md).

## LIA-M4-FINAL-01 authorized correction

Prior M4 terminal outcome preserved: PRs remained Draft (presence 6). The same M4 branch and PRs now implement the explicitly authorized presence/identity correction. Only the three human-approved source poses are promoted. New final human gate pending; feature default remains off. No field/production or M5 authorization. See [correction](../lia/m4/FINAL_CORRECTION.md).
