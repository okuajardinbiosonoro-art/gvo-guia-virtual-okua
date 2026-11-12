# ADR-0012 · OBS04: preparación inicial única y explicación de la mesa

Fecha: 2026-10-24. Estado: INTEGRADA / QA TÉCNICA CERRADA / REVISIÓN BILATERAL Y HUMANA PENDIENTES.

Autoridad: observaciones directas del responsable después del recorrido build12,
encargo autónomo vigente y contrato R2 conciliado con el mismo ChatGPT contextual.
El documento descargado se conserva en `revision-observaciones-04/incoming/r02/`.
No autoriza publicación definitiva, Git ni despliegue de campo.

La revisión del 12 de noviembre de 2026 aplica el mismo flujo a la apertura
directa de `/inicio`. La elección de entrada se muestra cuando han terminado
la presentación y la verificación de Portada. Al cambiar idioma o tamaño
desde esa elección se conserva la pantalla y se vuelve a comprobar Portada
según corresponda.

La primera carga debe enseñar completa su animación y preparar también la Portada.
Se conserva un único árbol real de Portada inactivo durante la entrada; la
activación reutiliza esa instancia tras verificar recursos, fuentes, imágenes y
geometría del contexto actual. La inactividad impide foco, animación y hechos
editoriales, sin publicar un segundo contexto global. La preparación de recursos
tiene un límite absoluto de15s; la presentación tiene un mínimo de12s visibles
o1,2s estáticos con movimiento reducido. El reloj visual se pausa al ocultarse;
el plazo de recursos no se reinicia. Un recurso verificado a tiempo no caduca
durante el resto de la presentación. Estos tiempos no amplían las transacciones
QR/recibo, que conservan su límite15s.

Las seis escenas de transición se muestran mientras el destino se prepara.
Su tiempo mínimo comienza en el primer frame visible acreditado (2,3s natural,
1s reducido). La escena final espera al destino sin reiniciar la coreografía;
los errores mantienen escena y recuperación visibles y no conceden crédito.

La QA compilada posterior reprodujo un rechazo al retornar al Mirador en paisaje
corto: el `picture` aún no había elegido su primer `currentSrc` al capturar el
lote y el fallback portrait se trataba como si fuese la selección ya acreditada.
La prueba conserva ahora la identidad IMG/picture y sus atributos originales;
espera load/decode y sella una sola vez la primera selección nativa. Un cambio
posterior de fuente, atributos, contexto o plazo sigue invalidándola. No se
sustituye la imagen DOM por una petición descargada ni se reinician los15s.
El RED/GREEN y la confirmación compilada se registran en
`revision-observaciones-04/entry-transitions/final-return-diagnostic/`.

En I, una altura horizontal corta comprimía la escena hasta hacer coincidir los
nodos con Más. El lector se conserva como hermano de la capa artística dentro
del mismo marco. Sólo en paisaje de altura≤550px usa dos columnas en flujo
documental: arte proporcional y lector desplazable, con acciones fuera de su
ventana enmascarada. La composición vertical y los textos se conservan. Este
ajuste no añade controles ni concede avance por desplazamiento.

Sala III conserva los tres capítulos semánticos y los textos originales. Sus
bloques se distribuyen en4+2+1 hojas legibles, sin convertir esas siete hojas en
siete requisitos nuevos. Sólo la acción explícita al final de cada capítulo lo
confirma; la consulta y la práctica opcional no equivalen a cierre.

Sala IV añade `gvo.station4.explanation.v1`, revisión `OBS04-IV-1`, independiente
del juego `gvo.station4.ordering.v1` y del contrato esencial global `OBS03.2`.
Registra presentación y confirmación ordenada de los ocho textos auténticos. El
juego se monta o recupera después del tour, conservando sus90s activos y su
resultado manual/asistido. Para un avance nuevo desde IV se requieren explicación
completa y cierre válido del juego, con resultados concordantes. Un crédito4 ya
adquirido y la revisita legítima se conservan sin fabricar explicación nueva.

El parser esencial acepta la forma de los recibos históricos coherentes sin
exigirles retrospectivamente la prueba auxiliar. Su procesamiento vivo sí exige
el contrato actual cuando el crédito4 aún no fue adquirido. Así, un pendiente
histórico no revoca otras salas ni permite saltarse el tour. La clave auxiliar
entra en la allowlist de reset, con snapshot/rollback y barrera de generación;
los bytes corruptos no se reparan silenciosamente y las escrituras tardías no
recrean datos borrados por el reset.

Validaciones y límites se registran en el paquete OBS04, separados de las
evidencias inmutables OBS03. Las pruebas de cámara canvas/ZXing no certifican un
dispositivo físico ni compatibilidad universal. Este ADR no declara aceptación
visual del responsable humano único.

La comprobación ampliada identificó dos ajustes finales acotados. En tableta
vertical, el selector histórico del título de II tenía mayor especificidad que
la reserva del dock flotante; la regla local de revisita `top-end` conserva un
espacio de8px después del dock, sin modificar los modos reservado u horizontal.
En V, un error de imagen podía seguir enclavado tras reintentar la preparación
del mismo árbol y recuperar correctamente sus imágenes. El error se limpia una
sola vez por nuevo intento ACTIVADO y autorizado, visible, de pantalla5 y con
token coincidente en el contexto runtime. El último token activado se conserva
en una referencia; un intento nuevo aún inactivo/rechazado o una reanudación del
mismo intento no borran un fallo real. No se modifica el cuestionario ni se
concede crédito por recuperar imágenes. El RED/GREEN preserva dos fallos reales
de recuperación (normal/revisita) y el control negativo del mismo intento.
