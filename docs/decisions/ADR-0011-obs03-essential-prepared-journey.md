# ADR-0011 — Recorrido esencial y preparación acotada OBS03

Fecha: 2026-10-24. Estado: implementado localmente; validación final de la
candidata en curso. Revisión y aprobación del responsable humano único pendientes.

Las observaciones completas del responsable y su instrucción de ejecutar el
recorrido completo sin intervención intermedia son la autorización de este
incremento. Los intercambios con ChatGPT aportan conciliación y revisión
independiente; no constituyen aprobación humana ni autorización de publicación.
El contrato conciliado es OBS03.2. Este ADR sustituye las disposiciones
incompatibles de ADR-0010 sobre omitir presentación, salida inmediata o páginas
esenciales; conserva ese documento como antecedente.

El recorrido esencial tiene un registro separado de visitas, práctica opcional,
respuestas, aciertos y crédito global. Portada exige su presentación y conserva
el portal inicialmente bloqueado. Cada sala presenta y cierra sus bloques en
orden. Abrir una página, esperar una animación o acceder desde una revisita no
certifica lectura, comprensión ni práctica física. Los QR interestación aparecen
tras el cierre esencial o en una revisita validada desde Mirador. Sólo el QR
canónico correcto produce la transición normal I→II→III→IV→V; V→Mirador mantiene
una acción explícita de cierre.

La preparación importa el módulo y su CSS local, comprueba fuentes e imágenes
críticas y monta una sola instancia del destino, aún oculta e inactiva. Espera
la carga y decodificación de los IMG reales, verifica su identidad y dimensiones,
y mide ese mismo árbol después de dos fotogramas. La activación ocurre tras
esas pruebas y la comprobación del recibo y del progreso persistido. No hay
omisión de carga ni una segunda instancia ficticia para medir.

Cada intento dispone de un presupuesto absoluto de 15 segundos que cubre
recursos, montaje, medición y comprobaciones de escritura/activación. El fallo
termina en una recuperación manual finita; se permiten dos reintentos y volver
al origen. Un cambio de orientación durante el intento comparte el presupuesto;
la adaptación de una escena ya entregada obtiene un nuevo presupuesto sin
remontar la sala ni duplicar hechos. Ocultar la página detiene movimiento y
relojes y bloquea escrituras semánticas de intentos obsoletos.

Un validador central contrasta origen, destino, tipo, payload canónico, revisión,
prefijo secuencial y contexto de revisita. Las acciones capturan el identificador
del intento y el token de mutación antes de esperar. La prueba de persistencia
compara los bytes actuales, no sólo una caché. Una escritura de resultado
incierto se reconcilia mediante el recibo sin conceder un segundo crédito. Los
bytes inválidos se conservan y fallan de forma cerrada; reintentar no promete
reparar corrupción persistente.

La revisita es de sólo lectura respecto de los hechos adquiridos. Transporta su
contexto validado entre salas y permite regresar al Mirador. El reset conserva
preferencias y datos ajenos a su allowlist; su barrera invalida intentos antes
de ceder ejecución. Sólo se afirma que el progreso se conservó si la recuperación
ha demostrado `copySafe`. No se sobrescriben silenciosamente cambios concurrentes.

Sala IV conserva un juego de ocho piezas, 90 segundos activos, pausa y ayuda.
La resolución manual y la asistida son resultados distintos. Tras ayuda o
vencimiento, el repaso manual de ocho elementos es obligatorio antes de confirmar
el cierre. Tras éxito real se presenta el literal de Sonido y se confirma el
cierre manualmente; el repaso de ocho elementos es opcional, según R1 D12 y
`room4_game.success`. Sala V conserva cuatro preguntas,
dos alternativas nativas por pregunta, reintento/omisión y puntuación máxima
de un punto por pregunta. No concede puntos por abrir, revisar o repetir.

ES conserva la procedencia y los literales de la matriz del escritor, con
erratas/adaptaciones explícitas y separadas. EN del Mirador resuelve los mismos
35 IDs en todos sus consumidores, incluidos crédito, accesibilidad, reset y
dock. Las traducciones conciliadas quedan `REVIEW`; no heredan aprobación ni
atribución literal al escritor. Textos finales siguen en DOM/CSS.

Los nuevos assets proceden del único hilo Images autorizado. Maestros y
referencias permanecen fuera del runtime; cada derivado usado tiene registro,
espejo y hash en `current-used`. Lía conserva cinco pétalos. No se añaden audio,
micrófono, servicios externos ni controles de prueba al producto.

La compilación de revisión se aísla en `.tool-reports/obs03/candidate` y se sirve
en loopback. Los ensayos usan IDs, manifest y reportes propios, comparan el hash
servido con el compilado y conservan los fallos. Fixtures sintéticos, QR mediante
stream canvas y capturas de escritorio no se presentan como validación física
de iPhone, cámara ni despliegue de campo. `dist` anterior permanece preservado
durante esta validación. Publicación, red, TLS/DNS y despliegue siguen fuera del
incremento.

Fuentes: [observaciones e intercambios OBS03](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/),
[contrato y disposición R3](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/entry-transitions/R3_DISPOSITION.md),
[procedencia editorial R4](../narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/entry-transitions/R4_EDITORIAL_CONSOLIDATION.md).
