# ADR-0013 · OBS05: rondas completas de Sala V y continuidad visual

Fecha: 2026-10-24. Estado: CONTRATO HUMANO CONFIRMADO / QA Y REVISIÓN BILATERAL COMPLETAS / REVISIÓN HUMANA PENDIENTE.

Autoridad: observaciones OBS05 del responsable humano único y aclaración literal:
«Cuestionario completo: una ronda inicial y hasta tres reintentos.» El premio
requiere las cuatro respuestas correctas. Esta decisión posterior sustituye el
umbral nulo de la matriz original y la posibilidad de corregir indefinidamente
cada pregunta. No autoriza publicación, Git ni despliegue de campo.

La unidad de reintento es el cuestionario completo: hasta cuatro rondas, cada
una con las mismas cuatro preguntas en orden. Los aciertos no se suman entre
rondas. Una respuesta aceptada queda cerrada en su ronda; sólo una acción
explícita después del resultado inicia otra ronda, si quedan oportunidades.
Recargar, consultar, reactivar la pantalla o recuperar un fallo técnico no
consume una ronda. Un resultado inferior a cuatro permite continuar al Mirador
sin premio. El recorrido esencial y sus créditos no se reinician al reintentar.

El contrato técnico original R1 se recibió con 27327 bytes y SHA-256
`c56722c5e76fcd14a51fde01231cab95db2be8ed1caa480893fea98889707273`.
Su bifurcación pendiente sobre el alcance de los reintentos queda resuelta por
la aclaración humana. El delta original R2 del mismo ChatGPT contextual se
recibió con13661 bytes y SHA-256
`6cb19962522ada83a067464bac6267fec35736a0ecac640f0e2018307876b72c`,
validado estrictamente y conciliado antes de implementar ese dominio.

`gvo.station5.quiz.v2` registra hasta cuatro rondas y su historial inmutable,
con resultados ordenados, identificadores de acción y recibo explícito de cierre.
La puntuación se deriva de la ronda actual; sólo su cierre verificado con4/4
habilita la invitación a taquilla. El cuarto «Siguiente» persiste ese cierre
antes de confirmar el paso esencial y mostrar el resultado. Montar una pantalla
no cierra una ronda. Las acciones duplicadas verifican identificador, contenido
y ronda; los conflictos de bytes/revisión se rechazan. El consumidor inyecta
una guarda de activación/token/visibilidad, evitando una dependencia circular
entre el registro de respuestas y el recorrido esencial.

La fuente v1 se conserva sin cambios y se incluye como procedencia exacta de
bytes, en lugar de añadir una dependencia criptográfica para su hash opcional.
Sus aciertos históricos no demuestran una misma ronda y no conceden el nuevo
premio; tampoco revocan los derechos de recorrido ya obtenidos. Un registro v2
corrupto no recurre silenciosamente a v1 para conceder puntos o premios.

La recuperación local sólo actúa sobre bytes corruptos comprobados, después
de guardar y releer una copia exacta en `gvo.station5.quiz.recovery.v1`.
No borra un registro sano ni sobrescribe otra copia de recuperación distinta.
Compara nuevamente los bytes observados antes de respaldar y borrar, de modo
que otra escritura que ya haya recuperado el registro no sea eliminada.
La allowlist de reinicio global pasa de13 a15 claves al incluir v2 y su copia,
conservando snapshot, barrera, rollback y verificación existentes. Un reintento
de cuestionario no llama a ese reinicio ni elimina datos de las otras salas.

La selección de recursos y la UI comparten un selector local de vista de V.
La identidad de preparación sigue la vista que se representa, sin cambiar por
una mera revisión de puntuación que desactivaría su propia pregunta. Se conserva
la cuarta pregunta si el cierre local se guardó pero falta la confirmación
esencial; una ronda nueva prepara Plantas sin rebobinar el recorrido principal.
El almacenamiento local no ofrece atomicidad universal entre pestañas o equipos;
las comparaciones y la invalidación de acciones antiguas no se presentan como
una garantía distribuida.

Sala III conserva cuaderno, siete hojas, tres pasos esenciales y animaciones.
Se centra el título, se retira el rótulo independiente «conectar» y se conserva
su fuente editorial archivada; los números mantienen su columna y quedan sin
recuadros propios. En V, las cuatro dimensiones, pregunta, alternativas y
resultado comparten una composición continua, con una sola Lía protagonista
de cinco pétalos. La capitalización se corrige puntualmente sin modificar el
original del escritor ni aplicar transformaciones generales al texto.

La primera tanda de dominio verificó33 pruebas y terminó con error al arrancar
el worker de reinicio: no se declara aprobada. La siguiente tanda, con un único
worker de hilos y la corrección de recuperación, verificó51 pruebas en3 archivos
con salida0. Los detalles, fuentes y fallos se conservan en el registro OBS05.
La QA integrada posterior verificó719 pruebas/69 archivos, TypeScript y lint.
La candidata build02 conserva351 fuentes estables durante Vite/PWA y supera64
casos compilados:40 III,20 visuales V, bloqueo de respuesta, no-premio0/4 y3/4
y recorrido fresco con un reintento completo, cuatro QR de laboratorio, Mirador,
revisita y reinicio. La revisión nativa detectó y corrigió dos problemas CSS con
texto ampliado sin modificar los TS/TSX o las pruebas unitarias. La evidencia
negativa y sus causas permanecen en OBS05. El original R3 fue validado y
conciliado:18 criterios, cero bloqueantes nuevos, `READY_WITH_DECLARED_LIMITS`.
Su revisión estática/editorial/de PNG no ejecutó otra suite de producto.
La revisión humana sigue pendiente; esta decisión no declara aceptación visual
humana ni certificación física del dispositivo visitante.
