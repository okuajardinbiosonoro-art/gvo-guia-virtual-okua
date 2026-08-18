# GVO_DEBT_015 — QA físico del scanner QR integrado

Estado: `NOT_EXECUTED_ON_REAL_DEVICE`

Este documento separa la evidencia automatizada del ensayo físico. Los mocks de navegador prueban el contrato funcional, pero no certifican cámara, enfoque, iluminación, impresión ni origen seguro del despliegue de campo.

## Precondiciones

- Ejecutar `npm run dev` después de conectar el servidor a la red de prueba.
- Instalar y confiar `GVO_LOCAL_DEVELOPMENT_CA.cer` según `GVO_DEBT_015_LOCAL_HTTPS_DEVICE_SETUP.md`.
- Abrir una URL `https://<IP-ACTUAL>:5173` impresa por Vite, nunca `http://<IP-LAN>`.
- Confirmar en el dispositivo que `window.isSecureContext === true` y que `navigator.mediaDevices.getUserMedia` existe.
- Mostrar los QR desde un segundo dispositivo o imprimirlos sin recortar el quiet zone.
- Usar únicamente los cuatro archivos de `docs/assets/qr/interstation/`.
- No usar `/qr/start`, URL absoluta, IP, hostname ni QR Wi-Fi.

## Matriz manual obligatoria

| Caso                 | Procedimiento                                                            | Resultado esperado                                                               | Estado         |
| -------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------- |
| Preflight grant      | Abrir `/inicio`, elegir idioma y pulsar Iniciar                          | Solicita sólo cámara, no micrófono; concede y detiene el stream antes de Portada | `NOT_EXECUTED` |
| Preflight deny/retry | Denegar permiso y luego habilitarlo desde el navegador                   | Permanece en `/inicio`, explica la causa ES/EN y permite reintentar              | `NOT_EXECUTED` |
| W1→W2                | Completar Mundo I y escanear `gvo_qr_world1_to_world2_v01`               | Detiene cámara, verifica completion I y abre transición I→II                     | `NOT_EXECUTED` |
| W2→W3                | Completar Mundo II y escanear `gvo_qr_world2_to_world3_v01`              | Detiene cámara, verifica completion II y abre transición II→III                  | `NOT_EXECUTED` |
| W3→W4                | Completar Mundo III y escanear `gvo_qr_world3_to_world4_v01`             | Detiene cámara, verifica completion III y abre transición III→IV                 | `NOT_EXECUTED` |
| W4→W5                | Completar Mundo IV y escanear `gvo_qr_world4_to_world5_v01`              | Detiene cámara, verifica completion IV y abre transición IV→V                    | `NOT_EXECUTED` |
| QR de otra estación  | Presentar al scanner uno de los otros tres QR                            | Mensaje QR incorrecto; sin write y sin navegación                                | `NOT_EXECUTED` |
| QR desconocido/URL   | Presentar texto, URL absoluta o scheme externo                           | Mensaje no reconocido; sin ejecutar scheme, write ni navegación                  | `NOT_EXECUTED` |
| Lifecycle            | Abrir scanner y probar cerrar, ocultar pestaña, cambiar ruta y completar | Todos los tracks terminan en cada caso                                           | `NOT_EXECUTED` |
| iPhone SE 2 portrait | Repetir `/inicio` y gate de Mundo I en 375×667                           | Idioma, fullscreen, inicio, CTA QR, preview y close completos, sin corte lateral | `NOT_EXECUTED` |
| Móvil landscape      | Abrir y cerrar scanner en 667×375                                        | Preview, estados y close íntegros; scroll interno disponible si fuera necesario  | `NOT_EXECUTED` |
| Android HTTPS        | Instalar CA, abrir URL HTTPS impresa y pulsar Iniciar                    | Cámara habilitada, sin warning TLS y sin recortes del viewport                    | `NOT_EXECUTED` |
| Revisión Mirador     | Volver a Mundo I–IV desde Mirador                                        | Return dock visible, sin gate QR, sin write y sin cámara automática              | `NOT_EXECUTED` |
| W5→Final             | Completar Mundo V                                                        | Conserva el cierre existente hacia Mirador                                       | `NOT_EXECUTED` |

## Evidencia a capturar

- URL completa y protocolo del origen probado, sin registrar credenciales.
- Dispositivo, sistema operativo y versión del navegador.
- Resultado de permiso y selector de cámara trasera.
- Foto o video externo del decode de cada QR.
- Confirmación de que el indicador físico de cámara se apaga al cerrar y al completar.
- Captura de wrong QR sin cambio de ruta ni progreso.

## Estado de campo

```text
FIELD_CAMERA_SECURE_ORIGIN_CERTIFICATION = NOT_CERTIFIED
FIELD_CAMERA_SECURE_ORIGIN_NOT_CERTIFIED
```

La prueba humana previa confirmó bloqueo de cámara sobre `http://<IP-LAN>` tanto en iPhone como en Android. El ticket ahora configura HTTPS local dinámico y la prueba automatizada confirma `https:` + secure context; aun así, no se declara `field-ready` hasta repetir esta matriz en ambos dispositivos con la autoridad instalada y registrar el resultado real.
