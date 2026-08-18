# GVO — Guía Virtual OKÚA

GVO es una aplicación web local, mobile-first e insonora que acompaña el
recorrido físico de OKÚA. Funciona en el navegador del visitante dentro de una
red de sitio y mantiene todos los recursos runtime en el propio despliegue.

## Contrato del visitante

```text
QR → navegador → experiencia
INSTALACIONES EN EL DISPOSITIVO = 0
```

El visitante no instala app, PWA, CA, certificado, extensión ni scanner
externo. El runtime no depende de Internet, CDN, APIs, fuentes o imágenes
remotas. No reproduce audio ni solicita micrófono.

## Recorrido vigente

```text
Carga
→ /inicio: idioma + preflight de cámara
→ Portada
→ Mundo I
→ scanner /qr/w2
→ Mundo II
→ scanner /qr/w3
→ Mundo III
→ scanner /qr/w4
→ Mundo IV
→ scanner /qr/w5
→ Mundo V
→ Mirador
```

El avance entre Mundos I–V ocurre exclusivamente al escanear el QR físico de
la siguiente estación dentro de GVO. Un payload incorrecto no concede progreso
ni navega. Mundo V → Mirador conserva su cierre automático contractual.

## Estado actual

- Rama operativa única: `main`.
- Fase actual: `FIELD DEPLOYMENT PREPARATION`.
- GVO_DEBT_001→015: implementados, reconciliados y publicados.
- Scanner QR interno y cámara: aprobados con deuda de despliegue físico.
- Entorno de desarrollo: HTTPS local reproducible con CA de laboratorio.
- Campo: pendientes MikroTik, hostname/DNS estable, TLS confiable sin instalar
  nada al visitante, certificación física de cámara y QR de red/inicio.

La fuente de verdad viva es
[`docs/status/CURRENT_STATE.md`](docs/status/CURRENT_STATE.md). El traspaso al
PC de campo está en
[`docs/field/FIELD_PC_HANDOFF.md`](docs/field/FIELD_PC_HANDOFF.md).

## QR físicos interestación

Los archivos imprimibles y su manifest están en
[`docs/assets/qr/interstation/`](docs/assets/qr/interstation/README.md):

| Archivo base | Payload exacto |
| --- | --- |
| `gvo_qr_world1_to_world2_v01` | `/qr/w2` |
| `gvo_qr_world2_to_world3_v01` | `/qr/w3` |
| `gvo_qr_world3_to_world4_v01` | `/qr/w4` |
| `gvo_qr_world4_to_world5_v01` | `/qr/w5` |

Cada base existe como PNG y SVG. No contienen IP, hostname, SSID, contraseña ni
URL absoluta. Los QR de red y `/qr/start` no se generan hasta cerrar la red,
el hostname y el TLS de campo.

## Instalación desde un clone limpio

Requisitos: Git, Node.js compatible con el proyecto y npm.

```powershell
git clone https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git
cd gvo-guia-virtual-okua
git checkout main
npm ci
```

Para actualizar una copia limpia de campo:

```powershell
git fetch origin
git checkout main
git pull --ff-only origin main
npm ci
```

## Comandos reales

```powershell
npm run dev
npm run build
npm run preview
npm run lint
npm test
npm run test:watch
npm run test:e2e
npm run test:e2e:evidence
npm run check
npm run status
npm run audit:assets
npm run assets:normalize:loading
npm run assets:validate:loading
npm run validate:cover-intro-assets
npm run validate:transition-root-assets
```

`npm run dev` genera o reutiliza certificados locales y sirve Vite por HTTPS
en las IPv4 activas del PC. Esa CA es `LAB / DEVELOPMENT QA ONLY`; no es una
solución de despliegue para visitantes.

## Validación

Gate técnico completo para cambios de runtime:

```powershell
npm run audit:assets
npm run lint
npm test
npx tsc -b --pretty false
npm run build
npm run test:e2e
```

Validaciones focales de la publicación QR:

```powershell
node tools/qa/gvo_debt_015_verify_interstation_qr.mjs
node tools/qa/gvo_debt_013c_verify_cover_portal_interiors.mjs
node tools/qa/gvo_debt_014_verify_global_experience.mjs
node tools/qa/gvo_field_handoff_docs_audit.mjs
```

## Documentación canónica

Orden recomendado:

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/field/FIELD_PC_HANDOFF.md`](docs/field/FIELD_PC_HANDOFF.md)
3. [`docs/status/CURRENT_STATE.md`](docs/status/CURRENT_STATE.md)
4. [`docs/01_REGLAS_NO_NEGOCIABLES.md`](docs/01_REGLAS_NO_NEGOCIABLES.md)
5. [`docs/05_ARQUITECTURA_TECNICA.md`](docs/05_ARQUITECTURA_TECNICA.md)
6. [`docs/02_FLUJO_QR_Y_ESTACIONES.md`](docs/02_FLUJO_QR_Y_ESTACIONES.md)
7. [`docs/ROADMAP.md`](docs/ROADMAP.md)

El índice corto vive en [`docs/README.md`](docs/README.md). Los documentos
`FOR_REVIEW` son evidencia histórica; las actas `HUMAN_APPROVED/PUBLISHED` y
`CURRENT_STATE.md` tienen autoridad posterior.

## Política de ramas y publicación

`main` es la única rama operativa. No se crean Pull Requests. Un ticket que
autorice publicación se valida, se commitea y se empuja directamente a `main`.
No se abre otra rama salvo instrucción explícita de un ticket humano.
