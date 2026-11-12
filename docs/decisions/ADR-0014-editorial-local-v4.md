# ADR-0014 · Editor local del escritor v4

Fecha: 2026-10-29. Alcance: herramienta editorial autorizada por petición directa
del responsable; no altera la arquitectura ni el comportamiento del visitante.

El escritor necesita trabajar sobre la candidata OBS05 build02 y conservar
borradores, añadir/ocultar/mover textos y elegir estilo sin escribir CSS. La
distribución v3 permanece como antecedente y no aporta propuestas iniciales.

La nueva distribución conserva el servidor y la navegación conocidos. Usa dos
orígenes locales: editor/API en 8790, vista de la candidata en 8791. Sólo la
copia editorial recibe bootstrap, fixtures de progreso y bridge; se desactiva
su registro SW. Los 348 módulos y assets originales permanecen idénticos. Los
controles de edición nunca se incluyen en el build visitante. El host de
pantallas transitorias utiliza componentes actuales y mantiene la escena
visible para editarla; no representa tiempos ni crédito de recorrido real.

Guardar en PC confirma un lote completo mediante revisiones y recibos nuevos,
fsync, renombrado y lectura verificada. El proyecto usa revisión/digest esperado
y operación estable para rechazar guardados concurrentes y conciliar respuestas
perdidas. No se promete durabilidad ante cualquier fallo físico del disco.
El borrador de cada pestaña se guarda por separado en localStorage y se recupera
explícitamente. El estado de caché, el guardado en PC y la exportación ZIP son
distintos. La salida advierte si hay cambios pendientes, sujeto al navegador.

Los destinos se vinculan por ruta, idioma, escena, selector único, estructura y
fragmento original. Un destino incompatible se conserva como propuesta sin
aplicarlo a otro elemento. Los cuadros añadidos tienen UUID y posición relativa
a su panel. Ocultar es reversible. Se permite texto plano y una lista acotada
de estilos/fuentes locales; se rechazan recursos remotos y CSS inyectable.

El ZIP completo incluye snapshot guardado, editor y Node portátil firmado; el
ZIP pequeño contiene el contrato para la misma base/catálogo. Ambos tienen
manifiesto. Importar primero compara y sólo después aplica por confirmación.
No se incluyen cachés de navegador, historial de revisiones, credenciales ni
progreso del visitante. El modo normal escucha en loopback; el inicio opcional
RED permite edición en la misma Wi-Fi sin cámara, con las limitaciones de HTTP.

Las pruebas de esta herramienta no sustituyen la revisión humana de OBS05 ni
la certificación física de móviles. Evidencias y estado retomable:
`docs/narrative/editor_local_2026-10-29/` y
`.tool-reports/editorial-v4-20261029/`. No se autoriza publicación, despliegue,
commit/push, rama ni PR.
