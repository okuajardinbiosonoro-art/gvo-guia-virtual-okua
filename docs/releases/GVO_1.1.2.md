# GVO 1.1.2 · Menos descarga al iniciar el recorrido

José David autorizó el ajuste y la publicación directa en `main` el 13 de
noviembre de 2026. La versión se basa en `b7c8a7746868fa445b6948947d0842bb5273215d`.
[Ticket](../tickets/GVO_PRECARGA_WORKBOX_20261113.md) ·
[ADR](../decisions/ADR-0017-precache-workbox-recursos-vigentes.md).

Workbox retira 28 recursos históricos del precache de instalación. Esos
archivos siguen disponibles en `dist`. La precarga conserva el shell, los
recursos de entrada vigentes, los 14 MP3 y la enredadera. La preparación por
pantalla, la presentación inicial de 12 segundos y el orden del recorrido
conservan el contrato de GVO 1.1.1.

En la comparación de desarrollo y campo, el precache pasó de 72 recursos
y 22,07 MiB a 44 recursos y 10,58 MiB, una reducción de aproximadamente 52 %.
La prueba A/B del equipo de campo con Chromium, caché fría y red simulada
midió 25.169.185 frente a 13.119.451 bytes transferidos en cuerpos de respuesta
(−47,9 %). El tiempo hasta Portada fue 17,78 frente a 17,79 s a 5 Mb/s y
15,37 frente a 15,32 s a 10 Mb/s. La prueba mostró una reducción de tráfico.
El tiempo individual hasta Portada fue comparable.

Para preparar el despliegue, actualizar `main` por avance rápido y reconstruir
con Node.js 22, `npm ci` y `npm run build`. Registrar el commit y las huellas
de la distribución de campo. Quedan pendientes las pruebas en la red MikroTik
de visitantes, con HTTPS confiable, iPhone y Android, y 20 dispositivos físicos
simultáneos. [Handoff de campo](../field/FIELD_PC_HANDOFF.md).
