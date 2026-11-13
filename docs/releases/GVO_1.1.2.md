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
y 22,08 MiB a 44 recursos y 10,58 MiB, una reducción de aproximadamente 52 %.
La prueba A/B del equipo de campo con Chromium, caché fría y red simulada
midió 25.169.185 frente a 13.119.451 bytes transferidos en cuerpos de respuesta
(−47,9 %). El tiempo hasta Portada fue 17,78 frente a 17,79 s a 5 Mb/s y
15,37 frente a 15,32 s a 10 Mb/s. La prueba mostró una reducción de tráfico.
El tiempo individual hasta Portada fue comparable.

## Activación en MOMOTTO_PC · 13 de noviembre de 2026

El equipo de campo activó GVO 1.1.2 desde el commit
`d6c0e1d0fa37467240f31cf4412e845509be1097`. Verificó los 380 archivos
de la distribución. El SHA-256 de su `dist/index.html` es
`53796b8defbd2cbd3c7928ffb946f79dafc95cd7503dbe953988129e3ba823b9`.
La ruta `/qr/start` respondió HTTP 200 con validación HTTPS estricta. También
se verificaron el DNS del MikroTik, el SSID `OKUA-GVO`, Workbox y el kit de
seis códigos QR en doce archivos de imagen.

En MOMOTTO_PC pasaron las 732 pruebas unitarias y dos pruebas Playwright sobre
HTTPS. Estas últimas cubrieron el recorrido con cuatro lecturas QR por cámara
emulada y la resolución manual de Sala IV. La auditoría documental desde
`git archive` señaló 14 enlaces históricos cuyos destinos están fuera de ese
checkout.

José David autorizó simular la concurrencia con un Chromium de caché fría y
19 clientes HTTPS. La prueba aplicó 15 ms de latencia y límites simulados de
5 y 10 Mb/s por cliente. Portada abrió en 17,78 s y 15,34 s, respectivamente.
La transferencia agregada pasó de 465,16 a 224,11 MB (−51,8 %) y la del
navegador pasó de 25,20 a 13,14 MB (−47,8 %). El MikroTik conservó su
configuración de límites.

La activación y la prueba simulada quedaron registradas en
`C:/GVO/ops/reports/GVO_FIELD_20261113_DEPLOYMENT_AND_CAPACITY.md` en MOMOTTO_PC.
Quedan pendientes la prueba física de cámara y Polaroid en iPhone y Android
y la observación de la radio Wi-Fi con equipos reales.
[Handoff de campo](../field/FIELD_PC_HANDOFF.md).
