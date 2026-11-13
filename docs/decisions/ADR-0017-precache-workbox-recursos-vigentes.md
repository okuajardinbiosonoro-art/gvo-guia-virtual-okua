# ADR-0017 · Precarga de Workbox para los recursos vigentes

Aceptado para GVO 1.1.2 según el [ticket](../tickets/GVO_PRECARGA_WORKBOX_20261113.md).
Actualiza la clasificación de primer acceso de [ADR-0004](ADR-0004-pwa-precache-y-cache-runtime.md).

La instalación de Workbox descargaba ilustraciones de versiones anteriores de
Carga y Portada junto con las vigentes. Esto aumenta la transferencia cuando
varios visitantes llegan al mismo tiempo.

Conservar los archivos históricos en `dist` y excluirlos del precache de
instalación. Mantener los sprites vigentes de Carga, el marco, el fondo y la
pose de activación de Portada, los 14 MP3 y la enredadera aprobada. Los
manifiestos de preparación siguen solicitando y verificando los recursos
activos por pantalla. La caché de ejecución conserva los recursos locales
que se solicitan durante la visita.

El beneficio medido es una reducción de tráfico. La animación inicial
conserva sus 12 segundos. Una visita previa permite reutilizar recursos
cacheados y las salas aún no visitadas pueden necesitar acceso al servidor
local. La prueba con 20 visitantes simultáneos se realiza en campo.
