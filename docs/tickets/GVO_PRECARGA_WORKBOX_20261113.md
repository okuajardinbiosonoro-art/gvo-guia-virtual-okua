# GVO 1.1.2 · Precarga de Workbox

El 13 de noviembre de 2026 José David autorizó en la coordinación de campo la
implementación, validación, documentación y publicación directa a `main` de esta
mejora. La base aprobada es `b7c8a7746868fa445b6948947d0842bb5273215d`.

- Reducir la transferencia de instalación del service worker retirando de su
  precarga recursos históricos de Carga y Portada. Conservar sus archivos en
  `dist` y en el repositorio.
- Conservar la precarga de las hojas vigentes de Carga, la pose de activación,
  los 14 MP3 y la enredadera aprobada. Conservar los manifiestos de preparación
  activa, el tiempo de presentación de 12 segundos y los controles de avance.
- Medir entradas y bytes con Workbox. Validar activación del service worker,
  precache, actualización y uso de la caché después de una visita.
- Campo verificó MikroTik y HTTPS y completó la prueba autorizada con
  20 clientes simulados. La comprobación de cámara, Polaroid y radio con
  dispositivos físicos queda pendiente. [Acta](../releases/GVO_1.1.2.md).
