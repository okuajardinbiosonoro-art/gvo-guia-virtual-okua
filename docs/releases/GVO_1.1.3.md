# GVO 1.1.3 · Entrada al recorrido

El ajuste reduce el mínimo visible del riego inicial de 12 a 6 segundos.
Mantiene la precarga y la preparación de Portada antes de habilitar el
paso desde Inicio. Conserva el mínimo estático de 1,2 segundos cuando el
visitante usa movimiento reducido.

El fondo y las dos hojas de animación pasan a WebP sin pérdida. La
comparación de los archivos decodificados verificó igualdad RGBA en los
tres pares. Los recursos bajan de 5.486.328 a 3.247.166 bytes en conjunto.
La compilación de desarrollo conserva 44 entradas de precache y suma
8.858.017 bytes (8,45 MiB), frente a 10,58 MiB en 1.1.2. El SHA-256 de
su `dist/index.html` es
`f205db5d5c82e0c7c28dba879dd3bb2912f8a01663f19d69095eab14797a4fba`.

## Validación previa a la activación · 13 de noviembre de 2026

El equipo de campo comparó 1.1.2 con el commit exacto de 1.1.3 en Caddy
por loopback, con caché fría y 20 clientes simulados: un Chromium con
15 ms de latencia simulada y 19 clientes HTTP que reprodujeron las rutas
observadas y la lista de Workbox. Se verificaron los bytes recibidos. Pasaron
20 de 20 clientes en cada una de las tres rondas por versión y velocidad.

| Velocidad simulada | Mediana hasta Portada en 1.1.2 | Mediana hasta Portada en 1.1.3 |
| --- | ---: | ---: |
| 10 Mb/s | 15,277 s | 9,253 s (−39 %) |
| 5 Mb/s | 17,759 s | 11,095 s (−38 %) |

Los cuerpos de respuesta del navegador bajaron de 13.131.136 a 10.892.216
bytes. Campo verificó la igualdad RGBA de las tres imágenes, el riego y
el crecimiento en 6 s, el mínimo de 1,2 s con movimiento reducido, las
44 precargas y la actualización desde 1.1.2. Pasaron 732 pruebas unitarias
y siete Playwright, incluido el recorrido con cuatro lecturas QR por cámara
emulada. En dos casos de fallo se bloqueó el service worker en el entorno
de prueba para poder interceptar las peticiones.

## Activación en MOMOTTO_PC

Tras superar la prueba previa, el equipo de campo activó el commit
`b598bb1377e0debea9885503e1135aab8c05fe9b`. Verificó los 380 archivos,
seis QR y el DNS y TLS de campo. El SHA-256 del índice servido es
`f74ac34baff4a5a93b784fc4f4ba8f8f628b636034dba4c0268d3e144da86a43`.
En el HTTPS de campo pasaron 20 de 20 clientes simulados a 10 y 5 Mb/s,
con Portada a los 8,902 y 10,634 s, respectivamente. La configuración del
MikroTik se mantuvo.

La evidencia reside en MOMOTTO_PC:
`C:/GVO/ops/reports/GVO_FIELD_20261113_ENTRY_OPTIMIZATION_1.1.3.md` y
`C:/GVO/ops/temp/qa-entry-optimization`. Quedan pendientes la cámara y la
Polaroid en móviles físicos y la observación de la radio Wi-Fi con equipos
reales.

[Ticket](../tickets/GVO_ENTRADA_20261113.md) ·
[ADR](../decisions/ADR-0018-entrada-precargada.md) ·
[Handoff de campo](../field/FIELD_PC_HANDOFF.md).
