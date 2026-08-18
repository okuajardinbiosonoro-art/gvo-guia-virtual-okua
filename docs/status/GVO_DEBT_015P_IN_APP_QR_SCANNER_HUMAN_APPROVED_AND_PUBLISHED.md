# GVO_DEBT_015P — In-App QR Scanner Human Approved and Published

Fecha de autoridad humana: 2026-08-18
Autoridad: Ing. José David
Estado: `HUMAN_APPROVED_WITH_FIELD_DEPLOYMENT_DEBT / PUBLISHED`

```text
GVO_DEBT_015
HUMAN_APPROVED_WITH_FIELD_DEPLOYMENT_DEBT
PUBLISHED
```

## Autoridad y baseline

Este documento registra la aprobación humana posterior al informe histórico
`GVO_DEBT_015_IN_APP_QR_SCANNER_AND_INTERSTATION_HANDOFF_FOR_REVIEW.md`. Ese
informe se conserva sin reescritura retroactiva.

- Rama de publicación: `main`.
- Baseline inicial: `490ad60017511bfb7cd1b2ba082ab1ba3609593f`.
- Commit publicado de GVO_DEBT_015: `SELF`.
- Método: commit y push directo a `main`, sin Pull Request.

## Contrato humano aprobado

Quedan aprobados:

- preflight de cámara después de idioma y gesto explícito de inicio;
- scanner QR integrado en la aplicación;
- avance exclusivo por QR entre Mundo I y Mundo V;
- rechazo seguro de QR incorrectos o desconocidos, sin progreso ni navegación;
- lifecycle de cámara, cierre de tracks, reintentos y responsive compacto;
- conservación del tramo Mundo V → Mirador;
- cuatro QR físicos reproducibles y funcionales.

| Origen | Payload exacto | Destino |
| --- | --- | --- |
| Mundo I | `/qr/w2` | Mundo II |
| Mundo II | `/qr/w3` | Mundo III |
| Mundo III | `/qr/w4` | Mundo IV |
| Mundo IV | `/qr/w5` | Mundo V |

Los PNG y SVG canónicos están en `docs/assets/qr/interstation/`. Ningún QR
contiene IP, hostname, SSID, contraseña o URL absoluta. No se generan todavía
`/qr/start`, QR de red ni QR Wi-Fi.

## Contrato del visitante

```text
QR → navegador → experiencia
INSTALACIONES EN EL DISPOSITIVO = 0
```

El visitante no debe instalar aplicación, PWA, certificado, CA, extensión ni
scanner externo. La CA generada por `npm run dev` pertenece exclusivamente a
laboratorio y QA de desarrollo; no constituye la solución TLS de campo.

## Validación publicada

- Auditoría de assets: `PASS`.
- ESLint: `PASS`.
- Vitest: `45` archivos, `532/532` pruebas.
- TypeScript: `PASS`.
- Build/PWA: `PASS`.
- Verificador QR: `PASS`, cuatro SVG, cuatro PNG y ocho decodificaciones.
- Verificadores DEBT_013C y DEBT_014: `PASS`.
- E2E focal DEBT_015: `10/10`.
- E2E global: `186/186`.
- `git diff --check`: `PASS`.

## Deuda transferida al PC de campo

La aprobación funcional no certifica todavía el despliegue físico. Quedan
acotados al entorno de campo:

- HTTPS confiable sin instalación en el dispositivo visitante;
- hostname y DNS estables bajo un dominio real controlado por OKÚA;
- configuración final de la red MikroTik;
- certificación física de cámara en iPhone y Android;
- generación de QR de red e inicio después de cerrar red, hostname y TLS;
- certificación o aceptación final de las limitaciones de fullscreen en iPhone.

```text
GVO_DEBT_015_HUMAN_APPROVED_WITH_FIELD_DEPLOYMENT_DEBT
PUBLISHED
```
