# GVO 1.2.0 · Edición aprobada para segunda lectura

**25 de noviembre de 2026.** Tras probar la última composición de Sala II, José David aprobó el recorrido y autorizó su registro en `main` y la entrega al escritor. El commit de integración del producto es `b0da5945634dac5fc8c96c146fdc18cd48d30ce8`. El índice de la aplicación aprobada tiene SHA-256 `5d23d3a9c0b9e2ef8850d9002efc6dd58f5546f1467cbd6297249d92c2cd20ac`.

## Qué contiene

- Recorrido en español e inglés, desde la preparación de la entrada hasta el Mirador. Se integraron las propuestas de los dos paquetes editoriales y los cambios sonoros del diseñador. Hay 16 pistas locales.
- Guía de avance junto al primer QR, explicación de Onda medida con su acción, tres pasos de Captura junto al texto y una fila de seis capas de consulta en Sala II. El índice del cuaderno de Sala III indica qué capítulo abrir.
- Seis piezas en la mesa de Sala IV, cuatro preguntas en Sala V y foto local con Lía en el Mirador. La Polaroid permite el marco Jardín y ofrece Navidad en temporada.
- Recuperación de la preparación de salas tras una interrupción o una lectura QR ya aceptada. Las pruebas de navegador completaron el recorrido en ambos idiomas con los cuatro códigos y una cámara simulada.

## Revisión del escritor

La entrega para Windows es **GVO_1.2.0_Editor_Local_v4_2026-11-25.zip**. Su SHA-256 es `a4c1cdf22f3187e1c48b43e4f2a85cd681c370b1b143fccf20f93e470238fd76`. La copia editorial añade el panel de edición y su vista previa aislada. Las propuestas parten vacías.

1. Extraer el paquete completo en una carpeta nueva y abrir `INICIAR_GVO.cmd`.
2. Elegir la sala y el idioma, revisar la escena y guardar los cambios con **Guardar en PC**. El archivo `REVISION_EDITORIAL.md` recoge la pauta de lectura.
3. Usar **Exportar todo (.ZIP)** para devolver propuestas. Al señalar una corrección, identificar la escena, el idioma, el texto actual y el texto solicitado. Si todo está conforme, basta con comunicarlo.

## Comprobación de la entrega

La recompilación de referencia reprodujo los 395 archivos de la edición aprobada, byte por byte. Pasaron 505 pruebas unitarias en la copia de Git utilizada para el cierre. En Windows se abrió el ZIP recibido, se recorrieron las cinco salas en el editor y se comprobaron ambos marcos y los 16 MP3. Dos textos de prueba, uno por idioma, y un cuadro añadido se recuperaron al volver a abrir la exportación en otra carpeta. El paquete para el escritor conserva cero propuestas iniciales. [Registro de comprobación y huellas](Verificacion_GVO_1.2.0.json).

## Próxima decisión

El escritor puede dar conformidad o devolver observaciones. La siguiente evaluación de uso requiere visitantes que descubran el recorrido por primera vez. Se registrarán las visitas iniciadas, las llegadas al Mirador y las ayudas recibidas. El 95 % de finalización autónoma es un objetivo pendiente de medición.

La última activación documentada del PC de campo sigue siendo la de GVO 1.1.3. [Acta de campo](GVO_1.1.3.md) · [Detalle de la integración editorial](../tickets/GVO_EDITORIAL_20261122.md).
