# Arquitectura técnica

Actualizado: 2026-08-18

GVO usa Vite, React, TypeScript y React Router. Es una aplicación web
local-first, mobile-first e insonora. Todos los recursos runtime requeridos se
sirven desde el mismo origen; no hay CDN, APIs, fuentes ni imágenes remotas.

## Contrato operativo

```text
QR → navegador → experiencia
INSTALACIONES EN EL DISPOSITIVO = 0
```

El navegador móvil es el cliente. No se exige app, PWA, CA, certificado,
extensión o scanner externo al visitante.

## Módulos principales

- `src/app`: router, rutas, shell, preferencias, revisión y QR.
- `src/app/qr`: cámara, allowlist de payloads y gate scanner compartido.
- `src/domain/progress`: progreso global versionado y guards secuenciales.
- `src/domain/checkpoints`: checkpoints durables de los Mundos.
- `src/screens`: Carga, Entrada, Portada, Transiciones, Mundos I–V y Mirador.
- `src/shared/assets`: preload y contratos compartidos de assets.
- `public/assets/gvo`: assets locales de runtime y espejos `current-used`.
- `docs/assets/qr/interstation`: QR físicos documentales, no cargados en runtime.
- `tools`: generación, auditoría y verificadores reproducibles.
- `tests/e2e`: contratos integrales sobre HTTPS local.

## Rutas canónicas

| Ruta | Contrato |
| --- | --- |
| `/` | Carga inicial; entrega la entrada normal a `/inicio` |
| `/carga` | Carga aislada para revisión |
| `/inicio` | Idioma, preflight de cámara y entrada inmersiva |
| `/portada` | Archivo Vivo y Portales I–V |
| `/estacion/1`…`/estacion/5` | Mundos I–V protegidos por progreso |
| `/transition/*` | Transiciones pasivas y automáticas |
| `/final` | Mirador, revisita y reset real |
| `/qr/start` | Entrada lógica al inicio; QR físico aún no generado |
| `/qr/w2`…`/qr/w5` | Entradas QR tipadas y payloads del scanner interno |

Las rutas `/dev/*` son herramientas locales y no forman parte del recorrido del
visitante.

## Entrada, idioma y cámara

La carga normal navega a `/inicio`. El visitante elige `es` o `en`; la
preferencia `gvo.language.v1` está fuera del reset pedagógico. El botón de
inicio solicita cámara desde un gesto explícito con `audio: false` y cámara
trasera ideal. El preflight detiene el stream inmediatamente después del grant.

Denegación, dispositivo ausente, cámara ocupada, origen inseguro o API no
disponible mantienen estados distintos y nunca conceden un permiso ficticio.
Los tracks se detienen al cerrar, ocultar, desmontar, navegar o completar.

## Scanner QR interestación

`InterstationQrGate` se comparte en Mundos I–IV y se renderiza mediante portal
en `document.body`, fuera de transforms y overflow de las estaciones. Acepta
exclusivamente `/qr/w2`, `/qr/w3`, `/qr/w4` o `/qr/w5` según el Mundo actual.

```text
QR válido
→ detener decoder y tracks
→ persistir completion existente
→ verificar relectura
→ navegar a transición
```

Un QR incorrecto o desconocido no escribe progreso. Si la persistencia falla,
el retry reutiliza la lectura válida sin exigir otro escaneo. En revisita desde
Mirador el gate no se monta y no abre cámara. No hay botones de avance
interestación.

## Progreso, checkpoints y reset

`gvo.progress.v1` es la autoridad secuencial global y falla cerrado ante datos
corruptos, versiones desconocidas o storage no disponible. Los checkpoints
`gvo.station1.v1`…`gvo.station5.v1` preservan únicamente estados estables de
cada Mundo. Las escrituras críticas se verifican mediante relectura.

El reset de Mirador usa allowlist, snapshot, verificación, rollback y retry. No
borra preferencias, caches, configuración, credenciales ni datos ajenos al
recorrido.

## Rutas diferidas, PWA y cache

Carga y Portada permanecen en el bundle crítico. Transiciones, Mundos I–V y
Mirador se cargan mediante módulos de ruta diferidos. El decoder ZXing también
es lazy. Los chunks de ruta no entran al precache; el cache runtime same-origin
los conserva después de su primera solicitud.

El build excluye bibliotecas documentales y espejos `current-used` del artefacto
de deployment sin cambiar las rutas runtime. El service worker mantiene shell,
manifest, fallback de navegación y limpieza de caches obsoletos.

## HTTPS de laboratorio y deuda de campo

`npm run dev` detecta las IPv4 activas y genera un certificado servidor con SAN
dinámicos firmado por una CA local persistente. Este mecanismo es
`LAB / DEVELOPMENT QA ONLY` y permite QA de cámara en una red cambiante.

El despliegue final debe usar un hostname estable y TLS confiable para el
navegador sin instalar CA al visitante. El host provisional es `gvo`; el FQDN
final debe pertenecer a un dominio real controlado por OKÚA. No se usa `.local`
como solución TLS pública ni se hornea una IP en QR canónicos.

Decisiones relacionadas:

- [ADR-0004 — PWA/cache](decisions/ADR-0004-pwa-precache-y-cache-runtime.md)
- [ADR-0005 — Route chunking](decisions/ADR-0005-route-chunking-y-preload-controlado.md)
- [ADR-0006 — Entrada e idioma](decisions/ADR-0006-entrada-inicial-idioma-y-fullscreen.md)
- [ADR-0007 — HTTPS local y scanner](decisions/ADR-0007-https-local-dinamico-y-scanner-qr-interno.md)
