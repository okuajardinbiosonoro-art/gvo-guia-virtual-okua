# GVO 1.0.0 · Base oficial del recorrido

El 12 de noviembre de 2026, José David aprobó la candidata revisada en iPhone y
autorizó registrar en `main` la base 1.0.0 de la Guía Virtual OKÚA. La etiqueta
`v1.0.0` identifica este punto de partida.

## Alcance

- Preportada, elección de idioma, Portada, salas I–V, transiciones y Mirador.
- Recorrido secuencial, escáner de los cuatro QR entre salas, persistencia,
  revisita y reinicio del recorrido.
- Material visual registrado, adaptación móvil y escritorio, dos idiomas y
  movimiento reducido. Sala V incluye el acabado aprobado de Lía, placas y
  pedestales en las preguntas, y el resultado con confeti.
- Las pistas profesionales quedan pendientes de entrega. La ampliación
  del Mirador y la foto con Lía se trabajan después de esta etiqueta.

## Verificación

- Compilación revisada en el iPhone. SHA-256 del índice
  `dc4c14eb48fb5b8b19e1de8772cde2dde11a8ad13d81b66629dbb51b6d848dcb`.
- Reconstrucción desde la exportación del índice de Git. SHA-256 del índice web
  `3d5f58dfe7df0caf7b017d6712c259920763c6cfdef2cd36a9a0585448b25bf8`.
- El recorrido de la ronda anterior pasó desde Inicio hasta el Mirador con
  cuatro lecturas QR en laboratorio. El último retoque pasó siete perfiles
  visuales de Sala V y una revisita HTTPS que conservó el progreso. La captura
  390 × 844 con movimiento reducido del resultado con confeti coincidió con la
  anterior, SHA-256 `087ec2855422334c9550b16fcefc327f04dbf9140634fa8a2036a74aa910fcb1`.
- La aceptación del responsable y el registro en Git corresponden a la base
  de producto. El [handoff de campo](../field/FIELD_PC_HANDOFF.md) gobierna la
  operación física, red, TLS y controles del despliegue.

## Reconstrucción

Con Node.js 22, instalar las dependencias con `npm ci`, comprobar el repositorio
con `npm run check` y construir con `npm run build`. El modo de visitante usa
la configuración de producción. Las reglas de assets y privacidad se aplican
también al preparar una instalación.

Los paquetes del escritor, el editor independiente y los registros internos
de producción y revisión se conservan en el archivo de desarrollo.
