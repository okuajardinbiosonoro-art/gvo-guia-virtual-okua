# GVO 1.1.1 · Sala IV y Polaroid

El 13 de noviembre de 2026 José David completó el recorrido y probó la
Polaroid en su iPhone. Aprobó ambos cambios y autorizó su publicación en
`main` como base para preparar el despliegue en campo.

- Sala IV presenta seis piezas en la explicación, el juego y el repaso.
  «Microcontrolador» sustituye al rótulo ESP32. Los guardados válidos
  de ocho piezas se adaptan a la cadena de seis.
- La Polaroid incorpora follaje y flores inspiradas en curubas colombianas.
  Conserva «La naturaleza también canta» y «Nature sings, too» como textos
  provisionales hasta recibir la frase final del escritor.

La revisión física se hizo por un enlace HTTPS temporal. Hubo que reintentar
la carga inicial porque los recursos tardaron más de 15 segundos por el
túnel. La configuración de esa vista de prueba queda fuera de la entrega.

La compilación de producción reconstruida desde el índice de Git tiene
SHA-256 `50f5f59e982e8fbd8215cb9b90f323833bd73de73d7290cbd74758ef41cbf1ac`
para `dist/index.html`. Incluye el recurso de la enredadera en la precarga.
Pasaron el recorrido completo con cuatro lecturas QR y la resolución manual
de Sala IV. La prueba de foto pasó en tres perfiles de navegador emulado y
verificó que la vista previa y la descarga usan el mismo JPEG.

El PC de campo debe actualizar `main` con `git pull --ff-only`, instalar
las dependencias con `npm ci` en Node.js 22 y generar la distribución con
`npm run build`. El [handoff de campo](../field/FIELD_PC_HANDOFF.md) documenta
la validación de MikroTik, DNS, HTTPS, cámara y QR en la red de sitio.
El despliegue y la certificación en sitio quedan pendientes.
