# GVO 1.1.0 · Cierre del recorrido

José David completó el recorrido en su iPhone el 12 de noviembre de 2026.
Confirmó que el volumen quedó bien y que el cuaderno de Sala III abre al
primer toque. Con esa revisión autorizó cerrar la versión y subirla a
`main`. La selfie con Lía ya contaba con su aprobación en el iPhone.

## Cambios desde 1.0.0

- La preportada y las transiciones preparan el sonido y los recursos
  visuales de destino. En Sala III se preparan los tres capítulos del
  cuaderno, sus ilustraciones y sus animaciones antes de revelar la sala.
- La guía reproduce los 14 MP3 originales del diseñador. El efecto de
  interacción básica suena al 70 % de su nivel previo y se usa también en
  los controles de avance de Sala IV, Sala V y el Mirador. El volumen general
  se ajusta en la pantalla de idioma. La guía conserva el interruptor de
  sonido y guarda ambas preferencias por separado.
- El Mirador añade luz al sol y reflejos al río. La preferencia de
  movimiento reducido desactiva estos efectos.
  La foto con Lía usa la cámara frontal en la propia guía y ofrece dos
  poses adaptables, una opción sin Lía y un JPEG de 1080 × 1920 con el
  marco de fotografía instantánea de OKÚA. La composición ocurre en el
  dispositivo. Guardar y compartir dependen de las opciones del navegador
  y del sistema. La entrega a Instagram se realiza desde el selector del
  sistema cuando está disponible.

Los [sonidos](../decisions/ADR-0015-sonidos-del-recorrido.md), la
[foto](../decisions/ADR-0016-foto-local-con-lia.md) y el
[inventario de recursos](../assets/ASSET_INVENTORY.md) recogen los detalles
para mantener estas funciones.

## Verificación y alcance de publicación

La candidata aprobada se identificó por el SHA-256 de su índice web
`52f9d49d2670399fb76c6c828eef81c8d1fce80ba4802d587b1552559f816a58`.
Se reconstruyó 1.1.0 desde el índice de Git. El SHA-256 de su índice web
es `7f63dda44248560826c067a2f0f1ce405403fcf79557715241ea5f76ee974585`.
En esa compilación se completó el recorrido con cuatro lecturas QR en
navegador móvil simulado, se verificaron los 14 MP3 sin conexión y se
exportó la foto con Lía en tres perfiles simulados. La prueba física
corresponde al iPhone del responsable. El
[handoff de campo](../field/FIELD_PC_HANDOFF.md) conserva los requisitos de
red, TLS y comprobación en sitio.

## Reconstrucción

Usar Node.js 22, `npm ci` y `npm run build` desde un checkout de 1.1.0.
La [versión 1.0.0](GVO_1.0.0.md) sigue disponible como referencia histórica.
