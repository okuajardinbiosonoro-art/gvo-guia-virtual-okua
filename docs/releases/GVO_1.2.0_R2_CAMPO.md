# GVO 1.2.0 R2 en el jardín

El 26 de noviembre de 2026 José David confirmó la aprobación editorial final y autorizó la instalación de R2. Campo activó en MOMOTTO_PC la compilación del commit `0d7600a6beec657097753180d3ce580e1336ef34`. Conservó la instalación 1.1.3 y una copia de la configuración anterior para reversión. Verificó los 395 archivos y el SHA-256 del índice servido por HTTPS, `6c81cf7b6b2c0469bf6345a97917ea15d63620fe274150094a5068f2ecf53f1c`.

## Los dos carteles de entrada

1. **Conéctate al Wi-Fi.** La cámara del teléfono lee los datos de acceso a la red de visitantes. Campo comprobó la asociación WPA2 y la asignación de red por DHCP con un adaptador Wi-Fi físico.
2. **Abre la guía.** Una vez conectado, el visitante escanea la URL HTTPS estable del jardín, con la ruta `/qr/start`. El DNS del MikroTik la dirige al servidor local. La cadena TLS validó con el almacén de confianza del sistema. Caddy obtiene el certificado del proveedor Tailscale del propio servidor durante la negociación HTTPS. Se comprobó la configuración activa y la cadena de confianza, válida hasta el 26 de diciembre de 2026. La renovación integrada conserva el nombre. Para seguir renovando, campo debe mantener autorizada la identidad del servidor y su conectividad administrativa. [Funcionamiento de HTTPS en Caddy](https://caddyserver.com/docs/automatic-https).

Los dos PDF vectoriales A5 y los dos PNG de imprenta se validaron decodificando las imágenes y los PDF renderizados y cotejando con las lecturas originales de campo. El archivo de entrega de gerencia se conserva con el expediente operativo. Los cuatro códigos de sala mantienen sus identificadores `/qr/w2` a `/qr/w5`.

## Pruebas sobre el servicio activo

- Un recorrido nuevo alcanzó el Mirador, leyó los cuatro QR con el decodificador de la aplicación mediante cámara simulada, decodificó los 16 audios y guardó las dos Polaroid. Los accesos directos ensayados con un perfil nuevo respetaron el orden del recorrido.
- Veinte clientes HTTPS en el equipo de campo solicitaron recursos de las salas en paralelo. Se verificaron 7.240 respuestas y 715.036.240 bytes. Hubo cero errores de respuesta o de integridad. El percentil 95 fue de 151 ms por petición y 91 ms para audios.
- Veinte contextos móviles de Chromium con caché fría en el propio PC alcanzaron Portada en 18,18–19,26 s a 10 Mb/s por cliente y 15 ms de latencia simulada, con 2.180 respuestas y cero errores. Los veinte navegadores compartían el procesador del servidor. En una prueba separada con un navegador y 19 clientes HTTP, el navegador llegó a Portada en 7,93 s y los veinte clientes completaron la carga.

## Arranque y continuidad

La tarea de audio se activa cinco segundos después del inicio de sesión y conserva su secuencia. La tarea de GVO se activa a los quince segundos de esa sesión. Un coordinador observa el intento de audio del arranque actual. Las acciones independientes de TurnFlow y GVO pueden continuar al terminar ese intento, al registrarse un fallo o al agotarse una espera de 150 s. El servicio GVO-Caddy conserva su cuenta LocalSystem y queda en inicio manual bajo control de una tarea SYSTEM. Un disparador de respaldo a los cinco minutos del encendido cubre el caso sin inicio de sesión. Las acciones reconocen las instancias activas para evitar duplicados.

El instalador administrativo registró la tarea OKUA - GVO After Audio y su XML. La tarea de TurnFlow acabó con resultado 0. En vivo se verificaron un proceso de GVO, un listener de TurnFlow y HTTPS 200 con la cadena TLS válida. Las pruebas aisladas cubrieron siete escenarios y las acciones idempotentes se ensayaron en el equipo activo. La segunda elevación para lanzar la tarea SYSTEM directamente no se completó en este corte. Queda pendiente observar un encendido físico durante una ventana de campo.

Una actualización de GVO, una renovación de certificado o un cambio de disco pueden conservar ambos carteles manteniendo el nombre y el acceso de la red, el nombre HTTPS y la ruta impresa. En una migración de servidor, campo debe actualizar la resolución local y comprobar la cadena del certificado. Si se rota la clave de invitados, corresponde sustituir el primer cartel. Si cambia la dirección de inicio sin un HTTPS válido que redirija desde la dirección impresa, corresponde sustituir el segundo. Los antecedentes de instalación y el producto aprobado se conservan en las actas anteriores. [Instalación precedente](GVO_1.1.3.md) · [Edición editorial R2](GVO_1.2.0_R2.md).

La cobertura y la congestión con veinte teléfonos físicos, el recorrido con cámara real en iPhone y Android desde el Wi-Fi del jardín y la lectura de una prueba de imprenta en su emplazamiento quedan pendientes de comprobación presencial.
