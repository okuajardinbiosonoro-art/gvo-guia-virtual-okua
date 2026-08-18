# GVO — Handoff canónico al PC de campo

Fecha: 2026-08-18
Estado: `FIELD HANDOFF READY / DEPLOYMENT GATES PENDING`

## Orden de lectura

1. [`README.md`](../../README.md)
2. [`AGENTS.md`](../../AGENTS.md)
3. [`docs/field/FIELD_PC_HANDOFF.md`](FIELD_PC_HANDOFF.md)
4. [`docs/status/CURRENT_STATE.md`](../status/CURRENT_STATE.md)
5. [`docs/01_REGLAS_NO_NEGOCIABLES.md`](../01_REGLAS_NO_NEGOCIABLES.md)
6. [`docs/05_ARQUITECTURA_TECNICA.md`](../05_ARQUITECTURA_TECNICA.md)
7. [`docs/02_FLUJO_QR_Y_ESTACIONES.md`](../02_FLUJO_QR_Y_ESTACIONES.md)

No es necesario reconstruir el contexto desde tickets históricos.

## Identidad del repositorio

- Repositorio:
  `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git`.
- Rama operativa: `main`.
- Tag de entrega: `field-handoff-2026-08-18`.
- SHA canónico: el commit apuntado por ese tag y por `origin/main`.
- Política: commit/push directo a `main` sólo cuando un ticket lo autorice; no
  Pull Request ni ramas adicionales por defecto.

## Clone limpio

```powershell
git clone https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git
cd gvo-guia-virtual-okua
git checkout main
git pull --ff-only origin main
npm ci
git status --short
git rev-parse HEAD
git rev-parse origin/main
git rev-list --left-right --count HEAD...origin/main
```

Esperado: worktree limpio y divergencia `0 0`.

Validación de bootstrap:

```powershell
npm run audit:assets
npm run lint
npm test
npx tsc -b --pretty false
npm run build
node tools/qa/gvo_field_handoff_docs_audit.mjs
```

## Qué ya está cerrado

- Carga, selección de idioma, Portada y recorrido Mundos I–V.
- Mirador, revisita y reset real.
- Progreso global y checkpoints durables.
- Responsive, safe-area y shell fullscreen compartido.
- PWA/cache y route chunking.
- Preflight de cámara e integración del scanner QR interno.
- Avance exclusivo por `/qr/w2`→`/qr/w5`.
- Rechazo seguro de QR incorrectos.
- Cuatro QR físicos interestación en `docs/assets/qr/interstation/`.
- Mundo V → Mirador intacto.

No reabrir assets, narrativa, copy ni comportamiento aprobado sin un ticket
humano explícito.

## Contrato del visitante

```text
QR → navegador → experiencia
INSTALACIONES EN EL DISPOSITIVO = 0
```

El visitante no instala app, PWA, CA, certificado, extensión ni scanner. No se
debe convertir una conveniencia de QA en requisito operativo del público.

## Trabajo exclusivo del PC de campo

### 1. Inventario MikroTik

Registrar sin asumir valores:

- modelo y firmware;
- topología WAN/LAN/Wi-Fi;
- SSID y aislamiento de visitantes;
- DHCP, rangos, reservas y gateway;
- firewall y puertos necesarios;
- alcance real entre visitante y servidor GVO;
- comportamiento sin Internet y tras reconexión.

No generar QR de red mientras estos datos no estén cerrados.

### 2. Hostname y DNS

Host label provisional:

```text
gvo
```

FQDN final:

```text
gvo.<dominio-real-controlado-por-OKÚA>
```

No inventar dominio, no usar `.local` como solución de TLS pública y no hornear
IP en los QR canónicos.

### 3. TLS confiable sin instalación en visitantes

El navegador debe abrir el FQDN final por HTTPS sin advertencia y reconocerlo
como secure context usando la confianza normal del sistema. La CA generada por
`npm run dev` sirve sólo para laboratorio y QA; no es la solución final.

### 4. Certificación física de cámara

Después de cerrar red, hostname y TLS, probar al menos:

- iPhone SE de segunda generación;
- otro iPhone representativo;
- Android representativo;
- portrait y landscape;
- grant, deny, retry, apertura, decode y cierre de tracks;
- `/qr/w2`→`/qr/w5`;
- recorrido completo I→V→Mirador;
- revisita sin reapertura de cámara.

Registrar navegador, versión, URL, dispositivo y resultado. Automatización o
emulación no sustituyen esta evidencia.

### 5. QR de red e inicio

Siguen diferidos:

- QR Wi-Fi;
- QR de red;
- QR físico `/qr/start`;
- SSID/password;
- URL absoluta de inicio.

Sólo generarlos cuando MikroTik, FQDN y TLS estén cerrados. Los cuatro QR
interestación existentes no se regeneran por un cambio de red.

## Fullscreen en iPhone

La app usa la API estándar o prefijada sólo cuando la plataforma la expone y
mantiene un fallback honesto cuando no existe. La ausencia de fullscreen real
en una versión de iOS es una limitación aceptada; nunca debe bloquear cámara,
scanner ni recorrido.

## HTTPS local de desarrollo

Para QA del PC, `npm run dev` genera certificados SAN para las IPv4 activas.
El procedimiento está en
[`GVO_DEBT_015_LOCAL_HTTPS_DEVICE_SETUP.md`](../qa/GVO_DEBT_015_LOCAL_HTTPS_DEVICE_SETUP.md).
Todo `.gvo-dev-certs/` es machine-specific e ignorado. No copiar PFX, private
keys, metadata o identidad criptográfica al repositorio ni al PC de campo como
solución de producción.

## Verificación posterior a red/TLS

```powershell
npm ci
npm run build
npm run test:e2e
node tools/qa/gvo_debt_015_verify_interstation_qr.mjs
node tools/qa/gvo_field_handoff_docs_audit.mjs
```

Completar además la matriz
[`GVO_DEBT_015_IN_APP_QR_SCANNER_PHYSICAL_QA.md`](../qa/GVO_DEBT_015_IN_APP_QR_SCANNER_PHYSICAL_QA.md).

## Publicación futura

Antes de publicar una tarea de campo:

1. confirmar ticket y alcance;
2. confirmar `main`, SHA, remoto, divergencia y worktree;
3. preservar assets/copy aprobados;
4. ejecutar validaciones proporcionales;
5. actualizar `CURRENT_STATE.md` y el acta aplicable;
6. commit y push directo a `main` sólo si el ticket lo autoriza;
7. verificar el SHA remoto y dejar worktree limpio.

## Criterio de handoff suficiente

Este documento permite responder qué es GVO, cómo clonar, qué rama usar, qué
está aprobado, dónde están los QR, qué falta en campo, qué no instala el
visitante, por qué la CA local no es deployment, qué QR no generar todavía,
cuál es la fuente de estado y qué validar después de red/TLS.
