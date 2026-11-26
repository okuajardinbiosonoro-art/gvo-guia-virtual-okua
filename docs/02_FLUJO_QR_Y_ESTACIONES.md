# Flujo QR y estaciones

Actualizado el 25 de noviembre de 2026.

## Contrato del visitante

```text
QR → navegador → experiencia
INSTALACIONES EN EL DISPOSITIVO = 0
AVANCE INTERESTACIÓN POR BOTÓN = PROHIBIDO
```

El visitante usa el navegador y la cámara integrada por GVO. No instala app,
PWA, CA, certificado, extensión ni scanner externo.

## Entrada al recorrido

```text
Carga → /inicio → idioma + preflight de cámara → Portada → Mundo I
```

La ruta de entrada es `/qr/start`. El registro de campo identifica los seis QR verificados en la instalación 1.1.3. Los cuatro códigos de sala conservan sus identificadores en R2.

## Avance interestación

| Estación actual | Payload aceptado | Completion verificada | Transición |
| --- | --- | --- | --- |
| Mundo I | `/qr/w2` | Estación 1 | W1→W2 |
| Mundo II | `/qr/w3` | Estación 2 | W2→W3 |
| Mundo III | `/qr/w4` | Estación 3 | W3→W4 |
| Mundo IV | `/qr/w5` | Estación 4 | W4→W5 |

Al terminar el contenido pedagógico se muestra el CTA para abrir el scanner,
no para avanzar directamente. El scanner acepta coincidencia exacta después de
`trim()`. No interpreta URL, scheme ni contenido ejecutable.

```text
lectura válida
→ cierre de cámara y decoder
→ escritura de completion
→ relectura verificada
→ transición automática
```

Un QR de otra estación o desconocido mantiene la ruta, no concede completion y
permite seguir escaneando. Un fallo de almacenamiento bloquea la navegación y
ofrece retry sin exigir un segundo escaneo.

## QR físicos canónicos

Directorio: [`assets/qr/interstation/`](assets/qr/interstation/README.md).

```text
gvo_qr_world1_to_world2_v01.* → /qr/w2
gvo_qr_world2_to_world3_v01.* → /qr/w3
gvo_qr_world3_to_world4_v01.* → /qr/w4
gvo_qr_world4_to_world5_v01.* → /qr/w5
```

Cada QR existe en PNG y SVG, usa blanco/negro opaco, ECC H y margen de cuatro
módulos. No contiene IP, hostname ni URL absoluta.

## Mirador y regreso

Después de completar la trivia se abre la transición al Mirador. Los cuatro aciertos otorgan el premio. El pedestal de cada sala permite consultar lo visitado. Al regresar a Portada, cada portal abre una repetición interactiva que conserva el progreso de la visita original. [Decisión sobre la repetición](decisions/ADR-0019-repeticion-desde-portada.md).

## Despliegue de campo

Los tokens interestación son independientes de la red y de la edición. El acceso inicial corresponde al dominio y TLS del sitio. [Configuración y pruebas registradas](field/FIELD_PC_HANDOFF.md).
