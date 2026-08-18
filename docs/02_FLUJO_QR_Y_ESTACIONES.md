# Flujo QR y estaciones

Actualizado: 2026-08-18

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

La ruta lógica `/qr/start` existe, pero su QR físico aún no se genera. También
siguen diferidos el QR Wi-Fi y cualquier QR de red. Sólo se crearán después de
cerrar MikroTik, hostname y TLS de campo.

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

## Revisita y cierre

La revisita autorizada desde Mirador omite el gate QR, no abre cámara y no
reescribe progreso. El return dock vuelve a `/final`. Mundo V completa su 4/4,
verifica progreso global y navega por la transición W5→Final sin scanner
adicional.

## Despliegue de campo

Los QR interestación son independientes de la red porque contienen tokens
relativos. El QR de inicio futuro sí depende de una dirección estable y sólo se
genera después de cerrar:

1. red MikroTik;
2. hostname/FQDN controlado por OKÚA;
3. TLS confiable sin instalación en visitantes;
4. certificación física de cámara.

La CA local de `npm run dev` es sólo laboratorio. No es parte del contrato del
visitante ni se distribuye como solución final.
